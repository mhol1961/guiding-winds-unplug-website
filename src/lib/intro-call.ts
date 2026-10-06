// Pure helpers for the intro-call picker (no GHL/Worker imports, so they're testable).

export interface DaySlots {
  date: string; // YYYY-MM-DD in the calendar's timezone
  slots: string[]; // ISO start times with offset, as GHL returns them
}

/** GHL free-slots response ({ "2026-10-06": { slots: [...] }, traceId: "..." }) to sorted days. */
export function toDays(res: Record<string, unknown>): DaySlots[] {
  return Object.entries(res)
    .filter(([k, v]) => /^\d{4}-\d{2}-\d{2}$/.test(k) && Array.isArray((v as { slots?: unknown })?.slots))
    .map(([date, v]) => ({ date, slots: ((v as { slots: unknown[] }).slots).filter((s): s is string => typeof s === 'string') }))
    .filter((d) => d.slots.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** True only if `start` is exactly one of the offered slots (compared as instants). */
export function isOffered(days: DaySlots[], start: string): boolean {
  const t = Date.parse(start);
  if (Number.isNaN(t)) return false;
  return days.some((d) => d.slots.some((s) => Date.parse(s) === t));
}

/** Does `events` contain this contact's appointment starting at `start`? */
export function matchesAppointment(events: { contactId?: string; startTime?: string }[], contactId: string, start: Date): boolean {
  return events.some((e) => e.contactId === contactId && e.startTime !== undefined && Date.parse(e.startTime) === start.getTime());
}
