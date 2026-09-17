// Multilingual static site generator for a dive centre. No dependencies.
//   npm run build            → build-images.js (responsive webp/jpg into .cache/img) + build.js → dist/
//   node update-rates.js     → refresh src/rates.json (build.js does this automatically when rates are older than 7 days)
const fs = require('fs');
const path = require('path');
const { site, languages, currencies, products, courseGroups, diveSites, redirects, wa } = require('./src/data.js');
const IMG = fs.existsSync(path.join(__dirname, 'src', 'img-manifest.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'img-manifest.json'), 'utf8')) : {};
const ogJpg = (file) => IMG[file] ? file.replace(/\.[^.]+$/, '') + '-' + IMG[file].fallback + '.jpg' : file;
// Exchange rates: refresh automatically when older than 7 days (fail-soft: offline builds keep the old file).
const RATES_FILE = path.join(__dirname, 'src', 'rates.json');
if (Date.now() - new Date(require(RATES_FILE).date).getTime() > 7 * 864e5 && !process.env.KK_OFFLINE) {
  try { require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'update-rates.js')], { stdio: 'inherit', timeout: 15000 }); } catch (e) { console.warn('rates not refreshed:', e.message); }
}
const rates = JSON.parse(fs.readFileSync(RATES_FILE, 'utf8'));

const OUT = path.join(__dirname, 'dist');
const BASE = (process.env.BASE || '').replace(/\/$/, ''); // '' in production, e.g. '/dive-sites/kohkood' on GitHub Pages
const DEMO = !!process.env.DEMO;
const P = Object.fromEntries(products.map(p => [p.slug, p]));
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const thb = n => n.toLocaleString('en-US');
const css = fs.readFileSync(path.join(__dirname, 'src', 'site.css'), 'utf8');

// ---------------------------------------------------------------- LOCALES (deep-merged over English so partial translations still build)
const deepMerge = (base, over) => {
  if (Array.isArray(over) || typeof over !== 'object' || over === null) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = deepMerge(base ? base[k] : undefined, over[k]);
  return out;
};
const EN = require('./src/i18n/en.js');
const locales = Object.fromEntries(languages.map(l => {
  const f = path.join(__dirname, 'src', 'i18n', l.code + '.js');
  const loc = fs.existsSync(f) ? require(f) : {};
  return [l.code, deepMerge(EN, loc)];
}));

// ---------------------------------------------------------------- ICONS
const I = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8Z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  g: '<svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.2Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.6H2.1v2.9A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14a6.6 6.6 0 0 1 0-4.2V6.9H2.1a11 11 0 0 0 0 9.9L5.8 14Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 6.9L5.8 9.8c.9-2.7 3.3-4.4 6.2-4.4Z"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 3h3l-7.2 8.2L21.8 21h-6.6l-4.6-6-5.3 6H2.2l7.6-8.7L1.7 3h6.8l4.2 5.5L17.5 3Zm-1.1 16.2h1.8L7.1 4.7H5.2l11.2 14.5Z"/></svg>',
  globe: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
};

// ---------------------------------------------------------------- PER-LANGUAGE CONTEXT
// Everything that depends on the current language is built through `ctx(lang)`.
function ctx(lang) {
  const L = locales[lang.code];
  const ui = L.ui;
  const prefix = BASE + (lang.path ? `/${lang.path}` : '');
  const url = key => key === 'home' ? `${prefix}/` : `${prefix}/${L.slugs[key]}/`;
  const abs = key => site.domain + url(key).slice(BASE.length);
  // URL of the same page in another language
  const urlIn = (code, key) => { const l = languages.find(x => x.code === code); const pre = BASE + (l.path ? `/${l.path}` : ''); return key === 'home' ? `${pre}/` : `${pre}/${locales[code].slugs[key]}/`; };
  const text = p => L.products[p.slug];
  const fact = (kind, v) => (ui.facts[kind] && ui.facts[kind][v]) || v;
  const money = (n, cls = '') => `<span class="money ${cls}" data-thb="${n}"><b>${thb(n)}</b> <i>THB</i></span>`;
  const priceLabel = p => ui.priceLabels[p.slug] ? `<span class="money-label">${ui.priceLabels[p.slug]}</span>` : `${p.from ? `<span class="from">${ui.from}</span> ` : ''}${money(p.price)}`;
  const included = p => {
    const inc = L.inclusions;
    if (typeof p.included === 'string') return inc[p.included];
    const c = p.included;
    return [inc.manuals[c.manual], ...inc.courseBase.pre, ...(c.extra || []).map(e => inc.extras[e]), inc.divesLabels[c.dives], ...inc.courseBase.post];
  };
  const bookBtn = (p, cls = 'btn btn-primary', label = ui.bookNow) => p.rezdy
    ? `<a class="${cls}" href="${site.rezdyBase}/calendarWidget/${p.rezdy}" target="_blank" rel="noopener" data-rezdy="${p.rezdy}">${label}</a>`
    : `<a class="${cls}" href="${wa(ui.waHi(text(p).name))}" target="_blank" rel="noopener">${I.wa}${label === ui.bookNow ? ui.askWa : label}</a>`;
  const waBtn = (msg, label = ui.chatWa, cls = 'btn btn-wa') => `<a class="${cls}" href="${wa(msg)}" target="_blank" rel="noopener">${I.wa}${label}</a>`;
  // Responsive <img>: webp srcset from the manifest, jpg fallback in src, intrinsic size for CLS. sizes defaults to a card-ish layout.
  const img = (file, alt, extra = '', sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px', eager = false) => {
    const m = IMG[file];
    if (!m) return `<img src="${BASE}/img/${file}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} ${extra}>`;
    const name = file.replace(/\.[^.]+$/, '');
    const srcset = m.widths.map(w => `${BASE}/img/${name}-${w}.webp ${w}w`).join(', ');
    return `<img src="${BASE}/img/${name}-${m.fallback}.jpg" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} ${extra}>`;
  };
  const heroImg = (file, alt) => img(file, alt, '', '100vw', true);
  const days = (on, aqua) => `<div class="days">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => `<span class="${on.includes(d) ? 'on' + (aqua ? ' aqua' : '') : ''}">${ui.days[d]}</span>`).join('')}</div>`;

  const NAV = [['funDiving', 'koh-kood-fun-diving'], ['courses', 'courses'], ['snorkelling', 'snorkeling-koh-kood-thailand'], ['diveSites', 'diveSites'], ['about', 'about'], ['contact', 'contact']];

  // ---------- layout
  function layout({ key, title, desc, body, jsonld = [], ogImage }) {
    const canonical = abs(key);
    const alternates = languages.map(l => `<link rel="alternate" hreflang="${l.code}" href="${site.domain}${urlIn(l.code, key)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${site.domain}${urlIn('en', key)}">`;
    const ld = [localBusinessLd(), ...jsonld].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
    const langMenu = languages.map(l => `<a href="${urlIn(l.code, key)}" hreflang="${l.code}" lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${l.name}</a>`).join('');
    const curSel = `<details class="dd dd-cur"><summary aria-label="${ui.currency}"><span class="cur-code">${lang.currency}</span></summary><div class="dd-menu">${currencies.map(c => `<a href="#" data-cur="${c.code}"><span>${c.code}</span><small>${c.symbol}</small></a>`).join('')}</div></details>`;
    return `<!DOCTYPE html>
<html lang="${L.htmlLang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">${DEMO ? '<meta name="robots" content="noindex, nofollow">' : ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${alternates}
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="${L.htmlLang}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.domain}/img/${ogJpg(ogImage || 'reef-sunlight.jpg')}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%230a7f8f'/%3E%3Ccircle cx='16' cy='16' r='7' fill='none' stroke='%23fff' stroke-width='3'/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Inter:wght@400;500;600&family=Noto+Sans+Thai:wght@400;500;700&family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/site.css">
${ld}
</head>
<body class="${key === 'home' ? 'home' : ''}" data-lang="${lang.code}" data-cur="${lang.currency}">
<a class="skip" href="#main">${ui.skip}</a>
<nav class="nav" id="nav"><div class="wrap">
  <a class="brand" href="${url('home')}" aria-label="${esc(site.name)}"><img src="${BASE}/img/logo.webp" alt="${esc(site.name)}" width="120" height="44"></a>
  <div class="nav-links">${NAV.map(([k, s]) => `<a href="${url(s)}"${s === key ? ' aria-current="page"' : ''}>${ui.nav[k]}</a>`).join('')}</div>
  <div class="nav-cta">
    <details class="dd dd-lang"><summary aria-label="${ui.language}">${I.globe}<span>${lang.code.toUpperCase()}</span></summary><div class="dd-menu">${langMenu}</div></details>
    ${curSel}
    <a class="btn btn-phone" href="tel:${site.phone.replace(/s+/g, '')}" aria-label="${ui.phoneWa}: ${site.phone}">${I.phone}<span>${site.phone}</span></a>
    <a class="btn btn-dark" href="${url('koh-kood-fun-diving')}#book">${ui.bookNow}</a>
    <button class="burger" aria-label="${ui.menu}" aria-controls="mm" aria-expanded="false" onclick="openMenu()">${I.menu}</button>
  </div>
</div></nav>
<div class="mobile-menu" id="mm">
  <button class="close" aria-label="${ui.close}" onclick="closeMenu()">×</button>
  ${NAV.map(([k, s]) => `<a href="${url(s)}">${ui.nav[k]}</a>`).join('')}
  <div class="mm-row">
    <div class="mm-field"><span class="mm-label">${ui.language}</span><details class="dd dd-lang"><summary>${I.globe}<span>${lang.name}</span></summary><div class="dd-menu">${langMenu}</div></details></div>
    <div class="mm-field"><span class="mm-label">${ui.currency}</span><details class="dd dd-cur"><summary><span class="cur-code">${lang.currency}</span></summary><div class="dd-menu">${currencies.map(c => `<a href="#" data-cur="${c.code}"><span>${c.code}</span><small>${c.symbol}</small></a>`).join('')}</div></details></div>
  </div>
  <div class="mm-actions"><a class="btn btn-primary" href="${url('koh-kood-fun-diving')}#book" onclick="closeMenu()">${ui.bookNow}</a><a class="btn btn-ghost" href="tel:${site.phone.replace(/s+/g, '')}">${I.phone}${site.phone}</a>${waBtn('', ui.chatWa)}</div>
</div>
<main id="main">${body}</main>
${footer(key)}
<a class="fab" href="${site.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.wa}</a>
<script>window.RATES=${JSON.stringify(rates.rates)};window.CURS=${JSON.stringify(Object.fromEntries(currencies.map(c => [c.code, c])))};</script>
<script src="${BASE}/assets/site.js" defer></script>
</body>
</html>`;
  }

  function footer(key) {
    const links = arr => arr.map(([l, s]) => `<li><a href="${url(s)}">${l}</a></li>`).join('');
    return `<footer><div class="wrap">
  <div class="foot">
    <div>
      <a class="brand" href="${url('home')}"><img src="${BASE}/img/logo.webp" alt="${esc(site.name)}" width="120" height="44"></a>
      <p style="margin-top:16px;max-width:36ch">${ui.footTagline}</p>
      <div class="socials"><a href="${site.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a><a href="${site.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a><a href="${site.social.twitter}" target="_blank" rel="noopener" aria-label="X / Twitter">${I.x}</a></div>
    </div>
    <div><h4>${ui.footDiving}</h4><ul>${links([[text(P['koh-kood-fun-diving']).name, 'koh-kood-fun-diving'], [text(P['koh-rang-diving']).name, 'koh-rang-diving'], [text(P['special-wreck-dives-koh-kood']).name, 'special-wreck-dives-koh-kood'], [text(P['snorkeling-koh-kood-thailand']).name, 'snorkeling-koh-kood-thailand'], [L.pages.diveSites.h1, 'diveSites']])}</ul></div>
    <div><h4>${ui.footCourses}</h4><ul>${links([[L.pages.courses.h1, 'courses'], [text(P['padi-discover-scuba-diving']).name, 'padi-discover-scuba-diving'], [text(P['padi-open-water-course-koh-kood']).name, 'padi-open-water-course-koh-kood'], [text(P['advanced-open-water-diver-koh-kood']).name, 'advanced-open-water-diver-koh-kood'], [text(P['padi-divemaster']).name, 'padi-divemaster']])}</ul></div>
    <div><h4>${ui.footInfo}</h4><ul>${links([[ui.nav.about, 'about'], [ui.footContact, 'contact'], [ui.footTermsBooking, 'termsBooking'], [ui.footTerms, 'termsGeneral']])}
    </ul></div>
    <div><h4>${ui.footPlan}</h4><ul>
      <li><a href="${site.partners.guide}" target="_blank" rel="noopener">${ui.planGuide}</a></li>
      <li><a href="${site.partners.flights}" target="_blank" rel="noopener">${ui.planFlights}</a></li>
      <li><a href="${site.partners.rezdy}" target="_blank" rel="noopener">${ui.planRezdy}</a></li>
      <li><a href="${site.partners.scubakit}" target="_blank" rel="noopener">${ui.planScubakit}</a></li>
      <li class="foot-langs">${languages.map(l => `<a href="${urlIn(l.code, key)}" hreflang="${l.code}" lang="${l.code}">${l.name}</a>`).join('')}</li></ul></div>
  </div>
  <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${site.legalName} · ${site.address}</span><span class="rates-note">${ui.ratesNote(rates.date.slice(0, 16))}</span><span>${ui.footPreview}</span></div>
</div></footer>`;
  }

  // ---------- JSON-LD
  function localBusinessLd() {
    return {
      '@context': 'https://schema.org', '@type': 'LocalBusiness', '@id': site.domain + '/#business',
      name: site.name, url: site.domain, telephone: site.phone, email: site.email, image: site.domain + '/img/' + ogJpg('reef-sunlight.jpg'),
      address: { '@type': 'PostalAddress', streetAddress: '101 Klong Chao', addressLocality: 'Ko Kut', addressRegion: 'Trat', postalCode: '23000', addressCountry: 'TH' },
      geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      openingHours: 'Mo-Su 09:00-18:00', foundingDate: String(site.founded), priceRange: '฿฿',
      aggregateRating: { '@type': 'AggregateRating', ratingValue: site.rating, reviewCount: site.reviewCount },
      sameAs: Object.values(site.social),
    };
  }
  const productLd = p => !p.price ? [] : [{
    '@context': 'https://schema.org', '@type': 'Product', name: text(p).name, description: text(p).desc, image: site.domain + '/img/' + ogJpg(p.img), url: abs(p.slug),
    brand: { '@type': 'Brand', name: 'PADI' },
    offers: { '@type': 'Offer', price: p.price, priceCurrency: 'THB', availability: 'https://schema.org/InStock', url: abs(p.slug), seller: { '@id': site.domain + '/#business' } },
  }];
  const faqLd = qs => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: qs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });
  const crumbsLd = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, k], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: abs(k) })) });

  // ---------- partials
  const crumbs = items => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([n, k], i) => i === items.length - 1 ? `<span>${n}</span>` : `<a href="${url(k)}">${n}</a>`).join('<i>/</i>')}</nav>`;
  const productCard = (p, delay = 0) => `<a class="card rv" href="${url(p.slug)}" style="transition-delay:${delay}s">
    ${p.featured ? `<span class="tag">${ui.mostPopular}</span>` : ''}${img(p.img, text(p).name)}
    <div class="card-body"><span class="price">${priceLabel(p)}</span><h3>${text(p).name}</h3><p>${text(p).short}</p><span class="link">${ui.details}</span></div></a>`;
  const courseTile = (p, delay = 0) => `<a class="course rv${p.featured ? ' featured' : ''}" href="${url(p.slug)}" style="transition-delay:${delay}s">
    <span class="cimg">${img(p.img, text(p).name)}</span><span class="lvl">${text(p).level}</span><h3>${text(p).name}</h3><p>${text(p).short}</p>
    <div class="meta"><span>${fact('duration', p.duration)}</span><span>${fact('dives', p.dives)} ${ui.divesWord}</span>${p.minAge ? `<span>${ui.agePlus(p.minAge)}</span>` : ''}</div>
    <div class="cp"><b>${priceLabel(p)}</b><span class="link">${ui.view}</span></div></a>`;
  const scheduleBlock = () => `<div class="sched">
    <div class="sched-card rv">${img('soft-coral.jpg', L.site.schedule.local.title)}<h3>${L.site.schedule.local.title}</h3><p class="sub">${L.site.schedule.local.text}</p>${days(site.schedule.local)}<p class="note">${L.site.schedule.local.note}</p></div>
    <div class="sched-card rv" style="transition-delay:.1s">${img('island-aerial.jpg', L.site.schedule.park.title)}<h3>${L.site.schedule.park.title}</h3><p class="sub">${L.site.schedule.park.text}</p>${days(site.schedule.park, true)}<p class="note">${L.site.schedule.park.note}</p></div></div>`;
  // English readers expect 12-hour times; every other locale on the site uses 24-hour.
  const clock = (t) => { if (lang.code !== 'en') return t; const [h, m] = t.split(':').map(Number); return (h % 12 || 12) + (m ? ':' + String(m).padStart(2, '0') : '') + (h >= 12 ? ' PM' : ' AM'); };
  const dayTimeline = () => `<ul class="timeline">${L.site.day.map(([b, s], i) => `<li><time>${clock(site.dayTimes[i])}</time><span class="dot"></span><div><b>${b}</b><span>${s}</span></div></li>`).join('')}</ul>`;
  const reviewsBlock = () => `<section class="dark" id="reviews"><div class="wrap">
    <div class="rating-big rv"><b>${site.rating}</b><div><div class="stars">★★★★★</div><small>${ui.reviewsBased(site.reviewCount)}</small>
      <a class="gbadge" href="${site.googleReviewUrl}" target="_blank" rel="noopener" style="margin-top:6px">${I.g} ${ui.readReviews}</a></div></div>
    <div class="reviews">${site.reviews.map((r, i) => `<div class="review rv" style="transition-delay:${i * .1}s" lang="en"><div class="stars">★★★★★</div><p>"${r.text}"</p><div class="who"><div class="av">${r.name[0]}</div><div><b>${r.name}</b><span>${r.ctx}</span></div></div></div>`).join('')}</div></div></section>`;
  const faqBlock = (qs, title = ui.faqTitle, cls = 'sand') => `<section class="${cls}" id="faq"><div class="wrap">
    <div style="text-align:center;margin-bottom:40px" class="rv"><span class="eyebrow" style="justify-content:center">${ui.goodToKnow}</span><h2>${title}</h2></div>
    <div class="faq rv">${qs.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}</summary><p>${a}</p></details>`).join('')}</div></div></section>`;
  const contactBlock = () => `<div class="contact">
    <div class="contact-card rv">
      <div><span class="eyebrow" style="color:var(--aqua)">${ui.findUs}</span><h2>${L.pages.contact.cardTitle}</h2></div>
      <div class="crow">${I.pin}<div><small>${ui.diveShop}</small>${site.address}</div></div>
      <div class="crow">${I.phone}<div><small>${ui.phoneWa}</small><a href="${site.phoneHref}">${site.phone}</a></div></div>
      <div class="crow">${I.mail}<div><small>${ui.email}</small><a href="mailto:${site.email}">${site.email}</a></div></div>
      <div class="crow">${I.clock}<div><small>${ui.open}</small>${ui.hours}</div></div>
      ${waBtn('', ui.messageWa)}<a class="btn btn-primary" href="${url('koh-kood-fun-diving')}#book">${ui.bookOnline}</a>
    </div>
    <div class="map rv" style="transition-delay:.1s"><iframe src="${site.mapEmbed}&hl=${lang.code}" loading="lazy" title="${esc(site.name)}" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>`;
  const related = slugs => `<section class="sand"><div class="wrap">
    <div class="section-head rv"><div><span class="eyebrow">${ui.alsoLike}</span><h2>${ui.keepExploring}</h2></div></div>
    <div class="grid grid-3">${slugs.map((s, i) => productCard(P[s], i * .1)).join('')}</div></div></section>`;
  const pageHero = (imgFile, alt, crumbItems, eyebrow, h1, lead, extra = '') => `<header class="page-hero short">
    ${heroImg(imgFile, alt)}
    <div class="wrap">${crumbs(crumbItems)}<span class="eyebrow light">${eyebrow}</span><h1>${h1}</h1><p>${lead}</p>${extra}</div></header>`;

  // ---------- pages
  function homePage() {
    const S = L.site;
    const trips = ['koh-kood-fun-diving', 'padi-open-water-course-koh-kood', 'snorkeling-koh-kood-thailand'].map(s => P[s]);
    const body = `
<header class="hero" id="top">${heroImg('reef-sunlight.jpg', '')}
  <div class="wrap"><h1>${S.heroTitle}</h1><p>${S.heroSub}</p>
    <div class="hero-actions"><a class="btn btn-primary" href="${url('koh-kood-fun-diving')}#book">${ui.bookDive}</a>${waBtn('', ui.chatWa, 'btn btn-ghost')}</div>
    <div class="trust">
      <div><b>${site.rating} <span class="stars">★★★★★</span></b><span>${ui.reviewsCount(site.reviewCount)}</span></div>
      <div><b>${ui.since(site.founded)}</b><span>${ui.padi5}</span></div>
      <div><b>${ui.max4}</b><span>${ui.diversPerGuide}</span></div>
      <div><b>${ui.languagesN(site.teachingLanguages.length)}</b><span>${site.teachingLanguages.join(' · ')}</span></div>
    </div>
    <a class="scroll-hint" href="#dive" aria-hidden="true" tabindex="-1"><span>${ui.scroll}</span><i></i></a></div></header>
<section id="dive"><div class="wrap">
  <div class="section-head rv"><div><span class="eyebrow">${S.chooseEyebrow}</span><h2>${S.chooseTitle}</h2></div><p class="lead">${S.chooseLead}</p></div>
  <div class="grid grid-3">${trips.map((p, i) => productCard(p, i * .1)).join('')}</div>
  <p class="center-link rv"><a class="link" href="${url('courses')}">${ui.seeAllCourses}</a></p></div></section>
<section class="sand" id="schedule"><div class="wrap">
  <div class="section-head rv"><div><span class="eyebrow">${S.scheduleEyebrow}</span><h2>${S.scheduleTitle}</h2></div><p class="lead">${S.scheduleLead}</p></div>
  ${scheduleBlock()}
  <p class="center-link rv"><a class="link" href="${url('diveSites')}">${ui.allDiveSites}</a><span class="sep" aria-hidden="true">·</span><a class="link" href="${url('special-wreck-dives-koh-kood')}">${ui.wreckLink}</a></p></div></section>
<section id="why"><div class="wrap">
  <div class="section-head rv"><div><span class="eyebrow">${S.whyEyebrow}</span><h2>${S.whyTitle}</h2></div></div>
  <div class="why-grid">${S.whyUs.map(([h, t], i) => `<div class="why rv" style="transition-delay:${i * .07}s"><b>${h}</b><p>${t}</p></div>`).join('')}</div></div></section>
<section class="sand" id="team"><div class="wrap"><div class="team">
  <div class="team-img rv">${img('dive-boat.jpg', site.name)}</div>
  <div class="rv" style="transition-delay:.1s"><span class="eyebrow">${S.teamEyebrow}</span><h2 style="margin-bottom:14px">${S.teamTitle}</h2><p class="lead" style="margin-bottom:28px">${S.teamLead}</p>
    <div class="people">${site.team.map(t => `<div class="person"><div class="av">${t.name[0]}</div><div><small>${S.team[t.key].role}</small><b>${t.name}</b><span>${S.team[t.key].blurb}</span><div class="langs">${t.langs.map(l => `<i>${l}</i>`).join('')}</div></div></div>`).join('')}</div>
    <p style="margin-top:22px"><a class="link" href="${url('about')}">${S.aboutLink}</a></p></div></div></div></section>
${reviewsBlock()}
${faqBlock(S.faq.slice(0, 5))}
<section id="contact"><div class="wrap">${contactBlock()}</div></section>`;
    return layout({ key: 'home', title: S.metaTitle, desc: S.metaDesc, body, jsonld: [faqLd(S.faq)] });
  }

  function productPage(p) {
    const T = text(p);
    const isTrip = p.type === 'trip';
    const parent = isTrip ? [ui.nav.funDiving, 'koh-kood-fun-diving'] : [L.pages.courses.h1, 'courses'];
    const facts = [[ui.duration, fact('duration', p.duration)], [ui.dives, fact('dives', p.dives)], p.minAge ? [ui.minAge, p.minAge] : null, [ui.group, isTrip ? ui.maxPerGuide : ui.maxPerInstructor]].filter(Boolean);
    const body = `
<header class="page-hero">${heroImg(p.img, T.name)}
  <div class="wrap">${crumbs([[ui.home, 'home'], parent, [T.name, p.slug]])}<span class="eyebrow light">${T.level}</span><h1>${T.h1}</h1><p>${T.short}</p>
    <div class="facts">${facts.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('')}</div></div></header>
<section class="product"><div class="wrap product-grid">
  <div class="prose">
    ${T.intro.map(t => `<p class="lead-in">${t}</p>`).join('')}
    ${T.steps ? `<h2>${ui.howItWorks}</h2><ol class="steps">${T.steps.map(([h, d]) => `<li><div><b>${h}</b><span>${d}</span></div></li>`).join('')}</ol>` : ''}
    ${(T.sections || []).map(s => `<h2>${s.h}</h2>${s.p ? `<p>${s.p}</p>` : ''}${s.list ? `<ul class="incl">${s.list.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}${s.after ? `<p>${s.after}</p>` : ''}`).join('')}
    ${T.modules ? `<h2>${T.modulesTitle}</h2>${T.modulesLead ? `<p>${T.modulesLead}</p>` : ''}<ol class="syllabus">${T.modules.map(([h, items], i) => `<li><span class="num">${String(i + 1).padStart(2, '0')}</span><div><b>${h}</b><ul>${items.map(x => `<li>${x}</li>`).join('')}</ul></div></li>`).join('')}</ol>` : ''}
    ${T.packages ? `<h2>${T.packagesTitle}</h2>${T.packagesLead ? `<p>${T.packagesLead}</p>` : ''}<div class="packages">${T.packages.map(pk => `<div class="package"><div class="package-head"><b>${pk.name}</b><p>${pk.desc}</p></div><table class="ptable"><thead><tr><th></th><th>${ui.withoutEquip}</th><th>${ui.withEquip}</th></tr></thead><tbody>${pk.rows.map(r => `<tr><th>${r.label}</th><td>${money(r.without)}</td><td>${money(r.with)}</td></tr>`).join('')}</tbody></table></div>`).join('')}</div>` : ''}
    ${T.equipment ? `<h2>${T.equipmentTitle}</h2><p>${T.equipmentLead}</p><ul class="incl two-col">${T.equipment.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}
    ${T.see ? `<h2>${ui.whatYouSee}</h2><p>${T.see}</p>` : ''}
    ${p.showSchedule ? `<h2>${ui.weeklySchedule}</h2>${scheduleBlock()}` : ''}
    ${p.showDay ? `<h2>${ui.typicalDay}</h2>${dayTimeline()}` : ''}
    <h2>${ui.prerequisites}</h2><ul class="incl">${T.prereqs.map(x => `<li>${x}</li>`).join('')}</ul>
    ${T.faq ? `<h2>${ui.faqProduct}</h2><div class="faq inline">${T.faq.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>` : ''}
  </div>
  <aside class="side" id="book"><div class="side-card">
    <small class="side-label">${p.tiers ? ui.prices : ui.price}</small>
    ${p.tiers ? `<div class="plist">${p.tiers.map(t => `<div class="prow${t.pop ? ' best' : ''}"><div class="pl"><b>${ui.tiers[t.key]}</b>${ui.tierUnits[t.key] ? `<small>${ui.tierUnits[t.key]}</small>` : ''}${t.per ? `<small>${money(t.per, 'per')} ${ui.perDive}</small>` : ''}${t.pop ? `<em>${ui.bestValue}</em>` : ''}</div><div class="pr">${money(t.price)}</div></div>`).join('')}</div>` : `<div class="big-price">${priceLabel(p)}</div>`}
    <div class="side-actions">${p.rezdy ? bookBtn(p) + waBtn(ui.waAsk(T.name), ui.askWa) : waBtn(ui.waAsk(T.name), ui.askWa, 'btn btn-primary') + `<a class="btn btn-ghost-dark" href="mailto:${site.email}?subject=${encodeURIComponent(T.name)}">${I.mail}${ui.emailUs}</a>`}</div>
    ${p.rezdy ? `<p class="side-note">${ui.bookingNote} ${ui.rezdyWindow}</p>` : ''}
    <h4>${ui.included}</h4><ul class="incl small">${included(p).map(x => `<li>${x}</li>`).join('')}</ul>
  </div></aside>
</div></section>
${related(p.related)}
<div class="mobile-bar"><div><small>${p.from ? ui.from : ui.price}</small><b>${ui.priceLabels[p.slug] ? ui.priceLabels[p.slug] : money(p.price)}</b></div>${bookBtn(p)}</div>`;
    return layout({ key: p.slug, title: T.title, desc: T.desc, body, ogImage: p.img, jsonld: [...productLd(p), crumbsLd([[ui.home, 'home'], parent, [T.name, p.slug]]), ...(T.faq ? [faqLd(T.faq)] : [])] });
  }

  function coursesPage() {
    const pg = L.pages.courses;
    const body = pageHero('beginner-shallow-reef.jpg', pg.h1, [[ui.home, 'home'], [pg.h1, 'courses']], pg.eyebrow, pg.h1, pg.lead) +
      courseGroups.map((g, gi) => { const ps = products.filter(p => p.group === g); return `<section class="${gi % 2 ? 'sand' : ''}"><div class="wrap">
  <div class="section-head rv"><div><span class="eyebrow">${pg.groups[g][0]}</span><h2>${pg.groups[g][1]}</h2></div></div>
  <div class="courses">${ps.map((p, i) => courseTile(p, i * .05)).join('')}</div>${gi === courseGroups.length - 1 ? `<p class="courses-note">${pg.also}</p>` : ''}</div></section>`; }).join('') +
      `<section><div class="wrap"><div class="section-head rv"><div><span class="eyebrow">${pg.chooserEyebrow}</span><h2>${pg.chooserTitle}</h2></div></div><div class="why-grid three">${pg.chooser.map(([h, t, k], i) => `<a class="why rv" href="${url(k)}" style="transition-delay:${i * .07}s"><b>${h}</b><p>${t}</p><span class="link">${ui.view}</span></a>`).join('')}</div></div></section>` +
      faqBlock(L.site.faq.filter((_, i) => [2, 6, 7].includes(i)), ui.beforeYouBook);
    return layout({ key: 'courses', title: pg.title, desc: pg.desc, body, ogImage: 'beginner-shallow-reef.jpg', jsonld: [crumbsLd([[ui.home, 'home'], [pg.h1, 'courses']])] });
  }

  const contactForm = () => {
    const f = ui.form;
    const opts = products.map(p => `<option value="${esc(text(p).name)}">${esc(text(p).name)}</option>`).join('');
    return `<section class="sand"><div class="wrap form-wrap">
  <div class="form-intro rv"><span class="eyebrow">${ui.nav.contact}</span><h2>${f.title}</h2><p class="lead">${f.lead}</p></div>
  <form class="cform rv" name="contact" method="POST" action="${site.formEndpoint || ''}" data-netlify="true" netlify-honeypot="company" data-mail="${site.email}" novalidate>
    <input type="hidden" name="form-name" value="contact"><input type="hidden" name="lang" value="${lang.code}"><p class="hp"><label>Company <input name="company" tabindex="-1" autocomplete="off"></label></p>
    <div class="frow two">
      <label><span>${f.name}</span><input name="name" type="text" required autocomplete="name"></label>
      <label><span>${f.email}</span><input name="email" type="email" required autocomplete="email" inputmode="email"></label>
    </div>
    <div class="frow two">
      <label><span>${f.dates}</span><input name="dates" type="text" placeholder="${esc(f.datesHint)}"></label>
      <label><span>${f.interest}</span><select name="interest"><option value="">${f.interestAny}</option>${opts}</select></label>
    </div>
    <label><span>${f.message}</span><textarea name="message" rows="5" required></textarea></label>
    <div class="factions"><button class="btn btn-primary" type="submit"><span>${f.send}</span></button><small class="fnote">${site.formEndpoint ? '' : f.mailFallback}</small></div>
    <p class="fdone" hidden><b>${f.sent}</b> ${f.sentText}</p>
    <p class="ferr" hidden>${f.error} <a href="mailto:${site.email}">${site.email}</a>.</p>
  </form></div></section>`;
  };
  function contactPage() {
    const pg = L.pages.contact;
    const body = pageHero('dive-boat.jpg', pg.h1, [[ui.home, 'home'], [ui.nav.contact, 'contact']], pg.eyebrow, pg.h1, pg.lead) +
      `<section><div class="wrap">${contactBlock()}</div></section>` + contactForm() + faqBlock(L.site.faq);
    return layout({ key: 'contact', title: pg.title, desc: pg.desc, body, ogImage: 'dive-boat.jpg', jsonld: [faqLd(L.site.faq), crumbsLd([[ui.home, 'home'], [ui.nav.contact, 'contact']])] });
  }

  function aboutPage() {
    const pg = L.pages.about, S = L.site;
    const body = pageHero('dive-boat.jpg', pg.h1, [[ui.home, 'home'], [ui.nav.about, 'about']], pg.eyebrow, pg.h1, pg.lead) + `
<section><div class="wrap product-grid">
  <div class="prose">${pg.story.map((t, i) => `<p class="${i === 0 ? 'lead-in' : ''}">${t}</p>`).join('')}
    <h2>${pg.safetyTitle}</h2>${pg.safety.map(t => `<p>${t}</p>`).join('')}
    <h2>${pg.boatTitle}</h2><p>${pg.boat}</p>
    <h2>${pg.islandTitle}</h2><p>${pg.island}</p></div>
  <aside class="side"><div class="side-card">
    <small class="side-label">${S.teamEyebrow}</small>
    <div class="people">${site.team.map(t => `<div class="person"><div class="av">${t.name[0]}</div><div><small>${S.team[t.key].role}</small><b>${t.name}</b><span>${S.team[t.key].blurb}</span><div class="langs">${t.langs.map(l => `<i>${l}</i>`).join('')}</div></div></div>`).join('')}</div>
    <div class="side-actions" style="margin-top:18px">${waBtn('', ui.chatWa)}<a class="btn btn-primary" href="${url('koh-kood-fun-diving')}#book">${ui.bookDive}</a></div>
  </div></aside></div></section>
<section class="sand"><div class="wrap"><div class="section-head rv"><div><span class="eyebrow">${pg.eyebrow}</span><h2>${S.whyEyebrow}</h2></div></div>
  <div class="why-grid">${S.whyUs.map(([h, t], i) => `<div class="why rv" style="transition-delay:${i * .07}s"><b>${h}</b><p>${t}</p></div>`).join('')}</div></div></section>
${reviewsBlock()}`;
    return layout({ key: 'about', title: pg.title, desc: pg.desc, body, ogImage: 'dive-boat.jpg', jsonld: [crumbsLd([[ui.home, 'home'], [ui.nav.about, 'about']])] });
  }

  function diveSitesPage() {
    const pg = L.pages.diveSites;
    const area = a => `<section class="${a === 'kood' ? 'sand' : ''}"><div class="wrap">
  <div class="section-head rv"><div><span class="eyebrow">${pg.areas[a][1]}</span><h2>${pg.areas[a][0]}</h2></div><p class="lead">${pg.areas[a][2]}</p></div>
  <div class="sites">${diveSites.filter(s => s.area === a).map((s, i) => `<div class="site rv" style="transition-delay:${i * .06}s">${img(s.img, pg.sites[s.key][0])}<div><div class="site-head"><h3>${pg.sites[s.key][0]}</h3><span>${s.depth}</span></div><p>${pg.sites[s.key][1]}</p></div></div>`).join('')}</div></div></section>`;
    const body = pageHero('coral-wall.jpg', pg.h1, [[ui.home, 'home'], [pg.h1, 'diveSites']], pg.eyebrow, pg.h1, pg.lead) + area('rang') + area('kood') + area('wreck') + `
<section class="sand"><div class="wrap"><div class="section-head rv"><div><span class="eyebrow">${ui.goodToKnow}</span><h2>${pg.conditionsTitle}</h2></div></div>
  <div class="why-grid">${pg.conditions.map(([h, t], i) => `<div class="why rv" style="transition-delay:${i * .07}s"><b>${h}</b><p>${t}</p></div>`).join('')}</div>
  <p style="margin-top:28px;font-size:.85rem;color:var(--muted)">${pg.note}</p></div></section>
<section><div class="wrap"><div class="section-head rv"><div><span class="eyebrow">${L.site.scheduleEyebrow}</span><h2>${L.site.scheduleTitle}</h2></div></div>${scheduleBlock()}</div></section>`;
    return layout({ key: 'diveSites', title: pg.title, desc: pg.desc, body, ogImage: 'coral-wall.jpg', jsonld: [crumbsLd([[ui.home, 'home'], [pg.h1, 'diveSites']])] });
  }

  function textPage(key) {
    const pg = L.pages[key];
    const body = `<header class="page-hero short plain"><div class="wrap">${crumbs([[ui.home, 'home'], [pg.h1, key]])}<h1>${pg.h1}</h1></div></header>
<section><div class="wrap"><div class="prose narrow">${pg.note ? `<p class="note">${pg.note}</p>` : ''}
  ${pg.sections.map(([h, t]) => `<h2>${h}</h2><p>${t}</p>`).join('')}
  <p style="margin-top:32px">${pg.questions} <a class="link" href="${site.whatsapp}" target="_blank" rel="noopener">${ui.messageWa}</a> ${pg.or} <a href="mailto:${site.email}">${site.email}</a>.</p></div></div></section>`;
    return layout({ key, title: pg.title, desc: pg.desc, body });
  }

  const notFound = () => layout({ key: 'home', title: ui.notFound, desc: ui.notFound, body: `<header class="page-hero short plain"><div class="wrap"><h1>${ui.notFound}</h1><p>${ui.notFoundText} <a class="link" href="${url('home')}">${ui.home}</a> · <a class="link" href="${url('courses')}">${L.pages.courses.h1}</a></p></div></header>` });

  return { L, url, urlIn, homePage, productPage, coursesPage, contactPage, aboutPage, diveSitesPage, textPage, notFound };
}

// ---------------------------------------------------------------- CLIENT JS
const clientJs = `
const nav=document.getElementById('nav');
const onScroll=()=>nav.classList.toggle('solid',scrollY>40);onScroll();addEventListener('scroll',onScroll,{passive:true});
document.documentElement.classList.replace('no-js','js');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
// Rezdy modal: a fresh iframe per open so the spinner shows until the widget paints
// Rezdy insists on taking over the top window at checkout (its forms target _top) and offers no way back,
// so booking opens in its own centred window: our site stays open behind it, and closing the window returns the visitor here.
// Popup blocked or mobile → the link's target=_blank opens a new tab instead.
document.querySelectorAll('a[data-rezdy]').forEach(a=>a.addEventListener('click',e=>{
  if(matchMedia('(max-width:760px)').matches)return;
  const w=Math.min(820,screen.availWidth-40),h=Math.min(920,screen.availHeight-60);
  const left=Math.round((screen.availWidth-w)/2+(screen.availLeft||0)),top=Math.round((screen.availHeight-h)/2+(screen.availTop||0));
  const win=window.open(a.href,'rezdy','popup=yes,width='+w+',height='+h+',left='+left+',top='+top+',resizable=yes,scrollbars=yes');
  if(win){e.preventDefault();win.focus()}
}));
// Currency: THB is what you pay; other currencies are shown as an approximation
let cur;try{cur=localStorage.getItem('cur')}catch(e){}
cur=cur&&RATES[cur]?cur:document.body.dataset.cur;
const loc=document.documentElement.lang;
function applyCur(){document.querySelectorAll('.money').forEach(m=>{const n=+m.dataset.thb;
  if(cur==='THB'){m.innerHTML='<b>'+n.toLocaleString('en-US')+'</b> <i>THB</i>';return}
  const v=Math.round(n*RATES[cur]).toLocaleString(loc);
  m.innerHTML='<b>≈ '+v+'</b> <i>'+cur+'</i>'+(m.classList.contains('per')?'':'<small>'+n.toLocaleString('en-US')+' THB</small>')});
  document.querySelectorAll('.cur-code').forEach(s=>s.textContent=cur);document.querySelectorAll('select.cur-sel').forEach(s=>s.value=cur);document.querySelectorAll('.dd-menu [data-cur]').forEach(a=>a.classList.toggle('active',a.dataset.cur===cur))}
const setCur=c=>{cur=c;try{localStorage.setItem('cur',cur)}catch(e){}applyCur()};
document.querySelectorAll('.dd-menu [data-cur]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();setCur(a.dataset.cur);a.closest('details').removeAttribute('open')}));
document.querySelectorAll('select.cur-sel').forEach(s=>s.addEventListener('change',()=>setCur(s.value)));
applyCur();
// Dropdowns: explicit toggling so only one is open and outside clicks close them
const dds=[...document.querySelectorAll('details.dd')];
dds.forEach(d=>d.querySelector('summary').addEventListener('click',e=>{e.preventDefault();const was=d.open;dds.forEach(x=>x.removeAttribute('open'));if(!was)d.setAttribute('open','')}));
document.addEventListener('click',e=>{if(!e.target.closest('details.dd'))dds.forEach(x=>x.removeAttribute('open'))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){dds.forEach(x=>x.removeAttribute('open'));closeMenu()}});
const mm=document.getElementById('mm'),burger=document.querySelector('.burger');
function openMenu(){mm.classList.add('open');burger.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';mm.querySelector('a,button').focus()}
function closeMenu(){if(!mm.classList.contains('open'))return;mm.classList.remove('open');burger.setAttribute('aria-expanded','false');document.body.style.overflow='';burger.focus()}
window.openMenu=openMenu;window.closeMenu=closeMenu;
// Contact form: POST to the configured endpoint, else open the visitor's mail app with the message prefilled
const cf=document.querySelector('.cform');
if(cf){cf.addEventListener('submit',async e=>{e.preventDefault();if(!cf.reportValidity())return;const fd=new FormData(cf);if(fd.get('company'))return;
  const btn=cf.querySelector('button[type=submit]'),done=cf.querySelector('.fdone'),err=cf.querySelector('.ferr');
  const lines=['name','email','dates','interest','message'].map(k=>fd.get(k)?k+': '+fd.get(k):'').filter(Boolean).join('\\n');
  if(!cf.action||cf.action===location.href){location.href='mailto:'+cf.dataset.mail+'?subject='+encodeURIComponent('Koh Kood Divers — '+(fd.get('interest')||'enquiry'))+'&body='+encodeURIComponent(lines);done.hidden=false;return}
  btn.disabled=true;try{const r=await fetch(cf.action,{method:'POST',body:fd,headers:{Accept:'application/json'}});if(!r.ok)throw 0;cf.reset();done.hidden=false;err.hidden=true}catch(x){err.hidden=false}finally{btn.disabled=false}})}
`;

// ---------------------------------------------------------------- WRITE
const write = (rel, content) => { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); };
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const IMG_CACHE = path.join(__dirname, '.cache', 'img');
if (!fs.existsSync(IMG_CACHE)) { console.error('Run "node build-images.js" first (or npm run build).'); process.exit(1); }
fs.cpSync(IMG_CACHE, path.join(OUT, 'img'), { recursive: true });
write('assets/site.css', css);
try { new Function(clientJs); } catch (e) { console.error('client JS does not parse:', e.message); process.exit(1); }
write('assets/site.js', clientJs);

const written = []; // [url, key, langCode]
const extraRedirects = [];
for (const lang of languages) {
  const c = ctx(lang);
  const page = (key, html) => { const u = c.url(key); write(u.slice(BASE.length + 1) + 'index.html', html); written.push([u, key, lang.code]); };
  page('home', c.homePage());
  products.forEach(p => page(p.slug, c.productPage(p)));
  page('courses', c.coursesPage());
  page('contact', c.contactPage());
  page('about', c.aboutPage());
  page('diveSites', c.diveSitesPage());
  page('termsBooking', c.textPage('termsBooking'));
  page('termsGeneral', c.textPage('termsGeneral'));
  if (lang.code === 'en') write('404.html', c.notFound());
  // old language-specific slugs that changed → 301
  for (const [oldSlug, key] of Object.entries(c.L.oldSlugs || {})) extraRedirects.push([`/${lang.path}/${oldSlug}/`, c.url(key)]);
}

const today = new Date().toISOString().slice(0, 10);
const alts = (key) => languages.map(l => `<xhtml:link rel="alternate" hreflang="${l.code}" href="${site.domain}${ctx(l).url(key)}"/>`).join('');
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${written.map(([u, key]) => `  <url><loc>${site.domain}${u.slice(BASE.length)}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : key.startsWith('terms') ? '0.3' : '0.8'}</priority>${alts(key)}</url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', DEMO ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
write('_redirects', [...redirects, ...extraRedirects].map(([a, b]) => `${a}  ${b}  301`).join('\n') + '\n');

console.log(`Built ${written.length} pages in ${languages.length} languages → dist/  (${extraRedirects.length + redirects.length} redirects)`);
