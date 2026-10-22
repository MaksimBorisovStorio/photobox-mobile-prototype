// screens/book-preview.jsx — 3D flip-through preview, between the editor and "Your photo book".
//
// Not a Figma node: there is no design for this step yet, so it borrows the review
// page's light surface, nav bar and CTA so it sits naturally between the two.
//
// Built from CSS 3D transforms rather than WebGL — a book is a stack of flat leaves
// hinged on the spine, which is exactly what `rotateY` about a left edge gives, and it
// keeps the prototype dependency-free.
//
// What it reads (all written by the editor):
//   pb_book    — title, page count, page size in cm (sets the aspect ratio)
//   pb_placed  — what is on the pages: a photo URL, or an array of them, per page
//   pb_uploaded — fallback pool when nothing has been placed

const BP_A = '../shared/assets';
const BP_TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const BP_DISPLAY = '-apple-system, "SF Pro Display", system-ui, sans-serif';
const BP_TEACHERS = '"Teachers", -apple-system, system-ui, sans-serif';

// Used only when the editor has not been visited (direct link), so the preview is
// never an empty white book.
const BP_SAMPLES = ['pb-src-italy.jpg', 'pb-src-etna.jpg', 'pb-src-canada.jpg',
  'pb-src-cappadocia.jpg', 'pb-src-berlin.jpg', 'pb-src-guadalupe.jpg',
  'pb-src-places.jpg', 'pb-src-tim.jpg'].map(f => `${BP_A}/${f}`);

function bpRead(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}

// Mirrors the editor: a book that was auto-filled with more photos than pages keeps
// the spreads that were added.
// A shared link carries the book in its hash (#b=<json>), so whoever opens it sees the
// same photos without needing this device's sessionStorage.
function bpShared() {
  try {
    const m = /[#&]b=([^&]+)/.exec(location.hash);
    return m ? JSON.parse(decodeURIComponent(m[1])) : null;
  } catch (e) { return null; }
}

function bpBook() {
  const shared = bpShared();
  const book = Object.assign({ title: 'Large Portrait photo book', pages: 24, pageW: 21, pageH: 28 },
    shared ? shared.book : bpRead('pb_book', {}));
  const placed = shared ? shared.placed : bpRead('pb_placed', []);
  const added = Math.max(0, Math.ceil((placed.length - book.pages) / 2));
  const uploaded = shared ? [] : bpRead('pb_uploaded', []);
  const pool = placed.flat ? placed.flat().filter(Boolean) : [];
  const photos = pool.length ? pool : (uploaded.length ? uploaded : BP_SAMPLES);
  const sample = !pool.length && !uploaded.length;
  return { book, pages: book.pages + added * 2, placed, photos, sample, shared: !!shared };
}

// One page's photos. Sample/empty books cycle the pool so every page has something.
function bpPagePhotos(data, n) {
  const entry = data.placed[n - 1];
  if (Array.isArray(entry)) return entry.filter(Boolean).slice(0, 4);
  if (entry) return [entry];
  if (data.sample || !data.placed.length) return [data.photos[(n - 1) % data.photos.length]];
  return [];
}

const BP_GRIDS = {
  1: [[0, 0, 100, 100]],
  2: [[0, 0, 49, 100], [51, 0, 49, 100]],
  3: [[0, 0, 100, 60], [0, 62, 49, 38], [51, 62, 49, 38]],
  4: [[0, 0, 49, 49], [51, 0, 49, 49], [0, 51, 49, 49], [51, 51, 49, 49]],
};

// Binding. Only layflat is drawn for now: rigid, thick pages that open completely flat
// (no curl into the gutter, just a hairline seam), and hard covers that overhang the
// pages. A regular binding would add the gutter curl and a rounded spine.
const BP_BINDING = 'layflat';
const BP_BOARD = '#0b4a4b';   // cover board edges, spine and back cover
const BP_C = 3;               // cover board thickness, px

function BpPage({ photos, n, side, paper = '#FBFAF7' }) {
  const grid = BP_GRIDS[photos.length] || [];
  const pad = photos.length > 1 ? '7%' : 0;
  return (
    <div style={{ position: 'absolute', inset: 0, background: paper, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: pad }}>
        {grid.map((r, i) => (
          <img key={i} src={photos[i]} alt="" draggable={false} style={{
            position: 'absolute', left: r[0] + '%', top: r[1] + '%', width: r[2] + '%', height: r[3] + '%',
            objectFit: 'cover', display: 'block',
          }} />
        ))}
      </div>
    </div>
  );
}

// Spine-side shading: the paper darkens where it curls into the gutter.
function BpGutter({ side }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `linear-gradient(to ${side === 'right' ? 'right' : 'left'}, rgba(0,0,0,0.45) 0, rgba(0,0,0,0.12) 1.5px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0) 14px)`,
    }} />
  );
}

const BP_FACE = { position: 'absolute', inset: 0, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', overflow: 'hidden' };

function BpFace({ leaf, side, data, pages, w, h, flat }) {
  // `side` is which face of the leaf: 'front' shows on the right when closed.
  const half = pages / 2;
  const last = half + 1;
  let body;
  let gutter = side === 'front' ? 'right' : 'left';
  const style = Object.assign({}, BP_FACE, side === 'back' && !flat ? { transform: 'rotateY(180deg)' } : null);

  if (leaf === 0 && side === 'front') {
    body = (
      <div style={{ position: 'absolute', inset: 0, background: '#1f2a2a' }}>
        <img src={data.photos[0]} alt="" draggable={false}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, padding: `${h * 0.12}px ${w * 0.09}px ${h * 0.07}px`,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.55))',
        }}>
          <div style={{ fontFamily: BP_DISPLAY, fontWeight: 700, fontSize: Math.max(14, w * 0.085), color: '#fff', lineHeight: 1.15 }}>
            My photo book
          </div>
          <div style={{ fontFamily: BP_TEXT, fontSize: Math.max(9, w * 0.045), color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>
            {data.book.pageW} × {data.book.pageH} cm
          </div>
        </div>
        {/* hinge groove */}
        <div style={{ position: 'absolute', left: w * 0.035, top: 0, bottom: 0, width: 2, background: 'rgba(0,0,0,0.25)', boxShadow: '1px 0 0 rgba(255,255,255,0.25)' }} />
      </div>
    );
    gutter = null;
  } else if (leaf === last && side === 'back') {
    body = (
      <div style={{ position: 'absolute', inset: 0, background: BP_BOARD, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: h * 0.06 }}>
        <span style={{ fontFamily: BP_TEACHERS, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 }}>photobox</span>
      </div>
    );
    gutter = null;
  } else {
    // Inside covers are blank paper; leaf k carries pages 2k-1 (front) and 2k (back).
    const n = side === 'front' ? 2 * leaf - 1 : 2 * leaf;
    const inside = leaf === 0 || leaf === last;
    const photos = inside ? [] : bpPagePhotos(data, n);
    body = <BpPage photos={photos} n={inside ? null : n} side={side === 'front' ? 'right' : 'left'}
      paper={inside ? '#E4E1D8' : undefined} />;
  }
  return <div style={style}>{body}{gutter && <BpGutter side={gutter} />}</div>;
}

// ── Page block: the paper you see from the side when you orbit. Open faces only —
// the leaves cover its front, and the spine side is hidden by the other half.
function BpBlock({ x, w, h, d, edge, z0 = 0 }) {
  if (d <= 0) return null;
  const lines = (deg) => `repeating-linear-gradient(${deg}deg, #f3f1ea 0 1px, #d9d5cb 1px 2px)`;
  const face = { position: 'absolute', backfaceVisibility: 'visible' };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, transformStyle: 'preserve-3d',
      transition: 'opacity 300ms' }}>
      {/* fore-edge */}
      <div style={{ ...face, left: edge === 'right' ? x + w - d / 2 : x - d / 2, top: -h / 2,
        width: d, height: h, background: lines(90), transform: `translateZ(${z0 + d / 2}px) rotateY(90deg)` }} />
      {/* top and bottom */}
      <div style={{ ...face, left: x, top: -h / 2 - d / 2, width: w, height: d, background: lines(0),
        transform: `translateZ(${z0 + d / 2}px) rotateX(90deg)` }} />
      <div style={{ ...face, left: x, top: h / 2 - d / 2, width: w, height: d, background: lines(0),
        transform: `translateZ(${z0 + d / 2}px) rotateX(90deg)` }} />
    </div>
  );
}

// The three visible edges of a cover board (the fourth is the spine). It extends away from
// the leaf's art face: -z for the front cover, +z for the back cover, whose art is its back.
function BpBoardEdges({ w, h, dir }) {
  const c = BP_C;
  const strip = { position: 'absolute', background: BP_BOARD, backfaceVisibility: 'visible' };
  const z = `translateZ(${dir * c / 2}px)`;
  return (
    <>
      <div style={{ ...strip, left: 0, top: -c / 2, width: w, height: c, transform: `${z} rotateX(90deg)` }} />
      <div style={{ ...strip, left: 0, top: h - c / 2, width: w, height: c, transform: `${z} rotateX(90deg)` }} />
      <div style={{ ...strip, left: w - c / 2, top: 0, width: c, height: h, transform: `${z} rotateY(90deg)` }} />
    </>
  );
}

// ── The page being turned.
//
// A resting leaf is one rigid plane. While it is turning it is cut into vertical strips,
// each hinged to the one before and rotated a few degrees further than it, so the free
// edge trails behind the hinge and the sheet bows like paper (layflat pages are stiff,
// so the bow is small). It also lifts off the stack at the middle of the turn. Only the
// one leaf in motion pays for the strips; it drops back to a rigid plane when done.
const BP_STRIPS = 10;
const BP_TURN_MS = 900;

function BpSegLeaf({ i, dir, data, pages, w, h, s, leaves, onDone }) {
  const { useState, useEffect, useRef } = React;
  const [t, setT] = useState(0);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    let raf;
    const t0 = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - t0) / BP_TURN_MS);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(tick); else done.current();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const prog = dir > 0 ? e : 1 - e;                       // 0 = lying right, 1 = lying left
  const zU = (leaves - i) * s, zF = i * s;
  const z = zU + (zF - zU) * prog + Math.sin(Math.PI * e) * w * 0.1;
  const bend = dir * 6 * Math.sin(Math.PI * e);           // extra degrees per strip, trailing the motion
  const sw = w / BP_STRIPS;

  const strip = k => (
    <div key={k} style={{
      position: 'absolute', left: k === 0 ? 0 : sw - 0.5, top: 0, width: sw + 0.5, height: h,
      transformOrigin: 'left center', transformStyle: 'preserve-3d',
      transform: `rotateY(${k === 0 ? 0 : bend}deg)`,
    }}>
      <div style={{ ...BP_FACE, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: -k * sw, top: 0, width: w, height: h }}>
          <BpFace leaf={i} side="front" data={data} pages={pages} w={w} h={h} />
        </div>
      </div>
      <div style={{ ...BP_FACE, overflow: 'hidden', transform: 'rotateY(180deg)' }}>
        <div style={{ position: 'absolute', left: -(w - (k + 1) * sw), top: 0, width: w, height: h }}>
          <BpFace leaf={i} side="back" flat data={data} pages={pages} w={w} h={h} />
        </div>
      </div>
      {k < BP_STRIPS - 1 && strip(k + 1)}
    </div>
  );

  return (
    <div style={{
      position: 'absolute', left: 0, top: -h / 2, width: w, height: h,
      transformOrigin: 'left center', transformStyle: 'preserve-3d',
      transform: `translateZ(${z}px) rotateY(${-180 * prog}deg)`,
    }}>
      {strip(0)}
    </div>
  );
}

const BP_BG = '#1B1B1B';       // the editor's own surface
const BP_EASE = 'cubic-bezier(0.3,0.7,0.2,1)';
const DEFAULT_VIEW = { x: 14, y: -18, z: 1 };

function BookPreviewScreen() {
  const { useState, useRef, useEffect, useMemo } = React;
  const data = useMemo(bpBook, []);
  const pages = data.pages;
  const leaves = pages / 2 + 2;           // cover, pages/2 sheets, back cover
  const [flipped, setFlipped] = useState(0);
  const [view, setView] = useState(DEFAULT_VIEW);   // pitch, yaw, zoom
  const [easing, setEasing] = useState(false);       // only while resetting the view
  const [hint, setHint] = useState(true);
  const [anim, setAnim] = useState(null);           // the inner leaf currently turning
  const flippedRef = useRef(0);
  const [toast, setToast] = useState('');
  const stage = useRef(null);
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const vel = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const [box, setBox] = useState({ w: 360, h: 460 });

  useEffect(() => {
    const measure = () => stage.current && setBox({ w: stage.current.clientWidth, h: stage.current.clientHeight });
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const ratio = data.book.pageH / data.book.pageW;
  const w = Math.max(80, Math.min((box.w - 24) / 2, (box.h - 80) / ratio));
  const h = w * ratio;
  const s = 1.3;                           // z gap between leaves, px (layflat pages are thick)
  const ov = Math.max(4, w * 0.025);       // how far the hard covers overhang the pages

  flippedRef.current = flipped;
  const go = d => {
    setHint(false);
    const f = flippedRef.current;
    const n = Math.max(0, Math.min(leaves, f + d));
    if (n === f) return;
    flippedRef.current = n;
    setFlipped(n);
    const i = d > 0 ? f : f - 1;       // the leaf that moves
    setAnim(i >= 1 && i <= leaves - 2 ? { i, dir: d, key: Date.now() } : null);
  };
  const clampX = v => Math.max(-80, Math.min(80, v));

  const stopInertia = () => { cancelAnimationFrame(raf.current); raf.current = 0; };
  const startInertia = () => {
    stopInertia();
    const tick = () => {
      const v = vel.current;
      if (Math.abs(v.x) < 0.02 && Math.abs(v.y) < 0.02) { raf.current = 0; return; }
      setView(p => ({ ...p, x: clampX(p.x + v.x), y: p.y + v.y }));
      v.x *= 0.94; v.y *= 0.94;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => stopInertia, []);

  const zoomBy = f => setView(p => ({ ...p, z: Math.max(0.6, Math.min(2.2, p.z * f)) }));

  const onDown = e => {
    stopInertia();
    stage.current.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current = { sx: e.clientX, sy: e.clientY, t: Date.now(), moved: 0,
      dist: pointers.current.size === 2 ? bpDist(pointers.current) : 0 };
    vel.current = { x: 0, y: 0 };
  };
  const onMove = e => {
    const p = pointers.current.get(e.pointerId);
    if (!p || !gesture.current) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    gesture.current.moved += Math.abs(dx) + Math.abs(dy);
    if (pointers.current.size === 2) {                 // pinch
      const d = bpDist(pointers.current);
      if (gesture.current.dist) zoomBy(d / gesture.current.dist);
      gesture.current.dist = d;
      return;
    }
    if (gesture.current.moved > 6) setHint(false);
    vel.current = { x: -dy * 0.4, y: dx * 0.4 };
    setView(v => ({ ...v, x: clampX(v.x - dy * 0.4), y: v.y + dx * 0.4 }));
  };
  const onUp = e => {
    const g = gesture.current;
    pointers.current.delete(e.pointerId);
    if (!g) return;
    if (pointers.current.size) { gesture.current = { ...g, moved: 99 }; return; }
    gesture.current = null;
    if (g.moved < 8 && Date.now() - g.t < 350) {       // tap: turn a page
      // Only meaningful while the book is roughly facing you.
      const yaw = ((view.y % 360) + 540) % 360 - 180;
      if (Math.abs(yaw) < 70) {
        const r = stage.current.getBoundingClientRect();
        go(e.clientX > r.left + r.width / 2 ? 1 : -1);
      }
    } else startInertia();
  };
  const onWheel = e => zoomBy(e.deltaY < 0 ? 1.08 : 0.92);

  const resetView = () => {
    stopInertia();
    setFlipped(0);                       // back to the front cover
    flippedRef.current = 0;
    setAnim(null);
    setEasing(true);
    setView(p => ({ ...DEFAULT_VIEW, y: DEFAULT_VIEW.y + Math.round(p.y / 360) * 360 }));
    setTimeout(() => setEasing(false), 650);
  };
  const moved = flipped !== 0 || view.x !== DEFAULT_VIEW.x || view.y !== DEFAULT_VIEW.y || view.z !== 1;

  const shift = flipped === 0 ? -w / 2 : flipped === leaves ? w / 2 : 0;

  const caption = flipped === 0 ? 'Front cover'
    : flipped === leaves ? 'Back cover'
    : flipped === 1 ? 'Page 1'
    : flipped === leaves - 1 ? `Page ${pages}`
    : `Pages ${2 * flipped - 2}–${2 * flipped - 1}`;

  const showToast = m => { setToast(m); setTimeout(() => setToast(''), 2200); };
  const share = async () => {
    const payload = { book: { pages: data.book.pages, pageW: data.book.pageW, pageH: data.book.pageH },
      placed: data.placed };
    const url = location.href.split('#')[0] + '#b=' + encodeURIComponent(JSON.stringify(payload));
    try {
      if (navigator.share) { await navigator.share({ title: 'My photo book', text: 'Take a look at my photo book', url }); return; }
    } catch (e) { if (e && e.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(url); showToast('Link copied'); }
    catch (e) { window.prompt('Copy this link', url); }
  };

  const close = () => (data.shared ? window.navigation.replace('home.html') : window.navigation.push('editor-review.html'));

  const ease = easing ? `transform 600ms ${BP_EASE}` : 'none';

  return (
    <div style={{
      width: '100%', height: '100%', background: BP_BG,
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
    }}>
      <IOSStatusBar dark />

      {/* Header: close · title · share */}
      <div style={{ position: 'relative', height: 56, flexShrink: 0, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 16px' }}>
        <BpRound label="Close" onClick={close}>
          <img src={`${BP_A}/pb-editor-close.svg`} alt="" width={24} height={24} style={{ display: 'block' }} />
        </BpRound>
        <span style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none',
          fontFamily: BP_TEXT, fontSize: 17, fontWeight: 700, color: '#fff' }}>Preview</span>
        <BpRound label="Share" onClick={share}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15V3" /><path d="m7.5 7.5 4.5-4.5 4.5 4.5" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
          </svg>
        </BpRound>
      </div>

      {/* Stage */}
      <div ref={stage}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}
        onPointerCancel={onUp} onWheel={onWheel}
        style={{
          flex: 1, minHeight: 0, position: 'relative', touchAction: 'none', userSelect: 'none',
          WebkitUserSelect: 'none', cursor: 'grab', perspective: 1500,
          background: 'radial-gradient(ellipse at 50% 42%, #3a3d3d 0%, #1B1B1B 70%)',
        }}>
        {/* Orbit group: no transition while dragging; it is only eased on Reset. */}
        <div style={{
          position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, transformStyle: 'preserve-3d',
          transform: `scale(${view.z}) rotateX(${view.x}deg) rotateY(${view.y}deg)`, transition: ease,
        }}>
          {/* Slide group: centres the closed book, eased on every flip. */}
          <div style={{
            position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d',
            transform: `translateX(${shift}px)`, transition: `transform 700ms ${BP_EASE}`,
          }}>
            {/* Floor shadow */}
            <div style={{
              position: 'absolute', left: -w * 1.1, top: h / 2 + 18, width: w * 2.2, height: w * 1.2,
              marginTop: -w * 0.6, transform: `rotateX(90deg)`,
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55), rgba(0,0,0,0) 62%)',
              pointerEvents: 'none',
            }} />

            <BpBlock x={0} w={w} h={h} d={(leaves - flipped) * s - 2 * BP_C} z0={BP_C} edge="right" />
            <BpBlock x={-w} w={w} h={h} d={flipped * s - 2 * BP_C} z0={BP_C} edge="left" />

            {/* Spine: joins the two cover boards, so it only exists while the book is closed. */}
            {(() => {
              const zf = flipped > 0 ? 0 : leaves * s;                 // front cover's outer face
              const zb = flipped === leaves ? (leaves - 1) * s : s;    // back cover's outer face
              const len = Math.abs(zf - zb);
              const closed = flipped === 0 || flipped === leaves;
              return (
                <div style={{
                  position: 'absolute', left: -len / 2, top: -h / 2 - ov, width: len, height: h + 2 * ov,
                  transform: `translateZ(${(zf + zb) / 2}px) rotateY(${flipped === 0 ? -90 : 90}deg)`, background: BP_BOARD,
                  opacity: closed ? 1 : 0, transition: `opacity ${closed ? 200 : 60}ms ${closed ? 500 : 0}ms`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
                }}>
                  <span style={{ fontFamily: BP_TEACHERS, fontSize: Math.min(11, len * 0.7), fontWeight: 600,
                    color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', letterSpacing: 0.5,
                    transform: `rotate(${flipped === 0 ? 90 : -90}deg)` }}>My photo book</span>
                </div>
              );
            })()}

            {Array.from({ length: leaves }, (_, i) => {
              const isFlipped = i < flipped;
              const z = (isFlipped ? i : leaves - i) * s;
              const isCover = i === 0 || i === leaves - 1;
              if (anim && anim.i === i) {
                return <BpSegLeaf key={`turn${anim.key}`} i={i} dir={anim.dir} data={data} pages={pages}
                  w={w} h={h} s={s} leaves={leaves}
                  onDone={() => setAnim(a => (a && a.key === anim.key ? null : a))} />;
              }
              return (
                <div key={i} style={{
                  position: 'absolute', left: 0, top: isCover ? -h / 2 - ov : -h / 2,
                  width: isCover ? w + ov : w, height: isCover ? h + 2 * ov : h,
                  transformOrigin: 'left center', transformStyle: 'preserve-3d',
                  transform: `translateZ(${z}px) rotateY(${isFlipped ? -180 : 0}deg)`,
                  transition: `transform 700ms ${BP_EASE}`,
                  borderRadius: isCover ? '1px 4px 4px 1px' : 0,
                }}>
                  <BpFace leaf={i} side="front" data={data} pages={pages} w={isCover ? w + ov : w} h={isCover ? h + 2 * ov : h} />
                  <BpFace leaf={i} side="back" data={data} pages={pages} w={isCover ? w + ov : w} h={isCover ? h + 2 * ov : h} />
                  {isCover && <BpBoardEdges w={w + ov} h={h + 2 * ov} dir={i === 0 ? -1 : 1} />}
                </div>
              );
            })}
          </div>
        </div>

        {moved && (
          <button onClick={resetView} onPointerDown={e => e.stopPropagation()} aria-label="Reset view" style={{
            position: 'absolute', top: 12, right: 16, height: 32, padding: '0 12px', borderRadius: 16, border: 'none',
            background: 'rgba(255,255,255,0.12)', color: '#fff', fontFamily: BP_TEXT, fontSize: 13, cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}>Reset view</button>
        )}

        {hint && (
          <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.14)', color: '#fff',
            fontFamily: BP_TEXT, fontSize: 13, whiteSpace: 'nowrap', pointerEvents: 'none',
          }}>Drag to rotate · tap to turn pages</div>
        )}
      </div>

      {/* Page controls */}
      <div style={{ flexShrink: 0, padding: `14px 24px calc(24px + env(safe-area-inset-bottom, 0px))`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <BpArrow dir={-1} disabled={flipped === 0} onClick={() => go(-1)} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: BP_DISPLAY, fontSize: 17, fontWeight: 600, color: '#fff' }}>{caption}</div>
          <div style={{ fontFamily: BP_TEXT, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{pages} pages</div>
        </div>
        <BpArrow dir={1} disabled={flipped === leaves} onClick={() => go(1)} />
      </div>

      {toast && (
        <div style={{ position: 'absolute', left: '50%', bottom: 110, transform: 'translateX(-50%)',
          padding: '10px 16px', borderRadius: 999, background: '#fff', color: '#333',
          fontFamily: BP_TEXT, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', zIndex: 5 }}>{toast}</div>
      )}
    </div>
  );
}

function bpDist(map) {
  const [a, b] = [...map.values()];
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function BpRound({ label, onClick, children }) {
  return (
    <button onClick={onClick} aria-label={label}
      onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
      onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
      onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      style={{
        width: 40, height: 40, borderRadius: 20, border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent', zIndex: 2,
      }}>{children}</button>
  );
}

function BpArrow({ dir, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} aria-label={dir < 0 ? 'Previous' : 'Next'}
      style={{
        width: 44, height: 44, borderRadius: 22, border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(255,255,255,0.1)', cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        WebkitTapHighlightColor: 'transparent',
      }}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transform: dir < 0 ? 'none' : 'scaleX(-1)' }}>
        <path d="M12.5 4 6.5 10l6 6" />
      </svg>
    </button>
  );
}
