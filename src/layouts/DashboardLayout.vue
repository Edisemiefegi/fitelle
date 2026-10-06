<template>
  <div class="w-full">
    <Backdrop />
    <main class="relative ">
      <Navbar />
      <NotificationBell />

      <div class="container mx-auto lg:py-30 py-10 px-4 sm:px-0">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Backdrop from "@/components/base/Backdrop.vue";
import Navbar from "@/components/base/Navbar.vue";
import NotificationBell from "@/components/notifications/NotificationBell.vue";
import { onMounted } from "vue";
import { startPush } from "@/composables/usePushNotifications";
import { useOrderStore } from "@/stores/order";

const orderStore = useOrderStore();

// Alerts (nav badge, Today card) are derived from orders, so load them as soon as the dashboard opens.
onMounted(() => {
  orderStore.fetchOrders().catch(() => {});
  startPush();
});
</script>
