const CACHE_NAME = "simple-pwa-v1";
const ASSETS = [
    "./",
    "./index.html",
    "./manifest.webmanifest"
];

// Install: pre-cache essential assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : undefined)))
        )
    );
    self.clients.claim();
});

// Fetch: cache-first for same-origin requests
self.addEventListener("fetch", (event) => {
    const req = event.request;
    if (new URL(req.url).origin === self.location.origin) {
        event.respondWith(
            caches.match(req).then((cached) => cached || fetch(req))
        );
    }
});
