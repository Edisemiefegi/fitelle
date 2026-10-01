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



import { collection, db, query, where, limit, getDocs } from "@/service/firebase";

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "atelier"
  );
}

async function slugExists(slug: string, excludeUserId?: string): Promise<boolean> {
  const snapshot = await getDocs(query(collection(db, "users"), where("slug", "==", slug), limit(5)));
  return snapshot.docs.some((d) => d.id !== excludeUserId);
}

export async function ensureUniqueSlug(base: string, excludeUserId?: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let suffix = 2;

  while (await slugExists(candidate, excludeUserId)) {
    candidate = `${root}-${suffix++}`;
  }

  return candidate;
}
