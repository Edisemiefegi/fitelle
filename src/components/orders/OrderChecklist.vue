<template>
  <div>
    <div class="flex items-center justify-between">
      <p class="text-sm text-primary">REQUIREMENTS</p>
      <p v-if="order.requirements.length" class="text-[10px] text-muted-foreground">{{ doneCount }}/{{ order.requirements.length }} done</p>
    </div>

    <ul v-if="order.requirements.length" class="mt-2 space-y-1">
      <li
        v-for="req in order.requirements"
        :key="req.id"
        class="group flex items-center gap-2 rounded-lg px-1 py-1 transition hover:bg-muted/50"
      >
        <Checkbox :model-value="req.done" @update:model-value="toggle(req.id)" />
        <span class="flex-1 text-xs" :class="req.done && 'text-muted-foreground line-through'">{{ req.label }}</span>
        <button
          type="button"
          class="rounded-full p-1 text-muted-foreground opacity-60 transition hover:bg-muted hover:text-destructive group-hover:opacity-100"
          :aria-label="`Remove ${req.label}`"
          @click="remove(req.id)"
        >
          <X class="size-3" />
        </button>
      </li>
    </ul>
    <p v-else class="mt-1 text-xs text-muted-foreground">Nothing to track yet. Add what the customer needs to bring or what's left to do.</p>

    <form class="mt-2 flex gap-2" @submit.prevent="add">
      <input
        v-model="newLabel"
        type="text"
        placeholder="Add an item..."
        class="h-8 flex-1 rounded-lg border border-border bg-background px-2.5 text-xs outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
      <Button type="submit" variant="outline" size="sm" :disabled="!newLabel.trim()">
        <Plus class="size-3.5" />
        Add
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus, X } from "@lucide/vue";
import Button from "@/components/ui/button/Button.vue";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import { generateId } from "@/lib";
import { useOrderStore } from "@/stores/order";
import type { OrderRequirement, OrderType } from "@/types/order";

const props = defineProps<{ order: OrderType }>();

const orderStore = useOrderStore();
const newLabel = ref("");

const doneCount = computed(() => props.order.requirements.filter((r) => r.done).length);

// The store updates the list at once and restores it (with an error toast) if saving fails.
const save = (requirements: OrderRequirement[]) => orderStore.saveRequirements(props.order.id, requirements).catch(() => {});

const toggle = (id: string) => save(props.order.requirements.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
const remove = (id: string) => save(props.order.requirements.filter((r) => r.id !== id));

function add() {
  const label = newLabel.value.trim();
  if (!label) return;
  newLabel.value = "";
  save([...props.order.requirements, { id: generateId("req"), label, done: false }]);
}
</script>
