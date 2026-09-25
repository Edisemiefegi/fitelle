<template>
  <section class="space-y-3">
    <SectionLabel title="Fabric" description="Is the fabric already provided, or do you need to source it?" />

    <div class="flex gap-2">
      <button
        v-for="option in FABRIC_SOURCE_OPTIONS"
        :key="option.value"
        type="button"
        class="flex-1 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition"
        :class="
          form.fabricSource === option.value
            ? 'border-primary bg-primary/[0.03] text-foreground'
            : 'border-border text-muted-foreground hover:border-primary/40'
        "
        @click="form.fabricSource = option.value"
      >
        {{ option.label }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import SectionLabel from "@/components/orders/SectionLabel.vue";
import { FABRIC_SOURCE_OPTIONS } from "@/constants/orders";
import type { OrderFormState } from "@/composables/useOrderForm";

defineProps<{ form: OrderFormState }>();
</script>