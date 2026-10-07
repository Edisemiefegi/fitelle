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

export type PortfolioService = {
  title: string;
  description: string;
};

export type PortfolioContact = {
  location: string;
  phone: string;
  email: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  whatsapp: boolean;
};

/** One per business. Lives at `portfolios/{userId}`; its works are in the `works` subcollection. */
export type Portfolio = {
  id: string; // same as the owner's user id
  slug: string; // public URL segment, unique across portfolios

  brandName: string;
  tagline: string;
  introduction: string;
  about: string;
  designerBio: string;
  image: MediaFile | null;
  heroWorkId?: string | null; // the published work whose cover is the hero image; null/missing = latest work

  services: PortfolioService[];
  contact: PortfolioContact;

  createdAt: string;
  updatedAt: string;
};

/** Lives at `portfolios/{userId}/works/{workId}`. */
export type PortfolioWork = {
  id: string;

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

  createdAt: string;
  updatedAt: string;
};
