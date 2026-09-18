// Structure of the site: routes, timetable, trips, charter matrix, boats, islands, navigation.
// All human-readable text lives in src/i18n/<lang>/*.js so every language can be translated separately.
// Facts marked (3rd party) come from public timetables/guides, not from nornouspeedboat.com – see src/original/third-party-sources.md.
const site = {
  name: 'Nornou Speedboat',
  fullName: 'N. Kai Bae Hut Speedboat',
  shortName: 'Nornou',
  legalName: 'N. Kai Bae Hut Speedboat',
  domain: 'https://www.nornouspeedboat.com',
  founded: 1995,
  licence: '13/03131',                       // ใบอนุญาตประกอบธุรกิจนำเที่ยว (TAT tour operator licence) as shown on the original site
  phone: '+66 81 982 9870',
  phone2: '+66 81 817 6832',
  phoneOffice: '+66 39 557 128',             // (3rd party) landline listed on iamkohchang.com
  email: 'sao.nornouspeedboat@gmail.com',
  whatsapp: 'https://wa.me/66818176832',
  line: null,                                // the original links a LINE image – ask the client for the LINE ID / add-friend URL
  address: '10/8 Moo 4, Kai Bae Beach, Koh Chang, Trat 23170',
  addressTh: 'เลขที่ 10/8 หมู่ 4 ตำบลเกาะช้าง อำเภอเกาะช้าง จังหวัดตราด 23170',
  hours: 'Mon–Sun 08:00–17:00',
  maps: 'https://www.google.com/maps/search/?api=1&query=Kai+Bae+Hut+Speedboat+Koh+Chang',
  mapsEmbed: 'https://www.google.com/maps?q=Kai+Bae+Hut+Speedboat+Koh+Chang&z=14&output=embed',
  geo: { lat: 12.0369, lng: 102.2789 },       // Kai Bae Beach, west coast of Koh Chang (approximate – confirm pier position)
  rating: 4.1, reviewCount: 36,              // Tripadvisor "Nor Nou Kaibae Hut Speed Boat", 2026-09-18 (listing unclaimed)
  tripadvisor: 'https://www.tripadvisor.com/Attraction_Review-g580110-d11913596-Reviews-Nor_Nou_Kaibae_Hut_Speed_Boat-Ko_Chang_Trat_Province.html',
  social: { facebook: 'https://www.facebook.com/n.kaibaehut' },
  ogImage: 'speedboat-bow-white-sand-beach.jpg',
  season: { from: '11-01', to: '04-30' },   // scheduled transfers run in high season only (3rd party: 1 Nov – 30 Apr; reseller says mid-Nov – mid-May) – confirm
};

// Languages: English at the root, others under /<path>/. hreflang alternates are emitted for all.
const languages = [
  { code: 'en', path: '', name: 'English', currency: 'THB' },
  { code: 'th', path: 'th', name: 'ไทย', currency: 'THB' },
  { code: 'de', path: 'de', name: 'Deutsch', currency: 'EUR' },
  { code: 'fr', path: 'fr', name: 'Français', currency: 'EUR' },
  { code: 'sv', path: 'sv', name: 'Svenska', currency: 'SEK' },
  { code: 'ru', path: 'ru', name: 'Русский', currency: 'RUB' },
  { code: 'zh', path: 'zh', name: '中文', currency: 'CNY' },
];
const currencies = [
  { code: 'THB', symbol: '฿' }, { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' }, { code: 'GBP', symbol: '£' },
  { code: 'SEK', symbol: 'kr' }, { code: 'NOK', symbol: 'kr' }, { code: 'DKK', symbol: 'kr' }, { code: 'CHF', symbol: 'CHF' },
  { code: 'AUD', symbol: 'A$' }, { code: 'CNY', symbol: '¥' }, { code: 'RUB', symbol: '₽' }, { code: 'JPY', symbol: '¥' }, { code: 'KRW', symbol: '₩' },
];

// Counters on the home page: [number, suffix, i18n key]
const stats = [[new Date().getFullYear() - site.founded, '+', 'years'], [4, '', 'islands'], [30, '', 'pax'], [7, '', 'itineraries']];

// Islands. img = a photo from the operator's own library that fits (they are not labelled per island).
const islands = {
  kohchang: { img: 'speedboat-kai-bae-hut-bay.jpg' },
  kohwai: { img: 'couple-shallow-water-beach.jpg' },
  kohmak: { img: 'two-friends-beach.jpg' },
  kohkood: { img: 'speedboat-bow-white-sand-beach.jpg' },
  kohrang: { img: 'coral-garden-fish.jpg', park: true },
  kohyak: { img: 'snorkeller-rocky-islet.jpg', park: true },
  kohnok: { img: 'anemone-clownfish.jpg', park: true },
  kohmapring: { img: 'table-coral-reef.jpg', park: true },
  kohlaoya: { img: 'two-women-shallow-water.jpg' },
  kohklum: { img: 'boy-snorkelling-float-ring.jpg' },
  kohkradad: { img: 'friends-beside-speedboat.jpg' },
  kohkham: { img: 'snorkeller-life-jacket-island.jpg' },
  kohyuak: { img: 'snorkeller-life-jacket-island.jpg' },
  kohman: { img: 'starfish-on-coral.jpg' },
  kohplee: { img: 'sea-fan-coral.jpg' },
  kohrom: { img: 'reef-rocks-underwater.jpg' },
};

// Scheduled transfers (3rd party timetable, one-way fares in THB). Stops in geographic order north → south.
const stops = ['kohchang', 'kohwai', 'kohmak', 'kohkood'];
const legs = [
  { from: 'kohchang', to: 'kohwai', dep: '09:00', arr: '09:30', fare: 600 },
  { from: 'kohchang', to: 'kohmak', dep: '09:00', arr: '10:00', fare: 800 },
  { from: 'kohchang', to: 'kohkood', dep: '09:00', arr: '11:00', fare: 1200 },
  { from: 'kohwai', to: 'kohmak', dep: '09:30', arr: '10:00', fare: 500 },
  { from: 'kohwai', to: 'kohkood', dep: '09:30', arr: '11:00', fare: 999 },
  { from: 'kohwai', to: 'kohchang', dep: '12:30', arr: '13:00', fare: 600 },
  { from: 'kohmak', to: 'kohkood', dep: '10:00', arr: '11:00', fare: 600 },
  { from: 'kohmak', to: 'kohwai', dep: '12:00', arr: '12:30', fare: 500 },
  { from: 'kohmak', to: 'kohchang', dep: '12:00', arr: '13:00', fare: 800 },
  { from: 'kohkood', to: 'kohmak', dep: '11:00', arr: '12:00', fare: 600 },
  { from: 'kohkood', to: 'kohwai', dep: '11:00', arr: '12:30', fare: 999 },
  { from: 'kohkood', to: 'kohchang', dep: '11:00', arr: '13:00', fare: 1200 },
];
// Boarding places per stop (3rd party)
const boarding = { kohchang: 'kaibae', kohwai: 'resortPiers', kohmak: 'makathanee', kohkood: 'resortPiers' };
// Route pages: one per island pair, both directions shown. slug is used in the URL.
const routes = [
  { slug: 'koh-chang-koh-kood', a: 'kohchang', b: 'kohkood', img: 'speedboat-bow-white-sand-beach.jpg', img2: 'speedboat-guests-on-bow.jpg' },
  { slug: 'koh-chang-koh-mak', a: 'kohchang', b: 'kohmak', img: 'speedboat-guests-standing-bow.jpg', img2: 'two-friends-beach.jpg' },
  { slug: 'koh-chang-koh-wai', a: 'kohchang', b: 'kohwai', img: 'speedboat-kai-bae-hut-bay.jpg', img2: 'couple-shallow-water-beach.jpg' },
  { slug: 'koh-mak-koh-kood', a: 'kohmak', b: 'kohkood', img: 'speedboat-stern-engines.jpg', img2: 'friends-beside-speedboat.jpg' },
  { slug: 'koh-wai-koh-mak', a: 'kohwai', b: 'kohmak', img: 'speedboat-guests-jumping.jpg', img2: 'two-women-shallow-water.jpg' },
  { slug: 'koh-wai-koh-kood', a: 'kohwai', b: 'kohkood', img: 'speedboat-guests-on-bow.jpg', img2: 'snorkeller-life-jacket-island.jpg' },
];
const children = { freeUnder: 3, halfFrom: 4, halfTo: 6, stroller: 200 };

// Join-in snorkelling trips (from nornouspeedboat.com). price = adult, child = child fare, THB per person.
const trips = [
  { slug: 'koh-rang-5-islands', price: 1200, child: 600, hours: ['09:00', '16:00'], full: true, islands: ['kohyak', 'kohmapring', 'kohrang', 'kohwai'], count: 5, lunch: true, parkFee: true,   // Koh Yak = Yak Yai + Yak Lek
    img: 'coral-garden-fish.jpg', img2: 'snorkellers-peace-sign.jpg', gallery: ['snorkeller-over-coral-reef.jpg', 'anemone-clownfish.jpg', 'swimmer-above-fish-school.jpg', 'speedboat-guests-on-bow.jpg'], faq: ['parkFee', 'swim', 'seasick', 'bring'], testimonial: 'kim' },
  { slug: 'koh-wai-laoya-klum', price: 900, child: 450, hours: ['10:00', '14:30'], full: false, islands: ['kohwai', 'kohlaoya', 'kohklum'], lunch: true, parkFee: false,
    img: 'couple-shallow-water-beach.jpg', img2: 'boy-snorkelling-float-ring.jpg', gallery: ['two-women-shallow-water.jpg', 'snorkellers-group-underwater.jpg', 'table-coral-reef.jpg', 'speedboat-guests-jumping.jpg'], faq: ['swim', 'kids', 'bring', 'weather'], testimonial: 'axels' },
  { slug: 'koh-yuak-4-islands', price: 800, child: 400, hours: [['09:00', '12:00'], ['13:00', '16:00']], full: false, islands: ['kohyuak', 'kohman', 'kohplee', 'kohrom'], lunch: false, parkFee: false,
    img: 'snorkeller-life-jacket-island.jpg', img2: 'boy-with-sergeant-fish.jpg', gallery: ['starfish-on-coral.jpg', 'sea-fan-coral.jpg', 'snorkeller-waving.jpg', 'reef-rocks-underwater.jpg'], faq: ['kids', 'swim', 'pickup', 'bring'], testimonial: 'jeremy' },
];

// Private charter (3rd party price list). boats[i] ↔ price[i]. Prices are per boat in THB.
const boats = [
  { key: 's4', pax: 4, hp: '60–85 HP', img: 'speedboat-stern-engines.jpg' },
  { key: 's10', pax: 10, hp: '200 HP', img: 'speedboat-kai-bae-hut-bay.jpg' },
  { key: 's13', pax: 13, hp: '200 HP', img: 'speedboat-guests-standing-bow.jpg' },
  { key: 's25', pax: 25, hp: '2 × 200 HP', img: 'speedboat-bow-white-sand-beach.jpg' },
  { key: 's30', pax: 30, hp: '2 × 200 HP', img: 'speedboat-guests-on-bow.jpg' },
];
const charters = [
  { key: 'fiveIslands', islands: ['kohrang', 'kohyak', 'kohnok', 'kohmapring', 'kohwai'], full: true, lunch: true, parkFee: true, prices: [8500, 10000, 12000, 18000, 20000], img: 'coral-garden-fish.jpg' },
  { key: 'waiLaoyaMak', islands: ['kohwai', 'kohlaoya', 'kohmak', 'kohkradad'], full: true, lunch: true, parkFee: false, prices: [8500, 10000, 11000, 18000, 20000], img: 'two-friends-beach.jpg' },
  { key: 'waiLaoyaKlum', islands: ['kohwai', 'kohlaoya', 'kohklum'], full: true, lunch: true, parkFee: false, prices: [7000, 9000, 10000, 15000, 16000], img: 'couple-shallow-water-beach.jpg' },
  { key: 'koodMakKhamWai', islands: ['kohkood', 'kohmak', 'kohkham', 'kohwai'], full: true, lunch: true, parkFee: false, prices: [12000, 14000, 16000, 21000, 23000], img: 'speedboat-bow-white-sand-beach.jpg' },
  { key: 'khamMak', islands: ['kohkham', 'kohmak'], full: true, lunch: true, parkFee: false, prices: [8500, 10000, 11000, 18000, 20000], img: 'friends-beside-speedboat.jpg' },
  { key: 'aroundKohChang', islands: ['kohchang'], full: true, lunch: true, parkFee: false, prices: [8500, 10000, 11000, 18000, 20000], img: 'speedboat-guests-jumping.jpg' },
  { key: 'yuakHalf', islands: ['kohyuak'], full: false, lunch: false, parkFee: false, prices: [3500, 4500, 5000, 8000, 9000], img: 'snorkeller-life-jacket-island.jpg' },
];
const parkFee = { adult: 200, child: 100, thaiAdult: 40 };   // Mu Ko Chang Marine National Park (Koh Rang group) – original site: Thai 40 / foreigner 200; child 100 (3rd party)

// Old URLs on the Wix site → new pages (Netlify/Cloudflare _redirects format)
const redirects = {
  '/en': '/', '/en/*': '/:splat',
  '/5-islands': '/snorkelling/koh-rang-5-islands/',
  '/wai-laoya-klum': '/snorkelling/koh-wai-laoya-klum/',
  '/4-islands-snorkeling-half-day': '/snorkelling/koh-yuak-4-islands/',
  '/service-page': '/book/', '/cart-page': '/book/',
  '/%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%81%E0%B8%B3%E0%B8%AB%E0%B8%99%E0%B8%94%E0%B9%81%E0%B8%A5%E0%B8%B0%E0%B9%80%E0%B8%87%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99%E0%B9%84%E0%B8%82': '/terms/',
};

module.exports = { site, languages, currencies, stats, islands, stops, legs, boarding, routes, children, trips, boats, charters, parkFee, redirects };
