# Black Tomato — Design Reference (for Guiding Winds Unplug)

> Recon target: `blacktomato.com/us/` (homepage), `/destinations/` (index), `/destinations/caribbean/` (region page — used as the comparable destination page because the British Virgin Islands single-country URL currently 404s on direct fetch).
> Captured: 2026-05-17. Source files: `.firecrawl/blacktomato-home.md`, `blacktomato-destinations.md`, `blacktomato-caribbean.md`.
> Purpose: distill the Black Tomato design DNA so Guiding Winds can drink from the same well without cloning it.

---

## 1. Overview

Black Tomato is a 20-year-old tailor-made luxury travel agency built on an editorial, magazine-like web aesthetic. The site reads like a thick travel quarterly: photography-led, copy-confident, restrained chrome, very little decoration. There are no urgency tropes, no glitter, no AI-slop gradients. Every page is built around two ideas working in tension — **cinematic photography at scale** and **literary, lower-case body copy that whispers instead of shouts**. The feeling is "we are the experts, we will not perform for you, we will quietly demonstrate."

Brand promise: *"It's not where you want to go; it's how you want to feel."* That single line bends the whole UX — the trip finder is keyed on feeling (Challenged, Contentment, Distraction, Freedom, Revitalized) before geography.

---

## 2. Colors

Black Tomato runs an unmistakably **monochrome-with-one-accent** system. Most surfaces are warm off-white or full-bleed photography; type is near-black; the brand mark and a handful of icons are the single accent — a saturated coral/tomato red (the literal "tomato"). They almost never apply the accent to large surfaces; it lives at icon-scale and as link hover.

| Token | Hex (estimated from rendered assets) | Use |
|---|---|---|
| `bg-base` | `#FAFAF7` (warm bone / paper) | Page background |
| `bg-section-dark` | `#0F0F0F` (near-black, not pure) | Inverted hero sections, footer |
| `text-primary` | `#111111` | Headlines, body |
| `text-muted` | `#5A5A55` (warm grey) | Captions, metadata ("12 nights", "From $X per person") |
| `text-inverse` | `#FAFAF7` | On dark sections |
| `accent-tomato` | `#E5402B` (the logo red) | Logo, search icon, link hover, micro-accents only |
| `rule` | `#E8E4DC` | Hairline dividers (`* * *` style) |

Dark sections are used sparingly — usually for a single full-bleed photo treatment or the footer. The contrast comes from photography, not chrome.

---

## 3. Typography

Black Tomato uses a **two-family editorial pairing**: a serif display and a clean sans body. Based on rendered character shapes and weight, the display face reads as a contemporary, slightly condensed serif in the Canela / Editorial New / GT Sectra family — high contrast, sharp terminals, restrained. Body is a humanist sans (Founders Grotesk / Söhne / Aktiv Grotesk family) at a quiet weight.

| Role | Family (likeness) | Weight | Approx size | Notes |
|---|---|---|---|---|
| Display H1 (hero) | Editorial serif | Regular 400 | 64–88px desktop | Sentence case, *italicized* sub for elegance: "The luxury travel experts" |
| H2 section | Editorial serif | Regular 400 | 40–56px | Soft, never bold |
| H3 / card title | Sans humanist | Medium 500 | 18–22px | Often italic — see "Inspiration to get under the skin of Caribbean" |
| Body | Sans humanist | Regular 400 | 16–18px | Generous line-height (~1.55), max-width ~640px |
| Caption / meta | Sans humanist | Regular 400 | 12–13px | All-caps tracking on labels like "CUSTOM TRIPS", "ONE OF OUR TRAVEL EXPERTS…" |
| Sub / italic | Editorial serif italic | Regular 400 | 24–32px | Used for poetic sub-deck ("_Remarkable experiences to inspire the mind_") |

**Italic usage is signature.** Italics carry the emotional voice ("Every journey starts with a feeling"). Roman type carries the practical voice ("From $13,000 per person excl. flights"). The contrast does a lot of work.

No bold sans headlines. No display weight stunts. Tracking on labels but never on body.

---

## 4. Layout

The site is built on a **12-col editorial grid with deliberate asymmetry** — they almost never split a section 6/6.

**Hero composition.** Full-bleed photography (looks like a still image, not video) holding ~85vh. Headline sits low-left on the photo, sub-deck below, two stacked CTAs (`Explore our trips` / `Plan my Trip`) and a tiny "Scroll" affordance bottom-center. The mega-nav and trip-finder pills (feeling + month dropdowns) overlay the hero with a translucent backdrop.

**Section count and order on home (from scrape):**
1. Hero (photo + headline)
2. Trip finder (feeling × month) — interactive overlay
3. Editorial intro: *"Every journey starts with a feeling"* — narrow centered prose, max ~640px
4. Testimonial carousel (italic quote, attribution, region) — 8 quotes, 1/2 pagination
5. "Start your Journey" tabbed panel — By Traveler / Most Popular / By month / In the Spotlight
6. Trip cards grid: "Explore our trips" — 9 portrait cards + 1 "Create your own" CTA card
7. Press-quote band: 4 publication logos (Forbes, CNBC, Inc, Coveteur) with one-line pull quote each
8. Awards strip: Robb Report, T+L A-List, Best of Luxury Travel
9. **Footsteps** sub-brand panel: full-bleed photo, single line "Their future is out there", `Find it` CTA
10. "What we do" — split image + paragraph, "Watch the film" CTA
11. "Pursuit of Feeling" — same split-image treatment, different photo
12. "Our guide to luxury travel" — split image + long-form prose ("Continue Reading")
13. "Why Black Tomato?" — 5 icon-bullets above-a-rule, hairline dividers
14. Trustpilot strip
15. "So, ready to start?" — single H3, single CTA
16. Footer — IATA / ABTA badges, newsletter signup, two columns of secondary nav

That's ~15 distinct sections on the homepage. Whitespace between them is **generous but not theatrical** — roughly 96–128px vertical padding. Image-heavy sections breathe; copy-heavy sections (#3, #12) are tight and centered.

**Aspect ratios — the signature.**
- Hero photo: 16:9 or wider (full-bleed)
- Trip card images: **portrait 630×1100 (≈9:16)** — this is the most distinctive ratio on the site. Card-as-magazine-cover.
- "What we do" / "Pursuit of Feeling" inline images: 690×405 (≈17:10 — wider than 16:9, very horizontal)
- Region tiles on `/destinations/`: 362×212 (≈17:10 again)
- Navigation thumbnails (mega-menu): 220×370 portrait

The portrait trip cards stacked next to the horizontal split-image sections create constant **shape contrast** as you scroll — the eye never settles into one rhythm. That's the layout DNA.

**Grid breaks.** The trip-finder pills and the testimonial carousel both span full-bleed and overlap photography. The "Footsteps" sub-brand panel deliberately interrupts the homepage rhythm with a black/dark photo and a single line of text — it reads like turning a page in a magazine.

---

## 5. Elevation & Depth

Almost none. This is a flat, paper-like design. No drop shadows on cards, no glassmorphism, no neumorphism. Depth comes from **photography overlap** (hero text sitting on photo, carousel pagination on photo) and from **hairline rules** (`* * *` style dividers in the "Why Black Tomato?" section). Hovering a trip card produces a subtle image zoom (image scales ~1.04, text stays put) — that's the only motion in the resting state. No card lifts, no glow, no border-color shift.

---

## 6. Shapes

Sharp. Almost everything is rectangular with **0px or 2px corner radii**. Buttons are slim outline rectangles or text-only with an animated underline. Image tiles are unrounded. The only round shape is the search icon and the carousel pagination dots. This restraint is a major part of the "we are not a tech startup" signal.

---

## 7. Components

**Buttons.**
- Primary CTA: text-only or thin-stroke outline rectangle, label like `Explore our trips`, `Plan my Trip`, `Get In Touch`, `Inquire Now`, `Hold a Cabin`. Hover: underline animation or fill-on-hover (white → dark).
- Secondary: text link with arrow `Explore Trip →`. The arrow is part of the brand.
- Never gradient, never shadowed, never icon-led.

**Cards (trip cards — the headline component).**
- Portrait 9:16 photo, top
- Tiny meta line below: `12 nights` / `France` (separated, not in a pill — just type)
- H4 trip title with link
- 2-line excerpt that hard-truncates with ellipsis
- `From $X per person excl. flights` — the price is **stated plainly**, not hidden behind "request a quote"
- `Explore Trip` text link with arrow

**Navigation.**
- Mega-menu organized by region (Africa, Arctic Circle, Asia, Caribbean…) with per-region country list and a "Browse all" lead link. The "Most Popular" tab uses 8 portrait thumbnails (220×370) of countries — basically a visual A-list.
- Sticky top bar with logo left, `Inquire Now` right, phone numbers and search icon between.

**Testimonial pattern.**
- Italic quote ("**Hands down it was the most amazing experience…**") in serif
- Attribution: `_Brett, Middle East_` — name + region, never name + title or photo
- 1/2 pagination dots
- No avatars. No corporate logos on testimonials. Trust is communicated by the press strip elsewhere.

**FAQ pattern (region pages).**
- Vertical stack of H2 questions
- Each answer is a paragraph, not a fold-out accordion
- Built for SEO and for reading, not for visual compactness

**Region "What to see and do" pattern.**
- H3 with descriptive label ("Best Caribbean Islands for Families", "Island Hopping in the Caribbean")
- 3–4 sentences of prose with **inline country links**
- One `Inquire` CTA
- One horizontal image (690×405) below
- Repeated as a stack — feels like a magazine spread

---

## 8. Do's and Don'ts

**Do**
- Lead with photography that does the work. If the photo isn't strong, the section fails.
- Use italics to carry emotional voice; roman to carry practical voice.
- Quote real prices in plain type. ("From $X per person.") The transparency *is* the luxury signal.
- Use the editorial-serif H1 + sans body pairing — never two sans, never two serifs.
- Vary aspect ratios across sections so the scroll feels like a magazine.
- Keep CTAs verb-led and specific: `Explore Trip`, `Plan my Trip`, `Hold a Cabin`, `Speak to an expert`.
- Use micro-meta lines (`12 nights / France`) as a discrete visual grammar instead of badges/pills.

**Don't**
- Don't shadow cards. Don't round corners past 2px.
- Don't use carousels for primary content (testimonials are the only carousel and even those are 1/2 paginated, not auto-rotating).
- Don't use icons as decoration. The 5 icons on "Why Black Tomato?" are line-art SVG at small scale, paired with text — never standalone.
- Don't use the accent color on large surfaces. It is a *tomato*, not a wall paint.
- Don't write copy with exclamation marks or urgency. The voice is confident, never excited.
- Don't use stock photography. The cinematography is the brand.

---

## 9. The "Signature Moment"

The thing you'd remember an hour from now is the **trip card grid**. Nine portrait 9:16 photo-cards that read like magazine covers, each with a price quoted in plain type and a one-line geography meta. It's the antithesis of a SaaS pricing grid — it sells the destination, not the deal. The visual rhythm of nine tall portraits stepping across the screen is the most distinctive thing on the site, and it carries the brand promise (*remarkable experiences*) in a single visual gesture.

The secondary moment is the **trip-finder pills overlay** on the hero — pre-geography keyword routing on *feeling* (Challenged / Contentment / Freedom / Revitalized) before *month*. It commits, hard, to the brand line.

---

## 10. What to steal vs what to skip — for Guiding Winds Unplug

**Steal (drink from this well):**
- The **editorial-serif display + humanist sans body** pairing. Use Canela or Fraunces or Editorial New for display; pair with Söhne / Aktiv Grotesk / General Sans / Inter (body only) for text. This single decision moves Guiding Winds 80% of the way to "Black Tomato adjacent."
- **Italics as the emotional voice.** Headlines and pull quotes in italic serif; everything else roman. Guiding Winds' wellness/slow-living promise *wants* this register.
- **Portrait photo-cards as the trip grid.** Each Guiding Winds voyage (BVI, Bahamas, Greece, custom) gets a 9:16 magazine-cover-style card with `7 nights / British Virgin Islands` meta, a plain-typed price (`From $3,550 per guest`), and an `Explore Voyage` text link. This is the headline component to nail.
- **Warm bone background, near-black text, one accent only.** Guiding Winds' accent can be the sun-bleached teal of catamaran water or the warm copper of a sunset deck rail — pick one, use it at icon-scale, never on walls.
- **Hairline dividers and sharp corners.** No shadows, no rounded cards, no glassmorphism. The restraint is the luxury.
- **Verb-led CTAs.** `See Available Weeks`, `Hold a Cabin`, `Speak to a Captain` — concrete verbs, not generic "Learn More."
- **Trust signals at the bottom of the page in a quiet press/awards strip,** not screaming on the hero.

**Skip (these read as corporate scale signals Guiding Winds can't and shouldn't fake):**
- The **13-region mega-menu**. Guiding Winds has three regions. A simple in-page anchor nav beats a hover-mega-menu at this scale and is more honest.
- The **press-quote band with Forbes/CNBC/Inc logos**. Replace with Trustpilot / Google reviews / past-guest quotes (with first name + region in the Black Tomato style). Don't fake institutional press credibility.
- The **awards strip** (Robb Report A-List, T+L World's Most Influential). Guiding Winds doesn't have these. Substitute USCG Master Captain credentials, RYA certification, and years-on-the-water — concrete trust signals appropriate to a 2-captain operation.
- The **sub-brand panel ("Footsteps")**. There is no sub-brand. Don't invent one to fill space.
- The **A-Z country directory** (200+ entries). Guiding Winds has BVI, Bahamas, Greece — surface them visually, not as a list.
- The **video film treatment** ("Watch the film" with Tom & James). Guiding Winds *should* do a captain video, but keep it small and intimate — a 60-second handheld piece, not a corporate sizzle reel. Dodie and Clint at the helm, not a brand video.
- The **trip-finder feeling × month grid as a UI**. Borrow the *philosophy* (feeling-first), but for a 1-boat operation it's overkill. Use the "feeling" framing in headlines and copy, not as a dropdown.
- The all-inclusive **destination-page repetition pattern** (5 "What to see and do" sub-sections × 3 regions). Guiding Winds should have 3–4 sub-sections per region max, or it reads as padded.

**The core translation:** Black Tomato's confidence comes from photography + restraint + editorial typography. Guiding Winds can match all three on a much smaller surface area. What Guiding Winds must NOT do is import Black Tomato's corporate scale grammar (mega-nav, press wall, A-Z directory, awards row) — those signals belong to a multi-million-dollar agency and will read as inflated on a 2-captain, 1-boat operation. The site should look like the smallest, most-confident-possible version of Black Tomato, not a small operator cosplaying as one.
