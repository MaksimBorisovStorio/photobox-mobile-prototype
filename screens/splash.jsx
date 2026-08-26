// screens/splash.jsx
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
      width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #0E9E8E 0%, #065E57 60%, #032E2A 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      animation: 'splashLogoIn 600ms cubic-bezier(0.34, 1.3, 0.64, 1) 200ms both',
    }}>
      <style>{`
        @keyframes splashLogoIn {
          from { opacity:0; transform:scale(0.88); }
          to   { opacity:1; transform:scale(1); }
        }
      `}</style>

      {/* Photobox logo — sparkle SVG + wordmark */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        {/* Sparkle / star icon */}
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <path d="M26 4L29.5 20.5L46 24L29.5 27.5L26 44L22.5 27.5L6 24L22.5 20.5L26 4Z"
                fill="white" opacity="0.95"/>
        </svg>
        {/* Wordmark */}
        <span style={{
          fontFamily: '-apple-system, "SF Pro Display", system-ui',
          fontSize: 32, fontWeight: 700, color: '#FFFFFF',
          letterSpacing: '-0.5px',
        }}>photobox</span>
      </div>
    </div>
  );
}
