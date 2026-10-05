// GHL silently drops custom fields it doesn't recognise (and still returns
// 200), so we write them by id and log anything that has no matching field.

export interface FieldByKey { key: string; field_value: string }
export interface FieldById { id: string; field_value: string }

/** Map {key} fields to {id} fields using `ids` (key without "contact."). Blank values and unknown keys are dropped. */
export function toIdFields(fields: FieldByKey[], ids: Map<string, string>): FieldById[] {
  const out: FieldById[] = [];
  for (const f of fields) {
    if (!f.field_value?.trim()) continue;
    const id = ids.get(f.key);
    if (id) out.push({ id, field_value: f.field_value });
    else console.warn(`[ghl] no custom field "${f.key}" in this subaccount; value dropped`);
  }
  return out;
}

/** Only the fields that are still blank on the contact (first touch wins). */
export function blankOnly(fields: FieldById[], existing: { id: string; value?: unknown }[]): FieldById[] {
  const filled = new Set(existing.filter((f) => f.value !== undefined && f.value !== null && String(f.value).trim() !== '').map((f) => f.id));
  return fields.filter((f) => !filled.has(f.id));
}
