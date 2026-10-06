import { z } from "zod";
import { PORTFOLIO_CATEGORIES } from "@/types/portfolio";

export const portfolioWorkSchema = z.object({
  title: z.string().min(2, "Give this piece a title"),
  category: z.enum(PORTFOLIO_CATEGORIES),
  description: z.string().max(2000).optional().default(""),
  fabric: z.string().max(200).optional().default(""),
  occasion: z.string().max(200).optional().default(""),
  tags: z.array(z.string().min(1)).default([]),
});

export type PortfolioWorkSchemaType = z.infer<typeof portfolioWorkSchema>;

export const brandSchema = z.object({
  brandName: z.string().trim().min(2, "Enter your brand name"),
  tagline: z.string().trim().max(80, "Keep it under 80 characters"),
  introduction: z.string().trim().max(300, "Keep it under 300 characters"),
  about: z.string().trim().max(2000),
  designerBio: z.string().trim().max(2000),
  image: z
    .object({ fileId: z.string(), url: z.string(), uploadedAt: z.string() })
    .nullable(),
});

export const servicesSchema = z.object({
  services: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Give each service a name"),
        description: z.string().trim().max(300, "Keep it under 300 characters"),
      }),
    )
    .max(8, "You can list up to 8 services"),
});

export const contactSchema = z.object({
  contact: z.object({
    location: z.string().trim(),
    phone: z.string().trim(),
    email: z.union([z.literal(""), z.string().trim().email("Enter a valid email")]),
    instagram: z.string().trim(),
    tiktok: z.string().trim(),
    facebook: z.string().trim(),
    whatsapp: z.boolean(),
  }),
});
