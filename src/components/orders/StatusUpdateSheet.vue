<template>
  <AlertDialog
    v-model:open="dialogOpen"
    title="Update stage"
    :description="`${order.customerName} · ${order.garmentType}`"
    cancel-text="Close"
    confirm-text="Save"
    @confirm="handleConfirm"
  >
    <div class="space-y-1 py-1">
      <button
        v-for="status in PRODUCTION_STATUSES"
        :key="status"
        type="button"
        class="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-muted disabled:opacity-50"
        :class="
          selectedStatus === status ? 'bg-muted font-medium text-primary' : ''
        "
        :disabled="isUpdating"
        @click="selectedStatus = status"
      >
        <Check v-if="selectedStatus === status" class="size-4 shrink-0" />

        <span v-else class="size-4 shrink-0" />

        {{ status }}
      </button>
    </div>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Check } from "@lucide/vue";
import AlertDialog from "@/components/base/AlertDialog.vue";
import { PRODUCTION_STATUSES } from "@/types/order";
import type { ProductionStatus, OrderType } from "@/types/order";
import { useOrderStore } from "@/stores/order";

const props = defineProps<{
  open: boolean;
  order: OrderType;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const orderStore = useOrderStore();

const isUpdating = ref(false);
const selectedStatus = ref<ProductionStatus>(props.order.status);

const dialogOpen = ref(props.open);

watch(
  () => props.open,
  (value) => {
    dialogOpen.value = value;

    if (value) {
      selectedStatus.value = props.order.status;
    }
  },
);

watch(dialogOpen, (value) => {
  emit("update:open", value);
});

async function handleConfirm() {
  if (selectedStatus.value === props.order.status || isUpdating.value) {
    dialogOpen.value = false;
    return;
  }

  isUpdating.value = true;

  try {
    await orderStore.updateStatus(props.order.id, selectedStatus.value);

    dialogOpen.value = false;
  } finally {
    isUpdating.value = false;
  }
}
</script>
