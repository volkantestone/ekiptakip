// 1. Kurulum aşamasında hiçbir şeyi cache'lemiyoruz
self.addEventListener('install', (event) => {
    // Beklemeden hemen aktif olması için
    self.skipWaiting();
    console.log('Service Worker kuruldu, cache yapılmıyor.');
});

// 2. Aktivasyon aşamasında varsa eski cache'leri temizliyoruz
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('Eski cache siliniyor:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        })
    );
    // Mevcut sekmeleri hemen kontrol altına al
    return self.clients.claim();
});

// 3. İstek aşamasında hiçbir şeyi cache'ten döndürmüyoruz
// Sadece fetch işlemini yapıp sonucu döndürüyoruz
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Her şey yolunda, internetten gelen cevabı döndür
                return response;
            })
            .catch(() => {
                // İnternet yoksa ve cache de boşsa burada hata döner
                console.log('Bağlantı yok ve önbellek kapalı.');
            })
    );
});