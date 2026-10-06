<template>
  <section
    v-if="portfolio.services.length"
    id="services"
    class="px-5 py-24 md:px-10 md:py-32 lg:px-16"
  >
    <div class="mx-auto max-w-[1472px]">
      <div class="mb-14 max-w-2xl">
        <p
          class="text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
        >
          What we do
        </p>

        <h2
          class="mt-4 font-display text-5xl leading-none tracking-[-0.04em] md:text-7xl"
        >
          Made around you.
        </h2>
      </div>

      <div class="border-t border-black/10">
        <div
          v-for="(service, index) in portfolio.services"
          :key="index"
          class="service-row group border-b border-black/10 py-7 md:py-9"
        >
          <div
            class="grid gap-4 md:grid-cols-12 md:items-center md:gap-8"
          >
            <span
              class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:col-span-1"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <h3
              class="font-display text-3xl tracking-[-0.025em] md:col-span-4 md:text-4xl"
            >
              {{ service.title }}
            </h3>

            <p
              v-if="service.description"
              class="max-w-lg text-sm leading-6 text-muted-foreground md:col-span-6"
            >
              {{ service.description }}
            </p>

            <ArrowUpRight
              class="hidden size-5 justify-self-end transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:block"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";
import type { Portfolio } from "@/types/portfolio";

defineProps<{ portfolio: Portfolio }>();
</script>

<style scoped>
.service-row {
  transition:
    padding-left 350ms cubic-bezier(0.22, 1, 0.36, 1),
    padding-right 350ms cubic-bezier(0.22, 1, 0.36, 1);
}

.service-row:hover {
  padding-left: 10px;
  padding-right: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .service-row {
    transition: none;
  }
}
</style>