// screens/home-new.jsx — Home for a first-time customer (handoff "Home New Customer", option 3a),
// second pass: "more inspiring, more app-native".
//
// 3a's sections are all still here, in its order — banner, product shortcuts, photo access,
// Collections, Gifts they'll keep, the calendar card, the AI field, fine print — but the page
// is now built like a native iOS home rather than a web page in a frame:
//   - The banner is an immersive, full-bleed hero that runs under the status bar, with
//     story-style progress bars, big emotional headlines and full-resolution Photobox
//     photography drifting in a slow Ken Burns move.
//   - Glass buttons float over the photo; once you scroll past it a compact blurred header
//     slides in. The content rides up over the hero on a rounded sheet.
//   - The photo-access card became the page's desire moment: a live 3D photo book that
//     turns its own pages, filled with photos "from your camera roll", with "Make this
//     book" right under it. Granting access swaps in the customer's own moments.
//   - Collections are big swipeable story cards that snap one at a time.
// Photos are real Photobox photography from photobox.co.uk, self-hosted as hn-*.jpg.
// The returning-customer home lives on at home-returning.html.
//
// Deviations: BrandonTextA is commercial and this repo is public, so PB_DISPLAY stands in;
// icons are inline SVGs; offers are 3a's placeholder values.

const HN_A = '../shared/assets';
const HN_FONT = PB_DISPLAY;
const HN_TEAL = '#007F70';
const HN_DEEP = '#023C42';
const HN_MINT = '#F1F6F6';   // home's page is clean white, so its cards and fields take the paper tone
const HN_PEACH = '#FACC98';
const HN_EASE = 'cubic-bezier(.2,.8,.2,1)';
const HN_HERO_H = 560;
const HN_STORY_MS = 6000;

const HN_SLIDES = [
  { img: 'hn-hero-pool.jpg', pos: '44% 35%', tag: 'Photo books',
    head: 'Some moments deserve more than a camera roll', sub: 'Turn this summer into a book you can hold.',
    cta: 'Create your photo book', href: 'product-photobook.html' },
  // Figma 714:1821 — the month-recap calendar art (opaque 1080×1920 export)
  { img: 'hn-hero-recap.jpg', pos: '50% 50%', tag: 'Month recap',
    head: 'Your May, ready to hang on the wall', sub: 'We turned your month into a photo calendar.',
    cta: 'Make my calendar', href: 'product-photobook.html' },
  { img: 'hn-hero-gift.jpg', pos: '44% 50%', tag: 'Gifts',
    head: 'The gift they’ll keep forever', sub: 'Wrapped in our keepsake gift box.',
    cta: 'Find a gift' },
];

// Figma 746:2107 — ten product mock-ups on a 100px tile, no backdrop circle. Each `Art`
// below rebuilds its product from the node's own layers, in the tile's px, so a product
// may break out of its tile where the node lets it (the mug, the magnets' sheet).
const HN_PRODUCTS = [
  { name: 'Photo books', href: 'product-photobook.html', badge: '50%', Art: HpBook },
  { name: 'Wall decor', Art: HpWallDecor },
  { name: 'Calendars', Art: HpCalendar },
  { name: 'Photo prints', Art: HpPrints },
  { name: 'Mugs', Art: HpMug },
  { name: 'Cards', Art: HpCard },
  { name: 'Magnets', Art: HpMagnets },
  { name: 'Jigsaw', Art: HpJigsaw },
  { name: 'Cushions', Art: HpCushion },
  { name: 'Photo blocks', Art: HpBlock },
];
const HN_TILE = 100;
// The node's row is drawn at 100px on a 140 pitch; scaled so three products and a bit
// fit a 390 phone. The art keeps the node's own px and the tile is scaled as one, so
// every layer stays exactly where the design puts it.
const HN_PRODUCT_SCALE = 0.84;

const HN_COLLECTIONS = [
  { name: 'Trip books', line: 'Every journey, bound to last', offer: '50% off', img: 'hn-trip-books.jpg', pos: '50% 50%', href: 'product-photobook.html' },
  { name: 'Christmas', line: 'Gifts that upstage the tree', offer: '50% off', img: 'hn-card-5.jpg', pos: '55% 50%' },
  { name: 'Wedding', line: 'Your big day, kept forever', img: 'hn-card-7.jpg', pos: '78% 40%' },
  { name: "Baby's first year", line: 'Keepsakes for growing families', img: 'hn-christmas.jpg', pos: '50% 50%' },
  { name: 'Year books', line: 'Your year in one book', img: 'hn-yearbook.jpg', pos: '50% 50%', href: 'product-photobook.html' },
];

// Memories — moments pulled from the camera roll, shown as portrait story cards.
const HN_MEMORIES = [
  { name: 'Italy', line: '64 photos · Sep 2026', img: 'mem-tile-italy.jpg', pos: '50% 40%', href: 'memory-detail.html' },
  { name: 'Canada', line: '42 photos · Jul 2026', img: 'pb-src-canada.jpg', pos: '50% 50%' },
  { name: 'Düsseldorf', line: '19 photos · Aug 2026', img: 'mem-tile-dusseldorf.jpg', pos: '50% 50%' },
  { name: 'Germany', line: '31 photos · Jun 2026', img: 'mem-tile-germany.jpg', pos: '50% 50%' },
  { name: 'Cappadocia', line: '27 photos · May 2026', img: 'pb-src-cappadocia.jpg', pos: '50% 50%' },
];

const HN_GIFTS = [
  { name: 'For her', line: 'Keepsakes made for her', img: 'hn-card-1.jpg', pos: '55% 40%' },
  { name: 'For him', line: 'More than the ordinary', img: 'hn-card-2.jpg', pos: '40% 60%' },
  { name: 'Birthdays', line: 'Make them smile', img: 'hn-card-8.jpg', pos: '35% 40%' },
  { name: 'New baby', line: 'Keepsakes for growing families', img: 'hn-card-6.jpg', pos: '62% 50%' },
];

// The live book's pages: sample travel photos before access, "yours" after.
const HN_SAMPLE_PAGES = ['photos/mock-01.webp', 'pb-src-italy.jpg', 'photos/mock-09.webp', 'ob-album-photo.jpg',
  'photos/mock-03.webp', 'pb-src-etna.jpg', 'pb-src-guadalupe.jpg', 'photos/mock-19.webp'];
// Recent collections the book can be made from — the first is what's recommended.
const HN_RECENT = [
  { id: 'italy', name: 'Trip to Italy', line: '64 photos · 12–19 Sep', img: 'pb-src-italy.jpg',
    pages: ['pb-src-italy.jpg', 'mem-tile-italy.jpg', 'photos/mock-09.webp', 'mem-tile-italy2.jpg',
      'pb-src-etna.jpg', 'photos/mock-03.webp', 'photos/mock-01.webp', 'ob-album-photo.jpg'] },
  { id: 'canada', name: 'Trip to Canada', line: '42 photos · 5–14 Jul', img: 'pb-src-canada.jpg',
    pages: ['pb-src-canada.jpg', 'photos/mock-15.webp', 'photos/mock-08.webp', 'photos/mock-12.webp',
      'photos/mock-19.webp', 'photos/mock-01.webp', 'photos/mock-21.webp', 'pb-src-cappadocia.jpg'] },
  { id: 'berlin', name: 'Berlin weekend', line: '28 photos · Aug', img: 'pb-src-berlin.jpg',
    pages: ['pb-src-berlin.jpg', 'photos/mock-05.webp', 'photos/mock-11.webp', 'photos/mock-07.webp',
      'photos/mock-17.webp', 'photos/mock-02.webp', 'photos/mock-14.webp', 'photos/mock-23.webp'] },
  { id: 'summer', name: 'Summer 2026', line: '312 photos · year book', img: 'photos/mock-09.webp',
    pages: ['photos/mock-09.webp', 'pb-src-guadalupe.jpg', 'photos/mock-04.webp', 'photos/mock-16.webp',
      'photos/mock-06.webp', 'pb-src-etna.jpg', 'photos/mock-20.webp', 'photos/mock-10.webp'] },
];

const HN_CSS = `
  @keyframes hnKen { from { transform: scale(1.04) translate3d(0,0,0) } to { transform: scale(1.16) translate3d(-2%, -1%, 0) } }
  @keyframes hnBar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
  @keyframes hnUp { from { opacity: 0; transform: translateY(22px) } to { opacity: 1; transform: none } }
  @keyframes hnTurn { from { transform: translateZ(1px) rotateY(0deg) } to { transform: translateZ(1px) rotateY(-180deg) } }
  @keyframes hnPop { 0% { opacity: 0; transform: scale(.94) } 100% { opacity: 1; transform: none } }
  @keyframes hnDot { 0%, 100% { opacity: .35; transform: translateY(0) } 50% { opacity: 1; transform: translateY(-3px) } }
  .hn-ask::placeholder { color: rgba(255,255,255,.72); }
  [data-hn-calm] * { animation-duration: 0s !important; animation-iteration-count: 1 !important; transition: none !important; }
`;

const HN_ICON = {
  search: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></g>,
  cart: <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 3.5h2.6l2.3 11.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 7.5H6" /><circle cx="9.5" cy="20" r="1.3" /><circle cx="17.5" cy="20" r="1.3" /></g>,
  bell: <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></g>,
  spark: <path d="M10 2.5c.4 3.9 2.1 5.6 6 6-3.9.4-5.6 2.1-6 6-.4-3.9-2.1-5.6-6-6 3.9-.4 5.6-2.1 6-6Zm8 10c.25 2.2 1.3 3.25 3.5 3.5-2.2.25-3.25 1.3-3.5 3.5-.25-2.2-1.3-3.25-3.5-3.5 2.2-.25 3.25-1.3 3.5-3.5Z" fill="currentColor" />,
  up: <path d="M12 19V5m-6 6 6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  right: <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  card: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"><rect x="4" y="6" width="16" height="12" rx="2" /><path d="m4 8 8 5 8-5" /></g>,
  magnet: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v7a6 6 0 0 0 12 0V4" /><path d="M6 8h3M15 8h3M9 4v7a3 3 0 0 0 6 0V4" /></g>,
  photos: <g fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="14" rx="2.5" /><path d="m3.5 16 5-5 4 4 2.5-2.5 5.5 5.5" /><circle cx="15.5" cy="9.5" r="1.5" /></g>,
  truck: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></g>,
  wand: <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m4 20 11-11M14 4v3M12.5 5.5h3M19 9v3M17.5 10.5h3" /></g>,
};
const HnIcon = ({ name, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>{HN_ICON[name]}</svg>
);
const hnGo = href => () => href && window.navigation.push(href);

// Fades a section up the first time it scrolls into view.
function HnReveal({ children, delay = 0 }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setShown(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(22px)',
      transition: `opacity .8s ${HN_EASE} ${delay}s, transform .8s ${HN_EASE} ${delay}s` }}>
      {children}
    </div>
  );
}

function HnHeader({ title, sub, action }) {
  return (
    <div style={{ padding: '30px 20px 14px', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontFamily: HN_FONT, fontSize: 24, fontWeight: 700, color: HN_DEEP, letterSpacing: '-0.3px' }}>{title}</span>
        {sub && <span style={{ fontFamily: HN_FONT, fontSize: 15, color: '#666' }}>{sub}</span>}
      </div>
      {action && <span style={{ fontFamily: HN_FONT, fontSize: 15, fontWeight: 700, color: HN_TEAL, paddingBottom: 2 }}>{action}</span>}
    </div>
  );
}

// ── Immersive hero: full bleed under the status bar, story bars; tap the right side to
// skip ahead, the left side to go back; holding pauses.
function HnHero() {
  const { useState, useEffect, useRef } = React;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const down = useRef(null);
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setI(n => (n + 1) % HN_SLIDES.length), HN_STORY_MS);
    return () => clearTimeout(t);
  }, [i, paused]);
  const s = HN_SLIDES[i];
  return (
    <div
      onPointerDown={e => { down.current = { x: e.clientX, t: Date.now() }; setPaused(true); }}
      onPointerUp={e => {
        setPaused(false);
        const d = down.current; down.current = null;
        if (!d || Date.now() - d.t > 350) return;
        const r = e.currentTarget.getBoundingClientRect();
        setI(n => (n + (e.clientX - r.left > r.width * 0.35 ? 1 : HN_SLIDES.length - 1)) % HN_SLIDES.length);
      }}
      onPointerLeave={() => setPaused(false)}
      style={{ position: 'relative', height: HN_HERO_H, overflow: 'hidden', background: '#0b2b2d', touchAction: 'pan-y' }}>
      {HN_SLIDES.map((sl, k) => (
        <div key={k} style={{ position: 'absolute', inset: 0, opacity: k === i ? 1 : 0, transition: 'opacity .9s ease' }}>
          <img src={`${HN_A}/${sl.img}`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: sl.pos,
            animation: k === i ? `hnKen ${HN_STORY_MS + 1500}ms ease-out both` : 'none',
            animationPlayState: paused ? 'paused' : 'running' }} />
        </div>
      ))}
      {/* scrims: top for the status bar and buttons, bottom for the copy */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(rgba(0,0,0,.42) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 45%, rgba(0,20,22,.78) 100%)' }} />

      <div key={i} style={{ position: 'absolute', left: 20, right: 20, bottom: 62, display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
        <span style={{ alignSelf: 'flex-start', padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,.18)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.3)',
          fontFamily: HN_FONT, fontSize: 12, fontWeight: 700, letterSpacing: '.02em', animation: `hnUp .7s ${HN_EASE} both` }}>{s.tag}</span>
        <span style={{ fontFamily: HN_FONT, fontSize: 36, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.6px', textWrap: 'balance',
          textShadow: '0 2px 20px rgba(0,0,0,.3)', animation: `hnUp .8s ${HN_EASE} .08s both` }}>{s.head}</span>
        <span style={{ fontFamily: HN_FONT, fontSize: 16, lineHeight: 1.35, opacity: .9, animation: `hnUp .8s ${HN_EASE} .16s both` }}>{s.sub}</span>
        <button onPointerDown={e => e.stopPropagation()} onPointerUp={e => e.stopPropagation()}
          onClick={hnGo(s.href)} {...press(0.97)} style={{
          ...pbButton('light', { background: '#fff', border: '1px solid #fff', color: PB_INK, marginTop: 6, alignSelf: 'flex-start',
            gap: 6, boxShadow: '0 10px 24px -8px rgba(0,0,0,.45)', animation: `hnUp .8s ${HN_EASE} .24s both` }),
        }}>{s.cta}<HnIcon name="right" size={18} /></button>
      </div>
      {/* story bars, above the copy so they never crowd the header */}
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 40, display: 'flex', gap: 4, zIndex: 2 }}>
        {HN_SLIDES.map((_, k) => (
          <span key={k} style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.35)', overflow: 'hidden' }}>
            <span key={k === i ? `on${i}` : 'off'} style={{ display: 'block', height: '100%', background: '#fff', transformOrigin: 'left',
              transform: k < i ? 'scaleX(1)' : 'scaleX(0)',
              animation: k === i ? `hnBar ${HN_STORY_MS}ms linear both` : 'none',
              animationPlayState: paused ? 'paused' : 'running' }} />
          </span>
        ))}
      </div>

    </div>
  );
}

// ── A photo book that turns its own pages. Each turn lifts the right-hand leaf over to
// the left; when it lands the next spread is already underneath, so it loops seamlessly.
function HnLiveBook({ pages, scale = 1 }) {
  const { useState, useEffect } = React;
  const [idx, setIdx] = useState(0);
  const [turning, setTurning] = useState(false);
  const n = Math.floor(pages.length / 2);
  const spread = k => ({ l: pages[(2 * k) % pages.length], r: pages[(2 * k + 1) % pages.length] });
  useEffect(() => { setIdx(0); setTurning(false); }, [pages]);
  // Rest on a spread, then turn. The leaf is remounted per spread (key=idx) so each turn
  // starts flat, and it only lands once the next spread is already underneath it.
  useEffect(() => {
    if (turning) return;
    const t = setTimeout(() => setTurning(true), idx ? 2600 : 1400);
    return () => clearTimeout(t);
  }, [idx, turning, pages]);
  const cur = spread(idx), nxt = spread((idx + 1) % n);
  const PW = 132, PH = 160;
  const shade = side => `linear-gradient(to ${side === 'l' ? 'left' : 'right'}, rgba(0,0,0,.22), rgba(0,0,0,0) 14%)`;
  const photo = (src, side) => (
    <img src={`${HN_A}/${src}`} alt="" style={{ position: 'absolute', top: 9, left: side === 'l' ? 9 : 6,
      width: PW - 15, height: PH - 18, objectFit: 'cover' }} />
  );
  const page = (src, side, extra) => (
    <div style={Object.assign({ position: 'absolute', background: '#FBFAF7', overflow: 'hidden', width: PW, height: PH }, extra)}>
      {photo(src, side)}
      <div style={{ position: 'absolute', inset: 0, background: shade(side) }} />
    </div>
  );
  const hide = { backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' };
  // `scale` shrinks the whole scene as one, so the 3D stays exactly as drawn at 1.
  return (
    <div style={{ position: 'relative', height: 250 * scale }}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 250, perspective: 1000,
      transform: scale === 1 ? 'none' : `scale(${scale})`, transformOrigin: '50% 0' }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d',
        transform: 'rotateX(28deg) rotateZ(-4deg)' }}>
        {/* shadow, cover boards and page block */}
        <div style={{ position: 'absolute', left: -PW * 1.15, top: -PH * 0.62, width: PW * 2.3, height: PH * 1.3, transform: 'translateZ(-12px)',
          background: 'radial-gradient(closest-side, rgba(0,30,32,.45), rgba(0,30,32,0))' }} />
        <div style={{ position: 'absolute', left: -PW - 5, top: -PH / 2 - 5, width: 2 * PW + 10, height: PH + 10, transform: 'translateZ(-6px)',
          background: '#023C42', borderRadius: 4 }} />
        <div style={{ position: 'absolute', left: -PW - 1, top: -PH / 2 - 1, width: 2 * PW + 2, height: PH + 2, transform: 'translateZ(-3px)',
          background: 'repeating-linear-gradient(0deg, #f6f3ec 0 1px, #dcd7cc 1px 2px)' }} />
        {page(cur.l, 'l', { left: -PW, top: -PH / 2 })}
        {page(nxt.r, 'r', { left: 0, top: -PH / 2 })}
        {/* the turning leaf: this spread's right page, with the next spread's left page on its back */}
        <div key={idx} onAnimationEnd={() => { setIdx(x => (x + 1) % n); setTurning(false); }} style={{
          position: 'absolute', top: -PH / 2, left: 0, width: PW, height: PH, transformOrigin: 'left center', transformStyle: 'preserve-3d',
          transform: 'translateZ(1px)', animation: turning ? 'hnTurn 1.3s cubic-bezier(.55,.05,.25,1) both' : 'none',
        }}>
          {page(cur.r, 'r', { inset: 0, ...hide })}
          {page(nxt.l, 'l', { inset: 0, ...hide, transform: 'rotateY(180deg)' })}
        </div>
      </div>
    </div>
    </div>
  );
}

// The book moment's "Ask AI" field is a scripted mock: a request is matched to one of
// the recent collections by keyword and the book above switches to it, with a short
// reply. Nothing is sent anywhere. Unmatched requests keep the current collection.
const HN_AI_MATCH = [
  { re: /ital|rome|florence|tuscan|venice|pasta/i, id: 'italy' },
  { re: /canad|mountain|lake|hik|nature|outdoor/i, id: 'canada' },
  { re: /berlin|city|weekend|german|urban/i, id: 'berlin' },
  { re: /summer|year|beach|sea|family|gift|mum|mom|dad|grand|birthday|anniversary/i, id: 'summer' },
];
const HN_AI_EXAMPLES = ['a gift book for mum', 'just the mountains', 'our Berlin weekend', 'best of summer'];
function hnAiReply(q, cur) {
  const hit = HN_AI_MATCH.find(m => m.re.test(q));
  const k = hit ? HN_RECENT.findIndex(c => c.id === hit.id) : cur;
  const c = HN_RECENT[k];
  const text = hit
    ? (/gift|mum|mom|dad|grand|birthday|anniversary/i.test(q)
        ? `A gift it is — ${c.name} has your warmest moments. Laid out, ready to wrap.`
        : `Picked ${c.name} — ${c.line.split(' · ')[0]}, laid out and ready.`)
    : `I'll build it from ${c.name} — you can fine-tune every page in the editor.`;
  return { k, text };
}

// Compact: the collection switcher, the title, the live book, one CTA and an "Ask AI"
// field. The eyebrow, the USP line and the "Or choose another collection" label are gone —
// the chips say that on their own.
function HnBookMoment() {
  const { useState, useEffect, useRef } = React;
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState('');
  const [ai, setAi] = useState(null);          // null | { thinking: true } | { text }
  const [ex, setEx] = useState(0);
  const timer = useRef(null);
  const col = HN_RECENT[sel];
  useEffect(() => {
    if (q) return;
    const t = setInterval(() => setEx(i => (i + 1) % HN_AI_EXAMPLES.length), 3200);
    return () => clearInterval(t);
  }, [q]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const make = () => {
    try { sessionStorage.setItem('pb_collection', col.id); } catch (e) {}
    // book-choose is the "Choose your photo book" step; today it only knows the Trip to Italy album,
    // so every collection lands there.
    hnGo('book-choose.html')();
  };
  const ask = e => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    setQ('');
    e.currentTarget.querySelector('input').blur();
    setAi({ thinking: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const r = hnAiReply(text, sel);
      setSel(r.k);
      setAi({ text: r.text });
    }, 1100);
  };
  return (
    <div style={{ margin: '24px 16px 0', borderRadius: 28, overflow: 'hidden', position: 'relative',
      background: 'radial-gradient(140% 90% at 50% 20%, #00A389 0%, #007F70 42%, #02514A 100%)', color: '#fff',
      boxShadow: '0 20px 40px -18px rgba(0,60,62,.6)' }}>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', padding: '16px 20px 0' }}>
        {HN_RECENT.map((c, k) => {
          const on = k === sel;
          return (
            <div key={c.id} role="button" aria-pressed={on} onClick={() => { setSel(k); setAi(null); }} {...press(0.97)} style={{
              flex: 'none', display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 14px 0 4px', borderRadius: 18,
              cursor: 'pointer', background: on ? 'rgba(255,255,255,.26)' : 'rgba(255,255,255,.12)',
              boxShadow: on ? 'inset 0 0 0 1.5px #fff' : 'inset 0 0 0 1px rgba(255,255,255,.18)',
              transition: 'transform 140ms ease, background 200ms ease, box-shadow 200ms ease' }}>
              <img src={`${HN_A}/${c.img}`} alt="" style={{ width: 28, height: 28, borderRadius: 14, objectFit: 'cover' }} />
              <span style={{ fontFamily: HN_FONT, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>{c.name}</span>
            </div>
          );
        })}
      </div>
      <div key={col.id} style={{ padding: '14px 20px 0', fontFamily: HN_FONT, fontSize: 22, fontWeight: 700, lineHeight: 1.15,
        letterSpacing: '-0.3px', animation: `hnPop .45s ${HN_EASE} both` }}>
        {col.name}, already laid out
      </div>
      <div style={{ margin: '-10px 0 -2px' }}><HnLiveBook pages={col.pages} scale={0.92} /></div>
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={make} {...press(0.97)} style={
          pbButton('light', { background: '#fff', border: '1px solid #fff', color: PB_INK })
        }>Make this book</button>
        {ai && (
          <div key={ai.text || 'thinking'} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontFamily: HN_FONT, fontSize: 14,
            lineHeight: '19px', color: '#E6FAF7', animation: `hnPop .35s ${HN_EASE} both` }}>
            <span style={{ color: '#9BE3DC', marginTop: 1 }}><HnIcon name="spark" size={16} /></span>
            {ai.thinking
              ? <span style={{ display: 'flex', gap: 4, paddingTop: 7 }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 3, background: '#9BE3DC',
                    animation: `hnDot 1s ${i * 0.15}s ease-in-out infinite` }} />)}
                </span>
              : <span>{ai.text}</span>}
          </div>
        )}
        <form onSubmit={ask} style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, padding: '0 6px 0 14px', margin: 0,
          borderRadius: 16, background: 'rgba(255,255,255,.14)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.28)' }}>
          <span style={{ color: '#9BE3DC' }}><HnIcon name="spark" size={18} /></span>
          <input className="hn-ask" value={q} onChange={e => setQ(e.target.value)} enterKeyHint="send"
            aria-label="Ask AI what you want" placeholder={`Ask AI: “${HN_AI_EXAMPLES[ex]}”`}
            style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', background: 'transparent', padding: 0,
              color: '#fff', fontFamily: HN_FONT, fontSize: 16 }} />
          <button type="submit" aria-label="Ask" disabled={!q.trim()} {...press(0.9)} style={{ flex: 'none', width: 36, height: 36,
            borderRadius: 18, border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', background: '#fff', color: HN_TEAL, opacity: q.trim() ? 1 : 0.45,
            transition: 'transform 140ms ease, opacity 200ms ease' }}><HnIcon name="up" size={18} /></button>
        </form>
      </div>
    </div>
  );
}

// ── Product mock-ups (Figma 746:2107). Every number is the node's, in tile px. ──
const HP_IMG = { position: 'absolute', display: 'block', maxWidth: 'none', pointerEvents: 'none' };
const HP_FILL = { inset: 0, width: '100%', height: '100%', objectFit: 'cover' };
const hpBox = (left, top, width, height, extra) => Object.assign({ position: 'absolute', left, top, width, height }, extra);
const HpImg = ({ src, style }) => <img src={`${HN_A}/${src}`} alt="" draggable={false} style={Object.assign({}, HP_IMG, style)} />;

// A rotated layer, centred in its bounding box as Figma lays it out.
function HpRot({ box, rot, w, h, style, children }) {
  return (
    <div style={hpBox(box[0], box[1], box[2], box[3], { display: 'flex', alignItems: 'center', justifyContent: 'center' })}>
      <div style={Object.assign({ position: 'relative', flex: 'none', width: w, height: h, transform: `rotate(${rot}deg)` }, style)}>
        {children}
      </div>
    </div>
  );
}

// 746:2198. The node exports no shadow for the book, but its render carries one; this is
// the wall decor's pair (746:2150), which lands on the same soft few-px falloff.
const HP_BOOK_MASK = { WebkitMaskImage: `url(${HN_A}/hp2-book-mask.svg)`, maskImage: `url(${HN_A}/hp2-book-mask.svg)`,
  WebkitMaskSize: '90.2px 68px', maskSize: '90.2px 68px', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' };
function HpBook() {
  return (
    <div style={{ position: 'absolute', inset: 0,
      filter: 'drop-shadow(5.25px 6.25px 4.375px rgba(0,0,0,.13)) drop-shadow(1.5px 2.25px 2.625px rgba(0,0,0,.15))' }}>
      <HpImg src="hp2-book-base.svg" style={{ left: 4.8, top: 16, width: 90.2, height: 68 }} />
      <div style={hpBox(15, 22, 74, 47, Object.assign({ WebkitMaskPosition: '-10.2px -6px', maskPosition: '-10.2px -6px' }, HP_BOOK_MASK))}>
        <HpImg src="hp2-photo-couple.jpg" style={HP_FILL} />
      </div>
      <div style={hpBox(4.8, 16, 6.3, 68, Object.assign({ WebkitMaskPosition: '0 0', maskPosition: '0 0' }, HP_BOOK_MASK))}>
        <HpImg src="hp2-book-spine.png" style={HP_FILL} />
      </div>
      <p style={{ position: 'absolute', margin: 0, left: 51.51, top: 72.32, width: 58.585, transform: 'translateX(-50%)',
        fontFamily: '"Oswald", "Big Shoulders Display", sans-serif', fontWeight: 600, fontSize: 4.954, lineHeight: 'normal',
        textTransform: 'uppercase', textAlign: 'center', color: '#000' }}>Our travel</p>
    </div>
  );
}

// 746:2150 — a nine-slice frame (one 3×3 sheet, each slice 12.205px) around a #F5F5F5 mat.
// The frame ships pre-sliced: the node's sheet nine-sliced once at 3× (212×270, 37px
// slices) into one transparent PNG. Sliced live — as nine crops or as a border-image —
// the pieces leave hairline seams at every join once the tile is scaled.
// The mat is the photo's 7.5px stroke, which Figma draws *outside* the photo (its render
// has the photo filling the whole inset-12 window), so it is a box at 12 − 7.5, and the
// photo's crop — the node's %s of that stroked box — is resolved to px inside the window.
// The shadow stack is a box-shadow, not chained drop-shadows: the frame is a solid
// rectangle, and box-shadows stay independent the way Figma's do.
function HpWallDecor() {
  return (
    <div style={hpBox(14.75, 5, 70.5, 90, { boxShadow: '5.25px 6.25px 4.375px rgba(0,0,0,.13), 1.5px 2.25px 2.625px rgba(0,0,0,.15)' })}>
      <HpImg src="hp2-wall-frame.png" style={{ inset: 0, width: '100%', height: '100%' }} />
      <div style={{ position: 'absolute', inset: 4.5, background: '#F5F5F5' }} />
      <div style={{ position: 'absolute', inset: 12, overflow: 'hidden' }}>
        <HpImg src="hp2-photo-mountain.jpg" style={{ left: -40.39, top: -0.71, width: 100.72, height: 67.43 }} />
      </div>
    </div>
  );
}

// 749:3405 — the month grid is real type at the node's 1.4/2.2px, like a printed calendar.
// "2027" (749:3492) is a sibling laid over the photo.
const HP_CAL_DAYS = [['Monday', 4.68], ['Tuesday', 14.17], ['Wednesday', 23.83], ['Thursday', 32.85],
  ['Friday', 41.39], ['Saturday', 51.05], ['Sunday', 60.16]];
const HP_CAL_ROWS = [[1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11, 12, 13, 14], [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28], [29, 30, 31, 1, 2, 3, 4]];
const HP_ARIAL = 'Arial, Helvetica, sans-serif';
function HpCalendar() {
  return (
    <>
      <div style={hpBox(17.888, 4, 65.224, 92, { overflow: 'hidden',
        backgroundImage: 'linear-gradient(180deg, #F3F4F7 0%, #ECE7EB 100%), linear-gradient(90deg, #F2EEF1 0%, #F2EEF1 100%)',
        boxShadow: '4.806px 7.552px 8.925px rgba(0,0,0,.13), 1.373px 2.06px 4.806px rgba(0,0,0,.15)' })}>
        {HP_CAL_DAYS.map(([d, x]) => (
          <span key={d} style={{ position: 'absolute', left: x, top: 51.86, transform: 'translateX(-50%)', whiteSpace: 'nowrap',
            fontFamily: HP_ARIAL, fontSize: 1.431, lineHeight: 'normal', letterSpacing: -0.0286, color: '#000' }}>{d}</span>
        ))}
        <div style={hpBox(0.61, 53.9, 63.997, 37.008, { display: 'flex', flexDirection: 'column' })}>
          {HP_CAL_ROWS.map((row, r) => (
            <div key={r} style={{ display: 'flex', flex: '1 0 0' }}>
              {row.map((n, c) => {
                const next = r === 4 && c > 2;
                return (
                  <div key={c} style={{ position: 'relative', flex: '1 0 0', overflow: 'hidden', border: '0.102px solid #6A6A6A' }}>
                    <span style={{ position: 'absolute', top: 'calc(100% - 3.07px)', right: n < 10 ? 0.42 : n === 11 ? 1.12 : 1.33,
                      whiteSpace: 'nowrap', fontFamily: HP_ARIAL, fontSize: 2.249, fontWeight: next ? 700 : 400, lineHeight: 'normal',
                      letterSpacing: -0.045, opacity: next ? 0.2 : 1, color: c === 6 ? '#E12727' : '#000' }}>{n}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0.11, right: 0.11, bottom: 43 }}>
          <HpImg src="hp2-photo-palms.jpg" style={HP_FILL} />
        </div>
      </div>
      <span style={{ position: 'absolute', left: 52, top: 37, whiteSpace: 'nowrap', fontFamily: HP_ARIAL, fontWeight: 700,
        fontSize: 12.09, lineHeight: 'normal', letterSpacing: -0.2418, color: '#fff' }}>2027</span>
    </>
  );
}

// 748:2658 — four fanned prints. Each layer under a print's photo is covered by it, so only
// the photo and, on the two that have one above it, the node's glossy sheen are drawn.
const hpSheen = (matrix, stops, opacity) => `url("data:image/svg+xml;utf8,<svg viewBox='0 0 91.158 59.144' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='${opacity}'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(${matrix})'>${stops.map(([c, o]) => `<stop stop-color='${c}' offset='${o}'/>`).join('')}</radialGradient></defs></svg>")`;
const HP_SHEEN_A = hpSheen('11.122 -5.1512 7.9395 17.142 -22.624 72.572',
  [['rgba(255,255,255,0)', 0], ['rgba(255,255,255,1)', 0.67308], ['rgba(255,255,255,0)', 0.76443]], 0.3);
const HP_SHEEN_B = hpSheen('-10.349 -9.392 14.476 -15.951 89.681 88.437',
  [['rgba(255,255,255,0)', 0.26127], ['rgba(255,255,255,1)', 0.56491], ['rgba(255,255,255,0)', 0.56985]], 0.2);
const HP_PRINTS = [
  { box: [-0.36, 12.05, 100.003, 74.001], rot: -9.95, src: 'hp2-photo-5.jpg' },
  { box: [1.15, 14.76, 96.978, 68.585], rot: -6.16, src: 'hp2-photo-3.jpg' },
  { box: [2.88, 17.61, 93.53, 62.87], rot: -2.37, src: 'hp2-photo-mountain.jpg', sheen: HP_SHEEN_A },
  { box: [1.68, 15.65, 95.922, 66.79], rot: 4.95, src: 'hp2-photo-couple.jpg', sheen: HP_SHEEN_B },
];
function HpPrints() {
  return HP_PRINTS.map((p, i) => (
    <HpRot key={i} box={p.box} rot={p.rot} w={91.158} h={59.144}
      style={{ boxShadow: '2.713px 1.628px 2.387px -1.628px rgba(0,0,0,.4)' }}>
      <HpImg src={p.src} style={HP_FILL} />
      {p.sheen && <div style={{ position: 'absolute', inset: 0, backgroundImage: p.sheen }} />}
    </HpRot>
  ));
}

// 748:2316
function HpMug() {
  return <HpImg src="hp2-mug.png" style={{ left: -17, top: -17, width: 134, height: 134, objectFit: 'cover' }} />;
}

// 750:3592 — floor shadow, the inside of the card, then its front.
function HpCard() {
  return (
    <>
      <div style={hpBox(16.5, 79, 57, 18.589)}>
        <HpImg src="hp2-card-shadow.svg" style={{ top: '-36.58%', bottom: '-36.58%', left: '-11.93%', right: '-11.93%',
          width: 'auto', height: 'auto' }} />
      </div>
      <HpImg src="hp2-card-back.svg" style={{ left: 18.5, top: 11.26, width: 59.258, height: 77.907 }} />
      <HpImg src="hp2-card-front.png" style={{ left: 18.5, top: 8.25, width: 50.534, height: 89.337 }} />
    </>
  );
}

// 748:2304 — a 3×3 sheet of bordered magnets on a 134×133.437 box. `box` is each magnet's
// bounding box as insets in %, `w`/`h` the node's hypot() pairs for its rotated size.
const HP_MAG_W = 134, HP_MAG_H = 133.437;
const HP_MAGNETS = [
  { box: [18.19, 61.77, 64.69, 21.64], w: [94.5954, -5.13786], h: [5.40459, 94.8621], rot: -3.18, src: 'hp2-photo-palms.jpg' },
  { box: [41.75, 64.9, 41.75, 19.11], w: [98.3848, 1.53203], h: [-1.61523, 98.468], rot: 0.92, src: 'hp2-mag-1515.jpg' },
  { box: [63.07, 63.37, 18.73, 19], w: [88.2924, -11.1808], h: [11.7076, 88.8192], rot: -7.36, src: 'hp2-mag-1518.jpg' },
  { box: [19.85, 42.2, 63.64, 41.8], w: [98.3848, 1.53203], h: [-1.61523, 98.468], rot: 0.92, src: 'hp2-photo-couple.jpg' },
  { box: [39.06, 41.86, 43.1, 40.85], w: [90.3454, 9.20541], h: [-9.65464, 90.7946], rot: 5.94, src: 'hp2-mag-1520.jpg' },
  { box: [63.19, 42.87, 20.31, 41.13], w: [98.3848, 1.53203], h: [-1.61523, 98.468], rot: 0.92, src: 'hp2-mag-1522.jpg' },
  { box: [18.64, 19.86, 63.31, 62.65], w: [89.1601, 10.3449], h: [-10.8399, 89.6551], rot: 6.75, src: 'hp2-photo-mountain.jpg' },
  { box: [41.28, 20.94, 42.22, 63.06], w: [98.3848, 1.53203], h: [-1.61523, 98.468], rot: 0.92, src: 'hp2-photo-3.jpg' },
  { box: [61.99, 19.38, 18.77, 61.97], w: [82.2803, 17.0136], h: [-17.7197, 82.9864], rot: 11.87, src: 'hp2-mag-1528.jpg' },
];
function HpMagnets() {
  return (
    <div style={hpBox(-17, -16.22, HP_MAG_W, HP_MAG_H, { overflow: 'hidden' })}>
      {HP_MAGNETS.map((m, i) => {
        const [t, r, b, l] = m.box;
        const bw = HP_MAG_W * (100 - l - r) / 100, bh = HP_MAG_H * (100 - t - b) / 100;
        const size = ([x, y]) => Math.hypot(x * bw / 100, y * bh / 100);
        return (
          <HpRot key={i} box={[HP_MAG_W * l / 100, HP_MAG_H * t / 100, bw, bh]} rot={m.rot} w={size(m.w)} h={size(m.h)}
            style={{ boxSizing: 'border-box', border: '1.859px solid #fff', background: '#D9D9D9',
              boxShadow: '1.842px 1.842px 5.526px rgba(0,0,0,.25)' }}>
            <HpImg src={m.src} style={HP_FILL} />
          </HpRot>
        );
      })}
    </div>
  );
}

// 750:3678
const HP_JIGSAW = [
  { box: [4.02, 4.06, 49.105, 41.615], rot: -7.38, w: 44.83, h: 36.153 },
  { box: [15.88, 42.7, 37.677, 46.05], rot: 1.98, w: 36.153, h: 44.83 },
  { box: [52.96, 16.49, 37.677, 46.05], rot: 1.98, w: 36.153, h: 44.83 },
  { box: [43.35, 52.32, 46.05, 37.677], rot: 1.98, w: 44.83, h: 36.153 },
];
function HpJigsaw() {
  return HP_JIGSAW.map((p, i) => (
    <HpRot key={i} box={p.box} rot={p.rot} w={p.w} h={p.h}>
      <HpImg src={`hp2-jig-${i + 1}.png`} style={{ inset: 0, width: '100%', height: '100%' }} />
    </HpRot>
  ));
}

// 748:2300 — the photo is printed with two overlay passes and a 70% normal one, so the
// cushion's folds read through it. `isolation` keeps the blend inside the tile.
function HpCushion() {
  return (
    <div style={{ position: 'absolute', inset: 0, isolation: 'isolate' }}>
      <HpImg src="hp2-cushion.png" style={Object.assign({}, HP_FILL,
        { filter: 'drop-shadow(11.039px 15.584px 11.039px rgba(0,0,0,.07)) drop-shadow(1.299px 1.948px 4.545px rgba(0,0,0,.15))' })} />
      <div style={hpBox(20.78, 20.78, 58.442, 58.442)}>
        <HpImg src="hp2-photo-palms.jpg" style={Object.assign({ mixBlendMode: 'overlay' }, HP_FILL)} />
        <HpImg src="hp2-photo-palms.jpg" style={Object.assign({ mixBlendMode: 'overlay' }, HP_FILL)} />
        <HpImg src="hp2-photo-palms.jpg" style={Object.assign({ opacity: 0.7 }, HP_FILL)} />
      </div>
    </div>
  );
}

// 750:3696 — the block's face and its dark side edge (the node mirrors the edge).
function HpBlock() {
  return (
    <>
      <HpImg src="hp2-block-front.png" style={{ left: -1.08, top: 14, width: 92.909, height: 73 }} />
      <HpImg src="hp2-block-side.svg" style={{ left: 91.83, top: 14, width: 10.256, height: 73, transform: 'rotate(180deg) scaleY(-1)' }} />
    </>
  );
}

// Figma 746:2107: 100px tiles on a 140 pitch, the label 11 below in Bold 13/16 #333 — all
// scaled by HN_PRODUCT_SCALE. A horizontal scroller clips vertically, so its padding is
// room for what spills out of the tiles: the art that rises above them (the mug, the
// magnets) at the top, and at the bottom the product shadows — the cushion's and the wall
// decor's reach ~30px below their tiles. The bottom room is taken back with a negative margin, and the
// scroller ignores pointers so that strip does not swallow taps on the card under it;
// the products themselves take them again.
const HN_SHADOW_ROOM = 56;
function HnProducts() {
  const size = HN_TILE * HN_PRODUCT_SCALE;
  return (
    <div style={{ display: 'flex', gap: Math.round(40 * HN_PRODUCT_SCALE), overflowX: 'auto', overflowY: 'hidden',
      scrollbarWidth: 'none', padding: `24px 20px ${HN_SHADOW_ROOM}px`, marginBottom: 4 - HN_SHADOW_ROOM,
      pointerEvents: 'none' }}>
      {HN_PRODUCTS.map(({ name, href, badge, Art }) => (
        <div key={name} onClick={hnGo(href)} {...press(0.94)} style={{ flex: 'none', width: size, display: 'flex', pointerEvents: 'auto',
          flexDirection: 'column', alignItems: 'center', gap: 9, cursor: 'pointer', transition: 'transform 140ms ease',
          WebkitTapHighlightColor: 'transparent' }}>
          <div style={{ position: 'relative', width: size, height: size }}>
          <div aria-hidden style={{ position: 'absolute', left: 0, top: 0, width: HN_TILE, height: HN_TILE,
                        transform: `scale(${HN_PRODUCT_SCALE})`, transformOrigin: '0 0' }}>
            <Art />
            {badge && (
              // node 746:2111 — a teal r4 tag at the tile's top-right
              <span style={{ position: 'absolute', left: 75, top: 1, padding: '3px 4px', minWidth: 21, borderRadius: 4,
                background: HN_TEAL, color: '#fff', fontFamily: HN_FONT, fontSize: 12, fontWeight: 900,
                lineHeight: '10px', letterSpacing: '-0.96px', textAlign: 'center' }}>{badge}</span>
            )}
          </div>
          </div>
          <span style={{ fontFamily: HN_FONT, fontSize: 13, fontWeight: 700, lineHeight: '16px', color: '#333',
            textAlign: 'center', whiteSpace: 'nowrap' }}>{name}</span>
        </div>
      ))}
    </div>
  );
}

// Big story cards that snap one at a time, with the next one peeking in.
function HnCollections() {
  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', padding: '0 20px 8px',
      scrollSnapType: 'x mandatory', scrollPaddingLeft: 20 }}>
      {HN_COLLECTIONS.map(c => (
        <div key={c.name} onClick={hnGo(c.href)} {...press(0.98)} style={{ position: 'relative', flex: 'none', width: 'calc(100% - 64px)',
          maxWidth: 320, height: 400, borderRadius: 26, overflow: 'hidden', background: HN_DEEP, cursor: 'pointer',
          scrollSnapAlign: 'start', transition: 'transform 140ms ease', boxShadow: '0 16px 30px -16px rgba(0,50,52,.55)' }}>
          <img src={`${HN_A}/${c.img}`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: c.pos }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0) 45%, rgba(0,18,20,.78))' }} />
          {c.offer && (
            <span style={{ position: 'absolute', left: 16, top: 16, padding: '5px 11px', borderRadius: 999, background: HN_PEACH,
              color: HN_DEEP, fontFamily: HN_FONT, fontSize: 12, fontWeight: 700 }}>{c.offer}</span>
          )}
          <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, display: 'flex', alignItems: 'flex-end', gap: 10, color: '#fff' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: HN_FONT, fontSize: 26, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.4px' }}>{c.name}</span>
              <span style={{ fontFamily: HN_FONT, fontSize: 15, opacity: .9 }}>{c.line}</span>
            </div>
            <span style={{ width: 40, height: 40, borderRadius: 20, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.35)', flexShrink: 0 }}><HnIcon name="right" size={18} /></span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Smaller portrait cards than Collections: a peek at the next one tells you the row scrolls.
function HnMemories() {
  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', padding: '0 20px 8px' }}>
      {HN_MEMORIES.map(m => (
        <div key={m.name} onClick={hnGo(m.href || 'photo-sources.html')} {...press(0.97)} style={{ position: 'relative', flex: 'none',
          width: 160, height: 214, borderRadius: 22, overflow: 'hidden', background: HN_DEEP, cursor: 'pointer',
          transition: 'transform 140ms ease', boxShadow: '0 12px 24px -14px rgba(0,50,52,.55)' }}>
          <img src={`${HN_A}/${m.img}`} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: m.pos }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0) 48%, rgba(0,18,20,.8))' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, display: 'flex', flexDirection: 'column', gap: 2, color: '#fff' }}>
            <span style={{ fontFamily: HN_FONT, fontSize: 20, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.1 }}>{m.name}</span>
            <span style={{ fontFamily: HN_FONT, fontSize: 12, opacity: .85 }}>{m.line}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HnGifts() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px' }}>
      {HN_GIFTS.map(g => (
        <div key={g.name} {...press(0.97)} style={{ position: 'relative', height: 190, borderRadius: 22, overflow: 'hidden',
          background: HN_MINT, cursor: 'pointer', transition: 'transform 140ms ease' }}>
          <img src={`${HN_A}/${g.img}`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: g.pos }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,0,0,0) 40%, rgba(0,0,0,.66))' }} />
          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 14, display: 'flex', flexDirection: 'column', color: '#fff' }}>
            <span style={{ fontFamily: HN_FONT, fontSize: 18, fontWeight: 700 }}>{g.name}</span>
            <span style={{ fontFamily: HN_FONT, fontSize: 13, opacity: .9 }}>{g.line}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HnCalendar() {
  return (
    <div {...press(0.98)} style={{ margin: '0 16px', display: 'grid', gridTemplateColumns: '1fr 150px', minHeight: 170,
      borderRadius: 26, overflow: 'hidden', background: HN_MINT, cursor: 'pointer', transition: 'transform 140ms ease' }}>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 7, justifyContent: 'center' }}>
        <span style={{ alignSelf: 'flex-start', padding: '4px 10px', borderRadius: 999, background: HN_PEACH, color: HN_DEEP,
          fontFamily: HN_FONT, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>50% off calendars</span>
        <span style={{ fontFamily: HN_FONT, fontSize: 20, fontWeight: 700, lineHeight: 1.15, color: HN_DEEP }}>A new memory every month</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 2, fontFamily: HN_FONT, fontSize: 15, fontWeight: 700, color: HN_TEAL }}>
          Make a calendar<HnIcon name="right" size={16} />
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <img src={`${HN_A}/hn-calendar.jpg`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: '14% 40%' }} />
      </div>
    </div>
  );
}

function HnAsk() {
  return (
    <div style={{ margin: '18px 16px 0', display: 'flex', alignItems: 'center', gap: 8, height: 54, padding: '0 7px 0 16px',
      borderRadius: 27, background: HN_MINT, color: '#666', fontFamily: HN_FONT, fontSize: 15 }}>
      <span style={{ color: HN_TEAL }}><HnIcon name="spark" size={20} /></span>
      <span style={{ flex: 1 }}>Not sure where to start? Ask us</span>
      <span style={{ width: 40, height: 40, borderRadius: 20, background: HN_TEAL, color: '#fff', display: 'flex',
        alignItems: 'center', justifyContent: 'center' }}><HnIcon name="up" size={20} /></span>
    </div>
  );
}

// Round header button: frosted glass over the photo, mint once the bar turns solid.
function HnRound({ label, icon, solid, onClick }) {
  return (
    <button aria-label={label} onClick={onClick} {...press(0.9)} style={{
      width: 40, height: 40, borderRadius: 20, border: 'none', padding: 0, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 140ms ease, background .3s, color .3s',
      background: solid ? HN_MINT : 'rgba(255,255,255,.2)', color: solid ? HN_TEAL : '#fff',
      backdropFilter: solid ? 'none' : 'blur(14px) saturate(140%)', WebkitBackdropFilter: solid ? 'none' : 'blur(14px) saturate(140%)',
      boxShadow: solid ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,.35), inset 0 1px 1px rgba(255,255,255,.5)',
      WebkitTapHighlightColor: 'transparent',
    }}><HnIcon name={icon} /></button>
  );
}

// The shared PhotoboxLogo is white-only; this header needs white over the photo and teal
// once the bar is solid, so the wordmark is set here in the brand's Teachers face.
function HnWordmark({ color }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 3, color, transition: 'color .3s' }}>
      <span style={{ fontFamily: '"Teachers", -apple-system, system-ui, sans-serif', fontWeight: 600, fontSize: 27,
        letterSpacing: '-1px', lineHeight: 1 }}>photobox</span>
      <span style={{ marginTop: -14 }}><HnIcon name="spark" size={14} /></span>
    </span>
  );
}

// The story hero is hidden for now (kept, not deleted): the page opens on the solid
// header with the product carousel straight under it. Set to true to bring it back.
const HN_SHOW_HERO = false;

function HomeNewScreen() {
  const { useState } = React;
  const [calm] = useState(() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [activeTab, setActiveTab] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  // Turn solid early: the hero's headline and button reach the header strip at ~190px
  // of scroll, and white copy under a transparent bar is what made the header unreadable.
  // With no hero the bar is always solid, and its hairline only shows once content
  // has scrolled under it.
  const solid = !HN_SHOW_HERO || scrollY > 120;
  const divider = HN_SHOW_HERO ? solid : scrollY > 2;
  const onScroll = e => {
    const y = e.currentTarget.scrollTop;
    if ((y > 120) !== (scrollY > 120) || (y > 2) !== (scrollY > 2)) setScrollY(y);
  };
  // Without the hero the content starts under the header, so it needs the header's height.
  const headRef = React.useRef(null);
  const [headH, setHeadH] = useState(0);
  React.useLayoutEffect(() => { if (headRef.current) setHeadH(headRef.current.offsetHeight); }, []);
  // Drives the page background in home.html, which iOS 26 Safari uses to tint the
  // status-bar strip: the hero's teal over the photo, white under the solid header.
  React.useEffect(() => {
    document.documentElement.style.setProperty('--hn-top', solid ? '#FFFFFF' : '#0b2b2d');
  }, [solid]);
  return (
    <div data-hn-calm={calm ? '' : undefined} style={{ width: '100%', height: '100%', background: 'var(--hn-top, #fff)', position: 'relative', overflow: 'hidden' }}>
      <style>{HN_CSS}</style>

      {/* Header: transparent over the hero, a blurred white bar once scrolled past it. */}
      <div ref={headRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, pointerEvents: 'none',
        background: solid ? 'rgba(255,255,255,.94)' : 'rgba(255,255,255,0)',
        backdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none', WebkitBackdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none',
        boxShadow: divider ? '0 1px 0 rgba(0,0,0,.06)' : 'none', transition: 'background .3s, box-shadow .3s' }}>
        <IOSStatusBar dark={!solid} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 10px', pointerEvents: 'auto' }}>
          <HnWordmark color={solid ? HN_TEAL : '#fff'} />
          <div style={{ display: 'flex', gap: 8 }}>
            <HnRound label="Basket" icon="cart" solid={solid} onClick={hnGo('basket.html')} />
            <HnRound label="Notifications" icon="bell" solid={solid} />
          </div>
        </div>
      </div>

      <div onScroll={onScroll} style={{ position: 'absolute', inset: 0, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {HN_SHOW_HERO && <HnHero />}

        {/* The sheet: content rides up over the bottom of the hero. */}
        <div style={HN_SHOW_HERO
          ? { position: 'relative', marginTop: -32, background: '#fff', borderRadius: '30px 30px 0 0', paddingTop: 2 }
          : { position: 'relative', background: '#fff', paddingTop: headH }}>
          {HN_SHOW_HERO && <div style={{ width: 36, height: 5, borderRadius: 3, background: '#DCE6E6', margin: '8px auto 0' }} />}
          <HnProducts />
          <HnReveal><HnBookMoment /></HnReveal>

          <HnReveal>
            <HnHeader title="Memories" sub="Moments from your camera roll" action="See all" />
            <HnMemories />
          </HnReveal>

          <HnReveal>
            <HnHeader title="Collections" sub="Ideas to get you started" action="See all" />
            <HnCollections />
          </HnReveal>

          <HnReveal>
            <HnHeader title="Gifts they'll keep" sub="Who are you making it for?" />
            <HnGifts />
          </HnReveal>

          <HnReveal>
            <HnHeader title="Your year, beautifully kept" />
            <HnCalendar />
          </HnReveal>

          <HnReveal><HnAsk /></HnReveal>
          <span style={{ display: 'block', padding: '12px 22px 0', fontFamily: HN_FONT, fontSize: 11, color: '#888' }}>
            Discount applied automatically at checkout.
          </span>
          <div style={{ height: `calc(24px + ${TAB_BAR_HEIGHT})` }} />
        </div>
      </div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
