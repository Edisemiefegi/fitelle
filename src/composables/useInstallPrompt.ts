import { ref } from "vue";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// The browser fires `beforeinstallprompt` once, often before any component has mounted,
// so it's captured at module load (main.ts imports this file) and shared by every caller.
const deferredEvent = ref<BeforeInstallPromptEvent | null>(null);
const canInstall = ref(false);

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredEvent.value = event as BeforeInstallPromptEvent;
    canInstall.value = true;
  });

  window.addEventListener("appinstalled", () => {
    deferredEvent.value = null;
    canInstall.value = false;
  });
}

async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!deferredEvent.value) return "unavailable";
  await deferredEvent.value.prompt();
  const { outcome } = await deferredEvent.value.userChoice;
  deferredEvent.value = null;
  canInstall.value = false;
  return outcome;
}

export function useInstallPrompt() {
  return { canInstall, promptInstall };
}
