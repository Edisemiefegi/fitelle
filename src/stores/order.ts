import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import { collection, addDoc, db, doc, updateDoc, deleteDoc, getDocs } from "@/service/firebase";
import type { OrderType, ProductionStatus, OrderImage } from "@/types/order";
import type { OrderSchemaType } from "@/schema/order";
import { derivePaymentStatus } from "@/constants/orders";
import { generateId } from "@/lib";

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

    totalOrders: (state) => state.orders.length,
  },

  actions: {
    async fetchOrders() {
      this.isLoading = true;
      this.error = null;
      try {
        const snapshot = await getDocs(collection(db, "orders"));
        this.orders = snapshot.docs
          .map((docSnap: any) => ({ ...docSnap.data(), id: docSnap.id }) as OrderType)
          .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
      } catch (error) {
        this.error = "Failed to load orders.";
        console.error("fetchOrders error:", error);
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
    async addOrder(order: OrderSchemaType, referenceImages: OrderImage[] = []): Promise<string> {
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
        requirements: order.requirements,
        fabricSource: order.fabricSource,
        referenceImages,
        progressImages: [],
        measurements: order.measurements,
        status: order.status,
        statusHistory: [{ status: order.status, at: now }],
        total: order.total,
        payments:
          paid > 0 ? [{ id: generateId("pay"), amount: paid, note: "Initial deposit", recordedAt: now }] : [],
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
        toast.error("Couldn't create the order. Check your connection and try again.");
        throw error;
      }
    },

    async updateOrder(id: string, updates: Partial<OrderType>) {
      try {
        const ref = doc(db, "orders", id);
        const payload = { ...updates, updatedAt: new Date().toISOString() };
        await updateDoc(ref, payload);

        const index = this.orders.findIndex((o) => o.id === id);
        if (index !== -1) {
          this.orders[index] = { ...this.orders[index], ...payload };
        }
        toast.success("Order updated");
      } catch (error) {
        console.error("updateOrder error:", error);
        toast.error("Couldn't save changes. Check your connection and try again.");
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
        for (const img of [...order.referenceImages, ...order.progressImages]) {
          deleteImageFile(img.fileId).catch(() => {});
        }
      }
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
      const payments = [...order.payments, { id: generateId("pay"), amount, note, recordedAt: now }];
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