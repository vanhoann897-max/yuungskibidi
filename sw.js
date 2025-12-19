// sw.js
const CACHE_NAME = 'yuung-player-v2-offline';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://unpkg.com/jsmediatags@3.9.5/dist/jsmediatags.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
];

// 1. Cài đặt và cache tài nguyên
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Đang cache các file cần thiết...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 2. Kích hoạt và xóa cache cũ nếu có update
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// 3. Chặn request mạng: Lấy từ Cache trước, nếu không có mới tải từ mạng
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      // Nếu offline và không có trong cache (trường hợp hiếm)
      return new Response("Bạn đang offline và file này chưa được cache.");
    })
  );
});
