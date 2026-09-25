<template>
  <div class="flex gap-2 justify-between">
    <div class="grid md:grid-cols-4 grid-cols-3  gap-2">
      <Select v-model="filters.status" :options="ORDER_STATUS_OPTIONS" placeholder="Order status" class="w-full sm:w-40" />

      <Select
        v-model="filters.paymentStatus"
        :options="PAYMENT_STATUS_OPTIONS"
        placeholder="Payment status"
        class="w-full sm:w-40"
      />

      <input
        v-model="filters.dateFrom"
        type="date"
        class="h-10 rounded-xl border border-border bg-background px-3 text-xs text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
      <!-- <input
        v-model="filters.dateTo"
        type="date"
        class="h-10 rounded-xl border border-border bg-background px-3 text-xs text-muted-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      /> -->

      <Button v-if="isActive" variant="ghost" size="sm" @click="emit('reset')">
        <X class="size-3.5" />
        Clear filters
      </Button>
    </div>

    <div class="flex shrink-0 gap-1">
      <Button variant="outline" size="sm">
        <Download class="size-4" />
        <span class="hidden sm:inline">Export</span>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Download, X } from "@lucide/vue";
import Select from "@/components/base/Select.vue";
import Button from "@/components/ui/button/Button.vue";
import { ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/constants/orders";
import type { OrderFiltersState } from "@/constants/orders";

const props = defineProps<{
  filters: OrderFiltersState;
}>();

const emit = defineEmits<{
  reset: [];
}>();

const isActive = computed(
  () =>
    props.filters.status !== "all" ||
    props.filters.paymentStatus !== "all" ||
    Boolean(props.filters.dateFrom) ||
    Boolean(props.filters.dateTo),
);
</script>