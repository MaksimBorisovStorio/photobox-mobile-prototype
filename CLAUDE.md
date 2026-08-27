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
| Onboarding 1 | `screens/onboarding-1.html` + `.jsx` | ✅ Done — **Figma-verified** (node `451:13808`) |
| Onboarding 2 | `screens/onboarding-2.html` + `.jsx` | ✅ Done — **Figma-verified** (node `451:13841`) |
| Onboarding 3 | `screens/onboarding-3.html` + `.jsx` | ✅ Done — **Figma-verified** (node `451:13823`) |
| Home | `screens/home.html` + `home.jsx` | 🟡 Header + Create grid **Figma-verified** (`451:13862` / `367:6068`); Memories, Ideas, tab bar still the old build |
| Product — Photo Book | `screens/product-photobook.html` + `.jsx` | ✅ Rebuilt — **Figma-verified** (node `406:7183`) |
| Editor | `screens/editor.html` + `editor.jsx` | ✅ Built — **Figma-verified** (node `451:15574`) |
| Photo sources | `screens/photo-sources.html` + `.jsx` | ✅ Built — node `451:14202`; 2 of 8 covers verifiable, see below |
| Image Picker | `image-picker/index.html` (pre-built, frozen) | ✅ Wired in |
| Basket | `screens/basket.html` + `basket.jsx` | ✅ Done |
| Checkout — Delivery | `screens/checkout-delivery.html` + `.jsx` | ✅ Done |
| Checkout — Payment | `screens/checkout-payment.html` + `.jsx` | ✅ Done |
| Order Success | `screens/order-success.html` + `.jsx` | ✅ Done |
| Account | `screens/account.html` + `account.jsx` | ✅ Done |

### Possible next tasks

- **Figma fidelity pass** — query Figma node IDs (see table below) to tighten colors, spacing, typography to exact Figma spec. Screens built from verbal descriptions rather than direct Figma calls due to MCP availability.
- **Transition polish** — add push/pop slide animations between screens (navigation.js stubs are in place; CSS transitions not yet wired to the iframe-swap mechanism).
- **Editor tools** — Photos, Arrange, Themes, Style, AI help and Options are inert by request. The card's settings icon and the header's Continue arrow are inert for the same reason.
- **My Photos tab** — home tab bar has a "My Photos" tab that navigates to `../image-picker/index.html`. If a standalone My Photos grid (distinct from the picker) is needed, create `screens/my-photos.html`.
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
| Onboarding slide 1 (emotional) | `451:13808` | ✅ Built — matches Figma |
| Onboarding slide 3 (notifications) | `451:13823` | ✅ Built — matches Figma |
| Onboarding slide 2 (collections) | `451:13841` | ✅ Built — matches Figma (node not queried; shares slide 1/3 layout) |
| Home screen | `451:13862` | 🟡 Header + Create match Figma; Memories/Ideas/tab bar not yet reworked |
| Photo book page | `406:7183` | ✅ Built — matches Figma (hero `406:7432`, options `406:7220`) |
| Photo book — format chooser | `451:13426` | ✅ Built (Figma not queried) |
| Photo book — configure (scrollable) | `451:13491` | ✅ Built (Figma not queried) |
| Photo book — configure variant | `451:13606` | ✅ Built (Figma not queried) |
| Photo book — CTA screen | `451:13721` | ✅ Built (Figma not queried) |
| Editor | `451:15574` | ✅ Built — matches Figma (pixel-diffed; see below) |
| Account / Profile | `451:14038` | ✅ Built (Figma not queried) |
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
│   ├── brand.jsx                ← PhotoboxLogo (scale-driven), GlassIconButton
│   ├── onboarding-shell.jsx     ← shared onboarding layout: OnboardingShell,
│   │                               GalleryIndicator, PB_DISPLAY font stack
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

### ⚠️ Never animate `<body>` — the nav transitions run on `#root > *`
`animation-fill-mode: both` keeps the last keyframe applied **forever**, so a
`transform: translateX(0)` on `<body>` is permanent, not just for the 320ms. A
transformed `<body>` is the containing block for every screen's
`position:fixed; inset:0` wrapper — and in the **iOS standalone PWA the layout
viewport that `height: 100%` resolves against is shorter than the screen that fixed
positioning reaches**. So every screen came up ~34pt short with a band of body
background under it: the reported "gap at the bottom". The image picker was the only
screen unaffected, because it loads neither `styles.css` nor `navigation.js` and so
its wrapper stays fixed to the real viewport.

Both the enter animations (`styles.css`, `[data-nav='…'] #root > *`) and the exit
animations (`navigation.js` → `animateOut`) therefore target the **screen wrapper**,
never `<body>`. That is safe because a fixed element's own transform does not affect
its own box — it stays flush to all four physical edges throughout the transition.

Two consequences to respect:
- `animateOut` sets `style.animation` only. The old code used `style.cssText`, which
  on the wrapper would wipe React's inline `position:fixed`/background.
- `html, body { height: 100% }` is no longer load-bearing (it used to be the
  workaround for the collapse-to-0 symptom of the same bug) but is harmless and kept.

Verified with all 13 screens in a 390×844 iframe, with `html, body` squeezed to 790px
to simulate the iOS short layout viewport: every wrapper still measures 390×844 at
`top: 0`, `animation` on `<body>` is `none` and `transform` on `<body>` is `none`.
The splash→onboarding `replace` path was checked separately (`fadeIn` lands on the
wrapper), and `pop()` was checked to animate the wrapper while leaving its React
inline styles intact.

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

### `backdrop-filter` needs an explicit z-order
The onboarding panel's blur lives on its own `position:absolute; z-index:0` layer
with a `linear-gradient` mask that ramps it in over 96px — a plain
`backdrop-filter` on the panel leaves a visible hard seam at its top edge. The
content blocks each carry `position:relative; z-index:1`; without that the
absolutely-positioned blur layer paints *over* the text and blurs it away.

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
- `pb_placed` — what is actually on the pages. Durable, so a reload keeps the filled
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
| `IOSProgressiveBlur` | `scrim` | Three-stage progressive blur scrim, top-down — the image picker's header effect |

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
manifest.json and the image-picker files. Cache name `photobox-v16`.

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
