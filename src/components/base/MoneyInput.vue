<template>
  <div class="relative">
    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₦</span>
    <FormInput v-model.number="model" v-bind="$attrs" type="number" min="0" placeholder="0.00" class="pl-8" />
  </div>
</template>

<script setup lang="ts">
import FormInput from "./FormInput.vue";

// extra attributes (max, disabled...) belong on the <input>, not the wrapper
defineOptions({ inheritAttrs: false });

const model = defineModel<number | null>();
</script>
