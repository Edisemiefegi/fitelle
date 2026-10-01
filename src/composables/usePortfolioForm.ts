import { reactive, ref } from "vue";
import { usePortfolioStore } from "@/stores/portfolio";
import { portfolioWorkSchema } from "@/schema/portfolio";
import type { PortfolioWork, PortfolioStatus, PortfolioCategory } from "@/types/portfolio";
import type { MediaFile } from "@/types/index";

export interface PortfolioFormState {
  title: string;
  category: PortfolioCategory;
  description: string;
  fabric: string;
  occasion: string;
  tags: string[];
}

function toFormState(work?: PortfolioWork | null): PortfolioFormState {
  if (!work) {
    return { title: "", category: "Other", description: "", fabric: "", occasion: "", tags: [] };
  }
  return {
    title: work.title,
    category: work.category,
    description: work.description,
    fabric: work.fabric,
    occasion: work.occasion,
    tags: [...work.tags],
  };
}

export function usePortfolioForm(work?: PortfolioWork | null) {
  const portfolioStore = usePortfolioStore();

  const isEditing = Boolean(work?.id);
  const form = reactive<PortfolioFormState>(toFormState(work));
  const errors = ref<Record<string, string>>({});
  const isSubmitting = ref(false);

  function validate() {
    errors.value = {};
    const result = portfolioWorkSchema.safeParse(form);
    if (!result.success) {
      for (const issue of result.error.issues) errors.value[issue.path[0] as string] = issue.message;
      return null;
    }
    return result.data;
  }

  /**
   * @param images current gallery, in display order, with the chosen cover already applied
   * @param status only used when creating; editing never changes status here —
   *   publish/unpublish is a separate, lighter action from the work card.
   */
  async function submit(images: MediaFile[], coverFileId: string | null, status: PortfolioStatus = "draft") {
    if (isSubmitting.value) return null;
    const data = validate();
    if (!data) return null;
    if (!images.length) {
      errors.value.images = "Add at least one photo";
      return null;
    }

    isSubmitting.value = true;
    try {
      if (isEditing && work) {
        await portfolioStore.updateWork(work.id, {
          title: data.title,
          category: data.category,
          description: data.description,
          fabric: data.fabric,
          occasion: data.occasion,
          tags: data.tags,
          images,
          coverImageId: coverFileId ?? images[0]?.fileId ?? null,
        });
        return work.id;
      }

      return await portfolioStore.addWork(data, images, status);
    } finally {
      isSubmitting.value = false;
    }
  }

  return { form, errors, isSubmitting, isEditing, submit };
}