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
function leafBox(left) {
  return {
    width: '50%', height: '100%', boxSizing: 'border-box',
    background: left ? '#F5F5F5' : '#FFFFFF',
    boxShadow: '0px 1px 1.5px rgba(0,0,0,0.3), 0px 1px 1.5px rgba(0,0,0,0.1)',
    paddingTop: 8, paddingBottom: 8,
    paddingLeft: left ? 8 : 12, paddingRight: left ? 12 : 8,
    display: 'flex',
  };
}

function Leaf({ side, photos, onOpen, label, layout }) {
  const left = side === 'left';
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
      style={Object.assign(leafBox(left), {
      cursor: onOpen ? 'pointer' : 'default',
      // The press scale reads as the page being pushed in toward the spine rather
      // than the whole sheet shrinking, which is what a centred origin would give.
      transformOrigin: left ? 'right center' : 'left center',
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
    })}>
      {/* A relative box for the layout to position its slots inside; with no layout
          set LayoutWell falls back to the single full-page well the node draws. */}
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        <LayoutWell layout={layout} photos={photos} />
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
function PhotoWell({ photo, style, iconSize = 24 }) {
  return (
    <div aria-hidden style={Object.assign({
      position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden',
      background: '#D9D9D9',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      WebkitUserSelect: 'none', userSelect: 'none',
    }, style)}>
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
  ],
  3: [
    [{ x: 0, y: 0, w: 64.5, h: 100 },
     { x: 67.5, y: 0, w: 32.5, h: 48.5 }, { x: 67.5, y: 51.5, w: 32.5, h: 48.5 }],
    [{ x: 0, y: 0, w: 100, h: 64.5 },
     { x: 0, y: 67.5, w: 48.5, h: 32.5 }, { x: 51.5, y: 67.5, w: 48.5, h: 32.5 }],
    [{ x: 0, y: 0, w: 100, h: 31.333 }, { x: 0, y: 34.333, w: 100, h: 31.333 },
     { x: 0, y: 68.667, w: 100, h: 31.333 }],
  ],
  4: [
    [{ x: 0, y: 0, w: 48.5, h: 48.5 }, { x: 51.5, y: 0, w: 48.5, h: 48.5 },
     { x: 0, y: 51.5, w: 48.5, h: 48.5 }, { x: 51.5, y: 51.5, w: 48.5, h: 48.5 }],
    [{ x: 0, y: 0, w: 64.5, h: 100 },
     { x: 67.5, y: 0, w: 32.5, h: 31.333 }, { x: 67.5, y: 34.333, w: 32.5, h: 31.333 },
     { x: 67.5, y: 68.667, w: 32.5, h: 31.333 }],
    [{ x: 0, y: 0, w: 100, h: 22.75 }, { x: 0, y: 25.75, w: 100, h: 22.75 },
     { x: 0, y: 51.5, w: 100, h: 22.75 }, { x: 0, y: 77.25, w: 100, h: 22.75 }],
  ],
  // The chip reads "5+", so this set runs 5, 5 and 6 slots.
  5: [
    [{ x: 0, y: 0, w: 100, h: 64.5 },
     { x: 0, y: 67.5, w: 22.75, h: 32.5 }, { x: 25.75, y: 67.5, w: 22.75, h: 32.5 },
     { x: 51.5, y: 67.5, w: 22.75, h: 32.5 }, { x: 77.25, y: 67.5, w: 22.75, h: 32.5 }],
    [{ x: 0, y: 0, w: 48.5, h: 48.5 }, { x: 51.5, y: 0, w: 48.5, h: 48.5 },
     { x: 0, y: 51.5, w: 31.333, h: 48.5 }, { x: 34.333, y: 51.5, w: 31.333, h: 48.5 },
     { x: 68.667, y: 51.5, w: 31.333, h: 48.5 }],
    [{ x: 0, y: 0, w: 31.333, h: 48.5 }, { x: 34.333, y: 0, w: 31.333, h: 48.5 },
     { x: 68.667, y: 0, w: 31.333, h: 48.5 },
     { x: 0, y: 51.5, w: 31.333, h: 48.5 }, { x: 34.333, y: 51.5, w: 31.333, h: 48.5 },
     { x: 68.667, y: 51.5, w: 31.333, h: 48.5 }],
  ],
};

// Chip order — node 451:14988..14997. "5+ photos" is the node's own label.
const LAYOUT_COUNTS = [1, 2, 3, 4, 5];
const countLabel = c =>
  (c === 1 ? '1 photo' : c === 5 ? '5+ photos' : `${c} photos`);

// A layout is stored as "<count>-<index>" so it survives a reload as a plain string
// and stays readable in sessionStorage.
const FULL_PAGE = LAYOUTS[1][0];
function layoutById(id) {
  if (!id) return null;
  const parts = String(id).split('-');
  const set = LAYOUTS[parts[0]];
  return (set && set[Number(parts[1])]) || null;
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
  return slotPhotos(entry, pool).slice(0, count);
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
function LayoutWell({ layout, photos, iconSize = 24, style, onSelect, selected }) {
  const slots = layout && layout.length ? layout : FULL_PAGE;
  const pickable = !!onSelect;
  return (
    // aria-hidden only while the slots are decorative; with onSelect they are real
    // controls and hiding them would take them off assistive tech too.
    <div aria-hidden={pickable ? undefined : true}
         style={Object.assign({ position: 'absolute', inset: 0 }, style)}>
      {slots.map((s, i) => {
        const photo = photos && photos[i];
        // Scale the empty-state glyph with the slot: 24px swamps a 22%-tall track,
        // and PhotoWell's overflow:hidden would simply clip it.
        const icon = Math.max(10, Math.round(iconSize * Math.min(s.w, s.h) / 100));
        const box = {
          position: 'absolute',
          left: `${s.x}%`, top: `${s.y}%`, width: `${s.w}%`, height: `${s.h}%`,
        };
        // Only a slot with a photo in it can be selected — an empty well has nothing
        // to select, and the node only ever shows a filled photo ringed.
        if (!pickable || !photo) {
          return <PhotoWell key={i} photo={photo} iconSize={icon}
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
            <PhotoWell photo={photo} iconSize={icon}
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
function CoverInterior({ onOpen, layout }) {
  return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div aria-hidden style={{
            position: 'absolute', left: 6, bottom: 5, width: 50, height: 18,
            background: '#D9D9D9',
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
            display: 'flex', flexDirection: 'column',
            cursor: onOpen ? 'pointer' : 'default',
            transformOrigin: 'left center',
            transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
          }}>
            {/* node 451:15628/15629 — SF Pro Text Bold 16/20, bottom-aligned in a 31px block */}
            <div style={{ height: 31, padding: 4, boxSizing: 'border-box',
                          display: 'flex', alignItems: 'flex-end' }}>
              <span style={{ fontFamily: TEXT, fontWeight: 700, fontSize: 16,
                             lineHeight: '20px', color: '#000000' }}>Add text</span>
            </div>
            <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
              <LayoutWell layout={layout} photos={[]} />
            </div>
          </div>
        </div>
  );
}

function CoverBlock({ aspect, onOpen, layout }) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Sheet aspect={aspect} interior={<CoverInterior onOpen={onOpen} layout={layout} />}>
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
                      layoutFor, pool }) {
  const name = n => (n ? `page ${n}` : 'the inside cover');
  const at = (n, side) => {
    const layout = layoutFor && layoutFor(side);
    return pagePhotos(photos, n, layout ? layout.length : 1, pool);
  };
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Sheet aspect={aspect} interior={
        <React.Fragment>
          <Leaf side="left" photos={at(left, 'left')} label={name(left)}
                layout={layoutFor && layoutFor('left')}
                onOpen={onOpen && (() => onOpen('left'))} />
          <Leaf side="right" photos={at(right, 'right')} label={name(right)}
                layout={layoutFor && layoutFor('right')}
                onOpen={onOpen && (() => onOpen('right'))} />
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

// Page view's toolbar — node 520:26509. A different, later toolset than the book
// view's 451:15574 row: eight tools laid out from the left with gap 8 rather than six.
// "delete page" is the node's own casing; sentence case here, like its siblings.
// All eight are inert, on the same footing as the book view's tools.
const PV_TOOLS = [
  { id: 'photos',   label: 'Photos',       icon: 'pb-editor-tool-photos.svg' },
  { id: 'addphoto', label: 'Add photo',    icon: 'pb-editor-tool-addphoto.svg' },
  { id: 'addtext',  label: 'Add text',     icon: 'pb-editor-tool-addtext.svg' },
  { id: 'layout',   label: 'Layout',       icon: 'pb-editor-tool-layout.svg' },
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
// Only "Back" is live (it deselects, which is what the node's leading position and
// back arrow mean). Replace, Edit, Move, Delete and Ask AI are inert, on the same
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
function BigLeaf({ side, slotRef, children }) {
  const left = side === 'left';
  return (
    <div ref={slotRef} style={{
      position: 'relative', width: '50%', height: '100%',
      background: left
        ? 'linear-gradient(to right, #FFFFFF 96.188%, #EEEEEE 100.29%)'
        : 'linear-gradient(to left, #FFFFFF 96.188%, #DFDFDF 100.05%)',
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
function BigWell({ photos, layout, pageW, onSelect, selected }) {
  return (
    <div style={{
      position: 'absolute',
      left: PV_WELL.left, right: PV_WELL.right,
      top: PV_WELL.top, bottom: PV_WELL.bottom,
    }}>
      <LayoutWell layout={layout} photos={photos}
                  iconSize={Math.round(pageW * 0.13)}
                  onSelect={onSelect} selected={selected} />
    </div>
  );
}

// ── Cover unit. Not shown in the node's page view — it opens on page "0" — so this
// follows CoverBlock in the book view: the back cover carries the placeholder block
// bottom-left, the front carries "Add text" over a well. Both are expressed as
// fractions of the page so the cover reads the same zoomed in as it does zoomed out.
function CoverUnit({ w, h, pageW, frontRef, layout }) {
  return (
    <BookUnit w={w} h={h}>
      <BigLeaf side="left">
        <span aria-hidden style={{
          position: 'absolute', left: PV_WELL.left, bottom: PV_WELL.bottom,
          width: '30%', height: '11%', background: '#D9D9D9',
        }} />
      </BigLeaf>
      <BigLeaf side="right" slotRef={frontRef}>
        <div style={{
          position: 'absolute',
          left: PV_WELL.left, right: PV_WELL.right,
          top: PV_WELL.top, bottom: PV_WELL.bottom,
          display: 'flex', flexDirection: 'column', gap: Math.round(pageW * 0.03),
        }}>
          <span style={{
            fontFamily: TEXT, fontWeight: 700, color: '#000000',
            fontSize: Math.round(pageW * 0.098), lineHeight: 1.25,
          }}>Add text</span>
          <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <LayoutWell layout={layout} photos={[]}
                        iconSize={Math.round(pageW * 0.13)} />
          </div>
        </div>
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
// The top 13% of the linear layer is fully transparent and the radial's centre stop
// is only 20% black, so the page preview reads faintly through the drawer's top
// edge. That is deliberate — do not flatten it to a solid fill.
const DRAWER_FILL =
  'linear-gradient(180deg, rgba(0,0,0,0) 13.3%, rgba(39,39,39,0.8) 35.961%),' +
  ' radial-gradient(169.8% 60.96% at 50.13% -5.54%,' +
  ' rgba(0,0,0,0.2) 0%, rgba(18,18,18,0.6) 50%, #232323 100%)';

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
        background: '#FFFFFF', borderRadius: 4,
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
      borderRadius: '24px 24px 0 0', backgroundImage: DRAWER_FILL,
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
                      selected={selected === `${count}-${i}`}
                      onClick={() => onPick(i)} />
        ))}
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
                   layouts, onSetLayout, onSwapPages, onBack, onAdd }) {
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

  const openDrawer = () => {
    // The drawer covers the toolbar the selection would be driven from, and changing
    // the template can change how many slots a page has — so a selection cannot
    // survive it.
    setSelected(null);
    const cur = layouts[active] || null;
    // The node opens on the "2 photos" tab with its first card selected.
    const c = cur ? Number(String(cur).split('-')[0]) : 2;
    setTarget(active);
    setCount(c);
    setDraft(cur || `${c}-0`);
    setDrawer('open');
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
  const layoutFor = i =>
    layoutById(drawer && i === target ? draft : layouts[i]);

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

  const photoFor = s => pageThumb(placed, s.n);
  const spreads = spreadsFor(pages);
  const pageAt = (n, layout) =>
    pagePhotos(placed, n, layout ? layout.length : 1, uploaded);
  // Slot indices are 0 for the cover then two per spread, so a spread's leaves are
  // 1 + 2i and 2 + 2i. Added spreads are appended, so existing indices never move.
  const leafRef = i => el => { leafRefs.current[i] = el; };
  // Tapping a photo selects it; the strip is only pickable while the drawer is down.
  const pick = slot => (drawer ? null : (i => setSelected({ slot, i })));
  const selectedIn = slot =>
    (selected && selected.slot === slot ? selected.i : null);

  return (
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
          bottom: drawer ? PV_DRAWER_H : 'calc(235px + env(safe-area-inset-bottom, 0px))',
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
                       layout={layoutFor(0)} />
            {spreads.map(([l, r], i) => (
              <BookUnit key={i} w={bookW} h={bookH}>
                <BigLeaf side="left" slotRef={leafRef(1 + 2 * i)}>
                  <BigWell photos={pageAt(l, layoutFor(1 + 2 * i))}
                           layout={layoutFor(1 + 2 * i)} pageW={pageW}
                           onSelect={pick(1 + 2 * i)} selected={selectedIn(1 + 2 * i)} />
                </BigLeaf>
                <BigLeaf side="right" slotRef={leafRef(2 + 2 * i)}>
                  <BigWell photos={pageAt(r, layoutFor(2 + 2 * i))}
                           layout={layoutFor(2 + 2 * i)} pageW={pageW}
                           onSelect={pick(2 + 2 * i)} selected={selectedIn(2 + 2 * i)} />
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
                 tools={selected ? SELECTED_TOOLS : PV_TOOLS}
                 gap={selected ? 4 : 8} padX={selected ? 0 : 16}
                 onTool={id => {
                   if (selected) { if (id === 'back') setSelected(null); return; }
                   if (id === 'layout') openDrawer();
                 }} />
      )}

      {drawer && (
        <LayoutDrawer
          closing={drawer === 'closing'} count={count} selected={draft}
          options={LAYOUTS[count] || []} pageAspect={pageAspect}
          photos={slotPhotos(photoFor(slots[target]), uploaded)}
          onCount={c => { setCount(c); setDraft(`${c}-0`); }}
          onPick={i => setDraft(`${count}-${i}`)}
          onClose={closeDrawer} onConfirm={confirmDrawer}
        />
      )}
    </div>
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
            Drag and drop photo to move it,<br />
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
  return (
    <div onDragStart={e => e.preventDefault()}
         onPointerDown={n ? leafDown : undefined}
         style={Object.assign(leafBox(left), {
      position: 'relative',
      cursor: n && leafDown ? 'grab' : undefined,
      WebkitTapHighlightColor: 'transparent',
      WebkitUserSelect: 'none', userSelect: 'none',
      // The list scrolls vertically and a photo is most of a leaf, so the gesture is
      // only claimed once the press-and-hold fires — see the comment on the gesture
      // in ArrangeView. touch-action therefore stays at its default here.
    })}>
      <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
        {slots.map((sl, i) => {
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
              <PhotoWell photo={hole ? null : photo}
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
function ArrangeView({ aspect, pages, placed, uploaded, layouts,
                      onSwapSlots, onSwapPages, onMoveSpread, onAdd, onDone }) {
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
      if (over !== from) onSwapSlots(parseSlot(from), parseSlot(over));
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
            <Sheet aspect={aspect} interior={<CoverInterior layout={layoutById(layouts[0])} />}>
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
              <ArrangeCaption left={pair[0]} right={pair[1]}
                              onAdd={i < spreads.length - 1 ? () => onAdd() : null} />
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
  const { useState, useEffect, useRef } = React;
  const [book] = useState(readBook);
  const [incoming] = useState(readIncomingPhotos);
  const [uploaded] = useState(() => incoming || readList('pb_uploaded'));
  const [placed, setPlaced] = useState(() => readList('pb_placed'));
  const [layouts, setLayouts] = useState(readLayouts);
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
  };

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
      `}</style>

      {arrange ? (
        <ArrangeView
          aspect={aspect} pages={pages} placed={placed}
          uploaded={uploaded} layouts={layouts}
          onSwapSlots={swapSlots} onSwapPages={swapPhotos} onMoveSpread={moveSpread}
          onAdd={() => setAdded(n => n + 1)}
          onDone={() => setArrange(false)}
        />
      ) : pageView !== null ? (
        <PageView
          aspect={aspect} pageAspect={pageAspect} pages={pages}
          placed={placed} uploaded={uploaded}
          layouts={layouts} onSetLayout={setLayout} onSwapPages={swapPhotos}
          startSlot={pageView} onBack={() => setPageView(null)}
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
            <CoverBlock aspect={aspect} onOpen={() => openPage(0)}
                        layout={layoutById(layouts[0])} />
            {spreads.map(([l, r], i) => (
              <SpreadBlock key={i} aspect={aspect} left={l} right={r} photos={placed}
                           showPlus={i < spreads.length - 1}
                           onAdd={() => setAdded(n => n + 1)}
                           pool={uploaded}
                           /* Slot 0 is the cover, then two per spread — the same
                              indices the page view and pb_layouts use. */
                           layoutFor={side => layoutById(
                             layouts[1 + 2 * i + (side === 'right' ? 1 : 0)])}
                           onOpen={side => openPage(1 + 2 * i + (side === 'right' ? 1 : 0))} />
            ))}
          </div>

          {/* The toolbar is absolutely positioned over the scroller, so the content
              needs matching room at the end or the last spread is trapped under it
              with no scroll left. */}
          <div aria-hidden style={{ height: 'calc(139px + env(safe-area-inset-bottom, 0px))' }} />
        </div>
      </div>

      <Header onClose={() => window.navigation.pop()} />
      {/* Arrange is the book view's one live tool; the other five are inert. */}
      <Toolbar photos={uploaded}
               onTool={id => { if (id === 'arrange') openArrange(); }} />

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
    </div>
  );
}
