// screens/photo-sources.jsx
// Figma: "Album" — node 451:14202. The photo-source picker that now sits between the
// editor's upload sheet and the album grid in image-picker/ (which is itself just one
// album, "Trip to Barcelona").
//   header + source pill .. 451:14355 / 451:14361
//   Collections row ....... 451:14203 / row 451:14213
//   Albums grid ........... 451:14372
//
// ⚠️ Figma clips exports to the containing frame, and this row overflows its 375
// frame, so only the first two cards (Canada, Italy) could be rendered for reference.
// The remaining six are reconstructed from the node's code alone and are unverified;
// see CLAUDE.md for the list of substitutions.

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
  {
    id: 'canada', photo: 'pb-src-canada.jpg', month: 'March 2026',
    bands: [
      { top: 0, height: 134.401, blur: 11.681, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)', flip: true },
      { top: 183.8, height: 136.055, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(0,0,0,0.21)' },
    ],
    // "CANADA" is BBH Bogle in the node — proprietary, so it falls back to the
    // condensed face already loaded for the line above it.
    lines: [
      { text: 'trip to', font: F.shoulders, size: 19.18, lh: 37.378, ls: 2.1221, top: 10.03 },
      { text: 'CANADA', font: F.shoulders, size: 67.281, lh: 52.346, ls: 0.7074, top: 44.41, weight: 700 },
    ],
  },
  {
    id: 'italy', photo: 'pb-src-italy.jpg', month: 'September 2025',
    bands: [
      { top: 0, height: 102.49, blur: 11.681, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)', flip: true },
      { top: 247.76, height: 72.152, blur: 1.498, from: 'rgba(217,217,217,0.01)', to: 'rgba(115,115,115,0.01)' },
    ],
    lines: [
      { text: 'Hiking in', font: F.borel, size: 21.221, lh: 21.221, ls: -0.5994, top: 35.68, align: 'left', left: 9.27 },
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
function CollectionCard({ c, onOpen }) {
  return (
    <button type="button" onClick={onOpen} aria-label={c.id} {...press(0.97)} style={{
      position: 'relative', flex: '0 0 auto', width: CARD_W, height: CARD_H,
      borderRadius: 24, overflow: 'hidden', padding: 0, cursor: 'pointer',
      border: '2px solid rgba(255,255,255,0.12)', boxSizing: 'border-box',
      background: c.bg || '#111111',
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
    }}>
      {c.photo && (
        <img src={`${A}/${c.photo}`} alt="" style={c.photoBox ? {
          position: 'absolute', left: '50%', top: '50%',
          width: c.photoBox.w, height: c.photoBox.h, maxWidth: 'none',
          transform: `translate(-50%, -50%) rotate(${c.photoBox.rotate}deg)`,
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
      {(c.bands || []).map((b, i) => <Band key={i} {...b} />)}
      {c.lines.map((l, i) => <CardLine key={i} l={l} />)}
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

// Node 451:14372. Tiles are 166 square at 375; kept as a ratio so they track the
// 343 content width on wider phones.
const ALBUMS = [
  { id: 'all',    title: 'All photos',      sub: '12459', photo: 'pb-src-allphotos.jpg' },
  { id: 'people', title: 'People and pets', sub: '8',     faces: true },
  { id: 'fav',    title: 'Favorite',        sub: '1234',  photo: 'pb-src-favorite.jpg' },
  { id: 'places', title: 'Places',          sub: 'Map',   photo: 'pb-src-places.jpg' },
];

// Node 451:14395 — four 76px circles on a translucent plate, at a 3.5/3.14 inset with
// a 7px gutter. Expressed as percentages of the 166 tile so it scales with the grid.
// Order is top-left, top-right, bottom-RIGHT, bottom-left — the node's Ellipse22..25
// run clockwise, not in reading order.
const FACE_POS = [
  { left: '2.11%', top: '1.89%' }, { left: '52.11%', top: '1.89%' },
  { left: '52.11%', top: '51.89%' }, { left: '2.11%', top: '51.89%' },
];

function AlbumTile({ a, onOpen }) {
  return (
    <button type="button" onClick={onOpen} {...press(0.97)} style={{
      display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start',
      border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
      textAlign: 'left', transition: 'transform 140ms ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '1 / 1',
        borderRadius: 16, overflow: 'hidden',
        background: a.faces ? 'rgba(17,17,17,0.5)' : '#111111',
      }}>
        {a.photo && (
          <img src={`${A}/${a.photo}`} alt="" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', display: 'block',
          }} />
        )}
        {a.faces && FACE_POS.map((p, i) => (
          <img key={i} src={`${A}/pb-src-face${i + 1}.png`} alt="" style={{
            position: 'absolute', left: p.left, top: p.top,
            width: '45.78%', height: '45.78%', display: 'block',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', color: '#FFFFFF' }}>
        <span style={{ fontFamily: TEXT, fontWeight: 600, fontSize: 15,
                       lineHeight: '20px', letterSpacing: '-0.24px' }}>{a.title}</span>
        <span style={{ fontFamily: TEXT, fontSize: 13,
                       lineHeight: '18px', letterSpacing: '-0.08px' }}>{a.sub}</span>
      </div>
    </button>
  );
}

function SectionHeading({ children }) {
  return (
    <div style={{ height: 24, display: 'flex', alignItems: 'center' }}>
      <span style={{
        fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
        letterSpacing: '-0.08px', color: 'var(--colour-foreground-fg-white, #FFFFFF)',
      }}>{children}</span>
    </div>
  );
}

// Node 451:14361 — the source switcher. Inert: the node only carries its Camera Roll
// state, and no source list exists in the Figma yet.
function SourcePill() {
  return (
    <button type="button" {...press(0.97)} style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '8px 12px', borderRadius: 22, cursor: 'pointer',
      background: 'var(--colour-foreground-fg-white, #FFFFFF)',
      border: '1px solid var(--colour-foreground-fg-white, #FFFFFF)',
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{
        position: 'relative', width: 24, height: 24, borderRadius: 8,
        background: '#FFFFFF', border: '0.3px solid rgba(41,41,41,0.16)',
        display: 'block', flex: '0 0 auto',
      }}>
        <img src={`${A}/pb-src-cameraroll.svg`} alt="" style={{
          position: 'absolute', inset: '6.67%', width: '86.66%', height: '86.66%',
          display: 'block',
        }} />
      </span>
      <span style={{
        fontFamily: TEXT, fontWeight: 600, fontSize: 13, lineHeight: '18px',
        letterSpacing: '-0.08px',
        color: 'var(--colour-foreground-fg-secondary, #007377)',
      }}>Camera Roll</span>
    </button>
  );
}

function PhotoSourcesScreen() {
  const openAlbum = () => window.navigation.push('../image-picker/index.html');

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: '#000000',
    }}>
      <div style={{
        position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>
        {/* ── Header — node 451:14355/14359. The node's own 48px status bar is replaced
            by the safe-area inset; the 44px control row and 12px tail below it are the
            node's, which puts the Collections section at y=104 as it has it. ── */}
        <div style={{
          position: 'relative',
          paddingTop: 'max(48px, calc(env(safe-area-inset-top, 44px) + 4px))',
          paddingBottom: 12,
          background: 'linear-gradient(to bottom, #000000, rgba(0,0,0,0))',
        }}>
          <div style={{
            height: 44, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* The node has a bare 24px chevron here; on request this uses the same
                liquid glass as the editor header. The glass sits at left 16 like the
                editor's, which nudges the glyph 8px right of the node's position. */}
            <div style={{ position: 'absolute', left: 16 }}>
              <GlassIconButton gloss tint="rgba(0,0,0,0.25)" label="Back"
                               onClick={() => window.navigation.pop()}>
                <img src={`${A}/pb-src-back.svg`} alt="" width={24} height={24}
                     style={{ display: 'block' }} />
              </GlassIconButton>
            </div>
            <SourcePill />
          </div>
        </div>

        {/* ── Collections — node 451:14203 ── */}
        <div style={{ position: 'relative', padding: 16, display: 'flex',
                      flexDirection: 'column', gap: 12 }}>
          {/* Node 451:14204 duplicates the first two covers behind the row at
              blur(146.85px) — an ambient colour glow, not content. */}
          <div aria-hidden style={{
            position: 'absolute', left: 16, top: 51.86, display: 'flex', gap: 16,
            filter: 'blur(146.85px)', pointerEvents: 'none', zIndex: 0,
          }}>
            {['pb-src-canada.jpg', 'pb-src-italy.jpg'].map(f => (
              <img key={f} src={`${A}/${f}`} alt="" style={{
                width: CARD_W, height: CARD_H, objectFit: 'cover', display: 'block',
              }} />
            ))}
          </div>

          <div style={{ position: 'relative' }}><SectionHeading>Collections</SectionHeading></div>
          {/* overflow-x forces overflow-y to auto, which clips the cards' rim; the
              bottom padding gives it room and the negative margin keeps the gap. */}
          <div style={{
            position: 'relative', display: 'flex', gap: 12, alignItems: 'flex-start',
            margin: '0 -16px -8px', padding: '0 16px 8px',
            overflowX: 'auto', overflowY: 'hidden',
            scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
          }}>
            {COLLECTIONS.map(c => (
              <CollectionCard key={c.id} c={c} onOpen={openAlbum} />
            ))}
          </div>
        </div>

        {/* ── Albums — node 451:14372 ── */}
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SectionHeading>Albums</SectionHeading>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          }}>
            {ALBUMS.map(a => <AlbumTile key={a.id} a={a} onOpen={openAlbum} />)}
          </div>
        </div>

        <div aria-hidden style={{ height: 'calc(16px + env(safe-area-inset-bottom, 0px))' }} />
      </div>
    </div>
  );
}
