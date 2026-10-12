<template>
  <div :class="['flex items-center  justify-between p-4 rounded-xl', bgClass]">
    <div class="space-y-0.5">
      <p class="text-gray-600 text-[10px]">
        {{ title }}
      </p>

      <p class="text-xl font-display font-semibold">
        {{ amount }}
      </p>

      <p class="text-[9px] text-gray-600 font-light">
        {{ text }}
      </p>
    </div>

    <component :is="icon" class="w-4 h-4 " />
  </div>
</template>

<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  title: string;
  amount: string;
  icon: Component;
  text?: string;
  bgClass: string;
}>();
</script>
