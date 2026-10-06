<template>
  <RouterLink
    to="/notifications"
    aria-label="Notifications"
    class="fixed right-4 top-4 z-50 flex size-10 items-center justify-center rounded-full bg-white/70 text-foreground shadow-[0_8px_32px_rgba(0,0,0,0.14)] ring-1 ring-white/50 backdrop-blur-2xl transition active:scale-90"
    style="top: max(1rem, env(safe-area-inset-top))"
  >
    <Bell class="size-4" />
    <span
      v-if="count"
      class="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-medium leading-4 text-white"
    >
      {{ count > 9 ? "9+" : count }}
    </span>
  </RouterLink>
</template>

<script setup lang="ts">
import { Bell } from "@lucide/vue";
import { useAttention } from "@/composables/useAttention";

const { count } = useAttention();
</script>
