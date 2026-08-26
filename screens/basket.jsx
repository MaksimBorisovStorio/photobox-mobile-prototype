// screens/basket.jsx
function BasketScreen() {
  const [qty, setQty] = React.useState(1);
  const { basket } = window.MOCK;
  const item = basket.items[0];
  const subtotal = (item.price * qty).toFixed(2);
  const total = (parseFloat(subtotal) + basket.delivery).toFixed(2);

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column', position:'relative' }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar */}
      <div style={{
        padding:'8px 16px 16px',
        paddingTop:'calc(env(safe-area-inset-top, 44px) + 8px)',
        display:'flex', alignItems:'center',
      }}>
        <button
          onClick={() => window.navigation.pop()}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            width:36, height:36, borderRadius:18, background:'rgba(0,0,0,0.06)',
            border:'none', cursor:'pointer', display:'flex', alignItems:'center',
            justifyContent:'center', transition:'transform 140ms ease',
          }}
        >
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path d="M10 2L2 10l8 8" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span style={{ flex:1, textAlign:'center', fontSize:17, fontWeight:600, color:'#000' }}>Your basket</span>
        <div style={{ width:36 }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:100 }}>

        {/* Product card */}
        <div style={{
          margin:'0 16px 16px', background:'var(--color-surface)',
          borderRadius:22, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.07)',
        }}>
          <div style={{
            display:'flex', gap:14, padding:16,
            borderBottom:'0.5px solid rgba(60,60,67,0.12)',
          }}>
            <img
              src={item.thumb}
              alt=""
              style={{ width:80, height:80, borderRadius:10, objectFit:'cover' }}
            />
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:16, color:'#000', marginBottom:4 }}>{item.type}</div>
              <div style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.4 }}>{item.spec}</div>
              <div style={{ fontWeight:700, fontSize:17, color:'var(--color-primary)', marginTop:8 }}>
                €{item.price.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Quantity control */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px' }}>
            <span style={{ fontSize:15, color:'var(--color-text-secondary)' }}>Quantity</span>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                style={{
                  width:32, height:32, borderRadius:16, background:'rgba(0,0,0,0.06)',
                  border:'none', cursor:'pointer', fontSize:20,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:300, transition:'transform 140ms ease',
                }}
              >−</button>
              <span style={{ fontWeight:700, fontSize:17, minWidth:24, textAlign:'center', color:'#000' }}>
                {qty}
              </span>
              <button
                onClick={() => setQty(q => q + 1)}
                onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                style={{
                  width:32, height:32, borderRadius:16, background:'var(--color-primary)',
                  color:'#fff', border:'none', cursor:'pointer', fontSize:20,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontWeight:300, transition:'transform 140ms ease',
                }}
              >+</button>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div style={{ margin:'0 16px', background:'var(--color-surface)', borderRadius:22, overflow:'hidden' }}>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', borderBottom:'0.5px solid rgba(60,60,67,0.12)' }}>
            <span style={{ fontSize:16, color:'var(--color-text-secondary)' }}>Subtotal</span>
            <span style={{ fontSize:16, fontWeight:600, color:'#000' }}>€{subtotal}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', borderBottom:'0.5px solid rgba(60,60,67,0.12)' }}>
            <span style={{ fontSize:16, color:'var(--color-text-secondary)' }}>Delivery</span>
            <span style={{ fontSize:16, fontWeight:600, color:'#000' }}>€{basket.delivery.toFixed(2)}</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px' }}>
            <span style={{ fontSize:17, fontWeight:700, color:'#000' }}>Total</span>
            <span style={{ fontSize:17, fontWeight:700, color:'var(--color-primary)' }}>€{total}</span>
          </div>
        </div>

        {/* Promo code */}
        <div style={{ margin:'12px 16px 0', background:'var(--color-surface)', borderRadius:22, overflow:'hidden' }}>
          <div
            onPointerDown={e => {
              e.currentTarget.style.transform = 'scale(0.97)';
              e.currentTarget.style.background = 'rgba(0,0,0,0.03)';
            }}
            onPointerUp={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'transparent';
            }}
            onPointerLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'transparent';
            }}
            style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'14px 16px', cursor:'pointer', transition:'transform 140ms ease, background 100ms ease',
            }}
          >
            <span style={{ fontSize:16, color:'#000' }}>Add promo code</span>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke="rgba(60,60,67,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        padding:'12px 16px',
        paddingBottom:'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        background:'linear-gradient(to top, var(--color-bg) 60%, transparent)',
      }}>
        <button
          onClick={() => window.navigation.push('checkout-delivery.html')}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            width:'100%', height:56, borderRadius:28,
            background:'var(--color-primary)', color:'#fff', border:'none',
            fontSize:17, fontWeight:700, cursor:'pointer',
            transition:'transform 140ms ease',
            boxShadow:'0 4px 14px rgba(14,158,142,0.35)',
          }}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
