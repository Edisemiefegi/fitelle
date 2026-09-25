import { Client, Storage, ID } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const storage = new Storage(client);

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID as string;

export async function uploadImageFile(file: File): Promise<{ fileId: string; url: string }> {
  const created = await storage.createFile(BUCKET_ID, ID.unique(), file);
  return { fileId: created.$id, url: getFileUrl(created.$id) };
}

export function getFileUrl(fileId: string): string {
  return storage.getFileView(BUCKET_ID, fileId).toString();
}

export async function deleteImageFile(fileId: string): Promise<void> {
  await storage.deleteFile(BUCKET_ID, fileId);
}