// screens/checkout-payment.jsx
function CheckoutPaymentScreen() {
  const [card, setCard] = React.useState({
    number: '•••• •••• •••• 4242',
    expiry: '12/28',
    cvv: '•••',
    name: 'Sarah Johnson',
  });

  return (
    <div style={{
      position:'relative', width:'100%', height:'100%',
      background:'var(--color-bg)', display:'flex', flexDirection:'column',
    }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar */}
      <div style={{
        display:'flex', alignItems:'center',
        padding:'8px 16px 16px',
        paddingTop:'calc(env(safe-area-inset-top, 44px) + 8px)',
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
        <span style={{ flex:1, textAlign:'center', fontSize:17, fontWeight:600, color:'#000' }}>Payment</span>
        <div style={{ width:36 }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:100 }}>

        {/* Card visual */}
        <div style={{
          margin:'0 16px 24px',
          background:'linear-gradient(135deg, var(--color-primary) 0%, #065E57 100%)',
          borderRadius:20, padding:24, color:'#fff',
          boxShadow:'0 8px 28px rgba(14,158,142,0.4)',
        }}>
          <div style={{ fontSize:13, opacity:0.8, marginBottom:24, letterSpacing:'0.5px' }}>PHOTOBOX CARD</div>
          <div style={{ fontSize:20, fontWeight:600, letterSpacing:'3px', marginBottom:24 }}>
            {card.number}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:11, opacity:0.7, marginBottom:2 }}>CARDHOLDER</div>
              <div style={{ fontSize:14, fontWeight:600 }}>{card.name}</div>
            </div>
            <div>
              <div style={{ fontSize:11, opacity:0.7, marginBottom:2 }}>EXPIRES</div>
              <div style={{ fontSize:14, fontWeight:600 }}>{card.expiry}</div>
            </div>
          </div>
        </div>

        {/* Card fields */}
        <div style={{ padding:'4px 16px 8px', fontSize:13, fontWeight:600, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          Card details
        </div>
        <div style={{ margin:'0 16px 20px', background:'var(--color-surface)', borderRadius:22, overflow:'hidden' }}>
          {[
            { label:'Card number', key:'number', placeholder:'Card number' },
            { label:'Name on card', key:'name', placeholder:'Name on card' },
          ].map((f, i) => (
            <div key={f.key} style={{ borderBottom:'0.5px solid rgba(60,60,67,0.12)', padding:'12px 16px' }}>
              <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginBottom:4 }}>{f.label}</div>
              <input
                value={card[f.key]}
                onChange={e => setCard(c => ({...c, [f.key]: e.target.value}))}
                placeholder={f.placeholder}
                style={{
                  width:'100%', border:'none', outline:'none', background:'transparent',
                  fontSize:16, fontFamily:'var(--font)', color:'#000', boxSizing:'border-box',
                }}
              />
            </div>
          ))}
          <div style={{ display:'flex' }}>
            {[
              { label:'Expiry date', key:'expiry', placeholder:'MM/YY' },
              { label:'CVV', key:'cvv', placeholder:'•••' },
            ].map((f, i) => (
              <div key={f.key} style={{
                flex:1, padding:'12px 16px',
                borderRight: i === 0 ? '0.5px solid rgba(60,60,67,0.12)' : 'none',
              }}>
                <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginBottom:4 }}>{f.label}</div>
                <input
                  value={card[f.key]}
                  onChange={e => setCard(c => ({...c, [f.key]: e.target.value}))}
                  placeholder={f.placeholder}
                  style={{
                    width:'100%', border:'none', outline:'none', background:'transparent',
                    fontSize:16, fontFamily:'var(--font)', color:'#000', boxSizing:'border-box',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div style={{ padding:'4px 16px 8px', fontSize:13, fontWeight:600, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          Order summary
        </div>
        <div style={{ margin:'0 16px', background:'var(--color-surface)', borderRadius:22, overflow:'hidden' }}>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', borderBottom:'0.5px solid rgba(60,60,67,0.12)' }}>
            <span style={{ fontSize:15, color:'var(--color-text-secondary)' }}>Subtotal</span>
            <span style={{ fontSize:15, fontWeight:600, color:'#000' }}>€24.99</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px', borderBottom:'0.5px solid rgba(60,60,67,0.12)' }}>
            <span style={{ fontSize:15, color:'var(--color-text-secondary)' }}>Delivery</span>
            <span style={{ fontSize:15, fontWeight:600, color:'#000' }}>€4.99</span>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 16px' }}>
            <span style={{ fontSize:17, fontWeight:700, color:'#000' }}>Total</span>
            <span style={{ fontSize:17, fontWeight:700, color:'var(--color-primary)' }}>€29.98</span>
          </div>
        </div>

        {/* Security note */}
        <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:8 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L2 3v4c0 3.3 2.2 6.4 5 7 2.8-.6 5-3.7 5-7V3L7 1z" stroke="rgba(60,60,67,0.4)" strokeWidth="1.2" fill="none"/>
          </svg>
          <span style={{ fontSize:12, color:'var(--color-text-secondary)' }}>Payments are secure and encrypted</span>
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
          onClick={() => window.navigation.replace('order-success.html')}
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
          Pay €29.98
        </button>
      </div>
    </div>
  );
}
