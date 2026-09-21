import * as z from "zod";

export const authSchema = (isRegister = false) =>
  z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Paassword must be at least 8 characters long"),
    brandName: isRegister ? z.string().max(100) : z.string().optional(),
  });

export type AuthSchemaType = z.infer<ReturnType<typeof authSchema>>;

export const measurementFieldSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  category: z.enum(["upper", "lower", "custom"]),
  isCustom: z.boolean().optional(),
});

export const customerSchema = z.object({
  id: z.string().optional().default(""),
  name: z.string().min(2, "required"),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number looks too long"),
  measurements: z.record(z.string(), z.number().nullable()),
  customFields: z.array(measurementFieldSchema).default([]),

  unit: z.string(),
  notes: z.string().optional(),

});

export type CustomerSchemaType = z.infer<typeof customerSchema>;

export const newFieldLabelSchema = z
  .string()
  .trim()
  .min(2, "Label must be at least 2 characters")
  .max(30, "Keep it under 30 characters");

