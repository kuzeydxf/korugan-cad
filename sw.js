// Korugan CAD 0.9.5: everything the app needs is cached on first open, so it
// starts and works with no connection (in the field).
const CACHE = "korugan-0.9.5-43d3a43766";
const FILES = ["./", "app.js","apple-touch-icon.png","envs.js","gcs-wasm.js","icon-192.png","icon-512.png","icon-maskable-512.png","index.html","kernel-wasm.js","kernel.js","manifest.webmanifest","fonts/barlow-400.woff2","fonts/barlow-500.woff2","fonts/barlow-600.woff2","fonts/barlow-700.woff2","fonts/plexmono-400.woff2","fonts/plexmono-500.woff2",].filter((f) => f !== "sw.js");
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("korugan-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then((c) => c.match(r, { ignoreSearch: true }).then((hit) => hit || fetch(r).then((res) => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => c.match("./")))));
});
