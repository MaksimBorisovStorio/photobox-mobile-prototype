// screens/onboarding-3.jsx — Figma "3RD SCREEN", node 683:3412 (section 683:3565).
// Notification prompt. A softly blurred iPhone with a lock-screen wallpaper, and a stack
// of notifications over it.
//
// The node freezes the stack at two cards. Here the stack is always full and keeps
// turning: three notifications, each in front for 3s. The front card lifts away, the two
// behind step forward, and the one that left rises into the back slot — so the loop never
// shows an empty phone and never visibly restarts.
//
// ⚠️ The phone is one 3× WebP of the node (683:3568) rather than the ~30-layer vector
// mockup rebuilt in code. Its bottom edge is a baked alpha fade, and the render comes
// out of Figma flattened on the page colour — safe here because that colour is the
// screen's own #F1F6F6 exactly (sampled: 241,246,246 at both corners and the bottom).

// Node 683:3568: 288.12×504 at (71, 136). The export carries a little blur bleed
// (865×1519 @3× = 288.33×506.33), so it is centred on the group rather than pinned.
// Art box origin is the node's y=136.
const OB3_PHONE = { w: 288.33, h: 506.33, cx: 215.06, cy: 252 };

// Node 683:3421 — the front card: 387.06×72.64 at (21, 318). Everything below is that
// card's own metrics; the slots behind it are the same card scaled and pushed down, so
// they carry the same content instead of a second set of numbers.
//   slot 1 matches the node's back card (683:3420): 328 wide at y=367 → 0.8475, +49.
const OB3_FRONT = { w: 387.06, h: 72.64, left: 21, top: 182 };

// The node's card is 387 wide on a 430 frame, which on a 390 phone touches both edges.
// Everything is drawn at the node's size and scaled by OB3_FIT, so the front card is a
// visual 350 wide — 20px of air each side at 390 — with all its proportions intact.
const OB3_FIT = 350 / 387.06;

// slot 'mid' matches the node's back card (683:3420): 328 wide at y=367 → 0.8475, +49.
// With only three cards the one that has just left the front is the next to take the
// back: `leave` lifts it away, `wait` parks it invisibly under the stack, and it then
// rises into `back`.
const OB3_SLOTS = {
  leave: { y: -46, s: 1.0,    op: 0,    fill: 'rgba(255,255,255,0.92)', z: 4, shadow: 0 },
  front: { y: 0,   s: 1,      op: 1,    fill: 'rgba(255,255,255,0.92)', z: 3, shadow: 0 },
  mid:   { y: 49,  s: 0.8475, op: 1,    fill: 'rgba(236,242,242,0.92)', z: 2, shadow: 1 },
  back:  { y: 72,  s: 0.72,   op: 0.55, fill: 'rgba(236,242,242,0.85)', z: 1, shadow: 1 },
  wait:  { y: 92,  s: 0.62,   op: 0,    fill: 'rgba(236,242,242,0.85)', z: 0, shadow: 1 },
};

// The headline notification is the node's own copy; the other two are what "delivery
// updates and special offers" would actually send.
const OB3_NOTIFS = [
  { id: 'out',   title: 'Your order is out for delivery!', body: 'Tap to track your delivery.',      ago: '5m ago' },
  { id: 'ready', title: 'Your photo book is ready',        body: "We've just finished printing it.", ago: '15m ago' },
  { id: 'offer', title: '20% off prints this weekend',     body: 'Tap to see your offer.',           ago: '1h ago' },
];

// Where does card `i` sit when card `f` is in front? Cards go front → mid → back; the
// back slot belongs to the card that has just left, and `stage` says how far through
// its trip round the stack that card is.
function ob3SlotFor(i, f, n, stage) {
  const r = (i - f + n) % n;
  if (r === 0) return 'front';
  if (r === 1) return 'mid';
  return stage === 'leaving' ? 'leave' : stage === 'waiting' ? 'wait' : 'back';
}

const OB3_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

function Notification({ n, slot }) {
  const s = OB3_SLOTS[slot];
  return (
    <div style={{
      position: 'absolute', left: OB3_FRONT.left, top: OB3_FRONT.top,
      width: OB3_FRONT.w, height: OB3_FRONT.h, zIndex: s.z, boxSizing: 'border-box',
      transformOrigin: '50% 0',
      transform: `translateY(${s.y * OB3_FIT}px) scale(${s.s * OB3_FIT})`, opacity: s.op,
      // a parked card jumps into place unseen; every other change travels
      transition: slot === 'wait'
        ? 'none'
        : `transform 1000ms ${OB3_EASE}, opacity 700ms ease, background-color 700ms ease, filter 700ms ease`,
      display: 'flex', alignItems: 'center', gap: 10.216, padding: 13.621,
      borderRadius: 22, border: '1.135px solid #FFFFFF',
      // The node layers white on `mix-blend-mode: luminosity`, which WebKit cannot blend
      // across a composited layer boundary (see CLAUDE.md). A translucent white over a
      // real backdrop blur lands on the same frosted card — and is what an iOS
      // notification is.
      background: s.fill,
      backdropFilter: 'blur(18px) saturate(120%)',
      WebkitBackdropFilter: 'blur(18px) saturate(120%)',
      // the cards behind carry the node's `drop-shadow(0 4px 8px #c4cdcd)`
      filter: s.shadow ? 'drop-shadow(0px 4px 8px #C4CDCD)' : 'none',
    }}>
      {/* The node's front card has a bare green square where its icon goes (unfinished
          — its sibling carries the app icon), so every card gets the app icon. */}
      <img src="../shared/assets/pb2-notif-icon.png" alt="" draggable={false} style={{
        width: 43.133, height: 43.133, borderRadius: 8, opacity: 0.8,
        display: 'block', flex: 'none',
      }} />
      <div style={{
        flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.27,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          whiteSpace: 'nowrap',
        }}>
          {/* Figma sets Open Sans here at a nominal 19.33px, but its render measures
              232px for the headline and 195px for the body — SF Pro lands on the same
              widths at 16.7px (268 / 228 at 19.33), so that is the size used. Open Sans
              is not among the faces this project self-hosts, and an iOS notification is
              SF Pro anyway. */}
          <span style={{
            minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis',
            fontFamily: 'var(--font)', fontWeight: 600, fontSize: 16.7, lineHeight: '25.768px',
            letterSpacing: '-0.2724px', color: '#000000',
          }}>{n.title}</span>
          <span style={{
            flex: 'none', fontFamily: 'var(--font)', fontWeight: 400, fontSize: 13.62,
            lineHeight: '20.431px', letterSpacing: '-0.408px', color: '#565656',
          }}>{n.ago}</span>
        </div>
        <span style={{
          fontFamily: 'var(--font)', fontWeight: 400, fontSize: 16.7, lineHeight: '23.191px',
          letterSpacing: '-0.2724px', color: '#000000',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{n.body}</span>
      </div>
    </div>
  );
}

const OB3_HOLD = 3000;    // ms each card stays in front
const OB3_LEAVE = 900;    // ms for the front card to lift away before it is parked
const OB3_PARKED = 100;   // ms it sits invisibly under the stack before rising into the back

function NotificationStack() {
  const { useState, useEffect } = React;
  const n = OB3_NOTIFS.length;
  const [front, setFront] = useState(0);
  const [stage, setStage] = useState('done');   // 'leaving' → 'waiting' → 'done'

  useEffect(() => {
    if (obReducedMotion()) return undefined;
    const timers = [];
    const lap = () => {
      setFront(f => (f + 1) % n);
      setStage('leaving');
      timers.push(setTimeout(() => setStage('waiting'), OB3_LEAVE));
      timers.push(setTimeout(() => setStage('done'), OB3_LEAVE + OB3_PARKED));
    };
    const t = setInterval(lap, OB3_HOLD);
    return () => { clearInterval(t); timers.forEach(clearTimeout); };
  }, []);

  return (
    <>
      {OB3_NOTIFS.map((c, i) => <Notification key={c.id} n={c} slot={ob3SlotFor(i, front, n, stage)} />)}
    </>
  );
}

function OnboardingScreen() {
  // Notifications are a real permission on a phone; in the prototype both answers just
  // move on to the app.
  const done = () => window.navigation.replace('home.html');
  return (
    <OnboardingPrompt
      title="Get delivery updates and not only"
      // Node art spans y 136→640 (504 tall). The free area (44→597) is centred 67.5px
      // above that, so the box is pushed down by as much; the phone's own fade-out
      // finishes before it would reach the headline.
      // The front card is a visual 350 wide, kept 20px off each side; the phone's fade is gone by y≈404 of the 504, so
      // only that much has to clear the headline.
      artHeight={504} artBias={67.5} artWidth={390} artFit={440}
      primaryLabel="Allow notification" onPrimary={done}
      onSkip={done}
    >
      <img
        src="../shared/assets/pb2-phone.webp" alt="" draggable={false}
        style={{
          position: 'absolute', display: 'block',
          left: OB3_PHONE.cx - OB3_PHONE.w / 2, top: OB3_PHONE.cy - OB3_PHONE.h / 2,
          width: OB3_PHONE.w, height: OB3_PHONE.h,
        }}
      />
      <NotificationStack />
    </OnboardingPrompt>
  );
}
