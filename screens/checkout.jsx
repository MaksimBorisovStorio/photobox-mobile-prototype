// screens/checkout.jsx — Figma 582:3746 "Checkout"
const CKO_A = '../shared/assets';
const CKO_TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const CKO_TEACHERS = '"Teachers", -apple-system, system-ui, sans-serif';

function CheckoutScreen() {

  function Row({ label, children }) {
    return (
      <>
        <div style={{ height: 1, background: '#ddd', flexShrink: 0 }} />
        <div style={{
          display: 'flex', gap: 14, alignItems: 'flex-start',
          padding: '12px 16px 13px', flexShrink: 0,
        }}>
          <div style={{ width: 54, flexShrink: 0 }}>
            <p style={{
              fontFamily: CKO_TEXT, fontSize: 10, fontWeight: 700,
              color: '#777', lineHeight: '13px', letterSpacing: '0.07px',
              margin: 0,
            }}>{label}</p>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
          <span style={{ fontFamily: 'system-ui', fontSize: 18, color: '#333', flexShrink: 0 }}>›</span>
        </div>
      </>
    );
  }

  return (
    <div style={{
      width: '100%', height: '100%', background: '#F1F6F6',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar — in flow, same as basket */}
      <div style={{
        position: 'relative', height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: CKO_TEXT, fontSize: 17, fontWeight: 700, color: '#333' }}>Checkout</span>
      </div>

      {/* Savings banner — in flow before scroll area */}
      <div style={{
        height: 35, background: '#D9E9EA', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
      }}>
        <img src={`${CKO_A}/pb-basket-promo-check.svg`} alt="" width={13} height={13} />
        <span style={{ fontFamily: CKO_TEXT, fontSize: 12, fontWeight: 700, color: '#007377' }}>
          You're saving €40.00 with SUNSHINE2026
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: 120 }}>

        {/* Details card */}
        <div style={{
          margin: '22px 24px 0',
          background: '#fff', borderRadius: 20,
          boxShadow: '0 4px 16px -1px rgba(0,77,74,0.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          <Row label="DELIVERY">
            <p style={{ fontFamily: CKO_TEXT, fontSize: 15, fontWeight: 600, color: '#333', lineHeight: '20px', letterSpacing: '-0.24px', margin: '0 0 2px' }}>Sarah Mitchell</p>
            <p style={{ fontFamily: CKO_TEXT, fontSize: 12, fontWeight: 400, color: '#555', lineHeight: '16px', margin: 0 }}>42 Garden Street, London, SW1A 1AA</p>
          </Row>
          <Row label="METHOD">
            <p style={{ fontFamily: CKO_TEXT, fontSize: 15, fontWeight: 600, color: '#333', lineHeight: '20px', letterSpacing: '-0.24px', margin: '0 0 2px' }}>Standard · €4.99</p>
            <p style={{ fontFamily: CKO_TEXT, fontSize: 12, fontWeight: 400, color: '#555', lineHeight: '16px', margin: 0 }}>Arrives 8-10 Sep 2026</p>
          </Row>
          <Row label="PAYMENT">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ background: '#1a1f71', borderRadius: 3, width: 39, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: CKO_TEXT, fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: 0 }}>VISA</span>
              </div>
              <span style={{ fontFamily: CKO_TEXT, fontSize: 14, fontWeight: 400, color: '#1c1c1e' }}>···· 4242</span>
            </div>
          </Row>
          <Row label="PROMO">
            <p style={{ fontFamily: CKO_TEXT, fontSize: 13, fontWeight: 600, color: '#333', lineHeight: '18px', letterSpacing: '-0.08px', margin: 0 }}>SUNSHINE2026</p>
          </Row>
          <div style={{ height: 1, background: '#ddd', flexShrink: 0 }} />
        </div>

        {/* Order summary label + product card */}
        <div style={{ margin: '22px 24px 0', paddingTop: 3 }}>
          <p style={{ fontFamily: CKO_TEXT, fontSize: 10, fontWeight: 700, color: '#777', letterSpacing: '0.07px', lineHeight: '13px', margin: '0 0 5px' }}>ORDER SUMMARY</p>
          <div style={{ background: '#fff', borderRadius: 24, height: 100, display: 'flex', overflow: 'hidden' }}>
            <img
              src={`${CKO_A}/pb-checkout-thumb.png`}
              alt=""
              style={{ width: 86, height: 100, objectFit: 'cover', flexShrink: 0, display: 'block' }}
            />
            <div style={{ flex: 1, padding: '16px 16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
              <div>
                <p style={{ fontFamily: CKO_TEXT, fontSize: 13, fontWeight: 600, color: '#333', lineHeight: '18px', letterSpacing: '-0.08px', margin: '0 0 2px' }}>
                  Large Landscape Hardcover with Layflat
                </p>
                <p style={{ fontFamily: CKO_TEXT, fontSize: 12, fontWeight: 400, color: '#333', lineHeight: '16px', margin: 0 }}>29 x 21 cm</p>
              </div>
              <p style={{ fontFamily: CKO_TEXT, fontSize: 15, fontWeight: 600, color: '#333', lineHeight: '20px', letterSpacing: '-0.24px', margin: 0 }}>€44.99</p>
            </div>
          </div>
        </div>

        {/* Price summary card */}
        <div style={{
          margin: '16px 24px 0',
          background: '#fff', borderRadius: 24,
          padding: '14px 16px 16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: CKO_TEXT, fontSize: 14, fontWeight: 400, color: '#666' }}>Subtotal</span>
            <span style={{ fontFamily: CKO_TEXT, fontSize: 14, fontWeight: 510, color: '#333' }}>€84.99</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: CKO_TEXT, fontSize: 14, fontWeight: 600, color: '#007377' }}>Savings</span>
            <span style={{ fontFamily: CKO_TEXT, fontSize: 14, fontWeight: 700, color: '#007377' }}>€40.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: CKO_TEXT, fontSize: 14, fontWeight: 400, color: '#666' }}>Delivery</span>
            <span style={{ fontFamily: CKO_TEXT, fontSize: 14, fontWeight: 510, color: '#333' }}>€4.99</span>
          </div>
          <div style={{ height: 1, background: '#ebebeb', margin: '0 0 14px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: CKO_TEXT, fontSize: 16, fontWeight: 700, color: '#333' }}>Total</span>
            <span style={{ fontFamily: CKO_TEXT, fontSize: 18, fontWeight: 700, color: '#333' }}>€44.99</span>
          </div>
        </div>
      </div>

      {/* Back button — same position as basket (top:62 = IOSStatusBar height) */}
      <button
        onClick={() => window.navigation.pop()}
        onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
        onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        style={{
          position: 'absolute', left: 15, top: 62,
          padding: 8, borderRadius: 20,
          background: 'rgba(255,255,255,0.01)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform 140ms ease',
          WebkitTapHighlightColor: 'transparent', zIndex: 3,
        }}
      >
        <img src={`${CKO_A}/pb-icon-back-teal.svg`} alt="" width={24} height={24} style={{ display: 'block' }} />
      </button>

      {/* Fixed CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: `24px 24px calc(24px + env(safe-area-inset-bottom, 0px))`,
        background: 'rgba(255,255,255,0.01)',
      }}>
        <button
          onClick={() => window.navigation.push('order-success.html')}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            width: '100%', height: 72, borderRadius: 32,
            background: '#007377', border: '1px solid rgba(255,255,255,0.11)',
            color: '#fff', fontFamily: CKO_TEACHERS, fontSize: 18, fontWeight: 600,
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.55)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent',
          }}
        >
          Place order · €44.99
        </button>
      </div>
    </div>
  );
}
