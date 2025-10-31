/*
Lambda function that connects to an Aurora DB.
Behavior:
- If USE_DATA_API (env) is 'true', uses RDS Data API (requires DB_CLUSTER_ARN and DB_SECRET_ARN).
- Otherwise, retrieves DB credentials from Secrets Manager (DB_SECRET_ARN) and connects via mysql2 over TCP.

Before deploying:
- Ensure the function is deployed in the same VPC/subnets/security groups that can reach the DB (if not using Data API).
- Provide DB_SECRET_ARN and DB_CLUSTER_ARN (for Data API) as CloudFormation parameters or environment variables.
*/

const AWS = require('aws-sdk');
const SecretsManager = new AWS.SecretsManager();
const RDSData = new AWS.RDSDataService();

let mysql;
try { mysql = require('mysql2/promise'); } catch (e) { /* mysql2 will be available after packaging */ }

const getSecret = async (secretArn) => {
  if (!secretArn) return null;
  const out = await SecretsManager.getSecretValue({ SecretId: secretArn }).promise();
  if (out.SecretString) return JSON.parse(out.SecretString);
  return null;
};

exports.handler = async (event) => {
  const useDataApi = (process.env.USE_DATA_API || process.env.USE_DATA_API === 'true' || process.env.USE_DATA_API === 'True' || process.env.USE_DATA_API === '1') || (process.env.USE_DATA_API === 'true');

  if (useDataApi || process.env.USE_DATA_API === 'true' || process.env.USE_DATA_API === 'True') {
    // Example: Run a simple query using RDS Data API
    const clusterArn = process.env.DB_CLUSTER_ARN || process.env.DB_CLUSTER_ARN || event.DB_CLUSTER_ARN;
    const secretArn = process.env.DB_SECRET_ARN || event.DB_SECRET_ARN;
    if (!clusterArn || !secretArn) {
      return { statusCode: 500, body: 'DB_CLUSTER_ARN and DB_SECRET_ARN are required for Data API' };
    }

    const sql = 'SELECT 1 as result';
    const params = {
      resourceArn: clusterArn,
      secretArn: secretArn,
      sql: sql,
      database: event.database || process.env.DB_NAME || undefined
    };

    try {
      const res = await RDSData.executeStatement(params).promise();
      return { statusCode: 200, body: JSON.stringify(res) };
    } catch (err) {
      console.error('Data API error', err);
      return { statusCode: 500, body: JSON.stringify(err) };
    }
  } else {
    // Direct TCP approach: fetch credentials from Secrets Manager and connect via mysql2
    const secretArn = process.env.DB_SECRET_ARN || event.DB_SECRET_ARN;
    if (!secretArn) {
      return { statusCode: 500, body: 'DB_SECRET_ARN is required for direct connections' };
    }

    try {
      const creds = await getSecret(secretArn);
      if (!creds) return { statusCode: 500, body: 'Failed to retrieve DB credentials from Secrets Manager' };

      const connection = await mysql.createConnection({
        host: creds.host || process.env.DB_HOST,
        user: creds.username || creds.user || process.env.DB_USER,
        password: creds.password || process.env.DB_PASSWORD,
        database: creds.dbname || process.env.DB_NAME,
        port: creds.port ? parseInt(creds.port, 10) : (process.env.DB_PORT ? parseInt(process.env.DB_PORT,10) : 3306),
        connectTimeout: 10000
      });

      const [rows] = await connection.execute('SELECT 1 as result');
      await connection.end();
      return { statusCode: 200, body: JSON.stringify(rows) };
    } catch (err) {
      console.error('Direct DB error', err);
      return { statusCode: 500, body: JSON.stringify(err) };
    }
  }
};
