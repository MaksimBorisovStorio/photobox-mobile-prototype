# Photobox Mobile Prototype — Project Context

## What This Is

A full-flow **mobile web prototype** (mweb) of the Photobox app redesign. Built as a save-to-homescreen Progressive Web App — when added to an iPhone home screen it runs fullscreen with no browser chrome, indistinguishable from a native app.

**Purpose:** Demonstrate the complete redesigned UX/UI flow to stakeholders. No backend — all data and images are mocked.

**App concept:** Photobox is a photo products app (photo books, wall decor, calendars, prints, mugs, cards, gifts). This prototype covers the entire user journey: splash → onboarding → home → product page → book editor → image picker → basket → checkout → success → account.

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
| Splash screen | `451:13758` | ✅ Complete |
| Onboarding slide 1 (emotional) | `451:13808` | ✅ Complete |
| Onboarding slide 2 (emotional) | `451:13823` | ✅ Complete |
| Onboarding slide 3 (inspire) | `451:13841` | ✅ Complete |
| Home screen | `451:13862` | ✅ Complete (390×1920 scrollable) |
| Photo book — cover picker | `451:13381` | ✅ Complete |
| Photo book — format chooser | `451:13426` | ✅ Complete |
| Photo book — configure (scrollable) | `451:13491` | ✅ Complete (very tall: 2643px) |
| Photo book — configure variant | `451:13606` | ✅ Complete |
| Photo book — CTA screen | `451:13721` | ✅ Complete |
| Account / Profile | `451:14038` | ✅ Complete |
| Album / My trips | `451:14202` | ✅ Complete |
| My Photos (image grid) | `451:14403` | ✅ Complete |
| Basket | — | 🚧 Stub in Figma — design close to PB3 system |
| Checkout (delivery) | — | 🚧 Stub in Figma |
| Checkout (payment) | — | 🚧 Stub in Figma |
| Order success | — | 🚧 Stub in Figma |
| Image Picker | Pre-built prototype | ✅ Complete — see `image-picker/` |

---

## Tech Stack

### The Pattern
All screens use **React 18 via CDN** (loaded from unpkg, no build step), with JSX compiled in-browser by Babel Standalone. This is the same pattern as the existing `image-picker/` prototype.

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
<!-- then load shared components -->
<script type="text/babel" src="../shared/ios-frame.jsx"></script>
<script type="text/babel" src="../shared/navigation.js"></script>
<!-- then the screen component -->
<script type="text/babel" src="screen-name.jsx"></script>
```

### Why React via CDN (not pure vanilla)
The `image-picker/ios-frame.jsx` provides a polished **iOS component library** (status bar, nav bar, device frame, liquid glass pills, keyboard) that all screens should reuse. React makes this trivially composable with zero build tooling.

### No build step
- No npm, no webpack, no Vite
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
├── service-worker.js            ← offline caching for all screens
├── index.html                   ← entry point → redirects to splash
├── app_icon.png                 ← Photobox app icon (180×180 for touch icon)
│
├── shared/
│   ├── ios-frame.jsx            ← iOS component library (from image-picker)
│   │                               Exports: IOSDevice, IOSStatusBar, IOSNavBar,
│   │                               IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
│   ├── navigation.js            ← screen transition engine (push/pop/modal/replace)
│   ├── styles.css               ← CSS custom properties: brand colors, type scale, spacing
│   └── mock-data.js             ← all mock: products, user, orders, basket
│
├── screens/
│   ├── splash.html              ← Figma 451:13758
│   ├── onboarding-1.html        ← Figma 451:13808
│   ├── onboarding-2.html        ← Figma 451:13823
│   ├── onboarding-3.html        ← Figma 451:13841
│   ├── home.html                ← Figma 451:13862 (scrollable, 1920px tall)
│   ├── product-photobook.html   ← Figma 451:13381 + 451:13426
│   ├── editor-cover.html        ← Figma 451:13381
│   ├── editor-format.html       ← Figma 451:13426
│   ├── editor-configure.html    ← Figma 451:13491 (very long scroll)
│   ├── basket.html              ← 🚧 design from PB3 system
│   ├── checkout-delivery.html   ← 🚧 design from PB3 system
│   ├── checkout-payment.html    ← 🚧 design from PB3 system
│   ├── order-success.html       ← 🚧 design from PB3 system
│   └── account.html             ← Figma 451:14038
│
└── image-picker/                ← Pre-built prototype — DO NOT MODIFY
    ├── index.html               ← Entry point for image picker screen
    ├── image-picker.jsx         ← Full image picker component (2164 lines)
    ├── ios-frame.jsx            ← Local copy of iOS component library
    ├── manifest.webmanifest
    └── photos.js                ← Mock photo data (370+ photos via picsum.photos)
```

> **⚠️ `image-picker/` is frozen.** It is a complete, polished standalone prototype. When the main flow reaches the image picker step, navigate to `../image-picker/index.html`. Do not copy or re-implement its logic.

---

## Design System

### Colors
Confirm exact hex values from Figma using `get_design_context` on the relevant screen nodes. The palette below is approximate based on visual inspection:

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

### Spring Physics
For interactive elements, use spring-like cubic-bezier — `cubic-bezier(0.34, 1.3, 0.64, 1)` for snappy bouncy feel. For selection states, scale transforms.

### Navigation API
```js
// In any screen component:
navigation.push('../screens/product-photobook.html');   // push new screen
navigation.pop();                                        // go back
navigation.modal('../screens/basket.html');             // slide up as sheet
navigation.replace('../screens/onboarding-1.html');    // replace (no back)
```

### User Journey Flow
```
splash.html
  └─(replace)─> onboarding-1.html
                └─(push)─> onboarding-2.html
                           └─(push)─> onboarding-3.html
                                     └─(push)─> home.html
                                                ├─(push)─> product-photobook.html
                                                │          └─(push)─> editor-cover.html
                                                │                     └─(push)─> editor-format.html
                                                │                                └─(push)─> editor-configure.html
                                                │                                           └─(push)─> ../image-picker/index.html
                                                │                                                      └─(push)─> basket.html
                                                │                                                                 └─(push)─> checkout-delivery.html
                                                │                                                                            └─(push)─> checkout-payment.html
                                                │                                                                                       └─(replace)─> order-success.html
                                                │                                                                                                    └─(push)─> home.html
                                                └─(push)─> account.html
```

---

## Shared Component Library (`shared/ios-frame.jsx`)

Copied from `image-picker/ios-frame.jsx`. Exports via `Object.assign(window, {...})`:

| Component | Props | Description |
|-----------|-------|-------------|
| `IOSDevice` | `width, height, dark, title, keyboard` | Full iPhone frame with Dynamic Island, status bar, home indicator |
| `IOSStatusBar` | `dark, time` | iOS status bar (signal, wifi, battery) |
| `IOSNavBar` | `title, dark, trailingIcon` | iOS nav bar with liquid glass pills + large title |
| `IOSGlassPill` | `dark, style` | Liquid glass pill container |
| `IOSList` | `header, dark` | Inset grouped list card (border-radius 26px) |
| `IOSListRow` | `title, detail, icon, chevron, isLast, dark` | Single list row (52px tall) |
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
<meta name="theme-color" content="#0E9E8E">
<link rel="apple-touch-icon" href="/app_icon.png">
<link rel="manifest" href="/manifest.json">
```

### service-worker.js
Precaches all screen HTML files and shared assets for offline use. Uses cache-first strategy. Register from `index.html`:
```js
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');
```

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
  <!-- PWA tags -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Photobox">
  <link rel="manifest" href="/manifest.json">
  <!-- Styles -->
  <link rel="stylesheet" href="../shared/styles.css">
  <!-- React via CDN (no build step) -->
  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <!-- Shared components (must load before screen JSX) -->
  <script type="text/babel" src="../shared/ios-frame.jsx"></script>
  <script src="../shared/navigation.js"></script>
  <script src="../shared/mock-data.js"></script>
  <!-- Screen component -->
  <script type="text/babel" src="screen-name.jsx"></script>
  <!-- Mount -->
  <script type="text/babel">
    function useIsMobile() {
      const [m, setM] = React.useState(() => window.matchMedia('(max-width: 519px)').matches);
      React.useEffect(() => {
        const mql = window.matchMedia('(max-width: 519px)');
        const cb = (e) => setM(e.matches);
        mql.addEventListener('change', cb);
        return () => mql.removeEventListener('change', cb);
      }, []);
      return m;
    }
    function App() {
      const isMobile = useIsMobile();
      if (isMobile) return (
        <div style={{ position:'fixed', inset:0, background:'#fff', overflow:'hidden' }}>
          <ScreenComponent />
        </div>
      );
      return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'#0E0E10' }}>
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

### CSS Body Reset
```css
html, body {
  margin: 0; padding: 0;
  background: #fff;                         /* or #000 for dark screens */
  font-family: var(--font);
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent;
}
```

### Safe Area Insets
Always account for Dynamic Island and home indicator:
```css
padding-top: calc(env(safe-area-inset-top, 0px) + 12px);
padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 28px);
```

### Interactive Elements (buttons, tiles)
```js
// Scale on press — apply to all tappable elements
onPointerDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
onPointerUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
onPointerLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
// With transition: 'transform 140ms ease'
```

### Mock Data
All product data, user info, order history live in `shared/mock-data.js`. Exposed as `window.MOCK`. Images use `picsum.photos` (same as image-picker). Product images use consistent seeds so they look intentional.

---

## Screen-Specific Notes

### Splash Screen
- Full-bleed gradient background (teal → dark teal, confirm exact from Figma node `451:13758`)
- Photobox logo centered (SVG, white)
- Animated: logo fades in with subtle scale (0.9 → 1.0), then after 2s auto-advances via `navigation.replace`
- No status bar visible (hide with `black-translucent`)

### Onboarding (3 screens)
- Consistent layout: full-bleed photo/illustration top half, text + CTA bottom half
- Progress dots at bottom (active dot = teal, inactive = white/40%)
- "Continue" button = full-width teal pill
- Last screen has "Get started" CTA
- Figma nodes: `451:13808`, `451:13823`, `451:13841`

### Home Screen
- Scrollable (1920px content area in Figma node `451:13862`)
- Sections: horizontal product category pills, "Create" cards, "Memories" carousel, "Ideas" grid
- Sticky tab bar at bottom: Home, Create, My Photos, Account (4 tabs)
- Tab bar uses liquid glass effect

### Photo Book Editor (multi-step)
- Step 1: Cover type picker (`451:13381`)
- Step 2: Format chooser (`451:13426`)
- Step 3: Configuration — long scroll with lay-flat add-on, size, paper options (`451:13491`)
- Progress stepper shown in nav bar
- "Start creating →" CTA navigates to Image Picker

### Image Picker
- **Use the existing `image-picker/` prototype as-is**
- Navigate to it: `navigation.push('../image-picker/index.html')`
- The picker's "Continue" button should navigate back to basket
- Dark mode throughout
- Features: swipe-to-select, smart select (AI), sort/filter sheet, fullscreen preview, super-scroll scrubber

### Basket / Checkout
- Not in Figma yet — design in PB3 style (white surfaces, teal CTAs, iOS list rows)
- Basket: order summary, quantity controls, price breakdown, "Proceed to checkout" CTA
- Checkout delivery: address form with iOS-style text inputs, delivery options
- Checkout payment: card form (no real payment — mock "Pay" button)
- Order success: large checkmark animation, order number, "Continue shopping" → home

### Account Screen
- Figma node `451:14038`
- Sections: My account, Preferences, Support, Account actions (logout)
- Uses `IOSList` / `IOSListRow` components

---

## Working with This Project

### Running locally
```bash
cd /Users/mborisov/Desktop/test/MEGAPROTOTYPE
python3 -m http.server 8080
# Open http://localhost:8080
```

### Testing on iPhone
1. Serve locally with ngrok or similar, OR deploy to GitHub Pages / Netlify
2. Open URL in Safari on iPhone
3. Share → Add to Home Screen
4. Launch from home screen for fullscreen PWA experience

### Implementing a screen
1. Load the `figma:figma-design-to-code` skill before calling Figma tools
2. Call `get_design_context` on the screen's Figma node ID (see table above)
3. Build the React component in a `.jsx` file alongside the `.html` shell
4. Keep all interactive states (hover/press/active) matching iOS conventions
5. Test at 390px width (mobile) and ≥520px (desktop preview)

### Adding a new screen
1. Create `screens/screen-name.html` using the standard HTML structure above
2. Create `screens/screen-name.jsx` with the screen React component
3. Add it to the navigation flow in this doc and in `shared/navigation.js`
4. Add to service worker precache list

### Key quality checks before considering a screen done
- [ ] Status bar reads correctly (light/dark per screen)
- [ ] Safe area insets applied (no content hidden by Dynamic Island or home indicator)
- [ ] Tap targets ≥ 44×44pt
- [ ] All interactive elements have press states (scale 0.97)
- [ ] Transitions to/from this screen work correctly
- [ ] Desktop preview shows in IOSDevice frame
- [ ] No horizontal overflow
