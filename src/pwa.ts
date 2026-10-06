import type { Router } from "vue-router";
import { Workbox } from "workbox-window";

const UPDATE_CHECK_MS = 30 * 60 * 1000;

/**
 * Registers the service worker and keeps the app up to date without any user action.
 *
 * After a deployment the browser finds the new sw.js (on load, every 30 minutes, and whenever the
 * app comes back to the foreground). The new worker takes over at once; the page itself reloads at
 * the next moment it can't lose work: when the user navigates, or when the app goes to the background.
 */
export function setupPwa(router: Router) {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  let updateReady = false;

  const wb = new Workbox("/sw.js");
  wb.addEventListener("controlling", (event) => {
    if (event.isUpdate) updateReady = true;
  });

  wb.register().then((registration) => {
    if (!registration) return;
    const checkForUpdate = () => registration.update().catch(() => {});

    setInterval(checkForUpdate, UPDATE_CHECK_MS);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkForUpdate();
      else if (updateReady) location.reload();
    });
  });

  router.beforeEach((to) => {
    if (!updateReady) return true;
    location.assign(to.fullPath);
    return false;
  });

  // A lazy chunk from the previous build no longer exists: load the new build instead.
  window.addEventListener("vite:preloadError", () => location.reload());
}
