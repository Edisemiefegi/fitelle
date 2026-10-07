import {
  addDoc,
  collection,
  db,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  updateDoc,
  where,
} from "@/service/firebase";
import { slugify } from "@/lib";
import type { UserType } from "@/types";
import type { Portfolio, PortfolioWork } from "@/types/portfolio";

const PORTFOLIOS = "portfolios";
const WORKS = "works";

const portfolioDoc = (userId: string) => doc(db, PORTFOLIOS, userId);
const worksCollection = (userId: string) => collection(db, PORTFOLIOS, userId, WORKS);

type EditablePortfolio = Partial<Omit<Portfolio, "id" | "slug" | "createdAt" | "updatedAt">>;
type NewWork = Omit<PortfolioWork, "id" | "createdAt" | "updatedAt">;

// ── Portfolio ───────────────────────────────────────────────────────────

export async function getPortfolio(userId: string): Promise<Portfolio | null> {
  const snapshot = await getDoc(portfolioDoc(userId));
  return snapshot.exists() ? ({ ...snapshot.data(), id: snapshot.id } as Portfolio) : null;
}

export async function getPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  const snapshot = await getDocs(query(collection(db, PORTFOLIOS), where("slug", "==", slug), limit(1)));
  if (snapshot.empty) return null;
  const match = snapshot.docs[0];
  return { ...match.data(), id: match.id } as Portfolio;
}

async function findFreeSlug(base: string, userId: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let suffix = 2;

  for (;;) {
    const taken = await getDocs(query(collection(db, PORTFOLIOS), where("slug", "==", candidate), limit(2)));
    if (taken.docs.every((d) => d.id === userId)) return candidate;
    candidate = `${root}-${suffix++}`;
  }
}

/** First-time setup: seeds the portfolio from the business profile the user already filled in. */
export async function createPortfolio(user: UserType): Promise<Portfolio> {
  const now = new Date().toISOString();
  const portfolio: Portfolio = {
    id: user.id,
    slug: await findFreeSlug(user.brandName, user.id),
    brandName: user.brandName ?? "",
    tagline: "",
    introduction: "",
    about: "",
    designerBio: "",
    image: null,
    heroWorkId: null,
    services: [],
    contact: {
      location: "",
      phone: user.phoneNumber ?? "",
      email: user.email ?? "",
      instagram: "",
      tiktok: "",
      facebook: "",
      whatsapp: true,
    },
    createdAt: now,
    updatedAt: now,
  };

  await setDoc(portfolioDoc(user.id), portfolio);
  return portfolio;
}

export async function updatePortfolio(userId: string, updates: EditablePortfolio): Promise<string> {
  const updatedAt = new Date().toISOString();
  await updateDoc(portfolioDoc(userId), { ...updates, updatedAt });
  return updatedAt;
}

// ── Works ───────────────────────────────────────────────────────────────

function toWork(snapshot: { id: string; data(): unknown }): PortfolioWork {
  return { ...(snapshot.data() as Omit<PortfolioWork, "id">), id: snapshot.id };
}

function newestFirst(a: PortfolioWork, b: PortfolioWork) {
  return b.createdAt.localeCompare(a.createdAt);
}

export async function listWorks(userId: string): Promise<PortfolioWork[]> {
  const snapshot = await getDocs(worksCollection(userId));
  return snapshot.docs.map(toWork).sort(newestFirst);
}

export async function listPublishedWorks(userId: string): Promise<PortfolioWork[]> {
  const snapshot = await getDocs(query(worksCollection(userId), where("status", "==", "published")));
  return snapshot.docs
    .map(toWork)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

/** Returns null for drafts, so an unpublished piece can't be reached by a guessed id. */
export async function getPublishedWork(userId: string, workId: string): Promise<PortfolioWork | null> {
  const snapshot = await getDoc(doc(db, PORTFOLIOS, userId, WORKS, workId));
  if (!snapshot.exists()) return null;
  const work = toWork(snapshot);
  return work.status === "published" ? work : null;
}

export async function createWork(userId: string, data: NewWork): Promise<PortfolioWork> {
  const now = new Date().toISOString();
  const payload = { ...data, createdAt: now, updatedAt: now };
  const ref = await addDoc(worksCollection(userId), payload);
  return { ...payload, id: ref.id };
}

export async function updateWork(
  userId: string,
  workId: string,
  updates: Partial<NewWork>,
): Promise<Partial<PortfolioWork>> {
  const payload = { ...updates, updatedAt: new Date().toISOString() };
  await updateDoc(doc(db, PORTFOLIOS, userId, WORKS, workId), payload);
  return payload;
}

export async function deleteWork(userId: string, workId: string): Promise<void> {
  await deleteDoc(doc(db, PORTFOLIOS, userId, WORKS, workId));
}
