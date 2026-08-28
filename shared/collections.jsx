// shared/collections.jsx
// The "Smart Stories" collection cards — Figma node 451:14213 (photo sources) and
// 509:19082 (home → Memories). Both screens show the same eight cards, so the data
// and the card renderer live here rather than being duplicated.
//
// Extracted verbatim from screens/photo-sources.jsx; see CLAUDE.md → "Photo sources
// page" for what is real in these covers and what is substituted, and for the Figma
// export-clipping limitation that leaves six of the eight unverified.
//
// ⚠️ Each text/babel file is its own classic script, so these top-level consts land
// in the global lexical scope. Any screen loading this file must NOT redeclare
// `A`, `TEXT`, `COMPACT`, `F`, `CARD_W`, `CARD_H`, `Band`, `CardLine`,
// `COLLECTIONS` or `CollectionCard`. Load it AFTER ios-frame.jsx, which defines
// the `press()` helper CollectionCard uses.

const A = '../shared/assets';
const TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
// The month labels are SF Compact Text Bold in the node; SF Compact is an Apple
// system face, so the stack falls through to SF Pro on non-Apple platforms.
const COMPACT = '-apple-system, "SF Compact Text", "SF Pro Text", system-ui, sans-serif';

const F = {
  shoulders: '"Big Shoulders Display", "Arial Narrow", sans-serif',
  alumni:    '"Alumni Sans", "Arial Narrow", sans-serif',
  borel:     '"Borel", cursive',
  caveat:    '"Caveat", cursive',
  basic:     '"Basic", sans-serif',
  coustard:  '"Coustard", Georgia, serif',
  changa:    '"Changa One", Impact, sans-serif',
  daruma:    '"Darumadrop One", sans-serif',
};

// Card geometry, straight from the node.
const CARD_W = 205.58;
const CARD_H = 321.856;

// A "blur band" is the node's recurring device: a backdrop-filtered strip with a
// gradient carrying almost no colour, used to lift the display type off the photo.
// `flip` mirrors it vertically, as the node does on every top band.
function Band({ top, height, blur, from, to, flip }) {
  return (
    <div aria-hidden style={{
      position: 'absolute', left: 0, right: 0, top, height,
      backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`,
      background: `linear-gradient(to ${flip ? 'top' : 'bottom'}, ${from}, ${to})`,
      pointerEvents: 'none',
    }} />
  );
}

// Each entry mirrors one card in node 451:14213: the photo, the blur bands, the
// display lines with their own face, and the month caption.
const COLLECTIONS = [
  // Canada and Italy are the only two covers Figma will render (the rest fall outside
  // the frame and export as 1×1), so they are the only two whose full layer stack
  // could be read off the node — hence `w`, `photoRect` and `cutout` here and nowhere
  // else. Node `509:19083` / `509:19091`.
  {
    id: 'canada', w: 229.58, photo: 'pb-src-canada.jpg', month: 'March 2026',
    photoRect: { left: -20, top: -6, w: 248, h: 330 },
    // 509:19088 — the cut-out, drawn 130.95% tall and pulled up 30.88% inside its
    // box, so only the couple from the chest up crosses into "CANADA".
    cutout: { src: 'pb-cut-canada.webp', left: -41.56, top: 54.34, w: 286.291, h: 291.496,
              imgHeight: '130.95%', imgTop: '-30.88%' },
    bands: [
      { top: 0, height: 134.401, blur: 11.681, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)', flip: true },
      // `above`: the node paints this band after the cut-out, not before.
      { top: 183.8, height: 136.055, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(0,0,0,0.21)', above: true },
    ],
    // "CANADA" is BBH Bogle in the node — proprietary, so it falls back to the
    // condensed face already loaded for the line above it.
    lines: [
      { text: 'trip to', font: F.shoulders, size: 19.18, lh: 37.378, ls: 2.1221, top: 10.03 },
      { text: 'CANADA', font: F.shoulders, size: 67.281, lh: 52.346, ls: 0.7074, top: 44.41, weight: 700 },
    ],
  },
  {
    id: 'italy', w: 229.58, photo: 'pb-src-italy.jpg', month: 'September 2025',
    photoRect: { left: -19.98, top: -2, w: 285.249, h: 380.333 },
    // 509:19095 — same box as the photo behind it, plain cover.
    cutout: { src: 'pb-cut-italy.webp', left: -19.98, top: -2, w: 285.249, h: 380.333 },
    bands: [
      { top: 0, height: 102.49, blur: 11.681, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)', flip: true },
      { top: 247.76, height: 72.152, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)', above: true },
    ],
    lines: [
      // "Hiking in" is painted *after* the cut-out in the node, "Italy" before it —
      // which is what puts the stone tower in front of the big word but not the
      // script line above it.
      { text: 'Hiking in', font: F.borel, size: 21.221, lh: 21.221, ls: -0.5994, top: 35.68, align: 'left', left: 9.27, above: true },
      { text: 'Italy', font: F.alumni, size: 123.869, lh: 37.378, ls: 0.9345, top: 75.87, weight: 900 },
    ],
  },
  {
    id: 'etna', photo: 'pb-src-etna.jpg', month: 'August 2025',
    bands: [
      { top: 0, height: 132.279, blur: 11.681, from: 'rgba(255,255,255,0.01)', to: '#63b6ff', flip: true },
      { top: 249.17, height: 72.152, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)' },
    ],
    lines: [{ text: 'Etna', font: F.caveat, size: 72.152, lh: 21.221, ls: -0.5994, top: 41.84, weight: 700, colour: '#fff200' }],
  },
  {
    // The node's Berlin photo fill is an empty placeholder, so this borrows the
    // Canada card's source photo.
    id: 'berlin', photo: 'pb-src-berlin.jpg', month: 'October 2025', substitutePhoto: true,
    bands: [
      { top: 0, height: 154.208, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(255,255,255,0.91)', flip: true },
      { top: 213.74, height: 107.521, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(0,0,0,0.25)' },
    ],
    // Two overlapping wordmarks: a white one under the white band, a dark one over
    // it. The dark one is AmstelvarAlpha in the node — not free, so it reuses Basic.
    under: [{ text: 'Berlin', font: F.basic, size: 64.449, lh: 37.378, ls: -4.2443, top: 60.94 }],
    lines: [{ text: 'Berlin', font: F.basic, size: 70.738, lh: 37.378, ls: -0.7074, top: 39.01, colour: '#112b47' }],
  },
  {
    id: 'cappadocia', photo: 'pb-src-cappadocia.jpg', month: 'August 2025',
    bg: '#97cbff',
    // Node 451:14251 — the photo is larger than the card, centred and turned 180°,
    // which decides which part of it lands behind the wordmark.
    photoBox: { w: 234.141, h: 328.93, rotate: 180 },
    bands: [
      // Addition, not in the node: its own bands leave the top clear, and this card's
      // photo is a white-background shot, so the white wordmark was unreadable over
      // it. Uses the same blur-band device the node applies to four of the other
      // cards, tinted enough to hold the type.
      { top: 0, height: 210, blur: 11.681, from: 'rgba(0,0,0,0.01)', to: 'rgba(0,0,0,0.38)', flip: true },
      { top: 185.2, height: 136.055, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(0,0,0,0.21)' },
    ],
    lines: [{ text: 'Cap\npado\ncia', font: F.coustard, size: 56.59, lh: 46.687, top: 94.79 }],
  },
  {
    id: 'guadalupe', photo: 'pb-src-guadalupe.jpg', month: 'August 2025',
    bands: [
      { top: 80.04, height: 241.215, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)' },
      { top: 268.91, height: 52.346, blur: 3.36, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)' },
    ],
    lines: [{
      text: 'Guadalupe', font: F.changa, size: 36.784, lh: 21.221, ls: -0.7074, top: 53.16,
      shadow: '0px 0px 14.148px rgba(255,115,0,0.5), 0px 0px 35.369px rgba(255,115,0,0.5)',
    }],
  },
  {
    // People collections. Node 451:14291 / 451:14353 are hand-drawn white *outline*
    // drawings of a figure, not photo frames. The node then paints a cut-out photo
    // over the outline plus several more doodles; that stack cannot be reproduced
    // blind — the photo fills are white-backed rather than transparent (Tim's is
    // empty altogether) and the extra doodles were never rendered for reference.
    // Both cards are therefore the flat colour, the name and the drawing, which is
    // the character the node carries.
    id: 'jane', bg: '#008cff', substitutePhoto: true,
    drawing: { src: 'pb-src-frame-jane.svg', left: 26.64, top: 69.08, w: 189.223, h: 257.485 },
    lines: [{ text: 'Jane', font: F.daruma, size: 91.959, lh: 70.738, ls: -8.4885, top: 6.48 }],
  },
  {
    id: 'tim', bg: '#00c040', substitutePhoto: true,
    drawing: { src: 'pb-src-frame-tim.svg', left: 20.89, top: 75.09, w: 181.796, h: 251.472 },
    lines: [{ text: 'Tim', font: F.daruma, size: 91.959, lh: 70.738, ls: -1.4148, top: 6.48 }],
  },
];

function CardLine({ l }) {
  const base = {
    position: 'absolute', margin: 0, top: l.top,
    fontFamily: l.font, fontSize: l.size, lineHeight: `${l.lh}px`,
    fontWeight: l.weight || 400,
    letterSpacing: l.ls ? `${l.ls}px` : undefined,
    color: l.colour || '#FFFFFF',
    textShadow: l.shadow,
    whiteSpace: 'pre-line', pointerEvents: 'none',
  };
  if (l.align === 'left') return <p style={{ ...base, left: l.left }}>{l.text}</p>;
  return <p style={{ ...base, left: 0, right: 0, textAlign: 'center' }}>{l.text}</p>;
}

// Node 451:14214 / 451:14222 use r24 with a 2px rim; the six cards clipped out of
// frame still carry an older r14.385 / 0.599px rim. Standardised on the pair the
// designer left visible, which also matches the app's other card radii.
//
// ⚠️ The rim is an **inset shadow, not a border**. As a border it sits outside the
// photo (which is `inset: 0`, i.e. the padding box), so the 2px ring rendered as the
// card's own `#111` background lifted 12% toward white — a near-black frame. That was
// invisible on the photo-sources screen, whose page is dark, and read as a hard black
// border once the same card landed on home's light page. As an inset shadow it paints
// *over* the photo and becomes the subtle white highlight the node actually specifies.
function CollectionCard({ c, onOpen }) {
  return (
    <button type="button" onClick={onOpen} aria-label={c.id} {...press(0.97)} style={{
      position: 'relative', flex: '0 0 auto', width: c.w || CARD_W, height: CARD_H,
      borderRadius: 24, overflow: 'hidden', padding: 0, cursor: 'pointer',
      border: 'none', boxSizing: 'border-box',
      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12)',
      background: c.bg || '#111111',
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
    }}>
      {c.photo && (
        <img src={`${A}/${c.photo}`} alt="" style={
          // `photoBox` is centred + rotated (Cappadocia); `photoRect` is the node's
          // own left/top/w/h, which on Canada and Italy is a deliberate overscan
          // rather than a plain cover fit.
          c.photoBox ? {
            position: 'absolute', left: '50%', top: '50%',
            width: c.photoBox.w, height: c.photoBox.h, maxWidth: 'none',
            transform: `translate(-50%, -50%) rotate(${c.photoBox.rotate}deg)`,
            objectFit: 'cover', display: 'block', pointerEvents: 'none',
          } : c.photoRect ? {
            position: 'absolute',
            left: c.photoRect.left, top: c.photoRect.top,
            width: c.photoRect.w, height: c.photoRect.h, maxWidth: 'none',
            objectFit: 'cover', display: 'block', pointerEvents: 'none',
          } : {
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block', pointerEvents: 'none',
          }} />
      )}
      {c.drawing && (
        <img src={`${A}/${c.drawing.src}`} alt="" aria-hidden style={{
          position: 'absolute', left: c.drawing.left, top: c.drawing.top,
          width: c.drawing.w, height: c.drawing.h, maxWidth: 'none',
          display: 'block', pointerEvents: 'none',
        }} />
      )}
      {(c.under || []).map((l, i) => <CardLine key={`u${i}`} l={l} />)}
      {(c.bands || []).filter(b => !b.above).map((b, i) => <Band key={`b${i}`} {...b} />)}
      {c.lines.filter(l => !l.above).map((l, i) => <CardLine key={i} l={l} />)}

      {/* The cut-out. This is the layer that makes the card work: the node paints an
          alpha cut-out of the subject *over* the display word, so the straw hat cuts
          into "CANADA" and the stone tower stands in front of "Italy". Without it the
          word sits flat on the photo and the whole lower card is left under the second
          blur band — which is what made these read as broken. */}
      {c.cutout && (
        <div aria-hidden style={{
          position: 'absolute',
          left: c.cutout.left, top: c.cutout.top,
          width: c.cutout.w, height: c.cutout.h,
          overflow: 'hidden', pointerEvents: 'none',
        }}>
          <img src={`${A}/${c.cutout.src}`} alt="" style={{
            position: 'absolute', left: 0,
            top: c.cutout.imgTop || 0,
            width: '100%', height: c.cutout.imgHeight || '100%',
            objectFit: 'cover', display: 'block', maxWidth: 'none',
          }} />
        </div>
      )}

      {c.lines.filter(l => l.above).map((l, i) => <CardLine key={`a${i}`} l={l} />)}
      {(c.bands || []).filter(b => b.above).map((b, i) => <Band key={`ab${i}`} {...b} />)}
      {c.month && (
        <p aria-hidden style={{
          position: 'absolute', left: 0, right: 0, bottom: 15.5, margin: 0,
          fontFamily: COMPACT, fontWeight: 700, fontSize: 16.977,
          lineHeight: '21.221px', letterSpacing: '-1.4148px',
          color: '#FFFFFF', textAlign: 'center', pointerEvents: 'none',
        }}>{c.month}</p>
      )}
    </button>
  );
}
