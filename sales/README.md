# Sales page

One-page site that sells the service: the offer, draggable before/after sliders of the rebuilds in this repo, what is
included, the process, prices, FAQ and a contact form (opens the visitor's mail app, pre-filled). No runtime
dependencies. Own design, not shared with the client sites.

```bash
npm install          # once (playwright-core, only for the screenshots)
npm run shoot        # screenshots → src/screens/ (skips the ones that exist; --force retakes)
npm run build        # → dist/
npm run check
npm run serve        # http://127.0.0.1:8771
```

## Live site: sidklar.se on Cloudflare Pages
Brand, domain and contact are set in `src/data.js` (`Sidklar`, `https://sidklar.se`, `hej@sidklar.se`). A plain
`npm run build` is the production build: canonical/sitemap/robots point at sidklar.se, and it writes `_headers`
(security headers + caching). `BASE=… DEMO=1` builds stay noindex and point at GitHub Pages.

1. **Domain.** Register `sidklar.se` (one.com or any .se registrar).
2. **Cloudflare.** Add the site `sidklar.se` (Free plan), then set the two Cloudflare nameservers at the registrar.
   Cloudflare Registrar does not sell .se, so the domain stays at the registrar and only DNS moves.
3. **Pages.** Workers & Pages → Create → Pages → Connect to Git → `rasmusekbom/dive-sites`:
   - Production branch: `main`
   - Root directory: `sales`
   - Build command: `npm run build`
   - Output directory: `dist`
   (`sales/.node-version` pins Node 22.) Then Custom domains → add `sidklar.se` and `www.sidklar.se`, and add a
   Redirect Rule `www.sidklar.se/*` → `https://sidklar.se/$1` (301).
4. **E-mail.** Email → Email Routing → forward `hej@sidklar.se` to your own inbox (free). The contact form opens
   the visitor's mail app addressed to it, so it must exist before launch.
5. **Search Console.** Add a *Domain* property `sidklar.se`. Choose the Cloudflare option when Google offers it,
   or paste the TXT record into Cloudflare DNS. Then Sitemaps → submit `https://sidklar.se/sitemap.xml`. (The HTML-tag
   method also works: put the code in `site.googleVerification` and rebuild.)

The cases are concept rebuilds that none of the businesses ordered, so the page is **anonymous by default**
(`site.anonymize: true`). Each case shows its `alias` and `region` ("Utbildningsföretag i Sverige") instead of the
name, the demo links are left out, the screenshots are published under neutral file names, and `shoot.js` blurs
every `mask` term (name, domain, phone, street, town) and any logo-sized image or SVG that names the business before
it takes the shot. A case that cannot be anonymised well is kept off the page with `anonHide: true` (Nornou, whose
boat name is painted on the photos). Once a business has become a client and agreed to be shown, set
`anonymize: false` on that case and retake its screenshots (`node shoot.js <key> --force`).

Check the screenshots by eye after every retake. The blur covers text and logos, but not a name that is part of a
photo.

## Screenshots
`shoot.js` takes, for every case in `src/data.js`, *before* (`before.shot`, their site today) and *after* (our demo)
at 1440×900 (desktop) and 390×844 @2x (mobile), and writes `src/screens/<key>-<before|after>-<desktop|mobile>.jpg`.
It clicks away cookie banners, waits for fonts and images, and discards a shot that shows an error page or broken
images (it retries each one up to 3 times). A case with no pair for a view drops that toggle. With no pair at all,
it shows only the after-shot.

- `node shoot.js seastar --force`: retake a single case.
- `AFTER_BASE=http://127.0.0.1:8800 node shoot.js --after`: shoot local builds instead of the GitHub Pages demos
  (build every project with `BASE=/<name>` into one folder and serve that folder on the port).
- A before-shot that cannot be automated (Instagram's login wall, a bot wall) can be taken by hand. Save a
  1440×900 or 780×1688 jpg under the same name and it will be kept.
- Chrome is found automatically on Windows, macOS and Linux. Set `CHROME=<path>` otherwise.
