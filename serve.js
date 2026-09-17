// Local preview of a built project: node serve.js [project] [port]  → http://127.0.0.1:8765
const http = require('http'), fs = require('fs'), path = require('path');
const project = process.argv[2] || 'kohkood', port = +(process.argv[3] || 8765);
const root = path.join(__dirname, project, 'dist');
const types = { html: 'text/html; charset=utf-8', css: 'text/css', js: 'text/javascript', json: 'application/json', webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', xml: 'application/xml', txt: 'text/plain', ico: 'image/x-icon' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(root, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) {
    res.statusCode = 404;
    // assets get a plain 404 (never the 404 page as CSS/JS); pages get 404.html if the build has one
    if (/\.(css|js|png|jpe?g|webp|svg|ico|xml|json|txt)$/i.test(p) || !fs.existsSync(path.join(root, '404.html'))) { res.setHeader('Content-Type', 'text/plain'); return res.end('404 ' + p); }
    f = path.join(root, '404.html');
  }
  const ext = f.split('.').pop();
  res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
  res.setHeader('Cache-Control', 'no-store');
  fs.createReadStream(f).on('error', () => { res.statusCode = 500; res.end(); }).pipe(res);
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
