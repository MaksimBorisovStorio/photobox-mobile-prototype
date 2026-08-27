// screens/splash.jsx
// Figma: "splashscreen" — node 451:13758 (Final prototype canvas)
// Geometry below is taken verbatim from the Figma frame (390×844 baseline).
function SplashScreen() {
  const { useEffect } = React;

  useEffect(() => {
    // Auto-advance after 2 seconds
    const t = setTimeout(() => {
      window.navigation.replace('onboarding-1.html');
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  // Radial wash — node 451:13760, gradient copied from Figma dev mode.
  const wash = 'radial-gradient(661.83% 92.48% at 50% 50%, var(--pb-wash-stops))';

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#EBF7F8', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes pbSplashIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Teal wash */}
      <div style={{ position: 'absolute', inset: 0, background: wash }} />

      {/* Logo lockup — node 451:13761: 157×41, centred, top 401/844 */}
      <div style={{
        position: 'absolute', left: 'calc(50% + 0.5px)', top: '47.51%',
        transform: 'translateX(-50%)',
      }}>
        <div style={{ animation: 'pbSplashIn 700ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both' }}>
          <PhotoboxLogo scale={1} glow />
        </div>
      </div>
    </div>
  );
}
