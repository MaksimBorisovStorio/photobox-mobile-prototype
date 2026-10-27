// screens/product-photobook.jsx — Photo book product page (PDP).
//
// The first stop for every "Photo books" link in the app. It sells the product — what a photo
// book is, how it gets made, what it looks like — and its one action, "Select photo book",
// opens photobook-options.html, which is the old format / cover / size flow.
//
// Not a Figma node; designed from the app's own patterns:
//   - a full-bleed media hero that is home's story hero (slides, progress bars, tap to skip,
//     hold to pause, Ken Burns) minus the CTA — the bar at the bottom carries it;
//   - the hero copy is home's too: a caption chip that changes per slide, then a fixed "Photo book"
//     headline and "From €14.99";
//   - a rounded sheet riding up over the hero, as on home;
//   - a delivery card (arrival date), Why you'll love it (six USPs), Make it yours (a swipeable
//     row of cover styles), a details accordion, the gift-box upsell and reviews;
//   - a sticky bottom bar with the price and the action.
//
// Media is photobox.co.uk's own landscape-L-hardcover product page: its slider (the film, five
// product photos) and the category page's cover / binding close-ups, self-hosted as `pbx-*`.
// `photobook-film.mp4` is that page's 1080² film re-encoded to 720² (577KB, no audio, faststart);
// its poster is a frame from the film. Set `PDP_VIDEO` to null and slide 1 is the poster alone.
// Swap anything in `PDP_SLIDES` / `PDP_STYLES` — nothing else needs to change. Rating and review
// copy are mock.
// ⚠️ `python3 -m http.server` does not do HTTP Range requests, which Safari needs for <video> —
// check the film on a phone against the GitHub Pages URL, not the local server.
// ⚠️ Top-level names in a classic script are global: everything here is `PDP_…` / `Pdp…`.

const PDP_A = '../shared/assets';
const PDP_VIDEO = '../shared/assets/photobook-film.mp4';
const PDP_HERO_H = 520;
const PDP_STORY_MS = 6000;
const PDP_EASE = 'cubic-bezier(.2,.8,.2,1)';
const PDP_HEAD = '"Bricolage Grotesque", "DM Sans", -apple-system, system-ui, sans-serif';
const PDP_HEAD_VARIATION = '"opsz" 14, "wdth" 100';
const PDP_TEXT = '-apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif';
const PDP_OPTIONS = 'photobook-options.html';

// Square sources in a portrait hero: `cover` crops the sides, so `pos` picks which side to keep.
const PDP_SLIDES = [
  { img: 'photobook-film-poster.jpg', pos: '50% 50%', tag: 'See it in motion', video: PDP_VIDEO },
  { img: 'pbx-pdp-1.jpg', pos: '50% 50%', tag: 'Made to be held' },
  { img: 'pbx-pdp-2.jpg', pos: '50% 50%', tag: 'Landscape hardcover' },
  { img: 'pbx-pdp-3.jpg', pos: '0% 50%',  tag: 'Four sizes to choose from' },
  { img: 'pbx-pdp-4.jpg', pos: '35% 50%', tag: 'Premium hardcover finish' },
  { img: 'pbx-pdp-5.jpg', pos: '50% 50%', tag: 'Flexible page layouts' },
];

// Six USPs, 24px stroke icons (inline, so they take the page's ink and green).
const PDP_USPS = [
  { title: 'Lay-flat pages',   text: 'Spreads open fully, so no photo is lost in the spine.',
    icon: <><path d="M3 5.5C5.5 4.5 9 4.5 12 6.5c3-2 6.5-2 9-1v13c-2.5-1-6-1-9 1-3-2-6.5-2-9-1z" /><path d="M12 6.5v13" /></> },
  { title: 'Premium paper',    text: 'Matte, satin or gloss, in rich true-to-life colour.',
    icon: <><rect x="3.5" y="4.5" width="17" height="15" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="M4 17l5-4.5 4 3.5 3-2.5 4 3.5" /></> },
  { title: 'Smart auto-fill',  text: 'Your whole book laid out in seconds. Tweak anything.',
    icon: <><path d="M11 3.5l1.8 4.7 4.7 1.8-4.7 1.8L11 16.5l-1.8-4.7L4.5 10l4.7-1.8z" /><path d="M18 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /></> },
  { title: 'Up to 120 pages',  text: 'Room for a weekend away or your whole year.',
    icon: <><path d="M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" /><path d="M9 9h6M9 13h6M9 17h3" /></> },
  { title: 'Made to last',     text: 'Hardwearing covers and professional printing.',
    icon: <><path d="M6.5 4h11l3.5 5-9 11L3 9z" /><path d="M3 9h18M9.5 4L8 9l4 11 4-11-1.5-5" /></> },
  { title: 'Our promise',      text: 'Not right? We will reprint it or refund you.',
    icon: <><path d="M12 3l7 3v5.5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z" /><path d="M8.8 12l2.3 2.3 4.2-4.6" /></> },
];

// Delivery is promised in about 4 days: show the date it would land on if ordered today.
function pdpArrival() {
  const d = new Date(); d.setDate(d.getDate() + 4);
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

const PDP_STYLES = [
  { img: 'pbx-cover-photo.jpg',     pos: '30% 50%', title: 'Photo hardcover', line: 'Your photo, edge to edge' },
  { img: 'pbx-cover-cutout.jpg',    pos: '60% 40%', title: 'Cut-out',         line: 'Your photo in the cover' },
  { img: 'pbx-cover-softcover.jpg', pos: '50% 50%', title: 'Soft cover',      line: 'Light and flexible' },
  { img: 'pbx-binding-layflat.jpg', pos: '40% 50%', title: 'Lay-flat',        line: 'Pages that open fully' },
  // A collection rather than a cover: the same Trip books card home carries (hn-trip.jpg).
  { img: 'hn-trip.jpg',             pos: '72% 50%', title: 'Trip books',      line: 'Every journey, bound to last', badge: 'Collection' },
];

const PDP_DETAILS = [
  { title: 'Paper & printing',  text: 'Premium photo paper in matte, satin or gloss, printed in rich, true-to-life colour.' },
  { title: 'Binding & lay-flat', text: 'Standard binding, or lay-flat so every spread opens completely and no photo is lost in the spine.' },
  { title: 'Formats & sizes',    text: 'Landscape, portrait or square, in medium, large and extra large. From 24 up to 120 pages.' },
  { title: 'Delivery & returns', text: 'Delivered in about 4 days. If it is not right, we will reprint it or refund you.' },
];

const PDP_REVIEWS = [
  { name: 'Sofia, Madrid',   text: 'The paper and colours are stunning. Our trip to Italy looks like a magazine.' },
  { name: 'Daniel, Leeds',   text: 'Auto-fill did the whole book in seconds. I only moved two photos.' },
  { name: 'Marie, Lyon',     text: 'I gave one to my parents. They have not put it down since.' },
];

const pdpPush = href => () => window.navigation.push(href);

// Fades a section up the first time it scrolls into view.
function PdpReveal({ children, root }) {
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setShown(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { root: root && root.current, threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? 'none' : 'translateY(20px)',
      transition: `opacity .7s ${PDP_EASE}, transform .7s ${PDP_EASE}` }}>{children}</div>
  );
}

const PdpTitle = ({ children }) => (
  <p style={{ margin: 0, fontFamily: PDP_HEAD, fontWeight: 600, fontSize: 24, lineHeight: '30px',
    letterSpacing: '-0.6px', color: PB_INK, fontVariationSettings: PDP_HEAD_VARIATION }}>{children}</p>
);

// ── Media hero. Tap the right side to skip ahead, the left to go back; holding pauses.
function PdpHero() {
  const { useState, useEffect, useRef } = React;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const down = useRef(null);
  const reduced = typeof obReducedMotion === 'function' ? obReducedMotion()
    : !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    if (paused || reduced) return undefined;
    const t = setTimeout(() => setI(n => (n + 1) % PDP_SLIDES.length), PDP_STORY_MS);
    return () => clearTimeout(t);
  }, [i, paused, reduced]);
  const s = PDP_SLIDES[i];
  return (
    <div
      onPointerDown={e => { down.current = { t: Date.now() }; setPaused(true); }}
      onPointerUp={e => {
        setPaused(false);
        const d = down.current; down.current = null;
        if (!d || Date.now() - d.t > 350) return;
        const r = e.currentTarget.getBoundingClientRect();
        setI(n => (n + (e.clientX - r.left > r.width * 0.35 ? 1 : PDP_SLIDES.length - 1)) % PDP_SLIDES.length);
      }}
      onPointerLeave={() => setPaused(false)}
      style={{ position: 'relative', height: PDP_HERO_H, overflow: 'hidden', background: '#0b2b2d', touchAction: 'pan-y' }}>
      {PDP_SLIDES.map((sl, k) => (
        <div key={k} style={{ position: 'absolute', inset: 0, opacity: k === i ? 1 : 0, transition: 'opacity .7s ease' }}>
          <img src={`${PDP_A}/${sl.img}`} alt="" draggable={false} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: sl.pos,
            animation: k === i && !reduced ? `pdpKen ${PDP_STORY_MS + 1500}ms ease-out both` : 'none',
            animationPlayState: paused ? 'paused' : 'running' }} />
          {sl.video && (
            <video src={sl.video} poster={`${PDP_A}/${sl.img}`} muted loop playsInline preload="auto"
              ref={el => {
                if (!el) return;
                if (k === i && !paused) el.play().catch(() => {});
                else el.pause();
                if (k !== i && el.currentTime) el.currentTime = 0;     // start from the top next lap
              }}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: k === i ? 1 : 0 }} />
          )}
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(rgba(0,0,0,.40) 0%, rgba(0,0,0,0) 24%, rgba(0,0,0,0) 62%, rgba(0,20,22,.62) 100%)' }} />

      {/* Same stack as home's hero: chip (changes per slide), headline, one line under it. */}
      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 72, display: 'flex', flexDirection: 'column', gap: 10, color: '#fff' }}>
        <span key={i} style={{ alignSelf: 'flex-start', padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,.18)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.3)',
          fontFamily: PB_DISPLAY, fontSize: 12, fontWeight: 700, letterSpacing: '.02em', animation: `pdpUp .6s ${PDP_EASE} both` }}>
          {s.video ? '▶ ' : ''}{s.tag}
        </span>
        <h1 style={{ margin: 0, fontFamily: PB_DISPLAY, fontSize: 36, fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.6px',
          textShadow: '0 2px 20px rgba(0,0,0,.3)' }}>Photo book</h1>
        <span style={{ fontFamily: PB_DISPLAY, fontSize: 16, lineHeight: 1.35, opacity: .9 }}>From €14.99</span>
      </div>

      <div style={{ position: 'absolute', left: 20, right: 20, bottom: 52, display: 'flex', gap: 4, zIndex: 2 }}>
        {PDP_SLIDES.map((_, k) => (
          <span key={k} style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.35)', overflow: 'hidden' }}>
            <span key={k === i ? `on${i}` : 'off'} style={{ display: 'block', height: '100%', background: '#fff', transformOrigin: 'left',
              transform: k < i || reduced ? 'scaleX(1)' : 'scaleX(0)',
              animation: k === i && !reduced ? `pdpBar ${PDP_STORY_MS}ms linear both` : 'none',
              animationPlayState: paused ? 'paused' : 'running' }} />
          </span>
        ))}
      </div>
    </div>
  );
}

function PdpDelivery() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', background: '#fff', borderRadius: 24, padding: '16px 20px',
      boxShadow: '0 4px 16px -1px rgba(0,77,74,0.08)' }}>
      <span style={{ flex: 'none', width: 48, height: 48, borderRadius: 24, background: '#DDF0EC', display: 'flex',
        alignItems: 'center', justifyContent: 'center' }}>
        <img src={`${PDP_A}/pb-icon-delivery.svg`} alt="" width={24} height={24} style={{ display: 'block' }} />
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span style={{ fontFamily: PB_UI, fontWeight: 700, fontSize: 17, lineHeight: '22px', color: PB_INK }}>
          Order today, get it by {pdpArrival()}</span>
        <span style={{ fontFamily: PDP_TEXT, fontSize: 15, lineHeight: '21px', letterSpacing: '-0.24px', color: '#5b6b6d' }}>
          Delivery in about 4 days, tracked to your door. Express is available at checkout.</span>
      </div>
    </div>
  );
}

function PdpUsps() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {PDP_USPS.map(u => (
        <div key={u.title} style={{ background: '#fff', borderRadius: 24, padding: 16, display: 'flex', flexDirection: 'column', gap: 10,
          boxShadow: '0 4px 16px -1px rgba(0,77,74,0.08)' }}>
          <span style={{ width: 40, height: 40, borderRadius: 20, background: '#DDF0EC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={PB_GREEN} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{u.icon}</svg>
          </span>
          <span style={{ fontFamily: PB_UI, fontWeight: 700, fontSize: 16, lineHeight: '20px', color: PB_INK }}>{u.title}</span>
          <span style={{ fontFamily: PDP_TEXT, fontSize: 14, lineHeight: '19px', letterSpacing: '-0.15px', color: '#5b6b6d' }}>{u.text}</span>
        </div>
      ))}
    </div>
  );
}

// A swipeable row. It bleeds past the page's 20px gutters so cards reach the screen edge, and
// its bottom padding is what stops the card shadow being sliced off by the scroller.
function PdpStyles() {
  return (
    <div style={{ display: 'flex', gap: 12, margin: '0 -20px', padding: '0 20px 20px', marginBottom: -20,
      overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', scrollSnapType: 'x mandatory', scrollPaddingLeft: 20 }}>
      {PDP_STYLES.map(c => (
        <div key={c.title} style={{ flex: 'none', width: 214, height: 270, borderRadius: 24, overflow: 'hidden', position: 'relative',
          scrollSnapAlign: 'start', background: '#e6eeee', boxShadow: '0 4px 16px -1px rgba(0,77,74,0.1)' }}>
          <img src={`${PDP_A}/${c.img}`} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: c.pos }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(0,20,22,0) 55%, rgba(0,20,22,.7) 100%)' }} />
          {c.badge && (
            <span style={{ position: 'absolute', left: 12, top: 12, padding: '5px 11px', borderRadius: 999, background: 'rgba(255,255,255,.92)',
              color: PB_INK, fontFamily: PB_UI, fontWeight: 700, fontSize: 12, lineHeight: '16px',
              boxShadow: '0px 4px 8px -2px rgba(0,0,0,0.2)' }}>{c.badge}</span>
          )}
          <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, color: '#fff', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: PB_UI, fontWeight: 700, fontSize: 19, lineHeight: '24px' }}>{c.title}</span>
            <span style={{ fontFamily: PDP_TEXT, fontSize: 14, lineHeight: '18px', opacity: .9 }}>{c.line}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function PdpDetails() {
  const [open, setOpen] = React.useState(-1);
  return (
    <div style={{ background: '#fff', borderRadius: 24, padding: '0 20px', boxShadow: '0 4px 16px -1px rgba(0,77,74,0.08)' }}>
      {PDP_DETAILS.map((d, k) => {
        const on = open === k;
        return (
          <div key={d.title} style={{ borderTop: k ? '1px solid rgba(2,60,66,0.08)' : 'none' }}>
            <button onClick={() => setOpen(on ? -1 : k)} aria-expanded={on} style={{
              all: 'unset', boxSizing: 'border-box', width: '100%', minHeight: 56, display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', cursor: 'pointer', fontFamily: PB_UI, fontWeight: 700, fontSize: 17, color: PB_INK }}>
              {d.title}
              <svg width="20" height="20" viewBox="0 0 20 20" style={{ transform: on ? 'rotate(180deg)' : 'none', transition: 'transform .25s ease' }}>
                <path d="M5 7.5l5 5 5-5" fill="none" stroke={PB_INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div style={{ display: 'grid', gridTemplateRows: on ? '1fr' : '0fr', transition: 'grid-template-rows .3s ease' }}>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ margin: 0, padding: '0 0 16px', fontFamily: PDP_TEXT, fontSize: 15, lineHeight: '21px',
                  letterSpacing: '-0.24px', color: '#5b6b6d' }}>{d.text}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PdpGift() {
  return (
    <div style={{ position: 'relative', height: 150, borderRadius: 24, overflow: 'hidden', background: '#0b2b2d',
      boxShadow: '0 4px 16px -1px rgba(0,77,74,0.1)' }}>
      <img src={`${PDP_A}/hn-hero-gift.jpg`} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: '44% 50%' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,20,22,.78) 0%, rgba(0,20,22,.35) 60%, rgba(0,20,22,0) 100%)' }} />
      <div style={{ position: 'absolute', left: 20, top: 0, bottom: 0, width: '62%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: 4, color: '#fff' }}>
        <span style={{ fontFamily: PDP_HEAD, fontWeight: 600, fontSize: 21, lineHeight: '25px', letterSpacing: '-0.5px',
          fontVariationSettings: PDP_HEAD_VARIATION }}>Make it a gift</span>
        <span style={{ fontFamily: PDP_TEXT, fontSize: 14, lineHeight: '19px', opacity: .92 }}>
          Add our keepsake gift box when you check out.</span>
      </div>
    </div>
  );
}

function PdpReviews() {
  return (
    <div style={{ display: 'flex', gap: 12, margin: '0 -20px', padding: '0 20px 20px', marginBottom: -20,
      overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', scrollSnapType: 'x mandatory', scrollPaddingLeft: 20 }}>
      {PDP_REVIEWS.map(r => (
        <div key={r.name} style={{ flex: 'none', width: 270, boxSizing: 'border-box', padding: 20, borderRadius: 24, background: '#fff',
          scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 4px 16px -1px rgba(0,77,74,0.08)' }}>
          <span aria-label="5 stars" style={{ color: '#F5A623', fontSize: 16, letterSpacing: 2 }}>★★★★★</span>
          <span style={{ fontFamily: PDP_TEXT, fontSize: 16, lineHeight: '22px', letterSpacing: '-0.32px', color: PB_INK }}>“{r.text}”</span>
          <span style={{ fontFamily: PDP_TEXT, fontSize: 13, color: '#6b7b7d' }}>{r.name}</span>
        </div>
      ))}
    </div>
  );
}

function ProductPhotobookScreen() {
  const { useState, useRef } = React;
  const scrollerRef = useRef(null);
  const [past, setPast] = useState(false);   // scrolled beyond the hero → glass header

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: PB_PAPER, overflow: 'hidden' }}>
      <style>{`
        @keyframes pdpKen { from { transform: scale(1.04) } to { transform: scale(1.14) translate3d(-1.5%, -1%, 0) } }
        @keyframes pdpBar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes pdpUp { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
      `}</style>

      <div ref={scrollerRef}
        onScroll={e => { const p = e.currentTarget.scrollTop > PDP_HERO_H - 120; if (p !== past) setPast(p); }}
        style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        <PdpHero />

        {/* the sheet rides up over the hero */}
        <div style={{ position: 'relative', marginTop: -28, borderRadius: '28px 28px 0 0', background: PB_PAPER,
          padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 32 }}>

          <PdpDelivery />

          <PdpReveal root={scrollerRef}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PdpTitle>Why you'll love it</PdpTitle>
              <PdpUsps />
            </div>
          </PdpReveal>

          <PdpReveal root={scrollerRef}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PdpTitle>Make it yours</PdpTitle>
              <PdpStyles />
            </div>
          </PdpReveal>

          <PdpReveal root={scrollerRef}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PdpTitle>Good to know</PdpTitle>
              <PdpDetails />
            </div>
          </PdpReveal>

          <PdpReveal root={scrollerRef}><PdpGift /></PdpReveal>

          <PdpReveal root={scrollerRef}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <PdpTitle>Loved by our customers</PdpTitle>
              <PdpReviews />
            </div>
          </PdpReveal>

          {/* room for the sticky bar, so the last section is not trapped under it */}
          <div aria-hidden style={{ height: 'calc(100px + env(safe-area-inset-bottom, 0px) - 32px)' }} />
        </div>
      </div>

      {/* glass header: appears once the hero has scrolled away */}
      <div aria-hidden style={{
        position: 'absolute', left: 0, right: 0, top: 0, zIndex: 4, pointerEvents: 'none',
        height: `calc(${PB_BACK_TOP} + 54px)`, boxSizing: 'border-box', paddingTop: PB_BACK_TOP,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        background: 'rgba(241,246,246,.82)', backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        boxShadow: '0 1px 0 rgba(2,60,66,.08)', opacity: past ? 1 : 0, transition: 'opacity .25s ease' }}>
        <span style={{ height: 44, lineHeight: '44px', fontFamily: PB_UI, fontWeight: 700, fontSize: 17, color: PB_INK }}>Photo book</span>
      </div>
      <PbBackButton style={{ zIndex: 5 }} />

      {/* sticky action bar */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 4, boxSizing: 'border-box',
        padding: '12px 20px calc(12px + env(safe-area-inset-bottom, 0px))', display: 'flex', alignItems: 'center', gap: 16,
        background: 'rgba(255,255,255,.86)', backdropFilter: 'blur(18px) saturate(140%)', WebkitBackdropFilter: 'blur(18px) saturate(140%)',
        boxShadow: '0 -1px 0 rgba(2,60,66,.08), 0 -12px 28px -16px rgba(0,77,74,.25)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 'none' }}>
          <span style={{ fontFamily: PDP_TEXT, fontSize: 13, lineHeight: '16px', color: '#5b6b6d' }}>From</span>
          <span style={{ fontFamily: PB_UI, fontWeight: 700, fontSize: 22, lineHeight: '26px', color: PB_INK }}>€14.99</span>
        </div>
        <button onClick={pdpPush(PDP_OPTIONS)} {...press(0.97)} style={{ ...pbButton('primary'), flex: 1 }}>Select photo book</button>
      </div>
    </div>
  );
}
