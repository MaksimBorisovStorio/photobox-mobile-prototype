// shared/onboarding-shell.jsx
// Shared pieces for the start flow — Figma section 683:3565: START SCREEN, 1st step
// (welcome), 2ND SCREEN (photo access) and 3RD SCREEN (notifications).
//
// Replaces the old three-slide shell (wash, gallery dots, white pill CTA). The primary
// went green in this design, and the two permission screens are now a light page with
// an illustration, a headline and a stacked primary / skip pair.
//
// ⚠️ Top-level declarations in a classic script land in the global lexical scope, so
// every name here is `Ob…` / `OB_…` to stay clear of PB_DISPLAY and friends.

const OB_HEAD = '"Bricolage Grotesque", "DM Sans", -apple-system, system-ui, sans-serif';
const OB_UI = '"Rethink Sans", "DM Sans", -apple-system, system-ui, sans-serif';
const OB_HEAD_VARIATION = '"opsz" 14, "wdth" 100';   // pinned by the design

// Figma's Button: r16, 56 tall, Rethink Sans Bold 17/20.
//   primary — green fill with the lighter 1px rim
//   light   — #EFEFEF with a warm rim (welcome screen's "Continue as guest")
//   ghost   — no fill: "Skip" on the light pages, whose fill is the page colour
const OB_BUTTONS = {
  primary: { background: 'var(--pb-green)', border: '1px solid var(--pb-green-rim)', color: '#FFFFFF' },
  light:   { background: '#EFEFEF', border: '1px solid #EBE2D9', color: '#000000' },
  ghost:   { background: 'var(--pb-paper)', border: '1px solid transparent', color: '#000000' },
};

function ObButton({ kind = 'primary', children, onClick }) {
  const press = s => ({
    onPointerDown: e => { e.currentTarget.style.transform = `scale(${s})`; },
    onPointerUp:   e => { e.currentTarget.style.transform = 'scale(1)'; },
    onPointerLeave:e => { e.currentTarget.style.transform = 'scale(1)'; },
  });
  return (
    <button
      onClick={onClick}
      {...press(0.97)}
      style={{
        width: '100%', height: 56, boxSizing: 'border-box', flex: 'none',
        borderRadius: 16, padding: '0 24px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        transition: 'transform 140ms ease',
        fontFamily: OB_UI, fontWeight: 700, fontSize: 17, lineHeight: '20px',
        whiteSpace: 'nowrap', WebkitTapHighlightColor: 'transparent',
        ...OB_BUTTONS[kind],
      }}
    >{children}</button>
  );
}

// The bottom of every start-flow screen: 24px gutters, 8px between the buttons, and
// the node's 32px of air underneath (lifted to the home-indicator inset on device).
const OB_BUTTON_STACK = {
  display: 'flex', flexDirection: 'column', gap: 8, width: '100%',
  boxSizing: 'border-box',
  padding: '0 24px max(32px, env(safe-area-inset-bottom, 0px))',
};

// Illustration coordinates are lifted from the 430-wide Figma frames, so the art lives
// in a 430-wide box centred on the viewport — on a 390 phone it simply overhangs a
// little on each side, which the art's own margins absorb.
const OB_ART_W = 430;

// The two permission screens. Layout, top to bottom:
//   art      flex: 1 — the illustration is centred in whatever is left
//   title    Bricolage Grotesque SemiBold 28/36 −1.1857, #023C42, 373 wide, 62 above
//            the buttons (node: title bottom 669, first button 731)
//   buttons  primary + skip
//
// `artHeight` is the height of the illustration's own coordinate space and `artBias`
// nudges it off the exact centre of the free area, in px, so each screen can land
// where its node has it (see each screen for the numbers).
//
// `artWidth` / `artFit` are how much of that space has to stay on screen — the widest
// span of ink, and the height above which the art may run into the headline. On a phone
// too small for them the art scales down about its centre instead of colliding with the
// copy or running off the side; on anything the nodes were drawn for the scale is 1.
function OnboardingPrompt({
  title, artHeight, artBias = 0, artWidth = OB_ART_W, artFit = artHeight, children,
  primaryLabel, onPrimary, skipLabel = 'Skip', onSkip,
}) {
  const { useRef, useState, useLayoutEffect } = React;
  const areaRef = useRef(null);
  const [fit, setFit] = useState(1);

  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setFit(Math.max(0.4, Math.min(1, r.width / artWidth, r.height / artFit)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [artWidth, artFit]);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: 'var(--pb-paper)',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes obRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div aria-hidden ref={areaRef} style={{
        flex: '1 1 0', minHeight: 0, position: 'relative',
        marginTop: 'max(44px, env(safe-area-inset-top, 0px))',
        pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', left: '50%', width: OB_ART_W, height: artHeight,
          top: `calc(50% - ${artHeight / 2}px + ${artBias}px)`,
          transform: `translateX(-50%) scale(${fit})`,
        }}>{children}</div>
      </div>

      <h1 style={{
        flex: 'none', margin: '0 auto 62px', width: 373, maxWidth: 'calc(100% - 32px)',
        textAlign: 'center', textWrap: 'balance',
        fontFamily: OB_HEAD, fontWeight: 600, fontSize: 28, lineHeight: '36px',
        letterSpacing: '-1.1857px', color: 'var(--pb-ink)',
        fontVariationSettings: OB_HEAD_VARIATION,
        animation: 'obRise 520ms cubic-bezier(0.22, 1, 0.36, 1) 160ms both',
      }}>{title}</h1>

      <div style={{
        ...OB_BUTTON_STACK, flex: 'none',
        animation: 'obRise 520ms cubic-bezier(0.22, 1, 0.36, 1) 260ms both',
      }}>
        <ObButton kind="primary" onClick={onPrimary}>{primaryLabel}</ObButton>
        <ObButton kind="ghost" onClick={onSkip}>{skipLabel}</ObButton>
      </div>
    </div>
  );
}

// Honour the system setting: the loops below hold on a composed frame instead of moving.
function obReducedMotion() {
  return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}

Object.assign(window, { ObButton, OnboardingPrompt, obReducedMotion });
