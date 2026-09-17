// node update-rates.js  → refreshes src/rates.json (THB base). Run before build when you want fresh rates.
const fs = require('fs');
const WANT = ['THB', 'EUR', 'USD', 'GBP', 'SEK', 'NOK', 'DKK', 'CHF', 'AUD', 'CNY', 'RUB', 'JPY', 'KRW'];
fetch('https://open.er-api.com/v6/latest/THB').then(r => r.json()).then(j => {
  const rates = Object.fromEntries(WANT.map(c => [c, j.rates[c]]));
  fs.writeFileSync(require('path').join(__dirname, 'src', 'rates.json'), JSON.stringify({ base: 'THB', date: j.time_last_update_utc, rates }, null, 2));
  console.log('rates updated', j.time_last_update_utc, rates);
}).catch(e => { console.error('rate fetch failed, keeping old rates:', e.message); });
