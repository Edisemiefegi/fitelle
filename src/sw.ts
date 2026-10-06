/// <reference lib="webworker" />
import { clientsClaim } from "workbox-core";
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

// ── Offline shell + self-updating ───────────────────────────────────────
// A new deployment ships a new sw.js; it installs, takes over immediately and drops the old
// cache. The page (see src/pwa.ts) then reloads itself at a safe moment.
self.skipWaiting();
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Single-page app: every navigation is served the cached shell (except static files).
registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html"), { denylist: [/^\/sw\.js$/, /^\/manifest/, /\.\w+$/] }));

// ── Push notifications ──────────────────────────────────────────────────
// The server sends data-only FCM messages: { title, body, url, tag }.
interface PushContent {
  title?: string;
  body?: string;
  url?: string;
  tag?: string;
}

self.addEventListener("push", (event) => {
  let content: PushContent = {};
  try {
    const payload = event.data?.json() ?? {};
    content = payload.data ?? payload.notification ?? payload;
  } catch {
    content = { body: event.data?.text() };
  }

  event.waitUntil(
    self.registration.showNotification(content.title ?? "Fitelle", {
      body: content.body,
      tag: content.tag,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: content.url ?? "/overview" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url ?? "/overview", self.location.origin).href;

  event.waitUntil(
    (async () => {
      const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const open = windows.find((client) => new URL(client.url).origin === self.location.origin);
      if (open) {
        await open.focus();
        await open.navigate(url);
      } else {
        await self.clients.openWindow(url);
      }
    })(),
  );
});
