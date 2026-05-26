// Service Worker - 缓存策略
const CACHE_NAME = 'nailong-museum-v1';
const urlsToCache = [
    '/',
    '/css/style.min.css',
    '/js/paintings-data.js',
    '/assets/images/starry-night-bg.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
