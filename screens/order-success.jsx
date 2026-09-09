// screens/order-success.jsx — Figma 519:26366 "Order Confirmation"
const OS_A = '../shared/assets';
const OS_DISPLAY = '-apple-system, "SF Pro Display", system-ui, sans-serif';
const OS_TEACHERS = '"Teachers", -apple-system, system-ui, sans-serif';

function OrderSuccessScreen() {
  // Figma frame assumes 56px status bar; offset content below it by the actual safe area
  const safeTop = 'env(safe-area-inset-top, 44px)';
  // T(figmaY) → CSS calc placing the element (figmaY - 56)px below the safe-area end
  const T = n => `calc(${safeTop} + ${n - 56}px)`;

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: 'linear-gradient(-18.76deg, rgb(144,206,208) 25.15%, rgb(0,142,147) 69.92%, rgb(0,115,119) 92.63%)',
    }}>

      {/* Dynamic Island */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, borderRadius: 20, background: '#000',
      }} />

      {/* Status bar — time */}
      <div style={{
        position: 'absolute', top: 17, left: 26,
        fontFamily: OS_DISPLAY, fontSize: 15, fontWeight: 600, color: '#fff',
        letterSpacing: '-0.3px',
      }}>9:41</div>

      {/* Check circle — Figma y=200 */}
      <div style={{
        position: 'absolute', top: T(200), left: '50%', transform: 'translateX(-50%)',
        width: 78, height: 78, borderRadius: 39,
        background: 'rgba(255,255,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src={`${OS_A}/pb-confirm-checkmark.svg`} width={40} height={30} alt="" style={{ display: 'block' }} />
      </div>

      {/* "Order placed!" — Figma y=300 */}
      <div style={{
        position: 'absolute', top: T(300), left: '50%', transform: 'translateX(-50%)',
        width: 320, textAlign: 'center',
        fontFamily: OS_DISPLAY, fontSize: 28, fontWeight: 700, color: '#fff',
        letterSpacing: '-0.4px',
      }}>Order placed!</div>

      {/* Subtitle — Figma y=348 */}
      <div style={{
        position: 'absolute', top: T(348), left: '50%', transform: 'translateX(-50%)',
        width: 260, textAlign: 'center',
        fontFamily: OS_DISPLAY, fontSize: 14, fontWeight: 400,
        color: 'rgba(255,255,255,0.8)', lineHeight: '20px',
      }}>We've received your order and we're getting it ready.</div>

      {/* Order number card — Figma y=411, 334×74 */}
      <div style={{
        position: 'absolute', top: T(411), left: '50%', transform: 'translateX(-50%)',
        width: 334, height: 74, borderRadius: 14,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 4,
      }}>
        <div style={{
          fontFamily: OS_DISPLAY, fontSize: 10, fontWeight: 500,
          color: 'rgba(255,255,255,0.55)', letterSpacing: '0.5px',
        }}>Order number</div>
        <div style={{
          fontFamily: OS_DISPLAY, fontSize: 22, fontWeight: 700,
          color: '#fff', letterSpacing: '-0.3px',
        }}>PBX482910</div>
      </div>

      {/* Delivery card — Figma y=495, 334×57 */}
      <div style={{
        position: 'absolute', top: T(495), left: '50%', transform: 'translateX(-50%)',
        width: 334, height: 57, borderRadius: 14,
        background: 'rgba(255,255,255,0.2)',
        display: 'flex', flexDirection: 'row',
        alignItems: 'center', padding: '0 16px', gap: 12,
        boxSizing: 'border-box',
      }}>
        <img src={`${OS_A}/pb-confirm-check.svg`} width={18} height={18} alt="" style={{ display: 'block', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{
            fontFamily: OS_DISPLAY, fontSize: 11, fontWeight: 400,
            color: 'rgba(255,255,255,0.55)',
          }}>Estimated delivery</div>
          <div style={{
            fontFamily: OS_DISPLAY, fontSize: 14, fontWeight: 700, color: '#fff',
          }}>28–30 August 2026</div>
        </div>
      </div>

      {/* "Track your order" — Figma y=622, white pill */}
      {/* Centred with left/right:0 + margin:auto to avoid transform collision with press scale */}
      <button
        onClick={() => window.navigation.push('account.html')}
        onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        style={{
          position: 'absolute', top: T(622),
          left: 0, right: 0, margin: '0 auto',
          width: 354, height: 72, borderRadius: 32,
          background: '#fff', border: 'none', cursor: 'pointer',
          fontFamily: OS_TEACHERS, fontSize: 18, fontWeight: 700, color: '#333',
          boxShadow: 'inset 0 0 20px rgba(0,77,74,0.05)',
          transition: 'transform 140ms ease',
          WebkitTapHighlightColor: 'transparent',
        }}
      >Track your order</button>

      {/* "Back to home" — Figma y=711, teal pill */}
      <button
        onClick={() => window.navigation.replace('home.html')}
        onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
        onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        style={{
          position: 'absolute', top: T(711),
          left: 0, right: 0, margin: '0 auto',
          width: 354, height: 72, borderRadius: 32,
          background: '#007377',
          border: '1px solid rgba(255,255,255,0.11)',
          cursor: 'pointer',
          fontFamily: OS_TEACHERS, fontSize: 18, fontWeight: 700, color: '#fff',
          boxShadow: 'inset 0 0 20px rgba(255,255,255,0.55)',
          transition: 'transform 140ms ease',
          WebkitTapHighlightColor: 'transparent',
        }}
      >Back to home</button>

    </div>
  );
}
