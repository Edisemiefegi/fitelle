<template>
  <input v-model="model" :class="cn(FIELD_CLASS, 'h-11', props.class)" />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { FIELD_CLASS } from "@/constants/ui";

// Native attributes (type, min, placeholder, @keydown...) fall through to the <input>.
const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const [model, modifiers] = defineModel<string | number | null>({
  // v-model.number: empty box -> null, otherwise a real number
  set: (value) => (modifiers.number ? (value === "" ? null : Number(value)) : value),
});
</script>
