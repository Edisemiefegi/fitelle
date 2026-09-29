<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { HTMLAttributes } from "vue";

withDefaults(
  defineProps<{
    align?: "start" | "center" | "end";
    side?: "top" | "right" | "bottom" | "left";
    contentClass?: HTMLAttributes["class"];
  }>(),
  {
    align: "end",
    side: "bottom",
  },
);


const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <Popover v-model:open="open">
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