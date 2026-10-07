<template>
  <section class="space-y-4">
    <SectionLabel title="Order details" description="The basic information about the garment." />

    <div class="grid gap-4 sm:grid-cols-2">
      <Field required label="Garment type" :error="errors.garmentType">
        <FormInput v-model="form.garmentType" placeholder="e.g. Aso-ebi gown" />
      </Field>

      <Field label="Due / handover date">
        <DatePicker v-model="form.dueDate" placeholder="Pick the handover date" />
      </Field>

      <Field label="Fitting date (optional)">
        <DatePicker v-model="form.fittingDate" placeholder="Pick a fitting date" />
      </Field>
    </div>

    <Field label="Description">
      <FormTextarea
        v-model="form.description"
        rows="3"
        placeholder="Describe the design, style, cut, finishing or anything important about the garment..."
      />
    </Field>

    <div class="space-y-2">
      <label class="text-sm font-medium">
        Notes <span class="font-normal text-muted-foreground">(optional)</span>
      </label>
      <FormTextarea v-model="form.notes" rows="2" placeholder="Anything worth remembering about this order..." />
    </div>
  </section>
</template>

<script setup lang="ts">
import DatePicker from "@/components/base/DatePicker.vue";
import Field from "@/components/base/Field.vue";
import FormInput from "@/components/base/FormInput.vue";
import FormTextarea from "@/components/base/FormTextarea.vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import type { OrderFormState } from "@/composables/useOrderForm";
defineProps<{
  form: OrderFormState;
  errors: Record<string, string>;
}>();
</script>