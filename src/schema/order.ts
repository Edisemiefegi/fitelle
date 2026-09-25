import { z } from "zod";
import { PRODUCTION_STATUSES } from "@/types/order";

export const orderRequirementSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  done: z.boolean(),
});

export const measurementSnapshotSchema = z.object({
  unit: z.enum(["in", "cm"]),
  values: z.record(z.string(), z.number().nullable()),
  customFields: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      category: z.enum(["upper", "lower", "custom"]),
      isCustom: z.boolean().optional(),
    }),
  ),
  source: z.enum(["customer_default", "order_specific"]),
});

export const orderSchema = z
  .object({
    customerId: z.string().min(1, "Select a customer for this order"),
    customerName: z.string().min(1),
    customerPhone: z.string().min(1),

    garmentType: z.string().min(1, "Garment type is required"),
    description: z.string().max(2000).optional().default(""),
    notes: z.string().max(2000).optional().default(""),
    dueDate: z.string().nullable().optional().default(null),

    requirements: z.array(orderRequirementSchema).default([]),
    fabricSource: z
      .enum(["customer_supplied", "needs_sourcing"])
      .default("customer_supplied"),

    measurements: measurementSnapshotSchema,

    status: z.enum(PRODUCTION_STATUSES).default("Order Received"),

    total: z.coerce.number().min(0, "Total can't be negative"),
    deposit: z.coerce.number().min(0, "Deposit can't be negative").default(0),
  })
  .refine((data) => data.deposit <= data.total, {
    message: "Deposit can't be more than the total",
    path: ["deposit"],
  });

export type OrderSchemaType = z.infer<typeof orderSchema>;

export function createPaymentSchema(balance: number) {
  return z.object({
    amount: z.coerce
      .number()
      .positive("Enter an amount greater than 0")
      .max(balance, `Amount can't exceed the remaining balance (${balance})`),
    note: z.string().max(200).optional(),
  });
}

export type PaymentSchemaType = z.infer<ReturnType<typeof createPaymentSchema>>;

export const quickCustomerSchema = z.object({
  name: z.string().min(2, "Enter the customer's name"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

export type QuickCustomerSchemaType = z.infer<typeof quickCustomerSchema>;
