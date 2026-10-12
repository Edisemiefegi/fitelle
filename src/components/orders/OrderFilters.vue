<template>
  <div class="space-y-2">
    <!-- Status + payment, with export alongside -->
    <div class="flex items-stretch gap-2">
      <div class="grid min-w-0 flex-1 grid-cols-2 gap-2">
        <Select v-model="filters.status" :options="ORDER_STATUS_OPTIONS" placeholder="Order status" class="w-full" />
        <Select v-model="filters.paymentStatus" :options="PAYMENT_STATUS_OPTIONS" placeholder="Payment status" class="w-full" />
      </div>

      <Button variant="outline" size="sm" class="h-auto shrink-0" aria-label="Export orders" @click="emit('export')">
        <Download class="size-4" />
        <span class="hidden sm:inline">Export</span>
      </Button>
    </div>

    <!-- Date range: which date, then from → to -->
    <div class="rounded-xl border border-border bg-white/70 p-2.5">
      <div class="grid grid-cols-2 gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
        <div class="col-span-2 md:col-span-1">
          <p class="mb-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Date range by</p>
          <Select v-model="filters.dateField" :options="DATE_FIELD_OPTIONS" placeholder="Filter by date" class="w-full" />
        </div>

        <label class="block min-w-0">
          <span class="mb-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">From</span>
          <DatePicker v-model="filters.dateFrom" :max="filters.dateTo" placeholder="Any date" class="h-9 w-full text-xs" />
        </label>

        <label class="block min-w-0">
          <span class="mb-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">To</span>
          <DatePicker v-model="filters.dateTo" :min="filters.dateFrom" placeholder="Any date" class="h-9 w-full text-xs" />
        </label>

        <Button
          v-if="isActive"
          variant="ghost"
          size="sm"
          class="col-span-2 justify-self-end md:col-span-1"
          @click="emit('reset')"
        >
          <X class="size-3.5" />
          Clear filters
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Download, X } from "@lucide/vue";
import DatePicker from "@/components/base/DatePicker.vue";
import Select from "@/components/base/Select.vue";
import Button from "@/components/ui/button/Button.vue";
import { DATE_FIELD_OPTIONS, ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from "@/constants/orders";
import type { OrderFiltersState } from "@/constants/orders";

const props = defineProps<{ filters: OrderFiltersState }>();

const emit = defineEmits<{
  reset: [];
  export: [];
}>();

const isActive = computed(
  () =>
    props.filters.status !== "all" ||
    props.filters.paymentStatus !== "all" ||
    props.filters.dateField !== "dueDate" ||
    Boolean(props.filters.dateFrom) ||
    Boolean(props.filters.dateTo),
);
</script>
