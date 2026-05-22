const CACHE_NAME = 'ia-sin-limites-v1';
const ARCHIVOS_A_CACHEAR = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css',
  'https://cdn-icons-png.flaticon.com/512/1005/1005141.png'
];

// Instalación: guarda todos los archivos en la memoria del celular
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Archivos guardados en caché correctamente');
        return cache.addAll(ARCHIVOS_A_CACHEAR);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación: borra versiones antiguas si las hay
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nombresCache) => {
      return Promise.all(
        nombresCache.filter((nombre) => nombre !== CACHE_NAME)
                    .map((nombre) => caches.delete(nombre))
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepción de peticiones: funciona SIN INTERNET
self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request)
      .then((respuestaCache) => {
        // Devuelve el archivo guardado o lo pide de internet si no está
        return respuestaCache || fetch(evento.request)
          .then((respuestaRed) => {
            return caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(evento.request, respuestaRed.clone());
                return respuestaRed;
              });
          });
      })
  );
});
