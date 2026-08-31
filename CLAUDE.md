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
| Splash | `screens/splash.html` + `splash.jsx` | ✅ Done — **Figma-verified** (node `451:13758`) |
| Onboarding 1 | `screens/onboarding-1.html` + `.jsx` | ✅ Done, illustration landed — **Figma-verified** (node `451:13808`) |
| Onboarding 2 | `screens/onboarding-2.html` + `.jsx` | ✅ Done, illustration landed — **Figma-verified** (node `451:13841`) |
| Onboarding 3 | `screens/onboarding-3.html` + `.jsx` | ✅ Done, illustration landed — **Figma-verified** (node `451:13823`) |
| Home | `screens/home.html` + `home.jsx` | ✅ Rebuilt end to end — **Figma-verified** against `509:19053`; every section lands on the node's y to <0.1px |
| Product — Photo Book | `screens/product-photobook.html` + `.jsx` | ✅ Rebuilt — **Figma-verified** (node `406:7183`) |
| Editor | `screens/editor.html` + `editor.jsx` | ✅ Built — **Figma-verified** (node `451:15574`) |
| Editor — page view | mode of `editor.jsx` | ✅ Built — **Figma-verified** (node `451:14499`) |
| Editor — choose layout | mode of `editor.jsx` | ✅ Built — **Figma-verified** (node `451:14921`) |
| Editor — photo selected | mode of `editor.jsx` | ✅ Built — **Figma-verified** (node `451:14611`) |
| Editor — arrange mode | mode of `editor.jsx` | ✅ Built — **Figma-verified** (node `451:15148`) |
| Photo sources | `screens/photo-sources.html` + `.jsx` | ✅ Built — node `451:14202`; 2 of 8 covers verifiable, see below |
| Image Picker | `image-picker/index.html` (pre-built, frozen) | ✅ Wired in |
| Basket | `screens/basket.html` + `basket.jsx` | ✅ Done |
| Checkout — Delivery | `screens/checkout-delivery.html` + `.jsx` | ✅ Done |
| Checkout — Payment | `screens/checkout-payment.html` + `.jsx` | ✅ Done |
| Order Success | `screens/order-success.html` + `.jsx` | ✅ Done |
| Account | `screens/account.html` + `account.jsx` | ✅ Rebuilt end to end — **Figma-verified** (node `451:14038`) |

### Possible next tasks

- **Figma fidelity pass** — query Figma node IDs (see table below) to tighten colors, spacing, typography to exact Figma spec. Screens built from verbal descriptions rather than direct Figma calls due to MCP availability.
- **Transition polish** — add push/pop slide animations between screens (navigation.js stubs are in place; CSS transitions not yet wired to the iframe-swap mechanism).
- **Editor tools** — the book view's six are inert except **Arrange**, which opens arrange mode (`451:15148`); page view's eight are inert except **Layout**, which opens the choose-layout drawer (`451:14921`); and the selected-photo row (`451:14611`) is inert except **Back**, which deselects. The card's settings icon and the header's Continue arrow are inert for the same reason.
- **My Photos tab** — superseded: the tab bar is now Home / Projects / Memories / Account
  (`509:19230`). The account screen's "My photos" row points at `photo-sources.html`. If a
  standalone grid distinct from the picker is needed, create `screens/my-photos.html`.
- **Orders screen** — the redesigned account page replaced its inline order list with a
  "My orders" row that has nowhere to go. `MOCK.account.orders` is still there for it, and
  home's order-tracking banner currently points at `account.html` for want of anything better.
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
| Splash screen | `451:13758` | ✅ Built — matches Figma (pixel-diffed, mean Δ 1.6/255) |
| Onboarding slide 1 (emotional) | `451:13808` | ✅ Built — matches Figma; art `451:13809` |
| Onboarding slide 3 (notifications) | `451:13823` | ✅ Built — matches Figma; art `451:13824` + `451:13838` |
| Onboarding slide 2 (collections) | `451:13841` | ✅ Built — matches Figma; art `451:13842`/`13843`/`13855` + labels |
| Home screen | `509:19053` | ✅ Rebuilt — supersedes `451:13862`; all sections verified |
| Home — promo banners | `509:19066` | ✅ Built (was `451:13875`) — matches on every value |
| Home — status banners | `509:20175` | ✅ Built — order tracking + continue editing |
| Home — Create grid | `367:6068` | ✅ Built |
| Home — Memories | `509:19080` | ✅ Built — reuses the shared collection covers |
| Home — Collections | `509:19224` | ✅ Built — Trip books / Year books |
| Home — Ideas | `509:20176` | ✅ Built — ⚠️ the node's four cards have no artwork yet |
| Home — Ask AI | `509:20290` | ✅ Built |
| Home — tab bar | `509:19230` | ✅ Built — iOS-26 floating liquid-glass pill |
| Photo book page | `406:7183` | ✅ Built — matches Figma (hero `406:7432`, options `406:7220`) |
| Photo book — format chooser | `451:13426` | ✅ Built (Figma not queried) |
| Photo book — configure (scrollable) | `451:13491` | ✅ Built (Figma not queried) |
| Photo book — configure variant | `451:13606` | ✅ Built (Figma not queried) |
| Photo book — CTA screen | `451:13721` | ✅ Built (Figma not queried) |
| Editor | `451:15574` | ✅ Built — matches Figma (pixel-diffed; see below) |
| Editor — page view | `451:14499` | ✅ Built — page, navigator and toolbar all land on the node's numbers |
| Editor — choose layout drawer | `451:14921` | ✅ Built — drawer, chips and cards land on the node's numbers; only its "2 photos" tab is designed |
| Editor — photo selected | `451:14611` | ✅ Built — ring and selection toolbar exact; its navigator omission not carried over |
| Editor — arrange mode | `451:15148` | ✅ Built — drag/drop, tap-to-swap and spread reorder; its duplicated scratch blocks not carried over |
| Account / Profile | `451:14038` | ✅ Rebuilt — matches Figma; every band lands on the node's y exactly |
| Photo sources (Album / My trips) | `451:14202` | ✅ Built — Albums grid exact; 6 of 8 covers unverifiable |
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
│   ├── assets/                  ← brand assets exported from Figma
│   │   ├── teachers-variable-latin.woff2   ← wordmark face (self-hosted, offline-safe)
│   │   ├── splash-star-*.svg    ← 5-layer glowing sparkle (base + 4 glow bleeds)
│   │   ├── icon-notification.svg
│   │   └── create-*.png         ← 5 product shots for the Create grid (transparent)
│   ├── brand.jsx                ← PhotoboxLogo (scale-driven), PhotoboxStar,
│   │                               GlassIconButton
│   ├── collections.jsx          ← the eight "Smart Stories" covers + CollectionCard,
│   │                               shared by photo-sources and home → Memories
│   ├── onboarding-shell.jsx     ← shared onboarding layout: OnboardingShell,
│   │                               GalleryIndicator, PB_DISPLAY font stack
│   ├── ios-frame.jsx            ← iOS component library
│   │                               Exports: IOSDevice, IOSStatusBar, IOSNavBar,
│   │                               IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
│   ├── tab-bar.jsx              ← the floating iOS-26 glass tab bar, shared by
│   │                               home and account (TabBar, TAB_BAR_HEIGHT, TABS)
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
│   ├── editor.html + editor.jsx
│   ├── photo-sources.html + photo-sources.jsx
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

> **⚠️ `image-picker/` is frozen.** When the main flow reaches the image picker step, navigate to `../image-picker/index.html`. Two changes have been made on request, and they are the only ones:
> 1. `onContinue` hands the selection to the editor (`sessionStorage.pb_photos`) and
>    returns to `../screens/editor.html` — it used to jump straight to the basket.
> 2. The **Back** button is now the shared glass control and navigates up to
>    `../screens/photo-sources.html`. `index.html` loads `../shared/brand.jsx` for it,
>    and the `?v=` query on its scripts was bumped to 17.

---

## Known Implementation Decisions & Gotchas

### Image picker → basket navigation
The image-picker has no `navigation.js` loaded, so `window.navigation` doesn't exist there. The `onContinue` handler uses raw navigation:
```js
sessionStorage.setItem('pb_nav', 'push');
window.location.href = '../screens/basket.html';
```

### ⚠️ `min-height: 100vh` on html/body is what makes the iOS PWA full-screen
The bottom band reported on device — every screen ~59px short, with a strip of flat
page background under the content — is **not** a layout bug in the screens. It is the
iOS standalone PWA handing the page a layout viewport shorter than the screen, and the
only thing that changes it is the html/body sizing. Measured in the PWA on an iPhone
430×932 (`diag.html`, five recipes auto-measured back to back):

| html/body recipe | `viewport-fit` | `innerHeight` | `fixed;inset:0` | env T/B | `100vh` |
|---|---|---|---|---|---|
| `height: 100%` | cover | 873 | 873 | 59 / 34 | 932 |
| **`min-height: 100vh`** | **cover** | **932** | **932** | **59 / 34** | **932** |
| `height: -webkit-fill-available` | cover | 873 | 873 | 59 / 34 | 932 |
| `height: 100%` | — | 873 | 873 | **0 / 0** | 873 |
| `min-height: 100vh` | — | 873 | 873 | **0 / 0** | 873 |

So: `min-height: 100vh` + `viewport-fit=cover` is the **only** combination that yields
the full 932. `shared/styles.css` therefore carries
`html, body { min-height: 100vh }` and `#root { width:100%; min-height:100vh }` — which
is verbatim what `image-picker/index.html` has always done, and why the picker was the
one screen that never showed the band. Its inline comment ("no height/overflow
constraints on html/body") is load-bearing, not incidental.

Things that look like fixes and are not:
- **`height: 100vh` on the wrapper instead of `inset: 0`.** Tried on device: with the
  short 873 viewport the region below it is not paintable by page content, so a
  932-tall wrapper simply pushes everything anchored to its bottom 59px past the
  visible edge — bottom CTAs came out sliced in half. The strip becomes paintable only
  once the *viewport itself* is 932, i.e. once the recipe above is in place. Wrappers
  stay `position:fixed; inset:0`.
- **Dropping `viewport-fit=cover`.** It does make the band disappear, which is a
  tempting dead end: it also zeroes every `env(safe-area-inset-*)` and shrinks `100vh`
  to 873, so every safe-area inset in the app silently collapses to 0.
- **`dvh` / `svh` units.** Both are the short viewport (872.98). Only `vh`/`lvh` report
  the full screen.

⚠️ The recipe leaves the document taller than `documentElement.clientHeight`, so the
page itself is scrollable by the 59px difference (`scroll: yes` in the measurement).
The picker has always been in that state without trouble — every screen's wrapper is
`overflow: hidden` and touches land on inner scrollers — but if a page-level drag ever
shows up on a screen with no inner scroller, that is where it comes from.

### ⚠️ Never animate `<body>` — the nav transitions run on `#root > *`
Separate from the gap above, and still a real hazard.
`animation-fill-mode: both` keeps the last keyframe applied **forever**, so a
`transform: translateX(0)` on `<body>` is permanent, not just for the 320ms — and a
transformed `<body>` is the containing block for every screen's fixed wrapper. Both
the enter animations (`styles.css`, `[data-nav='…'] #root > *`) and the exit
animations (`navigation.js` → `animateOut`) therefore target the **screen wrapper**.
That is safe because a fixed element's own transform does not affect its own box.

- `animateOut` sets `style.animation` only. The old code used `style.cssText`, which
  on the wrapper would wipe React's inline `position:fixed`/background.
- `html, body { height: 100% }` used to be load-bearing as a workaround for the
  collapse-to-0 symptom of this; it no longer is, but is harmless and kept.

Verified across all 13 screens: `animation` and `transform` on `<body>` are both
`none`, the splash→onboarding `replace` path lands `fadeIn` on the wrapper, and
`pop()` animates the wrapper while leaving its React inline styles intact.

### Every screen root div needs `position:'relative'`
CTAs are `position:'absolute'; bottom:0` — they anchor to the nearest `position:relative` ancestor. Without it on the root div, CTAs can escape to the IOSDevice frame boundary on desktop. Every screen component's outermost `<div>` must have `position:'relative'`.

### Back button vs general tappable elements
- **Back/icon buttons**: `scale(0.9)` on pointerDown
- **All other tappable elements** (CTAs, cards, rows): `scale(0.97)` on pointerDown
- Both need: `onPointerUp/Leave` → `scale(1)`, `transition:'transform 140ms ease'`

### IOSListRow does not accept a `style` prop
When you need custom styling on a list row, render it as a plain `<div>` with manual press
state handlers instead of using `IOSListRow`. ⚠️ The account screen no longer uses
`IOSList`/`IOSListRow` at all — Figma `451:14038` replaced the iOS inset-grouped list with
its own `PB3/AccountRow` card, built in `account.jsx`.

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

### Brand wash gradient
`shared/styles.css` holds the stop list once as `--pb-wash-stops`; each screen
supplies its own geometry so the same wash can be re-centred per screen:
```js
// splash (451:13758) — centred
'radial-gradient(661.83% 92.48% at 50% 50%, var(--pb-wash-stops))'
// onboarding (451:13808) — pushed down, deep teal behind the white copy
'radial-gradient(815.74% 113.98% at 50% 88.68%, var(--pb-wash-stops))'
```
Both sit on a `#EBF7F8` base. Stops come from Figma dev-mode CSS (5 stops); the
Figma canvas paint has 3 extra mid stops, worth ~Δ9/255 in the mid-band.

### Onboarding display font
Figma specifies **Google Sans Flex**, which Google does not distribute on Google
Fonts. `shared/assets/dmsans-variable-latin.woff2` (DM Sans, OFL) is the
self-hosted stand-in and is second in the `PB_DISPLAY` stack. To go exact: drop
`google-sans-flex.woff2` into `shared/assets/` and uncomment its `@font-face` in
`styles.css` — it is first in the stack, so it takes over automatically.

### Onboarding copy & the two documented deviations
Copy is verbatim from the Figma nodes (slide 1 keeps Figma's explicit line break;
all three CTAs read "Continue"). Two values intentionally differ from the node,
both consequences of the Google Sans Flex substitution or of leading:

- **Subhead leading 24px, not Figma's inherited 40px.** 40px is invisible on
  one-line copy but blows out the moment the body wraps. Because the panel is
  bottom-anchored, tightening the line box pulled the stack 15px down, so the copy
  block carries `marginBottom: 8` and an internal gap of 24 (Figma: 16). Verified
  against the Figma render: headline within 1px, subhead and CTA exact.
- **Headline tracking -0.2px.** DM Sans is a shade wider than Google Sans Flex —
  slide 3's second line measured exactly 350px against 350px available and wrapped
  to a third line. Remove this once the real font is in place.

### Onboarding illustrations (Figma `451:13809` / `451:13841` / `451:13824`)
The three slides had an empty art slot until now. Each one is a different kind of
problem, and the shell grew one prop to serve all three.

#### `OnboardingShell` gained a `foreground` slot, and paint order is load-bearing
Figma does **not** paint each slide's illustration as one layer behind the copy panel.
On slide 2 the two back album tiles sit before the panel and the front tile plus both
labels sit *after* it; on slide 3 the notification stack sits after it. So the shell
takes two art slots — `children` (behind) and `foreground` (in front) — and wraps each
in `ART_FRAME`.

`ART_FRAME` is a 390-wide box centred with `left: 50%; translateX(-50%)`, so every
illustration coordinate can be lifted verbatim from the 390-wide Figma frame and the
whole composition still centres on a 430 phone instead of hugging the left edge. It
carries `pointerEvents: 'none'` — without that the foreground layer, which paints
*above* the panel, would swallow taps meant for the CTA. Verified by hit-test:
`elementFromPoint` at the CTA's centre returns the button on all three slides at both
390×844 and 430×932.

Everything is top-anchored at the design's y, matching the frames. The panel stays a
fixed 484 tall, so on a taller phone the art keeps its distance from the status bar and
the extra height opens up between the art and the copy.

#### Slide 1 — one masked product collage (`451:13809`)
A single Gemini-generated cut-out (`451:13811`) at `left 27, top 78, 336×450`, with its
sibling rectangle `451:13810` acting as an **alpha mask**: a vertical gradient, opaque
until group y=375 and clear by y=502.738. The image starts at y=78, so in image-local
pixels the ramp is 297 → 424.74, and it ships as a CSS `mask-image` rather than baked
into the file — the artwork stays a plain cut-out and the fade always dissolves into
whatever the live wash is doing behind it.

That ramp was not taken on trust. Recovering the alpha out of Figma's own render —
`(render − wash) / (artwork − wash)` at every fully-opaque pixel of each row — matches
the linear model to within **0.008** from y=380 to y=480.

#### Slide 2 — three album tiles and two labels (`451:13841`)
⚠️ **All three tiles are the same photo.** One 1024×1536 shot of the couple in
Florence, cover-cropped into three different boxes. It reads as three different
pictures on the canvas only because the front tile hides the middle of the other two —
don't go looking for two more source images.

- Tiles are `border-box` with a 2px `#F4F4F4` ring (Figma's inside stroke) and r24, so
  `overflow: hidden` clips the photo to the inner r22 for free.
- The two back tiles carry Figma's 2px layer blur as a plain CSS `filter: blur(2px)`.
- Labels are auto-width pills, 42 tall (1px rim + 8px padding + 24px icon), SF Pro Text
  Semibold 13/18 at −0.08. Their shadow must be `filter: drop-shadow()`, not a
  `box-shadow` — same reason as the home banner strip: Figma's shadow follows the
  pill's own 90% alpha rather than shading the border box.
- Geometry is expressed as `bbox` + `box` + `rot` per the rotated-node convention above.

Front-tile edges land within 1px of the node's render (left border at x=88 against
Figma's 87.x — sub-pixel rounding on the 87.68 dev-mode origin).

#### Slide 3 — the iPhone mockup (`451:13824`) and the notification stack (`451:13838`)
The phone is a ~30-layer vector mockup ("iPhone 17 Pro Silver") under a 2px layer blur
and a gradient alpha mask, so it ships as one 3× WebP instead of being rebuilt in code.
Getting a *transparent* 3× render of it is the whole story of the export-route table
above — read that before re-exporting it.

⚠️ **The SVG frame is 289×507, not the mask group's 288.123×504.** Figma pads the
export for the blur bleed, putting the content 2.28px down from the frame's top, so the
render's origin is frame `(51.4385, 105.72)` — *not* the mask group's `(51.4385, 108)`.
Place it at 105.72 or the phone sits 2px low.

The notification pair is two cards centred on x=195.5: `451:13839` (289 wide, top 288,
behind) and `451:13840` (341 wide, top 269, in front). The front card is both wider and
19px higher, so the one behind peeks out along the bottom — the iOS notification stack.
Measured against the node: front card top edge 268=268, left edge 24=24, back card
bottom edge 342=342.

Two deviations, both flagged in code:
- **The white fill is not `mix-blend-mode: luminosity`.** Figma layers white at 0.7/0.8
  on luminosity; WebKit cannot blend that across a composited layer boundary (see the
  editor's Continue button for the same trap). A translucent white over a real
  `backdrop-filter: blur(18px) saturate(120%)` lands on the same frosted card and is
  what an iOS notification actually is.
- **Type is the system stack, not Open Sans.** Open Sans is not among the faces this
  project self-hosts, and a real iOS notification is SF Pro anyway.

#### Assets
| file | what | size |
|---|---|---|
| `ob-products.webp` | slide 1 collage, 1008×1350, alpha | 220KB |
| `ob-album-photo.jpg` | slide 2 photo, 617×750 (3× of the front tile) | 93KB |
| `ob-icon-trips.svg` / `ob-icon-photos.svg` | the two label icons, 24px | 2KB each |
| `ob-phone.webp` | slide 3 phone, 867×1521, alpha, mask + blur baked | 59KB |
| `ob-notif-icon.png` | notification app icon, 114×114 | 12KB |

Both alpha images are **WebP**, for the reason the collection cut-outs already are: a
large opaque subject on transparency is PNG's worst case — the collage is 1.6MB as a
PNG against 220KB here, the phone 511KB against 59KB. Encoded with `-alpha_q 100`, so
the alpha is lossless: the phone's fade ramp round-trips bit-exact at every sampled row
(255/250/133/75/36/0) and RGB RMSE is 0.85%.

⚠️ `ob-album-photo.jpg` is pre-cropped to the tiles' 0.8227 aspect. All three tiles
share that aspect, so one crop serves them; change a tile's proportions and the photo
needs re-cropping, not just re-framing.

#### Verified
All three slides render at 390×844 within a 1.7–6.7% band of the Figma frames, and the
residual is accounted for: slide 1 is clean (no diff pixels above a 12% fuzz), slide 2
is edge-texture from recompressing the photo, slide 3 is the notification type
substitution. Every image loads, no horizontal or vertical page overflow at 390×844 or
430×932, the CTA hit-tests through the foreground art layer, and the desktop
`IOSDevice` frame is unaffected.

#### ⚠️ A collection cover is a photo *sandwich*, not a photo with text on it
The single biggest thing to know about `CollectionCard`. Each cover in the node layers
**three** images, and the display word is painted *between* two of them:

```
full photo (photoRect, deliberate overscan)
top blur band            ← blur 11.681
display lines            ← "CANADA" / "Italy"
alpha CUT-OUT of the subject   ← this is the layer that was missing
lines marked `above`     ← Italy's "Hiking in"
bottom blur band         ← blur 1.498, marked `above`
month caption
```

That cut-out is what puts the straw hat in front of the "A D" of CANADA and the stone
tower in front of "Ital". Without it the word sits flat on the photo **and** the whole
lower half of the card is left sitting under the bottom blur band with nothing sharp
on top of it — which is exactly why the cards read as blurred and broken once they
landed on home's light page.

Fields on a collection entry, all optional:

| field | what it does |
|---|---|
| `w` | per-card width override (Canada/Italy are 229.58, the rest `CARD_W` 205.58) |
| `photoRect` | the node's own `left/top/w/h` for the base photo — an overscan, not a cover fit |
| `photoBox` | centred + rotated variant (Cappadocia only) |
| `cutout` | `{src, left, top, w, h, imgHeight, imgTop}` — the occluding alpha layer |
| `above` on a band or a line | render it *after* the cut-out instead of before |

⚠️ **Only Canada and Italy carry `cutout`/`photoRect`/`w`.** Figma clips exports to the
containing frame and the other six covers fall outside it — their layer stacks cannot
be read, so they keep the single-cover-photo fallback. They will look flatter than the
two verified cards until the designer brings them on-frame. `above` defaults to false
precisely so those six render exactly as they did before.

#### ⚠️ The rim is an inset shadow, not a border
As a `border` it sits *outside* the photo (which is `inset: 0`, i.e. the padding box),
so the node's `rgba(255,255,255,0.12)` ring rendered as the card's own `#111`
background lifted 12% toward white — a near-black frame. Invisible on the
photo-sources screen, whose page is dark; a hard black border once the same card
landed on home's light page. `inset 0 0 0 2px` paints it *over* the photo and it
becomes the subtle white highlight the node actually specifies.

#### Cover photos are sized for 3× now
They were 495×660 / 660×371 against a 617×966 slot — a 1.5–2.6× upscale, which is what
made the cards look soft next to Figma's render. All six were re-exported from the raw
Figma fills, centre-cropped to their card's aspect and resampled to exactly 3× of the
box they fill (617×966, or 702×987 for Cappadocia's rotated `photoBox`, or the layer
box for Canada/Italy). Measured against the node, normalised sharpness went from
0.307 to 0.350 against its 0.397 in the unbanded strip.

⚠️ Because they are pre-cropped to the card's aspect, **changing `CARD_W`/`CARD_H` now
re-crops the photos** rather than just re-framing them. Re-run the export if the card
geometry changes.

**The two cut-outs are WebP.** `pb-cut-canada.webp` is 98KB where the same cut-out as a
PNG is 867KB — a large opaque subject on transparency is the worst case for PNG. WebP
with alpha has been in Safari since iOS 14, so it is safe for this PWA; it is the only
place the project uses the format.

### Home page, rebuilt against Figma `509:19053`

The home screen now follows one node end to end. **`509:19053` supersedes
`451:13862`** — same screen, 3430 tall instead of 844. Section order and every
vertical offset were verified by measuring the rendered boxes in a real 390px
viewport:

| section | component | node | node y | measured y |
|---|---|---|---|---|
| header | inline in `HomeScreen` | `509:19056` | 56 | 56 |
| promo banners | `BannerRow` | `509:19066` | 120 | 120 |
| status banners | `StatusBanners` | `509:20175` | 296 | 296 |
| Create | `CreateSection` | `509:19077` | 504 | 504 |
| Memories | `MemoriesSection` | `509:19080` | 1321.21 | 1321.2 |
| Collections | `CollectionsSection` | `509:19224` | 1723.07 | 1723.0 |
| Ideas | `IdeasSection` | `509:20176` | 2073.07 | 2073.0 |
| Ask AI | `AskAISection` | `509:20290` | 2773.07 | 2773.0 |

**Every section is separated by 24px**, expressed as `marginBottom: 24` on the
section itself (including `CreateSection`, which needed it added). If a new section
goes in, give it the same 24 or everything below it shifts.

⚠️ **`FeaturedSection` ("Your projects") is gone.** The new design replaces that
hand-written list with the two status banners, which occupy the same slot.

#### Status banners — `509:20175`
An order-tracking card (92 tall) and a continue-editing card (84), stacked with an
8px gap. White, r20, `padding: 12px 16px`, `flex` row with `gap: 20`. Tracking →
`account.html` (its order list is the nearest destination this prototype has),
editing → `editor.html`; neither link is in the node.

- **Every text line is a 16px-tall box holding an 18 or 20px line, centred.** That
  is what makes the copy blocks 34 and 36 tall rather than the 40 and 42 natural
  leading gives, and it is what lands the cards on the node's 92 and 84.
  `StatusLine` reproduces it; collapsing it to a bare `<p>` grows both cards.
- **The 1px white rim is an inset shadow, not a border.** With `padding: 12px 16px`
  and an auto height, a real border adds 2px and the cards come out 94/86. Same
  trick the editor's sheets use.
- The progress rail is four 16px step icons joined by three 2px rails; the icons
  carry their state colour from Figma (teal for the three reached steps, `#CCC` for
  Home) and the last rail is the node's own half-done gradient.

#### Section headers — `509:20182` / `509:20185`
`SectionHeader({ icon, title, seeAll })`: 40 tall, `gap: 16` to "See all", title
group `gap: 4` so a 24px icon sits tight against the text. Title metrics are the
page's existing heading (24/40 −0.24 `#333`); "See all" is 16/40 −0.16 in the brand
teal. `CreateSection` still has its own inline heading — it predates this and is
pixel-verified, so it was left alone.

#### Memories reuses the photo-sources covers — `shared/collections.jsx`
Home's Memories row and the photo-sources Collections row are **the same eight
"Smart Stories" covers**, so `A`, `TEXT`, `COMPACT`, `F`, `CARD_W`, `CARD_H`,
`Band`, `CardLine`, `COLLECTIONS` and `CollectionCard` moved out of
`screens/photo-sources.jsx` into `shared/collections.jsx` verbatim. Both screens
load it after `ios-frame.jsx` (which defines the `press()` it uses) and after
`brand.jsx`.

⚠️ These are top-level `const`/`function` declarations in a classic script, so they
land in the **global lexical scope**. Any screen loading `collections.jsx` must not
redeclare those ten names — the same collision trap as `PB_DISPLAY`.

The home node widens its first two covers to 229.58 while the rest stay 205.58, and
that is now honoured via the per-card `w` field — the node's layer offsets for those
two are authored against 229.58, so porting them verbatim needs the real width.

#### Collections — `509:19224`
Two 267×270 white r24 cards, `gap: 8` → 542 wide, so the row scrolls.

- **"Trip books" reuses the promo banner's 1080² cover-template source**, cropped by
  Figma to a two-row band. Here the node export *was* usable as-is, unlike the
  banner's: the card is solid `#FFFFFF`, so the background Figma bakes into the
  export matches exactly, and the r24 corner it also bakes lines up with the card's
  own clip. Only the 1px the artwork overhangs the card's bottom edge was trimmed.
  Being opaque, it ships as a 132KB JPEG rather than a 445KB PNG — verified that
  every sampled background pixel is still exactly 255.
- **Card shadow is an addition.** `509:19227` / `509:20378` are flat; without the
  page's standard `0 4px 16px -1px rgba(0,77,74,0.1)` the two read as holes.

#### Ideas — `509:20176`
Header, then a `gap: 24` column: an audience chip row (scrolls, 523 > 390), a 2×2
grid of 223-tall cards, and a full-width 72-tall "Show all" button in **Teachers
Bold** — the brand wordmark face, already self-hosted.

⚠️ **The four idea cards have no artwork in the design.** `509:20179` and its three
siblings are white cards with empty image wells and only the caption filled in. They
are built that way rather than inventing product shots — drop an `<img>` into the
well above the caption once the design has them.

The "For dad" chip carries a 1px `#CCC` rim and no fill, which makes it 42 tall
against its siblings' 40. Kept; the row centres them.

#### Ask AI — `509:20290`
A 393-tall r24 card: the teal wash, the brand sparkle, a display headline, three
suggestion chips and an inert text field. Everything inside sits on the node's own
absolute coordinates.

- **The sparkle is the splash lockup's star**, via the new `PhotoboxStar` in
  `brand.jsx` — no ninth star asset was added. `PhotoboxStar` expresses the splash
  geometry as ratios of the base glyph's 31.6722 width (each glow layer is
  `base + 2 × spread` wide, offset `-spread`), so it renders at any size.
  The Ask-AI call site adds `filter: drop-shadow(0 0 4px rgba(255,255,255,0.55))`
  because the splash glow spreads its bloom over ~82px, which reads too diffuse on a
  mid-teal ground: sampled against the node, the ring at r≈20 was (98,186,188)
  against its (118,226,230) while r≥30 already matched. With the drop-shadow the mean
  deviation over r=20..60 is ~19/255.
  ⚠️ The residual is the **glyph**, not the glow — the node's app-icon star is a
  slightly different drawing (solid half-extents up/down/left/right: node
  15/14/17/15, this 18/15/16/14).
- The node's suggestion row is wider than the card and clips its last chip; made
  scrollable so all three stay reachable.

#### ⚠️ A rotated Figma gradient: use Figma's own SVG, not a CSS approximation
The Ideas active chip and the Ask-AI card share one 8-stop radial gradient whose
ellipse is heavily elongated **and rotated** — the Ask-AI matrix decodes to
192% × 673% at about 65°. `radial-gradient` in CSS cannot rotate, and sampling the
node's render showed the un-rotated approximation puts the dark ridge on the wrong
diagonal entirely (measured darkest point at the right edge 75% down, where the
approximation put a mid tone).

Both therefore use **the inline SVG Figma itself emits** as a `background-image`,
which carries `gradientTransform` verbatim. `tealWash(w, h, matrix)` in `home.jsx`
builds it from one shared stop list. Decoding the matrix, for reference: for
`matrix(a b c d e f)` with `r='10'`, the ellipse is centred at `(e, f)` with
semi-axis vectors `(10a, 10b)` and `(10c, 10d)`.

The last stop is transparent, so whatever is behind shows through at the edges —
deliberate, and it is why the Ask-AI card has no solid background of its own.

#### Tab bar — `509:19230`: the iOS-26 floating glass pill
Not the old edge-to-edge bar. 16px above, 25px below, 25px gutters, and a 340×50
r25 pill carrying four tabs — **Home / Projects / Memories / Account**, replacing
Home / Create / My Photos / Account. Projects → `editor.html` (no projects screen
exists; the editor holds the in-progress book, which is where the "Continue editing"
banner goes too), Memories → `photo-sources.html`, Account → `account.html`.

**Content scrolls underneath it.** The scroller is now `inset: 0` rather than
stopping above the bar, and the content ends with a `calc(8px + TAB_BAR_HEIGHT)`
spacer. That is both the iOS-26 behaviour and the only way the glass has anything to
refract — with the old `bottom: calc(49px + …)` the pill would sit over flat page
colour and the effect would be invisible.

`TAB_BAR_PAD_BOTTOM` is `max(25px, env(safe-area-inset-bottom) + 8px)`: the node's 25
is the home-indicator gap on a frame with no safe area, so it becomes the floor.
`TAB_BAR_HEIGHT` is `calc(66px + …)` — 16 top + 50 pill.

The node's BG is Apple's `LiquidGlassRegularSmall` (Light), which does not exist in
this codebase, so the pill is layered by hand the same way `GlassIconButton`'s
`gloss` variant is — and for the same reason: every refraction-based glass library
gets its lensing from `backdrop-filter: url(#svgFilter)`, which WebKit silently
no-ops. Two differences from the `gloss` recipe, both because this glass sits on a
**light** page rather than the near-black editor header:

- the interior needs a real white tint (`rgba(255,255,255,0.55)`) — the header's
  near-clear `0.03` is invisible here;
- the rim composites **normally**, not with `plus-lighter`, which on a near-white
  backdrop clips straight to white.

`saturate` is held at 130%: the page behind is a pale teal wash and white cards, and
a bigger boost tints the glass green — the same finding CLAUDE.md already records for
the home header's bell.

The selection pill is the node's `inset: 0 -2px` / r100, but with a translucent
`rgba(120,120,128,0.12)` instead of the flat `#EDEDED` the node resolves Apple's
vibrant-tertiary fill to. It lands on the same colour over this page while letting
the glass still read through.

⚠️ **Only the Home icon has a selected state.** Figma ships one variant per icon —
`hb-tab-home.svg` is the filled teal glyph, the other three are dark outlines. The
selection pill and the teal label follow `activeTab`, but a non-Home tab navigates
away immediately, so the missing filled variants never show. Pull the other three
selected variants from Figma if that changes.

⚠️ The node's tabs carry `mr: -8` so they overlap by their 8px side padding. Four
equal quarters put the centres within 3px (69/153/237/321 against the node's
72/154/236/318) and keep the selection pill symmetric, so that is what is used.

#### Verified
No horizontal page overflow (`documentElement.scrollWidth === clientWidth`), all 42
images load, all five horizontal scrollers actually scroll, the glass pill measures
340×50/r25 with its backdrop filter live, and `photo-sources.html` still renders its
eight collection cards after the extraction.

### Home promo banners (Figma `509:19066`, was `451:13875`)
The two cards that used to be empty placeholders at the top of home. Row is
`display:flex; gap:8` in the page's 20px gutters: two 283×152 cards = 574 against a
350 content width, so it scrolls horizontally **by design** — the node's own frame is
350 wide with both children overflowing it. Card chrome (r24, 1px white rim,
`0 4px 16px -1px rgba(0,77,74,0.1)`, the white radial fill at 90% folded into the
stops) is unchanged from the placeholders; only the size grew from 267×136 and the
content arrived.

- **"Collect them all"** (`508:18140`) — 185-wide centred copy at y=15, and a
  full-width 283×88 travel-covers strip flush with the card's bottom and side edges.
- **"Golden days, bound to last"** (`509:18239`) — 150-wide copy at 19/31 (gap 8,
  headline wraps to two lines, the subhead's break is the node's own), and a 143×134
  window at 139/17 flush with the card's right and bottom edges holding the product
  shot at 112.54% height, which crops the hands' wrists at the card edge.

Verified by measuring the rendered boxes against the node: card 283×152/r24/1px, strip
0/64/283×88, copy blocks 49/16/185×40 and 20/32/150×88, image window 140/18/143×134,
row top at page y=120, and `documentElement.scrollWidth === clientWidth` (no
horizontal page overflow).

#### ⚠️ Offsets from `get_design_context` are padding-box, `get_metadata` is frame-box
The two tools disagree by exactly the 1px rim and **both are right**. Dev-mode CSS
measures from the padding box — inside the border — which is precisely what CSS
absolute positioning uses on a bordered `position:relative` box. So the node's
`left:139` renders at 140 in frame coords, matching `get_metadata`'s `x=140`, and the
strip's `left:-1; bottom:-1` lands flush with the card's outer edge. Use the
dev-mode numbers verbatim in CSS; do not "correct" them to the metadata values.

#### ⚠️ For a ROTATED node the two disagree by much more, and again both are right
`get_design_context` reports the **rotation bounding box origin**; `get_metadata`
reports the **rotated node's own top-left corner**. On the onboarding album tiles that
is a 14px gap in x (`451:13843`: dev-mode `left: 238`, metadata `x = 252.634`) and up
to 7px in y — big enough to look like a bug rather than a convention.

Reconcile them before trusting either: bbox centre + `R(θ)·(−w/2, −h/2)` must land on
the metadata corner. Verified for all three tiles to <0.01px. The dev-mode number is
the one to use, with Figma's own markup shape — a bbox-sized wrapper that flex-centres
the child, and `transform: rotate()` on the child. That also makes the placement
robust: a child whose intrinsic size drifts (a label re-measuring its text) stays
centred instead of walking off the design position.

#### ⚠️ Figma flattens node exports against the canvas — crop the raw fill instead
`download_assets` on the covers strip (`508:18141`) returned a correctly-cropped
283×88 PNG that was **fully opaque**: the card's background was baked into the strip's
transparent upper half (234,234,234) and the Figma canvas grey into the corners
outside the card radius (46,46,46). Dropped into the app that reads as a grey
rectangle seam where the strip starts. Alpha was 255 at every sample — worth checking
before trusting any node export that is supposed to have transparency.

The fix is to crop the artwork out of the **raw fill** instead, which does carry alpha.
The fill is a 1080×1080 Canva stock sheet ("30 photo book cover templates"); the
designer's crop is `x 0→1080, y 279→615`, scaled to 283×88. That offset was solved
rather than guessed — the top-most opaque row of each column was matched against the
same column in Figma's own render, over 115 columns, giving a median crop-top of 279
and a median residual of **0px** after the crop. `banner-photobook.png` is likewise
the raw cut-out (a node export there had the card's rounded corner and white rim
baked in), resampled to 429 wide.

#### ✅ …but `get_screenshot` with `contentsOnly: true` DOES come back transparent
The escape hatch, found while pulling the onboarding phone mockup. Same node, three
routes, three different answers:

| route | transparency | resolution |
|---|---|---|
| `download_assets` (png, any scale) | ❌ canvas + frame baked in, alpha 255 everywhere | any scale |
| `download_assets` (svg) | ⚠️ canvas rect and frame background emitted as real elements | vector |
| `get_screenshot` `contentsOnly: true` | ✅ true alpha | **1× only** |

`maxDimension` only ever *caps* the longer edge — it never upscales, so `get_screenshot`
tops out at the node's natural size and cannot give the 3× this project needs.

For a 3× transparent render of a vector node, the working recipe is the SVG export
plus a headless-Chrome rasterise:
1. `download_assets` with `defaultFormat: 'svg'`.
2. Strip the background elements Figma prepends — the `<rect>` filling the whole
   viewBox with the canvas grey, the section's own `<path>`s, and the frame's
   `translate(...)` background rects. Everything from `<g id="Mask group">` (or
   whatever the real content group is) onward is what you want, plus `<defs>`.
3. Render it in Chrome at the target size with `--default-background-color=00000000`
   and `--screenshot`. Verify with a `contentsOnly` 1× render as the control.

⚠️ Check the alpha, not the thumbnail. A baked export looks *correct* against the
teal wash it was flattened over and only betrays itself once the page it lands on
scales that wash differently.

#### The strip's shadow must be a `filter`, not a `box-shadow`
`508:18141` carries `0 4px 4px rgba(0,0,0,0.25)`. In Figma that is a drop shadow, so
it follows the artwork's alpha and shades under each individual book. A CSS
`box-shadow` shades the *border box*, which on a transparent PNG paints a dark band
straight across the strip's empty upper half. It has to be
`filter: drop-shadow(...)` on the `<img>`.

#### Not in the design
- **Destination.** Neither node carries a link. Both banners promote photo books, so
  both push `product-photobook.html`; per-card redirect is a one-line change.
- **Press feedback.** `press(0.97)`, per the project's card convention.

#### A third "Memories" banner exists in Figma and was deliberately not built
The designer was live-editing this row while it was being implemented: a scratch frame
(`509:18245`) briefly held a third card that went from a duplicate of "Golden days" →
a purple-tinted photo-flower "Collages, recaps and much more" → a purple `#886BB3`
"Memories" card with a clipped tile row, and was then deleted when the two finished
banners were moved into `451:13875`. Only those two are in the home node, so only
those two are built. If the Memories card returns, note that its tile row
(`left:15, gap:8, 128-wide tiles`) puts tiles 3 and 4 past the card's 283 width — only
the first two are ever visible.

### A full-bleed wash must live INSIDE the scroller
Home's gradient was a child of the screen root, sibling to the scroll container —
so it never moved and read as sticky while everything else scrolled past it. It has
to be a child of the scroller: absolutely positioned children of a scroll container
scroll with its content (unlike `position: fixed`).

That move brings a paint-order trap. An `absolute; z-index: 0` element paints in the
positioned-descendants layer, which is *above* in-flow non-positioned siblings — so
the wash would veil every section under it. The fix is `z-index: -1` on the wash
plus `isolation: isolate` on the scroller; the isolation is what guarantees the
negative z-index resolves inside the scroller (above its own background, below its
content) instead of escaping to an ancestor stacking context and vanishing behind
the page background. No per-section z-index needed.

Verified by hit-testing: `elementFromPoint` over the "Create" heading returns the
heading, not the wash, and the wash's viewport offset tracks `-scrollTop` exactly.

### ⚠️ Figma modulates a background blur by the layer's own fill alpha
The onboarding copy panel (`451:13813` and siblings) declares
`backdrop-blur: 28.65px`, and that blur is **deliberately not implemented**. Figma's
own render of all three frames shows no blur whatsoever: the panel's fill is
`rgba(222,241,242,0.01)`, and Figma scales a background blur by the layer's fill
alpha, so 1% of the fill buys 1% of the blur. CSS `backdrop-filter` has no such
coupling — it blurs the whole backdrop regardless of the element's background.

That difference was invisible for as long as the illustration slot was empty. The
moment artwork landed behind the panel it showed up as washed-out art. Measured on
`451:13841`, mean |dI/dx| over the album tile that runs behind the panel:

| band | Figma render | with `blur(28.65px)` | without |
|---|---|---|---|
| y 365..400 | 7.95 | 5.96 | 6.88 |
| y 400..440 | 4.78 | 1.75 | 4.14 |

So the panel is now a plain translucent layer. It needs no seam-hiding mask either,
because with no blur there is no seam — the wash gradient behind it carries the whole
transition. The content blocks keep `position:relative; z-index:1` and the fill layer
keeps `z-index:0`: if the blur is ever restored, an absolutely-positioned
`backdrop-filter` layer without that ordering paints *over* the copy and blurs it away.

The same 96px ramp trick is still the right answer wherever a `backdrop-filter` really
is wanted — a plain one leaves a hard seam at its top edge.

### Photo book page — option flow (Figma `406:7183`)
One tall scrolling page on a 402 frame with **24px gutters**: hero (`406:7432`) →
three option sections (`406:7220`, gap 48, padding 40/24) → Lay-flat upsell
(`406:7296`) → "Review your choice" (`406:7306`).

⚠️ `get_metadata` reports `406:7306` as an **empty frame with no children** — it is
not. It holds the whole review block (scrim, composed title, price, "Start create"
button). Always confirm with `get_design_context` before concluding a frame is
empty. The review block is full-bleed (breaks out of the 24px gutters), 542 tall
with 24px top corners, and only renders once every option is chosen; its
background is four copies of the same photo whose export is byte-identical to
`pb-shot-a.jpg`, so no extra file was added, and it follows the chosen format. Card rows scroll horizontally *by design* — 3×245 +
2×12 = 759 overflows the 354 content width. Rows bleed past the gutters
(`margin: 0 -24px; padding: 0 24px 10px`) so cards reach the screen edge and the
card shadow is not clipped.

Card is 245×303.779 (size row: 261×343.779, 245×343.779, 245×303.779), r20,
`0px 4px 4px -4px rgba(0,0,0,0.25)`, with a `blur(25px)` gradient scrim caption.
Figma layers the **same photo two or three times** at specific transforms (zoomed
backdrop + product on top); those percentages are carried over per card in `SHOTS`
rather than collapsed into `object-fit`.

**Condensed summary bar.** While options are still being chosen, a sticky bar
(`#F4F4F4`, 24px top corners, upward shadow) pins the review headline and price to
the bottom. It appears **as soon as a format is picked** and fills in as choices are
made (one line until a cover is chosen, two after). An `IntersectionObserver` rooted
on the scroller hides it the moment the full review block scrolls into view, so the
two never show together.

Because the label reads "From", a partial selection shows the cheapest option still
consistent with it — `min(SIZE_BASE) + min(COVER_ADD)` for format-only, which lands
on €24.99 and so agrees with the option cards — converging on the exact total once
everything is set. Bar and block both read one `summarise()` helper, so they cannot
drift apart. Not in the design — added on request.

⚠️ Because the bar is absolutely positioned **over** the scroller, the content
needs matching room at the end — otherwise the last revealed section is trapped
under it with no scroll left. That bit the colour swatches: at max scroll 56px of
the swatch row sat behind the bar and could not be reached. A
`calc(112px + env(safe-area-inset-bottom, 0px))` spacer is rendered while
`format && !complete`; once complete the 542-tall review block follows and the bar
hides as it scrolls in, so no spacer is needed there. Verified by hit-testing every
swatch with `elementFromPoint` at maximum scroll.

**Progressive blur on the review header.** The node specifies
`backdrop-blur-[0px]`, so this was added on request. A single `backdrop-filter` is
uniform and leaves a hard edge where it stops, so five layers of doubling blur
(1→16px) are stacked, each masked to a shorter band near the top; the blur
accumulates to roughly 31px at the very top and eases out before the scrim ends.

Two things to know if you touch it:
- **Use px mask stops, not percentages.** Percentages scale with the container, so
  changing its height drags the strong layers down over the product photo.
- **The effect reaches much further than the masks suggest** — each layer blurs the
  already-blurred composite beneath it, and a layer's blur samples past its own
  mask. Nominal stops ending at 290px measured as heavy blur out to 288px and only
  clear at 312px, which softened the book photo. The stops therefore end well above
  the scrim's 243px bottom. Verified by diffing per-band gradient energy against a
  `backdrop-filter: none` control: 12–32% of detail retained through the text
  region, 100% from 240px down.

**Progressive reveal state machine:** Format → cover type → (if Cut-out: shape,
then colour) → size → Lay-flat + enabled CTA. Each reveal calls `scrollIntoView`.
Changing format clears the chosen size (sizes are format-dependent); changing away
from Cut-out clears shape and colour.

Not in the design, and flagged as such in code:
- **Cut-out shape + cover colour sections.** Shape reuses the card pattern with
  placeholder artwork; colour is a swatch row using PB3 tokens.
- **Size matrix per format.** The design names Extra large 39×29 and Large 28×21;
  portrait and square rotate those, and a Medium was added. All three size cards
  are 343.779 tall — the design's third one is 303.779 and sits centred in the row
  (`y=20`), but that is its mislabelled "Soft cover" placeholder, so a real third
  size matches its siblings. Medium reuses the Large photo: the design only ships
  two size shots.
- **Price model.** Every option card reads a flat "From €24.99" while the review
  block reads €44.99 for Large / Landscape / Hardcover / Layflat, so the
  increments in `SIZE_BASE` / `COVER_ADD` / `LAYFLAT_ADD` are reverse-engineered
  to hit that exact total (29.99 + 10 + 5). Replace them once real pricing exists.
- **CTA target.** "Start create" goes to `editor.html`. It first writes the resolved
  selection to `sessionStorage.pb_book` via `bookConfig()` — title, page count, total
  and the page dimensions in cm — because the editor needs all four and recomputing
  them there would duplicate `SIZES` / `SIZE_BASE` / `COVER_ADD`. The old
  `editor-format.html` and `editor-configure.html` step-3-of-3 screens are deleted:
  format, cover and size are all chosen here now.
- **Selected state and the toggle.** Exports carry only the unselected/off state,
  so both are drawn in code (teal fill + check; 55×32 track).

Every price in the design reads "From €24.99" on every card while the hero says
"Start from €14.99" — kept verbatim rather than invented around.

### Editor page (Figma `451:15574`)

One tall scrolling canvas on a 375 frame: sticky header (`451:15677`) → details card
(`451:15649`) → cover (`451:15622`) → inner spreads (`451:15591`) with an add-spread
pill between each pair (`451:15602`) → sticky toolbar (`490:17058`, row `490:17059`).

**Sheet geometry is driven by `aspect-ratio`, not pixel maths.** Each sheet is
`padding: 4` around one interior box of `aspect-ratio: 2·pageW/pageH` — two leaves
wide. That makes the cover and every inner spread exactly the same height without
measuring the container, and it scales from the design's 336 sheet (19.5 gutters on
375) to any phone width. Leaves are 50% each, padded 8 on the outer edge and 12 on
the gutter edge (mirrored), which lands the photo well 12 from the sheet edge and 8
from the spine on both sides — matching the node.

**Block rhythm.** Sheets are 71px apart in the node (172 → 243). A block is the sheet
plus its 24px caption strip, so the column gap is **47** and the add-spread pill is
`bottom: -31`, overhanging into the gap. That reproduces the node exactly, including
the 7px where the pill overlaps the caption above it.

**Leaves.** Left leaves are `#F5F5F5` and right leaves white throughout the node —
gutter shading, not content. Page order is `[inside front | 1]`, `[2|3]` … `[24 |
inside back]`, so a 24-page book is 13 spreads. The trailing `[24 | inside back]`
pair is an extension; the node only ever shows the front of the book.

**Dot canvas:** 2×2 dots on an 18px grid, 4px in from the frame edge, `#272727` —
measured off the node's render, not guessed. It rides the *content* so the spreads
read as sitting on a canvas while it scrolls. `background-origin` must be
`border-box`: the default `padding-box` re-phases the grid against the safe-area
padding above it.

**Progressive blur** on both the header and the toolbar. The header uses the shared
`IOSProgressiveBlur` (see below); the toolbar has its own bottom-up variant.
The node specifies a flat `backdrop-blur(10px)` for the toolbar;
that was replaced on request with five doubling layers masked up from the bottom, same
technique as the product page's review header. Verified against the node: the blur +
dark wash band matches within **1–4/255** at every sampled row from the top of the
band to the bottom.

**The toolbar row scrolls horizontally by design.** Six 68pt tools (474px with gaps
and padding) overflow any phone width — which is what the node is already doing, its
row being clipped at the frame edge. Verified by hit-testing all six with
`elementFromPoint` after scrolling the row fully right. A `139px + safe-area` spacer
closes the content so the last spread is not trapped under the bar.

#### ⚠️ `mix-blend-mode` cannot blend across a composited layer boundary

The Continue button (`451:15685`) is specified as `rgba(0,115,119,0.5)` on
`color-dodge` over `#62b5b8` on `soft-light`. Implemented literally it rendered
**(42,139,142) against the node's (11,41,42)** — roughly 3× too bright. Nothing in
the ancestor chain isolates the blend (checked every computed `isolation`, `opacity`,
`filter`, `backdrop-filter`, `mask` and `transform`): Chrome promotes the scroller to
its own composited layer because of the dot canvas and the backdrop filters, and
`mix-blend-mode` silently falls back to blending against *nothing* rather than
reaching across the layer. The measured value matches an `isolation: isolate` group
almost exactly, which is the tell.

Two conclusions worth keeping:
- Do not rely on `mix-blend-mode` reaching content in a scroll container or behind a
  `backdrop-filter` sibling. It will look right in a minimal test page and wrong in
  situ.
- CSS and Figma disagree on this blend even in isolation — the literal recipe
  measures (19,58,61) where the node samples (11,41,42). So the blend was not the
  more faithful option either.

Replaced with `rgba(0,66,68,0.5)`, derived from the node's own pixels: over the
header's (24,24,24) it lands on (12,45,46), the mean of the node's interior, and it
stays 50% translucent so it still reacts to its backdrop. Averaged over the whole
disc the button now matches within **~5/255** on both interior and rim.

### Photo sources page (Figma `451:14202`)
Sits between the editor's upload sheet and `image-picker/`, which is really just one
album ("Trip to Barcelona"). Structure: header with the source pill (`451:14361`) →
Collections row (`451:14203` / row `451:14213`) → Albums grid (`451:14372`). Any cover
or album tile opens the picker; back pops to the editor. The **Camera Roll pill is
inert** — the node only carries its one state and no source list exists in the Figma.

The node's own 48px status bar is replaced by the safe-area inset; the 44px control row
and its 12px tail are the node's, which puts Collections at y=104 and Albums at y=494
exactly as the node has them.

**Albums grid is exact.** 2 columns, 12px gaps, 166 tiles at r16, expressed as
`aspect-ratio: 1` so they track the 343 content width. The People-and-pets tile is four
76px circles on `rgba(17,17,17,0.5)`; ⚠️ the node's `Ellipse22..25` run **clockwise**
(top-left, top-right, bottom-**right**, bottom-left), not in reading order.

#### ⚠️ Figma clips exports to the containing frame
The Collections row is 1729 wide inside a 375 frame, and **every** export route —
`get_screenshot`, `get_screenshot` with `contentsOnly`, and `download_assets` — returns
only the part of a node that falls inside its frame. Cards fully off-frame come back as
1×1 images. So there is no way to obtain the artwork for six of the eight covers, and
no way to *see* them either: only Canada and Italy were ever rendered for reference.
The other six are reconstructed from the node's code alone and are **unverified**.
(`use_figma` + `exportAsync` would sidestep the clipping, but returns megabytes of
base64; the alternative — temporarily turning off `clipsContent` — would mean editing
the user's Figma file.)

#### Covers: what is real and what is substituted
Cards are data-driven (`COLLECTIONS` in `photo-sources.jsx`): photo, blur bands,
display lines, month caption. The recurring device is a **blur band** — a
backdrop-filtered strip whose gradient carries almost no colour, used to lift the
display type off the photo; `flip` mirrors it, as the node does on every top band.

- **Radius.** Canada and Italy are r24 with a 2px rim; the six off-frame cards still
  carry an older r14.385 / 0.599px rim. Standardised on the pair the designer left
  visible, which also matches the app's other card radii.
- **Three photo fills are empty placeholders in the file** (Berlin, Guadalupe's first
  layer, Tim). Berlin borrows the Canada photo — visibly the wrong picture, and the
  first thing to replace. Guadalupe uses its second layer, which is real.
- **Two faces in the node are not free**: BBH Bogle ("CANADA") falls back to Big
  Shoulders Display, AmstelvarAlpha (the dark "Berlin") to Basic. The other eight are
  Google Fonts (OFL), self-hosted as latin subsets in `shared/assets/pb-font-*.woff2`
  (216KB total) so the PWA still renders them offline — declared in `styles.css`.
- **Jane and Tim.** `451:14291` / `451:14353` are hand-drawn white **outline drawings
  of a figure**, not photo frames — masking a fill through them produces an outline,
  not a framed photo. The node paints a cut-out photo over the outline plus several
  more doodles; that stack is not reproducible blind (the photo fills are white-backed
  rather than transparent, Tim's is empty, and the doodles were never rendered). Both
  cards are the flat colour, the name and the drawing, which is the character the node
  carries.
- **Cappadocia carries an added blur band.** Its node bands leave the top clear and its
  photo is a white-background shot, so the white wordmark was unreadable. It reuses the
  same blur-band device the node applies to four of the other cards, tinted enough to
  hold type. Flagged in code as an addition.
- The ambient glow behind the row is the node's own `451:14204`: the first two covers
  duplicated at `blur(146.85px)`. Kept, but it is a large filter region — the first
  thing to drop if scroll performance suffers on device.

Verified: 8 covers in a scrolling row (1761 > viewport), all eight faces load, no
horizontal page overflow, back pops, covers and tiles push to the picker.

#### Back buttons use the shared glass control
Both this page and the picker's "Trip to Barcelona" header use `GlassIconButton` with
`gloss` and the editor's `rgba(0,0,0,0.25)` tint, so all three screens' back controls
match. Neither is in the Figma — the node gives this page a bare 24px chevron and the
picker a transparent 36px button.

- **Sources page:** 40×40 at `left: 16`, matching the editor's header metrics. That
  nudges the glyph 8px right of the node's position, which is the price of the shared
  control.
- **Picker:** kept at 36×36 / r18 to preserve that header's tighter metrics, and only
  the Back button was changed — `HeaderIconButton` still serves the other three header
  controls untouched. Its rim reads dimmer than elsewhere at rest because the backdrop
  behind it is solid black; it lifts once photos scroll under the header.
- **`navigation.js` is not loaded in `image-picker/`**, so Back sets the transition flag
  by hand and assigns `location.href`, exactly as `onContinue` does — not
  `history.back()`, which would skip the animation on a bfcache restore and leave the
  flag in `sessionStorage` to misdirect the next navigation. Verified: the landed page
  comes up with `data-nav="pop"`.

#### `press()` moved to `shared/ios-frame.jsx`
Two screens now need the press-scale handlers, and each `text/babel` file is its own
classic script — so two top-level `const press` declarations would collide in the
global lexical scope, the same trap as `PB_DISPLAY`. It is defined once in
`ios-frame.jsx` and exported. `onboarding-shell.jsx` keeps a function-local copy, which
merely shadows it.

#### Upload prompt action sheet (Figma `451:15887`)
Overlay `451:16012` / sheet `451:16013`. Presented over the editor the moment the
screen lands — an empty book has nothing to work on until photos exist. Sequence is
`wait → open → closing → gone`, with a 300ms wait so the push transition finishes
before the sheet rises; it still reads as arriving with the screen.

- **Overlay:** `rgba(0,0,0,0.6)` + `backdrop-filter: blur(5px)`, `zIndex: 20` so it
  covers the header and toolbar (both `zIndex: 6`). Verified by hit-testing: a point
  over the editor returns the dialog while it is open, and the scroller again once it
  is dismissed.
- **Sheet:** 362 tall, top corners r24, `drop-shadow(0 -12px 9.3px rgba(0,0,0,0.65))`.
- **The fill is an ellipse centred on the sheet's own top edge.** Figma exports it as
  an SVG `radialGradient` with `gradientTransform="matrix(0 11.1 -36.918 0.22841 188 0)"`
  at `r=10`, which decodes to semi-axes of 369.18 × 111 about (188, 0) on a 375×362
  sheet — i.e. `radial-gradient(98.45% 30.66% at 50.13% 0%, rgba(0,0,0,0.2) 0%, #111 100%)`.
  The centre stop is **deliberately translucent**, so the blurred editor reads faintly
  through the top of the sheet. Do not flatten it to a solid fill.
- **Layout:** `paddingTop: 43`, content block (gap 24: 24px upload icon, SF Pro Display
  Bold 22/28 title, SF Pro Text 16/21 `#ccc` body), then `marginTop: auto` and the
  button block with `padding: 24px 19px 0`. On the node's 362 sheet that lands the
  buttons at y=220, which is where the node has them, while still adapting if the copy
  rewraps at another width.
- **Buttons:** "Select photos" `#F0F0F0` + 1px white; "Start from empty book" `#333` +
  1px `#464646` + `inset 0 0 27px rgba(0,0,0,0.25)`. Both r55, `16px 24px`.

Pixel-diffed against the node's render: sheet fills within 1–5/255 at every sample,
the scrim over the editor exact at (93,93,93), and both button fills exact.

**Wiring.** "Select photos" pushes `../image-picker/index.html`. "Start from empty
book" and a tap on the scrim both dismiss (the scrim is the iOS-standard escape and
lands on the same outcome as the explicit skip). The sheet shows on **every** mount,
not once per session — landing on the editor is what triggers it.

⚠️ The picker's `onContinue` still goes to `../screens/basket.html`, so
editor → picker → Continue lands in the basket rather than back in the editor. That is
the pre-existing wiring and was left alone; changing it is the one permitted edit to
the frozen picker, and would want a `sessionStorage` flag so home → My Photos →
Continue still reaches the basket.

⚠️ This node is a later iteration than `451:15574` and disagrees with it: the details
card is `#323232` / h53 / pl8 (vs `#272727` + `#363636` / pl12), the toolbar labels are
white rather than `#ccc`, "AI help" has become "Smart Fill", "Arrange" is misspelled
"Arenge", and the Photos tool carries an orange `#F4633A` count badge reading 24. The
editor still follows `451:15574`; none of that was carried over.

#### Photos tool, filled state (Figma `451:15722`, icon `451:15725`)
Once anything has been uploaded, the flat Photos glyph is replaced by four scattered
thumbnails with an orange count badge. It keys off **`pb_uploaded`, not `pb_placed`** —
photos declined for auto-fill are still uploaded and still belong in that count.

The node's four tiles sit in flex-centring wrappers sized to each rotated tile's
bounding box (12 × (|cos| + |sin|)), which is awkward to carry over directly, so
`PHOTO_TILES` reduces them to a plain 12×12 tile plus a rotation about the same centre:

| centre | rotation |
|--------|----------|
| 8.05, 4.95 | −6.04° |
| 18.55, 4.57 | +6.63° |
| 8.03, 15.96 | −4.30° |
| 18.80, 15.94 | +10.62° |

Painted in node order, so the lower two overlap the upper two. Thumbnails are the first
four uploaded photos; a tile with no photo keeps the node's `#D9D9D9` fill.

⚠️ **The badge breaks out of its icon box** — 23×15 at (16, −7), so 13px right and 7px
above a 26×24 container. The tool row is a horizontal scroller, and `overflow-x: auto`
forces `overflow-y` to auto/hidden — it can never be `visible` — so the row would slice
the badge off. Fixed with `padding: '8px 8px 0'` on the row; padding-top only, because
the row is anchored by `bottom`, so the tools do not move. Verified by rect: badge top
720 against the row's clip edge at 719.

The badge width is a **minimum** rather than the node's fixed 23, with 4px side padding,
so a three-digit count fits instead of spilling. Checked at 4, 26 and 128.

⚠️ This node is another toolbar iteration and disagrees with `451:15574` on the toolset —
Photos, Add photo, Add text, Layout, Stickers, Smart Design, Ask AI (seven, laid out
`gap: 8` from the left rather than justified). Only the Photos icon was taken from it;
the toolbar still follows `451:15574`.

#### Auto-fill prompt (Figma `451:15751`) and the photo handoff
The picker's Continue no longer jumps to the basket. It writes the selection to
`sessionStorage.pb_photos` and returns to the editor, which then offers to place them.

**One sheet shell, two prompts.** `ActionSheet` carries the overlay, the fill, the
shadow and both animations; `UploadSheet` (362 tall) and `AutofillSheet` (332) supply
only their own body. The two nodes' radial fills decode to different pixel radii —
369.18 × 111 on 362, 369.18 × 101.8 on 332 — but land on the *same* percentages, so one
`SHEET_FILL` string serves both. Their buttons differ and the difference is passed in
per call: the upload sheet's carry a rim and an inset shadow, the auto-fill sheet's are
flat (pure white / flat `#333`).

**Chronological order is real, not a label.** The prompt promises chronological order,
so the handoff filters `sourcePhotos` — which `photos.js` builds date-ascending — rather
than using `order`, the tap sequence. Verified: tapping p473, p480, p443, p482 hands
over `PHOTOS[]` positions 442, 472, 479, 481, strictly ascending.

**Three storage keys, because uploaded and placed are not the same thing.**
- `pb_photos` — the incoming selection. Consumed on read, and its presence is what
  decides which prompt opens: photos waiting → auto-fill, nothing uploaded yet →
  upload, otherwise → none.
- `pb_uploaded` — everything the picker has handed over, written as soon as it arrives
  and regardless of how the prompt is answered: **declining auto-fill still leaves the
  photos uploaded.** This is what the Photos tool's thumbnails and count show.
- `pb_placed` — what is actually on the pages. Arrange mode rewrites it in place. Durable, so a reload keeps the filled
  book instead of re-asking. `added` is re-derived from its length so a reloaded book
  keeps the spreads auto-fill appended.

**Placement.** One photo per page, `photos[n - 1]` for page *n*. The cover is left
alone: it is not a page, and spending photo 1 on it would leave the last page empty.
The inside-front and inside-back leaves carry no page number, so they stay empty too.
A selection longer than the book **grows it by whole spreads**, priced with the same
`EXTRA_SPREAD_PRICE` as a manually added spread — 30 photos into a 24-page book gives
30 pages at €48.99. A shorter selection leaves the tail empty.

Verified end to end: empty book → upload prompt (362); pick 5 in the picker → Continue →
editor with `data-nav="pop"` and "You uploaded 5 photos"; "Yes, auto-fill" places all 30
of a 30-photo selection, grows the book and persists; reload keeps the photos and shows
no prompt; "No, I'll place them myself" dismisses and places nothing.

⚠️ **The checkout chain is now orphaned.** `basket → checkout-delivery →
checkout-payment → order-success` are all built but no longer reachable: the picker used
to be the only way in, and the editor's Continue arrow is still inert by request.
Pointing that arrow at `basket.html` is a one-line change when wanted.

#### Page view mode (Figma `451:14499`)
Tapping any page in the book view zooms into it: one page nearly fills the width
with the rest of the book running off-screen, the strip scrolls and snaps page to
page, and a navigator between the preview and the toolbar says where you are.

It is a **mode of `EditorScreen`, not a screen** — `pageView` holds the slot index
or `null`. That is what keeps the placed photos, the page count, the pending action
sheet and the book view's own scroll offset alive across going in and coming back
out. The book view unmounts while page view is up, so its `scrollTop` is stashed on
the way in and restored through a **callback ref** on the way back; without it,
leaving a page halfway down a 24-page book lands you back at the cover.

⚠️ The node is a WIP frame literally named "test" and carries a good deal of
off-canvas scratch — a second pair of 177px photo squares at x=432/610 and a
`#272727` add-strip at x=379, all of them behind the book or past the 402 frame
edge. None of it is visible in the design and none of it is built.

#### Slots are the single source of truth for the strip and the navigator
A **slot** is one page you can zoom into: the front cover, then every leaf of every
spread in reading order. `slotsFor(pages)` derives them from the same `spreadsFor()`
the book view uses, and each slot names the book graphic (`unit`) it lives in — 0
for the cover, 1..n for the spreads. Because one list drives the strip, the snap
targets and the navigator, the three cannot drift apart. Slot indices are `0` for
the cover then `1 + 2i` / `2 + 2i` per spread, and added spreads are appended, so
existing indices never move.

- **The back cover is drawn but is not a slot.** It is not a page you edit, and the
  node's navigator carries a single "Cover" entry (`451:14514`) rather than a pair.
  Since it has no `scroll-snap-align`, the strip can never come to rest on it —
  which is exactly the wanted behaviour, and it comes for free.
- ⚠️ **The node numbers the inside front cover "0"** and runs 1..5 from there. The
  book view's `Caption` leaves both inside-cover leaves blank, and the two views
  agreeing matters more than reproducing that one number, so they are blank here too.

#### The open book is three exported paper layers plus two live leaves
Group `451:14563` is a 637.691 × 323.387 frame holding the open spread
(`451:14570`) at (9.08, 5.45) sized 619.523 × 312.487 — so the paper stack shows as
~9px of margin at the sides and ~5.5px top and bottom. `BOOK` keeps every one of
those as a **fraction of the frame**, which is what lets the same three SVGs compose
correctly at whatever aspect the chosen format gives the spread (the node's own
leaves are near-square; a Large Portrait book is 0.75).

| layer | asset | what |
|---|---|---|
| `Frame 547` | `pb-editor-book-block.svg` | the book block — `#E3E3E3` halves either side of a 16.35 `#EFEFEF` spine strip carrying an inner shadow |
| `451:14568` | `pb-editor-book-sheet-a.svg` | `#E4E4E4` page-stack sheet, drooping 1.8px at the spine |
| `451:14569` | `pb-editor-book-sheet-b.svg` | `#F0F0F0` sheet, ditto, with the dy 7.27 drop shadow |

The node declares each sheet as a 623.157 × 310.612 box holding an image inset by
the negative percentages of its own filter bleed; those are folded into `BOOK.sheetA`
/ `sheetB`, so each entry is the position and size of the exported SVG itself. All
three carry `preserveAspectRatio="none"`, so they stretch with the book and the spine
strip stays a constant 2.57% of its width.

The group's drop shadow is carried over verbatim rather than scaled, minus its two
no-op layers — the 75.926px one is fully transparent and the last has no offset, blur
or spread. The offsets are design px on a 637-wide book, which is what the book
measures at a 402 viewport.

#### Geometry is measured, not expressed in percentages
A page occupies 309.7615 of the node's 402 frame (`PV_PAGE_FRACTION`), and that
fraction is what makes the strip read as zoomed into a single page rather than
showing a whole spread. Everything else derives from it.

⚠️ **The strip's width is measured with a `ResizeObserver` rather than driving the
books off percentages.** A percentage width on a flex item resolves against the
flex container's *content* box, and the side padding a snap pager needs would shrink
that basis — so the two would fight. For the same reason the room that lets the
first and last page reach the centre is a pair of **flex spacers, not padding**.

#### Scroll snapping, and what syncs the navigator
`scroll-snap-type: x mandatory` on the strip, with `scroll-snap-align: center` and
`scroll-snap-stop: always` on every page — so a fast flick advances one page instead
of flying past six. The active page is whichever snap target's centre is nearest the
strip's centre, recomputed in an rAF-throttled `scroll` handler (a handful of rects
per frame).

⚠️ **The navigator follows with `inline: 'nearest'`, never `'center'`, and a tap on a
thumbnail jumps the preview rather than smooth-scrolling to it.** Both were 'center'
and 'smooth' first, and together they made the row behave oddly:

- centring re-scrolls the navigator on *every* change of `active`, so it slides under
  your finger the whole time you drag the strip — and a tap shoves the very thumbnail
  you just tapped somewhere else;
- a smooth scroll from page 3 to page 24 drags the preview through twenty spreads, and
  because the handler tracks the centred page the whole way, the selection ring races
  through every thumbnail in between — which is what made the navigator look like it
  was jumping.

With `nearest` the navigator does nothing while the active thumbnail is already
visible, and the navigator's `scroll-padding-inline: 56px` is what "visible" means, so
it is nudged clear of the edge rather than left flush against it. Verified: scrolled
to the end of the navigator on page 3 and tapped page 24 — the navigator moved **0px**
and the thumbnail stayed exactly where it was tapped, while the preview moved 6769px;
dragging the preview six pages back then walked the navigator 176px and left the
active thumbnail 56px from the edge. On mount it scrolls only as far as it must to
reveal the page that was opened.

`block: 'nearest'` matters too, or this can scroll an ancestor vertically as well.

Measured against the node at its own 402 frame: page width 309.75 against 309.7615,
book width 637.69 against 637.691, navigator top 639 and height 65 both exact, and
the photo well's insets 4.934% / 5.456% against the node's 4.937% / 5.456%. The one
deliberate difference is that the snapped page is **centred** (offset −0.34px)
where the node has it 4.6px left of centre — a pager that rests off-centre reads as
a bug.

#### The navigator — `451:14511`
A 45-tall row of 41px thumbnails with the 11px page number on a 20px line under it,
65 tall overall. Leaves of one spread sit 1px apart and consecutive spreads 8px
apart, which is what makes the pairing read; unselected thumbnails and their labels
drop to opacity 0.5 / `#777`.

- ⚠️ **The selection ring is an inset shadow, not a border.** The node rings the
  selected page with a 2px `#008E93` border *outside* the 41px thumb, which reflows
  the whole row by 4px every time the selection moves — and the selection moves on
  every scroll frame. `inset 0 0 0 2px` paints the same ring over the thumb's own
  outer 2px and keeps every item a fixed 41. Same finding CLAUDE.md already records
  for the home status banners and the collection covers.
- The `+` buttons are the node's `494:17136` — 38×38, `#272727`, 1px `#363636`, r12 —
  and appear after every spread but the last, the same rule `SpreadBlock` uses for
  `showPlus`, so adding a spread from either view behaves identically.
- The cover's 4px white spine bar (`451:14515`) is what marks it as the cover rather
  than a page. It is invisible while the cover thumbnail has no photo on it.

#### Toolbar — `520:26508`, a later toolset than the book view's
Eight tools laid out from the left with `gap: 8` and `padding: 0 16px`: Photos (with
the orange count badge), Add photo, Add text, Layout, Stickers, Smart Design, Ask AI,
Delete page. `Toolbar` therefore takes `tools`, `gap` and `padX`, all defaulting to
the book view's six-tool row, and `PhotosStackIcon` and the five-layer
`BLUR_BANDS` scrim are shared unchanged. All eight are inert, on the same footing as
the book view's.

- **The node's "Ask AI" glyph (`icon / Magic tool`) exports byte-identical to the
  book view's "AI help" icon**, so `pb-editor-tool-ai.svg` is reused rather than
  duplicated. Likewise the header's `back_pbx` is byte-identical to
  `pb-src-back.svg`, and the navigator's 16px plus to `pb-editor-plus.svg` — three
  assets that did not need adding. Checked with `diff`, not by eye.
- "delete page" is the node's own casing; sentence case here, like its siblings.
- Verified by hit-testing all eight with `elementFromPoint` across the row's scroll
  range, and that the Photos badge still breaks 7px above the row without being
  clipped (badge top 789 against the row's clip edge at 781).

#### Header — `451:14591`
Back chevron, the undo/redo pill centred, and a third slot the node ships at
`opacity: 0` (its Continue button) — reproduced as an inert 40px spacer so the pill
stays centred rather than drifting right. The node's back button is 36×36 where the
book view's close is 40; **kept at 40** so the control does not resize as you move
between the two modes of one screen.

#### Not in the design
- **The gap between books** in the strip (8% of a page). The node shows one book.
- **The cover unit's contents.** The node's page view opens on page "0", so the
  cover is never shown; it follows `CoverBlock` in the book view — placeholder block
  bottom-left on the back, "Add text" over a well on the front — with both sized as
  fractions of the page so the cover reads the same zoomed in as out.
- **`PhotoWell` gained `iconSize`.** 24px is right on a 164px leaf in the book view
  and lost on a 310px one here.
- **The press feedback on a book-view leaf** uses `transformOrigin` toward the spine,
  so the tap reads as the page being pushed in rather than the whole sheet shrinking.
- **The fade in.** `pbFadeIn`, 220ms — the mode change is otherwise instant.

#### Verified
Driven end to end at 390×844, 402×874, 430×932 and in the desktop `IOSDevice`
frame: 27 snap targets for a 24-page book (cover plus 26 leaves, the back cover
excluded), the tapped page lands centred with no animation, one page forward moves
the navigator 3 → 4, tapping "Cover" centres slot 0, a navigator `+` grows the book
24 → 26 pages and the pills 12 → 13, Back restores the book view's exact scrollTop
(539 / 561), a tap on the page hits the page and not the paper layers above it, and
there is no page overflow on either axis and no broken image at any width.

#### "Choose layout" drawer (Figma `451:14921`)

Tapping **Layout** in the page view's toolbar opens a drawer over the bottom half of
the screen: the page preview stays live above it, the chip row picks how many photos
a page holds, and the card row offers templates for that count. It is a state of
`PageView`, not a screen — `drawer` is `null` / `'open'` / `'closing'`, matching the
action sheets.

⚠️ The node is another WIP frame named "test" and carries the **same off-canvas
scratch `451:14499` does** — a second pair of 177px photo squares at x=432/610 and a
`#272727` add-strip at x=379, all past the frame edge. None of it is visible in the
design and none of it is built.

#### A layout is fractions of the *well*, so one definition serves every scale
`LAYOUTS[count][option]` is a list of `{x, y, w, h}` in percentages of the printable
box `PV_WELL` describes — not of the page, and not in px. That is what lets a single
template render identically on a 114px drawer card and a 310px page in the strip,
and it makes a template independent of the book format chosen on the product page.

`LayoutWell` is the shared renderer: it positions itself `absolute; inset: 0` inside
whatever relative box it is given, so it serves a leaf in the **book view**, a page
in the **strip**, the **cover's** front well and a **drawer card** unchanged. With no
layout set it falls back to `FULL_PAGE`, which is the single well the node draws — so
every screen that predates this renders exactly as it did.

- **Only the "2 photos" tab exists in the design**, and only three of its cards:
  `451:14976` (a centred pair), `451:14978` (halves), `451:14979` (two stacked on the
  right two-fifths — deliberately off-centre; the node leaves the left 30% empty).
  Those are `LAYOUTS[2][0..2]`. The 1 / 3 / 4 / 5+ chips ship with **no cards behind
  them**, so those templates are additions, built on the same 3% gutter the node's
  own halves leave (`451:14978` measures 46.8% + 49.7% on a 102.6-wide well) — which
  is where 48.5 / 31.333 / 22.75 come from.
- **The empty-state glyph scales with the slot.** 24px swamps a 22%-tall track, and
  `PhotoWell`'s `overflow: hidden` would simply clip it, so `LayoutWell` scales the
  icon by the slot's smaller dimension with a 10px floor.
- **Slot 0 holds the photo auto-fill placed on that page; the rest come from the
  upload pool** (`slotPhotos`), so a multi-photo template previews with real pictures
  instead of empty wells. Nothing is written back to `pb_placed` — a layout is a page
  template, and one photo per page is still the placement. A page with nothing placed
  stays empty in every slot rather than borrowing from the pool.

#### The draft is previewed on the real page, and only committed on confirm
`draft` previews live on the slot the drawer was opened over (`target`), so tapping a
card re-lays the actual page behind the drawer. The **check** button writes it through
`onSetLayout`; the **close** button puts the stored layout back *before* starting the
slide-out, so the revert is visible rather than snapping after the animation.

`pb_layouts` is a fourth storage key alongside `pb_photos` / `pb_uploaded` /
`pb_placed`: an object keyed by **slot index** (0 is the cover, then two per spread —
the same indices `slotsFor` produces, and added spreads are appended so an existing
index never moves), with `"<count>-<option>"` ids as values. Durable, like
`pb_placed`, so a reload keeps the templates. The book view reads it too, so a page
laid out here shows the same template zoomed out.

#### ⚠️ The strip now fits the book to its band, because the drawer halves it
Page width was derived from the viewport width alone. With the drawer taking the
bottom half, a portrait book is **taller than the band that is left** and would run
underneath the drawer, so `PageView` measures the scroller's height as well and
scales the book down when `bookH` exceeds it. With the drawer closed the band is
always tall enough and the clamp is a no-op — verified: 390×844 gives the same
619×415 book as before, and 373 tall with the drawer up (exactly `band − 16`).

The re-centring effect is therefore keyed on `pageW` rather than run once behind a
`centred` ref. Opening or closing the drawer re-scales the strip, and without that
the centred page drifts by however much the books shrank. Measured: the active page
comes back to dead centre (offset 0) after confirm.

#### Chrome while the drawer is up
- **The navigator and the toolbar are unmounted**, not hidden — the drawer covers the
  bottom half, which is where both live.
- **The header keeps its blur and loses its controls.** `PageViewHeader` gained
  `controls` and `height`: the node keeps only a blur band across the top, and its
  close/confirm live on the drawer, so the header's own buttons would double up. The
  height drops to the node's own 93 (44 status bar + 49) — at the book view's 147 the
  blur would reach a third of the way down the page preview.
- **No scrim.** The node has none, and the point of a half-height sheet is that the
  preview above stays visible and interactive — so the drawer is dismissed by its own
  close button rather than by a tap outside.

#### Drawer geometry
- **Height is `min(406px, 50%)` + the safe-area bottom.** 406 is the node's height on
  its 812 frame; the `min` keeps it to half the screen on a short phone. `Toolbar`'s
  spacer conventions do not apply — the drawer is absolutely positioned, so the strip
  above simply takes `PV_DRAWER_H` as its `bottom`.
- **The fill is a linear wash over a radial one** (`451:14966`). Figma's transform,
  `matrix(0 24.75 -63.674 0 188 -22.5)` at `r=10`, decodes to an ellipse centred on
  (188, −22.5) with semi-axes 636.74 × 247.5 → `169.8% 60.96% at 50.13% -5.54%`. The
  linear layer's top 13.3% is fully transparent and the radial's centre stop is only
  20% black, so the preview reads faintly through the drawer's top edge. **Deliberate
  — do not flatten it to a solid fill.**
- **The card row's ring is a real border**, unlike the navigator's inset shadow. The
  row is a scroller with a 12px gap, so the 4px reflow an outside border causes is
  invisible here, and a border is what draws the ring *outside* the card as the node
  has it. `2px` padding + `2px` border reproduces the node's 4/4.79 offset exactly:
  ring 122×109 on a 114-wide card.
- **Cards follow the chosen page's aspect**, so the thumbnail is a true miniature.
  The node's own 114×99.418 is a square-leaved book, which its sibling `451:14499`
  contradicts anyway. ⚠️ A portrait card is 152 tall, which fits the node's 406
  drawer but not the `50%` a 568-tall phone resolves to — so `LayoutDrawer` measures
  itself with a `ResizeObserver` and caps the card width to the room left below
  `top: 164`. Verified: the row's bottom edge is 16 inside the drawer at 667 and 568,
  and the cards stay at the node's 114 at 844.
- **Both rows scroll.** The five chips measure ~430 against 375 (which is what clips
  the last one in the node's own render) and four 122-wide rings overflow any phone.
- **The selected chip is auto-width**, not the node's fixed 80×34, so a chip does not
  resize as the selection moves along the row. Both states are 34 tall regardless
  (8 + 18 + 8).
- The close/confirm buttons are `GlassIconButton` with `gloss` — the same controls the
  page view's header uses — and the confirm button reuses `CONTINUE_ACCENT` rather
  than the node's `color-dodge`/`soft-light` pair, for the reason recorded above.
  Its glyph is the node's own `24x24/check`, and the node's `close` export is
  **byte-identical** to the existing `pb-editor-close.svg`, so only one asset was
  added.

#### Not in the design
- **Every count but 2**, per above, and a fourth 2-photo template (plain halves,
  stacked).
- **A layout applies to the cover too.** The node's page view opens on page "0" and
  never shows the cover, but the cover's front leaf carries the same well, so it takes
  templates on the same footing.

#### Verified
Driven at 390×844, 402×874, 430×932, 390×667 and 320×568: the drawer lands at 406
(48.1% at 844) with r24 top corners, rings at x 24/158/292 measuring 122×162, the
`#CCA34C` ring on the selected card, header buttons at y 16 and the title at 28 —
all the node's numbers. Tapping a card re-lays the page live (2 → 4 slots), confirm
persists `{"4":"4-1"}` and the page keeps four slots in the **book view** as well,
close reverts to one slot and stores nothing, the navigator and toolbar come back on
dismiss, all four cards and both header buttons hit-test with `elementFromPoint`
(the fourth card after scrolling the row), a filled book puts real photos in 12 card
slots and 4 page slots starting with the page's own photo, and there is no page
overflow on either axis, no broken local asset and no JS error at any width.
`animation` and `transform` on `<body>` are both still `none`.

#### Selected photo (Figma `451:14611`)

Tapping a photo on a page in page view selects it: the photo takes a 1px ring and the
toolbar swaps for the node's six selection tools. Like page view and the layout
drawer, it is a state of `PageView` — `selected` is `{slot, i}`, naming the page in
the strip and the slot of that page's layout, and it lives on `PageView` rather than
in the leaf because the toolbar is a sibling that has to swap with it.

⚠️ The node is a third WIP frame named "test", carrying the same off-canvas scratch
`451:14499` and `451:14921` do — the 177px photo squares at x=432/610 and the
`#272727` add-strip at x=379. None of it is built.

#### ⚠️ The ring is an overlay, not an inset shadow — the opposite of the usual rule
`451:14635` puts a 1px `#1500FF` stroke on the photo rect, whose box is exactly
`PV_WELL`. Everywhere else in this project such a ring is an inset shadow (the status
banners, the collection covers, the navigator thumb, the account cards), because a
real border would resize the box. Here an inset shadow is **invisible**: it paints
above the element's background but *below* its content, and the well's content is an
`<img>` at `inset: 0` that covers it completely. So the ring is a separate
`position: absolute; inset: 0` span with `pointerEvents: 'none'`, painted after the
image. That keeps the slot's geometry untouched, which is what a Figma inside-stroke
does anyway — measured, the ringed slot sits at 4.934% / 5.456% against the node's
4.937% / 5.456%.

`pointerEvents: 'none'` on the overlay is load-bearing: without it the ring swallows
the tap on the very photo it marks, so a second tap could not reach the slot.

#### Only a filled slot is selectable
`LayoutWell` grew `onSelect` / `selected`. A slot with a photo renders as a
`role="button"` wrapper around its `PhotoWell`; an empty well renders exactly as
before, because there is nothing to select and the node only ever shows a filled
photo ringed. That also means the layout work and this compose: a 4-photo page has
four independently selectable slots, and `selected.i` is which one.

`aria-hidden` on the `LayoutWell` root is now conditional — it is still hidden while
the slots are decorative (the book view, the drawer cards), but a hidden subtree would
take the real controls off assistive tech too.

#### Selection toolbar — `451:14675`
Six tools laid out **from x=0** with `gap: 4` (against page view's `gap: 8` and 16px
gutters), so `Toolbar` now takes its `tools`, `gap` and `padX` from whether anything is
selected. A `{ divider: true }` entry renders the node's `451:14679` — a 1px
`rgba(217,217,217,0.1)` rule, `alignSelf: stretch`, between Back and Replace. It is
very faint by design; measured 1×48 at the node's own colour.

- **Two glyphs needed no new asset.** The node's `icon / Magic tool` and `icon /
  Delete` exports are **byte-identical** to `pb-editor-tool-ai.svg` and
  `pb-editor-tool-delete.svg` — checked with `cmp`, not by eye. Back, Replace, Edit
  and Move are new (`pb-editor-sel-*.svg`); note the node's Back here is an **arrow**,
  not the header's chevron, so `pb-src-back.svg` does not serve.
- The row measures 433 and scrolls, as the node's own 557-wide container does. All six
  hit-test with `elementFromPoint` across its scroll range.

#### Only "Back" is live
It deselects, which is what the node's leading position and back arrow mean. Replace,
Edit, Move, Delete and Ask AI are inert, on the same footing as every other tool in
this editor — **Delete deliberately so**: the undo pill is inert, so a working delete
would drop a photo out of `pb_placed` with no way back. Wire it to a `setPlaced()`
splice when that is wanted.

⚠️ Because the selection row has no Layout tool (the node's doesn't either), **the
layout drawer cannot be opened while a photo is selected** — you deselect first.
`openDrawer` still clears the selection defensively, since changing a template can
change how many slots a page has.

#### Three ways out of the selection, and why
- **"Back"** — the node's own control.
- **A tap on the page anywhere but a photo.** The strip's click handler clears it;
  slot taps `stopPropagation`, so they never reach it. The iOS-standard escape, and it
  is the same reasoning as the upload sheet's scrim.
- **Scrolling to another page.** A ring on a page that has scrolled out of view, with
  the selection toolbar still up, reads as a bug, so the selection is cleared when
  `active` moves off `selected.slot`.

#### Deviations from the node
- **The navigator stays.** `451:14611` drops the page navigator and lifts the book from
  231 to 197.81 — but nothing covers that band (its toolbar is the same 139 tall as
  page view's), the frame is scratch, and page navigation is orthogonal to whether a
  photo is selected. Removing it would also slide the book 33px the moment you tap a
  photo, which reads worse than either end state. The book therefore stays exactly
  where it is and the navigator stays reachable.
- **The header is page view's.** The node's is identical apart from the 36px back
  button, which is already a documented deviation (kept at 40 so the control does not
  resize between the modes of one screen).

#### Verified
Driven at 390×844, 430×932 and 320×568 with a filled book: tapping a photo rings it at
`#1500FF` 1px on the node's own well box, the toolbar becomes exactly Back │ Replace /
Edit / Move / Delete / Ask AI with `gap: 4`, `padding-left: 0`, the first tool flush at
x=0 and one 1×48 `rgba(217,217,217,0.1)` divider; the ring paints over the photograph
and does not block a tap on it; "Back", a tap on the page background and a scroll to
another page each clear the selection and restore the eight-tool row; all six tools
hit-test across the row's scroll range; and there is no page overflow on either axis,
no failing request, and `animation`/`transform` on `<body>` are both still `none`.

#### Arrange mode (Figma `451:15148`)

Tapping **Arrange** in the book view's toolbar turns the spreads into a compact
scrolling list you rearrange by hand. Two tabs: **Photos** moves photographs between
pages, **Pages** moves whole spreads through the book. A fourth mode of `EditorScreen`,
alongside page view and its layout drawer.

⚠️ The node is the fourth WIP frame named "test" and its list is scratch: six blocks
in which spread 3 duplicates spread 2 and spread 6 duplicates spread 4, page captions
reading 1 / 2-3 / 2-3 / 4-5 / 6-7 / 4-5, and the same 93-tall `backdrop-blur(25px)`
band the other three frames carry. What it *does* give — and what the build takes — is
**three distinct sheet treatments that map exactly onto the three states a drag has**:

| node | treatment | state it becomes |
|---|---|---|
| `451:15152` | paper at `opacity: 0.10` | the spread being dragged |
| `451:15163` | `rgba(248,248,248,0.5)` at `opacity: 0.5`, content scaled 152/164 | the spread under the finger |
| `451:15187` | the plain sheet | everything else |
| `451:15159` | an empty 164 box at `opacity: 0.5` | the hole a lifted photo leaves |

Verified against those numbers: source `0.1`, target `0.5` at `scale(0.926829)`,
neighbours `1`, and the source well's hole at `0.5`.

#### ⚠️ Press-and-hold to lift, not drag-on-touch — it is what keeps the list scrollable
Claiming the gesture on `pointerdown` would need `touch-action: none` on every photo,
and photos are most of the list, so the page would barely scroll. Instead one handler
serves both interactions the node asks for:

- **a tap** (released inside 250ms having moved under 8px) selects; a second tap swaps;
- **a press-and-hold** (250ms) lifts the item and then follows the finger.

Moving more than 8px before the hold fires is read as a scroll and cancels the press —
verified: a 30px drag before the hold leaves the order untouched, with no clone and no
selection ring.

**A window-level `pointerup`/`pointercancel` listener is the safety net.**
`setPointerCapture` normally guarantees the release comes back to the element that took
it, but capture can fail, or the element can unmount mid-drag — and a drag whose
pointerup never arrives hangs with the clone stuck under the finger. That is not
hypothetical; it happened under test. Whichever handler fires first clears `pending`,
so the second is a no-op.

**Edge auto-scroll** (within 80px of either end of the list, rAF-driven) is an addition.
A 24-page book is far longer than the viewport, and without it you could only ever drop
onto a target already on screen. Verified: a drag held at the bottom edge scrolled the
list 0 → 770 and dropped on page 9, which starts off screen.

**The drop target is hit-tested against live rects**, not cached ones — the list moves
under the finger, including by auto-scroll. It hit-tests the *leaf box*, so the pointer
does not have to be exactly on the photograph.

#### ⚠️ Guard every page-number test on the page number itself
The inside-cover leaves have no page number, and `sel` is `null` when nothing is
selected — so `sel === n` rang **every inside cover permanently**. Caught by looking at
a screenshot, not by a measurement. For the same reason a leaf with no page number is
never registered as a drop target: a `null` key in the map makes `hitTest` hand back
`NaN` as a page number, which would then corrupt `pb_placed`.

#### What the gestures write
- **`swapPhotos(a, b)`** — one operation serves every gesture. A drag onto an occupied
  page swaps; onto an empty page it moves; tapping two photos swaps. Pages are 1-based,
  as `pb_placed` is.
- **`moveSpread(from, to)`** — the photos are re-laid onto pages 1..n in the new order
  rather than the pages being renumbered, so the book's pagination never changes. Chunk
  sizes are `[1, 2, 2, … 2, 1]` (the first spread carries only page 1, its other leaf
  being the inside front cover; the last only page n) and they sum to n either way, so
  reordering chunks of unequal size still lands exactly one photo per page. Verified:
  `[2,3,1,4,…]` with spread 0 → position 1 gives `[3,1,2,4,…]`.
- Both persist through one `writePlaced`, which **trims trailing nulls** — they carry
  no information and would inflate the length `added` is re-derived from on reload.

⚠️ **`pb_layouts` is deliberately not permuted** by `moveSpread`. It is keyed by slot
index, and a template belongs to the page it is on rather than to the photo that
happens to sit there — so moving a spread moves its pictures, not its layouts.

#### ⚠️ A leaf here shows ONE photo, not its layout template
`pb_placed` holds one photo per page — that is what auto-fill writes and what the
navigator reads — so one photo per page is exactly what there is to rearrange, and
**every gesture in this mode moves real, persisted data**. A page given a multi-photo
template in the layout drawer therefore reads simpler here than in the book view, whose
extra slots are filled from the upload pool as a *preview* (see `slotPhotos`).

That difference is deliberate rather than an oversight: making the two agree means
making placement **per-slot**, which is a change to the storage model — every reader of
`pb_placed` plus `autoFill` and the `added` derivation — and not a side effect of this
mode. Until then, dragging a pool-filled preview slot would be a gesture that could not
persist, which is worse than not offering it.

#### Geometry
- **Blocks butt up against each other** — the node's 203 pitch is a 172 sheet plus a 31
  caption strip with **no gap**, against the book view's 47. Only the strip is a
  constant: the sheet's height follows the page format as everywhere else, so a
  portrait book measures 237 + 31 = 268 rather than the node's square-leaved 203.
- **`leafBox` is now shared** between `Leaf` and `ArrangeLeaf` so the two views cannot
  drift. ⚠️ The node paints both arrange leaves white where the book view shades the
  left one `#F5F5F5`; the book view wins, or the same sheet re-shades itself the moment
  Arrange is tapped.
- **The add pill is the node's smaller 56×26 r24** with a 16px plus, not the book
  view's 56×38. The node has it straddling the block's bottom edge (top 189 of 203),
  which with no gap between blocks would put it on the next sheet, so it is centred in
  the caption strip instead. It appears after every spread but the last, per the book
  view's rule.
- **Page captions are white, not the node's black.** `451:15153` and its siblings are
  12/28 black at 35% — unreadable on this near-black page, and plainly carried over
  from a light context.
- Header 236 on a 44 status bar (`env + 192`), title at 68, body at 97 with the node's
  own line break, switcher at 158. The list starts 8 below the header.

#### The header keeps its opaque top stop
Unlike the page view's header, which drops the node's top stop to 55% alpha so the blur
it sits on stays visible. Here the header is a real panel carrying two lines of copy and
a control rather than a peek-through scrim, so the node's fully opaque `rgb(20,20,20)`
is the intent — and a progressive blur under it would be invisible. Flat
`backdrop-filter: blur(5px)`, as the node specifies.

#### The switcher — `451:15255`
343×40 at 16, r16, `rgba(0,0,0,0.8)` + `blur(10.95px)`, padding 4; the selected segment
is a white r12 fill with `#333` text. Sampled against the node's render, the unselected
side reads **(4,4,4)**, which is exactly 0.8 black over the header's own `rgb(20,20,20)`
— so the 80% is real and must not be flattened to a solid. Expressed as 16px gutters
rather than a fixed 343, so it measures 358 at 390 and 398 at 430.

The node types the unselected label in **Brandon Text 14** — Figma's fallback for a face
this project does not carry — so both labels take the SF stack at the node's 15/20
−0.24.

#### ⚠️ The Done button's `mix-blend-mode` was resolved to a flat colour
`451:15240` is `#00C2C9` at `mix-blend-mode: overlay`. Implemented literally that is the
trap the editor's Continue button already records — WebKit cannot blend across a
composited layer boundary, and this sits in a stacking context with backdrop-filtered
siblings. Sampling the node's own render instead: over the opaque part of its band
(`rgb(27,27,27)`) the button resolves to **(0,41,42)**, which is exactly `2·base·blend`,
the overlay formula for a dark base. So the blend ships as `#00292A`, with the node's
`inset 0 0 27px rgba(0,0,0,0.25)` on top.

The consequence, and it is a real one: the button no longer brightens where light
content sits behind it — the node samples (0,69,74) where a white sheet shows through
its translucent band. Recovering that would mean re-introducing the blend.

#### Not in the design
- **The floating clone.** The node fades the source but puts nothing under the finger,
  and a drag with nothing under the finger reads as broken. It is positioned against
  the arrange root rather than `position: fixed`, so it is also correct inside the
  desktop `IOSDevice` frame — verified there, with the finger landing inside the clone.
- **The tap-selection and drag-hover rings** (`inset 0 0 0 2px #00C2C9`). The node shows
  neither state; the colour is its own accent, taken from the Done button.
- **The Pages tab entirely.** Only the Photos tab is drawn, so its copy — "Drag and drop
  a spread to move it, or tap 2 pages to swap their photos." — is written to the node's
  pattern.
- **Edge auto-scroll**, and the 160ms opacity/transform transition between drag states.

#### Verified
Driven at 390×844, 430×932, 320×568 and in the desktop `IOSDevice` frame with a filled
24-page book: header title at 68 and body at 97 with the node's line break, switcher
16/158/40 at r16 on `rgba(0,0,0,0.8)` with Photos selected white on `#333`, list top
200, 13 blocks at a 31px caption strip, add pill 56×26, Done 338×53 r55 on
`rgb(0,41,42)` sitting 25 above the bottom. Tap-tap swaps two pages
(`1,2,3…` → `2,1,3…`); a held drag swaps page 2 with page 3; a spread moved from
position 0 to 1 gives `[3,1,2,4,…]`; all three persist to `pb_placed`. Drag states hit
the node's `0.1` / `0.5` / `scale(0.926829)` exactly, the hole reads `0.5`, the hover
ring is `#00C2C9` 2px inset. A pre-hold move cancels the press. Auto-scroll runs 0 → 770
and stops on release, and the clone is cleared every time. Done returns to the book view
at its former scroll offset. No page overflow on either axis at any width, no failing
request, and `animation`/`transform` on `<body>` are both still `none`.

#### Header progressive blur — reused from the image picker
`IOSProgressiveBlur` in `shared/ios-frame.jsx` is the image picker's header effect
(`image-picker/image-picker.jsx` ~1850) extracted so the editor can share it rather
than copy it. The picker file itself stays frozen.

The trick is that the three masks **overlap in a staircase** rather than tiling
end-to-end, so each blur stage hands off to the next with no visible seam:

| layer | mask |
|-------|------|
| `blur(16px) saturate(160%)` | opaque 0 → 35%, gone by 60% |
| `blur(8px) saturate(150%)` | opaque 25 → 60%, gone by 85% |
| `blur(3px)` | opaque 50 → 85%, gone by 100% |

**Percentage stops are correct here** — the fade then always ends exactly at the
element's bottom edge however tall the safe-area inset makes the header. This is the
opposite of the editor's *toolbar*, where the stops must be px because percentages
scale with the container and drag the strong layers up over the spreads. Both are in
this file; do not "unify" them onto one unit without re-checking.

**The scrim must stay translucent.** The node's own gradient starts at a fully opaque
`rgb(20,20,20)`, which would hide the very blur it sits on. The header keeps the
node's colours and 0.3%/96% stop positions but drops the top stop to 55% alpha. At
rest the header is dark-on-dark so this reads identically to the node — verified, the
resting ramp matches its shape (19→24 in the node, 25→30 here, the constant offset
being the 103-vs-147 header height without safe-area insets). The difference only
shows when a white spread scrolls under it, which is exactly when the blur should be
visible.

#### `GlassIconButton` gained `tint`, `accent`, `width` and `gloss`
The brief asks for the home header's liquid glass on the editor's icon buttons, but
that recipe's near-clear `rgba(255,255,255,0.03)` interior vanishes on a near-black
backdrop. `tint` carries the node's `rgba(0,0,0,0.25)` scrim, `accent` takes the
Continue button's teal wash, and `width` makes the 88×40 undo/redo pill. All four
default to the previous values, so the home header is untouched.

`gloss` is the fuller iOS-26 treatment, on for all three editor header buttons:

| layer | what it does |
|-------|--------------|
| `blur(14px) saturate(180%)` | saturate is safe here only because the backdrop is near-black and has almost nothing to boost — on home's teal it drove the interior cyan |
| lensed rim | three inset shadows (1px hairline, 7px bloom, 18px inner falloff) — **inset shadows, not a radial-gradient**, so the same layer follows `border-radius` for both the 40px circles and the 88×40 pill |
| specular sweep | `linear-gradient(35deg, …)` bright at both ends, clear through the middle; 35° puts the strong catch on the bottom-left arc, matching the light direction established by the home mock |
| edge | `1px solid rgba(255,255,255,0.10)` plus a hard specular inset (0.42 bottom-left / 0.14 top-right) |
| drop shadow | without it the button reads as a hole cut in the header rather than an object on it |

Two things to keep in mind if you touch it:
- **Normal compositing, not `plus-lighter`.** The default recipe uses plus-lighter for
  its rim, but in the editor the scroller is a separate composited layer and
  plus-lighter cannot blend across it (see above).
- **Gloss puts a floor under the interior.** The sweep adds roughly +23 to every
  channel, so the Continue button now measures (30,61,62) against the node's
  (21,53,54) — about +8, and the node's red is simply unreachable under any positive
  tint. The rim is far brighter than the node, which has no rim at all there; that is
  the requested effect, not a drift. Chasing the node's flat numbers would mean
  removing the gloss.

Home's bell is deliberately left on the default recipe — it was pixel-matched to its
own design mock (within ~5/255). Pass `gloss` there too if the glossier look should
carry across the app.

#### Why the glass is hand-built and not a library
Every refraction-based liquid-glass library — `liquid-glass-react`,
`@developer-hub/liquid-glass`, shuding's `liquid-glass` — gets its lensing from
`backdrop-filter: url(#svgFilter)`. WebKit's `backdrop-filter` accepts filter
*functions* only, not `url()` references, so that technique silently no-ops on the
iPhone PWA this prototype targets. The remainder are npm/React-bundler packages, and
this project has no build step and must precache for offline. Hence the layered CSS
above, which works in both engines.

#### Design inconsistencies in the node, and what was chosen
The editor frame is WIP and contradicts itself in four places:
- **Two sheet variants.** `451:15592` is flat white with a 1px/3px shadow; the other
  three spreads *and* the cover are `#F8F8F8` + 1px `rgba(0,0,0,0.25)` + r2 + a 4px
  shadow. Took the majority. The hairline is an inset shadow, not a border, so the
  4px inner padding still measures from the outer edge as it does in Figma.
- **Two add-spread pills.** `451:15587` is `#272727`/r12 with a `#363636` border;
  `451:15602` and its two siblings are `#333` full pills. Took the majority
  (confirmed by sampling the render: 39,39,39 at r≈12 vs 51,51,51 at r≈19).
- **Square leaves on a "Large Portrait" book.** The node's leaves are 164×164 while
  its own card reads "Large Portrait photo book". The brief asks the spreads to
  represent the format chosen on the previous step, so the format wins — `pageW/pageH`
  comes from `sessionStorage.pb_book`.
- **€42.99 on the card vs €44.99 in the product page's review block** for the same
  configuration. The live computed total is used so the editor agrees with the review
  the user just saw; €42.99 survives only as the fallback when `editor.html` is opened
  directly.

Not in the design, and flagged as such in code:
- **Sixth toolbar tool.** The node shows five (Photos, Arrange, Themes, Style, AI
  help) with the row clipped at the frame edge; the brief lists Options as the sixth,
  drawn with the design's own `icon/Options` asset. Label copy is the node's
  "AI help", not the brief's paraphrase "Ask AI".
- **Add-spread actually inserts a spread**, bumping the page count and the price by a
  reverse-engineered `EXTRA_SPREAD_PRICE`, on the same footing as the product page's
  `SIZE_BASE` / `COVER_ADD`. Because every leaf is an empty placeholder, inserting at
  position *i* renders identically to appending, so the state is a plain counter.
- **`[n | inside back cover]`** closing spread, as above.

Inert by request: all six tools, the card's settings icon, the header's Continue arrow
and the undo/redo pill (the node ships its redo glyph already in the `#333` disabled
state). Only the close button navigates — `navigation.pop()`.

### Account page, rebuilt against Figma `451:14038`

Supersedes the hand-written iOS inset-grouped list the screen used to carry (avatar
block → My Orders → Preferences → Support → Log out), which predated any Figma call.
The node is a 390×1410 frame; every band was verified by measuring the rendered boxes
in a real 390px viewport:

| band | component | node | node y | measured y | h (node / built) |
|---|---|---|---|---|---|
| welcome | `Welcome` | `451:14041` | 56 | 56 | 87 / 87 |
| stats strip | `StatsStrip` | `451:14045` | 167 | 167 | 66 / 66 |
| refer CTA | `ReferCard` | `451:14057` | 257 | 257 | 70 / 70 |
| sections | `AccountSection` ×4 | `451:14064` | 351 | 351 | 970 / 975 |

The container (`451:14040`) is `pt 56 / px 20 / pb 32` with `gap: 24`, and those four
offsets are exactly what it adds up to. Inside `451:14064` the four sections have **no
gap of their own** — each is `py: 16`, so consecutive cards sit 32 apart. Add a
section without that `py: 16` and everything below it shifts.

**There is no back button and no nav bar.** The node has neither: account is a tab
destination, so the tab bar is the way out. That is also why `TabBar` grew an `href`
on the Home tab (see below).

#### The tab bar moved to `shared/tab-bar.jsx`
`home.jsx` owned `TABS`, `TAB_BAR_PAD_BOTTOM`, `TAB_BAR_HEIGHT` and `TabBar`
outright. This node carries the same bar, so all four moved out **verbatim** — the
same extraction `shared/collections.jsx` got when home and photo-sources turned out
to share the collection covers. Both screens load it after `ios-frame.jsx` (which
defines the `press()` it uses).

⚠️ Top-level declarations in a classic script land in the **global lexical scope**, so
any screen loading `tab-bar.jsx` must not redeclare those four names — the same
collision trap as `PB_DISPLAY`. For that reason the label face inside the file is
`TAB_LABEL_FONT`, not home's `BANNER_FONT`: two top-level `const BANNER_FONT`
declarations in two classic scripts would collide.

Two behavioural changes, both needed the moment the bar served more than one screen:
- **The Home tab now has `href: 'home.html'`.** It never needed one while the bar was
  home-only.
- **A tab never navigates to the screen it is already on** (`tab.id !== activeTab`).
  That is what lets one `TABS` list serve every destination.

⚠️ The node marks **Tab 1 (Home) selected even though this is the account screen** —
a designer slip. The build selects `account`, which is the correct behaviour. And per
the note on `509:19230`, Figma ships only one variant per tab icon, so the Account tab
gets the selection pill and the teal label but keeps its dark outline glyph; pull the
filled variant from Figma if that matters.

#### The wash is NOT `--pb-wash-stops`
`451:14039` is 390×429 at the top, the same slot as home's `451:13863`, but it is a
different paint: its second stop sits at **15%** where the shared list has 12.04%, it
carries the 3 extra mid stops the shared list drops, and its ellipse is ~1.5× home's
(4128 × 634.5 against 2739 × 421). So it ships as the inline SVG Figma itself emits,
carrying the `gradientTransform` verbatim — the same reason home's `tealWash` does.
Decoding the matrix: centred at (6, 0), essentially axis-aligned, deep teal in the
top-left corner fading out across and down the header.

It lives **inside the scroller** at `z-index: -1` with `isolation: isolate` on the
scroller — the trap CLAUDE.md already records for home's gradient. Verified: the
wash's offset tracks `-scrollTop` exactly (300px for a 300px scroll).

#### ⚠️ The card rim is an inset shadow, not a border — again
Third place this bites. Figma strokes are *inside* strokes, so the node's heights
already include the 1px white rim: the My-account card is 278 and its rows sum to
exactly 278, leaving no room for a real border. A CSS `border` on an auto-height box
adds 2px and every card comes out oversized. `inset 0 0 0 1px #FFF` paints it over
the content edge, which is what Figma is doing. Same for the stats strip (66 = 8 + 50
+ 8, no room either).

#### The stats strip's height comes from the hairlines, not the columns
`451:14045` is `py: 8` with three 36-tall columns — but it measures 66, because the
two 1px rules are 50 tall and are the tallest child. `align-items: center` then
centres the columns against them, landing each on the node's own `y=15` (8 + 7).
Column widths are the node's own 70 / 84 / 70 — deliberately unequal, and the row is
centred. The rules are `rgba(51,51,51,0.05)`: as faint as that sounds on a near-white
fill, and that is the node's value.

#### Deviations from the node, all deliberate
- **The "My photos" row is 56 tall, not 50.** Four of the five My-account rows carry an
  explicit `h: 56` and that one does not, so it falls to its content (13 + 24 + 13).
  Took the majority, per the convention the editor's sheet/pill variants already set —
  a 6px-short row inside a list of 56s is a visible defect. Card 284 against the
  node's 278.
- **Preferences drops a leading divider.** `451:14136` is a 1px divider at the *top* of
  the card, left behind when the bell row above it was hidden. Card 113 against the
  node's 114, which matches Support's card exactly.
- **Cards are full width.** The Preferences and Support cards are 343 wide inside a 350
  column while My account and Account actions are 350. Normalised to 350.
- **Inter → the system stack.** The node types the welcome block and the row labels in
  SF Pro but the stat/refer/action labels in Inter. Inter is Figma's own default
  fallback, is not among the faces this project self-hosts, and sits directly beside
  SF Pro Semibold at the same size. One stack throughout.
- **Section titles use `PB_DISPLAY`.** The node's Google Sans Flex Bold 24/40 at −0.24
  is the same heading metric home's `SectionHeader` uses, so it takes the same stack
  (DM Sans standing in).
- **`backdrop-blur: 28.65px` on the container is not implemented.** The layer has no
  fill at all, and Figma scales a background blur by the layer's own fill alpha — so
  Figma renders none. Same finding as the onboarding copy panel.

#### Not in the design
- **Destinations.** No row and neither card carries a link. Only the two the prototype
  can satisfy are wired: **My photos → `photo-sources.html`** and **Log out →
  `onboarding-1.html`** (replace). The other seven rows and the refer card are inert,
  including "Delete account" — destructive, with no confirmation flow designed.
- **Press feedback on inert rows.** Every row keeps `press(0.97)` and the pointer
  cursor even with nowhere to go, matching the Create grid's five destination-less
  cards: the chevron is the design's affordance and a row that refuses the touch would
  read as disabled.
- **The chevron is the node's own text `›`** at 18px in `#333`, not the iOS
  tertiary-grey vector the rest of the app uses. Kept as the glyph.

#### Mock data
`MOCK.user` took the node's own copy (`Iria` / `iria.otero@albelli.com`) and gained
**`firstName`** — the welcome headline is a 38px `nowrap` display line, so a full name
would overflow the 350 column. `MOCK.account.stats` is new. `MOCK.account.orders` is
kept for a future orders screen. Nothing else in the app reads `MOCK.user`.

#### Verified
All four bands land on the node's y exactly and the welcome block's three lines land
on 6/25/70 with heights 18/44/17 (frame 87). No horizontal page overflow at 390×844 or
430×932, all 14 images load, all 11 rows hit-test as tappable at both rest and maximum
scroll (the last row clears the floating tab bar by 72px), the wash scrolls with the
content, and `animation`/`transform` on `<body>` are both `none`. Home still renders
after the extraction: 44/44 images, no JS errors, its own tab bar unchanged at
340×50/r25 with Home selected.

### Testing a mobile layout in headless Chrome
`--window-size=375,1366` does **not** give a 375px layout: headless Chrome clamps the
viewport to a 500px minimum, so the page lays out at 500 and the screenshot merely
crops it — which reads convincingly as a broken layout. Render the screen inside an
exactly-sized `<iframe>` on a harness page instead; the iframe gets a real 390×844
viewport. `env(safe-area-inset-*)` is 0 there, so the header measures 103 tall rather
than the node's 147 — expect that difference when diffing against Figma.
Also note `requestAnimationFrame` does not advance under `--virtual-time-budget`;
chain `setTimeout` instead.

### Create grid geometry (Figma `367:6068`)
Section is 350 wide inside the page's 20px gutters, `py 16`, 16px gap under the
title. Grid is 2 equal columns with 12px gaps, so cards come out **169×227.1** at
390 (`(350-12)/2 = 169`; image strip is a `171/165` aspect = 163.07, plus a fixed
64px caption). Card r16, white; title 16/600/20 −0.16 `#333`; price 13/28 in
`#007377` with "from " at weight 510 and the amount bold.

Two faithful oddities carried over from the design: **Gifts reuses the Calendars
artwork** (both fills point at the same image in Figma), and the Calendars/Gifts
fills are placed at a sub-rect (`left 14.04% top 12.58% w 71.93% h 74.84%`) rather
than filling the box — the PNGs are transparent, so `object-fit: cover` is wrong
for them.

Only the Photo books card navigates (→ `product-photobook.html`); the other five
have no destination in the prototype yet.

**Card shadow is an addition, not from the node.** `367:6422` has no shadow, and
Figma's own render of the grid shows flat `#F1F6F6` in the gaps with no falloff at
any card edge. The cards use `0px 4px 16px -1px rgba(0,77,74,0.1)` — the same card
shadow the design applies to the top banners (`404:6794`) and Ideas cards
(`367:6246`) — because the flat version read as a bug.

### A horizontal scroller clips its cards' shadows
`overflow-x: auto` forces `overflow-y` to compute to auto/hidden — it can never be
`visible` — so a shadowed card inside a horizontal scroller gets its shadow sliced
off at the bottom edge. Give the scroller bottom padding at least as deep as the
shadow's reach (offset + blur − spread; 20px for the brand card shadow) and take
the same amount off its bottom margin to keep the intended gap.

### `PB_DISPLAY` lives in brand.jsx, and load order matters
Each `text/babel` file is evaluated as its own classic script, so two top-level
`const PB_DISPLAY` declarations collide in the global lexical scope. It is defined
once in `shared/brand.jsx`; `onboarding-shell.jsx` consumes the global, so **every
page loading the shell must load `brand.jsx` first**.

### PhotoboxLogo is scale-driven — one set of numbers, two screens
The home header lockup (`451:13866`) is *exactly* the splash lockup (`451:13761`)
at 2/3: verified by extracting both star path exports and confirming every
coordinate differs by exactly 1.5×, and the wordmark's size/leading/tracking are
2/3 of splash's (37.319→24.88, 24.88→16.586, -1.4928→-0.9952). So `PhotoboxLogo`
takes a `scale` and one SVG serves both. `glow` adds the four splash glow layers;
the home header uses the base glyph only.

### Liquid glass: use plus-lighter for the rim, and no saturate()
Sampling the design mock against its own backdrop:

| patch | mock | IOSGlassPill recipe |
|-------|------|---------------------|
| interior | −3, −5, −5 | −37, +21, +23 |
| rim | +21, +19, +19 | +66, +49, +49 |

Two findings, both in `GlassIconButton`:
- **Drop `saturate(180%)`** on a teal backdrop. The mock's glass is colour-neutral
  to what's behind it; saturate drove the interior cyan.
- **Blend the rim with `plus-lighter`.** The mock lifts all three channels almost
  equally (+21/+19/+19). A normal white overlay on teal *cannot* do that — it
  interpolates toward white, so it lands around +21/+9/+9, weighted to red.
  plus-lighter adds channels instead, which reproduces it.

The highlight sits on the **bottom-left** arc, not the top-left. Final match is
within ~5/255 on every sampled patch.

### Brand wordmark
The Photobox wordmark is **Teachers SemiBold (600)** — a Google Font (OFL), self-hosted
at `shared/assets/teachers-variable-latin.woff2` and declared as `@font-face` in
`shared/styles.css`. Use `fontFamily: '"Teachers", -apple-system, system-ui, sans-serif'`.
Splash lockup is 157×41 at y=401/844, wordmark 37.319px / -1.4928px tracking.

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
                                                │          └─(push)─> editor.html  ← Continue arrow inert
                                                │                     └─ Arrange tool ─> arrange mode (in-screen) → Done
                                                │                     └─ tap any page ─> page view mode (in-screen)
                                                │                        └─ Layout tool ─> choose-layout drawer (in-screen)
                                                │                        └─ tap a photo ─> selected state + selection toolbar (in-screen)
                                                │                     └─ upload sheet "Select photos"
                                                │                        └─(push)─> photo-sources.html
                                                │                                   └─(push)─> ../image-picker/index.html
                                                │                                              ├─(back)─> photo-sources.html
                                                │                                              └─(Continue)─> editor.html
                                                │                                                 └─ auto-fill prompt → book filled
                                                │
                                                │  ⚠️ basket → checkout → payment → success is
                                                │  currently unreachable: the picker no longer
                                                │  jumps to the basket and the editor's Continue
                                                │  arrow is still inert.
                                                │                                                               └─(push)─> checkout-delivery.html
                                                │                                                                          └─(push)─> checkout-payment.html
                                                │                                                                                     └─(replace)─> order-success.html
                                                │                                                                                                  └─(push)─> home.html
                                                ├─(tab bar)─> account.html
                                                │             ├─(replace)─> onboarding-1.html (log out)
                                                │             ├─(My photos)─> photo-sources.html
                                                │             └─(tab bar: Home)─> home.html
                                                │                ⚠️ no back button — the node has none;
                                                │                account is a tab destination.
                                                ├─(tab bar: Projects)─> editor.html
                                                ├─(tab bar: Memories)─> photo-sources.html
                                                ├─(status banner: tracking)─> account.html
                                                ├─(status banner: editing)─> editor.html
                                                └─(Memories / Collections / Ideas)─> photo-sources.html
                                                                                  / product-photobook.html
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
| `IOSProgressiveBlur` | `scrim` | Three-stage progressive blur scrim, top-down — the image picker's header effect |

`shared/brand.jsx` also exports `PhotoboxLogo`, **`PhotoboxStar`** (the lockup's
sparkle on its own at any width, with the splash glow layers) and `GlassIconButton`.
`shared/collections.jsx` exports `COLLECTIONS` + `CollectionCard` — see below.
`shared/tab-bar.jsx` exports `TabBar`, `TABS`, `TAB_BAR_HEIGHT` and
`TAB_BAR_PAD_BOTTOM` — loaded by `home.html` and `account.html`, after
`ios-frame.jsx` for its `press()`.

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
Precaches every screen HTML + JSX, the shared assets (incl. fonts and splash SVGs),
manifest.json and the image-picker files. Cache name `photobox-v24`.

**Strategy: network-first, cache fallback** — and same-origin requests are fetched
with `cache: 'no-store'`. Both parts are deliberate:

- It used to be **cache-first**, which froze the prototype. Once the SW was
  installed, editing a screen file changed *nothing* in the browser — not on
  reload, not even for `fetch()` — because the response came from `photobox-v1`
  forever. The cache only refreshed when `service-worker.js` itself changed.
- Plain `fetch(e.request)` under network-first is *still* not enough: it can be
  answered from the browser's HTTP cache, which hides local edits just as well.
  Same-origin fetches therefore bypass it; the CDN (React/Babel) keeps normal
  caching since those URLs are immutable.
- `install` caches entries one-by-one via `allSettled`, not `addAll` — one bad
  path used to reject the whole batch and leave the cache empty.

Offline still works: every successful fetch refreshes its cache entry.

**If a stale build appears in the browser:** hard-reload twice (the first load
installs the new worker, the second is served by it), or DevTools → Application →
Storage → Clear site data. For the iPhone home-screen PWA, relaunch it twice, or
delete and re-add the icon.

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
window.MOCK.user            → { name, firstName, email, avatar, memberSince }
window.MOCK.categories      → [ { id, label, icon, from } ]
window.MOCK.featuredProjects → [ { id, title, subtitle, thumb, type } ]
window.MOCK.memories        → [ { id, title, thumb, count } ]
window.MOCK.photobook       → { coverTypes, formats, pageOptions, paperOptions }
window.MOCK.basket          → { items: [{ id, type, spec, thumb, qty, price }], subtotal, delivery, total }
window.MOCK.order           → { number, estimatedDelivery, items, total }
window.MOCK.account         → { stats: [{ value, label, w }],
                                orders: [{ id, title, date, status, thumb }] }
```

---

## Running & Testing

### Live deployment
**https://maksimborisovstorio.github.io/photobox-mobile-prototype/**

GitHub Pages, served from branch `feature/prototype-build`, path `/`. The repo was made
public to enable it — Pages on a private repo needs a paid plan. Note that a Pages site
is publicly reachable **either way**; going public additionally exposes the source and
git history.

`.nojekyll` at the repo root stops Jekyll from processing the tree.

⚠️ **Paths must stay relative.** Pages serves a project site from `/<repo>/`, so a
root-absolute path resolves *above* the app and 404s. Everything was converted:
`index.html` (manifest, touch icon, SW registration, the splash redirect), the
`<link rel="manifest">` in all 13 screens, `manifest.json` (`start_url`, `scope`,
icons), and all 104 `service-worker.js` precache entries — those resolve against the
worker's own URL, so they work at a root or a subpath. The SW's fetch handler and
`c.add()` already work off the request URL and needed no change. Verify any new
absolute path by serving the **parent** directory and loading `/<dir>/index.html`.

To redeploy: commit and push to `feature/prototype-build`; Pages rebuilds in ~20s.

### Testing on iPhone
Open the URL above in Safari → Share → Add to Home Screen → launch from the icon for
the fullscreen PWA. It is served over HTTPS, so the service worker registers and the
flow works offline after the first visit. If a stale build appears, relaunch twice (the
first load installs the new worker, the second is served by it) or delete and re-add
the icon.

### Running locally
```bash
cd /Users/mborisov/Desktop/test/MEGAPROTOTYPE
python3 -m http.server 8080
# Open http://localhost:8080
```


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
