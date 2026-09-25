<template>
  <div>
    <h3 class="font-display text-base font-semibold">
      {{ title }}
    </h3>

    <p class="mt-1 text-xs text-muted-foreground">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>

<style scoped></style>
