// Structure of the site: products, groups, navigation, people, places, prices, redirects.
// All human-readable text lives in src/i18n/<lang>/*.js so that every language can be translated separately.
const site = {
  name: 'Thai Ocean Academy Pattaya',
  shortName: 'TOCo Pattaya',
  legalName: 'Thai Ocean Co., Ltd.',
  domain: 'https://www.pattaya-dive.com',
  tagline: 'Educate. Equip. Explore.',
  founded: 2020,
  phone: '+66 99 690 0456',        // as shown on the original site: +66 099 690 0456
  phoneAlt: '+66 82 470 7706',     // second number shown on the original contact page
  email: 'pattaya@thaioceanacademy.com',
  address: 'Thappraya Road, Pattaya, Thailand',
  hours: 'Everyday 08:00 AM - 8:00 PM',
  maps: 'https://maps.app.goo.gl/XuhxQwUa9Tv3dCDx8',
  mapsEmbed: 'https://www.google.com/maps?q=Thai+Ocean+Academy+Pattaya&z=14&output=embed',
  geo: { lat: 12.9058, lng: 100.8677 },
  rating: 5.0, reviewCount: 202,     // Google reviews widget on the original home page
  social: {
    facebook: 'https://www.facebook.com/thaioceanacademypattaya',
    instagram: 'https://www.instagram.com/thaioceanpattaya/',
    youtube: 'https://www.youtube.com/@thaioceanacademy',
    tiktok: 'https://www.tiktok.com/@thaioceanacademy',
  },
  partners: {
    equipmentStore: 'https://www.thaioceanacademy.com/',
    kohChang: 'https://kohchangdiving.com/',
    darkWater: 'https://darkwaterdiving.asia/',
    raid: 'https://diveraid.com/',
    deepFacebook: 'https://www.facebook.com/DEEP.MARINE.SCIENCE',
  },
  ogImage: 'diver-in-barracuda-school.jpg',
};

// Languages: English lives at the root, others under /<path>/ (hreflang alternates are emitted for all).
const languages = [
  { code: 'en', path: '', name: 'English', htmlLang: 'en' },
];

// Stats shown on the original landing pages (Elementor counters)
const stats = [['99', '%', 'satisfaction'], ['30', '+', 'diveSites'], ['1000', '+', 'customers'], ['3', '', 'stores']];

// Product groups (order = order on the "All diving" page and in the nav)
const groups = ['trips', 'rec', 'pro', 'tech', 'marine'];

// Products. price in THB; priceMax for ranges; depth = certification depth in metres (RAID naming); days = duration.
// img = hero image in src/img. faq = keys into i18n faq. upgrades = [[product-slug|null, price, save, note]]
const products = [
  // ---- day trips
  { slug: 'try-dive', group: 'trips', type: 'trip', price: 4000, days: 1, dives: 2, img: 'try-dive.jpg', img2: 'a-dsicover-scuba-dive-or-try-dive-briefing-before-you-go-for.jpg', faq: ['cannotSwim', 'photos'], testimonial: 'john', level: 'none' },
  { slug: 'fun-diving', group: 'trips', type: 'trip', price: 2700, priceMax: 3200, days: 1, dives: '2-3', img: 'scuba-diver-in-pattaya.jpg', img2: 'two-divers-underwater-open-water-training.jpg', faq: ['bestTime', 'refresher'], testimonial: 'alex', level: 'certified' },
  { slug: 'snorkelling', group: 'trips', type: 'trip', price: 1200, days: 1, img: 'children-getting-ready-to-go-snorkelling-in-pattaya-thailand.jpg', img2: 'snorkeling-in-pattaya-thailand-with-thai-ocean-academy.jpg', faq: ['snorkelGood', 'snorkelSwim'], testimonial: 'mary', level: 'none' },
  // ---- recreational
  { slug: 'open-water-20', group: 'rec', type: 'course', price: 14900, days: 3, depth: 20, img: 'divers-learn-about-buoyancy-on-open-water-training-in-pattay.jpg', faq: ['padi', 'advancedWhen'], level: 'none', neverExpires: true,
    upgrades: [['explorer-30', 22500, 5300, ''], ['nitrox', 16000, 4400, '']] },
  { slug: 'explorer-30', group: 'rec', type: 'course', price: 12900, days: 2, depth: 30, dives: 5, img: 'scuba-diving-pattaya-thailand.jpg', faq: ['padi', 'advancedWhen'], level: 'certified',
    upgrades: [['nitrox', 15000, 3400, '2 days Total'], ['deep-40', 19000, 4800, '3 days total']] },
  { slug: 'advanced-35', group: 'rec', type: 'course', price: 16500, days: 3, depth: 35, dives: 6, img: 'safety-stop-after-deep-dive-on-advanced-course.jpg', faq: ['padi', 'advancedWhen'], level: 'certified', neverExpires: true,
    upgrades: [['nitrox', 19000, 3000, '(3 days)'], ['deep-40', 24000, 3400, '(4 days)']] },
  { slug: 'master-rescue', group: 'rec', type: 'course', price: 13500, days: 3, img: 'rescue-diver-giving-rescue-breaths.jpg', faq: ['padi', 'advancedWhen'], level: 'certified',
    upgrades: [[null, 18500, 5000, '(4 days)']] },
  { slug: 'deep-40', group: 'rec', type: 'course', price: 10900, days: 2, depth: 40, dives: 4, img: 'scuba-diving-deep-40m-training-in-pattaya.jpg', faq: ['padi', 'advancedWhen'], level: 'certified',
    upgrades: [['nitrox', 13500, 2300, '2 days total'], ['explorer-30', 19000, 4800, '3 days total']] },
  { slug: 'nitrox', group: 'rec', type: 'course', price: 3500, priceMax: 5500, days: 1, img: 'diving-on-nitrox-is-the-best.jpg', img2: 'the-different-types-of-gases-you-can-breath-while-scuba-divi.jpg', faq: ['padi', 'advancedWhen'], level: 'certified', neverExpires: true,
    upgrades: [['deep-40', 13500, 2300, '2 days total'], ['explorer-30', 15000, 3400, '2 days Total']] },
  { slug: 'wreck-diver', group: 'rec', type: 'course', price: 10900, days: 2, dives: 4, img: 'technical-diver-inside-of-a-wreck.jpg', img2: 'sidemoutn-diver-descending-onto-a-shipwreck.jpg', faq: ['padi', 'wreckPenetration'], level: 'certified',
    upgrades: [['deep-40', 20000, 3300, '6 dives'], ['nitrox', 15000, 2400, '4 dives']] },
  { slug: 'sidemount', group: 'rec', type: 'course', alsoIn: 'tech', price: 16500, days: 3, img: 'sidemount-diver-in-open-ocean.jpg', img2: 'sidemount-diver-pattaya-thailand.jpg', faq: ['padi', 'sidemountBenefit'], level: 'certified',
    upgrades: [['open-water-20', 22500, 6000, ''], ['nitrox', 19000, 2200, '']] },
  // ---- professional
  { slug: 'divemaster', group: 'pro', type: 'course', price: 85000, from: true, img: 'raid-open-water-20-training.jpg', img2: 'divemaster-trainees-getting-a-briefing.jpg', faq: ['padi', 'advancedWhen'], level: 'certified' },
  { slug: 'instructor-training', group: 'pro', type: 'course', price: 75000, days: 14, img: 'raid-instructor-training-program.jpg', img2: 'instructor-students-preparing-for-presentations-to-their-ins.jpg', faq: ['padi', 'advancedWhen'], level: 'pro' },
  { slug: 'instructor-crossover', group: 'pro', type: 'course', price: 25000, days: 2, img: 'dive-professional-owen-holding-low-pressure-inflator-hose-at.jpg', faq: ['padi', 'crossoverIdc'], level: 'pro', neverExpires: true,
    upgrades: [[null, 35000, 0, '(+1 day)']] },
  { slug: 'instructor-specialty', group: 'pro', type: 'course', price: 6500, perUnit: true, days: 2, img: 'sidemount-instructor-speciatly-training.jpg', faq: ['padi', 'advancedWhen'], level: 'pro' },
  // ---- technical
  { slug: 'nitrox-plus', group: 'tech', type: 'course', price: 15500, days: 3, depth: 40, img: 'raid-nitrox-plus-training.jpg', faq: ['padi', 'advancedWhen'], level: 'certified',
    upgrades: [['sidemount', 25500, 9600, '4 days'], ['deep-40', 19900, 5400, '4 days']] },
  { slug: 'tdi-andp', group: 'tech', type: 'course', price: 45000, days: 5, depth: 45, img: 'tdi-andp-training-pattaya-thailand.jpg', faq: ['padi', 'advancedWhen'], level: 'tech', agency: 'TDI' },
  { slug: 'decompression-diver', group: 'tech', type: 'course', price: 45000, days: 3, depth: 45, img: 'raid-decompression-training-in-pattaya-thailand.jpg', faq: ['padi', 'advancedWhen'], level: 'tech' },
  { slug: 'advanced-decompression', group: 'tech', type: 'course', price: 60000, days: 4, depth: 50, img: 'raid-advanced-deco-diver.jpg', faq: ['padi', 'advancedWhen'], level: 'tech' },
  { slug: 'normoxic-decompression', group: 'tech', type: 'course', price: 75000, days: 5, depth: 60, img: 'raid-normoxic-decompression-diver.jpg', faq: ['padi', 'advancedWhen'], level: 'tech' },
  // ---- marine education
  { slug: 'marine-education-eca', group: 'marine', type: 'program', price: null, img: 'a-school-group-completing-their-eca-activitives.jpg', img2: 'group-of-students-working-on-artificial-reefs.jpg', faq: ['padi', 'advancedWhen'], level: 'none' },
  { slug: 'citizen-science', group: 'marine', type: 'program', price: null, img: 'marine-science-internship-pattaya.jpg', img2: 'working-with-the-thai-dmcr.jpg', faq: ['padi', 'advancedWhen'], level: 'certified' },
];

// Hub pages: key → { group, img }. Their copy lives in i18n pages.
const hubs = {
  diving: { img: 'diver-in-barracuda-school.jpg' },
  dayTrips: { group: 'trips', img: 'koh-sak-island-aerial.jpg', testimonial: 'john' },
  courses: { group: 'rec', img: 'happy-scuba-divers-in-pattaya.jpg', imgs: ['divers-having-fun.jpg', 'family-scuba-diving.jpg'], testimonial: 'ali' },
  professional: { group: 'pro', img: 'scuba-instructors-and-dive-masters-at-thai-ocean-academy.jpg', imgs: ['scuba-diving-divemaster.jpg'], testimonial: 'thomas' },
  technical: { group: 'tech', img: 'diver-prepares-to-go-for-a-technical-dive.jpg', imgs: ['more-tanks-are-better-than-one.jpg', 'technical-divers-on-the-line.jpg'], testimonial: 'richard' },
  marine: { group: 'marine', img: 'working-with-the-thai-dmcr.jpg', imgs: ['group-of-students-working-on-artificial-reefs.jpg', 'plate-coral-garden.jpg'], testimonial: 'ashley' },
};

// Price list page (verbatim from the original pricing page, grouped as there). [label, price] — price null = text.
const priceList = {
  dayTrips: {
    noExperience: [['Try Diving Ocean 2 dives', 4000], ['Try Diving Pool 4 hours', 3000], ['Snorkelling Ocean 2 sites', 1200]],
    certified: [['2 dives 1 day', 2700], ['3 dives 1 day', 3200], ['Refresher 2 dives', 4500], ['5 dives 2 days', 5500], ['10 dive package', 10000]],
  },
  recreational: {
    noExperience: [['Scuba Diver (2 days)', 9500], ['Open Water 20 (3 days)', 14900]],
    certified: [['Explorer 30 (2 days)', 12900], ['Advanced 35 (3 days)', 14900], ['Master Rescue (4 days)', 15500], ['First Aid & O2 Admin (1 day)', 4500], ['Sidemount Diver (3 days)', 16500], ['Wreck Specialty (2 days)', 10900], ['Deep 40 Specialty (2 days)', 10900], ['Nitrox Specialty alone (1 day)', 5500], ['Nitrox with Course (add on)', '+THB 3500'], ['Night Diver (1 day)', 4000]],
  },
  professional: [['Dive Master', 85000], ['Instructor Training Program', 75000], ['Deep 40 Instructor Specialty', 10500], ['Nitrox Instructor Specialty', 7500], ['Wreck Instructor Specialty', 12500], ['RAID Crossover Instructor', 25000]],
  technical: [['RAID Twinset (1 day)', 6500], ['RAID Sidemount (3 days)', 16500], ['RAID Deco 40 (4 days)', 25000], ['RAID Deco 50 (4 days)', 45000]],
  marine: [['Ecological Monitoring Program (2 days)', 8500], ['EMP Lite (1 day)', 4500], ['Advanced EMP (2 days)', 9500], ['Invertebrate Safari (1 day)', 5000], ['Vertebrate Safari (1 day)', 5000], ['Neptunes Cup Safari (1 day)', 5000], ['Artificial Reef Safari (1 day)', 5000]],
  other: {
    rental: [['Gear Rental Full Package (1 day)', 600], ['BCD', 130], ['Regulator', 130], ['Dive Computer', 130], ['Mask, Fins, Snorkel', 200], ['Wetsuit', 130]],
    servicing: [['Service kits for each piece', '(As listed by supplier)'], ['Labour (Per Piece)', 600]],
    services: [['Transport one way (Bkk-Ptty)', 1000], ['Transport return (Bkk-Ptty)', 2000], ['Private Taxi one way (Bkk-ptty)', 1700], ['Accomodation Pattaya (1 night)', 900]],
  },
  clubImages: ['toco-dive-club-prices.jpg', 'toco-dive-club-package-benefits.jpg'],
};

const team = {
  core: [
    { name: 'Tim McCabe', img: 'team-tim.jpg' },
    { name: 'Thana "Jeep" Jantarakolica', img: 'team-jeep.jpg' },
    { name: 'Nitiya "Mint" Oraphat', img: 'team-mint.jpg' },
  ],
  bangkok: [
    { name: 'Tuangpon "Nan" Chusri', img: 'team-nan.jpg' },
    { name: 'Adam Stoddard', img: 'team-adam.jpg' },
    { name: 'Jettana "Tak" Lasoi', img: 'team-tak.jpg' },
  ],
};

const locations = [
  { key: 'bangkok', img: 'thai-ocean-academy-bangkok-store-front.jpg', address: '1038/22 Floor 2 Sigma Place Building Sukhumvit Rd', phone: '+66 84 995 9547', email: 'bangkok@thaioceanacademy.com', hours: 'Everyday 10:00 AM - 7:00 PM', maps: 'https://maps.app.goo.gl/XuhxQwUa9Tv3dCDx8', mapsEmbed: 'https://www.google.com/maps?q=Thai+Ocean+Academy+Bangkok&z=13&output=embed', site: 'https://www.thaioceanacademy.com/' },
  { key: 'pattaya', img: 'thai-ocean-academy-pattaya-location.jpg', address: 'Thappraya Road, Pattaya, Thailand', phone: '+66 99 690 0456', email: 'pattaya@thaioceanacademy.com', hours: 'Everyday 08:00 AM - 8:00 PM', maps: 'https://maps.app.goo.gl/XuhxQwUa9Tv3dCDx8', mapsEmbed: 'https://www.google.com/maps?q=Thai+Ocean+Academy+Pattaya&z=13&output=embed' },
  { key: 'kohChang', img: 'thai-ocean-academy-koh-chang-location.jpg', address: '18/7 Bang Bao Plaza, Tambon Koh Chang Tai', phone: '+66 65 579 3003', email: 'Kohchang@thaioceanacademy.com', hours: 'Everyday 08:00 AM - 8:00 PM', maps: 'https://maps.app.goo.gl/XuhxQwUa9Tv3dCDx8', mapsEmbed: 'https://www.google.com/maps?q=Thai+Ocean+Academy+Koh+Chang&z=13&output=embed', site: 'https://kohchangdiving.com/' },
];

const boats = [
  { key: 'grace', img: 'thai-ocean-academy-scuba-grace-dive-boat-pattaya.jpg', img2: 'scuba-grace-from-underwater.jpg', capacity: 40 },
  { key: 'princess', img: 'thai-ocean-academy-scuba-princess-dive-boat.jpg', img2: 'scuba-diving-at-koh-krok-in-pattaya.jpg', capacity: 20 },
];

// Blog categories (from the original WordPress site)
const categories = [
  { slug: 'scuba-diving-and-training', name: 'Scuba Diving and Training' },
  { slug: 'marine-life-and-conservation', name: 'Marine Life and Conservation' },
  { slug: 'general-diving-knowledge', name: 'General Diving Knowledge' },
];

// Old WordPress URL → new URL (emitted as _redirects for Cloudflare Pages / Netlify)
const redirects = {
  '/scuba-dive-courses-pattaya/': '/diving/',
  '/pattaya-scuba-dive-day-trips-2-and-3-dives/': '/day-trips/',
  '/scuba-dive-courses-pattaya/try-scuba-dive-pattaya/': '/try-dive/',
  '/scuba-dive-courses-pattaya/fun-dive-pattaya/': '/fun-diving/',
  '/snorkelling-pattaya-guided-experiences/': '/snorkelling/',
  '/snorkelling-pattaya/': '/snorkelling/',
  '/recreational-courses/': '/courses/',
  '/scuba-dive-courses-pattaya/recreational-scuba-dive-courses-pattaya-thailand/': '/courses/',
  '/open-water-20-diver-training/': '/courses/open-water-20/',
  '/open-water-20-diver/': '/courses/open-water-20/',
  '/explorer-30-advanced-scuba-training-pattaya/': '/courses/explorer-30/',
  '/explorer-30/': '/courses/explorer-30/',
  '/advanced-35/': '/courses/advanced-35/',
  '/master-rescue-first-aid/': '/courses/master-rescue/',
  '/scuba-dive-courses-pattaya/recreational-scuba-dive-courses-pattaya-thailand/deep-40-scuba-training/': '/courses/deep-40/',
  '/recreational-nitrox-diver-training-pattaya/': '/courses/nitrox/',
  '/recreational-nitrox-diver/': '/courses/nitrox/',
  '/raid-wreck-diver-training-pattaya/': '/courses/wreck-diver/',
  '/raid-wreck-diver-training/': '/courses/wreck-diver/',
  '/raid-sidemount/': '/courses/sidemount/',
  '/professional-training/': '/professional/',
  '/scuba-dive-courses-pattaya/professional-training/': '/professional/',
  '/dive-master-training-pattaya/': '/professional/divemaster/',
  '/scuba-dive-instructor-training-program/': '/professional/instructor-training/',
  '/raid-instructor-professional-crossover/': '/professional/instructor-crossover/',
  '/scuba-instructor-specialty-training/': '/professional/instructor-specialty/',
  '/scuba-instrutor-specialty-training/': '/professional/instructor-specialty/',
  '/technical-dive-training-pattaya/': '/technical/',
  '/raid-nitrox-plus-decompression-technical-training/': '/technical/nitrox-plus/',
  '/raid-nitrox-plus/': '/technical/nitrox-plus/',
  '/tdi-andp/': '/technical/tdi-andp/',
  '/raid-full-decompression-diver/': '/technical/decompression-diver/',
  '/raid-extended-decompression-diver-training/': '/technical/advanced-decompression/',
  '/raid-extended-decompression-diver/': '/technical/advanced-decompression/',
  '/technical-wreck-diver-training/': '/technical/normoxic-decompression/',
  '/marine-education-and-conservation-pattaya-thailand/': '/marine-education/',
  '/marine-education-and-conservation/': '/marine-education/',
  '/marine-education-extra-curricular-activity-thailand/': '/marine-education/marine-education-eca/',
  '/citizen-scientist-marine-education-in-thailand/': '/marine-education/citizen-science/',
  '/scuba-dive-prices-pattaya-thailand/': '/pricing/',
  '/about-us/': '/about/',
  '/about-us/team/': '/about/team/',
  '/about-us/our-locations/': '/about/locations/',
  '/about-us/our-boats/': '/about/boats/',
  '/contact-us/': '/contact/',
  '/contact-us/book-now/': '/book/',
  '/terms-and-conditions/': '/terms/',
  '/thai-ocean-blog-pattaya-thailand/': '/blog/',
  '/scuba-diving-pattaya-blog-landing-page/': '/blog/',
  '/category/uncategorized/': '/blog/',
  '/category/marine-life-conservation/': '/blog/category/marine-life-and-conservation/',
  '/category/scuba-dive-training-bangkok-pattaya/': '/blog/category/scuba-diving-and-training/',
};

module.exports = { site, languages, stats, groups, products, hubs, priceList, team, locations, boats, categories, redirects };
