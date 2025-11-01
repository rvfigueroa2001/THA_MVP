const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const srcName = 'PortalHousing.html';
const destNames = ['portalhousing.html', 'index.html'];

const srcPath = path.join(distDir, srcName);

try {
  if (!fs.existsSync(distDir)) {
    console.error('Dist directory does not exist, skipping copy.');
    process.exit(0);
  }

  if (!fs.existsSync(srcPath)) {
    console.error(`Source file not found: ${srcPath}`);
    process.exit(0);
  }

  destNames.forEach(destName => {
    const destPath = path.join(distDir, destName);
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} -> ${destName}`);
  });
} catch (err) {
  console.error('Error copying portal housing file:', err);
  process.exit(1);
}
