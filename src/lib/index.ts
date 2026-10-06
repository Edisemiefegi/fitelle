export function generateId(prefix = ""): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
      : Math.random().toString(36).slice(2, 14);

  return prefix ? `${prefix}_${random}` : random;
}

export function toWhatsAppLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("0")
    ? `234${digits.slice(1)}`
    : digits;
  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${withCountryCode}${query}`;
}

export function formatCurrency(amount: number): string {
  return `₦${new Intl.NumberFormat("en-NG").format(amount)}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "atelier"
  );
}

const SOCIAL_BASE_URLS = {
  instagram: "https://instagram.com/",
  tiktok: "https://tiktok.com/@",
  facebook: "https://facebook.com/",
} as const;

/** Accepts a full URL or a bare handle ("@didi", "didi") and returns a link. */
export function toSocialLink(platform: keyof typeof SOCIAL_BASE_URLS, value: string): string {
  const handle = value.trim();
  if (!handle) return "";
  if (/^https?:\/\//i.test(handle)) return handle;
  return `${SOCIAL_BASE_URLS[platform]}${handle.replace(/^@/, "")}`;
}
