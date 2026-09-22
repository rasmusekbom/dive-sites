// Post-build QA: internal links resolve and no Swedish base text leaks into the English pages.
const fs = require('fs'), path = require('path');
const dist = path.join(__dirname, 'dist');
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : f.endsWith('.html') && pages.push(p); } })(dist);

const exists = (url) => {
  url = url.split('#')[0].split('?')[0];
  if (!url.startsWith('/')) return true;
  const p = path.join(dist, url);
  return fs.existsSync(p) || fs.existsSync(path.join(p, 'index.html'));
};

let broken = 0, leaks = 0;
const svMarkers = ['Boka kurs', 'Pris på förfrågan', 'Det här ingår', 'Frågor och svar', 'Öppettider', 'Kontakta oss', 'Läs mer', 'Alla kurser'];
for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  const rel = path.relative(dist, p).split(path.sep).join('/');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(u)) continue;
    if (!exists(u)) { broken++; console.log('BROKEN', rel, '→', u); }
  }
  if (rel.split('/')[0] === 'en') {
    const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    for (const w of svMarkers) if (body.includes(w)) { leaks++; console.log('LEAK', rel, '→', w); }
  }
}
console.log(`${pages.length} pages, ${broken} broken links, ${leaks} SV leaks`);
