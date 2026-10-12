<template>
  <Card >
    <div class="flex items-center justify-between pb-4">
      <p class="font-display text-lg font-medium">Recent orders</p>
      <RouterLink to="/orders" class="text-primary text-xs">View all</RouterLink>
    </div>

    <div v-if="isLoading && !orderStore.orders.length" class="space-y-2">
      <div v-for="i in 4" :key="i" class="h-12 animate-pulse rounded-lg bg-muted/60" />
    </div>

    <p v-else-if="!recentOrders.length" class="py-6 text-center text-xs text-muted-foreground">
      No orders yet — your recent activity will show up here.
    </p>

    <div class="space-y-3">
      <button
        v-for="order in recentOrders"
        :key="order.id"
        type="button"
        class="flex w-full items-center gap-3 border-b border-border pb-3 text-left transition last:border-b-0 last:pb-0 hover:opacity-70"
        @click="router.push(`/orders/${order.id}`)"
      >
        <div
          class="flex h-[72px] w-[60px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-muted"
        >
          <img
            v-if="order.referenceImages[0]?.url"
            :src="order.referenceImages[0].url"
            :alt="order.garmentType"
            class="h-full w-full object-cover"
          />
          <span v-else class="text-sm font-semibold text-muted-foreground">
            {{ getInitials(order.customerName) }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <p class="truncate text-[15px] font-semibold leading-snug text-foreground">
            {{ order.customerName }}
          </p>
          <p class="truncate text-[12.5px] font-medium text-foreground">
            {{ order.garmentType }}
          </p>

          <div class="mb-1.5 mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px]">
            <span
              :class="STATUS_BADGE_CLASSES[order.status]"
              class="rounded-full px-2.5 py-0.5 font-medium"
            >
              {{ order.status }}
            </span>
            <span class="text-muted-foreground">{{ formatDueLabel(order.dueDate) }}</span>
          </div>

          <div class="h-[5px] w-full overflow-hidden rounded-full bg-muted">
            <div
              class="h-full rounded-full bg-primary"
              :style="{ width: `${statusProgress(order.status)}%` }"
            />
          </div>
        </div>

        <ChevronRight class="w-5 shrink-0 text-gray-500" />
      </button>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ChevronRight } from "@lucide/vue";
import Card from "../base/Card.vue";
import { useOrderStore } from "@/stores/order";
import { STATUS_BADGE_CLASSES, formatDueLabel, statusProgress } from "@/constants/orders";
import { getInitials } from "@/lib";

const router = useRouter();
const orderStore = useOrderStore();
const { isLoading } = storeToRefs(orderStore);

const recentOrders = computed(() =>
  [...orderStore.orders]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, 5),
);

onMounted(() => {
  if (!orderStore.orders.length) orderStore.fetchOrders().catch(() => {});
});
</script>