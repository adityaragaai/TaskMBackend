const path = require('path');
const fs = require('fs');

const candidates = [
  path.join(__dirname, 'src', 'dist', 'server.js'),
  path.join(__dirname, 'dist', 'server.js'),
];

const serverPath = candidates.find((p) => fs.existsSync(p));

if (!serverPath) {
  console.error('Build output not found. Tried:');
  candidates.forEach((p) => console.error(`  - ${p}`));
  console.error('Run: npm install --include=dev && npm run build');
  process.exit(1);
}

require(serverPath);
