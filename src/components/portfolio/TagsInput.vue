<template>
  <div class="space-y-2">
    <label class="text-sm font-medium">Tags <span class="font-normal text-muted-foreground">(optional)</span></label>

    <div class="flex flex-wrap gap-1.5 rounded-xl border border-border bg-background p-2">
      <span
        v-for="tag in modelValue"
        :key="tag"
        class="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium"
      >
        {{ tag }}
        <button type="button" class="text-muted-foreground hover:text-foreground" @click="removeTag(tag)">
          <X class="size-3" />
        </button>
      </span>

      <input
        v-model="draft"
        type="text"
        placeholder="e.g. lace, bespoke, wedding..."
        class="h-7 min-w-[8rem] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
        @keydown.enter.prevent="commit"
        @keydown.comma.prevent="commit"
        @keydown.backspace="handleBackspace"
      />
    </div>
    <p class="text-[10px] text-muted-foreground">Press enter or comma to add a tag.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { X } from "@lucide/vue";

const props = defineProps<{
  modelValue: string[];
}>();

const emit = defineEmits<{
  "update:modelValue": [tags: string[]];
}>();

const draft = ref("");

function commit() {
  const value = draft.value.trim();
  draft.value = "";
  if (!value || props.modelValue.includes(value)) return;
  emit("update:modelValue", [...props.modelValue, value]);
}

function removeTag(tag: string) {
  emit(
    "update:modelValue",
    props.modelValue.filter((t) => t !== tag),
  );
}

function handleBackspace() {
  if (draft.value) return; // only pop a tag when the input is already empty
  emit("update:modelValue", props.modelValue.slice(0, -1));
}
</script>