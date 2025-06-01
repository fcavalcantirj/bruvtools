const http = require('http');
const PORT = process.env.PORT || 80;

const server = http.createServer((req, res) => {
  // Add security headers for HTTPS
  const headers = {
    'Content-Type': 'text/plain',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'"
  };
  
  res.writeHead(200, headers);
  res.end('Hello, World!');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
