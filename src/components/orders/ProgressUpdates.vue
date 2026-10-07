<template>
  <div class="rounded-xl border border-border bg-card/50 p-4 sm:p-5">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm font-medium">Progress updates</p>
        <p class="text-xs text-muted-foreground">Post a photo or a short note. You choose what the customer sees on their tracking link.</p>
      </div>
      <Button v-if="!composing" variant="outline" size="sm" class="shrink-0" @click="composing = true">
        <Plus class="size-4" />
        Add update
      </Button>
    </div>

    <!-- Composer -->
    <form v-if="composing" class="mt-4 space-y-3 rounded-lg border border-border bg-background p-3" @submit.prevent="post">
      <textarea
        v-model="note"
        rows="2"
        maxlength="300"
        placeholder="A short note, e.g. “Cutting is done, starting on the sleeves.”"
        class="w-full resize-none rounded-lg border border-border bg-background p-2.5 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />

      <div class="grid grid-cols-4 gap-2 sm:grid-cols-5">
        <div v-for="item in upload.items.value" :key="item.localId" class="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
          <img :src="item.previewUrl" alt="" class="h-full w-full  object-cover" />
          <div v-if="item.status === 'uploading'" class="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 class="size-4 animate-spin text-white" />
          </div>
          <div v-if="item.status === 'error'" class="absolute inset-0 flex items-center justify-center bg-black/60 p-1 text-center text-[9px] text-red-100">
            {{ item.error }}
          </div>
          <button type="button" class="absolute right-1 top-1 rounded-full bg-black/70 p-1" @click="upload.remove(item.localId)">
            <X class="size-3 text-white" />
          </button>
        </div>

        <button
          type="button"
          class="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
          @click="fileInput?.click()"
        >
          <Camera class="size-4" />
          <span class="text-[10px]">Add photos</span>
        </button>
        <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" multiple class="hidden" @change="handleFiles" />
      </div>

      <label class="flex items-center justify-between gap-3 rounded-lg bg-muted/50 px-3 py-2">
        <span>
          <span class="block text-xs font-medium">Show on the customer's tracking link</span>
          <span class="block text-[11px] text-muted-foreground">{{ visible ? "The customer will see this update." : "Only you can see this update." }}</span>
        </span>
        <Switch :model-value="visible" @update:model-value="visible = $event" />
      </label>

      <div class="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" :disabled="isPosting" @click="cancel">Cancel</Button>
        <Button type="submit" size="sm" :disabled="!canPost">{{ isPosting ? "Posting..." : "Post update" }}</Button>
      </div>
    </form>

    <!-- Timeline -->
    <ul v-if="updates.length" class="mt-4 space-y-3">
      <li v-for="update in updates" :key="update.id" class="rounded-lg border border-border bg-background p-3">
        <div class="flex items-center justify-between gap-2">
          <p class="text-[11px] text-muted-foreground">{{ formatDate(update.createdAt) }}</p>
          <div class="flex items-center gap-1">
            <button
              type="button"
              class="flex items-center gap-1 rounded-full px-2 py-1 text-[11px] transition hover:bg-muted"
              :class="update.visibleToCustomer ? 'text-primary' : 'text-muted-foreground'"
              @click="orderStore.setProgressUpdateVisibility(order.id, update.id, !update.visibleToCustomer).catch(() => {})"
            >
              <Eye v-if="update.visibleToCustomer" class="size-3.5" />
              <EyeOff v-else class="size-3.5" />
              {{ update.visibleToCustomer ? "Shown to customer" : "Hidden" }}
            </button>
            <button type="button" class="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-destructive" aria-label="Delete update" @click="remove(update)">
              <Trash2 class="size-3.5" />
            </button>
          </div>
        </div>

        <p v-if="update.note" class="mt-1.5 text-sm">{{ update.note }}</p>

        <ImageStrip v-if="update.images.length"  class="mt-2" :images="update.images.map((img) => ({ url: img.url, alt: 'Progress photo' }))" />
      </li>
    </ul>
    <p v-else-if="!composing" class="mt-4 text-xs text-muted-foreground">No updates yet.</p>
  </div>
</template>

<script setup lang="ts">
import ImageStrip from "@/components/base/ImageStrip.vue";
import { computed, ref } from "vue";
import { Camera, Eye, EyeOff, Loader2, Plus, Trash2, X } from "@lucide/vue";
import Button from "@/components/ui/button/Button.vue";
import Switch from "@/components/ui/switch/Switch.vue";
import { useImageUpload } from "@/composables/useImageUpload";
import { formatDate } from "@/lib";
import { useOrderStore } from "@/stores/order";
import type { OrderType, ProgressUpdate } from "@/types/order";

const props = defineProps<{ order: OrderType }>();

const orderStore = useOrderStore();
const upload = useImageUpload();

const composing = ref(false);
const note = ref("");
const visible = ref(false); // private until the tailor decides otherwise
const isPosting = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const updates = computed(() => props.order.progressUpdates ?? []);
const hasContent = computed(() => note.value.trim().length > 0 || upload.items.value.some((i) => i.status === "done"));
const canPost = computed(() => hasContent.value && !upload.isUploading() && !isPosting.value);

function handleFiles(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) upload.addFiles(input.files);
  input.value = "";
}

function reset() {
  note.value = "";
  visible.value = false;
  composing.value = false;
}

async function cancel() {
  const pending = [...upload.items.value];
  reset();
  await Promise.all(pending.map((item) => upload.remove(item.localId))); // don't leave orphaned uploads in storage
}

async function post() {
  if (!canPost.value) return;
  isPosting.value = true;
  try {
    await orderStore.addProgressUpdate(props.order.id, {
      note: note.value.trim(),
      images: upload.toOrderImages(),
      visibleToCustomer: visible.value,
    });
    upload.items.value = []; // saved: the files now belong to the update
    reset();
  } catch {
    // the store already showed the error; keep the draft so nothing is lost
  } finally {
    isPosting.value = false;
  }
}

function remove(update: ProgressUpdate) {
  if (!window.confirm("Delete this update? Its photos are removed too.")) return;
  orderStore.removeProgressUpdate(props.order.id, update.id).catch(() => {});
}
</script>
