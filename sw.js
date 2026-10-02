var V = "mc-v2";

var F = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(V).then(function(c) {
      return c.addAll(F);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(k) {
      return Promise.all(
        k
          .filter(function(x) {
            return x !== V;
          })
          .map(function(x) {
            return caches.delete(x);
          })
      );
    })
  );

  self.clients.claim();
});

self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request)
      .then(function(response) {
        var copy = response.clone();

        caches.open(V).then(function(cache) {
          cache.put(e.request, copy);
        });

        return response;
      })
      .catch(function() {
        return caches.match(e.request).then(function(r) {
          return r || caches.match("./index.html");
        });
      })
  );
});
