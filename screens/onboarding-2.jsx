// screens/onboarding-2.jsx — Figma "2ND SCREEN", node 683:3395 (section 683:3565), plus the
// two extra scenes in section 727:2469 (products 727:2429, monthly recap 727:2389).
// Photo-access prompt. The illustration is a short loop of three scenes that say what the
// user's photos can become:
//   1. products     — a photo book, prints and a mug (node 727:2429)
//   2. collections  — "Smart Stories" album covers: a sharp one in front, two blurred behind
//                     it, with two pills on the front cover (node 683:3395)
//   3. monthly recap — a calendar page with photos stuck on its days (node 727:2389)
// Scenes cross-fade quickly and each one's pieces pop in on a stagger. Inside the collections
// scene the ring of covers turns once, so two covers are shown per visit: the front cover
// steps back to the left, the one waiting on the right comes forward, the one that was on the
// left leaves and a fresh one joins behind. The pills drop out while the covers move and pop
// back in with the new cover's own place and photo count.
//
// ⚠️ Cover photos are placeholders from the files the repo already carries — the final
// set is on its way. Swap `photo`, `place` and `count` in OB2_COVERS and nothing else
// needs to change; every cover is cover-fitted, so any aspect works.

const OB2_COVERS = [
  { id: 'florence',   photo: '../shared/assets/pb2-cover-florence.jpg',     place: 'Florence, Italy',    count: 234 },
  { id: 'canada',     photo: '../shared/assets/pb-src-canada.jpg',          place: 'Banff, Canada',      count: 128 },
  { id: 'guadalupe',  photo: '../shared/assets/pb-src-guadalupe.jpg',       place: 'Guadalupe, Spain',   count: 142 },
  { id: 'cappadocia', photo: '../shared/assets/pb-src-cappadocia.jpg',      place: 'Cappadocia, Türkiye', count: 86 },
  { id: 'italy',      photo: '../shared/assets/pb-src-italy.jpg',           place: 'Hiking in Sardinia', count: 61 },
  { id: 'etna',       photo: '../shared/assets/pb-src-etna.jpg',            place: 'Mount Etna, Sicily', count: 47 },
];

// The three resting places, from the node's own numbers. The art box starts at the
// node's y=160, so every y below is the node's minus 160; x is the 430 frame's.
//   centre = the rotation bounding box's centre, box = the tile before rotation.
// All three boxes share one aspect (0.8227), which is why the covers can grow and
// shrink between slots without the photo re-cropping mid-flight.
const OB2_SLOTS = {
  back:  { cx: 124.66, cy:  87.80, w: 136.383, h: 165.781, rot: -1.02, blur: 2, z: 1, op: 1,  scale: 1 },
  front: { cx: 214.70, cy: 141.00, w: 205.669, h: 250,     rot: -2.01, blur: 0, z: 3, op: 1,  scale: 1 },
  next:  { cx: 320.28, cy: 224.00, w: 110.841, h: 134.733, rot:  6.24, blur: 2, z: 2, op: 1,  scale: 1 },
  // leaving: drifts further left and dissolves.
  leave: { cx:  96.00, cy:  87.80, w: 136.383, h: 165.781, rot: -4,    blur: 6, z: 0, op: 0,  scale: 0.86 },
  // waiting: parked in the "next" place, invisible, until its turn to come in.
  wait:  { cx: 336.00, cy: 232.00, w: 110.841, h: 134.733, rot:  8,    blur: 6, z: 0, op: 0,  scale: 0.8 },
};

// Which slot does cover `i` occupy when cover `f` is in front? `r` runs −2…N−3: −2
// has just left, −1 is behind-left, 0 front, 1 next, and everything else waits.
function ob2SlotFor(i, f, n) {
  const r = ((i - f + 2 + n * 4) % n) - 2;
  return r === -2 ? 'leave' : r === -1 ? 'back' : r === 0 ? 'front' : r === 1 ? 'next' : 'wait';
}

const OB2_EASE = 'cubic-bezier(0.32, 0.72, 0.24, 1)';

function AlbumCover({ cover, slot }) {
  const s = OB2_SLOTS[slot];
  const moving = slot !== 'wait';          // a parked cover jumps, it never travels
  const dur = 520;
  return (
    <div style={{
      position: 'absolute', left: 0, top: 0, zIndex: s.z,
      width: s.w, height: s.h, boxSizing: 'border-box',
      transform: `translate(${s.cx - s.w / 2}px, ${s.cy - s.h / 2}px) rotate(${s.rot}deg) scale(${s.scale})`,
      opacity: s.op, filter: s.blur ? `blur(${s.blur}px)` : 'none',
      // 2px ring inside the bounds (Figma's inside stroke): border-box + overflow:hidden
      // clips the photo to the inner r22 for free.
      border: '2px solid var(--functional-colours-grey-50, #F4F4F4)',
      borderRadius: 24, overflow: 'hidden', background: '#F4F4F4',
      transition: moving
        ? `transform ${dur}ms ${OB2_EASE}, width ${dur}ms ${OB2_EASE}, height ${dur}ms ${OB2_EASE}, opacity ${dur * 0.75}ms ease, filter ${dur}ms ease`
        : 'none',
      willChange: 'transform, opacity',
    }}>
      <img src={cover.photo} alt="" draggable={false} style={{
        width: '100%', height: '100%', objectFit: 'cover', display: 'block',
      }} />
    </div>
  );
}

// Node 683:3406 / 683:3409: 24px icon + SF Pro Text Semibold 13/18 −0.08 in a 90% white
// r16 pill with a 1px white rim. Their widths follow their text, so each pill is pinned
// by the edge it sits on in the node — the location pill by its left edge, the count
// pill by its right — and grows from there.
function CoverPill({ icon, label, rot, style, shown, delay }) {
  return (
    <div style={{
      position: 'absolute', zIndex: 4, ...style,
      transform: `rotate(${rot}deg) scale(${shown ? 1 : 0.7})`,
      transformOrigin: 'center',
      opacity: shown ? 1 : 0,
      transition: shown
        ? `transform 520ms cubic-bezier(0.34, 1.4, 0.64, 1) ${delay}ms, opacity 240ms ease ${delay}ms`
        : 'transform 200ms ease, opacity 160ms ease',
      display: 'flex', alignItems: 'center', gap: 4, padding: 8,
      boxSizing: 'border-box', borderRadius: 16, whiteSpace: 'nowrap',
      background: 'rgba(255,255,255,0.9)', border: '1px solid #FFFFFF',
    }}>
      <img src={icon} alt="" style={{ width: 24, height: 24, display: 'block', flex: 'none' }} />
      <span style={{
        fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, lineHeight: '18px',
        letterSpacing: '-0.08px', color: 'var(--colour-foreground-fg-black, #333333)',
      }}>{label}</span>
    </div>
  );
}

// ---- scene plumbing ---------------------------------------------------------------
// Art coordinates: x is the 430 frame's, y is the node's minus 160 (the art box's top).

// A scene cross-fades and settles in/out quickly; its pieces are `Pop`s.
const OB2_SCENE_IN = 300;   // ms
const OB2_SCENE_OUT = 220;

function Scene({ active, children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      opacity: active ? 1 : 0,
      transform: active ? 'scale(1)' : 'scale(0.95)',
      transition: active
        ? `opacity ${OB2_SCENE_IN}ms ease, transform ${OB2_SCENE_IN + 100}ms ${OB2_EASE}`
        : `opacity ${OB2_SCENE_OUT}ms ease, transform ${OB2_SCENE_OUT}ms ease`,
      willChange: 'transform, opacity',
    }}>{children}</div>
  );
}

// One piece of a scene. It springs up from slightly small and low when its scene arrives,
// staggered by `delay`. Leaving, it holds its pose until the scene has faded and only then
// resets (a 0s transition with a delay), so nothing visibly snaps back mid fade.
// `cx`/`cy` is the piece's centre — the point it scales about.
function Pop({ shown, delay = 0, cx, cy, dx = 0, dy = 16, from = 0.82, children }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, transformOrigin: `${cx}px ${cy}px`,
      transform: shown ? 'none' : `translate(${dx}px, ${dy}px) scale(${from})`,
      opacity: shown ? 1 : 0,
      transition: shown
        ? `transform 420ms cubic-bezier(0.34, 1.35, 0.64, 1) ${delay}ms, opacity 200ms ease ${delay}ms`
        : `transform 0s linear ${OB2_SCENE_OUT + 40}ms, opacity 0s linear ${OB2_SCENE_OUT + 40}ms`,
    }}>{children}</div>
  );
}

// ---- scene 1: products (727:2429) ---------------------------------------------------
// Book: left 76 / top 120 → art y −40, 247×251, the image at 131.26% tall and −9.64% up.
// Mug (727:6745) and prints (727:6746) are rotated, so they are placed by centre:
//   mug    centre (303.8, 222.8), 208² tile at +10.91°
//   prints centre (119.17, 269.38), 141.668×135.325 tile at −6.62°
function ProductsScene({ active }) {
  return (
    <Scene active={active}>
      <Pop shown={active} delay={0} cx={199} cy={85} dy={20}>
        <div style={{ position: 'absolute', left: 76, top: -40, width: 247, height: 251, overflow: 'hidden' }}>
          <img src="../shared/assets/pb2-prod-book.png" alt="" draggable={false} style={{
            position: 'absolute', left: 0, top: '-9.64%', width: '100%', height: '131.26%', maxWidth: 'none',
          }} />
        </div>
      </Pop>
      <Pop shown={active} delay={110} cx={303.8} cy={222.8} dx={24} dy={10}>
        <img src="../shared/assets/pb2-prod-mug.png" alt="" draggable={false} style={{
          position: 'absolute', left: 303.8 - 104, top: 222.8 - 104, width: 208, height: 208,
          objectFit: 'cover', transform: 'rotate(10.91deg)',
        }} />
      </Pop>
      <Pop shown={active} delay={200} cx={119.17} cy={269.38} dx={-24} dy={10}>
        <div style={{
          position: 'absolute', left: 119.17 - 70.834, top: 269.38 - 67.6625, width: 141.668, height: 135.325,
          overflow: 'hidden', transform: 'rotate(-6.62deg)',
        }}>
          <img src="../shared/assets/pb2-prod-prints.png" alt="" draggable={false} style={{
            position: 'absolute', left: 0, top: '-28.22%', width: '123.11%', height: '128.22%', maxWidth: 'none',
          }} />
        </div>
      </Pop>
    </Scene>
  );
}

// ---- scene 3: monthly recap (727:2389) ----------------------------------------------
// The card (727:2525) is 267.5×336.63 at x 84.61, y 140.42 → art −19.58; its white fill and
// the punched hole are Figma's own "Subtract" export. Its shadow is a drop-shadow filter so
// it follows that shape, hole included.
const OB2_CARD = { left: 84.61, top: -19.58, w: 267.5, h: 336.63 };
// [label, centre-x, top] inside the card, as authored — the node's grid drifts a few px.
const OB2_DAYS = [
  ['1', 32.16, 99.49], ['8', 30.96, 148.18], ['15', 28.25, 196.87], ['22', 27.65, 245.56], ['29', 27.35, 294.25],
  ['2', 66.72, 99.49], ['9', 66.73, 148.18], ['16', 63.72, 196.87], ['23', 63.12, 245.56], ['30', 62.82, 294.25],
  ['3', 102.19, 99.49], ['10', 99.49, 148.18], ['17', 99.79, 196.87], ['24', 98.59, 245.56], ['31', 99.49, 294.25],
  ['4', 137.66, 99.49], ['11', 135.85, 148.18], ['18', 134.65, 196.87], ['25', 134.05, 245.56],
  ['5', 173.12, 99.48], ['12', 170.42, 148.18], ['19', 170.12, 196.87], ['26', 169.22, 245.56],
  ['6', 208.29, 99.49, 1], ['13', 205.59, 148.18, 1], ['20', 204.68, 196.87, 1], ['27', 205.28, 245.56, 1],
  ['7', 244.36, 99.48, 1], ['14', 241.05, 148.18, 1], ['21', 241.35, 196.87, 1], ['28', 240.15, 245.56, 1],
];
// Photos stuck on the calendar. Each is the node's rotation bounding box (left, top → art y,
// w, h) holding a tile (tw × th, border-box with a 0.9px white rim) turned about its centre.
// The photo is cover-fitted: the node's own bitmaps are the uncropped originals.
const OB2_STICKERS = [
  { id: 1716, l: 71,     t: 223.93, w: 59.71,  h: 59.71,  tw: 57.764, th: 57.764, rot: -1.96 },
  { id: 1720, l: 106.44, t: 275.29, w: 64.866, h: 45.758, tw: 63.408, th: 43.61,  rot: -1.96 },
  { id: 1721, l: 255.63, t: 272.93, w: 48.431, h: 50.366, tw: 43.737, th: 45.92,  rot: 6.19 },
  { id: 1722, l: 73.06,  t: 328.47, w: 50.384, h: 52.467, tw: 46.154, th: 48.458, rot: -5.24 },
  { id: 1724, l: 120.25, t: 419.64, w: 51.096, h: 53.209, tw: 46.806, th: 49.142, rot: -5.24 },
  { id: 1723, l: 186.49, t: 315.03, w: 64.902, h: 68.022, tw: 63.688, th: 66.867, rot: 1.05 },
  { id: 1725, l: 274.24, t: 356.53, w: 46.889, h: 45.708, tw: 36.061, th: 37.861, rot: 107.34, sq: 1 },
  { id: 1726, l: 263.49, t: 391.43, w: 46.889, h: 45.708, tw: 36.061, th: 37.861, rot: 107.34, sq: 1 },
  { id: 1727, l: 252.74, t: 426.32, w: 46.889, h: 45.708, tw: 36.061, th: 37.861, rot: 107.34, sq: 1 },
  { id: 1717, l: 187.78, t: 210.83, w: 43.378, h: 43.378, tw: 38.233, th: 38.233, rot: -8.35 },
  { id: 1718, l: 227.4,  t: 209.26, w: 40.707, h: 40.707, tw: 38.233, th: 38.233, rot: 3.84 },
  { id: 1719, l: 208.12, t: 238.18, w: 38.403, h: 38.403, tw: 38.233, th: 38.233, rot: 0.26 },
  { id: 1728, l: 299.86, t: 217.73, w: 58.213, h: 70.77,  tw: 49.052, th: 64.063, rot: 8.74 },
];

function RecapScene({ active }) {
  const c = OB2_CARD;
  const text = { position: 'absolute', whiteSpace: 'nowrap', color: '#000' };
  return (
    <Scene active={active}>
      <Pop shown={active} delay={0} cx={c.left + c.w / 2} cy={c.top + c.h / 2} dy={22} from={0.9}>
        <div style={{ position: 'absolute', left: c.left, top: c.top, width: c.w, height: c.h }}>
          <img src="../shared/assets/pb2-cal-card.svg" alt="" draggable={false} style={{
            position: 'absolute', inset: 0, width: c.w, height: c.h,
            filter: 'drop-shadow(0px 9.618px 8.1px rgba(0,0,0,0.25))',
          }} />
          <span style={{
            ...text, left: 44.59, top: 24.27, transform: 'translateX(-50%)',
            fontFamily: OB_HEAD, fontWeight: 600, fontSize: 28, lineHeight: '36px',
            letterSpacing: '-1.1857px', color: 'var(--pb-ink)', fontVariationSettings: OB_HEAD_VARIATION,
          }}>May</span>
          <span style={{
            ...text, left: 196.69, top: 24.27, fontFamily: 'var(--font)', fontWeight: 300,
            fontSize: 24.045, lineHeight: '36.067px',
          }}>2026</span>
          {OB2_DAYS.map(([d, x, y, red]) => (
            <span key={d} style={{
              ...text, left: x, top: y, width: 24.045, textAlign: 'center', transform: 'translateX(-50%)',
              fontFamily: 'var(--font)', fontSize: 12.022, lineHeight: '24.045px',
              color: red ? '#9D3E3E' : '#000',
            }}>{d}</span>
          ))}
        </div>
      </Pop>
      {OB2_STICKERS.map((s, i) => {
        const cx = s.l + s.w / 2, cy = s.t - 160 + s.h / 2;
        return (
          <Pop key={s.id} shown={active} delay={220 + i * 40} cx={cx} cy={cy} dy={0} from={0.5}>
            <div style={{
              position: 'absolute', left: cx - s.tw / 2, top: cy - s.th / 2, width: s.tw, height: s.th,
              boxSizing: 'border-box', border: '0.902px solid #FFF', borderRadius: s.sq ? 0 : 2.404,
              boxShadow: '0px -3.306px 17.162px -5.711px rgba(0,0,0,0.55)',
              transform: `rotate(${s.rot}deg)`, overflow: 'hidden', background: '#FFF',
            }}>
              <img src={`../shared/assets/pb2-cal-${s.id}.jpg`} alt="" draggable={false} style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              }} />
            </div>
          </Pop>
        );
      })}
    </Scene>
  );
}

// ---- scene 2: collections (683:3395) --------------------------------------------------
function CollectionsScene({ active, front, pills }) {
  const n = OB2_COVERS.length;
  const cover = OB2_COVERS[front];
  return (
    <Scene active={active}>
      {OB2_COVERS.map((c, i) => <AlbumCover key={c.id} cover={c} slot={ob2SlotFor(i, front, n)} />)}
      {/* Node 683:3406: left 77.55, y 347.84→187.84 in the art box. 683:3409: ends at
          x=372.3 (57.7 from the 430 frame's right edge), y 0. */}
      <CoverPill
        icon="../shared/assets/pb2-icon-trips.svg" label={cover.place} rot={-2.66}
        style={{ left: 77.55, top: 187.84 }} shown={active && pills} delay={0}
      />
      <CoverPill
        icon="../shared/assets/pb2-icon-photos.svg" label={`${cover.count} photos`} rot={2.02}
        style={{ right: 57.7, top: 0 }} shown={active && pills} delay={90}
      />
    </Scene>
  );
}

// ---- the loop -------------------------------------------------------------------------
// One lap, in ms from the start of the lap. Covers turn once inside the collections visit
// (so two are shown), and once more while the scene is hidden so the next lap opens on new
// ones. Pills are out for the ring's move.
const OB2_T_COLLECTIONS = 2100;  // products hold
const OB2_T_TURN = 3700;         // collections: first cover held 1600
const OB2_T_RECAP = 5300;        // collections: second cover held 1600
const OB2_T_LAP = 7600;          // recap held 2300
const OB2_PILLS_OUT = 160;       // pills are gone before the covers start moving
const OB2_PILLS_BACK = 520;      // …and come back once the new cover has settled

function AlbumStack() {
  const { useState, useEffect } = React;
  const n = OB2_COVERS.length;
  const [scene, setScene] = useState('');   // nothing until the screen has landed
  const [front, setFront] = useState(0);
  const [pills, setPills] = useState(false);

  useEffect(() => {
    if (obReducedMotion()) { setPills(true); return undefined; }
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const turn = () => setFront(f => (f + 1) % n);
    const lap = () => {
      at(0, () => setScene('products'));
      at(OB2_T_COLLECTIONS, () => { setScene('collections'); setPills(true); });
      at(OB2_T_TURN, () => setPills(false));
      at(OB2_T_TURN + OB2_PILLS_OUT, turn);
      at(OB2_T_TURN + OB2_PILLS_BACK, () => setPills(true));
      at(OB2_T_RECAP, () => { setScene('recap'); });
      at(OB2_T_RECAP + 300, turn);          // hidden: the next lap opens on fresh covers
      at(OB2_T_LAP, lap);
    };
    at(500, lap);                           // the first scene arrives with the screen
    return () => timers.forEach(clearTimeout);
  }, []);

  // Reduced motion holds one composed frame: the collections, as the node draws them.
  if (obReducedMotion()) return <CollectionsScene active front={0} pills />;

  return (
    <>
      <ProductsScene active={scene === 'products'} />
      <CollectionsScene active={scene === 'collections'} front={front} pills={pills} />
      <RecapScene active={scene === 'recap'} />
    </>
  );
}

function OnboardingScreen() {
  const next = () => window.navigation.push('onboarding-3.html');
  return (
    <OnboardingPrompt
      // Copy replaces the node's "Photos they'll actually keep forever": the art now shows
      // what photos can become (products, collections, recaps), so the headline says so.
      title={<>Your photos can<br />become so much more</>}
      // Node art spans y 160→457 (297 tall); the free area is 44→597, whose centre
      // is 12px lower than the art's — hence the bias.
      // Ink spans x 55→382 (327) and the pills reach the top and bottom of the 297.
      artHeight={297} artBias={-12} artWidth={360} artFit={400}
      primaryLabel="Allow Photo access" onPrimary={next}
      onSkip={next}
    >
      <AlbumStack />
    </OnboardingPrompt>
  );
}
