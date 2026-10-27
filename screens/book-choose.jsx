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
  { id: 'layflat',   title: 'Hardcover · Layflat',  note: 'Opens flat, panoramas intact', add: 15, layflat: true },
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
    sel: { cover: 'layflat', format: 'landscape', size: 'l' }, editor: { design: 'bleed' } },
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

const BC_SPINE = { classic: null, sorbet: '#E88BAE', aegean: '#16276F', garden: '#1F7A40', full: null };

function BookHero({ sel, design = 'classic' }) {
  const fmt = BC_FORMATS.find(f => f.id === sel.format);
  const cov = BC_COVERS.find(c => c.id === sel.cover);
  const soft = cov.id === 'softcover';
  const W = fmt.ratio >= 1 ? (fmt.ratio > 1 ? 262 : 220) : 190;
  const H = W / fmt.ratio;
  const tint = BC_SPINE[design];
  return (
    <div key={sel.format + sel.cover} style={{ position: 'relative', width: W, height: H, animation: 'bcPop .45s cubic-bezier(.2,.8,.2,1) both',
      borderRadius: 4, background: '#fff', boxShadow: '0 22px 28px -10px rgba(0,40,40,.35), 0 3px 6px rgba(0,0,0,.12)' }}>
      {/* spine */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: soft ? 9 : 14, borderRadius: '4px 0 0 4px',
        background: tint ? `linear-gradient(90deg, ${tint}, ${tint} 60%, rgba(0,0,0,.18))`
          : 'linear-gradient(90deg, #cfd6d6, #f4f6f6 40%, #dfe5e5 70%, #c4cccc)' }} />
      {/* cover */}
      <div style={{ position: 'absolute', left: soft ? 9 : 14, top: 0, right: 0, bottom: 0, borderRadius: '0 4px 4px 0',
        overflow: 'hidden', containerType: 'size' }}>
        <BcCover design={design} album={BC_ALBUM} />
        {/* page-edge sheen */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,.10), rgba(0,0,0,0) 8%)' }} />
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

// ── Option sheet: slides up, tap an option to choose it ──
function BcSheet({ title, options, value, onPick, onClose }) {
  const [closing, setClosing] = React.useState(false);
  const close = pick => {
    setClosing(true);
    setTimeout(() => { if (pick !== undefined) onPick(pick); onClose(); }, 220);
  };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30 }}>
      <div onClick={() => close()} style={{ position: 'absolute', inset: 0, background: 'rgba(0,30,34,.5)',
        animation: `${closing ? 'bcFadeOut' : 'bcFade'} .22s ease both` }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '30px 30px 0 0',
        padding: '8px 16px calc(env(safe-area-inset-bottom, 0px) + 20px)', boxShadow: '0 -12px 30px rgba(0,50,52,.18)',
        animation: `${closing ? 'bcDown' : 'bcUp'} .28s cubic-bezier(.2,.8,.2,1) both` }}>
        <div style={{ width: 36, height: 5, borderRadius: 3, background: '#DCE6E6', margin: '0 auto 14px' }} />
        <div style={{ fontFamily: BC_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: '-0.3px', color: BC_DEEP, padding: '0 4px 12px' }}>{title}</div>
        {options.map(o => {
          const on = o.id === value;
          return (
            <div key={o.id} role="button" onClick={() => close(o.id)} {...press(0.97)} style={{ display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', marginBottom: 8, borderRadius: 20, cursor: 'pointer', background: on ? '#DDF0EC' : PB_PAPER,
              boxShadow: on ? `inset 0 0 0 2px ${BC_TEAL}` : 'inset 0 0 0 1px #fff', transition: 'transform 140ms ease, background 200ms ease',
              WebkitTapHighlightColor: 'transparent' }}>
              {o.thumb}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ fontFamily: BC_TEXT, fontSize: 16, fontWeight: 700, color: BC_DEEP }}>{o.title}</span>
                {o.note && <span style={{ fontFamily: BC_TEXT, fontSize: 13, color: '#5f7777' }}>{o.note}</span>}
              </div>
              {o.tag && <span style={{ fontFamily: BC_TEXT, fontSize: 14, fontWeight: 600, color: BC_TEAL }}>{o.tag}</span>}
              <span style={{ width: 22, height: 22, borderRadius: 11, boxSizing: 'border-box', flexShrink: 0,
                border: on ? 'none' : '2px solid #B8CACA', background: on ? BC_TEAL : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {on && <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="m3 8.5 3.2 3.2L13 4.8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
            </div>
          );
        })}
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
function BcSlide({ preset, sel, active }) {
  const { cov, fmt, price } = bcSpec(sel);
  const stock = bcSame(sel, preset.sel);
  return (
    <div style={{ flex: '0 0 78%', scrollSnapAlign: 'center', scrollSnapStop: 'always', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 20, minWidth: 0 }}>
      <div style={{ height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: active ? 'none' : 'scale(0.86)', opacity: active ? 1 : 0.7, transition: 'transform .3s ease, opacity .3s ease' }}>
        <BookHero sel={sel} design={preset.design} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center',
        opacity: active ? 1 : 0, transition: 'opacity .25s ease' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: BC_TEXT, fontSize: 12, fontWeight: 700, letterSpacing: '.14em', color: BC_TEAL }}>
          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M10 2.5c.4 3.9 2.1 5.6 6 6-3.9.4-5.6 2.1-6 6-.4-3.9-2.1-5.6-6-6 3.9-.4 5.6-2.1 6-6Zm8 10c.25 2.2 1.3 3.25 3.5 3.5-2.2.25-3.25 1.3-3.5 3.5-.25-2.2-1.3-3.25-3.5-3.5 2.2-.25 3.25-1.3 3.5-3.5Z" fill="currentColor" /></svg>
          {stock ? preset.eyebrow : 'CUSTOMISED'}
        </span>
        <span style={{ fontFamily: BC_DISPLAY, fontWeight: 700, fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.4px' }}>
          {cov.title.replace(' · Layflat', '')} {fmt.title}<br />Photo book{cov.layflat ? ' with Layflat' : ''}
        </span>
        <span style={{ fontFamily: BC_TEXT, fontSize: 16, color: '#6b8080' }}>€{price.toFixed(2)} · 24 pages</span>
      </div>
    </div>
  );
}

function BookChooseScreen() {
  const [idx, setIdx] = React.useState(0);               // the suggestion in the middle of the carousel
  const [sel, setSel] = React.useState(BC_PICK);          // its cover / format / size, plus any change made below
  const [open, setOpen] = React.useState(null);   // 'cover' | 'format' | 'size'
  const scroller = React.useRef(null);
  const area = React.useRef(null), inner = React.useRef(null);
  const [fit, setFit] = React.useState(1);
  // The carousel is ~400 tall; on a short phone it scales down about its centre rather than clip.
  React.useLayoutEffect(() => {
    const a = area.current, n = inner.current;
    if (!a || !n) return undefined;
    const measure = () => setFit(Math.max(0.4, Math.min(1, (a.clientHeight - 16) / n.offsetHeight)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(a);
    return () => ro.disconnect();
  }, []);
  const { cov, fmt, siz, price } = bcSpec(sel);
  const preset = BC_PRESETS[idx];

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
        pageW: siz.w, pageH: siz.h, layflat: cov.layflat, cover: cov.title,
      }));
      // pb_photos is the flat upload; pb_groups tells the editor's auto-fill how to lay it out,
      // one chapter at a time, and which photo goes on the cover
      sessionStorage.setItem('pb_photos', JSON.stringify(BC_ALBUM.photos));
      sessionStorage.setItem('pb_groups', JSON.stringify({ cover: BC_TRIP.cover, groups: BC_TRIP.groups }));
      // the album's name goes on the cover, and its photos keep their own proportions
      sessionStorage.setItem('pb_cover_title', BC_TRIP.title);
      sessionStorage.setItem('pb_fit', 'contain');
      // the chosen suggestion's cover style: the editor's matching design, and the board colour for the bold ones
      sessionStorage.setItem('pb_cover_design', preset.editor.design);
      sessionStorage.setItem('pb_colors', JSON.stringify(preset.editor.paper ? { 0: preset.editor.paper } : {}));
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
      <div style={{ position: 'relative', flexShrink: 0, paddingTop: PB_BACK_TOP, height: 44, boxSizing: 'content-box',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PbBackButton style={{ top: PB_BACK_TOP }} />
        <span style={{ fontFamily: BC_DISPLAY, fontWeight: 700, fontSize: 17, letterSpacing: '-0.2px' }}>Choose your photo book</span>
      </div>

      {/* the middle of the page: a carousel of suggestions — swipe for another cover style */}
      <div ref={area} style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 0 8px' }}>
       <div ref={inner} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, transform: `scale(${fit})`, transformOrigin: 'center' }}>
        <div ref={scroller} onScroll={onScroll} style={{ display: 'flex', width: '100%', overflowX: 'auto', overflowY: 'hidden',
          scrollSnapType: 'x mandatory', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          <div aria-hidden style={{ flex: '0 0 11%' }} />
          {BC_PRESETS.map((p, i) => <BcSlide key={p.id} preset={p} sel={i === idx ? sel : p.sel} active={i === idx} />)}
          <div aria-hidden style={{ flex: '0 0 11%' }} />
        </div>
        <div role="tablist" aria-label="Suggestions" style={{ display: 'flex', gap: 8 }}>
          {BC_PRESETS.map((p, i) => (
            <button key={p.id} role="tab" aria-selected={i === idx} aria-label={`Suggestion ${i + 1} of ${BC_PRESETS.length}`} onClick={() => goTo(i)}
              style={{ width: i === idx ? 22 : 8, height: 8, padding: 0, border: 'none', borderRadius: 4, cursor: 'pointer',
                background: i === idx ? BC_TEAL : 'rgba(2,60,66,.2)', transition: 'width .25s ease, background .25s ease', WebkitTapHighlightColor: 'transparent' }} />
          ))}
        </div>
       </div>
      </div>

      {/* choices + CTA: a floating card with margins, as home's cards */}
      <div style={{ flexShrink: 0, padding: '0 16px calc(env(safe-area-inset-bottom, 0px) + 20px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', borderRadius: 24, boxShadow: 'inset 0 0 0 1px #fff, 0 4px 16px -1px rgba(0,77,74,.12)', overflow: 'hidden' }}>
          <BcRow icon="bc-icon-photobook.svg" label="Cover type" value={cov.title.replace(' · ', ' + ')} onTap={() => setOpen('cover')} />
          <BcRow icon="bc-icon-crop.svg" label="Format" value={fmt.title} onTap={() => setOpen('format')} />
          <BcRow icon="bc-icon-size.svg" label="Size" value={`${siz.title} (${siz.w}x${siz.h} cm)`} onTap={() => setOpen('size')} last />
        </div>
        <button onClick={create} {...press(0.97)} style={pbButton('primary')}>Create</button>
      </div>

      {open && <BcSheet key={open} {...sheets[open]} onPick={v => pick(open, v)} onClose={() => setOpen(null)} />}
    </div>
  );
}
