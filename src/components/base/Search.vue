<script setup lang="ts">
import { Search, X } from "@lucide/vue";

interface Props {
  modelValue: string;
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  placeholder: "Search...",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

function clearSearch() {
  emit("update:modelValue", "");
}
</script>

<template>
  <div class="relative w-full">
    <Search
      class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
    />

    <input
      :value="modelValue"
      type="search"
      :placeholder="placeholder"
      class="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />

    <button
      v-if="modelValue"
      type="button"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
      @click="clearSearch"
    >
      <X class="h-4 w-4" />
    </button>
  </div>
</template>
