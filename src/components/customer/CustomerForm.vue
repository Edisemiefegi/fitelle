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

        <FormTextarea id="notes" v-model="form.notes" rows="3" placeholder="Anything worth remembering about this customer..." />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import FormTextarea from "@/components/base/FormTextarea.vue";
import Field from "../base/Field.vue";
import Input from "../ui/input/Input.vue";

defineProps<{
  form: any;
  errors: any;
  show?: boolean;
}>();
</script>

<style scoped></style>
