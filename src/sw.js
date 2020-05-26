importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js')
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
    new RegExp('https://'),
    new workbox.strategies.StaleWhileRevalidate({
        cacheName:'football-api-request',
        plugins:[
            new workbox.expiration.ExpirationPlugin({
                maxEntries:50,
                maxAgeSeconds:30 * 24 * 60 * 60
            })
        ]
    })
);
self.addEventListener('push',evt => {
    const title = 'Football PWA';
    const options = {
      body: evt.data.text(),
      icon: '/assets/logo1.png'
    };
    evt.waitUntil(self.registration.showNotification(title, options));
  });
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)