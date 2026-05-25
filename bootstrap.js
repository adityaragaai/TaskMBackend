const path = require('path');
const fs = require('fs');

const serverPath = path.join(__dirname, 'dist', 'server.js');

if (!fs.existsSync(serverPath)) {
  console.error(`Build output not found: ${serverPath}`);
  console.error('Run: npm install --include=dev && npm run build');
  process.exit(1);
}

require(serverPath);
