<template>
  <div class="space-y-3">
    <PortfolioFormModal
      :key="editingWork?.id ?? 'new'"
      :open="formOpen"
      :work="editingWork"
      @update:open="formOpen = $event"
    />
    <DeleteWorkDialog
      v-if="deletingWork"
      :open="deleteOpen"
      :work="deletingWork"
      @update:open="deleteOpen = $event"
    />

    <div class="flex justify-between">
      <div class="flex gap-1.5">
        <Button
          v-for="opt in STATUS_FILTER_OPTIONS"
          :key="opt.value"
          variant="ghost"
          size="xs"
          :class="statusFilter === opt.value ? 'bg-black text-white' : ''"
          @click="statusFilter = opt.value"
        >
          {{ opt.label }}
        </Button>
      </div>
      <Button size="xs" @click="openCreate"> Add work </Button>
    </div>

    <div v-if="filteredWorks.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <PortfolioWorkCard
        v-for="work in filteredWorks"
        :key="work.id"
        :work="work"
        @edit="openEdit"
        @delete="openDelete"
      />
    </div>

    <div
      v-else
      class="rounded-xl border border-dashed border-border px-6 py-16 text-center"
    >
      <p class="text-sm font-medium">
        {{
          portfolioStore.works.length
            ? "Nothing here yet"
            : "Your portfolio is empty"
        }}
      </p>
      <p class="mt-1 text-xs text-muted-foreground">
        {{
          portfolioStore.works.length
            ? "Try a different filter."
            : "Add your first piece to start building your public page."
        }}
      </p>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Button from "@/components/ui/button/Button.vue";
import { usePortfolioStore } from "@/stores/portfolio";
import type { PortfolioStatus, PortfolioWork } from "@/types/portfolio";
import { STATUS_FILTER_OPTIONS } from "@/constants/portfolio";
import PortfolioFormModal from "@/components/portfolio/PortfolioFormModal.vue";
import DeleteWorkDialog from "@/components/portfolio/DeleteWorkDialog.vue";
import PortfolioWorkCard from "@/components/portfolio/PortfolioWorkCard.vue";

const portfolioStore = usePortfolioStore();

const statusFilter = ref<"all" | PortfolioStatus>("all");

const formOpen = ref(false);
const editingWork = ref<PortfolioWork | null>(null);
const deleteOpen = ref(false);
const deletingWork = ref<PortfolioWork | null>(null);

function openDelete(work: PortfolioWork) {
  deletingWork.value = work;
  deleteOpen.value = true;
}

function openCreate() {
  editingWork.value = null;
  formOpen.value = true;
}

function openEdit(work: PortfolioWork) {
  editingWork.value = work;
  formOpen.value = true;
}

const filteredWorks = computed(() =>
  statusFilter.value === "all"
    ? portfolioStore.works
    : portfolioStore.works.filter((w) => w.status === statusFilter.value),
);
</script>
