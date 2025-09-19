// sw.js
// v3 – cache bust
const CACHE_NAME = 'yonde-v7';
const APP_SHELL = [
  './',
  '/yonde-aiueo/index.html', // ← GitHub Pages のリポ名配下で配信されるならフル/相対を揃える
  '/yonde-aiueo/manifest.json',
  '/yonde-aiueo/icon/icon_192.png',
  '/yonde-aiueo/icon/icon_512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Cache-first（失敗時はネット）
self.addEventListener('fetch', (event) => {
  const { request } = event;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).catch(() => caches.match('./')); // オフライン時のフォールバック
    })
  );
});
