<template>
  <section class="space-y-4">
    <SectionLabel title="Payment" description="Record the order value and the amount deposited." />

    <div class="grid gap-4 sm:grid-cols-2">
      <Field label="Total amount" required :error="errors.total">
        <MoneyInput v-model="form.total" />
      </Field>

      <Field v-if="!isEditing" label="Deposit" :error="errors.deposit">
        <MoneyInput v-model="form.deposit" />
      </Field>

      <div v-else class="space-y-1 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
        <p class="text-[10px] text-muted-foreground">Paid so far</p>
        <p class="text-sm font-semibold">{{ formatCurrency(existingPaid) }}</p>
        <p class="text-[10px] text-muted-foreground">
          Use "Record payment" on the order page to add more.
        </p>
      </div>
    </div>

    <p class="text-xs text-muted-foreground">
      Balance: <span class="font-medium text-foreground">{{ formatCurrency(balance) }}</span>
    </p>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import MoneyInput from "@/components/base/MoneyInput.vue";
import Field from "@/components/base/Field.vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import { formatCurrency } from "@/lib";
import type { OrderFormState } from "@/composables/useOrderForm";

const props = defineProps<{
  form: OrderFormState;
  errors: Record<string, string>;
  isEditing: boolean;
  existingPaid?: any;
}>();

const balance = computed(() =>
  props.isEditing ? props.form.total - (props.existingPaid ?? 0) : props.form.total - props.form.deposit,
);
</script>