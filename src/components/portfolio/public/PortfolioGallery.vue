<template>
  <section id="work" class="px-5 py-24 md:px-10 md:py-32 lg:px-16">
    <div class="mx-auto max-w-[1472px]">
      <div class="mb-16 flex items-end justify-between gap-8">
        <div>
          <p class="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            Selected work
          </p>

          <h2
            class="mt-4 font-display text-5xl leading-none tracking-[-0.03em] md:text-7xl"
          >
            Recent pieces
          </h2>
        </div>

        <span class="hidden max-w-[180px] text-right text-xs leading-relaxed text-muted-foreground md:block">
          A collection of garments, details and finished pieces.
        </span>
      </div>

      <div v-if="isLoading" class="grid gap-8 md:grid-cols-2">
        <div
          v-for="i in 4"
          :key="i"
          class="aspect-[4/5] animate-pulse bg-muted"
        />
      </div>

      <div
        v-else-if="works.length"
        class="grid gap-x-5 gap-y-16 md:grid-cols-12 md:gap-y-24"
      >
        <RouterLink
          v-for="(work, index) in works"
          :key="work.id"
          :to="`/portfolio/${slug}/${work.id}`"
          class="group block md:col-span-5"
          :class="index % 3 === 1 ? 'md:col-start-8 md:mt-32' : ''"
        >
          <div class="overflow-hidden bg-muted">
            <img
              v-if="coverUrl(work)"
              :src="coverUrl(work)!"
              :alt="work.title"
              class="aspect-[4/5] h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>

          <div class="mt-4 flex items-start justify-between gap-5">
            <div>
              <p class="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {{ work.category }}
              </p>

              <h3 class="mt-1 font-display text-2xl">
                {{ work.title }}
              </h3>
            </div>

            <ArrowUpRight
              class="mt-1 size-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </div>
        </RouterLink>
      </div>

      <div v-else class="border-y py-16 text-center">
        <p class="font-display text-2xl">
          The collection is coming soon.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from "@lucide/vue";
import { getCoverImage } from "@/constants/portfolio";
import type { PortfolioWork } from "@/types/portfolio";

defineProps<{
  works: PortfolioWork[];
  slug: string;
  isLoading: boolean;
}>();

const coverUrl = (work: PortfolioWork) => getCoverImage(work)?.url ?? null;
</script>
