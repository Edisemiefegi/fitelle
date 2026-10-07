<template>
  <textarea v-model="model" :class="cn(FIELD_CLASS, 'resize-none py-3', props.class)" />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
import { FIELD_CLASS } from "@/constants/ui";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();

const model = defineModel<string>();
</script>
