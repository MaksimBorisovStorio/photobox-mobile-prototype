// shared/onboarding-shell.jsx
// Shared chrome for the three onboarding slides.
// Figma: "onboarding" section — slide 1 node 451:13808, slide 3 node 451:13823.
// All three slides are identical except the illustration, the copy and the
// active dot, so the layout lives here once.

// PB_DISPLAY comes from shared/brand.jsx, which must load before this file.

// Gallery indicator — Figma node 451:13817 (44×16 pill, dots at x=10/22/34).
function GalleryIndicator({ active = 1 }) {
  return (
    <svg width="44" height="16" viewBox="0 0 44 16" fill="none" style={{ display: 'block' }}>
      <rect width="44" height="16" rx="8" fill="black" fillOpacity="0.5" />
      {[10, 22, 34].map((cx, i) => (
        <circle key={cx} cx={cx} cy="8" r="2" fill="white" opacity={i + 1 === active ? 1 : 0.2} />
      ))}
    </svg>
  );
}

// Illustration coordinates are lifted verbatim from the 390-wide Figma frames, so
// both art slots live in a 390-wide box centred on the viewport — on a wider phone
// the whole illustration centres instead of hugging the left edge. Decorative, so
// pointer events pass straight through to the CTA underneath.
const ART_FRAME = {
  position: 'absolute', left: '50%', top: 0, width: 390, height: '100%',
  transform: 'translateX(-50%)', pointerEvents: 'none',
};

function OnboardingShell({ slide, title, body, ctaLabel = 'Continue', onNext, children, foreground }) {
  const press = s => ({
    onPointerDown: e => { e.currentTarget.style.transform = `scale(${s})`; },
    onPointerUp:   e => { e.currentTarget.style.transform = 'scale(1)'; },
    onPointerLeave:e => { e.currentTarget.style.transform = 'scale(1)'; },
  });

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#EBF7F8', overflow: 'hidden',
    }}>
      {/* Brand wash — same stops as the splash, centred low (50% 88.68%) so the
          deep teal sits behind the white copy. Figma node 451:13808 fill. */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(815.74% 113.98% at 50% 88.68%, var(--pb-wash-stops))',
      }} />

      {/* Illustration, behind the bottom panel — so the panel's backdrop blur softens
          whatever reaches down into it, exactly as the Figma frames do. */}
      <div aria-hidden style={ART_FRAME}>{children}</div>

      {/* Bottom panel — node 451:13813: 484 tall, blurs the artwork behind it */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%', height: 484,
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end', gap: 24,
        padding: '32px 20px 0',
        // Figma pads 24px; on-device we lift to the safe area so the CTA clears
        // the home indicator.
        paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))',
      }}>
        {/* ⚠️ The node declares `backdrop-blur: 28.65px` on this panel and it is
            deliberately NOT implemented. Figma's own render of all three frames shows
            no blur at all — the panel's fill is rgba(222,241,242,0.01) and Figma
            modulates a background blur by the layer's own fill alpha, so 1% of the
            blur is 1% visible. Measured on node 451:13841: the album tile that runs
            behind this panel keeps 4.78 units of horizontal detail in Figma's render
            where a live 28.65px backdrop-filter leaves 1.75 — the artwork came out
            visibly washed out against the design. The panel is therefore a plain
            translucent layer; the wash gradient behind it is what carries the
            transition, and it needs no seam-hiding mask because there is no seam.
            Put the blur back and the illustrations go soft again. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          zIndex: 0,
          background: 'rgba(222,241,242,0.01)',
        }} />
        {/* Copy — node 451:13814 */}
        {/* Figma gaps are 16 here and 24 below, on a 40px subhead line box. Since
            the panel is bottom-anchored, tightening that line box to 24px pulls the
            whole stack 15px down, so 8px is given back below and 8px between the
            two lines — copy lands exactly where the design has it, measured. */}
        <div style={{
          position: 'relative', zIndex: 1, marginBottom: 8,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          width: '100%', textAlign: 'center', color: '#FFFFFF',
          textShadow: '0px 0px 10px rgba(0,115,119,0.5)',
        }}>
          {/* Headline leading is Figma's 40px — measured off the reference, the
              two headline lines sit exactly 40px apart.
              The -0.2px tracking is not in the Figma node: DM Sans is a shade
              wider than Google Sans Flex, enough that slide 3's second line
              measured 350px against 350px available and wrapped to a third line.
              Drop this once the real Google Sans Flex woff2 is in place. */}
          <p style={{
            margin: 0, width: '100%',
            fontFamily: PB_DISPLAY, fontWeight: 600, fontSize: 28, lineHeight: '40px',
            letterSpacing: '-0.2px',
          }}>{title}</p>
          {/* Figma inherits 40px here too, which is invisible on its one-line copy
              but blows out the moment the body wraps. 24px keeps it tight. */}
          <p style={{
            margin: 0, width: '100%', maxWidth: 350,
            fontFamily: PB_DISPLAY, fontWeight: 500, fontSize: 16, lineHeight: '24px',
          }}>{body}</p>
        </div>

        <div style={{ position: 'relative', zIndex: 1, width: 44, height: 16 }}>
          <GalleryIndicator active={slide} />
        </div>

        {/* CTA — node 451:13822: 338×72, r55, Teachers Bold 20/32 */}
        <div style={{
          position: 'relative', zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', width: '100%',
        }}>
          <button
            onClick={onNext}
            {...press(0.97)}
            style={{
              width: '100%', maxWidth: 338, height: 72, borderRadius: 55,
              background: 'var(--colour-foreground-fg-white, #FFFFFF)',
              border: 'none', padding: '0 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: 'pointer', transition: 'transform 140ms ease',
              fontFamily: '"Teachers", -apple-system, system-ui, sans-serif',
              fontWeight: 700, fontSize: 20, lineHeight: '32px',
              color: 'var(--colour-foreground-fg-secondary, #007377)',
              whiteSpace: 'nowrap',
            }}
          >
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* Illustration parts Figma paints AFTER the panel, so they stay sharp where
          they overlap it: slide 2's front album tile and its two labels, slide 3's
          notification stack. */}
      {foreground ? <div aria-hidden style={ART_FRAME}>{foreground}</div> : null}
    </div>
  );
}

Object.assign(window, { OnboardingShell, GalleryIndicator });
