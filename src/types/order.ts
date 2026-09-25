import type { MeasurementField, Unit } from "@/types/customer";

export const PRODUCTION_STATUSES = [
  "Order Received",
  "Measuring",
  "Cutting",
  "Sewing",
  "Fitting",
  "Finishing",
  "Ready",
  "Delivered",
] as const;

export type ProductionStatus = (typeof PRODUCTION_STATUSES)[number];

export type PaymentStatus = "unpaid" | "partial" | "paid";

export type FabricSource = "customer_supplied" | "needs_sourcing";

export interface OrderRequirement {
  id: string;
  label: string;
  done: boolean;
}

export interface OrderPayment {
  id: string;
  amount: number;
  note?: string;
  recordedAt: string;
}

export interface OrderImage {
  fileId: string; 
  url: string; 
  uploadedAt: string;
  visibleToCustomer?: boolean; 
}


export interface MeasurementSnapshot {
  unit: Unit;
  values: Record<string, number | null>;
  customFields: MeasurementField[];
  source: "customer_default" | "order_specific";
}

export interface OrderStatusEvent {
  status: ProductionStatus;
  at: string;
}

export type OrderType = {
  id: string;

  customerId: string;
  customerName: string;
  customerPhone: string;

  garmentType: string;
  description: string;
  notes: string;
  dueDate: string | null; 

  requirements: OrderRequirement[];
  fabricSource: FabricSource;

  referenceImages: OrderImage[];
  progressImages: OrderImage[];

  measurements: MeasurementSnapshot;

  status: ProductionStatus;
  statusHistory: OrderStatusEvent[];

  total: number;
  payments: OrderPayment[];

  paid: number;
  balance: number;
  paymentStatus: PaymentStatus;

  trackingSlug: string; 

  createdAt?: string;
  updatedAt?: string;
};

export type PublicOrderView = Pick<
  OrderType,
  | "id"
  | "garmentType"
  | "description"
  | "dueDate"
  | "requirements"
  | "referenceImages"
  | "status"
  | "statusHistory"
  | "total"
  | "paid"
  | "balance"
  | "paymentStatus"
  | "customerName"
  | "trackingSlug"
> & {
  progressImages: OrderImage[]; 
};