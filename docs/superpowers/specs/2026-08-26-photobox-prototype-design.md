# Photobox Mobile Prototype — Design Spec

**Date:** 2026-08-26  
**Author:** Maksim Borisov  
**Status:** Approved — ready for implementation planning

---

## Problem & Goal

Photobox (an existing app for creating photo products) is undergoing a full visual redesign. The goal of this prototype is to demonstrate the redesigned UX/UI to stakeholders in a realistic, interactive form. The prototype must:

1. Look like a beautiful, modern app — closely matching the Figma PB3 design system
2. Feel like a native iOS app — iOS-style transitions, spring physics, haptic feedback
3. Cover the complete user journey end-to-end (15+ screens)
4. Run on a real iPhone as a save-to-homescreen PWA
5. Be maintainable and extensible (each screen as an independent file)

---

## Constraints

- **No backend**: all data mocked
- **No build step**: must work by opening HTML files in a browser or serving with a simple HTTP server
- **No npm/node**: dependencies loaded from CDN
- **iPhone-first**: 390×844pt baseline, responsive (works on desktop as preview)
- **Safari compatibility**: must work as a PWA in iOS Safari

---

## Approach Decision

After evaluating three options (vanilla HTML/CSS/JS, single HTML file, Vite+vanilla), we chose:

**Separate HTML files per screen, React 18 via CDN, shared component library**

Rationale:
- The existing `image-picker/` prototype is a high-quality standalone prototype using React 18 + Babel via CDN. Reusing this pattern gives us its full iOS component library (`ios-frame.jsx`) for free.
- Separate HTML files per screen is the most maintainable structure for 15+ screens.
- No build step: React via CDN + Babel Standalone compiles JSX in the browser. Zero tooling required.
- The `ios-frame.jsx` library already has: `IOSDevice`, `IOSStatusBar`, `IOSNavBar`, `IOSGlassPill`, `IOSList`, `IOSListRow`, `IOSKeyboard` — a complete iOS UI kit.

---

## Architecture

### File Organization

```
MEGAPROTOTYPE/
├── CLAUDE.md                    ← auto-loaded project context (primary reference)
├── manifest.json                ← PWA manifest
├── service-worker.js            ← offline caching
├── index.html                   ← entry → splash
├── shared/
│   ├── ios-frame.jsx            ← iOS component library (shared)
│   ├── navigation.js            ← screen transition engine
│   ├── styles.css               ← design tokens (CSS custom properties)
│   └── mock-data.js             ← all mock data
├── screens/                     ← 14 screen HTML files + JSX
└── image-picker/                ← pre-built prototype (frozen, do not modify)
```

### Dependency Loading Order
Each screen HTML loads dependencies in this order:
1. `shared/styles.css` (CSS variables)
2. React + ReactDOM from unpkg
3. Babel Standalone from unpkg
4. `shared/ios-frame.jsx` (via `<script type="text/babel">`)
5. `shared/navigation.js`
6. `shared/mock-data.js`
7. Screen JSX file

### Desktop Preview
On screens ≥520px wide, the app renders inside an `<IOSDevice>` frame (402×874px) centered on a dark background — making it look like a device mockup in demos.

---

## Screen Inventory & Navigation Flow

### 15 Screens

| # | File | Title | Figma | Theme | Notes |
|---|------|-------|-------|-------|-------|
| 1 | `screens/splash.html` | Splash | `451:13758` | Dark (brand teal) | Auto-advances 2s |
| 2 | `screens/onboarding-1.html` | Onboarding 1 | `451:13808` | Light | Progress dots |
| 3 | `screens/onboarding-2.html` | Onboarding 2 | `451:13823` | Light | |
| 4 | `screens/onboarding-3.html` | Onboarding 3 | `451:13841` | Light | "Get started" CTA |
| 5 | `screens/home.html` | Home | `451:13862` | Light | Tab bar, scrollable |
| 6 | `screens/product-photobook.html` | Photo Books | `451:13381` | Light | Cover type selector |
| 7 | `screens/editor-format.html` | Choose Format | `451:13426` | Light | Format grid |
| 8 | `screens/editor-configure.html` | Configure | `451:13491` | Light | Very long scroll |
| 9 | `image-picker/index.html` | Image Picker | Pre-built | **Dark** | Reused as-is |
| 10 | `screens/basket.html` | Basket | PB3 style | Light | |
| 11 | `screens/checkout-delivery.html` | Delivery | PB3 style | Light | Address form |
| 12 | `screens/checkout-payment.html` | Payment | PB3 style | Light | Card form |
| 13 | `screens/order-success.html` | Order Placed | PB3 style | Light | Celebration animation |
| 14 | `screens/account.html` | My Account | `451:14038` | Light | |
| *(home again)* | | | | | Loop back |

### Navigation Transitions

| Type | Trigger | Animation |
|------|---------|-----------|
| Push | Forward navigation | Slide new screen in from right (320ms) |
| Pop | Back button | Slide current screen out to right (300ms) |
| Modal | Basket, sheets | Slide up from bottom (380ms spring) |
| Replace | Splash→Onboarding, Success→Home | Crossfade (400ms) |

Spring easing: `cubic-bezier(0.34, 1.05, 0.64, 1)` for entrance, `cubic-bezier(0.4, 0, 0.2, 1)` for exit.

---

## Design System

### Theme

| Context | Theme | Key difference |
|---------|-------|----------------|
| Main app (13 screens) | **Light** | White surfaces, dark text |
| Image Picker | **Dark** | Black background, white text |
| Photo Editor | **Dark** | Black background (photos stand out) |

### Typography
System font stack: `-apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif`

On iPhone, this automatically renders as Apple's SF Pro — indistinguishable from native. No font loading required.

### Liquid Glass
The Apple "liquid glass" effect (iOS 26 visual language) is already implemented in `ios-frame.jsx` and the image picker. The recipe:
- `backdrop-filter: blur(12px) saturate(180%)` — blur + vibrancy
- Semi-transparent tinted background
- Inset shine via `box-shadow: inset ...`
- Subtle border: `0.5px solid rgba(0,0,0,0.06)`

Apply to: nav bar, bottom sheets, pills, tab bar, selection pill.

### Interaction Pattern
All tappable elements scale on press: `transform: scale(0.97)` on `pointerdown`, `scale(1)` on `pointerup/pointerleave`. Transition: `140ms ease`. This is non-negotiable for native feel.

---

## Existing Asset: Image Picker

The `image-picker/` directory contains a complete, polished standalone prototype built by Maksim. It implements:

- iOS-style photo grid (3-column, date-grouped)
- Swipe-to-select gestures (horizontal drag selects multiple photos)
- Long-press for fullscreen preview (swipe-to-navigate, swipe-down-to-dismiss)
- Smart Select (AI-style preset selection with settings sheet)
- Sort & filter bottom sheet
- Super-scroll scrubber (right-edge date scrubber with haptics)
- Floating selection pill (morphs into "Review selection" sheet)
- Select all / deselect by date group
- File upload (replace mock photos with real device photos)

**Integration:** The main prototype links TO this as a separate HTML page. No code duplication.

---

## PWA Requirements

### Files needed
- `/manifest.json` — app name, icons, display:standalone, theme-color
- `/service-worker.js` — precaches all screens for offline use
- `/app_icon.png` — 180×180px Photobox icon (all apple-touch-icon sizes point to this)

### iOS-specific meta tags (required on every screen)
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Photobox">
```

`black-translucent` status bar is important — it allows content to extend behind the status bar (full-bleed screens like splash and image picker) while the nav bar area remains usable.

---

## Implementation Order (recommendation)

Build in this order so each step is testable end-to-end:

1. **Shared infrastructure** — `styles.css`, `navigation.js`, `mock-data.js`, `manifest.json`, `service-worker.js`
2. **Splash + Onboarding** — first experience, tests replace/push transitions
3. **Home screen** — hub, tests tab bar and scrolling
4. **Product page + Editor flow** — multi-step wizard
5. **Integration with Image Picker** — link existing prototype
6. **Basket + Checkout + Success** — conversion flow
7. **Account screen** — profile/settings

---

## Success Criteria

- [ ] All 15 screens implemented and linked
- [ ] Transitions between every screen feel native (no jarring cuts)
- [ ] Saved to iPhone home screen: launches fullscreen, no browser chrome
- [ ] Works offline after first load (service worker)
- [ ] UI matches Figma within reasonable tolerance (colors, spacing, typography)
- [ ] Interactive elements have press states
- [ ] Image picker integrates seamlessly as step in the main flow
- [ ] Desktop preview: renders correctly in IOSDevice frame
