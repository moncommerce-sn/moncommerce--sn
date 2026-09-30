var V="mc-v1",F=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!=V}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){if(e.request.method!="GET")return;e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(function(n){var c=n.clone();caches.open(V).then(function(ch){ch.put(e.request,c)});return n}).catch(function(){return caches.match("./index.html")})}))});
