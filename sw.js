// Service Worker de Quiniela Mundial 26
// Es el archivo que el navegador necesita para poder "instalar"
// la app en el celular/computadora (ícono en pantalla, se abre
// como app aparte, sin la barra del navegador).
//
// No guarda nada en caché a propósito: la quiniela necesita datos
// siempre frescos (Firebase en tiempo real), así que este service
// worker solo deja pasar las peticiones normales a internet.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response('Sin conexión a internet. Intenta de nuevo cuando tengas señal.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    })
  );
});
