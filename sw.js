/* Service worker: makes the app openable from the home screen and usable
   on a train with no signal.

   Strategy, by request kind:
   - /api/*            never cached — AI, sync and TTS must hit the network
   - navigations       network-first, falling back to the cached shell offline
   - same-origin GETs  stale-while-revalidate, so the big data files load
                       instantly and refresh quietly in the background
   Bump CACHE_VERSION whenever the shell changes shape. */

const CACHE_VERSION = "dl-v1";
const SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/data.js",
  "/words_data.js",
  "/drills_data.js",
  "/games_data.js",
  "/satzbau_data.js",
  "/talkbox_data.js",
  "/exam_data.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      // Individual failures must not fail the whole install.
      .then(cache => Promise.allSettled(SHELL.map(url => cache.add(url))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put("/index.html", copy));
          return res;
        })
        .catch(() => caches.match("/index.html").then(r => r || Response.error()))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached => {
      const network = fetch(req)
        .then(res => {
          if (res && res.status === 200 && res.type === "basic") {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then(c => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
