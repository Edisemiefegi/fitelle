<template>
  <main class="space-y-5">
    <Header
      :title="order?.clothingType"
      :text="text"
      :subtitle="order.customerName"
      button="Edit order"
    >
      <Button size="sm" variant="outline">
        <MessageCircleCheck />
        WhatsApp
      </Button>
    </Header>

    <div class="space-y-2">
      <p class="font-display font-medium flex">
        <Scissors /> Design Reference & Moodboard
      </p>

      <div
        class="relative rounded-md h-40 w-full bg-background flex items-center justify-center"
      >
        <Image />
        <span class="absolute bottom-2 left-2 text-sm"
          >short note on Reference</span
        >
      </div>
      <div class="">
        <p class="text-primary text-[10px]">THE BRIEF</p>
        <p class="text-sm">{{ order.description }}</p>
      </div>

      <div>
        <p class="text-primary text-[10px]">FABRIC</p>
        <p class="text-xs">Client supplied · champagne lace</p>
      </div>
      <div>
        <p class="text-primary text-[10px]">REQUIREMENT</p>
        <p class="text-xs">Client supplied · champagne lace</p>
      </div>
    </div>

    <Card>
      <p>Measurement</p>
      <MeasurementFieldEditor
        v-model="editableMeasurements"
        v-model:custom-fields="editableCustomFields"
        unit="in"
      />
    </Card>

    <Card class="bg-butter! font-display" content-class-name="space-y-3">
      <template #left>
        <p class="text-xs text-primary">PAYMENT DESK</p>
      </template>
      <div>
        <h4 class="font-semibold text-xl">₦65,000</h4>
        <p class="text-xs text-gray-600">remaining of ₦185,000</p>
      </div>
      <!-- Progress -->
      <div class="space-y-1.5 mt-3">
        <div class="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-primary transition-all"
            :style="{ width: `${order.progress}%` }"
          />
        </div>
        <div class="flex flex-wrap items-center justify-between text-[9px]">
          <span class="font-medium text-primary"> paid ₦65,00 </span>
          <span class="font-medium text-primary">
            {{ order.progress }}% {{ order.progressLabel }}
          </span>
        </div>
      </div>

      <Button class="w-full" size="sm"> Record payment <Plus /></Button>
    </Card>

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
            <template v-for="(step, index) in productionSteps" :key="step">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                >
                  <Check v-if="index < order.step" class="size-3.5" />
                  <span v-else>{{ index + 1 }}</span>
                </div>

                <span
                  class="whitespace-nowrap text-xs font-medium"
                  :class="
                    index <= order.step
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  "
                >
                  {{ step }}
                </span>
              </div>

              <div
                v-if="index < productionSteps.length - 1"
                class="mx-3 h-px w-8 shrink-0"
                :class="index < order.step ? 'bg-primary' : 'bg-border'"
              />
            </template>
          </div>
        </div>

        <div
          class="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-sm font-medium">Current stage</p>
            <p class="text-xs text-muted-foreground">
              {{ order.status }}
            </p>
          </div>

          <Button variant="outline" size="sm">
            <Camera class="size-4" />
            Attach photo
          </Button>
        </div>
      </div>
    </div>
    <section class="space-y-5">
      <div class="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
        <div
          class=""
        >
          <div class="flex justify-between">
            <div class="min-w-0">
              <p class="text-xs text-muted-foreground">
                Customer tracking link
              </p>

              <p
                class="mt-1 truncate font-mono text-xs text-foreground sm:text-sm"
              >
                https://fitelle.app/track/sjjs/shhsh
              </p>
            </div>
            <Button variant="outline" size="sm" class="shrink-0">
              Preview
              <Link class="size-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" class="shrink-0">
            <Copy class="size-4" />
            Copy link
          </Button>
        </div>

        <p class="mt-4 text-xs leading-5 text-muted-foreground">
          Share this link with {{ order?.customerName }} so they can follow the
          progress of their order in real time.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import Header from "@/components/base/Header.vue";
import Button from "@/components/ui/button/Button.vue";
import {
  Camera,
  Copy,
  Image,
  Link,
  MessageCircleCheck,
  Plus,
  Scissors,
} from "@lucide/vue";
import Card from "@/components/base/Card.vue";
import { ref } from "vue";
import MeasurementFieldEditor from "@/components/customer/MeasurementFieldEditor.vue";
import type { MeasurementField } from "@/types/customer";

const route = useRoute();
const id = route.params.id;

const editableMeasurements = ref<Record<string, number | null>>({});
const editableCustomFields = ref<MeasurementField[]>([]);
const productionSteps = ["Cut", "Sewing", "Fitting", "Ready"];

const orders = [
  {
    id: "INV-2024-089",
    image: "/images/orders/order-1.jpg",
    imageCount: 3,
    monogram: "AJ",
    category: "High Priority Gala",
    customerName: "Ada Johnson",
    clothingType: "Emerald Brocade Wedding Guest Dress",
    description: "Double-tiered architectural shoulders wings, gold...",
    status: "Sewing",
    step: 4,
    totalSteps: 8,
    progress: 50,
    progressLabel: "Completed",
    dueLabel: "Due Oct 20 (in 3 days)",
    overdue: true,
    paymentStatus: "partial",
    total: 120000,
    paid: 80000,
    balance: 40000,
  },
  {
    id: "INV-2024-088",
    image: "/images/orders/order-2.jpg",
    imageCount: 2,
    monogram: "ZB",
    category: "Bridal Party",
    customerName: "Zainab Bello",
    clothingType: "Silk Organza Aso-Ebi Corset Gown",
    description: "Internal boned corset framework, hand-gathered...",
    status: "Fitting",
    step: 6,
    totalSteps: 8,
    progress: 75,
    progressLabel: "Completed",
    dueLabel: "Due Tomorrow (Oct 19)",
    overdue: true,
    paymentStatus: "partial",
    total: 150000,
    paid: 105000,
    balance: 45000,
  },
  {
    id: "INV-2024-085",
    image: "/images/orders/order-3.jpg",
    imageCount: 1,
    monogram: "FS",
    category: "Completed Milestone",
    customerName: "Folake Sanya",
    clothingType: "Crepe Dinner Suit with Pearl Lapel",
    description: "Custom hand-stitched freshwater pearl satin lapels with...",
    status: "Ready",
    step: 8,
    totalSteps: 8,
    progress: 100,
    progressLabel: "Prepared",
    dueLabel: "Due Oct 24",
    overdue: false,
    paymentStatus: "paid",
    total: 120000,
    paid: 120000,
    balance: 0,
  },
];

const order: any = orders.find((e) => e.id == id);
const text = order?.id + " " + "|" + " " + order?.status;
</script>

<style scoped></style>
