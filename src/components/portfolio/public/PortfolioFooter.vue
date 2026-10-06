<template>
  <footer
    class="flex flex-col gap-4 border-t border-portfolio-muted/30 px-5 py-7 text-xs md:flex-row md:items-center md:justify-between md:px-10 lg:px-16"
  >
    <span class="font-display text-lg">{{ portfolio.brandName }}</span>
    <span v-if="portfolio.contact.location">{{ portfolio.contact.location }}</span>

    <div class="flex gap-5">
      <a v-if="portfolio.contact.email" :href="`mailto:${portfolio.contact.email}`">Email</a>
      <a v-if="instagramUrl" :href="instagramUrl" target="_blank" rel="noreferrer">Instagram</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { toSocialLink } from "@/lib";
import type { Portfolio } from "@/types/portfolio";

const props = defineProps<{ portfolio: Portfolio }>();

const instagramUrl = computed(() => toSocialLink("instagram", props.portfolio.contact.instagram));
</script>
