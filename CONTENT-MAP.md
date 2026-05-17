# CONTENT-MAP — Guiding Winds Unplug

Page-by-page content plan: purpose, target audience, copy outline, primary/secondary CTAs, SEO targets, and AI-search visibility notes.

**Companion to:** `PRD.md` (scope), `DESIGN.md` (voice principles), `TECH-SPEC.md` (schema markup).
**Last updated:** 2026-05-17

---

## Voice principles (reminder)

- Short, declarative, slightly poetic.
- Reframe formula for headlines: "You don't need X. You need Y."
- Never use "luxurious," "ultimate," "perfect," "transformative," "amazing," exclamation marks, or marketing-urgency tropes.
- Earn descriptors with specifics. ("Glass water at sunrise" beats "Stunning ocean views.")
- CTAs are functional but warm: "See Available Weeks," "Hold a Cabin," "Watch the Film," "Read the Voyage."

---

## `/` — Home

**Purpose:** Convert curious traffic into qualified inquiries. Establish the brand feeling (wellness, slow, off-grid) within ten seconds.

**Audience:** Persona A (recovering executive) primary, all personas secondary.

**Sections (in order):**

1. **Hero** — cycling video reel (4 scenes: BVI water, Bahamas sunrise, catamaran at anchor, sunset on deck). Centered overlay: eyebrow ("The Off-Grid Catamaran Experts"), headline ("Every voyage starts with a *feeling*."), sub-line, two CTAs (Primary: "See Available Weeks" → `/calendar`; Ghost: "Watch the Film" → opens about-page video). Trust strip across the bottom: 5 credentials.
2. **Sticky newsletter strip** — dismissible. "Sign up for our newsletter" + email input.
3. **Feeling** — narrow centered cream section. Eyebrow + 32-48px headline ("The world is loud. The water is not.") + 3 short paragraphs + punch line. CTA: "See the Voyages."
4. **Testimonial row** — 4 short inline quotes (named, location, voyage) on cream background. Below: 5-star line "100% Five-Star Reviews · 14 voyages · 2025 sailing year."
5. **Start Your Voyage (Picker)** — 5 pickcards (BVI, Bahamas, Italy, Greece, Croatia). Tabs above: By Region / By Season / By Vibe / Available Soon. (Tabs are deferred — show "By Region" only for v1; mark the others as "Coming Soon" placeholders.) CTA below: "View All 14 Weeks."
6. **Explore Our Voyages** — 3 large editorial trip cards on dark background. Title formula: `Uncover: a week off-grid in the British Virgin Islands` / `Drift: the slow cays of the Abacos` / `Wander: a high-summer drift through Italy, Greece & Croatia`.
7. **Press/Credentials strip** — 4 thin items: USCG Captain, BVI Charter Permit, 5.0 Trustpilot, 100% All-Inclusive.
8. **Megatype "UNPLUG" overlay** — cinematic dark background image with massive light-weight type "UNPLUG" overlaid. Eyebrow above, italic serif sub-line below ("The life you've been putting off — it starts the moment the lines come off the dock."). CTA: "Find Your Week."
9. **About split (Watch the Film)** — left column: eyebrow, h2 ("Two captains. *One slow life.*"), 3 paragraphs, CTAs (primary: "Hold a Cabin"; mini-link: "Read more"). Right column: large image with circular play button overlay. Caption: "Watch the film · 2:48 · A week aboard."
10. **Trust pillars** — 5-column row on cream background. Each pillar: icon (24-28px stroke in coral), label, 1-line description. Pillars: Five-Star Hosts, All-Inclusive Pricing, 72-Hour Holds, On-the-Boat Support, The Right to Unplug. Trustpilot line below.
11. **CTA — coral block** — full-width coral background. Headline: "So, ready to *sail?*" Single CTA: "Browse Available Weeks."
12. **Footer** — brand block left (newsletter signup), three nav columns right (Voyages / About / Plan), social row + copyright base.

**Primary CTA:** "See Available Weeks" → `/calendar`
**Secondary CTAs:** "Watch the Film", "Hold a Cabin", newsletter

**SEO**
- `<title>`: "Off-Grid Catamaran Charters · BVI, Bahamas, Mediterranean | Guiding Winds Unplug"
- `<meta description>`: "All-inclusive wellness catamaran voyages for 8–12 guests in the British Virgin Islands, Bahamas, Italy, Greece, and Croatia. From $3,550 per guest, per week."
- Schema: `Organization`, `TravelAgency`, `AggregateRating`, `BreadcrumbList`.
- Target keywords (primary): "all-inclusive catamaran charter BVI 2027", "wellness catamaran charter", "off-grid catamaran vacation"
- Target queries (AI-search): "best small-group catamaran charter BVI 2027", "wellness catamaran charter for couples", "all-inclusive catamaran with private cabins"

---

## `/voyages/` — Destinations hub

**Purpose:** Help the visitor pick a region. Lead them into a trip detail page.

**Sections:**

1. **Hero** — secondary hero with one still image (catamaran horizon). Eyebrow ("Voyages · 2027"), h1 ("Three regions. *Fourteen weeks.* One boat."), short sub.
2. **The 2027 calendar overview** — table or stacked card list with all 14 weeks. Each row: region, dates, price, cabins-left badge.
3. **Three region cards** (large image, h2 title, 2-sentence description, "Explore" CTA): BVI, Bahamas, Mediterranean (which fans out into Italy / Greece / Croatia detail pages).
4. **Footer**

**Primary CTA:** Click a region card.

**SEO**
- `<title>`: "2027 Voyages · BVI, Bahamas, Italy, Greece, Croatia | Guiding Winds"
- Schema: `BreadcrumbList`, `ItemList` (each item is a `TouristTrip`).

---

## `/voyages/british-virgin-islands` — BVI trip detail

(Identical template for `/voyages/bahamas`, `/voyages/italy`, `/voyages/greece`, `/voyages/croatia`. Content varies; structure is identical.)

**Purpose:** Convert a destination-interested visitor into an inquiry on a specific week.

**Sections:**

1. **Hero** — destination-specific imagery. Breadcrumb (Home / Voyages / British Virgin Islands). Eyebrow with region + dates + nights. H1 ("British Virgin Islands. *Eight cabins, one catamaran, a week off the grid.*"). Stats row: 7 days · 10+ anchorages · 8–12 guests · $3,550 per guest, all-inclusive.
2. **Overview + sticky pricing aside** — left column: eyebrow, h2 (e.g., "Quiet mornings on glass water. Long afternoons in places the day-trippers never reach."), 3 paragraphs of narrative, inclusion chips. Right column (sticky on desktop): pricing card showing big price, "All-inclusive · No hidden fees," available weeks list with cabins-left badges, CTA "Hold a Cabin," legal "No deposit required to hold."
3. **Day-by-day itinerary timeline** — 8 entries (Day 1 through Day 8 / disembark). Vertical rail with coral dots. Each entry: day + weekday eyebrow, h3 (anchorage name), 3-sentence body.
4. **Gallery** — 5-tile asymmetric grid. Large square left (`col-span-2 row-span-2`), four small squares right.
5. **FAQ accordion** — 6 questions: Do I need to know how to sail? · What does the cabin look like? · What if I get seasick? · Cancellation policy · Can we bring kids? · Is there WiFi?
6. **Inquiry form** — full inquiry form pre-tagged for this destination.
7. **Footer**

**Primary CTA:** "Hold a Cabin" (in pricing card + sticky nav + inquiry form)

**SEO** (BVI example — adapt per destination)
- `<title>`: "British Virgin Islands · 7-Day All-Inclusive Catamaran Charter 2027 | Guiding Winds"
- `<meta description>`: "Norman Island, The Baths, Anegada, Jost Van Dyke. Seven nights aboard a private catamaran for 8–12 guests. From $3,550 per guest, all-inclusive. 2027 dates available."
- Schema: `TouristTrip`, `Event` (per available week), `Offer`, `FAQPage`, `Review` + `AggregateRating`, `BreadcrumbList`.
- Target keywords: "BVI all-inclusive catamaran charter 2027", "BVI 7-day catamaran trip", "private cabin BVI sailing charter"

---

## `/aboard` — What's included & the boat

**Purpose:** Answer "what am I getting for $3,550?" thoroughly enough to remove that friction from the buying decision.

**Sections:**

1. **Hero** — image of the boat's salon or galley. H1 ("Everything's in. *Bring a swimsuit.*").
2. **Eight-icon grid** — Chef-Prepared Meals · Premium Bar · Snorkel Gear & SUPs · Private Cabin + Head · Fuel & Dockage · Captain & Crew · Daily Wellness · The Right to Unplug. Each with a 2-sentence description.
3. **The boat** — 4–6 photos with captions (salon, galley, cabins, foredeck, captain's helm, head). H2 + paragraph per area.
4. **What's NOT included** — short numbered list (flights, crew gratuity, off-boat dining/excursions, travel insurance).
5. **A typical day aboard** — narrative paragraph, sunrise to sundown.
6. **CTA** — "See Available Weeks"
7. **Footer**

**SEO**
- `<title>`: "What's Aboard · All-Inclusive Catamaran Charter Inclusions | Guiding Winds Unplug"
- Schema: `Product` (the experience), `Offer`.

---

## `/about` — The crew

**Purpose:** Make Clint and Dodie real. Trust starts here.

**Sections:**

1. **Hero** — image of Clint and Dodie aboard. H1 ("Two captains. *One slow life.*").
2. **Clint's story** — h2 + 3 paragraphs + photo at helm.
3. **Dodie's story** — h2 + 3 paragraphs + photo hosting.
4. **Why Guiding Winds exists** — h2 + 2 paragraphs.
5. **The boat** — h2 + 1 paragraph + photo (links to /aboard for full detail).
6. **Credentials and safety** — short numbered list (USCG captain license, BVI charter permit, fully insured, 10+ years in the chain, safety equipment certs).
7. **CTA** — "See Available Weeks" + "Watch the Film" (opens 2:48 mini-doc).
8. **Footer**

**SEO**
- `<title>`: "Meet Clint & Dodie Kendall · Captains of Guiding Winds Unplug"
- Schema: `Person` for Clint, `Person` for Dodie, `Organization`.

---

## `/journal/` — Field Notes hub

**Purpose:** SEO + AI-search content engine. Build authority.

**Sections:**

1. **Hero** — small editorial header. H1 ("Field Notes."). Sub: "Quiet pieces on the slow life on the water."
2. **Category filter** — Guides · Field Notes · Wellness · Behind the Boat.
3. **Post grid** — 9 posts per page, image-led cards (16:10 image, category eyebrow, h3, 2-line excerpt, author + date).
4. **Pagination**
5. **Footer**

**Launch with these 5 posts** (briefs in `content/journal/_briefs/`):
1. *What to actually pack for a week off the grid* (Guide)
2. *The five anchorages in the BVI we love most* (Field Notes)
3. *Why mornings at sea are the best therapy* (Wellness)
4. *A captain's case for the catamaran over the monohull* (Behind the Boat)
5. *Anegada lobster: a deeply unserious guide* (Field Notes)

**SEO**
- `<title>`: "Field Notes · Stories from Catamaran Voyages | Guiding Winds Unplug"
- Schema: `Blog`, `BreadcrumbList`.

---

## `/journal/[slug]` — Individual journal post

**Purpose:** SEO + AI-search citations.

**Template:**

1. **Hero** — large image, category eyebrow, h1, author + date.
2. **Body** — long-form (1,500–2,500 words), proper heading hierarchy (one h1, multiple h2 and h3).
3. **Author bio block** — small, with photo.
4. **Related posts** — 3 cards.
5. **Newsletter signup** — inline.
6. **CTA** — "See Available Weeks" or destination-specific CTA if the post is destination-themed.

**SEO per post**
- Each post has its own `<title>` (≤60 chars), `<meta description>` (≤155 chars), and slug.
- Schema: `BlogPosting`, `Article`, `Person` (author), `BreadcrumbList`, `FAQPage` if Q&A is included.
- AI-search: every post includes a TL;DR box at the top (1 paragraph) — this is what gets quoted by Perplexity/Claude/ChatGPT.

---

## `/inquire` — Inquiry form

**Purpose:** Single canonical inquiry destination from external links / outbound emails.

**Sections:**

1. **Hero (minimal)** — H1 ("Tell us which week and we'll hold a cabin for 72 hours."). Sub: "No payment required. Dodie or Clint will reply within 24 hours."
2. **Inquiry form** — name (first + last), email, phone, preferred week, party size, notes.
3. **What happens next** — 3-step list ("Submit your inquiry" → "Dodie or Clint replies within 24h" → "We hold a cabin for 72h while you decide").
4. **FAQ shortcut** — 3 most common Q&A inline (Cancellation? Payment options? Kids?).
5. **Footer**

---

## `/calendar` — Live 2027 availability

**Purpose:** Browse-and-pick. Visitors who know what they want.

**Sections:**

1. **Hero (minimal)** — H1 ("2027 Sailing Calendar."). Sub: "Fourteen weeks. Eight cabins each. Hold one for 72 hours, no payment.")
2. **Region toggle** — All · BVI · Bahamas · Mediterranean.
3. **Calendar list** — 14 rows, each: date range, region, cabins available (live from GHL), price, "Hold a Cabin" button.
4. **Inquiry fallback** — at the bottom: "Not seeing the right week? Tell us what you're looking for." → opens `/inquire`.

---

## `/faq` — Frequently asked questions

**Purpose:** Reduce sales-call friction. Help SEO via FAQPage schema.

**Sections grouped by topic:**

- **Before booking** — How do I book? What if my dates aren't listed? Can we book the whole boat? Cancellation policy. Travel insurance.
- **The boat & cabins** — Cabin layout. AC. Wifi/Starlink. Capacity.
- **The experience** — Skill level required. Itinerary flexibility. Seasickness. Kids. Solo travelers. Alcohol. Dietary needs.
- **Logistics** — Embarkation port. Flights. Transfers. What to pack. Currency. Tipping.
- **Safety** — Captain credentials. Insurance. Emergency procedures. Weather contingency.

Each Q&A: 1-paragraph answer, 60–120 words.

**Schema:** `FAQPage` with `mainEntity` for each Q.

---

## `/privacy` and `/terms`

Standard legal pages. Mark generates from template; Dodie reviews. Privacy must reference GHL data flow and Plausible analytics. Terms must reference the 25 % deposit, cancellation policy (90+ days full refund, 90–45 days 50%, <45 days no refund but rebook-able if availability allows), and force majeure / weather contingencies.

---

## GHL email & SMS templates

Drafted in GHL, but copy lives here for review:

**E1 — Inquiry confirmation (immediate after `/inquire` submit)**
- Subject: "Got your note · we'll be in touch within 24 hours"
- Body (plain text): "Hi {first}, thanks for reaching out about a week aboard. Either Dodie or Clint will reply within 24 hours with availability for your preferred week and the next steps. While you wait — here's a 3-minute look at a day aboard: {youtube_link}. Quiet seas, Dodie & Clint."

**E2 — Hold confirmation (after `/calendar` cabin hold)**
- Subject: "Cabin held · {week} · 72 hours"
- Body: "Hi {first}, your cabin on the {week} voyage is held for 72 hours. To convert the hold into a booking, reply to this email with your preferred deposit method (Stripe or wire — we'll send instructions). After 72 hours the hold releases automatically. Quiet seas, Dodie & Clint."

**E3 — Hold expiring (48 hours after E2)**
- Subject: "24 hours left on your {week} cabin hold"
- Body: short, "still want it? hit reply" framing.

**E4 — Day-30 pre-trip**
- "What to expect · 30 days out"

**E5 — Day-14 pre-trip**
- "Pack-list & arrival details"

**E6 — Day-7 pre-trip**
- "See you Saturday · final checklist"

**E7 — Day-after disembark**
- "Thank you · would you share a few words?"
- Includes review request link.

**SMS templates** — keep all SMS ≤ 140 characters. One per pre-trip email beat.

---

## AI search visibility plan

For every primary page (home, the 5 destination pages, journal landing, top 3 journal posts):
- Include a 1-paragraph TL;DR or "answer capsule" near the top — direct, factual, quotable.
- Use clear headings that mirror likely search queries (e.g., "What's included in the price?" not "Inclusions").
- Cite verifiable facts (boat length, captain credentials, exact dates, exact pricing) — AI engines weight cite-able specifics.
- Keep at least 60% of body content as plain text (not tables/lists) so it surfaces clean in extraction.
- Schema markup on every page per `TECH-SPEC.md` §5.
- Make sure `robots.txt` allows `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`. Adding them increases the chance of citation.
