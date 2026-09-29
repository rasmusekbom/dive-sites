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

## Before you publish it
Fill in `site.name`, `site.email`, `site.phone` and `site.domain` in `src/data.js`. The build prints a TODO line
for each one that is missing. Prices, plans and terms are in the same file and are a starting proposal.

The six cases are concept rebuilds that none of the businesses ordered. The page says so under each case
(`concept: true`). Keep it that way until a business has become a client and agreed to be shown. Before a
case goes up on your own domain, ask the business whether they are OK with having their current site shown as
the "before".

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
