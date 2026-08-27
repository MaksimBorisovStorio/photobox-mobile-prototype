// screens/product-photobook.jsx
// Figma: "Photo book page" — node 406:7183 (hero 406:7432, options 406:7220).
// Baseline frame is 402 wide with 24px gutters; card rows scroll horizontally
// because 3×245 + 2×12 = 759 overflows the 354 content width, as designed.
const A = '../shared/assets';

// Card artwork. Figma layers the same photo two or three times at specific
// transforms (a zoomed backdrop plus the product on top), so the percentages
// are carried over verbatim per card rather than collapsed to object-fit.
const SHOTS = {
  a:  { src: 'pb-shot-a.jpg', bg: '#f1f5f6', layers: [
        { h: '100%',    left: '-60.21%', top: '0%',     w: '220.43%' },
        { h: '72.03%',  left: '-29.39%', top: '8.35%',  w: '158.78%' } ] },
  b:  { src: 'pb-shot-b.jpg', bg: '#f1f5f6', layers: [
        { h: '100.15%', left: '-60.38%', top: '-0.08%', w: '220.76%' },
        { h: '62.61%',  left: '-19%',    top: '7.33%',  w: '138%' } ] },
  c:  { src: 'pb-shot-b.jpg', bg: '#f1f5f6', layers: [
        { h: '100.15%', left: '-60.38%', top: '-0.08%', w: '220.76%' },
        { h: '61.29%',  left: '-17.55%', top: '9.25%',  w: '135.1%' } ] },
  xl: { src: 'pb-shot-xl.jpg', bg: '#efefef', layers: [
        { h: '80.29%',  left: '-6.33%',  top: '3.33%',  w: '112.66%' },
        { h: '96.45%',  left: '-17.67%', top: '3.45%',  w: '135.34%' },
        { h: '71.27%',  left: '0%',      top: '0.03%',  w: '100%' } ] },
  lg: { src: 'pb-shot-large.jpg', bg: '#f1f5f6', layers: [
        { h: '71.27%',  left: '0%',      top: '0.1%',   w: '100%' } ] },
};

const FORMATS = [
  { id: 'landscape', title: 'Landscape', price: 'From €24.99', shot: 'a' },
  { id: 'portrait',  title: 'Portrait',  price: 'From €24.99', shot: 'b' },
  { id: 'square',    title: 'Square',    price: 'From €24.99', shot: 'c' },
];

const COVERS = [
  { id: 'hardcover', title: 'Hardcover',  price: 'From €24.99', shot: 'a' },
  { id: 'cutout',    title: 'Cut-out',    price: 'From €24.99', shot: 'c' },
  { id: 'softcover', title: 'Soft cover', price: 'From €24.99', shot: 'c' },
];

// Cut-out branch: not in node 406:7183. Built on the same card pattern; the
// artwork is placeholder (reused product shots) until real cut-out photos exist.
const SHAPES = [
  { id: 'circular',  title: 'Circular',  price: 'Included', shot: 'c' },
  { id: 'rectangle', title: 'Rectangle', price: 'Included', shot: 'b' },
  { id: 'year',      title: 'Year',      price: 'Included', shot: 'a' },
];

// Swatches are the PB3 tokens already in styles.css — nothing invented outside it.
const COLOURS = [
  { id: 'teal',     title: 'Deep teal', hex: '#007377' },
  { id: 'sage',     title: 'Sage',      hex: '#90CED0' },
  { id: 'offwhite', title: 'Off-white', hex: '#F1F6F6' },
  { id: 'sand',     title: 'Sand',      hex: '#D9C9A8' },
  { id: 'charcoal', title: 'Charcoal',  hex: '#333333' },
];

// Sizes depend on the chosen format. The design names Extra large 39×29 and
// Large 28×21 (landscape); the other formats rotate/adapt those, plus a Medium.
// All three cards are 343.779 tall. The design's third size card is 303.779 and
// sits centred in the row (y=20), but that card is its mislabelled "Soft cover"
// placeholder — a real third size matches its siblings. Medium reuses the Large
// photo because the design only ships two size shots.
const SIZES = {
  landscape: [
    { id: 'xl', title: 'Extra large', dim: '39 x 29 cm', price: 'From €24.99', shot: 'xl', w: 261, h: 343.779 },
    { id: 'l',  title: 'Large',       dim: '28 x 21 cm', price: 'From €24.99', shot: 'lg', w: 245, h: 343.779 },
    { id: 'm',  title: 'Medium',      dim: '20 x 15 cm', price: 'From €24.99', shot: 'lg', w: 245, h: 343.779 },
  ],
  portrait: [
    { id: 'xl', title: 'Extra large', dim: '29 x 39 cm', price: 'From €24.99', shot: 'xl', w: 261, h: 343.779 },
    { id: 'l',  title: 'Large',       dim: '21 x 28 cm', price: 'From €24.99', shot: 'lg', w: 245, h: 343.779 },
    { id: 'm',  title: 'Medium',      dim: '15 x 20 cm', price: 'From €24.99', shot: 'lg', w: 245, h: 343.779 },
  ],
  square: [
    { id: 'xl', title: 'Extra large', dim: '30 x 30 cm', price: 'From €24.99', shot: 'xl', w: 261, h: 343.779 },
    { id: 'l',  title: 'Large',       dim: '21 x 21 cm', price: 'From €24.99', shot: 'lg', w: 245, h: 343.779 },
    { id: 'm',  title: 'Medium',      dim: '15 x 15 cm', price: 'From €24.99', shot: 'lg', w: 245, h: 343.779 },
  ],
};

const DISPLAY = '-apple-system, "SF Pro Display", system-ui, sans-serif';
const TEXT    = '-apple-system, "SF Pro Text", system-ui, sans-serif';

// ── Selection radio — Figma node 406:7232 (32px, glass ring). The export only
// carries the unselected state, so the selected state fills it with the brand
// secondary and adds a check.
function SelectDot({ selected }) {
  return (
    <div style={{
      position: 'absolute', left: 16, top: 16, width: 32, height: 32,
      borderRadius: '50%', boxSizing: 'border-box',
      background: selected ? 'var(--colour-foreground-fg-secondary, #007377)' : 'rgba(0,0,0,0.1)',
      border: '2px solid #FFFFFF',
      backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
      boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 160ms ease',
    }}>
      {selected && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3.5 8.4L6.3 11.2L12.5 5" stroke="#fff" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

// ── Option card — Figma node 406:7227
function OptionCard({ shot, title, dim, price, selected, onSelect, showInfo,
                      w = 245, h = 303.779, tall }) {
  const s = SHOTS[shot];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{
        position: 'relative', flex: '0 0 auto', width: w, height: h,
        borderRadius: 20, overflow: 'hidden', padding: 0,
        border: selected
          ? '2px solid var(--colour-foreground-fg-secondary, #007377)'
          : '1px solid #FFFFFF',
        boxShadow: '0px 4px 4px -4px rgba(0,0,0,0.25)',
        background: s.bg, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        alignItems: 'flex-start', paddingTop: 24, boxSizing: 'border-box',
        transition: 'transform 140ms ease, border-color 160ms ease',
        WebkitTapHighlightColor: 'transparent', textAlign: 'left',
      }}
    >
      {/* artwork layers */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', pointerEvents: 'none' }}>
        {s.layers.map((l, i) => (
          <img key={i} src={`${A}/${s.src}`} alt=""
               style={{ position: 'absolute', left: l.left, top: l.top,
                        width: l.w, height: l.h, maxWidth: 'none', display: 'block' }} />
        ))}
      </div>

      {/* caption — node 406:7228: blurred gradient scrim */}
      <div style={{
        position: 'relative', width: '100%', boxSizing: 'border-box',
        padding: tall ? '32px 20px 24px' : '24px 20px 20px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        backdropFilter: 'blur(25px)', WebkitBackdropFilter: 'blur(25px)',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%',
                      filter: 'drop-shadow(0px 0px 2px rgba(0,0,0,0.25))' }}>
          <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 22,
                      lineHeight: '28px', letterSpacing: '0.35px', color: '#FFFFFF' }}>{title}</p>
          {dim && (
            <p style={{ margin: 0, fontFamily: TEXT, fontSize: 17, lineHeight: '22px',
                        letterSpacing: '-0.41px', color: '#FAFAFA' }}>{dim}</p>
          )}
          <p style={{ margin: 0, fontFamily: TEXT, fontSize: 13, lineHeight: '18px',
                      letterSpacing: '-0.08px', color: '#FAFAFA' }}>{price}</p>
        </div>
      </div>

      <SelectDot selected={selected} />

      {showInfo && (
        <img src={`${A}/pb-icon-info.svg`} alt="" aria-hidden
             style={{ position: 'absolute', right: 14, top: 251, width: 32, height: 32,
                      mixBlendMode: 'soft-light', display: 'block' }} />
      )}
    </button>
  );
}

// ── Section — Figma node 406:7221: 22px title, 24px gap, 12px card gap.
// The row bleeds past the 24px gutters so cards can scroll to the screen edge,
// with bottom padding so the card shadow is not clipped by overflow-x.
function OptionSection({ title, children, innerRef }) {
  return (
    <div ref={innerRef} style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 22,
                  lineHeight: '28px', letterSpacing: '0.35px',
                  color: 'var(--colour-foreground-fg-black, #333)' }}>{title}</p>
      <div style={{
        display: 'flex', gap: 12, alignItems: 'center',
        margin: '0 -24px', padding: '0 24px 10px',
        overflowX: 'auto', overflowY: 'hidden',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
      }}>
        {children}
      </div>
    </div>
  );
}

function ColourSwatch({ hex, title, selected, onSelect }) {
  return (
    <button
      type="button" onClick={onSelect} aria-pressed={selected} aria-label={title}
      onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.94)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{
        flex: '0 0 auto', border: 'none', background: 'none', padding: 0,
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 8, width: 72,
        transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      }}
    >
      <span style={{
        width: 56, height: 56, borderRadius: '50%', background: hex,
        boxSizing: 'border-box', display: 'block',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: selected
          ? '0 0 0 2px #FFFFFF, 0 0 0 4px var(--colour-foreground-fg-secondary, #007377), 0px 4px 4px -4px rgba(0,0,0,0.25)'
          : '0px 4px 4px -4px rgba(0,0,0,0.25)',
        transition: 'box-shadow 160ms ease',
      }} />
      <span style={{ fontFamily: TEXT, fontSize: 13, lineHeight: '18px', letterSpacing: '-0.08px',
                     color: selected ? 'var(--colour-foreground-fg-black, #333)' : '#777',
                     fontWeight: selected ? 600 : 400, textAlign: 'center' }}>{title}</span>
    </button>
  );
}

// ── Lay-flat upsell — Figma node 406:7296
function LayFlatCard({ on, onToggle }) {
  return (
    <div style={{
      width: '100%', height: 398, boxSizing: 'border-box', padding: 20,
      background: 'var(--colour-foreground-fg-white, #FFFFFF)', borderRadius: 24,
      overflow: 'hidden', display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Toggle — node 406:7297. The export carries only the off state, so this
          is drawn in code with the same 55×32 geometry and glass ring. */}
      <button
        type="button" role="switch" aria-checked={on} aria-label="Add Lay-flat"
        onClick={onToggle}
        style={{
          width: 55, height: 32, borderRadius: 16, padding: 0, flexShrink: 0,
          position: 'relative', cursor: 'pointer', boxSizing: 'border-box',
          border: '2px solid #FFFFFF',
          background: on ? 'var(--colour-foreground-fg-secondary, #007377)' : 'rgba(0,0,0,0.1)',
          boxShadow: '0px 4px 4px -4px rgba(0,0,0,0.25)',
          transition: 'background 180ms ease',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: on ? 25 : 2,
          width: 24, height: 24, borderRadius: '50%', background: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'left 180ms cubic-bezier(0.32,0.72,0.24,1)',
        }} />
      </button>

      <div style={{ flex: '1 1 0', minHeight: 0, position: 'relative', width: '100%' }}>
        <div style={{
          position: 'absolute', left: 'calc(50% - 1px)', top: 'calc(50% - 21.84px)',
          transform: 'translate(-50%, -50%) scaleX(-1)',
          width: 356, height: 183, overflow: 'hidden',
        }}>
          <img src={`${A}/pb-layflat.png`} alt=""
               style={{ position: 'absolute', left: '-14.61%', top: '-0.05%',
                        width: '128.65%', height: '100.11%', maxWidth: 'none', display: 'block' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 22,
                    lineHeight: '28px', letterSpacing: '0.35px',
                    color: 'var(--colour-foreground-fg-black, #333)' }}>Add Lay-flat</p>
        <p style={{ margin: 0, fontFamily: TEXT, fontWeight: 600,
                    color: 'var(--colour-foreground-fg-black, #333)' }}>
          <span style={{ fontSize: 13, lineHeight: '18px', letterSpacing: '-0.08px' }}>+ </span>
          <span style={{ fontSize: 15, lineHeight: '20px', letterSpacing: '-0.24px' }}>€1.99 per page</span>
        </p>
        <p style={{ margin: 0, fontFamily: TEXT, fontSize: 13, lineHeight: '18px',
                    letterSpacing: '-0.08px', color: '#777' }}>
          Pages open completely flat, perfect for panoramic spreads.
        </p>
      </div>
    </div>
  );
}

// ── Review your choice — Figma node 406:7306 ──────────────────────────────────
// The design's background is four copies of the same photo at these transforms;
// its export is byte-identical to pb-shot-a.jpg, so the file is reused. The photo
// follows the chosen format so the block previews what was actually selected.
const REVIEW_LAYERS = [
  { h: '100%',   left: '-60.13%', top: '0%',     w: '220.43%' },
  { h: '89.08%', left: '-48.09%', top: '7.97%',  w: '196.35%' },
  { h: '74.41%', left: '-31.92%', top: '17.4%',  w: '164.01%' },
  { h: '67.63%', left: '-24.46%', top: '24.56%', w: '149.09%' },
];

// Price model. The option cards all read a flat "From €24.99" while the review
// block reads €44.99 for Large / Landscape / Hardcover / Layflat, so these
// increments are reverse-engineered to hit that exact total: 29.99 + 10 + 5.
const SIZE_BASE   = { xl: 34.99, l: 29.99, m: 24.99 };
const COVER_ADD   = { softcover: 0, hardcover: 10, cutout: 15 };
const LAYFLAT_ADD = 5;

// Single source of truth for the summary, shared by the sticky bar and the
// full review block so they can never drift apart.
function summarise({ format, cover, size, shape, colour, layflat }) {
  const fmt = FORMATS.find(f => f.id === format);
  const cov = COVERS.find(c => c.id === cover);
  const siz = size ? SIZES[format].find(z => z.id === size) : null;
  const shp = SHAPES.find(x => x.id === shape);
  const col = COLOURS.find(x => x.id === colour);

  // The label is "From", so an unfinished selection shows the cheapest option
  // still consistent with it — truthful at every step, and it converges on the
  // exact total once everything is chosen.
  const base = siz ? SIZE_BASE[siz.id] : Math.min(...Object.values(SIZE_BASE));
  const add  = cov ? COVER_ADD[cov.id] : Math.min(...Object.values(COVER_ADD));

  return {
    line1: siz ? `${siz.title} ${fmt.title}` : fmt.title,
    line2: cov ? `${cov.title}${layflat ? ' with Layflat' : ''}` : '',
    detail: !siz ? ''
      : (cover === 'cutout' && shp && col
          ? `${siz.dim} · ${shp.title} cut-out, ${col.title}`
          : siz.dim),
    total: (base + add + (layflat ? LAYFLAT_ADD : 0)).toFixed(2),
    src: SHOTS[fmt.shot].src,
  };
}

// Condensed summary bar: the review block's headline and price only, pinned to
// the bottom while the user is still choosing. It hides as soon as the full
// review block scrolls into view so the two never show at once.
function SummaryBar({ summary }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 5,
      boxSizing: 'border-box',
      background: 'var(--functional-colours-grey-50, #F4F4F4)',
      borderRadius: '24px 24px 0 0',
      boxShadow: '0px -4px 16px -1px rgba(0,77,74,0.10)',
      padding: 24,
      paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
      display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'space-between',
      animation: 'pbBarIn 220ms cubic-bezier(0.32,0.72,0.24,1) both',
    }}>
      <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 20,
                  lineHeight: '24px', letterSpacing: '0.38px',
                  color: 'var(--colour-foreground-fg-black, #333)' }}>
        {summary.line1}{summary.line2 ? <><br />{summary.line2}</> : null}
      </p>
      <p style={{ margin: 0, textAlign: 'right', whiteSpace: 'nowrap',
                  color: 'var(--colour-foreground-fg-black, #333)' }}>
        <span style={{ fontFamily: TEXT, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.24px' }}>From</span>
        <br />
        <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 20,
                       lineHeight: '24px', letterSpacing: '0.38px' }}>€{summary.total}</span>
      </p>
    </div>
  );
}

function ReviewSection({ format, cover, size, shape, colour, layflat, onStart, innerRef }) {
  const sum = summarise({ format, cover, size, shape, colour, layflat });
  const { line1, line2, detail, total, src } = sum;

  return (
    <div ref={innerRef} style={{
      position: 'relative', width: '100%', height: 542, overflow: 'hidden',
      borderRadius: '24px 24px 0 0', background: '#F4F4F4',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {REVIEW_LAYERS.map((l, i) => (
          <img key={i} src={`${A}/${src}`} alt=""
               style={{ position: 'absolute', left: l.left, top: l.top,
                        width: l.w, height: l.h, maxWidth: 'none', display: 'block' }} />
        ))}
      </div>

      {/* Progressive blur behind the header text. A single backdrop-filter is
          uniform and leaves a hard edge where it stops, so this stacks layers of
          doubling blur, each masked to a shorter band near the top. Because each
          layer samples the backdrop *including the layers already painted below
          it*, the blur accumulates — ~31px at the very top easing to 0 by the
          bottom of the scrim. */}
      <div aria-hidden style={{
        // Ends above the 243px scrim bottom; see the note on the layer stops.
        position: 'absolute', left: 0, right: 0, top: 0, height: 240,
        pointerEvents: 'none',
      }}>
        {/* Stops are absolute px, not percentages: percentages scale with the
            container, which pushed the strong layers down over the book photo.
            [blur, fully-opaque-until, gone-by] — the strong layers stay near the
            top, only the 1px layer has a tail. The stops sit well above the scrim's
            243px bottom because the effect reaches further than the masks suggest:
            each layer blurs the already-blurred composite beneath it, and a layer's
            blur samples past its own mask. Measured, not guessed — the book photo
            below must stay crisp. */}
        {[[16, 8, 38], [8, 20, 66], [4, 34, 96], [2, 52, 128], [1, 70, 160]].map(
          ([blur, solid, gone]) => {
            const fade = `linear-gradient(to bottom, #000 0px, #000 ${solid}px,` +
                         ` rgba(0,0,0,0) ${gone}px)`;
            return (
              <div key={blur} style={{
                position: 'absolute', inset: 0,
                backdropFilter: `blur(${blur}px)`, WebkitBackdropFilter: `blur(${blur}px)`,
                maskImage: fade, WebkitMaskImage: fade,
              }} />
            );
          })}
      </div>

      {/* scrim — node 406:7307 */}
      <div style={{
        position: 'relative', width: '100%', height: 243, boxSizing: 'border-box',
        padding: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        background: 'linear-gradient(to top, rgba(0,0,0,0.01) 0%, rgba(0,0,0,0.5) 100%)',
      }}>
        <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ margin: 0, fontFamily: TEXT, fontWeight: 600, fontSize: 13,
                      lineHeight: '18px', letterSpacing: '-0.08px',
                      color: 'rgba(255,255,255,0.75)' }}>Review your choice</p>
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', justifyContent: 'center', width: '100%' }}>
            <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column',
                          gap: 8, justifyContent: 'center' }}>
              <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 600, fontSize: 20,
                          lineHeight: '24px', letterSpacing: '0.38px', color: '#FFFFFF' }}>
                {line1}<br />{line2}
              </p>
              <p style={{ margin: 0, fontFamily: TEXT, fontSize: 13, lineHeight: '18px',
                          letterSpacing: '-0.08px', color: '#FAFAFA' }}>{detail}</p>
              <p style={{ margin: 0, fontFamily: TEXT, fontSize: 13, lineHeight: '18px',
                          letterSpacing: '-0.08px', color: '#FAFAFA' }}>Price not included delivery</p>
            </div>
            <p style={{ margin: 0, textAlign: 'right', whiteSpace: 'nowrap', color: '#FFFFFF' }}>
              <span style={{ fontFamily: TEXT, fontSize: 15, lineHeight: '20px', letterSpacing: '-0.24px' }}>From</span>
              <br />
              <span style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 20,
                             lineHeight: '24px', letterSpacing: '0.38px' }}>€{total}</span>
            </p>
          </div>
        </div>
      </div>

      {/* CTA — node 406:7315/7316. Figma specifies "Brandon Text a Bold", which is
          not available; Teachers is the self-hosted brand face used on other CTAs. */}
      <div style={{
        position: 'relative', width: '100%', boxSizing: 'border-box', padding: 24,
        paddingBottom: 'max(24px, calc(env(safe-area-inset-bottom, 0px) + 8px))',
      }}>
        <button
          type="button" onClick={onStart}
          onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
          onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          style={{
            width: '100%', height: 72, borderRadius: 36, border: 'none',
            background: 'var(--colour-foreground-fg-white, #FFFFFF)',
            padding: '0 24px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
          }}
        >
          <span style={{ fontFamily: '"Teachers", -apple-system, system-ui, sans-serif',
                         fontWeight: 700, fontSize: 18, lineHeight: '24px',
                         color: 'var(--colour-foreground-fg-black, #333)' }}>Start create</span>
          <img src={`${A}/pb-icon-arrow.svg`} alt="" width={24} height={24} style={{ display: 'block' }} />
        </button>
      </div>
    </div>
  );
}

const BENEFITS = [
  { icon: 'pb-icon-quality.svg',  lines: ['Lasting', 'quality'] },
  { icon: 'pb-icon-pages.svg',    lines: ['Up to', '120 pages'] },
  { icon: 'pb-icon-delivery.svg', lines: ['Delivery', 'in 4 days'] },
];

function ProductPhotobookScreen() {
  const { useState, useRef, useEffect } = React;
  const [format, setFormat] = useState(null);
  const [cover,  setCover]  = useState(null);
  const [shape,  setShape]  = useState(null);
  const [colour, setColour] = useState(null);
  const [size,   setSize]   = useState(null);
  const [layflat, setLayflat] = useState(false);

  const isCutout = cover === 'cutout';
  // Progressive reveal: a step appears once everything before it is answered.
  const showCover  = !!format;
  const showCutout = showCover && isCutout;
  const showSize   = showCover && (!isCutout || (!!shape && !!colour));
  const showExtras = showSize && !!size;
  const complete   = showExtras;

  // Scroll each newly revealed step into view.
  const refs = { cover: useRef(null), shape: useRef(null), colour: useRef(null), size: useRef(null) };
  const scrollerRef = useRef(null);
  const reviewRef = useRef(null);
  const [reviewSeen, setReviewSeen] = useState(false);
  const reveal = key => {
    requestAnimationFrame(() => {
      const el = refs[key] && refs[key].current;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  // The condensed bar yields to the full review block the moment it appears.
  useEffect(() => {
    if (!complete) { setReviewSeen(false); return; }
    const el = reviewRef.current, root = scrollerRef.current;
    if (!el || !root || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      entries => setReviewSeen(entries[0].isIntersecting),
      { root, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [complete]);

  // Choosing a different format invalidates the size picked under the old one.
  const pickFormat = id => { setFormat(id); setSize(null); reveal('cover'); };
  const pickCover = id => {
    setCover(id);
    if (id !== 'cutout') { setShape(null); setColour(null); }
    reveal(id === 'cutout' ? 'shape' : 'size');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%',
                  background: '#F1F6F6', overflow: 'hidden' }}>
      <style>{`
        @keyframes pbBarIn {
          from { opacity: 0; transform: translateY(100%); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div ref={scrollerRef} style={{
        position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>
        {/* ── Hero — Figma node 406:7432 ── */}
        <div style={{ paddingTop: 'max(72px, calc(env(safe-area-inset-top, 44px) + 28px))' }}>
          <div style={{ padding: '0 21px' }}>
            <button
              type="button"
              onClick={() => window.navigation.pop()}
              aria-label="Back"
              onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.9)'; }}
              onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              style={{
                width: 40, height: 40, borderRadius: 20, padding: 8, border: 'none',
                background: 'rgba(255,255,255,0.01)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
              }}
            >
              <img src={`${A}/pb-icon-back.svg`} alt="" width={24} height={24} style={{ display: 'block' }} />
            </button>
          </div>

          {/* title block — node 406:7444 */}
          <div style={{ padding: '32px 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ margin: 0, fontFamily: '"Teachers", -apple-system, system-ui, sans-serif',
                        fontWeight: 700, fontSize: 42, lineHeight: '41px', letterSpacing: '-0.63px',
                        color: 'var(--colour-foreground-fg-black, #333)' }}>
              Photo books
            </p>
            <p style={{ margin: 0, fontFamily: TEXT, letterSpacing: '-0.41px', color: '#007377' }}>
              <span style={{ fontSize: 17, lineHeight: '22px' }}>Start from </span>
              <span style={{ fontSize: 17, lineHeight: '22px', fontWeight: 700 }}>€14.99</span>
            </p>
          </div>

          {/* benefits — node 406:7433 */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', padding: 16, marginTop: 15 }}>
            {BENEFITS.map(b => (
              <div key={b.icon} style={{
                flex: '1 1 0', minWidth: 0, height: 94, borderRadius: 24,
                background: 'var(--colour-foreground-fg-white, #FFFFFF)',
                overflow: 'hidden', padding: '0 4px', boxSizing: 'border-box',
                display: 'flex', flexDirection: 'column', gap: 8,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={`${A}/${b.icon}`} alt="" width={24} height={24} style={{ display: 'block' }} />
                <p style={{ margin: 0, fontFamily: TEXT, fontWeight: 600, fontSize: 15,
                            lineHeight: '20px', letterSpacing: '-0.24px', color: '#777',
                            textAlign: 'center' }}>
                  {b.lines[0]}<br />{b.lines[1]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Options — Figma node 406:7220: gap 48, padding 40/24 ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48,
                      padding: '40px 24px', boxSizing: 'border-box' }}>
          <OptionSection title="Choose Format">
            {FORMATS.map(f => (
              <OptionCard key={f.id} {...f} tall showInfo
                          selected={format === f.id} onSelect={() => pickFormat(f.id)} />
            ))}
          </OptionSection>

          {showCover && (
            <OptionSection title="Choose cover type" innerRef={refs.cover}>
              {COVERS.map(c => (
                <OptionCard key={c.id} {...c}
                            selected={cover === c.id} onSelect={() => pickCover(c.id)} />
              ))}
            </OptionSection>
          )}

          {showCutout && (
            <OptionSection title="Choose cut-out shape" innerRef={refs.shape}>
              {SHAPES.map(s => (
                <OptionCard key={s.id} {...s}
                            selected={shape === s.id}
                            onSelect={() => { setShape(s.id); reveal(colour ? 'size' : 'colour'); }} />
              ))}
            </OptionSection>
          )}

          {showCutout && (
            <div ref={refs.colour} style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
              <p style={{ margin: 0, fontFamily: DISPLAY, fontWeight: 700, fontSize: 22,
                          lineHeight: '28px', letterSpacing: '0.35px',
                          color: 'var(--colour-foreground-fg-black, #333)' }}>
                Choose cover colour
              </p>
              <div style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                margin: '0 -24px', padding: '0 24px 10px',
                overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none',
              }}>
                {COLOURS.map(c => (
                  <ColourSwatch key={c.id} {...c} selected={colour === c.id}
                                onSelect={() => { setColour(c.id); reveal('size'); }} />
                ))}
              </div>
            </div>
          )}

          {showSize && (
            <OptionSection title="Choose size" innerRef={refs.size}>
              {SIZES[format].map(s => (
                <OptionCard key={s.id} {...s}
                            selected={size === s.id} onSelect={() => setSize(s.id)} />
              ))}
            </OptionSection>
          )}

          {showExtras && <LayFlatCard on={layflat} onToggle={() => setLayflat(v => !v)} />}
        </div>

        {/* The summary bar is absolutely positioned over the scroller, so the
            content needs matching room at the end or the last revealed section
            ends up trapped underneath it with no scroll left — which is exactly
            what happened to the colour swatches. Not needed once complete: the
            542-tall review block follows, and the bar hides as it comes into view. */}
        {!!format && !complete && (
          <div aria-hidden style={{ height: 'calc(112px + env(safe-area-inset-bottom, 0px))' }} />
        )}

        {/* Review your choice — full bleed, so it sits outside the 24px gutters */}
        {complete && (
          <ReviewSection
            innerRef={reviewRef}
            format={format} cover={cover} size={size}
            shape={shape} colour={colour} layflat={layflat}
            onStart={() => window.navigation.push('editor-configure.html')}
          />
        )}
      </div>

      {!!format && !reviewSeen && (
        <SummaryBar summary={summarise({ format, cover, size, shape, colour, layflat })} />
      )}
    </div>
  );
}
