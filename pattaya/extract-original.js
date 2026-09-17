// One-off extraction used to transcribe pattaya-dive.com (raw HTML was fetched to a scratch dir; output = src/original/*.md).
// HTML → structured markdown-ish text for content review. Tolerant, dependency-free.
const fs = require('fs'), path = require('path');
const OUT = process.argv[2] || 'md';
fs.mkdirSync(OUT, { recursive: true });
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', ndash: '–', mdash: '—', copy: '©', reg: '®', trade: '™', deg: '°', bull: '•', middot: '·' };
const decode = s => s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
  if (e[0] === '#') return String.fromCodePoint(parseInt(e[1] === 'x' || e[1] === 'X' ? e.slice(2) : e.slice(1), e[1] === 'x' || e[1] === 'X' ? 16 : 10));
  return ENT[e] ?? m;
});
const BLOCK = new Set(['p', 'div', 'section', 'article', 'header', 'footer', 'main', 'nav', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'hr', 'blockquote', 'figure', 'figcaption', 'details', 'summary', 'form', 'label', 'button', 'iframe', 'video', 'address', 'dl', 'dt', 'dd', 'pre']);
const SKIP = new Set(['script', 'style', 'noscript', 'svg', 'template', 'select', 'option']);
const attr = (tag, n) => { const m = tag.match(new RegExp('\\s' + n + '\\s*=\\s*("([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i')); return m ? decode(m[2] ?? m[3] ?? m[4] ?? '') : null; };

function extract(html) {
  html = html.replace(/<!--[\s\S]*?-->/g, '');
  const title = (html.match(/<title>([^<]*)/) || [])[1] || '';
  const desc = attr((html.match(/<meta[^>]*name="description"[^>]*>/) || [''])[0], 'content');
  const ogImg = attr((html.match(/<meta[^>]*property="og:image"[^>]*>/) || [''])[0], 'content');
  const canonical = attr((html.match(/<link[^>]*rel="canonical"[^>]*>/) || [''])[0], 'href');
  // content region
  let start = html.search(/<div[^>]*data-elementor-type="(wp-page|wp-post|landing-page)"/);
  if (start < 0) start = html.indexOf('</header>');
  let body = html.slice(start < 0 ? 0 : start);
  const fEnd = body.search(/<footer|<div[^>]*data-elementor-type="footer"|data-elementor-type="jkit-footer"|<div[^>]*class="[^"]*jkit-footer/);
  if (fEnd > 0) body = body.slice(0, fEnd);

  const out = []; let line = '';
  const flush = () => { const t = line.replace(/\s+/g, ' ').trim(); if (t) out.push(t); line = ''; };
  const stack = []; let skip = 0; let listDepth = 0; let href = null; let linkText = ''; let dropText = false;
  const re = /<\/?([a-zA-Z][a-zA-Z0-9-]*)([^>]*)>|([^<]+)/g; let m;
  while ((m = re.exec(body))) {
    if (m[3] !== undefined) { if (dropText) { dropText = false; continue; } if (!skip) { const t = decode(m[3]); if (href !== null) linkText += t; else line += t; } continue; }
    const raw = m[0], tag = m[1].toLowerCase(), closing = raw[1] === '/';
    if (SKIP.has(tag)) { if (!closing) skip++; else if (skip) skip--; continue; }
    if (skip) continue;
    const a = m[2];
    if (!closing) {
      const style = attr(raw, 'style'), ds = attr(raw, 'data-settings');
      const bg = style && style.match(/background-image\s*:\s*url\(['"]?([^'")]+)/); if (bg) { flush(); out.push(`[bg: ${bg[1]}]`); }
      if (ds && /background_image|background_slideshow_gallery|_background_image/.test(ds)) { for (const u of ds.matchAll(/"url":"([^"]+)"/g)) { flush(); out.push(`[bg: ${u[1].replace(/\\//g, '/')}]`); } }
      if (tag === 'img') { const src = attr(raw, 'data-src') || attr(raw, 'src') || ''; if (src && !src.startsWith('data:')) { const alt = attr(raw, 'alt') || ''; const s = `![${alt}](${src})`; if (href !== null) linkText += s; else { flush(); out.push(s); } } continue; }
      if (tag === 'iframe') { flush(); out.push(`[iframe: ${attr(raw, 'src') || attr(raw, 'data-src') || ''}]`); continue; }
      if (tag === 'br') { if (href !== null) linkText += ' '; else flush(); continue; }
      if (tag === 'hr') { flush(); out.push('---'); continue; }
      if (tag === 'a') { const h = attr(raw, 'href'); if (h && h !== '#' && !h.startsWith('javascript')) { href = h; linkText = ''; } continue; }
      if (tag === 'input') { const v = attr(raw, 'placeholder') || attr(raw, 'value'); const ty = attr(raw, 'type'); if (v && ty !== 'hidden' && ty !== 'checkbox') { flush(); out.push(`[input ${ty || 'text'}: ${v}]`); } continue; }
      if (tag === 'textarea') { const v = attr(raw, 'placeholder'); if (v) { flush(); out.push(`[textarea: ${v}]`); } }
      const ctr = attr(raw, 'data-to-value'); if (ctr) { line += ctr; dropText = true; }
      if (BLOCK.has(tag)) {
        flush();
        if (/^h[1-6]$/.test(tag)) line = '#'.repeat(+tag[1]) + ' ';
        else if (tag === 'li') line = '  '.repeat(Math.max(0, listDepth - 1)) + '- ';
        else if (tag === 'ul' || tag === 'ol') listDepth++;
        else if (tag === 'blockquote') line = '> ';
        else if (tag === 'summary') line = '▸ ';
        else if (tag === 'th' || tag === 'td') line = '| ';
      }
      stack.push(tag);
    } else {
      if (tag === 'a' && href !== null) { const t = linkText.replace(/\s+/g, ' ').trim(); line += t ? `[${t}](${href})` : `[→](${href})`; href = null; linkText = ''; continue; }
      if (tag === 'ul' || tag === 'ol') listDepth = Math.max(0, listDepth - 1);
      if (BLOCK.has(tag)) flush();
    }
  }
  flush();
  // de-dup consecutive identical lines & collapse
  const lines = out.filter((l, i) => l !== out[i - 1]);
  return { title, desc, ogImg, canonical, lines };
}

const files = fs.readdirSync('html').filter(f => f.endsWith('.html'));
const index = [];
for (const f of files) {
  const slug = f.replace(/\.html$/, '');
  const r = extract(fs.readFileSync(path.join('html', f), 'utf8'));
  const md = `<!-- source: ${r.canonical} -->\n<!-- title: ${r.title} -->\n<!-- description: ${r.desc} -->\n<!-- og:image: ${r.ogImg} -->\n\n${r.lines.join('\n')}\n`;
  fs.writeFileSync(path.join(OUT, decodeURIComponent(slug) + '.md'), md);
  index.push([slug, r.title, r.lines.length, r.lines.join(' ').length]);
}
console.table(index.sort((a, b) => b[3] - a[3]));
