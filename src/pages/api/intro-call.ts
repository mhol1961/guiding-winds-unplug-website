export const prerender = false;

// Intro-call booking for the thank-you page (CRO-3). Answers 404 while
// INTRO_CALL.enabled is false. GET = open slots; POST = book one.
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { INTRO_CALL } from '../../lib/business';
import { freeDays, bookAppointment } from '../../lib/ghl/calendars';
import { upsertContact, saveAttribution } from '../../lib/ghl/contacts';
import { json, readBody, rejectBots } from '../../lib/form-guard';
import { isOffered } from '../../lib/intro-call';
import { pickAttribution } from '../../lib/attribution';

const off = () => new Response('Not found', { status: 404 });

export const GET: APIRoute = async () => {
  if (!INTRO_CALL.enabled) return off();
  try {
    const days = await freeDays(INTRO_CALL.calendarId, INTRO_CALL.daysAhead, INTRO_CALL.timezone);
    return json({ ok: true, minutes: INTRO_CALL.minutes, timezone: INTRO_CALL.timezone, days }, 200, { 'Cache-Control': 'no-store' });
  } catch (err) {
    console.error('[intro-call] free slots failed', err);
    return json({ ok: false, error: 'Times are unavailable right now. Call (772) 310-3777 or reply to our email.' }, 503);
  }
};

const BookingSchema = z.object({
  firstName: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(254),
  startTime: z.string().trim().max(40),
});

export const POST: APIRoute = async ({ request }) => {
  if (!INTRO_CALL.enabled) return off();
  const payload = await readBody(request);
  if (!payload) return json({ ok: false, error: 'Bad request body.' }, 400);
  const parsed = BookingSchema.safeParse(payload);
  if (!parsed.success) return json({ ok: false, error: 'Please add your first name, email and a time.' }, 422);

  const rejected = await rejectBots(request, payload, 'intro-call');
  if (rejected) return rejected;

  const { firstName, email, startTime } = parsed.data;
  try {
    // Re-check against live availability so a stale page can't double-book.
    const days = await freeDays(INTRO_CALL.calendarId, INTRO_CALL.daysAhead, INTRO_CALL.timezone);
    if (!isOffered(days, startTime)) {
      return json({ ok: false, error: 'That time was just taken. Please pick another.' }, 409);
    }
    const { contact } = await upsertContact({ email, firstName, tags: ['intro-call-booked', 'website-2026'], source: 'Intro call (website)' });
    await bookAppointment({
      calendarId: INTRO_CALL.calendarId,
      contactId: contact.id,
      startTime,
      minutes: INTRO_CALL.minutes,
      title: `Intro call: ${firstName}`,
    });
    await saveAttribution(contact.id, pickAttribution(payload));
  } catch (err) {
    console.error('[intro-call] booking failed', err);
    return json({ ok: false, error: 'We could not book that time. Call (772) 310-3777 or email guidingwindsunplug@gmail.com.' }, 503);
  }
  return json({ ok: true, message: 'Booked. Watch for a confirmation from us.' });
};
