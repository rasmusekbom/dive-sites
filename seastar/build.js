// Static site generator for Seastar Diving, Stockholm. No dependencies.
//   npm run build   → build-images.js (responsive webp/jpg into .cache/img) + build.js → dist/
//   BASE=/dive-sites/seastar DEMO=1 npm run build   → GitHub Pages demo (sub-path + noindex)
//   DIST=<dir> writes elsewhere (deploy/publish.sh builds outside dist/ so a local preview keeps working)
const fs = require('fs');
const path = require('path');
const { site, languages, stats, courses, tec, rental, service, gas, facilities, redirects } = require('./src/data.js');

const IMG = fs.existsSync(path.join(__dirname, 'src', 'img-manifest.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'src', 'img-manifest.json'), 'utf8')) : {};
const ogJpg = file => IMG[file] ? file.replace(/\.[^.]+$/, '') + '-' + IMG[file].fallback + '.jpg' : file;
const OUT = process.env.DIST ? path.resolve(process.env.DIST) : path.join(__dirname, 'dist');
const BASE = (process.env.BASE || '').replace(/\/$/, '');
const DEMO = !!process.env.DEMO;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const trunc = (s, n = 158) => s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
const css = fs.readFileSync(path.join(__dirname, 'src', 'site.css'), 'utf8');
const js = fs.readFileSync(path.join(__dirname, 'src', 'site.js'), 'utf8');
const CK = Object.fromEntries(courses.map(c => [c.key, c]));

// ---------------------------------------------------------------- LOCALES (deep-merged over Swedish)
const deepMerge = (base, over) => {
  if (Array.isArray(over) || typeof over !== 'object' || over === null) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over)) out[k] = deepMerge(base ? base[k] : undefined, over[k]);
  return out;
};
const SV = require('./src/i18n/sv.js');
const locales = Object.fromEntries(languages.map(l => {
  const f = path.join(__dirname, 'src', 'i18n', l.code + '.js');
  return [l.code, l.code === 'sv' ? SV : deepMerge(SV, fs.existsSync(f) ? require(f) : {})];
}));

// ---------------------------------------------------------------- ICONS
const I = {
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8Z"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  chev: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  arrow: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2 3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8Z"/></svg>',
  depth: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v15m0 0-4-4m4 4 4-4M4 21h16"/></svg>',
  level: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 20V14M10 20V9M16 20V4"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/></svg>',
  cert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-2.5 5 2.5-1.5-7"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0M16 4.5a3.5 3.5 0 0 1 0 7M22 20a7 7 0 0 0-5-6.7"/></svg>',
  boat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M4 14l1.5-4h13L20 14M12 10V4l4 4"/></svg>',
  wrench: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3a5 5 0 0 0-4.6 7L3 17.4V21h3.6l7.4-7.4A5 5 0 1 0 15 3Z"/></svg>',
  tank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7" y="6" width="10" height="15" rx="4"/><path d="M10 6V4h4v2M12 2v2"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h16l-1 12H5L4 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M2 8.5a16 16 0 0 1 20 0M5 12.5a11 11 0 0 1 14 0M8.5 16.4a6 6 0 0 1 7 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 2v20M3 7l18 10M21 7 3 17"/></svg>',
  car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 16v-3l2-5h12l2 5v3M4 16h16M6 16v2H4v-2m16 0v2h-2v-2"/><circle cx="8" cy="13" r="1" fill="currentColor"/><circle cx="16" cy="13" r="1" fill="currentColor"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 13l20-7-7 20-3-8-8-3Z"/></svg>',
};
const FEAT_ICONS = [I.home, I.users, I.snow, I.globe];
const FACILITY_ICONS = { classroom: I.users, wifi: I.wifi, ac: I.snow, boat: I.boat, parking: I.car };
const GEAR_ICONS = { gear: I.bag, service: I.wrench, gas: I.tank };

// Brand mark: a five-pointed star drawn as a compass rose sitting in a wave – "sea" + "star".
const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="ssg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6fd6cf"/><stop offset="1" stop-color="#f5a524"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="2"/><path d="M32 9l5.9 12.9L52 23.6l-10.4 9.6 2.8 14.1L32 40.4l-12.4 6.9 2.8-14.1L12 23.6l14.1-1.7Z" fill="url(#ssg)"/><path d="M10 50c4.4 3.3 8.7 3.3 13.1 0s8.7-3.3 13.1 0 8.7 3.3 13.1 0" fill="none" stroke="#6fd6cf" stroke-width="3" stroke-linecap="round"/></svg>`;
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#04121a"/><path d="M32 12l5.6 12.2L51 25.8l-9.9 9.1 2.7 13.4L32 41.8l-11.8 6.5 2.7-13.4L13 25.8l13.4-1.6Z" fill="#f5a524"/></svg>`;

// ---------------------------------------------------------------- PER-LANGUAGE CONTEXT
function ctx(lang) {
  const L = locales[lang.code];
  const ui = L.ui, K = L.content;
  const prefix = BASE + (lang.path ? `/${lang.path}` : '');

  // page keys: 'home' | key in ui.slugs | 'course:<slug>'
  const pathOf = (code, key) => {
    const l = languages.find(x => x.code === code), loc = locales[code], pre = BASE + (l.path ? `/${l.path}` : '');
    if (key === 'home') return `${pre}/`;
    if (key.startsWith('course:')) {
      const c = CK[key.slice(7)];
      const slug = (loc.content.courseText[c.key] || {}).slug || c.slug;   // per-language slug, sv as fallback
      return `${pre}/${loc.ui.slugs.courses}/${slug}/`;
    }
    if (loc.ui.slugs[key]) return `${pre}/${loc.ui.slugs[key]}/`;
    throw new Error('unknown page key ' + key);
  };
  const url = key => pathOf(lang.code, key);
  const urlIn = (code, key) => pathOf(code, key);
  const abs = key => site.domain + url(key).slice(BASE.length);
  const ck = c => 'course:' + c.key;
  const ctext = c => K.courseText[c.key];

  const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const richP = s => s.split(/\n\n+/).map(t => `<p>${rich(t)}</p>`).join('');
  const tel = n => `tel:${n.replace(/[\s-]/g, '')}`;

  const img = (file, alt, extra = '', sizes = '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 420px', eager = false) => {
    const m = IMG[file];
    if (!m) return `<img src="${BASE}/img/${file}" alt="${esc(alt)}" ${eager ? '' : 'loading="lazy"'}>`;
    const name = file.replace(/\.[^.]+$/, '');
    const srcset = m.widths.map(w => `${BASE}/img/${name}-${w}.webp ${w}w`).join(', ');
    return `<img src="${BASE}/img/${name}-${m.fallback}.jpg" srcset="${srcset}" sizes="${sizes}" width="${m.width}" height="${m.height}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"'} ${extra}>`;
  };
  // Art-directed hero: the wreck is a wide establishing shot and dies in a tall crop, so narrow screens get
  // a portrait frame instead. Both are placeholders – see CONTENT-NOTES.md.
  const srcsetOf = file => {
    const m = IMG[file], name = file.replace(/\.[^.]+$/, '');
    return m ? m.widths.map(w => `${BASE}/img/${name}-${w}.webp ${w}w`).join(', ') : '';
  };
  const heroPicture = (wide, tall) => `<picture>
    <source media="(max-width: 940px)" srcset="${srcsetOf(tall)}" sizes="100vw">
    <source srcset="${srcsetOf(wide)}" sizes="100vw">
    ${img(wide, alt(wide), '', '100vw', true)}
  </picture>`;
  // Photo credit/alt text – the four photos come from the centre's own PADI listing (see CONTENT-NOTES.md)
  const ALT = {
    'diver-green-water-light.jpg': { sv: 'Dykare i sidemount med lampa i grönt östersjövatten', en: 'Diver in sidemount with a torch in green Baltic water' },
    'tech-divers-lake-shore.jpg': { sv: 'Två tekniska dykare med dubbelpaket vid strandkanten', en: 'Two technical divers with twinsets at the water’s edge' },
    'two-divers-autumn-shore.jpg': { sv: 'Två dykare i torrdräkt på en klippa en höstdag', en: 'Two divers in dry suits on a rock on an autumn day' },
    'under-the-ice-shallows.jpg': { sv: 'Grunt vatten sett underifrån, med stenar och grenar', en: 'Shallow water seen from below, with stones and branches' },
    // Placeholder photo (Pexels, Harvey Clements) – swap for one of their own wreck shots. See CONTENT-NOTES.md.
    'hero-wreck-divers.jpg': { sv: 'Två dykare vid ett vrak på mörk botten', en: 'Two divers at a wreck on a dark seabed' },
    'hero-diver-descending.jpg': { sv: 'Dykare på väg ner i djupt blått vatten', en: 'A diver descending into deep blue water' },
  };
  const alt = f => (ALT[f] || {})[lang.code] || '';

  const days = n => n === 1 ? ui.day : ui.days.replace('{n}', n);
  const levelOf = c => ui.levels[c.level];

  const courseMeta = c => [
    `<span class="tag">${I.level}${esc(levelOf(c))}</span>`,
    `<span class="tag">${I.cal}${esc(c.key === 'dm' ? ui.internship : days(c.days))}</span>`,
    c.depth ? `<span class="tag">${I.depth}${ui.maxDepth.replace('{n}', c.depth)}</span>` : '',
    c.cert ? `<span class="tag amber">${I.cert}${esc(c.cert)}</span>` : '',
  ].filter(Boolean).join('');

  const courseCard = c => `<article class="card">
    <a class="card-media" href="${url(ck(c))}" tabindex="-1" aria-hidden="true">${img(c.img, alt(c.img))}</a>
    <div class="card-body">
      <h3><a href="${url(ck(c))}">${esc(ctext(c).name)}</a></h3>
      <p>${esc(ctext(c).short)}</p>
      <div class="meta">${courseMeta(c)}</div>
      <div class="card-foot"><span class="link">${ui.readMore}${I.arrow}</span></div>
    </div>
  </article>`;

  const bookUrl = (type, which) => url('book') + (type ? `?type=${encodeURIComponent(type)}${which ? `&which=${encodeURIComponent(which)}` : ''}` : '');

  // ---------- opening hours
  const hoursRows = () => site.hours.map(([d, a, b]) => `<tr data-day="${d}"><td>${esc(ui.weekdays[d])}</td><td class="${a ? '' : 'shut'}">${a ? `${a}–${b}` : esc(ui.closed)}</td></tr>`).join('');
  const hoursShort = () => {
    const w = site.hours[0], sat = site.hours[5];
    return `${ui.weekdaysShort.mon}–${ui.weekdaysShort.fri} ${w[1]}–${w[2]} · ${ui.weekdaysShort.sat} ${sat[1]}–${sat[2]}`;
  };

  // ---------- JSON-LD
  const orgLd = () => ({
    '@context': 'https://schema.org', '@type': 'SportsActivityLocation', '@id': site.domain + '/#org',
    name: site.name, url: site.domain, telephone: site.phone, email: site.email,
    description: K.about.body.split('\n\n')[0],
    image: site.domain + '/img/' + ogJpg(site.ogImage),
    address: { '@type': 'PostalAddress', streetAddress: 'Solkraftsvägen 33', postalCode: '135 70', addressLocality: 'Stockholm', addressCountry: 'SE' },
    geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: site.hours.filter(h => h[1]).map(([d, a, b]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'https://schema.org/' + { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' }[d],
      opens: a, closes: b,
    })),
    sameAs: [site.social.instagram, site.social.facebook].filter(Boolean),
    availableLanguage: ['sv', 'en', 'da', 'no'],
  });
  const courseLd = c => ({
    '@context': 'https://schema.org', '@type': 'Course', name: ctext(c).name, description: ctext(c).short,
    url: abs(ck(c)), inLanguage: ui.htmlLang,
    provider: { '@type': 'Organization', name: site.name, '@id': site.domain + '/#org' },
    educationalCredentialAwarded: c.cert || undefined,
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'onsite', courseWorkload: `P${c.days}D`, location: { '@type': 'Place', name: site.name, address: site.address } },
  });
  const faqLd = () => ({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: K.faq.items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  });
  const crumbLd = trail => ({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, key], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(key) })),
  });

  // ---------- layout
  const courseNavItems = [...courses.map(c => [ctext(c).nav, ck(c)]), [ui.allCourses, 'courses', true]];
  const moreNavItems = [[ui.nav.gear, 'gear'], [ui.nav.service, 'service'], [ui.nav.gas, 'gas'], [ui.nav.about, 'about'], [ui.nav.faq, 'faq']];

  function layout({ key, title, desc, body, jsonld = [], ogImage, crumbs }) {
    const canonical = abs(key);
    desc = trunc(desc);
    const alternates = languages.map(l => `<link rel="alternate" hreflang="${l.code}" href="${site.domain}${urlIn(l.code, key).slice(BASE.length)}">`).join('\n') + `\n<link rel="alternate" hreflang="x-default" href="${site.domain}${urlIn('sv', key).slice(BASE.length)}">`;
    const ld = [orgLd(), ...jsonld, ...(crumbs ? [crumbLd(crumbs)] : [])].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
    const inCourses = key === 'courses' || key.startsWith('course:');
    const inMore = ['gear', 'service', 'gas', 'about', 'faq'].includes(key);
    const sub = items => `<div class="navsub">${items.map(([label, k, all]) => `<a href="${url(k)}"${k === key ? ' aria-current="page"' : ''}${all ? ' class="all"' : ''}>${esc(label)}</a>`).join('')}</div>`;
    const li = (label, k, items, on) => `<li class="${on ? 'on' : ''}"><a href="${url(k)}"${k === key ? ' aria-current="page"' : ''}>${esc(label)}</a>${items ? sub(items) : ''}</li>`;
    const mmSub = (label, items) => `<details><summary>${esc(label)}${I.chev}</summary><div class="mm-sub">${items.map(([l2, k]) => `<a href="${url(k)}">${esc(l2)}</a>`).join('')}</div></details>`;
    const langLinks = languages.map(l => `<a href="${urlIn(l.code, key)}" hreflang="${l.code}" lang="${l.code}"${l.code === lang.code ? ' aria-current="true"' : ''}>${l.code.toUpperCase()}</a>`).join('');

    return `<!DOCTYPE html>
<html lang="${ui.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">${DEMO ? '\n<meta name="robots" content="noindex, nofollow">' : ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
${alternates}
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="${ui.htmlLang === 'sv' ? 'sv_SE' : 'en_GB'}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${site.domain}/img/${ogJpg(ogImage || site.ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#04121a">
<link rel="icon" href="${BASE}/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/site.css">
${ld}
</head>
<body>
<a class="skip" href="#main">${esc(ui.skip)}</a>
<header class="top" id="top">
  <div class="topbar"><div class="wrap">
    <span><span class="open-dot"></span><span class="open-label" data-open="${esc(ui.openNow)}" data-shut="${esc(ui.closedNow)}">${esc(hoursShort())}</span></span>
    <span class="hide-s">${I.pin}${esc(site.addressShort)}</span>
    <a class="spacer" href="${tel(site.phone)}">${I.phone}${esc(site.phone)}</a>
    <a class="hide-s" href="mailto:${site.email}">${I.mail}${esc(site.email)}</a>
  </div></div>
  <nav class="nav" aria-label="${esc(ui.menu)}"><div class="wrap">
    <a class="brand" href="${url('home')}" aria-label="${esc(site.name)}">${LOGO}<span class="brand-text"><b>${esc(site.shortName)}</b><span>${esc(site.area)}</span></span></a>
    <ul class="nav-links">
      ${li(ui.nav.courses, 'courses', courseNavItems, inCourses)}
      ${li(ui.nav.tec, 'tec')}
      ${li(ui.nav.trips, 'trips')}
      ${li(ui.nav.more, 'gear', moreNavItems, inMore)}
      ${li(ui.nav.contact, 'contact')}
    </ul>
    <div class="nav-cta">
      <div class="lang">${langLinks}</div>
      <a class="btn btn-primary" href="${url('book')}">${esc(ui.bookNow)}</a>
      <button class="burger" aria-label="${esc(ui.menu)}" aria-controls="mm" aria-expanded="false">${I.menu}</button>
    </div>
  </div></nav>
</header>
<div class="mobile-menu" id="mm" hidden>
  <div class="mm-head"><span>${esc(ui.menu)}</span><button class="close" aria-label="${esc(ui.close)}">×</button></div>
  ${mmSub(ui.nav.courses, courseNavItems)}
  <a href="${url('tec')}">${esc(ui.nav.tec)}</a>
  <a href="${url('trips')}">${esc(ui.nav.trips)}</a>
  ${mmSub(ui.nav.more, moreNavItems)}
  <a href="${url('contact')}">${esc(ui.nav.contact)}</a>
  <div class="mm-lang"><span>${esc(ui.language)}</span><div class="lang">${langLinks}</div></div>
  <div class="mm-actions"><a class="btn btn-primary" href="${url('book')}">${esc(ui.bookNow)}</a><a class="btn btn-ghost" href="${tel(site.phone)}">${I.phone}${esc(site.phone)}</a></div>
</div>
<main id="main">${body}</main>
${footer()}
<script>window.HOURS=${JSON.stringify(Object.fromEntries(site.hours.map(h => [h[0], h[1] ? [h[1], h[2]] : null])))};</script>
<script src="${BASE}/assets/site.js" defer></script>
</body>
</html>`;
  }

  function footer() {
    const links = arr => arr.map(([l2, k]) => `<li><a href="${url(k)}">${esc(l2)}</a></li>`).join('');
    return `<footer><div class="wrap">
  <div class="foot">
    <div class="foot-brand">
      <a class="brand" href="${url('home')}">${LOGO}<span class="brand-text"><b>${esc(site.shortName)}</b><span>${esc(site.area)}</span></span></a>
      <p>${esc(ui.footTagline)}</p>
      <span class="padi-badge">${I.star}${esc(ui.padiBadge)}</span>
      <div class="socials">
        <a href="${site.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
        <a href="${site.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
      </div>
    </div>
    <div><h3>${esc(ui.footCourses)}</h3><ul>${links([...courses.map(c => [ctext(c).nav, ck(c)]), [ui.allCourses, 'courses']])}</ul></div>
    <div><h3>${esc(ui.footServices)}</h3><ul>${links([[ui.nav.tec, 'tec'], [ui.nav.trips, 'trips'], [ui.nav.gear, 'gear'], [ui.nav.service, 'service'], [ui.nav.gas, 'gas']])}</ul></div>
    <div><h3>${esc(ui.footContact)}</h3><ul>
      <li><a href="${tel(site.phone)}">${esc(site.phone)}</a></li>
      <li><a href="mailto:${site.email}">${esc(site.email)}</a></li>
      <li>${esc(site.address)}</li>
      <li>${esc(hoursShort())}</li>
      <li><a href="${url('about')}">${esc(ui.nav.about)}</a></li>
      <li><a href="${url('faq')}">${esc(ui.nav.faq)}</a></li>
    </ul></div>
  </div>
  <div class="foot-bottom">
    <span>© ${new Date().getFullYear()} ${esc(site.name)}</span>
    <span class="demo-note">${esc(ui.footNote)}</span>
  </div>
</div></footer>`;
  }

  // ---------------------------------------------------------------- PAGES
  const pages = [];
  const page = (key, o) => pages.push([url(key), layout({ key, ...o })]);

  const phead = (h1, lead, crumbs) => `<section class="phead"><div class="wrap">
    ${crumbs ? `<nav class="crumbs" aria-label="Breadcrumb">${crumbs}</nav>` : ''}
    <h1>${esc(h1)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
  </div></section>`;

  const ctaBand = (title, lead, extra = '') => `<section><div class="wrap"><div class="cta-band">
    <div><h2>${esc(title)}</h2><p>${esc(lead)}</p></div>
    <div class="btns"><a class="btn btn-primary btn-lg" href="${url('book')}">${esc(ui.bookNow)}</a><a class="btn btn-ghost btn-lg" href="${tel(site.phone)}">${I.phone}${esc(site.phone)}</a>${extra}</div>
  </div></div></section>`;

  // ---------- HOME
  {
    const H = K.home;
    page('home', {
      title: H.title, desc: H.desc, ogImage: 'diver-green-water-light.jpg',
      body: `
<section class="hero">
  <div class="hero-bg">${heroPicture('hero-wreck-divers.jpg', 'hero-diver-descending.jpg')}</div>
  <div class="wrap"><div class="hero-grid">
  <div>
    <span class="kicker">${esc(H.heroKicker)}</span>
    <h1>${esc(H.heroTitle)}</h1>
    <p class="lead">${esc(H.heroLead)}</p>
    <div class="hero-cta">
      <a class="btn btn-primary btn-lg" href="${url('courses')}">${esc(H.heroCtaPrimary)}${I.arrow}</a>
      <a class="btn btn-ghost btn-lg" href="${url('course:discover')}">${esc(H.heroCtaSecondary)}</a>
    </div>
  </div>
  <div class="hero-photo">
    ${img('diver-green-water-light.jpg', alt('diver-green-water-light.jpg'), '', '(max-width: 940px) 100vw, 460px', true)}
    <span class="hero-badge">${I.star}${esc(ui.padiBadge)}</span>
  </div>
</div></div></section>

<section class="stats"><div class="wrap">
  ${stats.map(([n, suf, k]) => `<div class="stat"><b>${n}<i>${esc(suf)}</i></b><span>${esc(H.statLabels[k])}</span></div>`).join('')}
</div></section>

<section><div class="wrap">
  <div class="section-head"><div><span class="eyebrow">${esc(H.pathsSub)}</span><h2>${esc(H.pathsTitle)}</h2></div></div>
  <div class="grid grid-3">
    ${H.paths.map(([t, p, target]) => {
        const href = target === 'tec' ? url('tec') : url('course:' + target);
        return `<a class="path" href="${href}"><h3>${esc(t)}</h3><p>${esc(p)}</p><span class="link">${esc(ui.readMore)}${I.arrow}</span></a>`;
      }).join('')}
  </div>
</div></section>

<section class="soft"><div class="wrap">
  <div class="section-head"><div><h2>${esc(H.coursesTitle)}</h2><p class="sub">${esc(H.coursesSub)}</p></div><a class="link" href="${url('courses')}">${esc(ui.allCourses)}${I.arrow}</a></div>
  <div class="grid grid-3">${courses.slice(0, 3).map(courseCard).join('')}</div>
</div></section>

<section><div class="wrap">
  <div class="section-head"><h2>${esc(H.whyTitle)}</h2></div>
  <div class="grid grid-2">
    ${H.why.map(([t, p], i) => `<div class="feat"><div class="feat-ico">${FEAT_ICONS[i]}</div><div><h3>${esc(t)}</h3><p>${esc(p)}</p></div></div>`).join('')}
  </div>
</div></section>

<section class="dark"><div class="wrap"><div class="split">
  <div>
    <span class="kicker">${esc(ui.groups.tec)}</span>
    <h2>${esc(H.tecTitle)}</h2>
    <p class="lead">${esc(H.tecLead)}</p>
    <p class="mt"><a class="btn btn-primary" href="${url('tec')}">${esc(H.tecCta)}${I.arrow}</a></p>
  </div>
  <div><ul class="chips">${tec.map(t => `<li>${esc(K.tec.tecCourses[t.key][0])}</li>`).join('')}</ul></div>
</div></div></section>

<section class="paper"><div class="wrap">
  <div class="section-head"><div><h2>${esc(H.gearTitle)}</h2><p class="sub">${esc(H.gearSub)}</p></div></div>
  <div class="grid grid-3">
    ${H.gearCards.map(([t, p, k]) => `<a class="path" href="${url(k)}"><div class="feat-ico">${GEAR_ICONS[k]}</div><h3 style="margin-top:14px">${esc(t)}</h3><p>${esc(p)}</p><span class="link">${esc(ui.readMore)}${I.arrow}</span></a>`).join('')}
  </div>
</div></section>

${ctaBand(H.ctaTitle, H.ctaLead)}`,
    });
  }

  // ---------- COURSES HUB
  {
    const H = K.courses;
    const groups = ['start', 'con', 'pro', 'spec'];
    page('courses', {
      title: `${H.title} | ${site.name}`, desc: H.desc,
      crumbs: [[site.shortName, 'home'], [ui.nav.courses, 'courses']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.courses)}`)}
<section><div class="wrap">
  <div class="note" style="margin-bottom:38px">${esc(H.note)}</div>
  ${groups.map(g => {
        const list = courses.filter(c => c.group === g);
        if (!list.length) return '';
        return `<div style="margin-bottom:46px"><div class="section-head"><h2>${esc(ui.groups[g])}</h2></div><div class="grid grid-3">${list.map(courseCard).join('')}</div></div>`;
      }).join('')}
</div></section>
${ctaBand(K.home.ctaTitle, K.home.ctaLead)}`,
    });
  }

  // ---------- COURSE PAGES
  for (const c of courses) {
    const T = ctext(c);
    page(ck(c), {
      title: `${T.name} | ${site.name}`, desc: T.short + ' ' + T.lead, ogImage: c.img,
      jsonld: [courseLd(c)],
      crumbs: [[site.shortName, 'home'], [ui.nav.courses, 'courses'], [T.name, ck(c)]],
      body: `${phead(T.name, T.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / <a href="${url('courses')}">${esc(ui.nav.courses)}</a> / ${esc(T.nav)}`)}
<section><div class="wrap"><div class="split">
  <div>
    <div class="meta" style="margin-bottom:26px">${courseMeta(c)}</div>
    <div class="prose">${richP(T.body)}</div>

    <h2 style="margin-top:44px">${esc(ui.youLearn)}</h2>
    <ul class="ticks">${c.learn.map(k => `<li>${I.check}<span>${esc(K.learn[k])}</span></li>`).join('')}</ul>

    <h2 style="margin-top:44px">${esc(ui.included)}</h2>
    <ul class="ticks">${c.includes.map(k => `<li>${I.check}<span>${esc(K.includes[k])}</span></li>`).join('')}</ul>

    <p style="margin-top:40px"><a class="link" href="${url('courses')}">${esc(ui.backToCourses)}</a></p>
  </div>
  <aside class="aside">
    <h3>${esc(T.name)}</h3>
    <dl>
      <dt>${esc(ui.level)}</dt><dd>${esc(levelOf(c))}</dd>
      <dt>${esc(ui.duration)}</dt><dd>${esc(c.key === 'dm' ? ui.internship : days(c.days))}</dd>
      <dt>${esc(ui.minAge.replace('{n}', ''))}</dt><dd>${c.minAge}</dd>
      <dt>${esc(ui.certificate)}</dt><dd>${esc(c.cert || ui.noCert)}</dd>
      <dt>${esc(ui.prereq)}</dt><dd>${esc(K.prereqs[c.prereq])}</dd>
    </dl>
    <a class="btn btn-primary" href="${bookUrl('course', T.name)}">${esc(ui.askPrice)}</a>
    <p style="margin:14px 0 0;font-size:14.5px;color:var(--muted)">${esc(ui.priceOnRequest)} · <a href="${tel(site.phone)}">${esc(site.phone)}</a></p>
  </aside>
</div></div></section>
${ctaBand(K.home.ctaTitle, K.home.ctaLead)}`,
    });
  }

  // ---------- TEC
  {
    const H = K.tec;
    page('tec', {
      title: `${H.title} | ${site.name}`, desc: H.desc, ogImage: 'tech-divers-lake-shore.jpg',
      crumbs: [[site.shortName, 'home'], [ui.nav.tec, 'tec']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.tec)}`)}
<section><div class="wrap"><div class="split">
  <div class="prose">${richP(H.body)}<div class="note mt">${esc(H.gasNote)}</div></div>
  <div class="card"><div class="card-media" style="aspect-ratio:3/4">${img('tech-divers-lake-shore.jpg', alt('tech-divers-lake-shore.jpg'), '', '(max-width: 900px) 100vw, 340px')}</div></div>
</div></div></section>
<section class="soft"><div class="wrap">
  <div class="section-head"><h2>${esc(H.coursesTitle)}</h2></div>
  <div class="deflist">
    ${tec.map(t => `<div><b>${esc(H.tecCourses[t.key][0])}</b><span>${esc(H.tecCourses[t.key][1])} <em style="color:var(--muted);font-style:normal">· ${esc(t.cert)} · ${ui.maxDepth.replace('{n}', t.depth)}</em></span></div>`).join('')}
  </div>
</div></section>
${ctaBand(H.askTitle, H.askLead, `<a class="btn btn-ghost btn-lg" href="${url('gas')}">${esc(ui.nav.gas)}</a>`)}`,
    });
  }

  // ---------- TRIPS (+ club + travel)
  {
    const H = K.trips;
    page('trips', {
      title: `${H.title} | ${site.name}`, desc: H.desc, ogImage: 'two-divers-autumn-shore.jpg',
      crumbs: [[site.shortName, 'home'], [ui.nav.trips, 'trips']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.trips)}`)}
<section><div class="wrap"><div class="split">
  <div class="prose">${richP(H.body)}<div class="note mt">${esc(H.seasonNote)}</div></div>
  <div class="card"><div class="card-media" style="aspect-ratio:4/3">${img('two-divers-autumn-shore.jpg', alt('two-divers-autumn-shore.jpg'), '', '(max-width: 900px) 100vw, 340px')}</div></div>
</div></div></section>
<section class="soft"><div class="wrap"><div class="grid grid-2">
  <div class="feat"><div class="feat-ico">${I.users}</div><div><h3>${esc(H.clubTitle)}</h3><p>${esc(H.clubLead)}</p></div></div>
  <div class="feat"><div class="feat-ico">${I.plane}</div><div><h3>${esc(H.travelTitle)}</h3><p>${esc(H.travelLead)}</p></div></div>
</div></div></section>
${ctaBand(K.home.ctaTitle, K.home.ctaLead)}`,
    });
  }

  // ---------- GEAR
  {
    const H = K.gear;
    page('gear', {
      title: `${H.title} | ${site.name}`, desc: H.desc, ogImage: 'tech-divers-lake-shore.jpg',
      crumbs: [[site.shortName, 'home'], [ui.nav.gear, 'gear']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.gear)}`)}
<section><div class="wrap">
  <div class="prose">${richP(H.body)}</div>
  <h2 style="margin-top:44px">${esc(H.rentalTitle)}</h2>
  <ul class="chips">${rental.map(k => `<li>${esc(H.rentalItems[k])}</li>`).join('')}</ul>
  <h2 style="margin-top:44px">${esc(H.payTitle)}</h2>
  <ul class="chips">${site.payments.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
</div></section>
${ctaBand(K.home.ctaTitle, K.home.ctaLead, `<a class="btn btn-ghost btn-lg" href="${url('service')}">${esc(ui.nav.service)}</a>`)}`,
    });
  }

  // ---------- SERVICE
  {
    const H = K.service;
    page('service', {
      title: `${H.title} | ${site.name}`, desc: H.desc,
      crumbs: [[site.shortName, 'home'], [ui.nav.service, 'service']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.service)}`)}
<section><div class="wrap">
  <div class="prose">${richP(H.body)}</div>
  <div class="deflist mt">${service.map(k => `<div><b>${esc(H.items[k][0])}</b><span>${esc(H.items[k][1])}</span></div>`).join('')}</div>
</div></section>
${ctaBand(K.home.ctaTitle, K.home.ctaLead)}`,
    });
  }

  // ---------- GAS
  {
    const H = K.gas;
    page('gas', {
      title: `${H.title} | ${site.name}`, desc: H.desc,
      crumbs: [[site.shortName, 'home'], [ui.nav.gas, 'gas']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.gas)}`)}
<section><div class="wrap">
  <div class="prose">${richP(H.body)}</div>
  <div class="deflist mt">${gas.map(k => `<div><b>${esc(H.items[k][0])}</b><span>${esc(H.items[k][1])}</span></div>`).join('')}</div>
  <div class="note mt">${esc(H.note)}</div>
  <h2 style="margin-top:44px">${esc(ui.hoursTitle)}</h2>
  <table class="hours" style="max-width:420px"><tbody>${hoursRows()}</tbody></table>
</div></section>
${ctaBand(K.home.ctaTitle, K.home.ctaLead)}`,
    });
  }

  // ---------- ABOUT
  {
    const H = K.about;
    page('about', {
      title: `${H.title} | ${site.name}`, desc: H.desc, ogImage: 'tech-divers-lake-shore.jpg',
      crumbs: [[site.shortName, 'home'], [ui.nav.about, 'about']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.about)}`)}
<section><div class="wrap"><div class="split">
  <div class="prose">${richP(H.body)}
    <h3 style="margin-top:36px">${esc(H.teamTitle)}</h3><p>${esc(H.teamBody)}</p>
    <h3 style="margin-top:28px">${esc(H.langTitle)}</h3><p>${esc(H.langBody)}</p>
  </div>
  <div class="card"><div class="card-media" style="aspect-ratio:3/4">${img('tech-divers-lake-shore.jpg', alt('tech-divers-lake-shore.jpg'), '', '(max-width: 900px) 100vw, 340px')}</div></div>
</div></div></section>
<section class="soft"><div class="wrap">
  <div class="section-head"><h2>${esc(H.facilitiesTitle)}</h2></div>
  <div class="grid grid-3">
    ${facilities.map(k => `<div class="feat"><div class="feat-ico">${FACILITY_ICONS[k]}</div><div><h3>${esc(H.facilityItems[k][0])}</h3><p>${esc(H.facilityItems[k][1])}</p></div></div>`).join('')}
  </div>
</div></section>
${ctaBand(K.home.ctaTitle, K.home.ctaLead)}`,
    });
  }

  // ---------- FAQ
  {
    const H = K.faq;
    page('faq', {
      title: `${H.title} | ${site.name}`, desc: H.desc, jsonld: [faqLd()],
      crumbs: [[site.shortName, 'home'], [ui.nav.faq, 'faq']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.faq)}`)}
<section><div class="wrap narrow"><div class="faq">
  ${H.items.map(([q, a]) => `<details><summary>${esc(q)}${I.chev}</summary><div class="answer"><p>${esc(a)}</p></div></details>`).join('')}
</div></div></section>
${ctaBand(K.home.ctaTitle, K.home.ctaLead)}`,
    });
  }

  // ---------- CONTACT
  {
    const H = K.contact;
    page('contact', {
      title: `${H.title} | ${site.name}`, desc: H.desc,
      crumbs: [[site.shortName, 'home'], [ui.nav.contact, 'contact']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.nav.contact)}`)}
<section><div class="wrap"><div class="contact-grid">
  <div>
    <div class="contact-rows">
      <div class="crow">${I.phone}<div><b>${esc(ui.call)}</b><a href="${tel(site.phone)}">${esc(site.phone)}</a></div></div>
      <div class="crow">${I.mail}<div><b>${esc(ui.mail)}</b><a href="mailto:${site.email}">${esc(site.email)}</a></div></div>
      <div class="crow">${I.pin}<div><b>${esc(ui.directions)}</b><a href="${site.maps}" target="_blank" rel="noopener">${esc(site.address)}</a></div></div>
    </div>
    <h2 style="margin-top:40px">${esc(ui.hoursTitle)}</h2>
    <table class="hours"><tbody>${hoursRows()}</tbody></table>
    <h2 style="margin-top:40px">${esc(H.findUsTitle)}</h2>
    <p class="sub">${esc(H.findUsBody)}</p>
  </div>
  <div>
    <iframe class="map" src="${site.mapsEmbed}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="${esc(site.address)}"></iframe>
    <p class="mt"><a class="btn btn-primary" href="${url('book')}">${esc(ui.bookNow)}</a></p>
  </div>
</div></div></section>`,
    });
  }

  // ---------- BOOK
  {
    const H = K.book, F = ui.form;
    const opts = (name, arr) => arr.map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');
    page('book', {
      title: `${H.title} | ${site.name}`, desc: H.desc,
      crumbs: [[site.shortName, 'home'], [ui.bookNow, 'book']],
      body: `${phead(H.h1, H.lead, `<a href="${url('home')}">${esc(site.shortName)}</a> / ${esc(ui.bookNow)}`)}
<section><div class="wrap"><div class="contact-grid">
  <form data-book data-prefill="${esc(lang.code === 'sv' ? 'Jag är intresserad av: {x}' : 'I am interested in: {x}')}" novalidate>
    <div class="two-up">
      <div class="field"><label for="f-name">${esc(F.name)}</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-email">${esc(F.email)}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
    </div>
    <div class="two-up">
      <div class="field"><label for="f-phone">${esc(F.phone)} <span class="opt">(${esc(lang.code === 'sv' ? 'valfritt' : 'optional')})</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="field"><label for="f-what">${esc(F.what)}</label><select id="f-what" name="what">${opts('what', F.whatOptions)}</select></div>
    </div>
    <div class="two-up">
      <div class="field"><label for="f-level">${esc(F.level)}</label><select id="f-level" name="level">${opts('level', F.levelOptions)}</select></div>
      <div class="field"><label for="f-when">${esc(F.when)}</label><select id="f-when" name="when">${opts('when', F.whenOptions)}</select></div>
    </div>
    <div class="field"><label for="f-msg">${esc(F.message)}</label><textarea id="f-msg" name="message"></textarea></div>
    <button class="btn btn-primary btn-lg" type="submit">${esc(F.send)}</button>
    <p class="form-done note mt" hidden>${esc(F.thanks)}</p>
    <p class="sub" style="margin-top:16px;font-size:14px">${esc(F.note)}</p>
  </form>
  <div>
    <div class="contact-rows">
      <div class="crow">${I.phone}<div><b>${esc(ui.call)}</b><a href="${tel(site.phone)}">${esc(site.phone)}</a></div></div>
      <div class="crow">${I.mail}<div><b>${esc(ui.mail)}</b><a href="mailto:${site.email}">${esc(site.email)}</a></div></div>
      <div class="crow">${I.clock}<div><b>${esc(ui.hoursTitle)}</b><span>${esc(hoursShort())}</span></div></div>
      <div class="crow">${I.pin}<div><b>${esc(ui.directions)}</b><a href="${site.maps}" target="_blank" rel="noopener">${esc(site.address)}</a></div></div>
    </div>
  </div>
</div></div></section>`,
    });
  }

  // ---------- 404 (one per language; the root one is written to /404.html)
  const notFound = layout({
    key: 'home',
    title: `${K.notFound.title} | ${site.name}`, desc: K.notFound.lead,
    body: `${phead(K.notFound.h1, K.notFound.lead, '')}
<section><div class="wrap"><p><a class="btn btn-primary btn-lg" href="${url('courses')}">${esc(ui.allCourses)}</a> <a class="btn btn-outline btn-lg" href="${url('contact')}">${esc(ui.contactUs)}</a></p></div></section>`,
  });

  return { pages, notFound, url, ui };
}

// ---------------------------------------------------------------- WRITE
fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, content) => {
  const file = rel.endsWith('/') ? path.join(OUT, rel.slice(BASE.length), 'index.html') : path.join(OUT, rel.slice(BASE.length));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};

const all = [];
let root404 = '';
for (const lang of languages) {
  const { pages, notFound } = ctx(lang);
  for (const [rel, html] of pages) { write(rel, html); all.push({ rel, lang: lang.code }); }
  if (lang.code === 'sv') root404 = notFound;
}
fs.writeFileSync(path.join(OUT, '404.html'), root404);

// assets
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'assets', 'site.css'), css);
fs.writeFileSync(path.join(OUT, 'assets', 'site.js'), js);
fs.writeFileSync(path.join(OUT, 'favicon.svg'), FAVICON);

// images
const cache = path.join(__dirname, '.cache', 'img');
if (fs.existsSync(cache)) {
  fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });
  for (const f of fs.readdirSync(cache)) fs.copyFileSync(path.join(cache, f), path.join(OUT, 'img', f));
}

// sitemap with hreflang + robots + redirects
const loc = rel => site.domain + rel.slice(BASE.length);
const svPages = all.filter(p => p.lang === 'sv');
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/1999/sitemaps/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${all.map(p => `<url><loc>${loc(p.rel)}</loc></url>`).join('\n')}
</urlset>`.replace('http://www.w3.org/1999/sitemaps/0.9', 'http://www.sitemaps.org/schemas/sitemap/0.9');
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(OUT, 'robots.txt'), DEMO
  ? `User-agent: *\nDisallow: /\n`
  : `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, '_redirects'), redirects.map(([from, to, code]) => `${from}  ${to}  ${code}`).join('\n') + '\n');

console.log(`Seastar: ${all.length} pages (${languages.map(l => l.code).join(', ')}) → ${OUT}`);
