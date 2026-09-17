# dive-sites

Rebuilt websites for dive centres, one folder per project. Each project is a dependency-free static
site generator (Node) with its own `src/` (content, i18n, images) and `build.js` → `dist/`.

| Project | Client | Demo |
|---|---|---|
| [`kohkood/`](kohkood/) | Koh Kood Divers, Thailand | https://rasmusekbom.github.io/dive-sites/kohkood/ |

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

Pushing to `main` runs `.github/workflows/pages.yml`, which builds every project with `BASE=/dive-sites/<name>`
and publishes them under https://rasmusekbom.github.io/dive-sites/<name>/ (all `noindex`).
