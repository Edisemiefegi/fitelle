export type MeasurementCategory = "upper" | "lower" | "custom";

export interface MeasurementField {
  key: string;
  label: string;
  category: MeasurementCategory;
  isCustom?: boolean;
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
