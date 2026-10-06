import { defineStore } from "pinia";
import { toast } from "vue-sonner";
import { deleteImageFile } from "@/service/appwrite";
import * as api from "@/service/portfolio";
import { useAuthStore } from "@/stores/auth";
import type { MediaFile } from "@/types/index";
import type { Portfolio, PortfolioStatus, PortfolioWork } from "@/types/portfolio";
import type { PortfolioWorkSchemaType } from "@/schema/portfolio";

function requireUserId(): string {
  const user = useAuthStore().currentUser;
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

export const usePortfolioStore = defineStore("portfolio", {
  state: () => ({
    portfolio: null as Portfolio | null,
    works: [] as PortfolioWork[],
    isLoading: false,
    isSaving: false,
    error: null as string | null,
  }),

  getters: {
    publicUrl: (state) =>
      state.portfolio ? `${window.location.origin}/portfolio/${state.portfolio.slug}` : "",

    getWorkById: (state) => (id: string) => state.works.find((w) => w.id === id) ?? null,
  },

  actions: {
    /** Loads the owner's portfolio and works, creating the portfolio the first time. */
    async load() {
      const user = useAuthStore().currentUser;
      if (!user) return;

      this.isLoading = true;
      this.error = null;
      try {
        this.portfolio = (await api.getPortfolio(user.id)) ?? (await api.createPortfolio(user));
        this.works = await api.listWorks(user.id);
      } catch (error) {
        console.error("portfolio load error:", error);
        this.error = "Failed to load your portfolio.";
      } finally {
        this.isLoading = false;
      }
    },

    async saveProfile(updates: Parameters<typeof api.updatePortfolio>[1]) {
      if (!this.portfolio) return;

      this.isSaving = true;
      try {
        const updatedAt = await api.updatePortfolio(requireUserId(), updates);
        this.portfolio = { ...this.portfolio, ...updates, updatedAt };
        toast.success("Portfolio updated");
      } catch (error) {
        console.error("saveProfile error:", error);
        toast.error("Couldn't save your changes. Try again.");
        throw error;
      } finally {
        this.isSaving = false;
      }
    },

    async addWork(
      data: PortfolioWorkSchemaType,
      images: MediaFile[],
      status: PortfolioStatus = "draft",
    ): Promise<string> {
      try {
        const work = await api.createWork(requireUserId(), {
          ...data,
          images,
          coverImageId: images[0]?.fileId ?? null,
          status,
          publishedAt: status === "published" ? new Date().toISOString() : null,
        });
        this.works.unshift(work);
        toast.success(status === "published" ? "Work published" : "Saved as draft");
        return work.id;
      } catch (error) {
        console.error("addWork error:", error);
        toast.error("Couldn't save this work. Check your connection and try again.");
        throw error;
      }
    },

    async updateWork(id: string, updates: Partial<PortfolioWork>) {
      try {
        const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...changes } = updates;
        const saved = await api.updateWork(requireUserId(), id, changes);

        const index = this.works.findIndex((w) => w.id === id);
        if (index !== -1) this.works[index] = { ...this.works[index], ...saved };
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
        await api.deleteWork(requireUserId(), id);
        this.works = this.works.filter((w) => w.id !== id);
        toast.success("Work deleted");
      } catch (error) {
        console.error("deleteWork error:", error);
        toast.error("Couldn't delete this work. Try again.");
        throw error;
      }

      // Best effort: an orphaned file is harmless, a failed delete shouldn't surface.
      work?.images.forEach((img) => deleteImageFile(img.fileId).catch(() => {}));
    },
  },
});
