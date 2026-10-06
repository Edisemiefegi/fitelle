import { computed } from "vue";

export type Platform = "ios" | "android" | "desktop";

export function useDevicePlatform() {
  const platform = computed<Platform>(() => {
    if (typeof navigator === "undefined") return "desktop";
    const ua = navigator.userAgent;

    // Classic iPhone/iPod/iPad UA, plus iPadOS 13+ which reports as "Macintosh"
    // but is touch-capable (a real Mac has maxTouchPoints === 0).
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (isIOS) return "ios";

    if (/Android/.test(ua)) return "android";

    return "desktop";
  });

  const isStandalone = computed(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari's own (non-standard) flag — matchMedia above doesn't catch it there.
      (navigator as any).standalone === true
    );
  });

  return { platform, isStandalone };
}