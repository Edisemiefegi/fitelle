<template>
  <Card>
    <form class="space-y-5" @submit.prevent="save">
      <p class="text-xs text-muted-foreground">
        List what you offer. These appear on your public page in this order.
      </p>

      <div v-for="(service, index) in form.services" :key="index" class="space-y-2 rounded-xl border border-border p-3">
        <div class="flex items-center gap-2">
          <Input v-model="service.title" placeholder="e.g. Bridal" />
          <Button type="button" variant="ghost" size="icon" @click="form.services.splice(index, 1)">
            <Trash2 class="size-4 text-muted-foreground" />
          </Button>
        </div>
        <Input v-model="service.description" placeholder="A short description" />
        <p v-if="errors[`services.${index}.title`]" class="text-xs text-destructive">
          {{ errors[`services.${index}.title`] }}
        </p>
        <p v-if="errors[`services.${index}.description`]" class="text-xs text-destructive">
          {{ errors[`services.${index}.description`] }}
        </p>
      </div>

      <p v-if="errors.services" class="text-xs text-destructive">{{ errors.services }}</p>

      <Button
        type="button"
        variant="outline"
        size="sm"
        :disabled="form.services.length >= MAX_SERVICES"
        @click="form.services.push({ title: '', description: '' })"
      >
        <Plus class="size-3.5" />
        Add service
      </Button>

      <div class="flex justify-end">
        <Button type="submit" size="sm" :disabled="isSaving">Save</Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import { Plus, Trash2 } from "@lucide/vue";
import Card from "@/components/base/Card.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import { usePortfolioSection } from "@/composables/usePortfolioSection";
import { servicesSchema } from "@/schema/portfolio";

const MAX_SERVICES = 8;

const { form, errors, isSaving, save } = usePortfolioSection((p) => ({ services: p.services }), servicesSchema);
</script>
