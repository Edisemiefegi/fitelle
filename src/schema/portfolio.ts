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