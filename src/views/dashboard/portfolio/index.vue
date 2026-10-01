<template>
  <main class="space-y-5">
    <Header
      title="Portfolio"
      button="Add work"
      text="Your best work"
      subtitle="Curate the pieces that make customers say yes."
      @button-click="openCreate"
    />

    <PortfolioFormModal :key="editingWork?.id ?? 'new'" :open="formOpen" :work="editingWork" @update:open="formOpen = $event" />
    <DeleteWorkDialog v-if="deletingWork" :open="deleteOpen" :work="deletingWork" @update:open="deleteOpen = $event" />

    <div class="flex flex-wrap items-center justify-between gap-2">
      <div class="flex gap-1.5">
        <button
          v-for="opt in STATUS_FILTER_OPTIONS"
          :key="opt.value"
          type="button"
          class="rounded-full px-3 py-1.5 text-xs font-medium transition"
          :class="statusFilter === opt.value ? 'bg-black text-white' : 'bg-muted text-muted-foreground hover:bg-muted/70'"
          @click="statusFilter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>

      <div class="flex gap-2">
        <Button variant="outline" size="sm" @click="handlePreview">
          <ExternalLink class="size-3.5" />
          Preview
        </Button>
        <Button variant="outline" size="sm" @click="handleCopyLink">
          <Copy class="size-3.5" />
          {{ copied ? "Copied!" : "Copy link" }}
        </Button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="portfolioStore.isLoading && !portfolioStore.works.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="aspect-[4/5] animate-pulse rounded-2xl bg-muted/60" />
    </div>

    <!-- Error -->
    <div
      v-else-if="portfolioStore.error && !portfolioStore.works.length"
      class="rounded-xl border border-dashed border-border px-6 py-12 text-center"
    >
      <p class="text-sm font-medium">Couldn't load your portfolio</p>
      <p class="mt-1 text-xs text-muted-foreground">{{ portfolioStore.error }}</p>
      <Button class="mt-4" size="sm" variant="outline" @click="portfolioStore.fetchWorks()">
        <RotateCw class="size-3.5" />
        Try again
      </Button>
    </div>

    <!-- Empty -->
    <div
      v-else-if="!filteredWorks.length"
      class="rounded-xl border border-dashed border-border px-6 py-16 text-center"
    >
      <p class="text-sm font-medium">
        {{ portfolioStore.works.length ? "Nothing here yet" : "Your portfolio is empty" }}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">
        {{ portfolioStore.works.length ? "Try a different filter." : "Add your first piece to start building your public page." }}
      </p>
    </div>

    <!-- Grid -->
    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <PortfolioWorkCard
        v-for="work in filteredWorks"
        :key="work.id"
        :work="work"
        @edit="openEdit"
        @delete="openDelete"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import { Copy, ExternalLink, RotateCw } from "@lucide/vue";

import Header from "@/components/base/Header.vue";
import Button from "@/components/ui/button/Button.vue";
import PortfolioWorkCard from "@/components/portfolio/PortfolioWorkCard.vue";
import PortfolioFormModal from "@/components/portfolio/PortfolioFormModal.vue";
import DeleteWorkDialog from "@/components/portfolio/DeleteWorkDialog.vue";

import { usePortfolioStore } from "@/stores/portfolio";
import { useAuthStore } from "@/stores/auth";
import { STATUS_FILTER_OPTIONS } from "@/constants/portfolio";
import type { PortfolioWork, PortfolioStatus } from "@/types/portfolio";

const portfolioStore = usePortfolioStore();
const authStore = useAuthStore();

const statusFilter = ref<"all" | PortfolioStatus>("all");
const filteredWorks = computed(() =>
  statusFilter.value === "all" ? portfolioStore.works : portfolioStore.works.filter((w) => w.status === statusFilter.value),
);

const formOpen = ref(false);
const editingWork = ref<PortfolioWork | null>(null);

function openCreate() {
  editingWork.value = null;
  formOpen.value = true;
}

function openEdit(work: PortfolioWork) {
  editingWork.value = work;
  formOpen.value = true;
}

const deleteOpen = ref(false);
const deletingWork = ref<PortfolioWork | null>(null);

function openDelete(work: PortfolioWork) {
  deletingWork.value = work;
  deleteOpen.value = true;
}

const copied = ref(false);

async function getPortfolioUrl(): Promise<string | null> {
  try {
    const slug = await authStore.ensureSlug();
    return `${window.location.origin}/portfolio/${slug}`;
  } catch (error) {
    console.error("ensureSlug error:", error);
    toast.error("Couldn't prepare your portfolio link. Try again.");
    return null;
  }
}

async function handlePreview() {
  const url = await getPortfolioUrl();
  if (url) window.open(url, "_blank");
}

async function handleCopyLink() {
  const url = await getPortfolioUrl();
  if (!url) return;
  await navigator.clipboard.writeText(url);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

onMounted(() => {
  portfolioStore.fetchWorks();
});
</script>