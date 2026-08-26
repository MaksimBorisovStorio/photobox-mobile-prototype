// screens/account.jsx
function AccountScreen() {
  const { user, account } = window.MOCK;

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
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
        <span style={{ flex:1, textAlign:'center', fontSize:17, fontWeight:600, color:'#000' }}>Account</span>
        <div style={{ width:36 }} />
      </div>

      {/* Scrollable content */}
      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:40 }}>
        {/* User avatar */}
        <div style={{ textAlign:'center', padding:'8px 16px 24px' }}>
          <img src={user.avatar} alt="" style={{ width:72, height:72, borderRadius:36, objectFit:'cover', display:'block', margin:'0 auto 12px' }} />
          <div style={{ fontSize:18, fontWeight:700, color:'#000' }}>{user.name}</div>
          <div style={{ fontSize:14, color:'var(--color-text-secondary)', marginTop:2 }}>{user.email}</div>
        </div>

        {/* My Orders */}
        <IOSList header="My Orders" dark={false}>
          {account.orders.map((order, i) => (
            <div
              key={order.id}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'12px 16px',
                borderBottom: i < account.orders.length - 1 ? '0.5px solid rgba(60,60,67,0.12)' : 'none',
                cursor:'pointer', transition:'transform 140ms ease',
              }}
            >
              <img src={order.thumb} alt="" style={{ width:44, height:44, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'#000' }}>{order.title}</div>
                <div style={{ fontSize:12, color:'var(--color-text-secondary)', marginTop:2 }}>
                  {order.date} · {order.status}
                </div>
              </div>
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 1l6 6-6 6" stroke="rgba(60,60,67,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </IOSList>

        {/* Preferences */}
        <IOSList header="Preferences" dark={false}>
          <IOSListRow title="Notifications" chevron={true} isLast={false} dark={false} />
          <IOSListRow title="Language" detail="English" chevron={true} isLast={false} dark={false} />
          <IOSListRow title="Country" detail="Netherlands" chevron={true} isLast={true} dark={false} />
        </IOSList>

        {/* Support */}
        <IOSList header="Support" dark={false}>
          <IOSListRow title="Help Centre" chevron={true} isLast={false} dark={false} />
          <IOSListRow title="Contact us" chevron={true} isLast={false} dark={false} />
          <IOSListRow title="Privacy Policy" chevron={true} isLast={true} dark={false} />
        </IOSList>

        {/* Account actions */}
        <IOSList header="Account" dark={false}>
          <div
            onClick={() => window.navigation.replace('../screens/onboarding-1.html')}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            style={{
            display: 'flex', alignItems: 'center', minHeight: 52,
            padding: '0 16px', position: 'relative',
            fontFamily: '-apple-system, system-ui', fontSize: 17,
            letterSpacing: -0.43,
            color: 'var(--color-destructive)',
            cursor: 'pointer', transition: 'transform 140ms ease',
          }}>
            <div style={{ flex: 1 }}>Log out</div>
          </div>
        </IOSList>
      </div>
    </div>
  );
}
