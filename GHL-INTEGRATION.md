# GHL-INTEGRATION — GoHighLevel operational runbook

How the Astro site connects to Dodie's GoHighLevel subaccount, what workflows exist (or need to exist) on the GHL side, and how to maintain it.

**Companion to:** `TECH-SPEC.md` §4 (the technical integration), `CONTENT-MAP.md` "GHL email & SMS templates" (copy), `CLAUDE.md` §4 (non-negotiables).

---

## Big picture

```
[Astro site — Cloudflare Pages]
       ↓ Astro Actions (server-side)
[GHL v2 REST API]
       ↓
[Dodie's GHL subaccount]
       ├─ Contacts (the CRM)
       ├─ Calendars (booking)
       ├─ Workflows (automations)
       ├─ Email/SMS (engagement)
       └─ Tasks (Dodie's inbox)
```

The website never embeds GHL UI. Every interaction with GHL is API-only. Dodie keeps GHL as her marketing platform; the site is a frontend that pipes data into it.

## Account setup

- **GHL subaccount:** Dodie's own. She pays the GHL bill directly. Mark does not consume one of his Starter subaccount slots (see `DECISIONS.md` ADR-002).
- **Plan tier:** GHL Starter ($97/mo) is sufficient — she has 1 subaccount for her business. If she expands to needing the SaaS-rebill features, she upgrades to GHL Pro ($497/mo) on her own.
- **Users:** Dodie + Clint (both with full access to the subaccount). Mark has a guest user with API/admin access for build and maintenance only.

## API credentials

Generated from inside Dodie's GHL subaccount:

1. **Location ID** — Settings → Business Info → Location ID at the top of the page.
2. **Private Integration Token** — Settings → Private Integrations → "Create New Integration" → required scopes:
   - `contacts.write` and `contacts.readonly`
   - `calendars.write` and `calendars.readonly`
   - `workflows.readonly`
   - `tags.write` and `tags.readonly`

   Name the integration "Astro Website (Production)". Save the token in a password manager **and** in Cloudflare Pages environment variables. Never commit the token.

3. **Calendar IDs** — For each region's voyage calendar:
   - Calendars → "BVI Charters 2027" → Settings → Calendar ID at the top
   - Repeat for "Bahamas Charters 2027" and "Mediterranean Charters 2027"
   - These IDs go into `GHL_CALENDAR_ID_BVI`, `_BAHAMAS`, `_MED` env vars.

## Tags taxonomy

Every contact gets one or more tags. Workflows fire off tags.

| Tag | Applied by | Triggers |
|---|---|---|
| `inquiry` | Inquiry form (any region) | Workflow: "New Inquiry — Universal" |
| `inquiry-bvi` | Inquiry from BVI voyage page or with BVI in preferred week | Workflow: "BVI Nurture Sequence" |
| `inquiry-bahamas` | Same, Bahamas | Workflow: "Bahamas Nurture Sequence" |
| `inquiry-mediterranean` | Same, Italy/Greece/Croatia | Workflow: "Mediterranean Nurture Sequence" |
| `newsletter` | Newsletter signup form | Workflow: "Welcome Sequence" |
| `hold-cabin` | Cabin hold created | Workflow: "Hold Expiring Reminder" |
| `booked-2027` | Manual (after deposit received) | Workflow: "Pre-Trip Prep Sequence" |
| `guest-2025` / `guest-2026` / `guest-2027` | Manual (post-trip) | Workflow: "Re-engagement Annual" |
| `website-2026` | All website-sourced contacts | (no workflow — segmentation only) |
| `quiet-mode` | Manual — guest opts out of nurture | Suppresses all workflows |

## Workflows — what exists / what needs to exist

Dodie or Mark builds each of these in GHL Workflows. Below is the spec for each.

### W1 — "New Inquiry — Universal"

**Trigger:** Contact tag added: `inquiry`
**Steps:**
1. **Wait 0 minutes**, then send Email E1 (Inquiry confirmation — see `CONTENT-MAP.md` GHL templates).
2. **Send SMS S1** to Dodie's phone: "New inquiry from {first} {last} ({region}). Reply within 24h."
3. **Create Task** for Dodie: "Reply to {first} {last} — {preferred_week}" with due time +24 hours.
4. **End workflow.** Region-specific workflows below handle the rest.

### W2 — "BVI Nurture Sequence"

**Trigger:** Contact tag added: `inquiry-bvi`
**Steps:**
1. **Wait 3 days** (skip if `booked-2027` tag is added before then).
2. **Send Email E-BVI-2**: "What a week in the BVI actually looks like" — links to `/voyages/british-virgin-islands`.
3. **Wait 4 days** (skip if `booked-2027` added).
4. **Send Email E-BVI-3**: "Two questions guests always ask before booking the BVI" — short, conversational, 200 words max.
5. **Wait 7 days**.
6. **Send Email E-BVI-4**: "We're holding cabins for the next four weeks" — links to `/calendar` with a personal sign-off from Dodie.
7. **End workflow.**

### W3 — "Bahamas Nurture Sequence"

**Trigger:** Contact tag added: `inquiry-bahamas`
**Steps:** Same structure as W2 but with Bahamas-specific copy and `/voyages/bahamas` links.

### W4 — "Mediterranean Nurture Sequence"

**Trigger:** Contact tag added: `inquiry-mediterranean`
**Steps:** Same structure as W2 but Mediterranean — and tone shifts slightly toward the high-summer feel (Italian dinners, Greek anchorages, Croatian coves). Links to `/voyages/italy`, `/voyages/greece`, `/voyages/croatia`.

### W5 — "Welcome Sequence" (newsletter)

**Trigger:** Contact tag added: `newsletter` (without any `inquiry-*` tag)
**Steps:**
1. **Wait 0 minutes**, send Email E-NL-1: "Welcome to Field Notes" — intro to the newsletter, links to top 3 journal posts.
2. **Wait 5 days**.
3. **Send Email E-NL-2**: "An anchorage we don't usually share" — short, intimate piece.
4. **Wait 7 days**.
5. **Send Email E-NL-3**: "If you ever want to see this in person…" — soft pitch with a link to `/voyages/`.
6. **End workflow.** Contact remains tagged `newsletter` for future broadcast emails.

### W6 — "Hold Expiring Reminder"

**Trigger:** Contact tag added: `hold-cabin`
**Steps:**
1. **Wait 48 hours**.
2. **Check:** does the contact also have `booked-2027`? If yes, exit workflow.
3. **Send Email E2 (Hold confirmation reminder)**: "24 hours left on your cabin hold for {preferred_week}."
4. **Wait 24 hours**.
5. **Check:** `booked-2027` again. If yes, exit.
6. **Send Email**: "Releasing the hold on {preferred_week}." Plus an SMS to Dodie.
7. **Remove tag** `hold-cabin`.
8. **End workflow.**

### W7 — "Pre-Trip Prep Sequence"

**Trigger:** Contact tag added: `booked-2027` (Dodie adds this manually after deposit received)
**Steps:**
1. **Wait until 30 days before trip start date** (calculated from a custom field `trip_start_date`).
2. **Send Email E4 (day-30)**: "What to expect — 30 days out."
3. **Wait until 14 days before trip start.**
4. **Send Email E5 (day-14)**: "Pack list & arrival details."
5. **Wait until 7 days before trip start.**
6. **Send Email E6 (day-7)**: "See you Saturday — final checklist." + SMS S7: "See you Saturday at Nanny Cay 2pm. Pack light."
7. **End workflow.**

### W8 — "Post-Trip Thank You + Review Request"

**Trigger:** Contact tag added: `guest-{year}` (Dodie adds this the day after disembark)
**Steps:**
1. **Wait 2 days.**
2. **Send Email E7**: "Thank you · would you share a few words?" with a link to a Trustpilot review form (or Google review form).
3. **Wait 14 days.**
4. **Check:** review submitted (custom field `review_submitted: yes`)? If yes, exit.
5. **Send Email**: gentle reminder + thank you. No more nudges after this.
6. **End workflow.**

### W9 — "Abandoned Form Re-Engagement"

**Trigger:** Page view of `/inquire` or any `/voyages/[slug]` page WITHOUT a form submission within 5 minutes.

*Note: This requires GHL's website tracking script on the site. We're choosing NOT to install it in v1 — it adds another vendor script, costs page-speed budget, and the value is modest. Revisit if conversion data shows the funnel leaking.*

If we do install it later: trigger sends a soft "You were looking at the BVI / Bahamas / Med voyages — anything we can help with?" email 24 hours later.

---

## Email and SMS copy — see CONTENT-MAP.md

The full copy for E1–E7 and all SMS messages lives in `CONTENT-MAP.md` §"GHL email & SMS templates." Don't put copy here — keep one source of truth.

When updating copy:

1. Edit `CONTENT-MAP.md`.
2. Mirror the change into the GHL email/SMS template in the workflow editor.
3. Send a test email/SMS to a test contact to confirm rendering (links work, merge tags resolve).

## Custom fields on the Contact object

These are populated by the website's Astro Actions when creating a contact:

| Custom Field key | Type | Source | Notes |
|---|---|---|---|
| `preferred_week` | string | Inquiry form | e.g., "BVI · Jan 9–16, 2027" |
| `party_size` | string | Inquiry form | e.g., "2 cabins (3–4 guests)" |
| `inquiry_notes` | text | Inquiry form notes field | Plain text |
| `inquiry_source` | string | Hardcoded by action | "guidingwinds-unplug.com" |
| `trip_start_date` | date | Manual by Dodie post-booking | Used by W7 wait conditions |
| `review_submitted` | bool | Manual by Dodie | Stops W8's reminder |

Create these custom fields in GHL: Settings → Custom Fields → Add Field. Field key must exactly match. Once created, the API can read/write them.

## Calendars setup

For each region, create a GHL Calendar:

1. Calendars → New Calendar
2. Name: "BVI Charters 2027" / "Bahamas Charters 2027" / "Mediterranean Charters 2027"
3. Type: Custom (event-based, not recurring slots)
4. Availability: manually add each available week as an event with capacity = 8 cabins
5. Booking widget: **disable embedding** (we use API only)
6. Capture the Calendar ID for env vars

When the Astro `hold-cabin` action calls `POST /calendars/events/appointments` it creates an appointment of capacity 1 (one cabin) attached to the relevant week event. GHL tracks remaining capacity automatically.

## Testing the integration

### Before pushing to production

1. In `.env.local` use a **test contact email** (e.g., your own).
2. Submit a test inquiry from local dev. Within 60 seconds:
   - The contact appears in Dodie's GHL Contacts.
   - The `inquiry` + region tag is applied.
   - Custom fields are populated.
   - W1 fires — confirmation email arrives at the test inbox.

3. Submit a test newsletter signup. Within 60 seconds:
   - Contact appears with `newsletter` tag only.
   - W5 fires.

4. Test a cabin hold:
   - Calendar appointment is created with status `new`.
   - Email E2 arrives.
   - 48 hours later (or manually advance the workflow), reminder fires.

5. Test the failure paths:
   - Bad GHL token → action retries 3× then falls back to mailto link.
   - Honeypot tripped → 200 response, no GHL contact created.
   - Rate limit exceeded → 429 with retry-after header.

### Test contacts cleanup

In GHL, periodically clean up test contacts (filter by `inquiry_source = guidingwinds-unplug.com` AND email contains `test@`). Don't let test data pollute Dodie's real CRM.

## When something goes wrong

### Inquiry submissions stopped landing in GHL

1. Check Cloudflare Pages env vars — is `GHL_PRIVATE_TOKEN` still set?
2. Check GHL → Settings → Private Integrations — is the token still active?
3. Check GHL → Settings → Account Status — is the subaccount still in good standing?
4. Check Cloudflare Pages Functions logs for the inquire action — what error is being returned?
5. As a fallback, the action's mailto-fallback should fire — Dodie receives inquiries as plain emails.

### A workflow stopped firing

1. In GHL → Workflows → check the workflow status (Active vs Draft).
2. Check the workflow's history tab — are there contacts that entered but never moved past step 1?
3. Verify the trigger tag is correctly being applied (look at recent contact activity).
4. Test by manually adding the trigger tag to a test contact.

### Calendar availability is wrong on the website

1. Check the voyage's content file in `src/content/voyages/*.md` — the `availableWeeks` array drives the display.
2. The website cache is 15 minutes — wait, or force a redeploy.
3. If a week is showing "0 cabins left" but it shouldn't, check GHL → Calendars → that week's event capacity.

### Pre-trip emails aren't firing for a confirmed guest

1. Did Dodie add the `booked-2027` tag to the contact?
2. Did she set the `trip_start_date` custom field?
3. Both are required for W7 to wait correctly. Check the contact record.

---

## Maintenance schedule

- **Weekly:** Check GHL Workflow history for any contacts stuck in a workflow step (count > 1 hour in a step is usually a red flag).
- **Monthly:** Review tags. Anyone tagged `inquiry-*` who never booked and hasn't been contacted in 30 days → archive or send a re-engagement.
- **Quarterly:** Re-verify all workflow copy against `CONTENT-MAP.md` (drift happens).
- **Annually:** Rotate the GHL Private Token. Update Cloudflare env vars. See `DEPLOY.md` §10.

## Future scope (not in v1)

- **Stripe deposit checkout** — currently holds are 72-hour soft holds with no payment. Adding a Stripe checkout step is straightforward but adds reconciliation overhead with GHL (which records the booking but not the payment). Reconsider after launch when transaction volume justifies it.
- **Two-way SMS** — guests reply to SMS, replies route to Dodie's GHL inbox. GHL supports this natively; just needs to be turned on.
- **Guest portal** — pre-trip information, manifest, packing list, weather forecast, all accessible to booked guests via a magic-link login. Would need a Next.js app surface (see `CLAUDE.md` §2 escalation criteria).
- **Trustpilot integration** — auto-sync reviews from Trustpilot into a `src/content/reviews/` collection, surfaced on the homepage and voyage pages.
