import { ref } from "vue";
import { uploadImageFile, deleteImageFile } from "@/service/appwrite";
import { generateId } from "@/lib";
import type { OrderImage } from "@/types/order";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface UploadItem extends Partial<OrderImage> {
  localId: string; 
  previewUrl: string; 
  status: "uploading" | "done" | "error";
  error?: string;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Only JPG, PNG or WEBP images are allowed";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "Image is larger than 5MB";
  }
  return null;
}

/** @param initial existing images already saved on the order (edit mode) */
export function useImageUpload(initial: OrderImage[] = []) {
  const items = ref<UploadItem[]>(
    initial.map((img) => ({
      ...img,
      localId: img.fileId,
      previewUrl: img.url,
      status: "done",
    })),
  );

  async function addFiles(files: FileList | File[]) {
    for (const file of Array.from(files)) {
      const localId = generateId("upload");
      const validationError = validateFile(file);

      const item: UploadItem = {
        localId,
        previewUrl: URL.createObjectURL(file),
        status: validationError ? "error" : "uploading",
        error: validationError ?? undefined,
      };
      items.value.push(item);

      if (validationError) continue;

      try {
        const uploaded = await uploadImageFile(file);
        const target = items.value.find((i) => i.localId === localId);
        if (!target) continue; // removed while uploading
        target.fileId = uploaded.fileId;
        target.url = uploaded.url;
        target.uploadedAt = new Date().toISOString();
        target.status = "done";
      } catch (error) {
        console.error("Image upload failed:", error);
        const target = items.value.find((i) => i.localId === localId);
        if (target) {
          target.status = "error";
          target.error = "Upload failed. Try again.";
        }
      }
    }
  }

  async function remove(localId: string) {
    const item = items.value.find((i) => i.localId === localId);
    if (item?.fileId) {
      try {
        await deleteImageFile(item.fileId);
      } catch (error) {
        // Non-fatal: the reference is being removed from the order either way.
        console.error("Failed to delete image from storage:", error);
      }
    }
    items.value = items.value.filter((i) => i.localId !== localId);
  }

  function toOrderImages(visibleToCustomerDefault = false): OrderImage[] {
    return items.value
      .filter((i) => i.status === "done" && i.fileId && i.url)
      .map((i) => ({
        fileId: i.fileId!,
        url: i.url!,
        uploadedAt: i.uploadedAt ?? new Date().toISOString(),
        visibleToCustomer: i.visibleToCustomer ?? visibleToCustomerDefault,
      }));
  }

  const isUploading = () => items.value.some((i) => i.status === "uploading");

  return { items, addFiles, remove, toOrderImages, isUploading };
}