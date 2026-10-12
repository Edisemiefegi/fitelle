<template>
  <div class="relative">
    <Input v-model="model" v-bind="$attrs" :type="visible ? 'text' : 'password'" class="pr-10" />

    <button
      type="button"
      class="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-md text-muted-foreground transition hover:text-foreground"
      :aria-label="visible ? 'Hide password' : 'Show password'"
      :aria-pressed="visible"
      @click="visible = !visible"
    >
      <EyeOff v-if="visible" class="size-4" />
      <Eye v-else class="size-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Eye, EyeOff } from "@lucide/vue";
import Input from "@/components/ui/input/Input.vue";

// Native attributes (placeholder, autocomplete...) fall through to the <input>.
defineOptions({ inheritAttrs: false });

const model = defineModel<string | number>();
const visible = ref(false);
</script>
