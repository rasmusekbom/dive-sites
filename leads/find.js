// Lead finder: small Swedish businesses whose website is missing, broken or dated – i.e. people who need a new site.
//   node find.js                          → default categories, all of Sweden
//   node find.js --cat dyk,segling        → pick categories (see categories.js)
//   node find.js --area "Stockholms län"  → limit to an OSM admin area (län or kommun, Swedish name)
//   node find.js --add egna.csv           → also check leads from elsewhere (name;website;city;category)
//   node find.js --no-osm --add egna.csv → only your own list, skip OpenStreetMap
//   node find.js --fresh                  → ignore the cached OpenStreetMap answer (kept 24 h)
//   node find.js --limit 40               → only check the first N sites (quick test run)
//   PSI_KEY=... node find.js --psi        → also fetch the Google PageSpeed mobile score (free API key)
// Output: out/leads-<date>.csv (semicolon-separated, opens straight in Swedish Excel) and out/leads-<date>.html
// (sortable report with a ready pitch line per lead). No dependencies; Node 18+.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { categories, defaults, exclude } = require('./categories.js');

// ---------------------------------------------------------------- ARGS
const argv = process.argv.slice(2);
const flag = n => argv.includes('--' + n);
const opt = (n, d) => { const i = argv.indexOf('--' + n); return i >= 0 && argv[i + 1] ? argv[i + 1] : d; };
if (flag('help')) { console.log(fs.readFileSync(__filename, 'utf8').split('\n').filter(l => l.startsWith('//')).join('\n')); process.exit(0); }
const CATS = opt('cat', defaults.join(',')).split(',').map(s => s.trim()).filter(Boolean);
for (const c of CATS) if (!categories[c]) { console.error(`Okänd kategori "${c}". Finns: ${Object.keys(categories).join(', ')}`); process.exit(1); }
const AREA = opt('area', '');
const LIMIT = +opt('limit', 0);
const CONCURRENCY = +opt('concurrency', 6);
// Public Overpass servers, tried in order (the main one refuses some cloud/VPN addresses with 406).
const OVERPASS = process.env.OVERPASS_URL ? [process.env.OVERPASS_URL] : ['https://overpass-api.de/api/interpreter', 'https://maps.mail.ru/osm/tools/overpass/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const OUT = path.join(__dirname, 'out');
const CACHE = path.join(__dirname, '.cache');
const YEAR = new Date().getFullYear();
const TODAY = new Date().toISOString().slice(0, 10);
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36';

// ---------------------------------------------------------------- 1. OPENSTREETMAP
function overpassQuery() {
  const area = AREA
    ? `area["name"="${AREA.replace(/"/g, '')}"]["boundary"="administrative"]->.a;`
    : `area["ISO3166-1"="SE"][admin_level=2]->.a;`;
  const parts = CATS.flatMap(c => categories[c].filters.map(f => `nwr${f}(area.a);`));
  return `[out:json][timeout:180];${area}(${parts.join('')});out center tags;`;
}

async function fetchOsm() {
  const q = overpassQuery();
  const file = path.join(CACHE, `overpass-${crypto.createHash('sha1').update(q).digest('hex').slice(0, 12)}.json`);
  if (!flag('fresh') && fs.existsSync(file) && Date.now() - fs.statSync(file).mtimeMs < 864e5) {
    console.log('OpenStreetMap: från cache (' + path.relative(__dirname, file) + ')');
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  }
  console.log(`OpenStreetMap: hämtar ${CATS.join(', ')}${AREA ? ' i ' + AREA : ' i hela Sverige'} …`);
  let json, errors = [];
  for (const server of OVERPASS) {
    try {
      const res = await fetch(server, { method: 'POST', signal: AbortSignal.timeout(240000), headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'dive-sites-lead-finder/1.0', Accept: 'application/json' }, body: 'data=' + encodeURIComponent(q) });
      if (!res.ok) throw new Error(`svarade ${res.status}`);
      json = await res.json();
      if (json.remark && !json.elements?.length) throw new Error(json.remark.slice(0, 200));
      break;
    } catch (e) { errors.push(`${new URL(server).host}: ${e.cause?.code || e.message}`); }
  }
  if (!json) throw new Error('ingen Overpass-server svarade:\n  ' + errors.join('\n  '));
  if (!json.elements?.length && AREA) console.warn(`Inga träffar – heter området exakt "${AREA}" i OpenStreetMap? (t.ex. "Stockholms län", "Göteborgs kommun")`);
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(json));
  return json;
}

// Which of our categories an element matched – re-evaluates the simple ["k"="v"] / ["k"~"a|b"] filters on its tags.
function categoryOf(tags) {
  for (const c of CATS) {
    for (const f of categories[c].filters) {
      const conds = [...f.matchAll(/\["([^"]+)"(?:(=|~)"([^"]+)")?\]/g)];
      if (conds.every(([, k, op, v]) => op === '=' ? tags[k] === v : op === '~' ? new RegExp(v).test(tags[k] || '') : k in tags)) return c;
    }
  }
  return CATS[0];
}

const first = (t, ...keys) => keys.map(k => t[k]).find(Boolean) || '';
function fromOsm(el) {
  const t = el.tags || {};
  const name = t.name || t['name:sv'] || t.operator || t.brand || '';
  if (!name) return null;
  return {
    name,
    category: categoryOf(t),
    website: first(t, 'website', 'contact:website', 'url', 'operator:website'),
    phone: first(t, 'phone', 'contact:phone', 'contact:mobile'),
    email: first(t, 'email', 'contact:email'),
    social: first(t, 'contact:facebook', 'facebook', 'contact:instagram', 'instagram'),
    street: [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' '),
    city: first(t, 'addr:city', 'addr:municipality', 'addr:place', 'addr:suburb'),
    lat: el.lat ?? el.center?.lat, lon: el.lon ?? el.center?.lon,
    osm: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    source: 'OSM',
  };
}

// Extra leads from any other source (PADI dive-centre locator, hitta.se, a club list …): name;website;city;category
function fromCsv(file) {
  const lines = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim());
  const sep = lines[0].includes(';') ? ';' : ',';
  const head = lines[0].toLowerCase().split(sep).map(s => s.trim());
  const hasHead = head.includes('name') || head.includes('namn');
  const col = (row, ...n) => { const i = head.findIndex(h => n.includes(h)); return i >= 0 ? (row[i] || '').trim() : ''; };
  return (hasHead ? lines.slice(1) : lines).map(l => {
    const r = l.split(sep);
    return hasHead
      ? { name: col(r, 'name', 'namn'), website: col(r, 'website', 'hemsida', 'url'), city: col(r, 'city', 'ort', 'stad'), category: col(r, 'category', 'kategori') || 'egen', phone: col(r, 'phone', 'telefon'), email: col(r, 'email', 'e-post', 'epost'), source: path.basename(file) }
      : { name: r[0]?.trim(), website: r[1]?.trim() || '', city: r[2]?.trim() || '', category: r[3]?.trim() || 'egen', source: path.basename(file) };
  }).filter(l => l.name);
}

const normUrl = u => { u = (u || '').trim().split(/[;\s]/)[0]; if (!u) return ''; return /^https?:\/\//i.test(u) ? u : 'https://' + u.replace(/^\/+/, ''); };
const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
const SOCIAL = /(^|\.)(facebook\.com|fb\.com|instagram\.com|linkedin\.com|tiktok\.com|youtube\.com|twitter\.com|x\.com|m\.facebook\.com)$/;
// Hosts that are listings, not the business's own site.
const DIRECTORY = /(^|\.)(padi\.com|ssi\.com|tripadvisor\.[a-z.]+|google\.[a-z.]+|goo\.gl|hitta\.se|eniro\.se|allabolag\.se|visit[a-z]*\.(se|com)|booking\.com|airbnb\.[a-z.]+|wikipedia\.org|sportadmin\.se|idrottonline\.se)$/;

function dedupe(leads) {
  const seen = new Map();
  for (const l of leads) {
    // Same site = same business. Keyed on host + path, so two clubs with pages on one shared host stay apart.
    const u = normUrl(l.website), h = hostOf(u);
    const key = h && !SOCIAL.test(h) && !DIRECTORY.test(h) ? h + new URL(u).pathname.replace(/\/(index\.\w+)?$/, '').toLowerCase() : (l.name + '|' + l.city).toLowerCase().replace(/\s+/g, ' ');
    const prev = seen.get(key);
    if (!prev) { seen.set(key, l); continue; }
    for (const k of ['website', 'phone', 'email', 'social', 'street', 'city']) prev[k] ||= l[k];
  }
  return [...seen.values()];
}

// ---------------------------------------------------------------- 2. WEBSITE CHECK
const PLACEHOLDER = /under (construction|uppbyggnad|konstruktion)|kommer snart|coming soon|håller på att (uppdatera|bygga)|vi bygger om|sidan är under|site is under|launching soon|domain (is )?for sale|denna domän|this domain (is|may be)|parked (free|domain)|welcome to nginx|it works!|default web site page|web hosting by one\.com|hostas av|webbhotell/i;
const BOOKING = /bokadirekt|rezdy|fareharbor|checkfront|bokun|simplybook|timecenter|bookingkit|regiondo|peek\.com|xola|tickster|billetto|trybooking|smartbooking|boka\.se|bokamera|bookeo|calendly|youcanbook|zoezi|sportadmin|\bboka\b|book now|boka nu|online.?bokning/i;
const BUILDERS = [
  [/wix\.com|_wixCIDX|wixstatic/i, 'Wix'], [/squarespace/i, 'Squarespace'], [/webnode/i, 'Webnode'], [/jimdo/i, 'Jimdo'],
  [/hemsida24|hemsida\.eu/i, 'Hemsida24'], [/weebly/i, 'Weebly'], [/one\.com|onecom-/i, 'one.com'], [/sitevision/i, 'Sitevision'],
  [/shopify/i, 'Shopify'], [/wp-content|wp-includes/i, 'WordPress'], [/joomla/i, 'Joomla'], [/drupal/i, 'Drupal'],
  [/frontpage|microsoft word|dreamweaver|msohtml/i, 'Handskriven / gammalt verktyg'],
];

async function check(lead) {
  const r = { final: '', status: 0, ms: 0, https: false, mobile: null, noindex: false, title: '', desc: false, year: 0, placeholder: false, oldTech: [], builder: '', wpVersion: '', booking: false, bytes: 0, error: '' };
  const url = normUrl(lead.website);
  if (!url) return r;
  const h = hostOf(url);
  if (SOCIAL.test(h) || DIRECTORY.test(h)) { r.final = url; return r; }
  // No scheme or a dead scheme: try https first, then http – "works only on http" is itself a finding.
  const other = url.startsWith('https:') ? 'http:' + url.slice(6) : 'https:' + url.slice(5);
  const t0 = Date.now();
  try {
    let res, buf;
    for (const u of [url, other]) {
      try {
        res = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(20000), headers: { 'User-Agent': UA, 'Accept-Language': 'sv-SE,sv;q=0.9,en;q=0.5', Accept: 'text/html,application/xhtml+xml,*/*;q=0.8' } });
        buf = Buffer.from(await res.arrayBuffer());
        break;
      } catch (e) { if (u === other) throw e; }
    }
    r.ms = Date.now() - t0;
    r.status = res.status;
    r.final = res.url || url;
    r.https = r.final.startsWith('https:');
    r.bytes = buf.length;
    // Bot walls (Cloudflare, SiteGround, one.com …) answer 202/403/429/466/503 or a challenge page: that says nothing
    // about the site itself, so flag it for a manual look instead of calling it broken.
    const head = buf.subarray(0, 20000).toString('latin1');
    if ([202, 401, 403, 406, 429, 466, 503].includes(res.status) || /cf-chl|challenge-platform|sgcaptcha|just a moment\.\.\.|captcha/i.test(head) && buf.length < 30000) {
      r.blocked = true;
      return r;
    }
    const ctype = res.headers.get('content-type') || '';
    const latin1 = /iso-8859-1|windows-1252/i.test(ctype) || /<meta[^>]+charset=["']?(iso-8859-1|windows-1252)/i.test(buf.subarray(0, 2048).toString('latin1'));
    const html = buf.toString(latin1 ? 'latin1' : 'utf8');
    const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ');
    r.mobile = /<meta[^>]+name=["']?viewport/i.test(html);
    r.noindex = /<meta[^>]+name=["']?robots["']?[^>]+noindex/i.test(html) || /noindex/i.test(res.headers.get('x-robots-tag') || '');
    r.title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim().replace(/\s+/g, ' ') || '';
    r.desc = /<meta[^>]+name=["']?description["']?[^>]+content=["'][^"']{20,}/i.test(html) || /<meta[^>]+content=["'][^"']{20,}["'][^>]+name=["']?description/i.test(html);
    // Newest year that sits next to ©/copyright; the best cheap proxy for "last touched".
    const yrs = [...text.matchAll(/(?:©|&copy;|copyright|\(c\))[^0-9]{0,40}((?:19|20)\d\d)(?:\s*[-–]\s*((?:19|20)\d\d))?/gi)].flatMap(m => [+m[1], +(m[2] || 0)]).filter(y => y <= YEAR);
    r.year = yrs.length ? Math.max(...yrs) : 0;
    r.placeholder = PLACEHOLDER.test(text.slice(0, 4000)) && text.length < 6000;
    if (latin1) r.oldTech.push('teckenkodning ISO-8859-1');
    if (/<font[\s>]/i.test(html)) r.oldTech.push('<font>-taggar');
    if (/<table[^>]+width=["']?\d{3,4}/i.test(html) || /<frameset/i.test(html)) r.oldTech.push('tabell-/ramlayout');
    if (/\.swf\b|<embed[^>]+flash/i.test(html)) r.oldTech.push('Flash');
    if (/<marquee|<blink|<!DOCTYPE HTML PUBLIC "-\/\/W3C\/\/DTD HTML 4/i.test(html)) r.oldTech.push('HTML 4');
    const gen = (html.match(/<meta[^>]+name=["']?generator["']?[^>]+content=["']([^"']+)/i) || [])[1] || '';
    r.builder = (BUILDERS.find(([re]) => re.test(gen) || re.test(html.slice(0, 60000))) || [])[1] || '';
    r.wpVersion = (gen.match(/WordPress\s+([\d.]+)/i) || [])[1] || '';
    r.booking = BOOKING.test(html);
    if (!lead.email) lead.email = (html.match(/mailto:([^"'?\s>]+@[^"'?\s>]+)/i) || [])[1] || '';
    if (!lead.phone) lead.phone = decodeURIComponent((html.match(/href=["']tel:([^"']+)/i) || [])[1] || '');
    if (!lead.social) lead.social = (html.match(/https?:\/\/(?:www\.)?(?:facebook|instagram)\.com\/[^"'\s<>]+/i) || [])[0] || '';
  } catch (e) {
    r.ms = Date.now() - t0;
    r.error = /abort|timeout/i.test(e.name) ? 'timeout' : (e.cause?.code || e.message || String(e));
  }
  return r;
}

async function pagespeed(url) {
  if (!flag('psi') || !url) return null;
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?strategy=mobile&category=performance&url=${encodeURIComponent(url)}${process.env.PSI_KEY ? '&key=' + process.env.PSI_KEY : ''}`;
  try {
    const j = await (await fetch(api)).json();
    const s = j.lighthouseResult?.categories?.performance?.score;
    return s == null ? null : Math.round(s * 100);
  } catch { return null; }
}

// ---------------------------------------------------------------- 3. SCORE + PITCH
// Higher score = clearer, more sellable problem. Each hook is a sentence you can put in the first message.
function assess(lead, r) {
  const hooks = [];
  let score = 0;
  const add = (pts, hook) => { score += pts; hooks.push(hook); };
  const url = normUrl(lead.website);
  const h = hostOf(url);
  if (!url) add(35, lead.social ? 'Har ingen egen hemsida, bara sociala medier.' : 'Har ingen hemsida alls.');
  else if (SOCIAL.test(h)) add(40, `"Hemsidan" är en ${h.split('.')[0][0].toUpperCase() + h.split('.')[0].slice(1)}-sida. Den syns dåligt på Google och kräver ofta inloggning.`);
  else if (DIRECTORY.test(h)) add(30, `Hemsidan pekar på en katalog (${h}), inte en egen sajt.`);
  else if (r.error) add(35, r.error === 'timeout' ? 'Sajten laddar inte (gav upp efter 20 s).' : `Sajten går inte att nå (${r.error}).`);
  else if (r.blocked) { score = 10; hooks.push(`Sajten stoppar automatiska besök (svar ${r.status}). Titta på den manuellt.`); }
  else if (r.status >= 400) add(35, `Sajten svarar med fel ${r.status}.`);
  else {
    if (r.placeholder) add(40, 'Sajten är en platshållare ("under uppbyggnad" / "kommer snart").');
    if (r.noindex) add(30, 'Sajten ber Google att inte visa den (noindex). Den syns inte vid sökningar.');
    if (r.mobile === false) add(30, 'Sajten är inte mobilanpassad. Den visas som en förminskad datorsida i mobilen.');
    if (!r.https) add(15, 'Sajten saknar https, så webbläsaren visar "Inte säker".');
    if (r.year && YEAR - r.year >= 6) add(25, `Copyright-året i sidfoten är ${r.year}. Sajten verkar inte ha rörts på länge.`);
    else if (r.year && YEAR - r.year >= 3) add(12, `Copyright-året i sidfoten är ${r.year}.`);
    if (r.oldTech.length) add(15, `Föråldrad teknik: ${r.oldTech.join(', ')}.`);
    if (r.wpVersion && +r.wpVersion.split('.')[0] < 6) add(10, `Kör WordPress ${r.wpVersion}, som är flera år gammalt och har kända säkerhetshål.`);
    if (r.ms > 6000) add(18, `Startsidan tog ${(r.ms / 1000).toFixed(1)} s att hämta.`);
    else if (r.ms > 3000) add(8, `Startsidan tog ${(r.ms / 1000).toFixed(1)} s att hämta.`);
    if (r.psi != null && r.psi < 50) add(15, `Googles PageSpeed-betyg på mobil: ${r.psi}/100.`);
    if (!r.title || r.title.length < 12) add(5, 'Sidan saknar en riktig titel, så sökresultatet blir otydligt.');
    if (!r.desc) add(4, 'Ingen beskrivning för Google (meta description).');
    if (!r.booking && ['dyk', 'kajak', 'bat', 'surf', 'fiske'].includes(lead.category)) add(6, 'Ingen onlinebokning hittades på startsidan.');
    if (['Wix', 'Squarespace', 'Shopify'].includes(r.builder) && score < 20) score -= 10; // decent builder, nothing wrong: weak lead
  }
  if (!lead.phone && !lead.email) score -= 5; // hard to reach
  return { score: Math.max(0, score), hooks };
}

// ---------------------------------------------------------------- 4. OUTPUT
const csvCell = v => { v = String(v ?? ''); return /[;"\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; };
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const temp = s => s >= 45 ? 'het' : s >= 20 ? 'varm' : 'kall';

function writeCsv(rows, file) {
  const head = ['Poäng', 'Läge', 'Namn', 'Kategori', 'Ort', 'Hemsida', 'Telefon', 'E-post', 'Sociala medier', 'Problem (pitch)', 'Svarstid ms', 'Mobilanpassad', 'https', 'Copyright-år', 'Plattform', 'Källa', 'OSM', 'Status', 'Kontaktad', 'Anteckning'];
  const body = rows.map(({ lead: l, r, score, hooks }) => [score, temp(score), l.name, categories[l.category]?.label || l.category, l.city, l.website, l.phone, l.email, l.social, hooks.join(' '), r.ms || '', r.mobile == null ? '' : r.mobile ? 'ja' : 'nej', r.final ? (r.https ? 'ja' : 'nej') : '', r.year || '', r.builder, l.source, l.osm || '', '', '', ''].map(csvCell).join(';'));
  fs.writeFileSync(file, '﻿' + [head.join(';'), ...body].join('\r\n'));
}

function writeHtml(rows, file) {
  const catOpts = [...new Set(rows.map(x => x.lead.category))].map(c => `<option value="${esc(c)}">${esc(categories[c]?.label || c)}</option>`).join('');
  const tr = rows.map(({ lead: l, r, score, hooks }) => {
    const site = l.website ? `<a href="${esc(normUrl(l.website))}" target="_blank" rel="noopener">${esc(hostOf(normUrl(l.website)) || l.website)}</a>` : '<span class="none">ingen</span>';
    const contact = [l.phone && `<a href="tel:${esc(l.phone.replace(/[^\d+]/g, ''))}">${esc(l.phone)}</a>`, l.email && `<a href="mailto:${esc(l.email)}">${esc(l.email)}</a>`, l.social && `<a href="${esc(l.social.startsWith('http') ? l.social : 'https://' + l.social)}" target="_blank" rel="noopener">sociala</a>`].filter(Boolean).join('<br>') || '<span class="none">–</span>';
    const facts = [r.ms ? `${(r.ms / 1000).toFixed(1)} s` : '', r.builder, r.year ? '© ' + r.year : ''].filter(Boolean).join(' · ');
    return `<tr data-cat="${esc(l.category)}" data-t="${temp(score)}"><td class="n"><b class="s ${temp(score)}">${score}</b></td><td><b>${esc(l.name)}</b><br><small>${esc(categories[l.category]?.label || l.category)}${l.city ? ' · ' + esc(l.city) : ''}${l.osm ? ` · <a href="${l.osm}" target="_blank" rel="noopener">karta</a>` : ''}</small></td><td>${site}${facts ? `<br><small>${esc(facts)}</small>` : ''}</td><td>${contact}</td><td><ul>${hooks.map(h => `<li>${esc(h)}</li>`).join('')}</ul></td></tr>`;
  }).join('\n');
  const n = t => rows.filter(x => temp(x.score) === t).length;
  fs.writeFileSync(file, `<!doctype html><html lang="sv"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Leads ${TODAY}</title>
<style>
:root{--ink:#16202a;--muted:#5c6773;--line:#e2e6ea;--bg:#f6f7f8;--het:#c2410c;--varm:#b7791f;--kall:#64748b}
@media (prefers-color-scheme:dark){:root{--ink:#e7ebef;--muted:#9aa6b2;--line:#2b3440;--bg:#12171d}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif}
.wrap{max-width:1400px;margin:0 auto;padding:24px 16px}h1{margin:0 0 4px;font-size:26px}p{color:var(--muted);margin:0 0 16px}
.bar{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:14px}.bar input,.bar select{font:inherit;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:transparent;color:inherit}.bar input{flex:1;min-width:200px}
.tw{overflow-x:auto}table{width:100%;border-collapse:collapse;min-width:900px}th,td{text-align:left;vertical-align:top;padding:10px;border-bottom:1px solid var(--line)}th{font-size:13px;color:var(--muted);cursor:pointer;user-select:none;position:sticky;top:0;background:var(--bg)}
td ul{margin:0;padding-left:18px}small,.none{color:var(--muted)}a{color:inherit}
.s{display:inline-block;min-width:34px;text-align:center;padding:3px 6px;border-radius:6px;color:#fff}.s.het{background:var(--het)}.s.varm{background:var(--varm)}.s.kall{background:var(--kall)}
</style></head><body><div class="wrap">
<h1>Leads ${TODAY}</h1><p>${rows.length} företag · ${n('het')} heta · ${n('varm')} varma · ${n('kall')} kalla · ${esc(CATS.map(c => categories[c]?.label || c).join(', '))}${AREA ? ' · ' + esc(AREA) : ''}. Källa: ${[!flag('no-osm') && 'OpenStreetMap', argv.includes('--add') && 'egen lista'].filter(Boolean).join(' + ')}. Poängen visar hur tydligt problemet är, inte hur stort företaget är.</p>
<div class="bar"><input id="q" type="search" placeholder="Sök namn, ort, problem …"><select id="c"><option value="">Alla kategorier</option>${catOpts}</select><select id="t"><option value="">Alla lägen</option><option value="het">Heta</option><option value="varm">Varma</option><option value="kall">Kalla</option></select></div>
<div class="tw"><table><thead><tr><th data-k="0">Poäng</th><th data-k="1">Företag</th><th data-k="2">Hemsida</th><th>Kontakt</th><th>Problem att ta upp</th></tr></thead><tbody>
${tr}
</tbody></table></div></div>
<script>
const q=document.getElementById('q'),c=document.getElementById('c'),t=document.getElementById('t'),rows=[...document.querySelectorAll('tbody tr')];
function f(){const s=q.value.toLowerCase();for(const r of rows)r.hidden=!((!s||r.textContent.toLowerCase().includes(s))&&(!c.value||r.dataset.cat===c.value)&&(!t.value||r.dataset.t===t.value))}
[q,c,t].forEach(e=>e.addEventListener('input',f));
document.querySelectorAll('th[data-k]').forEach(th=>{let asc=false;th.onclick=()=>{asc=!asc;const k=+th.dataset.k,tb=document.querySelector('tbody');rows.sort((a,b)=>{const x=a.cells[k].textContent.trim(),y=b.cells[k].textContent.trim();return (k===0?(+x)-(+y):x.localeCompare(y,'sv'))*(asc?1:-1)}).forEach(r=>tb.appendChild(r))}});
</script></body></html>`);
}

// ---------------------------------------------------------------- MAIN
(async () => {
  let leads = [];
  if (!flag('no-osm')) leads.push(...(await fetchOsm()).elements.map(fromOsm).filter(Boolean));
  const extra = opt('add', '');
  if (extra) leads.push(...fromCsv(path.resolve(extra)));
  const ex = new RegExp(exclude.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i');
  leads = dedupe(leads.filter(l => !ex.test(l.name)));
  if (LIMIT) leads = leads.slice(0, LIMIT);
  console.log(`${leads.length} företag efter dubblett- och kedjefilter. Kollar hemsidorna (${CONCURRENCY} åt gången) …`);

  const rows = new Array(leads.length);
  let next = 0, done = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < leads.length) {
      const i = next++;
      const lead = leads[i];
      const r = await check(lead);
      r.psi = r.final && !r.error && r.status < 400 ? await pagespeed(r.final) : null;
      rows[i] = { lead, r, ...assess(lead, r) };
      if (++done % 10 === 0 || done === leads.length) process.stdout.write(`\r  ${done}/${leads.length}`);
    }
  }));
  console.log('');
  rows.sort((a, b) => b.score - a.score || a.lead.name.localeCompare(b.lead.name, 'sv'));

  fs.mkdirSync(OUT, { recursive: true });
  const base = path.join(OUT, `leads-${TODAY}${AREA ? '-' + AREA.toLowerCase().replace(/[^a-zåäö0-9]+/g, '-') : ''}`);
  writeCsv(rows, base + '.csv');
  writeHtml(rows, base + '.html');
  const hot = rows.filter(x => x.score >= 45).length;
  console.log(`Klart: ${hot} heta, ${rows.filter(x => x.score >= 20 && x.score < 45).length} varma.\n  ${path.relative(process.cwd(), base)}.html\n  ${path.relative(process.cwd(), base)}.csv`);
})().catch(e => { console.error('Fel:', e.message); process.exit(1); });
