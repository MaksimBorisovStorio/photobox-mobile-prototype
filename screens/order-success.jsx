// screens/order-success.jsx
function OrderSuccessScreen() {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  const { order } = window.MOCK;

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />

      {/* Centered success content */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        paddingTop:'env(safe-area-inset-top, 44px)',
        paddingBottom:120,
        paddingLeft:24, paddingRight:24,
        textAlign:'center',
      }}>
        {/* Animated checkmark */}
        <div style={{
          width:80, height:80, borderRadius:40,
          background:'var(--color-primary)',
          display:'flex', alignItems:'center', justifyContent:'center',
          transform: visible ? 'scale(1)' : 'scale(0)',
          transition: 'transform 500ms cubic-bezier(0.34, 1.3, 0.64, 1)',
          transitionDelay: '200ms',
        }}>
          <svg width="36" height="27" viewBox="0 0 36 27" fill="none">
            <path d="M3 13.5L13.5 24L33 3" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h1 style={{ fontSize:28, fontWeight:700, color:'#000', margin:'24px 0 0' }}>
          Order confirmed!
        </h1>
        <p style={{ fontSize:17, color:'var(--color-text-secondary)', margin:'8px 0 0' }}>
          Thank you for your order
        </p>

        {/* Order card */}
        <div style={{
          width:'100%', background:'var(--color-surface)',
          borderRadius:22, overflow:'hidden',
          marginTop:32, textAlign:'left',
        }}>
          {[
            { label: 'Order number', value: order.number },
            { label: 'Estimated delivery', value: order.estimatedDelivery },
            { label: 'Total paid', value: `€${order.total.toFixed(2)}`, teal: true },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'14px 16px',
              borderBottom: i < arr.length - 1 ? '0.5px solid rgba(60,60,67,0.12)' : 'none',
            }}>
              <span style={{ fontSize:15, color:'var(--color-text-secondary)' }}>{row.label}</span>
              <span style={{
                fontSize:15, fontWeight:600,
                color: row.teal ? 'var(--color-primary)' : '#000',
              }}>{row.value}</span>
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
          onClick={() => window.navigation.push('home.html')}
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
          Continue shopping
        </button>
      </div>
    </div>
  );
}
