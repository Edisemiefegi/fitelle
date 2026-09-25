<template>
  <section class="space-y-4">
    <SectionLabel
      title="Requirements"
      description="Create a checklist for things that need to be provided or completed."
    />

    <div v-if="requirements.length" class="space-y-2">
      <div
        v-for="requirement in requirements"
        :key="requirement.id"
        class="group flex items-center gap-3 rounded-lg border border-border px-3 py-1.5"
      >
        <Checkbox :model-value="requirement.done" @update:model-value="emit('toggle', requirement.id)" />

        <span class="flex-1 text-sm" :class="requirement.done && 'text-muted-foreground line-through'">
          {{ requirement.label }}
        </span>

        <Button variant="ghost" size="icon" @click="emit('remove', requirement.id)">
          <Trash2 class="size-3 text-danger" />
        </Button>
      </div>
    </div>

    <div class="flex gap-2">
      <input
        v-model="newRequirement"
        type="text"
        placeholder="Add a requirement..."
        class="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
        @keydown.enter.prevent="submit"
      />
      <Button type="button" variant="outline" size="icon" @click="submit">
        <Plus class="size-4" />
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Plus, Trash2 } from "@lucide/vue";
import Button from "@/components/ui/button/Button.vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import type { OrderRequirement } from "@/types/order";

defineProps<{
  requirements: OrderRequirement[];
}>();

const emit = defineEmits<{
  add: [label: string];
  remove: [id: string];
  toggle: [id: string];
}>();

const newRequirement = ref("");

function submit() {
  if (!newRequirement.value.trim()) return;
  emit("add", newRequirement.value);
  newRequirement.value = "";
}
</script>