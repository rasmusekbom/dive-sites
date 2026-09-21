# Content notes – Maximum Freediving Siargao

Built from scratch (the school has no website – only Instagram, Facebook, a Linktree and third-party listings), fetched 2026-09-19.
Sources: `src/original/rate-cards/` (their 2026 price graphics + older cards), `src/original/instagram-posts.json` (313 post captions), `src/original/images.json` (photo → Instagram post, credit).

## What exists today – and what was missing
- No website. `maximumfreediving.ph` is registered (resolves to 45.79.222.138) but serves nothing – check whether it is theirs. `maximumfreedivingsiargao.com`, `maximumfreediving.com` and `siargaofreediving.com` had no DNS on 2026-09-19. The build uses `https://www.maximumfreedivingsiargao.com` as a placeholder canonical.
- Prices only exist as Instagram carousel images ("2026 Rates!" highlight). Nothing is searchable; no booking form; no dive-site or FAQ content anywhere.
- The siargaolocal.com listing (4.8/155) is unclaimed and shows a placeholder phone number (+63 917 456 7890). The Facebook page has the real one.
- Two Facebook pages (Siargao + the parent "Maximum Freediving and Hostel") and two Instagram accounts – the parent accounts still link to Batangas prices.

## What the new site does
- 6 languages (EN root, KO, JA, ZH, DE, FR), 21 pages each = 126 pages. EN written carefully; the others are first-pass – have native speakers proofread.
- **Courses** hub + 6 pages (Intro, Wave 1, Wave 2, AIDA 1–3, Line training, Private session); **Fun dives** hub + 3 pages; **Underwater photoshoot**; **Dive sites** (7); **Prices** (everything on one page + gear rental + rooms); **Stay**; **About** (team); **FAQ** (31 Q&As, also as FAQPage JSON-LD); **Contact**; **Book** (one form, prefilled from every "Book" button); **Terms** (draft); 404.
- "Which session is for you?" recommender (2 questions → product), currency switcher (PHP base, 13 currencies, rates refreshed at build), WhatsApp/Messenger everywhere.
- JSON-LD: LocalBusiness, Course/Product per session, FAQPage, BreadcrumbList. Sitemap with hreflang, robots, `_redirects` for guessed URLs.
- Photos: 48 from their Instagram (full resolution), responsive webp. Logo recreated as SVG from the Instagram avatar.

## Ask the client (facts taken from third parties or assumed)
| Item | Used | Source / note |
|---|---|---|
| Prices, inclusions, minimum group sizes | 2026 rate cards | Instagram April 2026 – the only source; AIDA card is from the "newest course" post |
| Course durations | Intro 1 morning; Wave 1 3 days; Wave 2 3–4; AIDA 1/2/3 = 1/3/4 days | assumed from agency standards – confirm |
| Certified depths (20 m / 30 m), min. ages (10 / 16), 200 m swim | agency standards | confirm what the school applies |
| Intro itinerary 08:00–11:30 | 2025 intro card | 2026 card has no times – confirm |
| Opening hours 06:00–15:00 | siargaolocal.com | Facebook says "always open" |
| HQ position, "near Ohana Resort" | Instagram accommodation post; siargaolocal pin 9.7895, 126.1614 | map embed searches the business name |
| 4.8 rating / 155 reviews | siargaolocal.com aggregate (probably Google) | Facebook: 98 % recommend / 37 reviews. Confirm and claim Google Business Profile |
| Dive-site depths, Blue Cathedral facts, season/visibility | scuba dive guides (philippinedives.com, maridenresort.com) | the school's own sites/depths may differ |
| Daku Cave depth 10–18 m, training line 30+ m | assumed | |
| Stay: unit ₱2,750 (Feb 2025); Vista Mar ₱2,500, Monte Carlo ₱1,750 (Oct 2024) | Instagram | older villa prices – confirm which are still offered |
| Gear rental prices | Instagram Oct 2024 | |
| Team: Nate Lopez (founder), Ara Neyra (co-founder), Coach Brenda, JK Guinoo | Instagram event posters and posts | no headshots used – initials only. Add photos + the Wave 2 coaches' names |
| "First freediving school in Siargao", parent school in Anilao since 2020, "Love Siargao" (VIU) collaboration | Instagram bio / Facebook post / Tripadvisor hostel listing | |
| Founded 2023 (Siargao) | first posts on the Siargao account | |
| Terms: deposit, 48 h cancellation, weather policy, photo consent | assumed | Terms page is marked as a draft |
| Payment: GCash / bank transfer / cash | assumed (typical for PH) | |
| Surfer rate ₱2,120 / local promos | not used (2024 promos) | mention on Prices page as "ask about promos" |
| Mermaid courses (Pacific Mermaid Academy) | mentioned on About only | Linktree has a Canva price sheet – add a page if they want |
| Student quotes | Instagram captions, anonymised ("Student") + 1 Facebook review | ask permission to name people; add Google reviews |
| Photo rights | all from @siargao.maximumfreediving, several are reposts of students'/photographers' content | confirm they may be used on the website |

## Deploy
Static; `_redirects`/`_headers` are in Netlify/Cloudflare Pages format. Forms post to Netlify Forms when hosted there, otherwise open the visitor's mail app with the request prefilled. Demo build: `BASE=/dive-sites/maximum DEMO=1 npm run build`.
