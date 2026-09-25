<template>
  <Card>
    <div class="grid gap-4 lg:grid-cols-6">
      <div
        class="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-muted col-span-1"
      >
        <img
          v-if="coverImage"
          :src="coverImage"
          :alt="order.garmentType"
          class="h-full w-full object-cover"
        />
        <span v-else class="text-lg font-semibold text-muted-foreground">
          {{ initials }}
        </span>

        <span
          v-if="order.referenceImages.length"
          class="absolute left-1.5 top-1.5 rounded-md bg-black/70 px-1.5 py-0.5 text-[8px] font-medium text-white"
        >
          IMG {{ order.referenceImages.length }}
        </span>
      </div>

      <!-- order information -->
      <div class="min-w-0 space-y-2 col-span-3">
        <div class="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span class="font-medium text-primary">
            {{ order.id }}
          </span>
        </div>

        <!-- Title -->
        <div>
          <h3 class="truncate text-sm font-semibold text-foreground">
            {{ order.customerName }}
          </h3>

          <p class="truncate text-xs font-medium text-foreground">
            {{ order.garmentType }}
          </p>

          <p
            v-if="order.description"
            class="mt-0.5 truncate text-[10px] text-muted-foreground"
          >
            {{ order.description }}
          </p>
        </div>

        <!-- Progress -->
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2 text-[9px]">
            <span
              class="rounded-full px-2 py-0.5 font-medium"
              :class="statusClasses[order.status]"
            >
              {{ order.status }}
            </span>

            <span class="text-muted-foreground">
              Step {{ step }} of {{ totalSteps }}
            </span>

            <span class="font-medium text-primary">
              {{ progress }}% complete
            </span>
          </div>

          <div class="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full bg-primary transition-all"
              :style="{ width: `${progress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Payment / actions -->
      <div
        class="flex col-span-2 flex-col justify-between gap-3 border-t border-border pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0"
      >
        <!-- Due date -->
        <div
          class="flex items-center justify-between gap-3 lg:block lg:text-right"
        >
          <span
            class="inline-flex w-fit items-center rounded-full px-2 h-4 text-[8px] font-medium"
            :class="
              overdue
                ? 'bg-red-50 text-red-600'
                : 'bg-muted text-muted-foreground'
            "
          >
            {{ dueLabel }}
          </span>

          <div class="mt-2">
            <p
              class="inline-flex rounded-full px-2 py-0.5 text-[8px] font-medium"
              :class="paymentClasses[order.paymentStatus]"
            >
              {{ paymentLabels[order.paymentStatus] }}
            </p>

            <p class="mt-0.5 text-xs font-semibold text-foreground">
              {{ formatCurrency(order.balance) }}
              {{ order.balance > 0 ? "remaining" : "" }}
            </p>

            <p class="text-[9px] text-muted-foreground">
              Total: {{ formatCurrency(order.total) }}
              <span v-if="order.balance > 0">
                ({{ formatCurrency(order.paid) }} received)
              </span>
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="grid grid-cols-3 gap-1.5">
          <Button size="sm" variant="secondary" @click="emit('view', order)">
            <Eye class="size-3" />
            View
          </Button>

          <Button
            size="sm"
            variant="secondary"
            @click="emit('whatsapp', order)"
          >
            <MessageCircle class="size-3" />
            Chat
          </Button>

          <Button size="sm" @click="emit('stage', order)">
            <ArrowUpRight class="size-3" />
            {{ order.status === "Ready" ? "Handover" : "Stage" }}
          </Button>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowUpRight, Eye, MessageCircle } from "@lucide/vue";
import Card from "../base/Card.vue";
import Button from "../ui/button/Button.vue";
import { PRODUCTION_STATUSES, type OrderType } from "@/types/order";
import {
  statusIndex,
  statusProgress,
  isOverdue,
  formatDueLabel,
} from "@/constants/orders";
import { formatCurrency } from "@/lib";

const props = defineProps<{
  order: OrderType;
}>();

const emit = defineEmits<{
  view: [order: OrderType];
  whatsapp: [order: OrderType];
  stage: [order: OrderType];
}>();

const coverImage = computed(() => props.order.referenceImages[0]?.url ?? null);

const initials = computed(() =>
  props.order.customerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(""),
);

const step = computed(() => statusIndex(props.order.status) + 1);
const totalSteps = PRODUCTION_STATUSES.length;
const progress = computed(() => statusProgress(props.order.status));
const overdue = computed(() =>
  isOverdue(props.order.dueDate, props.order.status),
);
const dueLabel = computed(() => formatDueLabel(props.order.dueDate));

const statusClasses: Record<string, string> = {
  "Order Received": "bg-blue-50 text-blue-700",
  Measuring: "bg-purple-50 text-purple-700",
  Cutting: "bg-amber-50 text-amber-700",
  Sewing: "bg-orange-50 text-orange-700",
  Fitting: "bg-pink-50 text-pink-700",
  Finishing: "bg-indigo-50 text-indigo-700",
  Ready: "bg-emerald-50 text-emerald-700",
  Delivered: "bg-green-50 text-green-700",
};

const paymentClasses: Record<string, string> = {
  unpaid: "bg-red-50 text-red-600",
  partial: "bg-orange-50 text-orange-600",
  paid: "bg-emerald-50 text-emerald-700",
};

const paymentLabels: Record<string, string> = {
  unpaid: "PAYMENT DUE",
  partial: "PARTIAL PAYMENT",
  paid: "PAID IN FULL",
};
</script>
