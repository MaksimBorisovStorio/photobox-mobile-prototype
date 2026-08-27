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
      width, opacity: opacity || 1,
      backgroundImage: `url(${A}/${file})`, backgroundSize: '100% 100%',
    }} />
  ));
}

// ── Page leaf — nodes 451:15613 (left) / 451:15610 (right). Left leaves are
// #F5F5F5 and right leaves white throughout the node: gutter shading, not content.
// Padding is 8 on the outer edge and 12 on the gutter edge, mirrored, which lands
// the placeholder 12 from the sheet edge and 8 from the spine on both sides.
function Leaf({ side, photo }) {
  const left = side === 'left';
  return (
    <div style={{
      width: '50%', height: '100%', boxSizing: 'border-box',
      background: left ? '#F5F5F5' : '#FFFFFF',
      boxShadow: '0px 1px 1.5px rgba(0,0,0,0.3), 0px 1px 1.5px rgba(0,0,0,0.1)',
      paddingTop: 8, paddingBottom: 8,
      paddingLeft: left ? 8 : 12, paddingRight: left ? 12 : 8,
      display: 'flex',
    }}>
      <PhotoWell photo={photo} />
    </div>
  );
}

// Photo well — node 451:15614. Empty it is #D9D9D9 with the 24px add-image icon;
// once auto-fill has placed a photo it fills the well. Still inert either way.
function PhotoWell({ photo, style }) {
  return (
    <div aria-hidden style={Object.assign({
      position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden',
      background: '#D9D9D9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }, style)}>
      {photo ? (
        <img src={photo} alt="" loading="lazy" style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
        }} />
      ) : (
        <img src={`${A}/pb-editor-add-image.svg`} alt="" width={24} height={24}
             style={{ display: 'block' }} />
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
function CoverBlock({ aspect }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Sheet aspect={aspect} interior={
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div aria-hidden style={{
            position: 'absolute', left: 6, bottom: 5, width: 50, height: 18,
            background: '#D9D9D9',
          }} />
          <div style={{
            position: 'absolute', left: 'calc(50% + 10px)', right: 3, top: 2, bottom: 2,
            display: 'flex', flexDirection: 'column',
          }}>
            {/* node 451:15628/15629 — SF Pro Text Bold 16/20, bottom-aligned in a 31px block */}
            <div style={{ height: 31, padding: 4, boxSizing: 'border-box',
                          display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 16,
                             lineHeight: '20px', color: '#000000' }}>Add text</span>
            </div>
            <PhotoWell />
          </div>
        </div>
      }>
        <GutterArt file="pb-editor-hinge.png" offsets={[-11, -3]} width={14} opacity={0.5} />
      </Sheet>
      <Caption right="Cover" />
    </div>
  );
}

// ── Inner spread — node 451:15591.
// `photos` is the placed list, indexed by page number — page n holds photos[n-1].
// The inside-front and inside-back leaves carry no page number, so they stay empty.
function SpreadBlock({ aspect, left, right, showPlus, onAdd, photos }) {
  const at = n => (n ? photos[n - 1] : null);
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Sheet aspect={aspect} interior={
        <React.Fragment>
          <Leaf side="left" photo={at(left)} />
          <Leaf side="right" photo={at(right)} />
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

        <GlassIconButton label="Continue" tint="transparent" accent={CONTINUE_ACCENT} gloss>
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
function Tool({ label, icon, children }) {
  return (
    <button type="button" {...press(0.9)} style={{
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

function Toolbar({ photos }) {
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
        display: 'flex', gap: 10, boxSizing: 'border-box',
        // The Photos badge breaks 7px above its icon, and overflow-x:auto forces
        // overflow-y to auto/hidden — it can never be visible — so the row needs
        // matching headroom or the badge is sliced off. Padding-top only: the row is
        // anchored by `bottom`, so the tools do not move.
        padding: '8px 8px 0',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        pointerEvents: 'auto',
      }}>
        {TOOLS.map(t => (
          <Tool key={t.id} {...t}>
            {t.id === 'photos' && photos.length
              ? <PhotosStackIcon photos={photos} count={photos.length} />
              : null}
          </Tool>
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
// serves both. The centre stop is deliberately translucent — the blurred editor reads
// faintly through the top of the sheet, so do not flatten it to a solid fill.
const SHEET_FILL =
  'radial-gradient(98.45% 30.66% at 50.13% 0%, rgba(0,0,0,0.2) 0%, #111111 100%)';

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
          borderRadius: '24px 24px 0 0',
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


function EditorScreen() {
  const { useState, useEffect } = React;
  const [book] = useState(readBook);
  const [incoming] = useState(readIncomingPhotos);
  const [uploaded] = useState(() => incoming || readList('pb_uploaded'));
  const [placed, setPlaced] = useState(() => readList('pb_placed'));
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

  const dismissSheet = () => {
    setSheet('closing');
    setTimeout(() => setSheet('gone'), 320);
  };

  // "Yes, auto-fill" — one photo per page, in the order the picker handed them over
  // (chronological, which is what the prompt promises). The cover is left alone: it
  // is not a page, and spending photo 1 on it would leave the last page empty.
  // A selection longer than the book grows it by whole spreads, priced like any other
  // added spread.
  const autoFill = () => {
    setPlaced(incoming);
    sessionStorage.setItem('pb_placed', JSON.stringify(incoming));
    const needed = Math.ceil((incoming.length - book.pages) / 2);
    if (needed > 0) setAdded(a => Math.max(a, needed));
    dismissSheet();
  };

  const pages = book.pages + added * 2;
  const total = (parseFloat(book.total) + added * EXTRA_SPREAD_PRICE).toFixed(2);
  const spreads = spreadsFor(pages);

  // A full spread is two leaves wide, so its box is 2·(pageW/pageH). The node's own
  // leaves are square (164×164) while its card reads "Large Portrait" — the WIP
  // Figma is inconsistent there, and the brief asks the spreads to represent the
  // format chosen on the previous step, so the format wins.
  const aspect = (2 * book.pageW) / book.pageH;

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
      `}</style>
      <div style={{
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
          <DetailsCard title={book.title} pages={pages} total={total} />

          {/* 23px from the card to the cover, per the node (card ends 202, cover 225) */}
          <div style={{ height: 23 }} />

          {/* Sheets are 71px apart in the node (172 → 243). A block is the sheet plus
              its 24px caption strip, so the column gap is 47 and the add-spread pill
              overhangs 31px into it. */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 47,
            padding: `0 ${GUTTER}px`, boxSizing: 'border-box',
          }}>
            <CoverBlock aspect={aspect} />
            {spreads.map(([l, r], i) => (
              <SpreadBlock key={i} aspect={aspect} left={l} right={r} photos={placed}
                           showPlus={i < spreads.length - 1}
                           onAdd={() => setAdded(n => n + 1)} />
            ))}
          </div>

          {/* The toolbar is absolutely positioned over the scroller, so the content
              needs matching room at the end or the last spread is trapped under it
              with no scroll left. */}
          <div aria-hidden style={{ height: 'calc(139px + env(safe-area-inset-bottom, 0px))' }} />
        </div>
      </div>

      <Header onClose={() => window.navigation.pop()} />
      <Toolbar photos={uploaded} />

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
    </div>
  );
}
