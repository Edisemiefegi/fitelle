<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

withDefaults(
  defineProps<{
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    open?: boolean;
    destructive?: boolean;
  }>(),
  {
    confirmText: "Continue",
    cancelText: "Cancel",
    destructive: false,
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  confirm: [];
  cancel: [];
}>();
</script>

<template>
  <AlertDialog
    :open="open"
    @update:open="emit('update:open', $event)"
  >
    <AlertDialogTrigger as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{ title }}
        </AlertDialogTitle>

        <AlertDialogDescription v-if="description">
          {{ description }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <slot />

      <AlertDialogFooter>
        <AlertDialogCancel @click="emit('cancel')">
          {{ cancelText }}
        </AlertDialogCancel>

        <AlertDialogAction
          :class="
            destructive
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              : ''
          "
          @click="emit('confirm')"
        >
          {{ confirmText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>