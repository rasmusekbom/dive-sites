# Content notes – Seastar Diving, Stockholm

Built 2026-09-22. The centre effectively has **no website**, so everything here is assembled from third-party
sources and PADI course standards. Nothing has been confirmed with the client.

## What exists today
`seastardiving.se` is a single WordPress page (theme `twentyseventeen`) with 378 characters of text:

> "Hej, och välkommen till dykningens fantastiska värld! Vi håller på att uppdatera sidorna. Vi på Seastar
> Diving kan utbilda dig i allt när det gäller dykning. PADIs grundkurser / PADIs fortsättningskurser /
> PADIs Tec kurser / PADIs Instruktörskurser. Kontakta oss på info@seastardiving.se"

Findings worth putting in the pitch:
- The images behind that page were uploaded in **December 2025** (`/wp-content/uploads/2025/12/`), so the
  "we are updating the pages" notice has been up for roughly nine months.
- The page carries `<meta name='robots' content='noindex, nofollow'>` — WordPress's "Discourage search
  engines" box is ticked. **They are invisible on Google on purpose, by accident.**
- `window._wca` is present, i.e. WooCommerce is installed. There is a shop behind the placeholder that
  nobody can reach.
- The WP REST API (`/wp-json/wp/v2/pages`) returns 403, so the hidden content could not be read.
- No prices, no course dates, no booking, no photos, no address on the live page.

## Sources used
| Source | What it gave |
|---|---|
| [PADI Dive Center listing](https://www.padi.com/dive-center/sweden/seastar-diving/) | Address, phone, email, opening hours, languages, 10 instructors, activities, services, rental list, service/repair list, gas list, facilities, payment methods, their own "Hos oss blir du en stjärna i vattnet" copy and vision statement, and the 4 photos |
| Instagram [@seastardivingstockholm](https://www.instagram.com/seastardivingstockholm/) | Bio ("Dykskolan med allt extra. Från nybörjare till instruktör."), 440 followers |
| PADI course standards | Course structure, prerequisites, minimum ages, depth limits — these are identical worldwide and are safe to state |

## Deliberate decision: no prices anywhere
Their prices are not public and were not invented. Every course page says **"Pris på förfrågan"** with a
phone number and an "Fråga om pris" button that pre-fills the booking form with the course name.
Once the client supplies a price list, set `price` in `src/data.js` and the course cards/aside can show it.

## Ask the client
| Item | Status |
|---|---|
| **Prices** for every course, gas fill, rental item and service job | missing entirely — the biggest gap |
| **Course dates / schedule** | missing; the site currently says "ring så får du aktuella datum" |
| **Company name and org.nr** for the footer | no company found in allabolag under "Seastar Diving" — `site.legalName` is a placeholder |
| **Full-resolution photos** | the 4 photos in `src/img/` are 480 px wide (PADI's thumbnails are the only public copies). The hero is capped at 460 px so nothing is upscaled, but real photos would change the whole page. Ask for wreck shots, classroom, the boat and the workshop |
| **The dive boat** | PADI lists "Dive boat" under facilities. Name, size, capacity and where it moors are all unknown — the Utfärder page is deliberately vague |
| **Dive club** | listed by PADI as a service. Membership, cost and what members get are unknown |
| **Dive travel** | listed by PADI. Destinations and whether they are the organiser or an agent are unknown |
| **Exact map pin** | `site.geo` is an approximation of Skrubba (59.2531, 18.1571). Confirm, and claim the Google Business Profile — there is no public review aggregate, so `site.rating` is null |
| **Team** | 10 instructors per PADI, but no names or photos are public. The About page says "tio PADI-instruktörer" without naming anyone |
| **Which tec courses they actually run** | PADI lists "PADI TecRec" and "Rebreather/CCR" generically, plus trimix and sorb on the gas list. The five listed in `src/data.js` (`tec`) are the plausible set — confirm, and confirm which CCR units they teach on |
| **Adaptive Diving / Conservation / EFR** | all listed by PADI but not given pages here. Add if they want |
| **Opening hours over the winter** | the PADI hours (Mon–Fri 10–18, Sat 11–15) may be summer hours |
| **Danish and Norwegian** | PADI says staff speak both. Mentioned on the About page; not built as separate locales |

## Written by me, not by them
The client should read this before the site goes anywhere near production. Roughly:

- **Their own words** (from the PADI listing / Instagram bio): the tagline "Hos oss blir du en stjärna i
  vattnet, en SeaStar helt enkelt", the vision sentence, "Vi utbildar inom såväl sportdykning som teknisk
  dykning", and the shorty/torrdräkt line on the About page. Plus every hard fact: address, phone, email,
  hours, 10 instructors, languages, the rental/service/gas/facility/payment lists, and the 4 photos.
- **PADI course standards** (identical worldwide, safe to state): prerequisites, minimum ages, depth limits,
  course structure, what you learn, what is included.
- **Everything else is copy I wrote in their voice.** The hero headline, all section text, the "Varför
  Seastar" points, the FAQ answers, and the Utfärder/Klubb/Resor page bodies. It is written to be
  defensible, but it is a proposal for how they could sound — not a quote.

Specific inferences to confirm before publishing:
| Claim on the site | What it is actually based on |
|---|---|
| "Vi har egen dykbåt och kör utfärder i Stockholms skärgård och Östersjön under säsong" | PADI lists "Dive boat" as a facility. The archipelago trips are an inference |
| The dive club and dive travel sections | PADI lists "Dive club" and "Travel" as services. All the wording around them is mine |
| "Kurserna går året runt" | inference |
| "Alla kurser kan gå på engelska" | PADI lists English, Danish, Norwegian and Swedish. That every course runs in English is an inference |
| "Vi fyller ... under butikens öppettider" and the FAQ answers about filling for non-members and servicing kit bought elsewhere | normal practice for a dive centre, but not stated anywhere by them |
| The five TecRec courses (Tec 40/45/50/Trimix/CCR) | PADI lists "PADI TecRec" and "Rebreather/CCR" generically |
| Baltic wooden wrecks / shipworm passage on the Utfärder page | general fact about the Baltic, not about them |

**Corrected 2026-09-22:** the home page counter originally read "365 dagar om året med gas", which I had
invented and which contradicts their own opening hours (closed Sundays). It now reads "5 gaser vi blandar",
which is the count from PADI's own service list.

## What the new site does
- **Swedish at the root, English under `/en/`**, 19 pages each = 38 pages plus a 404.
- Courses hub grouped by Börja dyka / Fortsätt / Bli proffs / Specialkurser, with 8 course pages
  (Prova på, Open Water, Advanced, Rescue, Divemaster, IDC, Torrdräkt, Nitrox).
- Teknisk dykning, Utfärder (+ klubb + resor), Utrustning, Service, Gas & luft, Om oss, Frågor, Kontakt, Boka.
- Booking form pre-fills from any "Fråga om pris" button (`?type=&which=`), and states plainly that it is a
  demo that sends nothing.
- Opening-hours table highlights today; the top bar shows open/closed from the real hours.
- JSON-LD: SportsActivityLocation (with real opening hours and geo), Course per course page, FAQPage,
  BreadcrumbList. Sitemap with both locales, robots.txt, `_redirects` for guessed legacy URLs.
- Brand mark drawn as a star over a wave — there is no public logo file. Replace with theirs.

## Design
Palette taken from their own photos: Baltic green-teal, near-black depth, and the amber of a dive torch and
yellow fins as the single accent colour. Sora for headings, Inter for body.

## Demo
`BASE=/dive-sites/seastar DEMO=1 npm run build` → noindex build for
https://rasmusekbom.github.io/dive-sites/seastar/
