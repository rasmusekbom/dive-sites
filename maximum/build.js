// Static site generator for Maximum Freediving Siargao. No dependencies.
//   npm run build   → build-images.js (responsive webp/jpg into .cache/img) + build.js → dist/
//   BASE=/dive-sites/maximum DEMO=1 npm run build   → GitHub Pages demo (sub-path + noindex)
const fs = require('fs');
const path = require('path');
const { site, languages, currencies, stats, products, sites, stay, rental, recommend, redirects } = require('./src/data.js');
const REVIEWS = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'reviews.json'), 'utf8'));
const IMG = fs.existsSync(path.join(__dirname, 'src', 'img-manifest.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'img-manifest.json'), 'utf8')) : {};
const ogJpg = file => IMG[file] ? file.replace(/\.[^.]+$/, '') + '-' + IMG[file].fallback + '.jpg' : file;

// DIST=<dir> writes elsewhere (deploy/publish.sh builds the demos outside dist/ so a local preview keeps working)
// Exchange rates (PHP base): refreshed automatically when older than 7 days; offline builds keep the old file.
const RATES_FILE = path.join(__dirname, 'src', 'rates.json');
if (Date.now() - new Date(require(RATES_FILE).date).getTime() > 7 * 864e5 && !process.env.OFFLINE) {
  try { require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'update-rates.js')], { stdio: 'inherit', timeout: 15000 }); } catch (e) { console.warn('rates not refreshed:', e.message); }
}
const rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));
const OUT = process.env.DIST ? path.resolve(process.env.DIST) : path.join(__dirname, 'dist');
const BASE = (process.env.BASE || '').replace(/\/$/, '');
const DEMO = !!process.env.DEMO;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const trunc = (s, n = 155) => s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
const php = n => typeof n === 'number' ? n.toLocaleString('en-US') : n;
const css = fs.readFileSync(path.join(__dirname, 'src', 'site.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'src', 'site.js'), 'utf8');
const P = Object.fromEntries(products.map(p => [p.slug, p]));
const courses = products.filter(p => p.group === 'course'), fundives = products.filter(p => p.group === 'fundive'), shoot = products.find(p => p.group === 'shoot');

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

// ---------------------------------------------------------------- ICONS
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3C7 3 3 6.7 3 11.3c0 2.6 1.3 4.9 3.3 6.4V21l3.1-1.7c.8.2 1.7.3 2.6.3 5 0 9-3.7 9-8.3S17 3 12 3Z"/><path d="m7 13 3-3 2.5 2.5L16 9"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  chev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8Z"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/></svg>',
  depth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v15m0 0-4-4m4 4 4-4M4 21h16"/></svg>',
  level: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 20V14M10 20V9M16 20V4"/></svg>',
  cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>',
  boat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M4 14l1.5-4h13L20 14M12 10V4l4 4"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></svg>',
  wave: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 12c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 5 0M2 18c2.5-3 5-3 7.5 0s5 3 7.5 0 5-3 5 0"/></svg>',
  bed: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7M3 15h18M7 9V6h4v3m2 0V6h4v3"/></svg>',
};
// Brand mark recreated from the school's Instagram avatar: an "M" of two ribbon loops crossing into a drop, with a dot beneath.
const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="mfg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b2540"/><stop offset="1" stop-color="#1f8fc9"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="#fff"/><g fill="none" stroke="url(#mfg)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M27 41c-6-4-12-9-13-17-1-6 3-10 7-9 5 1 5 8 2 14-2 4-3 7-1 12"/><path d="M37 41c6-4 12-9 13-17 1-6-3-10-7-9-5 1-5 8-2 14 2 4 3 7 1 12"/><path d="M26 41c2-3 4-4 6-4s4 1 6 4c1 3-1 7-6 7s-7-4-6-7Z"/></g><circle cx="32" cy="55" r="2.6" fill="#1f8fc9"/></svg>`;

// ---------------------------------------------------------------- PER-LANGUAGE CONTEXT
function ctx(lang) {
  const L = locales[lang.code];
  const ui = L.ui, PG = L.pages, C = L.content;
  const prefix = BASE + (lang.path ? `/${lang.path}` : '');
  // page keys: 'home' | key in ui.slugs | 'product:<slug>'
  const pathOf = (code, key) => {
    const l = languages.find(x => x.code === code), loc = locales[code], pre = BASE + (l.path ? `/${l.path}` : '');
    if (key === 'home') return `${pre}/`;
    if (key.startsWith('product:')) { const p = P[key.slice(8)]; if (p.group === 'shoot') return `${pre}/${loc.ui.slugs.shoot}/`; return `${pre}/${loc.ui.slugs[p.group === 'course' ? 'courses' : 'fundives']}/${p.slug}/`; }
    if (loc.ui.slugs[key]) return `${pre}/${loc.ui.slugs[key]}/`;
    throw new Error('unknown page key ' + key);
  };
  const url = key => pathOf(lang.code, key);
  const urlIn = (code, key) => pathOf(code, key);
  const abs = key => site.domain + url(key).slice(BASE.length);
  const pk = p => 'product:' + p.slug;
  const pname = p => C.products[p.key].name;
  const sname = k => C.sites[k].name;
  const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, h) => `<a href="${/^https?:/.test(h) ? h : url(h)}">${t}</a>`);
  const richP = s => s.split(/\n\n+/).map(t => `<p>${rich(t)}</p>`).join('');
  const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString(ui.dateLocale || 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const money = (n, cls = '') => `<span class="money ${cls}" data-php="${n}"><b>₱${php(n)}</b></span>`;
  const img = (file, alt, extra = '', sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 480px', eager = false) => {
    const m = IMG[file];
    if (!m) return `<img src="${BASE}/img/${file}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} ${extra}>`;
    const name = file.replace(/\.[^.]+$/, '');
    const srcset = m.widths.map(w => `${BASE}/img/${name}-${w}.webp ${w}w`).join(', ');
    return `<img src="${BASE}/img/${name}-${m.fallback}.jpg" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} ${extra}>`;
  };
  // portrait photos: where the subject sits, so the hero crop keeps it (default 50% 40%)
  const HERO_POS = { 'kid-ok-sign.jpg': '50% 22%', 'line-training-over-reef.jpg': '50% 55%', 'freediver-white-bikini-reef.jpg': '50% 30%', 'naked-island-fins-portrait.jpg': '50% 30%', 'red-dress-underwater.jpg': '50% 30%', 'villa-room.jpg': '50% 50%', 'bangka-boat-at-sea.jpg': '50% 60%', 'surface-buoy-pink-fins.jpg': '50% 60%', 'under-the-bangka.jpg': '50% 45%', 'freediver-vertical-white-fins.jpg': '50% 35%', 'line-training-long-fins.jpg': '50% 30%', 'gliding-over-dark-reef.jpg': '50% 45%' };
  const heroImg = (file, alt) => img(file, alt, HERO_POS[file] ? `style="object-position:${HERO_POS[file]}"` : '', '100vw', true);
  const tel = n => `tel:${n.replace(/\s+/g, '')}`;
  const bookUrl = (q = '') => url('book') + q;
  const bookQ = p => `?type=${p.group}&which=${encodeURIComponent(pname(p))}`;
  const durationOf = p => p.days === 1 ? (p.hours && /\d/.test(p.hours) ? p.hours : ui.halfDay) : ui.days.replace('{n}', p.hours && /\d/.test(p.hours) ? p.hours.replace(/\s*days?/, '') : p.days);
  const levelOf = p => ui.levels[p.level];
  const fromPrice = p => p.tiers ? Math.min(...p.tiers.map(t => t[1])) : p.price;

  // ---------- navigation
  const langMenu = key => languages.map(l => `<a href="${urlIn(l.code, key)}" hreflang="${l.code}" lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${l.name}</a>`).join('');
  const curMenu = () => currencies.map(c => `<a href="#" data-cur="${c.code}" role="menuitem"><span>${c.code}</span><small>${c.symbol}</small></a>`).join('');
  let curKey = 'home';
  const switchers = () => `<div class="switch"><details class="dd dd-lang"><summary aria-label="${ui.language}">${I.globe}<span class="lang-code">${lang.code.toUpperCase()}</span>${I.chev}</summary><div class="dd-menu" role="menu">${langMenu(curKey)}</div></details><details class="dd dd-cur"><summary aria-label="${ui.currency}"><span class="cur-code">${lang.currency}</span>${I.chev}</summary><div class="dd-menu" role="menu">${curMenu()}</div></details></div>`;
  const langMenuMobile = key => `<details class="dd dd-lang"><summary>${I.globe}<span>${lang.name}</span>${I.chev}</summary><div class="dd-menu" role="menu">${langMenu(key)}</div></details>`;
  const brand = () => `<a class="brand" href="${url('home')}" aria-label="${esc(site.name)}">${LOGO}<span class="brand-text"><b>${site.shortName}</b><span>Siargao · General Luna</span></span></a>`;

  function layout({ key, title, desc, body, jsonld = [], ogImage, cls = '' }) {
    curKey = key;
    const canonical = abs(key);
    desc = trunc(desc, 158);
    const alternates = languages.map(l => `<link rel="alternate" hreflang="${l.code}" href="${site.domain}${urlIn(l.code, key).slice(BASE.length)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${site.domain}${urlIn('en', key).slice(BASE.length)}">`;
    const fonts = 'family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700' + ({ ko: '&family=Noto+Sans+KR:wght@400;500;700', ja: '&family=Noto+Sans+JP:wght@400;500;700', zh: '&family=Noto+Sans+SC:wght@400;500;700' }[lang.code] || '');
    const ld = [orgLd(), ...jsonld].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
    const sub = items => `<div class="navsub">${items.map(([label, k, all]) => `<a href="${url(k)}"${k === key ? ' aria-current="page"' : ''}${all ? ' class="all"' : ''}>${label}</a>`).join('')}</div>`;
    const courseItems = [...courses.map(p => [C.products[p.key].nav, pk(p)]), [ui.nav.allCourses, 'courses', true]];
    const diveItems = [...fundives.map(p => [C.products[p.key].nav, pk(p)]), [ui.nav.allFundives, 'fundives', true]];
    const moreItems = [[ui.nav.sites, 'sites'], [ui.nav.prices, 'prices'], [ui.nav.stay, 'stay'], [ui.nav.faq, 'faq'], [ui.nav.about, 'about']];
    const inC = key === 'courses' || courses.some(p => pk(p) === key), inD = key === 'fundives' || fundives.some(p => pk(p) === key), inM = ['sites', 'prices', 'stay', 'faq', 'about'].includes(key);
    const li = (label, k, items, on) => `<li class="${items ? 'has-sub' : ''}${on ? ' on' : ''}"><a href="${url(k)}"${k === key ? ' aria-current="page"' : ''}>${label}</a>${items ? `<button class="sub-toggle" aria-expanded="false" aria-label="${label}">${I.chev}</button>${sub(items)}` : ''}</li>`;
    const mmSub = (label, items) => `<details><summary>${label}${I.chev}</summary><div class="mm-sub">${items.map(([l, k, all]) => `<a href="${url(k)}"${all ? ' class="mm-all"' : ''}>${l}</a>`).join('')}</div></details>`;
    return `<!DOCTYPE html>
<html lang="${ui.htmlLang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">${DEMO ? '\n<meta name="robots" content="noindex, nofollow">' : ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${alternates}
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="${ui.htmlLang}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.domain}/img/${ogJpg(ogImage || site.ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#071a2e">
<link rel="icon" href="${BASE}/img/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="${BASE}/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/site.css">
${ld}
</head>
<body class="${cls}" data-lang="${lang.code}" data-cur="${lang.currency}">
<a class="skip" href="#main">${ui.skip}</a>
<header class="top" id="top">
  <div class="topbar"><div class="wrap"><span>${I.clock}${ui.hoursText}</span><a href="${tel(site.phone)}">${I.phone}${site.phone}</a><a href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a><span class="season-pill">${I.pin}${ui.meetText}</span></div></div>
  <nav class="nav" aria-label="Main"><div class="wrap">
    ${brand()}
    <ul class="nav-links">
      ${li(ui.nav.courses, 'courses', courseItems, inC)}
      ${li(ui.nav.fundives, 'fundives', diveItems, inD)}
      ${li(ui.nav.shoot, pk(shoot))}
      ${li(ui.nav.sites, 'sites', moreItems, inM)}
      ${li(ui.nav.contact, 'contact')}
    </ul>
    <div class="nav-cta">
      ${switchers()}
      <a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a>
      <button class="burger" aria-label="${ui.menu}" aria-controls="mm" aria-expanded="false">${I.menu}</button>
    </div>
  </div></nav>
</header>
<div class="mobile-menu" id="mm" hidden>
  <div class="mm-head"><span>${ui.menu}</span><button class="close" aria-label="${ui.close}">×</button></div>
  ${mmSub(ui.nav.courses, courseItems)}
  ${mmSub(ui.nav.fundives, diveItems)}
  <a href="${url(pk(shoot))}">${ui.nav.shoot}</a>
  ${mmSub(ui.nav.sites, moreItems)}
  <a href="${url('contact')}">${ui.nav.contact}</a>
  <div class="mm-row"><div class="mm-field"><span class="mm-label">${ui.language}</span>${langMenuMobile(key)}</div><div class="mm-field"><span class="mm-label">${ui.currency}</span><details class="dd dd-cur"><summary><span class="cur-code">${lang.currency}</span>${I.chev}</summary><div class="dd-menu" role="menu">${curMenu()}</div></details></div></div>
  <div class="mm-actions"><a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a><a class="btn btn-wa" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a></div>
</div>
<main id="main">${body}</main>
${footer(key)}
<script>window.RATES=${JSON.stringify(rates.rates)};window.CURS=${JSON.stringify(currencies.map(c => c.code))};window.LOC=${JSON.stringify(ui.numberLocale || 'en-US')};window.RECO=${JSON.stringify(recommend)};window.PRODUCTS=${JSON.stringify(Object.fromEntries(products.map(p => [p.slug, { name: pname(p), url: url(pk(p)), price: fromPrice(p), tiered: !!p.tiers, short: C.products[p.key].short, group: ui.groups[p.group], level: levelOf(p), duration: durationOf(p) }])))};</script>
<script src="${BASE}/assets/site.js" defer></script>
</body>
</html>`;
  }

  function footer(key) {
    const links = arr => arr.map(([l, k]) => `<li><a href="${url(k)}">${l}</a></li>`).join('');
    return `<footer><div class="wrap">
  <div class="foot">
    <div class="foot-brand">${brand()}<p>${ui.footTagline}</p><span class="licence">${I.cert}${C.agencies.map(a => a[0]).join(' · ')}</span></div>
    <div><h3>${ui.footCourses}</h3><ul>${links([...courses.map(p => [C.products[p.key].nav, pk(p)]), [ui.nav.allCourses, 'courses']])}</ul></div>
    <div><h3>${ui.footDives}</h3><ul>${links([...fundives.map(p => [C.products[p.key].nav, pk(p)]), [ui.nav.shoot, pk(shoot)], [ui.nav.sites, 'sites'], [ui.nav.stay, 'stay']])}</ul></div>
    <div><h3>${ui.footInfo}</h3><ul>${links([[ui.nav.prices, 'prices'], [ui.nav.faq, 'faq'], [ui.nav.about, 'about'], [ui.nav.contact, 'contact'], [ui.nav.book, 'book'], [ui.nav.terms, 'terms']])}</ul></div>
    <div><h3>${ui.footContact}</h3><ul class="foot-contact">
      <li><b>${site.legalName}</b><a href="${site.maps}" target="_blank" rel="noopener">${site.address}</a></li>
      <li><a href="${tel(site.phone)}">${site.phone}</a><a href="${tel(site.phone2)}">${site.phone2}</a></li>
      <li><a href="mailto:${site.email}">${site.email}</a></li>
      <li><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="${site.social.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${site.social.facebook}" target="_blank" rel="noopener">Facebook</a><a href="${site.social.tiktok}" target="_blank" rel="noopener">TikTok</a></li></ul></div>
  </div>
  <div class="foot-langs">${languages.map(l => `<a href="${urlIn(l.code, key)}" hreflang="${l.code}" lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${l.name}</a>`).join('')}</div>
  <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${site.legalName}</span><span class="rates-note">${ui.ratesNote.replace('{date}', rates.date.slice(5, 16))}</span><span>${ui.footPreview}</span></div>
</div></footer>`;
  }

  // ---------- JSON-LD
  function orgLd() {
    return {
      '@context': 'https://schema.org', '@type': ['LocalBusiness', 'SportsActivityLocation'], '@id': site.domain + '/#business',
      name: site.name, alternateName: site.legalName, url: site.domain, telephone: site.phone, email: site.email,
      image: site.domain + '/img/' + ogJpg(site.ogImage), logo: site.domain + '/img/apple-touch-icon.png',
      address: { '@type': 'PostalAddress', streetAddress: 'Poblacion 5', addressLocality: 'General Luna', addressRegion: 'Surigao del Norte', postalCode: '8419', addressCountry: 'PH' },
      geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      openingHours: 'Mo-Su 06:00-15:00', priceRange: '₱₱',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: site.rating, reviewCount: site.reviewCount, bestRating: 5 },
      sameAs: [site.social.facebook, site.social.instagram, site.social.tiktok, site.social.youtube],
    };
  }
  const crumbsLd = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, k], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(k) })) });
  const faqLd = keys => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: keys.map(k => ({ '@type': 'Question', name: PG.faq[k][0], acceptedAnswer: { '@type': 'Answer', text: PG.faq[k][1] } })) });
  const productLd = p => ({ '@context': 'https://schema.org', '@type': p.group === 'course' ? 'Course' : 'Product', name: pname(p), description: C.products[p.key].short, image: site.domain + '/img/' + ogJpg(p.img), url: abs(pk(p)), provider: { '@id': site.domain + '/#business' }, offers: (p.tiers || [[pname(p), p.price]]).map(t => ({ '@type': 'Offer', name: C.tierNames && C.tierNames[t[0]] ? `${pname(p)} – ${C.tierNames[t[0]]}` : t[0], price: t[1], priceCurrency: 'PHP', availability: 'https://schema.org/InStock', url: abs(pk(p)), seller: { '@id': site.domain + '/#business' } })) });

  // ---------- partials
  const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb"><a href="${url('home')}">${ui.breadcrumbHome}</a>${items.map(([n, k], i) => `<i>/</i>${i === items.length - 1 ? `<span>${n}</span>` : `<a href="${url(k)}">${n}</a>`}`).join('')}</nav>`;
  const pageHero = ({ imgFile, alt, crumbItems, kicker, h1, lead = '', extra = '', cls = '' }) => `<header class="page-hero ${cls}">${heroImg(imgFile, alt || '')}<div class="wrap">${crumbs(crumbItems)}${kicker ? `<span class="kicker">${kicker}</span>` : ''}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div></header>`;
  const statsBar = () => `<section class="stats"><div class="wrap stats-grid">${stats.map(([n, s, k]) => `<div class="stat rv"><b><span class="count" data-n="${n}">${n}</span>${s}</b><span>${PG.stats[k]}</span></div>`).join('')}</div></section>`;
  const faqBlock = (keys, title = ui.sections.faq) => `<section class="faq-sec" id="faq"><div class="wrap narrow"><h2 class="rv">${title}</h2><div class="faq rv">${keys.map((k, i) => `<details${i === 0 ? ' open' : ''}><summary>${PG.faq[k][0]}</summary><div>${richP(PG.faq[k][1])}</div></details>`).join('')}</div></div></section>`;
  const quote = key => { const [q, who, ctxt] = C.testimonials[key]; return `<figure class="quote rv"><blockquote>“${q}”</blockquote><figcaption><b>${who}</b><span>${ctxt}</span></figcaption></figure>`; };
  const ctaBand = (title, textStr, q = '') => `<section class="cta-band rv"><div class="wrap"><div><h2>${title}</h2><p>${textStr}</p></div><div class="cta-actions"><a class="btn btn-primary btn-lg" href="${bookUrl(q)}">${ui.bookNow}</a><a class="btn btn-wa btn-lg" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a></div></div></section>`;
  const contactCard = () => `<ul class="clist">
      <li>${I.pin}<a href="${site.maps}" target="_blank" rel="noopener">${site.address}</a></li>
      <li>${I.wa}<a href="${site.whatsapp}" target="_blank" rel="noopener">${ui.whatsapp}: ${site.phone}</a></li>
      <li>${I.msg}<a href="${site.messenger}" target="_blank" rel="noopener">${ui.messenger}</a></li>
      <li>${I.phone}<span><a href="${tel(site.phone)}">${site.phone}</a><small><a href="${tel(site.phone2)}">${site.phone2}</a></small></span></li>
      <li>${I.mail}<a href="mailto:${site.email}">${site.email}</a></li>
      <li>${I.clock}<span>${ui.hoursText} · ${ui.meetText}</span></li></ul>`;
  const seasonNote = () => `<p class="season-note">${I.info}<span>${ui.season}</span></p>`;
  const recoTool = () => `<form class="tool reco rv" action="${url('courses')}" data-suggested="${esc(ui.tools.suggested)}" data-book="${esc(ui.readMore)}" data-per="${esc(ui.perPerson)}" data-from="${esc(ui.from)}">
    <label>${ui.tools.expLabel}<select name="exp">${Object.entries(ui.tools.exp).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
    <label>${ui.tools.wantLabel}<select name="want">${Object.entries(ui.tools.want).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select></label>
    <div class="tool-result" aria-live="polite"></div><noscript><a class="btn btn-primary" href="${url('courses')}">${ui.tools.seeAll}</a></noscript></form>`;
  const productCard = (p, i = 0) => { const c = C.products[p.key]; return `<a class="pcard rv" href="${url(pk(p))}" style="--d:${(i % 4) * .06}s">
    <span class="pimg">${img(p.img, c.name)}<span class="tag${p.private ? ' red' : ''}">${p.private ? ui.private : ui.groups[p.group]}</span>${p.cert ? `<span class="tag right">${I.cert}${p.depth ? p.depth + ' ' + ui.metres : ui.certification}</span>` : ''}</span>
    <span class="pbody"><span class="pmeta"><span>${durationOf(p)}</span><span>${levelOf(p)}</span></span>
    <strong>${c.name}</strong><span class="pdesc">${c.short}</span>
    <span class="pfoot"><span class="price">${p.tiers ? `<small>${ui.from}</small> ` : ''}${money(fromPrice(p))} <small>${p.private ? ui.perSession : ui.perPerson}</small></span><span class="more">${ui.readMore}${I.arrow}</span></span></span></a>`; };
  const siteCard = (k, i = 0) => { const s = sites[k], c = C.sites[k]; const by = products.filter(p => (p.sites || []).includes(k)).map(pname); return `<div class="pcard site-card rv" id="${k}" style="--d:${(i % 4) * .06}s">
    <span class="pimg">${img(s.img, c.name, '', '(max-width: 700px) 100vw, 380px')}<span class="tag">${I.depth}${s.depth[0]}–${s.depth[1]} ${ui.metres}</span><span class="tag right${s.level >= 3 ? ' red' : ''}">${levelOf({ level: s.level })}</span></span>
    <span class="pbody"><span class="pmeta"><span>${I.boat} ${s.minutes} min</span></span><strong>${c.name}</strong><span class="pdesc">${c.text}</span>
    ${by.length ? `<span class="pfoot"><small style="color:var(--muted)">${PG.sitesPage.usedBy}: ${by.join(' · ')}</small></span>` : ''}</span></div>`; };
  const priceTable = (list, withBook = true) => `<div class="tt-wrap rv"><table class="tt prices"><thead><tr><th>${PG.prices.cols.session}</th><th>${PG.prices.cols.level}</th><th>${PG.prices.cols.duration}</th><th style="text-align:right">${PG.prices.cols.price}</th>${withBook ? '<th></th>' : ''}</tr></thead><tbody>
      ${list.flatMap(p => (p.tiers || [[null, p.price]]).map(([t, price, tDays, tLevel], i) => `<tr><td class="from"><b><a href="${url(pk(p))}">${pname(p)}${t ? ` – ${C.tierNames && C.tierNames[t] ? C.tierNames[t] : t}` : ''}</a></b>${i === 0 ? `<small>${C.products[p.key].short}</small>` : ''}</td><td>${tLevel !== undefined ? ui.levels[tLevel] : levelOf(p)}</td><td class="time">${tDays ? (tDays === 1 ? ui.day : ui.days.replace('{n}', tDays)) : durationOf(p)}${p.min ? `<small>${ui.min.replace('{n}', p.min)}</small>` : ''}${p.private ? `<small>${ui.private}</small>` : ''}</td><td class="fare">${money(price)}<small>${p.private ? ui.perSession : ui.perPerson}</small></td>${withBook ? `<td class="book"><a class="btn btn-ghost-dark" href="${bookUrl(bookQ(p))}">${ui.bookNow}</a></td>` : ''}</tr>`)).join('')}
    </tbody></table></div>`;
  const rentalTable = () => `<div class="tt-wrap rv"><table class="tt rental"><tbody>${rental.map(([k, price]) => `<tr><td class="from"><b>${C.rental[k]}</b></td><td class="fare">${money(price)}<small>${ui.perDay}</small></td></tr>`).join('')}</tbody></table></div>`;
  const reviewsBlock = () => {
    const H = PG.home;
    const card = (r, i) => { const long = r.text.length > 260; const t = long ? r.text.slice(0, 240).replace(/\s+\S*$/, '') + '…' : r.text; const link = r.from === 'Facebook' ? site.social.facebook : site.social.instagram; return `<figure class="review rv" style="--d:${(i % 4) * .06}s" lang="${r.lang}"><div class="stars" aria-label="${r.rating}/5">${I.star.repeat(r.rating)}</div><blockquote>${esc(t)}</blockquote>${long ? `<a class="more" href="${link}" target="_blank" rel="noopener">${r.from === 'Facebook' ? H.readOn : H.seeInstagram}${I.arrow}</a>` : ''}<figcaption><span class="av" aria-hidden="true">${esc(r.name.trim()[0].toUpperCase())}</span><div><b>${esc(r.name)}</b><time datetime="${r.date}">${fmtDate(r.date)}</time>${r.from ? `<small> · ${esc(r.from)}</small>` : ''}</div></figcaption></figure>`; };
    return `<section class="dark reviews" id="reviews"><div class="wrap">
    <div class="reviews-head rv"><div class="rating-big"><b>${site.rating.toFixed(1)}</b><div><div class="stars">${I.star.repeat(5)}</div><span>${site.reviewCount} ${H.reviews} · ${H.recommend.replace('{p}', site.fbRecommend)}</span></div></div><div><h2>${H.reviewsTitle}</h2><p class="sub">${H.reviewsText}</p></div><div class="reviews-actions"><a class="btn btn-ghost" href="${site.social.instagram}" target="_blank" rel="noopener">${I.ig}${H.seeInstagram}</a><a class="btn btn-primary" href="${site.social.facebook}" target="_blank" rel="noopener">${I.fb}${H.writeReview}</a></div></div>
    <div class="reviews-grid">${REVIEWS.reviews.slice(0, 8).map(card).join('')}</div></div></section>`;
  };
  const teamBlock = () => `<div class="team">${C.team.map(([n, role, txt], i) => `<div class="member rv" style="--d:${i * .06}s"><span class="av" aria-hidden="true">${esc(n.split(' ').map(w => w[0]).slice(0, 2).join(''))}</span><b>${n}</b><span class="role">${role}</span><p>${txt}</p></div>`).join('')}</div>`;

  // ---------- pages
  function homePage() {
    const H = PG.home;
    const start = [P['intro-to-freediving'], P['molchanovs-wave-1'], P['daily-fun-dive']];
    const body = `
<header class="hero" id="hero">${heroImg('freediver-white-fins-cabbage-coral.jpg', 'Freediver over the cabbage corals off Daku Island, Siargao')}
  <div class="wrap">
    <span class="kicker">${H.kicker}</span>
    <h1>${H.h1}</h1>
    <p class="lead">${H.intro}</p>
    <div class="hero-actions"><a class="btn btn-primary btn-lg" href="${url('book')}">${ui.bookNow}</a><a class="btn btn-ghost btn-lg" href="${url('courses')}">${ui.nav.allCourses}${I.arrow}</a></div>
    <a class="tabadge" href="${site.social.facebook}" target="_blank" rel="noopener"><b>${site.rating.toFixed(1)}</b><span class="stars" aria-hidden="true">${I.star.repeat(5)}</span><span>${site.reviewCount} ${H.reviews} · ${H.recommend.replace('{p}', site.fbRecommend)}</span></a>
  </div>
  <ul class="pillars wrap" aria-label="What we do">${H.pillars.map((t, i) => `<li><a href="${url(['courses', 'fundives', pk(shoot), 'sites'][i])}"><span class="pt">${t}</span><i>${I.arrow}</i></a></li>`).join('')}</ul>
</header>
<section class="tool-sec"><div class="wrap">
  <div class="section-head rv"><div><h2>${ui.tools.title}</h2><p class="sub">${ui.tools.hint}</p></div><a class="link" href="${url('prices')}">${ui.sections.pricesAll}${I.arrow}</a></div>
  ${recoTool()}${seasonNote()}
</div></section>
<section class="soft"><div class="wrap">
  <div class="section-head rv"><div><h2>${H.startTitle}</h2><p class="sub">${H.startText}</p></div><a class="link" href="${url('courses')}">${ui.nav.allCourses}${I.arrow}</a></div>
  <div class="grid grid-3">${start.map((p, i) => productCard(p, i)).join('')}</div>
</div></section>
${statsBar()}
<section><div class="wrap">
  <div class="section-head rv"><div><h2>${H.coursesTitle}</h2><p class="sub">${H.coursesText}</p></div></div>
  <div class="grid grid-3">${courses.map((p, i) => productCard(p, i)).join('')}</div>
</div></section>
<section class="split soft"><div class="wrap split-grid">
  <div class="split-img duo rv">${img('red-dress-underwater.jpg', 'Underwater photoshoot in a red dress', '', '(max-width: 900px) 50vw, 25vw')}${img('freediver-arms-out-cabbage-coral.jpg', 'Freediver over the cabbage corals', '', '(max-width: 900px) 50vw, 25vw')}</div>
  <div class="split-text rv"><span class="eyebrow">${ui.nav.shoot}</span><h2>${H.shootTitle}</h2><p>${H.shootText}</p><a class="btn btn-dark" href="${url(pk(shoot))}">${ui.nav.shoot}${I.arrow}</a></div>
</div></section>
<section><div class="wrap">
  <div class="section-head rv"><div><h2>${H.divesTitle}</h2><p class="sub">${H.divesText}</p></div><a class="link" href="${url('fundives')}">${ui.nav.allFundives}${I.arrow}</a></div>
  <div class="grid grid-3">${fundives.map((p, i) => productCard(p, i)).join('')}</div>
</div></section>
${reviewsBlock()}
<section class="split alt"><div class="wrap split-grid">
  <div class="split-text rv"><span class="eyebrow">${ui.nav.about}</span><h2>${H.aboutTitle}</h2><p>${H.aboutText}</p><a class="btn btn-dark" href="${url('about')}">${ui.nav.about}${I.arrow}</a></div>
  <div class="split-img rv">${img('under-the-bangka.jpg', 'Freediver beneath the school’s bangka', '', '(max-width: 900px) 100vw, 50vw')}</div>
</div></section>
<section class="soft"><div class="wrap">
  <div class="section-head rv"><div><h2>${H.sitesTitle}</h2><p class="sub">${H.sitesText}</p></div><a class="link" href="${url('sites')}">${ui.nav.sites}${I.arrow}</a></div>
  <div class="grid grid-4">${['cabbage', 'daku', 'line', 'blueCathedral'].map((k, i) => `<a class="pcard rv" href="${url('sites')}#${k}" style="--d:${i * .06}s"><span class="pimg">${img(sites[k].img, sname(k))}<span class="tag">${I.depth}${sites[k].depth[0]}–${sites[k].depth[1]} ${ui.metres}</span></span><span class="pbody"><strong>${sname(k)}</strong><span class="pdesc">${C.sites[k].short}</span></span></a>`).join('')}</div>
</div></section>
<section class="split"><div class="wrap split-grid">
  <div class="split-img rv">${img('villa-room.jpg', 'Room at Maximum Freediving Siargao', '', '(max-width: 900px) 100vw, 50vw')}</div>
  <div class="split-text rv"><span class="eyebrow">${ui.nav.stay}</span><h2>${H.stayTitle}</h2><p>${H.stayText}</p><a class="btn btn-dark" href="${url('stay')}">${ui.nav.stay}${I.arrow}</a></div>
</div></section>
<section class="soft" id="contact"><div class="wrap contact-grid">
  <div class="rv"><h2>${H.contactTitle}</h2><p>${H.contactText}</p>${contactCard()}<div class="hero-actions"><a class="btn btn-wa" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a><a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a></div></div>
  <div class="map rv"><iframe src="${site.mapsEmbed}" loading="lazy" title="${ui.mapTitle}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
</div></section>`;
    return layout({ key: 'home', title: H.title, desc: H.desc, body, cls: 'home' });
  }

  function coursesPage() {
    const Cp = PG.courses;
    const body = pageHero({ imgFile: 'line-training-over-reef.jpg', alt: Cp.h1, crumbItems: [[ui.nav.courses, 'courses']], kicker: Cp.kicker, h1: Cp.h1, lead: Cp.intro,
      extra: `<nav class="jump" aria-label="${ui.jump}"><a href="#which">${Cp.compareTitle}</a><a href="#list">${ui.nav.allCourses}</a><a href="#how">${ui.sections.howItWorks}</a><a href="#faq">${ui.sections.faq}</a></nav>` }) + `
<section class="tool-sec" id="which"><div class="wrap"><h2 class="rv">${Cp.compareTitle}</h2><div class="steps compare">${Cp.compare.map(([b, p, slug], i) => `<a class="step rv" href="${url('product:' + slug)}" style="--d:${i * .06}s"><b>${b}</b><p>${p}</p><span class="more">${pname(P[slug])}${I.arrow}</span></a>`).join('')}</div>${recoTool()}</div></section>
<section class="soft" id="list"><div class="wrap"><div class="grid grid-3">${courses.map((p, i) => productCard(p, i)).join('')}</div>${seasonNote()}</div></section>
<section id="how"><div class="wrap"><h2 class="rv">${ui.sections.howItWorks}</h2><div class="steps">${Cp.howItWorks.map(([b, p], i) => `<div class="step rv" style="--d:${i * .06}s"><b>${b}</b><p>${p}</p></div>`).join('')}</div></div></section>
<section class="soft"><div class="wrap"><h2 class="rv">${ui.sections.pricesAll}</h2>${priceTable(courses)}<p class="tt-note">${PG.prices.tableNote}</p></div></section>
${faqBlock(Cp.faq)}
${ctaBand(ui.bookCourse, Cp.intro, '?type=course')}`;
    return layout({ key: 'courses', title: Cp.title, desc: Cp.desc, body, jsonld: [crumbsLd([[ui.nav.courses, 'courses']]), faqLd(Cp.faq)], ogImage: 'line-training-over-reef.jpg' });
  }

  function fundivesPage() {
    const F = PG.fundives;
    const body = pageHero({ imgFile: 'cabbage-coral-wide-2.jpg', alt: F.h1, crumbItems: [[ui.nav.fundives, 'fundives']], kicker: F.kicker, h1: F.h1, lead: F.intro }) + `
<section class="tool-sec"><div class="wrap"><div class="grid grid-3">${fundives.map((p, i) => productCard(p, i)).join('')}</div>${seasonNote()}</div></section>
<section class="soft"><div class="wrap split-grid">
  <div class="split-img duo rv">${img('school-of-jacks.jpg', 'Freedivers with a school of jacks', '', '(max-width: 900px) 50vw, 25vw')}${img('diver-beneath-boat.jpg', 'Freediver beneath the bangka', '', '(max-width: 900px) 50vw, 25vw')}</div>
  <div class="split-text rv"><h2>${F.whyTitle}</h2><ul class="ticks big">${F.why.map(t => `<li>${t}</li>`).join('')}</ul></div>
</div></section>
<section><div class="wrap"><div class="section-head rv"><div><h2>${ui.sections.sites}</h2></div><a class="link" href="${url('sites')}">${ui.nav.sites}${I.arrow}</a></div><div class="grid grid-3">${['cabbage', 'daku', 'naked'].map((k, i) => siteCard(k, i)).join('')}</div></div></section>
<section class="soft"><div class="wrap"><h2 class="rv">${ui.sections.gallery}</h2><div class="gallery rv">${['red-fins-cabbage-coral.jpg', 'freediver-over-sand-reef-top.jpg', 'gliding-black-fins.jpg', 'buddies-surface-fins.jpg', 'ascending-yellow.jpg', 'two-freedivers-descending.jpg', 'wetsuit-freediver-reef.jpg', 'black-white-over-sand.jpg'].map(f => img(f, '', '', '(max-width: 700px) 50vw, 25vw')).join('')}</div></div></section>
${faqBlock(F.faq)}
${ctaBand(ui.bookThis, F.intro, '?type=fundive')}`;
    return layout({ key: 'fundives', title: F.title, desc: F.desc, body, jsonld: [crumbsLd([[ui.nav.fundives, 'fundives']]), faqLd(F.faq)], ogImage: 'cabbage-coral-wide-2.jpg' });
  }

  function productPage(p) {
    const c = C.products[p.key], Pp = PG.productPage;
    const hub = p.group === 'course' ? [ui.nav.courses, 'courses'] : p.group === 'fundive' ? [ui.nav.fundives, 'fundives'] : null;
    const crumbItems = [...(hub ? [hub] : []), [c.name, pk(p)]];
    const badges = `<div class="badges"><span class="badge">${I.level}${levelOf(p)}</span><span class="badge">${I.clock}${durationOf(p)}</span>${p.cert ? `<span class="badge">${I.cert}${p.cert}${p.depth ? ` · ${p.depth} ${ui.metres}` : ''}</span>` : ''}${p.min ? `<span class="badge">${I.users}${ui.min.replace('{n}', p.min)}</span>` : ''}${p.private ? `<span class="badge">${I.user}${ui.private}</span>` : ''}<span class="badge badge-hot">${p.tiers ? ui.from + ' ' : ''}₱${php(fromPrice(p))} ${p.private ? ui.perSession : ui.perPerson}</span></div>`;
    const tiers = p.tiers ? `<section class="pblock"><h2>${ui.sections.tiers}</h2><ul class="tiers">${p.tiers.map(([t, price, days]) => `<li><b>${C.tierNames && C.tierNames[t] ? C.tierNames[t] : t}</b><span>${C.tierDetail && C.tierDetail[t] ? C.tierDetail[t] : days ? ui.days.replace('{n}', days) : ''}</span>${money(price)}</li>`).join('')}</ul><p class="tt-note">${Pp.tiersNote}</p></section>` : '';
    const related = products.filter(x => x.slug !== p.slug && (x.group === p.group || p.group === 'shoot')).slice(0, 3);
    const body = pageHero({ imgFile: p.img, alt: c.name, crumbItems, kicker: c.kicker, h1: c.h1, extra: badges, cls: 'product-hero' }) + `
<section class="product"><div class="wrap product-grid">
  <div class="pmain rv"><p class="lead-in">${c.lead}</p>${c.intro.map(t => `<p class="intro-p">${t}</p>`).join('')}
    ${tiers}
    ${p.learn ? `<section class="pblock"><h2>${ui.sections.learn}</h2><ul class="ticks">${p.learn.map(k => `<li>${C.learn[k]}</li>`).join('')}</ul></section>` : ''}
    ${p.schedule ? `<section class="pblock"><h2>${ui.sections.schedule}</h2><ul class="timeline">${p.schedule.map(([tm, k]) => `<li><b>${tm}</b><span>${C.schedule[k]}</span></li>`).join('')}</ul></section>` : ''}
    <section class="pblock"><h2>${ui.sections.includes}</h2><ul class="ticks">${p.includes.map(k => `<li>${C.includes[k]}</li>`).join('')}</ul></section>
    <section class="pblock"><h2>${ui.sections.notIncluded}</h2><ul class="ticks x">${c.notIncluded.map(x => `<li>${x}</li>`).join('')}</ul></section>
    ${p.sites ? `<section class="pblock"><h2>${ui.sections.sites}</h2><div class="grid grid-3">${p.sites.map((k, i) => `<a class="pcard rv" href="${url('sites')}#${k}" style="--d:${i * .06}s"><span class="pimg">${img(sites[k].img, sname(k), '', '(max-width: 700px) 50vw, 240px')}<span class="tag">${I.depth}${sites[k].depth[0]}–${sites[k].depth[1]} ${ui.metres}</span></span><span class="pbody"><strong style="font-size:17px">${sname(k)}</strong><span class="pdesc" style="font-size:14px">${C.sites[k].short}</span></span></a>`).join('')}</div></section>` : ''}
    <section class="pblock"><h2>${ui.sections.photos}</h2><div class="gallery">${p.gallery.map(f => img(f, c.name, '', '(max-width: 700px) 50vw, 200px')).join('')}</div></section>
  </div>
  <aside class="pside rv"><div class="pside-card"><span class="pside-title">${c.name}</span>
    <span class="price big">${p.tiers ? `<small>${ui.from}</small> ` : ''}${money(fromPrice(p))} <small>${p.private ? ui.perSession : ui.perPerson}</small></span>
    <ul class="facts"><li>${I.level}<span>${ui.levelLabel}</span><b>${levelOf(p)}</b></li><li>${I.clock}<span>${ui.duration}</span><b>${durationOf(p)}</b></li>${p.cert ? `<li>${I.cert}<span>${ui.certification}</span><b>${p.cert}</b></li>` : `<li>${I.cert}<span>${ui.certification}</span><b>${ui.noCert}</b></li>`}${p.depth ? `<li>${I.depth}<span>${ui.maxDepth}</span><b>${p.depth} ${ui.metres}</b></li>` : ''}${p.minAge ? `<li>${I.user}<span>${ui.minAge}</span><b>${ui.years.replace('{n}', p.minAge)}</b></li>` : ''}${p.min ? `<li>${I.users}<span>${ui.groupSize}</span><b>${ui.min.replace('{n}', p.min)}</b></li>` : ''}${p.sites ? `<li>${I.wave}<span>${ui.sitesVisited}</span><b>${p.sites.length}</b></li>` : ''}<li>${I.pin}<span>${ui.meetPoint}</span><b>${site.meetTime} · ${site.addressShort}</b></li></ul>
    <a class="btn btn-primary btn-lg" href="${bookUrl(bookQ(p))}">${p.group === 'course' ? ui.bookCourse : ui.bookThis}</a>
    <a class="btn btn-wa" href="${site.whatsapp}?text=${encodeURIComponent(c.name)}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a>
    <p class="pside-note">${p.private ? Pp.privateNote + ' ' : ''}${Pp.bookNote}</p></div>${p.testimonial ? quote(p.testimonial) : ''}<div class="aside-img">${img(p.img2, c.name)}</div></aside>
</div></section>
${faqBlock(p.faq)}
<section class="soft"><div class="wrap"><h2 class="rv">${ui.sections.related}</h2><div class="grid grid-3">${related.map((x, i) => productCard(x, i)).join('')}</div></div></section>
${ctaBand(c.name, c.short, bookQ(p))}`;
    return layout({ key: pk(p), title: `${c.name} – ₱${php(fromPrice(p))} | ${site.shortName} Siargao`, desc: c.short, body, jsonld: [crumbsLd(crumbItems), productLd(p), faqLd(p.faq)], ogImage: p.img });
  }

  function sitesPage() {
    const S = PG.sitesPage;
    const order = ['cabbage', 'daku', 'dakuCave', 'line', 'naked', 'guyam', 'blueCathedral'];
    const body = pageHero({ imgFile: 'cabbage-coral-wide.jpg', alt: S.h1, crumbItems: [[ui.nav.sites, 'sites']], kicker: S.kicker, h1: S.h1, lead: S.intro, extra: `<nav class="jump" aria-label="${ui.jump}">${order.map(k => `<a href="#${k}">${sname(k)}</a>`).join('')}</nav>` }) + `
<section class="tool-sec"><div class="wrap"><div class="grid grid-3">${order.map((k, i) => siteCard(k, i)).join('')}</div></div></section>
<section class="soft"><div class="wrap split-grid">
  <div class="split-text rv"><h2>${S.conditionsTitle}</h2><ul class="ticks big">${S.conditions.map(t => `<li>${t}</li>`).join('')}</ul></div>
  <div class="split-img duo rv">${img('bangka-boat-at-sea.jpg', 'The school’s bangka at sea', '', '(max-width: 900px) 50vw, 25vw')}${img('school-of-jacks.jpg', 'School of jacks off Daku', '', '(max-width: 900px) 50vw, 25vw')}</div>
</div></section>
${ctaBand(ui.nav.fundives, PG.home.divesText, '?type=fundive')}`;
    return layout({ key: 'sites', title: S.title, desc: S.desc, body, jsonld: [crumbsLd([[ui.nav.sites, 'sites']])], ogImage: 'cabbage-coral-wide.jpg' });
  }

  function pricesPage() {
    const Pr = PG.prices;
    const body = pageHero({ imgFile: 'freediver-vertical-white-fins.jpg', alt: Pr.h1, crumbItems: [[ui.nav.prices, 'prices']], kicker: Pr.kicker, h1: Pr.h1, lead: Pr.intro, cls: 'short' }) + `
<section class="tool-sec"><div class="wrap">
  <h2 class="rv">${ui.nav.courses}</h2>${priceTable(courses)}
  <h2 class="rv" style="margin-top:44px">${ui.nav.fundives}</h2>${priceTable(fundives)}
  <h2 class="rv" style="margin-top:44px">${ui.nav.shoot}</h2>${priceTable([shoot])}
  <p class="tt-note">${Pr.tableNote} ${Pr.discounts}</p>${seasonNote()}
</div></section>
<section class="soft"><div class="wrap two-col">
  <div><h2 class="rv">${ui.sections.rental}</h2>${rentalTable()}<p class="tt-note">${Pr.rentalNote}</p></div>
  <div><h2 class="rv">${ui.nav.stay}</h2><div class="tt-wrap rv"><table class="tt rental"><tbody>${stay.map(s => `<tr><td class="from"><b><a href="${url('stay')}#${s.key}">${C.stay[s.key].name}</a></b><small>${ui.upTo.replace('{n}', s.pax)}</small></td><td class="fare">${money(s.price)}<small>${ui.perNight}</small></td></tr>`).join('')}</tbody></table></div></div>
</div></section>
${faqBlock(['pay', 'funMin', 'privateGroup', 'season'])}
${ctaBand(ui.bookNow, Pr.intro)}`;
    return layout({ key: 'prices', title: Pr.title, desc: Pr.desc, body, jsonld: [crumbsLd([[ui.nav.prices, 'prices']])], ogImage: 'freediver-vertical-white-fins.jpg' });
  }

  function stayPage() {
    const St = PG.stay;
    const body = pageHero({ imgFile: 'villa-room.jpg', alt: St.h1, crumbItems: [[ui.nav.stay, 'stay']], kicker: St.kicker, h1: St.h1, lead: St.intro }) + `
<section class="tool-sec"><div class="wrap"><div class="grid grid-3">${stay.map((s, i) => `<div class="pcard rv" id="${s.key}" style="--d:${i * .06}s"><span class="pimg">${img(s.img, C.stay[s.key].name)}<span class="tag">${I.users}${ui.upTo.replace('{n}', s.pax)}</span></span><span class="pbody"><strong>${C.stay[s.key].name}</strong><span class="pdesc">${C.stay[s.key].text}</span><ul class="ticks small">${s.features.map(f => `<li>${C.stay.features[f]}</li>`).join('')}</ul><span class="pfoot"><span class="price">${money(s.price)} <small>${ui.perNight}</small></span><a class="btn btn-ghost-dark" href="${bookUrl('?type=stay&which=' + encodeURIComponent(C.stay[s.key].name))}">${St.bookStay}</a></span></span></div>`).join('')}</div>
  <p class="tt-note" style="margin-top:28px">${St.villaPaler}</p></div></section>
<section class="soft"><div class="wrap split-grid">
  <div class="split-img duo rv">${img('green-bikini-fins-beach.jpg', 'Beach in General Luna', '', '(max-width: 900px) 50vw, 25vw')}${img('feet-on-boat-net.jpg', 'On the bangka', '', '(max-width: 900px) 50vw, 25vw')}</div>
  <div class="split-text rv"><span class="eyebrow">${ui.nav.courses}</span><h2>${PG.home.stayTitle}</h2><p>${PG.home.stayText}</p><a class="btn btn-dark" href="${url('courses')}">${ui.nav.allCourses}${I.arrow}</a></div>
</div></section>
${faqBlock(St.faq)}
${ctaBand(St.bookStay, St.intro, '?type=stay')}`;
    return layout({ key: 'stay', title: St.title, desc: St.desc, body, jsonld: [crumbsLd([[ui.nav.stay, 'stay']]), faqLd(St.faq)], ogImage: 'villa-room.jpg' });
  }

  function aboutPage() {
    const A = PG.about;
    const body = pageHero({ imgFile: 'under-the-bangka.jpg', alt: A.h1, crumbItems: [[ui.nav.about, 'about']], kicker: A.kicker, h1: A.h1 }) + `
<section><div class="wrap split-grid">
  <div class="split-text rv">${A.text.map(t => `<p class="intro-p">${t}</p>`).join('')}<div class="agencies">${C.agencies.map(([n, d]) => `<span class="licence">${I.cert}<b>${n}</b> ${d}</span>`).join('')}</div></div>
  <div class="split-img duo rv">${img('photographer-with-camera.jpg', 'Our underwater photographer', '', '(max-width: 900px) 50vw, 25vw')}${img('family-on-bangka.jpg', 'A family on the bangka after an Intro session', '', '(max-width: 900px) 50vw, 25vw')}</div>
</div></section>
${statsBar()}
<section class="soft" id="team"><div class="wrap"><h2 class="rv">${ui.sections.team}</h2>${teamBlock()}</div></section>
<section><div class="wrap"><h2 class="rv">${A.valuesTitle}</h2><div class="values">${A.values.map(([b, p], i) => `<div class="value rv" style="--d:${i * .06}s"><b>${b}</b><p>${p}</p></div>`).join('')}</div></div></section>
<section class="soft"><div class="wrap"><div class="grid grid-3">${[['courses', 'line-training-deep-blue.jpg'], ['sites', 'cabbage-coral-wide.jpg'], ['contact', 'bangka-boat-at-sea.jpg']].map(([k, f], i) => `<a class="pcard rv" href="${url(k)}" style="--d:${i * .08}s"><span class="pimg">${img(f, ui.nav[k])}</span><span class="pbody"><strong>${ui.nav[k]}</strong><span class="pfoot"><span></span><span class="more">${ui.readMore}${I.arrow}</span></span></span></a>`).join('')}</div></div></section>
<section id="contact"><div class="wrap contact-grid"><div class="rv"><h2>${A.contactTitle}</h2>${contactCard()}</div><div class="map rv"><iframe src="${site.mapsEmbed}" loading="lazy" title="${ui.mapTitle}" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></section>`;
    return layout({ key: 'about', title: A.title, desc: A.desc, body, jsonld: [crumbsLd([[ui.nav.about, 'about']])], ogImage: 'under-the-bangka.jpg' });
  }

  function contactPage() {
    const Cp = PG.contact;
    const body = pageHero({ imgFile: 'bangka-boat-at-sea.jpg', alt: Cp.h1, crumbItems: [[ui.nav.contact, 'contact']], kicker: Cp.kicker, h1: Cp.h1, lead: Cp.intro, cls: 'short' }) + `
<section><div class="wrap contact-grid">
  <div class="rv"><h2>${ui.footContact}</h2>${contactCard()}<p>${Cp.findUs}</p><div class="hero-actions"><a class="btn btn-wa" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a><a class="btn btn-ghost-dark" href="${site.messenger}" target="_blank" rel="noopener">${I.msg}${ui.messenger}</a><a class="btn btn-ghost-dark" href="${site.social.instagram}" target="_blank" rel="noopener">${I.ig}Instagram</a><a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a></div>
    <div class="map rv" style="margin-top:24px"><iframe src="${site.mapsEmbed}" loading="lazy" title="${ui.mapTitle}" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>
  <form class="form rv" method="POST" action="${url('contact')}" data-netlify="true" name="contact" data-mail="${site.email}" data-subject="${esc(Cp.mailSubject)}" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="contact"><p class="hp"><label>Don’t fill this out: <input name="bot-field"></label></p>
    <label>${Cp.form.name}<input name="name" required autocomplete="name"></label>
    <label>${Cp.form.email}<input type="email" name="email" required autocomplete="email"></label>
    <label>${Cp.form.message}<textarea name="message" rows="6" required></textarea></label>
    <button class="btn btn-primary btn-lg" type="submit">${Cp.form.send}</button>
    <p class="form-note" data-ok="${esc(ui.form.thanks)}" data-fallback="${esc(ui.form.mailFallback.replace('{email}', site.email))}"></p>
  </form>
</div></section>`;
    return layout({ key: 'contact', title: Cp.title, desc: Cp.desc, body, jsonld: [crumbsLd([[ui.nav.contact, 'contact']])], ogImage: 'bangka-boat-at-sea.jpg' });
  }

  function bookPage() {
    const B = PG.book, F = ui.form;
    const options = [...products.map(pname), ...stay.map(s => C.stay[s.key].name)];
    const body = pageHero({ imgFile: 'surface-buoy-pink-fins.jpg', alt: B.h1, crumbItems: [[ui.nav.book, 'book']], h1: B.h1, lead: B.kicker, cls: 'short' }) + `
<section><div class="wrap book-grid">
  <form class="form rv" method="POST" action="${url('book')}" data-netlify="true" name="booking" data-mail="${site.email}" data-subject="${esc(F.mailSubject)}" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="booking"><p class="hp"><label>Don’t fill this out: <input name="bot-field"></label></p>
    <fieldset class="seg-wrap" style="border:0;padding:0;margin:0"><legend style="font-family:var(--font-ui);font-weight:600;font-size:14.5px;color:var(--navy);margin-bottom:8px">${F.type}</legend><div class="seg">${['course', 'fundive', 'shoot', 'stay'].map((t, i) => `<label><input type="radio" name="type" value="${t}"${i === 0 ? ' checked' : ''}>${F.types[t]}</label>`).join('')}</div></fieldset>
    <label>${F.which}<input name="which" list="which-list" autocomplete="off"><datalist id="which-list">${options.map(o => `<option value="${esc(o)}">`).join('')}</datalist></label>
    <div class="row"><label>${F.date}<input type="date" name="date" required></label><label>${F.people}<input type="number" name="people" min="1" max="20" value="1" inputmode="numeric"></label></div>
    <small style="color:var(--muted);margin-top:-8px">${F.dateHelp}</small>
    <label>${F.exp}<select name="experience">${F.expOptions.map((o, i) => `<option value="${i}">${o}</option>`).join('')}</select></label>
    <div class="checks"><label class="check"><input type="checkbox" name="nonswimmer" value="yes"> ${F.swim}</label><label class="check"><input type="checkbox" name="stay" value="yes"> ${F.stayAdd}</label></div>
    <div class="row"><label>${F.name}<input name="name" required autocomplete="name"></label><label>${F.email}<input type="email" name="email" required autocomplete="email"></label></div>
    <label>${F.phone}<input name="phone" type="tel" autocomplete="tel"></label>
    <label>${F.message}<textarea name="message" rows="4"></textarea></label>
    <button class="btn btn-primary btn-lg" type="submit" data-sending="${F.sending}">${F.submit}</button>
    <p class="form-note" data-ok="${esc(F.thanks)}" data-fallback="${esc(F.mailFallback.replace('{email}', site.email))}"></p>
  </form>
  <aside class="rv"><div class="pside-card"><span class="pside-title">${B.aside}</span><p style="margin:0;color:var(--ink-2);font-size:15px">${B.asideText}</p><a class="btn btn-wa" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a><a class="btn btn-ghost-dark" href="${site.messenger}" target="_blank" rel="noopener">${I.msg}${ui.messenger}</a>${contactCard()}<a class="btn btn-ghost-dark" href="${url('prices')}">${ui.sections.pricesAll}${I.arrow}</a></div></aside>
</div></section>`;
    return layout({ key: 'book', title: B.title, desc: B.desc, body, jsonld: [crumbsLd([[ui.nav.book, 'book']])], ogImage: 'surface-buoy-pink-fins.jpg' });
  }

  function faqPage() {
    const Fq = PG.faqPage;
    const body = pageHero({ imgFile: 'kid-ok-sign.jpg', alt: Fq.h1, crumbItems: [[ui.nav.faq, 'faq']], kicker: Fq.kicker, h1: Fq.h1, lead: Fq.intro, cls: 'short' }) + faqBlock(Fq.all, '') + ctaBand(ui.askUs, Fq.intro);
    return layout({ key: 'faq', title: Fq.title, desc: Fq.desc, body, jsonld: [crumbsLd([[ui.nav.faq, 'faq']]), faqLd(Fq.all)], ogImage: 'kid-ok-sign.jpg' });
  }

  function termsPage() {
    const Tm = PG.terms;
    const body = pageHero({ imgFile: 'black-white-over-sand.jpg', alt: '', crumbItems: [[ui.nav.terms, 'terms']], kicker: Tm.kicker, h1: Tm.h1, cls: 'short' }) +
      `<section><div class="wrap narrow prose rv"><span class="draft">${Tm.draft}</span>${Tm.sections.map(([h, ps]) => `<h2>${h}</h2>${ps.map(p => `<p>${p}</p>`).join('')}`).join('')}</div></section>`;
    return layout({ key: 'terms', title: Tm.title, desc: Tm.desc, body });
  }

  const notFound = () => layout({ key: 'home', title: PG.notFound.title, desc: PG.notFound.text, body: `<section class="nf"><div class="wrap narrow"><span class="kicker">404</span><h1>${PG.notFound.h1}</h1><p class="lead">${PG.notFound.text}</p><div class="hero-actions"><a class="btn btn-primary" href="${url('home')}">${ui.breadcrumbHome}</a><a class="btn btn-dark" href="${url('courses')}">${ui.nav.courses}</a><a class="btn btn-dark" href="${url('fundives')}">${ui.nav.fundives}</a><a class="btn btn-dark" href="${url('contact')}">${ui.nav.contact}</a></div></div></section>` });

  return { url, urlIn, homePage, coursesPage, fundivesPage, productPage, sitesPage, pricesPage, stayPage, aboutPage, contactPage, bookPage, faqPage, termsPage, notFound };
}

// ---------------------------------------------------------------- WRITE
fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, content) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };
const written = [];
for (const lang of languages) {
  const c = ctx(lang);
  const page = (key, html) => { const u = c.url(key); write(u.slice(BASE.length + 1) + 'index.html', html); written.push([u, key, lang.code]); };
  page('home', c.homePage());
  page('courses', c.coursesPage()); page('fundives', c.fundivesPage());
  for (const p of products) page('product:' + p.slug, c.productPage(p));
  page('sites', c.sitesPage()); page('prices', c.pricesPage()); page('stay', c.stayPage()); page('about', c.aboutPage());
  page('contact', c.contactPage()); page('book', c.bookPage()); page('faq', c.faqPage()); page('terms', c.termsPage());
  if (lang.code === 'en') write('404.html', c.notFound());
}

// assets
write('assets/site.css', css);
write('assets/site.js', js);
const cache = path.join(__dirname, '.cache', 'img');
if (fs.existsSync(cache)) { fs.mkdirSync(path.join(OUT, 'img'), { recursive: true }); for (const f of fs.readdirSync(cache)) fs.copyFileSync(path.join(cache, f), path.join(OUT, 'img', f)); }
write('img/favicon.svg', LOGO.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(' aria-hidden="true"', ''));
if (fs.existsSync(path.join(__dirname, '.cache', 'apple-touch-icon.png'))) fs.copyFileSync(path.join(__dirname, '.cache', 'apple-touch-icon.png'), path.join(OUT, 'img', 'apple-touch-icon.png'));

// sitemap, robots, redirects, headers
const enCtx = ctx(languages[0]);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${written.map(([u, key]) => {
  const alts = languages.map(l => `<xhtml:link rel="alternate" hreflang="${l.code}" href="${site.domain}${enCtx.urlIn(l.code, key).slice(BASE.length)}"/>`).join('');
  return `<url><loc>${site.domain}${u.slice(BASE.length)}</loc>${alts}</url>`;
}).join('\n')}\n</urlset>\n`;
write('sitemap.xml', sitemap);
write('robots.txt', DEMO ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
write('_redirects', Object.entries(redirects).map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n');
write('_headers', `/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: SAMEORIGIN\n  Referrer-Policy: strict-origin-when-cross-origin\n/img/*\n  Cache-Control: public, max-age=31536000, immutable\n/assets/*\n  Cache-Control: public, max-age=604800\n`);
write('.nojekyll', '');
console.log(`Built ${written.length} pages (${products.length} products, ${languages.length} languages) → dist/${BASE ? ' (BASE=' + BASE + ')' : ''}${DEMO ? ' [demo/noindex]' : ''}`);
