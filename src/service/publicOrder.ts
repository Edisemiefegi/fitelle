import { collection, db, query, where, limit, getDocs } from "@/service/firebase";
import { getPortfolio } from "@/service/portfolio";
import type { OrderType, PublicOrderBrand, PublicOrderView } from "@/types/order";

async function fetchBrand(userId: string | undefined): Promise<PublicOrderBrand | null> {
  if (!userId) return null; // orders created before ownership was recorded
  const portfolio = await getPortfolio(userId).catch(() => null);
  if (!portfolio) return null;

  return {
    name: portfolio.brandName,
    logoUrl: portfolio.image?.url ?? null,
    location: portfolio.contact.location,
    phone: portfolio.contact.phone,
    whatsapp: portfolio.contact.whatsapp,
    instagram: portfolio.contact.instagram,
    portfolioSlug: portfolio.slug,
  };
}

/** What a customer may see: only the fields below, and only the progress updates the tailor chose to share. */
export async function fetchPublicOrderBySlug(slug: string): Promise<PublicOrderView | null> {
  const snapshot = await getDocs(query(collection(db, "orders"), where("trackingSlug", "==", slug), limit(1)));
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const order = docSnap.data() as OrderType;

  return {
    id: docSnap.id,
    garmentType: order.garmentType,
    description: order.description,
    dueDate: order.dueDate,
    fittingDate: order.fittingDate ?? null,
    requirements: order.requirements,
    referenceImages: order.referenceImages,
    status: order.status,
    statusHistory: order.statusHistory,
    total: order.total,
    paid: order.paid,
    balance: order.balance,
    paymentStatus: order.paymentStatus,
    customerName: order.customerName,
    trackingSlug: order.trackingSlug,
    progressUpdates: (order.progressUpdates ?? []).filter((update) => update.visibleToCustomer),
    brand: await fetchBrand(order.userId),
  };
}
