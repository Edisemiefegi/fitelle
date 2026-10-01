import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { OrderType } from "@/types/order";
import { formatCurrency, formatDate } from "@/lib";

interface BusinessInfo {
  businessName?: string;
  phone?: string;
  location?: string;
}

export function exportOrderToPdf(order: OrderType, business: BusinessInfo = {}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 50;

  function line(text: string, opts: { size?: number; bold?: boolean; gap?: number } = {}) {
    doc.setFontSize(opts.size ?? 10);
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.text(text, marginX, y);
    y += opts.gap ?? 16;
  }

  function sectionTitle(text: string) {
    y += 6;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120);
    doc.text(text.toUpperCase(), marginX, y);
    doc.setTextColor(20);
    y += 14;
  }

  function checkPageBreak() {
    if (y > pageHeight - 70) {
      doc.addPage();
      y = 50;
    }
  }

  // Header
  line(business.businessName || "Order summary", { size: 16, bold: true, gap: 20 });
  line(`Order ${order.id}`, { size: 10, gap: 14 });
  line(`Issued ${formatDate(new Date().toISOString())}`, { size: 9, gap: 18 });

  doc.setDrawColor(230);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 20;

  // Customer
  sectionTitle("Customer");
  line(order.customerName, { bold: true });
  line(order.customerPhone);

  // Order details
  sectionTitle("Order details");
  line(`Garment: ${order.garmentType}`);
  if (order.description) line(`Description: ${order.description}`);
  line(`Status: ${order.status}`);
  line(`Due date: ${order.dueDate ? formatDate(order.dueDate) : "Not set"}`);
  line(`Fabric: ${order.fabricSource === "customer_supplied" ? "Customer supplied" : "Needs sourcing"}`);

  // Requirements
  if (order.requirements.length) {
    sectionTitle("Requirements");
    order.requirements.forEach((r) => {
      checkPageBreak();
      line(`${r.done ? "[x]" : "[ ]"} ${r.label}`, { size: 9 });
    });
  }

  // Measurements
  const measurementEntries = Object.entries(order.measurements.values).filter(
    ([, v]) => v !== null && v !== undefined,
  );
  if (measurementEntries.length) {
    sectionTitle(`Measurements (${order.measurements.unit})`);
    measurementEntries.forEach(([key, value]) => {
      checkPageBreak();
      line(`${key}: ${value}${order.measurements.unit}`, { size: 9 });
    });
  }

  // Payment summary
  checkPageBreak();
  sectionTitle("Payment summary");
  line(`Total: ${formatCurrency(order.total)}`);
  line(`Paid: ${formatCurrency(order.paid)}`);
  line(`Balance: ${formatCurrency(order.balance)}`, { bold: order.balance > 0 });
  line(`Status: ${order.paymentStatus.toUpperCase()}`, { gap: 20 });

  if (order.payments.length) {
    sectionTitle("Payment history");
    order.payments.forEach((p) => {
      checkPageBreak();
      line(`${formatDate(p.recordedAt)} — ${formatCurrency(p.amount)}${p.note ? ` (${p.note})` : ""}`, {
        size: 9,
      });
    });
  }

  // Footer
  const footer = [business.phone, business.location].filter(Boolean).join(" · ");
  if (footer) {
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(footer, marginX, pageHeight - 30);
  }

  doc.save(`order-${order.id}.pdf`);
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