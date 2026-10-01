<template>
  <header class="mx-auto max-w-3xl px-6 pt-14 pb-10 text-center sm:pt-20">
    <img
      v-if="business.profileImage"
      :src="business.profileImage"
      :alt="business.businessName"
      class="mx-auto size-16 rounded-full object-cover sm:size-20"
    />
    <div
      v-else
      class="mx-auto flex size-16 items-center justify-center rounded-full bg-black text-lg font-medium text-white sm:size-20"
    >
      {{ initials }}
    </div>

    <h1 class="mt-5 font-display text-3xl font-medium tracking-tight sm:text-4xl">{{ business.businessName }}</h1>

    <p v-if="business.bio" class="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
      {{ business.bio }}
    </p>

    <div class="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <span v-if="business.location" class="flex items-center gap-1">
        <MapPin class="size-3.5" />
        {{ business.location }}
      </span>
    </div>

    <a
      v-if="business.whatsapp && business.phoneNumber"
      :href="toWhatsAppLink(business.phoneNumber, `Hi ${business.businessName}, I found your portfolio and I'd love to talk about a piece.`)"
      target="_blank"
      rel="noopener"
      class="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-xs font-medium text-white transition hover:opacity-85"
    >
      <MessageCircle class="size-3.5" />
      Message on WhatsApp
    </a>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { MapPin, MessageCircle } from "@lucide/vue";
import { toWhatsAppLink } from "@/lib/index";
import type { PublicBusinessProfile } from "@/types/portfolio";

const props = defineProps<{
  business: PublicBusinessProfile;
}>();

const initials = computed(() =>
  props.business.businessName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join(""),
);
</script>