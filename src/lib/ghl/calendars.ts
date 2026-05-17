import { ghl, locationId } from './client';

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

interface HoldAppointmentInput {
  calendarId: string;
  contactId: string;
  startTime: string;
  endTime: string;
  title?: string;
  notes?: string;
}

interface AppointmentResponse {
  id: string;
  calendarId: string;
  contactId: string;
  startTime: string;
  endTime: string;
  appointmentStatus: string;
}

/**
 * Create a 72-hour soft cabin hold on the GHL calendar. The appointment
 * has status `new` initially; Dodie's "hold expiring" workflow (W6)
 * watches the `hold-cabin` tag and fires reminders + cancellation at
 * the 48h / 72h marks.
 */
export async function createHoldAppointment(
  input: HoldAppointmentInput,
): Promise<AppointmentResponse> {
  return ghl<AppointmentResponse>('/calendars/events/appointments', {
    method: 'POST',
    body: {
      calendarId: input.calendarId,
      locationId: locationId(),
      contactId: input.contactId,
      startTime: input.startTime,
      endTime: input.endTime,
      title: input.title ?? 'Cabin hold — 72h',
      appointmentStatus: 'new',
      notes: input.notes,
      ignoreFreeSlotValidation: false,
    },
  });
}
