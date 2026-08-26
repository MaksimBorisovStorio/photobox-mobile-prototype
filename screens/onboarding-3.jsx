// screens/onboarding-3.jsx
function OnboardingScreen() {
  const SLIDE = 3;
  const onNext = () => window.navigation.replace('home.html');

  return (
    <div style={{
      width: '100%', height: '100%',
      background: '#fff',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Hero image — top ~55% of screen */}
      <div style={{
        flex: '0 0 55%',
        position: 'relative', overflow: 'hidden',
      }}>
        <img
          src="https://picsum.photos/seed/onboard3/390/480"
          alt=""
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
        />
        {/* Fade overlay at bottom of image */}
        <div style={{
          position: 'absolute', bottom:0, left:0, right:0, height: 80,
          background: 'linear-gradient(to bottom, transparent, #fff)',
        }} />
      </div>

      {/* Content area — bottom ~45% */}
      <div style={{
        flex: 1,
        padding: '20px 32px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Text */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: '-apple-system, "SF Pro Display", system-ui',
            fontSize: 28, fontWeight: 700, lineHeight: 1.2,
            color: '#000', margin: '0 0 12px',
            letterSpacing: '-0.5px',
          }}>
            Fast delivery, right to your door
          </h1>
          <p style={{
            fontFamily: 'var(--font)',
            fontSize: 16, fontWeight: 400, lineHeight: 1.5,
            color: 'var(--color-text-secondary)', margin: 0,
          }}>
            Order today and receive your beautifully crafted products within days.
          </p>
        </div>

        {/* Progress dots + CTA + Sign in link */}
        <div style={{ width:'100%', display:'flex', flexDirection:'column', alignItems:'center', gap: 24 }}>
          {/* Dots */}
          <div style={{ display:'flex', gap: 8 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{
                width: i === SLIDE ? 20 : 8, height: 8, borderRadius: 4,
                background: i === SLIDE ? 'var(--color-primary)' : 'rgba(0,0,0,0.15)',
                transition: 'width 250ms ease',
              }} />
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={onNext}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            style={{
              width: '100%', height: 56, borderRadius: 28,
              background: 'var(--color-primary)', color: '#fff', border: 'none',
              fontSize: 17, fontWeight: 700, letterSpacing: '-0.2px',
              fontFamily: 'var(--font)',
              cursor: 'pointer',
              transition: 'transform 140ms ease',
              boxShadow: '0 4px 14px rgba(14,158,142,0.35)',
              marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)',
            }}
          >
            Get started
          </button>

          {/* Sign in link */}
          <div
            onClick={() => window.navigation.push('home.html')}
            onPointerDown={e => e.currentTarget.style.opacity = '0.6'}
            onPointerUp={e => e.currentTarget.style.opacity = '1'}
            onPointerLeave={e => e.currentTarget.style.opacity = '1'}
            style={{
              fontFamily: 'var(--font)', fontSize: 15, fontWeight: 500,
              color: 'var(--color-primary)', cursor: 'pointer',
              transition: 'opacity 140ms ease',
            }}
          >
            Sign in
          </div>
        </div>
      </div>
    </div>
  );
}
