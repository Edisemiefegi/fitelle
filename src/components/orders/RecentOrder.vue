<template>
  <Card >
    <div class="flex justify-between align-items-center pb-4">
      <p class="font-semibold font-mono">Recent orders</p>
      <RouterLink to="/orders" class="text-primary text-xs">View all</RouterLink>
    </div>

    <div v-if="isLoading && !orderStore.orders.length" class="space-y-2">
      <div v-for="i in 4" :key="i" class="h-12 animate-pulse rounded-lg bg-muted/60" />
    </div>

    <p v-else-if="!recentOrders.length" class="py-6 text-center text-xs text-muted-foreground">
      No orders yet — your recent activity will show up here.
    </p>

    <button
      v-for="order in recentOrders"
      :key="order.id"
      type="button"
      class="flex w-full justify-between text-left font-display border-b pb-2 transition hover:opacity-70"
      @click="router.push(`/orders/${order.id}`)"
    >
      <div>
        <p class="font-semibold text-sm">{{ order.garmentType }}</p>
        <p class="text-xs text-gray-600">{{ order.customerName }} | {{ formatDueLabel(order.dueDate) }}</p>
      </div>
      <div class="flex items-center">
        <span :class="STATUS_BADGE_CLASSES[order.status]" class="py-1 px-2 rounded-full text-[10px]">
          {{ order.status }}
        </span>
        <ChevronRight class="w-5 text-gray-500" />
      </div>
    </button>
  </Card>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ChevronRight } from "@lucide/vue";
import Card from "../base/Card.vue";
import { useOrderStore } from "@/stores/order";
import { STATUS_BADGE_CLASSES, formatDueLabel } from "@/constants/orders";

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