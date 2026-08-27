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

function OnboardingShell({ slide, title, body, ctaLabel = 'Continue', onNext, children }) {
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

      {/* Illustration slot — Figma node 451:13809. Empty until artwork lands. */}
      {children}

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
        {/* Blur sits on its own layer, ramped in over the first 96px. A plain
            backdrop-filter on the panel leaves a hard seam at its top edge; the
            mask makes the blur fade in instead. Text stays unmasked above it. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          zIndex: 0,
          background: 'rgba(222,241,242,0.01)',
          backdropFilter: 'blur(28.65px)', WebkitBackdropFilter: 'blur(28.65px)',
          maskImage: 'linear-gradient(to bottom, transparent 0px, #000 96px)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, #000 96px)',
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
    </div>
  );
}

Object.assign(window, { OnboardingShell, GalleryIndicator });
