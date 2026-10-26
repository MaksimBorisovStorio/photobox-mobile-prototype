// screens/book-choose.jsx — Figma node 696:3772 "Book preview (add to basket)"
//
// Reached from Create → Photo books (memory-create). It does the choosing for you: the
// book opens on the recommended cover, format and size, priced, with a Create button — and
// each of the three rows opens a sheet to change it. Create writes the resolved choice to
// sessionStorage.pb_book (the same shape product-photobook's bookConfig writes) and the
// album's photos to pb_photos, then pushes the editor, which offers to auto-fill them.
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

// What we recommend: the sturdy cover, the shape of most trip photos, the size that fits a
// gift or a coffee table. All three can be changed below.
const BC_PICK = { cover: 'hardcover', format: 'landscape', size: 'm' };

const BC_TRIP = window.PB_TRIP_ITALY;
const BC_ALBUM = {
  title: 'Trip to Italy',
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

// ── The book, drawn live: spine band, cover photo, title. ──
function BookHero({ sel }) {
  const fmt = BC_FORMATS.find(f => f.id === sel.format);
  const cov = BC_COVERS.find(c => c.id === sel.cover);
  const soft = cov.id === 'softcover';
  const W = fmt.ratio >= 1 ? (fmt.ratio > 1 ? 262 : 220) : 190;
  const H = W / fmt.ratio;
  return (
    <div key={sel.format + sel.cover} style={{ position: 'relative', width: W, height: H, animation: 'bcPop .45s cubic-bezier(.2,.8,.2,1) both',
      borderRadius: 4, background: '#fff', boxShadow: '0 22px 28px -10px rgba(0,40,40,.35), 0 3px 6px rgba(0,0,0,.12)' }}>
      {/* spine */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: soft ? 9 : 14, borderRadius: '4px 0 0 4px',
        background: 'linear-gradient(90deg, #cfd6d6, #f4f6f6 40%, #dfe5e5 70%, #c4cccc)' }} />
      {/* cover */}
      <div style={{ position: 'absolute', left: soft ? 9 : 14, top: 0, right: 0, bottom: 0, borderRadius: '0 4px 4px 0',
        background: '#fbfaf7', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 14, top: 12, right: 14, fontFamily: 'Oswald, "Arial Narrow", ' + BC_DISPLAY,
          fontWeight: 700, fontSize: 14, letterSpacing: '.02em', textTransform: 'uppercase', color: '#111', lineHeight: 1 }}>{BC_ALBUM.title}</div>
        <img src={BC_ALBUM.photo} alt="" draggable={false} style={{ position: 'absolute', left: 14, right: 14, top: 34, bottom: 14,
          width: 'calc(100% - 28px)', height: 'calc(100% - 48px)', objectFit: 'cover' }} />
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

function BookChooseScreen() {
  const [sel, setSel] = React.useState(BC_PICK);
  const [open, setOpen] = React.useState(null);   // 'cover' | 'format' | 'size'
  const cov = BC_COVERS.find(c => c.id === sel.cover);
  const fmt = BC_FORMATS.find(f => f.id === sel.format);
  const siz = bcSize(sel.format, sel.size);
  const price = bcPrice(sel);
  const recommended = sel.cover === BC_PICK.cover && sel.format === BC_PICK.format && sel.size === BC_PICK.size;

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

      {/* hero: the book and its headline, on the teal */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22, padding: '0 20px 40px' }}>
        <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookHero sel={sel} /></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: BC_TEXT, fontSize: 12, fontWeight: 700, letterSpacing: '.14em',
            color: BC_TEAL, visibility: recommended ? 'visible' : 'hidden' }}>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M10 2.5c.4 3.9 2.1 5.6 6 6-3.9.4-5.6 2.1-6 6-.4-3.9-2.1-5.6-6-6 3.9-.4 5.6-2.1 6-6Zm8 10c.25 2.2 1.3 3.25 3.5 3.5-2.2.25-3.25 1.3-3.5 3.5-.25-2.2-1.3-3.25-3.5-3.5 2.2-.25 3.25-1.3 3.5-3.5Z" fill="currentColor" /></svg>
            RECOMMENDED FOR THIS ALBUM
          </span>
          <span style={{ fontFamily: BC_DISPLAY, fontWeight: 700, fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.4px' }}>
            {cov.title.replace(' · Layflat', '')} {fmt.title}<br />Photo book{cov.layflat ? ' with Layflat' : ''}
          </span>
          <span style={{ fontFamily: BC_TEXT, fontSize: 16, color: '#6b8080' }}>€{price.toFixed(2)} · 24 pages</span>
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
