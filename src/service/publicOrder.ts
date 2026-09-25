import { collection, db, query, where, limit, getDocs } from "@/service/firebase";
import type { OrderType, PublicOrderView } from "@/types/order";


export async function fetchPublicOrderBySlug(slug: string): Promise<PublicOrderView | null> {
  const q = query(collection(db, "orders"), where("trackingSlug", "==", slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const order = docSnap.data() as OrderType;

  return {
    id: docSnap.id,
    garmentType: order.garmentType,
    description: order.description,
    dueDate: order.dueDate,
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
    progressImages: order.progressImages.filter((img) => img.visibleToCustomer),
  };
}