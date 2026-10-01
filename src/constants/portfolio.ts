import { PORTFOLIO_CATEGORIES, type PortfolioWork } from "@/types/portfolio";
import type { MediaFile } from "@/types/index";

export const CATEGORY_OPTIONS = PORTFOLIO_CATEGORIES.map((c) => ({
  label: c,
  value: c,
}));

export const STATUS_FILTER_OPTIONS = [
  { label: "All works", value: "all" as const },
  { label: "Published", value: "published" as const },
  { label: "Drafts", value: "draft" as const },
];

/** The work's chosen cover, falling back to the first image. */
export function getCoverImage(
  work: Pick<PortfolioWork, "images" | "coverImageId">,
): MediaFile | null {
  if (!work.images.length) return null;
  return (
    work.images.find((img) => img.fileId === work.coverImageId) ??
    work.images[0]
  );
}
