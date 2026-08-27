// service-worker.js
const CACHE = 'photobox-v18';  // bump to evict a stale cache
// Paths are relative to this file's URL, not root-absolute: GitHub Pages serves a
// project site from /<repo>/, where a leading slash would resolve above the app and
// 404 every entry. c.add() and the fetch handler both work off the request URL, so
// nothing else here cares where the app is mounted.
const PRECACHE = [
  './',
  'index.html',
  'manifest.json',
  'shared/styles.css',
  'shared/navigation.js',
  'shared/mock-data.js',
  'shared/ios-frame.jsx',
  'shared/onboarding-shell.jsx',
  'shared/brand.jsx',
  // Splash brand assets (Figma node 451:13758)
  'shared/assets/teachers-variable-latin.woff2',
  'shared/assets/dmsans-variable-latin.woff2',
  'shared/assets/splash-star-base.svg',
  'shared/assets/icon-notification.svg',
  'shared/assets/create-photo-books.png',
  'shared/assets/create-wall-decor.png',
  'shared/assets/create-calendars.png',
  'shared/assets/create-prints.png',
  'shared/assets/create-mugs.png',
  'shared/assets/pb-shot-a.jpg',
  'shared/assets/pb-shot-b.jpg',
  'shared/assets/pb-shot-xl.jpg',
  'shared/assets/pb-shot-large.jpg',
  'shared/assets/pb-layflat.png',
  'shared/assets/pb-icon-back.svg',
  'shared/assets/pb-icon-info.svg',
  'shared/assets/pb-icon-quality.svg',
  'shared/assets/pb-icon-pages.svg',
  'shared/assets/pb-icon-delivery.svg',
  'shared/assets/pb-icon-arrow.svg',
  'shared/assets/pb-editor-close.svg',
  'shared/assets/pb-editor-undo.svg',
  'shared/assets/pb-editor-upload.svg',
  'shared/assets/pb-font-alumnisans.woff2',
  'shared/assets/pb-font-basic.woff2',
  'shared/assets/pb-font-bigshoulders.woff2',
  'shared/assets/pb-font-borel.woff2',
  'shared/assets/pb-font-caveat.woff2',
  'shared/assets/pb-font-changaone.woff2',
  'shared/assets/pb-font-coustard.woff2',
  'shared/assets/pb-font-darumadrop.woff2',
  'shared/assets/pb-src-allphotos.jpg',
  'shared/assets/pb-src-back.svg',
  'shared/assets/pb-src-berlin.jpg',
  'shared/assets/pb-src-cameraroll.svg',
  'shared/assets/pb-src-canada.jpg',
  'shared/assets/pb-src-cappadocia.jpg',
  'shared/assets/pb-src-etna.jpg',
  'shared/assets/pb-src-face1.png',
  'shared/assets/pb-src-face2.png',
  'shared/assets/pb-src-face3.png',
  'shared/assets/pb-src-face4.png',
  'shared/assets/pb-src-favorite.jpg',
  'shared/assets/pb-src-frame-jane.svg',
  'shared/assets/pb-src-frame-tim.svg',
  'shared/assets/pb-src-guadalupe.jpg',
  'shared/assets/pb-src-italy.jpg',
  'shared/assets/pb-src-places.jpg',
  'shared/assets/pb-src-tim.jpg',
  'shared/assets/pb-editor-redo.svg',
  'shared/assets/pb-editor-next.svg',
  'shared/assets/pb-editor-options.svg',
  'shared/assets/pb-editor-plus.svg',
  'shared/assets/pb-editor-add-image.svg',
  'shared/assets/pb-editor-tool-photos.svg',
  'shared/assets/pb-editor-tool-arrange.svg',
  'shared/assets/pb-editor-tool-themes.svg',
  'shared/assets/pb-editor-tool-style.svg',
  'shared/assets/pb-editor-tool-ai.svg',
  'shared/assets/pb-editor-spine.png',
  'shared/assets/pb-editor-hinge.png',
  'shared/assets/splash-star-glow1.svg',
  'shared/assets/splash-star-glow2.svg',
  'shared/assets/splash-star-glow3.svg',
  'shared/assets/splash-star-glow4.svg',
  // Screens
  'screens/splash.html',
  'screens/splash.jsx',
  'screens/onboarding-1.html',
  'screens/onboarding-1.jsx',
  'screens/onboarding-2.html',
  'screens/onboarding-2.jsx',
  'screens/onboarding-3.html',
  'screens/onboarding-3.jsx',
  'screens/home.html',
  'screens/home.jsx',
  'screens/product-photobook.html',
  'screens/product-photobook.jsx',
  'screens/editor.html',
  'screens/editor.jsx',
  'screens/photo-sources.html',
  'screens/photo-sources.jsx',
  'screens/basket.html',
  'screens/basket.jsx',
  'screens/checkout-delivery.html',
  'screens/checkout-delivery.jsx',
  'screens/checkout-payment.html',
  'screens/checkout-payment.jsx',
  'screens/order-success.html',
  'screens/order-success.jsx',
  'screens/account.html',
  'screens/account.jsx',
  // Image picker
  'image-picker/index.html',
  'image-picker/image-picker.jsx',
  'image-picker/ios-frame.jsx',
  'image-picker/photos.js',
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
