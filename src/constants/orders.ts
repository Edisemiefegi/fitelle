import { PRODUCTION_STATUSES, type PaymentStatus, type ProductionStatus } from "@/types/order";

export const ORDER_STATUS_OPTIONS: { label: string; value: "all" | ProductionStatus }[] = [
  { label: "All statuses", value: "all" },
  ...PRODUCTION_STATUSES.map((status) => ({ label: status, value: status })),
];

export const PAYMENT_STATUS_OPTIONS: { label: string; value: "all" | PaymentStatus }[] = [
  { label: "All payments", value: "all" },
  { label: "Unpaid", value: "unpaid" },
  { label: "Partial", value: "partial" },
  { label: "Paid", value: "paid" },
];

export interface OrderFiltersState {
  status: "all" | ProductionStatus;
  paymentStatus: "all" | PaymentStatus;
  dateFrom: string | null;
  dateTo: string | null;
}
 
export function defaultOrderFilters(): OrderFiltersState {
  return { status: "all", paymentStatus: "all", dateFrom: null, dateTo: null };
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

export function derivePaymentStatus(total: number, paid: number): PaymentStatus {
  if (paid <= 0) return "unpaid";
  if (paid >= total) return "paid";
  return "partial";
}

export function isOverdue(dueDate: string | null, status: ProductionStatus): boolean {
  if (!dueDate || status === "Delivered") return false;
  return new Date(dueDate).getTime() < Date.now();
}

export function formatDueLabel(dueDate: string | null): string {
  if (!dueDate) return "No due date";
 
  const due = new Date(dueDate);
  const formatted = due.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
 
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((due.setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / msPerDay);
 
  if (diffDays === 0) return `Due today (${formatted})`;
  if (diffDays === 1) return `Due tomorrow (${formatted})`;
  if (diffDays > 1) return `Due ${formatted} (in ${diffDays} days)`;
  return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? "" : "s"} overdue`;
}