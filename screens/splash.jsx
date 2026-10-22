// screens/splash.jsx
// Figma: START SCREEN — node 683:3431 (section 683:3565).
// A flat green field with the white wordmark lockup (683:3435, 308×56) dead centre.
// The design's "Frame 2437" (683:3433) is a second copy of the star sitting under the
// wordmark's own — the export is already inside the lockup SVG, so it is not repeated.
function SplashScreen() {
  const { useEffect } = React;

  useEffect(() => {
    // Auto-advance after 2 seconds
    const t = setTimeout(() => {
      window.navigation.replace('onboarding-1.html');
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'var(--pb-green)', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes pbSplashIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Node: 308×56 at (61, 414) on a 430×883 frame → centred, 50.06% down. The
          wrapper centres with flex rather than a transform, because the animation
          below owns `transform` on the lockup itself. */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src="../shared/assets/pb2-logo.svg" alt="Photobox" style={{
          width: 308, height: 56, display: 'block',
          animation: 'pbSplashIn 700ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both',
        }} />
      </div>
    </div>
  );
}
