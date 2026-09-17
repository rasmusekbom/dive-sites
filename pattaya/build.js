// Static site generator for Thai Ocean Academy Pattaya (pattaya-dive.com). No dependencies.
//   npm run build   → build-images.js (responsive webp/jpg into .cache/img) + build.js → dist/
//   BASE=/dive-sites/pattaya DEMO=1 npm run build   → GitHub Pages demo (sub-path + noindex)
const fs = require('fs');
const path = require('path');
const { site, languages, stats, groups, products, hubs, priceList, team, locations, boats, categories, redirects } = require('./src/data.js');
const IMG = fs.existsSync(path.join(__dirname, 'src', 'img-manifest.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'img-manifest.json'), 'utf8')) : {};
const ogJpg = file => IMG[file] ? file.replace(/\.[^.]+$/, '') + '-' + IMG[file].fallback + '.jpg' : file;

// DIST=<dir> writes elsewhere (deploy/publish.sh builds the demos outside dist/ so a local preview keeps working)
const OUT = process.env.DIST ? path.resolve(process.env.DIST) : path.join(__dirname, 'dist');
const BASE = (process.env.BASE || '').replace(/\/$/, '');
const DEMO = !!process.env.DEMO;
const P = Object.fromEntries(products.map(p => [p.slug, p]));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const trunc = (s, n = 155) => s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
const thb = n => typeof n === 'number' ? n.toLocaleString('en-US') : n;
const css = fs.readFileSync(path.join(__dirname, 'src', 'site.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'src', 'site.js'), 'utf8');

// ---------------------------------------------------------------- LOCALES (deep-merged over English)
const deepMerge = (base, over) => {
  if (Array.isArray(over) || typeof over !== 'object' || over === null) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = deepMerge(base ? base[k] : undefined, over[k]);
  return out;
};
const EN = require('./src/i18n/en.js');
const locales = Object.fromEntries(languages.map(l => {
  const f = path.join(__dirname, 'src', 'i18n', l.code + '.js');
  return [l.code, l.code === 'en' ? EN : deepMerge(EN, fs.existsSync(f) ? require(f) : {})];
}));

// ---------------------------------------------------------------- BLOG (markdown with front matter)
const posts = fs.readdirSync(path.join(__dirname, 'src', 'blog')).filter(f => f.endsWith('.md')).map(f => {
  const raw = fs.readFileSync(path.join(__dirname, 'src', 'blog', f), 'utf8').replace(/\r\n/g, '\n');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = {};
  for (const line of m[1].split('\n')) { const i = line.indexOf(':'); if (i > 0) { let v = line.slice(i + 1).trim(); if (/^".*"$/.test(v)) v = v.slice(1, -1); meta[line.slice(0, i).trim()] = v; } }
  meta.tags = meta.tags ? meta.tags.split(',').map(s => s.trim()) : [];
  return { slug: f.replace(/\.md$/, ''), ...meta, body: m[2].trim() };
}).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));

// ---------------------------------------------------------------- ICONS
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.2ZM9.7 15.1V8.9l6 3.1-6 3.1Z"/></svg>',
  tt: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  chev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.6 7 .8-5.2 4.9 1.4 7.1L12 18l-6.2 3.4 1.4-7.1L2 9.4l7-.8L12 2Z"/></svg>',
  g: '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.6H2.1v2.9A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14a6.6 6.6 0 0 1 0-4.2V6.9H2.1a11 11 0 0 0 0 9.9L5.8 14Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 6.9L5.8 9.8c.9-2.7 3.3-4.4 6.2-4.4Z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
  depth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 3v14m0 0-4-4m4 4 4-4M4 21h16"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/></svg>',
  tank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6V3h6v3M7 8h10v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
};

// ---------------------------------------------------------------- MARKDOWN (small, for blog posts and rich text)
function inline(s, linkResolver) {
  return esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, h) => { const href = linkResolver(h); const ext = /^https?:/.test(href); return `<a href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`; });
}
function markdown(md, { linkResolver, imgResolver }) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = []; let para = []; let list = null;
  const flushP = () => { if (para.length) { out.push(`<p>${inline(para.join(' '), linkResolver)}</p>`); para = []; } };
  const flushL = () => { if (list) { out.push(`<${list.tag}>${list.items.map(i => `<li>${inline(i, linkResolver)}</li>`).join('')}</${list.tag}>`); list = null; } };
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim()) { flushP(); flushL(); continue; }
    let m;
    if ((m = l.match(/^(#{1,6})\s+(.*)$/))) { flushP(); flushL(); const n = Math.min(6, m[1].length + 0); out.push(`<h${n}>${inline(m[2], linkResolver)}</h${n}>`); continue; }
    if ((m = l.match(/^!\[([^\]]*)\]\(([^)]+)\)(\{small\})?$/))) { flushP(); flushL(); let cap = ''; if (lines[i + 1] && /^_.*_$/.test(lines[i + 1].trim())) { cap = `<figcaption>${inline(lines[i + 1].trim().slice(1, -1), linkResolver)}</figcaption>`; i++; } out.push(`<figure class="${m[3] ? 'fig-small' : 'fig'}">${imgResolver(m[2], m[1])}${cap}</figure>`); continue; }
    if ((m = l.match(/^[-*]\s+(.*)$/))) { flushP(); if (!list || list.tag !== 'ul') { flushL(); list = { tag: 'ul', items: [] }; } list.items.push(m[1]); continue; }
    if ((m = l.match(/^\d+[.)]\s+(.*)$/))) { flushP(); if (!list || list.tag !== 'ol') { flushL(); list = { tag: 'ol', items: [] }; } list.items.push(m[1]); continue; }
    flushL(); para.push(l.trim());
  }
  flushP(); flushL();
  return out.join('\n');
}

// ---------------------------------------------------------------- PER-LANGUAGE CONTEXT
function ctx(lang) {
  const L = locales[lang.code];
  const ui = L.ui, PG = L.pages, PT = L.products;
  const prefix = BASE + (lang.path ? `/${lang.path}` : '');
  // page keys: 'home' | hub/page key in ui.slugs | product slug | 'post:<slug>' | 'cat:<slug>'
  const pathOf = (code, key) => {
    const l = languages.find(x => x.code === code), loc = locales[code], pre = BASE + (l.path ? `/${l.path}` : '');
    if (key === 'home') return `${pre}/`;
    if (key.startsWith('post:')) return `${pre}/${loc.ui.slugs.blog}/${key.slice(5)}/`;
    if (key.startsWith('cat:')) return `${pre}/${loc.ui.slugs.blog}/category/${key.slice(4)}/`;
    if (loc.ui.slugs[key]) return `${pre}/${loc.ui.slugs[key]}/`;
    const p = P[key];
    if (p) { const hub = { trips: '', rec: 'courses', pro: 'professional', tech: 'technical', marine: 'marine' }[p.group]; return `${pre}/${hub ? loc.ui.slugs[hub] + '/' : ''}${key}/`; }
    throw new Error('unknown page key ' + key);
  };
  const url = key => pathOf(lang.code, key);
  const urlIn = (code, key) => pathOf(code, key);
  const abs = key => site.domain + url(key).slice(BASE.length);
  const text = p => PT[p.slug];
  const hubOf = p => ({ trips: 'dayTrips', rec: 'courses', pro: 'professional', tech: 'technical', marine: 'marine' })[p.group];
  // links inside copy: [label](product-slug | page-key | partner-key | https://…)
  const resolve = h => {
    if (/^https?:|^mailto:|^tel:|^#/.test(h)) return h;
    if (h.startsWith('product:')) return url(h.slice(8));
    if (h.startsWith('page:')) return url(h.slice(5));
    if (site.partners[h]) return site.partners[h];
    try { return url(h); } catch (e) { return h; }
  };
  const rich = s => inline(s, resolve);
  const richP = s => s.split(/\n\n+/).map(t => `<p>${rich(t)}</p>`).join('');

  const price = (p, cls = '') => {
    if (text(p).priceText) return `<span class="price ${cls}">${text(p).priceText}</span>`;
    if (p.price == null) return `<span class="price ${cls}">${ui.enquire}</span>`;
    const pre = p.from ? `<small>${ui.from}</small> ` : '';
    const range = p.priceMax ? `${thb(p.price)}–${thb(p.priceMax)}` : thb(p.price);
    return `<span class="price ${cls}">${pre}<b>${range}</b> <i>${ui.thb}</i>${p.perUnit ? ` <small>${ui.perSpecialty}</small>` : ''}</span>`;
  };
  const money = n => typeof n === 'number' ? `<b>${thb(n)}</b> <i>${ui.thb}</i>` : esc(n);
  const dur = p => p.days ? `${p.days} ${p.days === 1 ? ui.day : ui.days}` : '';
  // Responsive <img>
  const img = (file, alt, extra = '', sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 480px', eager = false) => {
    const m = IMG[file];
    if (!m) return `<img src="${BASE}/img/${file}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} ${extra}>`;
    const name = file.replace(/\.[^.]+$/, '');
    const srcset = m.widths.map(w => `${BASE}/img/${name}-${w}.webp ${w}w`).join(', ');
    return `<img src="${BASE}/img/${name}-${m.fallback}.jpg" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} ${extra}>`;
  };
  const heroImg = (file, alt) => img(file, alt, '', '100vw', true);

  // ---------- navigation model
  const navDiving = groups.map(g => ({ g, hub: { trips: 'dayTrips', rec: 'courses', pro: 'professional', tech: 'technical', marine: 'marine' }[g], items: products.filter(p => p.group === g || p.alsoIn === g) }));
  const bookUrl = (p) => url('book') + (p ? `?program=${encodeURIComponent(text(p).name)}` : '');

  // ---------- layout
  function layout({ key, title, desc, body, jsonld = [], ogImage, cls = '', bodyLang }) {
    const canonical = abs(key);
    const alternates = languages.length > 1 ? languages.map(l => `<link rel="alternate" hreflang="${l.code}" href="${site.domain}${urlIn(l.code, key).slice(BASE.length)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${site.domain}${urlIn('en', key).slice(BASE.length)}">` : `<link rel="alternate" hreflang="en" href="${canonical}">\n<link rel="alternate" hreflang="x-default" href="${canonical}">`;
    const ld = [orgLd(), ...jsonld].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
    const mega = `<div class="mega"><div class="wrap mega-grid">${navDiving.map(({ g, hub, items }) => `<div class="mega-col"><a class="mega-head" href="${url(hub)}">${ui.groups[g]}${I.arrow}</a>${items.map(p => `<a href="${url(p.slug)}"${p.slug === key ? ' aria-current="page"' : ''}>${g === 'tech' && p.slug === 'sidemount' ? text(p).navTech : text(p).nav}</a>`).join('')}</div>`).join('')}<a class="mega-all" href="${url('diving')}">${ui.nav.allDiving}${I.arrow}</a></div></div>`;
    const aboutSub = `<div class="navsub"><a href="${url('about')}">${ui.nav.about}</a><a href="${url('team')}">${ui.nav.team}</a><a href="${url('locations')}">${ui.nav.locations}</a><a href="${url('boats')}">${ui.nav.boats}</a></div>`;
    const inDiving = products.some(p => p.slug === key) || ['diving', 'dayTrips', 'courses', 'professional', 'technical', 'marine'].includes(key);
    const inAbout = ['about', 'team', 'locations', 'boats'].includes(key);
    return `<!DOCTYPE html>
<html lang="${bodyLang || L.ui.htmlLang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">${DEMO ? '\n<meta name="robots" content="noindex, nofollow">' : ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${alternates}
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="${L.ui.htmlLang}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.domain}/img/${ogJpg(ogImage || site.ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#071e3d">
<link rel="icon" href="${BASE}/img/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="${BASE}/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;600;700;800&family=Manrope:wght@400;500;600;700&family=Noto+Sans+Thai:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/site.css">
${ld}
</head>
<body class="${cls}" data-lang="${lang.code}">
<a class="skip" href="#main">${ui.skip}</a>
<header class="top" id="top">
  <div class="topbar"><div class="wrap"><span>${I.clock}${site.hours}</span><a href="tel:${site.phone.replace(/\s+/g, '')}">${I.phone}${site.phone}</a><a href="mailto:${site.email}">${I.mail}${site.email}</a><span class="topbar-social"><a href="${site.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a><a href="${site.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a><a href="${site.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.yt}</a><a href="${site.social.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${I.tt}</a></span></div></div>
  <nav class="nav" aria-label="Main"><div class="wrap">
    <a class="brand" href="${url('home')}" aria-label="${esc(site.name)}"><img src="${BASE}/img/logo-white.png" alt="${esc(site.name)}" width="150" height="48"><span class="brand-loc">Pattaya</span></a>
    <ul class="nav-links">
      <li class="has-mega${inDiving ? ' on' : ''}"><a href="${url('diving')}">${ui.nav.diving}</a><button class="sub-toggle" aria-expanded="false" aria-label="${ui.nav.diving}">${I.chev}</button>${mega}</li>
      <li><a href="${url('pricing')}"${key === 'pricing' ? ' aria-current="page"' : ''}>${ui.nav.pricing}</a></li>
      <li class="has-sub${inAbout ? ' on' : ''}"><a href="${url('about')}">${ui.nav.about}</a><button class="sub-toggle" aria-expanded="false" aria-label="${ui.nav.about}">${I.chev}</button>${aboutSub}</li>
      <li><a href="${url('blog')}"${key === 'blog' || key.startsWith('post:') || key.startsWith('cat:') ? ' aria-current="page"' : ''}>${ui.nav.blog}</a></li>
      <li><a href="${url('contact')}"${key === 'contact' ? ' aria-current="page"' : ''}>${ui.nav.contact}</a></li>
    </ul>
    <div class="nav-cta">
      <a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a>
      <button class="burger" aria-label="${ui.menu}" aria-controls="mm" aria-expanded="false">${I.menu}</button>
    </div>
  </div></nav>
</header>
<div class="mobile-menu" id="mm" hidden>
  <div class="mm-head"><span>${ui.menu}</span><button class="close" aria-label="${ui.close}">×</button></div>
  <details><summary>${ui.nav.diving}${I.chev}</summary><div class="mm-sub">${navDiving.map(({ g, hub, items }) => `<b><a href="${url(hub)}">${ui.groups[g]}</a></b>${items.map(p => `<a href="${url(p.slug)}">${g === 'tech' && p.slug === 'sidemount' ? text(p).navTech : text(p).nav}</a>`).join('')}`).join('')}<a class="mm-all" href="${url('diving')}">${ui.nav.allDiving}</a></div></details>
  <a href="${url('pricing')}">${ui.nav.pricing}</a>
  <details><summary>${ui.nav.about}${I.chev}</summary><div class="mm-sub"><a href="${url('about')}">${ui.nav.about}</a><a href="${url('team')}">${ui.nav.team}</a><a href="${url('locations')}">${ui.nav.locations}</a><a href="${url('boats')}">${ui.nav.boats}</a></div></details>
  <a href="${url('blog')}">${ui.nav.blog}</a>
  <a href="${url('contact')}">${ui.nav.contact}</a>
  <div class="mm-actions"><a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a><a class="btn btn-ghost" href="tel:${site.phone.replace(/\s+/g, '')}">${I.phone}${site.phone}</a></div>
</div>
<main id="main">${body}</main>
${footer(key)}
<script src="${BASE}/assets/site.js" defer></script>
</body>
</html>`;
  }

  function footer(key) {
    const links = arr => arr.map(([l, k]) => `<li><a href="${url(k)}">${l}</a></li>`).join('');
    return `<footer><div class="wrap">
  <div class="foot">
    <div class="foot-brand">
      <img src="${BASE}/img/logo-white.png" alt="${esc(site.name)}" width="180" height="57" loading="lazy">
      <p>${ui.footTagline}</p>
      <div class="socials"><a href="${site.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a><a href="${site.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a><a href="${site.social.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${I.yt}</a><a href="${site.social.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">${I.tt}</a></div>
    </div>
    <div><h4>${ui.footDiving}</h4><ul>${links([[ui.nav.dayTrips, 'dayTrips'], [text(P['try-dive']).name, 'try-dive'], [text(P['fun-diving']).name, 'fun-diving'], [text(P['snorkelling']).name, 'snorkelling'], [ui.nav.pricing, 'pricing']])}</ul></div>
    <div><h4>${ui.footCourses}</h4><ul>${links([[ui.nav.courses, 'courses'], [text(P['open-water-20']).name, 'open-water-20'], [text(P['explorer-30']).name, 'explorer-30'], [text(P['advanced-35']).name, 'advanced-35'], [text(P['master-rescue']).name, 'master-rescue'], [text(P['nitrox']).name, 'nitrox']])}</ul></div>
    <div><h4>${ui.footPro}</h4><ul>${links([[ui.nav.professional, 'professional'], [text(P['divemaster']).name, 'divemaster'], [text(P['instructor-training']).name, 'instructor-training'], [ui.nav.technical, 'technical'], [ui.nav.marine, 'marine']])}</ul></div>
    <div><h4>${ui.footInfo}</h4><ul>${links([[ui.nav.about, 'about'], [ui.nav.team, 'team'], [ui.nav.locations, 'locations'], [ui.nav.boats, 'boats'], [ui.nav.blog, 'blog'], [ui.nav.contact, 'contact'], [ui.nav.book, 'book'], [ui.nav.terms, 'terms']])}</ul></div>
    <div><h4>${ui.footLocations}</h4><ul class="foot-loc">
      <li><b>Pattaya</b><a href="${site.maps}" target="_blank" rel="noopener">${site.address}</a><a href="tel:${site.phone.replace(/\s+/g, '')}">${site.phone}</a></li>
      <li><b>Bangkok</b><a href="${site.partners.equipmentStore}" target="_blank" rel="noopener">${locations[0].address}</a></li>
      <li><b>Koh Chang</b><a href="${site.partners.kohChang}" target="_blank" rel="noopener">${locations[2].address}</a></li></ul></div>
  </div>
  <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${site.legalName} · ${site.name}</span><span>${ui.footPreview}</span></div>
</div></footer>`;
  }

  // ---------- JSON-LD
  function orgLd() {
    return {
      '@context': 'https://schema.org', '@type': ['LocalBusiness', 'SportsActivityLocation'], '@id': site.domain + '/#business',
      name: site.name, url: site.domain, telephone: site.phone, email: site.email, image: site.domain + '/img/' + ogJpg(site.ogImage), logo: site.domain + '/img/apple-touch-icon.png',
      address: { '@type': 'PostalAddress', streetAddress: 'Thappraya Road', addressLocality: 'Pattaya', addressRegion: 'Chon Buri', addressCountry: 'TH' },
      geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      openingHours: 'Mo-Su 08:00-20:00', priceRange: '฿฿',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: site.rating, reviewCount: site.reviewCount },
      sameAs: Object.values(site.social),
    };
  }
  const productLd = p => !p.price ? [] : [{
    '@context': 'https://schema.org', '@type': 'Product', name: text(p).name, description: text(p).short, image: site.domain + '/img/' + ogJpg(p.img), url: abs(p.slug),
    brand: { '@type': 'Brand', name: p.agency || 'RAID' },
    offers: { '@type': 'Offer', price: p.price, priceCurrency: 'THB', availability: 'https://schema.org/InStock', url: abs(p.slug), seller: { '@id': site.domain + '/#business' } },
  }];
  const faqLd = keys => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: keys.map(k => ({ '@type': 'Question', name: PG.faq[k][0], acceptedAnswer: { '@type': 'Answer', text: PG.faq[k][1].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') } })) });
  const crumbsLd = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, k], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(k) })) });
  const postLd = post => ({ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, datePublished: post.date, image: site.domain + '/img/' + ogJpg(post.image), author: { '@type': 'Organization', name: post.author || site.name }, publisher: { '@id': site.domain + '/#business' }, url: abs('post:' + post.slug), description: post.excerpt });

  // ---------- partials
  const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb"><a href="${url('home')}">${ui.breadcrumbHome}</a>${items.map(([n, k], i) => `<i>/</i>${i === items.length - 1 ? `<span>${n}</span>` : `<a href="${url(k)}">${n}</a>`}`).join('')}</nav>`;
  const badges = p => {
    const b = [];
    if (p.level) b.push(`<span class="badge">${I.user}${ui.level[p.level]}</span>`);
    if (p.days) b.push(`<span class="badge">${I.cal}${dur(p)}</span>`);
    if (p.depth) b.push(`<span class="badge badge-depth">${I.depth}${ui.depth.replace('{n}', p.depth)}</span>`);
    if (p.dives) b.push(`<span class="badge">${I.tank}${p.dives} ${ui.dives}</span>`);
    if (p.agency) b.push(`<span class="badge">${p.agency}</span>`);
    return b.join('');
  };
  const productCard = (p, i = 0, opts = {}) => {
    const t = text(p);
    return `<a class="pcard rv" href="${url(p.slug)}" style="--d:${i * .06}s">
    <span class="pimg">${img(p.img, t.name)}${p.depth ? `<span class="depth-tag">${p.depth} m</span>` : ''}</span>
    <span class="pbody"><span class="pmeta"><span class="lvl lvl-${p.level}">${ui.levelShort[p.level]}</span>${p.days ? `<span>${dur(p)}</span>` : ''}</span>
    <strong>${opts.title || t.cardTitle || t.name}</strong><span class="pdesc">${opts.short || t.short}</span>
    <span class="pfoot">${opts.price || (t.cardPrice ? `<span class="price"><b>${thb(t.cardPrice)}</b> <i>${ui.thb}</i></span>` : price(p))}<span class="more">${ui.readMore}${I.arrow}</span></span></span></a>`;
  };
  const cardGrid = (list, cls = 'grid-3') => `<div class="grid ${cls}">${list.map((p, i) => productCard(p, i)).join('')}</div>`;
  const statsBar = () => `<section class="stats"><div class="wrap stats-grid">${stats.map(([n, s, k]) => `<div class="stat rv"><b><span class="count" data-n="${n}">${n}</span>${s}</b><span>${PG.stats[k]}</span></div>`).join('')}</div></section>`;
  const quote = key => { const [q, who, ctxt] = PG.testimonials[key]; return `<figure class="quote rv"><blockquote>“${q}”</blockquote><figcaption><b>${who}</b><span>${ctxt}</span></figcaption></figure>`; };
  const faqBlock = (keys, title = ui.sections.faq) => `<section class="faq-sec" id="faq"><div class="wrap narrow"><h2 class="rv">${title}</h2><div class="faq rv">${keys.map((k, i) => `<details${i === 0 ? ' open' : ''}><summary>${PG.faq[k][0]}</summary><div>${richP(PG.faq[k][1])}</div></details>`).join('')}</div></div></section>`;
  const contactCard = (loc = null) => {
    const c = loc || { address: site.address, phone: site.phone, email: site.email, hours: site.hours, maps: site.maps };
    return `<ul class="clist">
      <li>${I.pin}<a href="${c.maps}" target="_blank" rel="noopener">${c.address}</a></li>
      <li>${I.phone}<a href="tel:${c.phone.replace(/\s+/g, '')}">${c.phone}</a></li>
      <li>${I.mail}<a href="mailto:${c.email}">${c.email}</a></li>
      <li>${I.clock}<span>${c.hours}</span></li></ul>`;
  };
  const ctaBand = (title, textStr, p = null) => `<section class="cta-band rv"><div class="wrap"><div><h2>${title}</h2><p>${textStr}</p></div><div class="cta-actions"><a class="btn btn-primary btn-lg" href="${bookUrl(p)}">${ui.bookNowBang}</a><a class="btn btn-ghost btn-lg" href="tel:${site.phone.replace(/\s+/g, '')}">${I.phone}${site.phone}</a></div></div></section>`;
  const pageHero = ({ imgFile, alt, crumbItems, kicker, h1, lead = '', extra = '', cls = '' }) => `<header class="page-hero ${cls}">${heroImg(imgFile, alt || '')}
    <div class="wrap">${crumbs(crumbItems)}${kicker ? `<span class="kicker">${kicker}</span>` : ''}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div></header>`;
  const related = (list, title = ui.sections.related) => list.length ? `<section class="soft"><div class="wrap"><h2 class="rv">${title}</h2>${cardGrid(list.slice(0, 3))}</div></section>` : '';
  // depth ladder: products with certification depth, drawn as a gauge
  const depthLadder = (list, cls = '') => {
    const withDepth = list.filter(p => p.depth).sort((a, b) => a.depth - b.depth);
    const max = 60;
    return `<div class="ladder ${cls} rv" role="list">${withDepth.map(p => `<a role="listitem" href="${url(p.slug)}" style="--pct:${(p.depth / max * 100).toFixed(1)}%"><span class="lm">${p.depth} m</span><span class="ln">${text(p).name}</span></a>`).join('')}<span class="lz" aria-hidden="true">0 m</span></div>`;
  };
  // rich blocks used in overview/logistics (string paragraph or {h, p[], ul[], after[], links[]})
  const blocks = arr => arr.map(b => {
    if (typeof b === 'string') return `<p>${rich(b)}</p>`;
    let h = '';
    if (b.h) h += `<h4>${rich(b.h)}</h4>`;
    if (b.p) h += b.p.map(t => `<p>${rich(t)}</p>`).join('');
    if (b.ul) h += `<ul class="ticks">${b.ul.map(t => `<li>${rich(t)}</li>`).join('')}</ul>`;
    if (b.links) h += `<ul class="ticks">${b.links.map(([slug, label, note]) => `<li><a href="${url(slug)}">${label}</a> — ${note}</li>`).join('')}</ul>`;
    if (b.after) h += b.after.map(t => `<p>${rich(t)}</p>`).join('');
    return h;
  }).join('');

  // ---------- pages
  function homePage() {
    const H = PG.home;
    const featured = ['try-dive', 'open-water-20', 'fun-diving'].map(s => P[s]);
    const latest = posts.slice(0, 3);
    const body = `
<header class="hero" id="hero">${heroImg(hubs.diving.img, 'Scuba diver inside a school of barracuda in Pattaya')}
  <div class="wrap">
    <span class="kicker">${H.kicker}</span>
    <h1>${H.h1}</h1>
    <p class="lead">${H.intro}</p>
    <div class="hero-actions"><a class="btn btn-primary btn-lg" href="${url('book')}">${ui.bookNow}</a><a class="btn btn-ghost btn-lg" href="${url('diving')}">${ui.nav.allDiving}${I.arrow}</a></div>
    <a class="gbadge" href="${site.maps}" target="_blank" rel="noopener">${I.g}<b>${site.rating.toFixed(1)}</b><span class="stars" aria-hidden="true">${I.star.repeat(5)}</span><span>${site.reviewCount} ${H.reviews}</span></a>
  </div>
  <ul class="pillars wrap" aria-label="What we do">${H.pillars.map((t, i) => `<li><a href="${url(['courses', 'dayTrips', 'marine', 'contact'][i])}">${t}</a></li>`).join('')}</ul>
</header>
<section id="paths"><div class="wrap">
  <div class="grid grid-3 paths">${H.paths.map(([k, t, d], i) => `<a class="path rv" href="${url(k)}" style="--d:${i * .06}s"><span class="n">0${i + 1}</span><strong>${t}</strong><span>${d}</span><i>${I.arrow}</i></a>`).join('')}</div>
</div></section>
${statsBar()}
<section class="soft"><div class="wrap">
  <div class="section-head rv"><h2>${ui.groups.trips} & ${ui.groups.rec}</h2><a class="link" href="${url('diving')}">${ui.nav.allDiving}${I.arrow}</a></div>
  ${cardGrid(featured)}
</div></section>
<section class="split"><div class="wrap split-grid">
  <div class="split-img rv">${img('divers-togethr.jpg', 'Divers together on the boat', '', '(max-width: 900px) 100vw, 50vw')}</div>
  <div class="split-text rv"><span class="eyebrow">${ui.nav.about}</span><h2>${H.whyTitle}</h2><p>${H.whyText}</p><p><em>${PG.about.motto1} ${PG.about.motto2}</em></p><a class="btn btn-dark" href="${url('about')}">${ui.readMore}${I.arrow}</a></div>
</div></section>
<section class="split alt"><div class="wrap split-grid">
  <div class="split-text rv"><span class="eyebrow">${ui.nav.boats}</span><h2>${H.boatsTitle}</h2><p>${H.boatsText}</p><a class="btn btn-dark" href="${url('boats')}">${PG.boats.names.grace} & ${PG.boats.names.princess}${I.arrow}</a></div>
  <div class="split-img rv">${img('toco-dive-boat.jpg', 'Thai Ocean Academy dive boat', '', '(max-width: 900px) 100vw, 50vw')}</div>
</div></section>
<section class="dark marine-band"><div class="wrap split-grid">
  <div class="split-img rv">${img('working-with-the-thai-dmcr.jpg', 'Working with the Thai DMCR', '', '(max-width: 900px) 100vw, 50vw')}</div>
  <div class="split-text rv"><span class="eyebrow">${ui.groups.marine}</span><h2>${H.marineTitle}</h2><p>${H.marineText}</p><a class="btn btn-primary" href="${url('marine')}">${ui.nav.marine}${I.arrow}</a></div>
</div></section>
<section><div class="wrap">
  <div class="section-head rv"><div><h2>${H.blogTitle}</h2><p class="sub">${H.blogText}</p></div><a class="link" href="${url('blog')}">${PG.blog.seeAll}${I.arrow}</a></div>
  <div class="grid grid-3">${latest.map((p, i) => postCard(p, i)).join('')}</div>
</div></section>
<section class="soft" id="contact"><div class="wrap contact-grid">
  <div class="rv"><h2>${H.contactInfo}</h2>${contactCard()}<h3>${H.stayConnected}</h3><p>${H.stayConnectedText}</p><div class="socials dark-links"><a href="${site.social.facebook}" target="_blank" rel="noopener">${I.fb}Facebook</a><a href="${site.social.instagram}" target="_blank" rel="noopener">${I.ig}Instagram</a><a href="${site.social.youtube}" target="_blank" rel="noopener">${I.yt}YouTube</a><a href="${site.social.tiktok}" target="_blank" rel="noopener">${I.tt}TikTok</a></div><a class="btn btn-primary" href="${url('book')}">${H.contactNow}</a></div>
  <div class="map rv"><iframe src="${site.mapsEmbed}" loading="lazy" title="${ui.mapTitle}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
</div></section>`;
    return layout({ key: 'home', title: H.title, desc: H.desc, body, cls: 'home' });
  }

  function divingPage() {
    const D = PG.diving;
    const sec = (g, list) => `<section class="grp" id="${g}"><div class="wrap"><div class="section-head rv"><h2>${D.sections[g]}</h2><a class="link" href="${url({ trips: 'dayTrips', rec: 'courses', pro: 'professional', tech: 'technical', marine: 'marine' }[g])}">${ui.groups[g]}${I.arrow}</a></div>${cardGrid(list)}</div></section>`;
    const trips = [P['try-dive'], P['fun-diving'], P['snorkelling']];
    const rec = products.filter(p => p.group === 'rec');
    const pro = products.filter(p => p.group === 'pro');
    const tech = [P['sidemount'], ...products.filter(p => p.group === 'tech')];
    const marine = products.filter(p => p.group === 'marine');
    const body = pageHero({ imgFile: 'batfish-school-with-divers.jpg', alt: 'Divers with a school of batfish in Pattaya', crumbItems: [[ui.nav.diving, 'diving']], kicker: D.kicker, h1: D.h1, lead: D.intro,
      extra: `<nav class="jump" aria-label="${ui.jump}">${groups.map(g => `<a href="#${g}">${ui.groups[g]}</a>`).join('')}</nav>` }) +
      sec('trips', trips) + sec('rec', rec) +
      `<section class="dark"><div class="wrap"><div class="section-head rv"><h2>${PG.technical.depthTitle}</h2><p class="sub">${PG.technical.depthText}</p></div>${depthLadder(products)}</div></section>` +
      sec('pro', pro) + sec('tech', tech) + sec('marine', marine) +
      ctaBand(PG.home.contactNow, PG.home.intro);
    return layout({ key: 'diving', title: D.title, desc: D.desc, body, jsonld: [crumbsLd([[ui.nav.diving, 'diving']])], ogImage: 'batfish-school-with-divers.jpg' });
  }

  // Generic hub page (day trips / courses / professional / technical / marine)
  function hubPage(key) {
    const H = PG[key], hub = hubs[key];
    const list = products.filter(p => p.group === hub.group || p.alsoIn === hub.group);
    const linkList = (title, links) => `<div class="linklist rv"><h3>${title}</h3><ul>${links.map(([slug, label]) => slug ? `<li><a href="${url(slug)}">${label}${I.arrow}</a></li>` : `<li><span>${label}</span></li>`).join('')}</ul></div>`;
    let intro = '';
    if (key === 'dayTrips') intro = `${H.intro.map(t => `<p>${rich(t)}</p>`).join('')}<div class="two">${linkList(H.newTitle, H.newLinks)}${linkList(H.certTitle, H.certLinks)}</div>`;
    if (key === 'courses') intro = `${H.intro.map(t => `<p>${rich(t)}</p>`).join('')}<div class="two">${linkList(H.newTitle, H.newLinks)}${linkList(H.certTitle, H.certLinks)}</div><p>${rich(H.intro2)}</p>`;
    if (key === 'professional') intro = `${H.intro.map(t => `<p>${rich(t)}</p>`).join('')}${linkList(ui.nav.professional, H.links)}`;
    if (key === 'technical') intro = `<p>${rich(H.intro1)}</p><p>${rich(H.intro2)}</p>${linkList(ui.nav.technical, H.links)}`;
    if (key === 'marine') intro = `${H.intro.map(t => `<p>${rich(t)}</p>`).join('')}${linkList(ui.nav.marine, H.links)}`;
    const ladder = key === 'courses' ? `<section class="dark"><div class="wrap"><div class="section-head rv"><h2>${H.ladder.beginner} → ${H.ladder.advanced} → ${H.ladder.next}</h2><p class="sub">${PG.technical.depthText}</p></div>${depthLadder(list)}</div></section>`
      : key === 'technical' ? `<section class="dark"><div class="wrap"><div class="section-head rv"><h2>${PG.technical.depthTitle}</h2><p class="sub">${PG.technical.depthText}</p></div>${depthLadder(list)}</div></section>` : '';
    const body = pageHero({ imgFile: hub.img, alt: H.h1, crumbItems: [[ui.nav.diving, 'diving'], [ui.groups[hub.group], key]], kicker: H.kicker, h1: H.h1 }) +
      `<section class="intro-sec"><div class="wrap intro-grid"><div class="intro-text rv"><h2>${H.h2}</h2>${intro}<a class="btn btn-primary btn-lg" href="${url('book')}">${ui.bookNowBang}</a></div><aside class="intro-aside rv">${hub.testimonial ? quote(hub.testimonial) : ''}${(hub.imgs || []).map(f => `<div class="aside-img">${img(f, H.h1)}</div>`).join('')}</aside></div></section>` +
      `<section class="soft" id="list"><div class="wrap"><h2 class="rv">${ui.groups[hub.group]}</h2>${cardGrid(list)}</div></section>` +
      ladder + (key !== 'marine' ? statsBar() : '') + (H.faq ? faqBlock(H.faq) : '') + ctaBand(ui.bookNowBang, PG.book.kicker);
    return layout({ key, title: H.title, desc: H.desc, body, jsonld: [crumbsLd([[ui.nav.diving, 'diving'], [ui.groups[hub.group], key]]), ...(H.faq ? [faqLd(H.faq)] : [])], ogImage: hub.img });
  }

  function productPage(p) {
    const t = text(p), hubKey = hubOf(p);
    const crumbItems = [[ui.nav.diving, 'diving'], [ui.groups[p.group], hubKey], [t.name, p.slug]];
    const upgrades = p.upgrades ? `<div class="upgrades">${p.upgrades.map(([slug, pr, save, note], i) => {
      const label = slug ? `${t.name} + <a href="${url(slug)}">${text(P[slug]).name}</a>` : (t.upgradeLabels || [])[i] || t.name;
      return `<div class="upg"><span>${label}</span><b>${thb(pr)} ${ui.thb}</b>${save ? `<em>${ui.save.replace('{n}', thb(save))}</em>` : ''}${note ? `<small>${note}</small>` : ''}</div>`;
    }).join('')}</div>` : '';
    const upgradesText = t.upgradesText ? `<div class="upgrades">${t.upgradesText.map(([a, b, c]) => `<div class="upg"><span>${a}</span>${b ? `<small>${b}</small>` : ''}<b>${c}</b></div>`).join('')}</div>` : '';
    const options = t.options ? `<section class="pblock" id="options"><h2>${t.optionsTitle || ui.sections.options}</h2><div class="upgrades">${t.options.map(([a, pr]) => `<div class="upg"><span>${a}</span><b>${thb(pr)} ${ui.thb}</b></div>`).join('')}</div></section>` : '';
    const prereq = t.prerequisites ? `<section class="pblock"><h2>${ui.sections.prerequisites}</h2><ul class="ticks">${t.prerequisites.map(x => `<li>${rich(x)}</li>`).join('')}</ul></section>` : t.prerequisitesRich ? `<section class="pblock"><h2>${ui.sections.prerequisites}</h2>${blocks(t.prerequisitesRich)}</section>` : '';
    const isTrip = p.type === 'trip';
    const main = `
      ${t.lead ? `<p class="lead-in">${t.lead}</p>` : ''}
      ${(t.intro || []).map(x => `<p class="intro-p">${rich(x)}</p>`).join('')}
      ${t.bullets ? `<ul class="ticks big">${t.bullets.map(x => `<li>${rich(x)}</li>`).join('')}</ul>` : ''}
      ${p.neverExpires ? `<p class="note-line">${I.check}${ui.neverExpires}</p>` : ''}
      ${t.overview ? `<section class="pblock" id="overview"><h2>${ui.sections.overview}</h2>${blocks(t.overview)}</section>` : ''}
      ${t.logistics ? `<section class="pblock" id="logistics"><h2>${ui.sections.logistics}</h2>${blocks(t.logistics)}</section>` : ''}
      ${options}
      ${prereq}
      ${t.includes ? `<section class="pblock"><h2>${ui.sections.includes}</h2><ul class="ticks">${t.includes.map(x => `<li>${rich(x)}</li>`).join('')}</ul></section>` : ''}
      ${(upgrades || upgradesText || t.upgradesNote) ? `<section class="pblock" id="upgrades"><h2>${ui.sections.upgrades}</h2>${upgrades}${upgradesText}${t.upgradesNote ? `<p>${rich(t.upgradesNote)}</p>` : ''}</section>` : ''}`;
    const aside = `<aside class="pside rv"><div class="pside-card">
      <span class="pside-title">${t.boxTitle || t.name}</span>
      ${price(p, 'big')}
      <ul class="facts">${p.days ? `<li>${I.cal}<span>${ui.duration}</span><b>${dur(p)}</b></li>` : ''}${p.depth ? `<li>${I.depth}<span>${ui.maxDepth}</span><b>${p.depth} m</b></li>` : ''}${p.dives ? `<li>${I.tank}<span>${ui.dives}</span><b>${p.dives}</b></li>` : ''}<li>${I.user}<span>${ui.levelShort[p.level]}</span><b>${ui.level[p.level]}</b></li>${p.agency ? `<li><span>${ui.agency}</span><b>${p.agency}</b></li>` : ''}</ul>
      <a class="btn btn-primary btn-lg" href="${bookUrl(p)}">${ui.bookNowBang}</a>
      <a class="btn btn-ghost-dark" href="tel:${site.phone.replace(/\s+/g, '')}">${I.phone}${site.phone}</a>
      <a class="btn btn-ghost-dark" href="mailto:${site.email}?subject=${encodeURIComponent(t.name)}">${I.mail}${ui.emailUs}</a>
      ${!isTrip && p.group !== 'marine' ? `<p class="pside-note">${ui.meetTime}</p>` : ''}
    </div>${p.testimonial ? quote(p.testimonial) : ''}${p.img2 ? `<div class="aside-img">${img(p.img2, t.name)}</div>` : ''}</aside>`;
    const others = products.filter(x => (x.group === p.group || x.alsoIn === p.group) && x.slug !== p.slug);
    const body = pageHero({ imgFile: p.img, alt: t.name, crumbItems, kicker: t.kicker, h1: t.h1 || t.name, extra: `<div class="badges">${badges(p)}</div>`, cls: 'product-hero' }) +
      `<section class="product"><div class="wrap product-grid"><div class="pmain rv">${isTrip ? `<h2 class="h-lead">${t.h2}</h2>` : ''}${main}</div>${aside}</div></section>` +
      (isTrip ? statsBar() : '') + (p.faq ? faqBlock(p.faq) : '') + related(others) + ctaBand(t.name, t.short, p);
    return layout({ key: p.slug, title: `${t.name} – ${site.name}`, desc: t.short.length < 90 ? `${t.short} ${t.name} at ${site.name}, ${site.address}.` : t.short, body, jsonld: [crumbsLd(crumbItems), ...productLd(p), ...(p.faq ? [faqLd(p.faq)] : [])], ogImage: p.img });
  }

  function pricingPage() {
    const R = PG.pricing;
    const rows = list => `<table class="pt"><tbody>${list.map(([l, v]) => `<tr><td>${l}</td><td>${money(v)}</td></tr>`).join('')}</tbody></table>`;
    const pg = (id, open, body, hub, n) => `<details class="pgroup rv" id="${id}"${open ? ' open' : ''}><summary><h2>${R.sections[id]}</h2><span class="pcount">${n} ${R.items}</span><span class="chev">${I.chev}</span></summary><div class="pbody-p">${body}${hub ? `<a class="link" href="${url(hub)}">${ui.groups[{ dayTrips: 'trips', courses: 'rec', professional: 'pro', technical: 'tech', marine: 'marine' }[hub]]}${I.arrow}</a>` : ''}</div></details>`;
    const body = pageHero({ imgFile: 'koh-sak-island-aerial.jpg', alt: 'Koh Sak island, Pattaya', crumbItems: [[R.h1, 'pricing']], h1: R.h1, kicker: R.kicker,
      extra: `<nav class="jump" aria-label="${ui.jump}">${Object.entries(R.sections).map(([k, v]) => `<a href="#${k}">${v}</a>`).join('')}</nav>` }) + `
<section><div class="wrap narrow prose rv">${R.intro.map(t => `<p>${t}</p>`).join('')}</div></section>
<section class="soft"><div class="wrap"><div class="price-tools"><button type="button" id="price-toggle" data-open="${R.expandAll}" data-close="${R.collapseAll}">${R.expandAll}</button></div><div class="price-grid">
  ${pg('dayTrips', true, `<h3>${R.sub.noExperience}</h3>${rows(priceList.dayTrips.noExperience)}<h3>${R.sub.certified}</h3>${rows(priceList.dayTrips.certified)}`, 'dayTrips', priceList.dayTrips.noExperience.length + priceList.dayTrips.certified.length)}
  ${pg('recreational', false, `<h3>${R.sub.noExperience}</h3>${rows(priceList.recreational.noExperience)}<h3>${R.sub.certified}</h3>${rows(priceList.recreational.certified)}`, 'courses', priceList.recreational.noExperience.length + priceList.recreational.certified.length)}
  ${pg('professional', false, rows(priceList.professional), 'professional', priceList.professional.length)}
  ${pg('technical', false, rows(priceList.technical), 'technical', priceList.technical.length)}
  ${pg('marine', false, rows(priceList.marine), 'marine', priceList.marine.length)}
  ${pg('other', false, `<h3>${R.sub.rental}</h3>${rows(priceList.other.rental)}<h3>${R.sub.servicing}</h3>${rows(priceList.other.servicing)}<h3>${R.sub.services}</h3>${rows(priceList.other.services)}`, null, priceList.other.rental.length + priceList.other.servicing.length + priceList.other.services.length)}
</div></div></section>
<section id="club"><div class="wrap"><h2 class="rv">${R.club}</h2><div class="club rv">${priceList.clubImages.map((f, i) => `<figure>${img(f, R.clubAlts[i], '', '(max-width: 700px) 100vw, 45vw')}</figure>`).join('')}</div></div></section>
${ctaBand(ui.bookNowBang, PG.book.kicker)}`;
    return layout({ key: 'pricing', title: R.title, desc: R.desc, body, jsonld: [crumbsLd([[R.h1, 'pricing']])], ogImage: 'koh-sak-island-aerial.jpg' });
  }

  function aboutPage() {
    const A = PG.about;
    const body = pageHero({ imgFile: 'group-on-the-boat.jpg', alt: 'The Thai Ocean Academy team and divers on the boat', crumbItems: [[ui.nav.about, 'about']], kicker: A.kicker, h1: A.h1 }) + `
<section><div class="wrap split-grid">
  <div class="split-text rv">${A.why.map(t => `<p class="intro-p">${t}</p>`).join('')}<p class="motto">${A.motto1}<br>${A.motto2}</p></div>
  <div class="split-img rv">${img('divers-togethr.jpg', 'Divers together', '', '(max-width: 900px) 100vw, 50vw')}</div>
</div></section>
<section class="soft"><div class="wrap narrow prose rv"><h2>${A.missionTitle}</h2>${A.mission.map(t => `<p>${t}</p>`).join('')}</div></section>
<section><div class="wrap split-grid">
  <div class="split-img rv">${img('a-group-of-students-finish-marine-science-diving-program.jpg', 'A group of students finish a marine science diving program', '', '(max-width: 900px) 100vw, 50vw')}</div>
  <div class="split-text rv"><h2>${A.whyChooseTitle}</h2><p>${A.whyChoose}</p><h3>${A.familyTitle}</h3><p>${A.family}</p><a class="btn btn-primary" href="${url('contact')}">${ui.nav.contact}</a></div>
</div></section>
<section class="soft"><div class="wrap"><div class="grid grid-3">${[['team', 'team-tim.jpg'], ['locations', 'thai-ocean-academy-pattaya-location.jpg'], ['boats', 'thai-ocean-academy-scuba-grace-dive-boat-pattaya.jpg']].map(([k, f], i) => `<a class="tile rv" href="${url(k)}" style="--d:${i * .08}s">${img(f, ui.nav[k])}<span>${ui.nav[k]}${I.arrow}</span></a>`).join('')}</div></div></section>
${statsBar()}`;
    return layout({ key: 'about', title: A.title, desc: A.desc, body, jsonld: [crumbsLd([[ui.nav.about, 'about']])], ogImage: 'group-on-the-boat.jpg' });
  }

  function teamPage() {
    const T = PG.team;
    const person = (m, i) => `<div class="person rv" style="--d:${i * .06}s">${img(m.img, m.name, '', '(max-width: 700px) 50vw, 300px')}<b>${m.name}</b><span>${T.roles[m.name]}</span></div>`;
    const body = pageHero({ imgFile: 'group-on-the-boat.jpg', alt: T.h1, crumbItems: [[ui.nav.about, 'about'], [ui.nav.team, 'team']], kicker: T.kicker, h1: T.h1 }) + `
<section><div class="wrap narrow prose rv"><p class="intro-p">${T.intro}</p></div></section>
<section class="soft"><div class="wrap"><h2 class="rv">${T.coreTitle}</h2><div class="people">${team.core.map(person).join('')}</div></div></section>
<section><div class="wrap"><h2 class="rv">${T.bangkokTitle}</h2><div class="people">${team.bangkok.map(person).join('')}</div></div></section>`;
    return layout({ key: 'team', title: T.title, desc: T.desc, body, jsonld: [crumbsLd([[ui.nav.about, 'about'], [ui.nav.team, 'team']])] });
  }

  function locationsPage() {
    const Lo = PG.locations;
    const body = pageHero({ imgFile: 'koh-sak-island-aerial.jpg', alt: Lo.h1, crumbItems: [[ui.nav.about, 'about'], [ui.nav.locations, 'locations']], kicker: Lo.kicker, h1: Lo.h1 }) + `
<section><div class="wrap narrow prose rv"><p class="intro-p">${Lo.intro}</p></div></section>
${locations.map((l, i) => `<section class="${i % 2 ? '' : 'soft'}" id="${l.key}"><div class="wrap loc-grid">
  <div class="loc-img rv">${img(l.img, Lo.names[l.key], '', '(max-width: 900px) 100vw, 40vw')}</div>
  <div class="loc-text rv"><h2>${Lo.names[l.key]}</h2><p>${Lo.text[l.key]}</p><h3>${PG.home.contactInfo}</h3>${contactCard(l)}${l.site ? `<a class="btn btn-dark" href="${l.site}" target="_blank" rel="noopener">${Lo.siteLabel[l.key]}${I.arrow}</a>` : `<a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a>`}</div>
  <div class="map loc-map rv"><iframe src="${l.mapsEmbed}" loading="lazy" title="${Lo.names[l.key]}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
</div></section>`).join('')}`;
    return layout({ key: 'locations', title: Lo.title, desc: Lo.desc, body, jsonld: [crumbsLd([[ui.nav.about, 'about'], [ui.nav.locations, 'locations']])], ogImage: 'koh-sak-island-aerial.jpg' });
  }

  function boatsPage() {
    const B = PG.boats;
    const body = pageHero({ imgFile: boats[0].img2, alt: B.h1, crumbItems: [[ui.nav.about, 'about'], [ui.nav.boats, 'boats']], kicker: B.kicker, h1: B.h1 }) + `
<section><div class="wrap narrow prose rv"><p class="intro-p">${B.intro}</p></div></section>
${boats.map((b, i) => `<section class="${i % 2 ? '' : 'soft'}"><div class="wrap split-grid ${i % 2 ? 'rev' : ''}">
  <div class="split-img boat-imgs rv">${img(b.img, B.names[b.key], '', '(max-width: 900px) 100vw, 50vw')}${img(b.img2, B.names[b.key], '', '(max-width: 900px) 100vw, 50vw')}</div>
  <div class="split-text rv"><span class="eyebrow">${B.capacity.replace('{n}', b.capacity)}</span><h2>${B.names[b.key]}</h2><p>${B.text[b.key]}</p></div>
</div></section>`).join('')}
${faqBlock(B.faq, B.faqTitle)}`;
    return layout({ key: 'boats', title: B.title, desc: B.desc, body, jsonld: [crumbsLd([[ui.nav.about, 'about'], [ui.nav.boats, 'boats']]), faqLd(B.faq)], ogImage: boats[0].img2 });
  }

  function contactPage() {
    const C = PG.contact;
    const body = pageHero({ imgFile: 'thai-ocean-academy-pattaya-location.jpg', alt: C.h1, crumbItems: [[ui.nav.contact, 'contact']], kicker: C.kicker, h1: C.h1, lead: C.intro }) + `
<section><div class="wrap contact-grid">
  <form class="form rv" method="POST" action="${url('contact')}" data-netlify="true" name="contact" data-mail="${site.email}" data-subject="${esc(C.mailSubject)}" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact"><p class="hp"><label>Don’t fill this out: <input name="bot-field"></label></p>
    <label>${C.form.name}<input name="name" required autocomplete="name"></label>
    <label>${C.form.email}<input type="email" name="email" required autocomplete="email"></label>
    <label>${C.form.message}<textarea name="message" rows="6" required></textarea></label>
    <button class="btn btn-primary btn-lg" type="submit">${C.form.send}</button>
    <p class="form-note" data-ok="${esc(PG.book.form.thanks)}" data-fallback="${esc(PG.book.form.mailFallback.replace('{email}', site.email))}"></p>
  </form>
  <div class="rv"><h2>${PG.home.contactInfo}</h2>${contactCard()}<h3>${PG.home.stayConnected}</h3><p>${PG.home.stayConnectedText}</p><div class="socials dark-links"><a href="${site.social.facebook}" target="_blank" rel="noopener">${I.fb}Facebook</a><a href="${site.social.instagram}" target="_blank" rel="noopener">${I.ig}Instagram</a><a href="${site.social.youtube}" target="_blank" rel="noopener">${I.yt}YouTube</a><a href="${site.social.tiktok}" target="_blank" rel="noopener">${I.tt}TikTok</a></div>
    <div class="map rv"><iframe src="${site.mapsEmbed}" loading="lazy" title="${ui.mapTitle}" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>
</div></section>`;
    return layout({ key: 'contact', title: C.title, desc: C.desc, body, jsonld: [crumbsLd([[ui.nav.contact, 'contact']])] });
  }

  function bookPage() {
    const B = PG.book, F = B.form;
    const body = pageHero({ imgFile: 'diver-heart-sign.jpg', alt: B.h1, crumbItems: [[ui.nav.book, 'book']], h1: B.h1, lead: B.kicker, cls: 'short' }) + `
<section><div class="wrap book-grid">
  <form class="form rv" method="POST" action="${url('book')}" data-netlify="true" name="booking" data-mail="${site.email}" data-subject="${esc(B.mailSubject)}" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="booking"><p class="hp"><label>Don’t fill this out: <input name="bot-field"></label></p>
    <fieldset class="two"><legend>${F.name} *</legend><label>${F.first}<input name="first" required autocomplete="given-name"></label><label>${F.last}<input name="last" required autocomplete="family-name"></label></fieldset>
    <label>${F.email} *<input type="email" name="email" required autocomplete="email"></label>
    <label>${F.level}<input name="level"><small>${F.levelHelp}</small></label>
    <label>${F.program}<select name="program" id="program">${F.programs.map(o => `<option>${o}</option>`).join('')}</select></label>
    <label>${F.what}<input name="what" id="what"></label>
    <label>${F.dates}<input name="dates"><small>${F.datesHelp}</small></label>
    <label>${F.message}<textarea name="message" rows="5"></textarea></label>
    <button class="btn btn-primary btn-lg" type="submit" data-sending="${F.sending}">${F.submit}</button>
    <p class="form-note" data-ok="${esc(F.thanks)}" data-fallback="${esc(F.mailFallback.replace('{email}', site.email))}"></p>
  </form>
  <aside class="rv"><div class="pside-card"><span class="pside-title">${PG.home.contactInfo}</span>${contactCard()}<a class="btn btn-ghost-dark" href="${url('pricing')}">${ui.nav.pricing}${I.arrow}</a></div></aside>
</div></section>`;
    return layout({ key: 'book', title: B.title, desc: B.desc, body, jsonld: [crumbsLd([[ui.nav.book, 'book']])], ogImage: 'diver-heart-sign.jpg' });
  }

  function termsPage() {
    const T = PG.terms;
    const body = pageHero({ imgFile: 'light-through-crack.jpg', alt: '', crumbItems: [[ui.nav.terms, 'terms']], kicker: T.h1, h1: T.kicker, cls: 'short' }) +
      `<section><div class="wrap narrow prose rv">${T.sections.map(([h, ps, ul]) => `<h2>${h}</h2>${(ps || []).map(p => `<p>${p}</p>`).join('')}${ul ? `<ul>${ul.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}`).join('')}</div></section>`;
    return layout({ key: 'terms', title: T.title, desc: T.desc, body });
  }

  // ---------- blog
  const catName = slug => (categories.find(c => c.slug === slug) || {}).name;
  const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString(lang.code === 'en' ? 'en-GB' : lang.code, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  function postCard(post, i = 0) {
    return `<a class="post-card rv" href="${url('post:' + post.slug)}" style="--d:${i * .06}s"${post.lang ? ` lang="${post.lang}"` : ''}><span class="pimg${post.imageSmall ? ' contain' : ''}">${img(post.image, post.title)}</span><span class="pbody"><span class="pmeta"><time datetime="${post.date}">${fmtDate(post.date)}</time>${post.category ? `<span>${catName(post.category)}</span>` : ''}</span><strong>${post.title}</strong><span class="pdesc">${post.excerpt}</span><span class="more">${PG.blog.readMore}${I.arrow}</span></span></a>`;
  }
  function blogIndex(cat = null) {
    const Bl = PG.blog;
    const list = cat ? posts.filter(p => p.category === cat) : posts;
    const key = cat ? 'cat:' + cat : 'blog';
    const title = cat ? `${catName(cat)} – ${Bl.h1}` : Bl.title;
    const desc = cat ? `${catName(cat)}: ${list.map(p => p.title).join(', ')}`.slice(0, 155) : Bl.desc;
    const body = pageHero({ imgFile: 'lionfish.jpg', alt: 'Lionfish on a Pattaya reef', crumbItems: cat ? [[Bl.h1, 'blog'], [catName(cat), key]] : [[Bl.h1, 'blog']], kicker: Bl.kicker, h1: cat ? catName(cat) : Bl.h1, lead: Bl.intro, cls: 'short',
      extra: `<nav class="jump" aria-label="${Bl.category}"><a href="${url('blog')}"${!cat ? ' aria-current="page"' : ''}>${Bl.all}</a>${categories.filter(c => posts.some(p => p.category === c.slug)).map(c => `<a href="${url('cat:' + c.slug)}"${cat === c.slug ? ' aria-current="page"' : ''}>${c.name}</a>`).join('')}</nav>` }) +
      `<section><div class="wrap"><div class="grid grid-3">${list.map((p, i) => postCard(p, i)).join('')}</div></div></section>`;
    return layout({ key, title, desc, body, ogImage: 'lionfish.jpg' });
  }
  function postPage(post) {
    const Bl = PG.blog;
    const i = posts.indexOf(post), prev = posts[i + 1], next = posts[i - 1];
    const html = markdown(post.body, { linkResolver: resolve, imgResolver: (f, alt) => img(f, alt, '', '(max-width: 760px) 100vw, 720px') });
    const others = posts.filter(p => p !== post).slice(0, 3);
    const body = `<article class="post"${post.lang ? ` lang="${post.lang}"` : ''}>
  <header class="post-head"><div class="wrap narrow">${crumbs([[Bl.h1, 'blog'], [post.title, 'post:' + post.slug]])}<div class="pmeta"><time datetime="${post.date}">${fmtDate(post.date)}</time>${post.category ? `<a href="${url('cat:' + post.category)}">${catName(post.category)}</a>` : ''}${post.author ? `<span>${Bl.by} ${post.author}</span>` : ''}</div><h1>${post.title}</h1></div></header>
  <figure class="post-hero${post.imageSmall ? ' contain' : ''}">${img(post.image, post.title, '', '(max-width: 1100px) 100vw, 1100px', true)}${post.imageCaption ? `<figcaption>${post.imageCaption}</figcaption>` : ''}</figure>
  <div class="wrap narrow prose post-body rv">${html}</div>
  <div class="wrap narrow post-nav">${prev ? `<a href="${url('post:' + prev.slug)}"><small>${Bl.prev}</small>${prev.title}</a>` : '<span></span>'}${next ? `<a class="r" href="${url('post:' + next.slug)}"><small>${Bl.next}</small>${next.title}</a>` : ''}</div>
  ${post.tags.length ? `<div class="wrap narrow tags">${post.tags.map(t => `<span>#${t}</span>`).join('')}</div>` : ''}
</article>
<section class="soft"><div class="wrap"><h2 class="rv">${Bl.moreTitle}</h2><div class="grid grid-3">${others.map((p, j) => postCard(p, j)).join('')}</div></div></section>`;
    return layout({ key: 'post:' + post.slug, title: `${post.title} – ${site.shortName}`, desc: trunc(post.excerpt), body, jsonld: [postLd(post), crumbsLd([[Bl.h1, 'blog'], [post.title, 'post:' + post.slug]])], ogImage: post.image, bodyLang: post.lang });
  }

  const notFound = () => layout({ key: 'home', title: PG.notFound.title, desc: PG.notFound.text, body: `<section class="nf"><div class="wrap narrow"><span class="kicker">404</span><h1>${PG.notFound.h1}</h1><p class="lead">${PG.notFound.text}</p><div class="hero-actions"><a class="btn btn-primary" href="${url('home')}">${ui.breadcrumbHome}</a><a class="btn btn-dark" href="${url('diving')}">${ui.nav.diving}</a><a class="btn btn-dark" href="${url('pricing')}">${ui.nav.pricing}</a><a class="btn btn-dark" href="${url('contact')}">${ui.nav.contact}</a></div></div></section>` });

  return { url, urlIn, homePage, divingPage, hubPage, productPage, pricingPage, aboutPage, teamPage, locationsPage, boatsPage, contactPage, bookPage, termsPage, blogIndex, postPage, notFound, L };
}

// ---------------------------------------------------------------- WRITE
fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, content) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };
const written = [];
for (const lang of languages) {
  const c = ctx(lang);
  const page = (key, html) => { const u = c.url(key); write(u.slice(BASE.length + 1) + 'index.html', html); written.push([u, key, lang.code]); };
  page('home', c.homePage());
  page('diving', c.divingPage());
  for (const k of ['dayTrips', 'courses', 'professional', 'technical', 'marine']) page(k, c.hubPage(k));
  for (const p of products) page(p.slug, c.productPage(p));
  page('pricing', c.pricingPage());
  page('about', c.aboutPage()); page('team', c.teamPage()); page('locations', c.locationsPage()); page('boats', c.boatsPage());
  page('contact', c.contactPage()); page('book', c.bookPage()); page('terms', c.termsPage());
  page('blog', c.blogIndex());
  for (const cat of categories) if (posts.some(p => p.category === cat.slug)) page('cat:' + cat.slug, c.blogIndex(cat.slug));
  for (const post of posts) page('post:' + post.slug, c.postPage(post));
  if (lang.code === 'en') write('404.html', c.notFound());
}

// assets
write('assets/site.css', css);
write('assets/site.js', js);
const cache = path.join(__dirname, '.cache', 'img');
if (fs.existsSync(cache)) { fs.mkdirSync(path.join(OUT, 'img'), { recursive: true }); for (const f of fs.readdirSync(cache)) fs.copyFileSync(path.join(cache, f), path.join(OUT, 'img', f)); }
// favicon (crest-inspired mark in brand colours) + touch icon from the square logo
write('img/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#071e3d"/><path d="M14 14h36v20a18 18 0 0 1-36 0z" fill="none" stroke="#38bdf8" stroke-width="4"/><text x="32" y="38" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="22" fill="#fff">TO</text></svg>`);
if (fs.existsSync(path.join(__dirname, '.cache', 'apple-touch-icon.png'))) fs.copyFileSync(path.join(__dirname, '.cache', 'apple-touch-icon.png'), path.join(OUT, 'img', 'apple-touch-icon.png'));

// sitemap, robots, redirects, headers
const enCtx = ctx(languages[0]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${written.map(([u, key, code]) => {
  const alts = languages.length > 1 ? languages.map(l => `<xhtml:link rel="alternate" hreflang="${l.code}" href="${site.domain}${enCtx.urlIn(l.code, key).slice(BASE.length)}"/>`).join('') : '';
  const post = key.startsWith('post:') && posts.find(p => p.slug === key.slice(5));
  return `<url><loc>${site.domain}${u.slice(BASE.length)}</loc>${post ? `<lastmod>${post.date}</lastmod>` : ''}${alts}</url>`;
}).join('\n')}\n</urlset>\n`;
write('sitemap.xml', sitemap);
write('robots.txt', DEMO ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
const postRedirects = Object.fromEntries(posts.map(p => [p.originalUrl || `/${p.slug}/`, `/${EN.ui.slugs.blog}/${p.slug}/`]));
write('_redirects', Object.entries({ ...redirects, ...postRedirects }).map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n');
write('_headers', `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: SAMEORIGIN\n  Referrer-Policy: strict-origin-when-cross-origin\n/img/*\n  Cache-Control: public, max-age=31536000, immutable\n/assets/*\n  Cache-Control: public, max-age=604800\n`);
write('.nojekyll', '');
console.log(`Built ${written.length} pages (${products.length} products, ${posts.length} posts) → dist/${BASE ? ' (BASE=' + BASE + ')' : ''}${DEMO ? ' [demo/noindex]' : ''}`);
