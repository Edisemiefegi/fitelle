import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { OrderType } from "@/types/order";
import { formatCurrency, formatDate } from "@/lib";

interface BusinessInfo {
  businessName?: string;
  phone?: string;
  location?: string;
}

/** Exports a list of orders (e.g. the currently filtered view) as a table. */
export function exportOrdersToPdf(orders: OrderType[], business: BusinessInfo = {}) {
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "landscape" });
  const marginX = 40;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(business.businessName || "Orders report", marginX, 40);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120);
  doc.text(`${orders.length} order${orders.length === 1 ? "" : "s"} · generated ${formatDate(new Date().toISOString())}`, marginX, 56);
  doc.setTextColor(20);

  const totalCollected = orders.reduce((sum, o) => sum + o.paid, 0);
  const totalOutstanding = orders.reduce((sum, o) => sum + o.balance, 0);
  doc.setFontSize(9);
  doc.text(
    `Collected: ${formatCurrency(totalCollected)}   ·   Outstanding: ${formatCurrency(totalOutstanding)}`,
    marginX,
    70,
  );

  autoTable(doc, {
    startY: 85,
    margin: { left: marginX, right: marginX },
    styles: { fontSize: 8, cellPadding: 5 },
    headStyles: { fillColor: [30, 30, 30] },
    head: [["Order ID", "Customer", "Garment", "Status", "Due date", "Total", "Paid", "Balance", "Payment"]],
    body: orders.map((order) => [
      order.id,
      order.customerName,
      order.garmentType,
      order.status,
      order.dueDate ? formatDate(order.dueDate) : "—",
      formatCurrency(order.total),
      formatCurrency(order.paid),
      formatCurrency(order.balance),
      order.paymentStatus,
    ]),
  });

  const date = new Date().toISOString().slice(0, 10);
  doc.save(`orders-${date}.pdf`);
}