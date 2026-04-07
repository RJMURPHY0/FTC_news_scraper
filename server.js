const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
// Serve from the dashboard/ subfolder as the web root
const ROOT = path.join(__dirname, 'dashboard');

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  // Add CORS headers so fetch() works for local JSON files
  res.setHeader('Access-Control-Allow-Origin', '*');

  let urlPath = req.url === '/' ? '/index.html' : decodeURIComponent(req.url);

  // All files served from the dashboard/ directory
  let filePath = path.join(ROOT, urlPath);

  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'text/plain';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(`404 Not Found: ${req.url}`);
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n✅ Dashboard running at: http://localhost:${PORT}\n`);
  console.log('Press Ctrl+C to stop the server.');
});
