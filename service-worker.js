// service-worker.js
const CACHE = 'photobox-v8';  // bump to evict a stale cache
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/shared/styles.css',
  '/shared/navigation.js',
  '/shared/mock-data.js',
  '/shared/ios-frame.jsx',
  '/shared/onboarding-shell.jsx',
  '/shared/brand.jsx',
  // Splash brand assets (Figma node 451:13758)
  '/shared/assets/teachers-variable-latin.woff2',
  '/shared/assets/dmsans-variable-latin.woff2',
  '/shared/assets/splash-star-base.svg',
  '/shared/assets/icon-notification.svg',
  '/shared/assets/create-photo-books.png',
  '/shared/assets/create-wall-decor.png',
  '/shared/assets/create-calendars.png',
  '/shared/assets/create-prints.png',
  '/shared/assets/create-mugs.png',
  '/shared/assets/pb-shot-a.jpg',
  '/shared/assets/pb-shot-b.jpg',
  '/shared/assets/pb-shot-xl.jpg',
  '/shared/assets/pb-shot-large.jpg',
  '/shared/assets/pb-layflat.png',
  '/shared/assets/pb-icon-back.svg',
  '/shared/assets/pb-icon-info.svg',
  '/shared/assets/pb-icon-quality.svg',
  '/shared/assets/pb-icon-pages.svg',
  '/shared/assets/pb-icon-delivery.svg',
  '/shared/assets/pb-icon-arrow.svg',
  '/shared/assets/splash-star-glow1.svg',
  '/shared/assets/splash-star-glow2.svg',
  '/shared/assets/splash-star-glow3.svg',
  '/shared/assets/splash-star-glow4.svg',
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
  // Cache entries individually: with addAll() a single bad path rejects the whole
  // batch and nothing gets cached at all.
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.allSettled(PRECACHE.map(u => c.add(u)))
  ));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});
// Network-first, cache fallback. Cache-first froze the prototype: any edit to a
// precached screen stayed invisible until the cache name changed. This way the
// browser always shows the current file when online, and the cache — refreshed on
// every successful fetch — still serves the whole flow offline.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith((async () => {
    try {
      // Same-origin files bypass the browser HTTP cache: fetch(e.request) can be
      // answered from it, which hides local edits even under network-first.
      // Cross-origin (React/Babel CDN) keeps normal caching — it never changes.
      const url = new URL(e.request.url);
      const res = url.origin === location.origin
        ? await fetch(url.href, { cache: 'no-store' })
        : await fetch(e.request);
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    } catch (err) {
      const cached = await caches.match(e.request);
      if (cached) return cached;
      throw err;
    }
  })());
});
