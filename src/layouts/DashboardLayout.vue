<template>
  <div class="w-full">
    <Backdrop />
    <main class="relative">
      <Navbar />

      <div class="container mx-auto lg:py-30 py-10 pb-30 md:pb-0 px-4 sm:px-0">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Backdrop from "@/components/base/Backdrop.vue";
import Navbar from "@/components/base/Navbar.vue";
import { onMounted } from "vue";
import { startPush } from "@/composables/usePushNotifications";
import { useOrderStore } from "@/stores/order";
import { usePortfolioStore } from "@/stores/portfolio";

const orderStore = useOrderStore();
const portfolioStore = usePortfolioStore();

// Alerts (nav badge, Today card) are derived from orders, so load them as soon as the dashboard opens.
onMounted(() => {
  orderStore.fetchOrders().catch(() => {});
  portfolioStore.load(); // creates the portfolio on first run: its brand details appear on customer tracking pages
  startPush();
});
</script>
