# Content notes – Thai Ocean Academy Pattaya

All text was transcribed from pattaya-dive.com (39 pages, 16 blog posts, 4 landing pages, sitemap of 2026-09-17).
The raw extraction is kept in `src/original/*.md` (one file per original URL) for comparison; `src/original/images.json`
maps every original image URL to its local file in `src/img/`.

## What changed on purpose

- **Spelling / casing only** – e.g. "internshop" → "Internship", "SCUBA INSTRUCtOR CROSSOVEr" → "Scuba Instructor Crossover",
  "competenly" → "competently", "flawlessy" → "flawlessly", "anemous" → "anemones", "suprised" → "surprised",
  "condiction" → "conditioning", "accomodation" → "accommodation" (in copy, not in the price list), "Divers Togethr" kept
  as image alt only. Wording, jokes and prices were **not** changed.
- **Hidden text is now visible** – the price list was inside collapsed accordions; course "Overview / Logistics / Upgrades"
  were collapsed toggles. They are now plain sections (better for Google and for people).
- **Counters** – the original counters showed "0 %" until scrolled; the values are 99 %, 30+ dive sites, 1000+ customers/year,
  3 dive stores.
- **Duplicate pages merged** – `/professional-training/` + `/scuba-dive-courses-pattaya/professional-training/`,
  `/recreational-courses/` + `/…/recreational-scuba-dive-courses-pattaya-thailand/`, the two marine-education pages and
  the two blog landing pages were identical or near-identical. Every old URL 301-redirects to the merged page (`_redirects`).
- **Empty landing page** `/day-trips/` (only "Leave a Reply") is replaced by the real day-trips page.
- **Placeholder headings** ("Add Your Heading Text Here") on two blog posts removed.
- **Blog post links** that pointed at the Bangkok equipment site (`thaioceanacademy.com/trydive` etc.) now point at the
  matching pages on this site. External product links (Aneron Niscap, masks) are kept.
- **Tags / categories** – the three categories are kept as listing pages; 13 posts were "Uncategorized" on the original and
  simply have no category here. Tag pages (one post each) were dropped; tags are shown on the post.
- **Google Maps** – the original embedded maps with an exposed API key; the new site uses key-less embeds.
- **Booking form** – same fields as the WPForms form. On Netlify it posts to Netlify Forms; without a backend it opens
  the visitor's mail app with the request pre-filled. The typo "What to to" became "What to do".
- **Photos** – all 87 photos used on the original site plus 23 unused photos from their media library (barracuda, batfish,
  Koh Sak aerial, boats, tech divers…) for heroes. Team photos renamed `team-*.jpg`.

## Ask the client (inconsistencies in the original)

| Item | Where | Values |
|---|---|---|
| Master Rescue price | course page / overview card / price list | 13,500 (3 days) / 18,500 (4 days, "Rescue Diver and First Aid") / 15,500 (4 days) |
| Advanced 35 price | course page / price list | 16,500 / 14,900 |
| Instructor Specialty price | course page / overview card | 6,500 per specialty / "THB 12500-20500" |
| Sidemount + Open Water saving | course page | "Save 6,00 THB" (shown as 6,000) |
| Divemaster | course page | 85,000 in the box, but options list 45,000 / 85,000 / 95,000 |
| Deco 40 / Deco 50 | overview cards | 25,000 / 45,000 – no course page; Nitrox+ is 15,500 and Decompression Diver 45,000 |
| Phone number | home & book page / contact page | +66 099 690 0456 / +66 082 470 7706 (contact page number not used) |
| Facebook link | contact page | profile.php?id=61555000274507 vs facebook.com/thaioceanacademypattaya (latter used) |
| Snorkelling | trip page / pricing | "at least 3 sites" vs "2 sites and a hot lunch" / "Snorkelling Ocean 2 sites" |
| Meeting time | course pages / divemaster page | 7:45am / 7:30am |
| "5 Reasons…" | blog | published twice (diveinpattaya, pattayadivecenter) – both kept |
| Blog dates | blog | many posts dated 2024-06-28/29 and 07-02 (bulk import) |
| Video | courses & marine pages | YouTube MLpWrANjFbI is linked, not embedded – confirm it is theirs |
| Logo | header | white PNG wordmark; a square crest exists (`toco-logo-square.jpg`) – SVG would be better |
| Reviews | home | "5.0 · 202 reviews" from the Elfsight widget on 2026-09-17 – needs a link to the Google listing |

## Still to do

- Translations (TH, RU, ZH, DE…) – the build is i18n-ready (`src/i18n/<lang>.js` deep-merges over English).
- Form backend on the production host (Netlify Forms works out of the box; Cloudflare Pages needs a function).
- Client-supplied: Google Business review link, boat charter details (menu item only on the original), Samaesan location.
