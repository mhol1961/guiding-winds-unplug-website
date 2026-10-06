# SEO, AEO, CRO and security audit: guidingwinds-unplug.com

**Date:** 2026-10-05
**Scope:** the live site https://guidingwinds-unplug.com, the preview host `guiding-winds-unplug-website.mhollandanalyst.workers.dev`, and the repo at commit `582065f`.
**Mode:** report only. No site files were changed, nothing was built or deployed, and no form was submitted. The only requests sent to `/api/*` were ones the server rejects before reaching GHL.
**Excluded, as agreed:**
- the Florida Seller of Travel number (already known);
- template-built or bulk pages (scaled-content rule). Nothing below suggests new location or route pages.

**Tags**
- `CODE`: a code fix Claude can do.
- `C/D`: needs input from Clint or Dodie.
- `MARK`: needs Mark in a dashboard (Google, GHL or Cloudflare).

**Severity:** Must, Should or Nice.

---

## 1. Re-check of the July 8, 2026 audit

| # | July 8 item | Status | Evidence |
|---|---|---|---|
| a | Canonical, og:url and sitemap pointed at the workers.dev preview | **Fixed, with a new side effect** | All three now use `https://guidingwinds-unplug.com`. But every one omits the trailing slash, and each such URL answers `307 → /<page>/`. See SEO-1. |
| b | Preview site not blocked from Google | **Partly fixed** | The preview's canonicals and sitemap now point to the real domain. The preview still answers 200, its `robots.txt` allows Googlebot, and there is no `X-Robots-Tag` or meta noindex. A canonical is only a hint. See SEO-5. |
| c | Missing schema | **Mostly fixed** | Present: Organization/TravelAgency and WebSite (home), Person ×2 (about), FAQPage (faq and every voyage, 36 questions all matching the visible text), TouristTrip with Offers, ContactPage, ItemList, Product, and BreadcrumbList. Gaps: the logo URL 404s (SEO-6), a self-rating on home (SEO-11), and an empty EventSeries (SEO-16). |
| d | Missing social share images | **Still open** | None of the 16 indexable pages has an `og:image` or `twitter:image`. Only the noindexed lp-1/2/3 do. `public/og/` is empty. See SEO-7. |
| e | Missing image alt text | **Fixed** | 0 `<img>` tags without `alt` across all 19 pages. Nit: gallery alt text is cut off at the first comma (SEO-15). |
| f | Over-long or weak titles and H1s | **Partly fixed** | Every page has exactly one H1 and no titles are duplicated. Seven titles are over 60 characters: aboard 82, home 80, bahamas 69, voyages 67, BVI 67, croatia 67, italy 63. The home H1 ("Where guests become crew…") and about H1 ("Our Story") don't say what the business is. See SEO-10 and SEO-12. |

---

## 2. SEO (technical and on-page)

| ID | Sev | Tag | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| SEO-1 | Must | CODE | Every sitemap URL, canonical and internal link points at a redirect | `curl -I /aboard` → `307 /aboard/`, and the same for all 19 sitemap URLs. `/inquire` is linked about 95 times. Cause: `trailingSlash:'never'` plus `build.format:'directory'` (`astro.config.mjs:53-55`). | Set `build.format: 'file'` so the no-slash URLs return 200 directly. |
| SEO-2 | Must | CODE | 18 voyage images are broken (404) | 17 gallery files in `src/content/voyages/*.md` are missing from `public/` (e.g. `/img/stock/voyages/bvi/gallery/bvi-anegada.jpg`, `italy-capri.jpg`). The BVI map `/carribean-sea-map-image.png` 404s live because `.gitignore` ignores `public/*.png`. | Add the missing files or remove those entries, and move the map into `public/img/`. |
| SEO-3 | Must | CODE | Very heavy main photos make pages slow | Voyage heroes: BVI 2.14 MB, Greece 1.53 MB, Italy 1.53 MB, Croatia 924 KB, Bahamas 618 KB. The about-page hero is a 2.99 MB PNG. The voyages hero is 492 KB and the home video poster is 960 KB. | Re-encode to WebP/AVIF under about 250 KB with responsive sizes (Astro `<Picture>`). |
| SEO-4 | Must | MARK | `http://` isn't redirected to `https://` | `http://guidingwinds-unplug.com/` → 200 with the full page. Same for `http://www.`. | Cloudflare: SSL/TLS → Edge Certificates → **Always Use HTTPS**. |
| SEO-5 | Must | MARK | The preview copy of the site can be indexed | The workers.dev host returns 200, `robots.txt` allows Googlebot, and there is no noindex. Its inquiry form also posts real leads into GHL. | Workers & Pages → guiding-winds-unplug-website → Settings → Domains & Routes → turn off **workers.dev** (and preview URLs). |
| SEO-6 | Must | CODE | The logo in the Organization schema is a 404 | `https://guidingwinds-unplug.com/og/logo.png` → 404 (`src/lib/schema/organization.ts:41`). | Point it at an existing logo file. |
| SEO-7 | Should | CODE | No share image on any indexable page | `SeoHead.astro:32-39` only emits one if a page passes it in. | Add a default 1200×630 image under 300 KB, and pass each voyage's hero image. |
| SEO-8 | Should | MARK | `www.` serves a duplicate site | `https://www.guidingwinds-unplug.com/` → 200, though its canonical points to the apex. | Cloudflare redirect rule: www → apex (301). |
| SEO-9 | Should | CODE | Noindexed pages are listed in the sitemap, and the thank-you page is blocked in robots | The sitemap lists `/lp-1`, `/lp-2`, `/lp-3` and `/inquire/thank-you`. `robots.txt.ts:39,47` disallows thank-you, so Google can't see its noindex. | Filter those pages out in `astro.config.mjs`, and drop the thank-you Disallow. |
| SEO-10 | Should | CODE | Seven titles are over 60 characters | See 1f. | Trim to 60 characters or fewer. |
| SEO-11 | Should | CODE | The home page rates the business itself (5.0 from 3 reviews) | `index.astro:40-45`. Google ignores ratings a business gives itself, and it repeats the BVI review count. | Remove it, and keep the rating on the BVI trip. |
| SEO-12 | Should | C/D | The home and about H1s don't say what the site is | "Where guests become crew…", "Our Story". | Approve H1s that name catamaran charters and Clint & Dodie. |
| SEO-13 | Should | CODE | Meta descriptions are too long or too short | Long: about 218, lp-3 164, italy 164, greece 163. Short: thank-you 51, calendar 80, terms 90. | Aim for 150–160 characters. |
| SEO-14 | Nice | CODE | 121 images have no width or height set | Risk of layout shift. | Add intrinsic dimensions. |
| SEO-15 | Nice | CODE | Gallery alt text is cut off at the first comma | Unquoted YAML (e.g. `british-virgin-islands.md:16-18` → `alt="Anegada"`). | Quote the alt values. |
| SEO-16 | Nice | CODE | The calendar's EventSeries schema is empty | `calendar.astro:57`: name and description only. | Remove it, or add the real 2027 weeks. |

Checked with no issue: the 404 page returns a real 404, `/index.html` redirects to `/`, no indexable page is orphaned, and lp-1/2/3 aren't duplicate-content risks because they're noindexed and nothing links to them.

---

## 3. AEO (how AI tools answer questions about Guiding Winds Unplug)

**Clean:**
- Only (772) 310-3777 and guidingwindsunplug@gmail.com appear anywhere live, including `/llms.txt` and schema. Clint's cell is not public.
- All 36 FAQPage schema questions match the visible text word for word.
- `robots.txt` allows every major AI crawler (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Applebot-Extended).
- The YouTube and Facebook links in the schema are correct.

**The core problem:** pages contradict each other, so an AI tool may quote the wrong one.

| ID | Sev | Tag | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| AEO-1 | Must | CODE | Trip length conflicts: "5 to 7 nights" vs "seven nights" | Voyage pages and the cards on /, /voyages and /calendar say "Sat → Sat · 5 to 7 nights" (`nightsLabel: '5 to 7'` in every `src/content/voyages/*.md:8`). The FAQs, lp-1 and the 8-day itineraries say 7 nights. | Remove `nightsLabel` so it falls back to `nights: 7` (confirm with C/D). |
| AEO-2 | Must | CODE | "Zero items billed" and "4 hours longest passage" are untrue | `Megatype.astro:57-65`. The FAQ says Wi-Fi is extra and transfers aren't included, and Italy lists an overnight passage to Stromboli. | Drop or reword both stats. |
| AEO-3 | Must | CODE + C/D | The "not included" lists disagree | /aboard: "Three things you cover yourself" (`aboard.astro:196`). lp-2: "The only things separate are flights and travel insurance" (`lp-2.astro:66-68`). The FAQ adds transfers, Wi-Fi and no alcohol aboard. CALL-CHANGES-2026-06-02 lists paid add-ons. | C/D confirm one list, then use it everywhere. |
| AEO-4 | Must | CODE | The Greece route conflicts | The intro and /llms.txt say "Mykonos at the start…" (`greece.md:10`). The meta description says "Kea, Sifnos, Folegandros, Santorini" (`greece.md:62`). The itinerary is Alimos → Kythnos → Serifos → Sifnos → Folegandros → Ios → Santorini. | Match both to the itinerary. |
| AEO-5 | Must | C/D | No deposit, payment schedule or cancellation terms | /faq and /terms only say "we talk through cancellation… on a call". | C/D supply the deposit %, the balance due date and the refund tiers; publish them on /faq and /terms. |
| AEO-6 | Should | C/D | No captain credentials | /about: "Years of working Florida Keys and Caribbean waters". | Add Clint's licence (e.g. USCG Master, tonnage) and his years; add `hasCredential` to the Person schema. |
| AEO-7 | Should | C/D | The boat and cabin count are never stated in text | "Catamarans between 40 and 60 feet" alongside "One boat". Cabins only appear in the /inquire dropdown. | Name the boat (make, model, length) and state "6 double cabins". |
| AEO-8 | Should | CODE | Region count conflicts | Home: "Five regions" (`index.astro:76`). /voyages: "Three regions. One boat." (`voyages/index.astro:234`). lp-3: "Three oceans". | Use "Five regions" everywhere. |
| AEO-9 | Should | CODE | Who cooks is unclear | Home: "the real secret ingredient is the crew — that's you" (`Feeling.astro:34-35`). lp-1: "aboard to unplug, not to crew" (`lp-1.astro:79`). | State that Dodie cooks all meals and helping is optional (confirm with C/D). |
| AEO-10 | Should | C/D | /experiences is an empty page | Heading "Two ways to shape a week aboard" with no content (`experiences.astro:2-5`). | Restore the two real experiences, or noindex the page and remove it from the nav. |
| AEO-11 | Should | CODE | `/llms.txt` has no contact details or key facts | No phone, no email, no "7 nights Sat–Sat", no exclusions. The About line is just "Years in the chain." (`llms.txt.ts:39`). | Add a Contact section and the facts. |
| AEO-12 | Should | CODE | The kayaks line conflicts on Mediterranean pages | The PricingCard hardcodes "Snorkel + paddleboards + kayaks" (`PricingCard.astro:49`), but the voyage inclusions say snorkel and paddleboards only. `llms.txt.ts:40` lists kayaks site-wide. | Build the card from each voyage's own inclusions. |
| AEO-13 | Should | CODE | The FAQ count is stale | "23 questions" (`faq.astro:165`, `VoyageFaq.astro:28`), but there are 25. | Compute the count from the list. |
| AEO-14 | Should | CODE | Booking steps and reply time are worded differently | The FAQ says "payment details by email", /inquire and /terms say "private booking link". `inquire.astro:122` says "usually within 4h"; everywhere else says 24 hours. | Pick one wording for each. |
| AEO-15 | Nice | CODE | About page details | The meta description says "from the British Virgin Islands" (the business is in Stuart, FL; `about.astro:9`). The Person schema has no image, no sameAs, and no `worksFor` → #org. | Correct the location and add the links. |
| AEO-16 | Nice | CODE | The insurance figure is unclear | "$200-400 for a $14k-$30k booking" next to a per-guest price. | Say what the range applies to. |

**Question coverage**

| Question an AI is asked | Answered? | Where |
|---|---|---|
| What is it / who runs it | Yes | /, /about, schema |
| Where and when | Partly | /calendar is clear; trip length and the Greece route conflict |
| Cost per week / what's included | Partly | The price is clear; the inclusion and exclusion lists conflict |
| Guests / cabins | Partly | "Up to 12"; cabins only in a dropdown |
| Fully all-inclusive? | Partly | Contradicted by "Zero items billed" |
| How to book | Yes | /faq, /inquire, /terms |
| Sailing experience needed? | Yes | /faq |
| Families / couples / wellness | Partly | Kids covered; couples and wellness implied |
| Deposit / cancellation | No | (AEO-5) |
| Location / contact | Yes | Missing from llms.txt (AEO-11) |
| Licensed / bonded | Partly | Bond shown; no captain licence |

---

## 4. CRO (ad landing pages, /inquire, book-a-call flow)

**How the three ad pages differ:**
- **lp-1:** the emotional "off the grid" angle.
- **lp-2:** the offer angle, "One price. Everything aboard.", with an owners' photo, inclusions and three testimonials.
- **lp-3:** the destination angle, "Three oceans", with region cards.

They are real variants. They share the same questionnaire, phone, thank-you page and no-price approach; only the form heading and the `source` tag change.

| ID | Sev | Tag | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| CRO-1 | Must | MARK + CODE | No tracking runs anywhere in the ad funnel | No `fbq`, Plausible or GA appears in the live HTML of lp-1/2/3, /inquire, thank-you or /calendar. `PUBLIC_FB_PIXEL_ID` is unset, so `MetaPixel.astro` renders nothing and the Lead event (`thank-you.astro:231`) never fires. No Plausible script exists in `src/`. | Mark sets the Pixel ID as a Workers Builds variable; Claude adds the analytics script. Do this before any ad spend. |
| CRO-2 | Must | C/D + CODE | No price on any ad page, and the price on the site doesn't match the brief | lp-2's headline is "One price. Everything aboard." with no price shown. The occupancy note mentions "the full cabin price". The site says $3,350 (BVI/Bahamas) and $3,650 (Med) (`src/content/voyages/*.md:9`); the project brief says $3,550–$3,850. | C/D confirm the real prices; add "From $X per guest, per week, all-inclusive" near each hero CTA. |
| CRO-3 | Must | CODE + C/D | "Book a quick call" never books a call | The mobile sticky button jumps to the form (`LpLayout.astro:452-453`). /inquire's button is a `tel:` link, useless on desktop (`inquire.astro:59-63`). Thank-you only says "we will be in touch". | Offer an intro-call slot on the thank-you page, using the unused GHL Calendars wrapper (`src/lib/ghl/calendars.ts`). This books a call, not a trip. C/D pick the call length and hours. |
| CRO-4 | Must | CODE | The inquiry form has no bot check; bots can write straight into GHL | No Turnstile in `api/inquire.ts`. The rate limit is per Worker instance only. Cross-origin JSON POSTs reach the handler. | Reuse `verifyTurnstile` and add the widget to the inquiry forms. |
| CRO-5 | Should | CODE | Choosing a voyage then "Book a call" loses the choice | /inquire is prerendered, so `?voyage=` is read at build time (`inquire.astro:12`). The live `/inquire/?voyage=bahamas` shows no region. | Read the parameter in the browser, or render /inquire on demand. |
| CRO-6 | Should | C/D | lp-3's scarcity copy isn't supported by the data | "the calendar fills early", "When a week is booked, it's gone" (`lp-3.astro:285,331`), while every week shows "6 cabins left". It also breaks the brand voice. | Cut the urgency lines, and show "Open" instead of "6 cabins left". |
| CRO-7 | Should | C/D | The phone line may not reach Clint or Dodie | `business.ts:12` calls (772) 310-3777 "the AI voice line". The ad pages promise "no call center… Dodie or Clint replies". | Confirm who answers, then fix either the routing or the copy. |
| CRO-8 | Should | CODE | Ad-page images are heavy | lp-3 pulled about 5 MB on mobile. lp-1's hero is 712 KB with no srcset, its avatar is 368 KB shown at 56px, and the logo PNG is 186 KB. lp-1's headline painted in 4.8–12 s on mobile. | Same fix as SEO-3. |
| CRO-9 | Should | CODE | lp-2 hides its CTA on mobile and wastes its best trust photo | At 375px the CTA is below the fold. The owners' selfie has alt text "The catamaran's foredeck and bow…" (`lp-2.astro:55`). No ad page introduces the hosts. The bond is only in the footer. | Caption the photo "Clint & Dodie, your hosts", lift the CTA, and put the bond line near the form. |
| CRO-10 | Should | CODE | Call taps and ad source aren't captured | `tel:` taps fire no event. There's no `utm`/`fbclid` handling, so GHL only sees "lp-N". | Fire a Contact event on tel taps, and pass UTMs as hidden fields. |
| CRO-11 | Should | CODE | "See / Check available weeks" opens a form, not the weeks | Seven 2027 weeks exist but none show on the ad pages. | List the weeks above the form, or rename the CTA to "Tell us your week". |
| CRO-12 | Should | CODE | The thank-you page sends people back to the form | The mobile sticky bar goes to /inquire (`MobileCta.astro:21`), the chat bubble covers it, and there's no phone number in the page body. | Hide the floating CTA there, and add "Prefer to talk sooner? (772) 310-3777". |
| CRO-13 | Should | C/D | The "5.0 · every guest" rating has no source | Backed by 3 reviews in `src/content/reviews`. | Name the source and count. |
| CRO-14 | Nice | CODE | Honeypot false positives fail silently, and the honeypot never actually runs | `website: z.string().max(0)` fails during parsing (`inquire.ts:19`, `newsletter.ts:12`), so the quiet branch is unreachable, bots get a 422 naming the field, and a password manager filling the field shows "Something went wrong" with no fallback. | Make the field optional, check it after parsing, show the mailto fallback, and stop logging the email in that branch. |
| CRO-15 | Nice | CODE | Form polish | After an error the button relabels to "Send Inquiry". A 422 doesn't name the bad field. Party-size options differ between the ad pages and /inquire. The week dropdown is sorted by slug, not date. "Zoom call" appears next to a phone link. | Tidy each. |
| CRO-16 | Nice | MARK | Ad URLs without a trailing slash take an extra hop | `/lp-2` → 307 → `/lp-2/` (UTMs are kept). | Use the trailing slash in ad URLs, or rely on the SEO-1 fix. |

---

## 5. Security (short check)

**Fine:**
- **Headers:** HSTS (2y, preload), CSP with `frame-ancestors 'none'`, `form-action 'self'` and `object-src 'none'`, plus XFO, nosniff, Referrer-Policy, Permissions-Policy, COOP and CORP on HTML and assets.
- **Origin check:** blocks cross-site form posts.
- **Input validation:** zod length limits on every field.
- **Error messages:** no internal details leak, and there is no open redirect.
- **Exposed files and secrets:** no secrets in live HTML or JS. `.env`, `.git`, `.dev.vars`, `package.json`, source maps and `/_journal` all 404.
- **Third-party scripts:** only Turnstile, the GHL chat widget and youtube-nocookie.
- **Newsletter:** protected by Turnstile with a server-side hostname check.
- **Clint's cell:** not published anywhere.

| ID | Sev | Tag | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| SEC-1 | Must | MARK | Plain HTTP is served, not redirected | = SEO-4. On a first visit, form data could be sent over HTTP. | Always Use HTTPS, then consider HSTS preload. |
| SEC-2 | Must | CODE | The inquiry form has no bot check | = CRO-4. | Turnstile on /api/inquire. |
| SEC-3 | Should | CODE | The website framework has known security advisories | `npm audit --omit=dev`: astro ≤7.2.7 is critical (spread-attribute XSS, transition-directive XSS, Host-header SSRF in the error-page fetch). The other highs are build or dev tooling. | Upgrade `astro` and test. |
| SEC-4 | Should | CODE | The honeypot is broken | = CRO-14. | |
| SEC-5 | Nice | CODE | Worker-rendered responses carry no security headers | `/api/*` and `/api/latest-videos` only get `cache-control`. | Add nosniff and CSP in middleware. |
| SEC-6 | Nice | CODE | The CSP allows unused origins | plausible.io, connect.facebook.net and cloudflareinsights are allowed but not loaded. `img-src`/`media-src https:` are wildcards. | Trim the list until each origin is used (revisit with CRO-1). |
| SEC-7 | Nice | MARK | The preview host is public and posts real leads | = SEO-5. | Turn off workers.dev. |

---

## 6. Inputs needed from Clint and Dodie (one message)

1. **Prices:** per guest per week, BVI/Bahamas and Mediterranean. The site says $3,350 and $3,650; the brief says $3,550–$3,850.
2. **Trip length:** always 7 nights, Saturday to Saturday? Or are 5-night weeks really offered?
3. **The one list of what's NOT included:** flights, transfers, insurance, off-boat dining, Wi-Fi, alcohol? And which add-ons are paid?
4. **Deposit:** the deposit %, the date the balance is due, and the cancellation and refund tiers.
5. **Captain:** Clint's licence (type and tonnage) and years of experience.
6. **Boat:** make, model, length and cabin count.
7. **Phone:** who answers (772) 310-3777, a person or the AI line?
8. **Intro call:** length and available hours, for the book-a-call slot.
9. **Content:** the two real experiences for /experiences, or should the page be hidden?
10. **Ratings:** the source and count behind "5.0 · every guest".
11. **Headings:** approval of new home and about H1s.

## 7. Dashboard items for Mark

1. **Always Use HTTPS (Cloudflare, about 1 minute):** SSL/TLS → Edge Certificates → Always Use HTTPS (SEO-4/SEC-1).
2. **Turn off workers.dev (Cloudflare):** Worker → Settings → Domains & Routes → turn off workers.dev and preview URLs (SEO-5/SEC-7).
3. **www redirect (Cloudflare):** Rules → Redirect Rules → www → apex, 301, keeping the path and query (SEO-8).
4. **Meta Pixel ID (Cloudflare):** Worker → Settings → Build → Variables → add `PUBLIC_FB_PIXEL_ID`; it takes effect on the next deploy (CRO-1).
5. **Ad URLs:** use the trailing slash in ad links until SEO-1 ships (CRO-16).
6. **Google Search Console:** after SEO-1 and SEO-9 ship, resubmit the sitemap.
