const CACHE_NAME = 'bookbuddy-cache-v1';
const OFFLINE_PAGE = '/offline.html';

const assetsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/img/icon-192x192.png',
    '/img/icon-512x512.png',
    OFFLINE_PAGE
];


self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(assetsToCache);
        })
    );
});


self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cache) => cache !== CACHE_NAME)
                          .map((cache) => caches.delete(cache))
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then((response) => {
                return response || caches.match(OFFLINE_PAGE);
            });
        })
    );
});
