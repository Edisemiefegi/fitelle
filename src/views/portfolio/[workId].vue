<template>
  <div v-if="work && portfolio" class="min-h-screen bg-white">
    <nav class="mx-auto max-w-4xl px-6 pt-8">
      <RouterLink
        :to="`/portfolio/${slug}`"
        class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="size-3.5" />
        {{ portfolio.brandName }}
      </RouterLink>
    </nav>

    <main class="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <div class="space-y-3">
        <img
          v-for="img in work.images"
          :key="img.fileId"
          :src="img.url"
          :alt="work.title"
          class="w-full rounded-2xl object-cover"
        />
        <p
          v-if="!work.images.length"
          class="rounded-2xl bg-muted py-24 text-center text-sm text-muted-foreground"
        >
          No photos on this piece yet.
        </p>
      </div>

      <div class="space-y-4">
        <div>
          <p class="text-[10px] uppercase tracking-wide text-muted-foreground">
            {{ work.category }}
          </p>
          <h1 class="font-display text-2xl font-medium sm:text-3xl">
            {{ work.title }}
          </h1>
        </div>

        <p
          v-if="work.description"
          class="max-w-2xl text-sm leading-6 text-muted-foreground"
        >
          {{ work.description }}
        </p>

        <div class="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span v-if="work.fabric"
            ><span class="text-foreground">Fabric</span> ·
            {{ work.fabric }}</span
          >
          <span v-if="work.occasion"
            ><span class="text-foreground">Occasion</span> ·
            {{ work.occasion }}</span
          >
        </div>

        <div v-if="work.tags.length" class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in work.tags"
            :key="tag"
            class="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium"
          >
            {{ tag }}
          </span>
        </div>

        <div class="flex flex-wrap items-center gap-2 pt-2">
          <a
            v-if="canWhatsApp"
            :href="toWhatsAppLink(portfolio.contact.phone, whatsappMessage)"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-medium text-white transition hover:opacity-85"
          >
            <MessageCircle class="size-3.5" />
            Enquire on WhatsApp
          </a>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-medium transition hover:bg-muted"
            @click="copyLink"
          >
            <Copy class="size-3.5" />
            {{ copied ? "Link copied!" : "Share this piece" }}
          </button>
        </div>
      </div>
    </main>

    <footer
      class="border-t border-border/60 py-6 text-center text-[11px] text-muted-foreground"
    >
      Built with
      <RouterLink to="/" class="font-medium text-foreground hover:underline"
        >Fitelle</RouterLink
      >
    </footer>
  </div>

  <div
    v-else-if="isLoading"
    class="flex min-h-screen items-center justify-center"
  >
    <div class="h-10 w-48 animate-pulse rounded-full bg-muted/60" />
  </div>

  <div
    v-else
    class="flex min-h-screen flex-col items-center justify-center px-6 text-center"
  >
    <p class="font-display text-xl">This piece isn't available</p>
    <p class="mt-1 text-sm text-muted-foreground">
      It may have been unpublished or removed.
    </p>
    <RouterLink
      :to="`/portfolio/${slug}`"
      class="mt-4 text-xs font-medium text-primary hover:underline"
    >
      Back to the portfolio
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { ArrowLeft, Copy, MessageCircle } from "@lucide/vue";
import { usePublicWork } from "@/composables/usePublicPortfolio";
import { toWhatsAppLink } from "@/lib";

const route = useRoute();
const slug = route.params.slug as string;
const { portfolio, work, isLoading } = usePublicWork(slug, route.params.workId as string);

const copied = ref(false);

const canWhatsApp = computed(() => portfolio.value?.contact.whatsapp && portfolio.value.contact.phone);

const whatsappMessage = computed(
  () =>
    `Hi ${portfolio.value?.brandName}, I love this piece — "${work.value?.title}" — and would love to talk about something similar.`,
);

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href);
  copied.value = true;
  setTimeout(() => (copied.value = false), 1500);
}
</script>
