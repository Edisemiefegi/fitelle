<template>
  <section
    id="about"
    class="bg-[#f5f3ef] px-5 py-24 md:px-10 md:py-32 lg:px-16"
  >
    <div
      class="mx-auto grid max-w-[1472px] gap-12 md:grid-cols-12 md:items-center md:gap-16"
    >
      <div class="md:col-span-6 lg:col-span-5">
        <div class="overflow-hidden">
          <img
            v-if="portfolio.image?.url"
            :src="portfolio.image.url"
            :alt="portfolio.brandName"
            class="aspect-[4/5] w-full object-cover"
            loading="lazy"
          />

          <div
            v-else
            class="flex aspect-[4/5] items-center justify-center bg-neutral-200"
          >
            <span
              class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
            >
              {{ portfolio.brandName }}
            </span>
          </div>
        </div>
      </div>

      <div class="md:col-span-6 lg:col-span-6 lg:col-start-7">
        <p class="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          About the studio
        </p>

        <h2
          class="mt-5 max-w-2xl font-display text-5xl leading-[0.94] tracking-[-0.04em] md:text-6xl lg:text-7xl"
        >
          {{ portfolio.brandName }}
        </h2>

        <p
          v-if="portfolio.about"
          class="mt-8 max-w-xl whitespace-pre-line text-sm leading-7 text-muted-foreground md:text-base"
        >
          {{ portfolio.about }}
        </p>

        <div v-if="portfolio.designerBio" class="mt-10 border-t border-black/10 pt-5">
          <p class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            The designer
          </p>
          <p class="mt-2 max-w-xl whitespace-pre-line text-sm leading-7 text-muted-foreground">
            {{ portfolio.designerBio }}
          </p>
        </div>

        <div v-if="portfolio.contact.location" class="mt-10 border-t border-black/10 pt-5">
          <p class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Based in</p>
          <p class="mt-2 font-display text-2xl">{{ portfolio.contact.location }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Portfolio } from "@/types/portfolio";

defineProps<{ portfolio: Portfolio }>();
</script>

