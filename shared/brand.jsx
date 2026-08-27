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
function GlassIconButton({ children, size = 40, radius = 20, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.9)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{
        width: size, height: size, borderRadius: radius,
        position: 'relative', overflow: 'hidden', border: 'none', padding: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', cursor: 'pointer',
        transition: 'transform 140ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Blur + tint. No saturate(): sampling the design mock, the glass interior
          is colour-neutral against the teal behind it (delta ≈ -3,-5,-5), whereas
          IOSGlassPill's saturate(180%) drove it cyan (-37,+21,+23). */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        background: 'rgba(255,255,255,0.03)',
      }} />
      {/* Shine + rim, composited with plus-lighter. The mock's rim lifts the
          backdrop by a near-equal +21/+19/+19 — a normal white overlay on teal
          cannot do that (it would read roughly +21/+9/+9, weighted to red),
          because plus-lighter adds each channel instead of interpolating toward
          white. The highlight sits on the bottom-left arc, so the brighter inset
          is offset left/down and the top-right one is dimmer. */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        mixBlendMode: 'plus-lighter',
        boxShadow: 'inset 1.5px -1.5px 1.5px rgba(255,255,255,0.10),' +
                   ' inset -1px 1px 1.5px rgba(255,255,255,0.04)',
        border: '0.5px solid rgba(255,255,255,0.11)',
      }} />
      <span style={{ position: 'relative', zIndex: 1, display: 'flex' }}>{children}</span>
    </button>
  );
}

Object.assign(window, { PhotoboxLogo, GlassIconButton, PB_DISPLAY });
