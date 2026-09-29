// Content for the sales page. Everything a visitor reads is here. build.js only lays it out.
// Brand, contact details and prices are left for you to fill in; the build warns while one is missing.

const site = {
  name: '',            // TODO: your business name, e.g. "Ekbom Webb". Empty → the header shows the tagline instead.
  tagline: 'Nya hemsidor för små företag',
  email: '',           // TODO: e.g. hej@dindomän.se, used by every contact button
  phone: '',           // TODO: optional, e.g. 070-123 45 67
  domain: 'https://example.se', // TODO: canonical/og URL once you have a domain
  city: 'Sverige',
  demoBase: 'https://rasmusekbom.github.io/dive-sites',
  // true: no business is named. Cases show `alias` and `region`, the demo links are left out, screenshot files get
  // neutral names, and shoot.js blurs every `mask` term (names, logos, phone, e-mail) inside the screenshots.
  // Set to false per case (or here) once a business has agreed to be shown by name.
  anonymize: true,
};

// The offer. Prices are a starting proposal; change them freely.
const plans = [
  {
    key: 'bas', name: 'Bas', price: 595, unit: 'kr/mån', note: 'Ingen startavgift, ingen bindningstid',
    for: 'För företaget som behöver en riktig hemsida i stället för en Facebook-sida eller en gammal sajt.',
    items: ['Upp till 8 sidor, byggda för mobilen först', 'Hosting, https och säkerhetsuppdateringar', 'Grundläggande Google-optimering (titlar, beskrivningar, karta, strukturerad data)', 'Kontaktformulär och klickbara telefon- och kartlänkar', 'Små ändringar när ni behöver, upp till 30 min per månad'],
  },
  {
    key: 'plus', name: 'Plus', price: 995, unit: 'kr/mån', note: 'Ingen startavgift, ingen bindningstid', featured: true,
    for: 'För företaget som säljer upplevelser, kurser eller tjänster och vill ha bokningar via sajten.',
    items: ['Obegränsat antal sidor', 'Flera språk (till exempel svenska och engelska)', 'Bokningsförfrågan eller koppling till ert bokningssystem', 'Google-företagsprofil uppsatt och kopplad till sajten', 'Ändringar upp till 2 timmar per månad', 'Kvartalsrapport: besök, sökord och förfrågningar'],
  },
  {
    key: 'kop', name: 'Köp loss', price: 7900, unit: 'kr engång', note: '+ 149 kr/mån för hosting',
    for: 'För den som hellre betalar en gång och sköter ändringarna själv.',
    items: ['Samma sajt som i Bas, upp till 8 sidor', 'Ni får all källkod och allt innehåll', 'Flera språk eller bokning: fast pris efter offert', 'Ändringar i efterhand mot timpris'],
  },
];
const terms = 'Ingen bindningstid: månadsavgiften löper med en månads uppsägning. Domänen står alltid i ert namn. Alla priser exklusive moms.';

const steps = [
  ['Vi tittar på er sajt', 'Vi går igenom sajten ni har i dag (eller Facebook-sidan) och vad som gör att kunder inte hittar er eller inte hör av sig.'],
  ['Ni får ett gratis utkast', 'Vi bygger en riktig startsida med ert innehåll och era bilder, inte en mall. Det kostar ingenting och ni förbinder er inte till något.'],
  ['Ni bestämmer', 'Gillar ni det bygger vi klart resten. Gillar ni det inte säger ni bara nej tack.'],
  ['Vi lanserar och sköter den', 'Vi flyttar över domänen, ser till att gamla länkar fortsätter fungera och håller sajten uppdaterad.'],
];

const features = [
  ['bolt', 'Snabb på riktigt', 'Sajterna är statiska sidor utan tunga tillägg. De laddar på under en sekund, också på dålig mobiltäckning ute vid bryggan.'],
  ['phone', 'Byggd för mobilen', 'De flesta hittar er i telefonen. Knappar, menyer, priser och bokning är gjorda för tummen först.'],
  ['search', 'Syns på Google', 'Rätt titlar och beskrivningar, sitemap, karta och strukturerad data, så att Google förstår vad ni gör och var ni finns.'],
  ['globe', 'Flera språk', 'Turister söker på sitt eget språk. Vi har byggt sajter på upp till åtta språk med rätt länkar mellan språken.'],
  ['cal', 'Från besök till bokning', 'Tydliga priser, en "Boka"-knapp på varje sida och formulär som är ifyllda i förväg med det kunden tittade på.'],
  ['shield', 'Ni äger domänen', 'Domänen står i ert namn, och texter och bilder är era. Ni kan sluta när ni vill, och vill ni flytta sajten kan ni köpa loss den.'],
];

// Before/after cases. `before.shot` is what shoot.js screenshots; `before.label` is shown under the slider.
// `hidden: true` keeps a case off the page. Order here = order on the page; the first case with screenshots is the hero.
// These are concept rebuilds made on our own initiative. `concept: true` says so on the page, and should stay
// until the business has become a client and agreed to be shown.
const cases = [
  {
    key: 'magwill', name: 'Magwill', place: 'Göteborg', kind: 'Office-utbildning för företag', concept: true,
    slug: 'utbildning', alias: 'Utbildningsföretag', region: 'Sverige',
    mask: ['Magwill', 'magwill.se', '070-320 17 42', '0703201742', '070 320 17 42', 'Kvilletorget'],
    before: { shot: 'https://magwill.se/', label: 'Före: handskriven HTML med fast bredd, 11 px text och inte gjord för mobilen' },
    after: { url: '/magwill/' },
    summary: 'Samma kurser och samma innehåll, men nu går det att läsa i telefonen, jämföra kurser och skicka en intresseanmälan direkt från kurssidan.',
    facts: [['21', 'sidor'], ['790 px → mobil', 'layout'], ['1 klick', 'till intresseanmälan']],
  },
  {
    key: 'nornou', name: 'Nornou Speedboat', place: 'Koh Chang, Thailand', kind: 'Båttransfer, snorkling och charter', concept: true,
    // Kept off the anonymous page: the boat's name is painted on the photos (with customers' faces), and the location is in the copy.
    anonHide: true,
    slug: 'batbolag', alias: 'Båtbolag', region: 'Thailand',
    mask: ['Nornou', 'Kaibaehut', 'Kai Bae Hut', 'KaiBae Hut', 'Kaibae Hut', 'N. Kai Bae', 'nornouspeedboat', '81 982 9870', '818176832', '081-982'],
    before: { shot: 'https://www.nornouspeedboat.com/', label: 'Före: Wix-sajt utan tidtabell eller priser för transfer' },
    after: { url: '/nornou/' },
    summary: 'Transfer var kärnverksamheten, men sajten saknade tidtabell och priser. Nu finns en ruttsökare, full tidtabell, en priskalkylator för charter och valutaväljare.',
    facts: [['133', 'sidor'], ['7', 'språk'], ['6', 'rutter med tider']],
  },
  {
    key: 'pattaya', name: 'Thai Ocean Academy', place: 'Pattaya, Thailand', kind: 'Dykcenter', concept: true,
    slug: 'dykcenter-thailand', alias: 'Dykcenter', region: 'Thailand',
    mask: ['Thai Ocean Academy', 'Thai Ocean', 'TOCo', 'thaioceanacademy', 'pattaya-dive', '99 690 0456', '996900456', 'Pattaya'],
    before: { shot: 'https://www.pattaya-dive.com/', label: 'Före: WordPress med prislistor gömda i dragspelsmenyer' },
    after: { url: '/pattaya/' },
    summary: 'Allt innehåll behölls, men dubbletter slogs ihop och dolda priser blev synliga. Mallens platshållartexter togs bort och varje gammal adress leder vidare till rätt ny sida.',
    facts: [['278', 'sidor'], ['7', 'språk'], ['110', 'foton']],
  },
  {
    key: 'seastar', name: 'Seastar Diving', place: 'Stockholm', kind: 'Dykskola och dykcenter', concept: true,
    slug: 'dykcenter-sverige', alias: 'Dykcenter', region: 'Sverige',
    mask: ['Seastar', 'seastardiving', '72 561 02 40', '072-561 02 40', 'Solkraftsvägen', 'Skrubba', 'Skarpnäck', 'Stockholm'],
    before: { shot: 'https://seastardiving.se/', label: 'Före: en platshållarsida med "vi håller på att uppdatera sidorna"' },
    after: { url: '/seastar/' },
    summary: 'Dykcentret hade bara en platshållarsida, och den var dessutom dold för Google. Nu finns en komplett sajt med alla kurser från prova-på till instruktör, teknisk dykning, verkstad och uthyrning.',
    facts: [['38', 'sidor'], ['2', 'språk'], ['0 → alla', 'kurser på nätet']],
  },
  {
    key: 'maximum', name: 'Maximum Freediving', place: 'Siargao, Filippinerna', kind: 'Fridykningsskola', concept: true,
    slug: 'fridykning', alias: 'Fridykningsskola', region: 'Filippinerna',
    mask: ['Maximum Freediving', 'Maximum', 'maximumfreediving', '917 482 7514', '9174827514', 'Siargao', 'General Luna'],
    before: { shot: 'https://www.instagram.com/siargao.maximumfreediving/', label: 'Före: ingen hemsida, priserna fanns bara som bilder på Instagram' },
    after: { url: '/maximum/' },
    summary: 'Skolan hade bara Instagram. Nu finns en sajt med kurser, priser man kan söka på, dykplatser, vanliga frågor och ett bokningsformulär på sex språk.',
    facts: [['126', 'sidor'], ['6', 'språk'], ['31', 'svar i FAQ']],
  },
  {
    key: 'kohkood', name: 'Koh Kood Divers', place: 'Koh Kood, Thailand', kind: 'Dykcenter', concept: true,
    slug: 'dykcenter-o', alias: 'Dykcenter på en ö', region: 'Thailand',
    mask: ['Koh Kood Divers', 'kohkooddivers', '85 698 4122', '856984122'],
    // Hidden: their live site is already modern (checked 2026-09-29), so the before/after says little.
    hidden: true,
    before: { shot: 'https://kohkooddivers.com/', label: 'Före: sajten som finns i dag' },
    after: { url: '/kohkood/' },
    summary: 'En flerspråkig sajt för ett dykcenter på en ö där de flesta gäster är utländska turister. Varje kurs har en egen sida med pris i gästens valuta och en direktlänk till bokningskalendern.',
    facts: [['192', 'sidor'], ['8', 'språk'], ['17', 'kurser och turer']],
  },
];

const faq = [
  ['Varför inte bygga själv med Wix eller en AI-tjänst?', 'Det går, och för vissa räcker det. Men att sajten finns är sällan problemet. Svårare är att den ska synas på Google, ladda snabbt i mobilen, vara uppdaterad och leda till bokningar. Det kräver tid som de flesta småföretagare hellre lägger på sina kunder. Vi gör det åt er, och ni har en person att ringa när något ska ändras.'],
  ['Vad kostar utkastet?', 'Ingenting. Ni får se en riktig startsida med ert eget innehåll innan ni bestämmer något. Säger ni nej tack är det inget mer med det.'],
  ['Vi har redan en hemsida. Behöver vi börja om?', 'Nej. Vi tar med allt innehåll som fungerar, och alla gamla adresser leder vidare till de nya sidorna, så att ni inte tappar det ni redan har på Google.'],
  ['Hur lång tid tar det?', 'Utkastet brukar vara klart inom en vecka. En hel sajt tar normalt två till fyra veckor, beroende på hur mycket innehåll som finns och hur snabbt vi får bilder och svar.'],
  ['Vem skriver texterna?', 'Vi utgår från det ni redan har skrivit: hemsida, Facebook, broschyrer. Vi skriver om och fyller på där det behövs, och ni godkänner allt innan det publiceras.'],
  ['Vad händer om vi vill sluta?', 'Ni kan säga upp när som helst, med en månads uppsägningstid. Domänen är alltid er. Vill ni flytta själva sajten till någon annan kan ni köpa loss den.'],
  ['Kan ni koppla in vårt bokningssystem?', 'Ja. Vi har kopplat sajter till bland annat Rezdy, och de flesta bokningssystem går att länka eller bädda in. Har ni inget system gör vi ett förfrågningsformulär som hamnar i er mejl.'],
];

module.exports = { site, plans, terms, steps, features, cases, faq };
