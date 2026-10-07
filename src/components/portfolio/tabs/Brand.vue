<template>
  <Card>
    <form class="space-y-5" @submit.prevent="save">
      <Field label="Brand photo" description="Shown on the hero and as your page icon.">
        <div class="flex items-center gap-4">
          <img
            v-if="form.image"
            :src="form.image.url"
            alt="Brand photo"
            class="size-16 rounded-xl object-cover"
          />
          <div v-else class="flex size-16 items-center justify-center rounded-xl bg-muted">
            <ImagePlus class="size-5 text-muted-foreground" />
          </div>

          <Button type="button" variant="outline" size="sm" :disabled="isUploading" @click="fileInput?.click()">
            {{ isUploading ? "Uploading..." : form.image ? "Change photo" : "Upload photo" }}
          </Button>
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            @change="handleFile"
          />
        </div>
      </Field>

      <Field label="Hero piece" description="The piece shown full-screen at the top of your public page. Pick from your published works.">
        <div v-if="publishedWorks.length" class="grid grid-cols-3 gap-2 sm:grid-cols-5">
          <button
            type="button"
            class="flex aspect-[6/5] flex-col items-center justify-center rounded-xl border p-2 text-center text-[11px] transition"
            :class="!form.heroWorkId ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40'"
            @click="form.heroWorkId = null"
          >
            Latest
            <span class="mt-0.5 text-[10px] opacity-70">automatic</span>
          </button>

          <button
            v-for="work in publishedWorks"
            :key="work.id"
            type="button"
            class="relative aspect-[6/5] overflow-hidden rounded-xl border-2 bg-muted transition"
            :class="form.heroWorkId === work.id ? 'border-primary' : 'border-transparent hover:border-primary/40'"
            :title="work.title"
            @click="form.heroWorkId = work.id"
          >
            <img v-if="getCoverImage(work)" :src="getCoverImage(work)!.url" :alt="work.title" class="h-full w-full object-cover" loading="lazy" />
            <span v-if="form.heroWorkId === work.id" class="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check class="size-3" />
            </span>
          </button>
        </div>
        <p v-else class="text-xs text-muted-foreground">Publish a work in the Designs tab, then choose it here.</p>
      </Field>

      <div class="grid gap-5 md:grid-cols-2">
        <Field required label="Brand name" :error="errors.brandName">
          <Input v-model="form.brandName" placeholder="e.g. Didi Stitches" />
        </Field>

        <Field label="Signature line" :error="errors.tagline" description="The big headline on your page.">
          <Input v-model="form.tagline" placeholder="e.g. Made for your moment." />
        </Field>
      </div>

      <Field label="Introduction" :error="errors.introduction" description="One or two sentences under the headline.">
        <Input v-model="form.introduction" placeholder="e.g. Bespoke Aso-Ebi and bridal wear in Abuja." />
      </Field>

      <Field label="About your business" :error="errors.about">
        <FormTextarea v-model="form.about" rows="4" placeholder="Tell your customers a little about your business..." />
      </Field>

      <Field label="About the designer (optional)" :error="errors.designerBio">
        <FormTextarea v-model="form.designerBio" rows="4" placeholder="Who's behind the brand?" />
      </Field>

      <div class="flex justify-end">
        <Button type="submit" size="sm" :disabled="isSaving || isUploading">Save</Button>
      </div>
    </form>
  </Card>
</template>

<script setup lang="ts">
import FormTextarea from "@/components/base/FormTextarea.vue";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { Check, ImagePlus } from "@lucide/vue";
import Card from "@/components/base/Card.vue";
import Field from "@/components/base/Field.vue";
import Button from "@/components/ui/button/Button.vue";
import Input from "@/components/ui/input/Input.vue";
import { usePortfolioSection } from "@/composables/usePortfolioSection";
import { brandSchema } from "@/schema/portfolio";
import { getCoverImage } from "@/constants/portfolio";
import { usePortfolioStore } from "@/stores/portfolio";
import { deleteImageFile, uploadImageFile } from "@/service/appwrite";

const MAX_SIZE = 5 * 1024 * 1024;

const { form, errors, isSaving, save } = usePortfolioSection(
  (p) => ({
    brandName: p.brandName,
    tagline: p.tagline,
    introduction: p.introduction,
    about: p.about,
    designerBio: p.designerBio,
    image: p.image,
    heroWorkId: p.heroWorkId ?? null,
  }),
  brandSchema,
);

const publishedWorks = computed(() => usePortfolioStore().works.filter((w) => w.status === "published"));

const fileInput = ref<HTMLInputElement>();
const isUploading = ref(false);

async function handleFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > MAX_SIZE) {
    toast.error("Use a JPG, PNG or WEBP image under 5MB.");
    return;
  }

  isUploading.value = true;
  try {
    const previous = form.image;
    const { fileId, url } = await uploadImageFile(file);
    form.image = { fileId, url, uploadedAt: new Date().toISOString() };
    if (previous) deleteImageFile(previous.fileId).catch(() => {});
  } catch (error) {
    console.error("Brand photo upload failed:", error);
    toast.error("Upload failed. Try again.");
  } finally {
    isUploading.value = false;
  }
}
</script>
