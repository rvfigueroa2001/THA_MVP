const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const srcName = 'PortalHousing.html';
const destName = 'portalhousing.html';

const srcPath = path.join(distDir, srcName);
const destPath = path.join(distDir, destName);

try {
  if (!fs.existsSync(distDir)) {
    console.error('Dist directory does not exist, skipping copy.');
    process.exit(0);
  }

  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found: ${srcPath}`);
    process.exit(0);
  }

  // Copy file (will create lowercase file on case-sensitive FS like Linux)
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${srcName} -> ${destName}`);
} catch (err) {
  console.error('Error copying portal housing file:', err);
  process.exit(1);
}
