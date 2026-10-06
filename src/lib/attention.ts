/**
 * "What needs the tailor's attention" rules.
 *
 * Pure and dependency-free on purpose: the app uses it for the Today section and
 * the notification list, and the push job in `functions/` uses the very same file
 * (it is copied there on deploy), so in-app alerts and push messages never disagree.
 */

export type AttentionKind =
  | "overdue"
  | "urgent"
  | "missing-measurement"
  | "reference-needed"
  | "schedule-fitting"
  | "payment-outstanding"
  | "workload-clash";

export type AttentionSeverity = "urgent" | "warning" | "info";

export interface AttentionItem {
  id: string; // stable per condition, e.g. "urgent:abc123"
  kind: AttentionKind;
  severity: AttentionSeverity;
  title: string;
  detail: string;
  orderId?: string;
}

/** The subset of an order the rules read. */
export interface AttentionOrder {
  id: string;
  customerName: string;
  garmentType: string;
  status: string;
  dueDate: string | null;
  fittingDate?: string | null;
  referenceImages: unknown[];
  measurements: { values: Record<string, number | null> };
  balance: number;
}

const BEFORE_CUTTING = ["Order Received", "Measuring"];
const BEFORE_FITTING = ["Order Received", "Measuring", "Cutting", "Sewing"];
const URGENT_WITHIN_DAYS = 2;
const CLASH_THRESHOLD = 3;

const SEVERITY_RANK: Record<AttentionSeverity, number> = { urgent: 0, warning: 1, info: 2 };

const naira = (amount: number) => `₦${new Intl.NumberFormat("en-NG").format(amount)}`;

const firstName = (name: string) => name.trim().split(/\s+/)[0] || "Customer";

const label = (o: AttentionOrder) => `${firstName(o.customerName)}'s ${o.garmentType.toLowerCase()}`;

/** Whole days from `today` to a "YYYY-MM-DD" (or ISO) date; negative when in the past. */
function daysUntil(date: string, today: Date): number {
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const start = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - start) / 86_400_000);
}

function dueWording(days: number): string {
  if (days === 0) return "due today";
  if (days === 1) return "due tomorrow";
  return `due in ${days} days`;
}

export function getAttentionItems(orders: AttentionOrder[], today = new Date()): AttentionItem[] {
  const items: AttentionItem[] = [];
  const open = orders.filter((o) => o.status !== "Delivered");

  for (const order of orders) {
    const days = order.dueDate ? daysUntil(order.dueDate, today) : null;
    const isOpen = order.status !== "Delivered";

    if (isOpen && days !== null && days < 0) {
      items.push({
        id: `overdue:${order.id}`,
        kind: "overdue",
        severity: "urgent",
        title: `${label(order)} — overdue`,
        detail: `Was due ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago.`,
        orderId: order.id,
      });
    } else if (isOpen && days !== null && days <= URGENT_WITHIN_DAYS) {
      items.push({
        id: `urgent:${order.id}`,
        kind: "urgent",
        severity: "urgent",
        title: `${label(order)} — ${dueWording(days)}`,
        detail: `Currently at ${order.status}.`,
        orderId: order.id,
      });
    }

    if (isOpen && BEFORE_FITTING.includes(order.status)) {
      const hasMeasurements = Object.values(order.measurements.values).some((v) => v != null);
      if (!hasMeasurements) {
        items.push({
          id: `missing-measurement:${order.id}`,
          kind: "missing-measurement",
          severity: "warning",
          title: `${label(order)} — missing measurements`,
          detail: "Add measurements before work goes any further.",
          orderId: order.id,
        });
      }
    }

    if (isOpen && BEFORE_CUTTING.includes(order.status) && order.referenceImages.length === 0) {
      items.push({
        id: `reference-needed:${order.id}`,
        kind: "reference-needed",
        severity: "info",
        title: `${label(order)} — reference needed`,
        detail: "No reference image yet. Ask the customer for one.",
        orderId: order.id,
      });
    }

    if (order.status === "Fitting" && !order.fittingDate) {
      items.push({
        id: `schedule-fitting:${order.id}`,
        kind: "schedule-fitting",
        severity: "warning",
        title: `${firstName(order.customerName)}'s fitting — needs scheduling`,
        detail: `${label(order)} is at the fitting stage but has no fitting date.`,
        orderId: order.id,
      });
    }

    if ((order.status === "Ready" || order.status === "Delivered") && order.balance > 0) {
      items.push({
        id: `payment-outstanding:${order.id}`,
        kind: "payment-outstanding",
        severity: "warning",
        title: `${firstName(order.customerName)}'s order — ${naira(order.balance)} balance outstanding`,
        detail: order.status === "Ready" ? "Ready for collection, but not fully paid." : "Delivered, but not fully paid.",
        orderId: order.id,
      });
    }
  }

  items.push(...findWorkloadClashes(open, today));

  return items.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}

/** Flags windows where 3+ open orders fall due within two consecutive days. */
function findWorkloadClashes(open: AttentionOrder[], today: Date): AttentionItem[] {
  const byDay = new Map<number, number>();
  for (const order of open) {
    if (!order.dueDate) continue;
    const days = daysUntil(order.dueDate, today);
    if (days >= 0) byDay.set(days, (byDay.get(days) ?? 0) + 1);
  }

  const clashes: AttentionItem[] = [];
  let coveredUntil = -1;

  for (const day of [...byDay.keys()].sort((a, b) => a - b)) {
    if (day <= coveredUntil) continue;
    const count = (byDay.get(day) ?? 0) + (byDay.get(day + 1) ?? 0);
    if (count < CLASH_THRESHOLD) continue;

    coveredUntil = day + 1;
    clashes.push({
      id: `workload-clash:${day}`,
      kind: "workload-clash",
      severity: "warning",
      title: `${count} orders due around the same time`,
      detail: `${count} pieces are due ${day === 0 ? "today" : day === 1 ? "tomorrow" : `in ${day} days`} or the day after. Plan ahead.`,
    });
  }

  return clashes;
}

export function attentionHeadline(count: number): string {
  if (count === 0) return "You're all caught up";
  return `${count} thing${count === 1 ? " needs" : "s need"} your attention`;
}
