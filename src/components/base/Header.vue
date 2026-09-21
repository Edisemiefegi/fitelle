<template>
  <div class="flex md:flex-row flex-col gap-2 justify-between">
    <div class="space-y-1">
      <p class="text-primary font-light text-xs text-capitalize">{{ text }}</p>
      <p class="text-3xl font-medium font-san">{{ title }}</p>
      <p class="text-sm text-gray-500 font-light">{{ subtitle }}</p>
    </div>

    <div class="flex gap-2 flex-wrap">
      <slot />
      <Button @click="emit('button-click')" size="sm" class="w-fit"
        ><PlusIcon />{{ button }}</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from "@lucide/vue";
import Button from "../ui/button/Button.vue";

defineProps<{
  title: string;
  subtitle: string;
  button: string;
  text?: string;
}>();

const emit = defineEmits<{
  "button-click": [];
}>();
</script>

<style scoped></style>
