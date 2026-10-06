import { ghl, locationId } from './client';
import { toDays, matchesAppointment, type DaySlots } from '../intro-call';

const CAL_VERSION = { Version: '2021-04-15' };

/** Free slots for `calendarId` over the next `days` days, grouped by day. */
export async function freeDays(calendarId: string, days: number, timezone: string): Promise<DaySlots[]> {
  const now = Date.now();
  const qs = new URLSearchParams({
    startDate: String(now),
    endDate: String(now + days * 86_400_000),
    timezone,
  });
  return toDays(await ghl<Record<string, unknown>>(`/calendars/${calendarId}/free-slots?${qs}`, { headers: CAL_VERSION }));
}

/**
 * Book `minutes` at `startTime` for an existing contact. Never auto-retried:
 * the create isn't idempotent, so a lost response + retry could double-book.
 * If the call fails ambiguously, look on the calendar for our appointment
 * before reporting failure.
 */
export async function bookAppointment(opts: {
  calendarId: string;
  contactId: string;
  startTime: string;
  minutes: number;
  title: string;
}): Promise<void> {
  const start = new Date(opts.startTime);
  const end = new Date(start.getTime() + opts.minutes * 60_000);
  try {
    await ghl('/calendars/events/appointments', {
      method: 'POST',
      headers: CAL_VERSION,
      retries: 0,
      body: {
        calendarId: opts.calendarId,
        locationId: locationId(),
        contactId: opts.contactId,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        title: opts.title,
        appointmentStatus: 'confirmed',
      },
    });
  } catch (err) {
    if (await hasAppointment(opts.calendarId, opts.contactId, start, end)) return; // it went through
    throw err;
  }
}

/** Is there an appointment for `contactId` on `calendarId` starting at `start`? */
async function hasAppointment(calendarId: string, contactId: string, start: Date, end: Date): Promise<boolean> {
  try {
    const qs = new URLSearchParams({
      locationId: locationId(),
      calendarId,
      startTime: String(start.getTime()),
      endTime: String(end.getTime()),
    });
    const { events } = await ghl<{ events?: { contactId?: string; startTime?: string }[] }>(`/calendars/events?${qs}`, { headers: CAL_VERSION });
    return matchesAppointment(events ?? [], contactId, start);
  } catch {
    return false;
  }
}
