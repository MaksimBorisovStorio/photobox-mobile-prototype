// screens/editor.jsx
// Figma: "Editor" — node 451:15574 (375-wide frame, 1366 tall).
//   header ............ 451:15677  (status fade + close / undo-redo / continue)
//   details card ...... 451:15649
//   cover spread ...... 451:15622
//   inner spread ...... 451:15591
//   add-spread pill ... 451:15602
//   toolbar ........... 490:17058 / row 490:17059
//
// Replaces the old "step 3 of 3" configure screen: format, cover and size are all
// chosen on product-photobook.html now, so the editor is what "Start create" opens.

const A = '../shared/assets';
const TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const DISPLAY = '-apple-system, "SF Pro Display", system-ui, sans-serif';

// The node centres a 336 sheet in a 375 frame → 19.5 gutters. Kept as a ratio so
// the sheet scales with the viewport (390 on iPhone, 402 in the desktop frame).
const GUTTER = 19.5;

// Every leaf is an empty placeholder, so inserting a spread anywhere in the book
// renders identically to appending one — only the page numbers shift, and those
// are derived. Hence a plain counter rather than a list of spreads.
// Extra spreads are not priced in the design or in mock-data; this increment is
// invented on the same footing as the product page's SIZE_BASE / COVER_ADD and
// should be replaced once real pricing exists.
const EXTRA_SPREAD_PRICE = 2.0;

// Book descriptor stashed by product-photobook.jsx on "Start create". The fallback
// reproduces the node's own card copy (451:15651/15652) so opening editor.html
// directly still matches the design.
const FALLBACK_BOOK = {
  title: 'Large Portrait photo book', pages: 24, total: '42.99',
  pageW: 21, pageH: 28,
};

function readBook() {
  try {
    const raw = sessionStorage.getItem('pb_book');
    return raw ? Object.assign({}, FALLBACK_BOOK, JSON.parse(raw)) : FALLBACK_BOOK;
  } catch (e) {
    return FALLBACK_BOOK;
  }
}

// Three keys, because uploaded and placed are not the same thing:
//   pb_photos   — the incoming selection. Consumed on read; its presence is what
//                 decides which prompt opens.
//   pb_uploaded — everything the picker has handed over. Set whether or not auto-fill
//                 was accepted, because declining to auto-fill still leaves the photos
//                 uploaded — this is what the Photos tool's thumbnails and count show.
//   pb_placed   — what is actually on the pages. Durable, so a reload keeps the filled
//                 book instead of re-asking.
function readIncomingPhotos() {
  try {
    const raw = sessionStorage.getItem('pb_photos');
    if (!raw) return null;
    sessionStorage.removeItem('pb_photos');
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.length ? list : null;
  } catch (e) {
    return null;
  }
}

function readList(key) {
  try {
    const list = JSON.parse(sessionStorage.getItem(key) || '[]');
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

// pb_layouts — the page template chosen per slot, keyed by slot index (the cover is
// 0, then two per spread) because added spreads are appended and never move an
// existing index. Values are "<count>-<option>" ids; see LAYOUTS.
function readLayouts() {
  try {
    const o = JSON.parse(sessionStorage.getItem('pb_layouts') || '{}');
    return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
  } catch (e) {
    return {};
  }
}

// Leaves in reading order: inside front cover, pages 1..n, inside back cover —
// chunked into pairs, so the first spread is [inside front | 1] exactly as the
// node shows it. The trailing [n | inside back] pair is an extension: the node
// only ever shows the front of the book.
function spreadsFor(pages) {
  const leaves = [null];
  for (let i = 1; i <= pages; i++) leaves.push(i);
  leaves.push(null);
  const out = [];
  for (let i = 0; i < leaves.length; i += 2) {
    out.push([leaves[i], i + 1 < leaves.length ? leaves[i + 1] : null]);
  }
  return out;
}

// ── Sheet — the paper. Node 451:15607: #F8F8F8, 1px rgba(0,0,0,0.25), r2,
// shadow 0 4px 4px. The hairline is an inset shadow rather than a border so the
// 4px inner padding still measures from the outer edge, as it does in Figma.
//
// The node carries two sheet variants — this one (3 of 4 spreads plus the cover)
// and a flat white one with a 1px/3px shadow on 451:15592. Standardised on the
// majority, which is also what the cover uses.
function Sheet({ aspect, children, interior }) {
  return (
    <div style={{
      position: 'relative', width: '100%', padding: 4, boxSizing: 'border-box',
      background: '#F8F8F8', borderRadius: 2,
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.25), 0px 4px 4px rgba(0,0,0,0.25)',
    }}>
      {/* Interior box — full spread, two leaves wide. Driving the height off
          aspect-ratio keeps the cover and every inner spread exactly the same
          height without measuring the container. */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: String(aspect), display: 'flex' }}>
        {interior}
      </div>
      {children}
    </div>
  );
}

// Gutter art, positioned on the sheet so top/bottom 1px reproduces the node's
// 170-tall strips on a 172 sheet. The PNGs are horizontal gradients, so stretching
// them vertically is lossless — hence background-size 100% 100% rather than cover.
function GutterArt({ file, offsets, width, opacity }) {
  return offsets.map(dx => (
    <div key={dx} aria-hidden style={{
      position: 'absolute', left: `calc(50% + ${dx}px)`, top: 1, bottom: 1,
      // Decorative, and it sits over the spine — without this it swallows a press
      // aimed at the leaf underneath, so a spread could not be picked up there.
      pointerEvents: 'none',
      width, opacity: opacity || 1,
      backgroundImage: `url(${A}/${file})`, backgroundSize: '100% 100%',
    }} />
  ));
}

// ── Page leaf — nodes 451:15613 (left) / 451:15610 (right). Left leaves are
// #F5F5F5 and right leaves white throughout the node: gutter shading, not content.
// Padding is 8 on the outer edge and 12 on the gutter edge, mirrored, which lands
// the placeholder 12 from the sheet edge and 8 from the spine on both sides.
// The leaf's own box, shared with arrange mode so the two views cannot drift.
// `color` is a page colour chosen with the Color tool; it replaces the theme's paper.
function leafBox(left, t = CLASSIC, color) {
  return {
    width: '50%', height: '100%', boxSizing: 'border-box',
    background: color || (left ? t.alt : t.page), transition: 'background 240ms ease',
    boxShadow: '0px 1px 1.5px rgba(0,0,0,0.3), 0px 1px 1.5px rgba(0,0,0,0.1)',
    paddingTop: 8, paddingBottom: 8,
    paddingLeft: left ? 8 : 12, paddingRight: left ? 12 : 8,
    display: 'flex',
  };
}

// `blank` is an inside-cover leaf: it carries no page number and cannot hold a photo,
// so it is plain paper — no well, no placeholder, nothing to tap.
function Leaf({ side, photos, onOpen, label, layout, onEmpty, blank, n }) {
  const left = side === 'left';
  const t = useTheme();
  const { colors } = React.useContext(BookPaint);
  return (
    <div
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Open ${label}` : undefined}
      onClick={onOpen}
      onKeyDown={onOpen ? e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); }
      } : undefined}
      {...(onOpen ? press(0.97) : {})}
      style={Object.assign(leafBox(left, t, n ? slotColor(colors, n + 1) : null), {
      cursor: onOpen ? 'pointer' : 'default',
      // The press scale reads as the page being pushed in toward the spine rather
      // than the whole sheet shrinking, which is what a centred origin would give.
      transformOrigin: left ? 'right center' : 'left center',
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
    })}>
      {/* A relative box for the layout to position its slots inside; with no layout
          set LayoutWell falls back to the single full-page well the node draws. */}
      {/* A size container, so the theme's sticker can size itself to the page. */}
      <div style={{ position: 'relative', flex: 1, minWidth: 0, containerType: 'size' }}>
        {!blank && <LayoutWell layout={layout} photos={photos} onEmpty={onEmpty} />}
        {!blank && <ThemeSticker n={n} />}
      </div>
    </div>
  );
}

// Photo well — node 451:15614. Empty it is #D9D9D9 with the 24px add-image icon;
// once auto-fill has placed a photo it fills the well. Still inert either way.
// ⚠️ `draggable={false}` on both images is load-bearing, not tidiness. An <img> is
// natively draggable, so the browser starts an HTML5 drag as soon as the pointer moves
// on one — and that fires `pointercancel`, which killed every press-and-hold drag in
// arrange mode and the page navigator the instant the finger moved. Measured:
// gotpointercapture → pointermove → dragstart → pointercancel, all within 2ms.
// The theme's frame shape is applied here, so every view that draws a well gets it.
function PhotoWell({ photo, style, iconSize = 24, index }) {
  const t = useTheme();
  return (
    <div aria-hidden style={Object.assign({
      position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden',
      background: t.well,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      WebkitUserSelect: 'none', userSelect: 'none',
    }, frameStyle(t, index), style)}>
      {photo ? (
        <img src={photo} alt="" loading="lazy" draggable={false} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', display: 'block', WebkitUserDrag: 'none',
        }} />
      ) : (
        <img src={`${A}/pb-editor-add-image.svg`} alt="" width={iconSize} height={iconSize}
             draggable={false} style={{ display: 'block', WebkitUserDrag: 'none' }} />
      )}
    </div>
  );
}

// ── Layouts — the page templates the "Choose layout" drawer offers.
//
// Figma node 451:14921 fills in only the "2 photos" tab, and only three cards:
//   451:14976  two photos side by side, inset in a centred band
//   451:14978  two photos filling the page as halves
//   451:14979  two photos stacked, on the right two-fifths of the page
// Those are LAYOUTS[2][0..2], converted out of the node's card coordinates into
// fractions of the *well* — the printable box PV_WELL describes. Expressing a
// template that way is what lets one definition render identically on a 114px
// drawer card and a 310px page in the strip, and keeps it independent of the book
// format chosen on the product page.
//
// Every other count is an addition: the node ships the 1 / 3 / 4 / 5+ chips with no
// cards behind them. The invented templates use the same 3% gutter the node's own
// halves leave between them (451:14978 measures 46.8% + 49.7% on a 102.6-wide
// well), which is where 48.5 / 31.333 / 22.75 come from.
const LAYOUTS = {
  1: [
    [{ x: 0, y: 0, w: 100, h: 100 }],
    [{ x: 10, y: 10, w: 80, h: 80 }],
    [{ x: 0, y: 0, w: 100, h: 68.5 }],
    [{ x: 0, y: 31.5, w: 100, h: 68.5 }],
    [{ x: 20, y: 0, w: 60, h: 100 }],
    [{ x: 20, y: 20, w: 60, h: 60 }],
  ],
  2: [
    // 451:14976 — the node's selected card. Its rect reduces to 10 / 30.6 / 38 / 44.1;
    // squared up to symmetric margins, which is inside a pixel at card scale.
    [{ x: 10, y: 28, w: 38, h: 44 }, { x: 52, y: 28, w: 38, h: 44 }],
    // 451:14978
    [{ x: 0, y: 0, w: 48.5, h: 100 }, { x: 51.5, y: 0, w: 48.5, h: 100 }],
    // 451:14979 — deliberately off-centre; the node leaves the left 30% of the
    // page empty rather than centring the pair.
    [{ x: 30, y: 0, w: 40, h: 48.5 }, { x: 30, y: 51.5, w: 40, h: 48.5 }],
    [{ x: 0, y: 0, w: 100, h: 48.5 }, { x: 0, y: 51.5, w: 100, h: 48.5 }],
    [{ x: 0, y: 0, w: 64.5, h: 100 }, { x: 67.5, y: 0, w: 32.5, h: 100 }],
    [{ x: 0, y: 0, w: 32.5, h: 100 }, { x: 35.5, y: 0, w: 64.5, h: 100 }],
    [{ x: 0, y: 0, w: 100, h: 64.5 }, { x: 0, y: 67.5, w: 100, h: 32.5 }],
    [{ x: 0, y: 0, w: 100, h: 32.5 }, { x: 0, y: 35.5, w: 100, h: 64.5 }],
  ],
  3: [
    [{ x: 0, y: 0, w: 64.5, h: 100 },
     { x: 67.5, y: 0, w: 32.5, h: 48.5 }, { x: 67.5, y: 51.5, w: 32.5, h: 48.5 }],
    [{ x: 0, y: 0, w: 100, h: 64.5 },
     { x: 0, y: 67.5, w: 48.5, h: 32.5 }, { x: 51.5, y: 67.5, w: 48.5, h: 32.5 }],
    [{ x: 0, y: 0, w: 100, h: 31.333 }, { x: 0, y: 34.333, w: 100, h: 31.333 },
     { x: 0, y: 68.667, w: 100, h: 31.333 }],
    [{ x: 0, y: 0, w: 32.5, h: 48.5 }, { x: 0, y: 51.5, w: 32.5, h: 48.5 },
     { x: 35.5, y: 0, w: 64.5, h: 100 }],
    [{ x: 0, y: 0, w: 48.5, h: 32.5 }, { x: 51.5, y: 0, w: 48.5, h: 32.5 },
     { x: 0, y: 35.5, w: 100, h: 64.5 }],
    [{ x: 0, y: 0, w: 100, h: 48.5 },
     { x: 0, y: 51.5, w: 48.5, h: 48.5 }, { x: 51.5, y: 51.5, w: 48.5, h: 48.5 }],
    [{ x: 0, y: 0, w: 31.333, h: 100 }, { x: 34.333, y: 0, w: 31.333, h: 100 },
     { x: 68.667, y: 0, w: 31.333, h: 100 }],
  ],
  4: [
    [{ x: 0, y: 0, w: 48.5, h: 48.5 }, { x: 51.5, y: 0, w: 48.5, h: 48.5 },
     { x: 0, y: 51.5, w: 48.5, h: 48.5 }, { x: 51.5, y: 51.5, w: 48.5, h: 48.5 }],
    [{ x: 0, y: 0, w: 64.5, h: 100 },
     { x: 67.5, y: 0, w: 32.5, h: 31.333 }, { x: 67.5, y: 34.333, w: 32.5, h: 31.333 },
     { x: 67.5, y: 68.667, w: 32.5, h: 31.333 }],
    [{ x: 0, y: 0, w: 100, h: 22.75 }, { x: 0, y: 25.75, w: 100, h: 22.75 },
     { x: 0, y: 51.5, w: 100, h: 22.75 }, { x: 0, y: 77.25, w: 100, h: 22.75 }],
    [{ x: 0, y: 0, w: 32.5, h: 31.333 }, { x: 0, y: 34.333, w: 32.5, h: 31.333 },
     { x: 0, y: 68.667, w: 32.5, h: 31.333 }, { x: 35.5, y: 0, w: 64.5, h: 100 }],
    [{ x: 0, y: 0, w: 100, h: 64.5 },
     { x: 0, y: 67.5, w: 31.333, h: 32.5 }, { x: 34.333, y: 67.5, w: 31.333, h: 32.5 },
     { x: 68.667, y: 67.5, w: 31.333, h: 32.5 }],
    [{ x: 0, y: 0, w: 22.75, h: 100 }, { x: 25.75, y: 0, w: 22.75, h: 100 },
     { x: 51.5, y: 0, w: 22.75, h: 100 }, { x: 77.25, y: 0, w: 22.75, h: 100 }],
  ],
  // The chip reads "5+", so this set runs 5, 5 and 6 slots.
  5: [
    [{ x: 0, y: 0, w: 100, h: 64.5 },
     { x: 0, y: 67.5, w: 22.75, h: 32.5 }, { x: 25.75, y: 67.5, w: 22.75, h: 32.5 },
     { x: 51.5, y: 67.5, w: 22.75, h: 32.5 }, { x: 77.25, y: 67.5, w: 22.75, h: 32.5 }],
    [{ x: 0, y: 0, w: 48.5, h: 48.5 }, { x: 51.5, y: 0, w: 48.5, h: 48.5 },
     { x: 0, y: 51.5, w: 31.333, h: 48.5 }, { x: 34.333, y: 51.5, w: 31.333, h: 48.5 },
     { x: 68.667, y: 51.5, w: 31.333, h: 48.5 }],
    [{ x: 0, y: 0, w: 48.5, h: 100 },
     { x: 51.5, y: 0, w: 22.75, h: 48.5 }, { x: 77.25, y: 0, w: 22.75, h: 48.5 },
     { x: 51.5, y: 51.5, w: 22.75, h: 48.5 }, { x: 77.25, y: 51.5, w: 22.75, h: 48.5 }],
    [{ x: 0, y: 0, w: 48.5, h: 31.333 }, { x: 51.5, y: 0, w: 48.5, h: 31.333 },
     { x: 0, y: 34.333, w: 48.5, h: 31.333 }, { x: 51.5, y: 34.333, w: 48.5, h: 31.333 },
     { x: 0, y: 68.667, w: 48.5, h: 31.333 }, { x: 51.5, y: 68.667, w: 48.5, h: 31.333 }],
    [{ x: 0, y: 0, w: 31.333, h: 31.333 }, { x: 34.333, y: 0, w: 31.333, h: 31.333 },
     { x: 68.667, y: 0, w: 31.333, h: 31.333 },
     { x: 0, y: 34.333, w: 31.333, h: 31.333 }, { x: 34.333, y: 34.333, w: 31.333, h: 31.333 },
     { x: 68.667, y: 34.333, w: 31.333, h: 31.333 },
     { x: 0, y: 68.667, w: 31.333, h: 31.333 }, { x: 34.333, y: 68.667, w: 31.333, h: 31.333 },
     { x: 68.667, y: 68.667, w: 31.333, h: 31.333 }],
    [{ x: 0, y: 0, w: 31.333, h: 48.5 }, { x: 34.333, y: 0, w: 31.333, h: 48.5 },
     { x: 68.667, y: 0, w: 31.333, h: 48.5 },
     { x: 0, y: 51.5, w: 31.333, h: 48.5 }, { x: 34.333, y: 51.5, w: 31.333, h: 48.5 },
     { x: 68.667, y: 51.5, w: 31.333, h: 48.5 }],
  ],
};

// Frames from the designer's layout sheet (Frame 2438–2446), converted from their
// 362×456 page coordinates into fractions of the well. Unlike the templates above they
// keep generous page margins and, for 2439 / 2440, sit off-axis on purpose.
LAYOUTS[1].push(
    // Frame 2438
    [{ x: 28.84, y: 32.9, w: 42.29, h: 33.86 }],
    // Frame 2442
    [{ x: 22.4, y: 3.46, w: 56.39, h: 90.78 }],
    // Frame 2443
    [{ x: 0, y: 27.75, w: 100, h: 42.44 }],
);
LAYOUTS[2].push(
    // Frame 2439
    [{ x: 15.66, y: 15.97, w: 35.24, h: 33.86 }, { x: 50.9, y: 49.83, w: 38.0, h: 33.61 }],
    // Frame 2440
    [{ x: 14.43, y: 14.25, w: 42.29, h: 33.86 }, { x: 44.47, y: 51.55, w: 42.29, h: 33.86 }],
);
LAYOUTS[3].push(
    // Frame 2444
    [{ x: 14.43, y: 14.25, w: 72.02, h: 33.86 }, { x: 14.43, y: 51.55, w: 33.4, h: 33.86 }, { x: 53.36, y: 51.55, w: 33.1, h: 33.86 }],
    // Frame 2446
    [{ x: 14.43, y: 14.25, w: 72.02, h: 33.86 }, { x: 14.43, y: 51.55, w: 33.1, h: 33.86 }, { x: 53.36, y: 51.55, w: 33.1, h: 33.86 }],
    // Frame 2445
    [{ x: 14.43, y: 14.25, w: 37.7, h: 69.43 }, { x: 56.73, y: 14.25, w: 37.7, h: 34.59 }, { x: 56.73, y: 53.51, w: 37.7, h: 30.18 }],
);

// Chip order — node 451:14988..14997. "5+ photos" is the node's own label.
const LAYOUT_COUNTS = [1, 2, 3, 4, 5];
const countLabel = c =>
  (c === 1 ? '1 photo' : c === 5 ? '5+ photos' : `${c} photos`);

// A layout is stored as "<count>-<index>" so it survives a reload as a plain string
// and stays readable in sessionStorage.
const FULL_PAGE = LAYOUTS[1][0];
//
// A hand-adjusted template appends its rects after a `|`: "2-1|0,0,60,100;63,0,37,100".
// The part before the bar is still the preset, so the drawer keeps highlighting it.
function layoutById(id) {
  if (!id) return null;
  const [base, custom] = String(id).split('|');
  if (custom) {
    const rects = custom.split(';').map(r => r.split(',').map(Number));
    if (rects.every(r => r.length === 4 && r.every(isFinite))) {
      return rects.map(([x, y, w, h]) => ({ x, y, w, h }));
    }
  }
  const parts = base.split('-');
  const set = LAYOUTS[parts[0]];
  return (set && set[Number(parts[1])]) || null;
}
// ── Spacing — one slider that moves both the gutters between photos and the margin
// between the photos and the page edge. `t` runs 0..1; SP_DEFAULT is the look the
// templates were drawn with (3% gutters, ~5% margins), so nothing moves until the
// slider does. At 0 the gutters close and the outer photos bleed to the page edge,
// which sits one PV_WELL inset outside the well (SP_BLEED_*, in % of the well).
//
// The offsets are `cqw`/`cqh` — container units of the LayoutWell root — so a
// template stays resolution-independent and a given `t` is the same on a 114px card
// and a 310px page. A slot keeps its x/y/w/h (SplitHandles and encodeLayout read
// those) and carries the spaced box as `css`.
const SP_DEFAULT = 0.3;
const SP_BLEED_X = 5.47, SP_BLEED_Y = 6.1;
const SP_INSET_X = 12.7, SP_INSET_Y = 14.2;
const SP_GAP = 10;

function spacingFor(sp, slot) {
  const v = sp && (sp[slot] != null ? sp[slot] : sp['*']);
  return typeof v === 'number' ? v : SP_DEFAULT;
}
function readSpacings() {
  try {
    const o = JSON.parse(sessionStorage.getItem('pb_spacing') || '{}');
    return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
  } catch (e) {
    return {};
  }
}

function withSpacing(slots, t) {
  if (!slots || Math.abs(t - SP_DEFAULT) < 1e-6) return slots;
  const seam = (s, k, dir) => slots.some(o => {
    if (o === s) return false;
    const [p, l, q, m] = k === 'x' ? ['x', 'w', 'y', 'h'] : ['y', 'h', 'x', 'w'];
    const gap = dir === 'lo' ? s[p] - (o[p] + o[l]) : o[p] - (s[p] + s[l]);
    const ov = Math.min(s[q] + s[m], o[q] + o[m]) - Math.max(s[q], o[q]);
    return gap >= 0.5 && gap <= 8 && ov > 0.5;
  });
  const edge = (s, k, hi) => {
    const p = hi ? s[k] + s[k === 'x' ? 'w' : 'h'] : s[k];
    if (seam(s, k, hi ? 'hi' : 'lo')) {
      const sh = (t - SP_DEFAULT) * SP_GAP / 2;
      return { p, w: hi ? -sh : sh, h: 0 };
    }
    const bleed = k === 'x' ? SP_BLEED_X : SP_BLEED_Y;
    const inset = k === 'x' ? SP_INSET_X : SP_INSET_Y;
    const u = (SP_DEFAULT - t) / SP_DEFAULT;
    let pct = p, c = 0;
    if (t < SP_DEFAULT) {
      pct = hi ? p + (100 - p) * u : p * (1 - u);
      c = (hi ? 1 : -1) * bleed * u;
    } else {
      c = (hi ? -1 : 1) * (t - SP_DEFAULT) / (1 - SP_DEFAULT) * inset;
    }
    return k === 'x' ? { p: pct, w: c, h: 0 } : { p: pct, w: 0, h: c };
  };
  const f = n => Math.round(n * 1000) / 1000;
  const calc = (a, b) => `calc(${f(a.p - (b ? b.p : 0))}% + ${f(a.w - (b ? b.w : 0))}cqw + ${f(a.h - (b ? b.h : 0))}cqh)`;
  return slots.map(s => {
    const x0 = edge(s, 'x', false), x1 = edge(s, 'x', true);
    const y0 = edge(s, 'y', false), y1 = edge(s, 'y', true);
    return Object.assign({}, s, {
      css: { left: calc(x0), top: calc(y0), width: calc(x1, x0), height: calc(y1, y0) },
    });
  });
}
// The layout a page renders with: its template (or the single full-page well), spaced.
function layoutAt(id, t) {
  const base = layoutById(id);
  return Math.abs(t - SP_DEFAULT) < 1e-6 ? base : withSpacing(base || FULL_PAGE, t);
}

// The first template with exactly `k` slots, else the smallest that holds `k` (the
// "5+" set jumps 6 → 9). null when none is big enough.
function layoutIdFor(k) {
  // 2-0 is the node's inset pair, which shrinks both photos; halves read as "added".
  if (k === 2) return '2-1';
  let best = null;
  Object.keys(LAYOUTS).forEach(c => LAYOUTS[c].forEach((l, j) => {
    if (l.length >= k && (!best || l.length < best.len)) best = { id: `${c}-${j}`, len: l.length };
  }));
  return best && best.id;
}
const layoutBase = id => String(id || '').split('|')[0];
const encodeLayout = (id, slots) => `${layoutBase(id)}|` + slots.map(s =>
  [s.x, s.y, s.w, s.h].map(n => Math.round(n * 100) / 100).join(',')).join(';');

// ── Themes — the book view's Themes tool. Not in the Figma; every theme is mocked.
//
// A theme dresses the book: page and text colours, the cover title's face, a frame
// shape on every photo, a sticker every few pages — and it brings its own page
// layouts. Applying one keeps every photo on the page it is on but replaces the
// layouts, hand-picked ones included ("last change wins": a later Style or a page's
// own Layout overrides it in turn).
//
// The dressing reaches every view through `BookTheme` rather than props, because a
// leaf is drawn in five places (book view, page view, arrange, the layout cards, the
// theme cards). With no theme the context is null and `useTheme()` hands back
// CLASSIC, whose values are exactly the colours the editor drew before themes existed.
//
// Faces are the ones styles.css already self-hosts, plus the system serif, so the PWA
// still renders them offline.
const BookTheme = React.createContext(null);
const SERIF = 'ui-serif, "New York", Georgia, serif';

// Layout families, as "<count>-<option>" ids per photo count (6 is the 2×3 grid). A
// family lists several options per count and pages cycle through them, so a themed
// book does not repeat one template on every page.
const THEME_LAYOUTS = {
  classic: { 1: ['1-0'], 2: ['2-3', '2-1'], 3: ['3-1', '3-0'], 4: ['4-0', '4-1'],
             5: ['5-0'], 6: ['5-3'] },
  // The designer's inset frames (2438–2446): generous margins, a little off-axis.
  airy:    { 1: ['1-1', '1-6', '1-7'], 2: ['2-0', '2-9', '2-8'], 3: ['3-7', '3-9'],
             4: ['4-0'], 5: ['5-1'], 6: ['5-3'] },
  bold:    { 1: ['1-2', '1-0', '1-3'], 2: ['2-6', '2-4'], 3: ['3-0', '3-5'],
             4: ['4-4', '4-1'], 5: ['5-2'], 6: ['5-5'] },
};

// One theme: `page`/`alt` the right/left leaf, `well` an empty slot, `ink` the text,
// `font`/`weight`/`italic`/`upper`/`size` the cover title, `frame` the photo shape.
const mkTheme = (id, name, meta, o) => Object.assign({ id, name, meta, alt: o.page,
  well: 'rgba(0,0,0,0.12)', weight: 700, size: 1, family: 'classic' }, o);
// Also the "Default" card at the head of every category: picking it removes the theme.
const CLASSIC = mkTheme('classic', 'Default', 'No theme', {
  page: '#FFFFFF', alt: '#F5F5F5', well: '#D9D9D9', ink: '#000000', font: TEXT,
  title: 'Add text', frame: 'none', sticker: null,
});
const THEME_CATEGORIES = [
  { id: 'travel', label: 'Travel', themes: [
    mkTheme('passport', 'Passport', 'Stamps · kraft', { page: '#EBDFCB', alt: '#E4D6BE',
      ink: '#7A3E1D', font: '"Big Shoulders Display"', weight: 800, upper: true, size: 1.2,
      title: 'Canada', frame: 'stamp', sticker: { g: '✈', c: '#7A3E1D' }, family: 'classic' }),
    mkTheme('fieldnotes', 'Field Notes', 'Handwritten · tape', { page: '#F7F5EF', alt: '#F0EDE4',
      ink: '#2D4A6B', font: 'Caveat', size: 1.35, title: 'Road trip', frame: 'polaroid',
      sticker: { g: '📍' }, family: 'airy' }),
    mkTheme('bluecoast', 'Blue Coast', 'Ocean · airy', { page: '#E1EEF4', alt: '#D6E7EF',
      ink: '#1D5C7A', font: SERIF, weight: 600, title: 'Summer', frame: 'round',
      sticker: { g: '☀', c: '#F2A33A' }, family: 'bold' }),
  ] },
  { id: 'wedding', label: 'Wedding', themes: [
    mkTheme('ivory', 'Ivory Script', 'Serif · cream · gold', { page: '#F6F1E7', alt: '#EFE8DA',
      ink: '#8A6A2F', font: SERIF, weight: 500, italic: true, size: 1.1,
      title: 'Our Wedding', frame: 'thin', sticker: { g: '❦', c: '#B8954A' }, family: 'airy' }),
    mkTheme('garden', 'Garden Vows', 'Botanical · sage', { page: '#E6ECE1', alt: '#DCE4D6',
      ink: '#4F6347', font: SERIF, title: 'Always & Forever', frame: 'arch',
      sticker: { g: '🌿' }, family: 'airy' }),
    mkTheme('golden', 'Golden Hour', 'Navy · gold foil', { page: '#1F2A44', alt: '#1A2439',
      well: 'rgba(255,255,255,0.12)', ink: '#E2C27B', font: SERIF, weight: 600,
      title: 'June 14', frame: 'oval', sticker: { g: '✦', c: '#E2C27B' }, family: 'classic' }),
    mkTheme('modernlove', 'Modern Love', 'Bold · minimal', { page: '#FFFFFF', alt: '#F6F6F6',
      ink: '#111111', font: '"Bricolage Grotesque"', weight: 800, upper: true,
      title: 'I do.', frame: 'polaroid', sticker: { g: '♥', c: '#E5484D' }, family: 'bold' }),
  ] },
  { id: 'family', label: 'Family', themes: [
    mkTheme('sunday', 'Sunday Lunch', 'Warm · rounded', { page: '#FFF6EA', alt: '#FBEEDC',
      ink: '#C0532D', font: '"Rethink Sans"', title: 'The Bakers', frame: 'round',
      sticker: { g: '☺', c: '#E0874F' }, family: 'classic' }),
    mkTheme('scrapbook', 'Scrapbook', 'Kraft · snapshots', { page: '#F3EDE2', alt: '#ECE4D6',
      ink: '#3E5C76', font: 'Caveat', size: 1.35, title: 'Family time', frame: 'polaroid',
      sticker: { g: '📎' }, family: 'airy' }),
    mkTheme('heirloom', 'Heirloom', 'Slab serif · linen', { page: '#EDE7DD', alt: '#E5DED2',
      ink: '#5A4632', font: 'Coustard', weight: 400, title: 'Our Story', frame: 'thin',
      sticker: { g: '❀', c: '#A88A68' }, family: 'classic' }),
  ] },
  { id: 'kids', label: 'Kids', themes: [
    mkTheme('crayon', 'Crayon Box', 'Sunny · playful', { page: '#FFF6D6', alt: '#FCEFC4',
      ink: '#E2552D', font: '"Darumadrop One"', weight: 400, size: 1.15, title: 'Little me',
      frame: 'round', sticker: { g: '★', c: '#F6B500' }, family: 'bold' }),
    mkTheme('dino', 'Dino Club', 'Green · chunky', { page: '#E4F4EA', alt: '#D8EEE0',
      ink: '#2F7D4F', font: '"Changa One"', weight: 400, title: 'First steps',
      frame: 'arch', sticker: { g: '🦖' }, family: 'classic' }),
    mkTheme('bubble', 'Bubbles', 'Soft blue · script', { page: '#EAF0FF', alt: '#DFE7FD',
      ink: '#4A5BD6', font: 'Borel', weight: 400, size: 0.85, title: 'Milo', frame: 'oval',
      sticker: { g: '☁', c: '#9AB0FF' }, family: 'airy' }),
  ] },
  { id: 'birthday', label: 'Birthday', themes: [
    mkTheme('confetti', 'Confetti', 'Pink · party', { page: '#FFF0F3', alt: '#FDE4EA',
      ink: '#D6336C', font: '"Changa One"', weight: 400, title: 'Happy 30th',
      frame: 'polaroid', sticker: { g: '🎉' }, family: 'bold' }),
    mkTheme('balloon', 'Balloons', 'Sky · bold', { page: '#EAF7FF', alt: '#DDF0FC',
      ink: '#1C7ED6', font: '"Bricolage Grotesque"', weight: 800, title: 'Party!',
      frame: 'round', sticker: { g: '🎈' }, family: 'classic' }),
    mkTheme('cheers', 'Cheers', 'Black · gold', { page: '#171717', alt: '#121212',
      well: 'rgba(255,255,255,0.12)', ink: '#E2C27B', font: SERIF, italic: true,
      title: 'Cheers', frame: 'thin', sticker: { g: '✦', c: '#E2C27B' }, family: 'airy' }),
  ] },
  { id: 'year', label: 'Year in review', themes: [
    mkTheme('almanac', 'Almanac', 'Numbers · ink', { page: '#F4F1EA', alt: '#ECE8DE',
      ink: '#222222', font: '"Big Shoulders Display"', weight: 800, size: 1.3,
      title: '2026', frame: 'thin', sticker: { g: '●', c: '#E5484D' }, family: 'classic' }),
    mkTheme('seasons', 'Four Seasons', 'Leafy · calm', { page: '#EEF3EC', alt: '#E4ECE1',
      ink: '#3D6B4F', font: '"DM Sans"', title: 'Our year', frame: 'round',
      sticker: { g: '❋', c: '#7FA36A' }, family: 'airy' }),
    mkTheme('nightsky', 'Night Sky', 'Navy · amber', { page: '#14213D', alt: '#101B33',
      well: 'rgba(255,255,255,0.12)', ink: '#FCA311', font: '"Alumni Sans"', weight: 800,
      upper: true, size: 1.2, title: 'Twenty six', frame: 'oval',
      sticker: { g: '✦', c: '#FCA311' }, family: 'bold' }),
  ] },
  { id: 'minimal', label: 'Minimal', themes: [
    mkTheme('gallery', 'Gallery', 'White · wide margins', { page: '#FAFAFA', alt: '#F3F3F3',
      ink: '#111111', font: '"DM Sans"', weight: 400, upper: true, size: 0.85,
      title: 'Portfolio', frame: 'none', sticker: null, family: 'airy' }),
    mkTheme('mono', 'Mono', 'Black pages', { page: '#151515', alt: '#101010',
      well: 'rgba(255,255,255,0.12)', ink: '#EEEEEE', font: 'Basic', weight: 400,
      title: 'Moments', frame: 'none', sticker: null, family: 'bold' }),
  ] },
];
const THEMES = {};
THEME_CATEGORIES.forEach(c => c.themes.forEach(t => { THEMES[t.id] = Object.assign({ cat: c.id }, t); }));

function readTheme() {
  try { return THEMES[sessionStorage.getItem('pb_theme')] ? sessionStorage.getItem('pb_theme') : null; }
  catch (e) { return null; }
}
function useTheme() { return React.useContext(BookTheme) || CLASSIC; }

// A photo's frame, in container units of the LayoutWell it sits in, so a frame reads
// the same on a 114px card and a 310px page. `i` alternates the polaroid tilt.
function frameStyle(t, i) {
  switch (t.frame) {
    case 'thin':     return { boxShadow: `0 0 0 1.2cqmin ${t.page}, 0 0 0 1.7cqmin ${t.ink}` };
    case 'round':    return { borderRadius: '5cqmin' };
    case 'oval':     return { borderRadius: '50%' };
    case 'arch':     return { borderRadius: '999px 999px 1.5cqmin 1.5cqmin' };
    case 'stamp':    return { outline: `0.7cqmin dashed ${t.ink}`, outlineOffset: '1.2cqmin' };
    case 'polaroid': return {
      boxShadow: '0 0 0 2.4cqmin #FFFFFF, 0 1cqmin 3cqmin 2.4cqmin rgba(0,0,0,0.22)',
      transform: `rotate(${(i || 0) % 2 ? 2 : -2}deg)`,
    };
    default: return null;
  }
}

// The cover title's face, as a style object (size is the caller's).
function titleStyle(t) {
  return {
    fontFamily: t.font, fontWeight: t.weight, color: t.ink,
    fontStyle: t.italic ? 'italic' : 'normal',
    textTransform: t.upper ? 'uppercase' : 'none',
    letterSpacing: t.upper ? '0.04em' : 'normal',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  };
}

// A sticker on the cover and on every fourth page, in alternating corners. Sized in
// container units, so its parent must be a size container.
function ThemeSticker({ n }) {
  const t = useTheme();
  if (!t.sticker || (n != null && n % 4 !== 1)) return null;
  const low = n != null && n % 8 === 1;
  return (
    <span aria-hidden style={{
      position: 'absolute', zIndex: 2, pointerEvents: 'none',
      [low ? 'left' : 'right']: '-2cqmin', [low ? 'bottom' : 'top']: '-2cqmin',
      fontSize: '16cqmin', lineHeight: 1, color: t.sticker.c || t.ink,
      transform: `rotate(${low ? -12 : 10}deg)`,
      filter: 'drop-shadow(0 0.6cqmin 0.8cqmin rgba(0,0,0,0.18))',
    }}>{t.sticker.g}</span>
  );
}

// ── Page colours and cover designs — the page view's Color and Covers tools. Neither
// is in the Figma.
//
// `BookPaint` carries both to every renderer, the same way BookTheme carries the theme,
// so a drawer's draft can be previewed by wrapping the view in a provider.
//   colors — keyed by slot like pb_layouts (0 the cover, n + 1 page n), plus '*' for
//            "all pages", which never includes the cover. A missing key falls back to
//            '*' and then to the theme's own paper.
//   cover  — a COVER_DESIGNS id.
const BookPaint = React.createContext({ colors: {}, cover: 'classic' });
function slotColor(colors, slot) {
  if (!colors || slot == null) return null;
  if (slot === 0) return colors[0] || null;
  return colors[slot] || colors['*'] || null;
}
function isDark(c) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(c || ''));
  if (!m) return false;
  const v = parseInt(m[1], 16);
  return (0.299 * (v >> 16) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) / 255 < 0.5;
}
// The theme's ink, unless a chosen paper flips light/dark against it.
function inkOn(t, bg) {
  if (!bg || isDark(bg) === isDark(t.page)) return t.ink;
  return isDark(bg) ? '#FFFFFF' : '#111111';
}

// Swatches for the Color tool. `null` is "Theme" — the page goes back to its theme's
// own paper (white with no theme).
const PAGE_COLORS = [
  null, '#FFFFFF', '#F6F1E7', '#EBDFCB', '#F9E1E0', '#FBE3CF', '#FFF3C4', '#E3EADF',
  '#DDF1EA', '#DDEBF2', '#E6E1F5', '#E5E5E5', '#2B2B2B', '#1F2A44', '#111111',
];

// Cover designs. Each places the cover's photo area and its title differently; the
// title's face, ink and paper come from the theme, so the same set reads as "this
// theme's covers" under a theme and as plain photo-and-text covers with none.
const COVER_DESIGNS = [
  { id: 'classic', name: 'Classic',        meta: 'Title above' },
  { id: 'bleed',   name: 'Full photo',     meta: 'Title on the photo', bleed: true },
  { id: 'centre',  name: 'Centred title',  meta: 'Big title over photo', bleed: true },
  { id: 'under',   name: 'Photo & title',  meta: 'Title underneath' },
  { id: 'framed',  name: 'Framed',         meta: 'Inset photo' },
  { id: 'band',    name: 'Color band',    meta: 'Title on paper' },
  { id: 'round',   name: 'Round',          meta: 'Circle photo' },
];
const coverDesign = id => COVER_DESIGNS.find(d => d.id === id) || COVER_DESIGNS[0];

// The front cover, drawn into a size container (its leaf). `pad` is the margin the
// plain designs keep from the leaf edge — the book view's front box is already inset,
// the page view's leaf is not. Full-bleed designs ignore it and drop the theme's frame:
// a polaroid border on an edge-to-edge photo would read as a mistake.
// `onSelect` / `selected` make its photos selectable, exactly as on a page in page view.
function CoverFront({ design, photos, layout, onEmpty, adjust, iconSize, pad, bg,
                      onSelect, selected }) {
  const t = useTheme();
  const d = coverDesign(design);
  const ink = inkOn(t, bg);
  const p = pad || { left: '0%', right: '0%', top: '0%', bottom: '0%' };
  const well = (box, frame) => {
    const inner = (
      <div style={Object.assign({ position: 'absolute' }, box)}>
        <LayoutWell layout={layout} photos={photos || []} onEmpty={onEmpty}
                    adjust={adjust} iconSize={iconSize}
                    onSelect={onSelect} selected={selected} />
      </div>
    );
    return frame === undefined ? inner : (
      <BookTheme.Provider value={Object.assign({}, t, { frame })}>{inner}</BookTheme.Provider>
    );
  };
  const title = (style, color) => (
    <span style={Object.assign(titleStyle(t), {
      position: 'absolute', zIndex: 1, lineHeight: 1.2, color: color || ink,
      fontSize: `${10.5 * t.size}cqi`, pointerEvents: 'none',
    }, style)}>{t.title}</span>
  );
  const centred = { left: '8%', right: '8%', textAlign: 'center' };
  const onPhoto = { color: '#FFFFFF', textShadow: '0 0.4cqi 2cqi rgba(0,0,0,0.45)' };
  switch (d.id) {
    case 'bleed': return (
      <React.Fragment>
        {well({ inset: 0 }, 'none')}
        <span aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%',
          pointerEvents: 'none', background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.45))' }} />
        {title(Object.assign({ left: '7%', right: '7%', bottom: '6%' }, onPhoto), '#FFFFFF')}
      </React.Fragment>
    );
    case 'centre': return (
      <React.Fragment>
        {well({ inset: 0 }, 'none')}
        <span aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.22)' }} />
        {title(Object.assign({}, centred, onPhoto, { top: '50%', transform: 'translateY(-50%)',
          fontSize: `${14 * t.size}cqi`, whiteSpace: 'normal' }), '#FFFFFF')}
      </React.Fragment>
    );
    case 'under': return (
      <React.Fragment>
        {well({ left: p.left, right: p.right, top: p.top, height: '70%' })}
        {title(Object.assign({}, centred, { top: '80%' }))}
      </React.Fragment>
    );
    case 'framed': return (
      <React.Fragment>
        {well({ left: '17%', right: '17%', top: '15%', height: '50%' })}
        {title(Object.assign({}, centred, { top: '72%' }))}
      </React.Fragment>
    );
    case 'band': return (
      <React.Fragment>
        {well({ left: 0, right: 0, top: 0, height: '70%' }, 'none')}
        {title(Object.assign({}, centred, { top: '79%' }))}
      </React.Fragment>
    );
    case 'round': return (
      <React.Fragment>
        {/* Square in the leaf's own width, so the oval frame comes out a circle. */}
        {well({ left: '19%', width: '62%', top: '24%', aspectRatio: '1', height: 'auto' }, 'oval')}
        {title(Object.assign({}, centred, { top: '9%' }))}
      </React.Fragment>
    );
    default: return (
      // Classic — the node's own cover: title on top, the photo below it.
      <div style={{ position: 'absolute', left: p.left, right: p.right, top: p.top, bottom: p.bottom,
                    display: 'flex', flexDirection: 'column', gap: '3cqi' }}>
        <span style={Object.assign(titleStyle(t), {
          flex: '0 0 auto', color: ink, fontSize: `${10.5 * t.size}cqi`, lineHeight: 1.25,
          paddingLeft: '1cqi',
        })}>{t.title}</span>
        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <LayoutWell layout={layout} photos={photos || []} onEmpty={onEmpty}
                      adjust={adjust} iconSize={iconSize}
                      onSelect={onSelect} selected={selected} />
        </div>
      </div>
    );
  }
}

// Theme layouts for a whole book: each page gets its family's template for however
// many photos it holds, so every photo stays on its page. Arrays are compacted first
// (a null in the middle would land a photo on a slot the new template does not have).
// Slot index is n + 1 for page n — 0 is the cover and 1 the inside front cover.
function pickLayout(fam, c, n) {
  if (c > 6) return layoutIdFor(c);
  const opts = fam[Math.max(1, c)];
  return opts[n % opts.length];
}
function applyTheme(theme, placed, pages) {
  const fam = THEME_LAYOUTS[theme.family] || THEME_LAYOUTS.classic;
  const out = placed.map(e => {
    if (!Array.isArray(e)) return e;
    const f = e.filter(Boolean);
    return f.length > 1 ? f : (f[0] || null);
  });
  const layouts = { 0: fam[1][0] };
  for (let n = 1; n <= pages; n++) {
    const e = out[n - 1];
    layouts[n + 1] = pickLayout(fam, Array.isArray(e) ? e.length : 1, n);
  }
  return { placed: out, layouts };
}

// ── Style — the book view's Style tool. Sets up the whole book in one go: how many
// photos a page holds, the order auto-fill walks them in, and the look of the layouts.
// Also not in the Figma. Applying it re-flows every photo and every page layout and
// sets the book-wide spacing; the theme's colours, faces and stickers are untouched.
const STYLE_PER = [
  { id: 'one',     label: 'One',     sub: '1 per page',   pattern: [1] },
  { id: 'few',     label: 'A few',   sub: '2–3 per page', pattern: [2, 3] },
  { id: 'collage', label: 'Collage', sub: '4–6 per page', pattern: [4, 5, 6, 4] },
];
const STYLE_ORDER = [
  { id: 'oldest', label: 'Oldest first' },
  { id: 'newest', label: 'Newest first' },
  { id: 'name',   label: 'By name' },
];
// Grid keeps white margins (a wider spacing), full-bleed closes the gutters and runs
// the photos to the page edge (spacing 0), mixed walks the designer's off-axis frames.
const STYLE_LOOK = [
  { id: 'grid',  label: 'Grid',          spacing: 0.6,
    layouts: { 1: ['1-0'], 2: ['2-3'], 3: ['3-2'], 4: ['4-0'], 5: ['5-1'], 6: ['5-3'] } },
  { id: 'bleed', label: 'Full-bleed',    spacing: 0,
    layouts: { 1: ['1-0'], 2: ['2-1'], 3: ['3-0'], 4: ['4-1'], 5: ['5-0'], 6: ['5-3'] } },
  { id: 'mixed', label: 'Mixed collage', spacing: SP_DEFAULT,
    layouts: { 1: ['1-6', '1-7', '1-2', '1-4'], 2: ['2-8', '2-9', '2-4', '2-6'],
               3: ['3-7', '3-9', '3-1', '3-5'], 4: ['4-1', '4-4', '4-3'],
               5: ['5-0', '5-2'], 6: ['5-5'] } },
];
const STYLE_DEFAULT = { per: 'one', order: 'oldest', look: 'grid' };
function readStyle() {
  try { return Object.assign({}, STYLE_DEFAULT, JSON.parse(sessionStorage.getItem('pb_style') || '{}')); }
  catch (e) { return STYLE_DEFAULT; }
}

// "Oldest first" is the upload's own order: the picker hands photos over date-ascending.
function sortPhotos(list, order) {
  const out = list.slice();
  if (order === 'newest') out.reverse();
  if (order === 'name') {
    const name = p => String(p).split('/').pop();
    out.sort((a, b) => name(a).localeCompare(name(b), undefined, { numeric: true }));
  }
  return out;
}

// The whole book for a Style choice. The first photo is the cover's, the rest go onto
// pages in runs of the density's pattern. A book is never shorter than the format's
// own page count: if the runs would leave pages over, the photos are spread across
// the pages instead (each page at least one), so "Collage" on a small upload does not
// leave a stack of blank pages at the back. Extra pages come in whole spreads.
function planBook(photos, style, basePages) {
  const per = STYLE_PER.find(p => p.id === style.per) || STYLE_PER[0];
  const look = STYLE_LOOK.find(l => l.id === style.look) || STYLE_LOOK[0];
  const list = sortPhotos(photos, style.order);
  const rest = list.slice(1);
  let counts = [];
  for (let left = rest.length, k = 0; left > 0; k++) {
    const c = Math.min(per.pattern[k % per.pattern.length], left);
    counts.push(c); left -= c;
  }
  if (counts.length < basePages && rest.length) {
    const p = Math.min(basePages, rest.length);
    counts = [];
    for (let i = 0; i < p; i++) {
      counts.push(Math.floor(rest.length * (i + 1) / p) - Math.floor(rest.length * i / p));
    }
  }
  const added = Math.max(0, Math.ceil((counts.length - basePages) / 2));
  const placed = [], layouts = {};
  let at = 0;
  counts.forEach((c, i) => {
    const run = rest.slice(at, at + c);
    at += c;
    placed.push(c === 1 ? run[0] : run);
    const opts = look.layouts[Math.min(6, c)];
    layouts[i + 2] = opts[(i + 1) % opts.length];
  });
  return { placed, cover: list[0] || null, layouts, spacing: look.spacing,
           added, pages: basePages + added * 2 };
}

// ── Draggable seams between slots. A seam is a gutter shared by a run of slots: the
// slots ending at one edge (`a`) and the slots starting at the next (`b`). Dragging
// it moves both edges together, so the gutter keeps its width and one photo grows
// at its neighbour's expense. Slots on the seam's own line move as a group — a 2×2
// grid has one vertical and one horizontal seam, not four.
const SPLIT_MIN = 14; // % of the well — the smallest a slot may be dragged down to
function splitLines(slots) {
  const found = {};
  slots.forEach((A, i) => slots.forEach((B, j) => {
    [['v', 'x', 'w', 'y', 'h'], ['h', 'y', 'h', 'x', 'w']].forEach(([dir, p, l, q, m]) => {
      const gap = B[p] - (A[p] + A[l]);
      const overlap = Math.min(A[q] + A[m], B[q] + B[m]) - Math.max(A[q], B[q]);
      if (gap < 0.5 || gap > 8 || overlap <= 0.5) return;
      const key = `${dir}${Math.round((A[p] + A[l]) * 10)}_${Math.round(B[p] * 10)}`;
      const L = found[key] || (found[key] = { dir, a: new Set(), b: new Set(), gap });
      L.a.add(i); L.b.add(j);
    });
  }));
  return Object.values(found).map(L => {
    const a = [...L.a], b = [...L.b], all = a.concat(b);
    const [p, l, q, m] = L.dir === 'v' ? ['x', 'w', 'y', 'h'] : ['y', 'h', 'x', 'w'];
    const lo = Math.min(...all.map(k => slots[k][q]));
    const hi = Math.max(...all.map(k => slots[k][q] + slots[k][m]));
    return Object.assign(L, { a, b, lo, hi, pos: slots[a[0]][p] + slots[a[0]][l] + L.gap / 2 });
  });
}
function moveSplit(slots, L, delta) {
  const [p, l] = L.dir === 'v' ? ['x', 'w'] : ['y', 'h'];
  let lo = -Infinity, hi = Infinity;
  L.a.forEach(k => { lo = Math.max(lo, SPLIT_MIN - slots[k][l]); });
  L.b.forEach(k => { hi = Math.min(hi, slots[k][l] - SPLIT_MIN); });
  const d = Math.max(lo, Math.min(hi, delta));
  return slots.map((s, k) => {
    if (L.a.includes(k)) return Object.assign({}, s, { [l]: s[l] + d });
    if (L.b.includes(k)) return Object.assign({}, s, { [p]: s[p] + d, [l]: s[l] - d });
    return s;
  });
}

function SplitHandles({ slots, onChange, flash }) {
  const { useRef, useState } = React;
  const root = useRef(null);
  const drag = useRef(null);
  const [live, setLive] = useState(null);
  const lines = splitLines(slots);
  const arrows = dir => (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden
         style={{ transform: dir === 'v' ? 'none' : 'rotate(90deg)' }}>
      <path d="M2.5 10 7 6.2v7.6zM17.5 10 13 6.2v7.6z" fill="#fff" />
    </svg>
  );
  return (
    <div ref={root} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {lines.map((L, n) => {
        const v = L.dir === 'v';
        const active = live === n;
        return (
          <div key={`${L.dir}${n}`} aria-label="Drag to resize photos" role="slider"
               onPointerDown={e => {
                 const r = root.current.getBoundingClientRect();
                 e.currentTarget.setPointerCapture(e.pointerId);
                 drag.current = { n, start: v ? e.clientX : e.clientY,
                                  size: v ? r.width : r.height, base: slots, L };
                 setLive(n);
               }}
               onPointerMove={e => {
                 const d = drag.current;
                 if (!d || d.n !== n) return;
                 const delta = ((v ? e.clientX : e.clientY) - d.start) / d.size * 100;
                 onChange(moveSplit(d.base, d.L, delta));
               }}
               onPointerUp={() => { drag.current = null; setLive(null); }}
               onPointerCancel={() => { drag.current = null; setLive(null); }}
               onClick={e => e.stopPropagation()}
               style={{
                 position: 'absolute', pointerEvents: 'auto', touchAction: 'none',
                 cursor: v ? 'col-resize' : 'row-resize',
                 // The seam itself is invisible; this is just a 36px-wide hit strip
                 // centred on the gutter and as long as the run of slots it divides.
                 [v ? 'left' : 'top']: `calc(${L.pos}% - 18px)`,
                 [v ? 'width' : 'height']: 36,
                 [v ? 'top' : 'left']: `${L.lo}%`,
                 [v ? 'height' : 'width']: `${L.hi - L.lo}%`,
                 display: 'flex', alignItems: 'center', justifyContent: 'center',
               }}>
            <span key={active ? 'drag' : `f${flash}`} aria-hidden style={{
              width: 36, height: 36, borderRadius: 18, background: '#4592FF',
              boxShadow: '0 0 0 2px #fff, 0 4px 10px rgba(0,0,0,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: active ? 1 : 0, pointerEvents: 'none',
              animation: active ? 'none' : 'pbSplitHint 1900ms ease both',
            }}>{arrows(L.dir)}</span>
          </div>
        );
      })}
    </div>
  );
}

// Slot 0 of a page's layout holds the photo auto-fill placed there; the remaining
// slots are filled from the rest of the upload, so a multi-photo layout previews with
// real pictures instead of empty wells. Nothing is written back to pb_placed — the
// layout is a page template, and one photo per page is still the placement. A page
// with nothing placed on it stays empty in every slot.
function slotPhotos(photo, pool) {
  if (!photo) return [];
  return [photo].concat((pool || []).filter(p => p !== photo));
}

// ── A page's photos, one per layout slot.
//
// `pb_placed[n-1]` is either a single photo — what auto-fill writes, and what every
// page held before arrange mode could move individual slots — or an **array**, one
// entry per slot. A page becomes an array the first time a slot on it is moved: what
// you were shown (the pool-filled preview below) becomes what you actually have, which
// is the only way a drag on a multi-photo page can persist.
function pagePhotos(placed, n, slots, pool) {
  if (!n) return [];
  const count = Math.max(1, slots || 1);
  const entry = placed[n - 1];
  if (Array.isArray(entry)) {
    const out = entry.slice(0, count);
    while (out.length < count) out.push(null);
    return out;
  }
  if (!entry) return [];
  // The page's own photo takes the first slot; the rest are empty placeholders to be
  // filled by hand (tap one), not previewed from the upload pool.
  const out = [entry];
  while (out.length < count) out.push(null);
  return out.slice(0, count);
}

// The cover is not a page, so its photos live apart from pb_placed: `pb_cover` is one
// photo per slot of the cover's layout.
function readCover() {
  try {
    const o = JSON.parse(sessionStorage.getItem('pb_cover') || '[]');
    return Array.isArray(o) ? o : [];
  } catch (e) {
    return [];
  }
}
function coverPhotos(cover, count) {
  const out = (cover || []).slice(0, count);
  while (out.length < count) out.push(null);
  return out;
}

// The one photo that stands for a page — a navigator thumbnail, a caption, a clone.
function pageThumb(placed, n) {
  const entry = n ? placed[n - 1] : null;
  if (Array.isArray(entry)) return entry.find(Boolean) || null;
  return entry || null;
}

// A well subdivided by a layout. It positions itself absolutely inside its parent,
// so the parent only has to be `position: relative` — which is what lets the same
// component serve a leaf in the book view, a page in the strip and a drawer card.
function LayoutWell({ layout, photos, iconSize = 24, style, onSelect, selected, adjust, onEmpty }) {
  const slots = layout && layout.length ? layout : FULL_PAGE;
  const pickable = !!onSelect;
  return (
    // aria-hidden only while the slots are decorative; with onSelect they are real
    // controls and hiding them would take them off assistive tech too.
    <div aria-hidden={pickable ? undefined : true}
         style={Object.assign({ position: 'absolute', inset: 0, containerType: 'size' }, style)}>
      {slots.map((s, i) => {
        const photo = photos && photos[i];
        // Scale the empty-state glyph with the slot: 24px swamps a 22%-tall track,
        // and PhotoWell's overflow:hidden would simply clip it.
        const icon = Math.max(10, Math.round(iconSize * Math.min(s.w, s.h) / 100));
        const box = Object.assign({ position: 'absolute' }, s.css || {
          left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`,
        });
        // Only a slot with a photo in it can be selected — an empty well has nothing
        // to select, and the node only ever shows a filled photo ringed.
        if (onEmpty && !photo) {
          return (
            <div key={i} role="button" tabIndex={0} aria-label="Add a photo"
                 onClick={e => { e.stopPropagation(); onEmpty(i); }}
                 onKeyDown={e => {
                   if (e.key === 'Enter' || e.key === ' ') {
                     e.preventDefault(); e.stopPropagation(); onEmpty(i);
                   }
                 }}
                 style={Object.assign({ cursor: 'pointer',
                   WebkitTapHighlightColor: 'transparent' }, box)}>
              <PhotoWell photo={null} iconSize={icon} index={i}
                         style={{ position: 'absolute', inset: 0, flex: 'none' }} />
            </div>
          );
        }
        if (!pickable || !photo) {
          return <PhotoWell key={i} photo={photo} iconSize={icon} index={i}
                            style={Object.assign({ flex: 'none' }, box)} />;
        }
        return (
          <div key={i} role="button" tabIndex={0}
               aria-label={`Select photo ${i + 1}`}
               aria-pressed={selected === i}
               // Stop the tap here: the strip's own click handler deselects, which is
               // how a tap on the page around a photo clears the selection.
               onClick={e => { e.stopPropagation(); onSelect(i); }}
               onKeyDown={e => {
                 if (e.key === 'Enter' || e.key === ' ') {
                   e.preventDefault(); e.stopPropagation(); onSelect(i);
                 }
               }}
               style={Object.assign({
                 cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
               }, box)}>
            <PhotoWell photo={photo} iconSize={icon} index={i}
                       style={{ position: 'absolute', inset: 0, flex: 'none' }} />
            {selected === i && (
              // node 451:14635 — a 1px #1500FF ring on the photo. It has to paint
              // *over* the picture, so it is an overlay rather than an inset shadow
              // on the slot itself: an inset shadow renders below the <img> that
              // fills the well. Painting it inside the box also keeps the slot's
              // geometry untouched, the way a real Figma inside-stroke does.
              <span aria-hidden style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                boxShadow: 'inset 0 0 0 1px #1500FF',
              }} />
            )}
          </div>
        );
      })}
      {adjust && slots.length > 1 && (
        <SplitHandles slots={slots} onChange={adjust.onChange} flash={adjust.flash} />
      )}
    </div>
  );
}

// ── Caption strip under a sheet — node 451:15593/15594. Centred on y=186 for a
// 172 sheet, i.e. 4px below the paper.
function Caption({ left, right }) {
  const s = {
    fontFamily: TEXT, fontSize: 12, lineHeight: '20px',
    color: '#FFFFFF', opacity: 0.35,
  };
  return (
    <div aria-hidden style={{
      marginTop: 4, height: 20, display: 'flex', justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={s}>{left || ''}</span>
      <span style={s}>{right || ''}</span>
    </div>
  );
}

// ── Add-spread pill — node 451:15602. Sits in the 71px gap between two sheets:
// 7px of it overlaps the caption strip above, exactly as the node has it.
//
// The node's first pill (451:15587) is a #272727/r12 variant while the other three
// are #333 full pills — standardised on the majority.
function AddSpreadButton({ onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label="Add spread" {...press(0.9)}
      style={{
        position: 'absolute', left: 'calc(50% - 28px)', bottom: -31,
        width: 56, height: 38, borderRadius: 24, border: 'none', padding: 0,
        background: 'var(--colour-foreground-fg-black, #333333)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'transform 140ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}>
      <img src={`${A}/pb-editor-plus.svg`} alt="" width={16} height={16}
           style={{ display: 'block' }} />
    </button>
  );
}

// ── Cover — node 451:15622. Back cover carries a 50×18 placeholder bottom-left;
// the front carries "Add text" over a photo well. The double 14px hinge strips at
// 50% ±(11,3) reproduce the node's overlapping pair.
// The cover's own interior, shared with arrange mode so the two views draw the same
// cover. `onOpen` is optional: arrange shows the cover but does not open it.
function CoverInterior({ onOpen, layout, photos, onEmpty }) {
  const t = useTheme();
  const paint = React.useContext(BookPaint);
  const color = slotColor(paint.colors, 0);
  return (
        // Unthemed, the cover is the bare sheet; a theme papers it in its own colour,
        // and the Color tool overrides both.
        <div style={{ position: 'relative', width: '100%', height: '100%',
                      background: color || (t === CLASSIC ? 'transparent' : t.page),
                      transition: 'background 240ms ease' }}>
          <div aria-hidden style={{
            position: 'absolute', left: 6, bottom: 5, width: 50, height: 18,
            background: t.well,
          }} />
          <div
            role={onOpen ? 'button' : undefined}
            tabIndex={onOpen ? 0 : undefined}
            aria-label={onOpen ? 'Open the cover' : undefined}
            onClick={onOpen}
            onKeyDown={onOpen ? e => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); }
            } : undefined}
            {...(onOpen ? press(0.97) : {})}
            style={{
            position: 'absolute', left: 'calc(50% + 10px)', right: 3, top: 2, bottom: 2,
            containerType: 'size', overflow: 'hidden',
            cursor: onOpen ? 'pointer' : 'default',
            transformOrigin: 'left center',
            transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
          }}>
            {/* node 451:15628/15629 is the Classic design: the title above the photo. */}
            <CoverFront design={paint.cover} layout={layout} photos={photos} onEmpty={onEmpty}
                        bg={color || t.page} />
            <ThemeSticker n={null} />
          </div>
        </div>
  );
}

function CoverBlock({ aspect, onOpen, layout, photos, onEmpty }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Sheet aspect={aspect} interior={<CoverInterior onOpen={onOpen} layout={layout} photos={photos} onEmpty={onEmpty} />}>
        <GutterArt file="pb-editor-hinge.png" offsets={[-11, -3]} width={14} opacity={0.5} />
      </Sheet>
      <Caption right="Cover" />
    </div>
  );
}

// ── Inner spread — node 451:15591.
// `photos` is the placed list, indexed by page number — page n holds photos[n-1].
// The inside-front and inside-back leaves carry no page number, so they stay empty.
function SpreadBlock({ aspect, left, right, showPlus, onAdd, photos, onOpen,
                      layoutFor, pool, onEmpty }) {
  const name = n => (n ? `page ${n}` : 'the inside cover');
  const at = (n, side) => {
    const layout = layoutFor && layoutFor(side);
    return pagePhotos(photos, n, layout ? layout.length : 1, pool);
  };
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Sheet aspect={aspect} interior={
        <React.Fragment>
          <Leaf side="left" n={left} photos={at(left, 'left')} label={name(left)}
                layout={layoutFor && layoutFor('left')}
                onEmpty={onEmpty && left ? i => onEmpty(left, (layoutFor('left') || FULL_PAGE).length, i) : undefined}
                blank={!left} onOpen={onOpen && left ? (() => onOpen('left')) : undefined} />
          <Leaf side="right" n={right} photos={at(right, 'right')} label={name(right)}
                layout={layoutFor && layoutFor('right')}
                onEmpty={onEmpty && right ? i => onEmpty(right, (layoutFor('right') || FULL_PAGE).length, i) : undefined}
                blank={!right} onOpen={onOpen && right ? (() => onOpen('right')) : undefined} />
        </React.Fragment>
      }>
        <GutterArt file="pb-editor-spine.png" offsets={[-4]} width={8} />
      </Sheet>
      <Caption left={left} right={right} />
      {showPlus && <AddSpreadButton onClick={onAdd} />}
    </div>
  );
}

// ── Details card — node 451:15649. Title and price come from the selection made
// on the product page; the node's own copy is the fallback.
// The settings icon is inert in this build — no options sheet exists in the Figma.
function DetailsCard({ title, pages, total }) {
  return (
    <div style={{
      margin: '0 16px', boxSizing: 'border-box',
      background: '#272727', border: '1px solid #363636', borderRadius: 12,
      padding: '12px 16px 12px 12px',
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <p style={{
          margin: 0, fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
          letterSpacing: '-0.08px', color: '#FFFFFF',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</p>
        <p style={{
          margin: 0, fontFamily: TEXT, fontSize: 12, lineHeight: '16px',
          color: 'var(--colour-foreground-fg-grey, #CCCCCC)',
        }}>{pages} pages • €{total}</p>
      </div>
      <button type="button" aria-label="Book settings" {...press(0.9)}
        style={{
          flex: '0 0 auto', width: 24, height: 24, border: 'none', padding: 0,
          background: 'transparent', cursor: 'pointer',
          transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
        }}>
        <img src={`${A}/pb-editor-options.svg`} alt="" width={24} height={24}
             style={{ display: 'block' }} />
      </button>
    </div>
  );
}

// ── Header — node 451:15677: a 147-tall top fade with backdrop-blur(5px), the
// button row on its baseline at y=68. The container is pointer-transparent so the
// spreads underneath still scroll; only the row takes taps.
//
// The brief asks for the same liquid glass as the home header's bell, so these are
// GlassIconButtons with the node's rgba(0,0,0,0.25) interior — the home recipe's
// near-clear tint disappears on a near-black backdrop.
// node 451:15685 layers a teal colour-dodge over a soft-light wash. Reproduced as
// a measured translucent teal instead, for two reasons:
//   · CSS and Figma disagree on the blend result even in isolation — the literal
//     recipe renders (19,58,61) where the node samples (11,41,42).
//   · More decisively, Chrome composites the scroller (dot canvas + backdrop
//     filters) into its own layer, and mix-blend-mode cannot blend across a
//     composited layer boundary. It silently fell back to blending against
//     nothing, which rendered the button at (42,139,142) — ~3x too bright.
// rgba(0,66,68,0.5) over the header's (24,24,24) lands on (12,45,46), the mean of
// the node's interior. Still 50% translucent, so it keeps reacting to its backdrop.
const CONTINUE_ACCENT = (
  <div aria-hidden style={{
    position: 'absolute', inset: 0, borderRadius: 'inherit',
    background: 'rgba(0,66,68,0.5)', pointerEvents: 'none',
  }} />
);

function Header({ onClose }) {
  const icon = file => (
    <img src={`${A}/${file}`} alt="" width={24} height={24} style={{ display: 'block' }} />
  );
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6,
      height: 'calc(env(safe-area-inset-top, 44px) + 103px)',
      pointerEvents: 'none',
    }}>
      {/* The fade and its blur have to be a *sibling* of the button row, not its
          parent. An element with backdrop-filter is a backdrop root, so the
          Continue button's colour-dodge/soft-light nested inside one had only this
          near-transparent gradient to blend against and came out ~3x too bright
          (measured 42,139,142 against the node's 11,41,42). As a sibling, the
          blend reaches the page behind the header, which is what Figma does.

          The node specifies a flat backdrop-blur(5px); this uses the image picker's
          three-stage staircase instead (IOSProgressiveBlur). The scrim keeps the
          node's colours — rgb(20,20,20) fading to rgba(12,12,12,0) at 96% — but its
          top stop is dropped to 55% alpha: the node's stop is fully opaque, which
          would hide the very blur it sits on. At rest the header is dark-on-dark so
          this reads the same; the difference only shows when a white spread scrolls
          under it, which is exactly when the blur should be visible. */}
      <IOSProgressiveBlur scrim={
        'linear-gradient(to bottom, rgba(20,20,20,0.55) 0.3%,' +
        ' rgba(16,16,16,0.22) 60%, rgba(12,12,12,0) 96%)'
      } />
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: 'max(68px, calc(env(safe-area-inset-top, 44px) + 24px))',
        padding: '0 16px', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        pointerEvents: 'auto',
      }}>
        <GlassIconButton label="Close editor" tint="rgba(0,0,0,0.25)" gloss onClick={onClose}>
          {icon('pb-editor-close.svg')}
        </GlassIconButton>

        {/* One 88×40 pill holding both glyphs, as the node draws it (451:15682).
            Inert here — nothing has been edited yet, which is also why the node's
            own redo glyph ships in its #333 disabled state. Split it into two
            buttons once there is an edit history to walk. */}
        <GlassIconButton label="Undo and redo" width={88} tint="rgba(0,0,0,0.25)" gloss>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {icon('pb-editor-undo.svg')}
            {icon('pb-editor-redo.svg')}
          </span>
        </GlassIconButton>

        <GlassIconButton label="Continue" tint="transparent" accent={CONTINUE_ACCENT} gloss
          onClick={() => window.navigation.push('book-preview.html')}>
          {icon('pb-editor-next.svg')}
        </GlassIconButton>
      </div>
    </div>
  );
}

// ── Toolbar — node 490:17058 / row 490:17059.
// Five tools are visible in the node; the row is clipped at the frame edge there,
// and the brief lists Options as the sixth. Six 68pt tools overflow any phone
// width, so the row scrolls horizontally — which is what the node is already doing.
// All six are inert in this build.
const TOOLS = [
  { id: 'photos',  label: 'Photos',  icon: 'pb-editor-tool-photos.svg' },
  { id: 'arrange', label: 'Arrange', icon: 'pb-editor-tool-arrange.svg' },
  { id: 'themes',  label: 'Themes',  icon: 'pb-editor-tool-themes.svg' },
  { id: 'style',   label: 'Style',   icon: 'pb-editor-tool-style.svg' },
  { id: 'ai',      label: 'AI help', icon: 'pb-editor-tool-ai.svg' },
  { id: 'options', label: 'Options', icon: 'pb-editor-options.svg' },
];

// ── Photos tool, filled state — Figma node 451:15722, icon 451:15725.
// Once photos are in the book the flat Photos glyph is replaced by a scatter of four
// thumbnails with a count badge. The node's four wrappers are flex-centring boxes sized
// to each rotated tile's bounding box (12 × (|cos|+|sin|)), so the numbers below are
// their centres reduced to a plain 12×12 tile plus a rotation:
//   (8.05, 4.95) −6.04°   (18.55, 4.57) +6.63°
//   (8.03, 15.96) −4.30°   (18.80, 15.94) +10.62°
// Painted in node order, so the lower two overlap the upper two.
const PHOTO_TILES = [
  { left: 2.0475, top: -1.0525, rot: -6.04 },
  { left: 12.552, top: -1.428,  rot: 6.63 },
  { left: 12.8025, top: 9.9425, rot: 10.62 },
  { left: 2.033,  top: 9.963,   rot: -4.3 },
];

// Page view's toolbar — node 520:26509. A different, later toolset than the book
// view's 451:15574 row: eight tools laid out from the left with gap 8 rather than six.
// "delete page" is the node's own casing; sentence case here, like its siblings.
// All eight are inert, on the same footing as the book view's tools.
const PV_TOOLS = [
  { id: 'photos',   label: 'Photos',       icon: 'pb-editor-tool-photos.svg' },
  { id: 'addphoto', label: 'Add photo',    icon: 'pb-editor-tool-addphoto.svg' },
  { id: 'addtext',  label: 'Add text',     icon: 'pb-editor-tool-addtext.svg' },
  { id: 'layout',   label: 'Layout',       icon: 'pb-editor-tool-layout.svg' },
  { id: 'spacing',  label: 'Spacing',      icon: 'pb-editor-tool-spacing.svg' },
  // Not in the node. The palette glyph is the book view's Style icon, reused.
  { id: 'color',    label: 'Color',        icon: 'pb-editor-tool-style.svg' },
  { id: 'stickers', label: 'Stickers',     icon: 'pb-editor-tool-stickers.svg' },
  { id: 'smart',    label: 'Smart Design', icon: 'pb-editor-tool-smartdesign.svg' },
  // The node's "Ask AI" glyph (icon / Magic tool) exports byte-identical to the book
  // view's "AI help" icon, so the existing asset is reused rather than duplicated.
  { id: 'askai',    label: 'Ask AI',       icon: 'pb-editor-tool-ai.svg' },
  { id: 'delete',   label: 'Delete page',  icon: 'pb-editor-tool-delete.svg' },
];

// ── Selected-photo toolbar — node 451:14611, row 451:14675. Replaces the page
// view's eight tools for as long as a photo is selected: six tools laid out from
// x=0 with gap 4, and a 1px rule after "Back" (451:14679).
//
// Two of the node's glyphs needed no new asset — its "icon / Magic tool" and
// "icon / Delete" exports are byte-identical to pb-editor-tool-ai.svg and
// pb-editor-tool-delete.svg. Checked with cmp, not by eye.
//
// "Back" deselects (what the node's leading position and back arrow mean) and
// "Replace" opens the photo tray for the selected slot. Edit, Move, Delete and Ask AI are inert, on the same
// footing as every other tool in this editor — Delete deliberately so: the undo pill
// is inert too, so a working delete would drop a photo out of pb_placed with no way
// back. Wire it to a setPlaced() splice when that is wanted.
const SELECTED_TOOLS = [
  { id: 'back',    label: 'Back',    icon: 'pb-editor-sel-back.svg' },
  { divider: true },
  { id: 'replace', label: 'Replace', icon: 'pb-editor-sel-replace.svg' },
  { id: 'edit',    label: 'Edit',    icon: 'pb-editor-sel-edit.svg' },
  { id: 'move',    label: 'Move',    icon: 'pb-editor-sel-move.svg' },
  { id: 'delete',  label: 'Delete',  icon: 'pb-editor-tool-delete.svg' },
  { id: 'askai',   label: 'Ask AI',  icon: 'pb-editor-tool-ai.svg' },
];

function PhotosStackIcon({ photos, count }) {
  return (
    // 26×24 per the node. The badge deliberately breaks out of it — 13px to the right
    // and 7px above — so nothing here may clip.
    <span aria-hidden style={{ position: 'relative', width: 26, height: 24, display: 'block' }}>
      {PHOTO_TILES.map((t, i) => (
        <span key={i} style={{
          position: 'absolute', left: t.left, top: t.top,
          width: 12, height: 12, boxSizing: 'border-box',
          transform: `rotate(${t.rot}deg)`,
          border: '1px solid #FFFFFF', borderRadius: 2,
          boxShadow: '0px 1px 1px rgba(0,0,0,0.35)',
          background: '#D9D9D9', overflow: 'hidden', display: 'block',
        }}>
          {photos[i] && (
            <img src={photos[i]} alt="" loading="lazy" style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            }} />
          )}
        </span>
      ))}
      {/* node 451:15730/15731 — 23×15 pill at (16, −7), label centred on it */}
      <span style={{
        position: 'absolute', left: 16, top: -7, height: 15,
        // Fixed 23 in the node, which shows "24". Kept as a minimum with side padding
        // so a three-digit count still fits rather than spilling out of the pill.
        minWidth: 23, boxSizing: 'border-box', padding: '0 4px',
        borderRadius: 37, background: '#F4633A',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
        letterSpacing: '-0.08px', color: '#FFFFFF',
      }}>{count}</span>
    </span>
  );
}

// The node's drop-shadow sits on the row; applied per tool instead, which composites
// identically (tools never overlap) and keeps a filter off the scroll container.
function Tool({ label, icon, children, onClick }) {
  return (
    <button type="button" onClick={onClick} {...press(0.9)} style={{
      flex: '0 0 auto', width: 68, padding: '0 8px', boxSizing: 'border-box',
      border: 'none', background: 'transparent', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 4,
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      filter: 'drop-shadow(0px 4px 2px rgba(0,0,0,0.25))',
    }}>
      {children || (
        <img src={`${A}/${icon}`} alt="" width={24} height={24} style={{ display: 'block' }} />
      )}
      <span style={{
        fontFamily: '-apple-system, "SF Pro", system-ui, sans-serif', fontWeight: 510,
        fontSize: 12, lineHeight: '20px', whiteSpace: 'nowrap',
        color: 'var(--colour-foreground-fg-grey, #CCCCCC)',
      }}>{label}</span>
    </button>
  );
}

// Progressive blur + dark wash. The node specifies a flat backdrop-blur(10px);
// a single uniform blur leaves a hard seam where it stops, so five doubling layers
// are stacked, each masked to a shorter band measured up from the bottom, and the
// blur accumulates because every layer samples the layers already painted below it.
// Stops are px, not percentages: percentages scale with the container and would
// drag the strong layers up over the spreads whenever the safe-area inset changes.
const BLUR_BANDS = [[16, 24, 56], [8, 40, 78], [4, 56, 100], [2, 74, 122], [1, 92, 145]];

function Toolbar({ photos, tools = TOOLS, gap = 10, padX = 8, onTool }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 6,
      height: 'calc(139px + env(safe-area-inset-bottom, 0px))',
      pointerEvents: 'none',
    }}>
      {BLUR_BANDS.map(([blur, solid, gone]) => {
        const fade = `linear-gradient(to top, #000 0px, #000 ${solid}px, rgba(0,0,0,0) ${gone}px)`;
        return (
          <div key={blur} aria-hidden style={{
            position: 'absolute', inset: 0,
            backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`,
            maskImage: fade, WebkitMaskImage: fade,
          }} />
        );
      })}
      {/* node 490:17058 — two stacked gradients, clear at the top, opaque by 73.5% */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        backgroundImage:
          'linear-gradient(to bottom, rgba(27,27,27,0) 0.2%, rgb(19,19,19) 73.5%),' +
          ' linear-gradient(to bottom, rgba(27,27,27,0) 0.2%, rgb(27,27,27) 73.5%)',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0,
        bottom: 'max(37px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
        display: 'flex', gap, boxSizing: 'border-box',
        // The Photos badge breaks 7px above its icon, and overflow-x:auto forces
        // overflow-y to auto/hidden — it can never be visible — so the row needs
        // matching headroom or the badge is sliced off. Padding-top only: the row is
        // anchored by `bottom`, so the tools do not move.
        padding: `8px ${padX}px 0`,
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        pointerEvents: 'auto',
      }}>
        {tools.map((t, i) => (
          // node 451:14679 — a 1px rule spanning the row, between Back and Replace.
          t.divider ? (
            <span key={`divider-${i}`} aria-hidden style={{
              flex: '0 0 auto', alignSelf: 'stretch', width: 1,
              background: 'rgba(217,217,217,0.1)',
            }} />
          ) : (
            <Tool key={t.id} {...t} onClick={onTool && (() => onTool(t.id))}>
              {t.id === 'photos' && photos.length
                ? <PhotosStackIcon photos={photos} count={photos.length} />
                : null}
            </Tool>
          )
        ))}
      </div>
    </div>
  );
}

// ── Action sheets — Figma nodes 451:15887 (upload prompt) and 451:15751 (auto-fill).
// Both use the same shell: the overlay (451:16012 / 451:15876) and a bottom sheet
// (451:16013 / 451:15877) that differ only in height and content, so the shell is
// shared and each prompt supplies its own body.
//
// The fill is a radial gradient whose Figma transform decodes to an ellipse centred
// on the sheet's own top edge. Upload: matrix(0 11.1 -36.918 0.22841 188 0) at r=10 →
// 369.18 × 111 on a 375×362 sheet. Auto-fill: matrix(0 10.18 -36.918 0.20948 188 0) →
// 369.18 × 101.8 on a 375×332 sheet. Both land on the same percentages, so one string
// serves both.
// ⚠️ Flattened to solid on request. The node's centre stop was translucent, so the
// blurred editor showed through the top of the sheet and its edge washed out. The
// node's gradient was: radial-gradient(98.45% 30.66% at 50.13% 0%, rgba(0,0,0,0.2) 0%, #111111 100%)
const SHEET_FILL = '#111111';

// Node 451:16017/16018 and 451:15885/15886. The two sheets style their buttons
// slightly differently — the upload sheet's carry a rim and an inset shadow, the
// auto-fill sheet's are flat — so the caller passes the difference in.
function SheetButton({ label, onClick, style }) {
  return (
    <button type="button" onClick={onClick} {...press(0.97)} style={Object.assign({
      position: 'relative', width: '100%', boxSizing: 'border-box',
      padding: '16px 24px', borderRadius: 55, border: 'none', cursor: 'pointer',
      fontFamily: TEXT, fontWeight: 600, fontSize: 16, lineHeight: '21px',
      letterSpacing: '-0.32px', textAlign: 'center',
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
    }, style)}>{label}</button>
  );
}

// A 1px 5% white rim on every bottom sheet. The sheets are near-black on a near-black
// page, so without it the top edge disappears. An inset shadow rather than a border, so
// the sheet's size does not change. Raise the alpha here if it needs to read stronger.
const SHEET_RIM = 'inset 0 0 0 1px rgba(255,255,255,0.05)';

function ActionSheet({ closing, minHeight, onDismiss, labelledBy, children }) {
  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby={labelledBy}
      onClick={onDismiss}
      style={{
        position: 'absolute', inset: 0, zIndex: 20,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
        animation: closing ? 'pbScrimOut 300ms ease both' : 'pbScrimIn 300ms ease both',
      }}
    >
      <div
        // Taps inside the sheet must not reach the scrim's dismiss handler.
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          minHeight, boxSizing: 'border-box',
          borderRadius: '24px 24px 0 0', boxShadow: SHEET_RIM,
          background: SHEET_FILL,
          filter: 'drop-shadow(0px -12px 9.3px rgba(0,0,0,0.65))',
          display: 'flex', flexDirection: 'column',
          animation: closing
            ? 'pbSheetOut 320ms cubic-bezier(0.4,0,0.2,1) both'
            : 'pbSheetIn 380ms cubic-bezier(0.34,1.05,0.64,1) both',
        }}
      >
        {children}
      </div>
    </div>
  );
}

const SHEET_TITLE = {
  margin: 0, width: '100%', textAlign: 'center', color: '#FFFFFF',
  fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, lineHeight: '28px',
  letterSpacing: '0.35px',
};
const SHEET_BODY = {
  margin: 0, width: '100%', textAlign: 'center',
  color: 'var(--colour-foreground-fg-grey, #CCCCCC)',
  fontFamily: TEXT, fontSize: 16, lineHeight: '21px', letterSpacing: '-0.32px',
};

// ── Upload prompt — node 451:15887. Shown when the book has no photos yet.
function UploadSheet({ closing, onSelect, onSkip }) {
  return (
    <ActionSheet closing={closing} minHeight={362} onDismiss={onSkip}
                 labelledBy="pb-sheet-title">
      {/* node 451:16019 — 43 from the sheet top, gap 24, 20px gutters */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 24,
        alignItems: 'center', padding: '43px 20px 0',
      }}>
        <img src={`${A}/pb-editor-upload.svg`} alt="" width={24} height={24}
             style={{ display: 'block' }} />
        <p id="pb-sheet-title" style={SHEET_TITLE}>Upload your photos</p>
        <p style={SHEET_BODY}>
          Upload at least 24 photos. We’ll offer to place them across your book for you.
        </p>
      </div>
      {/* node 451:16016 — pinned to the bottom. With the node's 43 top padding and 24
          bottom on a 362 sheet this lands at y=220, where the node has it, while still
          adapting if the copy rewraps. */}
      <div style={{
        marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12,
        padding: '24px 19px 0',
        paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
      }}>
        <SheetButton label="Select photos" onClick={onSelect}
          style={{ background: '#F0F0F0', border: '1px solid #FFFFFF',
                   color: 'var(--colour-foreground-fg-black, #333333)' }} />
        <SheetButton label="Start from empty book" onClick={onSkip}
          style={{ background: 'var(--colour-foreground-fg-black, #333333)',
                   border: '1px solid #464646', color: '#FFFFFF',
                   boxShadow: 'inset 0px 0px 27px rgba(0,0,0,0.25)' }} />
      </div>
    </ActionSheet>
  );
}

// ── Auto-fill prompt — node 451:15751. Shown on returning from the picker with a
// selection. The node's copy reads "n photos"; n is the real count.
function AutofillSheet({ closing, count, onYes, onNo }) {
  return (
    <ActionSheet closing={closing} minHeight={332} onDismiss={onNo}
                 labelledBy="pb-autofill-title">
      {/* node 451:15880 — bottom-anchored, py 32, gap 35 between copy and buttons */}
      <div style={{
        marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 35,
        paddingTop: 32,
        paddingBottom: 'max(32px, calc(env(safe-area-inset-bottom, 0px) + 12px))',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '0 20px' }}>
          <p id="pb-autofill-title" style={SHEET_TITLE}>Auto-fill your book?</p>
          <p style={SHEET_BODY}>
            You uploaded{' '}
            <span style={{ fontWeight: 600, color: '#FFFFFF' }}>
              {count} photo{count === 1 ? '' : 's'}
            </span>
            . Want to place them all in chronological order? You can always change the
            order later.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 18px' }}>
          <SheetButton label="Yes, auto-fill" onClick={onYes}
            style={{ background: 'var(--colour-foreground-fg-white, #FFFFFF)',
                     color: 'var(--colour-foreground-fg-black, #333333)' }} />
          <SheetButton label="No, I’ll place them myself" onClick={onNo}
            style={{ background: 'var(--colour-foreground-fg-black, #333333)',
                     color: '#FFFFFF' }} />
        </div>
      </div>
    </ActionSheet>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// Page view mode — Figma node 451:14499
// ═══════════════════════════════════════════════════════════════════════════════
// Tapping any page in the book view zooms into it: one page nearly fills the width
// with the rest of the book running off-screen, the strip scrolls horizontally from
// page to page, and a navigator between the preview and the toolbar says where you
// are. It is a *mode* of EditorScreen rather than its own screen, so the placed
// photos, the page count, the pending sheet and the book view's scroll position all
// survive going in and coming back out.
//
// ⚠️ The node is a WIP frame literally named "test" and carries a good deal of
// off-canvas scratch — a second pair of 177px photo squares at x=432/610 and a
// #272727 add-strip at x=379, all of them behind the book or past the 402 frame
// edge. None of it is visible in the design and none of it is built.

// The open book — group 451:14563. A 637.691 × 323.387 frame holding the open
// spread (451:14570) at (9.08, 5.45) sized 619.523 × 312.487, so the paper stack
// behind shows as ~9px of margin at the sides and ~5.5px top and bottom. Kept as
// fractions of the frame so the three exported paper layers compose correctly at
// whatever aspect the chosen format gives the spread.
const BOOK = {
  interior: { left: 9.08 / 637.691, top: 5.45 / 323.387,
              width: 619.523 / 637.691, height: 312.487 / 323.387 },
  // 451:14568 (#E4E4E4) and 451:14569 (#F0F0F0) — the two drooping sheets. The node
  // declares each as a 623.157 × 310.612 box holding an image inset by the negative
  // percentages of its own filter bleed; those are folded in, so each entry is the
  // position and size of the exported SVG itself.
  sheetA: { left: 4.71 / 637.691, top: 7.27 / 323.387,
            width: 626.438 / 637.691, height: 313.893 / 323.387 },
  sheetB: { left: 0, top: 7.27 / 323.387,
            width: 1, height: 325.146 / 323.387 },
};

// A page occupies 309.7615 of the node's 402 frame. That fraction is what makes the
// strip read as zoomed into a single page rather than showing a whole spread.
const PV_PAGE_FRACTION = 309.7615 / 402;

// Photo well inside a page — node 451:14572, a 279.332 square at (15.29, 17.05) on
// a 309.76 × 312.487 leaf. The node's insets are symmetric, so one set serves both
// leaves and no gutter allowance is needed on the spine side.
const PV_WELL = { left: '4.937%', right: '4.887%', top: '5.456%', bottom: '5.154%' };

// 451:14563's drop shadow, minus its two no-op layers — the 75.926px one is fully
// transparent and the last has no offset, blur or spread. The offsets are design px
// on a 637-wide book, which is what the book measures at a 402 viewport, so they are
// carried over verbatim rather than scaled.
const PV_BOOK_SHADOW =
  'drop-shadow(0px 48.742px 9.842px rgba(0,0,0,0.02))' +
  ' drop-shadow(0px 27.183px 7.968px rgba(0,0,0,0.08))' +
  ' drop-shadow(0px 12.186px 6.093px rgba(0,0,0,0.13))' +
  ' drop-shadow(0px 2.812px 3.281px rgba(0,0,0,0.15))';

// The navigator's own metrics — node 451:14511: a 45-tall row of 41px thumbnails
// with the 11px page number on a 20px line under it, i.e. 65 tall overall.
const NAV_THUMB = 41;
const NAV_ROW = 45;
const NAV_ADD = 38;

// ── Slots. A slot is one page you can zoom into: the front cover, then every leaf
// of every spread in reading order. `unit` indexes the book graphic it lives in —
// 0 is the cover, 1..n are the spreads — so the strip and the navigator are driven
// by one list and cannot drift apart.
//
// The back cover is drawn but is not a slot: it is not a page you edit, and the
// node's navigator carries a single "Cover" entry (451:14514, the 4px spine bar
// plus one thumbnail) rather than a pair.
function slotsFor(pages) {
  const out = [{ unit: 0, side: 'right', n: null, label: 'Cover' }];
  spreadsFor(pages).forEach((pair, i) => {
    pair.forEach((n, k) => {
      // ⚠️ The node numbers the inside front cover "0" and runs on 1..5 from there.
      // The book view's captions leave both inside-cover leaves blank, and the two
      // views agreeing matters more than reproducing that one number.
      out.push({ unit: i + 1, side: k ? 'right' : 'left', n, label: n ? String(n) : '' });
    });
  });
  return out;
}

// ── One open book in the strip. The three paper layers are the node's own exports;
// `children` is the live spread that sits slightly above them.
function BookUnit({ w, h, children }) {
  const iv = BOOK.interior;
  const layer = (file, box) => (
    <img key={file} src={`${A}/${file}`} alt="" aria-hidden style={{
      position: 'absolute', display: 'block',
      left: `${box.left * 100}%`, top: `${box.top * 100}%`,
      width: `${box.width * 100}%`, height: `${box.height * 100}%`,
    }} />
  );
  return (
    <div style={{
      position: 'relative', flex: '0 0 auto', width: w, height: h,
      filter: PV_BOOK_SHADOW,
    }}>
      {layer('pb-editor-book-block.svg', { left: 0, top: 0, width: 1, height: 1 })}
      {layer('pb-editor-book-sheet-a.svg', BOOK.sheetA)}
      {layer('pb-editor-book-sheet-b.svg', BOOK.sheetB)}
      <div style={{
        position: 'absolute',
        left: `${iv.left * 100}%`, top: `${iv.top * 100}%`,
        width: `${iv.width * 100}%`, height: `${iv.height * 100}%`,
        display: 'flex',
        filter: 'drop-shadow(0px 1.817px 1.817px rgba(0,0,0,0.25))',
      }}>
        {children}
      </div>
    </div>
  );
}

// ── A page in the strip — node 451:14571 (left) / 451:14573 (right). The gradient
// is the node's own: white until 96.188%, darkening to #EEE / #DFDFDF at the spine.
// A leaf with `slotRef` set is a scroll-snap target; the back cover has none, so the
// strip can never come to rest on it.
function BigLeaf({ side, slotRef, children, slot }) {
  const left = side === 'left';
  const t = useTheme();
  const { colors } = React.useContext(BookPaint);
  const paper = slotColor(colors, slot) || t.page;
  // A theme or a chosen colour keeps the node's spine shading by darkening its paper.
  const spine = pct => (paper === '#FFFFFF' ? null : `color-mix(in srgb, ${paper} ${pct}%, #000)`);
  return (
    <div ref={slotRef} style={{
      position: 'relative', width: '50%', height: '100%', containerType: 'size',
      background: left
        ? `linear-gradient(to right, ${paper} 96.188%, ${spine(93) || '#EEEEEE'} 100.29%)`
        : `linear-gradient(to left, ${paper} 96.188%, ${spine(87) || '#DFDFDF'} 100.05%)`,
      scrollSnapAlign: slotRef ? 'center' : 'none',
      scrollSnapStop: slotRef ? 'always' : 'normal',
    }}>
      {children}
    </div>
  );
}

// The well, positioned on the node's own insets. `iconSize` scales the empty-state
// glyph with the page: 24px is right on a 164px leaf in the book view and lost on a
// 310px one here.
function BigWell({ photos, layout, pageW, onSelect, selected, adjust, onEmpty }) {
  return (
    <div style={{
      position: 'absolute',
      left: PV_WELL.left, right: PV_WELL.right,
      top: PV_WELL.top, bottom: PV_WELL.bottom,
    }}>
      <LayoutWell layout={layout} photos={photos}
                  iconSize={Math.round(pageW * 0.13)}
                  onSelect={onSelect} selected={selected} adjust={adjust} onEmpty={onEmpty} />
    </div>
  );
}

// ── Cover unit. Not shown in the node's page view — it opens on page "0" — so this
// follows CoverBlock in the book view: the back cover carries the placeholder block
// bottom-left, the front carries "Add text" over a well. Both are expressed as
// fractions of the page so the cover reads the same zoomed in as it does zoomed out.
function CoverUnit({ w, h, pageW, frontRef, layout, adjust, photos, onEmpty, onSelect, selected }) {
  const t = useTheme();
  const paint = React.useContext(BookPaint);
  return (
    <BookUnit w={w} h={h}>
      <BigLeaf side="left" slot={0}>
        <span aria-hidden style={{
          position: 'absolute', left: PV_WELL.left, bottom: PV_WELL.bottom,
          width: '30%', height: '11%', background: t.well,
        }} />
      </BigLeaf>
      <BigLeaf side="right" slotRef={frontRef} slot={0}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <CoverFront design={paint.cover} layout={layout} photos={photos} adjust={adjust}
                      onEmpty={onEmpty} iconSize={Math.round(pageW * 0.13)} pad={PV_WELL}
                      onSelect={onSelect} selected={selected}
                      bg={slotColor(paint.colors, 0) || t.page} />
        </div>
        <ThemeSticker n={null} />
      </BigLeaf>
    </BookUnit>
  );
}

// ── Navigator thumbnail — node 451:14516 / 14519. 41px, r2, white.
//
// The node rings the selected page with a 2px #008E93 border *outside* the thumb,
// which reflows the whole row by 4px every time the selection moves. An inset
// shadow paints the same ring over the thumb's outer 2px and keeps every item a
// fixed 41 — the reason the status banners and the collection covers already use an
// inset shadow rather than a border.
// ⚠️ press(0.9) must be spread BEFORE onPointerDown and its handler composed into
// ours. Spread after, press's own onPointerDown silently overwrites the drag handler —
// JSX gives the later prop — and the drag simply never starts.
function NavThumb({ photo, active, label, spine, onClick, itemRef,
                   onPointerDown, dragging, dropTarget }) {
  return (
    <button ref={itemRef} type="button" onClick={onClick}
            onDragStart={e => e.preventDefault()}
            {...press(0.9)}
            onPointerDown={e => {
              e.currentTarget.style.transform = 'scale(0.9)';
              if (onPointerDown) onPointerDown(e);
            }}
      aria-label={spine ? 'Cover' : (label ? `Page ${label}` : 'Inside cover')}
      aria-current={active ? 'true' : undefined}
      style={{
        flex: '0 0 auto', border: 'none', padding: 0, background: 'transparent',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        alignItems: 'center', transition: 'transform 140ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}>
      <span aria-hidden style={{ height: NAV_ROW, display: 'flex', alignItems: 'center' }}>
        {spine && (
          <span style={{
            width: 4, height: NAV_THUMB, borderRadius: 1, background: '#FFFFFF',
            opacity: active ? 1 : 0.5,
          }} />
        )}
        <span style={{
          width: NAV_THUMB, height: NAV_THUMB, borderRadius: 2, overflow: 'hidden',
          background: '#FFFFFF',
          // The page being dragged reads as lifted out of the row.
          opacity: dragging ? 0.25 : (active ? 1 : 0.5),
          boxShadow: dropTarget
            ? `inset 0 0 0 2px ${ARR_ACCENT}`
            : (active ? 'inset 0 0 0 2px #008E93' : 'none'),
        }}>
          {photo && (
            <img src={photo} alt="" loading="lazy" draggable={false} style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              WebkitUserDrag: 'none',
            }} />
          )}
        </span>
      </span>
      <span aria-hidden style={{
        fontFamily: TEXT, fontWeight: 500, fontSize: 11, lineHeight: '20px',
        textAlign: 'center', color: active ? '#FFFFFF' : '#777777',
      }}>{label || ' '}</span>
    </button>
  );
}

// node 494:17136 — 38×38, #272727, 1px #363636, r12, 16px plus. Adds a spread on
// the same footing as the book view's pill, so the two views stay in step.
function NavAdd({ onClick }) {
  return (
    <button type="button" onClick={onClick} aria-label="Add spread" {...press(0.9)}
      style={{
        flex: '0 0 auto', marginTop: (NAV_ROW - NAV_ADD) / 2,
        width: NAV_ADD, height: NAV_ADD, borderRadius: 12, padding: 0,
        background: '#272727', border: '1px solid #363636',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'transform 140ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}>
      <img src={`${A}/pb-editor-plus.svg`} alt="" width={16} height={16}
           style={{ display: 'block' }} />
    </button>
  );
}

// ── Navigator row — node 451:14513. Leaves of one spread sit 1px apart and
// consecutive spreads 8px apart, which is what makes the pairing read; the row
// scrolls, since a 24-page book is far wider than any phone.
function PageNavigator({ slots, photoFor, active, onPick, onAdd, itemRefs, bottom,
                        onThumbDown, onMove, onUp, dragIndex, overIndex }) {
  const groups = [];
  slots.forEach((s, i) => {
    const g = groups[groups.length - 1];
    if (g && g.unit === s.unit) g.items.push(i);
    else groups.push({ unit: s.unit, items: [i] });
  });
  return (
    <div
      onPointerMove={onMove}
      onPointerUp={e => onUp && onUp(e, false)}
      onPointerCancel={e => onUp && onUp(e, true)}
      style={{
      position: 'absolute', left: 0, right: 0, bottom, zIndex: 5,
      display: 'flex', alignItems: 'flex-start', gap: 8,
      padding: '0 16px', boxSizing: 'border-box',
      overflowX: 'auto', overflowY: 'hidden',
      // Read by scrollIntoView above: it keeps the active thumbnail this far from
      // the edge instead of flush against it.
      scrollPaddingLeft: 56, scrollPaddingRight: 56,
      scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
    }}>
      {groups.map((g, gi) => (
        <React.Fragment key={g.unit}>
          <div style={{ flex: '0 0 auto', display: 'flex', gap: 1 }}>
            {g.items.map(i => (
              <NavThumb key={i} label={slots[i].label} spine={slots[i].unit === 0}
                        photo={photoFor(slots[i])} active={i === active}
                        onClick={() => onPick(i)}
                        onPointerDown={onThumbDown && onThumbDown(i)}
                        dragging={dragIndex === i} dropTarget={overIndex === i}
                        itemRef={el => { itemRefs.current[i] = el; }} />
            ))}
          </div>
          {/* A pill after every spread but the last — the same rule SpreadBlock
              uses for showPlus, so adding from either view behaves identically. */}
          {g.unit > 0 && gi < groups.length - 1 && <NavAdd onClick={onAdd} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Header — node 451:14591. Back chevron, the undo/redo pill centred, and a third
// slot the node ships at opacity 0 (its Continue button); reproduced as an inert
// spacer so the pill stays centred rather than drifting right.
//
// The node's back button is 36×36 where the book view's close is 40; kept at 40 so
// the control does not resize as you move between the two modes of one screen.
// While the layout drawer is up, node 451:14921 keeps only a blur band across the
// top — its close and confirm buttons live on the drawer, so the header's own
// controls would double up. `controls={false}` renders the scrim alone, and the
// shorter height is the node's own 93 (its 44 status bar + 49), which is what keeps
// the blur off the top of the page preview.
function PageViewHeader({ onBack, controls = true,
                          height = 'calc(env(safe-area-inset-top, 44px) + 103px)' }) {
  const icon = file => (
    <img src={`${A}/${file}`} alt="" width={24} height={24} style={{ display: 'block' }} />
  );
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6,
      height,
      pointerEvents: 'none',
    }}>
      <IOSProgressiveBlur scrim={
        'linear-gradient(to bottom, rgba(20,20,20,0.55) 0.3%,' +
        ' rgba(16,16,16,0.22) 60%, rgba(12,12,12,0) 96%)'
      } />
      {controls && (
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: 'max(68px, calc(env(safe-area-inset-top, 44px) + 24px))',
        padding: '0 16px', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        pointerEvents: 'auto',
      }}>
        <GlassIconButton label="Back to book" tint="rgba(0,0,0,0.25)" gloss onClick={onBack}>
          {icon('pb-src-back.svg')}
        </GlassIconButton>
        <GlassIconButton label="Undo and redo" width={88} tint="rgba(0,0,0,0.25)" gloss>
          <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {icon('pb-editor-undo.svg')}
            {icon('pb-editor-redo.svg')}
          </span>
        </GlassIconButton>
        <div aria-hidden style={{ width: 40, height: 40 }} />
      </div>
      )}
    </div>
  );
}

// ── "Choose layout" drawer — Figma node 451:14921 (a 375×812 WIP frame named
// "test"). Opened by the page view's Layout tool: the drawer takes the bottom half
// of the screen and the page preview stays live above it, so a template can be
// judged on the actual page.
//
// ⚠️ The node carries the same off-canvas scratch 451:14499 does — a second pair of
// 177px photo squares at x=432/610 and a #272727 add-strip at x=379, all past the
// frame edge. None of it is visible in the design and none of it is built.
//
// The node's drawer is 406 of an 812 frame. Kept as `min(406px, 50%)` so it is the
// node's height on a phone and never more than half the screen on a short one; the
// strip above fits the book to whatever band is left (see PageView).
const PV_DRAWER_H = 'calc(min(406px, 50%) + env(safe-area-inset-bottom, 0px))';

// node 451:14966 — a linear wash over a radial one. Figma's radial transform,
// matrix(0 24.75 -63.674 0 188 -22.5) at r=10, decodes to an ellipse centred on
// (188, -22.5) with semi-axes 636.74 × 247.5 → 169.8% × 60.96% at 50.13% / -5.54%
// of the 375×406 drawer.
//
// In the node the top 13% of the linear layer is fully transparent and the radial's
// centre stop only 20% black, so the page preview read through the drawer's top edge.
// ⚠️ Flattened to solid on request, like SHEET_FILL — the edge washed out against the
// page. It stays a gradient only because the drawers apply it as `backgroundImage`.
const DRAWER_FILL = 'linear-gradient(#1C1C1C, #1C1C1C)';

// node 451:14988 (unselected) / 451:14990 (selected). The selected chip is a fixed
// 80×34 in the node; kept auto-width here so a chip does not resize as the
// selection moves along the row. Both states are 34 tall either way (8 + 18 + 8).
function CountChip({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} {...press(0.97)}
      aria-pressed={active}
      style={{
        flex: '0 0 auto', position: 'relative', overflow: 'hidden',
        padding: '8px 12px', border: 'none', cursor: 'pointer',
        borderRadius: active ? 42 : 22,
        background: active ? 'transparent' : 'rgba(0,0,0,0.1)',
        fontFamily: TEXT, fontWeight: active ? 600 : 500,
        fontSize: 13, lineHeight: '18px', letterSpacing: '-0.08px',
        whiteSpace: 'nowrap',
        color: active ? '#FFFFFF' : 'var(--colour-foreground-fg-grey, #CCCCCC)',
        transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      }}>
      {active && CONTINUE_ACCENT}
      <span style={{ position: 'relative' }}>{label}</span>
    </button>
  );
}

// node 451:14976 — a 114-wide white card inside a 122×109 selection ring. The ring
// is a real border here rather than an inset shadow (unlike the navigator's): the
// row is a scroller with a 12px gap, so a 4px reflow on selection would be
// invisible, and a border is what draws the ring *outside* the card as the node has
// it. The 2/2.79 padding is the node's 4/4.79 offset less the border.
//
// The card's proportions follow the chosen page (`pageAspect`), so the thumbnail is
// a true miniature — the node's own 114×99.418 is a square-leaved book, which its
// sibling 451:14499 contradicts anyway.
const LAYOUT_CARD_W = 114;
// What the ring adds around a card: the node's 4/4.79 offset on both sides, of which
// 2px is the border itself.
const LAYOUT_RING_H = 9.58;

function LayoutCard({ layout, photos, pageAspect, width, selected, onClick, index }) {
  const t = useTheme();
  return (
    <button type="button" onClick={onClick} {...press(0.97)}
      aria-pressed={selected} aria-label={`Layout option ${index + 1}`}
      style={{
        flex: '0 0 auto', padding: '2.79px 2px', boxSizing: 'border-box',
        border: `2px solid ${selected ? '#CCA34C' : 'transparent'}`,
        borderRadius: 6, background: 'transparent', cursor: 'pointer',
        transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      }}>
      <span style={{
        display: 'block', position: 'relative',
        width, aspectRatio: String(pageAspect),
        background: t.page, borderRadius: 4,
      }}>
        {/* The same PV_WELL insets the page uses, so the card is the page in little. */}
        <LayoutWell layout={layout} photos={photos} iconSize={14} style={{
          left: PV_WELL.left, right: PV_WELL.right,
          top: PV_WELL.top, bottom: PV_WELL.bottom,
        }} />
      </span>
    </button>
  );
}

// The drawer. No scrim: the node has none, and the point of the half-height sheet is
// that the preview above stays visible and interactive. It is therefore dismissed by
// its own close button rather than by a tap outside.
function LayoutDrawer({ closing, count, selected, options, photos, pageAspect,
                        onCount, onPick, onClose, onConfirm }) {
  const { useState, useRef, useLayoutEffect } = React;
  const root = useRef(null);
  const [h, setH] = useState(0);

  // The card row is anchored 164 from the drawer's top, and a portrait card at the
  // node's 114 wide is 152 tall — which fits the node's 406 drawer with room to
  // spare but not the `50%` a short phone resolves to. So the card is measured down
  // to whatever height is left rather than allowed to overhang the drawer.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const measure = () => setH(el.clientHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const room = h ? h - 164 - 16 - LAYOUT_RING_H : 0;
  const cardW = room > 0
    ? Math.max(48, Math.min(LAYOUT_CARD_W, room * pageAspect))
    : LAYOUT_CARD_W;

  const icon = file => (
    <img src={`${A}/${file}`} alt="" width={24} height={24} style={{ display: 'block' }} />
  );
  return (
    <div ref={root} role="dialog" aria-labelledby="pb-layout-title" style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
      height: PV_DRAWER_H, boxSizing: 'border-box', overflow: 'hidden',
      borderRadius: '24px 24px 0 0', boxShadow: SHEET_RIM, backgroundImage: DRAWER_FILL,
      animation: closing
        ? 'pbSheetOut 320ms cubic-bezier(0.4,0,0.2,1) both'
        : 'pbSheetIn 380ms cubic-bezier(0.34,1.05,0.64,1) both',
    }}>
      {/* node 451:14967/14968 — a 40-tall row 16 from the drawer's top edge */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 16, height: 40,
        padding: '0 16px', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <GlassIconButton label="Close layouts" tint="rgba(0,0,0,0.25)" gloss
                         onClick={onClose}>
          {icon('pb-editor-close.svg')}
        </GlassIconButton>
        {/* node 451:14974 — centred on the frame, not between the buttons, so it is
            absolute over the row. pointerEvents:none keeps it off both buttons. */}
        <p id="pb-layout-title" style={{
          position: 'absolute', left: 0, right: 0, top: 12, margin: 0,
          textAlign: 'center', pointerEvents: 'none',
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, lineHeight: '20px',
          color: '#FFFFFF',
        }}>Choose layout</p>
        <GlassIconButton label="Apply layout" tint="transparent"
                         accent={CONTINUE_ACCENT} gloss onClick={onConfirm}>
          {icon('pb-editor-check.svg')}
        </GlassIconButton>
      </div>

      {/* node 451:14986 — the five chips scroll: they measure ~430 against a 375
          frame, which is what clips the last one in the node's own render. */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 81,
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px', boxSizing: 'border-box',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {LAYOUT_COUNTS.map(c => (
          <CountChip key={c} label={countLabel(c)} active={c === count}
                     onClick={() => onCount(c)} />
        ))}
      </div>

      {/* node 451:14975 — rings at x 24 / 158 / 292, i.e. 24px gutters and a 12px
          gap. Three 122-wide rings overflow 375, so this row scrolls too. */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 164,
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '0 24px', boxSizing: 'border-box',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {options.map((layout, i) => (
          <LayoutCard key={i} index={i} layout={layout} photos={photos}
                      pageAspect={pageAspect} width={cardW}
                      selected={layoutBase(selected) === `${count}-${i}`}
                      onClick={() => onPick(i)} />
        ))}
      </div>
    </div>
  );
}

// ── Spacing sheet. Same dark sheet as the layout drawer, shorter: a title, one slider
// and a Save button. The page above previews the value live; "Apply to all pages"
// previews it on every page too and writes it as the book-wide default on Save.
const PV_SPACING_H = 'calc(292px + env(safe-area-inset-bottom, 0px))';
function SpacingDrawer({ closing, value, all, onChange, onAll, onClose, onSave }) {
  return (
    <div role="dialog" aria-labelledby="pb-spacing-title" style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
      height: PV_SPACING_H, boxSizing: 'border-box', overflow: 'hidden',
      borderRadius: '24px 24px 0 0', boxShadow: SHEET_RIM, backgroundImage: DRAWER_FILL,
      animation: closing
        ? 'pbSheetOut 320ms cubic-bezier(0.4,0,0.2,1) both'
        : 'pbSheetIn 380ms cubic-bezier(0.34,1.05,0.64,1) both',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 16, height: 40,
        padding: '0 16px', boxSizing: 'border-box',
        display: 'flex', alignItems: 'center',
      }}>
        <GlassIconButton label="Close spacing" tint="rgba(0,0,0,0.25)" gloss onClick={onClose}>
          <img src={`${A}/pb-editor-close.svg`} alt="" width={24} height={24}
               style={{ display: 'block' }} />
        </GlassIconButton>
        <p id="pb-spacing-title" style={{
          position: 'absolute', left: 0, right: 0, top: 12, margin: 0,
          textAlign: 'center', pointerEvents: 'none',
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, lineHeight: '20px',
          color: '#FFFFFF',
        }}>Spacing</p>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 84, padding: '0 24px' }}>
        <input type="range" className="pb-range" min={0} max={100} step={1}
               aria-label="Spacing" value={Math.round(value * 100)}
               onChange={e => onChange(Number(e.target.value) / 100)}
               style={{ '--v': `${value * 100}%` }} />
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 8,
          fontFamily: TEXT, fontSize: 12, lineHeight: '16px', color: '#999',
        }}><span>None</span><span>Wide</span></div>
        <label style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 18, fontFamily: TEXT, fontSize: 16, lineHeight: '24px', color: '#FFFFFF',
        }}>
          Apply to all pages
          <button type="button" role="switch" aria-checked={all} onClick={() => onAll(!all)}
                  style={{
                    width: 51, height: 31, borderRadius: 16, border: 0, padding: 2,
                    background: all ? '#00A8AE' : 'rgba(255,255,255,0.16)',
                    transition: 'background 160ms ease', cursor: 'pointer',
                    WebkitTapHighlightColor: 'transparent',
                  }}>
            <span style={{
              display: 'block', width: 27, height: 27, borderRadius: 14, background: '#FFF',
              transform: `translateX(${all ? 20 : 0}px)`, transition: 'transform 160ms ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }} />
          </button>
        </label>
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0,
        bottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
        padding: '0 19px', boxSizing: 'border-box',
      }}>
        <button type="button" onClick={onSave} {...press(0.97)} style={{
          width: '100%', height: 52, borderRadius: 55, border: '1px solid #00B3B9',
          background: '#007377', color: '#FFFFFF', cursor: 'pointer',
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, lineHeight: '20px',
          transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
        }}>Save</button>
      </div>
    </div>
  );
}

// ── Themes drawer — the book view's Themes tool. The same dark half-sheet as the
// layout drawer: close / title / confirm, a chip row (here, the style categories) and
// a scrolling card row. Each card is a miniature open spread of one theme — title page
// on the left, a framed photo on the right — drawn by the real leaf parts under that
// theme's own BookTheme provider. A tap previews the theme on the whole book above;
// ✓ keeps it, ✕ puts the previous one back.
const THEME_DRAWER_H = 'calc(min(340px, 60%) + env(safe-area-inset-bottom, 0px))';
const THEME_LEAF_W = 76;

function DrawerHead({ title, titleId, closeLabel, onClose, confirmLabel, onConfirm }) {
  const icon = file => (
    <img src={`${A}/${file}`} alt="" width={24} height={24} style={{ display: 'block' }} />
  );
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 16, height: 40,
      padding: '0 16px', boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <GlassIconButton label={closeLabel} tint="rgba(0,0,0,0.25)" gloss onClick={onClose}>
        {icon('pb-editor-close.svg')}
      </GlassIconButton>
      <p id={titleId} style={{
        position: 'absolute', left: 0, right: 0, top: 12, margin: 0,
        textAlign: 'center', pointerEvents: 'none',
        fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, lineHeight: '20px',
        color: '#FFFFFF',
      }}>{title}</p>
      {onConfirm ? (
        <GlassIconButton label={confirmLabel} tint="transparent"
                         accent={CONTINUE_ACCENT} gloss onClick={onConfirm}>
          {icon('pb-editor-check.svg')}
        </GlassIconButton>
      ) : <span aria-hidden style={{ width: 40, height: 40 }} />}
    </div>
  );
}

function ThemeCard({ theme, selected, onClick, pageAspect, photo }) {
  const h = THEME_LEAF_W / pageAspect;
  const fam = THEME_LAYOUTS[theme.family] || THEME_LAYOUTS.classic;
  return (
    <button type="button" onClick={onClick} {...press(0.97)}
      aria-pressed={selected} aria-label={`${theme.name} theme`}
      style={{
        flex: '0 0 auto', padding: 0, border: 'none', background: 'transparent',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
        transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      }}>
      <span style={{
        display: 'block', padding: 3, borderRadius: 8,
        border: `2px solid ${selected ? '#CCA34C' : 'transparent'}`,
      }}>
        <BookTheme.Provider value={theme}>
          <span style={{
            display: 'flex', width: THEME_LEAF_W * 2, height: h, padding: 2,
            boxSizing: 'content-box', background: '#F8F8F8', borderRadius: 2,
            boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}>
            <span style={{
              position: 'relative', flex: 1, background: theme.alt, overflow: 'hidden',
              containerType: 'size',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* The card is small enough that the title wraps rather than ellipsing. */}
              <span style={Object.assign(titleStyle(theme), {
                maxWidth: '84%', fontSize: `${13 * theme.size}cqi`, lineHeight: 1.15,
                whiteSpace: 'normal', textAlign: 'center',
              })}>{theme.title}</span>
              <ThemeSticker n={null} />
            </span>
            <span style={{ position: 'relative', flex: 1, background: theme.page, containerType: 'size' }}>
              <LayoutWell layout={layoutById(fam[1][0])} photos={[photo]} iconSize={14}
                          style={{ left: '8%', right: '8%', top: '8%', bottom: '8%' }} />
            </span>
          </span>
        </BookTheme.Provider>
      </span>
      <span style={{
        marginTop: 8, fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
        color: '#FFFFFF', whiteSpace: 'nowrap',
      }}>{theme.name}</span>
      <span style={{
        fontFamily: TEXT, fontSize: 11, lineHeight: '14px', color: '#888888',
        whiteSpace: 'nowrap',
      }}>{theme.meta}</span>
    </button>
  );
}

function ThemesDrawer({ closing, cat, onCat, selected, onPick, onClose, onConfirm,
                        pageAspect, photo }) {
  const category = THEME_CATEGORIES.find(c => c.id === cat) || THEME_CATEGORIES[0];
  return (
    <div role="dialog" aria-labelledby="pb-themes-title" style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
      height: THEME_DRAWER_H, boxSizing: 'border-box', overflow: 'hidden',
      borderRadius: '24px 24px 0 0', boxShadow: SHEET_RIM, backgroundImage: DRAWER_FILL,
      display: 'flex', flexDirection: 'column', paddingTop: 76,
      animation: closing
        ? 'pbSheetOut 320ms cubic-bezier(0.4,0,0.2,1) both'
        : 'pbSheetIn 380ms cubic-bezier(0.34,1.05,0.64,1) both',
    }}>
      <DrawerHead title="Themes" titleId="pb-themes-title" closeLabel="Close themes"
                  onClose={onClose} confirmLabel="Apply theme" onConfirm={onConfirm} />
      <div style={{
        flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px', overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {THEME_CATEGORIES.map(c => (
          <CountChip key={c.id} label={c.label} active={c.id === category.id}
                     onClick={() => onCat(c.id)} />
        ))}
      </div>
      <div style={{
        flex: '0 0 auto', marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '0 19px 8px', overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {/* "Default" leads every row, so going back to no theme never means hunting
            for the right category. It is the null draft. */}
        <ThemeCard theme={CLASSIC} selected={!selected}
                   pageAspect={pageAspect} photo={photo} onClick={() => onPick(null)} />
        {category.themes.map(t => (
          <ThemeCard key={t.id} theme={t} selected={t.id === selected}
                     pageAspect={pageAspect} photo={photo} onClick={() => onPick(t.id)} />
        ))}
      </div>
      <p style={{
        margin: 'auto 24px 0', paddingBottom: 'max(20px, calc(env(safe-area-inset-bottom, 0px) + 4px))',
        textAlign: 'center', fontFamily: TEXT, fontSize: 12, lineHeight: '17px', color: '#888888',
      }}>Changes the look and layouts of every page. Your photos stay on their pages.</p>
    </div>
  );
}

// ── Covers drawer — the page view's Covers tool, which takes the Layout tool's place
// while the cover is the page in view. One row of front-cover miniatures, each the
// real CoverFront under the current theme and colour with the cover's own photo, so
// with no theme they are plain photo-and-text suggestions and under a theme they
// read as that theme's covers. Tap previews on the strip; ✓ keeps it, ✕ reverts.
const PV_COVERS_H = 'calc(min(312px, 50%) + env(safe-area-inset-bottom, 0px))';
const COVER_CARD_W = 92;

function CoverCard({ design, selected, onClick, pageAspect, photos, layout }) {
  const t = useTheme();
  const paint = React.useContext(BookPaint);
  const bg = slotColor(paint.colors, 0) || t.page;
  return (
    <button type="button" onClick={onClick} {...press(0.97)}
      aria-pressed={selected} aria-label={`${design.name} cover`}
      style={{
        flex: '0 0 auto', padding: 0, border: 'none', background: 'transparent',
        cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
        transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      }}>
      <span style={{
        display: 'block', padding: 3, borderRadius: 8,
        border: `2px solid ${selected ? '#CCA34C' : 'transparent'}`,
      }}>
        <span style={{
          display: 'block', position: 'relative', overflow: 'hidden', containerType: 'size',
          width: COVER_CARD_W, aspectRatio: String(pageAspect), background: bg,
          borderRadius: 2, boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
        }}>
          <CoverFront design={design.id} photos={photos} layout={layout} iconSize={14}
                      bg={bg} pad={{ left: '6%', right: '6%', top: '6%', bottom: '6%' }} />
        </span>
      </span>
      <span style={{
        marginTop: 8, fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
        color: '#FFFFFF', whiteSpace: 'nowrap',
      }}>{design.name}</span>
      <span style={{
        fontFamily: TEXT, fontSize: 11, lineHeight: '14px', color: '#888888', whiteSpace: 'nowrap',
      }}>{design.meta}</span>
    </button>
  );
}

function CoversDrawer({ closing, selected, onPick, onClose, onConfirm, pageAspect, photos, layout }) {
  const t = useTheme();
  return (
    <div role="dialog" aria-labelledby="pb-covers-title" style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
      height: PV_COVERS_H, boxSizing: 'border-box', overflow: 'hidden',
      borderRadius: '24px 24px 0 0', boxShadow: SHEET_RIM, backgroundImage: DRAWER_FILL,
      display: 'flex', flexDirection: 'column', paddingTop: 76,
      animation: closing
        ? 'pbSheetOut 320ms cubic-bezier(0.4,0,0.2,1) both'
        : 'pbSheetIn 380ms cubic-bezier(0.34,1.05,0.64,1) both',
    }}>
      <DrawerHead title="Covers" titleId="pb-covers-title" closeLabel="Close covers"
                  onClose={onClose} confirmLabel="Apply cover" onConfirm={onConfirm} />
      <div style={{
        flex: '0 0 auto', display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '0 19px 8px', overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {COVER_DESIGNS.map(d => (
          <CoverCard key={d.id} design={d} selected={d.id === selected}
                     pageAspect={pageAspect} photos={photos} layout={layout}
                     onClick={() => onPick(d.id)} />
        ))}
      </div>
      <p style={{
        margin: 'auto 24px 0', paddingBottom: 'max(20px, calc(env(safe-area-inset-bottom, 0px) + 4px))',
        textAlign: 'center', fontFamily: TEXT, fontSize: 12, lineHeight: '17px', color: '#888888',
      }}>{t === CLASSIC
        ? 'Suggestions use your cover photo and title.'
        : `Suggestions in the ${t.name} theme, with your cover photo.`}</p>
    </div>
  );
}

// ── Color drawer — the page view's Color tool, on the cover and on every page. A
// swatch row ("Theme" first, which puts the page back to its theme's paper), an
// "Apply to all pages" switch and Save; the page above previews live, like Spacing.
const PV_COLOR_H = 'calc(260px + env(safe-area-inset-bottom, 0px))';

function ColorDrawer({ closing, value, all, cover, onChange, onAll, onClose, onSave }) {
  return (
    <div role="dialog" aria-labelledby="pb-color-title" style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
      height: PV_COLOR_H, boxSizing: 'border-box', overflow: 'hidden',
      borderRadius: '24px 24px 0 0', boxShadow: SHEET_RIM, backgroundImage: DRAWER_FILL,
      display: 'flex', flexDirection: 'column', paddingTop: 76,
      animation: closing
        ? 'pbSheetOut 320ms cubic-bezier(0.4,0,0.2,1) both'
        : 'pbSheetIn 380ms cubic-bezier(0.34,1.05,0.64,1) both',
    }}>
      <DrawerHead title={cover ? 'Cover color' : 'Page color'} titleId="pb-color-title"
                  closeLabel="Close color" onClose={onClose} />
      <div role="radiogroup" aria-label="Color" style={{
        flex: '0 0 auto', display: 'flex', gap: 12, padding: '4px 20px 6px',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {PAGE_COLORS.map(c => {
          const on = (value || null) === c;
          return (
            <button key={c || 'theme'} type="button" role="radio" aria-checked={on}
                    aria-label={c ? `Color ${c}` : 'Theme color'}
                    onClick={() => onChange(c)} {...press(0.9)} style={{
              flex: '0 0 auto', width: 44, height: 44, borderRadius: 22, padding: 0,
              cursor: 'pointer', border: 'none',
              background: c || 'conic-gradient(#F6F1E7 0 25%, #E3EADF 0 50%, #DDEBF2 0 75%, #F9E1E0 0)',
              boxShadow: on
                ? '0 0 0 2px #1C1C1C, 0 0 0 4px #FFFFFF'
                : 'inset 0 0 0 1px rgba(255,255,255,0.18)',
              transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
            }} />
          );
        })}
      </div>
      <label style={{
        flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        margin: '14px 24px 0', fontFamily: TEXT, fontSize: 16, lineHeight: '24px', color: '#FFFFFF',
      }}>
        {cover ? 'Also apply to all pages' : 'Apply to all pages'}
        <button type="button" role="switch" aria-checked={all} onClick={() => onAll(!all)}
                style={{
                  width: 51, height: 31, borderRadius: 16, border: 0, padding: 2,
                  background: all ? '#00A8AE' : 'rgba(255,255,255,0.16)',
                  transition: 'background 160ms ease', cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}>
          <span style={{
            display: 'block', width: 27, height: 27, borderRadius: 14, background: '#FFF',
            transform: `translateX(${all ? 20 : 0}px)`, transition: 'transform 160ms ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }} />
        </button>
      </label>
      <div style={{
        marginTop: 'auto', padding: '0 19px',
        paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
      }}>
        <button type="button" onClick={onSave} {...press(0.97)} style={{
          width: '100%', height: 52, borderRadius: 55, border: '1px solid #00B3B9',
          background: '#007377', color: '#FFFFFF', cursor: 'pointer',
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, lineHeight: '20px',
          transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
        }}>Save</button>
      </div>
    </div>
  );
}

// Colours with a Color-drawer draft folded in. `all` from a page sets the '*' paper
// and clears the per-page ones (the cover keeps its own); from the cover it sets the
// cover too. A null colour removes the override, falling back to '*' / the theme.
function withColor(colors, slot, c, all) {
  const next = all ? { 0: (colors || {})[0] } : Object.assign({}, colors);
  if (all) { next['*'] = c; if (slot === 0) next[0] = c; }
  else next[slot] = c;
  Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
  return next;
}

// ── Style drawer — the book view's Style tool. Three segmented controls and an
// Apply button, laid out top to bottom so nothing can overlap on a short phone (the
// settings scroll instead). Every change previews on the whole book above; nothing is
// written until Apply.
const STYLE_DRAWER_H = 'calc(min(420px, 72%) + env(safe-area-inset-bottom, 0px))';

function Segmented({ label, options, value, onChange }) {
  return (
    <div role="radiogroup" aria-label={label} style={{
      display: 'flex', gap: 2, padding: 3, borderRadius: 14,
      background: 'rgba(255,255,255,0.07)',
    }}>
      {options.map(o => {
        const on = o.id === value;
        return (
          <button key={o.id} type="button" role="radio" aria-checked={on}
                  onClick={() => onChange(o.id)} {...press(0.97)} style={{
            flex: '1 1 0', minWidth: 0, minHeight: 44, padding: '4px', border: 'none',
            borderRadius: 11, cursor: 'pointer',
            background: on ? '#FFFFFF' : 'transparent',
            color: on ? '#222222' : '#CCCCCC',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            fontFamily: TEXT, fontWeight: on ? 600 : 500, fontSize: 13, lineHeight: '16px',
            transition: 'transform 140ms ease, background 160ms ease',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <span>{o.label}</span>
            {o.sub && (
              <span style={{ fontSize: 10.5, lineHeight: '13px', fontWeight: 400,
                             color: on ? '#666666' : '#888888' }}>{o.sub}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StyleDrawer({ closing, value, onChange, summary, onClose, onApply }) {
  const head = (text, extra) => (
    // Wraps, so on a narrow phone the summary drops under the label instead of
    // squeezing both into two ragged lines.
    <div style={{
      display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
      alignItems: 'baseline', columnGap: 8, margin: '0 0 8px', whiteSpace: 'nowrap', fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
      color: '#999999',
    }}>
      <span>{text}</span>
      {extra && <span style={{ fontWeight: 500, color: '#7FD6D9', textAlign: 'right' }}>{extra}</span>}
    </div>
  );
  const set = k => v => onChange(Object.assign({}, value, { [k]: v }));
  return (
    <div role="dialog" aria-labelledby="pb-style-title" style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
      height: STYLE_DRAWER_H, boxSizing: 'border-box', overflow: 'hidden',
      borderRadius: '24px 24px 0 0', boxShadow: SHEET_RIM, backgroundImage: DRAWER_FILL,
      display: 'flex', flexDirection: 'column', paddingTop: 68,
      animation: closing
        ? 'pbSheetOut 320ms cubic-bezier(0.4,0,0.2,1) both'
        : 'pbSheetIn 380ms cubic-bezier(0.34,1.05,0.64,1) both',
    }}>
      <DrawerHead title="Style" titleId="pb-style-title" closeLabel="Close style"
                  onClose={onClose} />
      <div style={{
        flex: '1 1 auto', minHeight: 0, overflowY: 'auto', padding: '0 16px',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <div>
          {head('Photos per page', summary)}
          <Segmented label="Photos per page" options={STYLE_PER}
                     value={value.per} onChange={set('per')} />
        </div>
        <div>
          {head('Photo order')}
          <Segmented label="Photo order" options={STYLE_ORDER}
                     value={value.order} onChange={set('order')} />
        </div>
        <div>
          {head('Layout style')}
          <Segmented label="Layout style" options={STYLE_LOOK}
                     value={value.look} onChange={set('look')} />
        </div>
        <p style={{
          margin: 0, textAlign: 'center', fontFamily: TEXT, fontSize: 12, lineHeight: '17px',
          color: '#888888',
        }}>Applies to every page. You can still change any page’s layout afterwards.</p>
      </div>
      <div style={{
        flex: '0 0 auto', padding: '12px 19px',
        paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
      }}>
        <button type="button" onClick={onApply} {...press(0.97)} style={{
          width: '100%', height: 52, borderRadius: 55, border: '1px solid #00B3B9',
          background: '#007377', color: '#FFFFFF', cursor: 'pointer',
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 16, lineHeight: '20px',
          transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
        }}>Apply to whole book</button>
      </div>
    </div>
  );
}

// ── Photo tray — tapping an empty placeholder on a page offers the uploaded photos.
// `title` / `subtitle`: opened from the book view's Photos tool the tray is a browser of
// the whole upload rather than a picker for one placeholder, so it says so.
function PhotoTray({ closing, photos, used = {}, onPick, onClose, onUpload,
                     title = 'Add a photo', subtitle }) {
  return (
    <div role="dialog" aria-label={title} style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 20,
      height: 'calc(min(440px, 62%) + env(safe-area-inset-bottom, 0px))',
      boxSizing: 'border-box', overflow: 'hidden',
      borderRadius: '24px 24px 0 0', boxShadow: SHEET_RIM, backgroundImage: DRAWER_FILL, backgroundColor: '#1A1A1A',
      animation: closing
        ? 'pbSheetOut 320ms cubic-bezier(0.4,0,0.2,1) both'
        : 'pbSheetIn 380ms cubic-bezier(0.34,1.05,0.64,1) both',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 16, height: 40,
        padding: '0 16px', boxSizing: 'border-box', display: 'flex', alignItems: 'center',
      }}>
        <GlassIconButton label="Close" tint="rgba(0,0,0,0.25)" gloss onClick={onClose}>
          <img src={`${A}/pb-editor-close.svg`} alt="" width={24} height={24}
               style={{ display: 'block' }} />
        </GlassIconButton>
        <p style={{
          position: 'absolute', left: 0, right: 0, top: 12, margin: 0,
          textAlign: 'center', pointerEvents: 'none',
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 14, lineHeight: '20px',
          color: '#FFFFFF',
        }}>{title}</p>
        {subtitle && (
          <p style={{
            position: 'absolute', left: 0, right: 0, top: 32, margin: 0,
            textAlign: 'center', pointerEvents: 'none',
            fontFamily: TEXT, fontSize: 12, lineHeight: '16px', color: '#999',
          }}>{subtitle}</p>
        )}
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: subtitle ? 80 : 72, bottom: 0,
        overflowY: 'auto', padding: '0 16px 24px', boxSizing: 'border-box',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        <button type="button" onClick={onUpload} {...press(0.97)} style={{
          width: '100%', height: 48, marginBottom: 12, borderRadius: 55,
          border: '1px solid #FFF', background: '#F0F0F0', color: '#222', cursor: 'pointer',
          fontFamily: DISPLAY, fontWeight: 700, fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
        }}>
          <img src={`${A}/pb-editor-tool-addphoto.svg`} alt="" width={20} height={20}
               style={{ display: 'block', filter: 'invert(1)' }} />
          Upload photos
        </button>
        {photos.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {photos.map((ph, k) => (
              <button key={k} type="button" onClick={() => onPick(ph)} {...press(0.97)}
                      aria-label={`Photo ${k + 1}`} style={{
                        position: 'relative', padding: 0, border: 0, aspectRatio: '1', borderRadius: 4,
                        overflow: 'hidden', background: '#333', cursor: 'pointer',
                        transition: 'transform 140ms ease',
                        WebkitTapHighlightColor: 'transparent',
                      }}>
                <img src={ph} alt="" draggable={false} style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  opacity: used[ph] ? 0.55 : 1,
                }} />
                {used[ph] && (
                  // Already on a page of the book. Still pickable — a photo can repeat.
                  <span aria-label={`Used ${used[ph]} time${used[ph] > 1 ? 's' : ''}`} style={{
                    position: 'absolute', right: 6, bottom: 6, minWidth: 20, height: 20,
                    padding: '0 5px', boxSizing: 'border-box', borderRadius: 10,
                    background: '#00A8AE', boxShadow: '0 0 0 1.5px #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: TEXT, fontWeight: 700, fontSize: 11, lineHeight: '20px', color: '#fff',
                  }}>{used[ph] > 1 ? used[ph] : '✓'}</span>
                )}
              </button>
            ))}
          </div>
        ) : (
          <p style={{ margin: '24px 0 0', textAlign: 'center', fontFamily: TEXT,
                      fontSize: 15, color: '#CCC' }}>
            You haven't uploaded any photos yet.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Page view — node 451:14499.
//
// Vertical layout is the node's, and it lands on the node's own numbers: the header
// is 147 tall, the navigator's 65px row sits 170 from the bottom (31 above the
// toolbar's 139), and the strip fills what is left. Centring the book in that band
// puts its top edge at 231.3 against the node's 231.
function PageView({ aspect, pageAspect, pages, placed, uploaded, startSlot,
                   layouts, onSetLayout, spacings, onSetSpacing, cover, onEmptyTap, onSwapPages, onBack, onAdd,
                   colors, onSetColor, coverDesignId, onSetCoverDesign }) {
  const { useState, useRef, useEffect, useLayoutEffect, useMemo } = React;
  const slots = useMemo(() => slotsFor(pages), [pages]);
  const [active, setActive] = useState(() => Math.min(startSlot, slots.length - 1));
  // Both dimensions: the strip's band loses its bottom half to the layout drawer, and
  // the book has to fit what is left rather than run underneath it.
  const [box, setBox] = useState({ w: 0, h: 0 });
  const scroller = useRef(null);
  const leafRefs = useRef([]);
  const navRefs = useRef([]);
  const raf = useRef(0);
  const rootRef = useRef(null);

  // ── Dragging a page in the navigator. Not in the node, which only taps a thumbnail
  // to jump to it — but a page strip you cannot reorder is the obvious thing to reach
  // for, so the same press-and-hold gesture arrange mode uses is wired up here and
  // dropping one page on another swaps them. A plain tap still jumps, via the
  // thumbnail's own onClick.
  const [navDrag, setNavDrag] = useState(null);
  const navPending = useRef(null);
  const navTouchBlock = useRef(null);
  const suppressClick = useRef(false);

  const releaseNavTouch = () => {
    if (!navTouchBlock.current) return;
    window.removeEventListener('touchmove', navTouchBlock.current, { passive: false });
    navTouchBlock.current = null;
  };
  useEffect(() => releaseNavTouch, []);

  const navHit = (x, y) => {
    let hit = null;
    navRefs.current.forEach((el, i) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) hit = i;
    });
    return hit;
  };

  const onThumbDown = i => e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    // The cover is not a page and cannot be reordered.
    if (!slots[i] || !slots[i].n) return;
    const el = e.currentTarget;
    const p = { i, el, pointerId: e.pointerId, sx: e.clientX, sy: e.clientY,
                lifted: false, timer: 0 };
    navPending.current = p;
    p.timer = setTimeout(() => {
      if (navPending.current !== p) return;
      p.lifted = true;
      try { el.setPointerCapture(p.pointerId); } catch (err) { /* not fatal */ }
      // Same reason as arrange: on touch only a non-passive touchmove preventDefault
      // stops the row scrolling out from under the drag.
      if (!navTouchBlock.current) {
        const h = ev => ev.preventDefault();
        window.addEventListener('touchmove', h, { passive: false });
        navTouchBlock.current = h;
      }
      const r = el.getBoundingClientRect();
      const rr = rootRef.current
        ? rootRef.current.getBoundingClientRect() : { left: 0, top: 0 };
      setNavDrag({ i, w: r.width, h: r.height,
                   grabX: p.sx - r.left, grabY: p.sy - r.top,
                   rootX: rr.left, rootY: rr.top, x: p.sx, y: p.sy, over: null });
    }, HOLD_MS);
  };

  const onNavMove = e => {
    const p = navPending.current;
    if (!p) return;
    if (!p.lifted) {
      if (Math.abs(e.clientX - p.sx) > MOVE_TOL || Math.abs(e.clientY - p.sy) > MOVE_TOL) {
        clearTimeout(p.timer);
        navPending.current = null;
      }
      return;
    }
    e.preventDefault();
    const over = navHit(e.clientX, e.clientY);
    setNavDrag(d => (d ? Object.assign({}, d, { x: e.clientX, y: e.clientY, over }) : d));
  };

  const onNavUp = (e, cancelled) => {
    const p = navPending.current;
    if (!p) return;
    clearTimeout(p.timer);
    navPending.current = null;
    releaseNavTouch();
    if (!p.lifted) return;               // a tap — the thumbnail's onClick handles it
    // A drag still ends in a click on the source thumbnail; without this the preview
    // would jump to the page you just dragged away.
    suppressClick.current = true;
    setTimeout(() => { suppressClick.current = false; }, 0);
    const over = cancelled ? null : navHit(e.clientX, e.clientY);
    setNavDrag(null);
    if (over == null || over === p.i) return;
    const a = slots[p.i], b = slots[over];
    if (a && b && a.n && b.n && onSwapPages) onSwapPages(a.n, b.n);
  };

  // ── Selected photo — node 451:14611. `{slot, i}`: which page in the strip, and
  // which slot of that page's layout. It lives here rather than in the leaf because
  // the toolbar is a sibling and has to swap with it.
  const [selected, setSelected] = useState(null);

  // ── The layout drawer. 'open' → 'closing' → null, matching the action sheets.
  // The draft is previewed live on the page the drawer was opened over, and only
  // written back to the book on confirm; the close button puts the stored layout
  // back before the drawer slides away.
  const [drawer, setDrawer] = useState(null);
  const [target, setTarget] = useState(0);
  const [count, setCount] = useState(2);
  const [draft, setDraft] = useState(null);
  // Bumped on every preset applied: restarts the one-shot flash of the seam knobs.
  const [flash, setFlash] = useState(0);
  // Which sheet the drawer slot holds, and the spacing sheet's own draft.
  const [kind, setKind] = useState('layout');
  const [spDraft, setSpDraft] = useState(SP_DEFAULT);
  const [spAll, setSpAll] = useState(false);
  // The Covers and Color drawers' drafts. Both preview through BookPaint below and
  // only while the drawer is open, so a cancel reverts before it slides away.
  const [coverDraft, setCoverDraft] = useState('classic');
  const [colorDraft, setColorDraft] = useState(null);
  const [colorAll, setColorAll] = useState(false);
  const adjustFor = i => drawer === 'open' && kind === 'layout' && i === target
    ? { flash, onChange: slots => setDraft(d => encodeLayout(d, slots)) } : undefined;

  const openDrawer = () => {
    // The drawer covers the toolbar the selection would be driven from, and changing
    // the template can change how many slots a page has — so a selection cannot
    // survive it.
    setSelected(null);
    const cur = layouts[active] || null;
    // Open on the tab matching the page: its layout's photo count, or — with no layout
    // yet — how many photos the page actually holds (at least 1, at most the 5+ chip).
    const n = slots[active].n;
    const entry = n ? placed[n - 1] : cover;
    const held = Array.isArray(entry) ? entry.filter(Boolean).length : entry ? 1 : 0;
    const c = cur ? Number(layoutBase(cur).split('-')[0])
                  : Math.max(1, Math.min(5, held));
    setTarget(active);
    setCount(c);
    setDraft(cur || `${c}-0`);
    setFlash(f => f + 1);
    setKind('layout');
    setDrawer('open');
  };
  const openSpacing = () => {
    setSelected(null);
    setTarget(active);
    setSpDraft(spacingFor(spacings, active));
    setSpAll(false);
    setKind('spacing');
    setDrawer('open');
  };
  const dismissDrawer = () => {
    setDrawer('closing');
    setTimeout(() => setDrawer(null), 320);
  };
  const openCovers = () => {
    setSelected(null);
    setTarget(0);
    setCoverDraft(coverDesignId);
    setKind('covers');
    setDrawer('open');
  };
  const openColor = () => {
    setSelected(null);
    setTarget(active);
    setColorDraft(active === 0 ? (colors || {})[0] || null : (colors || {})[active] || null);
    setColorAll(false);
    setKind('color');
    setDrawer('open');
  };
  const paint = {
    colors: drawer === 'open' && kind === 'color'
      ? withColor(colors, target, colorDraft, colorAll) : (colors || {}),
    cover: drawer === 'open' && kind === 'covers' ? coverDraft : coverDesignId,
  };
  const saveSpacing = () => {
    onSetSpacing(target, spDraft, spAll);
    setDrawer('closing');
    setTimeout(() => setDrawer(null), 320);
  };
  const closeDrawer = () => {
    setDraft(layouts[target] || null);
    setDrawer('closing');
    setTimeout(() => setDrawer(null), 320);
  };
  const confirmDrawer = () => {
    onSetLayout(target, draft);
    setDrawer('closing');
    setTimeout(() => setDrawer(null), 320);
  };
  const layoutFor = i => {
    const spacing = drawer && kind === 'spacing' && (spAll || i === target)
      ? spDraft : spacingFor(spacings, i);
    return layoutAt(drawer && kind === 'layout' && i === target ? draft : layouts[i], spacing);
  };

  // The strip's geometry is all derived from its own width, so it tracks the
  // viewport (390 on a phone, 402 in the desktop IOSDevice frame) and re-derives on
  // rotation. Measured rather than expressed in percentages because the children's
  // percentage basis would be the *content* box, which the side padding shrinks.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const measure = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Width drives the zoom, as the node has it — but a portrait book in a band halved
  // by the drawer is taller than the band, so it is scaled down to fit. With the
  // drawer closed the band is always tall enough and this is a no-op.
  let pageW = box.w * PV_PAGE_FRACTION;
  let bookH = ((2 * pageW) / aspect) / BOOK.interior.height;
  const maxH = box.h - 16;
  if (box.h > 0 && bookH > maxH) {
    pageW *= maxH / bookH;
    bookH = maxH;
  }
  const bookW = (2 * pageW) / BOOK.interior.width;

  const centreOn = (i, behavior) => {
    const sc = scroller.current;
    const el = leafRefs.current[i];
    if (!sc || !el) return;
    const delta = el.getBoundingClientRect().left + el.offsetWidth / 2
                  - (sc.getBoundingClientRect().left + sc.clientWidth / 2);
    if (behavior === 'smooth' && sc.scrollTo) sc.scrollTo({ left: sc.scrollLeft + delta, behavior });
    else sc.scrollLeft += delta;
  };

  // Land on the page that was tapped, without an animation — the mode change is the
  // transition. Keyed on pageW rather than run once, so opening or closing the
  // drawer (which re-scales the strip) leaves the same page centred instead of
  // drifting by however much the books shrank.
  useLayoutEffect(() => {
    if (!pageW) return;
    centreOn(active, 'auto');
  }, [pageW]);

  // Which page is under the middle of the strip. rAF-throttled: a handful of rects
  // per frame during a drag.
  const onScroll = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      const sc = scroller.current;
      if (!sc) return;
      const mid = sc.getBoundingClientRect().left + sc.clientWidth / 2;
      let best = -1, bestD = Infinity;
      leafRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (best >= 0) setActive(best);
    });
  };
  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  // A ring on a page that has scrolled out of view, with the selection toolbar still
  // up, reads as a bug. Scrolling to another page clears it.
  useEffect(() => {
    if (selected && selected.slot !== active) setSelected(null);
  }, [active]);

  // Keep the active thumbnail reachable — `inline: 'nearest'`, deliberately not
  // 'center'. Centring re-scrolls the navigator on every change of `active`, which
  // means it slides under your finger the whole time you drag the strip, and a tap
  // on a thumbnail shoves the thumbnail you just tapped somewhere else. 'nearest'
  // does nothing while the thumbnail is already visible, and the navigator's
  // scroll-padding gives it 56px of margin so "visible" is not the very edge.
  // `block: 'nearest'` matters too, or this can scroll an ancestor vertically.
  useEffect(() => {
    const el = navRefs.current[active];
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [active]);

  const photoFor = s => (s.n ? pageThumb(placed, s.n) : s.unit === 0 ? (cover || []).find(Boolean) || null : null);
  const spreads = spreadsFor(pages);
  const pageAt = (n, layout) =>
    pagePhotos(placed, n, layout ? layout.length : 1, uploaded);
  // Slot indices are 0 for the cover then two per spread, so a spread's leaves are
  // 1 + 2i and 2 + 2i. Added spreads are appended, so existing indices never move.
  const leafRef = i => el => { leafRefs.current[i] = el; };
  // Tapping a photo selects it; the strip is only pickable while the drawer is down.
  const pick = slot => (drawer ? null : (i => setSelected({ slot, i })));
  // An empty placeholder opens the photo tray, which lives on EditorScreen so the book
  // view shares it.
  const pickEmpty = slot => (drawer ? null : (i => {
    const lay = layoutFor(slot);
    setSelected(null);
    onEmptyTap(slots[slot].n || 0, lay ? lay.length : 1, i);
  }));
  const selectedIn = slot =>
    (selected && selected.slot === slot ? selected.i : null);

  // On the cover, Covers takes Layout's place: a cover is designed, not laid out.
  const onCover = slots[active] && slots[active].unit === 0;
  const pvTools = onCover
    ? PV_TOOLS.map(t => (t.id === 'layout'
      ? { id: 'covers', label: 'Covers', icon: 'pb-editor-tool-themes.svg' } : t))
    : PV_TOOLS;

  return (
    <BookPaint.Provider value={paint}>
    <div ref={rootRef} style={{
      position: 'absolute', inset: 0,
      animation: 'pbFadeIn 220ms ease both',
    }}>
      <div
        ref={scroller}
        onScroll={onScroll}
        // The iOS-standard escape: a tap on the page anywhere but a photo clears the
        // selection. Slot taps stopPropagation, so they never reach this.
        onClick={() => { if (selected) setSelected(null); }}
        style={{
          position: 'absolute', left: 0, right: 0,
          // With the drawer up the node keeps only its 93-tall blur band at the top
          // (44 status bar + 49) and gives the rest of the upper half to the page.
          top: drawer
            ? 'calc(env(safe-area-inset-top, 44px) + 49px)'
            : 'calc(env(safe-area-inset-top, 44px) + 103px)',
          bottom: drawer
            ? ({ spacing: PV_SPACING_H, covers: PV_COVERS_H, color: PV_COLOR_H }[kind] || PV_DRAWER_H)
            : 'calc(235px + env(safe-area-inset-bottom, 0px))',
          display: 'flex', alignItems: 'center',
          // A gap of 8% of a page reads as a break between books without stranding
          // the strip on empty canvas. Not in the node, which shows one book.
          gap: pageW * 0.08,
          overflowX: 'auto', overflowY: 'hidden',
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Spacers, not padding: percentage widths on the books would resolve
            against the scroller's content box, which padding shrinks. These are
            what let the first and last page reach the centre of the viewport. */}
        <div aria-hidden style={{ flex: `0 0 ${(box.w - pageW) / 2}px` }} />
        {box.w > 0 && (
          <React.Fragment>
            <CoverUnit w={bookW} h={bookH} pageW={pageW} frontRef={leafRef(0)}
                       layout={layoutFor(0)} adjust={adjustFor(0)}
                       photos={coverPhotos(cover, (layoutFor(0) || FULL_PAGE).length)}
                       onEmpty={pickEmpty(0)}
                       onSelect={pick(0)} selected={selectedIn(0)} />
            {spreads.map(([l, r], i) => (
              <BookUnit key={i} w={bookW} h={bookH}>
                <BigLeaf side="left" slotRef={leafRef(1 + 2 * i)} slot={l ? 1 + 2 * i : null}>
                  {/* An inside-cover leaf (no page number) is plain paper. */}
                  {l && <BigWell photos={pageAt(l, layoutFor(1 + 2 * i))}
                           layout={layoutFor(1 + 2 * i)} pageW={pageW}
                           onSelect={pick(1 + 2 * i)} selected={selectedIn(1 + 2 * i)}
                           adjust={adjustFor(1 + 2 * i)} onEmpty={pickEmpty(1 + 2 * i)} />}
                  {l && <ThemeSticker n={l} />}
                </BigLeaf>
                <BigLeaf side="right" slotRef={leafRef(2 + 2 * i)} slot={r ? 2 + 2 * i : null}>
                  {r && <BigWell photos={pageAt(r, layoutFor(2 + 2 * i))}
                           layout={layoutFor(2 + 2 * i)} pageW={pageW}
                           onSelect={pick(2 + 2 * i)} selected={selectedIn(2 + 2 * i)}
                           adjust={adjustFor(2 + 2 * i)} onEmpty={pickEmpty(2 + 2 * i)} />}
                  {r && <ThemeSticker n={r} />}
                </BigLeaf>
              </BookUnit>
            ))}
          </React.Fragment>
        )}
        <div aria-hidden style={{ flex: `0 0 ${(box.w - pageW) / 2}px` }} />
      </div>

      {/* The drawer replaces the navigator and the toolbar for as long as it is up —
          it covers the bottom half of the screen, which is where both live. */}
      {!drawer && (
      <PageNavigator
        slots={slots} photoFor={photoFor} active={active}
        // Jump, don't animate. A smooth scroll from page 3 to page 24 drags the
        // preview through twenty spreads, and because the scroll handler tracks the
        // centred page the whole way, the selection ring races through every
        // thumbnail in between. One cut sets `active` once.
        onPick={i => {
          if (suppressClick.current) return;
          setActive(i); centreOn(i, 'auto');
        }}
        onAdd={onAdd} itemRefs={navRefs}
        onThumbDown={onThumbDown} onMove={onNavMove} onUp={onNavUp}
        dragIndex={navDrag ? navDrag.i : -1}
        overIndex={navDrag && navDrag.over !== navDrag.i ? navDrag.over : -1}
        bottom="calc(170px + env(safe-area-inset-bottom, 0px))"
      />
      )}

      {/* The dragged thumbnail, following the finger. */}
      {navDrag && (
        <div aria-hidden style={{
          position: 'absolute', zIndex: 30, pointerEvents: 'none',
          left: navDrag.x - navDrag.grabX - navDrag.rootX,
          top: navDrag.y - navDrag.grabY - navDrag.rootY,
          width: navDrag.w, height: navDrag.h,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        }}>
          <span style={{
            width: NAV_THUMB, height: NAV_THUMB, borderRadius: 2, overflow: 'hidden',
            background: '#FFFFFF', transform: 'scale(1.15)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
          }}>
            {photoFor(slots[navDrag.i]) && (
              <img src={photoFor(slots[navDrag.i])} alt="" draggable={false} style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} />
            )}
          </span>
        </div>
      )}

      <PageViewHeader onBack={onBack} controls={!drawer}
                      height={drawer
                        ? 'calc(env(safe-area-inset-top, 44px) + 49px)'
                        : 'calc(env(safe-area-inset-top, 44px) + 103px)'} />

      {/* With a photo selected the row becomes the node's six selection tools, laid
          out from x=0 with gap 4 (451:14675); otherwise it is the page view's eight,
          of which Layout is the one live tool. */}
      {!drawer && (
        <Toolbar photos={uploaded}
                 tools={selected ? SELECTED_TOOLS : pvTools}
                 gap={selected ? 4 : 8} padX={selected ? 0 : 16}
                 onTool={id => {
                   if (selected) {
                     if (id === 'back') setSelected(null);
                     // Replace opens the same tray as an empty placeholder, aimed at the
                     // selected slot; the selection stays on it, now holding the new photo.
                     if (id === 'replace') {
                       const lay = layoutFor(selected.slot);
                       onEmptyTap(slots[selected.slot].n || 0, lay ? lay.length : 1, selected.i, true);
                     }
                     return;
                   }
                   if (id === 'layout') openDrawer();
                   if (id === 'covers') openCovers();
                   if (id === 'spacing') openSpacing();
                   if (id === 'color') openColor();
                 }} />
      )}

      {drawer && kind === 'spacing' && (
        <SpacingDrawer closing={drawer === 'closing'} value={spDraft} all={spAll}
                       onChange={setSpDraft} onAll={setSpAll}
                       onClose={() => { setDrawer('closing'); setTimeout(() => setDrawer(null), 320); }}
                       onSave={saveSpacing} />
      )}
      {drawer && kind === 'layout' && (
        <LayoutDrawer
          closing={drawer === 'closing'} count={count} selected={draft}
          options={LAYOUTS[count] || []} pageAspect={pageAspect}
          photos={[photoFor(slots[target])]}
          onCount={c => { setCount(c); setDraft(`${c}-0`); setFlash(f => f + 1); }}
          onPick={i => { setDraft(`${count}-${i}`); setFlash(f => f + 1); }}
          onClose={closeDrawer} onConfirm={confirmDrawer}
        />
      )}
      {drawer && kind === 'covers' && (
        <CoversDrawer closing={drawer === 'closing'} selected={coverDraft} onPick={setCoverDraft}
                      pageAspect={pageAspect} layout={layoutFor(0)}
                      photos={coverPhotos(cover, (layoutFor(0) || FULL_PAGE).length)}
                      onClose={dismissDrawer}
                      onConfirm={() => { onSetCoverDesign(coverDraft); dismissDrawer(); }} />
      )}
      {drawer && kind === 'color' && (
        <ColorDrawer closing={drawer === 'closing'} value={colorDraft} all={colorAll}
                     cover={target === 0} onChange={setColorDraft} onAll={setColorAll}
                     onClose={dismissDrawer}
                     onSave={() => { onSetColor(target, colorDraft, colorAll); dismissDrawer(); }} />
      )}
    </div>
    </BookPaint.Provider>
  );
}

// ── Arrange mode — Figma node 451:15148.
//
// A mode of the book view (Arrange is its second tool): the spreads become a compact
// scrolling list you rearrange by hand. Two tabs — Photos moves photographs between
// pages, Pages moves whole spreads through the book.
//
// ⚠️ The node is the fourth WIP frame named "test" and its list is scratch: six
// blocks in which spread 3 duplicates spread 2 and spread 6 duplicates spread 4, its
// page captions read 1 / 2-3 / 2-3 / 4-5 / 6-7 / 4-5, and it carries the same 93-tall
// backdrop-blur band the other three frames do. What it *does* give, and what is
// built, is three distinct sheet treatments which map cleanly onto the three states
// a drag has:
//   451:15152  paper at opacity 0.10          → the spread being dragged
//   451:15163  rgba(248,248,248,0.5) at 0.5   → the spread under the finger
//   451:15187  the plain sheet                → everything else
// and, on the source spread, an empty 164 box at opacity 0.5 where a photo used to
// be (451:15159) — the hole a lifted photo leaves.

// node: each block is 203 tall — a 172 sheet plus a 31 caption strip, and the blocks
// have no gap between them (against the book view's 47). The sheet's own height
// follows the page format, as everywhere else, so only the strip is a constant.
const ARR_CAPTION = 31;
// node 451:15220/15222 — a smaller add pill than the book view's 56×38.
const ARR_ADD = { w: 56, h: 26, icon: 16 };
// The tap-selection and drag-hover rings are additions; the node shows neither. This
// is the design's own accent, taken from the Done button's #00C2C9.
const ARR_ACCENT = '#00C2C9';

// node 451:15240 — the CTA is #00C2C9 at mix-blend-mode: overlay. Implemented
// literally that is the trap the editor's Continue button already records: WebKit
// cannot blend across a composited layer boundary, and this sits in a stacking
// context with backdrop-filtered siblings. Sampling the node's own render instead,
// over the opaque part of its band (rgb(27,27,27)) the button resolves to (0,41,42) —
// which is exactly 2·base·blend, the overlay formula for a dark base. So the blend is
// carried as the flat colour it resolves to.
//
// ⚠️ The consequence is that the button no longer brightens where light content sits
// behind it: the node samples (0,69,74) where a white sheet shows through its
// translucent band. Chasing that back would mean re-introducing the blend.
const DONE_FILL = '#00292A';

const HOLD_MS = 250;
const MOVE_TOL = 8;

// ── The Photos / Pages switcher — node 451:15255 ("Switcher with icons").
// 343×40 at 16, r16, rgba(0,0,0,0.8) + blur(10.95px), padding 4; the selected
// segment is a white r12 fill. Sampled against the node: the unselected side reads
// (4,4,4), which is 0.8 black over the header's own rgb(20,20,20) — so the 80% is
// real and must not be flattened to a solid.
//
// The node types the unselected label in Brandon Text 14 — Figma's fallback for a
// face this file does not carry — so both labels take the project's SF stack at the
// node's 15/20 −0.24.
function ArrangeSwitcher({ tab, onTab }) {
  const seg = (id, label) => {
    const on = tab === id;
    return (
      <button type="button" key={id} onClick={() => onTab(id)}
        aria-pressed={on}
        style={{
          flex: '1 0 0', minWidth: 0, height: '100%', padding: 4,
          border: 'none', borderRadius: 12, cursor: 'pointer',
          background: on ? 'var(--colour-foreground-fg-white, #FFFFFF)' : 'transparent',
          fontFamily: TEXT, fontWeight: 600, fontSize: 15, lineHeight: '20px',
          letterSpacing: '-0.24px', textAlign: 'center',
          color: on ? 'var(--colour-foreground-fg-black, #333333)' : '#FFFFFF',
          WebkitTapHighlightColor: 'transparent',
        }}>{label}</button>
    );
  };
  return (
    <div role="tablist" aria-label="Arrange what" style={{
      display: 'flex', alignItems: 'center', height: 40, padding: 4,
      boxSizing: 'border-box', borderRadius: 16,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(10.95px)', WebkitBackdropFilter: 'blur(10.95px)',
    }}>
      {seg('photos', 'Photos')}
      {seg('pages', 'Pages')}
    </div>
  );
}

// ── Header — node 451:15241. 236 tall on a 44 status bar, a flat backdrop-blur(5px)
// under the node's own gradient.
//
// This one keeps the node's fully opaque top stop, unlike the page view's header
// (which drops it to 55% so the blur it sits on stays visible). Here the header is a
// real panel carrying two lines of copy and a control, not a peek-through scrim, so
// opaque is the intent — and a progressive blur would be pointless under it.
function ArrangeHeader({ tab, onTab }) {
  const top = 'max(68px, calc(env(safe-area-inset-top, 44px) + 24px))';
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, top: 0, zIndex: 6,
      height: 'calc(env(safe-area-inset-top, 44px) + 192px)',
      backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)',
      backgroundImage:
        'linear-gradient(to bottom, rgb(20,20,20) 73.671%, rgba(39,39,39,0) 96.296%)',
    }}>
      {/* node 451:15253 / 451:15254 — title at 68, body at 97, both 334 wide */}
      <p style={{
        position: 'absolute', left: 0, right: 0, top, margin: 0, textAlign: 'center',
        fontFamily: TEXT, fontWeight: 600, fontSize: 16, lineHeight: '21px',
        letterSpacing: '-0.32px', color: '#FFFFFF',
      }}>Arrange mode</p>
      <p style={{
        position: 'absolute', left: 0, right: 0, top: `calc(${top} + 29px)`,
        margin: '0 auto', maxWidth: 334, textAlign: 'center',
        fontFamily: TEXT, fontSize: 16, lineHeight: '21px', letterSpacing: '-0.32px',
        color: 'var(--colour-foreground-fg-grey, #CCCCCC)',
      }}>
        {/* The node's own line break on the Photos tab. The Pages copy is an
            addition — the node only draws the Photos tab. */}
        {tab === 'photos' ? (
          <React.Fragment>
            Drag a photo onto a page to add it there,<br />
            or tap 2 photos to swap with each other.
          </React.Fragment>
        ) : (
          <React.Fragment>
            Drag and drop a spread to move it,<br />
            or tap 2 pages to swap their photos.
          </React.Fragment>
        )}
      </p>
      <div style={{
        position: 'absolute', left: 16, right: 16, top: `calc(${top} + 90px)`,
      }}>
        <ArrangeSwitcher tab={tab} onTab={onTab} />
      </div>
    </div>
  );
}

// ── One page of a spread in the list.
//
// `leafBox` is the book view's, so a spread does not change colour as you move
// between the two views. ⚠️ The node paints both arrange leaves white where the book
// view shades the left one #F5F5F5 — the book view wins, since the same sheet
// otherwise re-shades itself the moment Arrange is tapped.
// `slotDown` is the Photos tab — one drag handle per layout slot. `leafDown` is the
// Pages tab, where the unit is the whole spread: the handle has to be the leaf, not the
// photos on it, or pressing the sheet itself does nothing and the spread cannot be
// picked up at all.
function ArrangeLeaf({ side, n, photos, layout, holeSlot, ringSlot,
                      slotDown, leafDown, slotRef }) {
  const left = side === 'left';
  const slots = layout && layout.length ? layout : FULL_PAGE;
  const t = useTheme();
  const { colors } = React.useContext(BookPaint);
  return (
    <div onDragStart={e => e.preventDefault()}
         onPointerDown={n ? leafDown : undefined}
         style={Object.assign(leafBox(left, t, n ? slotColor(colors, n + 1) : null), {
      position: 'relative',
      cursor: n && leafDown ? 'grab' : undefined,
      WebkitTapHighlightColor: 'transparent',
      WebkitUserSelect: 'none', userSelect: 'none',
      // The list scrolls vertically and a photo is most of a leaf, so the gesture is
      // only claimed once the press-and-hold fires — see the comment on the gesture
      // in ArrangeView. touch-action therefore stays at its default here.
    })}>
      {/* A size container: the theme's frames are sized in container units. */}
      <div style={{ position: 'relative', flex: 1, minWidth: 0, containerType: 'size' }}>
        {/* An inside-cover leaf has no page number and holds no photo. */}
        {(n ? slots : []).map((sl, i) => {
          const photo = photos[i] || null;
          const hole = holeSlot === i;
          const ring = ringSlot === i;
          return (
            <div key={i}
                 ref={slotRef ? slotRef(i) : undefined}
                 onPointerDown={n && slotDown ? slotDown(i) : undefined}
                 onDragStart={e => e.preventDefault()}
                 style={{
                   position: 'absolute',
                   left: `${sl.x}%`, top: `${sl.y}%`,
                   width: `${sl.w}%`, height: `${sl.h}%`,
                   cursor: n ? 'grab' : 'default',
                   WebkitTapHighlightColor: 'transparent',
                 }}>
              {/* node 451:15159 — the hole a lifted photo leaves: the empty well at
                  half opacity, keeping its shadow, so the slot still reads as a slot. */}
              <PhotoWell photo={hole ? null : photo} index={i}
                         iconSize={Math.max(10, Math.round(24 * Math.min(sl.w, sl.h) / 100))}
                         style={{ position: 'absolute', inset: 0, flex: 'none',
                                  opacity: hole ? 0.5 : 1 }} />
              {ring && (
                <span aria-hidden style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  boxShadow: `inset 0 0 0 2px ${ARR_ACCENT}`,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// node 451:15153 etc. put the page numbers at 12/28 in **black** at 35% — unreadable
// on this near-black page, and plainly carried over from a light context. The book
// view's white at the same size and opacity is used instead.
function ArrangeCaption({ left, right, onAdd }) {
  const s = {
    fontFamily: TEXT, fontSize: 12, lineHeight: '28px',
    color: '#FFFFFF', opacity: 0.35,
  };
  return (
    <div style={{
      position: 'relative', height: ARR_CAPTION, display: 'flex',
      justifyContent: 'space-between', alignItems: 'flex-start',
    }}>
      <span aria-hidden style={s}>{left || ''}</span>
      <span aria-hidden style={s}>{right || ''}</span>
      {onAdd && (
        // The node has this straddling the block's bottom edge (top 189 of 203),
        // which with no gap between blocks would put it on the next sheet. Centred
        // in the caption strip instead.
        <button type="button" onClick={onAdd} aria-label="Add spread here"
          {...press(0.9)}
          style={{
            position: 'absolute', left: `calc(50% - ${ARR_ADD.w / 2}px)`,
            top: (ARR_CAPTION - ARR_ADD.h) / 2,
            width: ARR_ADD.w, height: ARR_ADD.h, borderRadius: 24, padding: 0,
            border: 'none', background: 'var(--colour-foreground-fg-black, #333333)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'transform 140ms ease',
            WebkitTapHighlightColor: 'transparent',
          }}>
          <img src={`${A}/pb-editor-plus.svg`} alt=""
               width={ARR_ADD.icon} height={ARR_ADD.icon} style={{ display: 'block' }} />
        </button>
      )}
    </div>
  );
}

// ── Arrange mode.
//
// ⚠️ A leaf here shows **one photo**, not its layout template. `pb_placed` holds one
// photo per page — that is what auto-fill writes and what every other view reads —
// so one photo per page is exactly what there is to rearrange, and every gesture in
// this mode moves real, persisted data. A page given a multi-photo template in the
// layout drawer therefore reads simpler here than in the book view, whose extra slots
// are filled from the upload pool as a *preview* (see slotPhotos). Unifying the two
// means making placement per-slot, which is a change to the storage model and not a
// side effect of this mode.
function ArrangeView({ aspect, pages, placed, uploaded, layouts, spacings, cover,
                      onSwapSlots, onMovePhoto, onSwapPages, onMoveSpread, onAdd, onDone }) {
  const { useState, useRef, useEffect, useMemo } = React;
  const [tab, setTab] = useState('photos');
  // The first of a tap-tap pair: a page number on the Photos tab, a page number on
  // Pages too (a tap there swaps two pages' photos, per the copy).
  const [sel, setSel] = useState(null);
  const [drag, setDrag] = useState(null);

  const root = useRef(null);
  const scroller = useRef(null);
  const pending = useRef(null);
  // Photos-tab targets are individual slots, keyed "page:slot" — a 4-photo page has
  // four of them. Pages-tab targets are whole spreads, keyed by index.
  const slotEls = useRef({});
  const spreadEls = useRef({});
  const autoRaf = useRef(0);
  const autoDir = useRef(0);
  const finishRef = useRef(() => {});

  const spreads = spreadsFor(pages);
  // pb_layouts is keyed by slot index, so a page number has to be mapped back to one.
  const layoutByPage = useMemo(() => {
    const m = {};
    slotsFor(pages).forEach((sl, i) => { if (sl.n) m[sl.n] = layoutById(layouts[i]); });
    return m;
  }, [pages, layouts]);
  const slotsOn = n => {
    const l = layoutByPage[n];
    return l && l.length ? l.length : 1;
  };
  const photosOn = n => pagePhotos(placed, n, slotsOn(n), uploaded);

  // Switching tabs abandons a half-made pair, and a drag can never outlive the tab
  // it was started on.
  const switchTab = t => { setTab(t); setSel(null); };

  // ── Edge auto-scroll. A 24-page book is far longer than the viewport, so without
  // this you could only ever drop onto a target that was already visible.
  const stopAuto = () => {
    autoDir.current = 0;
    if (autoRaf.current) { cancelAnimationFrame(autoRaf.current); autoRaf.current = 0; }
  };
  const edgeScroll = y => {
    const sc = scroller.current;
    if (!sc) return;
    const r = sc.getBoundingClientRect();
    const M = 80;
    let d = 0;
    if (y < r.top + M) d = -Math.min(14, (r.top + M - y) / 4);
    else if (y > r.bottom - M) d = Math.min(14, (y - (r.bottom - M)) / 4);
    autoDir.current = d;
    if (d && !autoRaf.current) {
      const step = () => {
        const el = scroller.current;
        if (!el || !autoDir.current) { autoRaf.current = 0; return; }
        el.scrollTop += autoDir.current;
        autoRaf.current = requestAnimationFrame(step);
      };
      autoRaf.current = requestAnimationFrame(step);
    }
  };
  useEffect(() => stopAuto, []);

  // A safety net on the window. setPointerCapture normally guarantees the release
  // comes back to the element that took it, but capture can fail (or the element can
  // unmount mid-drag) and a drag whose pointerup never arrives would hang with the
  // clone stuck under the finger. Registered only while a press is live, and it runs
  // the same `finish` the element's own handler does — whichever fires first clears
  // `pending`, so the second is a no-op.
  useEffect(() => {
    const up = e => finishRef.current(e, false);
    const cancel = e => finishRef.current(e, true);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', cancel);
    return () => {
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', cancel);
    };
  }, []);

  // Which target is under (x, y). Rects are read live rather than cached: the list
  // scrolls under the finger, including by auto-scroll.
  const hitTest = (x, y) => {
    const els = tab === 'photos' ? slotEls.current : spreadEls.current;
    let hit = null;
    Object.keys(els).forEach(k => {
      const el = els[k];
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) hit = k;
    });
    if (hit == null) return null;
    return tab === 'photos' ? hit : Number(hit);
  };
  const parseSlot = key => {
    const [n, i] = String(key).split(':').map(Number);
    return { n, i, slots: slotsOn(n) };
  };

  // ── The gesture. One handler gives both interactions the node asks for:
  //   a tap (released before the hold, having barely moved) selects, and a second
  //   tap swaps; a press-and-hold lifts the item and then follows the finger.
  //
  // ⚠️ Press-and-hold rather than an immediate drag is what keeps the list
  // scrollable. Claiming the gesture on pointerdown would need touch-action:none on
  // every photo, and photos are most of the list — the page would barely scroll.
  // Moving more than MOVE_TOL before the hold fires is read as a scroll and cancels
  // the press.
  // ⚠️ Once the hold has fired we must stop the browser scrolling the list. On touch,
  // `preventDefault` on a pointermove does nothing — `touch-action` governs, and it
  // cannot be `none` here or the list would barely scroll at all (photos are most of
  // it). A non-passive `touchmove` listener that preventDefaults is the one thing that
  // does work, so it is attached on lift and removed on release. Without it a real
  // finger scrolls the page and the drag is cancelled.
  const blockTouch = useRef(null);
  const holdTouch = () => {
    if (blockTouch.current) return;
    const h = e => e.preventDefault();
    window.addEventListener('touchmove', h, { passive: false });
    blockTouch.current = h;
  };
  const releaseTouch = () => {
    if (!blockTouch.current) return;
    window.removeEventListener('touchmove', blockTouch.current, { passive: false });
    blockTouch.current = null;
  };
  useEffect(() => releaseTouch, []);

  const onPointerDown = (page, slot, spread) => e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const el = e.currentTarget;
    stopAuto();
    const p = {
      page, slot, spread, el, pointerId: e.pointerId,
      sx: e.clientX, sy: e.clientY, lifted: false, timer: 0,
    };
    pending.current = p;
    p.timer = setTimeout(() => {
      if (pending.current !== p) return;
      p.lifted = true;
      try { el.setPointerCapture(p.pointerId); } catch (err) { /* not fatal */ }
      holdTouch();
      const src = tab === 'photos' ? el : spreadEls.current[spread];
      const r = (src || el).getBoundingClientRect();
      const rr = root.current ? root.current.getBoundingClientRect() : { left: 0, top: 0 };
      p.grabX = p.sx - r.left;
      p.grabY = p.sy - r.top;
      setSel(null);
      setDrag({
        page, slot, spread, w: r.width, h: r.height,
        rootX: rr.left, rootY: rr.top,
        x: p.sx, y: p.sy, grabX: p.grabX, grabY: p.grabY, over: null,
      });
    }, HOLD_MS);
  };

  const onPointerMove = e => {
    const p = pending.current;
    if (!p) return;
    if (!p.lifted) {
      if (Math.abs(e.clientX - p.sx) > MOVE_TOL || Math.abs(e.clientY - p.sy) > MOVE_TOL) {
        clearTimeout(p.timer);
        pending.current = null;
      }
      return;
    }
    // The clone is pointer-events:none, so this never hit-tests the clone itself.
    e.preventDefault();
    const over = hitTest(e.clientX, e.clientY);
    setDrag(d => (d ? Object.assign({}, d, { x: e.clientX, y: e.clientY, over }) : d));
    edgeScroll(e.clientY);
  };

  const finish = (e, cancelled) => {
    const p = pending.current;
    if (!p) return;
    clearTimeout(p.timer);
    pending.current = null;
    stopAuto();
    releaseTouch();
    if (!p.lifted) {
      // A tap. Both tabs swap two pages' photos; the node's copy says so for Photos
      // and the Pages tab reuses it, which is the only tap that means anything there.
      const n = p.page;
      if (!n) return;
      if (tab === 'photos') {
        const key = `${n}:${p.slot}`;
        if (sel == null) setSel(key);
        else if (sel === key) setSel(null);
        else { onSwapSlots(parseSlot(sel), parseSlot(key)); setSel(null); }
      } else {
        if (sel == null) setSel(n);
        else if (sel === n) setSel(null);
        else { onSwapPages(sel, n); setSel(null); }
      }
      return;
    }
    const over = cancelled ? null : hitTest(e.clientX, e.clientY);
    setDrag(null);
    if (over == null) return;
    if (tab === 'photos') {
      const from = `${p.page}:${p.slot}`;
      if (over !== from) onMovePhoto(parseSlot(from), parseSlot(over));
    } else if (over !== p.spread) {
      onMoveSpread(p.spread, over);
    }
  };

  finishRef.current = finish;

  const dragging = !!drag;
  // ⚠️ Both guard on `n` first. The inside-cover leaves have no page number, and `sel`
  // is null when nothing is selected — so a bare equality test would mark every inside
  // cover permanently. (That bug shipped once; it rang every inside cover.)
  const holeSlot = n =>
    (!!n && dragging && tab === 'photos' && drag.page === n ? drag.slot : -1);
  const ringSlot = n => {
    if (!n) return -1;
    if (dragging) {
      if (tab !== 'photos' || drag.over == null) return -1;
      const t = parseSlot(drag.over);
      return (t.n === n && `${t.n}:${t.i}` !== `${drag.page}:${drag.slot}`) ? t.i : -1;
    }
    if (tab === 'pages') return sel === n ? 0 : -1;
    if (sel == null) return -1;
    const t = parseSlot(sel);
    return t.n === n ? t.i : -1;
  };

  // node 451:15152 / 451:15163 — the dragged spread's paper drops to 10%, and the
  // spread under the finger to 50% with its content scaled to the node's 152/164.
  const sheetOpacity = i => {
    if (!dragging || tab !== 'pages') return 1;
    if (drag.spread === i) return 0.1;
    return drag.over === i ? 0.5 : 1;
  };
  const sheetScale = i =>
    (dragging && tab === 'pages' && drag.over === i && drag.spread !== i ? 152 / 164 : 1);

  // Only a real page registers drop targets. An inside cover would put "null:0" in the
  // map and hitTest would hand back NaN as a page number.
  const slotRefFor = n => (n ? (i => el => { slotEls.current[`${n}:${i}`] = el; }) : null);

  const leaf = (n, side, spread) => (
    <ArrangeLeaf side={side} n={n} photos={photosOn(n)} layout={layoutByPage[n]}
                 holeSlot={holeSlot(n)} ringSlot={ringSlot(n)}
                 slotDown={n && tab === 'photos' ? (i => onPointerDown(n, i, spread)) : null}
                 leafDown={n && tab === 'pages' ? onPointerDown(n, 0, spread) : null}
                 slotRef={tab === 'photos' ? slotRefFor(n) : null} />
  );
  const leaves = (i, pair) => (
    <React.Fragment>
      {leaf(pair[0], 'left', i)}
      {leaf(pair[1], 'right', i)}
    </React.Fragment>
  );

  return (
    <div ref={root} style={{
      position: 'absolute', inset: 0, animation: 'pbFadeIn 220ms ease both',
    }}>
      <div
        ref={scroller}
        onPointerMove={onPointerMove}
        onPointerUp={e => finish(e, false)}
        onPointerCancel={e => finish(e, true)}
        style={{
          position: 'absolute', left: 0, right: 0,
          // node: the list starts at 244 on a 236-tall header, i.e. 8 below it.
          top: 'calc(env(safe-area-inset-top, 44px) + 200px)',
          bottom: 0,
          overflowY: 'auto', overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
        }}>
        <div style={{
          display: 'flex', flexDirection: 'column',
          // The node's blocks butt up against each other — no gap, against the book
          // view's 47.
          padding: `0 ${GUTTER}px`, boxSizing: 'border-box',
        }}>
          {/* The cover. The node's list starts at [inside front | 1] and shows no
              cover at all, which reads as the book being cut off — the book view has
              always led with it. It is not a drop target and not draggable: it is not
              a page, and the node's own navigator treats it as a single entry. */}
          <div style={{ position: 'relative' }}>
            <Sheet aspect={aspect} interior={<CoverInterior layout={layoutAt(layouts[0], spacingFor(spacings, 0))}
                                                   photos={coverPhotos(cover, (layoutAt(layouts[0], spacingFor(spacings, 0)) || FULL_PAGE).length)} />}>
              <GutterArt file="pb-editor-hinge.png" offsets={[-11, -3]} width={14}
                         opacity={0.5} />
            </Sheet>
            <ArrangeCaption right="Cover" />
          </div>
          {spreads.map((pair, i) => (
            <div key={i} ref={el => { spreadEls.current[i] = el; }}
                 style={{
                   position: 'relative',
                   opacity: sheetOpacity(i),
                   transform: `scale(${sheetScale(i)})`,
                   transformOrigin: 'center',
                   transition: 'opacity 160ms ease, transform 160ms ease',
                 }}>
              <Sheet aspect={aspect} interior={leaves(i, pair)}>
                <GutterArt file="pb-editor-spine.png" offsets={[-4]} width={8} />
              </Sheet>
              {/* No add-spread pill here: arrange rearranges what is in the book, and
                  adding pages belongs to the book and page views. */}
              <ArrangeCaption left={pair[0]} right={pair[1]} onAdd={null} />
            </div>
          ))}
          {/* Room for the Done band, which is absolutely positioned over the list. */}
          <div aria-hidden style={{
            height: 'calc(120px + env(safe-area-inset-bottom, 0px))',
          }} />
        </div>
      </div>

      <ArrangeHeader tab={tab} onTab={switchTab} />

      {/* node 451:15239 — a 161-tall gradient band carrying the CTA. */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 6,
        height: 'calc(161px + env(safe-area-inset-bottom, 0px))',
        pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(to bottom, rgba(0,0,0,0) 0.2%, rgb(27,27,27) 73.53%)',
      }}>
        {/* ⚠️ Centred with `left/right: 0` + `margin: auto`, NOT
            `left: 50%; transform: translateX(-50%)`. press() assigns
            `style.transform = scale(...)` on pointerdown, which overwrites the whole
            transform — so a translateX centring is destroyed by the first tap and the
            button jumps half its width to the right and stays there. Any element that
            both centres with a transform and uses press() has this bug. */}
        <button type="button" onClick={onDone} {...press(0.97)} style={{
          position: 'absolute', left: 0, right: 0, margin: '0 auto',
          bottom: 'max(25px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
          width: 338, maxWidth: 'calc(100% - 32px)', boxSizing: 'border-box',
          padding: '16px 24px', borderRadius: 55, border: 'none',
          background: DONE_FILL,
          boxShadow: 'inset 0px 0px 27px rgba(0,0,0,0.25)',
          fontFamily: TEXT, fontWeight: 600, fontSize: 16, lineHeight: '21px',
          letterSpacing: '-0.32px', textAlign: 'center',
          color: 'var(--colour-foreground-fg-white, #FFFFFF)',
          cursor: 'pointer', pointerEvents: 'auto',
          transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
        }}>Done</button>
      </div>

      {/* The floating clone. Not in the design — the node shows the source faded but
          nothing under the finger, and a drag with nothing under the finger reads as
          broken. Positioned against the arrange root rather than `fixed`, so it is
          also correct inside the desktop IOSDevice frame. */}
      {drag && (
        <div aria-hidden style={{
          position: 'absolute', zIndex: 30, pointerEvents: 'none',
          left: drag.x - drag.grabX - drag.rootX,
          top: drag.y - drag.grabY - drag.rootY,
          width: drag.w, height: drag.h,
          opacity: 0.9, transform: 'scale(1.04)', transformOrigin: 'center',
          filter: 'drop-shadow(0px 12px 20px rgba(0,0,0,0.5))',
        }}>
          {tab === 'photos' ? (
            <PhotoWell photo={(photosOn(drag.page) || [])[drag.slot] || null}
                       style={{ position: 'absolute', inset: 0, flex: 'none' }} />
          ) : (
            <Sheet aspect={aspect}
                   interior={leaves(drag.spread, spreads[drag.spread] || [null, null])} />
          )}
        </div>
      )}
    </div>
  );
}

function EditorScreen() {
  const { useState, useEffect, useRef, useMemo } = React;
  const [book] = useState(readBook);
  const [incoming] = useState(readIncomingPhotos);
  const [uploaded] = useState(() => incoming || readList('pb_uploaded'));
  const [placed, setPlaced] = useState(() => readList('pb_placed'));
  const [layouts, setLayouts] = useState(readLayouts);
  const [spacings, setSpacings] = useState(readSpacings);
  const [cover, setCover] = useState(readCover);
  // pb_theme — the applied theme's id; pb_style — the last Style applied, which is
  // what the Style drawer reopens on.
  const [theme, setTheme] = useState(readTheme);
  const [style, setStyle] = useState(readStyle);
  // pb_colors — page colours by slot (see BookPaint); pb_cover_design — the cover design.
  const readObj = key => {
    try {
      const o = JSON.parse(sessionStorage.getItem(key) || '{}');
      return o && typeof o === 'object' && !Array.isArray(o) ? o : {};
    } catch (e) { return {}; }
  };
  const [colors, setColors] = useState(() => readObj('pb_colors'));
  const [coverDesignId, setCoverDesignId] = useState(() => {
    try { return coverDesign(sessionStorage.getItem('pb_cover_design')).id; }
    catch (e) { return 'classic'; }
  });
  // The book view's two drawers: { kind: 'themes' | 'style', closing }. Each holds a
  // draft that previews on the whole book and is only written on confirm.
  const [panel, setPanel] = useState(null);
  const [themeCat, setThemeCat] = useState(THEME_CATEGORIES[0].id);
  const [themeDraft, setThemeDraft] = useState(null);
  // pb_theme_base — the book's own layouts and spacing from before the first theme,
  // which is what "Default" puts back. Kept in step with every later change (Style,
  // a page's Layout or Spacing) so Default restores the book as it now is, unthemed,
  // rather than as it was the moment the theme went on.
  const [themeBase, setThemeBase] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('pb_theme_base') || 'null'); }
    catch (e) { return null; }
  });
  const writeBase = b => {
    try {
      if (b) sessionStorage.setItem('pb_theme_base', JSON.stringify(b));
      else sessionStorage.removeItem('pb_theme_base');
    } catch (e) { /* best-effort */ }
    return b;
  };
  const [styleDraft, setStyleDraft] = useState(STYLE_DEFAULT);
  // null = the book view; otherwise the slot index the page view opened on.
  const [pageView, setPageView] = useState(null);
  // Arrange mode — node 451:15148. A third mode of this screen, alongside page view.
  const [arrange, setArrange] = useState(false);
  const [added, setAdded] = useState(() => {
    // A book reloaded with more photos than pages keeps the spreads auto-fill added.
    const p = readList('pb_placed');
    return Math.max(0, Math.ceil((p.length - readBook().pages) / 2));
  });

  // Record the upload as soon as it arrives, before any prompt is answered.
  useEffect(() => {
    if (incoming) sessionStorage.setItem('pb_uploaded', JSON.stringify(incoming));
  }, [incoming]);
  // 'wait' → 'open' → 'closing' → 'gone'. The short wait lets the push transition
  // finish before the sheet rises, so the two animations do not fight; it still
  // reads as arriving with the screen. Arriving back from the picker asks about
  // auto-fill; arriving at an empty book asks for photos; a book that already has
  // photos asks nothing.
  const [sheet, setSheet] = useState(
    () => (incoming || !readList('pb_uploaded').length ? 'wait' : 'gone'));

  useEffect(() => {
    if (sheet !== 'wait') return;
    const t = setTimeout(() => setSheet('open'), 300);
    return () => clearTimeout(t);
  }, [sheet]);

  // The book view unmounts while page view is up, so its scroll offset is stashed
  // and put back through the callback ref when it comes back. Without this, coming
  // out of a page halfway down a 24-page book lands you at the top of the cover.
  const bookScroller = useRef(null);
  const bookScrollTop = useRef(0);
  const attachBookScroller = el => {
    bookScroller.current = el;
    if (el) el.scrollTop = bookScrollTop.current;
  };
  const stashBookScroll = () => {
    if (bookScroller.current) bookScrollTop.current = bookScroller.current.scrollTop;
  };
  const openPage = slot => { stashBookScroll(); setPageView(slot); };
  // Arrange's list has its own rhythm (203 pitch against the book view's 243), so
  // there is no offset to carry across — the book view simply comes back where it was.
  const openArrange = () => { stashBookScroll(); setArrange(true); };

  const writePlaced = list => {
    // Trailing nulls carry no information and would inflate the length `added` is
    // re-derived from on reload.
    const out = list.slice();
    while (out.length && !out[out.length - 1]) out.pop();
    sessionStorage.setItem('pb_placed', JSON.stringify(out));
    return out;
  };

  // ── Arrange, Photos tab: swap two individual slots. One operation serves every
  // gesture — a drag onto an occupied slot swaps, onto an empty one moves, and tapping
  // two photos swaps.
  //
  // A page whose entry is still a single photo is **materialised** into a per-slot
  // array first: the extra slots of a multi-photo layout were being previewed from the
  // upload pool, and the moment you move one of them that preview has to become real
  // data or the drag could not persist. Single-slot pages stay plain strings.
  // ── Arrange, Photos tab: drag a photo onto another page to ADD it there (a tap pair
  // is what swaps). The target takes it in an empty slot if it has one, otherwise its
  // layout grows by a slot; the source page closes the gap, its layout shrinking to
  // match. A drop within the same page still swaps — that is reordering, not adding.
  const movePhoto = (A, B) => {
    if (A.n === B.n) { swapSlots(A, B); return; }
    const next = placed.slice();
    while (next.length < Math.max(A.n, B.n)) next.push(null);
    const a = pagePhotos(next, A.n, A.slots, []);
    const b = pagePhotos(next, B.n, B.slots, []);
    while (a.length < A.slots) a.push(null);
    while (b.length < B.slots) b.push(null);
    const photo = a[A.i];
    if (!photo) return;

    let bLayout;                         // undefined = leave B's layout alone
    if (!b[B.i]) b[B.i] = photo;
    else if (b.indexOf(null) >= 0) b[b.indexOf(null)] = photo;
    else {
      const id = layoutIdFor(b.length + 1);
      if (!id) { swapSlots(A, B); return; }  // no template holds that many
      b.push(photo);
      bLayout = id;
    }
    a[A.i] = null;
    let aList = a, aLayout;
    if (A.slots > 1) {
      aList = a.filter(Boolean);
      aLayout = aList.length > 1 ? layoutIdFor(aList.length) : null;
    }
    const entry = list => (list.length > 1 ? list : (list[0] || null));
    next[A.n - 1] = entry(aList);
    next[B.n - 1] = entry(b);
    setPlaced(writePlaced(next));
    const slotOf = n => slotsFor(pages).findIndex(sl => sl.n === n);
    if (bLayout !== undefined) setLayout(slotOf(B.n), bLayout);
    if (aLayout !== undefined) setLayout(slotOf(A.n), aLayout);
  };

  const swapSlots = (A, B) => {
    setPlaced(prev => {
      const next = prev.slice();
      const ensure = t => {
        while (next.length < t.n) next.push(null);
        if (t.slots > 1 && !Array.isArray(next[t.n - 1])) {
          const filled = pagePhotos(prev, t.n, t.slots, uploaded);
          next[t.n - 1] = filled.length ? filled : new Array(t.slots).fill(null);
        }
      };
      ensure(A); ensure(B);
      const read = t => {
        const e = next[t.n - 1];
        return Array.isArray(e) ? (e[t.i] || null) : (t.i === 0 ? (e || null) : null);
      };
      const write = (t, v) => {
        const e = next[t.n - 1];
        if (Array.isArray(e)) { const a = e.slice(); a[t.i] = v || null; next[t.n - 1] = a; }
        else next[t.n - 1] = v || null;
      };
      const va = read(A), vb = read(B);
      write(A, vb); write(B, va);
      return writePlaced(next);
    });
  };

  // ── Arrange, Pages tab: swap two whole pages, whatever each is holding.
  const swapPhotos = (a, b) => {
    setPlaced(prev => {
      const next = prev.slice();
      while (next.length < Math.max(a, b)) next.push(null);
      const t = next[a - 1] || null;
      next[a - 1] = next[b - 1] || null;
      next[b - 1] = t;
      return writePlaced(next);
    });
  };

  // ── Arrange: move a whole spread through the book.
  //
  // The photos are re-laid onto pages 1..n in the new order rather than the pages
  // being renumbered, so the book's pagination never changes. Chunk sizes are
  // [1, 2, 2, … 2, 1] — the first spread carries only page 1 (its other leaf is the
  // inside front cover) and the last only page n — and they sum to n either way, so
  // reordering chunks of unequal size still lands exactly one photo per page.
  //
  // ⚠️ `pb_layouts` is keyed by slot index and is deliberately *not* permuted: a
  // template belongs to the page it is on, not to the photo that happens to sit
  // there. Moving a spread moves its pictures, not its layouts.
  const moveSpread = (from, to) => {
    setPlaced(prev => {
      const chunks = spreadsFor(book.pages + added * 2).map(
        pair => pair.filter(n => n).map(n => prev[n - 1] || null));
      if (from < 0 || from >= chunks.length || to < 0 || to >= chunks.length) return prev;
      const moved = chunks.splice(from, 1)[0];
      chunks.splice(to, 0, moved);
      return writePlaced([].concat.apply([], chunks));
    });
  };

  // Durable, like pb_placed: a reload keeps the templates the book was given.
  const setLayout = (slot, id) => {
    setLayouts(prev => {
      const next = Object.assign({}, prev);
      if (id) next[slot] = id; else delete next[slot];
      sessionStorage.setItem('pb_layouts', JSON.stringify(next));
      return next;
    });
    setThemeBase(b => {
      if (!b) return b;
      const layouts = Object.assign({}, b.layouts);
      if (id) layouts[slot] = id; else delete layouts[slot];
      return writeBase(Object.assign({}, b, { layouts }));
    });
  };

  // pb_spacing: per-slot values, plus '*' for "apply to all pages", which also wipes
  // the per-slot overrides so one book-wide value really is the whole book.
  const setSpacing = (slot, v, all) => {
    setSpacings(prev => {
      const next = all ? { '*': v } : Object.assign({}, prev, { [slot]: v });
      sessionStorage.setItem('pb_spacing', JSON.stringify(next));
      return next;
    });
    setThemeBase(b => (b ? writeBase(Object.assign({}, b, {
      spacings: all ? { '*': v } : Object.assign({}, b.spacings, { [slot]: v }),
    })) : b));
  };

  const setColor = (slot, c, all) => {
    setColors(prev => {
      const next = withColor(prev, slot, c, all);
      sessionStorage.setItem('pb_colors', JSON.stringify(next));
      return next;
    });
    setThemeBase(b => (b ? writeBase(Object.assign({}, b, {
      colors: withColor(b.colors || {}, slot, c, all) })) : b));
  };
  const setCoverDesign = id => {
    setCoverDesignId(id);
    try { sessionStorage.setItem('pb_cover_design', id); } catch (e) { /* best-effort */ }
  };

  // The photo tray, shared by the book view and the page view: { n, count, i } — which
  // page, how many slots its layout has, and which placeholder was tapped.
  const [tray, setTray] = useState(null);
  const [trayClosing, setTrayClosing] = useState(false);
  const openTray = (n, count, i, replace) => setTray({ n, count, i, replace: !!replace });
  const closeTray = () => {
    setTrayClosing(true);
    setTimeout(() => { setTray(null); setTrayClosing(false); }, 320);
  };
  // Every photo already on a page, so the tray can mark it.
  const usedPhotos = useMemo(() => {
    const m = {};
    placed.concat(cover).forEach(e => (Array.isArray(e) ? e : [e]).forEach(ph => {
      if (ph) m[ph] = (m[ph] || 0) + 1;
    }));
    return m;
  }, [placed, cover]);

  // Tap an empty placeholder → pick a photo for just that slot of that page.
  const placePhoto = (n, count, i, photo) => {
    if (n === 0) {
      setCover(prev => {
        const arr = coverPhotos(prev, count);
        arr[i] = photo;
        sessionStorage.setItem('pb_cover', JSON.stringify(arr));
        return arr;
      });
      return;
    }
    setPlaced(prev => {
      const next = prev.slice();
      while (next.length < n) next.push(null);
      const arr = pagePhotos(prev, n, count, []);
      while (arr.length < count) arr.push(null);
      arr[i] = photo;
      next[n - 1] = count === 1 ? photo : arr;
      return writePlaced(next);
    });
  };

  // ── Themes and Style. Both rewrite every page layout ("last change wins"), so a
  // page's hand-picked layout survives only until the next one of the two is applied.
  const openPanel = kind => {
    if (kind === 'themes') {
      setThemeCat(THEMES[theme] ? THEMES[theme].cat : THEME_CATEGORIES[0].id);
      setThemeDraft(theme);
    } else {
      setStyleDraft(style);
    }
    setPanel({ kind, closing: false });
  };
  // Marking it closing drops the preview at once, so a cancelled draft visibly
  // reverts before the drawer slides away rather than snapping after it.
  const closePanel = () => {
    setPanel(p => (p ? Object.assign({}, p, { closing: true }) : p));
    setTimeout(() => setPanel(null), 320);
  };
  const persist = (key, value) => {
    try { sessionStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value)); }
    catch (e) { /* storage is best-effort */ }
  };
  const commitTheme = () => {
    const t = THEMES[themeDraft];
    if (themeDraft === theme) {
      // Confirming the theme the book already has changes nothing.
    } else if (!t) {
      // "Default": take the theme off and put the book's own layouts back.
      const b = themeBase || { layouts: {}, spacings: {} };
      setLayouts(b.layouts); persist('pb_layouts', b.layouts);
      setSpacings(b.spacings); persist('pb_spacing', b.spacings);
      setColors(b.colors || {}); persist('pb_colors', b.colors || {});
      setThemeBase(writeBase(null));
      setTheme(null);
      try { sessionStorage.removeItem('pb_theme'); } catch (e) { /* best-effort */ }
    } else {
      if (!theme) setThemeBase(writeBase({ layouts, spacings, colors }));
      const r = applyTheme(t, placed, pages);
      setPlaced(writePlaced(r.placed));
      setLayouts(r.layouts); persist('pb_layouts', r.layouts);
      // The theme's layouts are drawn at the default spacing; a full-bleed spacing
      // left over from Style would run its framed photos off the page.
      setSpacings({}); persist('pb_spacing', {});
      // The theme brings its own paper, so chosen page colours give way to it.
      setColors({}); persist('pb_colors', {});
      setTheme(t.id); persist('pb_theme', t.id);
    }
    closePanel();
  };
  const commitStyle = () => {
    if (stylePlan) {
      setPlaced(writePlaced(stylePlan.placed));
      setCover(prev => {
        const arr = coverPhotos(prev, Math.max(1, prev.length));
        arr[0] = stylePlan.cover;
        persist('pb_cover', arr);
        return arr;
      });
      setLayouts(stylePlan.layouts); persist('pb_layouts', stylePlan.layouts);
      setSpacings(stylePlan.spacings); persist('pb_spacing', stylePlan.spacings);
      setAdded(stylePlan.added);
      setStyle(styleDraft); persist('pb_style', styleDraft);
      // Under a theme, this is now the look Default would return to.
      if (theme) setThemeBase(b => writeBase(Object.assign({}, b,
        { layouts: stylePlan.layouts, spacings: stylePlan.spacings })));
    }
    closePanel();
  };

  // ── The Photos tool opens the tray as a browser of the whole upload. A photo
  // already in the book opens the page holding it; one that is not yet goes onto the
  // first empty placeholder (a new spread if there is none) and opens that page.
  const slotOfPhoto = ph => {
    if ((cover || []).includes(ph)) return 0;
    for (let n = 1; n <= pages; n++) {
      const e = placed[n - 1];
      if (e === ph || (Array.isArray(e) && e.includes(ph))) return n + 1;
    }
    return -1;
  };
  const browsePick = ph => {
    let slot = slotOfPhoto(ph);
    if (slot < 0) {
      let at = null;
      for (let n = 1; n <= pages && !at; n++) {
        const lay = layoutAt(layouts[n + 1], spacingFor(spacings, n + 1));
        const count = lay ? lay.length : 1;
        const arr = pagePhotos(placed, n, count, []);
        while (arr.length < count) arr.push(null);
        if (arr.indexOf(null) >= 0) at = { n, count, i: arr.indexOf(null) };
      }
      if (!at) { at = { n: pages + 1, count: 1, i: 0 }; setAdded(a => a + 1); }
      placePhoto(at.n, at.count, at.i, ph);
      slot = at.n + 1;
    }
    closeTray();
    openPage(slot);
  };

  const dismissSheet = () => {
    setSheet('closing');
    setTimeout(() => setSheet('gone'), 320);
  };

  // "Yes, auto-fill" — one photo per page, in the order the picker handed them over
  // (chronological, which is what the prompt promises). The first photo goes on the
  // cover and the rest one per page, so page n holds photo n + 1. A selection longer
  // than the book grows it by whole spreads, priced like any other added spread.
  const autoFill = () => {
    const rest = incoming.slice(1);
    setPlaced(rest);
    sessionStorage.setItem('pb_placed', JSON.stringify(rest));
    setCover(prev => {
      const arr = coverPhotos(prev, Math.max(1, prev.length));
      arr[0] = incoming[0];
      sessionStorage.setItem('pb_cover', JSON.stringify(arr));
      return arr;
    });
    const needed = Math.ceil((rest.length - book.pages) / 2);
    if (needed > 0) setAdded(a => Math.max(a, needed));
    dismissSheet();
  };

  const pages = book.pages + added * 2;
  const total = (parseFloat(book.total) + added * EXTRA_SPREAD_PRICE).toFixed(2);

  // The Style drawer's draft as a whole book. The cover keeps its own layout.
  const styleOpen = !!panel && !panel.closing && panel.kind === 'style';
  const themesOpen = !!panel && !panel.closing && panel.kind === 'themes';
  const stylePlan = useMemo(() => {
    if (!styleOpen || !uploaded.length) return null;
    const plan = planBook(uploaded, styleDraft, book.pages);
    const lay = Object.assign({}, plan.layouts);
    if (layouts[0]) lay[0] = layouts[0];
    const cov = coverPhotos(cover, Math.max(1, cover.length));
    cov[0] = plan.cover;
    return Object.assign(plan, { layouts: lay, cover: cov, spacings: { '*': plan.spacing } });
  }, [styleOpen, styleDraft, uploaded, layouts, cover, book.pages]);
  const themePlan = useMemo(() => {
    if (!themesOpen || themeDraft === theme) return null;
    const t = THEMES[themeDraft];
    if (t) return Object.assign(applyTheme(t, placed, pages), { spacings: {}, colors: {} });
    const b = themeBase || { layouts: {}, spacings: {} };
    return { placed, layouts: b.layouts, spacings: b.spacings, colors: b.colors || {} };
  }, [themesOpen, themeDraft, theme, themeBase, placed, pages]);

  // What the book view draws: the open drawer's draft, else the book itself.
  const v = stylePlan
    ? Object.assign({ colors }, stylePlan)
    : themePlan
      ? { placed: themePlan.placed, cover, layouts: themePlan.layouts,
          spacings: themePlan.spacings, colors: themePlan.colors, added }
      : { placed, cover, layouts, spacings, colors, added };
  const vPages = book.pages + v.added * 2;
  const vTotal = (parseFloat(book.total) + v.added * EXTRA_SPREAD_PRICE).toFixed(2);
  const spreads = spreadsFor(vPages);
  const bookTheme = THEMES[themesOpen ? themeDraft : theme] || null;
  // When the format's own page count is what decided the length (too few photos to
  // fill it at this density), say so — otherwise "Collage" on a small upload reads as
  // broken, since planBook spreads the photos out across the minimum instead.
  const styleSummary = !uploaded.length ? 'No photos uploaded yet' : stylePlan
    ? `${uploaded.length} photos → ${stylePlan.pages} pages${stylePlan.added ? '' : ' (min.)'} · €${
        (parseFloat(book.total) + stylePlan.added * EXTRA_SPREAD_PRICE).toFixed(2)}`
    : '';

  // A full spread is two leaves wide, so its box is 2·(pageW/pageH). The node's own
  // leaves are square (164×164) while its card reads "Large Portrait" — the WIP
  // Figma is inconsistent there, and the brief asks the spreads to represent the
  // format chosen on the previous step, so the format wins.
  const aspect = (2 * book.pageW) / book.pageH;
  const pageAspect = book.pageW / book.pageH;

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      // node 451:15574 — a 20% black wash over the vertical grey ramp. Anchored to
      // the viewport rather than the content so the ramp always reads top-light,
      // however long the book gets.
      background: 'linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%),' +
                  ' linear-gradient(180deg, #272727 0%, #151515 100%)',
    }}>
      <style>{`
        @keyframes pbSheetIn  { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes pbSheetOut { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes pbScrimIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pbScrimOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes pbFadeIn   { from { opacity: 0; } to { opacity: 1; } }
        .pb-range { -webkit-appearance: none; appearance: none; width: 100%; height: 28px;
          margin: 0; background: transparent; touch-action: pan-y; }
        .pb-range::-webkit-slider-runnable-track { height: 16px; border-radius: 8px;
          background: linear-gradient(to right, #00A8AE var(--v), rgba(255,255,255,0.16) var(--v)); }
        .pb-range::-moz-range-track { height: 16px; border-radius: 8px;
          background: linear-gradient(to right, #00A8AE var(--v), rgba(255,255,255,0.16) var(--v)); }
        .pb-range::-webkit-slider-thumb { -webkit-appearance: none; width: 28px; height: 28px;
          margin-top: -6px; border-radius: 14px; background: #fff; border: 0;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4); }
        .pb-range::-moz-range-thumb { width: 28px; height: 28px; border-radius: 14px;
          background: #fff; border: 0; box-shadow: 0 2px 6px rgba(0,0,0,0.4); }
        @keyframes pbSplitHint { 0% { opacity: 0; transform: scale(0.6); }
          18% { opacity: 1; transform: scale(1.1); } 30% { transform: scale(1); }
          75% { opacity: 1; } 100% { opacity: 0; transform: scale(1); } }
      `}</style>

      <BookTheme.Provider value={bookTheme}>
      <BookPaint.Provider value={{ colors: v.colors, cover: coverDesignId }}>
      {arrange ? (
        <ArrangeView
          aspect={aspect} pages={pages} placed={placed}
          uploaded={uploaded} layouts={layouts} spacings={spacings} cover={cover}
          onSwapSlots={swapSlots} onMovePhoto={movePhoto} onSwapPages={swapPhotos} onMoveSpread={moveSpread}
          onAdd={() => setAdded(n => n + 1)}
          onDone={() => setArrange(false)}
        />
      ) : pageView !== null ? (
        <PageView
          aspect={aspect} pageAspect={pageAspect} pages={pages}
          placed={placed} uploaded={uploaded}
          layouts={layouts} onSetLayout={setLayout} onSwapPages={swapPhotos}
          spacings={spacings} onSetSpacing={setSpacing} cover={cover} onEmptyTap={openTray}
          startSlot={pageView} onBack={() => setPageView(null)}
          colors={colors} onSetColor={setColor}
          coverDesignId={coverDesignId} onSetCoverDesign={setCoverDesign}
          onAdd={() => setAdded(n => n + 1)}
        />
      ) : (
      <React.Fragment>
      <div ref={attachBookScroller} style={{
        position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>
        {/* Dot canvas: 2×2 dots on an 18px grid, 4px in from the frame edge, #272727
            — measured off the node's render. It rides the content rather than the
            viewport so the spreads read as sitting on a canvas while it scrolls.
            background-origin must be border-box: the default padding-box would
            re-phase the grid against the safe-area padding above. */}
        <div style={{
          paddingTop: 'max(144px, calc(env(safe-area-inset-top, 44px) + 100px))',
          backgroundImage: 'radial-gradient(circle at 1px 1px, #272727 0, #272727 1px, rgba(0,0,0,0) 1px)',
          backgroundSize: '18px 18px', backgroundPosition: '4px 4px',
          backgroundOrigin: 'border-box',
        }}>
          <DetailsCard title={book.title} pages={vPages} total={vTotal} />

          {/* 23px from the card to the cover, per the node (card ends 202, cover 225) */}
          <div style={{ height: 23 }} />

          {/* Sheets are 71px apart in the node (172 → 243). A block is the sheet plus
              its 24px caption strip, so the column gap is 47 and the add-spread pill
              overhangs 31px into it. */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 47,
            padding: `0 ${GUTTER}px`, boxSizing: 'border-box',
          }}>
            <CoverBlock aspect={aspect} onOpen={() => openPage(0)}
                        layout={layoutAt(v.layouts[0], spacingFor(v.spacings, 0))}
                        photos={coverPhotos(v.cover, (layoutAt(v.layouts[0], spacingFor(v.spacings, 0)) || FULL_PAGE).length)}
                        /* No onEmpty in the book view: a tap anywhere on a page opens
                           it in page view, and placeholders are filled from there. */ />
            {spreads.map(([l, r], i) => (
              <SpreadBlock key={i} aspect={aspect} left={l} right={r} photos={v.placed}
                           showPlus={i < spreads.length - 1}
                           onAdd={() => setAdded(n => n + 1)}
                           pool={uploaded}
                           /* Slot 0 is the cover, then two per spread — the same
                              indices the page view and pb_layouts use. */
                           layoutFor={side => {
                             const k = 1 + 2 * i + (side === 'right' ? 1 : 0);
                             return layoutAt(v.layouts[k], spacingFor(v.spacings, k));
                           }}
                           onOpen={side => openPage(1 + 2 * i + (side === 'right' ? 1 : 0))} />
            ))}
          </div>

          {/* The toolbar is absolutely positioned over the scroller, so the content
              needs matching room at the end or the last spread is trapped under it
              with no scroll left. */}
          <div aria-hidden style={{
            height: panel
              ? (panel.kind === 'style' ? STYLE_DRAWER_H : THEME_DRAWER_H)
              : 'calc(139px + env(safe-area-inset-bottom, 0px))',
          }} />
        </div>
      </div>

      {/* Close always lands on home, whatever the history holds (picker, sources…). `replace`
          rather than `href` so the editor is not left in the stack; the flag makes it a pop. */}
      <Header onClose={() => {
        // Leaving the editor starts the next visit from an empty book. (Going to the
        // photo picker is not leaving: only this button resets.) pb_book stays — it is
        // the product page's choice, not the editor's content.
        try {
          ['pb_placed', 'pb_uploaded', 'pb_photos', 'pb_layouts', 'pb_spacing', 'pb_cover',
           'pb_theme', 'pb_theme_base', 'pb_style', 'pb_colors', 'pb_cover_design']
            .forEach(k => sessionStorage.removeItem(k));
          sessionStorage.setItem('pb_nav', 'pop');
        } catch (e) {}
        window.location.replace('home.html');
      }} />
      {/* Photos, Arrange, Themes and Style are live; AI help and Options are inert.
          The drawers cover the toolbar, so it is unmounted while one is up. */}
      {!panel && (
        <Toolbar photos={uploaded}
                 onTool={id => {
                   if (id === 'arrange') openArrange();
                   if (id === 'photos') setTray({ browse: true });
                   if (id === 'themes' || id === 'style') openPanel(id);
                 }} />
      )}
      {panel && panel.kind === 'themes' && (
        <ThemesDrawer closing={panel.closing} cat={themeCat} onCat={setThemeCat}
                      selected={themeDraft} onPick={setThemeDraft}
                      onClose={closePanel} onConfirm={commitTheme}
                      pageAspect={pageAspect}
                      photo={(cover || []).find(Boolean) || pageThumb(placed, 1) || uploaded[0] || null} />
      )}
      {panel && panel.kind === 'style' && (
        <StyleDrawer closing={panel.closing} value={styleDraft} onChange={setStyleDraft}
                     summary={styleSummary} onClose={closePanel} onApply={commitStyle} />
      )}

      {(sheet === 'open' || sheet === 'closing') && (
        incoming ? (
          <AutofillSheet
            closing={sheet === 'closing'} count={incoming.length}
            onYes={autoFill} onNo={dismissSheet}
          />
        ) : (
          <UploadSheet
            closing={sheet === 'closing'}
            onSelect={() => window.navigation.push('photo-sources.html')}
            onSkip={dismissSheet}
          />
        )
      )}
      </React.Fragment>
      )}

      {tray && (
        <PhotoTray closing={trayClosing} photos={uploaded} used={usedPhotos}
                   onClose={closeTray}
                   title={tray.browse ? 'Your photos' : tray.replace ? 'Replace photo' : undefined}
                   subtitle={tray.browse && uploaded.length
                     ? `${uploaded.length} uploaded · ${uploaded.filter(ph => usedPhotos[ph]).length} in your book`
                     : undefined}
                   onUpload={() => window.navigation.push('photo-sources.html')}
                   onPick={ph => {
                     if (tray.browse) { browsePick(ph); return; }
                     placePhoto(tray.n, tray.count, tray.i, ph);
                     closeTray();
                   }} />
      )}
      </BookPaint.Provider>
      </BookTheme.Provider>
    </div>
  );
}
