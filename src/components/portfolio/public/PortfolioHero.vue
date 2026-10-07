<template>
  <section
    id="top"
    class="relative min-h-[100svh] overflow-hidden bg-[#171614] text-white"
  >
    <div class="absolute inset-0">
      <img
        v-if="heroImage"
        :src="heroImage"
        :alt="heroWork?.title ?? portfolio.brandName"
        class="hero-image h-full w-full object-cover"
      />

      <div
        v-else
        class="h-full w-full bg-gradient-to-br from-neutral-700 via-neutral-900 to-black"
      />

      <div class="absolute inset-0 bg-black/25" />
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20"
      />
    </div>

    <div
      class="relative z-10 flex min-h-[100svh] flex-col justify-between px-5 pb-7 pt-28 md:px-10 md:pb-10 lg:px-16"
    >
      <div
        class="flex items-start justify-between gap-6 text-[10px] uppercase tracking-[0.22em]"
      >
        <p class="hero-reveal">Bespoke tailoring</p>

        <p
          v-if="portfolio.contact.location"
          class="hero-reveal hidden text-right sm:block"
        >
          {{ portfolio.contact.location }}
        </p>
      </div>

      <div class="max-w-5xl">
        <p
          class="hero-reveal mb-5 text-xs uppercase tracking-[0.2em] text-white/70"
        >
          {{ portfolio.brandName }}
        </p>

        <h1
          class="hero-title font-display text-[clamp(3.8rem,10vw,9rem)] leading-[0.86] tracking-[-0.055em]"
        >
          {{ portfolio.tagline || "Made for your moment." }}
        </h1>

        <div class="mt-9 flex flex-wrap items-center gap-6">
          <a
            href="#work"
            class="hero-reveal group inline-flex items-center gap-3 border-b border-white/60 pb-2 text-xs uppercase tracking-[0.18em]"
          >
            Explore the work

            <ArrowDown
              class="size-4 transition-transform duration-300 group-hover:translate-y-1"
            />
          </a>

          <p
            v-if="portfolio.introduction"
            class="hero-reveal max-w-md text-sm leading-relaxed text-white/70"
          >
            {{ portfolio.introduction }}
          </p>
        </div>
      </div>

      <div
        class="hero-reveal flex items-end justify-between gap-4 text-[9px] uppercase tracking-[0.2em] text-white/60"
      >
        <RouterLink
          v-if="heroWork"
          :to="`/portfolio/${portfolio.slug}/${heroWork.id}`"
          class="group inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          Featured: {{ heroWork.title }}
          <ArrowUpRight class="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </RouterLink>
        <span v-else>Independent by design</span>
        <span class="hidden sm:inline">Scroll to discover</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { ArrowDown, ArrowUpRight } from "@lucide/vue";
import { getCoverImage } from "@/constants/portfolio";
import type { Portfolio, PortfolioWork } from "@/types/portfolio";

const props = defineProps<{ portfolio: Portfolio; heroWork: PortfolioWork | null }>();

// The chosen piece's cover; the brand photo only when there are no published works yet.
const heroImage = computed(() => (props.heroWork && getCoverImage(props.heroWork)?.url) || props.portfolio.image?.url || "");

onMounted(() => {
  if (typeof window === "undefined") return;

  const items = document.querySelectorAll(".hero-reveal");

  items.forEach((item, index) => {
    item.animate(
      [
        {
          opacity: 0,
          transform: "translateY(18px)",
        },
        {
          opacity: 1,
          transform: "translateY(0)",
        },
      ],
      {
        duration: 700,
        delay: 150 + index * 90,
        easing: "cubic-bezier(.22,1,.36,1)",
        fill: "both",
      },
    );
  });

  const title = document.querySelector(".hero-title");

  title?.animate(
    [
      {
        opacity: 0,
        transform: "translateY(28px)",
      },
      {
        opacity: 1,
        transform: "translateY(0)",
      },
    ],
    {
      duration: 900,
      delay: 250,
      easing: "cubic-bezier(.22,1,.36,1)",
      fill: "both",
    },
  );
});
</script>

<style scoped>
.hero-image {
  transform: scale(1.04);
  animation: hero-image 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes hero-image {
  to {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-image {
    animation: none;
    transform: none;
  }
}
</style>