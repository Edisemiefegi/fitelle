<template>
  <AlertDialog :open="open" @update:open="emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete "{{ work.title }}"?</AlertDialogTitle>
        <AlertDialogDescription>
          This removes the work and its photos from your portfolio, including your public page. This can't be
          undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction :disabled="isDeleting" @click="handleDelete">Delete work</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { usePortfolioStore } from "@/stores/portfolio";
import type { PortfolioWork } from "@/types/portfolio";

const props = defineProps<{
  open: boolean;
  work: PortfolioWork;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  deleted: [];
}>();

const portfolioStore = usePortfolioStore();
const isDeleting = ref(false);

async function handleDelete() {
  isDeleting.value = true;
  try {
    await portfolioStore.deleteWork(props.work.id);
    emit("deleted");
    emit("update:open", false);
  } catch {
    // store already toasted
  } finally {
    isDeleting.value = false;
  }
}
</script>