# Lead finder

Finds small businesses in Sweden that need a new website, checks the site each one has now, and writes a ranked list
with a ready-made pitch line per business. No dependencies, Node 18+.

```bash
cd leads
node find.js                                  # default categories (dyk, segling, kajak, bat, surf), all of Sweden
node find.js --cat dyk,segling --area "Västra Götalands län"
node find.js --area "Göteborgs kommun"        # a län or kommun, exactly as it is named in OpenStreetMap
node find.js --add egna.csv                   # also check a list from elsewhere (PADI locator, hitta.se, a club list …)
node find.js --no-osm --add egna.csv          # only your own list
node find.js --limit 30                       # quick test run
PSI_KEY=… node find.js --psi                  # + Google PageSpeed mobile score (free API key, slower)
```

Output goes to `out/` (gitignored, since it holds contact details):

- `leads-<date>.html`: a sortable, filterable report. Open it in a browser.
- `leads-<date>.csv`: semicolon-separated with a BOM, so it opens directly in Swedish Excel. Its empty *Status /
  Kontaktad / Anteckning* columns are there so the file can serve as the outreach tracker.

## Where the leads come from

1. **OpenStreetMap** via the Overpass API: every place tagged as a dive shop, sailing club, kayak rental, boat
   rental, surf school, etc. (`categories.js`, easy to extend). Coverage is good for clubs and shops, patchier for
   one-person businesses, which is why there is `--add`.
2. **Your own CSV** (`--add`), with columns `namn;hemsida;ort;kategori`, optionally `telefon;e-post`. A header row is
   optional.

The Overpass answer is cached in `.cache/` for 24 h (`--fresh` bypasses it). The script tries overpass-api.de first,
then two mirrors. overpass-api.de refuses some cloud and VPN addresses, but works from a normal home connection.

## What the site check looks for

| Finding | Points |
|---|---|
| Only a Facebook/Instagram page | 40 |
| Placeholder ("under uppbyggnad", "kommer snart", parked domain) | 40 |
| No website / site unreachable / error status | 30–35 |
| `noindex`: the site tells Google to hide it | 30 |
| Not mobile-friendly (no viewport meta) | 30 |
| © year in the footer ≥ 6 years old (≥ 3 years: 12) | 25 |
| Slow (> 6 s: 18, > 3 s: 8), PageSpeed < 50 | 8–18, 15 |
| No https; outdated tech (ISO-8859-1, `<font>`, table layout, Flash, HTML 4); WordPress < 6 | 15; 15; 10 |
| No title / meta description; no online booking (activity businesses) | 4–6 |

A score of **45+ is hot**, 20–44 warm, below that cold. Chains (`exclude` in `categories.js`) are filtered out. A
site behind a bot wall (Cloudflare, SiteGround, one.com …) is not scored as broken but flagged "titta manuellt".

## Before you contact anyone

B2B cold email is allowed in Sweden, but a sole trader's (enskild firma) contact details are personal data under
GDPR. Contact people about their business only, say where you found them, make it easy to say no, and delete the
leads you do not pursue. Do not commit `out/`.
