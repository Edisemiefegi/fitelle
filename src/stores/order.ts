import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import {
  collection,
  addDoc,
  db,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "@/service/firebase";
import type {
  OrderType,
  ProductionStatus,
  OrderImage,
  OrderRequirement,
  ProgressUpdate,
} from "@/types/order";
import type { OrderSchemaType } from "@/schema/order";
import { derivePaymentStatus } from "@/constants/orders";
import { generateId } from "@/lib";
import { useAuthStore } from "@/stores/auth";

/** Stamps new documents with their owner so server-side jobs (push) can tell whose they are. */
const ownerField = () => {
  const userId = useAuthStore().currentUser?.id;
  return userId ? { userId } : {};
};

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [] as OrderType[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getOrderById:
      (state) =>
      (id: string): OrderType | null =>
        state.orders.find((o) => o.id === id) ?? null,

    getOrdersByCustomerId:
      (state) =>
      (customerId: string): OrderType[] =>
        state.orders.filter((order) => order.customerId === customerId),

    totalOrders: (state) => state.orders.length,
  },

  actions: {
    async fetchOrders() {
      const userId = useAuthStore().currentUser?.id;

      if (!userId) {
        this.orders = [];
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        const ordersRef = query(
          collection(db, "orders"),
          where("userId", "==", userId),
        );

        const snapshot = await getDocs(ordersRef);
        this.orders = snapshot.docs
          .map(
            (docSnap: any) =>
              ({ ...docSnap.data(), id: docSnap.id }) as OrderType,
          )
          .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
      } catch (error) {
        this.error = "Failed to load orders.";
        console.error("fetchOrders error:", error);
        toast.error("Couldn't load your orders. Check your connection.");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * @param referenceImages already-uploaded images (upload happens in the
     * form via useImageUpload before this is called, so a failed order write
     * never orphans an in-flight upload).
     */
    async addOrder(
      order: OrderSchemaType,
      referenceImages: OrderImage[] = [],
    ): Promise<string> {
      const now = new Date().toISOString();
      const paid = order.deposit ?? 0;
      const balance = order.total - paid;

      const payload: Omit<OrderType, "id"> = {
        customerId: order.customerId,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        garmentType: order.garmentType,
        description: order.description ?? "",
        notes: order.notes ?? "",
        dueDate: order.dueDate ?? null,
        fittingDate: order.fittingDate ?? null,
        ...ownerField(),
        requirements: order.requirements,
        fabricSource: order.fabricSource,
        referenceImages,
        progressUpdates: [],
        measurements: order.measurements,
        status: order.status,
        statusHistory: [{ status: order.status, at: now }],
        total: order.total,
        payments:
          paid > 0
            ? [
                {
                  id: generateId("pay"),
                  amount: paid,
                  note: "Initial deposit",
                  recordedAt: now,
                },
              ]
            : [],
        paid,
        balance,
        paymentStatus: derivePaymentStatus(order.total, paid),
        trackingSlug: generateId("trk"),
        createdAt: now,
        updatedAt: now,
      };

      try {
        const docRef = await addDoc(collection(db, "orders"), payload);
        await updateDoc(docRef, { id: docRef.id });
        this.orders.unshift({ ...payload, id: docRef.id });
        toast.success("Order created");
        return docRef.id;
      } catch (error) {
        console.error("addOrder error:", error);
        toast.error(
          "Couldn't create the order. Check your connection and try again.",
        );
        throw error;
      }
    },

    /** @param successMessage shown as a toast; pass null for small inline edits (ticking a box, etc.) */
    async updateOrder(
      id: string,
      updates: Partial<OrderType>,
      successMessage: string | null = "Order updated",
    ) {
      try {
        const ref = doc(db, "orders", id);
        const payload = { ...updates, updatedAt: new Date().toISOString() };
        await updateDoc(ref, payload);

        const index = this.orders.findIndex((o) => o.id === id);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...payload };
        }
        if (successMessage) toast.success(successMessage);
      } catch (error) {
        console.error("updateOrder error:", error);
        toast.error(
          "Couldn't save changes. Check your connection and try again.",
        );
        throw error;
      }
    },

    async deleteOrder(id: string) {
      const order = this.getOrderById(id);
      try {
        await deleteDoc(doc(db, "orders", id));
        this.orders = this.orders.filter((o) => o.id !== id);
        toast.success("Order deleted");
      } catch (error) {
        console.error("deleteOrder error:", error);
        toast.error("Couldn't delete the order. Try again.");
        throw error;
      }

      if (order) {
        const { deleteImageFile } = await import("@/service/appwrite.ts");
        const progressImages = (order.progressUpdates ?? []).flatMap(
          (u) => u.images,
        );
        for (const img of [...order.referenceImages, ...progressImages]) {
          deleteImageFile(img.fileId).catch(() => {});
        }
      }
    },

    /** Saves a new checklist immediately and puts the old one back if the write fails. */
    async saveRequirements(id: string, requirements: OrderRequirement[]) {
      const order = this.getOrderById(id);
      if (!order) return;
      const previous = order.requirements;
      order.requirements = requirements;
      try {
        await this.updateOrder(id, { requirements }, null);
      } catch (error) {
        order.requirements = previous;
        throw error;
      }
    },

    async addProgressUpdate(
      id: string,
      update: Pick<ProgressUpdate, "note" | "images" | "visibleToCustomer">,
    ) {
      const order = this.getOrderById(id);
      if (!order) return;
      const entry: ProgressUpdate = {
        id: generateId("upd"),
        createdAt: new Date().toISOString(),
        ...update,
      };
      await this.updateOrder(
        id,
        { progressUpdates: [entry, ...(order.progressUpdates ?? [])] },
        "Progress update added",
      );
    },

    async setProgressUpdateVisibility(
      id: string,
      updateId: string,
      visible: boolean,
    ) {
      const order = this.getOrderById(id);
      if (!order) return;
      const progressUpdates = (order.progressUpdates ?? []).map((u) =>
        u.id === updateId ? { ...u, visibleToCustomer: visible } : u,
      );
      await this.updateOrder(
        id,
        { progressUpdates },
        visible
          ? "Now visible on the tracking link"
          : "Hidden from the tracking link",
      );
    },

    async removeProgressUpdate(id: string, updateId: string) {
      const order = this.getOrderById(id);
      const removed = order?.progressUpdates?.find((u) => u.id === updateId);
      if (!order || !removed) return;
      await this.updateOrder(
        id,
        {
          progressUpdates: order.progressUpdates!.filter(
            (u) => u.id !== updateId,
          ),
        },
        "Update removed",
      );

      const { deleteImageFile } = await import("@/service/appwrite.ts");
      removed.images.forEach((img) =>
        deleteImageFile(img.fileId).catch(() => {}),
      );
    },

    async updateStatus(id: string, status: ProductionStatus) {
      const order = this.getOrderById(id);
      if (!order) return;

      const now = new Date().toISOString();
      await this.updateOrder(id, {
        status,
        statusHistory: [...order.statusHistory, { status, at: now }],
      });
    },

    async recordPayment(id: string, amount: number, note?: string) {
      const order = this.getOrderById(id);
      if (!order) return;

      if (amount <= 0 || amount > order.balance) {
        toast.error("That amount doesn't match the current balance.");
        throw new Error("Invalid payment amount");
      }

      const now = new Date().toISOString();
      const payments = [
        ...order.payments,
        { id: generateId("pay"), amount, note, recordedAt: now },
      ];
      const paid = order.paid + amount;
      const balance = order.total - paid;

      await this.updateOrder(id, {
        payments,
        paid,
        balance,
        paymentStatus: derivePaymentStatus(order.total, paid),
      });
    },
  },

  persist: true,
});
