<template>
  <section class="space-y-4">
    <SectionLabel
      title="Measurements"
      description="Choose how you'd like to handle measurements for this order."
    />

    <div v-if="!hasCustomer" class="rounded-xl border border-dashed border-border px-3 py-4 text-center">
      <p class="text-xs text-muted-foreground">Select a customer first to load their measurements.</p>
    </div>

    <template v-else>
      <div class="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          class="rounded-xl border p-2 h-fit text-left transition"
          :class="
            form.measurements.source === 'customer_default'
              ? 'border-primary bg-primary/[0.03]'
              : 'border-border hover:border-primary/40'
          "
          @click="emit('use-defaults')"
        >
          <div class="flex items-start justify-between">
            <div class="flex size-9 items-center justify-center rounded-lg bg-primary/10">
              <Ruler class="size-4 text-primary" />
            </div>
            <div
              class="flex size-4 items-center justify-center rounded-full"
              :class="
                form.measurements.source === 'customer_default'
                  ? 'border-4 border-primary'
                  : 'border border-border'
              "
            />
          </div>
          <p class="mt-4 text-xs font-medium">Use customer measurements</p>
          <p class="mt-1 text-[10px] leading-5 text-muted-foreground">
            Use {{ customerName }}'s saved default measurements for this order.
          </p>
        </button>

        <button
          type="button"
          class="h-fit rounded-xl border p-2 text-left transition"
          :class="
            form.measurements.source === 'order_specific'
              ? 'border-primary bg-primary/[0.03]'
              : 'border-border hover:border-primary/40'
          "
          @click="emit('use-order-specific')"
        >
          <div class="flex items-start justify-between">
            <div class="flex size-9 items-center justify-center rounded-lg bg-muted">
              <Plus class="size-4 text-muted-foreground" />
            </div>
            <div
              class="flex size-4 items-center justify-center rounded-full"
              :class="
                form.measurements.source === 'order_specific'
                  ? 'border-4 border-primary'
                  : 'border border-border'
              "
            />
          </div>
          <p class="mt-4 text-xs font-medium">Use order-specific measurements</p>
          <p class="mt-1 text-[10px] leading-5 text-muted-foreground">
            Take or enter a fresh set of measurements just for this order.
          </p>
        </button>
      </div>

      <MeasurementFieldEditor
        v-model="form.measurements.values"
        v-model:custom-fields="form.measurements.customFields"
        :unit="form.measurements.unit"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { Plus, Ruler } from "@lucide/vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import MeasurementFieldEditor from "@/components/customer/MeasurementFieldEditor.vue";
import type { OrderFormState } from "@/composables/useOrderForm";

defineProps<{
  form: OrderFormState;
  hasCustomer: boolean;
  customerName?: string;
}>();

const emit = defineEmits<{
  "use-defaults": [];
  "use-order-specific": [];
}>();
</script>