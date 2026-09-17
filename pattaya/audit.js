// Pre-launch audit over dist/: SEO metadata, structure, a11y basics, redirects, sitemap, weights.
const fs = require('fs'), path = require('path');
const dist = path.join(__dirname, 'dist');
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : f === 'index.html' && pages.push(p); } })(dist);
const issues = [];
const titles = new Map(), descs = new Map();
let anchorsChecked = 0;
for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  const rel = '/' + path.relative(dist, path.dirname(p)).replace(/\\/g, '/').replace(/^\.$/, '') ;
  const url = rel === '/' ? '/' : rel + '/';
  const t = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const d = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  if (!t) issues.push(['no-title', url]);
  if (t.length > 65) issues.push(['title-long', url, t.length]);
  if (!d) issues.push(['no-desc', url]);
  else if (d.length > 165) issues.push(['desc-long', url, d.length]);
  else if (d.length < 70) issues.push(['desc-short', url, d.length]);
  titles.set(t, (titles.get(t) || []).concat(url));
  descs.set(d, (descs.get(d) || []).concat(url));
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) issues.push(['h1-count', url, h1s]);
  if (!/<link rel="canonical"/.test(html)) issues.push(['no-canonical', url]);
  const hl = (html.match(/hreflang="/g) || []).length;
  if (hl < 2) issues.push(['hreflang-missing', url, hl]);
  const imgsNoAlt = (html.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
  if (imgsNoAlt) issues.push(['img-no-alt', url, imgsNoAlt]);
  const ldBlocks = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g) || [];
  for (const b of ldBlocks) { try { JSON.parse(b.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, '')); } catch (e) { issues.push(['jsonld-invalid', url]); } }
  // external links without noopener
  for (const m of html.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)) { if (/target="_blank"/.test(m[0]) && !/rel="[^"]*noopener/.test(m[0])) issues.push(['ext-no-noopener', url, m[0].slice(0, 80)]); }
  // same-page anchors
  for (const m of html.matchAll(/href="(?:[^"#]*)#([a-zA-Z][\w-]*)"/g)) { anchorsChecked++; if (!new RegExp(`id="${m[1]}"`).test(html)) { /* cross-page anchor: check target page */ const href = m[0].match(/href="([^"#]*)#/)[1]; if (href && href !== url) { const tp = path.join(dist, href, 'index.html'); if (fs.existsSync(tp) && !new RegExp(`id="${m[1]}"`).test(fs.readFileSync(tp, 'utf8'))) issues.push(['anchor-missing', url, m[0]]); } else issues.push(['anchor-missing', url, m[0]]); } }
  if (/TODO|lorem|placeholder text|XXX/i.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) issues.push(['todo-text', url]);
  const size = Buffer.byteLength(html);
  if (size > 120000) issues.push(['html-heavy', url, size]);
}
for (const [t, urls] of titles) if (urls.length > 1) issues.push(['dup-title', urls.join(' '), t.slice(0, 50)]);
for (const [d, urls] of descs) if (urls.length > 1 && d) issues.push(['dup-desc', urls.join(' ')]);
// sitemap vs pages
const sm = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8');
const smUrls = new Set([...sm.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map(m => m[1]));
for (const p of pages) { const u = '/' + path.relative(dist, path.dirname(p)).replace(/\\/g, '/'); const url = (u === '/.' || u === '/') ? '/' : u + '/'; if (!smUrls.has(url) && !/404/.test(url)) issues.push(['not-in-sitemap', url]); }
for (const u of smUrls) if (!fs.existsSync(path.join(dist, u, 'index.html'))) issues.push(['sitemap-404', u]);
// redirects
const rd = fs.readFileSync(path.join(dist, '_redirects'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#'));
for (const l of rd) { const [from, to, code] = l.trim().split(/\s+/); if (!fs.existsSync(path.join(dist, to, 'index.html')) && to !== '/') issues.push(['redirect-target-missing', from, to]); if (from === to) issues.push(['redirect-loop', from]); }
// assets
const css = fs.statSync(path.join(dist, 'assets', 'site.css')).size, js = fs.statSync(path.join(dist, 'assets', 'site.js')).size;
const imgDir = path.join(dist, 'img'); const imgTotal = fs.readdirSync(imgDir).reduce((a, f) => a + fs.statSync(path.join(imgDir, f)).size, 0);
console.log(`pages ${pages.length} · css ${(css / 1024).toFixed(1)} KB · js ${(js / 1024).toFixed(1)} KB · img dir ${(imgTotal / 1048576).toFixed(1)} MB · redirects ${rd.length} · anchors checked ${anchorsChecked}`);
const byType = {};
for (const i of issues) (byType[i[0]] = byType[i[0]] || []).push(i.slice(1).join(' | '));
for (const [k, v] of Object.entries(byType)) { console.log(`\n${k} (${v.length})`); v.slice(0, 8).forEach(x => console.log('  ' + x)); if (v.length > 8) console.log('  …'); }
if (!issues.length) console.log('no issues');
