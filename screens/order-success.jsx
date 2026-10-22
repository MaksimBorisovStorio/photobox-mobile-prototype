// screens/order-success.jsx — "Order placed", handoff option 6a.
//
// Replaces the earlier Figma 519:26366 build. The handoff (design_handoff_order_confirmation,
// option 6a) is high fidelity for colour, type, spacing, copy and timing; its photos are
// placeholders, so the hero uses the customer's own book (bpBook from book-preview.jsx).
//
// The hero was reworked after review (no beige, no photo cards flying out): a deep teal
// spotlight with slow light rays and twinkles. Timeline (s after mount): the customer's
// book drops in spinning 0.15 → 1.4 and lands · turns to face you while the cover swings
// open onto a layflat spread 1.6 → 2.7 · a halo and a burst of confetti thrown out of
// the book at 2.5 · light sweeps the page 2.7 · text rises 2.7 · a softer confetti
// rain from 2.9.
//
// Deviations from the handoff, deliberately:
//   - BrandonTextA is a commercial face and this prototype is served publicly from
//     GitHub Pages, so it is not shipped; PB_DISPLAY stands in.
//   - Material Symbols are drawn as inline SVGs (the app has no icon font).
//   - Order number and delivery window come from MOCK.order, and the book title is
//     "My photo book", to agree with the rest of the flow.
//   - The factory video has no source yet: the card uses a still of the AlbumPrinter
//     Productions B.V. print floor (os-factory.jpg) and the
//     play button runs the progress bar only.

const OS_A = '../shared/assets';
const OS_FONT = PB_DISPLAY;
const OS_TEAL = '#007377';
const OS_DEEP = '#004B53';
const OS_EDGE = '#E1ECEC';
const OS_MINT = '#EDF5F6';
const OS_PAPER = '#F7F5EF';
const OS_BOARD = '#0b4a4b';
const OS_TITLE = 'My photo book';
const OS_CONFETTI_COLORS = ['#FFFFFF', '#F6C66B', '#9BCFC9', '#F38892', '#00A390', '#7FD3CF', '#FFE3A3'];
const OS_PANO = `${OS_A}/photos/mock-01.webp`;

// Book geometry (one page). Portrait, like the default Large Portrait book.
const OS_W = 140, OS_H = 187, OS_T = 11;

// Seeded so re-renders never reshuffle the pieces.
function osRand(seed) {
  return () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
}

// The burst: pieces thrown out of the opening book, then falling under gravity.
function osBurst() {
  const rnd = osRand(11);
  return Array.from({ length: 90 }, (_, i) => {
    const ang = rnd() * Math.PI * 2;
    const dist = 110 + rnd() * 170;
    const w = 6 + rnd() * 5, round = rnd() < 0.3;
    return {
      x: Math.cos(ang) * dist, y: Math.sin(ang) * dist * 0.8 - 40,
      w, h: round ? w : w * 1.7, r: round ? '50%' : 2,
      c: OS_CONFETTI_COLORS[i % OS_CONFETTI_COLORS.length],
      dur: 2.2 + rnd() * 1.4, delay: 2.55 + rnd() * 0.12,
      spin: `osSpin ${(0.7 + rnd() * 0.9).toFixed(2)}s linear infinite`,
    };
  });
}

// A softer second wave drifting down over the whole screen.
function osRain() {
  const rnd = osRand(42);
  return Array.from({ length: 80 }, (_, i) => {
    const w = 5 + rnd() * 5, round = rnd() < 0.3;
    return {
      left: `${(rnd() * 100).toFixed(2)}%`, w, h: round ? w : w * 1.7, r: round ? '50%' : 2,
      c: OS_CONFETTI_COLORS[(i * 3) % OS_CONFETTI_COLORS.length],
      fall: `osFall ${(3 + rnd() * 2).toFixed(2)}s cubic-bezier(.3,.5,.5,1) ${(2.9 + rnd() * 1.2).toFixed(2)}s both`,
      spin: `osSpin ${(0.9 + rnd() * 0.9).toFixed(2)}s linear infinite`,
    };
  });
}

// Twinkles around the book: position (% of stage), size, delay.
const OS_SPARKS = (() => {
  const rnd = osRand(5);
  return Array.from({ length: 14 }, () => ({
    x: 6 + rnd() * 88, y: 8 + rnd() * 80, s: 8 + rnd() * 12, d: rnd() * 3, dur: 2.2 + rnd() * 1.6,
  }));
})();

const OS_EASE = 'cubic-bezier(.2,.8,.2,1)';
const OS_CSS = `
  @keyframes osFall { 0% { transform: translateY(-40px); opacity: 1 } 88% { opacity: 1 } 100% { transform: translateY(860px); opacity: 0 } }
  @keyframes osSpin { 0% { transform: translateX(0) rotate(0) } 50% { transform: translateX(14px) rotate(180deg) } 100% { transform: translateX(0) rotate(360deg) } }
  @keyframes osThrow {
    0% { transform: translate(0,0) scale(.3); opacity: 0 }
    6% { opacity: 1 }
    35% { transform: translate(var(--x), var(--y)) scale(1); animation-timing-function: cubic-bezier(.5,0,.9,.6) }
    100% { transform: translate(calc(var(--x) * 1.25), calc(var(--y) + 620px)) scale(1); opacity: 0 } }
  @keyframes osPop { 0% { transform: scale(.4); opacity: 0 } 60% { transform: scale(1.12); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
  @keyframes osRise { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
  @keyframes osFadeIn { from { opacity: 0 } to { opacity: 1 } }
  @keyframes osRays { from { transform: rotate(0) } to { transform: rotate(360deg) } }
  @keyframes osTwinkle { 0%,100% { transform: scale(0) rotate(0); opacity: 0 } 50% { transform: scale(1) rotate(45deg); opacity: 1 } }
  @keyframes osHalo { 0% { transform: scale(.4); opacity: 0 } 30% { opacity: .9 } 100% { transform: scale(2.6); opacity: 0 } }
  @keyframes osProgress { from { width: 0 } to { width: 100% } }
  /* Extra products in a multi-item order: thrown in from below, landing beside the book. */
  @keyframes osSideIn {
    0% { transform: translate(calc(var(--x) * .3), 260px) rotate(calc(var(--r) * -3)) scale(.4); opacity: 0 }
    15% { opacity: 1 }
    100% { transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(1); opacity: 1 } }
  @keyframes osBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
  /* The book: drops in spinning, lands angled, then turns to face you as it opens. */
  @keyframes osFly {
    0% { transform: translate3d(0,-300px,0) rotateX(40deg) rotateY(-260deg) rotateZ(-20deg) scale(.5); opacity: 0 }
    12% { opacity: 1 }
    48% { transform: translate3d(0,8px,0) rotateX(22deg) rotateY(-28deg) rotateZ(4deg) scale(1.04) }
    58% { transform: translate3d(0,0,0) rotateX(20deg) rotateY(-24deg) rotateZ(2deg) scale(1) }
    100% { transform: translate3d(0,0,0) rotateX(26deg) rotateY(0deg) rotateZ(0deg) scale(1) } }
  @keyframes osCenter { from { transform: translateX(${-OS_W / 2}px) } to { transform: translateX(0) } }
  @keyframes osCover { from { transform: rotateY(0) } to { transform: rotateY(-180deg) } }
  @keyframes osShadow { 0% { transform: scale(.2); opacity: 0 } 48% { transform: scale(.9); opacity: .9 } 100% { transform: scale(1.5,1); opacity: 1 } }
  @keyframes osSheen { 0% { transform: translateX(-140%) skewX(-18deg) } 100% { transform: translateX(240%) skewX(-18deg) } }
  /* Coming back to the screen, or with reduce-motion on: every one-shot animation
     jumps to its end state. The loops keep running unless motion is off. */
  [data-os-still] .os-once { animation-duration: 0s !important; animation-delay: 0s !important; }
  [data-os-calm] .os-loop { animation: none !important; }
`;

const OsIcon = {
  share: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14V3.5" /><path d="M8 7l4-4 4 4" /><path d="M7 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1" /></g>,
  play: <path d="M8.5 5.8v12.4a.8.8 0 0 0 1.2.7l9.8-6.2a.8.8 0 0 0 0-1.4L9.7 5.1a.8.8 0 0 0-1.2.7Z" fill="currentColor" />,
  pause: <g fill="currentColor"><rect x="7" y="5" width="3.6" height="14" rx="1" /><rect x="13.4" y="5" width="3.6" height="14" rx="1" /></g>,
  support: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 13v-1.5a7.5 7.5 0 0 1 15 0V13" /><rect x="3.5" y="12.5" width="3.5" height="5" rx="1.5" />
    <rect x="17" y="12.5" width="3.5" height="5" rx="1.5" /><path d="M19 17.5c0 2-2 3-5 3h-1.5" /></g>,
  spark: <path d="M12 1.5c.7 6.2 4.3 9.8 10.5 10.5-6.2.7-9.8 4.3-10.5 10.5C11.3 16.3 7.7 12.7 1.5 12 7.7 11.3 11.3 7.7 12 1.5Z" fill="currentColor" />,
};
const OsSvg = ({ name, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>{OsIcon[name]}</svg>
);

const OS_EDGE_V = 'repeating-linear-gradient(90deg, #f6f3ec 0 1px, #dcd7cc 1px 2px)';
const OS_EDGE_H = 'repeating-linear-gradient(0deg, #f6f3ec 0 1px, #dcd7cc 1px 2px)';

// A CSS box, x ∈ [x0, x0+w], y centred, z ∈ [z0, z0+d]. Side faces only, with a fill each.
function OsSlab({ x0, w, h, z0, d, faces }) {
  const face = (bg, st) => <div style={Object.assign({ position: 'absolute', background: bg }, st)} />;
  const zc = z0 + d / 2;
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d' }}>
      {faces.right && face(faces.right, { left: x0 + w - d / 2, top: -h / 2, width: d, height: h, transform: `translateZ(${zc}px) rotateY(90deg)` })}
      {faces.left && face(faces.left, { left: x0 - d / 2, top: -h / 2, width: d, height: h, transform: `translateZ(${zc}px) rotateY(90deg)` })}
      {faces.top && face(faces.top, { left: x0, top: -h / 2 - d / 2, width: w, height: d, transform: `translateZ(${zc}px) rotateX(90deg)` })}
      {faces.bottom && face(faces.bottom, { left: x0, top: h / 2 - d / 2, width: w, height: d, transform: `translateZ(${zc}px) rotateX(90deg)` })}
      {faces.back && face(faces.back, { left: x0, top: -h / 2, width: w, height: h, transform: `translateZ(${z0}px) rotateY(180deg)` })}
    </div>
  );
}

// ── The customer's book, in 3D. It lands closed, then the cover swings open onto a
// layflat spread with one photo running across both pages.
function OsBook({ cover }) {
  const w = OS_W, h = OS_H, t = OS_T, ov = 3;
  const hide = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };
  const half = side => ({
    position: 'absolute', inset: 0, backgroundImage: `url(${OS_PANO})`, backgroundSize: '200% 100%',
    backgroundPosition: side === 'l' ? '0% 50%' : '100% 50%',
  });
  return (
    <div className="os-once" style={{
      position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d',
      animation: `osFly 2.6s ${OS_EASE} .15s both`,
    }}>
      <div className="os-once" style={{ position: 'absolute', transformStyle: 'preserve-3d', animation: `osCenter 1.1s cubic-bezier(.6,0,.2,1) 1.6s both` }}>
        {/* page block under the right-hand page, and the back board */}
        <OsSlab x0={0} w={w} h={h} z0={-t} d={t - 1}
          faces={{ right: OS_EDGE_V, top: OS_EDGE_H, bottom: OS_EDGE_H, left: OS_BOARD }} />
        <OsSlab x0={-ov / 2} w={w + ov} h={h + 2 * ov} z0={-t - 2} d={2}
          faces={{ right: OS_BOARD, top: OS_BOARD, bottom: OS_BOARD, left: OS_BOARD, back: OS_BOARD }} />
        {/* right page */}
        <div style={{ position: 'absolute', left: 0, top: -h / 2, width: w, height: h, background: OS_PAPER, overflow: 'hidden',
          transform: 'translateZ(-1px)' }}>
          <div style={half('r')} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,.3) 0, rgba(0,0,0,.05) 2px, rgba(0,0,0,0) 8px)' }} />
          <div className="os-once" style={{ position: 'absolute', top: 0, bottom: 0, width: '45%', left: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.55), rgba(255,255,255,0))',
            animation: 'osSheen 1.1s ease-in-out 2.7s both' }} />
        </div>
        {/* front cover: art on the front, the left page on its back */}
        <div className="os-once" style={{
          position: 'absolute', left: 0, top: -h / 2 - ov, width: w + ov, height: h + 2 * ov, transformOrigin: 'left center',
          transformStyle: 'preserve-3d', animation: `osCover 1.1s cubic-bezier(.6,0,.2,1) 1.6s both`,
        }}>
          <div style={{ position: 'absolute', inset: 0, ...hide, borderRadius: '1px 4px 4px 1px', overflow: 'hidden', background: OS_BOARD,
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)' }}>
            <img src={cover} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '28px 10px 10px',
              background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,.55))', fontFamily: OS_FONT, fontWeight: 700,
              fontSize: 16, lineHeight: 1.1, color: '#fff' }}>{OS_TITLE}</div>
            <div style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 1.5, background: 'rgba(0,0,0,.25)' }} />
          </div>
          {/* the inside of the cover board: the left page sits on it, flush to the spine */}
          <div style={{ position: 'absolute', inset: 0, ...hide, transform: 'rotateY(180deg)', background: OS_BOARD,
            borderRadius: '4px 1px 1px 4px' }}>
            <div style={{ position: 'absolute', left: ov, top: ov, width: w, height: h, overflow: 'hidden', background: OS_PAPER }}>
              <div style={half('l')} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(0,0,0,.3) 0, rgba(0,0,0,.05) 2px, rgba(0,0,0,0) 8px)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── The other products a multi-item order can hold, drawn with the customer's photos.
function OsCalendar({ photo }) {
  return (
    <div style={{ width: 92, height: 128, background: '#fff', borderRadius: 4, padding: '12px 7px 7px', boxSizing: 'border-box',
      boxShadow: '0 16px 26px rgba(0,25,28,.45)', position: 'relative', display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* wire binding */}
      <div style={{ position: 'absolute', top: 3, left: 10, right: 10, display: 'flex', justifyContent: 'space-between' }}>
        {Array.from({ length: 9 }, (_, i) => <span key={i} style={{ width: 3, height: 6, borderRadius: 2, background: '#5c6b6b' }} />)}
      </div>
      <img src={photo} alt="" style={{ width: '100%', height: 62, objectFit: 'cover', display: 'block', borderRadius: 2 }} />
      <div style={{ fontFamily: OS_FONT, fontSize: 6.5, fontWeight: 700, letterSpacing: '.18em', color: OS_DEEP }}>JANUARY</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
        {Array.from({ length: 28 }, (_, i) => (
          <span key={i} style={{ height: 4, borderRadius: 1, background: i === 11 ? '#F38892' : '#E3ECEC' }} />
        ))}
      </div>
    </div>
  );
}

function OsFramedPrint({ photo }) {
  return (
    <div style={{ width: 108, height: 84, background: '#1f2424', padding: 5, boxSizing: 'border-box', borderRadius: 2,
      boxShadow: '0 16px 26px rgba(0,25,28,.45), inset 0 0 0 1px rgba(255,255,255,.08)' }}>
      <div style={{ width: '100%', height: '100%', background: '#fff', padding: 7, boxSizing: 'border-box' }}>
        <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

// Demo data for the multi-item variant (open the screen with ?items=3).
function osItems(at) {
  return [
    { title: OS_TITLE, spec: 'Large Portrait Hardcover · Layflat', thumb: at(0) },
    { title: 'Wall calendar 2027', spec: 'A3 portrait · 12 months', thumb: at(1) },
    { title: 'Framed print', spec: '30 × 40 cm · black frame', thumb: at(2) },
  ];
}

function OrderSuccessScreen() {
  const { useState, useMemo, useEffect } = React;
  const data = useMemo(bpBook, []);
  const order = (window.MOCK && window.MOCK.order) || { number: 'PBX482910', estimatedDelivery: '28–30 August 2026' };
  const photos = data.photos;
  const at = i => photos[i % photos.length];

  // Plays once per order: coming back to the screen shows the end state.
  // One product (the default) or three: open the screen with ?items=3 to see the latter.
  const multi = new URLSearchParams(location.search).get('items') === '3';
  const items = multi ? osItems(at) : null;
  const playedKey = `pb_confirm_played_${order.number}${multi ? '_3' : ''}`;
  const [still] = useState(() => {
    try { return sessionStorage.getItem(playedKey) === '1'; } catch (e) { return false; }
  });
  const [calm] = useState(() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => { try { sessionStorage.setItem(playedKey, '1'); } catch (e) {} }, []);

  const burst = useMemo(osBurst, []);
  const rain = useMemo(osRain, []);
  const [playing, setPlaying] = useState(false);
  const [toast, setToast] = useState('');

  const share = async () => {
    const text = `My photo book "${OS_TITLE}" is off to print!`;
    try {
      if (navigator.share) { await navigator.share({ title: OS_TITLE, text, url: location.origin }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(`${text} ${location.origin}`); } catch (e) {}
    setToast('Copied to share'); setTimeout(() => setToast(''), 2000);
  };

  return (
    <div data-os-still={still || calm ? '' : undefined} data-os-calm={calm ? '' : undefined} style={{
      width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#fff',
      display: 'flex', flexDirection: 'column', color: '#333', fontFamily: OS_FONT,
    }}>
      <style>{OS_CSS}</style>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {/* ── Hero: a teal spotlight with slow light rays and twinkles */}
        <div style={{ position: 'relative', paddingBottom: 26, display: 'flex', flexDirection: 'column', alignItems: 'center',
          overflow: 'hidden', borderRadius: '0 0 32px 32px',
          background: 'radial-gradient(120% 70% at 50% 34%, #0E9E9A 0%, #007377 38%, #00535A 72%, #003A40 100%)' }}>
          <div style={{ alignSelf: 'stretch', position: 'relative', zIndex: 2 }}><IOSStatusBar dark /></div>
          <div style={{ position: 'relative', width: 375, maxWidth: '100%', height: 262, perspective: 1100 }}>
            <div className="os-loop" style={{
              position: 'absolute', left: '50%', top: '50%', width: 640, height: 640, margin: '-320px 0 0 -320px',
              background: 'repeating-conic-gradient(from 0deg, rgba(255,255,255,.10) 0deg 7deg, rgba(255,255,255,0) 7deg 22deg)',
              WebkitMaskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.6) 30%, transparent 62%)',
              maskImage: 'radial-gradient(circle, #000 0%, rgba(0,0,0,.6) 30%, transparent 62%)',
              animation: 'osRays 40s linear infinite',
            }} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 300, height: 300, margin: '-150px 0 0 -150px',
              borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,247,226,.55) 0%, rgba(255,247,226,.18) 40%, rgba(255,247,226,0) 70%)' }} />
            {OS_SPARKS.map((p, i) => (
              <div key={i} className="os-loop" style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, color: i % 3 ? '#FFFFFF' : '#FFE3A3',
                animation: `osTwinkle ${p.dur.toFixed(2)}s ease-in-out ${p.d.toFixed(2)}s infinite`, filter: 'drop-shadow(0 0 4px rgba(255,255,255,.8))' }}>
                <OsSvg name="spark" size={p.s} />
              </div>
            ))}
            {/* landing shadow */}
            <div className="os-once" style={{ position: 'absolute', left: '50%', top: '50%', width: 250, height: 34, margin: `${OS_H / 2 + 2}px 0 0 -125px`,
              borderRadius: '50%', background: 'radial-gradient(closest-side, rgba(0,20,22,.55), rgba(0,20,22,0))',
              animation: `osShadow 2.6s ${OS_EASE} .15s both` }} />
            {/* the moment it opens: a halo of light */}
            <div className="os-once" style={{ position: 'absolute', left: '50%', top: '50%', width: 200, height: 200, margin: '-100px 0 0 -100px',
              borderRadius: '50%', boxShadow: '0 0 0 3px rgba(255,227,163,.9), 0 0 40px 10px rgba(255,227,163,.5)',
              animation: 'osHalo 1.3s ease-out 2.5s both' }} />
            <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
              {/* with company on either side, the book steps back a little */}
              <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: multi ? 'translateY(-6px) scale(.8)' : 'none' }}>
                <OsBook cover={at(0)} />
              </div>
            </div>
            {multi && [
              { el: <OsCalendar photo={at(1)} />, x: -116, y: 30, r: -10, d: 2.35, f: 3.6 },
              { el: <OsFramedPrint photo={at(2)} />, x: 108, y: 46, r: 8, d: 2.5, f: 4.0 },
            ].map((p, i) => (
              <div key={i} className="os-once" style={{
                position: 'absolute', left: '50%', top: '50%', zIndex: 3, '--x': `${p.x}px`, '--y': `${p.y}px`, '--r': `${p.r}deg`,
                animation: `osSideIn .9s cubic-bezier(.2,.9,.3,1.15) ${p.d}s both`,
              }}>
                <div className="os-loop" style={{ transform: 'translate(-50%,-50%)' }}>
                  <div className="os-loop" style={{ animation: `osBob 5s ease-in-out ${p.f}s infinite` }}>{p.el}</div>
                </div>
              </div>
            ))}
            {!still && !calm && (
              <div style={{ position: 'absolute', left: '50%', top: '46%', width: 0, height: 0, pointerEvents: 'none', zIndex: 4 }}>
                {burst.map((p, i) => (
                  <div key={i} style={{ position: 'absolute', '--x': `${p.x.toFixed(1)}px`, '--y': `${p.y.toFixed(1)}px`,
                    animation: `osThrow ${p.dur.toFixed(2)}s cubic-bezier(.15,.7,.3,1) ${p.delay.toFixed(2)}s both` }}>
                    <div style={{ width: p.w, height: p.h, borderRadius: p.r, background: p.c, animation: p.spin }} />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="os-once" style={{
            position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            padding: '0 32px', textAlign: 'center', animation: 'osRise .7s ease 2.7s both',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.18em', color: '#9BE3DC' }}>
              {multi ? `ORDER PLACED · ${items.length} ITEMS` : 'ORDER PLACED'}
            </span>
            <span style={{ fontSize: 30, fontWeight: 700, lineHeight: 1.12, color: '#fff', textWrap: 'balance' }}>
              Your memories are off to print!
            </span>
            <span style={{ fontSize: 16, lineHeight: 1.4, color: 'rgba(255,255,255,.82)', textWrap: 'pretty' }}>
              Thank you for your order. We'll let you know when {multi ? `your ${items.length} items are on their way` : `${OS_TITLE} is on its way`}.
            </span>
          </div>
        </div>

        {/* ── Content */}
        <div style={{ padding: '20px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: 14, alignItems: 'center',
            padding: '16px 18px', borderRadius: 20, border: `1px solid ${OS_EDGE}`, background: '#fff' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Order number</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: OS_DEEP }}>{order.number}</span>
            </div>
            <span style={{ width: 1, height: 36, background: OS_EDGE }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 13, color: '#666' }}>Estimated delivery</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: OS_DEEP }}>{order.estimatedDelivery}</span>
            </div>
          </div>
          {multi && (
            <div style={{ borderRadius: 20, border: `1px solid ${OS_EDGE}`, background: '#fff', padding: '6px 18px' }}>
              {items.map((it, k) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                  borderTop: k ? `1px solid ${OS_EDGE}` : 'none' }}>
                  <img src={it.thumb} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: OS_DEEP }}>{it.title}</span>
                    <span style={{ fontSize: 13, color: '#666' }}>{it.spec}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 14, alignItems: 'center',
            padding: 18, borderRadius: 20, background: 'linear-gradient(135deg, #E4F3F2, #D3EBE8)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: OS_DEEP }}>Share the excitement</span>
              <span style={{ fontSize: 14, lineHeight: 1.35, color: '#555' }}>Send a sneak peek of {multi ? 'your order' : OS_TITLE} to friends and family.</span>
            </div>
            <button onClick={share} {...press(0.97)} style={{
              height: 40, padding: '0 16px', borderRadius: 10, border: 'none', background: OS_TEAL, color: '#fff',
              display: 'flex', alignItems: 'center', gap: 6, fontFamily: OS_FONT, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
            }}><OsSvg name="share" size={20} />Share</button>
          </div>

          <div onClick={() => setPlaying(p => !p)} {...press(0.98)} style={{
            position: 'relative', height: 170, borderRadius: 20, overflow: 'hidden', background: '#5B4A3A',
            cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
          }}>
            <img src={`${OS_A}/os-factory.jpg`} alt="AlbumPrinter Productions print studio" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(rgba(0,0,0,0) 30%, rgba(0,0,0,.65))' }} />
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: 16, display: 'flex', alignItems: 'center',
              gap: 12, color: '#fff', pointerEvents: 'none' }}>
              <span style={{ flex: 'none', width: 48, height: 48, borderRadius: '50%', background: '#fff', color: OS_TEAL,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <OsSvg name={playing ? 'pause' : 'play'} size={28} />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 17, fontWeight: 700 }}>See how your book is made</span>
                <span style={{ fontSize: 14 }}>A peek inside our print studio</span>
              </div>
            </div>
            {playing && (
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: 'rgba(255,255,255,.3)', pointerEvents: 'none' }}>
                <div style={{ height: '100%', background: '#fff', animation: 'osProgress 24s linear forwards' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 12, alignItems: 'center',
            padding: '14px 16px', borderRadius: 20, background: OS_MINT }}>
            <span style={{ width: 44, height: 44, borderRadius: '50%', background: '#fff', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: OS_TEAL }}><OsSvg name="support" size={24} /></span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: OS_DEEP }}>Questions about your order?</span>
              <span style={{ fontSize: 14, color: '#555' }}>We're happy to help.</span>
            </div>
            <button {...press(0.97)} style={{
              height: 36, padding: '0 14px', borderRadius: 10, border: `1.5px solid ${OS_TEAL}`, background: 'transparent',
              color: OS_TEAL, fontFamily: OS_FONT, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
            }}>Chat with us</button>
          </div>
        </div>
      </div>

      {/* ── Bottom action bar */}
      <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', gap: 4, background: '#fff',
        padding: '12px 16px max(28px, calc(env(safe-area-inset-bottom, 0px) + 12px))', boxShadow: '0 -6px 24px rgba(0,62,71,.08)' }}>
        <button onClick={() => window.navigation.push(`order-tracking.html${multi ? '?items=3' : ''}`)} {...press(0.97)} style={{
          height: 52, borderRadius: 12, border: 'none', background: OS_TEAL, color: '#fff', fontFamily: OS_FONT,
          fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
        }}>Track your order</button>
        <button onClick={() => window.navigation.replace('home.html')} {...press(0.97)} style={{
          height: 44, border: 'none', background: 'none', color: '#333', fontFamily: OS_FONT, fontSize: 16,
          fontWeight: 700, cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
        }}>Back to home</button>
      </div>

      {/* ── Confetti: never blocks a tap, skipped on return and with reduce-motion */}
      {!still && !calm && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 20 }}>
          {rain.map((p, i) => (
            <div key={i} style={{ position: 'absolute', top: 0, left: p.left, animation: p.fall }}>
              <div style={{ width: p.w, height: p.h, borderRadius: p.r, background: p.c, animation: p.spin,
                boxShadow: p.c === '#FFFFFF' ? '0 0 0 0.5px rgba(0,0,0,0.08)' : 'none' }} />
            </div>
          ))}
        </div>
      )}

      {toast && (
        <div style={{ position: 'absolute', left: '50%', bottom: 130, transform: 'translateX(-50%)', zIndex: 30,
          padding: '10px 16px', borderRadius: 999, background: OS_DEEP, color: '#fff', fontSize: 14, fontWeight: 700 }}>{toast}</div>
      )}
    </div>
  );
}
