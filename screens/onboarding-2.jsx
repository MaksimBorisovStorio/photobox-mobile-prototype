// screens/onboarding-2.jsx — Figma "2ND SCREEN", node 683:3395 (section 683:3565).
// Photo-access prompt. The illustration is three album covers — a sharp one in front
// and two blurred ones behind it — with two pills on the front cover.
//
// The design is a single frozen composition; the brief is that it should read as
// generated content and imply there is much more of it. So the composition is a ring
// of covers that keeps turning: the front cover steps back to the left, the one waiting
// on the right comes forward, the one that was on the left leaves and a fresh one joins
// behind. The pills drop out while the covers move and pop back in with the new cover's
// own place and photo count.
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
  const dur = 820;
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

// One lap of the loop. Everything is timed from the moment the pills start leaving.
const OB2_HOLD = 3300;      // ms a cover sits in front with its pills showing
const OB2_PILLS_OUT = 280;  // pills are gone before the covers start moving
const OB2_PILLS_BACK = 900; // …and come back once the new cover has settled

function AlbumStack() {
  const { useState, useEffect } = React;
  const n = OB2_COVERS.length;
  const [front, setFront] = useState(0);
  const [pills, setPills] = useState(false);

  useEffect(() => {
    if (obReducedMotion()) { setPills(true); return undefined; }
    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const lap = (t0) => {
      at(t0, () => setPills(false));
      at(t0 + OB2_PILLS_OUT, () => setFront(f => (f + 1) % n));
      at(t0 + OB2_PILLS_BACK, () => setPills(true));
      at(t0 + OB2_HOLD, () => lap(0));
    };
    at(800, () => setPills(true));            // first pills pop in with the screen
    at(800 + OB2_HOLD, () => lap(0));
    return () => timers.forEach(clearTimeout);
  }, []);

  const cover = OB2_COVERS[front];
  return (
    <>
      {OB2_COVERS.map((c, i) => <AlbumCover key={c.id} cover={c} slot={ob2SlotFor(i, front, n)} />)}
      {/* Node 683:3406: left 77.55, y 347.84→187.84 in the art box. 683:3409: ends at
          x=372.3 (57.7 from the 430 frame's right edge), y 0. */}
      <CoverPill
        icon="../shared/assets/pb2-icon-trips.svg" label={cover.place} rot={-2.66}
        style={{ left: 77.55, top: 187.84 }} shown={pills} delay={0}
      />
      <CoverPill
        icon="../shared/assets/pb2-icon-photos.svg" label={`${cover.count} photos`} rot={2.02}
        style={{ right: 57.7, top: 0 }} shown={pills} delay={120}
      />
    </>
  );
}

function OnboardingScreen() {
  const next = () => window.navigation.push('onboarding-3.html');
  return (
    <OnboardingPrompt
      // The node sets two paragraphs, so the break is the design's own.
      title={<>Photos they'll actually<br />keep forever</>}
      // Node art spans y 160→457 (297 tall); the free area is 44→597, whose centre
      // is 12px lower than the art's — hence the bias.
      // Ink spans x 55→382 (327) and the pills reach the top and bottom of the 297.
      artHeight={297} artBias={-12} artWidth={360} artFit={297}
      primaryLabel="Allow Photo access" onPrimary={next}
      onSkip={next}
    >
      <AlbumStack />
    </OnboardingPrompt>
  );
}
