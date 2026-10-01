import type { MediaFile } from "@/types/index";

export const PORTFOLIO_CATEGORIES = [
  "Bridal",
  "Aso-Ebi",
  "Native Wear",
  "Agbada",
  "Evening Wear",
  "Corporate",
  "Casual",
  "Other",
] as const;

export type PortfolioCategory = (typeof PORTFOLIO_CATEGORIES)[number];

export type PortfolioStatus = "draft" | "published";

export type PortfolioWork = {
  id: string;
  userId: string; // owner — portfolio is the one place in this app scoped per business

  title: string;
  category: PortfolioCategory;
  description: string;
  fabric: string;
  occasion: string;
  tags: string[];

  images: MediaFile[]; // display order == saved order
  coverImageId: string | null; // a fileId from `images`; falls back to images[0] when null

  status: PortfolioStatus;
  publishedAt: string | null;

  createdAt?: string;
  updatedAt?: string;
};

/** Public-safe projection — no userId, nothing a visitor shouldn't see. */
export type PublicPortfolioWork = Pick<
  PortfolioWork,
  "id" | "title" | "category" | "description" | "fabric" | "occasion" | "tags" | "images" | "coverImageId"
>;

export interface PublicBusinessProfile {
  businessName: string;
  bio: string;
  profileImage: string;
  location: string;
  phoneNumber: string;
  whatsapp: boolean;
  slug: string;
}