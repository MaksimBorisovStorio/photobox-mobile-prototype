// screens/home-playful.jsx — Home, playful version.
//
// Alternative take on the first-time-customer home (home-new.jsx is the photo-led,
// app-native one). This one is a sunny scrapbook you can play with:
//   - Hero: polaroids with handwritten captions scattered over a soft colour-blob sky.
//     Drag them around; "Shuffle" tosses them again. Stickers bob, the CTA is jelly.
//   - "What's your vibe?": chips restyle a live, self-turning photo book (HnLiveBook)
//     with that theme's photos, cover colour and title — instant "that could be mine".
//   - Collections as taped, tilted scrapbook cards; a "Who's it for?" gift picker with
//     big emoji buttons; a scrolling product ticker; the AI field as a speech bubble.
// Type: Teachers (the brand wordmark face) for display, Caveat for handwriting, both
// self-hosted. Photos mix Photobox photography (hn-*), Unsplash (ed-*, free under the
// Unsplash License) and the mock pool.
//
// Reuses home-new.jsx's HnLiveBook, HnReveal, HnIcon and HnWordmark — load it first.

const PL_A = '../shared/assets';
const PL_DISPLAY = '"Teachers", -apple-system, system-ui, sans-serif';
const PL_HAND = '"Caveat", "Comic Sans MS", cursive';
const PL_SANS = PB_DISPLAY;
const PL_INK = '#16323A';
const PL_TEAL = '#007F70';
const PL_CORAL = '#FF7A66';
const PL_SUN = '#FFC94D';
const PL_LILAC = '#B9A6FF';
const PL_MINT = '#8FE0D0';
const PL_SPRING = 'cubic-bezier(.34,1.56,.64,1)';

// Hero polaroids: photo, caption, resting spot (% of the stage) and tilt.
const PL_SNAPS = [
  { img: 'ed-sea.jpg', cap: 'best day ever!', x: 6, y: 8, r: -9 },
  { img: 'ed-baby.jpg', cap: 'tiny toes ♡', x: 55, y: 2, r: 7 },
  { img: 'photos/mock-01.webp', cap: 'we made it!', x: 30, y: 30, r: -3 },
  { img: 'ed-boardwalk.jpg', cap: 'summer ☀', x: 62, y: 40, r: 10 },
];

const PL_VIBES = [
  { id: 'summer', emoji: '🏖️', label: 'Summer', title: "Summer '26", cover: '#FF8A5B',
    pages: ['ed-sea.jpg', 'ed-boardwalk.jpg', 'photos/mock-09.webp', 'pb-src-italy.jpg', 'ed-boat.jpg', 'hn-trip.jpg', 'photos/mock-03.webp', 'ed-travel.jpg'] },
  { id: 'baby', emoji: '🍼', label: 'Baby', title: 'Hello, little one', cover: '#9FB8FF',
    pages: ['ed-baby.jpg', 'hn-card-6.jpg', 'hn-christmas.jpg', 'hn-card-5.jpg', 'ed-hands.jpg', 'ed-baby.jpg', 'hn-card-6.jpg', 'hn-christmas.jpg'] },
  { id: 'wedding', emoji: '💍', label: 'Wedding', title: 'Just married', cover: '#E7B9C8',
    pages: ['ed-bride.jpg', 'ed-rings.jpg', 'ed-mist.jpg', 'hn-card-7.jpg', 'ed-hands.jpg', 'ed-candles.jpg', 'ed-rings.jpg', 'ed-bride.jpg'] },
  { id: 'adventure', emoji: '🏔️', label: 'Adventures', title: 'Into the wild', cover: '#5CC29A',
    pages: ['photos/mock-01.webp', 'photos/mock-19.webp', 'pb-src-canada.jpg', 'ed-travel.jpg', 'pb-src-etna.jpg', 'pb-src-guadalupe.jpg', 'ed-boat.jpg', 'ed-mist.jpg'] },
  { id: 'family', emoji: '🏡', label: 'Family', title: 'Our crew', cover: '#FFC94D',
    pages: ['hn-card-8.jpg', 'ed-sea.jpg', 'hn-trip.jpg', 'ob-album-photo.jpg', 'hn-card-1.jpg', 'photos/mock-15.webp', 'hn-card-2.jpg', 'ed-boardwalk.jpg'] },
];

const PL_PRODUCTS = [
  { name: 'Photo books', img: 'hn-card-1.jpg', pos: '64% 62%', zoom: 1.9, bg: PL_SUN, href: 'product-photobook.html' },
  { name: 'Calendars', img: 'hn-calendar.jpg', pos: '16% 40%', zoom: 1.6, bg: PL_LILAC },
  { name: 'Wall art', img: 'hn-hero-wall.jpg', pos: '47% 30%', zoom: 1.7, bg: PL_MINT },
  { name: 'Prints', img: 'create-prints.png', pos: '50% 50%', zoom: 1.15, bg: '#FFB3A6' },
  { name: 'Mugs', img: 'create-mugs.png', pos: '50% 50%', zoom: 1.2, bg: PL_SUN },
  { name: 'Puzzles', img: 'hn-card-2.jpg', pos: '78% 72%', zoom: 1.9, bg: PL_LILAC },
  { name: 'Cushions', img: 'idea-cushion.png', pos: '50% 50%', zoom: 1.4, bg: PL_MINT },
];

const PL_COLLECTIONS = [
  { name: 'Trip books', note: 'for the road trippers', img: 'hn-trip.jpg', pos: '70% 50%', tape: PL_SUN, r: -3, offer: '50% off', href: 'product-photobook.html' },
  { name: 'Christmas', note: 'gifts > socks', img: 'hn-card-5.jpg', pos: '55% 50%', tape: PL_CORAL, r: 2.5, offer: '50% off' },
  { name: 'Wedding', note: 'happily ever after', img: 'ed-rings.jpg', pos: '50% 50%', tape: PL_LILAC, r: -2 },
  { name: 'First year', note: 'all the firsts', img: 'ed-baby.jpg', pos: '50% 60%', tape: PL_MINT, r: 3 },
  { name: 'Year books', note: 'your year, recapped', img: 'hn-yearbook.jpg', pos: '50% 50%', tape: PL_SUN, r: -2.5, href: 'product-photobook.html' },
];

const PL_GIFTS = [
  { emoji: '👩', label: 'Her', bg: '#FFD9D2', idea: 'A book of your best moments together', img: 'hn-card-1.jpg' },
  { emoji: '👨', label: 'Him', bg: '#D7E6FF', idea: 'A puzzle of his favourite photo', img: 'hn-card-2.jpg' },
  { emoji: '👵', label: 'Grandparents', bg: '#FFF0C2', idea: 'A calendar of the grandkids, every month', img: 'hn-calendar.jpg' },
  { emoji: '👶', label: 'Little ones', bg: '#D8F4EC', idea: 'A first-year book they’ll grow up with', img: 'hn-card-6.jpg' },
  { emoji: '🐶', label: 'Pet lovers', bg: '#EADFFF', idea: 'A mug starring the goodest boy', img: 'create-mugs.png' },
];

const PL_CSS = `
  @keyframes plBlob { 0%,100% { transform: translate(0,0) scale(1) } 33% { transform: translate(14px,-10px) scale(1.08) } 66% { transform: translate(-10px,12px) scale(.95) } }
  @keyframes plBob { 0%,100% { transform: translateY(0) rotate(var(--r, 0deg)) } 50% { transform: translateY(-7px) rotate(calc(var(--r, 0deg) + 6deg)) } }
  @keyframes plSpin { from { transform: rotate(0) } to { transform: rotate(360deg) } }
  @keyframes plIn { 0% { opacity: 0; transform: translateY(30px) scale(.8) rotate(var(--r, 0deg)) } 100% { opacity: 1; transform: rotate(var(--r, 0deg)) } }
  @keyframes plJelly { 0% { transform: scale(1,1) } 30% { transform: scale(1.12,.88) } 50% { transform: scale(.92,1.08) } 70% { transform: scale(1.04,.96) } 100% { transform: scale(1,1) } }
  @keyframes plTicker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  @keyframes plWiggle { 0%,100% { transform: rotate(0) } 25% { transform: rotate(-8deg) } 75% { transform: rotate(8deg) } }
  @keyframes plPop { 0% { opacity: 0; transform: scale(.6) } 70% { opacity: 1; transform: scale(1.06) } 100% { transform: scale(1) } }
  [data-pl-calm] * { animation-duration: 0s !important; animation-iteration-count: 1 !important; transition: none !important; }
`;

const plGo = href => () => href && window.navigation.push(href);

// Stickers: a star, a heart, a sun and a squiggle, all drawn in place.
function PlSticker({ kind, size = 34, color }) {
  const s = {
    star: <path d="M12 2.5l2.6 6 6.4.6-4.9 4.3 1.5 6.3L12 16.4 6.4 19.7l1.5-6.3L3 9.1l6.4-.6Z" fill={color} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />,
    heart: <path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" fill={color} stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />,
    sun: <g><circle cx="12" cy="12" r="5" fill={color} stroke="#fff" strokeWidth="1.4" />{[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
      <rect key={a} x="11.2" y="1.5" width="1.6" height="4" rx=".8" fill={color} transform={`rotate(${a} 12 12)`} />))}</g>,
    squiggle: <path d="M2 14c3-6 5 6 8 0s5 6 8 0 3 4 4 2" fill="none" stroke={color} strokeWidth="2.6" strokeLinecap="round" />,
  }[kind];
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', overflow: 'visible', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,.12))' }}>{s}</svg>;
}

// ── Hero: draggable polaroids on a sunny blob sky.
function PlHero() {
  const { useState, useRef } = React;
  const stage = useRef(null);
  const [pos, setPos] = useState(() => PL_SNAPS.map(s => ({ x: s.x, y: s.y, r: s.r })));
  const [top, setTop] = useState(PL_SNAPS.length - 1);
  const [dragging, setDragging] = useState(-1);
  const drag = useRef(null);

  const onDown = (k, e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const r = stage.current.getBoundingClientRect();
    drag.current = { k, sx: e.clientX, sy: e.clientY, ox: pos[k].x, oy: pos[k].y, w: r.width, h: r.height };
    setTop(k); setDragging(k);
  };
  const onMove = e => {
    const d = drag.current;
    if (!d) return;
    const nx = d.ox + ((e.clientX - d.sx) / d.w) * 100;
    const ny = d.oy + ((e.clientY - d.sy) / d.h) * 100;
    setPos(p => p.map((q, i) => (i === d.k ? { ...q, x: Math.max(-8, Math.min(70, nx)), y: Math.max(-6, Math.min(58, ny)),
      r: q.r + (e.movementX || 0) * 0.15 } : q)));
  };
  const onUp = () => { drag.current = null; setDragging(-1); };
  const shuffle = () => setPos(p => p.map(() => ({ x: Math.random() * 62, y: Math.random() * 50, r: (Math.random() - 0.5) * 26 })));

  return (
    <div style={{ position: 'relative', overflow: 'hidden', paddingBottom: 30,
      background: 'linear-gradient(170deg, #FFF4D9 0%, #FFE7E1 55%, #F3EEFF 100%)' }}>
      {/* drifting colour blobs */}
      {[[PL_SUN, -40, 60, 220], [PL_CORAL, 230, 10, 200], [PL_LILAC, 150, 300, 240], [PL_MINT, -60, 380, 180]].map(([c, l, t, s], k) => (
        <div key={k} style={{ position: 'absolute', left: l, top: t, width: s, height: s, borderRadius: '50%', background: c,
          opacity: .45, filter: 'blur(40px)', animation: `plBlob ${9 + k * 2}s ease-in-out ${k * -2}s infinite` }} />
      ))}
      <div style={{ height: 104 }} />

      <div ref={stage} style={{ position: 'relative', height: 330, margin: '0 16px', touchAction: 'none' }}>
        {PL_SNAPS.map((s, k) => {
          const p = pos[k];
          return (
            <div key={k} onPointerDown={e => onDown(k, e)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
              style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, zIndex: k === top ? 5 : k + 1, cursor: 'grab',
                transition: dragging === k ? 'none' : `left .6s ${PL_SPRING}, top .6s ${PL_SPRING}`,
                animation: `plIn .8s ${PL_SPRING} ${0.15 + k * 0.12}s both` }}>
              {/* the entrance animation owns the outer transform; the tilt lives on the inner card */}
              <div style={{ width: 128, padding: '8px 8px 0', background: '#fff', borderRadius: 4,
                transform: `rotate(${p.r}deg) scale(${dragging === k ? 1.08 : 1})`,
                transition: dragging === k ? 'transform .15s ease' : `transform .6s ${PL_SPRING}`,
                boxShadow: dragging === k ? '0 26px 40px -12px rgba(40,20,10,.45)' : '0 12px 26px -10px rgba(40,20,10,.35)' }}>
                <img src={`${PL_A}/${s.img}`} alt="" draggable={false} style={{ width: 112, height: 112, objectFit: 'cover', display: 'block' }} />
                <div style={{ fontFamily: PL_HAND, fontWeight: 700, fontSize: 20, color: PL_INK, textAlign: 'center', padding: '2px 0 6px' }}>{s.cap}</div>
              </div>
            </div>
          );
        })}
        <div style={{ position: 'absolute', right: 6, top: -12, zIndex: 9, '--r': '-12deg', animation: 'plBob 3s ease-in-out infinite' }}><PlSticker kind="star" color={PL_SUN} size={42} /></div>
        <div style={{ position: 'absolute', left: -4, top: 210, zIndex: 9, '--r': '10deg', animation: 'plBob 3.6s ease-in-out .4s infinite' }}><PlSticker kind="heart" color={PL_CORAL} size={36} /></div>
        <div style={{ position: 'absolute', right: 44, bottom: -6, zIndex: 9, animation: 'plSpin 14s linear infinite' }}><PlSticker kind="sun" color={PL_SUN} size={40} /></div>
        <button onClick={shuffle} {...press(0.92)} style={{ position: 'absolute', left: 2, bottom: -8, zIndex: 9, height: 34, padding: '0 12px',
          borderRadius: 17, border: 'none', background: 'rgba(255,255,255,.85)', color: PL_INK, fontFamily: PL_HAND, fontWeight: 700, fontSize: 19,
          boxShadow: '0 6px 14px -6px rgba(0,0,0,.25)', cursor: 'pointer', transition: 'transform 140ms ease' }}>↻ shuffle!</button>
      </div>

      <div style={{ position: 'relative', padding: '26px 22px 0' }}>
        <div style={{ fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 40, lineHeight: 1.02, letterSpacing: '-1px', color: PL_INK }}>
          Turn your photos into something you’ll{' '}
          <span style={{ position: 'relative', display: 'inline-block', color: '#fff', padding: '0 8px', marginTop: 4, isolation: 'isolate' }}>
            <span style={{ position: 'absolute', inset: '4px -2px 0', background: PL_CORAL, borderRadius: 14, transform: 'rotate(-3deg)', zIndex: -1 }} />
            flip for
          </span>
        </div>
        <div style={{ marginTop: 12, fontFamily: PL_SANS, fontSize: 16, lineHeight: 1.4, color: 'rgba(22,50,58,.72)' }}>
          Drag the photos around. Then make them into a book.
        </div>
        <PlJellyButton onClick={plGo('product-photobook.html')} style={{ marginTop: 18 }}>Let’s make a book ✨</PlJellyButton>
      </div>
    </div>
  );
}

// A big chunky button that wobbles like jelly when pressed.
function PlJellyButton({ children, onClick, style, color = PL_TEAL }) {
  const [k, setK] = React.useState(0);
  return (
    <button key={k} onClick={() => { setK(x => x + 1); setTimeout(onClick || (() => {}), 260); }} style={Object.assign({
      height: 58, padding: '0 28px', borderRadius: 29, border: 'none', background: color, color: '#fff', cursor: 'pointer',
      fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 19, letterSpacing: '-.2px',
      boxShadow: `0 6px 0 ${color === PL_TEAL ? '#00494C' : 'rgba(0,0,0,.18)'}, 0 14px 26px -10px rgba(0,60,62,.5)`,
      animation: k ? `plJelly .5s ${PL_SPRING}` : 'none', WebkitTapHighlightColor: 'transparent',
    }, style)}>{children}</button>
  );
}

function PlSection({ kicker, title, children, pad = true }) {
  return (
    <HnReveal>
      <div style={{ paddingTop: 40 }}>
        <div style={{ padding: '0 22px 16px' }}>
          {kicker && <div style={{ fontFamily: PL_HAND, fontWeight: 700, fontSize: 22, color: PL_CORAL, transform: 'rotate(-2deg)', transformOrigin: 'left' }}>{kicker}</div>}
          <div style={{ fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 30, lineHeight: 1.05, letterSpacing: '-.6px', color: PL_INK }}>{title}</div>
        </div>
        <div style={pad ? {} : {}}>{children}</div>
      </div>
    </HnReveal>
  );
}

function PlProducts() {
  return (
    <div style={{ display: 'flex', gap: 14, overflowX: 'auto', scrollbarWidth: 'none', padding: '22px 18px 6px' }}>
      {PL_PRODUCTS.map((p, k) => (
        <div key={p.name} onClick={plGo(p.href)} style={{ flex: 'none', width: 74, display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: 7, cursor: 'pointer' }}
          onPointerDown={e => { e.currentTarget.firstChild.style.animation = 'none'; void e.currentTarget.offsetWidth; e.currentTarget.firstChild.style.animation = `plWiggle .45s ease`; }}>
          <div style={{ width: 70, height: 70, borderRadius: k % 2 ? '42% 58% 55% 45% / 50% 45% 55% 50%' : '55% 45% 48% 52% / 45% 55% 45% 55%',
            background: p.bg, overflow: 'hidden', position: 'relative', boxShadow: '0 6px 14px -8px rgba(0,0,0,.3)' }}>
            <img src={`${PL_A}/${p.img}`} alt="" style={{ position: 'absolute', inset: 6, width: 'calc(100% - 12px)', height: 'calc(100% - 12px)',
              borderRadius: 'inherit', objectFit: 'cover', objectPosition: p.pos, transform: `scale(${Math.min(p.zoom, 1.4)})` }} />
          </div>
          <span style={{ fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 14, color: PL_INK }}>{p.name}</span>
        </div>
      ))}
    </div>
  );
}

// ── Pick a vibe, watch the book become it.
function PlVibes() {
  const [vibe, setVibe] = React.useState(PL_VIBES[0]);
  return (
    <PlSection kicker="psst… try one" title="What’s your vibe?">
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', padding: '0 22px 4px' }}>
        {PL_VIBES.map(v => {
          const on = v.id === vibe.id;
          return (
            <button key={v.id} onClick={() => setVibe(v)} style={{ flex: 'none', height: 44, padding: '0 16px', borderRadius: 22,
              border: on ? 'none' : '2px solid rgba(22,50,58,.12)', background: on ? PL_INK : '#fff', color: on ? '#fff' : PL_INK,
              fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              transform: on ? 'scale(1.04)' : 'none', transition: `transform .3s ${PL_SPRING}, background .2s`, WebkitTapHighlightColor: 'transparent' }}>
              <span style={{ fontSize: 18 }}>{v.emoji}</span>{v.label}
            </button>
          );
        })}
      </div>
      <div style={{ margin: '16px 16px 0', borderRadius: 30, position: 'relative', overflow: 'hidden',
        background: `radial-gradient(120% 90% at 50% 10%, #fff 0%, ${vibe.cover}55 60%, ${vibe.cover}99 100%)`, transition: 'background .5s' }}>
        <div key={vibe.id} style={{ textAlign: 'center', paddingTop: 22, animation: `plPop .5s ${PL_SPRING} both` }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', background: '#fff', borderRadius: 12, transform: 'rotate(-2deg)',
            fontFamily: PL_HAND, fontWeight: 700, fontSize: 28, color: PL_INK, boxShadow: '0 8px 18px -10px rgba(0,0,0,.3)' }}>
            {vibe.title} {vibe.emoji}
          </span>
        </div>
        <HnLiveBook pages={vibe.pages} />
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 22 }}>
          <PlJellyButton onClick={plGo('product-photobook.html')} color={PL_INK} style={{ height: 52, fontSize: 17 }}>Make my {vibe.label.toLowerCase()} book</PlJellyButton>
        </div>
      </div>
    </PlSection>
  );
}

// ── Scrapbook collections: taped, tilted, swipeable.
function PlCollections() {
  return (
    <PlSection kicker="get inspired" title="Collections">
      <div style={{ display: 'flex', gap: 18, overflowX: 'auto', scrollbarWidth: 'none', padding: '14px 26px 18px', scrollSnapType: 'x mandatory' }}>
        {PL_COLLECTIONS.map(c => (
          <div key={c.name} onClick={plGo(c.href)} {...press(0.97)} style={{ flex: 'none', width: 220, scrollSnapAlign: 'center',
            transform: `rotate(${c.r}deg)`, cursor: 'pointer', transition: 'transform 140ms ease', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -10, left: '50%', width: 74, height: 24, marginLeft: -37, background: c.tape,
              opacity: .85, transform: 'rotate(-4deg)', zIndex: 2, boxShadow: '0 2px 4px rgba(0,0,0,.08)' }} />
            <div style={{ background: '#fff', padding: 10, borderRadius: 6, boxShadow: '0 16px 28px -14px rgba(40,20,10,.4)' }}>
              <div style={{ position: 'relative', height: 240, borderRadius: 3, overflow: 'hidden' }}>
                <img src={`${PL_A}/${c.img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.pos, display: 'block' }} />
                {c.offer && (
                  <span style={{ position: 'absolute', right: 8, top: 8, width: 58, height: 58, borderRadius: '50%', background: PL_SUN,
                    color: PL_INK, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center',
                    fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 14, lineHeight: 1, transform: 'rotate(12deg)',
                    boxShadow: '0 6px 12px -6px rgba(0,0,0,.35)' }}>{c.offer.replace(' off', '')}<br />off</span>
                )}
              </div>
              <div style={{ padding: '10px 4px 2px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                <span style={{ fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 21, color: PL_INK, whiteSpace: 'nowrap' }}>{c.name}</span>
                <span style={{ fontFamily: PL_HAND, fontWeight: 700, fontSize: 17, color: PL_CORAL, whiteSpace: 'nowrap' }}>{c.note}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PlSection>
  );
}

function PlTicker() {
  const words = ['photo books', 'calendars', 'wall art', 'mugs', 'cards', 'puzzles', 'prints', 'cushions'];
  const row = words.concat(words);
  return (
    <div style={{ marginTop: 30, background: PL_INK, transform: 'rotate(-2deg)', padding: '12px 0', overflow: 'hidden', width: '110%', marginLeft: '-5%' }}>
      <div style={{ display: 'flex', width: 'max-content', animation: 'plTicker 18s linear infinite' }}>
        {row.map((w, k) => (
          <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 14, paddingRight: 14, fontFamily: PL_DISPLAY,
            fontWeight: 700, fontSize: 22, color: k % 3 === 1 ? PL_SUN : '#fff', whiteSpace: 'nowrap' }}>
            {w}<PlSticker kind="star" color={[PL_CORAL, PL_MINT, PL_LILAC][k % 3]} size={18} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Who's it for? Tap a face, get an idea.
function PlGiftFinder() {
  const [g, setG] = React.useState(PL_GIFTS[0]);
  return (
    <PlSection kicker="gift o’clock" title="Who’s it for?">
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', padding: '8px 22px 6px' }}>
        {PL_GIFTS.map(x => {
          const on = x.label === g.label;
          return (
            <div key={x.label} onClick={() => setG(x)} style={{ flex: 'none', width: 70, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, background: x.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, boxShadow: on ? `0 0 0 3px #fff, 0 0 0 6px ${PL_INK}` : 'none',
                transform: on ? 'scale(1.08) rotate(-6deg)' : 'none', transition: `transform .35s ${PL_SPRING}, box-shadow .2s` }}>{x.emoji}</div>
              <span style={{ fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 13, color: PL_INK, textAlign: 'center', lineHeight: 1.1 }}>{x.label}</span>
            </div>
          );
        })}
      </div>
      <div key={g.label} style={{ margin: '14px 16px 0', borderRadius: 26, background: g.bg, display: 'grid', gridTemplateColumns: '1fr 120px',
        overflow: 'hidden', minHeight: 150, animation: `plPop .45s ${PL_SPRING} both` }}>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
          <span style={{ fontFamily: PL_HAND, fontWeight: 700, fontSize: 20, color: PL_CORAL }}>we’d go for…</span>
          <span style={{ fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 21, lineHeight: 1.1, color: PL_INK }}>{g.idea}</span>
          <span style={{ fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 15, color: PL_TEAL }}>Show me →</span>
        </div>
        <div style={{ position: 'relative', margin: '16px 16px 16px 0', transform: 'rotate(4deg)' }}>
          <div style={{ position: 'absolute', inset: 0, background: '#fff', padding: 6, borderRadius: 6, boxShadow: '0 10px 20px -10px rgba(0,0,0,.35)' }}>
            <img src={`${PL_A}/${g.img}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 3, display: 'block' }} />
          </div>
        </div>
      </div>
    </PlSection>
  );
}

function PlAsk() {
  return (
    <HnReveal>
      <div style={{ margin: '38px 16px 0', display: 'flex', alignItems: 'flex-end', gap: 10 }}>
        <div style={{ width: 46, height: 46, borderRadius: 23, background: PL_SUN, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, flexShrink: 0, animation: 'plBob 3s ease-in-out infinite' }}>✨</div>
        <div style={{ flex: 1, position: 'relative', background: '#fff', borderRadius: '22px 22px 22px 6px', padding: '14px 16px',
          boxShadow: '0 10px 24px -14px rgba(0,0,0,.35), inset 0 0 0 2px rgba(22,50,58,.08)' }}>
          <div style={{ fontFamily: PL_DISPLAY, fontWeight: 700, fontSize: 17, color: PL_INK }}>Not sure where to start?</div>
          <div style={{ fontFamily: PL_SANS, fontSize: 14, color: 'rgba(22,50,58,.65)', marginTop: 2 }}>Tell us the occasion, we’ll do the rest.</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['A birthday 🎂', 'Our holiday ✈️', 'Grandma 💌'].map(t => (
              <span key={t} style={{ padding: '6px 10px', borderRadius: 14, background: '#F4F1FF', fontFamily: PL_SANS, fontSize: 13, color: PL_INK }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </HnReveal>
  );
}

function HomePlayfulScreen() {
  const { useState } = React;
  const [calm] = useState(() => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [activeTab, setActiveTab] = useState('home');
  const [solid, setSolid] = useState(false);
  const onScroll = e => { const s = e.currentTarget.scrollTop > 60; if (s !== solid) setSolid(s); };
  return (
    <div data-pl-calm={calm ? '' : undefined} style={{ width: '100%', height: '100%', background: '#FFFBF5', position: 'relative', overflow: 'hidden' }}>
      <style>{PL_CSS}</style>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        background: solid ? 'rgba(255,251,245,.85)' : 'transparent', backdropFilter: solid ? 'blur(20px) saturate(170%)' : 'none',
        WebkitBackdropFilter: solid ? 'blur(20px) saturate(170%)' : 'none', boxShadow: solid ? '0 1px 0 rgba(0,0,0,.05)' : 'none',
        transition: 'background .3s, box-shadow .3s' }}>
        <IOSStatusBar dark={false} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 10px' }}>
          <HnWordmark color={PL_TEAL} />
          <div style={{ display: 'flex', gap: 8 }}>
            {['search', 'bell'].map(i => (
              <button key={i} aria-label={i} {...press(0.9)} style={{ width: 40, height: 40, borderRadius: 20, border: 'none', background: '#fff',
                color: PL_INK, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: '0 4px 10px -4px rgba(0,0,0,.2)', transition: 'transform 140ms ease' }}><HnIcon name={i} /></button>
            ))}
          </div>
        </div>
      </div>

      <div onScroll={onScroll} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none' }}>
        <PlHero />
        <PlProducts />
        <PlVibes />
        <PlCollections />
        <PlTicker />
        <PlGiftFinder />
        <PlAsk />
        <div style={{ padding: '16px 24px 0', fontFamily: PL_SANS, fontSize: 11, color: '#999' }}>Discount applied automatically at checkout.</div>
        <div style={{ height: `calc(30px + ${TAB_BAR_HEIGHT})` }} />
      </div>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
