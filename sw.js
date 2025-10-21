// Saksham Appstore Service Worker 🚀
// Version: 1.0.0

const CACHE_NAME = "saksham-appstore-v1";
const ASSETS = [
  "/Saksham-Appstore/",
  "/Saksham-Appstore/index.html",
  "/Saksham-Appstore/offline.html",
  "/Saksham-Appstore/manifest.json",
  "/Saksham-Appstore/favicon-192.png",
  "/Saksham-Appstore/favicon-512.png"
];

// Install event — cache essential files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("📦 Caching Appstore files...");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event — clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => {
              console.log("🧹 Removing old cache:", key);
              return caches.delete(key);
            })
      )
    )
  );
  self.clients.claim();
});

// Fetch event — serve from cache, then network
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Serve cached version
        return cached;
      }

      // Try fetching from network
      return fetch(event.request).then(response => {
        // Cache new responses
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    }).catch(() => {
      // Offline fallback
      return caches.match("/Saksham-Appstore/offline.html");
    })
  );
});
