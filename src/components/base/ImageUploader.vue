<template>
  <div class="space-y-3">
    <div
      class="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-center transition hover:border-primary/40"
      :class="isDragging && 'border-primary bg-primary/[0.03]'"
      @click="inputRef?.click()"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <ImagePlus class="size-5 text-muted-foreground" />
      <p class="text-xs font-medium">{{ label }}</p>
      <p class="text-[10px] text-muted-foreground">
        JPG, PNG or WEBP, up to 5MB
      </p>
    </div>

    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      :multiple="multiple"
      class="hidden"
      @change="handleInputChange"
    />

    <div v-if="items.length" class="grid grid-cols-3 gap-2 sm:grid-cols-4">
      <div
        v-for="item in items"
        :key="item.localId"
        class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
      >
        <img :src="item.previewUrl" alt="" class="h-full w-full object-cover" />

        <div
          v-if="item.status === 'uploading'"
          class="absolute inset-0 flex items-center justify-center bg-black/40"
        >
          <Loader2 class="size-4 animate-spin text-white" />
        </div>

        <div
          v-if="item.status === 'error'"
          class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 p-1 text-center"
        >
          <AlertTriangle class="size-4 text-red-300" />
          <p class="text-[9px] leading-tight text-red-100">{{ item.error }}</p>
        </div>

        <button
          type="button"
          class="absolute right-1 top-1 rounded-full bg-black/70 p-1 opacity-0 transition group-hover:opacity-100"
          @click.stop="emit('remove', item.localId)"
        >
          <X class="size-3 text-white" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AlertTriangle, ImagePlus, Loader2, X } from "@lucide/vue";
import type { UploadItem } from "@/composables/useImageUpload";

withDefaults(
  defineProps<{
    items: UploadItem[];
    label?: string;
    multiple?: boolean;
  }>(),
  { label: "Add images", multiple: true },
);

const emit = defineEmits<{
  "add-files": [files: FileList];
  remove: [localId: string];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

function handleInputChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files?.length) emit("add-files", files);
  (event.target as HTMLInputElement).value = ""; // allow re-selecting the same file later
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files?.length) emit("add-files", files);
}
</script>
