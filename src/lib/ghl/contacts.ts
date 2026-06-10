import { ghl, locationId } from './client';

interface ContactPayload {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  tags?: string[];
  customFields?: { key: string; field_value: string }[];
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
 * Upsert a contact in GHL. The upsert endpoint deduplicates on email - if
 * the email already exists in the subaccount, it returns the existing
 * contact and merges tags + customFields instead of creating a duplicate.
 * See https://highlevel.stoplight.io/docs/integrations/contacts-upsert
 */
export async function upsertContact(payload: ContactPayload): Promise<UpsertResponse> {
  return ghl<UpsertResponse>('/contacts/upsert', {
    method: 'POST',
    body: {
      locationId: locationId(),
      source: payload.source ?? 'website-2026',
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      tags: payload.tags,
      customFields: payload.customFields,
    },
  });
}

/** Tag an existing contact. Adds tags; does not remove existing ones. */
export async function tagContact(contactId: string, tags: string[]): Promise<void> {
  if (tags.length === 0) return;
  await ghl(`/contacts/${contactId}/tags`, {
    method: 'POST',
    body: { tags },
  });
}
