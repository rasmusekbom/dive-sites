// Screenshots for the before/after sliders: every case in src/data.js, before (their site today) and after (our demo),
// desktop 1440×900 and mobile 390×844 @2x → src/screens/<key>-<before|after>-<desktop|mobile>.jpg
//   node shoot.js                  → only the screenshots that do not exist yet
//   node shoot.js --force          → retake all
//   node shoot.js seastar magwill  → only these cases (combine with --force)
//   node shoot.js --after          → only our demos (--before: only their sites)
//   AFTER_BASE=http://127.0.0.1:8800 node shoot.js --after → shoot a local build (all projects built with BASE=/<name>)
//   --parallel 1                   → one page at a time (default 2); every shot is retried up to 3 times
// A before-shot that is blocked (bot wall, login wall) can be replaced by hand: drop a jpg with the same name into
// src/screens/ and it is kept, since existing files are skipped unless --force.
// Behind a proxy Chrome cannot use (sandboxed CI): SHOOT_VIA_NODE=1 routes every request through Node's own fetch.
// Needs Playwright: `npm install` here (playwright-core) + a Chrome/Chromium. Set CHROME=<path> if it is not found.
const fs = require('fs');
const path = require('path');
const { cases, site } = require('./src/data.js');
// After-shots come from the published demos; AFTER_BASE=http://127.0.0.1:8765 shoots a local build instead.
const afterUrl = u => /^https?:/.test(u) ? u : (process.env.AFTER_BASE || site.demoBase).replace(/\/$/, '') + u;

let pw;
try { pw = require('playwright-core'); } catch { try { pw = require('playwright'); } catch { console.error('Kör `npm install` i sales/ först (playwright-core).'); process.exit(1); } }
const CHROMES = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/opt/pw-browsers/chromium'];
const findChrome = () => {
  for (const c of CHROMES.filter(Boolean)) {
    if (!fs.existsSync(c)) continue;
    if (fs.statSync(c).isFile()) return c;
    // Playwright's browser folder: <dir>/chrome-linux/chrome
    for (const sub of ['chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome']) if (fs.existsSync(path.join(c, sub)) && fs.statSync(path.join(c, sub)).isFile()) return path.join(c, sub);
  }
};

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const only = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--parallel');
const sides = args.includes('--after') ? ['after'] : args.includes('--before') ? ['before'] : ['before', 'after'];
const DIR = path.join(__dirname, 'src', 'screens');
const VIEWS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' },
};

// Cookie/consent banners cover the page in a screenshot: click the first "accept" button that shows up.
const ACCEPT = /^(accept( all)?|allow( all)?|agree|i agree|got it|ok(ay)?|godkänn( alla)?|acceptera( alla)?|jag förstår|tillåt( alla)?|alle akzeptieren|close|stäng)$/i;
async function dismissBanners(page) {
  for (const frame of page.frames()) {
    const buttons = await frame.$$('button, a[role=button], [role=button], input[type=button], input[type=submit]').catch(() => []);
    for (const b of buttons) {
      const t = ((await b.innerText().catch(() => '')) || (await b.getAttribute('value').catch(() => '')) || '').trim();
      if (ACCEPT.test(t) && await b.isVisible().catch(() => false)) { await b.click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(600); return; }
    }
  }
}

(async () => {
  const executablePath = findChrome();
  const browser = await pw.chromium.launch({ executablePath, args: ['--hide-scrollbars'] });
  fs.mkdirSync(DIR, { recursive: true });
  const shoot = async (c, side, url, view, opts, attempt = 1) => {
    const file = path.join(DIR, `${c.key}-${side}-${view}.jpg`);
    if (attempt === 1 && fs.existsSync(file) && !FORCE) return console.log('finns  ', path.basename(file));
    let failed;
    const ctx = await browser.newContext({ ...opts, locale: 'sv-SE', ignoreHTTPSErrors: true });
    if (process.env.SHOOT_VIA_NODE) await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, async route => {
      const req = route.request();
      try {
        const res = await fetch(req.url(), { method: req.method(), headers: req.headers(), body: req.postDataBuffer() || undefined, redirect: 'manual', signal: AbortSignal.timeout(30000) });
        const headers = Object.fromEntries([...res.headers].filter(([k]) => !/^(content-encoding|content-length|transfer-encoding)$/i.test(k)));
        await route.fulfill({ status: res.status, headers, body: Buffer.from(await res.arrayBuffer()) });
      } catch { await route.abort().catch(() => {}); }
    });
    const page = await ctx.newPage();
    try {
      const res = await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      if (!res || res.status() >= 400) throw new Error(`svarade ${res ? res.status() : 'inget'}`);
      await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
      await dismissBanners(page);
      // Lazy-loaded heroes and fade-in animations: nudge the page, then settle at the top with fonts and images in.
      await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(600);
      await page.evaluate(() => window.scrollTo(0, 0));
      const broken = await page.evaluate(async () => {
        const wait = (p, ms) => Promise.race([p, new Promise(r => setTimeout(r, ms))]);
        await wait(document.fonts.ready, 10000);
        const imgs = [...document.images].filter(i => i.getBoundingClientRect().top < innerHeight);
        await wait(Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))), 15000);
        return imgs.filter(i => i.currentSrc && !i.naturalWidth).map(i => i.currentSrc);
      });
      const body = (await page.innerText('body').catch(() => '')).trim();
      if (body.length < 200 && /upstream|request failed|forbidden|access denied|too many requests/i.test(body)) throw new Error(`fel-sida: "${body.slice(0, 60)}"`);
      if (broken.length) throw new Error(`${broken.length} bild(er) laddade inte, t.ex. ${broken[0]}`);
      await page.waitForTimeout(1200);
      await page.screenshot({ path: file, type: 'jpeg', quality: 78 });
      console.log('tagen  ', path.basename(file), '←', url);
    } catch (e) { failed = e.message.split('\n')[0]; }
    await ctx.close();
    if (!failed) return;
    if (attempt < 3) { await new Promise(r => setTimeout(r, 3000 * attempt)); return shoot(c, side, url, view, opts, attempt + 1); }
    console.log('MISS   ', path.basename(file), '←', url, '–', failed);
  };
  const jobs = [];
  for (const c of cases.filter(c => !only.length || only.includes(c.key)))
    for (const side of sides) {
      const url = side === 'before' ? c.before.shot : c.after.url && afterUrl(c.after.url);
      if (url) for (const [view, opts] of Object.entries(VIEWS)) jobs.push(() => shoot(c, side, url, view, opts));
    }
  await Promise.all(Array.from({ length: +(args[args.indexOf('--parallel') + 1] || 0) || 2 }, async () => { while (jobs.length) await jobs.shift()(); }));
  await browser.close();
})();
