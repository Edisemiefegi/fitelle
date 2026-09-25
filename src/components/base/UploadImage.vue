<template>
  <div
    class="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background px-5 py-8 text-center transition hover:border-primary/50 hover:bg-primary/[0.02]"
  >
    <div class="flex size-10 items-center justify-center rounded-full bg-muted">
      <ImagePlus class="size-5 text-muted-foreground" />
    </div>

    <p class="mt-3 text-sm font-medium">Add design reference</p>

    <p class="mt-1 text-xs text-muted-foreground">
      Upload a sketch, inspiration photo or design reference
    </p>

    <Button variant="outline" size="sm" class="mt-4"> Choose image </Button>
  </div>
</template>



<script setup lang="ts">
import {
 
  ImagePlus,
 
} from "@lucide/vue";
</script>

<style scoped>

</style>
