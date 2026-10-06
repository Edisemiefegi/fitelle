import { onBeforeUnmount, onMounted, ref } from "vue";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function useInstallPrompt() {
  const deferredEvent = ref<BeforeInstallPromptEvent | null>(null);
  const canInstall = ref(false);

  function handlePrompt(event: Event) {
    event.preventDefault();
    deferredEvent.value = event as BeforeInstallPromptEvent;
    canInstall.value = true;
  }

  function handleInstalled() {
    canInstall.value = false;
    deferredEvent.value = null;
  }

  onMounted(() => {
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("beforeinstallprompt", handlePrompt);
    window.removeEventListener("appinstalled", handleInstalled);
  });

  async function promptInstall(): Promise<"accepted" | "dismissed" | "unavailable"> {
    if (!deferredEvent.value) return "unavailable";
    await deferredEvent.value.prompt();
    const { outcome } = await deferredEvent.value.userChoice;
    deferredEvent.value = null;
    canInstall.value = false;
    return outcome;
  }

  return { canInstall, promptInstall };
}