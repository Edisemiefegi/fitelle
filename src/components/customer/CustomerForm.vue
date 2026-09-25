<template>
  <section class="space-y-4">
    <SectionLabel
      title="  Customer details"
      description=" Basic information about your customer."
    />

    <div class="space-y-3">
      <Field required :error="errors.name" label="Fullname">
        <Input
          class="bg-background"
          id="name"
          v-model="form.name"
          type="text"
          placeholder="e.g. Amaka Okafor"
        />
      </Field>

      <Field required :error="errors.phone" label="Phone number">
        <Input
          id="phone"
          v-model="form.phone"
          type="tel"
          placeholder="e.g. 0803 456 7890"
          class="bg-background"
        />
      </Field>

      <div v-if="show" class="space-y-2">
        <label for="notes" class="text-sm font-medium">
          Notes
          <span class="font-normal text-muted-foreground"> (optional) </span>
        </label>

        <textarea
          id="notes"
          v-model="form.notes"
          rows="3"
          placeholder="Anything worth remembering about this customer..."
          class="w-full resize-none rounded-xl border border-border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Field from "../base/Field.vue";
import type { CustomerType } from "@/types/customer.ts";
import Input from "../ui/input/Input.vue";

defineProps<{
  form: any;
  errors: any;
  show?: boolean;
}>();
</script>

<style scoped></style>
