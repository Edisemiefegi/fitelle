<template>
  <main class="space-y-5">
    <Header
      title="Good morning, Nuru."
      subtitle="Here is the shape of your atelier today."
      button="New order"
      text="Studio notes"
      @button-click="orderModalOpen = true"
    />

    <OrderFormModal
      key="new"
      :open="orderModalOpen"
      @update:open="orderModalOpen = $event"
    />

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Stats v-for="stat in stats" :key="stat.title" v-bind="stat" />
    </div>

    <div class="grid grid-cols-3 gap-4">
      <RecentOrder class="col-span-3" />
      <!-- <Card class="bg-primary/50!"> </Card> -->
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
// import Card from "@/components/base/Card.vue";
import Header from "@/components/base/Header.vue";
import Stats from "@/components/base/Stats.vue";
import { ShoppingCartIcon, UsersIcon, PackageIcon } from "@lucide/vue";
import RecentOrder from "@/components/orders/RecentOrder.vue";
import OrderFormModal from "@/components/orders/OrderFormModal.vue";
import { useOrderStore } from "@/stores/order";
import { isDueWithin } from "@/constants/orders";
import { formatCurrency } from "@/lib";

const orderStore = useOrderStore();
const orderModalOpen = ref(false);

onMounted(() => {
  if (!orderStore.orders.length) orderStore.fetchOrders().catch(() => {});
});

const inProgress = computed(() =>
  orderStore.orders.filter((o) => o.status !== "Delivered"),
);

const dueThisWeek = computed(() =>
  orderStore.orders.filter((o) => isDueWithin(o.dueDate, o.status, 7)),
);

const collected = computed(() => {
  const orders = orderStore.orders.filter((o) => o.paid > 0);
  return {
    total: orders.reduce((sum, o) => sum + o.paid, 0),
    count: orders.length,
  };
});

const outstanding = computed(() => {
  const orders = orderStore.orders.filter((o) => o.balance > 0);
  return {
    total: orders.reduce((sum, o) => sum + o.balance, 0),
    count: orders.length,
  };
});

const stats = computed(() => [
  {
    title: "IN PROGRESS",
    amount: String(inProgress.value.length),
    icon: ShoppingCartIcon,
    text: "pieces on the table",
    bgClass: "bg-pink",
  },
  {
    title: "DUE THIS WEEK",
    amount: String(dueThisWeek.value.length),
    icon: UsersIcon,
    text: "keep up the pace",
    bgClass: "bg-mint",
  },
  {
    title: "COLLECTED",
    amount: formatCurrency(collected.value.total),
    icon: PackageIcon,
    text: `from ${collected.value.count} order${collected.value.count === 1 ? "" : "s"}`,
    bgClass: "bg-butter",
  },
  {
    title: "OUTSTANDING BAL",
    amount: formatCurrency(outstanding.value.total),
    icon: PackageIcon,
    text: `across ${outstanding.value.count} order${outstanding.value.count === 1 ? "" : "s"}`,
    bgClass: "bg-lilac",
  },
]);
</script>
