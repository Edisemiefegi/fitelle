<template>
  <div class="group relative space-y-2">
    <div class="flex items-center justify-between">
      <label class="text-xs font-medium text-muted-foreground">
        {{ label }}
      </label>

      <button
        v-if="removable"
        type="button"
        class="text-destructive"
        title="Remove field"
        @click="$emit('remove')"
      >
        <X class="size-3" />
      </button>
    </div>

    <div class="relative">
      <Input
        :model-value="modelValue ?? ''"
        type="number"
        min="0"
        step="0.5"
        placeholder="0"
        @update:model-value="handleInput"
      />

      <span
        class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground"
      >
        {{ unit }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from "@lucide/vue";
import Input from "../ui/input/Input.vue";

withDefaults(
  defineProps<{
    modelValue: number | null;
    label: string;
    unit: "in" | "cm";
    removable?: boolean;
  }>(),
  { removable: false },
);

const emit = defineEmits<{
  "update:modelValue": [value: number | null];
  remove: [];
}>();

function handleInput(value: string | number) {
  if (value === "" || value === null || value === undefined) {
    emit("update:modelValue", null);
    return;
  }
  const num = Number(value);
  emit("update:modelValue", Number.isNaN(num) ? null : num);
}
</script>
