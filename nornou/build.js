// Static site generator for Nornou (N. Kai Bae Hut) Speedboat, Koh Chang. No dependencies.
//   npm run build   → build-images.js (responsive webp/jpg into .cache/img) + build.js → dist/
//   BASE=/dive-sites/nornou DEMO=1 npm run build   → GitHub Pages demo (sub-path + noindex)
const fs = require('fs');
const path = require('path');
const { site, languages, currencies, stats, islands, stops, legs, boarding, routes, children, trips, boats, charters, parkFee, redirects } = require('./src/data.js');
const REVIEWS = JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'reviews.json'), 'utf8'));
const IMG = fs.existsSync(path.join(__dirname, 'src', 'img-manifest.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'img-manifest.json'), 'utf8')) : {};
const ogJpg = file => IMG[file] ? file.replace(/\.[^.]+$/, '') + '-' + IMG[file].fallback + '.jpg' : file;

// DIST=<dir> writes elsewhere (deploy/publish.sh builds the demos outside dist/ so a local preview keeps working)
// Exchange rates (THB base): refreshed automatically when older than 7 days; offline builds keep the old file.
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
const thb = n => typeof n === 'number' ? n.toLocaleString('en-US') : n;
const css = fs.readFileSync(path.join(__dirname, 'src', 'site.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'src', 'site.js'), 'utf8');
const T = Object.fromEntries(trips.map(t => [t.slug, t]));
const R = Object.fromEntries(routes.map(r => [r.slug, r]));

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
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  chev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  both: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16m-4-4 4 4-4 4M20 16H4m4-4-4 4 4 4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>',
  owl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="7" cy="13" r="4"/><circle cx="17" cy="13" r="4"/><circle cx="7" cy="13" r="1.2" fill="currentColor"/><circle cx="17" cy="13" r="1.2" fill="currentColor"/><path d="M2 9c3-3 6-3 10-3s7 0 10 3"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/></svg>',
  island: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 19c3-2 6-2 10 0s7 2 10 0M12 17V9m0 0c-3-4-6-4-8-2 3 0 5 1 8 2Zm0 0c3-4 6-4 8-2-3 0-5 1-8 2Z"/></svg>',
  food: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M17 3c-2 0-3 3-3 6s1 4 3 4v8"/></svg>',
  taxi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M3 13l2-5h14l2 5v5H3z"/><circle cx="7" cy="18" r="1.5" fill="currentColor"/><circle cx="17" cy="18" r="1.5" fill="currentColor"/><path d="M9 8V5h6v3"/></svg>',
  boat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M4 14l1.5-4h13L20 14M12 10V4l4 4"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
  globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8h.01"/></svg>',
};
// Brand mark recreated from the watermark on the operator's photos: hull in navy/sea-blue, red stripe, wave.
const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="#fff"/><path d="M10 38c9-9 20-14 40-15-6 4-9 7-11 10H16Z" fill="#0f2247"/><path d="M14 35c8-6 18-9 34-9-4 3-7 6-8 8H18Z" fill="#1f6fb5"/><path d="M28 35c5-5 12-7 20-7-3 2-6 5-7 7Z" fill="#e02a4f"/><path d="M8 44c5 3 9 3 14 0s9-3 14 0 9 3 14 0" fill="none" stroke="#1f6fb5" stroke-width="3.2" stroke-linecap="round"/><path d="M12 50c4 2 7 2 11 0s7-2 11 0 7 2 11 0" fill="none" stroke="#3fd1e0" stroke-width="2.4" stroke-linecap="round"/></svg>`;

// ---------------------------------------------------------------- PER-LANGUAGE CONTEXT
function ctx(lang) {
  const L = locales[lang.code];
  const ui = L.ui, PG = L.pages, C = L.content;
  const prefix = BASE + (lang.path ? `/${lang.path}` : '');
  // page keys: 'home' | key in ui.slugs | 'route:<slug>' | 'trip:<slug>'
  const pathOf = (code, key) => {
    const l = languages.find(x => x.code === code), loc = locales[code], pre = BASE + (l.path ? `/${l.path}` : '');
    if (key === 'home') return `${pre}/`;
    if (key.startsWith('route:')) return `${pre}/${loc.ui.slugs.transfers}/${key.slice(6)}/`;
    if (key.startsWith('trip:')) return `${pre}/${loc.ui.slugs.snorkelling}/${key.slice(5)}/`;
    if (loc.ui.slugs[key]) return `${pre}/${loc.ui.slugs[key]}/`;
    throw new Error('unknown page key ' + key);
  };
  const url = key => pathOf(lang.code, key);
  const urlIn = (code, key) => pathOf(code, key);
  const abs = key => site.domain + url(key).slice(BASE.length);
  const isl = k => C.islands[k].name;
  const stopName = k => ui.stops[k];
  const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, h) => `<a href="${/^https?:/.test(h) ? h : url(h)}">${t}</a>`);
  const richP = s => s.split(/\n\n+/).map(t => `<p>${rich(t)}</p>`).join('');
  const fmtDate = d => new Date(d + 'T00:00:00Z').toLocaleDateString(ui.dateLocale || 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  const money = (n, cls = '') => `<span class="money ${cls}" data-thb="${n}"><b>${thb(n)}</b> <i>${ui.thb}</i></span>`;
  const img = (file, alt, extra = '', sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 480px', eager = false) => {
    const m = IMG[file];
    if (!m) return `<img src="${BASE}/img/${file}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} ${extra}>`;
    const name = file.replace(/\.[^.]+$/, '');
    const srcset = m.widths.map(w => `${BASE}/img/${name}-${w}.webp ${w}w`).join(', ');
    return `<img src="${BASE}/img/${name}-${m.fallback}.jpg" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} ${extra}>`;
  };
  const heroImg = (file, alt) => img(file, alt, '', '100vw', true);
  const tel = n => `tel:${n.replace(/\s+/g, '')}`;
  const bookUrl = (q = '') => url('book') + q;
  const routeTitle = r => `${stopName(r.a)} ⇄ ${stopName(r.b)}`;
  const legsFor = (a, b) => ({ out: legs.find(l => l.from === a && l.to === b), back: legs.find(l => l.from === b && l.to === a) });

  // ---------- navigation
  const langMenu = key => languages.map(l => `<a href="${urlIn(l.code, key)}" hreflang="${l.code}" lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${l.name}</a>`).join('');
  const curMenu = () => currencies.map(c => `<a href="#" data-cur="${c.code}" role="menuitem"><span>${c.code}</span><small>${c.symbol}</small></a>`).join('');
  let curKey = 'home';
  const switchers = () => `<div class="switch"><details class="dd dd-lang"><summary aria-label="${ui.language}">${I.globe}<span class="lang-code">${lang.code.toUpperCase()}</span>${I.chev}</summary><div class="dd-menu" role="menu">${langMenu(curKey)}</div></details><details class="dd dd-cur"><summary aria-label="${ui.currency}"><span class="cur-code">${lang.currency}</span>${I.chev}</summary><div class="dd-menu" role="menu">${curMenu()}</div></details></div>`;
  const langMenuMobile = key => `<details class="dd dd-lang"><summary>${I.globe}<span>${lang.name}</span>${I.chev}</summary><div class="dd-menu" role="menu">${langMenu(key)}</div></details>`;
  const brand = () => `<a class="brand" href="${url('home')}" aria-label="${esc(site.name)}">${LOGO}<span class="brand-text"><b>${site.shortName} Speedboat</b><span>N. Kai Bae Hut · Koh Chang</span></span></a>`;

  function layout({ key, title, desc, body, jsonld = [], ogImage, cls = '' }) {
    curKey = key;
    const canonical = abs(key);
    desc = trunc(desc, 158);
    const alternates = languages.map(l => `<link rel="alternate" hreflang="${l.code}" href="${site.domain}${urlIn(l.code, key).slice(BASE.length)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${site.domain}${urlIn('en', key).slice(BASE.length)}">`;
    const fonts = 'family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700' + (lang.code === 'th' ? '&family=Noto+Sans+Thai:wght@400;500;700' : '') + (lang.code === 'zh' ? '&family=Noto+Sans+SC:wght@400;500;700' : '');
    const ld = [orgLd(), ...jsonld].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
    const sub = items => `<div class="navsub">${items.map(([label, k, all]) => `<a href="${url(k)}"${k === key ? ' aria-current="page"' : ''}${all ? ' class="all"' : ''}>${label}</a>`).join('')}</div>`;
    const transferItems = [...routes.map(r => [routeTitle(r), 'route:' + r.slug]), [ui.nav.allRoutes, 'transfers', true]];
    const tripItems = [...trips.map(t => [C.trips[t.slug].nav, 'trip:' + t.slug]), [ui.nav.allTrips, 'snorkelling', true]];
    const aboutItems = [[ui.nav.about, 'about'], [ui.nav.fleet, 'fleet'], [ui.nav.islands, 'islands']];
    const inT = key === 'transfers' || key.startsWith('route:'), inS = key === 'snorkelling' || key.startsWith('trip:'), inA = ['about', 'fleet', 'islands'].includes(key);
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
<meta name="theme-color" content="#0f2247">
<link rel="icon" href="${BASE}/img/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="${BASE}/img/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?${fonts}&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/site.css">
${ld}
</head>
<body class="${cls}" data-lang="${lang.code}" data-cur="${lang.currency}">
<a class="skip" href="#main">${ui.skip}</a>
<header class="top" id="top">
  <div class="topbar"><div class="wrap"><span>${I.clock}${site.hours}</span><a href="${tel(site.phone)}">${I.phone}${site.phone}</a><a href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a><span class="season-pill">${I.info}${ui.season.split('.')[0]}</span></div></div>
  <nav class="nav" aria-label="Main"><div class="wrap">
    ${brand()}
    <ul class="nav-links">
      ${li(ui.nav.transfers, 'transfers', transferItems, inT)}
      ${li(ui.nav.snorkelling, 'snorkelling', tripItems, inS)}
      ${li(ui.nav.charter, 'charter')}
      ${li(ui.nav.about, 'about', aboutItems, inA)}
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
  ${mmSub(ui.nav.transfers, transferItems)}
  ${mmSub(ui.nav.snorkelling, tripItems)}
  <a href="${url('charter')}">${ui.nav.charter}</a>
  ${mmSub(ui.nav.about, aboutItems)}
  <a href="${url('contact')}">${ui.nav.contact}</a>
  <div class="mm-row"><div class="mm-field"><span class="mm-label">${ui.language}</span>${langMenuMobile(key)}</div><div class="mm-field"><span class="mm-label">${ui.currency}</span><details class="dd dd-cur"><summary><span class="cur-code">${lang.currency}</span>${I.chev}</summary><div class="dd-menu" role="menu">${curMenu()}</div></details></div></div>
  <div class="mm-actions"><a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a><a class="btn btn-wa" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a></div>
</div>
<main id="main">${body}</main>
${footer(key)}
<script>window.RATES=${JSON.stringify(rates.rates)};window.CURS=${JSON.stringify(currencies.map(c => c.code))};window.LOC=${JSON.stringify(ui.numberLocale || 'en-US')};window.LEGS=${JSON.stringify(legs)};window.STOPNAMES=${JSON.stringify(ui.stops)};${key === 'charter' ? `window.CHARTER=${JSON.stringify({ boats: boats.map(b => ({ pax: b.pax, label: `${C.boats[b.key]} · ${ui.upTo.replace('{n}', b.pax)}` })), itineraries: charters.map(c => ({ key: c.key, name: C.charters[c.key].name, prices: c.prices })) })};` : ''}</script>
<script src="${BASE}/assets/site.js" defer></script>
</body>
</html>`;
  }

  function footer(key) {
    const links = arr => arr.map(([l, k]) => `<li><a href="${url(k)}">${l}</a></li>`).join('');
    return `<footer><div class="wrap">
  <div class="foot">
    <div class="foot-brand">${brand()}<p>${ui.footTagline}</p><span class="licence">${I.shield}${ui.footLicence} ${site.licence}</span></div>
    <div><h3>${ui.footTransfers}</h3><ul>${links([...routes.slice(0, 4).map(r => [routeTitle(r), 'route:' + r.slug]), [ui.nav.allRoutes, 'transfers']])}</ul></div>
    <div><h3>${ui.footTrips}</h3><ul>${links([...trips.map(t => [C.trips[t.slug].nav, 'trip:' + t.slug]), [ui.nav.charter, 'charter'], [ui.nav.islands, 'islands']])}</ul></div>
    <div><h3>${ui.footInfo}</h3><ul>${links([[ui.nav.about, 'about'], [ui.nav.fleet, 'fleet'], [ui.nav.contact, 'contact'], [ui.nav.book, 'book'], [ui.nav.terms, 'terms']])}</ul></div>
    <div><h3>${ui.footContact}</h3><ul class="foot-contact">
      <li><b>${site.fullName}</b><a href="${site.maps}" target="_blank" rel="noopener">${site.address}</a></li>
      <li><a href="${tel(site.phone)}">${site.phone}</a><a href="${tel(site.phone2)}">${site.phone2}</a></li>
      <li><a href="mailto:${site.email}">${site.email}</a></li>
      <li><a href="${site.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a href="${site.social.facebook}" target="_blank" rel="noopener">Facebook</a></li></ul></div>
  </div>
  <div class="foot-langs">${languages.map(l => `<a href="${urlIn(l.code, key)}" hreflang="${l.code}" lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${l.name}</a>`).join('')}</div>
  <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${site.legalName}</span><span class="rates-note">${ui.ratesNote.replace('{date}', rates.date.slice(5, 16))}</span><span>${ui.footPreview}</span></div>
</div></footer>`;
  }

  // ---------- JSON-LD
  function orgLd() {
    return {
      '@context': 'https://schema.org', '@type': ['LocalBusiness', 'TouristInformationCenter'], '@id': site.domain + '/#business',
      name: site.name, alternateName: site.fullName, url: site.domain, telephone: site.phone, email: site.email, foundingDate: String(site.founded),
      image: site.domain + '/img/' + ogJpg(site.ogImage), logo: site.domain + '/img/apple-touch-icon.png',
      address: { '@type': 'PostalAddress', streetAddress: '10/8 Moo 4, Kai Bae Beach', addressLocality: 'Koh Chang', addressRegion: 'Trat', postalCode: '23170', addressCountry: 'TH' },
      geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      openingHours: 'Mo-Su 08:00-17:00', priceRange: '฿฿',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: site.rating, reviewCount: site.reviewCount, bestRating: 5 },
      sameAs: [site.social.facebook, site.tripadvisor],
    };
  }
  const crumbsLd = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, k], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(k) })) });
  const faqLd = keys => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: keys.map(k => ({ '@type': 'Question', name: PG.faq[k][0], acceptedAnswer: { '@type': 'Answer', text: PG.faq[k][1] } })) });
  const tripLd = t => ({ '@context': 'https://schema.org', '@type': 'TouristTrip', name: C.trips[t.slug].name, description: C.trips[t.slug].short, image: site.domain + '/img/' + ogJpg(t.img), url: abs('trip:' + t.slug), touristType: 'Snorkellers', itinerary: { '@type': 'ItemList', itemListElement: t.islands.map((k, i) => ({ '@type': 'ListItem', position: i + 1, name: isl(k) })) }, offers: { '@type': 'Offer', price: t.price, priceCurrency: 'THB', availability: 'https://schema.org/InStock', url: abs('trip:' + t.slug), seller: { '@id': site.domain + '/#business' } }, provider: { '@id': site.domain + '/#business' } });
  const routeLd = r => { const { out, back } = legsFor(r.a, r.b); return { '@context': 'https://schema.org', '@type': 'Service', serviceType: 'Speedboat transfer', name: C.routes[r.slug].title, description: C.routes[r.slug].desc, provider: { '@id': site.domain + '/#business' }, areaServed: [stopName(r.a), stopName(r.b)], offers: [out, back].filter(Boolean).map(l => ({ '@type': 'Offer', name: `${stopName(l.from)} → ${stopName(l.to)} ${l.dep}`, price: l.fare, priceCurrency: 'THB', url: abs('route:' + r.slug) })) }; };

  // ---------- partials
  const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb"><a href="${url('home')}">${ui.breadcrumbHome}</a>${items.map(([n, k], i) => `<i>/</i>${i === items.length - 1 ? `<span>${n}</span>` : `<a href="${url(k)}">${n}</a>`}`).join('')}</nav>`;
  const pageHero = ({ imgFile, alt, crumbItems, kicker, h1, lead = '', extra = '', cls = '' }) => `<header class="page-hero ${cls}">${heroImg(imgFile, alt || '')}<div class="wrap">${crumbs(crumbItems)}${kicker ? `<span class="kicker">${kicker}</span>` : ''}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}${extra}</div></header>`;
  const statsBar = () => `<section class="stats"><div class="wrap stats-grid">${stats.map(([n, s, k]) => `<div class="stat rv"><b><span class="count" data-n="${n}">${n}</span>${s}</b><span>${PG.stats[k]}</span></div>`).join('')}</div></section>`;
  const faqBlock = (keys, title = ui.sections.faq) => `<section class="faq-sec" id="faq"><div class="wrap narrow"><h2 class="rv">${title}</h2><div class="faq rv">${keys.map((k, i) => `<details${i === 0 ? ' open' : ''}><summary>${PG.faq[k][0]}</summary><div>${richP(PG.faq[k][1])}</div></details>`).join('')}</div></div></section>`;
  const quote = key => { const [q, who, ctxt] = PG.testimonials[key]; return `<figure class="quote rv"><blockquote>“${q}”</blockquote><figcaption><b>${who}</b><span>${ctxt}</span></figcaption></figure>`; };
  const ctaBand = (title, textStr, q = '') => `<section class="cta-band rv"><div class="wrap"><div><h2>${title}</h2><p>${textStr}</p></div><div class="cta-actions"><a class="btn btn-primary btn-lg" href="${bookUrl(q)}">${ui.bookNow}</a><a class="btn btn-wa btn-lg" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a></div></div></section>`;
  const contactCard = () => `<ul class="clist">
      <li>${I.pin}<a href="${site.maps}" target="_blank" rel="noopener">${site.address}</a></li>
      <li>${I.wa}<a href="${site.whatsapp}" target="_blank" rel="noopener">${ui.whatsapp}: ${site.phone2}</a></li>
      <li>${I.phone}<span><a href="${tel(site.phone)}">${site.phone}</a><small><a href="${tel(site.phone2)}">${site.phone2}</a> · <a href="${tel(site.phoneOffice)}">${site.phoneOffice}</a></small></span></li>
      <li>${I.mail}<a href="mailto:${site.email}">${site.email}</a></li>
      <li>${I.clock}<span>${site.hours}</span></li></ul>`;
  const seasonNote = () => `<p class="season-note">${I.info}<span>${ui.season}</span></p>`;
  const routeTool = () => `<form class="tool rv" data-none="${esc(ui.tools.noRoute)}" data-book="${url('book')}" data-book-label="${esc(ui.bookTransfer)}" data-dep="${esc(ui.departure)}" data-arr="${esc(ui.arrival)}" data-oneway="${esc(ui.perPerson + ', ' + ui.oneWay)}">
    <label>${ui.tools.from}<select name="from">${stops.map(s => `<option value="${s}">${stopName(s)}</option>`).join('')}</select></label>
    <label>${ui.tools.to}<select name="to">${stops.map(s => `<option value="${s}"${s === 'kohkood' ? ' selected' : ''}>${stopName(s)}</option>`).join('')}</select></label>
    <button class="btn btn-dark btn-lg" type="submit">${ui.tools.find}</button>
    <div class="tool-result" aria-live="polite"></div></form>`;
  const tripCard = (t, i = 0) => { const c = C.trips[t.slug]; return `<a class="pcard rv" href="${url('trip:' + t.slug)}" style="--d:${i * .06}s">
    <span class="pimg">${img(t.img, c.name)}<span class="tag${t.full ? ' red' : ''}">${t.full ? ui.fullDay : ui.halfDay}</span>${t.parkFee ? `<span class="tag right">${PG.islandsPage.park}</span>` : ''}</span>
    <span class="pbody"><span class="pmeta"><span>${Array.isArray(t.hours[0]) ? t.hours.map(h => h.join('–')).join(' / ') : t.hours.join('–')}</span><span>${ui.nIslands.replace('{n}', t.count || t.islands.length)}</span></span>
    <strong>${c.name}</strong><span class="pdesc">${c.short}</span>
    <span class="pfoot"><span class="price">${money(t.price)} <small>${ui.perPerson}</small></span><span class="more">${ui.readMore}${I.arrow}</span></span></span></a>`; };
  const routeCard = (r, i = 0) => { const { out, back } = legsFor(r.a, r.b); return `<a class="pcard route-card rv" href="${url('route:' + r.slug)}" style="--d:${i * .06}s">
    <span class="pimg">${img(r.img, routeTitle(r))}<span class="tag">${ui.nav.transfers}</span></span>
    <span class="pbody"><strong>${I.both}${routeTitle(r)}</strong>
    <span class="route-legs">${[out, back].filter(Boolean).map(l => `<span><span>${stopName(l.from)} ${l.dep} → ${stopName(l.to)} ${l.arr}</span><b>${thb(l.fare)} ${ui.thb}</b></span>`).join('')}</span>
    <span class="pfoot"><span class="price">${money(Math.min(out.fare, back.fare))} <small>${ui.perPerson}, ${ui.oneWay}</small></span><span class="more">${ui.readMore}${I.arrow}</span></span></span></a>`; };
  const islandCard = (k, i = 0) => { const c = C.islands[k]; const onTransfer = stops.includes(k); const by = [...trips.filter(t => t.islands.includes(k)).map(t => C.trips[t.slug].nav), ...(onTransfer ? [PG.islandsPage.transfer] : [])]; return `<div class="pcard island-card rv" id="${k}" style="--d:${(i % 4) * .06}s">
    <span class="pimg">${img(islands[k].img, c.name)}${onTransfer ? `<span class="tag">${PG.islandsPage.transfer}</span>` : ''}</span>
    <span class="pbody"><span class="pmeta">${islands[k].park ? `<span class="park">${PG.islandsPage.park}</span>` : ''}</span><strong>${c.name}</strong><span class="pdesc">${c.text}</span>
    ${by.length ? `<span class="pfoot"><small style="color:var(--muted)">${PG.islandsPage.visitedBy}: ${by.join(' · ')}</small></span>` : ''}</span></div>`; };
  const timetable = (list, withBook = true) => {
    const byFrom = stops.map(s => [s, list.filter(l => l.from === s)]).filter(([, ls]) => ls.length);
    return `<div class="tt-wrap rv"><table class="tt"><thead><tr><th>${ui.tools.from}</th><th>${ui.tools.to}</th><th>${ui.departure}</th><th>${ui.arrival}</th><th style="text-align:right">${ui.fare} (${ui.oneWay})</th>${withBook ? '<th></th>' : ''}</tr></thead><tbody>
      ${byFrom.map(([s, ls]) => ls.map((l, i) => `<tr><td class="from">${i === 0 ? `<b>${stopName(s)}</b>` : ''}</td><td>${stopName(l.to)}</td><td class="time">${l.dep}</td><td class="time">${l.arr}</td><td class="fare">${money(l.fare)}</td>${withBook ? `<td class="book"><a class="btn btn-ghost-dark" href="${bookUrl(`?type=transfer&from=${l.from}&to=${l.to}`)}">${ui.bookNow}</a></td>` : ''}</tr>`).join('')).join('')}
    </tbody></table></div>`;
  };
  const reviewsBlock = () => {
    const H = PG.home;
    const card = (r, i) => { const long = r.text.length > 260; const t = long ? r.text.slice(0, 240).replace(/\s+\S*$/, '') + '…' : r.text; return `<figure class="review rv" style="--d:${(i % 4) * .06}s" lang="${r.lang}"><div class="stars" aria-label="${r.rating}/5">${I.star.repeat(r.rating)}</div><blockquote>${esc(t)}</blockquote>${long ? `<a class="more" href="${site.tripadvisor}" target="_blank" rel="noopener">${H.readOnTa}${I.arrow}</a>` : ''}<figcaption><span class="av" aria-hidden="true">${esc(r.name.trim()[0].toUpperCase())}</span><div><b>${esc(r.name)}</b><time datetime="${r.date}">${fmtDate(r.date)}</time>${r.from ? `<small> · ${esc(r.from)}</small>` : ''}</div></figcaption></figure>`; };
    return `<section class="dark reviews" id="reviews"><div class="wrap">
    <div class="reviews-head rv"><div class="rating-big"><b>${site.rating.toFixed(1)}</b><div><div class="stars">${I.star.repeat(4)}</div><span>${site.reviewCount} ${H.reviews}</span></div></div><div><h2>${H.reviewsTitle}</h2><p class="sub">${H.reviewsText}</p></div><div class="reviews-actions"><a class="btn btn-ghost" href="${site.tripadvisor}" target="_blank" rel="noopener">${I.owl}${H.readOnTa}</a><a class="btn btn-primary" href="${site.tripadvisor}" target="_blank" rel="noopener">${H.writeReview}</a></div></div>
    <div class="reviews-grid">${REVIEWS.reviews.slice(0, 8).map(card).join('')}</div></div></section>`;
  };
  const boatCards = () => `<div class="boat-list">${boats.map((b, i) => `<div class="boat rv" style="--d:${i * .06}s">${img(b.img, C.boats[b.key], '', '(max-width: 700px) 50vw, 240px')}<div><span class="hp">${b.hp}</span><b>${b.pax}<small>${ui.guests}</small></b><span>${C.boats[b.key]}</span></div></div>`).join('')}</div>`;

  // ---------- pages
  function homePage() {
    const H = PG.home;
    const body = `
<header class="hero" id="hero">${heroImg('speedboat-bow-white-sand-beach.jpg', 'Kai Bae Hut speedboat on a white-sand beach')}
  <div class="wrap">
    <span class="kicker">${H.kicker}</span>
    <h1>${H.h1}</h1>
    <p class="lead">${H.intro}</p>
    <div class="hero-actions"><a class="btn btn-primary btn-lg" href="${url('book')}">${ui.bookNow}</a><a class="btn btn-ghost btn-lg" href="${url('transfers')}">${ui.nav.allRoutes}${I.arrow}</a></div>
    <a class="tabadge" href="${site.tripadvisor}" target="_blank" rel="noopener">${I.owl}<b>${site.rating.toFixed(1)}</b><span class="stars" aria-hidden="true">${I.star.repeat(4)}</span><span>${site.reviewCount} ${H.reviews}</span></a>
  </div>
  <ul class="pillars wrap" aria-label="What we do">${H.pillars.map((t, i) => `<li><a href="${url(['transfers', 'snorkelling', 'charter', 'fleet'][i])}"><span class="pt">${t}</span><i>${I.arrow}</i></a></li>`).join('')}</ul>
</header>
<section class="tool-sec"><div class="wrap">
  <div class="section-head rv"><div><h2>${H.toolTitle}</h2><p class="sub">${H.toolText}</p></div><a class="link" href="${url('transfers')}">${ui.nav.allRoutes}${I.arrow}</a></div>
  ${routeTool()}${seasonNote()}
</div></section>
<section class="soft"><div class="wrap">
  <div class="section-head rv"><div><h2>${H.tripsTitle}</h2><p class="sub">${H.tripsText}</p></div><a class="link" href="${url('snorkelling')}">${ui.nav.allTrips}${I.arrow}</a></div>
  <div class="grid grid-3">${trips.map((t, i) => tripCard(t, i)).join('')}</div>
</div></section>
${statsBar()}
<section class="split"><div class="wrap split-grid">
  <div class="split-img duo rv">${img('friends-beside-speedboat.jpg', 'Friends beside a Kai Bae Hut speedboat', '', '(max-width: 900px) 50vw, 25vw')}${img('speedboat-guests-jumping.jpg', 'Guests jumping from the bow', '', '(max-width: 900px) 50vw, 25vw')}</div>
  <div class="split-text rv"><span class="eyebrow">${ui.nav.charter}</span><h2>${H.charterTitle}</h2><p>${H.charterText}</p><a class="btn btn-dark" href="${url('charter')}">${ui.nav.charter}${I.arrow}</a></div>
</div></section>
${reviewsBlock()}
<section class="split alt"><div class="wrap split-grid">
  <div class="split-text rv"><span class="eyebrow">${ui.nav.about}</span><h2>${H.aboutTitle}</h2><p>${H.aboutText}</p><a class="btn btn-dark" href="${url('about')}">${ui.nav.about}${I.arrow}</a></div>
  <div class="split-img rv">${img('speedboat-guests-standing-bow.jpg', 'Guests on the bow of a Kai Bae Hut speedboat', '', '(max-width: 900px) 100vw, 50vw')}</div>
</div></section>
<section class="soft"><div class="wrap">
  <div class="section-head rv"><div><h2>${H.islandsTitle}</h2><p class="sub">${H.islandsText}</p></div><a class="link" href="${url('islands')}">${ui.nav.islands}${I.arrow}</a></div>
  <div class="grid grid-4">${['kohrang', 'kohwai', 'kohmak', 'kohkood'].map((k, i) => `<a class="pcard rv" href="${url('islands')}#${k}" style="--d:${i * .06}s"><span class="pimg">${img(islands[k].img, isl(k))}</span><span class="pbody"><strong>${isl(k)}</strong><span class="pdesc">${C.islands[k].short}</span></span></a>`).join('')}</div>
</div></section>
<section id="contact"><div class="wrap contact-grid">
  <div class="rv"><h2>${H.contactTitle}</h2><p>${H.contactText}</p>${contactCard()}<div class="hero-actions"><a class="btn btn-wa" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a><a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a></div></div>
  <div class="map rv"><iframe src="${site.mapsEmbed}" loading="lazy" title="${ui.mapTitle}" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
</div></section>`;
    return layout({ key: 'home', title: H.title, desc: H.desc, body, cls: 'home' });
  }

  function transfersPage() {
    const Tp = PG.transfers;
    const body = pageHero({ imgFile: 'speedboat-guests-on-bow.jpg', alt: Tp.h1, crumbItems: [[ui.nav.transfers, 'transfers']], kicker: Tp.kicker, h1: Tp.h1, lead: Tp.intro,
      extra: `<nav class="jump" aria-label="${ui.jump}"><a href="#timetable">${ui.sections.timetable}</a><a href="#routes">${ui.route}s</a><a href="#how">${ui.sections.howItWorks}</a><a href="#boarding">${ui.sections.boarding}</a><a href="#faq">${ui.sections.faq}</a></nav>` }) + `
<section class="tool-sec" id="timetable"><div class="wrap">${routeTool()}${seasonNote()}
  <h2 class="rv" style="margin-top:40px">${ui.sections.timetable}</h2>${timetable(legs)}<p class="tt-note">${Tp.childrenText}</p>
</div></section>
<section class="soft" id="routes"><div class="wrap"><h2 class="rv">${ui.route}s</h2><div class="grid grid-3">${routes.map((r, i) => routeCard(r, i)).join('')}</div></div></section>
<section id="how"><div class="wrap"><h2 class="rv">${ui.sections.howItWorks}</h2><div class="steps">${Tp.howItWorks.map(([b, p], i) => `<div class="step rv" style="--d:${i * .06}s"><b>${b}</b><p>${p}</p></div>`).join('')}</div></div></section>
<section class="soft" id="boarding"><div class="wrap"><h2 class="rv">${ui.sections.boarding}</h2><ul class="boarding-list rv">${stops.map(s => `<li><b>${I.pin}${stopName(s)}</b><span>${ui.boarding[boarding[s]]}</span></li>`).join('')}</ul>
  <div class="two" style="margin-top:36px"><div><h3>${ui.sections.children}</h3><p>${Tp.childrenText}</p></div><div><h3>${Tp.seasonTitle}</h3><p>${Tp.seasonText}</p></div></div></div></section>
${faqBlock(Tp.faq)}
${ctaBand(ui.bookTransfer, Tp.intro, '?type=transfer')}`;
    return layout({ key: 'transfers', title: Tp.title, desc: Tp.desc, body, jsonld: [crumbsLd([[ui.nav.transfers, 'transfers']]), faqLd(Tp.faq)], ogImage: 'speedboat-guests-on-bow.jpg' });
  }

  function routePage(r) {
    const c = C.routes[r.slug], Rp = PG.routePage, { out, back } = legsFor(r.a, r.b);
    const via = stops.filter(s => s !== r.a && s !== r.b && stops.indexOf(s) > Math.min(stops.indexOf(r.a), stops.indexOf(r.b)) && stops.indexOf(s) < Math.max(stops.indexOf(r.a), stops.indexOf(r.b)));
    const legCard = (l, label) => `<div class="leg rv"><span class="dir-label">${label}</span><div class="stops">${stopName(l.from)}${I.arrow}${stopName(l.to)}</div><div class="times"><div><small>${ui.departure}</small><b>${l.dep}</b></div><div><small>${ui.arrival}</small><b>${l.arr}</b></div></div><span class="price big">${money(l.fare)} <small>${ui.perPerson}, ${ui.oneWay}</small></span><a class="btn btn-primary" href="${bookUrl(`?type=transfer&from=${l.from}&to=${l.to}`)}">${ui.bookTransfer}</a></div>`;
    const crumbItems = [[ui.nav.transfers, 'transfers'], [routeTitle(r), 'route:' + r.slug]];
    const body = pageHero({ imgFile: r.img, alt: routeTitle(r), crumbItems, kicker: Rp.kicker, h1: c.title, lead: c.intro, extra: `<div class="badges"><span class="badge">${I.clock}${out.dep} / ${back.dep}</span><span class="badge">${I.taxi}${ui.pickup}</span><span class="badge badge-hot">${ui.from} ${thb(Math.min(out.fare, back.fare))} ${ui.thb}</span></div>` }) + `
<section class="tool-sec"><div class="wrap"><div class="leg-cards">${legCard(out, stops.indexOf(r.a) < stops.indexOf(r.b) ? Rp.southbound : Rp.northbound)}${legCard(back, stops.indexOf(r.a) < stops.indexOf(r.b) ? Rp.northbound : Rp.southbound)}</div>
  ${via.length ? `<p class="tt-note">${Rp.viaNote.replace('{stops}', via.map(stopName).join(', '))}</p>` : ''}${seasonNote()}</div></section>
<section class="soft"><div class="wrap split-grid">
  <div class="split-text rv"><h2>${Rp.tipsTitle}</h2><ul class="ticks big">${c.tips.map(t => `<li>${t}</li>`).join('')}</ul><h3 style="margin-top:28px">${ui.sections.boarding}</h3><ul class="boarding-list">${[r.a, r.b].map(s => `<li><b>${I.pin}${stopName(s)}</b><span>${ui.boarding[boarding[s]]}</span></li>`).join('')}</ul></div>
  <div class="split-img rv">${img(r.img2, routeTitle(r), '', '(max-width: 900px) 100vw, 50vw')}</div>
</div></section>
<section><div class="wrap"><h2 class="rv">${ui.sections.timetable}</h2>${timetable(legs.filter(l => [r.a, r.b].includes(l.from)), true)}<p class="tt-note">${PG.transfers.childrenText}</p></div></section>
<section class="soft"><div class="wrap"><h2 class="rv">${Rp.otherRoutes}</h2><div class="grid grid-3">${routes.filter(x => x.slug !== r.slug).slice(0, 3).map((x, i) => routeCard(x, i)).join('')}</div></div></section>
${faqBlock(['luggage', r.b === 'kohkood' || r.a === 'kohkood' ? 'koodPier' : 'return', 'rough', 'pay'])}
${ctaBand(c.title, c.desc, `?type=transfer&from=${r.a}&to=${r.b}`)}`;
    return layout({ key: 'route:' + r.slug, title: `${c.title} – ${ui.nav.transfers} | Nornou`, desc: c.desc, body, jsonld: [crumbsLd(crumbItems), routeLd(r)], ogImage: r.img });
  }

  function snorkellingPage() {
    const S = PG.snorkelling;
    const body = pageHero({ imgFile: 'snorkellers-peace-sign.jpg', alt: S.h1, crumbItems: [[ui.nav.snorkelling, 'snorkelling']], kicker: S.kicker, h1: S.h1, lead: S.intro }) + `
<section class="tool-sec"><div class="wrap"><div class="grid grid-3">${trips.map((t, i) => tripCard(t, i)).join('')}</div></div></section>
<section class="soft"><div class="wrap split-grid">
  <div class="split-img duo rv">${img('speedboat-stern-engines.jpg', 'Speedboat engines', '', '(max-width: 900px) 50vw, 25vw')}${img('snorkeller-over-coral-reef.jpg', 'Snorkeller over a coral reef', '', '(max-width: 900px) 50vw, 25vw')}</div>
  <div class="split-text rv"><h2>${S.whyTitle}</h2><ul class="ticks big">${S.why.map(t => `<li>${t}</li>`).join('')}</ul><h3 style="margin-top:28px">${ui.sections.includes}</h3><ul class="ticks">${C.tripIncludes.map(t => `<li>${t}</li>`).join('')}</ul></div>
</div></section>
<section><div class="wrap"><h2 class="rv">${ui.sections.gallery}</h2><div class="gallery rv">${['anemone-clownfish.jpg', 'boy-underwater-peace.jpg', 'table-coral-reef.jpg', 'snorkeller-couple-underwater.jpg', 'sea-fan-coral.jpg', 'boy-with-sergeant-fish.jpg', 'swimmer-above-fish-school.jpg', 'snorkellers-rescue-ring.jpg'].map(f => img(f, '', '', '(max-width: 700px) 50vw, 25vw')).join('')}</div></div></section>
${faqBlock(S.faq)}
${ctaBand(ui.bookTrip, S.intro, '?type=trip')}`;
    return layout({ key: 'snorkelling', title: S.title, desc: S.desc, body, jsonld: [crumbsLd([[ui.nav.snorkelling, 'snorkelling']]), faqLd(S.faq)], ogImage: 'snorkellers-peace-sign.jpg' });
  }

  function tripPage(t) {
    const c = C.trips[t.slug], Tp = PG.tripPage;
    const hours = Array.isArray(t.hours[0]) ? t.hours.map(h => h.join('–')).join(' / ') : t.hours.join('–');
    const crumbItems = [[ui.nav.snorkelling, 'snorkelling'], [c.name, 'trip:' + t.slug]];
    const includes = [...(t.lunch ? [C.tripIncludesLunch] : []), ...C.tripIncludes];
    const body = pageHero({ imgFile: t.img, alt: c.name, crumbItems, kicker: c.kicker, h1: c.h1, extra: `<div class="badges"><span class="badge">${I.clock}${hours}</span><span class="badge">${I.island}${t.islands.map(isl).join(' · ')}</span><span class="badge">${I.food}${t.lunch ? ui.lunch : ui.noLunch}</span><span class="badge">${I.taxi}${ui.pickup}</span>${t.parkFee ? `<span class="badge badge-hot">${ui.parkFeeExtra}</span>` : ''}</div>`, cls: 'product-hero' }) + `
<section class="product"><div class="wrap product-grid">
  <div class="pmain rv"><p class="lead-in">${c.lead}</p>${c.intro.map(p => `<p class="intro-p">${p}</p>`).join('')}
    <section class="pblock"><h2>${ui.sections.schedule}</h2><ul class="timeline">${c.schedule.map(([tm, d]) => `<li><b>${tm}</b><span>${d}</span></li>`).join('')}</ul></section>
    <section class="pblock"><h2>${ui.sections.includes}</h2><ul class="ticks">${includes.map(x => `<li>${x}</li>`).join('')}</ul></section>
    <section class="pblock"><h2>${ui.sections.notIncluded}</h2><ul class="ticks x">${c.notIncluded.map(x => `<li>${x}</li>`).join('')}</ul></section>
    <section class="pblock"><h2>${ui.nav.islands}</h2><div class="grid grid-4">${t.islands.map((k, i) => `<a class="pcard rv" href="${url('islands')}#${k}" style="--d:${i * .06}s"><span class="pimg">${img(islands[k].img, isl(k), '', '(max-width: 700px) 50vw, 240px')}</span><span class="pbody"><strong style="font-size:17px">${isl(k)}</strong><span class="pdesc" style="font-size:14px">${C.islands[k].short}</span></span></a>`).join('')}</div></section>
    <section class="pblock"><h2>${Tp.photos}</h2><div class="gallery">${t.gallery.map(f => img(f, c.name, '', '(max-width: 700px) 50vw, 200px')).join('')}</div></section>
  </div>
  <aside class="pside rv"><div class="pside-card"><span class="pside-title">${c.name}</span>
    <span class="price big">${money(t.price)} <small>${ui.perPerson}</small></span>
    <ul class="facts"><li>${I.user}<span>${ui.adult}</span><b>${thb(t.price)} ${ui.thb}</b></li><li>${I.users}<span>${ui.child} <small>(${Tp.childAge})</small></span><b>${thb(t.child)} ${ui.thb}</b></li><li>${I.clock}<span>${ui.hours}</span><b>${hours}</b></li><li>${I.cal}<span>${ui.duration}</span><b>${t.full ? ui.fullDay : ui.halfDay}</b></li><li>${I.island}<span>${ui.islandsVisited}</span><b>${t.count || t.islands.length}</b></li>${t.parkFee ? `<li>${I.info}<span>${PG.islandsPage.park}</span><b>+${parkFee.adult} / ${parkFee.child} ${ui.thb}</b></li>` : ''}</ul>
    <a class="btn btn-primary btn-lg" href="${bookUrl(`?type=trip&trip=${encodeURIComponent(c.name)}`)}">${ui.bookTrip}</a>
    <a class="btn btn-wa" href="${site.whatsapp}?text=${encodeURIComponent(c.name)}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a>
    <p class="pside-note">${Tp.bookNote}</p></div>${t.testimonial ? quote(t.testimonial) : ''}<div class="aside-img">${img(t.img2, c.name)}</div></aside>
</div></section>
${faqBlock(t.faq)}
<section class="soft"><div class="wrap"><h2 class="rv">${ui.sections.related}</h2><div class="grid grid-3">${trips.filter(x => x.slug !== t.slug).map((x, i) => tripCard(x, i)).join('')}<a class="pcard rv" href="${url('charter')}" style="--d:.12s"><span class="pimg">${img('friends-beside-speedboat.jpg', ui.nav.charter)}<span class="tag red">${ui.nav.charter}</span></span><span class="pbody"><strong>${PG.home.charterTitle}</strong><span class="pdesc">${C.charters.waiLaoyaKlum.short}</span><span class="pfoot"><span class="price"><small>${ui.from}</small> ${money(3500)} <small>${ui.perBoat}</small></span><span class="more">${ui.readMore}${I.arrow}</span></span></span></a></div></div></section>
${ctaBand(c.name, c.short, `?type=trip&trip=${encodeURIComponent(c.name)}`)}`;
    return layout({ key: 'trip:' + t.slug, title: `${c.name} – ${thb(t.price)} THB | ${site.name}`, desc: c.short, body, jsonld: [crumbsLd(crumbItems), tripLd(t), faqLd(t.faq)], ogImage: t.img });
  }

  function charterPage() {
    const Ch = PG.charter;
    const matrix = `<div class="matrix-wrap rv"><table class="matrix"><thead><tr><th>${ui.itinerary}</th>${boats.map(b => `<th>${ui.upTo.replace('{n}', b.pax)}<small>${b.hp}</small></th>`).join('')}</tr></thead><tbody>
      ${charters.map(c => `<tr data-key="${c.key}" tabindex="0"><td><b>${C.charters[c.key].name}</b><small>${c.full ? ui.fullDay : ui.halfDay} · ${c.islands.map(isl).join(', ')}${c.parkFee ? ` · ${ui.parkFeeExtra}` : ''}</small></td>${c.prices.map(p => `<td>${money(p)}</td>`).join('')}</tr>`).join('')}
    </tbody></table></div><p class="tt-note">${Ch.tableNote}</p>`;
    const calc = `<div class="calc rv" data-suggested="${esc(ui.tools.suggested)}" data-per-boat="${esc(ui.pricePerBoat)}" data-per-person="${esc(ui.perPerson)}" data-too-many="${esc(ui.enquire)}" data-book="${url('book')}" data-book-label="${esc(ui.askCharter)}">
      <h3>${ui.tools.calcTitle}</h3><p>${ui.tools.calcHint}</p>
      <div class="calc-row"><label>${ui.itinerary}<select name="itinerary">${charters.map(c => `<option value="${c.key}">${C.charters[c.key].name}</option>`).join('')}</select></label><label>${ui.groupSize}<input type="number" name="pax" min="1" max="30" value="6" inputmode="numeric"></label></div>
      <div class="calc-out" aria-live="polite"></div></div>`;
    const body = pageHero({ imgFile: 'speedboat-guests-jumping.jpg', alt: Ch.h1, crumbItems: [[ui.nav.charter, 'charter']], kicker: Ch.kicker, h1: Ch.h1, extra: `<div class="badges"><span class="badge">${I.users}4–30 ${ui.guests}</span><span class="badge">${I.taxi}${ui.pickup}</span><span class="badge">${I.food}${ui.lunch}</span><span class="badge badge-hot">${ui.from} 3,500 ${ui.thb} ${ui.perBoat}</span></div>` }) + `
<section class="tool-sec"><div class="wrap charter-grid"><div class="rv">${Ch.intro.map(p => `<p class="intro-p">${p}</p>`).join('')}<ul class="ticks">${C.tripIncludes.slice(0, 2).map(t => `<li>${t}</li>`).join('')}<li>${C.tripIncludesLunch} (${ui.fullDay.toLowerCase()})</li><li>${C.tripIncludes[5]}</li></ul></div>${calc}</div></section>
<section class="soft" id="prices"><div class="wrap"><h2 class="rv">${Ch.tableTitle}</h2>${matrix}</div></section>
<section><div class="wrap"><div class="section-head rv"><h2>${ui.itinerary}</h2></div><div class="grid grid-4">${charters.map((c, i) => `<div class="pcard rv" style="--d:${i * .05}s"><span class="pimg">${img(c.img, C.charters[c.key].name, '', '(max-width: 700px) 100vw, 300px')}<span class="tag${c.full ? ' red' : ''}">${c.full ? ui.fullDay : ui.halfDay}</span></span><span class="pbody"><span class="pmeta"><span>${c.islands.map(isl).join(' · ')}</span></span><strong style="font-size:18px">${C.charters[c.key].name}</strong><span class="pdesc" style="font-size:14px">${C.charters[c.key].short}</span><span class="pfoot"><span class="price"><small>${ui.from}</small> ${money(c.prices[0])}</span></span></span></div>`).join('')}</div></div></section>
<section class="soft"><div class="wrap"><div class="section-head rv"><div><h2>${ui.nav.fleet}</h2></div><a class="link" href="${url('fleet')}">${ui.nav.fleet}${I.arrow}</a></div>${boatCards()}</div></section>
<section><div class="wrap"><div class="section-head rv"><div><h2>${Ch.islandsTitle}</h2><p class="sub">${Ch.islandsText}</p></div><a class="link" href="${url('islands')}">${ui.nav.islands}${I.arrow}</a></div><div class="grid grid-4">${['kohrang', 'kohwai', 'kohlaoya', 'kohklum', 'kohmak', 'kohkradad', 'kohkham', 'kohyuak'].map((k, i) => `<a class="pcard rv" href="${url('islands')}#${k}" style="--d:${(i % 4) * .06}s"><span class="pimg">${img(islands[k].img, isl(k), '', '(max-width: 700px) 50vw, 300px')}</span><span class="pbody"><strong style="font-size:17px">${isl(k)}</strong><span class="pdesc" style="font-size:14px">${C.islands[k].short}</span></span></a>`).join('')}</div></div></section>
${faqBlock(Ch.faq)}
${ctaBand(ui.askCharter, Ch.intro[1], '?type=charter')}`;
    return layout({ key: 'charter', title: Ch.title, desc: Ch.desc, body, jsonld: [crumbsLd([[ui.nav.charter, 'charter']]), faqLd(Ch.faq)], ogImage: 'speedboat-guests-jumping.jpg' });
  }

  function islandsPage() {
    const Ip = PG.islandsPage;
    const order = ['kohchang', 'kohwai', 'kohmak', 'kohkood', 'kohrang', 'kohyak', 'kohnok', 'kohmapring', 'kohlaoya', 'kohklum', 'kohkradad', 'kohkham', 'kohyuak', 'kohman', 'kohplee', 'kohrom'];
    const body = pageHero({ imgFile: 'snorkeller-rocky-islet.jpg', alt: Ip.h1, crumbItems: [[ui.nav.islands, 'islands']], kicker: Ip.kicker, h1: Ip.h1, lead: Ip.intro, extra: `<nav class="jump" aria-label="${ui.jump}">${order.map(k => `<a href="#${k}">${isl(k)}</a>`).join('')}</nav>` }) + `
<section class="tool-sec"><div class="wrap"><div class="grid grid-3">${order.map((k, i) => islandCard(k, i)).join('')}</div></div></section>
${ctaBand(ui.nav.charter, PG.home.charterText, '?type=charter')}`;
    return layout({ key: 'islands', title: Ip.title, desc: Ip.desc, body, jsonld: [crumbsLd([[ui.nav.islands, 'islands']])], ogImage: 'snorkeller-rocky-islet.jpg' });
  }

  function fleetPage() {
    const F = PG.fleet;
    const body = pageHero({ imgFile: 'speedboat-stern-engines.jpg', alt: F.h1, crumbItems: [[ui.nav.about, 'about'], [ui.nav.fleet, 'fleet']], kicker: F.kicker, h1: F.h1, lead: F.intro }) + `
<section class="tool-sec"><div class="wrap">${boatCards()}</div></section>
<section class="soft"><div class="wrap split-grid">
  <div class="split-text rv"><h2>${F.safetyTitle}</h2><ul class="ticks big">${F.safety.map(t => `<li>${t}</li>`).join('')}</ul><span class="licence">${I.shield}${ui.footLicence} ${site.licence}</span></div>
  <div class="split-img duo rv">${img('speedboat-kai-bae-hut-bay.jpg', 'Kai Bae Hut speedboat in a bay', '', '(max-width: 900px) 50vw, 25vw')}${img('snorkellers-rescue-ring.jpg', 'Snorkellers with a rescue ring', '', '(max-width: 900px) 50vw, 25vw')}</div>
</div></section>
<section><div class="wrap"><div class="grid grid-3">${boats.map((b, i) => `<div class="rv" style="--d:${i * .06}s"><h3>${C.boats[b.key]} · ${b.pax} ${ui.guests}</h3><p class="sub">${C.boatBlurb[b.key]}</p></div>`).join('')}</div></div></section>
${ctaBand(ui.askCharter, PG.home.charterText, '?type=charter')}`;
    return layout({ key: 'fleet', title: F.title, desc: F.desc, body, jsonld: [crumbsLd([[ui.nav.about, 'about'], [ui.nav.fleet, 'fleet']])], ogImage: 'speedboat-stern-engines.jpg' });
  }

  function aboutPage() {
    const A = PG.about;
    const body = pageHero({ imgFile: 'speedboat-guests-standing-bow.jpg', alt: A.h1, crumbItems: [[ui.nav.about, 'about']], kicker: A.kicker, h1: A.h1 }) + `
<section><div class="wrap split-grid">
  <div class="split-text rv">${A.text.map(t => `<p class="intro-p">${t}</p>`).join('')}<span class="licence">${I.shield}${ui.footLicence} ${site.licence}</span></div>
  <div class="split-img duo rv">${img('speedboat-kai-bae-hut-bay.jpg', 'Kai Bae Hut speedboat', '', '(max-width: 900px) 50vw, 25vw')}${img('snorkeller-life-jacket-island.jpg', 'Snorkeller in a Kai Bae Hut life jacket', '', '(max-width: 900px) 50vw, 25vw')}</div>
</div></section>
${statsBar()}
<section class="soft"><div class="wrap"><h2 class="rv">${A.valuesTitle}</h2><div class="values">${A.values.map(([b, p], i) => `<div class="value rv" style="--d:${i * .06}s"><b>${b}</b><p>${p}</p></div>`).join('')}</div></div></section>
<section><div class="wrap"><div class="grid grid-3">${[['fleet', 'speedboat-stern-engines.jpg'], ['islands', 'snorkeller-rocky-islet.jpg'], ['contact', 'speedboat-bow-white-sand-beach.jpg']].map(([k, f], i) => `<a class="pcard rv" href="${url(k)}" style="--d:${i * .08}s"><span class="pimg">${img(f, ui.nav[k])}</span><span class="pbody"><strong>${ui.nav[k]}</strong><span class="pfoot"><span></span><span class="more">${ui.readMore}${I.arrow}</span></span></span></a>`).join('')}</div></div></section>
<section class="soft" id="contact"><div class="wrap contact-grid"><div class="rv"><h2>${A.contactTitle}</h2>${contactCard()}</div><div class="map rv"><iframe src="${site.mapsEmbed}" loading="lazy" title="${ui.mapTitle}" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div></section>`;
    return layout({ key: 'about', title: A.title, desc: A.desc, body, jsonld: [crumbsLd([[ui.nav.about, 'about']])], ogImage: 'speedboat-guests-standing-bow.jpg' });
  }

  function contactPage() {
    const Cp = PG.contact;
    const body = pageHero({ imgFile: 'speedboat-kai-bae-hut-bay.jpg', alt: Cp.h1, crumbItems: [[ui.nav.contact, 'contact']], kicker: Cp.kicker, h1: Cp.h1, lead: Cp.intro, cls: 'short' }) + `
<section><div class="wrap contact-grid">
  <div class="rv"><h2>${ui.footContact}</h2>${contactCard()}<p>${Cp.findUs}</p><div class="hero-actions"><a class="btn btn-wa" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a><a class="btn btn-ghost-dark" href="${site.social.facebook}" target="_blank" rel="noopener">${I.fb}Facebook</a><a class="btn btn-primary" href="${url('book')}">${ui.bookNow}</a></div>
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
    return layout({ key: 'contact', title: Cp.title, desc: Cp.desc, body, jsonld: [crumbsLd([[ui.nav.contact, 'contact']])], ogImage: 'speedboat-kai-bae-hut-bay.jpg' });
  }

  function bookPage() {
    const B = PG.book, F = ui.form;
    const options = [...legs.map(l => `${stopName(l.from)} → ${stopName(l.to)}`), ...trips.map(t => C.trips[t.slug].name), ...charters.map(c => C.charters[c.key].name)];
    const body = pageHero({ imgFile: 'speedboat-guests-jumping.jpg', alt: B.h1, crumbItems: [[ui.nav.book, 'book']], h1: B.h1, lead: B.kicker, cls: 'short' }) + `
<section><div class="wrap book-grid">
  <form class="form rv" method="POST" action="${url('book')}" data-netlify="true" name="booking" data-mail="${site.email}" data-subject="${esc(F.mailSubject)}" netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="booking"><p class="hp"><label>Don’t fill this out: <input name="bot-field"></label></p>
    <fieldset class="seg-wrap" style="border:0;padding:0;margin:0"><legend style="font-family:var(--font-h);font-weight:600;font-size:14.5px;color:var(--navy);margin-bottom:8px">${F.type}</legend><div class="seg">${['transfer', 'trip', 'charter'].map((t, i) => `<label><input type="radio" name="type" value="${t}"${i === 0 ? ' checked' : ''}>${F.types[t]}</label>`).join('')}</div></fieldset>
    <label>${F.which}<input name="which" list="which-list" autocomplete="off"><datalist id="which-list">${options.map(o => `<option value="${esc(o)}">`).join('')}</datalist></label>
    <div class="row"><label>${F.date}<input type="date" name="date" required></label><label>${F.returnDate}<input type="date" name="return"></label></div>
    <small style="color:var(--muted);margin-top:-8px">${F.dateHelp}</small>
    <div class="row"><label>${F.adults}<input type="number" name="adults" min="1" max="60" value="2" inputmode="numeric"></label><label>${F.children}<input type="number" name="children" min="0" max="30" value="0" inputmode="numeric"></label><label>${F.infants}<input type="number" name="infants" min="0" max="10" value="0" inputmode="numeric"></label></div>
    <label>${F.pickup}<input name="hotel" autocomplete="organization"><small>${F.pickupHelp}</small></label>
    <div class="row"><label>${F.name}<input name="name" required autocomplete="name"></label><label>${F.email}<input type="email" name="email" required autocomplete="email"></label></div>
    <label>${F.phone}<input name="phone" type="tel" autocomplete="tel"></label>
    <label>${F.message}<textarea name="message" rows="4"></textarea></label>
    <button class="btn btn-primary btn-lg" type="submit" data-sending="${F.sending}">${F.submit}</button>
    <p class="form-note" data-ok="${esc(F.thanks)}" data-fallback="${esc(F.mailFallback.replace('{email}', site.email))}"></p>
  </form>
  <aside class="rv"><div class="pside-card"><span class="pside-title">${B.aside}</span><p style="margin:0;color:var(--ink-2);font-size:15px">${B.asideText}</p><a class="btn btn-wa" href="${site.whatsapp}" target="_blank" rel="noopener">${I.wa}${ui.whatsapp}</a>${contactCard()}<a class="btn btn-ghost-dark" href="${url('transfers')}">${ui.sections.timetable}${I.arrow}</a></div></aside>
</div></section>`;
    return layout({ key: 'book', title: B.title, desc: B.desc, body, jsonld: [crumbsLd([[ui.nav.book, 'book']])], ogImage: 'speedboat-guests-jumping.jpg' });
  }

  function termsPage() {
    const Tm = PG.terms;
    const body = pageHero({ imgFile: 'reef-rocks-underwater.jpg', alt: '', crumbItems: [[ui.nav.terms, 'terms']], kicker: Tm.kicker, h1: Tm.h1, cls: 'short' }) +
      `<section><div class="wrap narrow prose rv"><span class="draft">${Tm.draft}</span>${Tm.sections.map(([h, ps]) => `<h2>${h}</h2>${ps.map(p => `<p>${p}</p>`).join('')}`).join('')}</div></section>`;
    return layout({ key: 'terms', title: Tm.title, desc: Tm.desc, body });
  }

  const notFound = () => layout({ key: 'home', title: PG.notFound.title, desc: PG.notFound.text, body: `<section class="nf"><div class="wrap narrow"><span class="kicker">404</span><h1>${PG.notFound.h1}</h1><p class="lead">${PG.notFound.text}</p><div class="hero-actions"><a class="btn btn-primary" href="${url('home')}">${ui.breadcrumbHome}</a><a class="btn btn-dark" href="${url('transfers')}">${ui.nav.transfers}</a><a class="btn btn-dark" href="${url('snorkelling')}">${ui.nav.snorkelling}</a><a class="btn btn-dark" href="${url('contact')}">${ui.nav.contact}</a></div></div></section>` });

  return { url, urlIn, homePage, transfersPage, routePage, snorkellingPage, tripPage, charterPage, islandsPage, fleetPage, aboutPage, contactPage, bookPage, termsPage, notFound };
}

// ---------------------------------------------------------------- WRITE
fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, content) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };
const written = [];
for (const lang of languages) {
  const c = ctx(lang);
  const page = (key, html) => { const u = c.url(key); write(u.slice(BASE.length + 1) + 'index.html', html); written.push([u, key, lang.code]); };
  page('home', c.homePage());
  page('transfers', c.transfersPage());
  for (const r of routes) page('route:' + r.slug, c.routePage(r));
  page('snorkelling', c.snorkellingPage());
  for (const t of trips) page('trip:' + t.slug, c.tripPage(t));
  page('charter', c.charterPage()); page('islands', c.islandsPage()); page('fleet', c.fleetPage()); page('about', c.aboutPage());
  page('contact', c.contactPage()); page('book', c.bookPage()); page('terms', c.termsPage());
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
console.log(`Built ${written.length} pages (${routes.length} routes, ${trips.length} trips, ${languages.length} languages) → dist/${BASE ? ' (BASE=' + BASE + ')' : ''}${DEMO ? ' [demo/noindex]' : ''}`);
