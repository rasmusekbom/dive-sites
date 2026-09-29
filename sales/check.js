// Post-build QA: every internal link resolves, every page has one h1, a title and a description,
// and every screenshot the page references exists.
const fs = require('fs'), path = require('path');
const dist = path.join(__dirname, 'dist');
const BASE = (process.env.BASE || '').replace(/\/$/, '');
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : f.endsWith('.html') && pages.push(p); } })(dist);

const exists = u => {
  u = u.split('#')[0].split('?')[0];
  if (!u.startsWith('/')) return true;
  const p = path.join(dist, u.slice(BASE.length));
  return fs.existsSync(p) || fs.existsSync(path.join(p, 'index.html'));
};

let problems = 0;
const bad = (...m) => { problems++; console.log(...m); };
for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  const rel = path.relative(dist, p).split(path.sep).join('/');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(u)) continue;
    if (!exists(u)) bad('BROKEN', rel, '→', u);
  }
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) bad('H1', rel, h1);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) bad('TITLE', rel);
  const d = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (d.length < 50 || d.length > 160) bad('DESC', rel, d.length);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
  const dup = ids.filter((x, i) => ids.indexOf(x) !== i);
  if (dup.length) bad('DUP-ID', rel, dup.join(','));
}
console.log(`${pages.length} pages, ${problems} problems`);
process.exitCode = problems ? 1 : 0;
