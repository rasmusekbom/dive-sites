// Static generator for our own sales page: offer, before/after sliders of the rebuilds, prices, FAQ. No dependencies.
//   npm run build                                → dist/
//   BASE=/dive-sites/sales DEMO=1 npm run build  → GitHub Pages demo (sub-path + noindex)
//   DIST=<dir> writes elsewhere (deploy/publish.sh builds outside dist/)
// Screenshots come from src/screens/ (node shoot.js). A case with no screenshot pair for a view simply drops that view.
const fs = require('fs');
const path = require('path');
const { site, plans, terms, steps, features, faq } = require('./src/data.js');
// Anonymised cases (site.anonymize, or per case `anonymize`) show alias/region instead of name/place, get a neutral id,
// no demo link, and publish their screenshots under neutral file names.
const cases = require('./src/data.js').cases.filter(c => !c.hidden).map(c => {
  const anon = c.anonymize ?? site.anonymize;
  return { ...c, anon, title: anon ? c.alias : c.name, where: anon ? c.region : c.place, id: anon ? c.slug : c.key };
}).filter(c => !(c.anon && c.anonHide));

const OUT = process.env.DIST ? path.resolve(process.env.DIST) : path.join(__dirname, 'dist');
const BASE = (process.env.BASE || '').replace(/\/$/, '');
const DEMO = !!process.env.DEMO;
const SCREENS = path.join(__dirname, 'src', 'screens');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const kr = n => n.toLocaleString('sv-SE').replace(/ /g, ' ');
const warn = [];
if (!site.name) warn.push('site.name saknas – headern visar taglinen');
if (!site.email) warn.push('site.email saknas – kontaktknapparna går till #kontakt utan mejladress');
if (/example\./.test(site.domain)) warn.push('site.domain är fortfarande example.se');
// Where this build will actually be served. A demo lives on GitHub Pages, so canonical/og:url/og:image must point
// there: share sheets and chat apps use them as the link, and a placeholder domain would be what gets shared.
const ORIGIN = DEMO ? new URL(site.demoBase).origin + BASE : site.domain;

const brand = site.name || site.tagline;
const mail = (subject, body = '') => site.email ? `mailto:${site.email}?subject=${encodeURIComponent(subject)}${body ? '&body=' + encodeURIComponent(body) : ''}` : '#kontakt';
const demoUrl = c => /^https?:/.test(c.after.url) ? c.after.url : site.demoBase + c.after.url;

// ---------------------------------------------------------------- ICONS
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  arrow: svg('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  ext: svg('<path d="M14 4h6v6M20 4 10 14M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'),
  check: svg('<path d="m5 12 5 5L20 7"/>'),
  chev: svg('<path d="m6 9 6 6 6-6"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  tel: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>'),
  desktop: svg('<rect x="2.5" y="4" width="19" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/>'),
  mobile: svg('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
  bolt: svg('<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>'),
  phone: svg('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
  cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/>'),
  shield: svg('<path d="M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>'),
  drag: svg('<path d="m9 7-5 5 5 5M15 7l5 5-5 5"/>'),
};
const WAVE = 'M7 17.5c2.3-2.6 4.5-2.6 6.8 0s4.5 2.6 6.8 0c1.3-1.5 2.6-2 4-1.6';
const MARK = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" fill="currentColor"/><path d="${WAVE}" fill="none" stroke="var(--pop)" stroke-width="2.6" stroke-linecap="round"/></svg>`;
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#0e2629"/><path d="${WAVE}" fill="none" stroke="#c5ef5a" stroke-width="2.6" stroke-linecap="round"/></svg>`;

// ---------------------------------------------------------------- BEFORE / AFTER
const shot = (key, side, view) => `${key}-${side}-${view}.jpg`;
// Published name of a screenshot (the source file is always <key>-…; an anonymised case is published as <slug>-…).
const published = new Map();
const pub = (c, side, view) => { const f = `${c.id}-${side}-${view}.jpg`; published.set(f, shot(c.key, side, view)); return f; };
const has = f => fs.existsSync(path.join(SCREENS, f));
const views = c => ['desktop', 'mobile'].filter(v => has(shot(c.key, 'before', v)) && has(shot(c.key, 'after', v)));
for (const c of cases) {
  const v = views(c);
  if (v.length < 2) warn.push(`${c.key}: saknar skärmdumpar för ${['desktop', 'mobile'].filter(x => !v.includes(x)).join(' + ')} (node shoot.js ${c.key})`);
}
const DIMS = { desktop: [1440, 900], mobile: [780, 1688] };

function slider(c, { eager = false } = {}) {
  const v = views(c);
  if (!v.length) {
    // No pair at all: show the after-shot alone if we have it, so the case still reads.
    const a = ['desktop', 'mobile'].find(x => has(shot(c.key, 'after', x)));
    return a ? `<figure class="ba ba-solo">${a === 'desktop' ? '<div class="chrome" aria-hidden="true"><i></i><i></i><i></i></div>' : ''}<div class="frame frame-${a}"><img src="${BASE}/screens/${pub(c, 'after', a)}" width="${DIMS[a][0]}" height="${DIMS[a][1]}" alt="${esc(c.title)}: den nya sajten" loading="lazy"></div><figcaption>${esc(c.before.label)}</figcaption></figure>` : '';
  }
  const pane = (view, i) => {
    const [w, h] = DIMS[view];
    const img = side => `<img src="${BASE}/screens/${pub(c, side, view)}" width="${w}" height="${h}" alt="${esc(c.title)}: ${side === 'before' ? 'sajten före' : 'den nya sajten'}${view === 'mobile' ? ' i mobilen' : ''}" ${eager && i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" draggable="false">`;
    const chrome = view === 'desktop' ? `<div class="chrome" aria-hidden="true"><i></i><i></i><i></i></div>` : '';
    return `<div class="pane" data-view="${view}"${i ? ' hidden' : ''}>${chrome}<div class="frame frame-${view}">
      ${img('after')}
      <div class="before">${img('before')}</div>
      <span class="tag tag-l">Före</span><span class="tag tag-r">Efter</span>
      <div class="handle" aria-hidden="true"><span>${I.drag}</span></div>
      <input class="range" type="range" min="0" max="100" value="50" step="1" aria-label="${esc(c.title)}: dra för att jämföra före och efter">
    </div></div>`;
  };
  const toggle = v.length > 1 ? `<div class="views" role="group" aria-label="Visa som">${v.map((x, i) => `<button type="button" data-view="${x}" aria-pressed="${!i}">${I[x]}${x === 'desktop' ? 'Dator' : 'Mobil'}</button>`).join('')}</div>` : '';
  return `<figure class="ba">${toggle}${v.map(pane).join('')}<figcaption>${esc(c.before.label)}</figcaption></figure>`;
}

function caseBlock(c, i, media = slider(c)) {
  return `<article class="case${i % 2 ? ' flip' : ''}" id="${c.id}">
  <div class="case-text">
    <p class="kicker">${c.anon ? 'Koncept · ' + esc(c.kind) : esc(c.kind) + ' · ' + esc(c.where)}</p>
    <h3>${esc(c.anon ? `${c.title} i ${c.where}` : c.name)}</h3>
    <p>${esc(c.summary)}</p>
    <dl class="facts">${c.facts.map(([n, l]) => `<div><dt>${esc(n)}</dt><dd>${esc(l)}</dd></div>`).join('')}</dl>
    ${c.anon ? '' : `<a class="link" href="${esc(demoUrl(c))}" target="_blank" rel="noopener">Öppna den nya sajten ${I.ext}</a>`}
    ${c.anon ? '<p class="concept">Koncept, byggt på eget initiativ. Företaget är inte kund hos oss, så namn och kontaktuppgifter är dolda.</p>' : c.concept ? `<p class="concept">Koncept, byggt på eget initiativ. ${esc(c.name)} är inte kund hos oss.</p>` : ''}
  </div>
  ${media}
</article>`;
}

// ---------------------------------------------------------------- PAGE
const hero = cases.find(c => views(c).length === 2) || cases.find(c => views(c).length) || cases[0];
const rest = cases.filter(c => c !== hero);
const NAV = [['Exempel', '#exempel'], ['Så går det till', '#sa-gar-det-till'], ['Priser', '#priser'], ['Frågor', '#fragor']];
const title = `${site.tagline}${site.name ? ' | ' + site.name : ''}: gratis utkast först`;
const desc = 'Vi bygger snabba, mobilvänliga hemsidor för små företag som syns på Google och leder till bokningar. Ni får ett gratis utkast innan ni bestämmer er.';
const ogImg = has(shot(hero.key, 'after', 'desktop')) ? `${ORIGIN}/screens/${pub(hero, 'after', 'desktop')}` : '';
const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
const orgLd = site.name && { '@context': 'https://schema.org', '@type': 'ProfessionalService', name: site.name, url: ORIGIN, email: site.email || undefined, telephone: site.phone || undefined, areaServed: 'SE', description: desc };

const contactForm = `<form class="form" id="utkast-form" data-email="${esc(site.email)}">
  <div class="row"><label>Ert namn<input name="namn" autocomplete="name" required></label><label>Företag<input name="foretag" autocomplete="organization" required></label></div>
  <div class="row"><label>Nuvarande hemsida eller Facebook-sida<input name="sajt" inputmode="url" placeholder="t.ex. mittforetag.se"></label><label>Telefon (valfritt)<input name="telefon" type="tel" autocomplete="tel"></label></div>
  <label>Vad vill ni att sajten ska göra bättre?<textarea name="meddelande" rows="4" placeholder="Fler bokningar, synas på Google, fungera i mobilen …"></textarea></label>
  <button class="btn btn-accent btn-lg" type="submit">Skicka och få ett gratis utkast ${I.arrow}</button>
  <p class="small">Formuläret öppnar ert mejlprogram med allt ifyllt${site.email ? `. Ni kan också mejla direkt till <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : ''}${site.phone ? ` eller ringa <a href="tel:${esc(site.phone.replace(/[^\d+]/g, ''))}">${esc(site.phone)}</a>` : ''}.</p>
</form>`;

const html = `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">${DEMO ? '\n<meta name="robots" content="noindex, nofollow">' : ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${ORIGIN}/">
<meta property="og:type" content="website"><meta property="og:locale" content="sv_SE"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${ORIGIN}/">${ogImg ? `<meta property="og:image" content="${ogImg}">` : ''}
<meta name="theme-color" content="#0e2629">
<link rel="icon" href="${BASE}/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/site.css">
${[faqLd, orgLd].filter(Boolean).map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')}
</head>
<body>
<a class="skip" href="#main">Hoppa till innehållet</a>
<header class="top"><div class="wrap">
  <a class="brand" href="#main">${MARK}<span>${esc(brand)}</span></a>
  <nav aria-label="Huvudmeny"><ul>${NAV.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></nav>
  <a class="btn btn-accent btn-sm" href="#kontakt">Gratis utkast</a>
</div></header>

<main id="main">
<section class="hero"><div class="wrap hero-grid">
  <div class="hero-text">
    <h1>Er nya hemsida, klar <em>innan</em> ni betalar något.</h1>
    <p class="lead">Vi bygger snabba, mobilvänliga hemsidor som syns på Google och leder till bokningar. Ni får ett gratis utkast med ert eget innehåll först, och bestämmer sedan.</p>
    <div class="cta"><a class="btn btn-accent btn-lg" href="#kontakt">Få ett gratis utkast ${I.arrow}</a><a class="btn btn-ghost btn-lg" href="#exempel">Se före och efter</a></div>
    <ul class="ticks">${['Ingen startavgift', 'Ingen bindningstid', 'Utkast inom en vecka'].map(t => `<li>${I.check}${t}</li>`).join('')}</ul>
  </div>
  <div class="hero-demo">
    ${slider(hero, { eager: true })}
    <p class="hero-note"><b>${esc(hero.title)}</b>, ${esc(hero.where)}. Dra i reglaget. <a href="#${hero.id}">Läs om bygget</a></p>
  </div>
</div></section>

<section class="band" id="exempel"><div class="wrap">
  <div class="head"><h2>${['Noll', 'En', 'Två', 'Tre', 'Fyra', 'Fem', 'Sex', 'Sju', 'Åtta'][cases.length] || cases.length} sajter vi har byggt om</h2><p class="lead">Dykcenter, båtbolag, en fridykningsskola och en utbildningsfirma. Dra i reglaget för att se skillnaden${cases.some(c => !c.anon) ? ', eller öppna den nya sajten och klicka runt' : ''}.</p></div>
  ${caseBlock(hero, 0, has(shot(hero.key, 'after', 'desktop')) ? `<div class="case-shot"><div class="chrome" aria-hidden="true"><i></i><i></i><i></i></div><img src="${BASE}/screens/${pub(hero, 'after', 'desktop')}" width="1440" height="900" alt="${esc(hero.title)}: den nya sajten" loading="lazy"></div>` : '')}
  ${rest.map((c, i) => caseBlock(c, i + 1)).join('\n  ')}
</div></section>

<section class="section"><div class="wrap">
  <div class="head"><h2>En hemsida som gör sitt jobb</h2></div>
  <div class="features">${features.map(([ic, h, p]) => `<div class="feature"><span class="ic">${I[ic]}</span><h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
</div></section>

<section class="section alt" id="sa-gar-det-till"><div class="wrap">
  <div class="head"><h2>Ni ser resultatet innan ni bestämmer er</h2></div>
  <ol class="steps">${steps.map(([h, p]) => `<li><h3>${esc(h)}</h3><p>${esc(p)}</p></li>`).join('')}</ol>
</div></section>

<section class="section" id="priser"><div class="wrap">
  <div class="head"><h2>Ett fast pris i månaden, allt ingår</h2><p class="lead">Hosting, uppdateringar och ändringar ingår, så att ni slipper få en faktura varje gång något ska bytas ut.</p></div>
  <div class="plans">${plans.map(p => `<div class="plan${p.featured ? ' featured' : ''}">${p.featured ? '<span class="badge">Vanligast</span>' : ''}
    <h3>${esc(p.name)}</h3><p class="price"><b>${kr(p.price)}</b> ${esc(p.unit)}</p><p class="pnote">${esc(p.note)}</p><p class="for">${esc(p.for)}</p>
    <ul>${p.items.map(t => `<li>${I.check}${esc(t)}</li>`).join('')}</ul>
    <a class="btn ${p.featured ? 'btn-accent' : 'btn-ghost'} btn-block" href="#kontakt" data-plan="${esc(p.name)}">Börja med ett gratis utkast</a></div>`).join('')}</div>
  <p class="small terms">${esc(terms)}</p>
</div></section>

<section class="section alt" id="fragor"><div class="wrap narrow">
  <div class="head"><h2>Frågor vi brukar få</h2></div>
  <div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}${I.chev}</summary><p>${esc(a)}</p></details>`).join('')}</div>
</div></section>

<section class="contact" id="kontakt"><div class="wrap contact-grid">
  <div><h2>Berätta om ert företag, så bygger vi en startsida åt er.</h2><p class="lead">Det kostar ingenting, och ni förbinder er inte till något. Ni hör från oss inom två arbetsdagar.</p></div>
  ${contactForm}
</div></section>
</main>

<footer class="foot"><div class="wrap">
  <span>${MARK}${esc(brand)}</span>
  <span>${[site.email && `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`, site.phone && `<a href="tel:${esc(site.phone.replace(/[^\d+]/g, ''))}">${esc(site.phone)}</a>`, esc(site.city)].filter(Boolean).join(' · ')}</span>
</div></footer>
<script src="${BASE}/assets/site.js" defer></script>
</body>
</html>
`;

const notFound = `<!DOCTYPE html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>Sidan finns inte | ${esc(brand)}</title><meta name="description" content="Sidan du letade efter finns inte. Gå till startsidan för att se exempel, priser och hur ni får ett gratis utkast.">
<link rel="icon" href="${BASE}/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${BASE}/assets/site.css"></head>
<body><main class="section"><div class="wrap narrow"><h1>Sidan finns inte</h1><p class="lead">Länken kan vara gammal eller felstavad.</p><a class="btn btn-accent" href="${BASE}/">Till startsidan ${I.arrow}</a></div></main></body></html>`;

// ---------------------------------------------------------------- WRITE
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.writeFileSync(path.join(OUT, '404.html'), notFound);
fs.copyFileSync(path.join(__dirname, 'src', 'site.css'), path.join(OUT, 'assets', 'site.css'));
fs.copyFileSync(path.join(__dirname, 'src', 'site.js'), path.join(OUT, 'assets', 'site.js'));
fs.writeFileSync(path.join(OUT, 'favicon.svg'), FAVICON);
fs.mkdirSync(path.join(OUT, 'screens'), { recursive: true });
const used = new Set([...html.matchAll(/\/screens\/([\w-]+\.jpg)/g)].map(m => m[1]));
for (const f of used) fs.copyFileSync(path.join(SCREENS, published.get(f) || f), path.join(OUT, 'screens', f));
fs.writeFileSync(path.join(OUT, 'robots.txt'), DEMO ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${ORIGIN}/</loc></url></urlset>\n`);
fs.writeFileSync(path.join(OUT, '_redirects'), '');
console.log(`built ${path.relative(process.cwd(), OUT) || '.'}: 1 page, ${used.size} screenshots${BASE ? ', base ' + BASE : ''}${DEMO ? ', demo (noindex)' : ''}`);
for (const w of warn) console.log('  TODO', w);
