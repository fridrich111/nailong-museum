// Service Worker - 缓存策略 v3
const CACHE_NAME = 'nailong-museum-v3';
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
    // 立即激活新的SW，不等待旧SW关闭
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    // 清理旧缓存
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
});

self.addEventListener('fetch', event => {
    // admin.html 和 API 请求跳过缓存，始终走网络
    var url = event.request.url;
    if (url.indexOf('/admin.html') !== -1 || url.indexOf('supabase') !== -1) {
        return; // 不拦截，走浏览器默认网络请求
    }

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
