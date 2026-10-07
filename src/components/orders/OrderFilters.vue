<template>
  <div class="space-y-2">
    <div class="flex items-start justify-between gap-2">
      <div class="grid flex-1 grid-cols-2 gap-2 md:grid-cols-4">
        <Select v-model="filters.status" :options="ORDER_STATUS_OPTIONS" placeholder="Order status" class="w-full" />
        <Select v-model="filters.paymentStatus" :options="PAYMENT_STATUS_OPTIONS" placeholder="Payment status" class="w-full" />
        <Select v-model="filters.dateField" :options="DATE_FIELD_OPTIONS" placeholder="Filter by date" class="w-full" />
      </div>

      <Button variant="outline" size="sm" class="shrink-0" @click="emit('export')">
        <Download class="size-4" />
        <span class="hidden sm:inline">Export</span>
      </Button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <label class="flex items-center gap-2 text-xs text-muted-foreground">
        From
        <DatePicker v-model="filters.dateFrom" :max="filters.dateTo" placeholder="Any date" class="h-9 w-44 text-xs" />
      </label>
      <label class="flex items-center gap-2 text-xs text-muted-foreground">
        To
        <DatePicker v-model="filters.dateTo" :min="filters.dateFrom" placeholder="Any date" class="h-9 w-44 text-xs" />
      </label>

      <Button v-if="isActive" variant="ghost" size="sm" @click="emit('reset')">
        <X class="size-3.5" />
        Clear filters
      </Button>
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
