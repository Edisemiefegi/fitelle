<template>
  <div class="space-y-3">
    <div
      class="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border px-4 py-6 text-center transition hover:border-primary/40"
      @click="inputRef?.click()"
    >
      <ImagePlus class="size-5 text-muted-foreground" />
      <p class="text-xs font-medium">Add photos</p>
      <p class="text-[10px] text-muted-foreground">JPG, PNG or WEBP, up to 5MB each</p>
    </div>
    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      multiple
      class="hidden"
      @change="handleInputChange"
    />

    <div v-if="items.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div
        v-for="(item, index) in items"
        :key="item.localId"
        class="group relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-muted"
      >
        <img :src="item.previewUrl" alt="" class="h-full w-full object-cover" />

        <div v-if="item.status === 'uploading'" class="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 class="size-4 animate-spin text-white" />
        </div>
        <div v-if="item.status === 'error'" class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 p-1 text-center">
          <AlertTriangle class="size-4 text-red-300" />
          <p class="text-[9px] leading-tight text-red-100">{{ item.error }}</p>
        </div>

        <!-- Cover badge / set-cover control -->
        <button
          v-if="item.status === 'done'"
          type="button"
          class="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium transition"
          :class="isCover(item) ? 'bg-primary text-primary-foreground' : 'bg-black/60 text-white opacity-0 group-hover:opacity-100'"
          @click.stop="$emit('update:coverFileId', item.fileId!)"
        >
          <Star class="size-2.5" :fill="isCover(item) ? 'currentColor' : 'none'" />
          {{ isCover(item) ? "Cover" : "Set cover" }}
        </button>

        <button
          type="button"
          class="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 opacity-0 transition group-hover:opacity-100"
          @click.stop="remove(item.localId)"
        >
          <X class="size-3 text-white" />
        </button>

        <div class="absolute bottom-1.5 right-1.5 flex gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            v-if="index > 0"
            type="button"
            class="rounded-full bg-black/70 p-1"
            @click.stop="move(item.localId, 'up')"
          >
            <ChevronLeft class="size-3 text-white" />
          </button>
          <button
            v-if="index < items.length - 1"
            type="button"
            class="rounded-full bg-black/70 p-1"
            @click.stop="move(item.localId, 'down')"
          >
            <ChevronRight class="size-3 text-white" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { AlertTriangle, ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, X } from "@lucide/vue";
import type { UploadItem } from "@/composables/useImageUpload";

const props = defineProps<{
  items: UploadItem[];
  coverFileId: string | null;
}>();

const emit = defineEmits<{
  "add-files": [files: FileList];
  remove: [localId: string];
  move: [localId: string, direction: "up" | "down"];
  "update:coverFileId": [fileId: string];
}>();

const inputRef = ref<HTMLInputElement | null>(null);

function isCover(item: UploadItem) {
  return Boolean(item.fileId) && item.fileId === props.coverFileId;
}

function remove(localId: string) {
  emit("remove", localId);
}

function move(localId: string, direction: "up" | "down") {
  emit("move", localId, direction);
}

function handleInputChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files?.length) emit("add-files", files);
  (event.target as HTMLInputElement).value = "";
}
</script>