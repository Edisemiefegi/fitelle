<template>
  <div class="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
    <div class="mb-3 flex items-center justify-between">
      <div>
        <p class="text-sm font-medium">Progress photos</p>
        <p class="text-xs text-muted-foreground">Toggle the eye to decide what the customer sees.</p>
      </div>
      <Button variant="outline" size="sm" @click="inputRef?.click()">
        <Camera class="size-4" />
        Attach photo
      </Button>
      <input
        ref="inputRef"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        class="hidden"
        @change="handleFileChange"
      />
    </div>

    <div v-if="upload.items.value.length" class="grid grid-cols-3 gap-2 sm:grid-cols-4">
      <div
        v-for="item in upload.items.value"
        :key="item.localId"
        class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
      >
        <img :src="item.previewUrl" alt="" class="h-full w-full object-cover" />

        <div v-if="item.status === 'uploading'" class="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 class="size-4 animate-spin text-white" />
        </div>

        <button
          v-if="item.status === 'done'"
          type="button"
          class="absolute bottom-1 left-1 rounded-full bg-black/70 p-1"
          @click="toggleVisibility(item.localId)"
        >
          <Eye v-if="item.visibleToCustomer" class="size-3 text-white" />
          <EyeOff v-else class="size-3 text-white/70" />
        </button>

        <button
          type="button"
          class="absolute right-1 top-1 rounded-full bg-black/70 p-1 opacity-0 transition group-hover:opacity-100"
          @click="removePhoto(item.localId)"
        >
          <X class="size-3 text-white" />
        </button>
      </div>
    </div>
    <p v-else class="text-xs text-muted-foreground">No progress photos yet.</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Camera, Eye, EyeOff, Loader2, X } from "@lucide/vue";
import Button from "@/components/ui/button/Button.vue";
import { useImageUpload } from "@/composables/useImageUpload";
import { useOrderStore } from "@/stores/order";
import type { OrderType } from "@/types/order";

const props = defineProps<{
  order: OrderType;
}>();

const orderStore = useOrderStore();
const upload = useImageUpload(props.order.progressImages);
const inputRef = ref<HTMLInputElement | null>(null);

async function persist() {
  await orderStore.updateOrder(props.order.id, { progressImages: upload.toOrderImages() });
}

async function handleFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  (event.target as HTMLInputElement).value = "";
  if (!files?.length) return;

  await upload.addFiles(files);
  await persist();
}

async function removePhoto(localId: string) {
  await upload.remove(localId);
  await persist();
}

function toggleVisibility(localId: string) {
  const item = upload.items.value.find((i) => i.localId === localId);
  if (!item) return;
  item.visibleToCustomer = !item.visibleToCustomer;
  persist();
}
</script>