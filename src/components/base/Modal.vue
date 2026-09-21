<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      :class="[
        'flex max-w-lg flex-col overflow-hidden p-0 max-h-3/4',
        fullScreenMobile &&
          'h-screen w-screen max-sm:max-h-none max-sm:max-w-none max-sm:rounded-none',
        fullScreen && 'h-screen w-screen max-w-none rounded-none',
        contentClass,
      ]"
    >
      <DialogHeader
        v-if="title || description"
        class="sticky top-0 z-20 shrink-0 border-b bg-background px-6 py-4"
      >
        <DialogTitle v-if="title">
          {{ title }}
        </DialogTitle>

        <DialogDescription v-if="description">
          {{ description }}
        </DialogDescription>

        <DialogClose
          data-slot="dialog-close"
          class="absolute right-4 top-4 flex size-8 items-center justify-center rounded-lg opacity-70 transition-opacity hover:bg-muted hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring"
          @click="emit('update:open', false)"
        >
          <X class="size-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogHeader>

      <div class="min-h-0 flex-1 overflow-y-auto px-6">
        <slot />
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { X } from "@lucide/vue";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  fullScreen?: boolean;
  fullScreenMobile?: boolean;
  contentClass?: HTMLAttributes["class"];
}

withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  fullScreen: false,
  fullScreenMobile: false,
});

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();
</script>
