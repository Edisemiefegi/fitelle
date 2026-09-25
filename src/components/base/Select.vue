<script setup lang="ts" generic="T extends string">
import { Search, X } from "@lucide/vue";
import { ref, computed, watch, onBeforeUnmount } from "vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface Props {
  isSearch?: boolean
  modelValue?: T;
  options: SelectOption<T>[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  error?: string;
  required?: boolean;
  debounce?: number;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option",
  searchPlaceholder: "Search...",
  emptyText: "No options found",
  debounce: 300,
});

const search = ref("");
const debouncedSearch = ref("");

let debounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(search, (value) => {
  clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    debouncedSearch.value = value;
  }, props.debounce);
});

onBeforeUnmount(() => {
  clearTimeout(debounceTimer);
});

const filteredOptions = computed(() => {
  const query = debouncedSearch.value.trim().toLowerCase();

  if (!query) {
    return props.options;
  }

  return props.options.filter((option) =>
    option.label.toLowerCase().includes(query),
  );
});

function handleValueChange(value: string) {
  emit("update:modelValue", value as T);
}

function clearSearch() {
  search.value = "";
  debouncedSearch.value = "";
}

const emit = defineEmits<{
  "update:modelValue": [value: any];
}>();
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </label>

    <Select
      :model-value="modelValue"
      :disabled="disabled"
      @update:model-value="handleValueChange"
    >
      <SelectTrigger
        class="w-full bg-white"
        :class="error && 'border-destructive focus:ring-destructive/20'"
      >
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>

      <SelectContent>
        <div v-if="isSearch" class="sticky top-0 z-10 bg-white p-2">
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />

            <input
              v-model="search"
              type="text"
              :placeholder="searchPlaceholder"
              class="h-9 w-full rounded-md border border-border bg-background pl-9 pr-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
              @keydown.stop
            />

            <button
              v-if="search"
              type="button"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              @click.stop="clearSearch"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
        <template v-if="filteredOptions.length">
          <SelectItem
            v-for="option in filteredOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </SelectItem>
        </template>

        <!-- Empty state -->
        <div v-else class="px-3 py-6 text-center text-sm text-muted-foreground">
          {{ emptyText }}
        </div>
      </SelectContent>
    </Select>

    <p v-if="error" class="text-xs text-destructive">
      {{ error }}
    </p>
  </div>
</template>
