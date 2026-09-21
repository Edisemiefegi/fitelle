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
</script>

<template>
  <Popover >
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>

    <PopoverContent
      :align="align"
      :side="side"
      :class="['w-44 rounded-xl p-1.5', contentClass]"
    >
      <slot />
    </PopoverContent>
  </Popover>
</template>
