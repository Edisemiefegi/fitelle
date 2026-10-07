<template>
  <div class="min-h-screen bg-[#f5f3ef] text-foreground">
    <!-- Loading -->
    <main v-if="isLoading" class="mx-auto max-w-xl space-y-4 px-4 py-8">
      <div class="h-12 w-40 animate-pulse rounded-full bg-muted" />
      <div class="h-56 animate-pulse rounded-3xl bg-muted" />
      <div class="h-72 animate-pulse rounded-3xl bg-muted" />
    </main>

    <!-- Not found -->
    <main v-else-if="!order" class="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <PackageSearch class="size-8 text-muted-foreground" />
      <h1 class="mt-5 font-display text-2xl">We couldn't find this order</h1>
      <p class="mt-2 text-sm leading-6 text-muted-foreground">
        The link may be incomplete or no longer active. Please ask your designer to send it again.
      </p>
    </main>

    <template v-else>
      <!-- Brand bar -->
      <header class="border-b border-black/5 bg-white/80 backdrop-blur">
        <div class="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
          <div class="flex min-w-0 items-center gap-3">
            <img v-if="brand?.logoUrl" :src="brand.logoUrl" :alt="brandName" class="size-10 shrink-0 rounded-full object-cover" />
            <div v-else class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm text-primary-foreground">
              {{ initials }}
            </div>
            <div class="min-w-0">
              <p class="truncate font-display text-base leading-tight">{{ brandName }}</p>
              <p v-if="brand?.location" class="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                <MapPin class="size-3" /> {{ brand.location }}
              </p>
            </div>
          </div>

          <RouterLink v-if="brand?.portfolioSlug" :to="`/portfolio/${brand.portfolioSlug}`" class="shrink-0 text-[11px] font-medium uppercase tracking-[0.12em] text-primary hover:underline">
            Portfolio
          </RouterLink>
        </div>
      </header>

      <main class="mx-auto max-w-xl space-y-4 px-4 py-6 pb-12">
        <!-- Hero -->
        <section class="overflow-hidden rounded-3xl bg-[#171614] p-6 text-white shadow-sm">
          <p class="text-[11px] uppercase tracking-[0.2em] text-white/55">Hello {{ firstName }}, here's your order</p>
          <h1 class="mt-3 font-display text-4xl leading-[1.05] tracking-[-0.02em]">{{ order.garmentType }}</h1>

          <div class="mt-5 flex flex-wrap items-center gap-2">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              <span class="size-1.5 rounded-full bg-emerald-400" :class="!isDelivered && 'animate-pulse'" />
              {{ order.status }}
            </span>
            <span v-if="dueLabel" class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs">
              <CalendarDays class="size-3.5" /> {{ dueLabel }}
            </span>
          </div>

          <div class="mt-6">
            <div class="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div class="h-full rounded-full bg-white transition-all duration-700" :style="{ width: `${progress}%` }" />
            </div>
            <p class="mt-2 text-[11px] text-white/55">{{ progress }}% of the way there</p>
          </div>
        </section>

        <!-- Updates from the designer -->
        <section v-if="order.progressUpdates.length" class="rounded-3xl bg-white p-5 shadow-sm">
          <h2 class="font-display text-lg">Updates from {{ brandName }}</h2>
          <ul class="mt-4 space-y-5">
            <li v-for="update in order.progressUpdates" :key="update.id">
              <p class="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{{ formatDate(update.createdAt) }}</p>
              <p v-if="update.note" class="mt-1.5 text-sm leading-6">{{ update.note }}</p>
              <ImageStrip v-if="update.images.length" class="mt-2.5" :images="update.images.map((img) => ({ url: img.url, alt: 'Progress photo' }))" />
            </li>
          </ul>
        </section>

        <!-- Stage timeline -->
        <section class="rounded-3xl bg-white p-5 shadow-sm">
          <h2 class="font-display text-lg">Where things stand</h2>
          <ol class="mt-4">
            <li v-for="(step, index) in steps" :key="step.status" class="relative flex gap-3 pb-5 last:pb-0">
              <span v-if="index < steps.length - 1" class="absolute left-[11px] top-6 h-full w-px" :class="step.done ? 'bg-primary/40' : 'bg-border'" />
              <span
                class="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px]"
                :class="step.current ? 'border-primary bg-primary text-primary-foreground ring-4 ring-primary/15' : step.done ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-white text-muted-foreground'"
              >
                <Check v-if="step.done" class="size-3" />
                <span v-else>{{ index + 1 }}</span>
              </span>
              <div class="-mt-0.5">
                <p class="text-sm" :class="step.current ? 'font-medium' : step.done ? '' : 'text-muted-foreground'">{{ step.status }}</p>
                <p v-if="step.at" class="text-[11px] text-muted-foreground">{{ formatDate(step.at) }}</p>
                <p v-if="step.status === 'Fitting' && order.fittingDate" class="text-[11px] text-primary">Your fitting: {{ formatDate(order.fittingDate) }}</p>
              </div>
            </li>
          </ol>
        </section>

      

        <!-- Payment -->
        <section class="rounded-3xl bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg">Payment</h2>
            <span class="rounded-full px-2.5 py-0.5 text-[11px] font-medium" :class="paymentBadge.class">{{ paymentBadge.label }}</span>
          </div>
          <div class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div class="h-full rounded-full bg-primary transition-all duration-700" :style="{ width: `${paidPercent}%` }" />
          </div>
          <dl class="mt-4 grid grid-cols-3 gap-2 text-center">
            <div><dt class="text-[11px] text-muted-foreground">Total</dt><dd class="mt-0.5 text-sm font-medium">{{ formatCurrency(order.total) }}</dd></div>
            <div><dt class="text-[11px] text-muted-foreground">Paid</dt><dd class="mt-0.5 text-sm font-medium">{{ formatCurrency(order.paid) }}</dd></div>
            <div><dt class="text-[11px] text-muted-foreground">Balance</dt><dd class="mt-0.5 text-sm font-medium" :class="order.balance > 0 && 'text-primary'">{{ formatCurrency(order.balance) }}</dd></div>
          </dl>
        </section>

        <!-- Brief -->
        <section v-if="order.description" class="rounded-3xl bg-white p-5 shadow-sm">
          <h2 class="font-display text-lg">The brief</h2>
          <p v-if="order.description" class="mt-2 text-sm leading-6 text-muted-foreground">{{ order.description }}</p>
        </section>

        <!-- Contact -->
        <section v-if="contactActions.length" class="rounded-3xl bg-white p-5 text-center shadow-sm">
          <h2 class="font-display text-lg">Questions about your order?</h2>
          <p class="mt-1 text-sm text-muted-foreground">Reach {{ brandName }} directly.</p>
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <a
              v-for="action in contactActions"
              :key="action.label"
              :href="action.href"
              :target="action.external ? '_blank' : undefined"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium transition hover:opacity-85"
              :class="action.primary ? 'bg-black text-white' : 'border border-border bg-white'"
            >
              <component :is="action.icon" class="size-3.5" />
              {{ action.label }}
            </a>
          </div>
        </section>

        <footer class="pt-4 text-center text-[11px] text-muted-foreground">
          Order tracking by <RouterLink to="/" class="font-medium text-foreground hover:underline">Fitelle</RouterLink>
        </footer>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
import { getInitials } from "@/lib";
import ImageStrip from "@/components/base/ImageStrip.vue";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { AtSign, CalendarDays, Check, MapPin, MessageCircle, PackageSearch, Phone } from "@lucide/vue";
import { fetchPublicOrderBySlug } from "@/service/publicOrder";
import { PRODUCTION_STATUSES } from "@/types/order";
import { statusIndex, statusProgress } from "@/constants/orders";
import { formatCurrency, formatDate, toSocialLink, toWhatsAppLink } from "@/lib";
import type { PublicOrderView } from "@/types/order";

const slug = useRoute().params.slug as string;

const order = ref<PublicOrderView | null>(null);
  
const isLoading = ref(true);

onMounted(async () => {
  try {
    order.value = await fetchPublicOrderBySlug(slug);
  } catch (error) {
    console.error("fetchPublicOrderBySlug error:", error);
  } finally {
    isLoading.value = false;
  }
  if (order.value) document.title = `${order.value.garmentType} · ${brandName.value}`;
});

const brand = computed(() => order.value?.brand ?? null);
const brandName = computed(() => brand.value?.name || "Your designer");
const firstName = computed(() => order.value?.customerName.trim().split(/\s+/)[0] ?? "");
const initials = computed(() => getInitials(brandName.value));

const currentIndex = computed(() => (order.value ? statusIndex(order.value.status) : 0));
const isDelivered = computed(() => order.value?.status === "Delivered");
const progress = computed(() => (order.value ? statusProgress(order.value.status) : 0));

const steps = computed(() =>
  PRODUCTION_STATUSES.map((status, index) => ({
    status,
    done: index < currentIndex.value || (isDelivered.value && index === currentIndex.value),
    current: index === currentIndex.value && !isDelivered.value,
    // when the stage was reached (latest entry wins if it was revisited)
    at: [...(order.value?.statusHistory ?? [])].reverse().find((event) => event.status === status)?.at ?? null,
  })),
);


const dueLabel = computed(() => {
  const due = order.value?.dueDate;
  if (!due || isDelivered.value) return "";
  const [y, m, d] = due.slice(0, 10).split("-").map(Number);
  const days = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) / 86_400_000);
  const when = days === 0 ? "today" : days === 1 ? "tomorrow" : days > 1 ? `in ${days} days` : "was due " + formatDate(due);
  return days >= 0 ? `Ready ${when} · ${formatDate(due)}` : `Expected ${formatDate(due)}`;
});

const paidPercent = computed(() => (order.value && order.value.total > 0 ? Math.min(100, Math.round((order.value.paid / order.value.total) * 100)) : 0));

const paymentBadge = computed(() => {
  switch (order.value?.paymentStatus) {
    case "paid":
      return { label: "Paid in full", class: "bg-emerald-50 text-emerald-700" };
    case "partial":
      return { label: "Part paid", class: "bg-amber-50 text-amber-700" };
    default:
      return { label: "Awaiting payment", class: "bg-muted text-muted-foreground" };
  }
});

const contactActions = computed(() => {
  const b = brand.value;
  if (!b) return [];
  const actions = [];
  if (b.whatsapp && b.phone) {
    const message = `Hi ${b.name}, I'm checking on my ${order.value?.garmentType.toLowerCase()} order.`;
    actions.push({ label: "WhatsApp", icon: MessageCircle, href: toWhatsAppLink(b.phone, message), external: true, primary: true });
  }
  if (b.phone) actions.push({ label: "Call", icon: Phone, href: `tel:${b.phone}`, external: false, primary: !b.whatsapp });
  if (b.instagram) actions.push({ label: "Instagram", icon: AtSign, href: toSocialLink("instagram", b.instagram), external: true, primary: false });
  return actions;
});
</script>
