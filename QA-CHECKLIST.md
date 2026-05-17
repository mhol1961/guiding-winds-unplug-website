# QA-CHECKLIST — Guiding Winds Unplug pre-launch

Run this from top to bottom before flipping DNS. Anything unchecked is a blocker. Re-run the relevant section after any change post-launch.

**Last updated:** 2026-05-17

---

## 1. Design system fidelity

- [ ] `npm run design:lint` (alias for `designmd lint DESIGN.md`) returns zero errors.
- [ ] All component styles use tokens from `DESIGN.md` — no hardcoded hex values in component CSS.
- [ ] No new color introduced anywhere that isn't in `DESIGN.md`. (`grep -r "#[0-9A-Fa-f]\{6\}" src/components/` returns only token references.)
- [ ] `prefers-reduced-motion: reduce` disables: hero crossfade, Ken Burns push, marquee, card hover transforms.
- [ ] One `{typography.display}` use per page maximum. Verified by grep.
- [ ] One `button-primary` per visible section maximum. Verified by visual scan on each page.
- [ ] `{colors.accent}` never used as a background or large surface.
- [ ] Section order in `DESIGN.md` matches canonical order (Overview → Colors → Typography → Layout → Elevation & Depth → Shapes → Components → Do's and Don'ts).

## 2. Self-critique pass (run before declaring "ready for client")

Use sub-agents for independence. Invoke each skill and read the report end-to-end.

- [ ] `design-critique` pass on home, on at least 2 trip pages, on `/about`, on `/journal/[slug]`. Iterate on any "major" findings.
- [ ] `brand-review` pass on the same set. Voice consistent throughout. No banned words (luxurious / ultimate / perfect / transformative / amazing). No exclamation marks in body. Voice still passes after copy edits.
- [ ] `accessibility-review` pass on home + one trip page + `/inquire`. All "critical" findings resolved.
- [ ] `ux-copy` pass on every button, form label, error message, empty state, and confirmation.

## 3. Accessibility (WCAG 2.1 AA)

- [ ] axe-core scan in CI returns zero serious / critical violations.
- [ ] All images have meaningful `alt` text (decorative images use `alt=""`).
- [ ] All form inputs have associated `<label>` (visible or `aria-label`).
- [ ] Form validation errors are announced to screen readers (`aria-live="polite"` on the error region).
- [ ] Tab order is logical and complete on every page. Test by tabbing through home, a trip page, the inquiry form, and the calendar.
- [ ] Focus rings visible on all interactive elements. Color used is `{colors.accent}` per `DESIGN.md`.
- [ ] No focus trap on any modal that lacks an escape path.
- [ ] Skip-to-content link present on every page and triggers correctly.
- [ ] Color contrast ≥ 4.5:1 for body text, ≥ 3:1 for large text (≥18pt or ≥14pt bold). Verified by axe + the design.md linter.
- [ ] Site is fully usable with keyboard only — including the cabin booking flow.
- [ ] Site is usable with VoiceOver (macOS) and NVDA (Windows). Spot-check the home and inquiry form.
- [ ] All videos have `aria-label` or visible captions describing content for screen reader users.
- [ ] Hero loop is muted by default and does not autoplay audio.
- [ ] No essential content depends on color alone (status badges include text + a shape, not just color).

## 4. SEO — on-page

- [ ] Every page has a unique `<title>` (≤ 60 chars, includes brand name).
- [ ] Every page has a unique `<meta name="description">` (≤ 155 chars).
- [ ] Every page has exactly one `<h1>`.
- [ ] Heading hierarchy is sequential (no h1 → h3 skips).
- [ ] Every page has a valid `<link rel="canonical">` pointing to itself.
- [ ] Open Graph tags present on every page: `og:title`, `og:description`, `og:image` (1200×630 px), `og:url`, `og:type`.
- [ ] Twitter card tags: `twitter:card="summary_large_image"`, `twitter:title`, `twitter:description`, `twitter:image`.
- [ ] Every image has a descriptive `alt`. (Repeats accessibility check — both still matter.)
- [ ] Internal linking: every page is reachable from the home page in ≤ 3 clicks.
- [ ] No orphan pages.
- [ ] No broken internal links (`broken-links` skill scan returns zero hits).
- [ ] No external links with `rel="nofollow"` accidentally applied to brand resources.
- [ ] `sitemap.xml` generated and accessible at `/sitemap.xml`. Includes every public page with `lastmod` dates.
- [ ] `robots.txt` allows `Googlebot`, `Bingbot`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`. No disallows except internal `/api/` paths.
- [ ] Submit `sitemap.xml` to Google Search Console + Bing Webmaster.

## 5. SEO — structured data

- [ ] `Organization` schema on home and footer.
- [ ] `TouristTrip` schema on each voyage page with full itinerary, offers (per available week), provider.
- [ ] `Event` schema on each available-week instance with start/end dates, offers, location.
- [ ] `FAQPage` schema on `/faq` and on each voyage page's FAQ block.
- [ ] `BlogPosting` / `Article` schema on each journal post.
- [ ] `Person` schema for Clint and Dodie on `/about`.
- [ ] `Review` + `AggregateRating` schema on each voyage page with real testimonials.
- [ ] `BreadcrumbList` schema on every page below the home.
- [ ] Validate every page through Google Rich Results Test.
- [ ] Validate every page through Schema.org validator.

## 6. AI search visibility

- [ ] Every primary page has a 1-paragraph TL;DR / "answer capsule" near the top (factual, specific, quotable).
- [ ] Headings on key pages mirror likely search queries ("What's included in the price?" not "Inclusions").
- [ ] Pages cite verifiable specifics (boat length, exact pricing, captain credentials, exact dates).
- [ ] At least one YouTube video is embedded somewhere on the site (likely `/about` or home's "Watch a Day Aboard") — boosts Google video-rich + AI-search citation likelihood.
- [ ] `Google-Extended`, `GPTBot`, `ClaudeBot`, `PerplexityBot`, `CCBot` all explicitly allowed in `robots.txt`.
- [ ] Manual prompt tests: ask ChatGPT, Claude, Perplexity, and Google "What's the best small-group all-inclusive catamaran charter in the BVI for 2027?" — record baseline citation status before launch + 2 weeks after.

## 7. Performance — Lighthouse

- [ ] Lighthouse Performance ≥ 95 desktop on home, voyages hub, one trip page, `/inquire`, `/journal`.
- [ ] Lighthouse Performance ≥ 90 mobile on the same set.
- [ ] LCP ≤ 2.0s on 4G throttling (mobile).
- [ ] CLS ≤ 0.05 every page.
- [ ] TBT ≤ 150ms every page.
- [ ] Initial JS payload ≤ 50 KB per route.
- [ ] No render-blocking resources flagged in Lighthouse audit.
- [ ] All images served as AVIF with WebP fallback (`astro:assets`).
- [ ] All above-the-fold images have explicit `width` and `height` (no CLS from images).
- [ ] Hero video preloads `metadata` only (not `auto`). Each scene ≤ 4 MB.
- [ ] Above-the-fold image budget per route ≤ 1.5 MB combined.
- [ ] Fonts use system stack — no web font loading in critical path.

## 8. Browser & device matrix

Smoke test the home, one trip page, `/inquire`, and `/calendar` in:

- [ ] Chrome (latest, desktop + Android)
- [ ] Safari (latest, macOS)
- [ ] Safari (iOS 16+, iPhone)
- [ ] Firefox (latest, desktop)
- [ ] Edge (latest)
- [ ] iPad Safari (portrait + landscape)
- [ ] One older Android browser via BrowserStack (Chrome on Android 11 or similar)

Verify on each:
- [ ] Hero loop plays or fallback gradient shows cleanly.
- [ ] Booking form submits successfully to GHL test environment.
- [ ] Calendar availability loads.
- [ ] No layout shift, no clipped content, no overflowing text.
- [ ] All sticky elements (nav, pricing card) behave correctly.

## 9. Forms & GHL integration

- [ ] Test inquiry submission lands in Dodie's GHL with all custom fields populated.
- [ ] Tag `inquiry-<region>` is applied correctly per submission region.
- [ ] Newsletter signup creates a contact with `newsletter` tag (no other tags).
- [ ] Cabin hold (`POST /calendars/events/appointments`) creates an appointment in the correct GHL calendar with `appointmentStatus: 'new'`.
- [ ] Honeypot field rejects bot submissions silently (returns 200, no GHL contact created).
- [ ] Rate limit (5 / IP / hour) triggers on 6th submission and returns 429.
- [ ] GHL API failure path: form falls back gracefully to mailto link after 3 retry failures.
- [ ] GHL workflows fire on test submissions: confirmation email arrives at the test email address within 60 seconds.
- [ ] Pre-trip emails (day-30, day-14, day-7) fire on the right schedule (test by manually advancing a test contact's booking date).

## 10. Content QA

- [ ] Every page proofread for typos. (`grep` for common typos: "teh", "freind", "occured", "wifi" — should be "Wi-Fi" in formal copy.)
- [ ] Brand naming is consistent: "Guiding Winds Unplug" everywhere. Never "Guiding Winds 'Unplug'" with quotes. Never "GuidingWinds" concatenated.
- [ ] No banned words present: luxurious / ultimate / perfect / transformative / amazing.
- [ ] No exclamation marks in body copy. Headlines reviewed for tone.
- [ ] All dates correctly formatted: "Jan 9 – 16, 2027" (en-dash, no commas inside the range).
- [ ] All pricing displays as `$3,550` (comma, no trailing zero, USD).
- [ ] Captain credentials and BVI permit numbers are accurate (if displayed).
- [ ] All testimonials have real names, locations, and voyage dates. Permissions on file (Mark to confirm with Dodie).
- [ ] All photos have permission to use (Dodie's library + any licensed stock).
- [ ] No AI-generated imagery presented as real photography without disclosure.
- [ ] FAQ answers are factually correct (cabin specs, Starlink presence, kid policy, cancellation tiers).
- [ ] Legal pages (Privacy, Terms) reviewed by Dodie.

## 11. Security

- [ ] HTTPS enforced. HTTP redirects to HTTPS.
- [ ] HSTS header present with `max-age=63072000; includeSubDomains; preload`.
- [ ] Strict CSP allowing only first-party JS + Plausible + GHL form action.
- [ ] No mixed content (HTTP resources on HTTPS page).
- [ ] GHL API key only in environment variables. `grep -r "GHL_" src/` returns only references to `import.meta.env.GHL_*`.
- [ ] No secrets in the public `dist/` output. (Manual scan + secret-scanning in CI.)
- [ ] `X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff` set.
- [ ] Honeypot + rate limit on all forms.
- [ ] No third-party trackers besides Plausible.

## 12. DNS, SSL, deployment

- [ ] Domain in Cloudflare DNS. Old registrar transferred or pointed via NS records.
- [ ] A / CNAME records pointing to Cloudflare Pages.
- [ ] SSL set to Full (Strict).
- [ ] Cloudflare WAF default rules enabled. Bot Fight Mode on. AI bots allowed via `robots.txt` (not blocked at the WAF).
- [ ] Email DNS records (SPF, DKIM, DMARC) configured for `guidingwinds-unplug.com`. DKIM from Dodie's GHL email setup.
- [ ] `mail.guidingwinds-unplug.com` (or wherever GHL sends from) reverse DNS resolves.
- [ ] Old GHL-hosted site redirected to the new site (301) on `/`, `/destination-schedule`, `/-649302`, `/privacy-policy`, `/terms-and-conditions`. Map old URLs to new equivalents in `_redirects` or Cloudflare Rules.

## 13. Analytics & monitoring

- [ ] Plausible installed and tracking page views.
- [ ] Plausible goals configured: inquiry submitted, cabin hold created, newsletter signup.
- [ ] Google Search Console verified for the domain. Sitemap submitted.
- [ ] Bing Webmaster verified. Sitemap submitted.
- [ ] Cloudflare analytics enabled (free with Pages).
- [ ] Sentry or similar error monitoring connected (optional but recommended).
- [ ] Uptime monitor (UptimeRobot free tier) pinging `/` every 5 minutes.

## 14. Backup & rollback

- [ ] Old GHL site exported (HTML / content) and archived before DNS cutover.
- [ ] Git tag `v1.0.0` at the commit that goes live.
- [ ] Rollback plan documented: revert DNS to old GHL site IP / CNAME in < 15 minutes if needed.
- [ ] GHL workflow snapshots taken before any production workflow changes.

## 15. Sign-off

- [ ] Mark final review pass complete.
- [ ] Dodie has clicked through every page on the staging site and approved copy.
- [ ] Dodie has tested the inquiry form end-to-end on her phone.
- [ ] Outstanding issues list is empty or every item is documented as deliberately deferred.

---

**On launch day**, this whole checklist is re-walked one final time on the production deployment after DNS cuts over. Any failure rolls back immediately.

**Post-launch (week 1)**, re-run sections 4, 5, 6, 7, and 13 daily. Section 9 (forms + GHL) twice daily.

**Quarterly thereafter**, re-run sections 4, 5, 6, 7, 11. Schedule recurring tasks in the Mark calendar.
