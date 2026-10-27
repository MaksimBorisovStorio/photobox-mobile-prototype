// screens/account-rewards.jsx
//
// The playful half of the account page's "Your rewards" section — NOT in Figma, built
// from stakeholder feedback (loyalty, gamification, year recap, "delighter").
// Loaded by account.html before account.jsx. Everything here is prefixed RW_/Rw so the
// top-level names cannot collide with other classic scripts (the PB_DISPLAY trap).
//
// The points model (mock, for the demo):
//   earn  — 10 pts per €1 spent, plus fixed bonuses for challenges and quests
//   spend — every 500 pts is €5 off any order
//   levels — lifetime points, never spent down: Snapshot 0 → Storyteller 1,000 →
//            Legend 2,200 → Icon 5,000. Each level unlocks a perk.

const RW_GREEN = '#007F70';
const RW_RIM = '#00A389';
const RW_INK = '#023C42';
const RW_HEAD = '"Bricolage Grotesque", "DM Sans", -apple-system, system-ui, sans-serif';
const RW_UI = '"Rethink Sans", "DM Sans", -apple-system, system-ui, sans-serif';
const RW_TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const RW_A = '../shared/assets/';

const RW_LEVELS = [
  { name: 'Snapshot',    min: 0,    glyph: '◐', color: '#9DB7B4', perk: 'Birthday surprise every year' },
  { name: 'Storyteller', min: 1000, glyph: '✦', color: '#D9A93F', perk: 'Free shipping on photo books' },
  { name: 'Legend',      min: 2200, glyph: '✸', color: RW_RIM, perk: 'Free premium lay-flat upgrade' },
  { name: 'Icon',        min: 5000, glyph: '❋', color: '#7A5BD0', perk: 'Early access + yearly free book' },
];

const RW_EARN = [
  { what: 'Every €1 you spend', pts: '10 pts' },
  { what: 'Finish a monthly challenge', pts: 'up to 500' },
  { what: 'A friend orders with your code', pts: '300 pts' },
  { what: 'Try a product for the first time', pts: '100 pts' },
  { what: 'Review a delivered order', pts: '50 pts' },
];

const RW_STAMPS = [
  { label: 'First book',   sub: 'Mar 2024', glyph: '📖', got: true,  tint: '#E9F4F2', rot: -8 },
  { label: 'Globetrotter', sub: '5 trips',  glyph: '✈︎', got: true,  tint: '#FDE8E2', rot: 6 },
  { label: '1K club',      sub: 'photos',   glyph: '1K', got: true,  tint: '#FFF3D6', rot: -4 },
  { label: 'Night owl',    sub: 'Ordered at 2am', glyph: '☾', got: true, tint: '#ECE6FA', rot: 9 },
  { label: 'Wall artist',  sub: 'Order wall decor', glyph: '▣', got: false, rot: -6 },
  { label: 'Gift giver',   sub: 'Send a gift', glyph: '❤︎', got: false, rot: 5 },
];

// The recap. Numbers come from MOCK where they exist so the two never disagree.
const RW_RECAP = [
  { kind: 'intro', img: 'pb-src-italy.jpg', bg: RW_INK },
  { kind: 'stat', value: 1255, label: 'photos taken', sub: "That's about 3 every single day.", img: 'mem-tile-germany.jpg', bg: RW_RIM },
  { kind: 'photo', eyebrow: 'Your top trip', title: 'Italy', sub: '412 photos · 9 days · 1 photo book', img: 'mem-tile-italy.jpg' },
  { kind: 'month', eyebrow: 'Your busiest month', title: 'July', sub: 'Canada, lakes and a lot of sunsets', imgs: ['pb-src-canada.jpg', 'pb-src-etna.jpg', 'pb-src-guadalupe.jpg'], bg: '#7A5BD0' },
  { kind: 'stat', value: 18, label: 'books made', sub: "You're in the top 5% of Photobox storytellers.", img: 'pb-src-cappadocia.jpg', bg: RW_GREEN },
  { kind: 'outro', bg: '#FFF3D6' },
];

const RW_SLIDE_MS = 4200;

function RwStyles() {
  return (
    <style>{`
      @keyframes rwUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      @keyframes rwFade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes rwRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
      @keyframes rwPop { 0% { transform: scale(.4) rotate(-20deg); opacity: 0 } 70% { transform: scale(1.12) rotate(4deg); opacity: 1 } 100% { transform: scale(1) rotate(0) } }
      @keyframes rwKen { from { transform: scale(1.02); } to { transform: scale(1.14); } }
      @keyframes rwBar { from { width: 0; } to { width: 100%; } }
      @keyframes rwSpin { to { transform: rotate(360deg); } }
      @keyframes rwFall { from { transform: translateY(-20px) rotate(0); } to { transform: translateY(110vh) rotate(720deg); } }
      @keyframes rwShine { 0% { transform: translateX(-120%) skewX(-20deg); } 60%, 100% { transform: translateX(260%) skewX(-20deg); } }
      @keyframes rwFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @media (prefers-reduced-motion: reduce) { .rw-anim, .rw-anim * { animation: none !important; } }
    `}</style>
  );
}

// ─────────────────────────────────────────────────────────────
// Collectible stamps — the passport of things you've done
// ─────────────────────────────────────────────────────────────
function RwStamps() {
  const [hint, setHint] = React.useState(null);
  const got = RW_STAMPS.filter(s => s.got).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: RW_TEXT, fontSize: 15, fontWeight: 600, color: '#333' }}>Your stamps</span>
        <span style={{ fontFamily: RW_UI, fontSize: 13, fontWeight: 700, color: RW_GREEN }}>{got} of {RW_STAMPS.length} collected</span>
      </div>
      <div style={{ display: 'flex', gap: 10, margin: '-8px -20px', padding: '10px 20px 12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {RW_STAMPS.map(s => (
          <div key={s.label} {...press(0.92)}
            onClick={() => setHint(hint === s.label ? null : s.label)}
            style={{
              flex: '0 0 84px', height: 84, borderRadius: 42, position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: s.got ? s.tint : 'transparent',
              border: `2px dashed ${s.got ? RW_GREEN : '#C9D3D2'}`,
              transform: `rotate(${s.rot}deg)`, transition: 'transform 140ms ease',
              cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              opacity: s.got ? 1 : 0.75,
            }}>
            <span style={{ fontSize: 22, lineHeight: '24px', fontFamily: RW_HEAD, fontWeight: 800, color: s.got ? RW_INK : '#AAB6B4', filter: s.got ? 'none' : 'grayscale(1)' }}>
              {s.got ? s.glyph : '?'}
            </span>
            <span style={{ fontFamily: RW_UI, fontSize: 10, fontWeight: 700, color: s.got ? RW_INK : '#8A9997', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 2, textAlign: 'center', lineHeight: '11px', padding: '0 6px' }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div style={{ minHeight: 16, fontFamily: RW_TEXT, fontSize: 12, color: '#666' }}>
        {hint && (() => {
          const s = RW_STAMPS.find(x => x.label === hint);
          return s.got ? `✓ ${s.label} — ${s.sub}` : `Locked: ${s.sub} to earn this stamp`;
        })()}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// On this day — a memory resurfacing
// ─────────────────────────────────────────────────────────────
function RwOnThisDay() {
  return (
    <div {...press(0.97)} style={{
      position: 'relative', height: 168, borderRadius: 20, overflow: 'hidden',
      cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1)',
    }}>
      <img src={RW_A + 'mem-tile-dusseldorf.jpg'} alt="" className="rw-anim"
           style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', animation: 'rwKen 9s ease-in-out infinite alternate' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(2,60,66,0) 30%, rgba(2,60,66,0.85) 100%)' }} />
      <span style={{ position: 'absolute', top: 12, left: 12, fontFamily: RW_UI, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: '#fff', background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', padding: '4px 10px', borderRadius: 100 }}>
        On this day · 2025
      </span>
      <div style={{ position: 'absolute', left: 16, right: 16, bottom: 14, color: '#fff' }}>
        <div style={{ fontFamily: RW_HEAD, fontSize: 22, fontWeight: 700, lineHeight: '26px' }}>A year ago in London</div>
        <div style={{ fontFamily: RW_TEXT, fontSize: 12, opacity: 0.9, marginTop: 2 }}>23 photos you haven't looked at since · Turn them into prints →</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Level sheet — opens from the Storyteller card
// ─────────────────────────────────────────────────────────────
function RwLevelSheet({ onClose }) {
  const ly = window.MOCK.account.loyalty;
  const lifetime = ly.lifetime;
  const cur = RW_LEVELS.findIndex(l => l.name === ly.tier);
  const next = RW_LEVELS[cur + 1];
  const [closing, setClosing] = React.useState(false);
  const close = () => { setClosing(true); setTimeout(onClose, 220); };

  return (
    <div className="rw-anim" onClick={close} style={{
      position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(2,30,33,0.45)',
      display: 'flex', alignItems: 'flex-end',
      animation: closing ? 'none' : 'rwFade 200ms ease', opacity: closing ? 0 : 1, transition: 'opacity 220ms ease',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxHeight: '90%', overflowY: 'auto', scrollbarWidth: 'none',
        background: '#F1F6F6', borderRadius: '28px 28px 0 0',
        paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        animation: 'rwUp 320ms cubic-bezier(.2,.9,.3,1)',
        transform: closing ? 'translateY(100%)' : 'none', transition: 'transform 220ms ease',
      }}>
        {/* Hero */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '28px 20px 24px', color: '#fff', background: RW_GREEN, borderRadius: '28px 28px 0 0' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.4)', margin: '-16px auto 20px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="rw-anim" style={{ position: 'relative', width: 76, height: 76, borderRadius: 38, flexShrink: 0, overflow: 'hidden',
              background: '#D9A93F', boxShadow: '0 0 0 4px rgba(255,255,255,0.25), 0 10px 24px rgba(0,0,0,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, animation: 'rwPop 600ms ease both' }}>
              ✦
              <span style={{ position: 'absolute', top: 0, bottom: 0, width: 28, background: 'rgba(255,255,255,0.55)', animation: 'rwShine 2.6s ease-in-out infinite' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: RW_UI, fontSize: 12, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', opacity: 0.8 }}>You are a</div>
              <div style={{ fontFamily: RW_HEAD, fontSize: 34, fontWeight: 800, lineHeight: '38px' }}>{ly.tier}</div>
              <div style={{ fontFamily: RW_TEXT, fontSize: 13, opacity: 0.9 }}>{lifetime.toLocaleString('en-GB')} lifetime pts · {next.min - lifetime} to {next.name}</div>
            </div>
          </div>

          {/* Spendable balance */}
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.14)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: RW_HEAD, fontSize: 24, fontWeight: 800 }}>★ {ly.points.toLocaleString('en-GB')}</div>
              <div style={{ fontFamily: RW_TEXT, fontSize: 12, opacity: 0.85 }}>points to spend · worth €{Math.floor(ly.points / 500) * 5} off</div>
            </div>
            <span {...press(0.95)} style={{ fontFamily: RW_UI, fontSize: 14, fontWeight: 700, color: RW_INK, background: '#fff', padding: '10px 14px', borderRadius: 12, transition: 'transform 140ms ease', cursor: 'pointer' }}>Use €15 off</span>
          </div>
        </div>

        <div style={{ padding: '24px 20px 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Ladder */}
          <div>
            <RwH>Your journey</RwH>
            <div style={{ position: 'relative', marginTop: 12 }}>
              <div style={{ position: 'absolute', left: 21, top: 22, bottom: 22, width: 3, borderRadius: 2, background: '#DDE6E5' }} />
              <div className="rw-anim" style={{ position: 'absolute', left: 21, top: 22, width: 3, borderRadius: 2, background: RW_GREEN, height: `calc(${(cur + ly.progress) / (RW_LEVELS.length - 1)} * (100% - 44px))`, animation: 'rwFade 900ms ease' }} />
              {RW_LEVELS.map((l, i) => {
                const done = i <= cur;
                const here = i === cur;
                return (
                  <div key={l.name} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0', animation: `rwRise 400ms ${120 + i * 90}ms ease both` }} className="rw-anim">
                    <div style={{ width: 45, height: 45, borderRadius: 23, flexShrink: 0, zIndex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff',
                      background: done ? l.color : '#fff', boxShadow: here ? `0 0 0 4px ${l.color}40` : 'inset 0 0 0 2px #DDE6E5',
                      filter: done ? 'none' : 'grayscale(1) opacity(.5)' }}>
                      <span style={{ color: done ? '#fff' : l.color }}>{l.glyph}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, padding: here ? '10px 12px' : 0, borderRadius: 14, background: here ? '#fff' : 'transparent', boxShadow: here ? '0 4px 16px -1px rgba(0,77,74,0.1)' : 'none' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontFamily: RW_TEXT, fontSize: 15, fontWeight: 700, color: done ? '#333' : '#8A9997' }}>{l.name}{here && ' · you'}</span>
                        <span style={{ fontFamily: RW_UI, fontSize: 12, fontWeight: 700, color: '#8A9997' }}>{l.min.toLocaleString('en-GB')} pts</span>
                      </div>
                      <div style={{ fontFamily: RW_TEXT, fontSize: 12, color: done ? '#666' : '#9AA7A5' }}>{done ? '✓ ' : '🔒 '}{l.perk}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How it works */}
          <div>
            <RwH>How to earn points</RwH>
            <div style={{ marginTop: 12, background: '#F8F8F8', borderRadius: 20, boxShadow: 'inset 0 0 0 1px #fff, 0px 4px 16px -1px rgba(0,77,74,0.1)', overflow: 'hidden' }}>
              {RW_EARN.map((e, i) => (
                <div key={e.what} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderTop: i ? '1px solid #DDD' : 'none' }}>
                  <span style={{ fontFamily: RW_TEXT, fontSize: 14, color: '#333' }}>{e.what}</span>
                  <span style={{ fontFamily: RW_UI, fontSize: 13, fontWeight: 700, color: RW_GREEN }}>{e.pts}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: RW_TEXT, fontSize: 12, color: '#777', lineHeight: '17px', margin: '10px 4px 0' }}>
              Every 500 points is €5 off your next order. Your level is based on lifetime points, so spending points never moves you down a level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RwH({ children }) {
  return <div style={{ fontFamily: RW_HEAD, fontSize: 22, fontWeight: 700, color: '#333', lineHeight: '28px' }}>{children}</div>;
}

// ─────────────────────────────────────────────────────────────
// Year recap — full-screen stories, tap left/right, auto-advance
// ─────────────────────────────────────────────────────────────
function RwCount({ to, ms = 1200 }) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    let raf, t0;
    const step = t => { t0 = t0 || t; const k = Math.min(1, (t - t0) / ms); setV(Math.round(to * (1 - Math.pow(1 - k, 3)))); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return v.toLocaleString('en-GB');
}

function RwConfetti() {
  const bits = React.useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 1.2, dur: 2.4 + Math.random() * 1.6,
    color: ['#00A389', '#D9A93F', '#7A5BD0', RW_GREEN, '#fff'][i % 5], w: 6 + Math.random() * 6,
  })), []);
  return (
    <div aria-hidden className="rw-anim" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {bits.map((b, i) => (
        <span key={i} style={{ position: 'absolute', top: -20, left: `${b.left}%`, width: b.w, height: b.w * 0.45, background: b.color, borderRadius: 2, animation: `rwFall ${b.dur}s ${b.delay}s linear infinite` }} />
      ))}
    </div>
  );
}

function RwRecap({ onClose }) {
  const { user } = window.MOCK;
  const [i, setI] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const last = RW_RECAP.length - 1;
  const s = RW_RECAP[i];

  React.useEffect(() => {
    if (paused || i === last) return;
    const t = setTimeout(() => setI(n => Math.min(last, n + 1)), RW_SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, paused]);

  const tap = e => {
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX - r.left < r.width * 0.3) setI(n => Math.max(0, n - 1));
    else if (i < last) setI(n => n + 1);
  };

  const white = s.kind !== 'outro';
  return (
    <div className="rw-anim" style={{ position: 'absolute', inset: 0, zIndex: 60, background: s.bg || '#000', overflow: 'hidden', animation: 'rwFade 250ms ease', transition: 'background 400ms ease' }}>
      {/* Slide */}
      <div key={i} onClick={tap}
        onPointerDown={() => setPaused(true)} onPointerUp={() => setPaused(false)} onPointerLeave={() => setPaused(false)}
        style={{ position: 'absolute', inset: 0, color: white ? '#fff' : RW_INK, cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
        <RwSlide s={s} user={user} onClose={onClose} />
      </div>

      {/* Progress + close */}
      <div style={{ position: 'absolute', left: 12, right: 12, top: 'max(12px, calc(env(safe-area-inset-top, 0px) + 6px))', display: 'flex', gap: 4, zIndex: 2 }}>
        {RW_RECAP.map((_, n) => (
          <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: white ? 'rgba(255,255,255,0.35)' : 'rgba(2,60,66,0.2)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: white ? '#fff' : RW_INK,
              width: n < i ? '100%' : n > i ? 0 : undefined,
              animation: n === i ? `rwBar ${i === last ? 1 : RW_SLIDE_MS / 1000}s linear forwards` : 'none',
              animationPlayState: paused ? 'paused' : 'running',
            }} />
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 16, right: 12, top: 'max(26px, calc(env(safe-area-inset-top, 0px) + 20px))', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
        <span style={{ fontFamily: RW_UI, fontSize: 13, fontWeight: 700, color: white ? '#fff' : RW_INK, opacity: 0.9 }}>Your 2026 in photos</span>
        <button onClick={onClose} aria-label="Close recap" style={{ width: 36, height: 36, borderRadius: 18, border: 'none', background: white ? 'rgba(0,0,0,0.25)' : 'rgba(2,60,66,0.1)', color: white ? '#fff' : RW_INK, fontSize: 18, cursor: 'pointer', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>✕</button>
      </div>
    </div>
  );
}

function RwSlide({ s, user, onClose }) {
  const full = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' };
  const rise = d => ({ animation: `rwRise 600ms ${d}ms cubic-bezier(.2,.9,.3,1) both` });
  const pad = { position: 'absolute', left: 24, right: 24 };

  if (s.kind === 'intro') return (
    <>
      <div style={{ ...pad, top: '17%', textAlign: 'left' }}>
        <div style={{ fontFamily: RW_UI, fontSize: 15, fontWeight: 700, ...rise(100) }}>{user.firstName}'s</div>
        <div style={{ fontFamily: RW_HEAD, fontSize: 132, fontWeight: 800, lineHeight: '112px', letterSpacing: -4, color: '#F3D27A', ...rise(250) }}>20<br />26</div>
        <div style={{ fontFamily: RW_HEAD, fontSize: 30, fontWeight: 700, ...rise(450) }}>was a good one.</div>
      </div>
      {['pb-src-italy.jpg', 'pb-src-canada.jpg', 'mem-tile-germany.jpg'].map((src, n) => (
        <img key={src} src={RW_A + src} alt="" style={{
          position: 'absolute', width: 150, height: 190, objectFit: 'cover', borderRadius: 14,
          border: '5px solid #fff', boxShadow: '0 14px 30px rgba(0,0,0,0.35)',
          right: [24, 110, 40][n], bottom: [`${18}%`, `${10}%`, `${4}%`][n],
          transform: `rotate(${[8, -10, 3][n]}deg)`, animation: `rwPop 700ms ${600 + n * 180}ms ease both`,
        }} />
      ))}
    </>
  );

  if (s.kind === 'stat') return (
    <>
      <img src={RW_A + s.img} alt="" style={{ ...full, height: '46%', top: 'auto', bottom: 0, animation: 'rwKen 6s ease-out both', maskImage: 'linear-gradient(transparent, #000 35%)', WebkitMaskImage: 'linear-gradient(transparent, #000 35%)' }} />
      <div style={{ ...pad, top: '20%' }}>
        <div style={{ fontFamily: RW_UI, fontSize: 15, fontWeight: 700, opacity: 0.9, ...rise(100) }}>This year you made</div>
        <div style={{ fontFamily: RW_HEAD, fontSize: 104, fontWeight: 800, lineHeight: '104px', letterSpacing: -3, ...rise(200) }}><RwCount to={s.value} /></div>
        <div style={{ fontFamily: RW_HEAD, fontSize: 30, fontWeight: 700, ...rise(350) }}>{s.label}</div>
        <div style={{ fontFamily: RW_TEXT, fontSize: 16, marginTop: 10, opacity: 0.9, maxWidth: 280, ...rise(600) }}>{s.sub}</div>
      </div>
    </>
  );

  if (s.kind === 'photo') return (
    <>
      <img src={RW_A + s.img} alt="" style={{ ...full, animation: 'rwKen 6s ease-out both' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.35), transparent 30%, transparent 50%, rgba(0,0,0,0.7))' }} />
      <div style={{ ...pad, bottom: '12%' }}>
        <div style={{ fontFamily: RW_UI, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', ...rise(200) }}>{s.eyebrow}</div>
        <div style={{ fontFamily: RW_HEAD, fontSize: 88, fontWeight: 800, lineHeight: '90px', letterSpacing: -2, ...rise(350) }}>{s.title}</div>
        <div style={{ fontFamily: RW_TEXT, fontSize: 16, ...rise(550) }}>{s.sub}</div>
      </div>
    </>
  );

  if (s.kind === 'month') return (
    <>
      <div style={{ ...pad, top: '17%' }}>
        <div style={{ fontFamily: RW_UI, fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', ...rise(100) }}>{s.eyebrow}</div>
        <div style={{ fontFamily: RW_HEAD, fontSize: 88, fontWeight: 800, lineHeight: '90px', letterSpacing: -2, ...rise(250) }}>{s.title}</div>
        <div style={{ fontFamily: RW_TEXT, fontSize: 16, opacity: 0.9, ...rise(400) }}>{s.sub}</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '9%', height: 260 }}>
        {s.imgs.map((src, n) => (
          <img key={src} src={RW_A + src} alt="" style={{
            position: 'absolute', top: [10, 40, 0][n], left: `calc(50% + ${[-160, -60, 40][n]}px)`,
            width: 130, height: 170, objectFit: 'cover', borderRadius: 12, border: '5px solid #fff',
            boxShadow: '0 14px 30px rgba(0,0,0,0.3)', transform: `rotate(${[-9, 4, 11][n]}deg)`,
            animation: `rwPop 700ms ${500 + n * 160}ms ease both`,
          }} />
        ))}
      </div>
    </>
  );

  // outro
  return (
    <>
      <RwConfetti />
      <div style={{ ...pad, top: '16%', textAlign: 'center' }}>
        <div style={{ fontSize: 56, ...rise(100) }}>📖</div>
        <div style={{ fontFamily: RW_HEAD, fontSize: 40, fontWeight: 800, lineHeight: '44px', marginTop: 12, ...rise(200) }}>Your year,<br />ready to print</div>
        <div style={{ fontFamily: RW_TEXT, fontSize: 16, color: '#4A6A6C', marginTop: 12, ...rise(350) }}>
          We picked your 120 best photos of 2026 and laid them out by month. Just check it and order.
        </div>
      </div>
      <div onClick={e => e.stopPropagation()} style={{ ...pad, bottom: 'max(32px, env(safe-area-inset-bottom))', display: 'flex', flexDirection: 'column', gap: 8, ...rise(500) }}>
        <div style={{ alignSelf: 'center', fontFamily: RW_UI, fontSize: 13, fontWeight: 700, color: RW_GREEN, background: '#fff', padding: '6px 12px', borderRadius: 100, marginBottom: 6, animation: 'rwFloat 2s ease-in-out infinite' }}>+250 pts when you order it</div>
        <button onClick={() => window.navigation.push('product-photobook.html')} style={{ height: 56, borderRadius: 16, border: 'none', background: RW_GREEN, boxShadow: `inset 0 0 0 1px ${RW_RIM}`, color: '#fff', fontFamily: RW_UI, fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>Make my 2026 book</button>
        <button onClick={onClose} style={{ height: 56, borderRadius: 16, border: 'none', background: 'transparent', color: RW_INK, fontFamily: RW_UI, fontWeight: 700, fontSize: 17, cursor: 'pointer' }}>Maybe later</button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Recap entry card — a fanned photo stack that invites a tap
// ─────────────────────────────────────────────────────────────
function RwRecapCard({ onOpen }) {
  return (
    <div {...press(0.97)} onClick={onOpen} style={{
      position: 'relative', height: 150, borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
      background: RW_INK,
      transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
      boxShadow: '0px 6px 20px -4px rgba(2,60,66,0.35)', color: '#fff',
    }}>
      <div style={{ position: 'absolute', left: 16, top: 16, right: 150 }}>
        <div style={{ fontFamily: RW_UI, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', opacity: 0.9 }}>New · Your recap</div>
        <div style={{ fontFamily: RW_HEAD, fontSize: 26, fontWeight: 800, lineHeight: '28px', marginTop: 4 }}>Your 2026<br />in photos</div>
      </div>
      <div style={{ position: 'absolute', left: 16, bottom: 16, display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: RW_UI, fontSize: 14, fontWeight: 700, color: RW_INK, background: '#fff', padding: '8px 14px 8px 10px', borderRadius: 100 }}>
        <span style={{ width: 20, height: 20, borderRadius: 10, background: RW_GREEN, color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>▶</span>
        Watch your year
      </div>
      {['pb-src-cappadocia.jpg', 'pb-src-canada.jpg', 'pb-src-italy.jpg'].map((src, n) => (
        <img key={src} src={RW_A + src} alt="" className="rw-anim" style={{
          position: 'absolute', width: 78, height: 100, objectFit: 'cover', borderRadius: 10,
          border: '3px solid #fff', boxShadow: '0 8px 18px rgba(0,0,0,0.3)',
          right: [96, 56, 16][n], top: [30, 18, 34][n], transform: `rotate(${[-12, -2, 10][n]}deg)`,
          animation: `rwFloat ${2.4 + n * 0.4}s ${n * 0.3}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}
