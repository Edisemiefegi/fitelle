import { daysUntil, parseDateKey, toDateKey } from "@/lib/date";
import {
  PRODUCTION_STATUSES,
  type PaymentStatus,
  type ProductionStatus,
  type OrderType,
} from "@/types/order";

export const ORDER_STATUS_OPTIONS: {
  label: string;
  value: "all" | ProductionStatus;
}[] = [
  { label: "All statuses", value: "all" },
  ...PRODUCTION_STATUSES.map((status) => ({ label: status, value: status })),
];

export const PAYMENT_STATUS_OPTIONS: {
  label: string;
  value: "all" | PaymentStatus;
}[] = [
  { label: "All payments", value: "all" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Partial", value: "partial" },
  { label: "Paid", value: "paid" },
];

export type OrderDateField = "dueDate" | "createdAt";

export const DATE_FIELD_OPTIONS: { label: string; value: OrderDateField }[] = [
  { label: "Due date", value: "dueDate" },
  { label: "Order date", value: "createdAt" },
];

export interface OrderFiltersState {
  status: "all" | ProductionStatus;
  paymentStatus: "all" | PaymentStatus;
  dateField: OrderDateField; // which date the range below applies to
  dateFrom: string | null; // "YYYY-MM-DD", or empty for no lower bound
  dateTo: string | null; // "YYYY-MM-DD", or empty for no upper bound
}

export function defaultOrderFilters(): OrderFiltersState {
  return { status: "all", paymentStatus: "all", dateField: "dueDate", dateFrom: null, dateTo: null };
}

/** The calendar day ("YYYY-MM-DD", local time) an order's date falls on; null when it has none. */
export function orderDay(order: Pick<OrderType, "dueDate" | "createdAt">, field: OrderDateField): string | null {
  const value = order[field];
  if (!value) return null;
  return field === "dueDate" ? value.slice(0, 10) : toDateKey(new Date(value)); // due dates are already plain days
}

/** True when the order's chosen date lies inside the (inclusive) range; an empty range matches everything. */
export function matchesDateRange(order: Pick<OrderType, "dueDate" | "createdAt">, filters: OrderFiltersState): boolean {
  if (!filters.dateFrom && !filters.dateTo) return true;
  const day = orderDay(order, filters.dateField);
  if (!day) return false;
  return (!filters.dateFrom || day >= filters.dateFrom) && (!filters.dateTo || day <= filters.dateTo);
}

export const FABRIC_SOURCE_OPTIONS = [
  { label: "Customer supplied", value: "customer_supplied" as const },
  { label: "Needs sourcing", value: "needs_sourcing" as const },
];

export function statusIndex(status: ProductionStatus): number {
  return PRODUCTION_STATUSES.indexOf(status);
}

export function statusProgress(status: ProductionStatus): number {
  const idx = statusIndex(status);
  return Math.round((idx / (PRODUCTION_STATUSES.length - 1)) * 100);
}

export function derivePaymentStatus(
  total: number,
  paid: number,
): PaymentStatus {
  if (paid <= 0) return "unpaid";
  if (paid >= total) return "paid";
  return "partial";
}

export function isDueWithin(
  dueDate: string | null,
  status: ProductionStatus,
  days: number,
): boolean {
  if (!dueDate || status === "Delivered") return false;
  const diff = daysUntil(dueDate);
  return diff >= 0 && diff <= days;
}

/** Overdue only once the due day has passed; an order due today is not overdue yet. */
export function isOverdue(
  dueDate: string | null,
  status: ProductionStatus,
): boolean {
  if (!dueDate || status === "Delivered") return false;
  return daysUntil(dueDate) < 0;
}

export function formatDueLabel(dueDate: string | null): string {
  if (!dueDate) return "No due date";

  const formatted = parseDateKey(dueDate).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
  const diff = daysUntil(dueDate);

  if (diff === 0) return `Due today (${formatted})`;
  if (diff === 1) return `Due tomorrow (${formatted})`;
  if (diff > 1) return `Due ${formatted} (in ${diff} days)`;
  return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} overdue`;
}

export const STATUS_BADGE_CLASSES: Record<ProductionStatus, string> = {
  "Order Received": "bg-blue-50 text-blue-700",
  Measuring: "bg-purple-50 text-purple-700",
  Cutting: "bg-amber-50 text-amber-700",
  Sewing: "bg-orange-50 text-orange-700",
  Fitting: "bg-pink-50 text-pink-700",
  Finishing: "bg-indigo-50 text-indigo-700",
  Ready: "bg-emerald-50 text-emerald-700",
  Delivered: "bg-green-50 text-green-700",
};
