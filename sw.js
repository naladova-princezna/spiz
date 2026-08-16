// Service worker – offline režim pro aplikaci Spíž.
// Verzi zvyš při každé změně souborů, aby se vynutila aktualizace cache.
const CACHE = 'spiz-v1';

// Soubory tvořící "skořápku" aplikace (fungují i offline).
// Pozn.: data.json zde záměrně NENÍ – ať se vždy stahuje čerstvé ze sítě.
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './html5-qrcode.min.js',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon-32.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // data.json a volání GitHub API vždy ze sítě (ať máme nejnovější data).
  if (url.pathname.endsWith('/data.json') || url.hostname === 'api.github.com') {
    e.respondWith(fetch(req).catch(() => caches.match(req)));
    return;
  }

  // Zbytek: nejdřív cache, pak síť (a průběžně doplňuj cache).
  e.respondWith(
    caches.match(req).then((cached) => {
      const fromNet = fetch(req).then((res) => {
        if (res && res.status === 200 && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fromNet;
    })
  );
});
