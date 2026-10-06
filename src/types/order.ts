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


/** A progress post for the customer: photos and/or a short note, shown on the tracking link only when visible. */
export interface ProgressUpdate {
  id: string;
  note: string;
  images: OrderImage[];
  visibleToCustomer: boolean;
  createdAt: string;
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
  userId?: string; // owner; legacy orders created before this field have none

  customerId: string;
  customerName: string;
  customerPhone: string;

  garmentType: string;
  description: string;
  notes: string;
  dueDate: string | null; 
  fittingDate?: string | null; // when the customer comes in for a fitting

  requirements: OrderRequirement[];
  fabricSource: FabricSource;

  referenceImages: OrderImage[];
  progressUpdates?: ProgressUpdate[]; // missing on orders created before this existed

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
  | "fittingDate"
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
  progressUpdates: ProgressUpdate[]; // only the ones the tailor chose to share
  brand: PublicOrderBrand | null;
};

/** Who the order is from, so the tracking page can carry the business's identity. */
export interface PublicOrderBrand {
  name: string;
  logoUrl: string | null;
  location: string;
  phone: string;
  whatsapp: boolean;
  instagram: string;
  portfolioSlug: string;
}