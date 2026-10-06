import { deleteToken, getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { app, db, deleteDoc, doc, setDoc } from "@/service/firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

/** Each browser/device that enabled push gets a doc at users/{uid}/devices/{token}. */
const deviceDoc = (userId: string, token: string) => doc(db, "users", userId, "devices", token);

export async function isPushSupported(): Promise<boolean> {
  return (
    import.meta.env.PROD && // the service worker only exists in production builds
    Boolean(VAPID_KEY) &&
    "serviceWorker" in navigator &&
    "Notification" in window &&
    (await isSupported().catch(() => false))
  );
}

async function currentToken(): Promise<string> {
  const registration = await navigator.serviceWorker.ready;
  return getToken(getMessaging(app), { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
}

export async function registerDevice(userId: string): Promise<void> {
  const token = await currentToken();
  await setDoc(deviceDoc(userId, token), {
    token,
    userAgent: navigator.userAgent,
    updatedAt: new Date().toISOString(),
  });
}

export async function unregisterDevice(userId: string): Promise<void> {
  const token = await currentToken().catch(() => null);
  if (token) await deleteDoc(deviceDoc(userId, token));
  await deleteToken(getMessaging(app)).catch(() => {});
}

/** Messages that arrive while the app is open (the service worker handles the rest). */
export function onForegroundMessage(handler: (message: { title: string; body: string }) => void) {
  return onMessage(getMessaging(app), (payload) => {
    const data = payload.data ?? {};
    handler({ title: data.title ?? payload.notification?.title ?? "Fitelle", body: data.body ?? payload.notification?.body ?? "" });
  });
}
