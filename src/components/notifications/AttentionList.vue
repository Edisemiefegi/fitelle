<template>
  <ul class="divide-y divide-border">
    <li v-for="item in items" :key="item.id" class="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <span class="mt-1.5 size-2 shrink-0 rounded-full" :class="DOT_CLASS[item.severity]" />

      <RouterLink :to="item.orderId ? `/orders/${item.orderId}` : '/orders'" class="min-w-0 flex-1">
        <p class="text-sm font-medium">{{ item.title }}</p>
        <p v-if="showDetail" class="text-xs text-muted-foreground">{{ item.detail }}</p>
      </RouterLink>

      <button
        v-if="dismissible"
        type="button"
        class="rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        aria-label="Dismiss for today"
        @click="emit('dismiss', item.id)"
      >
        <X class="size-3.5" />
      </button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { X } from "@lucide/vue";
import type { AttentionItem, AttentionSeverity } from "@/lib/attention";

withDefaults(
  defineProps<{
    items: AttentionItem[];
    showDetail?: boolean;
    dismissible?: boolean;
  }>(),
  { showDetail: false, dismissible: false },
);

const emit = defineEmits<{ dismiss: [id: string] }>();

const DOT_CLASS: Record<AttentionSeverity, string> = {
  urgent: "bg-red-500",
  warning: "bg-amber-400",
  info: "bg-sky-400",
};
</script>
