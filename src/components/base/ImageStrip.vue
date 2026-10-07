<template>
  <div class="group/strip relative">
    <div
      ref="scroller"
      class="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]"
    >
      <button
        v-for="(image, i) in images"
        :key="image.url"
        type="button"
        class="aspect-[5/4] w-28 shrink-0 snap-start overflow-hidden rounded-xl bg-muted ring-offset-2 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary sm:w-44 lg:w-52"
        :aria-label="`View image ${i + 1} of ${images.length}`"
        @click="viewing = i"
      >
        <img
          :src="image.url"
          :alt="image.alt ?? ''"
          loading="lazy"
          class="h-full w-full object-cover"
        />
      </button>
    </div>

    <!-- Desktop arrows; touch screens just swipe -->
    <template v-if="images.length > 2">
      <button
        type="button"
        class="absolute left-1 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow ring-1 ring-black/5 transition hover:bg-white md:group-hover/strip:block"
        aria-label="Scroll left"
        @click="scrollBy(-1)"
      >
        <ChevronLeft class="size-4" />
      </button>
      <button
        type="button"
        class="absolute right-1 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/90 p-1.5 shadow ring-1 ring-black/5 transition hover:bg-white md:group-hover/strip:block"
        aria-label="Scroll right"
        @click="scrollBy(1)"
      >
        <ChevronRight class="size-4" />
      </button>
    </template>

    <ImageLightbox v-model="viewing" :images="images" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import ImageLightbox, { type LightboxImage } from "./ImageLightbox.vue";

defineProps<{ images: LightboxImage[] }>();

const viewing = ref<number | null>(null);
const scroller = ref<HTMLElement>();

function scrollBy(direction: 1 | -1) {
  scroller.value?.scrollBy({
    left: direction * scroller.value.clientWidth * 0.8,
    behavior: "smooth",
  });
}
</script>
