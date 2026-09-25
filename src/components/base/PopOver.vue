<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { HTMLAttributes } from "vue";

const props = withDefaults(
  defineProps<{
    open?: boolean;
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    contentClass?: HTMLAttributes["class"];
  }>(),
  {
    align: "end",
    side: "bottom",
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();
</script>

<template>
  <Popover
    :open="props.open"
    @update:open="emit('update:open', $event)"
  >
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>

    <PopoverContent
      :align="align"
      :side="side"
      :class="['rounded-xl', contentClass]"
    >
      <slot />
    </PopoverContent>
  </Popover>
</template>