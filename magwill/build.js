// Static site generator for Magwill AB (Microsoft Office-utbildning, Göteborg). No dependencies.
//   npm run build                                  → dist/
//   BASE=/dive-sites/magwill DEMO=1 npm run build  → GitHub Pages demo (sub-path + noindex)
//   DIST=<dir> writes elsewhere (deploy/publish.sh builds outside dist/)
const fs = require('fs');
const path = require('path');
const { site, programs, levels, courses, excelGuide, consulting, hiring, redirects } = require('./src/data.js');

const OUT = process.env.DIST ? path.resolve(process.env.DIST) : path.join(__dirname, 'dist');
const BASE = (process.env.BASE || '').replace(/\/$/, '');
const DEMO = !!process.env.DEMO;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const trunc = (s, n = 158) => s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
const paras = s => s.split(/\n\n+/).map(t => `<p>${esc(t)}</p>`).join('');
const tel = `tel:+46${site.phone.replace(/\D/g, '').slice(1)}`;
const CK = Object.fromEntries(courses.map(c => [c.key, c]));
const PG = Object.fromEntries(programs.map(p => [p.key, p]));
const byProgram = k => courses.filter(c => c.program === k);
const days = n => n === 1 ? '1 dag' : `${n} dagar`;
const addrLine = `${site.street}, ${site.postal} ${site.city}`;

// ---------------------------------------------------------------- ROUTES
const SLUG = { home: '', courses: 'utbildningar', consulting: 'konsulttjanster', about: 'om-oss', jobs: 'jobba-med-oss', faq: 'vanliga-fragor', contact: 'kontakt', apply: 'intresseanmalan' };
const url = key => key.startsWith('course:') ? `${BASE}/utbildningar/${CK[key.slice(7)].slug}/` : `${BASE}/${SLUG[key] ? SLUG[key] + '/' : ''}`;
const abs = key => site.domain + url(key).slice(BASE.length);
const applyUrl = c => url('apply') + (c ? `?kurs=${c.slug}` : '');

// ---------------------------------------------------------------- ICONS
const svg = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const I = {
  phone: svg('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  pin: svg('<path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>'),
  arrow: svg('<path d="M5 12h14m-6-6 6 6-6 6"/>'),
  check: svg('<path d="m5 12 5 5L20 7"/>'),
  chev: svg('<path d="m6 9 6 6 6-6"/>'),
  menu: svg('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  clock: svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  cal: svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4m8-4v4"/>'),
  building: svg('<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M8 7h4M8 11h4M8 15h4M3 21h18"/>'),
  level: svg('<path d="M4 20v-6M10 20V9M16 20V4"/>'),
  sliders: svg('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
  book: svg('<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>'),
  smile: svg('<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>'),
  map: svg('<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>'),
  user: svg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  repeat: svg('<path d="M17 2l4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>'),
  doc: svg('<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>'),
};

// Program marks: letter tiles in the spirit of the Office app icons, but in our own palette (no Microsoft logos).
const MARK = { excel: 'X', word: 'W', powerpoint: 'P', project: 'Pj', access: 'A', data: 'D' };
const mark = k => `<span class="pmark pm-${k}" aria-hidden="true">${MARK[k]}</span>`;

// Brand: their logo is a burgundy oval with MAGWILL / Lär för framtiden (images/magwill3.gif, 154×58 GIF).
// Redrawn as SVG so it stays sharp; replace with their original artwork if they have it.
const LOGO = `<svg class="logo" viewBox="0 0 160 60" role="img" aria-label="Magwill – Lär för framtiden"><ellipse cx="80" cy="30" rx="78" ry="28" fill="#993333"/><text x="80" y="31" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="25" fill="#fff" letter-spacing="0.5">MAGWILL</text><text x="80" y="46" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="10.5" fill="#fff">Lär för framtiden</text></svg>`;
const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="31" ry="24" fill="#993333"/><text x="32" y="42" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="30" fill="#fff">M</text></svg>`;

// ---------------------------------------------------------------- JSON-LD
const orgLd = () => ({
  '@context': 'https://schema.org', '@type': 'EducationalOrganization', '@id': site.domain + '/#org',
  name: site.name, alternateName: site.shortName, slogan: site.tagline, url: site.domain,
  telephone: '+46' + site.phone.replace(/\D/g, '').slice(1), email: site.email, taxID: site.orgnr,
  address: { '@type': 'PostalAddress', streetAddress: site.street, postalCode: site.postal.replace(' ', ''), addressLocality: site.city, addressCountry: 'SE' },
  areaServed: { '@type': 'Country', name: 'Sverige' },
  knowsAbout: ['Microsoft Excel', 'Microsoft Word', 'Microsoft PowerPoint', 'Microsoft Access', 'Microsoft Project', 'VBA'],
});
const courseLd = c => ({
  '@context': 'https://schema.org', '@type': 'Course', name: c.name, description: c.short, url: abs('course:' + c.key), inLanguage: 'sv',
  provider: { '@type': 'Organization', name: site.name, '@id': site.domain + '/#org' },
  coursePrerequisites: c.prereq,
  hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'onsite', courseWorkload: `P${c.days}D`, location: { '@type': 'Place', name: 'Hos kunden, i hela Sverige' } },
});
const crumbLd = trail => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, key], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(key) })),
});

// ---------------------------------------------------------------- FAQ (our wording; every answer is based on their own site – see CONTENT-NOTES.md)
const faq = [
  ['Var hålls utbildningen?', 'Ute på plats hos er. Samla ihop medarbetarna, så kommer vi till er arbetsplats. Vi tar uppdrag i hela Sverige.'],
  ['Kan ni anpassa kursen efter oss?', 'Ja. Alla utbildningar kan anpassas efter era önskemål, och vi kan också skräddarsy en helt egen utbildning. Ni kan gärna ta med eget material, till exempel era egna Excelfiler eller mallar, och arbeta med det under kursen.'],
  ['Vad ingår?', 'Övningsuppgifter och lathundar ingår i alla utbildningar. Upplägget är gemensam genomgång varvad med praktisk övning, eftersom det är när man övar som man lär sig på riktigt.'],
  ['Hur lång är en kursdag?', 'En kursdag är normalt klockan 9–16. Kurserna är en eller två dagar långa, se respektive kurs.'],
  ['Går det att gå en kurs ensam?', 'Ja, vi erbjuder även individuell utbildning och konsultstöd, där vi sitter med dig och löser dina egna uppgifter medan du lär dig.'],
  ['Vad händer efter kursen?', 'Du fyller i en kursutvärdering. Efteråt kan vi sätta ihop en uppföljningsdag med repetition där vi tar upp de frågor som dykt upp när ni börjat använda det ni lärt er. Vi kan också ta fram dokumentation av kursmomenten som stöd i det dagliga arbetet.'],
  ['Vilken Excelkurs ska jag välja?', 'Har du knappt använt Excel: Excel grund. Är du självlärd: Excel intensiv. Kan du grunderna: Excel fortsättning, eller Excel för ekonomer om du arbetar med ekonomi. Ska du analysera data från flera tabeller: Excel PowerPivot.'],
  ['Vad kostar det?', 'Priset beror på vilken utbildning ni väljer, hur många deltagare ni är och om kursen ska anpassas. Gör en intresseanmälan eller ring, så får ni ett pris.'],
];
const faqLd = () => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

// ---------------------------------------------------------------- LAYOUT
const NAV = [['Utbildningar', 'courses'], ['Konsulttjänster', 'consulting'], ['Om oss', 'about'], ['Vanliga frågor', 'faq'], ['Kontakt', 'contact']];

function layout({ key, title, desc, body, jsonld = [], crumbs }) {
  const canonical = abs(key);
  desc = trunc(desc);
  const ld = [orgLd(), ...jsonld, ...(crumbs ? [crumbLd(crumbs)] : [])].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const inCourses = key === 'courses' || key.startsWith('course:');
  const mega = `<div class="mega"><div class="mega-grid">${programs.map(p => `<div><p class="mega-h">${mark(p.key)}${esc(p.name)}</p>${byProgram(p.key).map(c => `<a href="${url('course:' + c.key)}"${'course:' + c.key === key ? ' aria-current="page"' : ''}>${esc(c.name)}<span>${days(c.days)}</span></a>`).join('')}</div>`).join('')}</div><a class="mega-all" href="${url('courses')}">Alla utbildningar och vilken som passar dig ${I.arrow}</a></div>`;
  const navLinks = NAV.map(([label, k]) => {
    const on = k === 'courses' ? inCourses : k === key;
    return `<li class="${k === 'courses' ? 'has-mega' : ''}${on ? ' on' : ''}"><a href="${url(k)}"${k === key ? ' aria-current="page"' : ''}>${esc(label)}${k === 'courses' ? I.chev : ''}</a>${k === 'courses' ? mega : ''}</li>`;
  }).join('');
  const mmCourses = `<details${inCourses ? ' open' : ''}><summary>Utbildningar${I.chev}</summary><div class="mm-sub">${programs.map(p => `<p class="mm-h">${esc(p.name)}</p>${byProgram(p.key).map(c => `<a href="${url('course:' + c.key)}">${esc(c.name)}</a>`).join('')}`).join('')}<a class="mm-all" href="${url('courses')}">Alla utbildningar</a></div></details>`;

  return `<!DOCTYPE html>
<html lang="sv">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">${DEMO ? '\n<meta name="robots" content="noindex, nofollow">' : ''}
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="sv_SE">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">
<meta name="theme-color" content="#993333">
<link rel="icon" href="${BASE}/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}/assets/site.css">
${ld}
</head>
<body>
<a class="skip" href="#main">Hoppa till innehållet</a>
<header class="top">
  <div class="topbar"><div class="wrap">
    <span>Utbildning på plats hos er, i hela Sverige</span>
    <a href="${tel}">${I.phone}${esc(site.phone)}</a>
    <a class="hide-s" href="mailto:${site.email}">${I.mail}${esc(site.email)}</a>
  </div></div>
  <nav class="nav" aria-label="Huvudmeny"><div class="wrap">
    <a class="brand" href="${url('home')}">${LOGO}</a>
    <ul class="nav-links">${navLinks}</ul>
    <a class="btn btn-primary nav-cta" href="${applyUrl()}">Intresseanmälan</a>
    <button class="burger" aria-label="Meny" aria-controls="mm" aria-expanded="false">${I.menu}</button>
  </div></nav>
</header>
<div class="mobile-menu" id="mm" hidden>
  <div class="mm-head"><span>Meny</span><button class="close" aria-label="Stäng menyn">×</button></div>
  ${mmCourses}
  ${NAV.slice(1).map(([l, k]) => `<a href="${url(k)}">${esc(l)}</a>`).join('')}
  <a href="${url('jobs')}">Jobba med oss</a>
  <div class="mm-actions"><a class="btn btn-primary" href="${applyUrl()}">Intresseanmälan</a><a class="btn btn-ghost" href="${tel}">${I.phone}${esc(site.phone)}</a></div>
</div>
<main id="main">${body}</main>
${footer()}
<script src="${BASE}/assets/site.js" defer></script>
</body>
</html>`;
}

function footer() {
  return `<footer><div class="wrap">
  <div class="foot">
    <div class="foot-brand">
      <a class="brand" href="${url('home')}">${LOGO}</a>
      <p>Utbildning och konsultstöd i Microsoft Office, ute på plats hos er i hela Sverige.</p>
    </div>
    <div><h2>Utbildningar</h2><ul>${programs.map(p => `<li><a href="${url('course:' + byProgram(p.key)[0].key)}">${esc(p.name)}</a></li>`).join('')}<li><a href="${url('courses')}">Alla utbildningar</a></li></ul></div>
    <div><h2>Magwill</h2><ul><li><a href="${url('consulting')}">Konsulttjänster</a></li><li><a href="${url('about')}">Om oss</a></li><li><a href="${url('jobs')}">Jobba med oss</a></li><li><a href="${url('faq')}">Vanliga frågor</a></li></ul></div>
    <div><h2>Kontakt</h2><ul>
      <li><a href="${tel}">${esc(site.phone)}</a></li>
      <li><a href="mailto:${site.email}">${esc(site.email)}</a></li>
      <li>${esc(site.street)}<br>${esc(site.postal + ' ' + site.city)}</li>
      <li>Org.nr ${esc(site.orgnr)}</li>
    </ul></div>
  </div>
  <div class="foot-bottom"><span>© ${new Date().getFullYear()} ${esc(site.name)}</span>${DEMO ? '<span>Förslag till ny webbplats – demo, inte publicerad av Magwill.</span>' : ''}</div>
</div></footer>`;
}

// ---------------------------------------------------------------- PARTS
const pages = [];
const page = (key, o) => pages.push([url(key), layout({ key, ...o })]);
const crumbsHtml = trail => `<nav class="crumbs" aria-label="Brödsmulor">${trail.map(([n, k], i) => i === trail.length - 1 ? `<span aria-current="page">${esc(n)}</span>` : `<a href="${url(k)}">${esc(n)}</a>`).join('<span aria-hidden="true">/</span>')}</nav>`;
const phead = (h1, lead, trail, cell) => `<section class="phead"><div class="wrap">
  ${trail ? crumbsHtml(trail) : ''}
  ${cell ? `<span class="cellref">${esc(cell)}</span>` : ''}
  <h1>${esc(h1)}</h1>${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
</div></section>`;

const courseCard = c => `<a class="ccard" href="${url('course:' + c.key)}">
  <span class="ccard-top">${mark(c.program)}<span class="ccard-days">${I.cal}${days(c.days)}</span></span>
  <h3>${esc(c.name)}</h3>
  <p>${esc(c.short)}</p>
  <span class="ccard-foot"><span class="lvl">${esc(levels[c.level])}</span><span class="more">Kursinnehåll ${I.arrow}</span></span>
</a>`;

const excelGuideHtml = () => `<ol class="guide">${excelGuide.map(([q, k], i) => `<li><a href="${url('course:' + k)}"><span class="g-row">${i + 1}</span><span class="g-q">${esc(q)}</span><span class="g-a">${esc(CK[k].name)} ${I.arrow}</span></a></li>`).join('')}</ol>`;

const promises = [
  [I.building, 'På plats hos er', 'Vi kommer till er arbetsplats, var som helst i Sverige.'],
  [I.sliders, 'Anpassat efter er', 'Färdiga upplägg eller skräddarsytt, gärna med ert eget material.'],
  [I.book, 'Övningar och lathundar', 'Ingår i alla utbildningar, så att det sitter kvar efteråt.'],
  [I.smile, 'Nöjdgaranti', 'Gäller alla våra utbildningar.'],
];
const promisesHtml = () => `<ul class="promises">${promises.map(([ic, t, p]) => `<li><span class="p-ico">${ic}</span><div><h3>${esc(t)}</h3><p>${esc(p)}</p></div></li>`).join('')}</ul>`;

const ctaBand = (title = 'Berätta vad ni behöver lära er', lead = 'Välj en färdig kurs eller beskriv vad ni vill kunna, så återkommer vi med ett upplägg och ett pris.') => `<section class="cta"><div class="wrap"><div class="cta-band">
  <div><h2>${esc(title)}</h2><p>${esc(lead)}</p></div>
  <div class="btns"><a class="btn btn-light btn-lg" href="${applyUrl()}">Gör en intresseanmälan</a><a class="btn btn-outline-light btn-lg" href="${tel}">${I.phone}${esc(site.phone)}</a></div>
</div></div></section>`;

// Hero visual: a spreadsheet window listing their real courses. Decorative (aria-hidden) – the same facts are in the page text.
const heroSheet = () => {
  const rows = ['excelgr', 'excelforts', 'excelek', 'projectgr', 'wordfk', 'powpoint'].map(k => CK[k]);
  return `<div class="sheet" aria-hidden="true">
  <div class="sheet-bar"><i></i><i></i><i></i><span>Kursplan.xlsx</span></div>
  <div class="sheet-fx"><span class="fx-ref">D4</span><span class="fx-f">fx</span><span class="fx-v">=OM(Övning; "Lärt på riktigt"; "Övning")</span></div>
  <table>
    <thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr></thead>
    <tbody>
      <tr class="hdr"><th>1</th><td>Utbildning</td><td>Längd</td><td>Plats</td><td>Resultat</td></tr>
      ${rows.map((c, i) => `<tr><th>${i + 2}</th><td>${esc(c.name)}</td><td class="num">${days(c.days)}</td><td>Hos er</td><td${i === 2 ? ' class="sel"' : ''}>Lärt på riktigt</td></tr>`).join('')}
    </tbody>
  </table>
  <div class="sheet-tabs"><span class="on">Utbildningar</span><span>Konsultstöd</span><span>Uppföljning</span></div>
</div>`;
};

// ---------------------------------------------------------------- PAGES
// HOME
page('home', {
  title: 'Excelkurs, Wordkurs och Projectutbildning på plats hos er | Magwill',
  desc: 'Magwill utbildar i Excel, Word, PowerPoint, Access och MS Project ute på plats hos ert företag, i hela Sverige. Färdiga kurser eller skräddarsytt, med övningar och lathundar.',
  body: `
<section class="hero"><div class="wrap hero-grid">
  <div class="hero-copy">
    <span class="eyebrow">Företagsutbildning i Microsoft Office</span>
    <h1>Kurser i Excel, Word och Project, hållna <em>hos er</em>.</h1>
    <p class="lead">Samla ihop medarbetarna, så kommer vi ut till er, var som helst i Sverige. Gemensam genomgång varvas med praktisk övning, för det är när man övar som man lär sig på riktigt.</p>
    <div class="hero-cta">
      <a class="btn btn-primary btn-lg" href="${url('courses')}">Se alla utbildningar ${I.arrow}</a>
      <a class="btn btn-ghost btn-lg" href="${applyUrl()}">Gör en intresseanmälan</a>
    </div>
    <ul class="facts">
      <li><b>20 år</b><span>med utbildning i Microsoft Office</span></li>
      <li><b>${courses.length}</b><span>färdiga kurser att välja bland</span></li>
      <li><b>Hela Sverige</b><span>vi kommer till er</span></li>
    </ul>
  </div>
  ${heroSheet()}
</div></section>

<section class="band"><div class="wrap">${promisesHtml()}</div></section>

<section><div class="wrap">
  <div class="sec-head"><div><span class="cellref">A1</span><h2>Välj program</h2><p class="sub">Grund, fortsättning och fördjupning i de program ni faktiskt använder varje dag.</p></div><a class="link" href="${url('courses')}">Alla utbildningar ${I.arrow}</a></div>
  <div class="programs">
    ${programs.map(p => `<div class="program">
      <div class="program-h">${mark(p.key)}<div><h3>${esc(p.name)}</h3><p>${esc(p.pitch)}</p></div></div>
      <ul>${byProgram(p.key).map(c => `<li><a href="${url('course:' + c.key)}"><span>${esc(c.name)}</span><span class="d">${days(c.days)}</span>${I.arrow}</a></li>`).join('')}</ul>
    </div>`).join('')}
  </div>
</div></section>

<section class="soft"><div class="wrap split">
  <div>
    <span class="cellref">B1</span>
    <h2>Vilken Excelkurs passar dig?</h2>
    <p class="sub">Fem Excelkurser, för fem olika utgångslägen. Börja på den rad som låter som du.</p>
    <p class="mt"><a class="link" href="${url('courses')}#excel">Jämför Excelkurserna ${I.arrow}</a></p>
  </div>
  ${excelGuideHtml()}
</div></section>

<section><div class="wrap">
  <div class="sec-head"><div><span class="cellref">C1</span><h2>Så går det till</h2><p class="sub">Från behovsanalys till uppföljning. Ni väljer hur mycket av kedjan ni vill ha.</p></div></div>
  <ol class="steps">
    <li><span class="s-n">1</span><h3>Behovsanalys</h3><p>Vi går igenom vilka kunskaper olika avdelningar behöver och sätter en lägsta kravnivå.</p></li>
    <li><span class="s-n">2</span><h3>Utbildning på plats</h3><p>Färdig eller anpassad kurs hos er, med övningsuppgifter från er egen verksamhet.</p></li>
    <li><span class="s-n">3</span><h3>Utvärdering</h3><p>Deltagarna fyller i en kursutvärdering. Er feedback styr nästa tillfälle.</p></li>
    <li><span class="s-n">4</span><h3>Uppföljning</h3><p>En uppföljningsdag med repetition och de frågor som dykt upp i vardagen.</p></li>
  </ol>
</div></section>

<section class="dark"><div class="wrap split">
  <div>
    <span class="cellref light">D1</span>
    <h2>Mer än kurser</h2>
    <p class="lead">Sitter du med en uppgift där du behöver specifik hjälp, kommer vi ut och löser den med dig, och du lär dig under tiden.</p>
    <p class="mt"><a class="btn btn-light" href="${url('consulting')}">Konsulttjänster ${I.arrow}</a></p>
  </div>
  <ul class="chips">${consulting.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
</div></section>

<section><div class="wrap narrow">
  <figure class="quote">
    <blockquote><p>Vi lyssnar hellre på dig och ditt behov än att prata om hur bra vi är och vad vi erbjuder.</p></blockquote>
    <figcaption>Magwill, <a href="${url('about')}">om oss</a></figcaption>
  </figure>
</div></section>

${ctaBand()}`,
});

// COURSES HUB
page('courses', {
  title: 'Utbildningar i Excel, Word, PowerPoint, Access och MS Project | Magwill',
  desc: `${courses.length} färdiga utbildningar i Microsoft Office, från Data grund till Excel PowerPivot och MS Project. Alla kan anpassas och hålls på plats hos er i hela Sverige.`,
  crumbs: [['Start', 'home'], ['Utbildningar', 'courses']],
  body: `${phead('Utbildningar', 'Efter 20 år av utbildning och konsultation i Microsoft Office har vi samlat de mest eftertraktade momenten i varje kurs. Välj en färdig utbildning, eller låt oss skräddarsy en åt er.', [['Start', 'home'], ['Utbildningar', 'courses']])}
<section class="tight"><div class="wrap">
  <nav class="jump" aria-label="Program">${programs.map(p => `<a href="#${p.key}">${mark(p.key)}${esc(p.name)}</a>`).join('')}</nav>
</div></section>
${programs.map((p, i) => `<section id="${p.key}" class="${i % 2 ? 'soft' : ''}"><div class="wrap">
  <div class="sec-head"><div class="prog-head">${mark(p.key)}<div><h2>${esc(p.name)}</h2><p class="sub">${esc(p.pitch)}</p></div></div></div>
  ${p.key === 'excel' ? `<div class="split guide-split"><div><h3 class="h-sm">Vilken Excelkurs passar dig?</h3><p class="sub">Börja på den rad som låter som du.</p></div>${excelGuideHtml()}</div>` : ''}
  <div class="grid">${byProgram(p.key).map(courseCard).join('')}</div>
</div></section>`).join('')}
<section><div class="wrap">${promisesHtml()}</div></section>
${ctaBand('Hittar ni inte rätt kurs?', 'Alla utbildningar kan anpassas, och vi skräddarsyr gärna en egen. Berätta vad ni behöver kunna.')}`,
});

// COURSE PAGES
for (const c of courses) {
  const key = 'course:' + c.key;
  const trail = [['Start', 'home'], ['Utbildningar', 'courses'], [c.name, key]];
  const half = Math.ceil(c.content.length / 2);
  page(key, {
    title: `${c.name}, ${days(c.days)} på plats hos er | Magwill`,
    desc: `${c.name}: ${c.short} ${days(c.days)}, kl 9–16, hos er i hela Sverige.`,
    jsonld: [courseLd(c)], crumbs: trail,
    body: `${phead(c.name, c.short, trail)}
<section><div class="wrap course">
  <div class="course-main">
    <ul class="tags">
      <li>${mark(c.program)}${esc(PG[c.program].name)}</li>
      <li>${I.level}${esc(levels[c.level])}</li>
      <li>${I.cal}${days(c.days)}</li>
      <li>${I.building}Hos er</li>
    </ul>
    <div class="prose">${paras(c.intro)}</div>
    <h2 class="mt-l">Kursinnehåll</h2>
    <p class="sub">${c.content.length} moment. Innehållet kan anpassas efter er.</p>
    <div class="syllabus">
      <ul>${c.content.slice(0, half).map(x => `<li>${I.check}<span>${esc(x)}</span></li>`).join('')}</ul>
      <ul>${c.content.slice(half).map(x => `<li>${I.check}<span>${esc(x)}</span></li>`).join('')}</ul>
    </div>
  </div>
  <aside class="aside">
    <h2>Kursinformation</h2>
    <dl>
      <dt>Längd</dt><dd>${days(c.days)}</dd>
      <dt>Tid</dt><dd>kl 9–16</dd>
      <dt>Plats</dt><dd>Hos er, i hela Sverige</dd>
      <dt>Förkunskaper</dt><dd>${esc(c.prereq)}</dd>
      <dt>Ingår</dt><dd>Övningsuppgifter och lathundar</dd>
      <dt>Garanti</dt><dd>Nöjdgaranti</dd>
    </dl>
    <a class="btn btn-primary btn-block" href="${applyUrl(c)}">Gör en intresseanmälan</a>
    <p class="aside-alt">eller ring <a href="${tel}">${esc(site.phone)}</a></p>
  </aside>
</div></section>
<section class="soft"><div class="wrap">
  <div class="sec-head"><div><h2>Gå vidare</h2><p class="sub">Kurser som ofta passar före eller efter ${esc(c.name)}.</p></div><a class="link" href="${url('courses')}">Alla utbildningar ${I.arrow}</a></div>
  <div class="grid">${c.next.map(k => courseCard(CK[k])).join('')}</div>
</div></section>
${ctaBand(`Vill ni gå ${c.name}?`, 'Berätta hur många ni är och ungefär när ni vill ha kursen, så återkommer vi med förslag på upplägg och pris.')}`,
  });
}

// CONSULTING
page('consulting', {
  title: 'Konsulttjänster: mallar, Excelmodeller, Access och VBA | Magwill',
  desc: 'Behovsanalys, dokumentation, mallar i Office, kalkylmodeller i Excel, databaser i Access, VBA-lösningar och projektmodeller i MS Project. Vi kommer ut och hjälper er.',
  crumbs: [['Start', 'home'], ['Konsulttjänster', 'consulting']],
  body: `${phead('Konsulttjänster', 'Sitter du med en uppgift där du behöver specifik rådgivning och hjälp? Vi kommer ut till ert företag och löser den tillsammans med dig.', [['Start', 'home'], ['Konsulttjänster', 'consulting']])}
<section><div class="wrap split">
  <div>
    <h2>Vi utvecklar och ger expertstöd inom</h2>
    <p class="sub">Utbildning och specifika lösningar, för det som behövs just hos er.</p>
  </div>
  <ul class="checks two">${consulting.map(s => `<li>${I.check}<span>${esc(s)}</span></li>`).join('')}</ul>
</div></section>
<section class="soft"><div class="wrap">
  <div class="cols3">
    <article class="panel"><span class="p-ico">${I.search}</span><h3>Behovsanalys</h3><p>Vi analyserar ert företags utbildningsbehov och sätter en lägsta kravnivå för varje del av verksamheten. Steg två är utbildning med övningsuppgifter anpassade efter er verksamhet.</p><p>Resultatet är ett verktyg som ser till att alla medarbetare har den kunskap som behövs, och som också fungerar vid nyrekrytering.</p></article>
    <article class="panel"><span class="p-ico">${I.doc}</span><h3>Dokumentation</h3><p>Efter en utbildning kan vi ta fram dokumentation av de moment ni gått igenom. Den blir ett stöd i det dagliga arbetet och ett sätt att säkra en lägstanivå när nya medarbetare börjar.</p></article>
    <article class="panel"><span class="p-ico">${I.user}</span><h3>Konsultstöd och individuell utbildning</h3><p>Sitter du med mallar eller databaser du behöver behärska, eller ska du bygga upp kalkylmodeller i Excel? Då kommer vi ut och hjälper dig, och du är med och lär dig under tiden.</p></article>
  </div>
</div></section>
<section><div class="wrap split">
  <div><span class="cellref">E1</span><h2>Efter utbildningen</h2></div>
  <div class="prose"><p>Efter genomförd utbildning kan vi sätta ihop tillfällen för en uppföljningsdag. Där repeterar vi det ni lärt er och tar upp de moment och frågor som ni och era medarbetare har funderat över sedan kursen.</p></div>
</div></section>
${ctaBand('Beskriv uppgiften', 'Berätta vad ni behöver hjälp med, så hittar vi en lösning.')}`,
});

// ABOUT
page('about', {
  title: 'Om Magwill – Office-utbildning med fokus på övning | Magwill',
  desc: 'Magwill utbildar i Microsoft Office för att öka effektiviteten och lönsamheten hos företag. Lärare som arbetar som konsulter i näringslivet, övningar och lathundar, nöjdgaranti.',
  crumbs: [['Start', 'home'], ['Om oss', 'about']],
  body: `${phead('Om Magwill', 'Vårt fokus är att erbjuda utbildningar som ökar effektiviteten och lönsamheten på ert företag. Vi hjälper också företag att bygga mallar och modeller i programmen.', [['Start', 'home'], ['Om oss', 'about']])}
<section><div class="wrap split">
  <div class="prose">
    <h2>Lärare från näringslivet</h2>
    <p>Våra lärare arbetar ute i näringslivet som konsulter inom sina ämnesområden och har mångårig erfarenhet och god pedagogisk förmåga. Därför kan exempel och övningar från verkliga arbetsplatser användas på utbildningarna.</p>
    <p>Alla lärare genomgår internutbildning, vilket säkerställer utbildning av högsta kvalitet.</p>
    <h2 class="mt-l">Så undervisar vi</h2>
    <p>Utbildningarna genomförs med gemensam genomgång som varvas med praktisk övning. Vi prioriterar övningstillfällena högt, eftersom det är då man faktiskt lär sig på riktigt.</p>
    <p>Vi utvecklar människor, och en utbildning hos oss ska bli en både informativ och spännande resa.</p>
  </div>
  <figure class="quote side">
    <blockquote><p>Vi gillar människor och brinner för att utveckla människor. Goda relationer skapas mellan människor och inte mellan företag. Det handlar om förtroende och att du ska känna dig nöjd.</p></blockquote>
    <figcaption>Varmt välkommen!</figcaption>
  </figure>
</div></section>
<section class="soft"><div class="wrap">${promisesHtml()}</div></section>
<section><div class="wrap split">
  <div><h2>Företagsuppgifter</h2></div>
  <dl class="facts-dl">
    <dt>Företag</dt><dd>${esc(site.name)}</dd>
    <dt>Org.nr</dt><dd>${esc(site.orgnr)}</dd>
    <dt>Adress</dt><dd>${esc(addrLine)}</dd>
    <dt>Telefon</dt><dd><a href="${tel}">${esc(site.phone)}</a></dd>
    <dt>E-post</dt><dd><a href="mailto:${site.email}">${esc(site.email)}</a></dd>
  </dl>
</div></section>
${ctaBand()}`,
});

// JOBS
page('jobs', {
  title: 'Jobba med oss – utbildare i Office, Project och VBA | Magwill',
  desc: 'Magwill söker erfarna utbildare och konsulter inom MS Project, Excel, PowerPivot, VBA, SQL och Access, webbutveckling och SharePoint.',
  crumbs: [['Start', 'home'], ['Jobba med oss', 'jobs']],
  body: `${phead('Jobba med oss', 'Vårt fokus är att öka våra kunders lönsamhet genom utbildning av hög kvalitet. Vi har stor efterfrågan på uppdrag och söker personer med gedigen kunskap och erfarenhet.', [['Start', 'home'], ['Jobba med oss', 'jobs']])}
<section><div class="wrap split">
  <div class="prose">
    <h2>Vi söker kompetens inom</h2>
    <p>Vi har höga krav på kvalitet och service. Därför är det viktigt att du har hög kompetens och god pedagogisk förmåga, och mångårig erfarenhet både inom ditt ämne och som utbildare.</p>
    <p>Vi är alltid intresserade av att komma i kontakt med duktiga medarbetare. Vill du vara med i vårt rekryteringsarkiv är du välkommen att höra av dig.</p>
    <p class="mt"><a class="btn btn-primary" href="mailto:${site.email}?subject=${encodeURIComponent('Rekryteringsarkiv')}">${I.mail}Mejla oss</a></p>
  </div>
  <ul class="chips light">${hiring.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
</div></section>`,
});

// FAQ
page('faq', {
  title: 'Vanliga frågor om våra utbildningar | Magwill',
  desc: 'Var hålls utbildningen, kan den anpassas, vad ingår, hur lång är en kursdag och vilken Excelkurs ska man välja? Svar på de vanligaste frågorna.',
  jsonld: [faqLd()], crumbs: [['Start', 'home'], ['Vanliga frågor', 'faq']],
  body: `${phead('Vanliga frågor', 'Hittar du inte svaret? Ring eller mejla, så svarar vi direkt.', [['Start', 'home'], ['Vanliga frågor', 'faq']])}
<section><div class="wrap narrow"><div class="faq">
  ${faq.map(([q, a]) => `<details><summary>${esc(q)}${I.chev}</summary><div class="answer"><p>${esc(a)}</p></div></details>`).join('')}
</div></div></section>
${ctaBand()}`,
});

// CONTACT
page('contact', {
  title: 'Kontakta Magwill – Office-utbildning i hela Sverige | Magwill',
  desc: `Ring ${site.phone} eller mejla ${site.email}. Magwill AB, ${addrLine}. Utbildningarna hålls på plats hos er, i hela Sverige.`,
  crumbs: [['Start', 'home'], ['Kontakt', 'contact']],
  body: `${phead('Kontakta oss', 'Enklast når du oss på telefon eller mejl. Utbildningarna hålls hos er, så det spelar ingen roll var i landet ni finns.', [['Start', 'home'], ['Kontakt', 'contact']])}
<section><div class="wrap contact-grid">
  <div class="contact-rows">
    <a class="crow" href="${tel}">${I.phone}<div><b>Ring</b><span>${esc(site.phone)}</span></div></a>
    <a class="crow" href="mailto:${site.email}">${I.mail}<div><b>Mejla</b><span>${esc(site.email)}</span></div></a>
    <a class="crow" href="${site.maps}" target="_blank" rel="noopener">${I.pin}<div><b>Huvudkontor</b><span>${esc(site.name)}, ${esc(addrLine)}</span></div></a>
    <div class="crow">${I.map}<div><b>Utbildningsort</b><span>Hos er, var som helst i Sverige</span></div></div>
  </div>
  <div class="panel">
    <h2>Gör en intresseanmälan</h2>
    <p>Välj kurs, berätta hur många ni är och ungefär när, så återkommer vi med upplägg och pris.</p>
    <p class="mt"><a class="btn btn-primary" href="${applyUrl()}">Till intresseanmälan ${I.arrow}</a></p>
    <p class="small">Org.nr ${esc(site.orgnr)}</p>
  </div>
</div></section>`,
});

// APPLY (intresseanmälan)
page('apply', {
  title: 'Intresseanmälan | Magwill',
  desc: 'Anmäl intresse för en utbildning i Excel, Word, PowerPoint, Access eller MS Project på plats hos er, eller beskriv vad ni behöver hjälp med.',
  crumbs: [['Start', 'home'], ['Intresseanmälan', 'apply']],
  body: `${phead('Intresseanmälan', 'Fyll i det du vet, resten reder vi ut tillsammans. Vi återkommer med förslag på upplägg och pris.', [['Start', 'home'], ['Intresseanmälan', 'apply']])}
<section><div class="wrap contact-grid">
  <form class="form" data-apply novalidate>
    <div class="two-up">
      <div class="field"><label for="f-name">Namn</label><input id="f-name" name="name" autocomplete="name" required></div>
      <div class="field"><label for="f-org">Företag</label><input id="f-org" name="organization" autocomplete="organization"></div>
    </div>
    <div class="two-up">
      <div class="field"><label for="f-email">E-post</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="f-phone">Telefon <span class="opt">(valfritt)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
    </div>
    <div class="field"><label for="f-course">Utbildning eller tjänst</label><select id="f-course" name="course">
      <option value="">Vet inte än, hjälp mig välja</option>
      ${programs.map(p => `<optgroup label="${esc(p.name)}">${byProgram(p.key).map(c => `<option value="${c.slug}">${esc(c.name)} (${days(c.days)})</option>`).join('')}</optgroup>`).join('')}
      <optgroup label="Annat"><option value="skraddarsydd">Skräddarsydd utbildning</option><option value="individuell">Individuell utbildning</option><option value="konsult">Konsultstöd</option><option value="behovsanalys">Behovsanalys</option></optgroup>
    </select></div>
    <div class="two-up">
      <div class="field"><label for="f-count">Antal deltagare</label><select id="f-count" name="participants"><option>1</option><option>2–5</option><option>6–10</option><option>11–20</option><option>Fler än 20</option></select></div>
      <div class="field"><label for="f-city">Ort</label><input id="f-city" name="city" autocomplete="address-level2"></div>
    </div>
    <div class="field"><label for="f-when">Önskad tidpunkt <span class="opt">(valfritt)</span></label><input id="f-when" name="when" placeholder="t.ex. vecka 44 eller i vår"></div>
    <div class="field"><label for="f-msg">Meddelande</label><textarea id="f-msg" name="message" rows="5" placeholder="Vad vill ni kunna efter kursen? Använder ni några egna filer eller mallar?"></textarea></div>
    <p class="form-err" role="alert" hidden>Fyll i namn och en giltig e-postadress.</p>
    <button class="btn btn-primary btn-lg" type="submit">Skicka intresseanmälan</button>
    <p class="form-done" tabindex="-1" hidden>Tack! Det här är en demo, så inget har skickats. Ring <a href="${tel}">${esc(site.phone)}</a> eller mejla <a href="mailto:${site.email}">${esc(site.email)}</a>.</p>
    ${DEMO ? '<p class="small">Demo: formuläret skickar ingenting.</p>' : ''}
  </form>
  <div class="contact-rows">
    <a class="crow" href="${tel}">${I.phone}<div><b>Hellre ringa?</b><span>${esc(site.phone)}</span></div></a>
    <a class="crow" href="mailto:${site.email}">${I.mail}<div><b>Mejla</b><span>${esc(site.email)}</span></div></a>
    <div class="crow">${I.clock}<div><b>Kursdagar</b><span>kl 9–16, en eller två dagar</span></div></div>
  </div>
</div></section>`,
});

// 404
const notFound = layout({
  key: 'home', title: 'Sidan finns inte | Magwill', desc: 'Sidan du letar efter finns inte längre. Se alla utbildningar i Microsoft Office eller kontakta Magwill.',
  body: `${phead('Sidan finns inte', 'Vi har byggt om webbplatsen, så gamla länkar kan ha flyttat. Här är vägen vidare.', null, '#REFERENS!')}
<section><div class="wrap"><p class="btns-row"><a class="btn btn-primary btn-lg" href="${url('courses')}">Alla utbildningar</a> <a class="btn btn-ghost btn-lg" href="${url('contact')}">Kontakta oss</a></p></div></section>`,
});

// ---------------------------------------------------------------- WRITE
fs.rmSync(OUT, { recursive: true, force: true });
const write = (rel, content) => {
  const file = path.join(OUT, rel.slice(BASE.length), 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
for (const [rel, html] of pages) write(rel, html);
fs.writeFileSync(path.join(OUT, '404.html'), notFound);
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });
fs.copyFileSync(path.join(__dirname, 'src', 'site.css'), path.join(OUT, 'assets', 'site.css'));
fs.copyFileSync(path.join(__dirname, 'src', 'site.js'), path.join(OUT, 'assets', 'site.js'));
fs.writeFileSync(path.join(OUT, 'favicon.svg'), FAVICON);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(([rel]) => `<url><loc>${site.domain}${rel.slice(BASE.length)}</loc></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), DEMO ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${site.domain}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, '_redirects'), redirects.map(([from, to]) => `${from}  ${to}  301`).join('\n') + '\n');

console.log(`Magwill: ${pages.length} pages → ${OUT}`);
