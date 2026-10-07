<template>

    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="font-display text-lg font-semibold">
          Order History
        </h2>

        <p class="text-xs text-muted-foreground">
          {{ orders.length }}
          {{ orders.length === 1 ? "order" : "orders" }}
          for this customer
        </p>
      </div>

      <Button
        v-if="orders.length"
        size="sm"
        variant="outline"
        @click="viewOrders"
      >
        View all
      </Button>
    </div>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="py-10 text-center text-sm text-muted-foreground"
    >
      Loading orders...
    </div>

    <!-- Empty -->
    <div
      v-else-if="!orders.length"
      class="rounded-xl border border-dashed border-border px-6 py-10 text-center"
    >
      <ShoppingBag class="mx-auto mb-3 size-8 text-muted-foreground" />

      <p class="text-sm font-medium">
        No orders yet
      </p>

      <p class="mt-1 text-xs text-muted-foreground">
        Orders created for this customer will appear here.
      </p>
    </div>

    <!-- Orders -->
    <div v-else class="space-y-2">
      <button
        v-for="order in orders"
        :key="order.id"
        type="button"
        class="flex w-full items-center justify-between gap-4 rounded-xl border border-border p-4 text-left transition hover:bg-muted/50"
        @click="viewOrder(order.id)"
      >
        <div class="min-w-0">
          <p class="font-medium truncate">
            {{ order.garmentType }}
          </p>

          <p class="mt-1 text-xs text-muted-foreground">
            Ordered {{ (order.createdAt ? formatDate(order.createdAt) : "—") }}
          </p>
        </div>

        <div class="shrink-0 text-right">
          <p class="text-sm font-medium">
            {{ formatCurrency(order.total) }}
          </p>

          <span class="text-xs text-muted-foreground">
            {{ order.status }}
          </span>
        </div>
      </button>
    </div>

</template>

<script setup lang="ts">
import { formatCurrency, formatDate } from "@/lib";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ShoppingBag } from "@lucide/vue";

import Button from "@/components/ui/button/Button.vue";
import { useOrderStore } from "@/stores/order";

const props = defineProps<{
  customerId: string;
}>();

const router = useRouter();
const orderStore = useOrderStore();

const orders = computed(() =>
  orderStore.getOrdersByCustomerId(props.customerId),
);

const isLoading = computed(() => orderStore.isLoading);

onMounted(async () => {
  if (!orderStore.orders.length) {
    await orderStore.fetchOrders();
  }
});

function viewOrder(id: string) {
  router.push(`/orders/${id}`);
}

function viewOrders() {
  router.push("/orders");
}

</script>