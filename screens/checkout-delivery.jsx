// screens/checkout-delivery.jsx
function CheckoutDeliveryScreen() {
  const [addr, setAddr] = React.useState({
    firstName: 'Sarah',
    lastName: 'Johnson',
    address1: '14 Maple Street',
    city: 'Amsterdam',
    postcode: '1012 AB',
    country: 'Netherlands',
  });
  const [delivery, setDelivery] = React.useState('standard');

  const DELIVERY_OPTIONS = [
    { id:'standard', label:'Standard delivery', sub:'5–7 working days', price:'€4.99' },
    { id:'express',  label:'Express delivery',  sub:'2–3 working days', price:'€9.99' },
  ];

  const field = (label, key, placeholder) => (
    <div style={{ borderBottom:'0.5px solid rgba(60,60,67,0.12)', padding:'12px 16px' }}>
      <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginBottom:4 }}>{label}</div>
      <input
        value={addr[key]}
        onChange={e => setAddr(a => ({...a, [key]: e.target.value}))}
        placeholder={placeholder}
        style={{
          width:'100%', border:'none', outline:'none', background:'transparent',
          fontSize:16, fontFamily:'var(--font)', color:'#000',
          boxSizing:'border-box',
        }}
      />
    </div>
  );

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
        <span style={{ flex:1, textAlign:'center', fontSize:17, fontWeight:600, color:'#000' }}>Delivery</span>
        <div style={{ width:36 }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:100 }}>

        {/* Address section */}
        <div style={{ padding:'4px 16px 8px', fontSize:13, fontWeight:600, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          Delivery address
        </div>
        <div style={{ margin:'0 16px 20px', background:'var(--color-surface)', borderRadius:22, overflow:'hidden' }}>
          {field('First name', 'firstName', 'First name')}
          {field('Last name', 'lastName', 'Last name')}
          {field('Address line 1', 'address1', 'Address line 1')}
          {field('City', 'city', 'City')}
          {field('Postcode', 'postcode', 'Postcode')}
          <div style={{ padding:'12px 16px' }}>
            <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginBottom:4 }}>Country</div>
            <input
              value={addr.country}
              onChange={e => setAddr(a => ({...a, country: e.target.value}))}
              placeholder="Country"
              style={{
                width:'100%', border:'none', outline:'none', background:'transparent',
                fontSize:16, fontFamily:'var(--font)', color:'#000', boxSizing:'border-box',
              }}
            />
          </div>
        </div>

        {/* Delivery method */}
        <div style={{ padding:'4px 16px 8px', fontSize:13, fontWeight:600, color:'var(--color-text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px' }}>
          Delivery method
        </div>
        <div style={{ margin:'0 16px', background:'var(--color-surface)', borderRadius:22, overflow:'hidden' }}>
          {DELIVERY_OPTIONS.map((opt, i) => (
            <div
              key={opt.id}
              onClick={() => setDelivery(opt.id)}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              style={{
                display:'flex', alignItems:'center', padding:'14px 16px',
                borderTop: i > 0 ? '0.5px solid rgba(60,60,67,0.12)' : 'none',
                cursor:'pointer', transition:'transform 140ms ease',
              }}
            >
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:16, color:'#000' }}>{opt.label}</div>
                <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>{opt.sub}</div>
              </div>
              <span style={{ fontWeight:600, fontSize:15, color:'#000', marginRight:12 }}>{opt.price}</span>
              <div style={{
                width:22, height:22, borderRadius:11, flexShrink:0,
                border:`2px solid ${delivery === opt.id ? 'var(--color-primary)' : 'rgba(60,60,67,0.3)'}`,
                background: delivery === opt.id ? 'var(--color-primary)' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'border-color 150ms ease, background 150ms ease',
              }}>
                {delivery === opt.id && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L4 7L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          ))}
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
          onClick={() => window.navigation.push('checkout-payment.html')}
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
          Continue to payment
        </button>
      </div>
    </div>
  );
}
