<template>
  <Modal
    :save-btn="isEditing ? 'Save changes' : 'Save as draft'"
    full-screen-mobile
    :open="open"
    :is-loading="isSubmitting"
    :title="isEditing ? 'Edit work' : 'Add work'"
    description="Show off the details that make this piece worth seeing."
    @update:open="emit('update:open', $event)"
    @submit="handleSave"
  >
    <div class="space-y-8">
      <section class="space-y-4">
        <SectionLabel title="Photos" description="Add your best shots and choose a cover." />
        <ImageReorderGrid
          :items="upload.items.value"
          :cover-file-id="coverFileId"
          @add-files="handleAddFiles"
          @remove="handleRemove"
          @move="upload.move"
          @update:cover-file-id="coverFileId = $event"
        />
        <p v-if="errors.images" class="text-xs text-destructive">{{ errors.images }}</p>
      </section>

      <div class="h-px bg-border" />

      <section class="space-y-4">
        <SectionLabel title="Details" description="What is this piece, and what makes it special?" />

        <Field required label="Title" :error="errors.title">
          <FormInput v-model="form.title" placeholder="e.g. Emerald silk aso-ebi gown" />
        </Field>

        <Field label="Category">
          <Select v-model="form.category" :options="CATEGORY_OPTIONS" placeholder="Category" />
        </Field>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium">Fabric <span class="font-normal text-muted-foreground">(optional)</span></label>
            <FormInput v-model="form.fabric" placeholder="e.g. Silk organza" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Occasion <span class="font-normal text-muted-foreground">(optional)</span></label>
            <FormInput v-model="form.occasion" placeholder="e.g. Bridal, owambe" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Description <span class="font-normal text-muted-foreground">(optional)</span></label>
          <FormTextarea v-model="form.description" rows="3" placeholder="A line or two about the design, technique or story behind it..." />
        </div>

        <TagsInput v-model="form.tags" />
      </section>

      <Button v-if="!isEditing" type="button" variant="outline" class="w-full" :disabled="isSubmitting" @click="handlePublishNow">
        Publish now instead
      </Button>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import FormTextarea from "@/components/base/FormTextarea.vue";
import FormInput from "@/components/base/FormInput.vue";
import { ref, watch } from "vue";
import Modal from "@/components/base/Modal.vue";
import Field from "@/components/base/Field.vue";
import Select from "@/components/base/Select.vue";
import Button from "@/components/ui/button/Button.vue";
import SectionLabel from "@/components/orders/SectionLabel.vue";
import ImageReorderGrid from "./ImageReorderGrid.vue";
import TagsInput from "./TagsInput.vue";
import { usePortfolioForm } from "@/composables/usePortfolioForm";
import { useImageUpload } from "@/composables/useImageUpload";
import { CATEGORY_OPTIONS } from "@/constants/portfolio";
import type { PortfolioWork } from "@/types/portfolio";

const props = defineProps<{
  open: boolean;
  work?: PortfolioWork | null;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  saved: [workId: string];
}>();

const { form, errors, isSubmitting, isEditing, submit } = usePortfolioForm(props.work);
const upload = useImageUpload(props.work?.images ?? []);

const coverFileId = ref<string | null>(props.work?.coverImageId ?? null);

// Keep the cover pointing at a real image: default to the first one once
// photos exist, and fall back if the current cover gets removed.
watch(
  () => upload.items.value.map((i) => i.fileId).join(","),
  () => {
    const doneIds = upload.items.value.filter((i) => i.status === "done").map((i) => i.fileId!);
    if (!doneIds.length) {
      coverFileId.value = null;
    } else if (!coverFileId.value || !doneIds.includes(coverFileId.value)) {
      coverFileId.value = doneIds[0];
    }
  },
);

function handleAddFiles(files: FileList) {
  upload.addFiles(files);
}

function handleRemove(localId: string) {
  upload.remove(localId);
}

async function finish(status: "draft" | "published") {
  const id = await submit(upload.toFiles(), coverFileId.value, status);
  if (id) {
    emit("saved", id);
    emit("update:open", false);
  }
}

async function handleSave() {
  await finish(props.work?.status ?? "draft");
}

async function handlePublishNow() {
  await finish("published");
}
</script>