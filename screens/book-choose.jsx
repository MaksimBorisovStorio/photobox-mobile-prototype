// screens/book-choose.jsx — Figma node 696:3772 "Book preview (add to basket)"
//
// Reached from Create → Photo books (memory-create). It does the choosing for you: the
// book opens on the recommended cover, format and size, priced, with a Create button — and
// each of the three rows opens a sheet to change it. Create writes the resolved choice to
// sessionStorage.pb_book (the same shape product-photobook's bookConfig writes) and the
// album's photos to pb_photos, then pushes the editor, which offers to auto-fill them.
//
// The middle of the page is a swipeable carousel of five suggestions, each a different cover style
// (a photo classic, then four bold typographic covers in the manner of travel-guide coffee-table books:
// big colour fields, a heavy display word, the album photo in a shape). Swiping picks that suggestion's
// cover / format / size and the three rows below follow it; changing a row afterwards customises it.
//
// Deviations: the node's hero is a flat export of one specific book; here it is drawn live
// so it follows the chosen format and cover. Its "Hardcover / Landscape / Medium (20x20 cm)"
// is inconsistent with a landscape format, so Medium uses the 20 × 15 the product page has.
// Prices reuse product-photobook's reverse-engineered model. Names are BC_-prefixed because
// top-level declarations in classic scripts share one global lexical scope.

// The app's UI colours (shared/brand.jsx): paper page, green primary, ink headings.
const BC_DISPLAY = PB_DISPLAY;
const BC_TEXT    = PB_DISPLAY;
const BC_TEAL    = PB_GREEN;
const BC_DEEP    = PB_INK;
const BC_MINT    = '#FFFFFF';

const BC_COVERS = [
  { id: 'softcover', title: 'Softcover',            note: 'Light and flexible',          add: 0,  layflat: false },
  { id: 'hardcover', title: 'Hardcover',            note: 'Sturdy, with a rigid spine',  add: 10, layflat: false },
  { id: 'cutout',    title: 'Cut-out',              note: 'A shaped window onto your photo', add: 15, layflat: false },
];
const BC_FORMATS = [
  { id: 'landscape', title: 'Landscape', ratio: 4 / 3 },
  { id: 'portrait',  title: 'Portrait',  ratio: 3 / 4 },
  { id: 'square',    title: 'Square',    ratio: 1 },
];
const BC_SIZES = {
  landscape: [['xl', 'Extra large', 39, 29], ['l', 'Large', 28, 21], ['m', 'Medium', 20, 15]],
  portrait:  [['xl', 'Extra large', 29, 39], ['l', 'Large', 21, 28], ['m', 'Medium', 15, 20]],
  square:    [['xl', 'Extra large', 30, 30], ['l', 'Large', 21, 21], ['m', 'Medium', 15, 15]],
};
const BC_SIZE_BASE = { xl: 34.99, l: 29.99, m: 24.99 };

// What we recommend, first, then four other looks. Each is a complete cover / format / size, plus a
// `design` (how the cover is drawn here) and `editor`, what the editor starts the cover with
// (`pb_cover_design`, and `paper` → `pb_colors[0]`). All three choices can be changed below.
const BC_PRESETS = [
  { id: 'classic', design: 'classic', eyebrow: 'RECOMMENDED FOR THIS ALBUM',
    sel: { cover: 'hardcover', format: 'landscape', size: 'm' }, editor: { design: 'classic' } },
  { id: 'sorbet', design: 'sorbet', eyebrow: 'BOLD AND PLAYFUL',
    sel: { cover: 'hardcover', format: 'portrait', size: 'm' }, editor: { design: 'band', paper: '#F7A8C4' } },
  { id: 'aegean', design: 'aegean', eyebrow: 'THE STATEMENT COVER',
    sel: { cover: 'hardcover', format: 'portrait', size: 'l' }, editor: { design: 'round', paper: '#22379B' } },
  { id: 'garden', design: 'garden', eyebrow: 'FRESH AND LIVELY',
    sel: { cover: 'softcover', format: 'square', size: 'm' }, editor: { design: 'framed', paper: '#2E9A57' } },
  { id: 'full', design: 'full', eyebrow: 'LET THE PHOTO SPEAK',
    sel: { cover: 'hardcover', format: 'landscape', size: 'l' }, editor: { design: 'bleed' } },
];
const BC_PICK = BC_PRESETS[0].sel;

const BC_TRIP = window.PB_TRIP_ITALY;
const BC_ALBUM = {
  title: 'Trip to Italy',
  place: 'Italy',                 // the word the bold covers are built around
  photo: BC_TRIP.cover,
  // every photo of the album, in group order — handed to the editor for auto-fill
  photos: BC_TRIP.groups.reduce((all, g) => all.concat(g.photos), []),
};

// ── "Photo book options": the same screen opened from the editor's details card (`book-choose.html?options`).
// It edits the book you are already making — so no suggestions to swipe and no eyebrow, it starts from `pb_book`,
// adds a Lay-flat toggle, and Save writes `pb_book` back and returns to the editor (which reloads to pick it up).
const BC_Q = new URLSearchParams(location.search);
const BC_OPTIONS = BC_Q.has('options');
const BC_LAYFLAT_ADD = 5;                                 // the editor's LAYFLAT_ADD_PRICE
const BC_EDITOR_DESIGN = { classic: 'classic', band: 'sorbet', round: 'aegean', framed: 'garden', bleed: 'full' };
const bcRead = (k, d) => { try { const v = sessionStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } };
const BC_BOOK = BC_OPTIONS ? bcRead('pb_book', {}) : {};
function bcFromBook(b) {
  if (b.sel) return b.sel;
  const format = b.pageW > b.pageH ? 'landscape' : b.pageW < b.pageH ? 'portrait' : 'square';
  const z = BC_SIZES[format].find(r => r[2] === b.pageW && r[3] === b.pageH);
  const cov = BC_COVERS.find(c => b.cover && c.title.toLowerCase() === String(b.cover).toLowerCase().replace('soft cover', 'softcover'));
  return { cover: cov ? cov.id : 'hardcover', format, size: z ? z[0] : 'l' };
}
if (BC_OPTIONS) {
  // the book's own cover photo and title, as the editor has them
  const cov = bcRead('pb_cover', []);
  const ph = (Array.isArray(cov) ? cov : []).find(x => typeof x === 'string');
  if (ph) BC_ALBUM.photo = ph;
  try { BC_ALBUM.title = sessionStorage.getItem('pb_cover_title') || BC_ALBUM.title; } catch (e) {}
}

function bcSize(format, id) {
  const s = BC_SIZES[format].find(z => z[0] === id);
  return { id: s[0], title: s[1], w: s[2], h: s[3], dim: `${s[2]} x ${s[3]} cm` };
}
function bcPrice(sel) {
  const cov = BC_COVERS.find(c => c.id === sel.cover);
  return BC_SIZE_BASE[sel.size] + cov.add;
}

// ── The book, drawn live: spine band, cover, title. `design` picks the cover's look; its type and
// shapes are sized in container units (cqw / cqh of the cover), so they scale with the format. ──
const BC_HEAVY = `${PB_DISPLAY}`;
function BcCover({ design, album }) {
  const photo = (extra) => (
    <img src={album.photo} alt="" draggable={false} style={{ position: 'absolute', objectFit: 'cover', display: 'block', ...extra }} />
  );
  const word = (txt, extra) => (
    <span style={{ position: 'absolute', fontFamily: BC_HEAVY, fontWeight: 900, textTransform: 'uppercase', whiteSpace: 'nowrap',
      lineHeight: 0.86, letterSpacing: '-0.035em', ...extra }}>{txt}</span>
  );
  const ph = album.place;
  if (design === 'cutout') return (
    <div style={{ position: 'absolute', inset: 0, background: '#0E6F66' }}>
      <div style={{ position: 'absolute', left: '50%', top: '47%', width: '58cqmin', height: '58cqmin', transform: 'translate(-50%, -50%)',
        borderRadius: '50%', overflow: 'hidden', boxShadow: '0 0 0 1.4cqmin #0A544D, 0 0 0 2cqmin rgba(255,255,255,.18)' }}>
        <img src={album.photo} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: 'inset 0 1.2cqmin 2.6cqmin rgba(0,0,0,.5)' }} />
      </div>
      {word(album.title, { left: 0, right: 0, bottom: '6cqh', textAlign: 'center', fontSize: '6cqw', color: '#fff', fontWeight: 800, letterSpacing: '.06em' })}
    </div>
  );
  if (design === 'sorbet') return (
    <div style={{ position: 'absolute', inset: 0, background: '#F7A8C4' }}>
      {word('Trip to', { left: '8cqw', top: '7cqh', fontSize: '7cqw', color: '#B3123F', letterSpacing: '.02em' })}
      {word(ph, { left: '7cqw', top: '13cqh', fontSize: '29cqw', color: '#0B6B3F' })}
      {photo({ left: '18cqw', right: '18cqw', bottom: '7cqh', width: '64cqw', height: '52cqh',
        borderRadius: '32cqw 32cqw 1.5cqw 1.5cqw', boxShadow: '0 0 0 1.2cqw #FFF4F7' })}
    </div>
  );
  if (design === 'aegean') return (
    <div style={{ position: 'absolute', inset: 0, background: '#22379B' }}>
      {word(ph, { left: '8cqw', top: '7cqh', fontSize: '25cqw', color: '#52D6CB' })}
      {word('Trip', { left: '8cqw', top: '22cqh', fontSize: '25cqw', color: '#FFFFFF' })}
      {photo({ left: '24cqw', bottom: '12cqh', width: '52cqw', height: '52cqw', borderRadius: '50%',
        boxShadow: '0 0 0 2cqw #52D6CB, 0 0 0 4cqw #FFFFFF, 0 0 0 6cqw #7DA1FF' })}
    </div>
  );
  if (design === 'garden') return (
    <div style={{ position: 'absolute', inset: 0, background: '#2E9A57' }}>
      {photo({ left: '9cqw', top: '9cqh', width: '82cqw', height: '52cqh', borderRadius: '10cqw', boxShadow: '0 0 0 1.2cqw #F3FFF6' })}
      {word('Trip to', { left: '9cqw', top: '67cqh', fontSize: '7.5cqw', color: '#FFF3B0', letterSpacing: '.02em' })}
      {word(ph, { left: '8cqw', top: '73cqh', fontSize: '24cqw', color: '#FFE066' })}
    </div>
  );
  if (design === 'full') return (
    <div style={{ position: 'absolute', inset: 0, background: '#222' }}>
      {photo({ inset: 0, width: '100%', height: '100%' })}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,0) 38%)' }} />
      {word(album.title, { left: '6cqw', top: '7cqh', fontSize: '7cqw', color: '#fff', fontWeight: 800, letterSpacing: '.04em',
        textShadow: '0 1px 8px rgba(0,0,0,.35)' })}
    </div>
  );
  // classic: cream board, caps title, the photo inset
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#fbfaf7' }}>
      <div style={{ position: 'absolute', left: 14, top: 12, right: 14, fontFamily: 'Oswald, "Arial Narrow", ' + BC_DISPLAY,
        fontWeight: 700, fontSize: 14, letterSpacing: '.02em', textTransform: 'uppercase', color: '#111', lineHeight: 1 }}>{album.title}</div>
      {photo({ left: 14, right: 14, top: 34, bottom: 14, width: 'calc(100% - 28px)', height: 'calc(100% - 48px)' })}
    </div>
  );
}

const BC_SPINE = { cutout: '#0A544D', classic: null, sorbet: '#E88BAE', aegean: '#16276F', garden: '#1F7A40', full: null };

// The book's size on screen: the format's extra-large size is the base, the others scale down from it.
const BC_BASE = { landscape: [296, 222], portrait: [190, 253], square: [240, 240] };
const BC_SCALE = { xl: 1, l: 0.9, m: 0.8 };
function bcDims(sel) { const [w, h] = BC_BASE[sel.format]; const k = BC_SCALE[sel.size]; return [w * k, h * k]; }
const BC_EASE = 'cubic-bezier(.2,.8,.2,1)';

// The book as the choices describe it. Size and format animate the box; the cover type changes how the book
// is built — softcover is thin and flexes, hardcover is a rigid board with real thickness, lay-flat is
// a cut-out, with the photo running across the fold.
function BookHero({ sel, design = 'classic' }) {
  const cov = BC_COVERS.find(c => c.id === sel.cover);
  const [W, H] = bcDims(sel);
  const look = cov.id === 'cutout' ? 'cutout' : design;     // a cut-out cover has its own drawing
  const tint = BC_SPINE[look];
  const grow = `width .35s ${BC_EASE}, height .35s ${BC_EASE}`;

  const soft = cov.id === 'softcover';
  const spine = soft ? 8 : 14;
  return (
    <div key={sel.format + sel.cover} style={{ position: 'relative', width: W, height: H, transition: grow,
      animation: 'bcPop .45s cubic-bezier(.2,.8,.2,1) both',
      borderRadius: soft ? 3 : 2, background: '#fff',
      boxShadow: soft
        ? '0 16px 22px -10px rgba(0,40,40,.28), 0 1px 2px rgba(0,0,0,.16)'
        : '1px 1px 0 #d4dbdb, 2px 2px 0 #c9d1d1, 3px 3px 0 #bec7c7, 4px 4px 0 #b3bdbd, 6px 26px 28px -10px rgba(0,40,40,.38)' }}>
      {/* spine: a soft crease for softcover, a rigid hinge groove for hardcover */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: spine, borderRadius: soft ? '3px 0 0 3px' : '2px 0 0 2px',
        background: tint ? `linear-gradient(90deg, ${tint}, ${tint} 60%, rgba(0,0,0,.18))`
          : 'linear-gradient(90deg, #cfd6d6, #f4f6f6 40%, #dfe5e5 70%, #c4cccc)' }} />
      {!soft && <div style={{ position: 'absolute', left: spine - 1, top: 0, bottom: 0, width: 3,
        background: 'linear-gradient(90deg, rgba(0,0,0,.28), rgba(255,255,255,.35) 55%, rgba(0,0,0,0))' }} />}
      <div style={{ position: 'absolute', left: spine, top: 0, right: 0, bottom: 0, borderRadius: soft ? '0 3px 3px 0' : '0 2px 2px 0',
        overflow: 'hidden', containerType: 'size' }}>
        <BcCover design={look} album={BC_ALBUM} />
        {/* page-edge sheen, plus a flexing highlight on softcover and a hard rim on hardcover */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,.10), rgba(0,0,0,0) 8%)' }} />
        {soft
          ? <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(118deg, rgba(255,255,255,.30), rgba(255,255,255,0) 34%, rgba(0,0,0,.07) 100%)' }} />
          : <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.14), inset -2px -2px 0 rgba(0,0,0,.06)' }} />}
      </div>
    </div>
  );
}

// ── One of the three summary rows ──
function BcRow({ icon, label, value, onTap, last }) {
  return (
    <div role="button" onClick={onTap} {...press(0.98)} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 56, padding: '0 16px',
      boxSizing: 'border-box', cursor: 'pointer', borderBottom: last ? 'none' : '1px solid rgba(0,75,83,.08)', transition: 'transform 140ms ease',
      WebkitTapHighlightColor: 'transparent' }}>
      <img src={`../shared/assets/${icon}`} alt="" width={24} height={24} style={{ display: 'block' }} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', gap: 8, fontFamily: BC_TEXT, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden' }}>
        <span style={{ fontWeight: 700, color: BC_DEEP }}>{label}</span>
        <span style={{ color: BC_TEAL, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0, color: BC_TEAL }}><path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
}

// ── The Lay-flat row (options screen only): a premium upgrade, so a switch rather than a sheet ──
function BcToggleRow({ on, onToggle }) {
  return (
    <div role="switch" aria-checked={on} onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 56, padding: '0 16px',
      boxSizing: 'border-box', cursor: 'pointer', borderTop: '1px solid rgba(0,75,83,.08)', WebkitTapHighlightColor: 'transparent' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BC_DEEP} strokeWidth="1.7" strokeLinejoin="round" style={{ flexShrink: 0 }}>
        <path d="M2.5 6.5c3-1.6 6.2-1.6 9.5 0 3.3-1.6 6.5-1.6 9.5 0v11c-3-1.6-6.2-1.6-9.5 0-3.3-1.6-6.5-1.6-9.5 0z" /><path d="M12 6.5v11" />
      </svg>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, fontFamily: BC_TEXT, fontSize: 15 }}>
        <span style={{ fontWeight: 700, color: BC_DEEP, whiteSpace: 'nowrap' }}>Lay-flat pages</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: '#F6EBC8', color: '#7A5A12' }}>Premium</span>
      </div>
      <span style={{ fontFamily: BC_TEXT, fontSize: 15, fontWeight: 600, color: BC_TEAL }}>+€{BC_LAYFLAT_ADD}</span>
      <span aria-hidden style={{ position: 'relative', width: 51, height: 31, borderRadius: 16, flexShrink: 0, transition: 'background .2s ease',
        background: on ? BC_TEAL : 'rgba(2,60,66,.16)' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 27, height: 27, borderRadius: 14, background: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,.18)', transition: `left .2s ${BC_EASE}` }} />
      </span>
    </div>
  );
}

// ── Option sheet: tapping an option chooses it at once and the book above changes with it; Done closes ──
function BcSheet({ title, options, value, onPick, onClose, onHeight }) {
  const [closing, setClosing] = React.useState(false);
  const panel = React.useRef(null);
  React.useLayoutEffect(() => {
    const el = panel.current;
    if (!el) return undefined;
    const report = () => onHeight(el.offsetHeight);
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const close = () => {
    setClosing(true);
    onHeight(0);                       // the book above starts coming back down with the sheet
    setTimeout(onClose, 240);
  };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30 }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'transparent',
        animation: `${closing ? 'bcFadeOut' : 'bcFade'} .22s ease both` }} />
      <div ref={panel} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '24px 24px 0 0',
        padding: '20px 20px calc(20px + env(safe-area-inset-bottom, 0px))', boxShadow: '0 -8px 30px -8px rgba(0,50,50,.25)',
        animation: `${closing ? 'bcDown' : 'bcUp'} .28s cubic-bezier(.2,.8,.2,1) both` }}>
        <div style={{ width: 36, height: 5, borderRadius: 3, background: '#D5E0E0', margin: '-8px auto 14px' }} />
        <div style={{ fontFamily: BC_DISPLAY, fontSize: 20, fontWeight: 700, color: BC_DEEP, marginBottom: 4 }}>{title}</div>
        <div style={{ fontFamily: BC_TEXT, fontSize: 14, color: '#5E7575', marginBottom: 16 }}>Watch the book above as you choose.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map(o => {
            const on = o.id === value;
            return (
              <div key={o.id} role="button" onClick={() => onPick(o.id)} {...press(0.98)} style={{ display: 'flex', alignItems: 'center', gap: 12,
                padding: 14, borderRadius: 16, cursor: 'pointer', border: `2px solid ${on ? BC_TEAL : '#DCE8E8'}`, background: on ? '#F2F8F8' : '#fff',
                transition: 'transform 140ms ease, border-color 200ms, background 200ms', WebkitTapHighlightColor: 'transparent' }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, boxSizing: 'border-box', border: `2px solid ${on ? BC_TEAL : '#B9C9C9'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <div style={{ width: 11, height: 11, borderRadius: 6, background: BC_TEAL }} />}
                </div>
                {o.thumb}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: BC_TEXT, fontSize: 16, fontWeight: 700, color: BC_DEEP }}>{o.title}</div>
                  {o.note && <div style={{ fontFamily: BC_TEXT, fontSize: 13, color: '#5E7575', lineHeight: '18px', marginTop: 2 }}>{o.note}</div>}
                </div>
                {o.tag && <span style={{ fontFamily: BC_TEXT, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap',
                  color: o.tag === 'Included' ? '#5E7575' : BC_DEEP }}>{o.tag}</span>}
              </div>
            );
          })}
        </div>
        <button onClick={close} {...press(0.97)} style={{ ...pbButton('primary'), width: '100%', marginTop: 18 }}>Done</button>
      </div>
    </div>
  );
}

// The numbers behind one selection, shared by the carousel's slides and the rows.
function bcSpec(sel) {
  const cov = BC_COVERS.find(c => c.id === sel.cover);
  const fmt = BC_FORMATS.find(f => f.id === sel.format);
  return { cov, fmt, siz: bcSize(sel.format, sel.size), price: bcPrice(sel) };
}
const bcSame = (a, b) => a.cover === b.cover && a.format === b.format && a.size === b.size;

// One slide of the carousel: the book, its eyebrow, name and price. Slides beside the centre one
// sit back — a little smaller and dimmer, text hidden — so only the book hints at the next suggestion.
function BcSlide({ preset, sel, active, ghost, compact, plain, layflat, extra = 0, pages = 24 }) {
  const { cov, fmt, siz, price } = bcSpec(sel);
  const [gw, gh] = bcDims({ ...sel, size: 'xl' });
  const stock = bcSame(sel, preset.sel);
  return (
    <div style={{ flex: '0 0 78%', scrollSnapAlign: 'center', scrollSnapStop: 'always', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 20, minWidth: 0 }}>
      <div style={{ position: 'relative', height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: active ? 'none' : 'scale(0.86)', opacity: active ? 1 : 0.7, transition: 'transform .3s ease, opacity .3s ease' }}>
        {/* while Size is open, the largest size is outlined so the others read as smaller */}
        {ghost && active && <div style={{ position: 'absolute', left: '50%', top: '50%', width: gw + 8, height: gh + 8,
          transform: 'translate(-50%, -50%)', boxSizing: 'border-box', border: '1.5px dashed rgba(0,127,112,.5)', borderRadius: 6, pointerEvents: 'none' }} />}
        <BookHero sel={sel} design={preset.design} />
      </div>
      <div style={{ display: compact ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center',
        opacity: active ? 1 : 0, transition: 'opacity .25s ease' }}>
        <span style={{ display: compact || plain ? 'none' : 'flex', alignItems: 'center', gap: 6, fontFamily: BC_TEXT, fontSize: 12, fontWeight: 700, letterSpacing: '.14em', color: BC_TEAL }}>
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M10 2.5c.4 3.9 2.1 5.6 6 6-3.9.4-5.6 2.1-6 6-.4-3.9-2.1-5.6-6-6 3.9-.4 5.6-2.1 6-6Zm8 10c.25 2.2 1.3 3.25 3.5 3.5-2.2.25-3.25 1.3-3.5 3.5-.25-2.2-1.3-3.25-3.5-3.5 2.2-.25 3.25-1.3 3.5-3.5Z" fill="currentColor" /></svg>
          {stock ? preset.eyebrow : 'CUSTOMISED'}
        </span>
        <span style={{ fontFamily: BC_DISPLAY, fontWeight: 700, fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.4px' }}>
          {cov.title} {fmt.title}<br />Photo book{layflat ? ' · Lay-flat' : ''}
        </span>
        <span style={{ fontFamily: BC_TEXT, fontSize: 16, color: '#6b8080' }}>€{(price + (layflat ? BC_LAYFLAT_ADD : 0) + extra).toFixed(2)} · {pages} pages · {siz.w} × {siz.h} cm</span>
      </div>
    </div>
  );
}

function BookChooseScreen() {
  const [idx, setIdx] = React.useState(0);               // the suggestion in the middle of the carousel
  const [sel, setSel] = React.useState(() => (BC_OPTIONS ? bcFromBook(BC_BOOK) : BC_PICK));  // its cover / format / size, plus any change made below
  const [layflat, setLayflat] = React.useState(!!BC_BOOK.layflat);   // options screen only
  const [open, setOpen] = React.useState(null);   // 'cover' | 'format' | 'size'
  const [sheetH, setSheetH] = React.useState(0);   // how tall the open sheet is — the book is lifted clear of it
  const bottom = React.useRef(null), head = React.useRef(null);
  const scroller = React.useRef(null);
  const area = React.useRef(null), inner = React.useRef(null);
  const [fit, setFit] = React.useState(1);
  // the sheet is taller than the rows + button it covers; the carousel gives up the difference
  const lift = open ? Math.max(0, sheetH - (bottom.current ? bottom.current.offsetHeight : 0)) : 0;
  // The carousel is ~400 tall; on a short phone it scales down about its centre rather than clip.
  React.useLayoutEffect(() => {
    const a = area.current, n = inner.current;
    if (!a || !n) return undefined;
    const measure = () => {
      const pad = parseFloat(getComputedStyle(a).paddingBottom) || 0;
      setFit(Math.max(0.4, Math.min(1, (a.clientHeight - pad - 8) / n.offsetHeight)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(a); ro.observe(n);
    return () => ro.disconnect();
  }, [lift]);
  const { cov, fmt, siz, price } = bcSpec(sel);
  const preset = BC_PRESETS[idx];
  // On the options screen the one slide is the book itself, drawn in the editor's cover style.
  const mine = React.useMemo(() => {
    let d = 'classic';
    try { d = BC_EDITOR_DESIGN[sessionStorage.getItem('pb_cover_design')] || 'classic'; } catch (e) {}
    return Object.assign({}, BC_PRESETS.find(p => p.design === d) || BC_PRESETS[0], { sel: bcFromBook(BC_BOOK) });
  }, []);
  const extra = BC_OPTIONS ? parseFloat(BC_Q.get('extra')) || 0 : 0;
  const pages = BC_OPTIONS ? parseInt(BC_Q.get('pages'), 10) || BC_BOOK.pages || 24 : 24;

  const save = () => {
    try {
      sessionStorage.setItem('pb_book', JSON.stringify(Object.assign({}, BC_BOOK, {
        title: `${siz.title} ${fmt.title} photo book`, total: (price + (layflat ? BC_LAYFLAT_ADD : 0)).toFixed(2),
        pageW: siz.w, pageH: siz.h, layflat, cover: cov.title, sel,
      })));
      // a cut-out cover takes the editor's round-window design in its teal board
      if (cov.id === 'cutout' && bcFromBook(BC_BOOK).cover !== 'cutout') {
        sessionStorage.setItem('pb_cover_design', 'round');
        sessionStorage.setItem('pb_colors', JSON.stringify(Object.assign(bcRead('pb_colors', {}), { 0: '#0E6F66' })));
      }
      sessionStorage.setItem('pb_book_dirty', '1');     // the editor reloads on return to pick the new book up
    } catch (e) {}
    window.navigation.pop();
  };

  // Slides are 78% of the scroller with an 11% spacer either side, so slide k is centred at
  // scrollLeft = k × slide width. Moving to another slide takes that suggestion's choices.
  const onScroll = e => {
    const el = e.currentTarget;
    const i = Math.max(0, Math.min(BC_PRESETS.length - 1, Math.round(el.scrollLeft / (el.clientWidth * 0.78))));
    if (i !== idx) { setIdx(i); setSel(BC_PRESETS[i].sel); }
  };
  const goTo = i => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: i * el.clientWidth * 0.78, behavior: 'smooth' });
  };

  const create = () => {
    try {
      sessionStorage.setItem('pb_book', JSON.stringify({
        title: `${siz.title} ${fmt.title} photo book`, pages: 24, total: price.toFixed(2),
        pageW: siz.w, pageH: siz.h, layflat: false, cover: cov.title, sel,
      }));
      // pb_photos is the flat upload; pb_groups tells the editor's auto-fill how to lay it out,
      // one chapter at a time, and which photo goes on the cover
      sessionStorage.setItem('pb_photos', JSON.stringify(BC_ALBUM.photos));
      sessionStorage.setItem('pb_groups', JSON.stringify({ cover: BC_TRIP.cover, groups: BC_TRIP.groups }));
      // the album's name goes on the cover, and its photos keep their own proportions
      sessionStorage.setItem('pb_cover_title', BC_TRIP.title);
      sessionStorage.setItem('pb_fit', 'contain');
      // the chosen suggestion's cover style: the editor's matching design, and the board colour for the bold ones
      // a cut-out cover starts on the editor's round-window design, in its teal board
      const ed = cov.id === 'cutout' ? { design: 'round', paper: '#0E6F66' } : preset.editor;
      sessionStorage.setItem('pb_cover_design', ed.design);
      sessionStorage.setItem('pb_colors', JSON.stringify(ed.paper ? { 0: ed.paper } : {}));
    } catch (e) {}
    window.navigation.push('editor.html');
  };

  const sheets = {
    cover: { title: 'Cover type', value: sel.cover, options: BC_COVERS.map(c => ({ id: c.id, title: c.title, note: c.note, tag: c.add ? `+€${c.add}` : 'Included' })) },
    format: { title: 'Format', value: sel.format, options: BC_FORMATS.map(f => ({ id: f.id, title: f.title,
      thumb: <span style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ width: f.ratio >= 1 ? 30 : 22, height: f.ratio >= 1 ? 30 / f.ratio : 30, background: '#fff', borderRadius: 3, boxShadow: `inset 0 0 0 2px ${BC_TEAL}` }} /></span> })) },
    size: { title: 'Size', value: sel.size, options: BC_SIZES[sel.format].map(z => ({ id: z[0], title: z[1], note: `${z[2]} x ${z[3]} cm`, tag: `€${(BC_SIZE_BASE[z[0]] + cov.add).toFixed(2)}` })) },
  };
  const pick = (key, v) => setSel(s => ({ ...s, [key]: v }));

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', color: BC_DEEP,
      background: PB_PAPER,
      display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes bcPop { from { opacity: 0; transform: scale(.94) } to { opacity: 1; transform: none } }
        @keyframes bcFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes bcFadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes bcUp { from { transform: translateY(100%) } to { transform: none } }
        @keyframes bcDown { from { transform: none } to { transform: translateY(100%) } }
      `}</style>

      {/* header — the shared glass back button, title centred on it */}
      <div ref={head} style={{ position: 'relative', flexShrink: 0, paddingTop: PB_BACK_TOP, height: 44, boxSizing: 'content-box',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        // while an option sheet is up only the book is shown: the header fades out and gives its room to the book
        opacity: open ? 0 : 1, pointerEvents: open ? 'none' : 'auto', marginBottom: open && head.current ? -head.current.offsetHeight : 0,
        transition: 'opacity .2s ease' }}>
        <PbBackButton style={{ top: PB_BACK_TOP }} />
        <span style={{ fontFamily: BC_DISPLAY, fontWeight: 700, fontSize: 17, letterSpacing: '-0.2px' }}>{BC_OPTIONS ? 'Photo book options' : 'Choose your photo book'}</span>
      </div>

      {/* the middle of the page: a carousel of suggestions — swipe for another cover style */}
      <div ref={area} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        boxSizing: 'border-box', padding: `0 0 ${8 + lift}px` }}>
       <div ref={inner} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${fit})`, transformOrigin: 'center', transition: `transform .28s ${BC_EASE}` }}>
        <div ref={scroller} onScroll={onScroll} style={{ display: 'flex', width: '100%', overflowX: 'auto', overflowY: 'hidden', pointerEvents: open ? 'none' : 'auto',
          scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div aria-hidden style={{ flex: '0 0 11%' }} />
          {BC_OPTIONS
            ? <BcSlide preset={mine} sel={sel} active ghost={open === 'size'} compact={!!open} plain layflat={layflat} extra={extra} pages={pages} />
            : BC_PRESETS.map((p, i) => <BcSlide key={p.id} preset={p} sel={i === idx ? sel : p.sel} active={i === idx} ghost={open === 'size'} compact={!!open} />)}
          <div aria-hidden style={{ flex: '0 0 11%' }} />
        </div>
        <div role="tablist" aria-label="Suggestions" style={{ display: open || BC_OPTIONS ? 'none' : 'flex', gap: 8 }}>
          {BC_PRESETS.map((p, i) => (
            <button key={p.id} role="tab" aria-selected={i === idx} aria-label={`Suggestion ${i + 1} of ${BC_PRESETS.length}`} onClick={() => goTo(i)}
              style={{ width: i === idx ? 22 : 8, height: 8, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer',
                background: i === idx ? BC_TEAL : 'rgba(2,60,66,.2)', transition: 'width .25s ease, background .25s ease', WebkitTapHighlightColor: 'transparent' }} />
          ))}
        </div>
       </div>
      </div>

      {/* choices + CTA: a floating card with margins, as home's cards */}
      <div ref={bottom} style={{ flexShrink: 0, padding: '0 16px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: 'inset 0 0 0 1px #fff, 0 4px 16px -1px rgba(0,77,74,.12)', overflow: 'hidden' }}>
          <BcRow icon="bc-icon-photobook.svg" label="Cover type" value={cov.title} onTap={() => setOpen('cover')} />
          <BcRow icon="bc-icon-crop.svg" label="Format" value={fmt.title} onTap={() => setOpen('format')} />
          <BcRow icon="bc-icon-size.svg" label="Size" value={`${siz.title} (${siz.w}x${siz.h} cm)`} onTap={() => setOpen('size')} last />
          {BC_OPTIONS && <BcToggleRow on={layflat} onToggle={() => setLayflat(v => !v)} />}
        </div>
        <button onClick={BC_OPTIONS ? save : create} {...press(0.97)} style={pbButton('primary')}>{BC_OPTIONS ? 'Save changes' : 'Create'}</button>
      </div>

      {open && <BcSheet key={open} {...sheets[open]} onPick={v => pick(open, v)} onHeight={setSheetH} onClose={() => { setOpen(null); setSheetH(0); }} />}
    </div>
  );
}
