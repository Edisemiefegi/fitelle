<template>
  <div class="fixed inset-x-0 top-0 z-10 bg-white/90 backdrop-blur-md md:px-10 lg:px-16">
    <header class="flex w-full items-center justify-between gap-4 px-5 py-2">
      <img
        v-if="portfolio.image"
        :src="portfolio.image.url"
        :alt="portfolio.brandName"
        class="size-10 rounded-full object-cover"
      />
      <div
        v-else
        class="flex size-10 items-center justify-center rounded-full bg-black text-lg font-medium text-white"
      >
        {{ initials }}
      </div>

      <nav class="hidden gap-8 text-xs font-medium uppercase tracking-[0.12em] md:flex">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a v-if="portfolio.services.length" href="#services">Services</a>
      </nav>

      <a
        href="#contact"
        class="flex items-center gap-2 border-b border-current text-xs font-medium uppercase tracking-[0.1em]"
      >
        Enquire <ArrowUpRight class="size-4" />
      </a>
    </header>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ArrowUpRight } from "@lucide/vue";
import type { Portfolio } from "@/types/portfolio";

const props = defineProps<{ portfolio: Portfolio }>();

const initials = computed(() =>
  props.portfolio.brandName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join(""),
);
</script>
