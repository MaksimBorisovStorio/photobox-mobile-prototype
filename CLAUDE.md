# Photobox Mobile Prototype — Project Context

## What This Is

A full-flow **mobile web prototype** (mweb) of the Photobox app redesign. Built as a save-to-homescreen Progressive Web App — when added to an iPhone home screen it runs fullscreen with no browser chrome, indistinguishable from a native app.

**Purpose:** Demonstrate the complete redesigned UX/UI flow to stakeholders. No backend — all data and images are mocked.

**App concept:** Photobox is a photo products app (photo books, wall decor, calendars, prints, mugs, cards, gifts). This prototype covers the entire user journey: splash → onboarding → home → product page → book editor → image picker → basket → checkout → success → account.

---

## 🟢 Build Status: COMPLETE

All 13 implementation tasks are done. Branch `feature/prototype-build` is demo-ready. Full E2E navigation verified. Final whole-branch code review passed (all findings fixed).

**Git branch:** `feature/prototype-build`
**Latest commit:** `ea8a51c` — fix: final review — log out action, position:relative, SW manifest, sign-in replace, splash crossorigin
**Branch base:** `e485e79` (initial MERGE_BASE)

### What's built

| Screen | File | Build Status |
|--------|------|-------------|
| Splash | `screens/splash.html` + `splash.jsx` | ✅ Done |
| Onboarding 1 | `screens/onboarding-1.html` + `.jsx` | ✅ Done |
| Onboarding 2 | `screens/onboarding-2.html` + `.jsx` | ✅ Done |
| Onboarding 3 | `screens/onboarding-3.html` + `.jsx` | ✅ Done |
| Home | `screens/home.html` + `home.jsx` | ✅ Done |
| Product — Photo Book | `screens/product-photobook.html` + `.jsx` | ✅ Done |
| Editor — Format | `screens/editor-format.html` + `.jsx` | ✅ Done |
| Editor — Configure | `screens/editor-configure.html` + `.jsx` | ✅ Done |
| Image Picker | `image-picker/index.html` (pre-built, frozen) | ✅ Wired in |
| Basket | `screens/basket.html` + `basket.jsx` | ✅ Done |
| Checkout — Delivery | `screens/checkout-delivery.html` + `.jsx` | ✅ Done |
| Checkout — Payment | `screens/checkout-payment.html` + `.jsx` | ✅ Done |
| Order Success | `screens/order-success.html` + `.jsx` | ✅ Done |
| Account | `screens/account.html` + `account.jsx` | ✅ Done |

### Possible next tasks

- **Figma fidelity pass** — query Figma node IDs (see table below) to tighten colors, spacing, typography to exact Figma spec. Screens built from verbal descriptions rather than direct Figma calls due to MCP availability.
- **Transition polish** — add push/pop slide animations between screens (navigation.js stubs are in place; CSS transitions not yet wired to the iframe-swap mechanism).
- **Dark mode for Editor screens** — editor-configure currently light mode; Figma spec says editor should be dark.
- **My Photos tab** — home tab bar has a "My Photos" tab that navigates to `../image-picker/index.html`. If a standalone My Photos grid (distinct from the picker) is needed, create `screens/my-photos.html`.
- **Deploy** — push to GitHub Pages / Netlify for iPhone testing. Current setup requires `python3 -m http.server 8080` + ngrok.
- **Real Figma node check** — `editor-cover.html` referenced in the original plan was merged into `product-photobook.html` (it's the same cover-picker step); verify this matches stakeholder expectations.

---

## Figma Source

**File:** https://www.figma.com/design/IXnTCRYPVbCAEddEXJZALI/%F0%9F%8C%A0-Mobile-app-Future-vision
**Canvas:** "Final prototype" — node `451:13380`
**Design system prefix:** `PB3/`
**Theme:** Light mode (iOS conventions) — except Image Picker and Editor which are dark mode
**Pricing locale:** Euros (€)

> ⚠️ The Figma is a work-in-progress: some screens are incomplete or placeholder. Use it as the primary visual reference; where screens are missing or rough, infer from the PB3 design language. Always call `get_design_context` (with the `figma:figma-design-to-code` skill loaded) on specific node IDs to get exact colors/spacing before implementing a screen.

### Screen Node IDs in Figma

| Screen | Figma Node | Status |
|--------|-----------|--------|
| Splash screen | `451:13758` | ✅ Built (Figma not queried — values inferred) |
| Onboarding slide 1 (emotional) | `451:13808` | ✅ Built (Figma not queried) |
| Onboarding slide 2 (emotional) | `451:13823` | ✅ Built (Figma not queried) |
| Onboarding slide 3 (inspire) | `451:13841` | ✅ Built (Figma not queried) |
| Home screen | `451:13862` | ✅ Built (Figma not queried) |
| Photo book — cover picker | `451:13381` | ✅ Built (Figma not queried) |
| Photo book — format chooser | `451:13426` | ✅ Built (Figma not queried) |
| Photo book — configure (scrollable) | `451:13491` | ✅ Built (Figma not queried) |
| Photo book — configure variant | `451:13606` | ✅ Built (Figma not queried) |
| Photo book — CTA screen | `451:13721` | ✅ Built (Figma not queried) |
| Account / Profile | `451:14038` | ✅ Built (Figma not queried) |
| Album / My trips | `451:14202` | ⬜ Not built (no screen in current flow) |
| My Photos (image grid) | `451:14403` | ⬜ Not built (image-picker used instead) |
| Basket | — | ✅ Built (PB3 style, no Figma node) |
| Checkout (delivery) | — | ✅ Built (PB3 style, no Figma node) |
| Checkout (payment) | — | ✅ Built (PB3 style, no Figma node) |
| Order success | — | ✅ Built (PB3 style, no Figma node) |
| Image Picker | Pre-built prototype | ✅ Complete — see `image-picker/` |

---

## Tech Stack

### The Pattern
All screens use **React 18 via CDN** (loaded from unpkg, no build step), with JSX compiled in-browser by Babel Standalone.

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
<!-- then shared components — ORDER MATTERS -->
<script src="../shared/navigation.js"></script>
<script src="../shared/mock-data.js"></script>
<script type="text/babel" src="../shared/ios-frame.jsx"></script>
<!-- then the screen component -->
<script type="text/babel" src="screen-name.jsx"></script>
```

### No build step
- No npm, no webpack, no Vite, no TypeScript
- Open any `.html` file directly in a browser or serve with `python3 -m http.server 8080`
- The project must work when saved to iPhone home screen (PWA, offline-capable)

### Viewport
- Baseline: **390×844pt** (iPhone 14/15)
- Responsive: works on any modern iPhone, scales gracefully on desktop (shows device frame)
- Meta: `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">`
- Status bar style: `black-translucent` (content extends behind status bar, use `env(safe-area-inset-top)`)

---

## Project Structure

```
MEGAPROTOTYPE/
├── CLAUDE.md                    ← this file — auto-loaded context
├── manifest.json                ← root PWA manifest (Photobox app)
├── service-worker.js            ← offline caching — PRECACHE lists all screens
├── index.html                   ← entry point → redirects to splash
├── app_icon.png                 ← Photobox app icon (180×180 for touch icon)
│
├── shared/
│   ├── ios-frame.jsx            ← iOS component library
│   │                               Exports: IOSDevice, IOSStatusBar, IOSNavBar,
│   │                               IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
│   ├── navigation.js            ← screen transition engine (push/pop/modal/replace)
│   ├── styles.css               ← CSS custom properties: brand colors, type scale, spacing
│   └── mock-data.js             ← all mock: products, user, orders, basket
│
├── screens/
│   ├── splash.html + splash.jsx
│   ├── onboarding-1.html + onboarding-1.jsx
│   ├── onboarding-2.html + onboarding-2.jsx
│   ├── onboarding-3.html + onboarding-3.jsx
│   ├── home.html + home.jsx
│   ├── product-photobook.html + product-photobook.jsx
│   ├── editor-format.html + editor-format.jsx
│   ├── editor-configure.html + editor-configure.jsx
│   ├── basket.html + basket.jsx
│   ├── checkout-delivery.html + checkout-delivery.jsx
│   ├── checkout-payment.html + checkout-payment.jsx
│   ├── order-success.html + order-success.jsx
│   └── account.html + account.jsx
│
└── image-picker/                ← Pre-built prototype — DO NOT MODIFY
    ├── index.html               ← Entry point for image picker screen
    ├── image-picker.jsx         ← Full image picker component (~2164 lines)
    ├── ios-frame.jsx            ← Local copy of iOS component library
    ├── manifest.webmanifest
    └── photos.js                ← Mock photo data (370+ photos via picsum.photos)
```

> **⚠️ `image-picker/` is frozen.** When the main flow reaches the image picker step, navigate to `../image-picker/index.html`. The only permitted change is the `onContinue` handler — it must navigate back to `../screens/basket.html` (already done).

---

## Known Implementation Decisions & Gotchas

### Image picker → basket navigation
The image-picker has no `navigation.js` loaded, so `window.navigation` doesn't exist there. The `onContinue` handler uses raw navigation:
```js
sessionStorage.setItem('pb_nav', 'push');
window.location.href = '../screens/basket.html';
```

### Every screen root div needs `position:'relative'`
CTAs are `position:'absolute'; bottom:0` — they anchor to the nearest `position:relative` ancestor. Without it on the root div, CTAs can escape to the IOSDevice frame boundary on desktop. Every screen component's outermost `<div>` must have `position:'relative'`.

### Back button vs general tappable elements
- **Back/icon buttons**: `scale(0.9)` on pointerDown
- **All other tappable elements** (CTAs, cards, rows): `scale(0.97)` on pointerDown
- Both need: `onPointerUp/Leave` → `scale(1)`, `transition:'transform 140ms ease'`

### IOSListRow does not accept a `style` prop
When you need custom styling on a list row (e.g. red "Log out" text), render it as a plain `<div>` with manual press state handlers instead of using `IOSListRow`.

### Checkout payment — intentional hardcoded values
`checkout-payment.jsx` hardcodes `€24.99`, `€4.99`, `€29.98` rather than reading `window.MOCK.basket`. This is by design — `mock-data.js` is not loaded on that screen. Values match the mock exactly. Do not add the mock-data dependency unless you want dynamic cart support.

### Dependency load order in HTML files
This exact order is required in every screen's HTML:
1. `styles.css` (link tag)
2. React CDN script
3. ReactDOM CDN script
4. Babel CDN script
5. `navigation.js` (plain script)
6. `mock-data.js` (plain script — omit if screen doesn't use `window.MOCK`)
7. `ios-frame.jsx` (text/babel)
8. `screen-name.jsx` (text/babel)
9. Inline mount script (text/babel — contains `useIsMobile`, `App`, `ReactDOM.createRoot`)

---

## Design System

### Colors
```css
/* shared/styles.css */
:root {
  /* Brand */
  --color-primary: #0E9E8E;        /* Teal/mint — CTAs, active states, brand accent */
  --color-primary-dark: #0A7A6E;   /* Darker teal for pressed states */
  --color-primary-light: #E8F8F6;  /* Teal tint for backgrounds */

  /* Surfaces (Light mode — used by most screens) */
  --color-bg: #F2F2F7;             /* iOS system background */
  --color-surface: #FFFFFF;        /* Card/sheet surface */
  --color-surface-2: #F2F2F7;      /* Secondary surface */

  /* Text (Light mode) */
  --color-text-primary: #000000;
  --color-text-secondary: rgba(60, 60, 67, 0.6);
  --color-text-tertiary: rgba(60, 60, 67, 0.3);

  /* Surfaces (Dark mode — Image Picker & Editor only) */
  --color-bg-dark: #000000;
  --color-surface-dark: #1C1C1E;
  --color-surface-dark-2: rgba(28, 28, 30, 0.92);
  --color-text-dark: #FFFFFF;
  --color-text-dark-secondary: rgba(235, 235, 245, 0.6);

  /* Semantic */
  --color-separator: rgba(60, 60, 67, 0.12);   /* Light mode dividers */
  --color-separator-dark: rgba(84, 84, 88, 0.65);
  --color-destructive: #FF453A;                 /* iOS red */
  --color-success: #34C759;                     /* iOS green */

  /* Typography */
  --font: -apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif;
  --font-display: -apple-system, "SF Pro Display", system-ui, sans-serif;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Radius */
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 22px;
  --radius-xl: 28px;
  --radius-full: 9999px;
}
```

> ⚠️ These values are approximate. Before finalizing a screen, call `get_design_context` on its Figma node and adjust to match exactly.

### Typography Scale

| Style | Size | Weight | Letter-spacing | Usage |
|-------|------|--------|---------------|-------|
| Large Title | 34px | 700 | +0.4px | Page titles (collapsed nav) |
| Title 1 | 28px | 700 | -0.4px | Section headings |
| Title 2 | 22px | 700 | -0.3px | Card titles |
| Headline | 17px | 600 | -0.43px | Prominent labels |
| Body | 17px | 400 | -0.43px | Main content text |
| Callout | 16px | 400 | -0.32px | Secondary content |
| Subhead | 15px | 400 | -0.24px | Supporting text |
| Footnote | 13px | 400 | -0.08px | Captions, metadata |
| Caption | 12px | 400 | 0 | Fine print |

### Liquid Glass Effect
Used on nav bars, pills, and sheets (already implemented in `ios-frame.jsx`):
```css
backdrop-filter: blur(12px) saturate(180%);
-webkit-backdrop-filter: blur(12px) saturate(180%);
background: rgba(255,255,255,0.5);   /* light */
/* or */
background: rgba(120,120,128,0.28); /* dark */
box-shadow: inset 1.5px 1.5px 1px rgba(255,255,255,0.7);  /* shine */
border: 0.5px solid rgba(0,0,0,0.06);
```

---

## Navigation & Animations

All transitions are handled by `shared/navigation.js`.

### Transition Types

| Transition | CSS | Duration | Easing | When |
|-----------|-----|---------|--------|------|
| Push | Slide in from right | 320ms | `cubic-bezier(0.32, 0.72, 0.24, 1)` | Forward navigation |
| Pop | Slide out to right | 300ms | `cubic-bezier(0.32, 0.72, 0.24, 1)` | Back navigation |
| Modal | Slide up from bottom | 380ms | `cubic-bezier(0.34, 1.05, 0.64, 1)` | Sheets, overlays |
| Replace | Fade crossfade | 400ms | `ease` | Splash → Onboarding |
| Dismiss | Slide down | 320ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Close modal |

### Navigation API
```js
window.navigation.push('product-photobook.html');     // push new screen
window.navigation.pop();                               // go back
window.navigation.modal('basket.html');               // slide up as sheet
window.navigation.replace('onboarding-1.html');       // replace (no back)
```

### User Journey Flow
```
splash.html
  └─(replace)─> onboarding-1.html
                └─(push)─> onboarding-2.html
                           └─(push)─> onboarding-3.html
                                     └─(replace)─> home.html
                                                ├─(push)─> product-photobook.html
                                                │          └─(push)─> editor-format.html
                                                │                     └─(push)─> editor-configure.html
                                                │                                └─(push)─> ../image-picker/index.html
                                                │                                           └─(location.href)─> basket.html
                                                │                                                               └─(push)─> checkout-delivery.html
                                                │                                                                          └─(push)─> checkout-payment.html
                                                │                                                                                     └─(replace)─> order-success.html
                                                │                                                                                                  └─(push)─> home.html
                                                └─(push)─> account.html
                                                           └─(replace)─> onboarding-1.html (log out)
```

---

## Shared Component Library (`shared/ios-frame.jsx`)

Exports via `Object.assign(window, {...})`:

| Component | Props | Description |
|-----------|-------|-------------|
| `IOSDevice` | `width, height, dark, title, keyboard` | Full iPhone frame with Dynamic Island, status bar, home indicator |
| `IOSStatusBar` | `dark, time` | iOS status bar (signal, wifi, battery) |
| `IOSNavBar` | `title, dark, trailingIcon` | iOS nav bar with liquid glass pills + large title |
| `IOSGlassPill` | `dark, style` | Liquid glass pill container |
| `IOSList` | `header, dark` | Inset grouped list card (border-radius 26px) |
| `IOSListRow` | `title, detail, icon, chevron, isLast, dark` | Single list row (52px tall) — no `style` prop; use plain div for custom row styles |
| `IOSKeyboard` | `dark` | Full iOS keyboard with liquid glass |

**Usage:** On mobile, render screen content directly in `position:fixed; inset:0`. On desktop (≥520px), wrap in `<IOSDevice>` for iPhone preview frame.

---

## PWA Setup

### Root manifest.json
```json
{
  "name": "Photobox",
  "short_name": "Photobox",
  "start_url": "/index.html",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#0E9E8E",
  "orientation": "portrait",
  "icons": [
    { "src": "/app_icon.png", "sizes": "180x180", "type": "image/png" }
  ]
}
```

### Required meta tags (every screen's `<head>`)
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Photobox">
<link rel="manifest" href="/manifest.json">
```

### service-worker.js
Precaches all 14 screen HTML files, all 14 JSX files, 4 shared assets, manifest.json, and 4 image-picker files. Cache name `photobox-v1`. Cache-first strategy.

---

## Development Conventions

### Every Screen HTML Structure
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Photobox — [Screen Name]</title>
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Photobox">
  <link rel="manifest" href="/manifest.json">
  <link rel="stylesheet" href="../shared/styles.css">
  <style> html, body { margin:0; padding:0; background:#F2F2F7; } ::-webkit-scrollbar{display:none;} </style>
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
</head>
<body>
  <div id="root"></div>
  <script src="../shared/navigation.js"></script>
  <script src="../shared/mock-data.js"></script>
  <script type="text/babel" src="../shared/ios-frame.jsx"></script>
  <script type="text/babel" src="screen-name.jsx"></script>
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
        <div style={{position:'fixed', inset:0, background:'#F2F2F7', overflow:'hidden'}}>
          <ScreenComponent />
        </div>
      );
      return (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#1C1C1E'}}>
          <IOSDevice width={402} height={874}>
            <ScreenComponent />
          </IOSDevice>
        </div>
      );
    }
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
```

### Safe Area Insets
```css
/* Top — below Dynamic Island / status bar */
padding-top: calc(env(safe-area-inset-top, 44px) + 8px);

/* Bottom — above home indicator / CTA gradient */
padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
```

### Interactive Elements (buttons, tiles)
```js
// Regular tappable elements (cards, CTAs, list rows):
onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
// style: { transition: 'transform 140ms ease' }

// Back buttons / icon buttons:
onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
```

### Mock Data (`window.MOCK`)
```
window.MOCK.user            → { name, email, avatar, memberSince }
window.MOCK.categories      → [ { id, label, icon, from } ]
window.MOCK.featuredProjects → [ { id, title, subtitle, thumb, type } ]
window.MOCK.memories        → [ { id, title, thumb, count } ]
window.MOCK.photobook       → { coverTypes, formats, pageOptions, paperOptions }
window.MOCK.basket          → { items: [{ id, type, spec, thumb, qty, price }], subtotal, delivery, total }
window.MOCK.order           → { number, estimatedDelivery, items, total }
window.MOCK.account         → { orders: [{ id, title, date, status, thumb }] }
```

---

## Running & Testing

### Running locally
```bash
cd /Users/mborisov/Desktop/test/MEGAPROTOTYPE
python3 -m http.server 8080
# Open http://localhost:8080
```

### Testing on iPhone
1. Serve locally with ngrok, OR deploy to GitHub Pages / Netlify
2. Open URL in Safari on iPhone
3. Share → Add to Home Screen
4. Launch from home screen for fullscreen PWA experience

### Adding a new screen
1. Create `screens/screen-name.html` using the standard HTML structure above
2. Create `screens/screen-name.jsx` with the screen React component (root div must have `position:'relative'`)
3. Wire navigation in the calling screen
4. Add `'/screens/screen-name.html'` and `'/screens/screen-name.jsx'` to `service-worker.js` PRECACHE

### Quality checklist for any screen change
- [ ] Root div has `position:'relative'`
- [ ] Status bar `<IOSStatusBar dark={false/true} />` present
- [ ] Safe area insets applied top and bottom
- [ ] All tappable elements have `onPointerDown/Up/Leave` scale handlers
- [ ] Back buttons use `scale(0.9)`, all others `scale(0.97)`
- [ ] Tap targets ≥ 44×44pt
- [ ] Scrollbar hidden: `scrollbarWidth:'none'`
- [ ] Desktop preview shows in `<IOSDevice width={402} height={874}>`
- [ ] No horizontal overflow
- [ ] New HTML file added to service-worker.js PRECACHE
