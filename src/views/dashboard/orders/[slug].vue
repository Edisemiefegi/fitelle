<template>
  <main class="mx-auto max-w-md space-y-5 px-4 py-6">
    <template v-if="order">
      <div class="text-center">
        <p class="text-xs text-muted-foreground">Order for</p>
        <h1 class="font-display text-lg font-semibold">{{ order.customerName }}</h1>
        <p class="text-sm text-muted-foreground">{{ order.garmentType }}</p>
      </div>

      <!-- Status pipeline -->
      <div class="rounded-xl border border-border bg-card/50 p-4">
        <p class="mb-3 text-xs font-medium text-primary">CURRENT STATUS</p>
        <div class="space-y-2">
          <div
            v-for="(status, index) in PRODUCTION_STATUSES"
            :key="status"
            class="flex items-center gap-2 text-sm"
            :class="index <= currentIndex ? 'text-foreground' : 'text-muted-foreground'"
          >
            <div
              class="flex size-5 shrink-0 items-center justify-center rounded-full text-[10px]"
              :class="index <= currentIndex ? 'bg-primary text-primary-foreground' : 'bg-muted'"
            >
              <Check v-if="index < currentIndex" class="size-3" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            {{ status }}
          </div>
        </div>
      </div>

      <!-- Due date + requirements -->
      <div class="rounded-xl border border-border bg-card/50 p-4 space-y-3">
        <div>
          <p class="text-xs text-primary">DUE DATE</p>
          <p class="text-sm font-medium">{{ order.dueDate ? formatDate(order.dueDate) : "Not set yet" }}</p>
        </div>

        <div v-if="order.description">
          <p class="text-xs text-primary">THE BRIEF</p>
          <p class="text-sm">{{ order.description }}</p>
        </div>

        <div v-if="order.requirements.length">
          <p class="text-xs text-primary">REQUIREMENTS</p>
          <ul class="mt-1 space-y-1">
            <li v-for="req in order.requirements" :key="req.id" class="flex items-center gap-2 text-sm">
              <Check v-if="req.done" class="size-3.5 text-primary" />
              <span v-else class="size-3.5 rounded-full border border-border" />
              <span :class="req.done && 'text-muted-foreground line-through'">{{ req.label }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Payment summary -->
      <div class="rounded-xl border border-border bg-butter! p-4 font-display">
        <p class="text-xs text-primary">PAYMENT SUMMARY</p>
        <h4 class="mt-1 font-semibold text-xl">{{ formatCurrency(order.balance) }} remaining</h4>
        <div class="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div class="h-full rounded-full bg-primary" :style="{ width: `${paidPercent}%` }" />
        </div>
        <p class="mt-1.5 text-[10px] text-muted-foreground">
          {{ formatCurrency(order.paid) }} paid of {{ formatCurrency(order.total) }}
        </p>
      </div>

   

      <!-- Progress images (only ones the tailor made visible) -->
      <div v-if="order.progressImages.length" class="space-y-2">
        <p class="text-xs font-medium text-primary">PROGRESS PHOTOS</p>
        <div class="grid grid-cols-3 gap-2">
          <img v-for="img in order.progressImages" :key="img.fileId" :src="img.url" class="aspect-square w-full rounded-lg object-cover" alt="" />
        </div>
      </div>
    </template>

    <div v-else-if="isLoading" class="space-y-3">
      <div class="h-24 w-full animate-pulse rounded-xl bg-muted/60" />
      <div class="h-40 w-full animate-pulse rounded-xl bg-muted/60" />
    </div>

    <div v-else class="pt-16 text-center">
      <p class="text-sm font-medium">This tracking link isn't valid</p>
      <p class="mt-1 text-xs text-muted-foreground">Double-check the link your tailor sent you.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { Check } from "@lucide/vue";
import { fetchPublicOrderBySlug } from "@/service/publicOrder";
import { PRODUCTION_STATUSES } from "@/types/order";
import { statusIndex } from "@/constants/orders";
import { formatCurrency, formatDate } from "@/lib";
import type { PublicOrderView } from "@/types/order";

const route = useRoute();
const slug = route.params.slug as string;

const order = ref<PublicOrderView | null>(null);
const isLoading = ref(true);

const currentIndex = computed(() => (order.value ? statusIndex(order.value.status) : 0));
const paidPercent = computed(() =>
  order.value && order.value.total > 0 ? Math.round((order.value.paid / order.value.total) * 100) : 0,
);

onMounted(async () => {
  try {
    order.value = await fetchPublicOrderBySlug(slug);
  } catch (error) {
    console.error("fetchPublicOrderBySlug error:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>