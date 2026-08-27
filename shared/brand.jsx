// shared/brand.jsx — Photobox brand marks, type stack and the glass icon button.

// Display face for headings and product copy. Figma specifies "Google Sans Flex",
// which Google does not distribute on Google Fonts — DM Sans is the closest
// self-hosted stand-in. Drop a Google Sans Flex woff2 into shared/assets and
// enable its @font-face in styles.css and it takes over (it is first in the stack).
const PB_DISPLAY = '"Google Sans Flex", "DM Sans", -apple-system, "SF Pro Display", system-ui, sans-serif';

// Wordmark lockup. Figma splash (451:13761) is the reference geometry at 157×41;
// the home header (451:13866) is exactly the same lockup at 2/3 — verified: the
// home star export is the splash star's path scaled by 1.5, and the wordmark's
// size/leading/tracking are all exactly 2/3 of splash's. So one set of numbers
// and one SVG serve both, driven by `scale`.
//   scale 1    → splash (with the 4 glow layers)
//   scale 2/3  → home header (base glyph only, no glow)
function PhotoboxLogo({ scale = 1, glow = false, assetBase = '../shared/assets' }) {
  const s = scale;
  const STAR = { left: 141.55 * s, top: 0.16 * s, w: 31.6722 * s, h: 31.4948 * s };

  const layer = (file, spread, w, h, blend) => (
    <img
      key={file}
      src={`${assetBase}/${file}`}
      alt=""
      style={{
        position: 'absolute',
        left: STAR.left - spread * s, top: STAR.top - spread * s,
        width: w * s, height: h * s, display: 'block',
        ...(blend ? { mixBlendMode: 'plus-lighter' } : null),
      }}
    />
  );

  return (
    <div style={{ position: 'relative', width: 157 * s, height: 41 * s }}>
      {layer('splash-star-base.svg', 0, 31.6722, 31.4948, false)}
      {glow && [
        layer('splash-star-glow1.svg', 50, 131.672, 130.2325, false),
        layer('splash-star-glow2.svg', 50, 131.672, 130.2325, true),
        layer('splash-star-glow3.svg', 25, 81.6721, 80.2325, false),
        layer('splash-star-glow4.svg', 15, 61.6721, 60.2325, true),
      ]}
      <p style={{
        position: 'absolute', right: 7.85 * s, top: 15.72 * s, margin: 0,
        fontFamily: '"Teachers", -apple-system, system-ui, sans-serif',
        fontWeight: 600, fontSize: 37.319 * s, lineHeight: `${24.88 * s}px`,
        letterSpacing: `${-1.4928 * s}px`, color: '#FFFFFF',
        textAlign: 'right', whiteSpace: 'nowrap',
      }}>
        photobox
      </p>
    </div>
  );
}

// Liquid-glass icon button — same recipe as IOSGlassPill (blur + saturate, inset
// shine, hairline rim), with the rim and tint pushed brighter because it sits on
// the deep teal header rather than a light surface.
// Figma node 451:13873: 24px icon + 8px padding, radius 20.
//
// `tint` and `accent` exist for the editor header (node 451:15678), which uses the
// same glass on a near-black backdrop: there the interior needs the design's
// rgba(0,0,0,0.25) scrim to read at all, and the Continue button adds a teal
// colour-dodge/soft-light pair on top. Both default to the home-header values so
// existing call sites are unchanged.
// `gloss` switches on the fuller iOS-26-style treatment used by the editor header:
// a lensed rim, a specular sweep and a 1px 10%-white edge. See the note below on why
// this is hand-built rather than pulled from a liquid-glass library.
function GlassIconButton({ children, size = 40, radius = 20, onClick, label,
                           tint = 'rgba(255,255,255,0.03)', accent = null,
                           width, gloss = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.9)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{
        width: width || size, height: size, borderRadius: radius,
        position: 'relative', overflow: 'hidden', border: 'none', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', cursor: 'pointer',
        transition: 'transform 140ms ease',
        WebkitTapHighlightColor: 'transparent',
        // Real glass sits above its surface; without a drop shadow the button reads
        // as a hole cut in the header rather than an object on top of it.
        ...(gloss ? { boxShadow: '0 4px 10px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.35)' } : null),
      }}
    >
      {/* Blur + tint. No saturate() in the default recipe: sampling the design mock,
          the glass interior is colour-neutral against the teal behind it
          (delta ≈ -3,-5,-5), whereas IOSGlassPill's saturate(180%) drove it cyan
          (-37,+21,+23). Under `gloss` the backdrop is near-black, where saturate has
          almost nothing to act on, so it is safe to add for the little it gives. */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        backdropFilter: gloss ? 'blur(14px) saturate(180%)' : 'blur(12px)',
        WebkitBackdropFilter: gloss ? 'blur(14px) saturate(180%)' : 'blur(12px)',
        background: tint,
      }} />
      {/* Optional accent wash (editor Continue button — node 451:15685). */}
      {accent}

      {gloss ? (
        <React.Fragment>
          {/* Lensed rim. Apple's glass brightens where the bevel bends light, which
              is the single biggest cue that it is glass and not a frosted panel.
              Built from inset shadows rather than a radial-gradient so it follows
              border-radius — the same layer then works for the 40px circles and the
              88×40 undo/redo pill. */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07),' +
                       ' inset 0 0 7px 1px rgba(255,255,255,0.07),' +
                       ' inset 0 0 18px -6px rgba(255,255,255,0.16)',
          }} />
          {/* Specular sweep — bright at both ends, clear through the middle. Light
              comes from the lower left, per the mock finding above, so 35deg puts
              the strong end at the bottom-left arc and a weaker catch opposite. */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            background: 'linear-gradient(35deg,' +
                        ' rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.10) 18%,' +
                        ' rgba(255,255,255,0) 42%, rgba(255,255,255,0) 60%,' +
                        ' rgba(255,255,255,0.06) 84%, rgba(255,255,255,0.22) 100%)',
          }} />
          {/* Edge: the requested 1px / 10% white, plus the hard specular highlight
              riding just inside it. Normal compositing, not plus-lighter — Chrome
              promotes the scroller to its own layer, and plus-lighter cannot blend
              across a composited layer boundary (see CLAUDE.md). */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: 'inset 1.5px -1.5px 1px rgba(255,255,255,0.42),' +
                       ' inset -1.5px 1.5px 1px rgba(255,255,255,0.14)',
          }} />
        </React.Fragment>
      ) : (
        /* Shine + rim, composited with plus-lighter. The mock's rim lifts the
           backdrop by a near-equal +21/+19/+19 — a normal white overlay on teal
           cannot do that (it would read roughly +21/+9/+9, weighted to red),
           because plus-lighter adds each channel instead of interpolating toward
           white. The highlight sits on the bottom-left arc, so the brighter inset
           is offset left/down and the top-right one is dimmer. */
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          mixBlendMode: 'plus-lighter',
          boxShadow: 'inset 1.5px -1.5px 1.5px rgba(255,255,255,0.10),' +
                     ' inset -1px 1px 1.5px rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.11)',
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 1, display: 'flex' }}>{children}</span>
    </button>
  );
}

Object.assign(window, { PhotoboxLogo, GlassIconButton, PB_DISPLAY });
