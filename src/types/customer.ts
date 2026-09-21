export type MeasurementCategory = "upper" | "lower" | "custom";

export interface MeasurementField {
  key: string;
  label: string;
  category: MeasurementCategory;
  isCustom?: boolean;
}

export interface MeasurementForm {
  bust: number | null;
  waist: number | null;
  hips: number | null;
  shoulder: number | null;
  sleeve: number | null;
  armhole: number | null;
  neck: number | null;
  blouseLength: number | null;
  skirtLength: number | null;
  trouserLength: number | null;
  thigh: number | null;
  knee: number | null;
  ankle: number | null;
}

export type Unit = "in" | "cm";

export type CustomerType = {
  id: string;
  name: string;
  phone: string;
  notes: string;
  unit: Unit;
  measurements: Record<string, number | null>;
  customFields: MeasurementField[];
  createdAt?: string;
  updatedAt?: string;
};
