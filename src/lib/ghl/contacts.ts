import { ghl, locationId } from './client';
import { toIdFields, blankOnly, type FieldByKey, type FieldById } from './fields';

interface ContactPayload {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags?: string[];
  customFields?: FieldByKey[];
  source?: string;
}

interface UpsertResponse {
  contact: {
    id: string;
    email: string;
    locationId: string;
  };
  new: boolean;
}

/**
 * Upsert a contact in GHL (deduplicated on email), then ADD `tags`.
 * Tags never go in the upsert body: GHL's upsert "will overwrite all current
 * tags associated with the contact", which wiped existing contacts' tags.
 * The separate add-tags call only adds. If tagging fails this throws, so the
 * route shows its email fallback instead of silently skipping the workflows
 * those tags trigger (re-adding a tag on retry is harmless).
 */
export async function upsertContact(payload: ContactPayload): Promise<UpsertResponse> {
  const res = await ghl<UpsertResponse>('/contacts/upsert', {
    method: 'POST',
    body: {
      locationId: locationId(),
      source: payload.source ?? 'website-2026',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      customFields: payload.customFields?.length ? await byId(payload.customFields) : undefined,
    },
  });
  if (payload.tags?.length && res?.contact?.id) await tagContact(res.contact.id, payload.tags);
  return res;
}

let fieldIdCache: Promise<Map<string, string>> | null = null;

/** Custom field ids by key (without "contact."), cached per Worker isolate. */
function fieldIds(): Promise<Map<string, string>> {
  fieldIdCache ??= ghl<{ customFields: { id: string; fieldKey: string }[] }>(
    `/locations/${locationId()}/customFields?model=contact`,
  )
    .then((r) => new Map(r.customFields.map((f) => [f.fieldKey.replace(/^contact\./, ''), f.id])))
    .catch((err) => {
      fieldIdCache = null;
      throw err;
    });
  return fieldIdCache;
}

/** Fields by id; if the id lookup itself fails, send keys rather than lose the lead. */
async function byId(fields: FieldByKey[]): Promise<(FieldById | FieldByKey)[]> {
  try {
    return toIdFields(fields, await fieldIds());
  } catch (err) {
    console.error('[ghl] custom field lookup failed, sending by key', err);
    return fields.filter((f) => f.field_value?.trim());
  }
}

/** Write fields only where the contact has no value yet (ad attribution: first touch wins). */
export async function fillBlankFields(contactId: string, fields: FieldByKey[]): Promise<void> {
  const wanted = toIdFields(fields, await fieldIds());
  if (!wanted.length) return;
  const { contact } = await ghl<{ contact: { customFields?: { id: string; value?: unknown }[] } }>(`/contacts/${contactId}`);
  const missing = blankOnly(wanted, contact.customFields ?? []);
  if (missing.length) await ghl(`/contacts/${contactId}`, { method: 'PUT', body: { customFields: missing } });
}

/** Tag an existing contact. Adds tags; does not remove existing ones. */
export async function tagContact(contactId: string, tags: string[]): Promise<void> {
  if (tags.length === 0) return;
  await ghl(`/contacts/${contactId}/tags`, {
    method: 'POST',
    body: { tags },
  });
}

/** Ad attribution onto the contact (first touch wins). Never throws: a lead is never lost over this. */
export async function saveAttribution(contactId: string | undefined, attribution: Record<string, string>): Promise<void> {
  if (!contactId || !Object.keys(attribution).length) return;
  try {
    await fillBlankFields(contactId, Object.entries(attribution).map(([key, field_value]) => ({ key, field_value })));
  } catch (err) {
    console.error('[ghl] attribution write failed', err);
  }
}
