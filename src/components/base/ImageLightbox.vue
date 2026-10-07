<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="index !== null && current"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
        @click.self="close"
      >
        <img :key="current.url" :src="current.url" :alt="current.alt ?? ''" class="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl" />

        <button type="button" class="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20" aria-label="Close" @click="close">
          <X class="size-5" />
        </button>

        <template v-if="images.length > 1">
          <button type="button" class="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20" aria-label="Previous image" @click="step(-1)">
            <ChevronLeft class="size-6" />
          </button>
          <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20" aria-label="Next image" @click="step(1)">
            <ChevronRight class="size-6" />
          </button>
          <p class="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">{{ index + 1 }} / {{ images.length }}</p>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { onKeyStroke, useScrollLock } from "@vueuse/core";
import { ChevronLeft, ChevronRight, X } from "@lucide/vue";

export interface LightboxImage {
  url: string;
  alt?: string;
}

const props = defineProps<{ images: LightboxImage[] }>();

/** Index of the image being viewed; null means closed. */
const index = defineModel<number | null>({ default: null });

const current = computed(() => (index.value === null ? null : props.images[index.value]));
const isOpen = computed(() => index.value !== null);

// Stop the page scrolling behind the viewer.
const scrollLock = useScrollLock(typeof document === "undefined" ? null : document.body);
watch(isOpen, (open) => (scrollLock.value = open), { immediate: true });

function close() {
  index.value = null;
}

function step(by: number) {
  if (index.value === null) return;
  index.value = (index.value + by + props.images.length) % props.images.length;
}

onKeyStroke("Escape", () => isOpen.value && close());
onKeyStroke("ArrowLeft", () => isOpen.value && step(-1));
onKeyStroke("ArrowRight", () => isOpen.value && step(1));
</script>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
