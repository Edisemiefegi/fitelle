import { collection, db, doc, getDoc, query, where, limit, getDocs } from "@/service/firebase";
import type { PublicBusinessProfile, PublicPortfolioWork } from "@/types/portfolio";

export async function fetchBusinessBySlug(
  slug: string,
): Promise<(PublicBusinessProfile & { userId: string }) | null> {
  const snapshot = await getDocs(query(collection(db, "users"), where("slug", "==", slug), limit(1)));
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const user = docSnap.data() as Record<string, any>;

  return {
    userId: docSnap.id,
    businessName: user.brandName ?? "",
    bio: user.description ?? "",
    profileImage: user.profileImage ?? "",
    location: user.location ?? "",
    phoneNumber: user.phoneNumber ?? "",
    whatsapp: Boolean(user.whatsapp),
    slug: user.slug ?? slug,
  };
}

export async function fetchPublishedWorks(userId: string): Promise<PublicPortfolioWork[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "portfolio_works"),
      where("userId", "==", userId),
      where("status", "==", "published"),
    ),
  );

  return snapshot.docs
    .map((d) => {
      const work = d.data() as Record<string, any>;
      return {
        id: d.id,
        title: work.title,
        category: work.category,
        description: work.description,
        fabric: work.fabric,
        occasion: work.occasion,
        tags: work.tags ?? [],
        images: work.images ?? [],
        coverImageId: work.coverImageId ?? null,
        publishedAt: work.publishedAt ?? null,
      } as PublicPortfolioWork & { publishedAt: string | null };
    })
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

export async function fetchPublicWork(userId: string, workId: string): Promise<PublicPortfolioWork | null> {
  const snapshot = await getDoc(doc(db, "portfolio_works", workId));
  if (!snapshot.exists()) return null;

  const work = snapshot.data() as Record<string, any>;
  // Never leak a draft, or another business's work, through a guessed/old id.
  if (work.userId !== userId || work.status !== "published") return null;

  return {
    id: snapshot.id,
    title: work.title,
    category: work.category,
    description: work.description,
    fabric: work.fabric,
    occasion: work.occasion,
    tags: work.tags ?? [],
    images: work.images ?? [],
    coverImageId: work.coverImageId ?? null,
  };
}