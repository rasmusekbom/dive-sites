// Language-neutral facts for Koh Kood Divers: contact details, prices, booking ids, images, structure.
// All text lives in src/i18n/<lang>.js. Swap this file + the i18n files to build a site for another dive centre.

const WA = '66856984122';
const wa = (text) => `https://wa.me/${WA}${text ? '?text=' + encodeURIComponent(text) : ''}`;

const site = {
  name: 'Koh Kood Divers',
  legalName: 'Koh Kood Divers',
  domain: 'https://kohkooddivers.com',
  phone: '+66 85 698 4122',
  phoneHref: 'tel:+66856984122',
  whatsapp: wa(),
  email: 'booking@kohkooddivers.com',
  address: '101 Klong Chao, Ko Kut, Trat 23000, Thailand',
  founded: 2008,
  rating: 4.9,
  reviewCount: 463,
  geo: { lat: 11.6321087, lng: 102.5478377 },
  formEndpoint: '', // e.g. a Formspree/Basin URL. Empty = open the visitor's email app with the message prefilled.
  mapEmbed: 'https://maps.google.com/maps?q=11.6321087,102.5478377&z=15&output=embed',
  googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJq7WFs6uQBjERravXWAqoSf4',
  rezdyBase: 'https://kohkooddivers57.rezdy.com',
  social: { facebook: 'https://www.facebook.com/kohkooddivers/', instagram: 'https://www.instagram.com/kohkooddivers/', twitter: 'https://twitter.com/kohkooddivers' },
  // Partner/affiliate links carried over from the original footer
  partners: { flights: 'https://www.kayak.com.au/flights', guide: 'https://www.kayak.com.au/Ko-Kut.58441.guide', rezdy: 'https://kohkooddivers57.rezdy.com/', scubakit: 'http://scubakit.app/' },
  teachingLanguages: ['EN', 'DE', 'FR', 'NL', 'ES'],
  team: [
    { key: 'bob', name: 'Bob Kosten', langs: ['EN', 'ES', 'NL', 'FR', 'DE'] },
    { key: 'jessie', name: 'Jessie Kosten', langs: ['DE', 'NL', 'EN'] },
  ],
  // Reviews are quotes; kept in their original language on every locale.
  reviews: [
    { name: 'Paul B.', ctx: 'Snorkelling', text: 'My girlfriend and I spent a wonderful day snorkelling with Koh Kood Divers. They made it super easy, picking us up from and returning us to our hotel. We visited three different sites and saw such a variety of colourful tropical fish. A special call-out to crew members Tino and Coco for their attentive support and good humour.' },
    { name: 'Gianluca A.', ctx: 'Snorkelling → Discover Scuba', text: 'I booked a one-day snorkelling trip and it turned out to be such an amazing experience. Marylene introduced me to diving for the first time — I ended up doing a discovery dive with her and loved it so much I booked another day. The boat trips were great, I saw the hidden corners of Koh Kood above and below the water, and the food on board was delicious.' },
    { name: 'M Z', ctx: 'Returning diver', text: 'KKD is where I started my Open Water and Advanced courses four years ago. I still come back every year for great diving. Very nice team and good service, well-maintained gear and excellent boat facilities. Highly recommended for your Koh Kood trip.' },
    { name: 'Nicolas S.', ctx: 'Fun diving, Koh Rang', text: 'Super friendly dive shop. Seamless onboarding, excellent value. We spent an amazing day in the marine park west of Koh Kood and the dives were all up to expectations. Kudos to Tino, our instructor — professional, knowledgeable and really welcoming.' },
    { name: 'Angelic G.', ctx: 'Fun diving + snorkelling', text: '10/10 diving day. Jose, my DM, was patient, kind, funny and knowledgeable. The boat was spacious and well equipped, lunch was awesome, dive sites were amazing. My partner snorkelled and also had a great time. Wish I had more days on the island.' },
    { name: 'Harry W.', ctx: 'PADI Open Water', text: "Had a great time completing my PADI Open Water course with Koh Kood Divers. Joel was a great instructor. Most definitely one of the best things I've done while travelling. Big thanks to the whole team." },
  ],
  schedule: { local: ['Mon', 'Wed', 'Fri', 'Sun'], park: ['Tue', 'Thu', 'Sat'] },
  dayTimes: ['08:15', '09:00', '10:00', '11:30', '12:45', '15:00'],
};

// Languages. `path` is the URL prefix ('' = root/x-default). `currency` is the default display currency.
const languages = [
  { code: 'en', path: '', currency: 'THB', name: 'English' },
  { code: 'de', path: 'de', currency: 'EUR', name: 'Deutsch' },
  { code: 'fr', path: 'fr', currency: 'EUR', name: 'Français' },
  { code: 'nl', path: 'nl', currency: 'EUR', name: 'Nederlands' },
  { code: 'sv', path: 'sv', currency: 'SEK', name: 'Svenska' },
  { code: 'th', path: 'th', currency: 'THB', name: 'ไทย' },
  { code: 'ru', path: 'ru', currency: 'RUB', name: 'Русский' },
  { code: 'zh', path: 'zh', currency: 'CNY', name: '中文' },
];
const currencies = [
  { code: 'THB', symbol: '฿', decimals: 0 }, { code: 'EUR', symbol: '€', decimals: 0 }, { code: 'USD', symbol: '$', decimals: 0 },
  { code: 'GBP', symbol: '£', decimals: 0 }, { code: 'SEK', symbol: 'kr', decimals: 0 }, { code: 'NOK', symbol: 'kr', decimals: 0 },
  { code: 'DKK', symbol: 'kr', decimals: 0 }, { code: 'CHF', symbol: 'CHF', decimals: 0 }, { code: 'AUD', symbol: 'A$', decimals: 0 },
  { code: 'CNY', symbol: '¥', decimals: 0 }, { code: 'RUB', symbol: '₽', decimals: 0 }, { code: 'JPY', symbol: '¥', decimals: 0 },
];

const FUN_TIERS = [
  { key: 'd1', price: 2000 }, { key: 'd2', price: 3500, per: 1750 }, { key: 'd3', price: 4500, per: 1500 },
  { key: 'd4', price: 6000, per: 1500, pop: true }, { key: 'd6', price: 8000, per: 1333 }, { key: 'd8', price: 9750, per: 1219 }, { key: 'd10', price: 11000, per: 1100 },
];

// type: trip | course. group: for the courses overview. included: which shared inclusion list (see i18n `inclusions`).
const products = [
  { slug: 'koh-kood-fun-diving', type: 'trip', img: 'diver-descending.jpg', rezdy: '729505', price: 2000, from: true, tiers: FUN_TIERS, duration: '1d', dives: '2/day', minAge: 10, included: 'trip', showSchedule: true, showDay: true, related: ['koh-rang-diving', 'special-wreck-dives-koh-kood', 'advanced-open-water-diver-koh-kood'] },
  { slug: 'koh-rang-diving', type: 'trip', img: 'island-aerial.jpg', rezdy: '729505', price: 2000, from: true, tiers: FUN_TIERS, duration: '1d', dives: '2', minAge: 10, included: 'trip', showSchedule: true, related: ['koh-kood-fun-diving', 'snorkeling-koh-kood-thailand', 'special-wreck-dives-koh-kood'] },
  { slug: 'special-wreck-dives-koh-kood', type: 'trip', img: 'wreck.jpg', rezdy: null, price: 5500, duration: 'full', dives: '2', minAge: 10, included: 'wreck', related: ['koh-kood-fun-diving', 'advanced-open-water-diver-koh-kood', 'koh-rang-diving'] },
  { slug: 'private-dive-trips-koh-kood', type: 'trip', img: 'dive-boat.jpg', rezdy: null, price: null, duration: '1d', dives: 'flex', minAge: null, included: 'trip', related: ['koh-kood-fun-diving', 'snorkeling-koh-kood-thailand', 'koh-rang-diving'] },
  { slug: 'snorkeling-koh-kood-thailand', type: 'trip', img: 'snorkeller.jpg', rezdy: '729506', price: 1000, from: true, tiers: [{ key: 'snkKood', price: 1000 }, { key: 'snkRang', price: 1200, pop: true }], duration: '1d', dives: '3stops', minAge: null, included: 'snorkel', related: ['padi-discover-scuba-diving', 'koh-kood-diving-for-kids-thailand', 'koh-rang-diving'] },

  { slug: 'padi-discover-scuba-diving', type: 'course', group: 'start', img: 'beginner-shallow-reef.jpg', rezdy: '729497', price: 3500, from: true, tiers: [{ key: 'dsd1', price: 3500 }, { key: 'dsd2', price: 5000, pop: true }], duration: '1d', dives: '1–2', minAge: 8, included: 'dsd', related: ['padi-open-water-course-koh-kood', 'padi-scuba-diver', 'snorkeling-koh-kood-thailand'] },
  { slug: 'padi-scuba-diver', type: 'course', group: 'start', img: 'hard-coral.jpg', rezdy: '729507', price: 13000, duration: '2–3d', dives: '2', minAge: 10, included: { base: 'course', manual: 'ow', dives: 'ow2', extra: ['confined', 'table'] }, related: ['padi-open-water-course-koh-kood', 'padi-discover-scuba-diving', 'koh-kood-fun-diving'] },
  { slug: 'padi-open-water-course-koh-kood', type: 'course', group: 'start', featured: true, img: 'soft-coral.jpg', rezdy: '729509', price: 15500, duration: '3–4d', dives: '4', minAge: 10, included: { base: 'course', manual: 'ow', dives: 'ow4', extra: ['confined'] }, related: ['advanced-open-water-diver-koh-kood', 'koh-kood-fun-diving', 'padi-scuba-diver'] },

  { slug: 'adventure-diver-koh-kood', type: 'course', group: 'more', img: 'nudibranch.jpg', rezdy: '729622', price: 11500, duration: '1d', dives: '3', minAge: 10, included: { base: 'course', manual: 'aow', dives: 'adv3', extra: ['theory'] }, related: ['advanced-open-water-diver-koh-kood', 'koh-kood-fun-diving', 'rescue-diver-koh-kood'] },
  { slug: 'advanced-open-water-diver-koh-kood', type: 'course', group: 'more', img: 'coral-wall.jpg', rezdy: '729625', price: 14500, duration: '2–3d', dives: '5', minAge: 12, included: { base: 'course', manual: 'aow', dives: 'adv5', extra: ['theory'] }, related: ['rescue-diver-koh-kood', 'special-wreck-dives-koh-kood', 'koh-kood-fun-diving'] },
  { slug: 'rescue-diver-koh-kood', type: 'course', group: 'more', img: 'boat-gearing-up.jpg', rezdy: '729627', price: 15500, duration: '2–3d', dives: '4', minAge: 12, included: { base: 'course', manual: 'rescue', dives: 'ow4', extra: ['pool'] }, related: ['padi-divemaster', 'advanced-open-water-diver-koh-kood', 'koh-kood-fun-diving'] },

  { slug: 'koh-kood-diving-for-kids-thailand', type: 'course', group: 'kids', img: 'fish-school.jpg', rezdy: '729503', price: 3500, from: true, tiers: [{ key: 'dsd1', price: 3500 }, { key: 'dsd2', price: 5000 }], duration: '1d', dives: '1–2', minAge: 8, included: 'kids', related: ['padi-junior-open-water-course-koh-kood', 'snorkeling-koh-kood-thailand', 'padi-discover-scuba-diving'] },
  { slug: 'padi-junior-open-water-course-koh-kood', type: 'course', group: 'kids', img: 'turtle.jpg', rezdy: '729621', price: 15500, duration: '3–4d', dives: '4', minAge: 10, included: { base: 'course', manual: 'ow', dives: 'ow4', extra: ['theory', 'confined'] }, related: ['koh-kood-diving-for-kids-thailand', 'junior-advanced-diver-koh-kood', 'padi-open-water-course-koh-kood'] },
  { slug: 'junior-advanced-diver-koh-kood', type: 'course', group: 'kids', img: 'turtle.jpg', rezdy: '729626', price: 14500, duration: '2–3d', dives: '5', minAge: 12, included: { base: 'course', manual: 'aow', dives: 'adv5', extra: ['theory'] }, related: ['padi-junior-open-water-course-koh-kood', 'koh-kood-diving-for-kids-thailand', 'advanced-open-water-diver-koh-kood'] },

  { slug: 'padi-divemaster', type: 'course', group: 'pro', img: 'dive-boat.jpg', rezdy: '729628', price: 55000, duration: '4–8w', dives: '40–100', minAge: 18, included: 'pro', related: ['divemaster-internship-thailand', 'padi-zero-to-hero', 'rescue-diver-koh-kood'] },
  { slug: 'divemaster-internship-thailand', type: 'course', group: 'pro', img: 'cove-aerial.jpg', rezdy: null, price: null, duration: '4–8w', dives: '40–100', minAge: 18, included: 'pro', related: ['padi-divemaster', 'padi-zero-to-hero', 'rescue-diver-koh-kood'] },
  { slug: 'padi-zero-to-hero', type: 'course', group: 'pro', img: 'reef-sunlight.jpg', rezdy: null, price: null, duration: '8w', dives: '40–100', minAge: 18, included: 'zero', related: ['divemaster-internship-thailand', 'padi-divemaster', 'padi-open-water-course-koh-kood'] },
];

const courseGroups = ['start', 'more', 'kids', 'pro'];

// Dive sites. Names are real sites in the area; depths approximate. To be confirmed by the shop.
const diveSites = [
  { key: 'hinRap', area: 'rang', depth: '5–18 m', img: 'soft-coral.jpg' },
  { key: 'hinKuakMa', area: 'rang', depth: '8–20 m', img: 'coral-wall.jpg' },
  { key: 'kohYak', area: 'rang', depth: '5–16 m', img: 'hard-coral.jpg' },
  { key: 'kohThongLang', area: 'rang', depth: '5–14 m', img: 'fish-school.jpg' },
  { key: 'hinSamSao', area: 'rang', depth: '10–22 m', img: 'nudibranch.jpg' },
  { key: 'kohMaiSi', area: 'kood', depth: '5–14 m', img: 'beginner-shallow-reef.jpg' },
  { key: 'kohRaet', area: 'kood', depth: '6–16 m', img: 'turtle.jpg' },
  { key: 'aoPhrao', area: 'kood', depth: '3–12 m', img: 'snorkeller.jpg' },
  { key: 'htmsChang', area: 'wreck', depth: '18–30 m', img: 'wreck.jpg' },
];

// Old URLs → new (Netlify/Cloudflare `_redirects` format). Language-prefixed old slugs that changed are handled in build from i18n `oldSlugs`.
const redirects = [
  ['/courses/', '/koh-kood-padi-courses/'], ['/book-diving-koh-kood/', '/koh-kood-fun-diving/'],
  ['/shop/', '/koh-kood-padi-courses/'], ['/cart/', '/koh-kood-padi-courses/'], ['/checkout/', '/koh-kood-padi-courses/'], ['/account/', '/'], ['/hello-world/', '/'],
  ['/product/snorkeling/', '/snorkeling-koh-kood-thailand/'], ['/product/fun-diving/', '/koh-kood-fun-diving/'],
  ['/product/padi-discover-scuba-diving/', '/padi-discover-scuba-diving/'], ['/product/padi-bubble-maker/', '/koh-kood-diving-for-kids-thailand/'],
  ['/product/padi-scuba-diver/', '/padi-scuba-diver/'], ['/product/padi-open-water-course/', '/padi-open-water-course-koh-kood/'],
  ['/product/padi-junior-open-water-course/', '/padi-junior-open-water-course-koh-kood/'], ['/product/padi-adventure-diver/', '/adventure-diver-koh-kood/'],
  ['/product/padi-advanced-diver-course/', '/advanced-open-water-diver-koh-kood/'], ['/product/padi-junior-advanced-open-water/', '/junior-advanced-diver-koh-kood/'],
  ['/product/padi-rescue-diver-course/', '/rescue-diver-koh-kood/'], ['/product/padi-divemaster/', '/padi-divemaster/'],
  // WooCommerce shop/cart/account pages in DE/FR/NL → language home
  ['/de/shop/', '/de/'], ['/de/shop-2/', '/de/'], ['/de/shop-3/', '/de/'], ['/de/einkaufswagen/', '/de/'], ['/de/wagen/', '/de/'], ['/de/wagen-2/', '/de/'], ['/de/zur-kasse/', '/de/'], ['/de/zur-kasse-2/', '/de/'], ['/de/zur-kasse-3/', '/de/'], ['/de/mein-account/', '/de/'], ['/de/mein-konto/', '/de/'], ['/de/mein-konto-2/', '/de/'], ['/de/produkt/*', '/de/kurse/'],
  ['/fr/boutique/', '/fr/'], ['/fr/boutique-2/', '/fr/'], ['/fr/boutique-3/', '/fr/'], ['/fr/panier/', '/fr/'], ['/fr/chariot/', '/fr/'], ['/fr/chariot-2/', '/fr/'], ['/fr/paiement/', '/fr/'], ['/fr/passer-a-la-caisse/', '/fr/'], ['/fr/passer-a-la-caisse-2/', '/fr/'], ['/fr/mon-compte/', '/fr/'], ['/fr/mon-compte-2/', '/fr/'], ['/fr/mon-compte-3/', '/fr/'], ['/fr/produit/*', '/fr/cours/'],
  ['/nl/winkel/', '/nl/'], ['/nl/winkel-op/', '/nl/'], ['/nl/winkel-op-2/', '/nl/'], ['/nl/winkelkarretje/', '/nl/'], ['/nl/winkelwagen/', '/nl/'], ['/nl/winkelwagen-2/', '/nl/'], ['/nl/afronden/', '/nl/'], ['/nl/kassa/', '/nl/'], ['/nl/kassa-2/', '/nl/'], ['/nl/mijn-account/', '/nl/'], ['/nl/mijn-account-2/', '/nl/'], ['/nl/mijn-account-3/', '/nl/'], ['/nl/product/*', '/nl/cursussen/'],
];

module.exports = { site, languages, currencies, products, courseGroups, diveSites, redirects, wa };
