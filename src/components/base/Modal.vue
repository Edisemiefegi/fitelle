<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      :class="[
        'flex w-full max-w-lg flex-col overflow-hidden p-0',
        'max-h-[90dvh]',
        fullScreenMobile &&
          'max-sm:inset-0 max-sm:h-[100dvh] max-sm:w-full max-sm:max-h-[100dvh] max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none',
        fullScreen && 'h-[100dvh] w-full max-h-none max-w-none rounded-none',
        contentClass,
      ]"
    >
      <DialogHeader
        v-if="title || description"
        class="sticky top-0 z-20 shrink-0 border-b bg-background px-6 xs:pt-4 pt-8 pb-4"
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

      <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6">
        <slot />
      </div>

      <DialogFooter
        show-close-button
        class="shrink-0 border-t bg-background px-6 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <Button
          class=""
          :loading="isLoading"
          :disabled="isLoading"
          @click="emit('submit')"
        >
          {{ saveBtn }}</Button
        >
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { X } from "@lucide/vue";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import DialogFooter from "../ui/dialog/DialogFooter.vue";

interface Props {
  open: boolean;
  title?: string;
  description?: string;
  fullScreen?: boolean;
  fullScreenMobile?: boolean;
  contentClass?: HTMLAttributes["class"];
  isLoading?: boolean;
  saveBtn?: string;
}

withDefaults(defineProps<Props>(), {
  title: "",
  description: "",
  fullScreen: false,
  fullScreenMobile: false,
});

const emit = defineEmits<{
  "update:open": [value: boolean];
  submit: [];
}>();
</script>
