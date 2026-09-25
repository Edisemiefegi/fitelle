<template>
  <main class="space-y-5">
    <Header
      title="Orders"
      button="New order"
      text="The order book"
      subtitle="A clear view of every garment from first conversation to final handover."
      @button-click="openCreate"
    />

    <OrderFormModal
      :key="editingOrder?.id ?? 'new'"
      :open="formModalOpen"
      :order="editingOrder"
      @update:open="formModalOpen = $event"
    />

    <Search v-model="searchInput" placeholder="Search orders..." />

    <OrderFilters :filters="filters" @reset="resetFilters" />

    <!-- Loading -->
    <div v-if="orderStore.isLoading && !orderStore.orders.length" class="space-y-2">
      <div v-for="i in 3" :key="i" class="h-28 animate-pulse rounded-xl bg-muted/60" />
    </div>

    <!-- Error -->
    <div
      v-else-if="orderStore.error && !orderStore.orders.length"
      class="rounded-xl border border-dashed border-border px-6 py-12 text-center"
    >
      <p class="text-sm font-medium">Couldn't load orders</p>
      <p class="mt-1 text-xs text-muted-foreground">{{ orderStore.error }}</p>
      <Button class="mt-4" size="sm" variant="outline" @click="orderStore.fetchOrders()">
        <RotateCw class="size-3.5" />
        Try again
      </Button>
    </div>

    <template v-else>
      <div class="space-y-2">
        <OrderCard
          v-for="order in visibleOrders"
          :key="order.id"
          :order="order"
          @view="handleView"
          @whatsapp="handleWhatsApp"
          @stage="handleStage"
        />

        <div
          v-if="!filteredOrders.length"
          class="rounded-xl border border-dashed border-border px-6 py-12 text-center"
        >
          <p class="text-sm font-medium">No orders found</p>
          <p class="mt-1 text-xs text-muted-foreground">Try changing your search or filters.</p>
        </div>
      </div>

      <div v-if="hasMore" class="flex justify-center">
        <Button variant="outline" size="sm" @click="visibleCount += PAGE_SIZE">Load more</Button>
      </div>
    </template>

    <StatusUpdateSheet
      v-if="statusOrder"
      :open="statusSheetOpen"
      :order="statusOrder"
      @update:open="statusSheetOpen = $event"
    />
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { RotateCw } from "@lucide/vue";

import Header from "@/components/base/Header.vue";
import Search from "@/components/base/Search.vue";
import Button from "@/components/ui/button/Button.vue";
import OrderCard from "@/components/orders/OrderCard.vue";
import OrderFilters from "@/components/orders/OrderFilters.vue";
import StatusUpdateSheet from "@/components/orders/StatusUpdateSheet.vue";
import OrderFormModal from "@/components/orders/OrderFormModal.vue";

import { useOrderStore } from "@/stores/order";
import { defaultOrderFilters } from "@/constants/orders";
import { toWhatsAppLink } from "@/lib";
import type { OrderType } from "@/types/order";
import { useDebouncedRef } from "@/composables/useDebounceRef";

const router = useRouter();
const orderStore = useOrderStore();

const PAGE_SIZE = 10;
const visibleCount = ref(PAGE_SIZE);

const searchInput = ref("");
const debouncedQuery = useDebouncedRef("", 300);
watch(searchInput, (value) => {
  debouncedQuery.value = value;
});

const filters = reactive(defaultOrderFilters());
function resetFilters() {
  Object.assign(filters, defaultOrderFilters());
}

const filteredOrders = computed(() => {
  const query = debouncedQuery.value.trim().toLowerCase();

  return orderStore.orders.filter((order) => {
    const matchesSearch =
      !query ||
      order.customerName.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.garmentType.toLowerCase().includes(query);

    const matchesStatus = filters.status === "all" || order.status === filters.status;
    const matchesPayment = filters.paymentStatus === "all" || order.paymentStatus === filters.paymentStatus;
    const matchesDateFrom = !filters.dateFrom || (!!order.dueDate && order.dueDate >= filters.dateFrom);
    const matchesDateTo = !filters.dateTo || (!!order.dueDate && order.dueDate <= filters.dateTo);

    return matchesSearch && matchesStatus && matchesPayment && matchesDateFrom && matchesDateTo;
  });
});

watch([debouncedQuery, filters], () => {
  visibleCount.value = PAGE_SIZE;
});

const visibleOrders = computed(() => filteredOrders.value.slice(0, visibleCount.value));
const hasMore = computed(() => visibleCount.value < filteredOrders.value.length);

const formModalOpen = ref(false);
const editingOrder = ref<OrderType | null>(null);

function openCreate() {
  editingOrder.value = null;
  formModalOpen.value = true;
}

const statusSheetOpen = ref(false);
const statusOrder = ref<OrderType | null>(null);

function handleView(order: OrderType) {
  router.push(`/orders/${order.id}`);
}

function handleWhatsApp(order: OrderType) {
  window.open(toWhatsAppLink(order.customerPhone), "_blank");
}

function handleStage(order: OrderType) {
  statusOrder.value = order;
  statusSheetOpen.value = true;
}

onMounted(() => {
  orderStore.fetchOrders().catch(() => {});
});
</script>