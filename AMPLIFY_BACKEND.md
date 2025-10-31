Amplify backend: dbHandler Lambda

Files added:
- amplify/backend/function/dbHandler/cloudformation-template.json  — CloudFormation template for the function. It accepts parameters for DB secret, DB cluster, VPC subnet ids and security group ids.
- amplify/backend/function/dbHandler/src/index.js  — Lambda code that supports Data API and direct TCP connections (via mysql2) using credentials in Secrets Manager.
- amplify/backend/function/dbHandler/package.json — dependencies for the function (mysql2, aws-sdk).
- amplify/backend/backend-config.json — declares the function resource for Amplify
- amplify.yml — CI build that runs `npm run build` and `npx amplify-cli@latest push --yes`

Before you deploy
1. Make sure Amplify CLI and AWS credentials are configured locally if you will run `amplify init`/`amplify push` locally.
2. You must supply the following parameters when the CloudFormation template is deployed (either via Amplify CLI prompts or by updating your environment/provider config):
   - DBSecretArn: Secrets Manager ARN containing DB credentials (username/password/host/dbname etc.)
   - DBClusterArn: (optional) required if you want to use RDS Data API (Aurora Serverless)
   - UseDataApi: 'true' to use Data API, otherwise 'false' (default)
   - SubnetIds and SecurityGroupIds: comma-separated lists for VPC access if using direct TCP connections

Notes & next steps
- If your Aurora cluster is serverless and supports the Data API, set `UseDataApi` to 'true' and provide `DBClusterArn` and `DBSecretArn`.
- If your Aurora cluster is a provisioned instance, deploy the lambda into the same VPC and provide correct SubnetIds and SecurityGroupIds that allow access to the DB.
- Amplify Console must be configured with an IAM service role that has permissions to run `amplify push` and create backend resources. If you want Amplify Console to create backend resources during CI, keep `amplify.yml` as-is. Otherwise remove the `npx amplify-cli@latest push --yes` line and run `amplify push` from your machine.

How to deploy locally (recommended first)
1. Install amplify CLI
   npm i -g @aws-amplify/cli
2. Initialize Amplify (if not done already)
   amplify init
   - When prompted, set the distribution directory to `dist` and build command to `npm run build`.
3. Add function (if you prefer to use the CLI guided flow instead of the provided cloudformation template):
   amplify add function
   # choose 'Lambda function' and configure VPC and secret access as needed.
4. Push
   amplify push

If you'd like, I can:
- Update the CloudFormation template to hardwire example SubnetIds / SecurityGroupIds (not recommended) from values you provide.
- Add a small test script that invokes the function locally against your DB (requires network/VPC access from your environment).
- Help you run `amplify init` and `amplify add function` interactively — tell me which option you prefer.
