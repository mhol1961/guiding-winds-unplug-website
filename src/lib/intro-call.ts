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

/**
 * Remember `load()`'s result for `ttlMs` after it resolves. One load at a time:
 * concurrent callers share it however long it takes. Failures are not kept.
 * clear() forgets the value, and a load already in flight is not saved.
 */
export function shortCache<T>(ttlMs: number, load: () => Promise<T>, now = () => Date.now()) {
  let value: { at: number; v: T } | null = null;
  let pending: Promise<T> | null = null;
  let gen = 0;
  const fresh = () => value !== null && now() - value.at < ttlMs;
  return {
    /** True when get() would not call load(). */
    fresh: () => fresh() || pending !== null,
    get(): Promise<T> {
      if (fresh()) return Promise.resolve(value!.v);
      if (pending) return pending;
      const g = gen;
      pending = load().then(
        (v) => { if (g === gen) { value = { at: now(), v }; pending = null; } return v; },
        (e) => { if (g === gen) pending = null; throw e; },
      );
      return pending;
    },
    clear: () => { gen++; value = null; pending = null; },
  };
}
