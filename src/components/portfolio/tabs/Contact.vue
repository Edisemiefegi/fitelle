<template>
  <Card>
    <form class="space-y-5" @submit.prevent="save">
      <div class="grid gap-5 md:grid-cols-2">
        <Field label="Location">
          <Input v-model="form.contact.location" placeholder="e.g. Abuja, Nigeria" />
        </Field>

        <Field label="Phone number">
          <Input v-model="form.contact.phone" placeholder="e.g. 08012345678" />
        </Field>
      </div>

      <Field label="Email" :error="errors['contact.email']">
        <Input v-model="form.contact.email" type="email" placeholder="e.g. hello@didistitches.com" />
      </Field>

      <label class="flex items-center gap-2 text-sm">
        <input v-model="form.contact.whatsapp" type="checkbox" class="size-4 accent-primary" />
        Let customers message me on WhatsApp
      </label>

      <div class="grid gap-5 md:grid-cols-3">
        <Field label="Instagram">
          <Input v-model="form.contact.instagram" placeholder="@didistitches" />
        </Field>
        <Field label="TikTok">
          <Input v-model="form.contact.tiktok" placeholder="@didistitches" />
        </Field>
        <Field label="Facebook">
          <Input v-model="form.contact.facebook" placeholder="didistitches" />
        </Field>
      </div>

      <div class="flex justify-end">
        <Button type="submit" size="sm" :disabled="isSaving">Save</Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import Card from "@/components/base/Card.vue";
import Field from "@/components/base/Field.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import { usePortfolioSection } from "@/composables/usePortfolioSection";
import { contactSchema } from "@/schema/portfolio";

const { form, errors, isSaving, save } = usePortfolioSection((p) => ({ contact: p.contact }), contactSchema);
</script>
