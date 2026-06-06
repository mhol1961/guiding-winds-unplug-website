# Guiding Winds — Change List from 6/2 Call

> **Status 2026-06-05:** All **[do now]** items applied and the build re-verified clean (9 Astro files parse with 0 errors). Done: capacity ranges (4-6 cabins / 8-12 guests), front-page price removed (hero subline, meta description, mobile CTA bar), hero captain/permit badges removed, BVI Charter Permit removed from the credential strip, boat size 40 to 60 feet (about + journal), "never on the boat / four hours" line removed, "this morning's market" line replaced, "Five regions · 12+ weeks a year" (2027 dropped), inventory stat reworked ("Up to 6 cabins · a dozen-plus weeks a year"), "Two captains" eyebrow changed to "Your hosts", paddleboards/kayaks moved to add-on. "Chat with Dodie" was already correct.
>
> **Needs your call (flagged, not changed):**
> - **PressStrip credentials** still assert `USCG Master 100-Ton · Captain Clint Kendall` and `RYA Yachtmaster Offshore`. Confirm Clint actually holds these or I'll remove them too.
> - **`aboard.astro` "Premium open bar"** (Wine, spirits, beer...) conflicts with the no-booze-cruise direction. Confirm whether to soften or cut.
> - **"Chef-prepared meals"** items on `aboard.astro` and the voyage content still imply all meals are chef-made. Needs the new casual/hands-on framing + chef-as-paid-add-on wording.
> - **`aboard.astro` assumes one Lagoon 50 with eight cabins** ("Eight queens", "8 cabins"). That conflicts with the variable 40-60 ft / 4-6 cabin fleet. Needs a content pass once you confirm the typical configs.
> - **UNPLUG line** was rewritten to "Just bringing life back down to zero. Reset your body and mind, on nothing but water, weather, and time." Confirm or send final wording.
> - Still waiting on emailed copy/photos for the hero headline, "Sail. Breathe. Reset." intro, and the AboutSplit one-captain copy + real photos.



_Extracted from the 2026-06-02 call with Clint and Dodie. Covers the Guiding Winds homepage review. (Dodie's QHHT review was past the 30-min transcript cutoff and is not included here.)_

Legend: **[do now]** = I can make the change directly. **[needs copy]** = waiting on exact wording Clint/Dodie will email. **[needs photo]** = waiting on a real image they'll send.

---

## Global / brand

1. **Logo larger** — increase the logo size in the nav/header. `Nav.astro` (and `public/img/brand/logo.png`). **[do now]**
2. **Replace AI/placeholder photos with real ones** — several stock/AI images are inaccurate (a monohull shown as a catamaran, one image "not even a sailboat"). Clint will send real photos to substitute. **[needs photo]**
3. **Detail/spacing pass** — Mark to clean up layout gaps during the edit pass. **[do now]**

---

## Hero (`src/components/home/Hero.astro`)

4. **Headline** — change "Every voyage starts with a feeling" to the new line: "Guiding Winds Unplug, where guests become crew, strangers become friends, and the ocean becomes the path back to presence." Clint/Dodie will email the exact final wording. **[needs copy]**
5. **Capacity stat** — "8 cabins, 12 guests" becomes a range: **4 to 6 cabins** (max is 6, never 8) and **8 to 12 guests**. Appears in the hero and elsewhere (see item 12). **[do now]**
6. **Hero video** — drop the wine glasses. Re-render Seedance Scene 4 with the alcohol-free prompt in `docs/seedance-prompts.md` ("Scene 4 — REVISED"). **[do now / render]**
7. **Captain/permit trust line** — remove the "U.S. Coast Guard Captain" and "BVI charter permit" badges at the bottom of the hero. Clint doesn't hold the permit yet, so eliminate the whole line for now. `PressStrip.astro` / `TrustPillars.astro` and any hero trust items. **[do now]**

---

## "All-inclusive wellness" / price band (`src/pages/index.astro`, `MidCta.astro`)

8. **Remove front-page price** — delete "from $3,550 per guest per week" from the homepage. (Keep pricing on the voyage detail pages; just not on the front page.) `index.astro`, `MobileCta.astro`, `MidCta.astro`. **[do now]**
9. **"All-inclusive wellness for eight"** — update the guest figure to the 8 to 12 range. **[do now]**
10. **Chat CTA name** — the chat button should read **"Chat with Dodie"** (transcript "Doty" = Dodie), since she handles chat. `ChatBubble.astro` / wherever the chat CTA label lives. **[do now]**

---

## Feeling section (`src/components/home/Feeling.astro`)

11. **Intro heading** — replace "The world is loud. The water isn't." with **"Sail. Breathe. Reset."** Final wording to be confirmed by email. **[needs copy]**

---

## Picker / regions block (`src/components/home/Picker.astro`)

12. **Keep the five regions** — they liked the "five regions" framing, leave it.
13. **Remove the seasonal claim** — cut the "Caribbean in the winter, Mediterranean in the summer" line.
14. **Soften weeks** — change "14 weeks a year" to **"12+ weeks"** (or "a dozen+ sailing trips a year"). They won't commit to 14. **[do now]**
15. **Remove "2027"** specifics from this block. **[do now]**
16. **Per-region nights as a range** — instead of a fixed "7 nights," show ranges like **"4 to 7 nights"** per region (boats may book 4- or 6-day charters). Applies to the voyage region cards / `src/content/voyages/*.md`. **[do now]**

---

## ExploreCards (`src/components/home/ExploreCards.astro`)

17. **Remove the "never on the boat" line** — delete "never on the boat for more than four hours." Don't use "never," and it isn't accurate. **[do now]**

---

## Food / chef messaging (`src/pages/aboard.astro`, `PricingCard.astro`, voyage content)

18. **Soften "chef-prepared meals"** — don't imply all meals are chef-prepared. Reframe to a casual, hands-on galley where guests can cook a night, with a **private chef available as a paid add-on**. Reword the "chef" references accordingly. **[needs copy]** for the exact new framing.

---

## AboutSplit / "our story" (`src/components/home/AboutSplit.astro`)

19. **Fix "two captains"** — it currently frames two captains and shows their friends **Danielle and Joe** with text like "Danielle captains one slow life." Wrong people, wrong claim. There is **one captain (Clint)**; Dodie is not a captain. Rewrite to one captain + Dodie. **[needs copy]**
20. **Owner photo** — replace with the real photo of Clint and Dodie together (islands/sailboats behind, no sunglasses) that they'll send. **[needs photo]**
21. **Photo below that** — the solo "picture of me" (Clint) also needs replacing with a better real photo (Clint with sailboats behind). **[needs photo]**

---

## Megatype "UNPLUG" block (`src/components/home/Megatype.astro`)

22. **Keep "UNPLUG"** — they like it. (Optional: reduce image opacity so more of the photo shows through the black.) **[do now]**
23. **Rework the small bottom line** — replace "no notifications, no agendas, no upsells" with a reset-themed line, roughly: "Just bringing life back down to zero — reset your body and mind." Final wording by email. **[needs copy]**
24. **Remove the "this morning's market" line** — "the galley running on what we found at this morning's market." Provisions are delivered before departure; they don't shop daily. Cut or reword. **[do now]**

---

## Aboard / inclusions (`src/pages/aboard.astro`)

25. **Paddle boards / kayaks are add-ons** — "two paddle boards, two kayaks" should be presented as an **optional paid add-on**, not standard inclusions. **[do now]**
26. **Boat size range** — change "45 to 60 foot" to **"40 to 60 foot."** `AboutSplit.astro` and anywhere the size range appears. **[do now]**

---

## Next: Experiences / gallery (new)

Clint's 6 video clips and several of his real photos aren't hero material but are great social proof. Proposed: build out the existing `src/pages/experiences.astro` with a **click-to-play gallery** (images + the 6 clips). Clips need web compression first (the two big ones are 105 MB and 48 MB). See chat for the recommended approach.

---

## Waiting on Clint/Dodie (so we can finish the "needs copy/photo" items)

- Final hero headline wording (item 4)
- Final "Sail. Breathe. Reset." intro wording (item 11)
- New chef/food framing wording (item 18)
- New "our story" one-captain copy (item 19)
- New UNPLUG bottom line (item 23)
- Real photos: Clint + Dodie together (no sunglasses), Clint solo with sailboats, real catamaran/monohull shots to replace AI images (items 2, 20, 21)
