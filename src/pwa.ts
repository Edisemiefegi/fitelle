import type { Router } from "vue-router";
import { Workbox } from "workbox-window";

const UPDATE_CHECK_MS = 30 * 60 * 1000;
const RELOAD_COOLDOWN_MS = 60 * 1000;
const LAST_RELOAD_KEY = "fitelle:last-reload";

/** Reloads at most once a minute, so a page that fails to load can never put the app in a reload loop. */
function reloadOnce(go: () => void): boolean {
  try {
    const last = Number(sessionStorage.getItem(LAST_RELOAD_KEY) ?? 0);
    if (Date.now() - last < RELOAD_COOLDOWN_MS) return false;
    sessionStorage.setItem(LAST_RELOAD_KEY, String(Date.now()));
  } catch {
    // storage unavailable: fall through and reload
  }
  go();
  return true;
}

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

    // Browsers only look for a new service worker on navigation once a day, so ask right away too:
    // a device with a broken version then recovers on its next load rather than a day later.
    checkForUpdate();
    setInterval(checkForUpdate, UPDATE_CHECK_MS);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") checkForUpdate();
      else if (updateReady) reloadOnce(() => location.reload());
    });
  });

  router.beforeEach((to) => {
    if (!updateReady) return true;
    return reloadOnce(() => location.assign(to.fullPath)) ? false : true;
  });

  // A lazy chunk from the previous build no longer exists: load the new build instead.
  // If it fails again straight after a reload, the error is left to surface instead of looping.
  window.addEventListener("vite:preloadError", (event) => {
    if (reloadOnce(() => location.reload())) event.preventDefault();
  });
}
