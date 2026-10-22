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
const HN_TEAL = '#007377';
const HN_DEEP = '#004B53';
const HN_MINT = '#EDF5F6';
const HN_PEACH = '#FACC98';
const HN_EASE = 'cubic-bezier(.2,.8,.2,1)';
const HN_HERO_H = 560;
const HN_STORY_MS = 6000;

const HN_SLIDES = [
  { img: 'hn-hero-pool.jpg', pos: '44% 35%', tag: 'Photo books',
    head: 'Some moments deserve more than a camera roll', sub: 'Turn this summer into a book you can hold.',
    cta: 'Create your photo book', href: 'product-photobook.html' },
  { img: 'hn-hero-book.jpg', pos: '58% 45%', tag: 'Made together',
    head: 'The book they’ll ask to read again', sub: 'Your family’s story, page after page.',
    cta: 'Start a photo book', href: 'product-photobook.html' },
  { img: 'hn-hero-gift.jpg', pos: '44% 50%', tag: 'Gifts',
    head: 'The gift they’ll keep forever', sub: 'Wrapped in our keepsake gift box.',
    cta: 'Find a gift' },
];

const HN_PRODUCTS = [
  { name: 'Photo books', img: 'hn-card-1.jpg', pos: '64% 62%', zoom: 1.9, href: 'product-photobook.html' },
  { name: 'Calendars', img: 'hn-calendar.jpg', pos: '16% 40%', zoom: 1.6 },
  { name: 'Wall art', img: 'hn-hero-wall.jpg', pos: '47% 30%', zoom: 1.7 },
  { name: 'Photo prints', img: 'create-prints.png', pos: '50% 50%', zoom: 1.15 },
  { name: 'Cards', icon: 'card' },
  { name: 'Mugs', img: 'create-mugs.png', pos: '50% 50%', zoom: 1.2 },
  { name: 'Photo blocks', img: 'hn-card-2.jpg', pos: '71% 16%', zoom: 2.6 },
  { name: 'Magnets', icon: 'magnet' },
  { name: 'Jigsaws', img: 'hn-card-2.jpg', pos: '78% 72%', zoom: 1.9 },
  { name: 'Cushions', img: 'idea-cushion.png', pos: '50% 50%', zoom: 1.4 },
];

const HN_COLLECTIONS = [
  { name: 'Trip books', line: 'Every journey, bound to last', offer: '50% off', img: 'hn-trip.jpg', pos: '70% 50%', href: 'product-photobook.html' },
  { name: 'Christmas', line: 'Gifts that upstage the tree', offer: '50% off', img: 'hn-card-5.jpg', pos: '55% 50%' },
  { name: 'Wedding', line: 'Your big day, kept forever', img: 'hn-card-7.jpg', pos: '78% 40%' },
  { name: "Baby's first year", line: 'Keepsakes for growing families', img: 'hn-christmas.jpg', pos: '50% 50%' },
  { name: 'Year books', line: 'Your year in one book', img: 'hn-yearbook.jpg', pos: '50% 50%', href: 'product-photobook.html' },
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
const HN_YOUR_PAGES = ['pb-src-canada.jpg', 'ob-album-photo.jpg', 'photos/mock-15.webp', 'photos/mock-08.webp',
  'photos/mock-12.webp', 'photos/mock-19.webp', 'photos/mock-01.webp', 'pb-src-italy.jpg'];
const HN_SUGGESTIONS = [
  { name: 'Trip to Canada', line: '42 photos · trip book', img: 'pb-src-canada.jpg' },
  { name: 'Summer 2026', line: '28 photos · collage', img: 'photos/mock-09.webp' },
  { name: 'Your 2026', line: '312 photos · year book', img: 'photos/mock-01.webp' },
];

const HN_CSS = `
  @keyframes hnKen { from { transform: scale(1.04) translate3d(0,0,0) } to { transform: scale(1.16) translate3d(-2%, -1%, 0) } }
  @keyframes hnBar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
  @keyframes hnUp { from { opacity: 0; transform: translateY(22px) } to { opacity: 1; transform: none } }
  @keyframes hnTurn { from { transform: translateZ(1px) rotateY(0deg) } to { transform: translateZ(1px) rotateY(-180deg) } }
  @keyframes hnPop { 0% { opacity: 0; transform: scale(.94) } 100% { opacity: 1; transform: none } }
  [data-hn-calm] * { animation-duration: 0s !important; animation-iteration-count: 1 !important; transition: none !important; }
`;

const HN_ICON = {
  search: <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></g>,
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
          marginTop: 6, alignSelf: 'flex-start', height: 50, padding: '0 22px', borderRadius: 25, border: 'none',
          background: '#fff', color: HN_DEEP, fontFamily: HN_FONT, fontSize: 16, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 10px 24px -8px rgba(0,0,0,.45)',
          transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent', animation: `hnUp .8s ${HN_EASE} .24s both`,
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
function HnLiveBook({ pages }) {
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
  return (
    <div style={{ position: 'relative', height: 250, perspective: 1000 }}>
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d',
        transform: 'rotateX(28deg) rotateZ(-4deg)' }}>
        {/* shadow, cover boards and page block */}
        <div style={{ position: 'absolute', left: -PW * 1.15, top: -PH * 0.62, width: PW * 2.3, height: PH * 1.3, transform: 'translateZ(-12px)',
          background: 'radial-gradient(closest-side, rgba(0,30,32,.45), rgba(0,30,32,0))' }} />
        <div style={{ position: 'absolute', left: -PW - 5, top: -PH / 2 - 5, width: 2 * PW + 10, height: PH + 10, transform: 'translateZ(-6px)',
          background: '#00383D', borderRadius: 4 }} />
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
  );
}

function HnBookMoment() {
  const [granted, setGranted] = React.useState(() => {
    try { return sessionStorage.getItem('pb_photo_access') === '1'; } catch (e) { return false; }
  });
  const allow = () => { try { sessionStorage.setItem('pb_photo_access', '1'); } catch (e) {} setGranted(true); };
  const pages = granted ? HN_YOUR_PAGES : HN_SAMPLE_PAGES;
  return (
    <div style={{ margin: '28px 16px 0', borderRadius: 28, overflow: 'hidden', position: 'relative',
      background: 'radial-gradient(140% 90% at 50% 20%, #13A3A0 0%, #007377 42%, #00454C 100%)', color: '#fff',
      boxShadow: '0 20px 40px -18px rgba(0,60,62,.6)' }}>
      <div style={{ padding: '22px 20px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: HN_FONT, fontSize: 12, fontWeight: 700,
          letterSpacing: '.14em', color: '#9BE3DC' }}>
          <HnIcon name="spark" size={14} />{granted ? 'MADE FROM YOUR PHOTOS' : 'IMAGINE IT AS A BOOK'}
        </span>
        <span style={{ fontFamily: HN_FONT, fontSize: 26, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.4px' }}>
          {granted ? 'Your trip to Canada, already laid out' : 'Your camera roll, beautifully bound'}
        </span>
      </div>
      <HnLiveBook pages={pages} />
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 14, fontFamily: HN_FONT, fontSize: 13, opacity: .92 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><HnIcon name="wand" size={16} />We design it for you</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><HnIcon name="truck" size={16} />At your door in days</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={hnGo('product-photobook.html')} {...press(0.97)} style={{
            flex: 1, height: 50, borderRadius: 25, border: 'none', background: '#fff', color: HN_DEEP, fontFamily: HN_FONT,
            fontSize: 16, fontWeight: 700, whiteSpace: 'nowrap', cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
          }}>Make this book</button>
          {!granted && (
            <button onClick={allow} {...press(0.97)} style={{
              height: 50, padding: '0 16px', borderRadius: 25, border: 'none', background: 'rgba(255,255,255,.16)', color: '#fff',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.35)', fontFamily: HN_FONT, fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6, transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
            whiteSpace: 'nowrap' }}><HnIcon name="photos" size={18} />My photos</button>
          )}
        </div>
        {granted && (
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', margin: '2px -20px 0', padding: '0 20px' }}>
            {HN_SUGGESTIONS.map((s, k) => (
              <div key={s.name} onClick={hnGo('product-photobook.html')} {...press(0.97)} style={{ flex: 'none', display: 'flex',
                alignItems: 'center', gap: 10, padding: 6, paddingRight: 14, borderRadius: 16, background: 'rgba(255,255,255,.14)',
                cursor: 'pointer', transition: 'transform 140ms ease', animation: `hnPop .5s ${HN_EASE} ${k * 0.08}s both` }}>
                <img src={`${HN_A}/${s.img}`} alt="" style={{ width: 44, height: 44, borderRadius: 11, objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontFamily: HN_FONT, fontSize: 14, fontWeight: 700 }}>{s.name}</span>
                  <span style={{ fontFamily: HN_FONT, fontSize: 12, opacity: .8 }}>{s.line}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HnProducts() {
  return (
    <div style={{ display: 'flex', gap: 14, overflowX: 'auto', scrollbarWidth: 'none', padding: '22px 16px 0' }}>
      {HN_PRODUCTS.map(p => (
        <div key={p.name} onClick={hnGo(p.href)} {...press(0.94)} style={{ flex: 'none', width: 68, display: 'flex',
          flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', transition: 'transform 140ms ease' }}>
          <div style={{ position: 'relative', width: 64, height: 64, borderRadius: '50%', overflow: 'hidden', background: HN_MINT,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: HN_TEAL, boxShadow: 'inset 0 0 0 1px rgba(0,77,74,.06)' }}>
            {p.img
              ? <img src={`${HN_A}/${p.img}`} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: p.pos, transform: `scale(${p.zoom})`, transformOrigin: p.pos }} />
              : <HnIcon name={p.icon} size={28} />}
          </div>
          <span style={{ fontFamily: HN_FONT, fontSize: 12, fontWeight: 700, color: HN_DEEP, textAlign: 'center', lineHeight: 1.2 }}>{p.name}</span>
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
function HnRound({ label, icon, solid }) {
  return (
    <button aria-label={label} {...press(0.9)} style={{
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

function HomeNewScreen() {
  const { useState } = React;
  const [calm] = useState(() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [activeTab, setActiveTab] = useState('home');
  const [solid, setSolid] = useState(false);
  const onScroll = e => {
    const s = e.currentTarget.scrollTop > HN_HERO_H - 140;
    if (s !== solid) setSolid(s);
  };
  return (
    <div data-hn-calm={calm ? '' : undefined} style={{ width: '100%', height: '100%', background: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{HN_CSS}</style>

      {/* Header: transparent over the hero, a blurred white bar once scrolled past it. */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, pointerEvents: 'none',
        background: solid ? 'rgba(255,255,255,.82)' : 'rgba(255,255,255,0)',
        backdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none', WebkitBackdropFilter: solid ? 'blur(20px) saturate(180%)' : 'none',
        boxShadow: solid ? '0 1px 0 rgba(0,0,0,.06)' : 'none', transition: 'background .3s, box-shadow .3s' }}>
        <IOSStatusBar dark={!solid} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 10px', pointerEvents: 'auto' }}>
          <HnWordmark color={solid ? HN_TEAL : '#fff'} />
          <div style={{ display: 'flex', gap: 8 }}>
            <HnRound label="Search" icon="search" solid={solid} />
            <HnRound label="Notifications" icon="bell" solid={solid} />
          </div>
        </div>
      </div>

      <div onScroll={onScroll} style={{ position: 'absolute', inset: 0, overflowY: 'auto', scrollbarWidth: 'none' }}>
        <HnHero />

        {/* The sheet: content rides up over the bottom of the hero. */}
        <div style={{ position: 'relative', marginTop: -32, background: '#fff', borderRadius: '30px 30px 0 0', paddingTop: 2 }}>
          <div style={{ width: 36, height: 5, borderRadius: 3, background: '#DCE6E6', margin: '8px auto 0' }} />
          <HnProducts />
          <HnReveal><HnBookMoment /></HnReveal>

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
