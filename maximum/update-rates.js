// node update-rates.js  → refreshes src/rates.json (PHP base). Run before build when you want fresh rates.
const fs = require('fs');
const WANT = ['PHP', 'USD', 'EUR', 'GBP', 'KRW', 'JPY', 'CNY', 'AUD', 'SGD', 'CHF', 'SEK', 'CAD', 'HKD'];
fetch('https://open.er-api.com/v6/latest/PHP').then(r => r.json()).then(j => {
  const rates = Object.fromEntries(WANT.map(c => [c, j.rates[c]]));
  fs.writeFileSync(require('path').join(__dirname, 'src', 'rates.json'), JSON.stringify({ base: 'PHP', date: j.time_last_update_utc, rates }, null, 2));
  console.log('rates updated', j.time_last_update_utc, rates);
}).catch(e => { console.error('rate fetch failed, keeping old rates:', e.message); });
