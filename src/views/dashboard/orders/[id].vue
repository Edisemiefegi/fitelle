<template>
  <main v-if="order" class="space-y-5">
    <Header
      :title="order.garmentType"
      :text="`${order.id} | ${order.status}`"
      :subtitle="order.customerName"
    >
      <div class="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          @click="openWhatsApp(order?.customerPhone)"
        >
          <MessageCircleCheck />
          WhatsApp
        </Button>
        <Button size="sm" variant="outline" @click="editModalOpen = true"
          >Edit order</Button
        >
        <Button
          size="sm"
          variant="ghost"
          class="text-danger"
          @click="deleteDialogOpen = true"
        >
          <Trash2 class="size-4" />
        </Button>
      </div>
    </Header>

    <OrderFormModal
      :key="order.id"
      :open="editModalOpen"
      :order="order"
      @update:open="editModalOpen = $event"
    />

    <AlertDialog
      v-model:open="deleteDialogOpen"
      title="Delete this order?"
      :description="`This removes ${order.customerName}'s &quot;${order.garmentType}&quot; order and its reference/progress images. This can't be undone.`"
      confirm-text="Delete order"
      cancel-text="Cancel"
      destructive
      @confirm="handleDelete(order)"
    />

    <RecordPaymentDialog
      :open="paymentDialogOpen"
      :order="order"
      @update:open="paymentDialogOpen = $event"
    />
    <StatusUpdateSheet
      :open="statusSheetOpen"
      :order="order"
      @update:open="statusSheetOpen = $event"
    />

    <!-- Design reference -->
    <div class="space-y-2">
      <p class="flex items-center gap-2 font-display font-medium">
        <Scissors class="size-4" /> Design reference
      </p>

      <div
        v-if="order.referenceImages.length"
        class="grid grid-cols-3 gap-2 sm:grid-cols-4"
      >
        <img
          v-for="img in order.referenceImages"
          :key="img.fileId"
          :src="img.url"
          class="aspect-square w-full rounded-md object-cover"
          alt=""
        />
      </div>
      <div
        v-else
        class="rounded-md h-32 w-full bg-muted flex items-center justify-center"
      >
        <p class="text-xs text-muted-foreground">No reference images</p>
      </div>

      <div>
        <p class="text-primary text-[10px]">THE BRIEF</p>
        <p class="text-sm">
          {{ order.description || "No description added." }}
        </p>
      </div>

      <div>
        <p class="text-primary text-[10px]">FABRIC</p>
        <p class="text-xs">
          {{
            order.fabricSource === "customer_supplied"
              ? "Customer supplied"
              : "Needs sourcing"
          }}
        </p>
      </div>

      <div v-if="order.requirements.length">
        <p class="text-primary text-[10px]">REQUIREMENTS</p>
        <ul class="mt-1 space-y-1">
          <li
            v-for="req in order.requirements"
            :key="req.id"
            class="flex items-center gap-2 text-xs"
          >
            <Check v-if="req.done" class="size-3 text-primary" />
            <span v-else class="size-3 rounded-full border border-border" />
            <span :class="req.done && 'text-muted-foreground line-through'">{{
              req.label
            }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Measurements (read-only; edit via "Edit order") -->
    <Card>
      <p class="mb-2 text-sm font-medium">
        Measurements
        <span class="font-normal text-muted-foreground">
          ({{
            order.measurements.source === "customer_default"
              ? "customer default"
              : "order specific"
          }})
        </span>
      </p>
      <div class="grid grid-cols-3 gap-2 sm:grid-cols-4">
        <div
          v-for="(value, key) in nonNullMeasurements"
          :key="key"
          class="rounded-lg bg-muted/50 px-2 py-1.5"
        >
          <p class="text-[9px] uppercase text-muted-foreground">{{ key }}</p>
          <p class="text-sm font-medium">
            {{ value }}{{ order.measurements.unit }}
          </p>
        </div>
        <p
          v-if="!Object.keys(nonNullMeasurements).length"
          class="text-xs text-muted-foreground"
        >
          No measurements recorded yet.
        </p>
      </div>
    </Card>

    <!-- Payment desk -->
    <Card class="bg-butter! font-display" content-class-name="space-y-3">
      <template #left>
        <p class="text-xs text-primary">PAYMENT DESK</p>
      </template>
      <div>
        <h4 class="font-semibold text-xl">
          {{ formatCurrency(order.balance) }}
        </h4>
        <p class="text-xs text-gray-600">
          remaining of {{ formatCurrency(order.total) }}
        </p>
      </div>

      <div class="space-y-1.5 mt-3">
        <div class="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-primary transition-all"
            :style="{ width: `${paidPercent}%` }"
          />
        </div>
        <div class="flex flex-wrap items-center justify-between text-[9px]">
          <span class="font-medium text-primary"
            >paid {{ formatCurrency(order.paid) }}</span
          >
          <span class="font-medium text-primary"
            >{{ paidPercent }}% {{ order.paymentStatus }}</span
          >
        </div>
      </div>

      <Button
        v-if="order.balance > 0"
        class="w-full"
        size="sm"
        @click="paymentDialogOpen = true"
      >
        Record payment <Plus />
      </Button>
    </Card>

    <!-- Production -->
    <div class="space-y-5">
      <div>
        <h2 class="font-display text-base font-semibold">Production</h2>
        <p class="max-w-xl text-xs leading-5 text-muted-foreground">
          Track the order from cutting to completion.
        </p>
      </div>

      <div class="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
        <div class="overflow-x-auto pb-2">
          <div class="flex min-w-max items-center">
            <template
              v-for="(status, index) in PRODUCTION_STATUSES"
              :key="status"
            >
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                  :class="
                    index <= currentStepIndex
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  "
                >
                  <Check v-if="index < currentStepIndex" class="size-3.5" />
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span
                  class="whitespace-nowrap text-xs font-medium"
                  :class="
                    index <= currentStepIndex
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  "
                >
                  {{ status }}
                </span>
              </div>
              <div
                v-if="index < PRODUCTION_STATUSES.length - 1"
                class="mx-3 h-px w-8 shrink-0"
                :class="index < currentStepIndex ? 'bg-primary' : 'bg-border'"
              />
            </template>
          </div>
        </div>

        <div
          class="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm font-medium">Current stage</p>
            <p class="text-xs text-muted-foreground">{{ order.status }}</p>
          </div>
          <Button variant="outline" size="sm" @click="statusSheetOpen = true"
            >Change stage</Button
          >
        </div>
      </div>

      <ProgressPhotosSection :order="order" />
    </div>

    <!-- Tracking link -->
    <section class="space-y-5">
      <div class="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
        <div class="flex justify-between gap-3">
          <div class="min-w-0">
            <p class="text-xs text-muted-foreground">Customer tracking link</p>
            <p
              class="mt-1 truncate font-mono text-xs text-foreground sm:text-sm"
            >
              {{ trackingUrl }}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            class="shrink-0"
            @click="openTrackingLink"
          >
            Preview
            <Link class="size-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          class="mt-3 shrink-0"
          @click="copyLink"
        >
          <Copy class="size-4" />
          {{ copied ? "Copied!" : "Copy link" }}
        </Button>

        <p class="mt-4 text-xs leading-5 text-muted-foreground">
          Share this link with {{ order.customerName }} so they can follow the
          progress of their order in real time.
        </p>
      </div>
    </section>
  </main>

  <main v-else-if="orderStore.isLoading" class="space-y-3">
    <div class="h-8 w-48 animate-pulse rounded bg-muted/60" />
    <div class="h-64 w-full animate-pulse rounded-xl bg-muted/60" />
  </main>

  <main
    v-else
    class="rounded-xl border border-dashed border-border px-6 py-12 text-center"
  >
    <p class="text-sm font-medium">Order not found</p>
    <Button
      class="mt-4"
      size="sm"
      variant="outline"
      @click="router.push('/orders')"
      >Back to orders</Button
    >
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  Check,
  Copy,
  Link,
  MessageCircleCheck,
  Plus,
  Scissors,
  Trash2,
} from "@lucide/vue";

import Header from "@/components/base/Header.vue";
import Card from "@/components/base/Card.vue";
import Button from "@/components/ui/button/Button.vue";
import OrderFormModal from "@/components/orders/OrderFormModal.vue";
import RecordPaymentDialog from "@/components/orders/RecordPaymentDialog.vue";
import StatusUpdateSheet from "@/components/orders/StatusUpdateSheet.vue";
import AlertDialog from "@/components/base/AlertDialog.vue";
import ProgressPhotosSection from "@/components/orders/ProgressPhotosSection.vue";

import { useOrderStore } from "@/stores/order";
import { PRODUCTION_STATUSES, type OrderType } from "@/types/order";
import { statusIndex } from "@/constants/orders";
import { formatCurrency, toWhatsAppLink } from "@/lib";

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const id = route.params.id as string;
const order = computed(() => orderStore.getOrderById(id));

onMounted(async () => {
  if (!orderStore.orders.length) {
    await orderStore.fetchOrders().catch(() => {});
  }
});

const editModalOpen = ref(false);
const deleteDialogOpen = ref(false);
const paymentDialogOpen = ref(false);
const statusSheetOpen = ref(false);
const copied = ref(false);
const isDeleting = ref(false);

const currentStepIndex = computed(() =>
  order.value ? statusIndex(order.value.status) : 0,
);
const paidPercent = computed(() =>
  order.value && order.value.total > 0
    ? Math.round((order.value.paid / order.value.total) * 100)
    : 0,
);

function openWhatsApp(phone: string) {
  window.open(toWhatsAppLink(phone), "_blank");
}

const nonNullMeasurements = computed(() => {
  if (!order.value) return {};
  return Object.fromEntries(
    Object.entries(order.value.measurements.values).filter(
      ([, v]) => v !== null && v !== undefined,
    ),
  );
});

const trackingUrl = computed(() =>
  order.value
    ? `${window.location.origin}/track/${order.value.trackingSlug}`
    : "",
);

function openTrackingLink() {
  window.open(trackingUrl.value, "_blank");
}

async function copyLink() {
  await navigator.clipboard.writeText(trackingUrl.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}

async function handleDelete(order: OrderType) {
  if (isDeleting.value) return;
  isDeleting.value = true;
  try {
    await orderStore.deleteOrder(order.id);
    router.push("/orders");
  } catch {
  } finally {
    isDeleting.value = false;
  }
}
</script>
