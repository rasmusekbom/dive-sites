# dive-sites

Rebuilt websites for dive centres and boat operators, one folder per project. Each project is a dependency-free static
site generator (Node) with its own `src/` (content, i18n, images) and `build.js` → `dist/`.

| Project | Client | Demo |
|---|---|---|
| [`kohkood/`](kohkood/) | Koh Kood Divers, Thailand | https://rasmusekbom.github.io/dive-sites/kohkood/ |
| [`pattaya/`](pattaya/) | Thai Ocean Academy Pattaya (pattaya-dive.com), Thailand | https://rasmusekbom.github.io/dive-sites/pattaya/ |
| [`nornou/`](nornou/) | Nornou / N. Kai Bae Hut Speedboat (nornouspeedboat.com), Koh Chang, Thailand – transfers, snorkelling, charter | https://rasmusekbom.github.io/dive-sites/nornou/ |
| [`maximum/`](maximum/) | Maximum Freediving Siargao (no website – Instagram/Facebook only), General Luna, Philippines – freediving courses, fun dives, underwater shoots | https://rasmusekbom.github.io/dive-sites/maximum/ |
| [`seastar/`](seastar/) | Seastar Diving (seastardiving.se is a single "we are updating the pages" placeholder), Skrubba, Stockholm – PADI courses, technical diving, servicing, gas, rental | https://rasmusekbom.github.io/dive-sites/seastar/ |

## Working on a project

```bash
cd kohkood
npm install          # once (sharp, for responsive images)
npm run build        # build-images.js + build.js → dist/
npm run check        # link + locale-leak check over dist/
node audit.js        # SEO/a11y/sitemap/redirect audit
npm run serve        # http://127.0.0.1:8765
```

`BASE=/dive-sites/kohkood DEMO=1 npm run build` builds the GitHub Pages demo (sub-path + noindex).
Production is a plain `npm run build` deployed to the client's domain (Cloudflare Pages / Netlify —
`_redirects` is in their format).

## Deploy

`./deploy/publish.sh` builds every project as a noindex demo (`BASE=/dive-sites/<name> DEMO=1`) and force-pushes the
result to the `gh-pages` branch → https://rasmusekbom.github.io/dive-sites/<name>/.

`deploy/pages.yml` is the equivalent GitHub Actions workflow (plus a weekly cron so exchange rates stay fresh); move it to `.github/workflows/` once the gh CLI token has
the `workflow` scope (`gh auth refresh -s workflow`) and deploys happen on every push to `main`.
