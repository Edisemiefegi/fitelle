<template>
  <section class="space-y-4">
    <SectionLabel title="Order details" description="The basic information about the garment." />

    <div class="grid gap-4 sm:grid-cols-2">
      <Field required label="Garment type" :error="errors.garmentType">
        <Input
          v-model="form.garmentType"
          type="text"
          placeholder="e.g. Aso-ebi gown"
        />
      </Field>

      <Field label="Due / handover date">
        <div class="relative">
          <Calendar class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="form.dueDate"
            type="date"
            class="h-11 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>
      </Field>
    </div>

    <Field label="Description">
      <textarea
        v-model="form.description"
        rows="3"
        placeholder="Describe the design, style, cut, finishing or anything important about the garment..."
        class="w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </Field>

    <div class="space-y-2">
      <label class="text-sm font-medium">
        Notes <span class="font-normal text-muted-foreground">(optional)</span>
      </label>
      <textarea
        v-model="form.notes"
        rows="2"
        placeholder="Anything worth remembering about this order..."
        class="w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Calendar } from "@lucide/vue";
import Field from "@/components/base/Field.vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import type { OrderFormState } from "@/composables/useOrderForm";
import Input from "../ui/input/Input.vue";
defineProps<{
  form: OrderFormState;
  errors: Record<string, string>;
}>();
</script>