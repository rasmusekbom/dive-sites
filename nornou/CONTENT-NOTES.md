# Content notes – Nornou (N. Kai Bae Hut) Speedboat, Koh Chang

Rebuilt from nornouspeedboat.com (Wix, fetched 2026-09-18) plus public timetables/guides for the facts the original site does not state.
Raw transcription: `src/original/nornouspeedboat.com.md`; third-party facts with sources: `src/original/third-party-sources.md`; photos: `src/original/images.json`.

## What the original site has – and what was wrong with it
- Menus in Thai, half the content in Thai, `/en` renders the same Thai page; `hreflang="de-cn"`; JS error on load.
- `/service-page` is Wix's untouched Bookings placeholder ("Service Title", "1-234-567890", "example@email.com"). `/ข้อกำหนดและเงื่อนไข` (Terms) is Wix's template text about how to write terms.
- No transfer timetable or fares at all, although transfers are the core business. No charter prices. No pier/drop-off information (the main cause of the bad Tripadvisor reviews).
- Contact via gmail; LINE link is an image; no map.

## What the new site does
- 7 languages (EN root, TH, DE, FR, SV, RU, ZH), 19 pages each = 133 pages. TH/EN written carefully; DE/FR/SV/RU/ZH are first-pass – have a native speaker proofread.
- **Transfers**: hub page with route finder, full timetable, how-it-works, boarding places, children's fares, season; 6 route pages (one per island pair, both directions).
- **Snorkelling**: hub + 3 trip pages with the original's prices/times/inclusions, a day schedule, islands, gallery, FAQ, Tripadvisor quote.
- **Private charter**: 7 itineraries × 5 boat sizes price matrix + calculator (group size → smallest boat + per-person price).
- **Islands** guide (16 islands, own copy – not copied from guide sites), **Fleet**, **About**, **Contact**, **Book** (one form for transfer / trip / charter, prefilled from links), **Terms** (draft), 404.
- Currency switcher (client-side, rates baked in at build, auto-refreshed when older than 7 days). WhatsApp everywhere.
- Logo recreated as SVG from the watermark on their photos (no logo file exists). Photos: all 32 from their Wix media, full resolution, responsive webp.
- JSON-LD: LocalBusiness, TouristTrip per trip, Service per route, FAQPage, BreadcrumbList. Sitemap with hreflang, robots, `_redirects` for old Wix URLs.

## Ask the client (facts taken from third parties or assumed)
| Item | Used | Source / note |
|---|---|---|
| Transfer timetable & fares | 09:00 south / 11:00–12:30 north; 500–1,200 THB | kohchangferries.com + reseller kohchangboat.com – confirm every leg |
| Season | ~1 Nov – 30 Apr | sources disagree (kohchangboat: 15 Nov – 15 May) |
| Boarding piers | Kai Bae (own pier); Koh Wai/Koh Kood resort piers; Koh Mak Makathanee pier | kohchangferries / kohchangboat |
| Free hotel pick-up on Koh Chang for transfers | yes | kohchangferries – confirm |
| Children's fares | 4–6 half, ≤3 free on lap, stroller 200 | kohchangboat |
| Charter matrix (7 × 5) | iamkohchang.com price table ("bookable through Kai Bae Hut") | confirm prices and boat list (4/10/13/25/30 pax, HP) |
| Charter inclusions | taxi, gear, water, fruit, lunch on full days | iamkohchang |
| Park fee | 200 / 100 / Thai 40 THB | original site (200/40) + iamkohchang (child 100) |
| Snorkel trip schedules ("The day" timelines) | written from the stated hours | plausible, not from the client |
| Child age on trips | 4–10 | assumed – the original only gives a child price |
| Booking cut-off 18:00 day before; cancellation terms; deposits | assumed | Terms page is marked as a draft |
| Landline +66 39 557 128, owner "Sao" | iamkohchang | |
| LINE ID / add-friend link | missing | original only has an image link |
| Pier coordinates | Kai Bae approx. | map embed searches "Kai Bae Hut Speedboat Koh Chang" |
| Tripadvisor listing | unclaimed, 4.1/36 | claim it; reply to the 2019 drop-off complaints |
| "Largest speedboat company on the island", "since 1995", "up to 40 pax" (reseller) | used 1995 + largest; 30 pax max from the price table | |

## Deploy
Static; `_redirects`/`_headers` are in Netlify/Cloudflare Pages format. Forms post to Netlify Forms when hosted there, otherwise open the visitor's mail app with the request prefilled. Demo build: `BASE=/dive-sites/nornou DEMO=1 npm run build`.
