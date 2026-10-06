import { computed, ref } from "vue";
import { toast } from "vue-sonner";
import { isPushSupported, onForegroundMessage, registerDevice, unregisterDevice } from "@/service/push";
import { useAuthStore } from "@/stores/auth";
import { useDevicePlatform } from "@/composables/useDevicePlatform";

const ENABLED_KEY = "fitelle:push-enabled";

function readEnabled(): boolean {
  try {
    return localStorage.getItem(ENABLED_KEY) === "1";
  } catch {
    return false;
  }
}

function writeEnabled(value: boolean) {
  try {
    localStorage.setItem(ENABLED_KEY, value ? "1" : "0");
  } catch {
    // private mode: the switch just won't survive a reload
  }
}

// Shared across callers: push is a per-device setting, not a per-component one.
const supported = ref(false);
const permission = ref<NotificationPermission>("default");
const enabled = ref(readEnabled());
const isBusy = ref(false);

let started = false;

/**
 * Called once after login. Refreshes this device's token (they rotate) and shows pushes that
 * arrive while the app is open as toasts; background pushes are handled by the service worker.
 */
export async function startPush() {
  supported.value = await isPushSupported();
  if (!supported.value) return;

  permission.value = Notification.permission;
  const user = useAuthStore().currentUser;
  if (!user || !enabled.value || permission.value !== "granted" || started) return;

  started = true;
  registerDevice(user.id).catch((error) => console.error("push token refresh failed:", error));
  onForegroundMessage(({ title, body }) => toast(title, { description: body }));
}

export function usePushNotifications() {
  const authStore = useAuthStore();
  const { platform, isStandalone } = useDevicePlatform();

  // iPhones only allow web push for apps added to the home screen.
  const needsInstall = computed(() => platform.value === "ios" && !isStandalone.value);
  const isEnabled = computed(() => supported.value && enabled.value && permission.value === "granted");

  async function enable() {
    const user = authStore.currentUser;
    if (!user || isBusy.value) return;

    isBusy.value = true;
    try {
      permission.value = await Notification.requestPermission();
      if (permission.value !== "granted") {
        toast.error("Notifications are blocked. Allow them in your browser settings, then try again.");
        return;
      }
      await registerDevice(user.id);
      enabled.value = true;
      writeEnabled(true);
      toast.success("Notifications turned on for this device");
    } catch (error) {
      console.error("enable push error:", error);
      toast.error("Couldn't turn on notifications. Try again.");
    } finally {
      isBusy.value = false;
    }
  }

  async function disable() {
    const user = authStore.currentUser;
    if (!user || isBusy.value) return;

    isBusy.value = true;
    try {
      await unregisterDevice(user.id);
      enabled.value = false;
      writeEnabled(false);
      toast.success("Notifications turned off for this device");
    } catch (error) {
      console.error("disable push error:", error);
      toast.error("Couldn't turn off notifications. Try again.");
    } finally {
      isBusy.value = false;
    }
  }

  return { supported, isEnabled, isBusy, needsInstall, permission, enable, disable };
}
