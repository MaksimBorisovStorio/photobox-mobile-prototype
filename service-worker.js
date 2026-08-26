// service-worker.js
const CACHE = 'photobox-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/shared/styles.css',
  '/shared/navigation.js',
  '/shared/mock-data.js',
  '/shared/ios-frame.jsx',
  // Screens
  '/screens/splash.html',
  '/screens/splash.jsx',
  '/screens/onboarding-1.html',
  '/screens/onboarding-1.jsx',
  '/screens/onboarding-2.html',
  '/screens/onboarding-2.jsx',
  '/screens/onboarding-3.html',
  '/screens/onboarding-3.jsx',
  '/screens/home.html',
  '/screens/home.jsx',
  '/screens/product-photobook.html',
  '/screens/product-photobook.jsx',
  '/screens/editor-format.html',
  '/screens/editor-format.jsx',
  '/screens/editor-configure.html',
  '/screens/editor-configure.jsx',
  '/screens/basket.html',
  '/screens/basket.jsx',
  '/screens/checkout-delivery.html',
  '/screens/checkout-delivery.jsx',
  '/screens/checkout-payment.html',
  '/screens/checkout-payment.jsx',
  '/screens/order-success.html',
  '/screens/order-success.jsx',
  '/screens/account.html',
  '/screens/account.jsx',
  // Image picker
  '/image-picker/index.html',
  '/image-picker/image-picker.jsx',
  '/image-picker/ios-frame.jsx',
  '/image-picker/photos.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
