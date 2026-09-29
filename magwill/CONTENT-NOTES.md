# Content notes – Magwill AB, Göteborg

Built 2026-09-29. Magwill AB trains companies in Microsoft Office (Excel, Word, PowerPoint, Access, MS Project)
on site, anywhere in Sweden, and does Office/VBA/Access consulting. Not a dive business: it lives in this repo
because this is where the freelance rebuilds are, and it has its **own design** – nothing is shared with the
dive sites. Nothing here has been confirmed with the client.

## What exists today (magwill.se)
19 hand-written HTML 4.01 pages in ISO-8859-1, table layout, fixed 790 px width, Verdana 11 px.
The whole site was scraped on 2026-09-29; every course description and syllabus in `src/data.js` comes from it.

Findings worth putting in the pitch:
- **The contact page sends customers to three course centres that no longer exist.** It lists "Kurscenter
  Göteborg / Stockholm City / Stockholm Kista – Aktiviteten AB" (Lindholmspiren 5, Kungsbron 21,
  Knarrarnäsgatan 7) with directions PDFs dated 2021-01. Aktiviteten Aktiebolag (556238-3892) went bankrupt
  on 2021-12-21, and none of those addresses appear on aktiviteten.se today. Say "de tre kurscentren på
  kontaktsidan verkar inte finnas kvar" – let them confirm.
- **Not usable on a phone.** No viewport meta, fixed 790 px layout, 11 px text. Most B2B first visits are on
  mobile.
- **Invisible to search beyond the basics.** No robots.txt, no sitemap, no structured data, no descriptions
  on the course pages, keyword-stuffed titles ("Access grundkurs, kurs, utbildning, Magwill").
- **Copy-paste bugs.** The Data grund page is titled "Illustrator grundkurs". On the Konsulttjänster page
  the "Excel PowerPivot" link goes to the Data grund page. The menu says "Konsultjänster".
- **Stale.** HTML files were last modified 2023-03, "Om oss" 2024-07, images 2016–2021. "Vi har utbildat i
  Microsoft Office i 20 år" has probably been on the site for years; the number may now be higher.
- **No way to act.** The only call to action is "Gör en intresseanmälan: Tel / Mail" in a sidebar.
- The meta description says "utbildning i Göteborg", while the body says they work all over Sweden.

## Company facts (public registers)
| | |
|---|---|
| Name | Magwill AB |
| Org.nr | 559166-8453 (registered 2018-07, active, F-skatt and moms) |
| Address | Kvilletorget 19, 417 03 Göteborg (also on their contact page) |
| SNI | 85594 Personalutbildning |
| Size | One employee per allabolag.se. The site speaks of "våra lärare" – ask how many trainers they use |

Sources: [allabolag.se](https://www.allabolag.se/foretag/magwill-ab/g%C3%B6teborg/skolor-och-utbildning/2KH4UZPI63IKI),
[bolagsfakta.se on Aktiviteten Aktiebolag](https://www.bolagsfakta.se/5562383892-Aktiviteten_Aktiebolag),
[aktiviteten.se](https://www.aktiviteten.se/).

## Theirs vs. written by me
**Their own words** (lightly copy-edited: typos fixed, "ifrån" → "från", "Ms Project" → "MS Project"):
- All 13 course descriptions and all 13 "Kursinnehåll" lists, course lengths, "kl 9–16".
- The claims: 20 years, on site at your company, all of Sweden, "nöjdgaranti", exercises and handouts
  included, bring your own material, individual training, evaluation, follow-up day, needs analysis,
  documentation, trainers who work as consultants and go through internal training.
- The consulting list and the "Arbeta med oss" list, verbatim.
- Both quotes: "Vi lyssnar hellre på dig…" and "Vi gillar människor…" (omoss.html).

**Written by me**, in their voice and based only on the above:
- The hero headline and lead, the one-line program pitches, the four "promises", the four-step
  "Så går det till", the "Vilken Excelkurs passar dig?" routing and all FAQ answers.
- The prerequisite line on each course. Where their text states it, I used it (Excel intensiv, Excel
  fortsättning, Excel för ekonomer, PowerPivot, Data grund). For the rest it is my inference from the
  grund/fortsättning pairing. **Confirm.**
- "Gå vidare" course suggestions.
- The FAQ answer on price ("beror på utbildning, antal deltagare och anpassning") is an inference – they
  publish no prices.
- The spreadsheet in the hero, including the joke formula `=OM(Övning; "Lärt på riktigt"; "Övning")`.

## Ask the client
| Item | Why |
|---|---|
| **Prices**, or at least "från"-prices per course day | none are public; every page says "intresseanmälan" instead |
| **Are the Aktiviteten course centres gone?** Do they offer any venue at all, or only on-site? | the new site says on-site only and drops the three centres |
| **Terms of the nöjdgaranti** | the old site states it without terms. It is repeated here unchanged |
| **Which Office versions / Microsoft 365?** | a common question from buyers, unanswered today |
| **Trainers** – how many, names, photos | "våra lärare" is all we know |
| **Customers / references** | nothing public. A logo row or two quotes would do more than any copy |
| **Is "20 år" still right?** | see above |
| **Remote / Teams training?** | not mentioned anywhere. If they do it, it is a big selling point |
| **Their logo as a vector file** | the logo here is redrawn in SVG from their 154×58 GIF |
| **Real photos from a course day** | none used. Their two photos (`dator.jpg`, `lila.jpg`, 157 px) are old stock shots |

## What the new site does
- Swedish only, 21 pages: start, utbildningar (hub), 13 course pages, konsulttjänster, om oss, jobba med oss,
  vanliga frågor, kontakt, intresseanmälan, plus 404.
- Mega menu with all courses by program. Mobile menu with the same tree.
- Every course page has the full syllabus, a sticky "Kursinformation" box and a button that opens the
  intresseanmälan with that course preselected (`?kurs=<slug>`). The form validates name and e-mail and says
  plainly that it is a demo and sends nothing. Wire it to Formspree / Netlify Forms / a mail endpoint.
- JSON-LD: EducationalOrganization, Course (with prerequisites and workload) on each course page, FAQPage,
  BreadcrumbList. Sitemap, robots.txt.
- `_redirects` sends every old URL (`excelgr.html`, `utb.html`, …) to its new page with a 301, so existing
  Google rankings and bookmarks survive. The three directions PDFs go to /kontakt/.
- `npm run check`: internal links, one h1 per page, title and description length, duplicate ids, and that
  every redirect target exists.

## Design
Own look, not shared with the dive sites. The burgundy is their logo colour (#993333, also their old heading
colour). Warm paper background, near-black ink. Motif: the spreadsheet – grid-paper backgrounds, a
"Kursplan.xlsx" window in the hero, cell references (A1, B1…) as section labels, and `#REFERENS!` on the
404 page. Program tiles use letters in the spirit of the Office icons, in our own colours; no Microsoft logos
are used. Fraunces for headings, Inter for text, JetBrains Mono for figures.

## Demo
`BASE=/dive-sites/magwill DEMO=1 npm run build` → noindex build for
https://rasmusekbom.github.io/dive-sites/magwill/ (picked up by `deploy/publish.sh` automatically).
