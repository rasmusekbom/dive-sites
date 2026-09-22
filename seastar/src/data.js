// Structure of the site: courses, tec diving, trips, gear/service/gas, club, navigation.
// All human-readable text lives in src/i18n/<lang>.js (sv is the base, en is a full override).
//
// Facts marked (PADI) come from the centre's own PADI Dive Center listing, which is the only detailed public
// source – seastardiving.se is a single "we are updating the pages" placeholder. Facts marked (standard) are
// PADI course standards, which are identical worldwide. Everything else is marked (ask) – see CONTENT-NOTES.md.
// NO PRICES ARE INVENTED. Where a price is unknown the site says "kontakta oss" and the booking form asks.
const site = {
  name: 'Seastar Diving',
  shortName: 'Seastar',
  legalName: 'Seastar Diving',                  // (ask) no company found in allabolag under this name – need org.nr for the footer
  domain: 'https://www.seastardiving.se',
  tagline: 'Hos oss blir du en stjärna i vattnet.',   // (PADI) their own line
  phone: '+46 72 561 02 40',                    // (PADI)
  email: 'info@seastardiving.se',               // (PADI)
  address: 'Solkraftsvägen 33, 135 70 Stockholm',   // (PADI)
  addressShort: 'Solkraftsvägen 33, Skrubba',
  area: 'Skrubba · Skarpnäck',
  geo: { lat: 59.2531, lng: 18.1571 },          // (ask) approximate – Skrubba industrial area, confirm the exact pin
  maps: 'https://www.google.com/maps/search/?api=1&query=Seastar+Diving+Solkraftsv%C3%A4gen+33+Stockholm',
  mapsEmbed: 'https://www.google.com/maps?q=Solkraftsv%C3%A4gen+33,+135+70+Stockholm&z=14&output=embed',
  instructors: 10,                              // (PADI) "10 PADI Instructors"
  rating: null, reviewCount: null,              // (ask) no public review aggregate found – claim the Google Business Profile
  social: { instagram: 'https://www.instagram.com/seastardivingstockholm/', facebook: 'https://www.facebook.com/seastar.diving' },
  igFollowers: 440,                             // Instagram, 2026-09-22
  ogImage: 'diver-green-water-light.jpg',
  // (PADI) opening hours
  hours: [['mon', '10:00', '18:00'], ['tue', '10:00', '18:00'], ['wed', '10:00', '18:00'], ['thu', '10:00', '18:00'], ['fri', '10:00', '18:00'], ['sat', '11:00', '15:00'], ['sun', null, null]],
  payments: ['VISA', 'Mastercard', 'AMEX', 'PayPal', 'Bankgiro'],   // (PADI) "Bank / Debit Card, Paypal, Bank Transfer, VISA, Mastercard, AMEX"
};

// sv at the root, en under /en/. hreflang alternates are emitted for both.
// (PADI) staff also speak Danish and Norwegian – mentioned on the About page, not built as separate locales.
const languages = [
  { code: 'sv', path: '', name: 'Svenska', htmlLang: 'sv' },
  { code: 'en', path: 'en', name: 'English', htmlLang: 'en' },
];

// Home page counters: [number, suffix, i18n key]
const stats = [[5, '★', 'padi'], [10, '', 'instructors'], [4, '', 'languages'], [365, '', 'gas']];

// ---------------------------------------------------------------- COURSES
// group: 'start' | 'con' | 'pro' | 'tec' | 'spec'
// level: 0 none · 1 beginner · 2 certified · 3 advanced · 4 pro
// All course facts below are PADI standards (identical worldwide) – durations are typical, not promised.
// price: null everywhere on purpose – the centre's prices are not public. See CONTENT-NOTES.md.
const courses = [
  { slug: 'prova-pa-dykning', key: 'discover', group: 'start', level: 0, minAge: 10, days: 1, price: null,
    cert: null, depth: 12, prereq: 'none',
    includes: ['instructor', 'gear', 'pool'], learn: ['breathe', 'equalize', 'buoyancy', 'signals'],
    img: 'under-the-ice-shallows.jpg' },
  { slug: 'open-water-diver', key: 'ow', group: 'start', level: 0, minAge: 10, days: 4, price: null,
    cert: 'PADI Open Water Diver', depth: 18, prereq: 'swim',
    includes: ['instructor', 'elearning', 'gear', 'pool', 'openwater', 'certificate'],
    learn: ['theory', 'assembly', 'buoyancy', 'masksafety', 'navigation', 'buddy'],
    img: 'diver-green-water-light.jpg' },
  { slug: 'advanced-open-water', key: 'aow', group: 'con', level: 2, minAge: 12, days: 2, price: null,
    cert: 'PADI Advanced Open Water Diver', depth: 30, prereq: 'ow',
    includes: ['instructor', 'elearning', 'openwater', 'certificate'],
    learn: ['deep', 'navigation', 'adventure', 'planning'],
    img: 'two-divers-autumn-shore.jpg' },
  { slug: 'rescue-diver', key: 'rescue', group: 'con', level: 3, minAge: 12, days: 3, price: null,
    cert: 'PADI Rescue Diver', depth: 30, prereq: 'aowEfr',
    includes: ['instructor', 'elearning', 'openwater', 'certificate'],
    learn: ['selfrescue', 'stress', 'missing', 'surfacing', 'firstaid'],
    img: 'tech-divers-lake-shore.jpg' },
  { slug: 'divemaster', key: 'dm', group: 'pro', level: 4, minAge: 18, days: 30, price: null,
    cert: 'PADI Divemaster', depth: 40, prereq: 'rescue',
    includes: ['mentor', 'elearning', 'workshops', 'internship', 'certificate'],
    learn: ['physics', 'skills24', 'mapping', 'guiding', 'assisting'],
    img: 'diver-green-water-light.jpg' },
  { slug: 'instruktor-idc', key: 'idc', group: 'pro', level: 4, minAge: 18, days: 10, price: null,
    cert: 'PADI Open Water Scuba Instructor', depth: 40, prereq: 'dm',
    includes: ['courseDirector', 'materials', 'workshops', 'ie'],
    learn: ['teaching', 'standards', 'presentations', 'riskmgmt'],
    img: 'tech-divers-lake-shore.jpg' },
  { slug: 'torrdrakt', key: 'dry', group: 'spec', level: 2, minAge: 10, days: 1, price: null,
    cert: 'PADI Dry Suit Diver', depth: 18, prereq: 'ow',
    includes: ['instructor', 'drysuit', 'openwater', 'certificate'],
    learn: ['drysuitBuoyancy', 'valves', 'recovery', 'care'],
    img: 'two-divers-autumn-shore.jpg' },
  { slug: 'nitrox', key: 'nitrox', group: 'spec', level: 2, minAge: 12, days: 1, price: null,
    cert: 'PADI Enriched Air Diver', depth: 40, prereq: 'ow',
    includes: ['instructor', 'elearning', 'analyser', 'certificate'],
    learn: ['eanBasics', 'analysing', 'mod', 'computer'],
    img: 'diver-green-water-light.jpg' },
];

// Technical diving – (PADI) "PADI TecRec, Rebreather/ CCR Diving" plus trimix and sorb on the gas list.
const tec = [
  { key: 'tec40', cert: 'PADI Tec 40', depth: 40 },
  { key: 'tec45', cert: 'PADI Tec 45', depth: 45 },
  { key: 'tec50', cert: 'PADI Tec 50', depth: 50 },
  { key: 'trimix', cert: 'PADI Tec Trimix', depth: 75 },
  { key: 'ccr', cert: 'PADI Rebreather / Type R', depth: 40 },
];

// (PADI) equipment rental list, verbatim categories
const rental = ['drysuit', 'wetsuit', 'bcd', 'regulator', 'computer', 'gauges', 'cylindersAl', 'cylindersSteel', 'fins', 'maskSnorkel', 'compass', 'torch', 'ccr'];
// (PADI) equipment service & repair list, verbatim categories
const service = ['regulators', 'bcd', 'computers', 'gauges', 'suits', 'cylinders'];
// (PADI) gas list
const gas = ['air', 'nitrox', 'trimix', 'mixed', 'sorb'];
// (PADI) facilities
const facilities = ['classroom', 'wifi', 'ac', 'boat', 'parking'];

// Redirect guesses for URLs the old site or search engines may hold (Cloudflare/Netlify `_redirects` format)
const redirects = [
  ['/kurser.html', '/kurser/', 301], ['/utbildning', '/kurser/', 301], ['/utbildningar', '/kurser/', 301],
  ['/om-oss.html', '/om-oss/', 301], ['/kontakt.html', '/kontakt/', 301], ['/priser', '/kurser/', 301],
  ['/shop', '/utrustning/', 301], ['/butik', '/utrustning/', 301], ['/tec', '/teknisk-dykning/', 301],
];

module.exports = { site, languages, stats, courses, tec, rental, service, gas, facilities, redirects };
