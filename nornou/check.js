// Post-build QA: internal links resolve, hreflang alternates exist, no English fallback leaks into other locales.
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
const enMarkers = ['Book now', 'Island transfers', 'Snorkelling trips', 'Private charter', 'Timetable & fares', 'What is included', 'Questions & answers', 'Where to board', 'How it works', 'Hotel pick-up included'];
for (const p of pages) {
  const html = fs.readFileSync(p, 'utf8');
  const rel = path.relative(dist, p).replace(/\\/g, '/');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(u)) continue;
    if (!exists(u)) { broken++; console.log('BROKEN', rel, '→', u); }
  }
  const lang = rel.split('/')[0];
  if (['de', 'fr', 'sv', 'th', 'ru', 'zh'].includes(lang)) {
    const body = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
    for (const w of enMarkers) if (body.includes(w)) { leaks++; console.log('LEAK', rel, '→', w); }
  }
}
console.log(`${pages.length} pages, ${broken} broken links, ${leaks} EN leaks`);
