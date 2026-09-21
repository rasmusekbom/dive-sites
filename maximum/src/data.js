// Structure of the site: products (courses, fun dives, shoots), dive sites, stay, gear rental, navigation.
// All human-readable text lives in src/i18n/<lang>/*.js so every language can be translated separately.
// Prices are the school's own 2026 rate cards (Instagram, April 2026) – see src/original/rate-cards/. Facts marked
// (3rd party) or (assumed) are not from the school – see CONTENT-NOTES.md.
const site = {
  name: 'Maximum Freediving Siargao',
  shortName: 'Maximum Freediving',
  legalName: 'Maximum Freediving – Siargao',
  domain: 'https://www.maximumfreedivingsiargao.com',   // placeholder – no domain exists yet (see CONTENT-NOTES.md)
  founded: 2023,                                          // (assumed) first posts on the Siargao account are from early 2023 – confirm
  phone: '+63 917 482 7514',                              // Facebook page + WhatsApp link in Instagram posts
  phone2: '+63 967 133 3497',                             // accommodation / bookings (Instagram, 2025)
  email: 'maximumfreediving.ph@gmail.com',
  whatsapp: 'https://wa.me/639174827514',
  messenger: 'https://m.me/maximumfreediving.siargao',
  address: 'Poblacion 5, General Luna, Siargao Island, Surigao del Norte 8419',
  addressShort: 'Poblacion 5, General Luna, Siargao',
  hours: 'Daily 06:00–15:00',                             // siargaolocal.com listing; Facebook says "always open" – confirm
  maps: 'https://www.google.com/maps/search/?api=1&query=Maximum+Freediving+Siargao+General+Luna',
  mapsEmbed: 'https://www.google.com/maps?q=Maximum+Freediving-Siargao+General+Luna&z=15&output=embed',
  geo: { lat: 9.7895, lng: 126.1614 },                    // siargaolocal.com pin (approximate – confirm the HQ position)
  rating: 4.8, reviewCount: 155,                          // siargaolocal.com aggregate (4.8/155, most likely Google) – confirm source
  fbRecommend: 98, fbReviews: 37,                         // Facebook page, 2026-09-19
  social: { facebook: 'https://www.facebook.com/maximumfreediving.siargao/', instagram: 'https://www.instagram.com/siargao.maximumfreediving/', tiktok: 'https://www.tiktok.com/@maximumfreediving_ph', youtube: 'https://youtube.com/@maximumfreediving', parentFacebook: 'https://www.facebook.com/Maximumfreedivingph/' },
  ogImage: 'freediver-white-fins-cabbage-coral.jpg',
  meetTime: '08:00',                                      // "8:00 meet up at the HQ" (intro itinerary card)
  bestSeason: { from: '03-01', to: '10-31' },             // (3rd party) calmest, clearest water March–May; Nov–Feb Pacific swell – see dive guides
};

// Languages: English at the root, others under /<path>/. hreflang alternates are emitted for all.
const languages = [
  { code: 'en', path: '', name: 'English', currency: 'PHP' },
  { code: 'ko', path: 'ko', name: '한국어', currency: 'KRW' },
  { code: 'ja', path: 'ja', name: '日本語', currency: 'JPY' },
  { code: 'zh', path: 'zh', name: '中文', currency: 'CNY' },
  { code: 'de', path: 'de', name: 'Deutsch', currency: 'EUR' },
  { code: 'fr', path: 'fr', name: 'Français', currency: 'EUR' },
];
const currencies = [
  { code: 'PHP', symbol: '₱' }, { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' }, { code: 'GBP', symbol: '£' },
  { code: 'KRW', symbol: '₩' }, { code: 'JPY', symbol: '¥' }, { code: 'CNY', symbol: '¥' }, { code: 'AUD', symbol: 'A$' },
  { code: 'SGD', symbol: 'S$' }, { code: 'CHF', symbol: 'CHF' }, { code: 'SEK', symbol: 'kr' }, { code: 'CAD', symbol: 'C$' }, { code: 'HKD', symbol: 'HK$' },
];

// Counters on the home page: [number, suffix, i18n key]
const stats = [[1, 'st', 'first'], [3, '', 'agencies'], [15, ' min', 'boat'], [155, '+', 'reviews']];

// ---------------------------------------------------------------- PRODUCTS
// group: 'course' | 'fundive' | 'shoot'. price = PHP per person (per session for private products).
// level: 0 none, 1 beginner, 2 intermediate, 3 advanced. days = typical duration. min = minimum group size.
// includes = keys into content.includes; learn = keys into content.learn. img/img2/gallery = src/img files.
const products = [
  { slug: 'intro-to-freediving', key: 'intro', group: 'course', price: 2800, level: 0, days: 1, hours: '08:00–12:00', minAge: 10, cert: null,
    includes: ['drySession', 'openWater', 'safety', 'gear', 'photos', 'boat'], learn: ['breathing', 'equalization', 'duckDive', 'buddy'],
    schedule: [['08:00', 'meet'], ['08:15', 'waiver'], ['08:30', 'theory'], ['09:20', 'boat'], ['09:45', 'water'], ['11:30', 'back']],
    img: 'kid-ok-sign.jpg', img2: 'buoy-from-below.jpg', gallery: ['boy-free-immersion.jpg', 'buddies-surface-fins.jpg', 'family-on-bangka.jpg', 'diver-hoop-below-surface.jpg'], faq: ['swim', 'depth', 'safe', 'gear', 'bring'], testimonial: 'bucketList' },
  { slug: 'molchanovs-wave-1', key: 'wave1', group: 'course', price: 15000, level: 1, days: 3, hours: '3 days', minAge: 16, cert: 'Molchanovs Wave 1', depth: 20,
    includes: ['instructor', 'manuals', 'certificate', 'theory', 'pool', 'openWater', 'gear', 'boat'], learn: ['physiology', 'equalization', 'static', 'dynamic', 'cwt', 'fim', 'rescue'],
    img: 'line-training-deep-blue.jpg', img2: 'line-training-over-reef.jpg', gallery: ['line-training-long-fins.jpg', 'surface-buoy-pink-fins.jpg', 'two-freedivers-descending.jpg', 'headfirst-descent.jpg'], faq: ['waveDays', 'elearning', 'depth', 'swim200', 'certValid'], testimonial: 'newHobby' },
  { slug: 'molchanovs-wave-2', key: 'wave2', group: 'course', price: 17000, level: 2, days: 4, hours: '3–4 days', minAge: 16, cert: 'Molchanovs Wave 2', depth: 30,
    includes: ['instructor', 'manuals', 'certificate', 'theory', 'pool', 'openWater', 'gear', 'boat'], learn: ['frc', 'mouthfill', 'noFins', 'cwt30', 'training', 'rescue'],
    img: 'freediver-vertical-white-fins.jpg', img2: 'ascending-yellow.jpg', gallery: ['line-training-deep-blue.jpg', 'gliding-black-fins.jpg', 'descent-over-cabbage-coral.jpg', 'freediver-black-white.jpg'], faq: ['wave2Pre', 'waveDays', 'elearning', 'certValid'], testimonial: 'playground' },
  { slug: 'aida-courses', key: 'aida', group: 'course', price: 7500, level: 0, days: 2, hours: '2–4 days', minAge: 16, cert: 'AIDA 1 / 2 / 3',
    tiers: [['AIDA 1', 7500, 1, 0], ['AIDA 2', 15000, 3, 1], ['AIDA 3', 17000, 4, 2]],   // [name, PHP, days, level]
    includes: ['instructor', 'manuals', 'certificate', 'theory', 'openWater', 'gear', 'pool', 'boat'], learn: ['physiology', 'equalization', 'static', 'dynamic', 'cwt', 'rescue'],
    img: 'freediver-arms-out-cabbage-coral.jpg', img2: 'gliding-over-dark-reef.jpg', gallery: ['pink-fins-cabbage-coral.jpg', 'freediver-gliding-over-reef.jpg', 'two-freedivers-descending.jpg', 'ascending-yellow.jpg'], faq: ['aidaVsMolchanovs', 'waveDays', 'swim200', 'certValid'], testimonial: 'wouldntShutUp' },
  { slug: 'line-training-refreshers', key: 'line', group: 'course', price: 3000, level: 2, days: 1, hours: '08:00–12:00', minAge: 16, cert: null,
    includes: ['drySession', 'openWater', 'safety', 'gear', 'photos', 'boat'], learn: ['static', 'fim1030', 'cwt1030', 'advEq', 'noFinsBasics', 'rescueBuddy'],
    img: 'line-training-long-fins.jpg', img2: 'line-training-deep-blue.jpg', gallery: ['line-training-over-reef.jpg', 'surface-buoy-pink-fins.jpg', 'buoy-from-below.jpg', 'boy-on-the-line.jpg'], faq: ['whoLine', 'lineDepth', 'gear', 'bring'], testimonial: 'playground' },
  { slug: 'private-session', key: 'private', group: 'course', price: 8000, level: 0, days: 1, hours: 'half day', minAge: 10, cert: 'AIDA (digital certificate)', private: true,
    includes: ['instructor', 'theory', 'pool', 'openWater', 'aidaCert', 'gear', 'photos', 'boatRental'], learn: ['breathing', 'equalization', 'duckDive', 'buddy', 'yourPace'],
    img: 'freediver-white-bikini-reef.jpg', img2: 'photographer-with-camera.jpg', gallery: ['headfirst-descent.jpg', 'gliding-black-fins.jpg', 'red-dress-underwater.jpg', 'yellow-surface-portrait.jpg'], faq: ['privateWho', 'privateGroup', 'swim', 'bring'], testimonial: 'bucketList' },
  { slug: 'daily-fun-dive', key: 'fundive', group: 'fundive', price: 2050, level: 1, days: 1, hours: '08:00–12:00', min: 3,
    includes: ['session', 'safety', 'gear', 'photos', 'boat'], sites: ['daku', 'cabbage'],
    img: 'freediver-white-fins-cabbage-coral.jpg', img2: 'under-the-bangka.jpg', gallery: ['red-fins-cabbage-coral.jpg', 'cabbage-coral-wide.jpg', 'freediver-over-sand-reef-top.jpg', 'diver-beneath-boat.jpg'], faq: ['funPre', 'funMin', 'funPhotos', 'bring'], testimonial: 'dakuCave' },
  { slug: 'tri-island-fun-dive', key: 'triIsland', group: 'fundive', price: 3000, level: 1, days: 1, hours: '08:00–13:00', min: 4,
    includes: ['sites23', 'safety', 'gear', 'photos', 'boat'], sites: ['daku', 'naked', 'guyam'],
    img: 'naked-island-fins-portrait.jpg', img2: 'bangka-boat-at-sea.jpg', gallery: ['beach-portrait-bangkas.jpg', 'school-of-jacks.jpg', 'green-bikini-fins-beach.jpg', 'feet-on-boat-net.jpg'], faq: ['funPre', 'funMin', 'islands', 'bring'], testimonial: 'lostInBlue' },
  { slug: 'private-fun-dive', key: 'privateFun', group: 'fundive', price: 4500, level: 1, days: 1, hours: 'half day', private: true,
    includes: ['instructor', 'openWater', 'spots2', 'gear', 'photos', 'boatRental'], sites: ['daku', 'cabbage', 'naked'],
    img: 'gliding-over-dark-reef.jpg', img2: 'diver-beneath-boat.jpg', gallery: ['freediver-arms-out-cabbage-coral.jpg', 'black-white-over-sand.jpg', 'wetsuit-freediver-reef.jpg', 'man-on-underwater-rocks.jpg'], faq: ['privateFunWho', 'funPre', 'funPhotos', 'bring'], testimonial: 'mermaids' },
  { slug: 'underwater-photoshoot', key: 'shoot', group: 'shoot', price: 3999, level: 1, days: 1, hours: 'half day',
    tiers: [['photo', 4150], ['video', 3999]],
    includes: ['openWater', 'gear', 'boat'], sites: ['cabbage', 'daku'],
    img: 'red-dress-underwater.jpg', img2: 'photographer-with-camera.jpg', gallery: ['man-white-shirt-underwater.jpg', 'freediver-black-white.jpg', 'pink-fins-cabbage-coral.jpg', 'yellow-surface-portrait.jpg', 'freediver-arms-out-cabbage-coral.jpg', 'black-swimsuit-mask.jpg'], faq: ['shootPre', 'shootDelivery', 'shootOutfit', 'shootIntro'], testimonial: 'playground' },
];

// Dive sites. depth in metres (3rd party / assumed – confirm with the school), level as above.
const sites = {
  cabbage: { img: 'cabbage-coral-wide.jpg', depth: [5, 15], level: 0, minutes: 15 },
  daku: { img: 'under-the-bangka.jpg', depth: [8, 20], level: 1, minutes: 15 },
  dakuCave: { img: 'gliding-over-dark-reef.jpg', depth: [10, 18], level: 2, minutes: 15 },
  naked: { img: 'naked-island-fins-portrait.jpg', depth: [3, 12], level: 0, minutes: 25 },
  guyam: { img: 'beach-portrait-bangkas.jpg', depth: [3, 12], level: 0, minutes: 10 },
  line: { img: 'line-training-deep-blue.jpg', depth: [10, 35], level: 1, minutes: 20 },
  blueCathedral: { img: 'school-of-jacks.jpg', depth: [18, 40], level: 3, minutes: 30 },
};

// Stay: the school's own unit + partner villas (Instagram 2024–2025).
const stay = [
  { key: 'unit', price: 2750, per: 'night', pax: 2, img: 'villa-room.jpg', features: ['king', 'living', 'kitchen', 'starlink', 'parking'] },
  { key: 'vistaMar', price: 2500, per: 'night', pax: 6, img: 'green-bikini-fins-beach.jpg', features: ['bedroom1', 'living', 'kitchen', 'porch'] },
  { key: 'monteCarlo', price: 1750, per: 'night', pax: 4, img: 'beach-portrait-bangkas.jpg', features: ['studio', 'kitchen', 'porch'] },
];

// Gear rental per day (Instagram, Oct 2024)
const rental = [['carbonFins', 400], ['plasticFins', 250], ['maskSnorkel', 150], ['buoyLine', 450], ['beltWeights', 150]];

// Recommender: answers → product slug. exp: 'none' | 'tried' | 'certified'; want: 'learn' | 'fun' | 'photos' | 'deeper'
const recommend = [
  ['none', 'learn', 'intro-to-freediving'], ['none', 'fun', 'intro-to-freediving'], ['none', 'photos', 'underwater-photoshoot'], ['none', 'deeper', 'molchanovs-wave-1'],
  ['tried', 'learn', 'molchanovs-wave-1'], ['tried', 'fun', 'daily-fun-dive'], ['tried', 'photos', 'underwater-photoshoot'], ['tried', 'deeper', 'molchanovs-wave-1'],
  ['certified', 'learn', 'molchanovs-wave-2'], ['certified', 'fun', 'tri-island-fun-dive'], ['certified', 'photos', 'underwater-photoshoot'], ['certified', 'deeper', 'line-training-refreshers'],
];

// Old URLs → new pages (there is no old site; these catch the obvious guesses and the Linktree paths)
const redirects = { '/courses': '/courses/', '/rates': '/prices/', '/pricing': '/prices/', '/book-now': '/book/', '/accommodation': '/stay/' };

module.exports = { site, languages, currencies, stats, products, sites, stay, rental, recommend, redirects };
