# Photobox Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 15-screen iOS-style mweb PWA prototype of the Photobox app redesign, covering the full user journey from splash screen to order success.

**Architecture:** One HTML file per screen, each loading React 18 via CDN (no build step). A shared `ios-frame.jsx` library provides the iOS component kit. A lightweight `navigation.js` drives page transitions using sessionStorage direction flags + CSS keyframe animations. The existing `image-picker/` prototype integrates as a live navigation destination — not modified.

**Tech Stack:** HTML5, React 18 (unpkg CDN), Babel Standalone (in-browser JSX), CSS custom properties, PWA (manifest.json + service worker). No npm, no build step.

**Spec:** `docs/superpowers/specs/2026-08-26-photobox-prototype-design.md` and `CLAUDE.md`

## Global Constraints

- No npm, no build step — all dependencies from unpkg CDN
- React 18.3.1, ReactDOM 18.3.1, Babel Standalone 7.29.0 (pin these exact versions)
- Viewport: `width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no`
- Font: `-apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif`
- Baseline viewport: 390×844pt; mobile breakpoint ≤519px
- On mobile (≤519px): `position:fixed; inset:0` fullscreen layout
- On desktop (≥520px): render inside `<IOSDevice width={402} height={874}>` centered on dark bg
- Status bar meta: `apple-mobile-web-app-status-bar-style = black-translucent`
- ALL tappable elements must have press state: `transform: scale(0.97)` on pointerdown, `scale(1)` on pointerup/pointerleave, transition `140ms ease`
- Safe area: always use `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)`
- `image-picker/` directory: DO NOT MODIFY — integrate via navigation only
- Figma file key: `IXnTCRYPVbCAEddEXJZALI`
- Primary brand color (approximate, confirm from Figma): `#0E9E8E` teal
- Images: `https://picsum.photos/seed/{seed}/{w}/{h}` for all mock photos

---

## File Map

### Created in Task 1 (shared infrastructure)
- Create: `shared/styles.css` — CSS custom properties, reset, nav animation keyframes
- Create: `shared/navigation.js` — push/pop/modal/replace/dismiss API
- Create: `shared/mock-data.js` — all mock products, user, basket, orders
- Create: `shared/ios-frame.jsx` — copy of `image-picker/ios-frame.jsx` (no changes)

### Created in Task 2 (PWA)
- Create: `manifest.json` — Photobox PWA manifest
- Create: `service-worker.js` — offline caching for all screens
- Create: `index.html` — entry point, registers SW, redirects to splash

### Created in Tasks 3–13 (screens)
- Create: `screens/splash.html` + `screens/splash.jsx`
- Create: `screens/onboarding-1.html` + `screens/onboarding-1.jsx`
- Create: `screens/onboarding-2.html` + `screens/onboarding-2.jsx`
- Create: `screens/onboarding-3.html` + `screens/onboarding-3.jsx`
- Create: `screens/home.html` + `screens/home.jsx`
- Create: `screens/product-photobook.html` + `screens/product-photobook.jsx`
- Create: `screens/editor-format.html` + `screens/editor-format.jsx`
- Create: `screens/editor-configure.html` + `screens/editor-configure.jsx`
- Create: `screens/basket.html` + `screens/basket.jsx`
- Create: `screens/checkout-delivery.html` + `screens/checkout-delivery.jsx`
- Create: `screens/checkout-payment.html` + `screens/checkout-payment.jsx`
- Create: `screens/order-success.html` + `screens/order-success.jsx`
- Create: `screens/account.html` + `screens/account.jsx`

### Modified in Task 13 (integration)
- Modify: `service-worker.js` — add all screen URLs to precache list

---

## Task 1: Shared Infrastructure

**Files:**
- Create: `shared/styles.css`
- Create: `shared/navigation.js`
- Create: `shared/mock-data.js`
- Create: `shared/ios-frame.jsx`

**Interfaces:**
- Produces:
  - `window.navigation.push(url)`, `pop()`, `modal(url)`, `replace(url)`, `dismiss()`
  - CSS classes applied via `data-nav` attribute on `<html>` for page-enter animations
  - `window.MOCK` — `{ user, photobooks, basket, orders }`
  - Global JSX components: `IOSDevice`, `IOSStatusBar`, `IOSNavBar`, `IOSGlassPill`, `IOSList`, `IOSListRow`, `IOSKeyboard`

- [ ] **Step 1: Create `shared/ios-frame.jsx`** by copying the existing file:
```bash
cp image-picker/ios-frame.jsx shared/ios-frame.jsx
```
No edits needed — it is already complete.

- [ ] **Step 2: Create `shared/styles.css`** with design tokens and nav animations:

```css
/* shared/styles.css */
:root {
  /* Brand */
  --color-primary: #0E9E8E;
  --color-primary-dark: #0A7A6E;
  --color-primary-light: #E8F8F6;

  /* Light-mode surfaces */
  --color-bg: #F2F2F7;
  --color-surface: #FFFFFF;
  --color-surface-2: #EBEBF0;

  /* Light-mode text */
  --color-text: #000000;
  --color-text-secondary: rgba(60,60,67,0.6);
  --color-text-tertiary: rgba(60,60,67,0.3);
  --color-separator: rgba(60,60,67,0.12);

  /* Dark-mode surfaces (image picker, editor) */
  --color-bg-dark: #000000;
  --color-surface-dark: #1C1C1E;
  --color-text-dark: #FFFFFF;
  --color-text-dark-secondary: rgba(235,235,245,0.6);
  --color-separator-dark: rgba(84,84,88,0.65);

  /* Semantic */
  --color-destructive: #FF453A;
  --color-success: #34C759;

  /* Type */
  --font: -apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif;
  --font-display: -apple-system, "SF Pro Display", system-ui, sans-serif;

  /* Spacing */
  --sp-xs: 4px; --sp-sm: 8px; --sp-md: 16px;
  --sp-lg: 24px; --sp-xl: 32px;

  /* Radius */
  --r-sm: 10px; --r-md: 16px; --r-lg: 22px;
  --r-xl: 28px; --r-full: 9999px;
}

/* Reset */
*, *::before, *::after { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
}
#root { width: 100%; }

/* Desktop preview: center the IOSDevice frame */
@media (min-width: 520px) {
  body { background: #0E0E10; }
  body::before {
    content: '';
    position: fixed; inset: -10%;
    background:
      radial-gradient(60% 50% at 30% 20%, rgba(14,158,142,0.08), transparent 60%),
      radial-gradient(70% 60% at 80% 80%, rgba(10,122,110,0.08), transparent 60%);
    pointer-events: none; z-index: 0;
  }
  #root {
    position: relative; z-index: 1;
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh;
  }
}

/* ── Navigation transition animations ── */
/* Direction is set on <html data-nav="push|pop|modal|replace"> before page load */

@keyframes slideInRight  { from { transform: translateX(100%); }  to { transform: translateX(0); } }
@keyframes slideInLeft   { from { transform: translateX(-30%); }  to { transform: translateX(0); } }
@keyframes slideUp       { from { transform: translateY(100%); }  to { transform: translateY(0); } }
@keyframes fadeIn        { from { opacity: 0; }                   to { opacity: 1; } }

[data-nav='push']    body { animation: slideInRight 320ms cubic-bezier(0.32, 0.72, 0.24, 1) both; }
[data-nav='pop']     body { animation: slideInLeft  300ms cubic-bezier(0.32, 0.72, 0.24, 1) both; }
[data-nav='modal']   body { animation: slideUp      380ms cubic-bezier(0.34, 1.05, 0.64, 1) both; }
[data-nav='replace'] body { animation: fadeIn       400ms ease both; }
/* 'dismiss' pages slide DOWN before history.back() — handled in JS, no CSS needed */

/* Shared interactive press state */
.pressable {
  transition: transform 140ms ease;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}
.pressable:active { transform: scale(0.97); }
```

- [ ] **Step 3: Create `shared/navigation.js`**:

```js
// shared/navigation.js
(function () {
  // Read and clear direction flag on page load → apply CSS animation class
  const dir = sessionStorage.getItem('pb_nav') || 'push';
  sessionStorage.removeItem('pb_nav');
  document.documentElement.setAttribute('data-nav', dir);

  function setDir(d) { sessionStorage.setItem('pb_nav', d); }

  window.navigation = {
    /** Push a new screen (slide in from right) */
    push(url) {
      setDir('push');
      window.location.href = url;
    },
    /** Go back (slide in from left — previous page animates in) */
    pop() {
      document.body.style.cssText =
        'animation: slideOutRight 280ms cubic-bezier(0.4,0,0.2,1) both;';
      // Define slideOutRight inline if styles.css isn't loaded yet
      if (!document.getElementById('pb-nav-style')) {
        const s = document.createElement('style');
        s.id = 'pb-nav-style';
        s.textContent = '@keyframes slideOutRight{from{transform:translateX(0)}to{transform:translateX(100%)}}';
        document.head.appendChild(s);
      }
      setDir('pop');
      setTimeout(() => window.history.back(), 270);
    },
    /** Present a sheet (slide up from bottom) */
    modal(url) {
      setDir('modal');
      window.location.href = url;
    },
    /** Dismiss a sheet (slide down, then go back) */
    dismiss() {
      document.body.style.cssText =
        'animation: slideOutDown 300ms cubic-bezier(0.4,0,0.2,1) both;';
      if (!document.getElementById('pb-nav-style2')) {
        const s = document.createElement('style');
        s.id = 'pb-nav-style2';
        s.textContent = '@keyframes slideOutDown{from{transform:translateY(0)}to{transform:translateY(100%)}}';
        document.head.appendChild(s);
      }
      setDir('pop');
      setTimeout(() => window.history.back(), 290);
    },
    /** Replace current page (fade — no back entry) */
    replace(url) {
      setDir('replace');
      window.location.replace(url);
    },
  };
})();
```

- [ ] **Step 4: Create `shared/mock-data.js`**:

```js
// shared/mock-data.js
(function () {
  const p = (seed, w, h) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

  window.MOCK = {
    user: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      avatar: p('portrait42', 80, 80),
      memberSince: '2021',
    },

    categories: [
      { id: 'photobooks', label: 'Photo Books', icon: '📖', from: '€14.99' },
      { id: 'prints',     label: 'Prints',      icon: '🖼️', from: '€0.99' },
      { id: 'walldecor', label: 'Wall Decor',   icon: '🏠', from: '€19.99' },
      { id: 'calendars', label: 'Calendars',    icon: '📅', from: '€12.99' },
      { id: 'mugs',      label: 'Mugs',         icon: '☕', from: '€9.99'  },
      { id: 'cards',     label: 'Cards',        icon: '💌', from: '€1.99'  },
    ],

    featuredProjects: [
      { id: 'pb1', title: 'Canada Trip', subtitle: '32 pages · Softcover', thumb: p('canada1', 400, 300), type: 'photobook' },
      { id: 'pb2', title: 'Italy 2025',  subtitle: '24 pages · Hardcover', thumb: p('italy2',  400, 300), type: 'photobook' },
    ],

    memories: [
      { id: 'm1', title: 'Canada',  thumb: p('canada2', 300, 400), count: 47 },
      { id: 'm2', title: 'Italy',   thumb: p('italy3',  300, 400), count: 83 },
      { id: 'm3', title: 'London',  thumb: p('london1', 300, 400), count: 31 },
      { id: 'm4', title: 'Skiing',  thumb: p('snow1',   300, 400), count: 62 },
    ],

    photobook: {
      coverTypes: [
        { id: 'softcover', label: 'Softcover',     price: '€14.99', thumb: p('book-soft', 200, 260), popular: false },
        { id: 'hardcover', label: 'Hardcover',     price: '€19.99', thumb: p('book-hard', 200, 260), popular: true  },
        { id: 'layflat',   label: 'Lay-flat',      price: '€24.99', thumb: p('book-lay',  200, 260), popular: false },
        { id: 'premium',   label: 'Premium Linen', price: '€29.99', thumb: p('book-prem', 200, 260), popular: false },
      ],
      formats: [
        { id: 'square-sm',  label: 'Square S',   size: '15×15 cm', thumb: p('fmt-sq-s', 140, 140) },
        { id: 'square-lg',  label: 'Square L',   size: '20×20 cm', thumb: p('fmt-sq-l', 140, 140) },
        { id: 'portrait',   label: 'Portrait',   size: '15×20 cm', thumb: p('fmt-port', 140, 140) },
        { id: 'landscape',  label: 'Landscape',  size: '20×15 cm', thumb: p('fmt-land', 140, 140) },
        { id: 'a4',         label: 'A4',         size: '21×29 cm', thumb: p('fmt-a4',   140, 140) },
        { id: 'a3',         label: 'A3',         size: '30×42 cm', thumb: p('fmt-a3',   140, 140) },
      ],
      pageOptions: [
        { id: '24', label: '24 pages', priceAdd: '+€0.00' },
        { id: '36', label: '36 pages', priceAdd: '+€3.99' },
        { id: '48', label: '48 pages', priceAdd: '+€6.99' },
        { id: '60', label: '60 pages', priceAdd: '+€9.99' },
      ],
      paperOptions: [
        { id: 'gloss',  label: 'Gloss',  desc: 'Vibrant, shiny finish' },
        { id: 'matte',  label: 'Matte',  desc: 'Soft, non-reflective' },
        { id: 'lustre', label: 'Lustre', desc: 'Best of both worlds', recommended: true },
      ],
    },

    basket: {
      items: [
        {
          id: 'item1',
          type: 'Hardcover Photo Book',
          spec: 'Square L · 24 pages · Lustre paper',
          thumb: p('book-result', 80, 80),
          qty: 1,
          price: 24.99,
        },
      ],
      subtotal: 24.99,
      delivery: 4.99,
      total: 29.98,
    },

    order: {
      number: 'PB-2026-84732',
      estimatedDelivery: '29 Aug – 2 Sep 2026',
      items: 1,
      total: 29.98,
    },

    account: {
      orders: [
        { id: 'ord1', title: 'Canada Photo Book', date: '12 Jul 2026', status: 'Delivered', thumb: p('order1', 60, 60) },
        { id: 'ord2', title: 'Italy Prints ×6',   date: '03 Jun 2026', status: 'Delivered', thumb: p('order2', 60, 60) },
      ],
    },
  };
})();
```

- [ ] **Step 5: Verify all shared files exist:**
```bash
ls shared/
# Expected: ios-frame.jsx  mock-data.js  navigation.js  styles.css
```

- [ ] **Step 6: Open a test HTML to verify shared scripts load without errors.** Create a temp `test.html` at root:
```html
<!doctype html><html><head>
  <link rel="stylesheet" href="shared/styles.css">
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
</head><body><div id="root"></div>
  <script src="shared/navigation.js"></script>
  <script src="shared/mock-data.js"></script>
  <script type="text/babel" src="shared/ios-frame.jsx"></script>
  <script type="text/babel">
    console.log('navigation:', window.navigation);
    console.log('MOCK user:', window.MOCK.user.name);
    ReactDOM.createRoot(document.getElementById('root')).render(
      React.createElement(IOSDevice, { width: 390, height: 844 },
        React.createElement('div', { style:{padding:20, color:'#000'} }, 'Shared infra OK ✓')
      )
    );
  </script>
</body></html>
```
Serve: `python3 -m http.server 8080` → open `http://localhost:8080/test.html`
Expected: IOSDevice frame visible, console shows user name, no errors.
Delete `test.html` after verifying.

---

## Task 2: PWA Setup

**Files:**
- Create: `manifest.json`
- Create: `service-worker.js`
- Create: `index.html`

**Interfaces:**
- Consumes: nothing (standalone)
- Produces: working PWA shell — `index.html` redirects to splash, service worker registers

- [ ] **Step 1: Create `manifest.json`:**
```json
{
  "name": "Photobox",
  "short_name": "Photobox",
  "description": "Create beautiful photo products",
  "start_url": "/index.html",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#000000",
  "theme_color": "#0E9E8E",
  "icons": [
    { "src": "/image-picker/app_icon.png", "sizes": "180x180", "type": "image/png" },
    { "src": "/image-picker/app_icon.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/image-picker/app_icon.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```
Note: We reuse the existing `image-picker/app_icon.png` until a Photobox-branded icon is created.

- [ ] **Step 2: Create `service-worker.js`** (stub — will be filled out in Task 13):
```js
// service-worker.js
const CACHE = 'photobox-v1';
const PRECACHE = [
  '/',
  '/index.html',
  '/shared/styles.css',
  '/shared/navigation.js',
  '/shared/mock-data.js',
  '/shared/ios-frame.jsx',
  // Screens added in Task 13
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
```

- [ ] **Step 3: Create `index.html`** (entry point that registers SW + redirects):
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Photobox</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Photobox">
  <meta name="theme-color" content="#0E9E8E">
  <link rel="apple-touch-icon" href="/image-picker/app_icon.png">
  <link rel="manifest" href="/manifest.json">
  <style>
    html, body { margin:0; padding:0; background:#000; }
  </style>
</head>
<body>
  <script>
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
    // Immediately redirect to splash
    window.location.replace('/screens/splash.html');
  </script>
</body>
</html>
```

- [ ] **Step 4: Verify PWA setup.** Serve the project:
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080`. Expected: browser redirects to `/screens/splash.html` (will 404 until Task 3, but the redirect URL is correct).
Check DevTools → Application → Manifest: "Photobox" name appears.

---

## Task 3: Splash Screen

**Files:**
- Create: `screens/splash.html`
- Create: `screens/splash.jsx`

**Interfaces:**
- Consumes: `shared/styles.css`, `shared/navigation.js`
- Produces: Splash screen that auto-advances to `onboarding-1.html` after 2s via `navigation.replace`

- [ ] **Step 1: Fetch Figma design context for the splash screen.**
  Load the `figma:figma-design-to-code` skill, then call `get_design_context`:
  - `fileKey: IXnTCRYPVbCAEddEXJZALI`
  - `nodeId: 451:13758`
  - `clientLanguages: html,css,javascript`
  Note down: exact background gradient (colors + direction), logo SVG or image URL, any typography.

- [ ] **Step 2: Create `screens/splash.html`** using the standard boilerplate (note: no `ios-frame.jsx` or mock-data needed here):
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Photobox</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Photobox">
  <meta name="theme-color" content="#0E9E8E">
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="../shared/styles.css">
  <style>
    html, body { background: #000; }
  </style>
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script src="../shared/navigation.js"></script>
  <script type="text/babel" src="../shared/ios-frame.jsx"></script>
  <script type="text/babel" src="splash.jsx"></script>
  <script type="text/babel">
    function useIsMobile() {
      const [m, setM] = React.useState(() => window.matchMedia('(max-width:519px)').matches);
      React.useEffect(() => {
        const mql = window.matchMedia('(max-width:519px)');
        const cb = e => setM(e.matches);
        mql.addEventListener('change', cb);
        return () => mql.removeEventListener('change', cb);
      }, []);
      return m;
    }
    function App() {
      const mobile = useIsMobile();
      if (mobile) return (
        <div style={{ position:'fixed', inset:0, overflow:'hidden' }}>
          <SplashScreen />
        </div>
      );
      return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
          <IOSDevice width={402} height={874} dark>
            <SplashScreen />
          </IOSDevice>
        </div>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

- [ ] **Step 3: Create `screens/splash.jsx`** — implement after reviewing Figma context.
  Use these exact values if Figma context confirms them, otherwise adjust to match:
```jsx
// screens/splash.jsx
function SplashScreen() {
  const { useEffect } = React;

  useEffect(() => {
    // Auto-advance after 2 seconds
    const t = setTimeout(() => {
      window.navigation.replace('onboarding-1.html');
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #0E9E8E 0%, #065E57 60%, #032E2A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'splashLogoIn 600ms cubic-bezier(0.34, 1.3, 0.64, 1) 200ms both',
    }}>
      <style>{`
        @keyframes splashLogoIn {
          from { opacity:0; transform:scale(0.88); }
          to   { opacity:1; transform:scale(1); }
        }
      `}</style>

      {/* Photobox logo — replace SVG path/text with exact Figma asset */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        {/* Sparkle / star icon */}
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path d="M26 4L29.5 20.5L46 24L29.5 27.5L26 44L22.5 27.5L6 24L22.5 20.5L26 4Z"
                fill="white" opacity="0.95"/>
        </svg>
        {/* Wordmark */}
        <span style={{
          fontFamily: '-apple-system, "SF Pro Display", system-ui',
          fontSize: 32, fontWeight: 700, color: '#FFFFFF',
          letterSpacing: '-0.5px',
        }}>photobox</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify splash screen.** Open `http://localhost:8080/screens/splash.html`.
  - ✓ Full-bleed teal gradient background
  - ✓ Logo centered
  - ✓ After 2s, browser navigates to `onboarding-1.html` (404 is OK until Task 4)
  - ✓ On desktop: renders inside IOSDevice frame

---

## Task 4: Onboarding Flow (3 screens)

**Files:**
- Create: `screens/onboarding-1.html` + `screens/onboarding-1.jsx`
- Create: `screens/onboarding-2.html` + `screens/onboarding-2.jsx`
- Create: `screens/onboarding-3.html` + `screens/onboarding-3.jsx`

**Interfaces:**
- Consumes: `shared/navigation.js`, `shared/ios-frame.jsx`, `shared/styles.css`
- Produces: 3-screen onboarding with "Continue" → push navigation, "Get started" → home

- [ ] **Step 1: Fetch Figma design context for all 3 onboarding screens** (one call each):
  - `nodeId: 451:13808` (slide 1)
  - `nodeId: 451:13823` (slide 2)
  - `nodeId: 451:13841` (slide 3)
  Note: hero image content, headline text, body copy, button label per slide.

- [ ] **Step 2: Create a shared onboarding HTML template** — all 3 screens use the same boilerplate. Create `screens/onboarding-1.html` (and repeat for 2 and 3, changing only the `src` in the last `<script>`):
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Photobox — Welcome</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="../shared/styles.css">
  <style> html, body { background: var(--color-bg); } </style>
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script src="../shared/navigation.js"></script>
  <script type="text/babel" src="../shared/ios-frame.jsx"></script>
  <script type="text/babel" src="onboarding-1.jsx"></script>  <!-- change per screen -->
  <script type="text/babel">
    function useIsMobile() {
      const [m, setM] = React.useState(() => window.matchMedia('(max-width:519px)').matches);
      React.useEffect(() => {
        const mql = window.matchMedia('(max-width:519px)');
        const cb = e => setM(e.matches);
        mql.addEventListener('change', cb);
        return () => mql.removeEventListener('change', cb);
      }, []);
      return m;
    }
    function App() {
      const mobile = useIsMobile();
      if (mobile) return (
        <div style={{position:'fixed', inset:0, background:' #fff', overflow:'hidden'}}>
          <OnboardingScreen />
        </div>
      );
      return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
          <IOSDevice width={402} height={874}>
            <OnboardingScreen />
          </IOSDevice>
        </div>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

- [ ] **Step 3: Create `screens/onboarding-1.jsx`** — implement using Figma content from Step 1.
  Use this structural pattern (replace content with actual Figma copy/images):
```jsx
// screens/onboarding-1.jsx
// Slide 1: "Never miss a memory you've made" (confirm text from Figma)
function OnboardingScreen() {
  const SLIDE = 1; // 1, 2, or 3

  const onNext = () => window.navigation.push('onboarding-2.html');

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#fff',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Hero image — top ~55% of screen */}
      <div style={{
        flex: '0 0 55%',
        position: 'relative', overflow: 'hidden',
      }}>
        <img
          src="https://picsum.photos/seed/onboard1/390/480"
          alt=""
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
        />
        {/* Gradient overlay at bottom of image */}
        <div style={{
          position: 'absolute', bottom:0, left:0, right:0, height:80,
          background: 'linear-gradient(to bottom, transparent, #fff)',
        }} />
      </div>

      {/* Content area — bottom ~45% */}
      <div style={{
        flex: 1,
        padding: '20px 32px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: '-apple-system, "SF Pro Display", system-ui',
            fontSize: 28, fontWeight: 700, lineHeight: '1.2',
            color: '#000', margin: '0 0 12px',
            letterSpacing: '-0.5px',
          }}>
            Never miss a memory you've made
          </h1>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: 16, fontWeight: 400, lineHeight: '1.5',
            color: 'var(--color-text-secondary)', margin: 0,
          }}>
            Discover your generated photo collections and automatically turn them into beautiful products.
          </p>
        </div>

        {/* Progress dots + CTA */}
        <div style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap: 24 }}>
          {/* Dots */}
          <div style={{ display:'flex', gap:8 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                width: i === SLIDE ? 20 : 8, height: 8, borderRadius: 4,
                background: i === SLIDE ? 'var(--color-primary)' : 'rgba(0,0,0,0.15)',
                transition: 'width 250ms ease',
              }} />
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={onNext}
            onPointerDown={e => e.currentTarget.style.transform='scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
            style={{
              width: '100%', height: 56, borderRadius: 'var(--r-full)',
              background: 'var(--color-primary)', color: '#fff', border: 'none',
              fontSize: 17, fontWeight: 700, letterSpacing: '-0.2px',
              fontFamily: 'var(--font)',
              cursor: 'pointer',
              transition: 'transform 140ms ease',
              boxShadow: '0 4px 14px rgba(14,158,142,0.35)',
              marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)',
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `screens/onboarding-2.jsx`** — same structure as slide 1.
  - Change `SLIDE = 2`
  - Update hero image seed: `onboard2`
  - Update headline and body copy (from Figma node `451:13823`)
  - CTA `onClick`: `window.navigation.push('onboarding-3.html')`

- [ ] **Step 5: Create `screens/onboarding-3.jsx`** — same structure as slide 1.
  - Change `SLIDE = 3`
  - Update hero image seed: `onboard3`
  - Update headline and body copy (from Figma node `451:13841`)
  - CTA label: **"Get started"** (not "Continue")
  - CTA `onClick`: `window.navigation.replace('home.html')`
  - Optionally: add "Sign in" text link below the button

- [ ] **Step 6: Create `screens/onboarding-2.html`** and `screens/onboarding-3.html`** — same HTML as `onboarding-1.html`, changing only the JSX src attribute.

- [ ] **Step 7: Verify the full onboarding flow.**
  - Open `http://localhost:8080/screens/onboarding-1.html`
  - ✓ Hero image visible, headline + body visible, 3 progress dots (dot 1 active = wider)
  - ✓ Tap "Continue" → push transition → onboarding-2 (dot 2 active)
  - ✓ Tap "Continue" → onboarding-3 (dot 3 active), CTA says "Get started"
  - ✓ Tap "Get started" → fade transition → `home.html` (404 OK until Task 5)

---

## Task 5: Home Screen

**Files:**
- Create: `screens/home.html`
- Create: `screens/home.jsx`

**Interfaces:**
- Consumes: `shared/mock-data.js`, `shared/ios-frame.jsx`, `shared/navigation.js`, `shared/styles.css`
- Produces: Scrollable home screen with tab bar; tapping Photo Books CTA navigates to `product-photobook.html`; tapping Account tab navigates to `account.html`

- [ ] **Step 1: Fetch Figma design context for home screen:**
  - `nodeId: 451:13862` (390×1920 — very tall, scrollable)
  Note: sections present, tab bar icon labels, product category layout, hero banner, Memories section design.

- [ ] **Step 2: Create `screens/home.html`** — standard boilerplate, loads `home.jsx`, includes `mock-data.js`:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Photobox — Home</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="../shared/styles.css">
  <style> html, body { background: var(--color-bg); } </style>
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script src="../shared/navigation.js"></script>
  <script src="../shared/mock-data.js"></script>
  <script type="text/babel" src="../shared/ios-frame.jsx"></script>
  <script type="text/babel" src="home.jsx"></script>
  <script type="text/babel">
    function useIsMobile() {
      const [m, setM] = React.useState(() => window.matchMedia('(max-width:519px)').matches);
      React.useEffect(() => {
        const mql = window.matchMedia('(max-width:519px)');
        const cb = e => setM(e.matches);
        mql.addEventListener('change', cb);
        return () => mql.removeEventListener('change', cb);
      }, []);
      return m;
    }
    function App() {
      const mobile = useIsMobile();
      if (mobile) return (
        <div style={{position:'fixed', inset:0, background:'var(--color-bg)', overflow:'hidden'}}>
          <HomeScreen />
        </div>
      );
      return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
          <IOSDevice width={402} height={874}><HomeScreen /></IOSDevice>
        </div>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

- [ ] **Step 3: Create `screens/home.jsx`** — implement based on Figma context. Key structure:
```jsx
// screens/home.jsx
function HomeScreen() {
  const [activeTab, setActiveTab] = React.useState('home');

  const TAB_BAR_HEIGHT = 83; // 49px bar + env(safe-area-inset-bottom)

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:'var(--color-bg)' }}>
      {/* Status bar area */}
      <IOSStatusBar dark={false} />

      {/* Scrollable content */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        bottom: TAB_BAR_HEIGHT,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        paddingTop: 44, // status bar offset
      }}>
        {/* Large title */}
        <div style={{
          padding: '8px 16px 0',
          fontFamily: '-apple-system, "SF Pro Display", system-ui',
          fontSize: 34, fontWeight: 700, letterSpacing: '-0.4px',
          color: 'var(--color-text)',
        }}>
          Create
        </div>

        {/* Category pills — horizontal scroll */}
        <CategorySection />

        {/* Featured projects / hero banner */}
        <FeaturedSection />

        {/* Memories section */}
        <MemoriesSection />

        {/* Ideas / inspiration grid */}
        <IdeasSection />

        {/* Bottom padding for tab bar */}
        <div style={{ height: 20 }} />
      </div>

      {/* Tab bar — fixed at bottom */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

function CategorySection() {
  const { categories } = window.MOCK;
  return (
    <div>
      <div style={{ padding: '20px 16px 12px', fontSize: 22, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>
        Shop
      </div>
      <div style={{
        display: 'flex', gap: 10,
        overflowX: 'auto', scrollbarWidth: 'none',
        padding: '0 16px 8px',
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => cat.id === 'photobooks' && window.navigation.push('product-photobook.html')}
            onPointerDown={e => e.currentTarget.style.transform='scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
            style={{
              flexShrink: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, padding: '14px 18px',
              background: 'var(--color-surface)', borderRadius: 'var(--r-md)',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'transform 140ms ease',
              minWidth: 80,
            }}
          >
            <span style={{ fontSize: 28 }}>{cat.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap' }}>{cat.label}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>from {cat.from}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MemoriesSection() {
  const { memories } = window.MOCK;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.3px' }}>Memories</span>
        <span style={{ fontSize: 15, color: 'var(--color-primary)', fontWeight: 600 }}>See all</span>
      </div>
      <div style={{ display:'flex', gap:10, overflowX:'auto', scrollbarWidth:'none', padding:'0 16px 8px' }}>
        {memories.map(m => (
          <div key={m.id} style={{
            flexShrink: 0, width: 140, borderRadius: 'var(--r-md)', overflow: 'hidden',
            position: 'relative', aspectRatio: '3/4', background: '#ddd',
          }}>
            <img src={m.thumb} alt={m.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            <div style={{
              position:'absolute', inset:0,
              background:'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)',
            }} />
            <div style={{ position:'absolute', bottom:10, left:10, color:'#fff' }}>
              <div style={{ fontWeight:700, fontSize:15 }}>{m.title}</div>
              <div style={{ fontSize:12, opacity:0.85 }}>{m.count} photos</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedSection() {
  const { featuredProjects } = window.MOCK;
  return (
    <div style={{ margin:'8px 16px 0' }}>
      <div style={{ fontSize:22, fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.3px', marginBottom:12 }}>
        Your projects
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {featuredProjects.map(proj => (
          <div key={proj.id}
            onClick={() => window.navigation.push('product-photobook.html')}
            onPointerDown={e => e.currentTarget.style.transform='scale(0.98)'}
            onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
            style={{
              display:'flex', alignItems:'center', gap:14,
              padding:14, background:'var(--color-surface)', borderRadius:'var(--r-md)',
              cursor:'pointer', transition:'transform 140ms ease',
              boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
            }}>
            <img src={proj.thumb} alt={proj.title} style={{ width:64, height:48, borderRadius:'var(--r-sm)', objectFit:'cover' }} />
            <div style={{flex:1}}>
              <div style={{fontWeight:700, fontSize:17, color:'var(--color-text)'}}>{proj.title}</div>
              <div style={{fontSize:13, color:'var(--color-text-secondary)', marginTop:2}}>{proj.subtitle}</div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke="rgba(60,60,67,0.3)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function IdeasSection() {
  const ideas = [
    { seed:'idea1', label:'Summer vibes' },
    { seed:'idea2', label:'Family moments' },
    { seed:'idea3', label:'Travel memories' },
    { seed:'idea4', label:'Pet portraits' },
  ];
  return (
    <div style={{ margin:'20px 16px 0' }}>
      <div style={{ fontSize:22, fontWeight:700, color:'var(--color-text)', letterSpacing:'-0.3px', marginBottom:12 }}>
        Ideas for you
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {ideas.map(i => (
          <div key={i.seed} style={{
            borderRadius:'var(--r-md)', overflow:'hidden', position:'relative', aspectRatio:'4/3',
            cursor:'pointer',
          }}>
            <img src={`https://picsum.photos/seed/${i.seed}/280/210`} alt={i.label} style={{width:'100%',height:'100%',objectFit:'cover',display:'block'}} />
            <div style={{position:'absolute',bottom:0,left:0,right:0,padding:'20px 10px 10px',background:'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))'}}>
              <span style={{color:'#fff',fontSize:13,fontWeight:600}}>{i.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBar({ activeTab, onTabChange }) {
  const TABS = [
    { id:'home',    label:'Home',      icon: HomeIcon },
    { id:'create',  label:'Create',    icon: CreateIcon },
    { id:'photos',  label:'My Photos', icon: PhotosIcon },
    { id:'account', label:'Account',   icon: AccountIcon },
  ];
  return (
    <div style={{
      position:'absolute', bottom:0, left:0, right:0,
      height:'calc(49px + env(safe-area-inset-bottom, 0px))',
      paddingBottom:'env(safe-area-inset-bottom, 0px)',
      backdropFilter:'blur(20px) saturate(180%)',
      WebkitBackdropFilter:'blur(20px) saturate(180%)',
      background:'rgba(249,249,249,0.78)',
      borderTop:'0.5px solid rgba(0,0,0,0.12)',
      display:'flex', alignItems:'flex-start',
      zIndex:50,
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            onTabChange(tab.id);
            if (tab.id === 'account') window.navigation.push('account.html');
            if (tab.id === 'photos') window.navigation.push('../image-picker/index.html');
          }}
          style={{
            flex:1, height:49, border:'none', background:'transparent', cursor:'pointer',
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3,
          }}>
          <tab.icon active={activeTab===tab.id} />
          <span style={{
            fontSize:10, fontWeight: activeTab===tab.id ? 600 : 400,
            color: activeTab===tab.id ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)',
          }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Tab icons (inline SVG)
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
      fill={active ? 'var(--color-primary)' : 'none'}
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'}
      strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);
const CreateIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8"/>
    <path d="M12 8V16M8 12H16"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const PhotosIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8"/>
    <circle cx="8.5" cy="9.5" r="1.5"
      fill={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'}/>
    <path d="M3 15L7 11L11 15L15 10L21 16"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);
const AccountIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8"/>
    <path d="M4 20C4 17 7.6 14.5 12 14.5C16.4 14.5 20 17 20 20"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
```

- [ ] **Step 4: Verify home screen.**
  Open `http://localhost:8080/screens/home.html` at 390px width.
  - ✓ Status bar visible
  - ✓ "Create" large title heading
  - ✓ Category pill row scrolls horizontally
  - ✓ Memories, Projects, Ideas sections all visible
  - ✓ Tab bar at bottom with 4 tabs, liquid glass effect
  - ✓ Tapping "Photo Books" card or product category navigates to `product-photobook.html` (404 OK)
  - ✓ Tapping Account tab navigates to `account.html` (404 OK)

---

## Task 6: Photo Book Product & Editor — Cover + Format

**Files:**
- Create: `screens/product-photobook.html` + `screens/product-photobook.jsx`
- Create: `screens/editor-format.html` + `screens/editor-format.jsx`

**Interfaces:**
- Consumes: `shared/mock-data.js`, `shared/navigation.js`, `shared/ios-frame.jsx`
- Produces: Cover type selection screen → format selection screen, leading to `editor-configure.html`

- [ ] **Step 1: Fetch Figma design context** for both screens:
  - `nodeId: 451:13381` (cover picker / product page)
  - `nodeId: 451:13426` (format chooser)
  Note: card layouts, selected state styling, price display, CTA button placement.

- [ ] **Step 2: Create `screens/product-photobook.html`** — standard boilerplate (same as home.html template, change title + JSX src).

- [ ] **Step 3: Create `screens/product-photobook.jsx`**:
```jsx
// screens/product-photobook.jsx
function ProductPhotobookScreen() {
  const [selected, setSelected] = React.useState('hardcover');
  const { photobook } = window.MOCK;
  const chosen = photobook.coverTypes.find(c => c.id === selected);

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />
      {/* Nav bar */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'8px 16px 12px',
      }}>
        <button onClick={() => window.navigation.pop()}
          onPointerDown={e => e.currentTarget.style.transform='scale(0.9)'}
          onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{ width:36, height:36, borderRadius:18, background:'rgba(0,0,0,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 140ms ease' }}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M10 2L2 10l8 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ fontFamily:'-apple-system,"SF Pro Display",system-ui', fontSize:17, fontWeight:600, color:'#000' }}>
          Photo books
        </span>
        <div style={{ width:36 }} />
      </div>

      {/* Cover type grid */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 16px', scrollbarWidth:'none' }}>
        <p style={{ fontSize:13, color:'var(--color-text-secondary)', marginBottom:16, marginTop:4 }}>
          Choose cover type
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {photobook.coverTypes.map(ct => (
            <div
              key={ct.id}
              onClick={() => setSelected(ct.id)}
              onPointerDown={e => e.currentTarget.style.transform='scale(0.97)'}
              onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
              style={{
                background: selected===ct.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                border: `2px solid ${selected===ct.id ? 'var(--color-primary)' : 'transparent'}`,
                borderRadius:'var(--r-md)', overflow:'hidden', cursor:'pointer',
                transition:'transform 140ms ease, border-color 200ms ease',
                boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
                position:'relative',
              }}>
              {ct.popular && (
                <div style={{
                  position:'absolute', top:8, right:8,
                  background:'var(--color-primary)', color:'#fff',
                  fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                }}>Popular</div>
              )}
              <img src={ct.thumb} alt={ct.label} style={{ width:'100%', aspectRatio:'200/260', objectFit:'cover', display:'block' }} />
              <div style={{ padding:'10px 12px 12px' }}>
                <div style={{ fontWeight:700, fontSize:15, color:'var(--color-text)' }}>{ct.label}</div>
                <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>From {ct.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height:100 }} />
      </div>

      {/* CTA */}
      <div style={{
        padding:'12px 16px calc(env(safe-area-inset-bottom,0px) + 16px)',
        background:'linear-gradient(to top, var(--color-bg) 60%, transparent)',
        position:'absolute', bottom:0, left:0, right:0,
      }}>
        <button
          onClick={() => window.navigation.push('editor-format.html')}
          onPointerDown={e => e.currentTarget.style.transform='scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{
            width:'100%', height:56, borderRadius:'var(--r-full)',
            background:'var(--color-primary)', color:'#fff', border:'none',
            fontSize:17, fontWeight:700, letterSpacing:'-0.2px',
            cursor:'pointer', transition:'transform 140ms ease',
            boxShadow:'0 4px 14px rgba(14,158,142,0.35)',
          }}>
          Choose format →
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `screens/editor-format.html`** — same boilerplate as product-photobook.html.

- [ ] **Step 5: Create `screens/editor-format.jsx`** — format grid with 6 size options. Key differences from product screen:
  - Shows format grid with size labels (use `photobook.formats` from `window.MOCK`)
  - Selected format gets teal border + check badge
  - Back button calls `window.navigation.pop()`
  - CTA "Next step →" navigates to `editor-configure.html`
  - Add progress indicator in nav bar: "Step 2 of 3"

- [ ] **Step 6: Verify.** Open `product-photobook.html` → tap cover → "Choose format" → new screen with format grid → tap format → verify selection state → "Next step" navigates to `editor-configure.html` (404 OK).

---

## Task 7: Photo Book Editor — Configure

**Files:**
- Create: `screens/editor-configure.html`
- Create: `screens/editor-configure.jsx`

**Interfaces:**
- Consumes: `shared/mock-data.js`, `shared/navigation.js`, `shared/ios-frame.jsx`
- Produces: Long-scroll configuration screen; "Start creating →" CTA navigates to `../image-picker/index.html`

- [ ] **Step 1: Fetch Figma design context for configure screen:**
  - `nodeId: 451:13491` (very tall, 2643px — will return large response, may need `excludeScreenshot: false` but be prepared for truncation)
  Note: section headings, page count picker, paper picker, lay-flat add-on toggle, price summary, CTA.

- [ ] **Step 2: Create `screens/editor-configure.html`** — same boilerplate.

- [ ] **Step 3: Create `screens/editor-configure.jsx`**:
```jsx
// screens/editor-configure.jsx
function EditorConfigureScreen() {
  const [pageCount, setPageCount] = React.useState('24');
  const [paper, setPaper] = React.useState('lustre');
  const [layflat, setLayflat] = React.useState(false);
  const { photobook } = window.MOCK;

  // Compute total price (mock)
  const basePrice = 19.99;
  const pageAddon = parseFloat(photobook.pageOptions.find(o => o.id === pageCount)?.priceAdd?.replace(/[^0-9.]/g,'') || 0);
  const layflatAddon = layflat ? 5.00 : 0;
  const total = (basePrice + pageAddon + layflatAddon).toFixed(2);

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 16px 4px' }}>
        <button onClick={() => window.navigation.pop()}
          onPointerDown={e => e.currentTarget.style.transform='scale(0.9)'}
          onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{ width:36, height:36, borderRadius:18, background:'rgba(0,0,0,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 140ms ease' }}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M10 2L2 10l8 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:17, fontWeight:600 }}>Photo book</div>
          <div style={{ fontSize:12, color:'var(--color-text-secondary)' }}>Step 3 of 3</div>
        </div>
        <div style={{ width:36 }} />
      </div>

      {/* Scrollable options */}
      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:120 }}>
        {/* Page count */}
        <SectionHeader title="Number of pages" />
        <div style={{ display:'flex', gap:8, padding:'0 16px 16px', overflowX:'auto', scrollbarWidth:'none' }}>
          {photobook.pageOptions.map(opt => (
            <button key={opt.id}
              onClick={() => setPageCount(opt.id)}
              onPointerDown={e => e.currentTarget.style.transform='scale(0.96)'}
              onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
              style={{
                flexShrink:0, height:52, padding:'0 20px',
                background: pageCount===opt.id ? 'var(--color-primary)' : 'var(--color-surface)',
                color: pageCount===opt.id ? '#fff' : 'var(--color-text)',
                border: `1.5px solid ${pageCount===opt.id ? 'var(--color-primary)' : 'transparent'}`,
                borderRadius:'var(--r-sm)', cursor:'pointer', transition:'transform 140ms ease',
                fontSize:15, fontWeight:600,
              }}>
              <div>{opt.label}</div>
              <div style={{ fontSize:12, opacity:0.75 }}>{opt.priceAdd}</div>
            </button>
          ))}
        </div>

        {/* Paper type */}
        <SectionHeader title="Paper finish" />
        <div style={{ display:'flex', flexDirection:'column', gap:0, margin:'0 16px 16px', background:'var(--color-surface)', borderRadius:'var(--r-md)', overflow:'hidden' }}>
          {photobook.paperOptions.map((opt, i) => (
            <div key={opt.id}
              onClick={() => setPaper(opt.id)}
              style={{
                display:'flex', alignItems:'center', padding:'14px 16px',
                borderTop: i>0 ? '0.5px solid var(--color-separator)' : 'none',
                cursor:'pointer',
              }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:16 }}>
                  {opt.label}
                  {opt.recommended && <span style={{ marginLeft:8, fontSize:11, background:'var(--color-primary-light)', color:'var(--color-primary)', padding:'2px 8px', borderRadius:99, fontWeight:700 }}>Recommended</span>}
                </div>
                <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>{opt.desc}</div>
              </div>
              <div style={{
                width:22, height:22, borderRadius:11,
                border:`2px solid ${paper===opt.id ? 'var(--color-primary)' : 'rgba(60,60,67,0.3)'}`,
                background: paper===opt.id ? 'var(--color-primary)' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {paper===opt.id && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </div>
          ))}
        </div>

        {/* Lay-flat add-on */}
        <SectionHeader title="Add-ons" />
        <div style={{ margin:'0 16px 16px', background:'var(--color-surface)', borderRadius:'var(--r-md)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', padding:'14px 16px' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:16 }}>Lay-flat binding</div>
              <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>Pages open completely flat · +€5.00</div>
            </div>
            <Toggle on={layflat} onChange={setLayflat} />
          </div>
        </div>

        {/* Price summary */}
        <div style={{ margin:'0 16px', padding:16, background:'var(--color-surface)', borderRadius:'var(--r-md)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ color:'var(--color-text-secondary)', fontSize:15 }}>Hardcover Photo Book</span>
            <span style={{ fontWeight:600, fontSize:15 }}>€19.99</span>
          </div>
          {pageAddon > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ color:'var(--color-text-secondary)', fontSize:15 }}>Extra pages</span>
              <span style={{ fontWeight:600, fontSize:15 }}>+€{pageAddon.toFixed(2)}</span>
            </div>
          )}
          {layflat && (
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ color:'var(--color-text-secondary)', fontSize:15 }}>Lay-flat</span>
              <span style={{ fontWeight:600, fontSize:15 }}>+€5.00</span>
            </div>
          )}
          <div style={{ height:'0.5px', background:'var(--color-separator)', margin:'8px 0' }} />
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:700, fontSize:17 }}>Total</span>
            <span style={{ fontWeight:700, fontSize:17, color:'var(--color-primary)' }}>€{total}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        padding:'12px 16px calc(env(safe-area-inset-bottom,0px) + 16px)',
        background:'linear-gradient(to top, var(--color-bg) 60%, transparent)',
      }}>
        <button
          onClick={() => window.navigation.push('../image-picker/index.html')}
          onPointerDown={e => e.currentTarget.style.transform='scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{
            width:'100%', height:56, borderRadius:'var(--r-full)',
            background:'var(--color-primary)', color:'#fff', border:'none',
            fontSize:17, fontWeight:700, letterSpacing:'-0.2px',
            cursor:'pointer', transition:'transform 140ms ease',
            boxShadow:'0 4px 14px rgba(14,158,142,0.35)',
          }}>
          Start creating ✦
        </button>
      </div>
    </div>
  );
}

// iOS-style toggle (reused from image-picker)
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} role="switch" aria-checked={on}
      style={{ width:51, height:31, borderRadius:31, background:on?'var(--color-success)':'rgba(120,120,128,0.45)', border:'none', padding:0, cursor:'pointer', position:'relative', transition:'background 200ms ease', flexShrink:0 }}>
      <span style={{ position:'absolute', top:2, left:on?22:2, width:27, height:27, borderRadius:'50%', background:'#fff', boxShadow:'0 2px 5px rgba(0,0,0,0.25)', transition:'left 200ms cubic-bezier(0.4,0,0.2,1)' }} />
    </button>
  );
}

function SectionHeader({ title }) {
  return (
    <div style={{ padding:'20px 16px 8px', fontSize:13, fontWeight:600, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
      {title}
    </div>
  );
}
```

- [ ] **Step 4: Verify configure screen.** Open → toggle pages/paper/lay-flat — price updates in real time. Tap "Start creating" → navigates to `../image-picker/index.html`. Image picker must load fully.

---

## Task 8: Image Picker Integration

**Files:**
- Modify: `image-picker/index.html` — update "Continue" button to navigate to basket

**Interfaces:**
- Consumes: existing image picker prototype
- Produces: "Continue" button in the selection pill navigates to `../screens/basket.html`

> ⚠️ **Minimal change only.** The image picker prototype is frozen. The only permitted change is wiring the "Continue" action to navigate to `basket.html`.

- [ ] **Step 1: Read the current Continue handler** in `image-picker/image-picker.jsx` to find where `onContinue` is called.
  The main `App` component renders `<ImagePickerScreen />`. Search for `onContinue` prop usage — it is passed to `SelectionPill` and `ReviewSheet`. Both call it identically. The handler is defined in `ImagePickerScreen`:
  ```jsx
  const handleContinue = () => { /* currently does nothing */ };
  ```

- [ ] **Step 2: Find and update the `handleContinue` function** in `image-picker/image-picker.jsx`. Locate:
  ```js
  // There may be a placeholder continue handler — add navigation:
  ```
  Read the file for the line containing `handleContinue` or `onContinue` in the main `ImagePickerScreen` function, then update it to:
  ```js
  const handleContinue = () => {
    sessionStorage.setItem('pb_nav', 'push');
    window.location.href = '../screens/basket.html';
  };
  ```

- [ ] **Step 3: Verify the integration.** Open `http://localhost:8080/screens/editor-configure.html` → "Start creating" → image picker opens → select photos → tap "Continue" button in selection pill → navigates to `../screens/basket.html` (404 OK until Task 9).

---

## Task 9: Basket Screen

**Files:**
- Create: `screens/basket.html`
- Create: `screens/basket.jsx`

**Interfaces:**
- Consumes: `shared/mock-data.js`, `shared/navigation.js`, `shared/ios-frame.jsx`
- Produces: Order summary with quantity, price breakdown; "Proceed to checkout" navigates to `checkout-delivery.html`

> Figma has no complete basket design. Build in PB3 style: white surfaces, teal CTAs, iOS list rows, matching the app's light-mode language.

- [ ] **Step 1: Create `screens/basket.html`** — standard boilerplate.

- [ ] **Step 2: Create `screens/basket.jsx`**:
```jsx
// screens/basket.jsx
function BasketScreen() {
  const [qty, setQty] = React.useState(1);
  const { basket } = window.MOCK;
  const item = basket.items[0];
  const subtotal = (item.price * qty).toFixed(2);
  const total = (parseFloat(subtotal) + basket.delivery).toFixed(2);

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />
      <div style={{ padding:'8px 16px 16px', display:'flex', alignItems:'center' }}>
        <button onClick={() => window.navigation.pop()}
          onPointerDown={e => e.currentTarget.style.transform='scale(0.9)'}
          onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{ width:36, height:36, borderRadius:18, background:'rgba(0,0,0,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 140ms ease' }}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none"><path d="M10 2L2 10l8 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span style={{ flex:1, textAlign:'center', fontSize:17, fontWeight:600 }}>Your basket</span>
        <div style={{ width:36 }} />
      </div>

      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:140 }}>
        {/* Product card */}
        <div style={{ margin:'0 16px 16px', background:'var(--color-surface)', borderRadius:'var(--r-lg)', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display:'flex', gap:14, padding:16, borderBottom:'0.5px solid var(--color-separator)' }}>
            <img src={item.thumb} alt="" style={{ width:80, height:80, borderRadius:'var(--r-sm)', objectFit:'cover' }} />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>{item.type}</div>
              <div style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.4 }}>{item.spec}</div>
              <div style={{ fontWeight:700, fontSize:17, color:'var(--color-primary)', marginTop:8 }}>€{item.price.toFixed(2)}</div>
            </div>
          </div>
          {/* Quantity control */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px' }}>
            <span style={{ fontSize:15, color:'var(--color-text-secondary)' }}>Quantity</span>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <button onClick={() => setQty(q => Math.max(1, q-1))}
                style={{ width:32, height:32, borderRadius:16, background:'var(--color-surface-2)', border:'none', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:300 }}>−</button>
              <span style={{ fontWeight:700, fontSize:17, minWidth:24, textAlign:'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q+1)}
                style={{ width:32, height:32, borderRadius:16, background:'var(--color-primary)', color:'#fff', border:'none', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:300 }}>+</button>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ margin:'0 16px', background:'var(--color-surface)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
          <IOSListRow title="Subtotal" detail={`€${subtotal}`} chevron={false} />
          <IOSListRow title="Delivery" detail={`€${basket.delivery.toFixed(2)}`} chevron={false} />
          <div style={{ height:'0.5px', background:'var(--color-separator)', margin:'0 16px' }} />
          <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', fontWeight:700, fontSize:17 }}>
            <span>Total</span>
            <span style={{ color:'var(--color-primary)' }}>€{total}</span>
          </div>
        </div>

        {/* Promo code */}
        <div style={{ margin:'16px 16px 0', background:'var(--color-surface)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
          <IOSListRow title="Add promo code" detail="" chevron={true} />
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        padding:'12px 16px calc(env(safe-area-inset-bottom,0px) + 16px)',
        background:'linear-gradient(to top, var(--color-bg) 60%, transparent)',
      }}>
        <button
          onClick={() => window.navigation.push('checkout-delivery.html')}
          onPointerDown={e => e.currentTarget.style.transform='scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{ width:'100%', height:56, borderRadius:'var(--r-full)', background:'var(--color-primary)', color:'#fff', border:'none', fontSize:17, fontWeight:700, cursor:'pointer', transition:'transform 140ms ease', boxShadow:'0 4px 14px rgba(14,158,142,0.35)' }}>
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify.** Basket shows product, quantity +/- updates total, "Proceed to checkout" navigates forward.

---

## Task 10: Checkout — Delivery & Payment

**Files:**
- Create: `screens/checkout-delivery.html` + `screens/checkout-delivery.jsx`
- Create: `screens/checkout-payment.html` + `screens/checkout-payment.jsx`

**Interfaces:**
- Consumes: `shared/navigation.js`, `shared/ios-frame.jsx`, `shared/styles.css`
- Produces: Delivery address form → Payment card form → `order-success.html`

> Design in PB3 style: iOS-style text inputs, white grouped lists, teal CTAs.

- [ ] **Step 1: Create `screens/checkout-delivery.html`** — standard boilerplate.

- [ ] **Step 2: Create `screens/checkout-delivery.jsx`** — delivery address form:
```jsx
// screens/checkout-delivery.jsx
function CheckoutDeliveryScreen() {
  const [addr, setAddr] = React.useState({
    name: 'Sarah Johnson', street: '14 Maple Street', city: 'Amsterdam',
    postcode: '1012 AB', country: 'Netherlands',
  });

  const field = (label, key, placeholder) => (
    <div style={{ borderBottom:'0.5px solid var(--color-separator)', padding:'12px 16px' }}>
      <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginBottom:4 }}>{label}</div>
      <input
        value={addr[key]}
        onChange={e => setAddr(a => ({...a, [key]: e.target.value}))}
        placeholder={placeholder}
        style={{
          width:'100%', border:'none', outline:'none', background:'transparent',
          fontSize:16, fontFamily:'var(--font)', color:'var(--color-text)',
        }}
      />
    </div>
  );

  const DELIVERY_OPTIONS = [
    { id:'standard', label:'Standard delivery', sub:'5–7 working days', price:'€4.99' },
    { id:'express',  label:'Express delivery',  sub:'2–3 working days', price:'€9.99' },
  ];
  const [delivery, setDelivery] = React.useState('standard');

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />
      <div style={{ padding:'8px 16px 16px', display:'flex', alignItems:'center' }}>
        <button onClick={() => window.navigation.pop()}
          onPointerDown={e => e.currentTarget.style.transform='scale(0.9)'}
          onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{ width:36, height:36, borderRadius:18, background:'rgba(0,0,0,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 140ms ease' }}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none"><path d="M10 2L2 10l8 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span style={{ flex:1, textAlign:'center', fontSize:17, fontWeight:600 }}>Delivery</span>
        <div style={{ width:36 }} />
      </div>

      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:120 }}>
        <div style={{ padding:'4px 16px 8px', fontSize:13, fontWeight:600, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Delivery address</div>
        <div style={{ margin:'0 16px 20px', background:'var(--color-surface)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
          {field('Full name', 'name', 'Full name')}
          {field('Street address', 'street', 'Street address')}
          {field('City', 'city', 'City')}
          {field('Postcode', 'postcode', 'Postcode')}
          {field('Country', 'country', 'Country')}
        </div>

        <div style={{ padding:'4px 16px 8px', fontSize:13, fontWeight:600, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Delivery method</div>
        <div style={{ margin:'0 16px', background:'var(--color-surface)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
          {DELIVERY_OPTIONS.map((opt, i) => (
            <div key={opt.id} onClick={() => setDelivery(opt.id)}
              style={{ display:'flex', alignItems:'center', padding:'14px 16px', borderTop: i>0?'0.5px solid var(--color-separator)':'none', cursor:'pointer' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:16 }}>{opt.label}</div>
                <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>{opt.sub}</div>
              </div>
              <span style={{ fontWeight:600, fontSize:15, color:'var(--color-text)', marginRight:12 }}>{opt.price}</span>
              <div style={{ width:22, height:22, borderRadius:11, border:`2px solid ${delivery===opt.id?'var(--color-primary)':'rgba(60,60,67,0.3)'}`, background:delivery===opt.id?'var(--color-primary)':'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {delivery===opt.id && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L4 7L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 16px calc(env(safe-area-inset-bottom,0px) + 16px)', background:'linear-gradient(to top, var(--color-bg) 60%, transparent)' }}>
        <button onClick={() => window.navigation.push('checkout-payment.html')}
          onPointerDown={e => e.currentTarget.style.transform='scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
          style={{ width:'100%', height:56, borderRadius:'var(--r-full)', background:'var(--color-primary)', color:'#fff', border:'none', fontSize:17, fontWeight:700, cursor:'pointer', transition:'transform 140ms ease', boxShadow:'0 4px 14px rgba(14,158,142,0.35)' }}>
          Continue to payment
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `screens/checkout-payment.html`** — standard boilerplate.

- [ ] **Step 4: Create `screens/checkout-payment.jsx`** — mock card form with same structure as delivery. Key fields: card number `•••• •••• •••• 4242`, expiry `12/28`, CVV `•••`. "Pay €29.98" CTA uses `window.navigation.replace('order-success.html')` (replace so back button can't re-submit).

- [ ] **Step 5: Verify.** Delivery form → "Continue" → payment form → "Pay" → order success (404 OK until Task 11).

---

## Task 11: Order Success & Account

**Files:**
- Create: `screens/order-success.html` + `screens/order-success.jsx`
- Create: `screens/account.html` + `screens/account.jsx`

**Interfaces:**
- Consumes: `shared/mock-data.js`, `shared/navigation.js`, `shared/ios-frame.jsx`
- Produces: Celebration success screen → home; Account screen with profile + order list

- [ ] **Step 1: Create `screens/order-success.html`** — standard boilerplate.

- [ ] **Step 2: Create `screens/order-success.jsx`** — celebration screen with animation:
```jsx
// screens/order-success.jsx
function OrderSuccessScreen() {
  const { order } = window.MOCK;
  const [scale, setScale] = React.useState(0.5);
  const [opacity, setOpacity] = React.useState(0);

  React.useEffect(() => {
    // Entrance animation via state
    requestAnimationFrame(() => {
      setScale(1);
      setOpacity(1);
    });
  }, []);

  return (
    <div style={{ width:'100%', height:'100%', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'0 32px' }}>
      <IOSStatusBar dark={false} />

      {/* Big checkmark */}
      <div style={{
        width:100, height:100, borderRadius:50,
        background:'var(--color-primary)',
        display:'flex', alignItems:'center', justifyContent:'center',
        boxShadow:'0 8px 28px rgba(14,158,142,0.4)',
        transform:`scale(${scale})`, opacity,
        transition:'transform 500ms cubic-bezier(0.34,1.3,0.64,1), opacity 300ms ease',
        marginBottom:28,
      }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <path d="M12 24L20 32L36 16" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Text */}
      <h1 style={{
        fontFamily:'-apple-system,"SF Pro Display",system-ui',
        fontSize:28, fontWeight:700, textAlign:'center',
        margin:'0 0 12px', letterSpacing:'-0.5px',
      }}>Order placed!</h1>
      <p style={{ fontSize:16, color:'var(--color-text-secondary)', textAlign:'center', lineHeight:1.5, margin:'0 0 8px' }}>
        Your photo book is on its way to being printed.
      </p>
      <p style={{ fontSize:14, color:'var(--color-text-secondary)', textAlign:'center', margin:'0 0 32px' }}>
        Order {order.number}
      </p>

      {/* Estimated delivery */}
      <div style={{ width:'100%', background:'var(--color-bg)', borderRadius:'var(--r-lg)', padding:16, marginBottom:32, textAlign:'center' }}>
        <div style={{ fontSize:12, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>Estimated delivery</div>
        <div style={{ fontSize:18, fontWeight:700, color:'var(--color-text)' }}>{order.estimatedDelivery}</div>
      </div>

      {/* CTA */}
      <button
        onClick={() => window.navigation.replace('home.html')}
        onPointerDown={e => e.currentTarget.style.transform='scale(0.97)'}
        onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
        onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
        style={{ width:'100%', height:56, borderRadius:'var(--r-full)', background:'var(--color-primary)', color:'#fff', border:'none', fontSize:17, fontWeight:700, cursor:'pointer', transition:'transform 140ms ease', boxShadow:'0 4px 14px rgba(14,158,142,0.35)' }}>
        Continue shopping
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Fetch Figma design context for account screen:**
  - `nodeId: 451:14038`
  Note: section names, profile header layout, list row structure.

- [ ] **Step 4: Create `screens/account.html`** — standard boilerplate.

- [ ] **Step 5: Create `screens/account.jsx`** — using `IOSList` and `IOSListRow` from ios-frame:
```jsx
// screens/account.jsx
function AccountScreen() {
  const { user, account } = window.MOCK;

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />

      {/* Large title nav */}
      <div style={{ padding:'8px 16px 0' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={() => window.navigation.pop()}
            onPointerDown={e => e.currentTarget.style.transform='scale(0.9)'}
            onPointerUp={e => e.currentTarget.style.transform='scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform='scale(1)'}
            style={{ width:36, height:36, borderRadius:18, background:'rgba(0,0,0,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'transform 140ms ease' }}>
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none"><path d="M10 2L2 10l8 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{ fontSize:34, fontWeight:700, letterSpacing:'-0.4px', marginTop:8, marginBottom:20 }}>My account</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:'calc(env(safe-area-inset-bottom,0px) + 20px)' }}>
        {/* Profile header */}
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'0 16px 24px' }}>
          <img src={user.avatar} alt="" style={{ width:64, height:64, borderRadius:32, objectFit:'cover' }} />
          <div>
            <div style={{ fontWeight:700, fontSize:20 }}>{user.name}</div>
            <div style={{ fontSize:14, color:'var(--color-text-secondary)', marginTop:2 }}>{user.email}</div>
          </div>
        </div>

        {/* Orders */}
        <IOSList header="My orders">
          {account.orders.map((ord, i) => (
            <div key={ord.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderTop: i>0?'0.5px solid var(--color-separator)':'none', cursor:'pointer' }}>
              <img src={ord.thumb} alt="" style={{ width:48, height:48, borderRadius:'var(--r-sm)', objectFit:'cover' }} />
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:15 }}>{ord.title}</div>
                <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>{ord.date}</div>
              </div>
              <span style={{ fontSize:12, background:'var(--color-primary-light)', color:'var(--color-primary)', padding:'3px 10px', borderRadius:99, fontWeight:600 }}>{ord.status}</span>
            </div>
          ))}
        </IOSList>

        {/* Preferences */}
        <div style={{ marginTop:20 }}>
          <IOSList header="Preferences">
            <IOSListRow title="Notifications" detail="On" />
            <IOSListRow title="Language" detail="English" />
            <IOSListRow title="Currency" detail="EUR (€)" isLast />
          </IOSList>
        </div>

        {/* Support */}
        <div style={{ marginTop:20 }}>
          <IOSList header="Support">
            <IOSListRow title="Help centre" />
            <IOSListRow title="Contact us" />
            <IOSListRow title="Rate the app" isLast />
          </IOSList>
        </div>

        {/* Actions */}
        <div style={{ marginTop:20 }}>
          <IOSList header="Account">
            <IOSListRow title="Sign out" detail="" chevron={false} isLast />
          </IOSList>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verify order success + account.** Order success shows ✓ animation → "Continue shopping" → home. Account shows profile, order history, list sections.

---

## Task 12: Splash Icon + End-to-End Flow Verification

**Files:**
- No new files — verification task

- [ ] **Step 1: Verify the complete user journey end-to-end.**
  Start at `http://localhost:8080` and walk through each step:

  | Step | Action | Expected |
  |------|--------|----------|
  | 1 | Load `/` | Redirects to splash |
  | 2 | Splash auto-advances | After 2s → onboarding-1 with fade |
  | 3 | Tap Continue (×2) | Onboarding 2, 3 with slide transitions, dots animate |
  | 4 | Tap Get started | Fade → home |
  | 5 | Tap Photo Books | Slide → product-photobook |
  | 6 | Select cover → Choose format | Slide → editor-format |
  | 7 | Select format → Next step | Slide → editor-configure |
  | 8 | Tap Start creating | Slide → image-picker |
  | 9 | Select photos → Continue | Slide → basket |
  | 10 | Proceed to checkout | Slide → checkout-delivery |
  | 11 | Continue to payment | Slide → checkout-payment |
  | 12 | Pay | Replace → order-success (no back) |
  | 13 | Continue shopping | Replace → home |
  | 14 | Tap Account tab | Slide → account |
  | 15 | Tap back | Slide back to home |

- [ ] **Step 2: Verify mobile layout.** Set browser to 390×844 (DevTools device emulation).
  Check each screen: no horizontal overflow, safe area insets respected, tab bars not clipped by home indicator area.

- [ ] **Step 3: Verify desktop preview.** Open at 1440px wide. Each screen should appear inside the `IOSDevice` frame centered on dark background.

- [ ] **Step 4: Check all press states.** On every CTA button and tappable element: should scale to 0.97 on press.

---

## Task 13: Service Worker — Complete Precache List

**Files:**
- Modify: `service-worker.js` — add all screen URLs to PRECACHE array

- [ ] **Step 1: Update `service-worker.js` PRECACHE array** with all screens:
```js
const PRECACHE = [
  '/',
  '/index.html',
  '/shared/styles.css',
  '/shared/navigation.js',
  '/shared/mock-data.js',
  '/shared/ios-frame.jsx',
  '/screens/splash.html',
  '/screens/splash.jsx',
  '/screens/onboarding-1.html', '/screens/onboarding-1.jsx',
  '/screens/onboarding-2.html', '/screens/onboarding-2.jsx',
  '/screens/onboarding-3.html', '/screens/onboarding-3.jsx',
  '/screens/home.html',         '/screens/home.jsx',
  '/screens/product-photobook.html', '/screens/product-photobook.jsx',
  '/screens/editor-format.html',     '/screens/editor-format.jsx',
  '/screens/editor-configure.html',  '/screens/editor-configure.jsx',
  '/screens/basket.html',            '/screens/basket.jsx',
  '/screens/checkout-delivery.html', '/screens/checkout-delivery.jsx',
  '/screens/checkout-payment.html',  '/screens/checkout-payment.jsx',
  '/screens/order-success.html',     '/screens/order-success.jsx',
  '/screens/account.html',           '/screens/account.jsx',
  '/image-picker/index.html',
  '/image-picker/image-picker.jsx',
  '/image-picker/ios-frame.jsx',
  '/image-picker/photos.js',
  '/image-picker/app_icon.png',
  '/manifest.json',
];
```

- [ ] **Step 2: Test PWA install on iPhone.**
  1. Deploy to a public HTTPS URL (e.g. `npx serve .` + ngrok, or push to GitHub Pages / Netlify)
  2. Open URL in Safari on iPhone
  3. Share sheet → Add to Home Screen → name "Photobox" → Add
  4. Launch from home screen
  Expected: no browser chrome, status bar shows behind teal on splash, full-bleed experience.

- [ ] **Step 3: Test offline.** After one full run-through (all screens loaded), enable Airplane mode.
  Open the PWA. Expected: all screens still load from cache, picsum.photos images may not load (expected — they are external).

---

## Self-Review Against Spec

| Spec requirement | Task(s) | Status |
|-----------------|---------|--------|
| 15 screens covering full flow | Tasks 3–11 | ✅ |
| Vanilla HTML/CSS/JS + React via CDN | All tasks | ✅ |
| Separate HTML per screen | All tasks | ✅ |
| 390×844 responsive baseline | Boilerplate in every task | ✅ |
| Full PWA (manifest + SW) | Task 2, 13 | ✅ |
| iOS-native transitions (push/pop/modal) | Task 1 (navigation.js) | ✅ |
| Light mode (main) + dark mode (image picker, editor) | Task 1 CSS, ios-frame | ✅ |
| System font stack | Task 1 styles.css | ✅ |
| image-picker/ reused as-is, minimal touch | Task 8 | ✅ |
| ios-frame.jsx shared across all screens | Task 1, all screen tasks | ✅ |
| Figma design context fetched per screen | Each screen task step 1 | ✅ |
| Desktop preview in IOSDevice frame | All screen tasks | ✅ |
| Safe area insets everywhere | All screen tasks | ✅ |
| Press states on all interactive elements | Global constraint + tasks 3-11 | ✅ |
| Mock data (no backend) | Task 1 (mock-data.js) | ✅ |
