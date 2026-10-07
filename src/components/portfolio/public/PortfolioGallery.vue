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

      <!-- Category filter -->
      <div v-if="categories.length > 1" class="-mt-6 mb-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
        <button
          v-for="option in ['All', ...categories]"
          :key="option"
          type="button"
          role="tab"
          :aria-selected="activeCategory === option"
          class="rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors"
          :class="activeCategory === option ? 'border-black bg-black text-white' : 'border-black/15 text-muted-foreground hover:border-black/40 hover:text-foreground'"
          @click="activeCategory = option"
        >
          {{ option }}
          <span class="ml-1 opacity-60">{{ option === "All" ? works.length : counts[option] }}</span>
        </button>
      </div>

      <div v-if="isLoading" class="grid gap-8 md:grid-cols-2">
        <div
          v-for="i in 4"
          :key="i"
          class="aspect-[4/5] animate-pulse bg-muted"
        />
      </div>

      <div
        v-else-if="visibleWorks.length"
        :key="activeCategory"
        class="grid gap-x-5 gap-y-16 md:grid-cols-12 md:gap-y-24"
      >
        <RouterLink
          v-for="(work, index) in visibleWorks"
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
          {{ works.length ? "Nothing in this category yet." : "The collection is coming soon." }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { ArrowUpRight } from "@lucide/vue";
import { getCoverImage } from "@/constants/portfolio";
import { PORTFOLIO_CATEGORIES, type PortfolioWork } from "@/types/portfolio";

const props = defineProps<{
  works: PortfolioWork[];
  slug: string;
  isLoading: boolean;
}>();

const activeCategory = ref("All");

// Only categories that actually have a piece, in a stable order.
const categories = computed(() => PORTFOLIO_CATEGORIES.filter((c) => props.works.some((w) => w.category === c)));
const counts = computed(() =>
  Object.fromEntries(categories.value.map((c) => [c, props.works.filter((w) => w.category === c).length])),
);
const visibleWorks = computed(() =>
  activeCategory.value === "All" ? props.works : props.works.filter((w) => w.category === activeCategory.value),
);

// If the selected category disappears (works reload), fall back to everything.
watch(categories, (list) => {
  if (activeCategory.value !== "All" && !(list as readonly string[]).includes(activeCategory.value)) activeCategory.value = "All";
});

const coverUrl = (work: PortfolioWork) => getCoverImage(work)?.url ?? null;
</script>
