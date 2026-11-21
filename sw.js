/* Radar · Observación — caché sin conexión de los archivos propios.
   Sube VERSION al publicar una versión nueva: fuerza la recarga en los móviles. */
const VERSION = "radar-v3";
const ARCHIVOS = ["./", "./index.html", "./items.json", "./config.js",
                  "./manifest.webmanifest", "./icon-192.png", "./icon-512.png",
                  "./fonts/redstick.otf", "./fonts/configblack.ttf", "./fonts/configtext.ttf", "./fonts/crest.png"];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e=>{
  const u = new URL(e.request.url);
  if(e.request.method!=="GET" || u.origin!==location.origin) return;  // Graph y CDN siempre en red
  e.respondWith(
    caches.match(e.request).then(hit=>{
      const red = fetch(e.request).then(r=>{
        if(r && r.status===200) caches.open(VERSION).then(c=>c.put(e.request, r.clone()));
        return r;
      }).catch(()=>hit);
      return hit || red;
    })
  );
});
