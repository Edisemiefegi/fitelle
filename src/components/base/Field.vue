<script setup lang="ts">
import type { HTMLAttributes } from "vue"

interface Props {
  label?: string
  error?: string
  required?: boolean
  description?: string
  class?: HTMLAttributes["class"]
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-2" :class="class">
    <label v-if="label" class="text-sm font-medium">
      {{ label }}

      <span v-if="required" class="text-destructive">
        *
      </span>
    </label>

    <slot />

    <p
      v-if="description && !error"
      class="text-xs text-muted-foreground"
    >
      {{ description }}
    </p>

    <p
      v-if="error"
      class="text-xs text-destructive"
    >
      {{ error }}
    </p>
  </div>
</template>