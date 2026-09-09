// screens/basket.jsx — Figma 581:2267 "Basket" + 581:2529 "Other options" drawer
const BSK_A = '../shared/assets';
const BSK_TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const BSK_DISPLAY = '-apple-system, "SF Pro Display", system-ui, sans-serif';
const BSK_TEACHERS = '"Teachers", -apple-system, system-ui, sans-serif';

function BasketScreen() {
  const [qty, setQty] = React.useState(1);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const tealCta = {
    position: 'relative', height: 72, borderRadius: 32,
    background: '#007377', border: '1px solid rgba(255,255,255,0.11)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'transform 140ms ease',
    WebkitTapHighlightColor: 'transparent', boxShadow: 'inset 0 0 20px rgba(255,255,255,0.55)',
  };

  return (
    <div style={{ width: '100%', height: '100%', background: '#F1F6F6', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar */}
      <div style={{ position: 'relative', height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: BSK_TEXT, fontSize: 17, fontWeight: 700, color: '#333' }}>Basket</span>
        <span style={{ position: 'absolute', right: 24, fontFamily: BSK_TEXT, fontSize: 13, fontWeight: 510, color: '#8e8e93' }}>1 item</span>
      </div>

      {/* Promo savings banner */}
      <div style={{ height: 35, background: '#D9E9EA', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 0 }}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M2 6.5L5.5 10L11 4" stroke="#007377" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontFamily: BSK_TEXT, fontSize: 12, fontWeight: 700, color: '#007377', whiteSpace: 'nowrap' }}>You&rsquo;re saving €40.00 with SUNSHINE2026</span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: 120 }}>

        {/* Product card */}
        <div style={{ margin: '16px 24px 0', background: '#fff', borderRadius: 24, overflow: 'hidden', height: 162, display: 'flex', flexDirection: 'row', position: 'relative', flexShrink: 0 }}>
          <img src={`${BSK_A}/pb-basket-thumb.png`} alt="" style={{ width: 114, height: 162, objectFit: 'cover', flexShrink: 0, display: 'block' }} />
          <div style={{ flex: 1, padding: '16px 16px 16px 8px', display: 'flex', flexDirection: 'column', gap: 24, minWidth: 0 }}>
            {/* Info */}
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: BSK_TEXT, fontSize: 16, fontWeight: 600, color: '#333', lineHeight: '21px', letterSpacing: '-0.32px' }}>Large Landscape<br/>Hardcover with Layflat</div>
              <div style={{ fontFamily: BSK_TEXT, fontSize: 13, fontWeight: 400, color: '#333', lineHeight: '18px', marginTop: 2 }}>29 x 21 cm</div>
              {/* 3-dots button */}
              <button
                onClick={() => setDrawerOpen(true)}
                {...press(0.9)}
                style={{ position: 'absolute', top: -5, right: 0, width: 30, height: 30, borderRadius: 15, background: '#F2F2F7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent' }}
              >
                <span style={{ fontFamily: BSK_TEXT, fontSize: 14, color: '#8e8e93', letterSpacing: 1, lineHeight: 1 }}>···</span>
              </button>
            </div>
            {/* Stepper + price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 55 }}>
              {/* Stepper */}
              <div style={{ position: 'relative', width: 89, height: 28, flexShrink: 0 }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  {...press(0.9)}
                  style={{ position: 'absolute', left: 0, top: 0, width: 28, height: 28, borderRadius: 14, background: '#FEF2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent' }}
                >
                  <svg width="10" height="2" viewBox="0 0 10 2"><rect x="0" y="0" width="10" height="2" rx="1" fill="#1c1c1e"/></svg>
                </button>
                <span style={{ position: 'absolute', left: 42, top: 4, fontFamily: BSK_TEXT, fontSize: 15, fontWeight: 700, color: '#1c1c1e' }}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  {...press(0.9)}
                  style={{ position: 'absolute', left: 61, top: 0, width: 28, height: 28, borderRadius: 14, background: '#007377', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
              {/* Price */}
              <div>
                <div style={{ fontFamily: BSK_DISPLAY, fontSize: 20, fontWeight: 600, color: '#333', lineHeight: '24px', letterSpacing: '0.38px' }}>€44.99</div>
                <div style={{ fontFamily: BSK_TEXT, fontSize: 12, fontWeight: 500, color: '#939393', lineHeight: '16px', textDecoration: 'line-through' }}>€84.99</div>
              </div>
            </div>
          </div>
        </div>

        {/* Promo code box */}
        <div style={{ margin: '16px 24px 0', height: 90, borderRadius: 12, border: '1px solid #007377', background: '#D9E9EA', position: 'relative', flexShrink: 0 }}>
          <span style={{ position: 'absolute', left: 13, top: 12, fontFamily: BSK_TEXT, fontSize: 11, fontWeight: 700, color: '#007377' }}>SUNSHINE2026</span>
          <span style={{ position: 'absolute', right: 13, top: 12, fontFamily: BSK_TEXT, fontSize: 11, fontWeight: 700, color: '#007377' }}>✓ Applied</span>
          <span style={{ position: 'absolute', left: 13, top: 31, right: 13, fontFamily: BSK_TEXT, fontSize: 12, fontWeight: 600, color: '#333' }}>50% off photo books, wall art and gifts on orders from £25</span>
          <span style={{ position: 'absolute', left: 13, bottom: 12, fontFamily: BSK_TEXT, fontSize: 10, fontWeight: 400, color: '#666' }}>Valid to 00:59, 1 Sep 2026</span>
        </div>

        {/* Summary card */}
        <div style={{ margin: '16px 24px 0', background: '#fff', borderRadius: 24, height: 152, position: 'relative', flexShrink: 0 }}>
          <span style={{ position: 'absolute', left: 16, top: 14, fontFamily: BSK_TEXT, fontSize: 14, fontWeight: 400, color: '#666' }}>Subtotal</span>
          <span style={{ position: 'absolute', right: 16, top: 15, fontFamily: BSK_TEXT, fontSize: 14, fontWeight: 510, color: '#333' }}>€84.99</span>
          <span style={{ position: 'absolute', left: 16, top: 42, fontFamily: BSK_TEXT, fontSize: 14, fontWeight: 600, color: '#007377' }}>Savings</span>
          <span style={{ position: 'absolute', right: 16, top: 42, fontFamily: BSK_TEXT, fontSize: 14, fontWeight: 700, color: '#007377' }}>-€40.00</span>
          <span style={{ position: 'absolute', left: 16, top: 69, fontFamily: BSK_TEXT, fontSize: 14, fontWeight: 400, color: '#666' }}>Delivery</span>
          <span style={{ position: 'absolute', right: 16, top: 69, fontFamily: BSK_TEXT, fontSize: 14, fontWeight: 510, color: '#333' }}>€4.99</span>
          <div style={{ position: 'absolute', left: 16, top: 101, width: 326, height: 1, background: '#ebebeb' }} />
          <span style={{ position: 'absolute', left: 16, top: 116, fontFamily: BSK_TEXT, fontSize: 16, fontWeight: 700, color: '#333' }}>Total</span>
          <span style={{ position: 'absolute', right: 16, top: 116, fontFamily: BSK_TEXT, fontSize: 18, fontWeight: 700, color: '#333' }}>€44.99</span>
        </div>

      </div>

      {/* Fixed CTA */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: `24px 24px calc(24px + env(safe-area-inset-bottom, 0px))`, background: 'rgba(255,255,255,0.01)' }}>
        <button
          onClick={() => window.navigation.push('checkout.html')}
          {...press(0.97)}
          style={{ ...tealCta, width: '100%' }}
        >
          <span style={{ fontFamily: BSK_TEACHERS, fontSize: 18, fontWeight: 600, color: '#fff' }}>Go to checkout · €44.99</span>
        </button>
      </div>

      {/* Back button */}
      <button
        onClick={() => window.navigation.pop()}
        {...press(0.9)}
        style={{ position: 'absolute', left: 15, top: 62, padding: 8, borderRadius: 20, background: 'rgba(255,255,255,0.01)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* 3-dots drawer */}
      {drawerOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
          {/* Scrim */}
          <div onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
          {/* Sheet */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 443, background: '#fff', borderRadius: '20px 20px 0 0', overflow: 'hidden' }}>
            {/* Drag handle */}
            <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 36, height: 4, background: '#E5E5EA', borderRadius: 2 }} />
            {/* Product info */}
            <div style={{ position: 'absolute', left: 24, top: 34, right: 24, fontFamily: BSK_TEXT, fontSize: 16, fontWeight: 600, color: '#333', lineHeight: '21px', letterSpacing: '-0.32px' }}>Large Landscape Hardcover with Layflat</div>
            <div style={{ position: 'absolute', left: 24, top: 58, fontFamily: BSK_TEXT, fontSize: 13, fontWeight: 400, color: '#333', lineHeight: '18px' }}>29 x 21 cm</div>
            {/* Action rows */}
            {[
              { icon: `${BSK_A}/pb-basket-edit.svg`, label: 'Edit design', color: '#333' },
              { icon: `${BSK_A}/pb-basket-eye.svg`, label: 'Preview', color: '#333' },
              { icon: `${BSK_A}/pb-basket-duplicate.svg`, label: 'Duplicate', color: '#333' },
              { icon: `${BSK_A}/pb-basket-options.svg`, label: 'Change upgrades', color: '#333' },
              { icon: `${BSK_A}/pb-basket-delete.svg`, label: 'Remove from basket', color: '#CD051F' },
            ].map((row, i) => (
              <button
                key={row.label}
                {...press(0.97)}
                style={{ position: 'absolute', left: 24, top: 99 + i * 48, width: 354, height: 40, display: 'flex', alignItems: 'center', gap: 14, paddingRight: 16, paddingTop: 8, paddingBottom: 8, background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent' }}
              >
                <img src={row.icon} alt="" width={24} height={24} style={{ display: 'block', flexShrink: 0 }} />
                <span style={{ fontFamily: BSK_TEXT, fontSize: 15, fontWeight: 600, color: row.color }}>{row.label}</span>
              </button>
            ))}
            {/* Cancel button */}
            <button
              onClick={() => setDrawerOpen(false)}
              {...press(0.97)}
              style={{ position: 'absolute', top: 346, left: '50%', transform: 'translateX(-50%)', width: 354, height: 72, borderRadius: 32, background: '#EEE', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 140ms ease', WebkitTapHighlightColor: 'transparent' }}
            >
              <span style={{ fontFamily: BSK_TEACHERS, fontSize: 20, fontWeight: 600, color: '#333' }}>Cancel</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
