const CACHE_NAME = 'ia-sin-limites-VERSION-FINAL-2026-V4'; 
const ARCHIVOS_A_CACHEAR = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS_A_CACHEAR))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then(lista => {
      return Promise.all(
        lista.filter(nombre => nombre !== CACHE_NAME).map(nombre => caches.delete(nombre))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    fetch(evento.request, {cache: "no-store"})
    .then(respuesta => {
      return caches.open(CACHE_NAME).then(cache => {
        cache.put(evento.request, respuesta.clone());
        return respuesta;
      });
    })
    .catch(() => caches.match(evento.request))
  );
});
