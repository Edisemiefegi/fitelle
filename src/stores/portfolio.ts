import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import { collection, addDoc, db, doc, updateDoc, deleteDoc, getDocs, query, where } from "@/service/firebase";
import { deleteImageFile } from "@/service/appwrite";
import type { PortfolioWork, PortfolioStatus } from "@/types/portfolio";
import type { PortfolioWorkSchemaType } from "@/schema/portfolio";
import type { MediaFile } from "@/types/index";
import { useAuthStore } from "@/stores/auth";

export const usePortfolioStore = defineStore("portfolio", {
  state: () => ({
    works: [] as PortfolioWork[],
    isLoading: false,
    error: null as string | null,
  }),

  getters: {
    getWorkById:
      (state) =>
      (id: string): PortfolioWork | null =>
        state.works.find((w) => w.id === id) ?? null,
  },

  actions: {
    async fetchWorks() {
      const authStore = useAuthStore();
      if (!authStore.currentUser) return;

      this.isLoading = true;
      this.error = null;
      try {
        const snapshot = await getDocs(
          query(collection(db, "portfolio_works"), where("userId", "==", authStore.currentUser.id)),
        );
        this.works = snapshot.docs
          .map((d: any) => ({ ...d.data(), id: d.id }) as PortfolioWork)
          .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
      } catch (error) {
        this.error = "Failed to load your portfolio.";
        console.error("fetchWorks error:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async addWork(
      data: PortfolioWorkSchemaType,
      images: MediaFile[],
      status: PortfolioStatus = "draft",
    ): Promise<string> {
      const authStore = useAuthStore();
      if (!authStore.currentUser) throw new Error("Not authenticated");

      const now = new Date().toISOString();
      const payload: Omit<PortfolioWork, "id"> = {
        userId: authStore.currentUser.id,
        title: data.title,
        category: data.category,
        description: data.description ?? "",
        fabric: data.fabric ?? "",
        occasion: data.occasion ?? "",
        tags: data.tags,
        images,
        coverImageId: images[0]?.fileId ?? null,
        status,
        publishedAt: status === "published" ? now : null,
        createdAt: now,
        updatedAt: now,
      };

      try {
        const docRef = await addDoc(collection(db, "portfolio_works"), payload);
        await updateDoc(docRef, { id: docRef.id });
        this.works.unshift({ ...payload, id: docRef.id });
        toast.success(status === "published" ? "Work published" : "Saved as draft");
        return docRef.id;
      } catch (error) {
        console.error("addWork error:", error);
        toast.error("Couldn't save this work. Check your connection and try again.");
        throw error;
      }
    },

    async updateWork(id: string, updates: Partial<PortfolioWork>) {
      try {
        const payload = { ...updates, updatedAt: new Date().toISOString() };
        await updateDoc(doc(db, "portfolio_works", id), payload);

        const index = this.works.findIndex((w) => w.id === id);
        if (index !== -1) this.works[index] = { ...this.works[index], ...payload };
        toast.success("Work updated");
      } catch (error) {
        console.error("updateWork error:", error);
        toast.error("Couldn't save changes. Try again.");
        throw error;
      }
    },

    async setPublished(id: string, status: PortfolioStatus) {
      const work = this.getWorkById(id);
      if (!work) return;
      await this.updateWork(id, {
        status,
        publishedAt: status === "published" ? new Date().toISOString() : work.publishedAt,
      });
    },

    async deleteWork(id: string) {
      const work = this.getWorkById(id);
      try {
        await deleteDoc(doc(db, "portfolio_works", id));
        this.works = this.works.filter((w) => w.id !== id);
        toast.success("Work deleted");
      } catch (error) {
        console.error("deleteWork error:", error);
        toast.error("Couldn't delete this work. Try again.");
        throw error;
      }

      if (work) {
        for (const img of work.images) deleteImageFile(img.fileId).catch(() => {});
      }
    },
  },

  persist: true,
});