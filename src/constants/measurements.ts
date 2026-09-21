import type { CustomerType, MeasurementField } from "@/types/customer";

export const UPPER_BODY_FIELDS: MeasurementField[] = [
  { key: "bust", label: "Bust", category: "upper" },
  { key: "waist", label: "Waist", category: "upper" },
  { key: "shoulder", label: "Shoulder", category: "upper" },
  { key: "sleeve", label: "Sleeve", category: "upper" },
  { key: "armhole", label: "Armhole", category: "upper" },
  { key: "neck", label: "Neck", category: "upper" },
  { key: "blouseLength", label: "Blouse length", category: "upper" },
];

export const LOWER_BODY_FIELDS: MeasurementField[] = [
  { key: "hips", label: "Hips", category: "lower" },
  { key: "thigh", label: "Thigh", category: "lower" },
  { key: "knee", label: "Knee", category: "lower" },
  { key: "ankle", label: "Ankle", category: "lower" },
  { key: "skirtLength", label: "Skirt length", category: "lower" },
  { key: "trouserLength", label: "Trouser length", category: "lower" },
];

export const DEFAULT_MEASUREMENT_FIELDS: MeasurementField[] = [
  ...UPPER_BODY_FIELDS,
  ...LOWER_BODY_FIELDS,
];

export function createEmptyMeasurements(): Record<string, number | null> {
  return DEFAULT_MEASUREMENT_FIELDS.reduce(
    (acc, field) => {
      acc[field.key] = null;
      return acc;
    },
    {} as Record<string, number | null>,
  );
}

export function slugifyFieldKey(label: string): string {
  const camel = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_match, chr: string) => chr.toUpperCase());

  const safe = camel.replace(/[^a-zA-Z0-9]/g, "");
  return safe || "field";
}


export function resolveMeasurementFields(
  customer: Pick<CustomerType, "measurements" | "customFields">,
): MeasurementField[] {
  const defaultMap = new Map(DEFAULT_MEASUREMENT_FIELDS.map((f) => [f.key, f]));
  const customMap = new Map((customer.customFields ?? []).map((f) => [f.key, f]));

  return Object.keys(customer.measurements ?? {}).map((key) => {
    return (
      defaultMap.get(key) ??
      customMap.get(key) ?? {
        key,
        label: key,
        category: "custom" as const,
        isCustom: true,
      }
    );
  });
}

export function generateUniqueFieldKey(
  label: string,
  existingKeys: Iterable<string>,
): string {
  const taken = new Set(existingKeys);
  const base = slugifyFieldKey(label);

  let key = base;
  let suffix = 1;
  while (taken.has(key)) {
    key = `${base}${suffix++}`;
  }

  return key;
}
