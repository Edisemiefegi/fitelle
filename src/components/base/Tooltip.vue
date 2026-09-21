<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  text: string;
  side?: "top" | "right" | "bottom" | "left";
  class?: HTMLAttributes["class"];
}

withDefaults(defineProps<Props>(), {
  side: "top",
});
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <span :class="class">
          <slot />
        </span>
      </TooltipTrigger>

      <TooltipContent :side="side">
        {{ text }}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>