import { ghl, locationId } from './client';
import { toDays, type DaySlots } from '../intro-call';

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

/** Book `minutes` starting at `startTime` for an existing contact. */
export async function bookAppointment(opts: {
  calendarId: string;
  contactId: string;
  startTime: string;
  minutes: number;
  title: string;
}): Promise<void> {
  const start = new Date(opts.startTime);
  await ghl('/calendars/events/appointments', {
    method: 'POST',
    headers: CAL_VERSION,
    body: {
      calendarId: opts.calendarId,
      locationId: locationId(),
      contactId: opts.contactId,
      startTime: start.toISOString(),
      endTime: new Date(start.getTime() + opts.minutes * 60_000).toISOString(),
      title: opts.title,
      appointmentStatus: 'confirmed',
    },
  });
}
