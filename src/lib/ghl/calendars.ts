import { ghl } from './client';

export interface FreeSlot {
  startTime: string; // ISO
  endTime: string;
}

interface FreeSlotsResponse {
  // GHL returns a date-keyed object of slots arrays.
  [date: string]: { slots: string[] };
}

export async function getFreeSlots(
  calendarId: string,
  startDate: string,
  endDate: string,
): Promise<FreeSlot[]> {
  if (!calendarId) return [];
  const qs = new URLSearchParams({
    startDate: new Date(startDate).getTime().toString(),
    endDate: new Date(endDate).getTime().toString(),
  });
  const res = await ghl<FreeSlotsResponse>(
    `/calendars/${calendarId}/free-slots?${qs.toString()}`,
    { method: 'GET' },
  );
  // Flatten the date-keyed shape into a flat array.
  const slots: FreeSlot[] = [];
  for (const [, value] of Object.entries(res)) {
    if (value?.slots) {
      for (const slotIso of value.slots) {
        const start = new Date(slotIso);
        slots.push({
          startTime: start.toISOString(),
          endTime: new Date(start.getTime() + 60 * 60 * 1000).toISOString(),
        });
      }
    }
  }
  return slots;
}

