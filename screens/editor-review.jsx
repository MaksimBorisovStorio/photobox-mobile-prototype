// screens/editor-review.jsx — "Your photo book": the upgrade page after the editor.
//
// Replaces the earlier summary page (Figma 451:13721). Built from a design mock rather
// than a Figma node: a hero that shows *their own book*, a short list of upgrades
// (binding, paper finish, gift box) and a pinned price + Add to basket.
//
// The hero is the persuasion. Each upgrade has a scene that animates what the money
// buys, using the photos actually placed in the editor:
//   binding — the open spread: standard pages dip into the spine and swallow the middle
//             of a panorama; layflat opens dead flat and the photo runs across the fold
//   paper   — the same spread, closer, with the light moving across it the way that
//             finish catches it (none on matte, soft on satin, a hard streak on gloss)
//   gift    — the closed book lowered into a gift box, the lid coming down on it
// The scenes cycle on their own until the user touches anything, so a passive visitor
// still sees every upgrade once — the "gentle" part of the push.
//
// Reuses book-preview.jsx's data helper (bpBook), so that file must load first.

const ER_A = '../shared/assets';
const ER_FONT = PB_DISPLAY;
const ER_INK = '#0F3D3E';
const ER_MUTED = '#5E7575';
const ER_TEAL = '#0E6B6E';
const ER_SOFT = '#E6F1F1';
const ER_LINE = '#DCE8E8';
const ER_BOARD = '#0b4a4b';
const ER_PAPER = '#F7F5EF';
const ER_EASE = 'cubic-bezier(0.3,0.7,0.2,1)';

// ── Options and prices. Increments are invented, on the same footing as the product
// page's SIZE_BASE / COVER_ADD; LAYFLAT_ADD there is also €5, so the two agree.
const ER_BINDING = [
  { id: 'standard', name: 'Standard binding', line: 'Classic pages with a soft curve at the spine', add: 0 },
  { id: 'layflat', name: 'Layflat binding', line: 'Pages open completely flat, so photos flow across the fold', add: 5, tag: 'Most loved' },
];
const ER_PAPERS = [
  { id: 'satin', name: 'Satin pages', line: 'A soft sheen that keeps colours natural', add: 0 },
  { id: 'matte', name: 'Premium matte', line: 'Thicker, velvety paper with no glare', add: 6, tag: 'Feels special' },
  { id: 'gloss', name: 'High gloss', line: 'Vivid, punchy colours with a bright shine', add: 6 },
];
const ER_GIFT_ADD = 7.99;
const ER_SCENES = ['binding', 'paper', 'gift'];

const erPrice = n => `€${n.toFixed(2)}`;
const erAdd = n => (n ? `+${erPrice(n)}` : 'Included');

function erReadSel(book) {
  const def = { binding: book.layflat ? 'layflat' : 'standard', paper: 'satin', gift: false };
  try { return Object.assign(def, JSON.parse(sessionStorage.getItem('pb_upgrades') || '{}')); }
  catch (e) { return def; }
}

// ── A CSS box: x ∈ [-w/2, w/2], y ∈ [-h/2, h/2], z ∈ [0, d]. `faces` overrides the
// fill per face (a CSS background, or a style object); `open` drops the top (the gift box base). Children go on the top face.
function ErBox({ w, h, d, color, faces = {}, open, children }) {
  const f = (k, st) => (
    <div style={Object.assign({ position: 'absolute' },
      typeof faces[k] === 'object' ? faces[k] : { background: faces[k] || color }, st)}>
      {k === 'top' && children}
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d' }}>
      {f('bottom', { left: -w / 2, top: -h / 2, width: w, height: h, transform: 'rotateY(180deg)' })}
      {f('front', { left: -w / 2, top: h / 2 - d / 2, width: w, height: d, transform: `translateZ(${d / 2}px) rotateX(90deg)` })}
      {f('back', { left: -w / 2, top: -h / 2 - d / 2, width: w, height: d, transform: `translateZ(${d / 2}px) rotateX(90deg)` })}
      {f('left', { left: -w / 2 - d / 2, top: -h / 2, width: d, height: h, transform: `translateZ(${d / 2}px) rotateY(90deg)` })}
      {f('right', { left: w / 2 - d / 2, top: -h / 2, width: d, height: h, transform: `translateZ(${d / 2}px) rotateY(90deg)` })}
      {!open && f('top', { left: -w / 2, top: -h / 2, width: w, height: h, transform: `translateZ(${d}px)`, overflow: 'hidden' })}
    </div>
  );
}

const ER_EDGE_V = 'repeating-linear-gradient(90deg, #f6f3ec 0 1px, #dcd7cc 1px 2px)';
const ER_EDGE_H = 'repeating-linear-gradient(0deg, #f6f3ec 0 1px, #dcd7cc 1px 2px)';

// The light a paper finish throws back, as a band that travels across the page.
function ErSheen({ finish, delay }) {
  if (finish === 'matte') return null;
  const strong = finish === 'gloss';
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'screen',
      backgroundImage: strong
        ? 'linear-gradient(105deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.75) 48%, rgba(255,255,255,0.15) 52%, rgba(255,255,255,0) 60%)'
        : 'linear-gradient(105deg, rgba(255,255,255,0) 25%, rgba(255,255,255,0.32) 50%, rgba(255,255,255,0) 75%)',
      backgroundSize: '300% 100%', animation: `erSheen 3.8s ${delay}s ease-in-out infinite`,
    }} />
  );
}

// ── The open spread, lying on the table. One panorama runs across both pages: on a
// standard binding each page shows a little less of it (the strip that disappears
// into the spine) and both pages tilt up from the gutter.
function ErSpread({ pw, ph, photo, layflat, finish }) {
  const a = layflat ? 0.5 : 0.455;
  const ang = layflat ? 0 : 14;
  const ov = 4;
  const filter = finish === 'matte' ? 'saturate(0.9) contrast(0.95) brightness(1.02)'
    : finish === 'gloss' ? 'saturate(1.18) contrast(1.06)' : 'none';
  const page = side => (
    <div style={{
      position: 'absolute', top: -ph / 2, left: side === 'l' ? -pw : 0, width: pw, height: ph,
      transformOrigin: side === 'l' ? 'right center' : 'left center',
      transform: `translateZ(1px) rotateY(${side === 'l' ? ang : -ang}deg)`,
      transition: `transform 900ms ${ER_EASE}`, overflow: 'hidden', background: ER_PAPER,
    }}>
      <div style={{
        position: 'absolute', inset: 0, backgroundImage: `url(${photo})`,
        backgroundSize: `${100 / a}% 100%`, backgroundPosition: side === 'l' ? '0% 50%' : '100% 50%',
        filter, transition: `background-size 900ms ${ER_EASE}, filter 600ms`,
      }} />
      {/* gutter: deep curl on standard, a hairline on layflat */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'opacity 700ms',
        opacity: layflat ? 0 : 1,
        background: `linear-gradient(to ${side === 'l' ? 'left' : 'right'}, rgba(0,0,0,0.55), rgba(0,0,0,0.18) 9%, rgba(0,0,0,0) 26%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', transition: 'opacity 700ms',
        opacity: layflat ? 1 : 0,
        background: `linear-gradient(to ${side === 'l' ? 'left' : 'right'}, rgba(0,0,0,0.35) 0, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0) 8px)`,
      }} />
      <ErSheen finish={finish} delay={side === 'l' ? 0 : 0.35} />
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d' }}>
      {/* table shadow */}
      <div style={{
        position: 'absolute', left: -pw * 1.25, top: -ph * 0.7, width: pw * 2.5, height: ph * 1.4,
        transform: 'translateZ(-9px)', background: 'radial-gradient(closest-side, rgba(0,50,50,0.28), rgba(0,50,50,0))',
      }} />
      {/* cover boards, then the page block either side of the spine */}
      <div style={{ transform: 'translateZ(-8px)', position: 'absolute', transformStyle: 'preserve-3d' }}>
        <ErBox w={2 * pw + 2 * ov} h={ph + 2 * ov} d={3} color={ER_BOARD} />
      </div>
      <div style={{ transform: `translate3d(${-pw / 2}px,0,-5px)`, position: 'absolute', transformStyle: 'preserve-3d' }}>
        <ErBox w={pw} h={ph} d={5} color={ER_PAPER} faces={{ left: ER_EDGE_V, front: ER_EDGE_H, back: ER_EDGE_H }} />
      </div>
      <div style={{ transform: `translate3d(${pw / 2}px,0,-5px)`, position: 'absolute', transformStyle: 'preserve-3d' }}>
        <ErBox w={pw} h={ph} d={5} color={ER_PAPER} faces={{ right: ER_EDGE_V, front: ER_EDGE_H, back: ER_EDGE_H }} />
      </div>
      {page('l')}
      {page('r')}
    </div>
  );
}

function ErTitle({ size }) {
  return (
    <div style={{ fontFamily: ER_FONT, fontWeight: 700, fontSize: size, lineHeight: 1.1, letterSpacing: 0.2,
      color: '#fff', textShadow: '0 1px 6px rgba(0,0,0,0.35)' }}>My photo book</div>
  );
}

// ── The closed book as a solid: cover on top, page edges round three sides, spine left.
function ErClosedBook({ bw, bh, bt, photo }) {
  return (
    <ErBox w={bw} h={bh} d={bt} color={ER_PAPER}
      faces={{ left: ER_BOARD, right: ER_EDGE_V, front: ER_EDGE_H, back: ER_EDGE_H, bottom: ER_BOARD }}>
      <img src={photo} alt="" draggable={false}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: `${bh * 0.16}px ${bw * 0.1}px ${bh * 0.08}px`,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.65))' }}>
        <ErTitle size={Math.max(12, bw * 0.11)} />
      </div>
      <div style={{ position: 'absolute', left: bw * 0.04, top: 0, bottom: 0, width: 1.5, background: 'rgba(0,0,0,0.25)' }} />
    </ErBox>
  );
}

// ── The gift box, after the real one: a warm off-white board scattered with
// holographic confetti dots and a small "Your story" in the middle of the lid. The
// dots are one tile of radial gradients, scattered by a fixed seed so every render
// (and every face of the box) shows the same pattern.
const ER_BOX = '#ECE7DE';
const ER_CONFETTI = (() => {
  const hues = ['#AFC0D2', '#DDB6CB', '#B7DCD4', '#D9C98E', '#9FB2C9', '#F4F4FA', '#C9B7E2', '#A9CFC6'];
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const dots = [];
  for (let i = 0; i < 18; i++) {
    const r = 1.1 + rnd() * 1.6;
    dots.push(`radial-gradient(circle at ${(rnd() * 56).toFixed(1)}px ${(rnd() * 56).toFixed(1)}px, `
      + `${hues[i % hues.length]} 0 ${r.toFixed(1)}px, rgba(0,0,0,0) ${(r + 0.6).toFixed(1)}px)`);
  }
  return {
    backgroundColor: ER_BOX,
    backgroundImage: dots.join(', '),
    backgroundSize: '56px 56px',
  };
})();

function ErConfetti({ children, style }) {
  return (
    <div style={Object.assign({ position: 'absolute', inset: 0 }, ER_CONFETTI, style)}>
      {/* the holographic shift: a faint rainbow wash that only shows on the dots' light */}
      <div style={{ position: 'absolute', inset: 0, mixBlendMode: 'soft-light',
        background: 'linear-gradient(120deg, rgba(255,200,230,0.35), rgba(200,230,255,0.35) 45%, rgba(230,255,220,0.3) 70%, rgba(255,240,200,0.35))' }} />
      {children}
    </div>
  );
}

// The book drops in, the lid comes down. Loops.
// No opacity anywhere in here — opacity flattens a preserve-3d subtree — so the lid
// waits out of frame instead of fading.
function ErGiftScene({ bw, bh, bt, photo }) {
  const BW = bw + 18, BH = bh + 18, BD = bt + 14, LD = 12;
  const up = bh * 0.9;
  const kf = `
    @keyframes erBook { 0%,8% { transform: translateZ(${up}px) rotateZ(-10deg) }
      38%,88% { transform: translateZ(3px) rotateZ(0deg) } 100% { transform: translateZ(${up}px) rotateZ(-10deg) } }
    @keyframes erLid { 0%,40% { transform: translate3d(0,${-BH * 1.9}px,${up * 1.4}px) rotateX(-24deg) }
      60%,84% { transform: translate3d(0,0,${BD - LD + 2}px) rotateX(0deg) }
      97%,100% { transform: translate3d(0,${-BH * 1.9}px,${up * 1.4}px) rotateX(-24deg) } }`;
  const side = ER_CONFETTI;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d' }}>
      <style>{kf}</style>
      <div style={{
        position: 'absolute', left: -BW * 0.75, top: -BH * 0.75, width: BW * 1.5, height: BH * 1.5,
        transform: 'translateZ(-1px)', background: 'radial-gradient(closest-side, rgba(0,50,50,0.3), rgba(0,50,50,0))',
      }} />
      <ErBox w={BW} h={BH} d={BD} color={ER_BOX} open
        faces={{ bottom: ER_BOX, front: side, back: side, left: side, right: side }} />
      {/* the white inside of the base */}
      <div style={{ position: 'absolute', left: -BW / 2 + 2, top: -BH / 2 + 2, width: BW - 4, height: BH - 4,
        transform: 'translateZ(1px)', background: 'linear-gradient(135deg, #FFFFFF, #EFEDE8)' }} />
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', animation: 'erBook 6s ease-in-out infinite' }}>
        <ErClosedBook bw={bw} bh={bh} bt={bt} photo={photo} />
      </div>
      <div style={{ position: 'absolute', transformStyle: 'preserve-3d', animation: 'erLid 6s ease-in-out infinite' }}>
        <ErBox w={BW + 6} h={BH + 6} d={LD} color={ER_BOX}
          faces={{ front: side, back: side, left: side, right: side }}>
          <ErConfetti>
            <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center',
              fontFamily: ER_FONT, fontSize: Math.max(8, BW * 0.06), fontWeight: 500, lineHeight: 1.1,
              color: 'rgba(140,150,160,0.85)', letterSpacing: 0.3 }}>Your<br />story</div>
          </ErConfetti>
        </ErBox>
      </div>
    </div>
  );
}

// ── Hero: one stage, four camera set-ups. The camera eases between them.
const ER_CAMERA = {
  binding: 'rotateX(56deg) rotateZ(-12deg)',
  paper: 'translateY(-6px) rotateX(40deg) rotateZ(-6deg) scale(1.28)',
  gift: 'translateY(8px) rotateX(54deg) rotateZ(-26deg)',
};

function ErHero({ scene, sel, data, pano, width, height, onSwipe, onChip }) {
  const ratio = data.book.pageH / data.book.pageW;
  const pw = Math.min(width * 0.36, (height * 0.95) / ratio / 1.15);
  const ph = pw * ratio;
  const cover = data.photos[0];
  const start = React.useRef(null);

  // Each chip says what the selected option does; when an upgrade is still on the
  // table it carries one small action — never more than one.
  const chip = {
    binding: sel.binding === 'layflat'
      ? { text: 'Layflat · photos flow across the fold' }
      : { text: 'The fold hides the middle', cta: 'Try layflat' },
    paper: {
      satin: { text: 'Satin · soft and classic', cta: 'See finishes' },
      matte: { text: 'Premium matte · velvety, no glare' },
      gloss: { text: 'High gloss · vivid and bright' },
    }[sel.paper],
    gift: sel.gift ? { text: 'Gift box · arrives ready to give' } : { text: 'Gift box · ready to give', cta: `Add ${erPrice(ER_GIFT_ADD)}` },
  }[scene];

  const spreadScene = scene === 'binding' || scene === 'paper';
  return (
    <div
      onPointerDown={e => { start.current = e.clientX; }}
      onPointerUp={e => {
        if (start.current == null) return;
        const dx = e.clientX - start.current; start.current = null;
        if (Math.abs(dx) > 40) onSwipe(dx < 0 ? 1 : -1);
      }}
      style={{
        position: 'relative', height, borderRadius: 24, overflow: 'hidden', touchAction: 'pan-y',
        background: 'radial-gradient(120% 95% at 50% 25%, #FFFFFF 0%, #EEF4F3 55%, #DDE9E7 100%)',
        boxShadow: 'inset 0 0 0 1px rgba(0,77,74,0.06)',
      }}>
      <div style={{ position: 'absolute', inset: 0, perspective: 900 }}>
        <div style={{
          position: 'absolute', left: '50%', top: '47%', width: 0, height: 0, transformStyle: 'preserve-3d',
          transform: ER_CAMERA[scene], transition: `transform 1100ms ${ER_EASE}`,
        }}>
          <div style={{ position: 'absolute', transformStyle: 'preserve-3d', animation: 'erSway 7s ease-in-out infinite' }}>
            {spreadScene && (
              <ErSpread pw={pw} ph={ph} photo={pano} layflat={sel.binding === 'layflat'} finish={sel.paper} />
            )}
            {scene === 'gift' && <ErGiftScene bw={pw * 1.05} bh={ph * 1.05} bt={9} photo={cover} />}
          </div>
        </div>
      </div>

      {chip && (
        <button key={scene + chip.text} onClick={onChip} onPointerDown={e => e.stopPropagation()} style={{
          position: 'absolute', left: 14, bottom: 14, maxWidth: 'calc(100% - 28px)', display: 'flex', alignItems: 'center',
          gap: 8, padding: chip.cta ? '7px 7px 7px 12px' : '9px 14px 9px 12px', borderRadius: 999, border: 'none',
          background: 'rgba(255,255,255,0.94)', boxShadow: '0 4px 14px -4px rgba(0,50,50,0.25)', cursor: 'pointer',
          fontFamily: ER_FONT, fontSize: 13, fontWeight: 600, color: ER_INK, animation: 'erChipIn 400ms ease both',
          WebkitTapHighlightColor: 'transparent',
        }}>
          <ErSparkle />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{chip.text}</span>
          {chip.cta && (
            <span style={{ flexShrink: 0, padding: '5px 10px', borderRadius: 999, background: ER_TEAL, color: '#fff', fontSize: 12 }}>
              {chip.cta}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

function ErSparkle({ color = ER_TEAL, size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M10 2.5c.4 3.9 2.1 5.6 6 6-3.9.4-5.6 2.1-6 6-.4-3.9-2.1-5.6-6-6 3.9-.4 5.6-2.1 6-6Z" />
      <path d="M18 12.5c.25 2.2 1.3 3.25 3.5 3.5-2.2.25-3.25 1.3-3.5 3.5-.25-2.2-1.3-3.25-3.5-3.5 2.2-.25 3.25-1.3 3.5-3.5Z" />
    </svg>
  );
}

// ── Rows
function ErRow({ thumb, title, sub, nudge, right, onClick, last }) {
  return (
    <div onClick={onClick} {...(onClick ? press(0.98) : {})} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', cursor: onClick ? 'pointer' : 'default',
      borderBottom: last ? 'none' : `1px solid ${ER_LINE}`, transition: 'transform 140ms ease',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ width: 64, height: 64, borderRadius: 14, background: ER_SOFT, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
        {thumb}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: ER_FONT, fontSize: 17, fontWeight: 700, color: ER_INK, lineHeight: '22px' }}>{title}</div>
        <div style={{ fontFamily: ER_FONT, fontSize: 13, color: ER_MUTED, lineHeight: '18px', marginTop: 2 }}>{sub}</div>
        {nudge && (
          <div style={{ fontFamily: ER_FONT, fontSize: 12, fontWeight: 600, color: ER_TEAL, lineHeight: '16px', marginTop: 4,
            display: 'flex', alignItems: 'center', gap: 4 }}>
            <ErSparkle size={12} />{nudge}
          </div>
        )}
      </div>
      {right}
    </div>
  );
}

function ErChevron() {
  return (
    <div style={{ width: 36, height: 36, borderRadius: 18, background: ER_SOFT, display: 'flex',
      alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={ER_INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 3.5 4.5 4.5L6 12.5" />
      </svg>
    </div>
  );
}

function ErSwitch({ on }) {
  return (
    <div style={{ width: 51, height: 31, borderRadius: 16, background: on ? ER_TEAL : '#D7E1E1', position: 'relative',
      flexShrink: 0, transition: 'background 200ms' }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 22 : 2, width: 27, height: 27, borderRadius: 14, background: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: `left 220ms ${ER_EASE}` }} />
    </div>
  );
}

function ErPill({ children, tone }) {
  return (
    <span style={{ fontFamily: ER_FONT, fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
      background: tone === 'gold' ? '#F6EBCF' : ER_SOFT, color: tone === 'gold' ? '#7A5A17' : ER_TEAL, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

// ── Option sheet. The hero above it updates live as options are tapped, so the
// scrim is light enough to keep it readable.
function ErSheet({ kind, value, onPick, onClose }) {
  const opts = kind === 'binding' ? ER_BINDING : ER_PAPERS;
  const [closing, setClosing] = React.useState(false);
  const close = () => { setClosing(true); setTimeout(onClose, 260); };
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(15,61,62,0.18)',
        animation: `${closing ? 'erFadeOut' : 'erFadeIn'} 260ms ease both` }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '24px 24px 0 0',
        padding: `20px 20px calc(20px + env(safe-area-inset-bottom, 0px))`, boxShadow: '0 -8px 30px -8px rgba(0,50,50,0.25)',
        animation: `${closing ? 'erSheetOut' : 'erSheetIn'} 300ms ${ER_EASE} both`,
      }}>
        <div style={{ width: 36, height: 5, borderRadius: 3, background: '#D5E0E0', margin: '-8px auto 14px' }} />
        <div style={{ fontFamily: ER_FONT, fontSize: 20, fontWeight: 700, color: ER_INK, marginBottom: 4 }}>
          {kind === 'binding' ? 'Binding' : 'Paper finish'}
        </div>
        <div style={{ fontFamily: ER_FONT, fontSize: 14, color: ER_MUTED, marginBottom: 16 }}>
          {kind === 'binding' ? 'Watch the spread above as you choose.' : 'Watch how the light catches each finish.'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {opts.map(o => {
            const on = o.id === value;
            return (
              <div key={o.id} onClick={() => onPick(o.id)} {...press(0.98)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', borderRadius: 16, cursor: 'pointer',
                border: `2px solid ${on ? ER_TEAL : ER_LINE}`, background: on ? '#F2F8F8' : '#fff',
                transition: 'transform 140ms ease, border-color 200ms, background 200ms', WebkitTapHighlightColor: 'transparent',
              }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${on ? ER_TEAL : '#B9C9C9'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {on && <div style={{ width: 11, height: 11, borderRadius: 6, background: ER_TEAL }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: ER_FONT, fontSize: 16, fontWeight: 700, color: ER_INK }}>{o.name}</span>
                    {o.tag && <ErPill tone="gold">{o.tag}</ErPill>}
                  </div>
                  <div style={{ fontFamily: ER_FONT, fontSize: 13, color: ER_MUTED, lineHeight: '18px', marginTop: 2 }}>{o.line}</div>
                </div>
                <span style={{ fontFamily: ER_FONT, fontSize: 14, fontWeight: 700, color: o.add ? ER_INK : ER_MUTED, whiteSpace: 'nowrap' }}>
                  {erAdd(o.add)}
                </span>
              </div>
            );
          })}
        </div>
        <button onClick={close} {...press(0.97)} style={{
          marginTop: 18, width: '100%', height: 52, borderRadius: 14, border: 'none', background: ER_TEAL, color: '#fff',
          fontFamily: ER_FONT, fontSize: 17, fontWeight: 700, cursor: 'pointer', transition: 'transform 140ms ease',
        }}>Done</button>
      </div>
    </div>
  );
}

// The photo that runs across the spread. A wide landscape with its subject dead centre
// is what makes the binding comparison read — the fold lands right on the peak — so the
// hero always uses Moraine Lake rather than whatever happens to be in the book.
const ER_PANO = `${ER_A}/photos/mock-01.webp`;

// iOS 26 liquid-glass back button, light variant. Not GlassIconButton's `gloss`, which
// is tuned for the editor's near-black header (its shadow and normal-blended rim go
// muddy on white); this is the tab bar's light recipe — a real white tint, soft drop
// shadow, a bright top bevel and a specular sweep — at the system's 44pt size.
function ErGlassBack({ onClick }) {
  return (
    <button onClick={onClick} aria-label="Back" {...press(0.9)} style={{
      position: 'absolute', left: 16, width: 44, height: 44, borderRadius: 22, border: 'none', padding: 0,
      overflow: 'hidden', cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(12px) saturate(130%)', WebkitBackdropFilter: 'blur(12px) saturate(130%)',
      boxShadow: [
        '0 8px 20px -6px rgba(0,40,40,0.28)', '0 1px 3px rgba(0,0,0,0.10)',
        'inset 0 1px 1px rgba(255,255,255,0.95)', 'inset 0 -1px 2px rgba(0,0,0,0.06)',
        'inset 0 0 0 0.5px rgba(0,0,0,0.08)', 'inset 0 0 12px rgba(255,255,255,0.6)',
      ].join(', '),
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* specular sweep, brightest top-left like the rest of the app's glass */}
      <span style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
        background: 'linear-gradient(150deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 45%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.35) 100%)' }} />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ER_INK} strokeWidth="2.4"
        strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', marginLeft: -2 }}>
        <path d="M15 4.5 7.5 12l7.5 7.5" />
      </svg>
    </button>
  );
}

// Price that counts to its new value instead of jumping.
function useErTween(target) {
  const [v, setV] = React.useState(target);
  const from = React.useRef(target);
  React.useEffect(() => {
    const a = from.current, t0 = performance.now();
    let raf;
    const tick = now => {
      const p = Math.min(1, (now - t0) / 450);
      const n = a + (target - a) * (1 - Math.pow(1 - p, 3));
      setV(n); from.current = n;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

function EditorReviewScreen() {
  const { useState, useEffect, useMemo, useRef } = React;
  const data = useMemo(bpBook, []);
  const book = data.book;
  const [sel, setSel] = useState(() => erReadSel(book));
  const [scene, setScene] = useState('binding');
  const [auto, setAuto] = useState(true);
  const [sheet, setSheet] = useState(null);
  const heroBox = useRef(null);
  const [heroW, setHeroW] = useState(342);

  useEffect(() => {
    const m = () => heroBox.current && setHeroW(heroBox.current.clientWidth);
    m();
    window.addEventListener('resize', m);
    return () => window.removeEventListener('resize', m);
  }, []);
  useEffect(() => { sessionStorage.setItem('pb_upgrades', JSON.stringify(sel)); }, [sel]);
  // Walk through every scene on arrival, until the user takes over.
  useEffect(() => {
    if (!auto) return;
    const t = setTimeout(() => setScene(s => ER_SCENES[(ER_SCENES.indexOf(s) + 1) % ER_SCENES.length]), 5200);
    return () => clearTimeout(t);
  }, [auto, scene]);

  const show = s => { setAuto(false); setScene(s); };
  const set = (k, v) => setSel(p => ({ ...p, [k]: v }));
  const toggle = k => { show(k); set(k, !sel[k]); };

  // A layflat chosen on the product page is already inside book.total.
  const base = Number(book.total || 44.99) - (book.layflat ? 5 : 0);
  const binding = ER_BINDING.find(o => o.id === sel.binding);
  const paper = ER_PAPERS.find(o => o.id === sel.paper);
  const total = base + binding.add + paper.add + (sel.gift ? ER_GIFT_ADD : 0);
  const shown = useErTween(total);
  const upgrades = [binding.add && 'Layflat', paper.add && paper.name, sel.gift && 'Gift box'].filter(Boolean);

  const size = String(book.title || 'Large Portrait photo book').replace(/ photo book$/, '');
  const subtitle = `${size} ${book.cover || 'Hardcover'} · ${book.pageW} × ${book.pageH} cm`;

  const onChip = () => {
    setAuto(false);
    if (scene === 'binding' || scene === 'paper') setSheet(scene);
    else toggle(scene);
  };

  const pano = ER_PANO;

  return (
    <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes erSway { 0%,100% { transform: rotateZ(-3deg) } 50% { transform: rotateZ(3deg) } }
        @keyframes erSheen { 0% { background-position: 120% 0 } 60%,100% { background-position: -20% 0 } }
        @keyframes erChipIn { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
        @keyframes erFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes erFadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes erSheetIn { from { transform: translateY(100%) } to { transform: none } }
        @keyframes erSheetOut { from { transform: none } to { transform: translateY(100%) } }
      `}</style>
      <IOSStatusBar dark={false} />

      <div style={{ position: 'relative', height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ErGlassBack onClick={() => window.navigation.pop()} />
        <span style={{ fontFamily: ER_FONT, fontSize: 17, fontWeight: 700, color: ER_INK }}>Your photo book</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', padding: '8px 16px 0' }}>
        <div ref={heroBox}>
          <ErHero scene={scene} sel={sel} data={data} pano={pano} width={heroW} height={Math.round(heroW * 0.74)}
            onSwipe={d => show(ER_SCENES[(ER_SCENES.indexOf(scene) + d + ER_SCENES.length) % ER_SCENES.length])}
            onChip={onChip} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '12px 0 14px' }}>
          {ER_SCENES.map(s => (
            <button key={s} onClick={() => show(s)} aria-label={s} style={{
              width: s === scene ? 22 : 7, height: 7, borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer',
              background: s === scene ? ER_TEAL : '#C9D9D9', transition: `width 300ms ${ER_EASE}, background 300ms`,
            }} />
          ))}
        </div>

        <div style={{ border: `1px solid ${ER_LINE}`, borderRadius: 20, background: '#fff', overflow: 'hidden' }}>
          <ErRow
            onClick={() => { show('binding'); setSheet('binding'); }}
            thumb={<div style={{ position: 'absolute', inset: 8, backgroundImage: `url(${pano})`, backgroundSize: 'cover',
              backgroundPosition: 'center', borderRadius: 4, boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: sel.binding === 'layflat' ? 1 : 6,
                transform: 'translateX(-50%)', background: sel.binding === 'layflat' ? 'rgba(0,0,0,0.25)'
                  : 'linear-gradient(90deg, rgba(0,0,0,0), rgba(0,0,0,0.45), rgba(0,0,0,0))' }} />
            </div>}
            title={binding.name} sub={binding.add ? `Binding · ${erAdd(binding.add)}` : 'Binding'}
            nudge={sel.binding === 'standard' ? 'Layflat keeps photos whole across the fold' : null}
            right={<ErChevron />} />
          <ErRow last
            onClick={() => { show('paper'); setSheet('paper'); }}
            thumb={<img src={`${ER_A}/pb-review-pages-a.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
            title={paper.name} sub={paper.add ? `Paper finish · ${erAdd(paper.add)}` : 'Paper finish'}
            nudge={sel.paper === 'satin' ? 'Try premium matte for a velvety feel' : null}
            right={<ErChevron />} />
        </div>

        <div style={{ fontFamily: ER_FONT, fontSize: 17, fontWeight: 700, color: ER_INK, margin: '24px 4px 10px' }}>Finishing touches</div>
        <div style={{ border: `1px solid ${ER_LINE}`, borderRadius: 20, background: '#fff', overflow: 'hidden' }}>
          <ErRow last
            onClick={() => toggle('gift')}
            thumb={<div style={{ position: 'absolute', left: 9, top: 14, width: 46, height: 36, borderRadius: 3,
              transform: 'rotate(-8deg)', overflow: 'hidden', boxShadow: '0 3px 6px rgba(0,40,40,0.2), inset 0 0 0 1px rgba(0,0,0,0.04)' }}>
              <ErConfetti style={{ backgroundSize: '28px 28px' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: ER_FONT, fontSize: 6, color: 'rgba(140,150,160,0.9)', textAlign: 'center', lineHeight: 1.1 }}>Your<br />story</div>
              </ErConfetti>
            </div>}
            title="Gift box" sub={`Arrives ready to give · ${erPrice(ER_GIFT_ADD)}`}
            right={<ErSwitch on={sel.gift} />} />
        </div>
        <div style={{ height: 'calc(190px + env(safe-area-inset-bottom, 0px))' }} />
      </div>

      {/* Summary + CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5, background: '#fff',
        borderRadius: '24px 24px 0 0', boxShadow: '0 -6px 24px -6px rgba(0,77,74,0.14)',
        padding: `18px 16px calc(16px + env(safe-area-inset-bottom, 0px))`,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontFamily: ER_FONT, fontSize: 18, fontWeight: 700, color: ER_INK }}>My photo book</span>
          <span style={{ fontFamily: ER_FONT, fontSize: 20, fontWeight: 700, color: ER_INK, fontVariantNumeric: 'tabular-nums' }}>
            {erPrice(shown)}
          </span>
        </div>
        <div style={{ fontFamily: ER_FONT, fontSize: 13, color: ER_MUTED, marginTop: 4 }}>{subtitle}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', minHeight: 22, marginTop: 8 }}>
          {upgrades.length
            ? upgrades.map(u => <ErPill key={u}>{u}</ErPill>)
            : <span style={{ fontFamily: ER_FONT, fontSize: 12, color: ER_MUTED }}>No upgrades yet</span>}
        </div>
        <button
          onClick={() => window.navigation.push('basket.html')}
          {...press(0.97)}
          style={{
            marginTop: 12, width: '100%', height: 54, borderRadius: 14, border: 'none', background: ER_TEAL, color: '#fff',
            fontFamily: ER_FONT, fontSize: 17, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: 8, transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
          }}>
          <img src={`${ER_A}/pb-review-basket.svg`} alt="" width={22} height={22} style={{ filter: 'brightness(0) invert(1)', display: 'block' }} />
          Add to basket
        </button>
      </div>

      {sheet && (
        <ErSheet kind={sheet} value={sel[sheet]} onPick={v => set(sheet, v)} onClose={() => setSheet(null)} />
      )}
    </div>
  );
}
