// sw.js - Offline support for 'よんで！'
const CACHE_NAME = 'yonde-v3';
const APP_SHELL = [
  './',
  './yonde-aiueo/index.html',
  './yonde-aiueo/manifest.json',
  './yonde-aiueo/icon/icon_192.png',
  './yonde-aiueo/icon/icon_512.png'
  // 他に分割した CSS/JSや画像があればここへ追加
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

// Cache-first: まずキャッシュを返し、なければネットワーク
self.addEventListener('fetch', (event) => {
  const { request } = event;
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).catch(() => caches.match('./'));
    })
  );
});
