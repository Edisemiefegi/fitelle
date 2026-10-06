import { Client, Storage, ID } from "appwrite";

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID as string;

// Created on first use, not at import: a missing/invalid env var then only breaks image uploads,
// instead of crashing every page that happens to import this file.
let storage: Storage | null = null;

function getStorage(): Storage {
  if (!storage) {
    const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string | undefined;
    const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string | undefined;
    if (!endpoint || !projectId || !BUCKET_ID) {
      throw new Error("Appwrite is not configured: set VITE_APPWRITE_ENDPOINT, VITE_APPWRITE_PROJECT_ID and VITE_APPWRITE_BUCKET_ID.");
    }
    storage = new Storage(new Client().setEndpoint(endpoint).setProject(projectId));
  }
  return storage;
}

export async function uploadImageFile(file: File): Promise<{ fileId: string; url: string }> {
  const created = await getStorage().createFile(BUCKET_ID, ID.unique(), file);
  return { fileId: created.$id, url: getFileUrl(created.$id) };
}

export function getFileUrl(fileId: string): string {
  return getStorage().getFileView(BUCKET_ID, fileId).toString();
}

export async function deleteImageFile(fileId: string): Promise<void> {
  await getStorage().deleteFile(BUCKET_ID, fileId);
}
