// screens/product-photobook.jsx
function ProductPhotobookScreen() {
  const [selected, setSelected] = React.useState('hardcover');
  const { photobook } = window.MOCK;

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'8px 16px 12px',
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
        <span style={{ fontFamily:'-apple-system,"SF Pro Display",system-ui', fontSize:17, fontWeight:600, color:'#000' }}>
          Photo books
        </span>
        <div style={{ width:36 }} />
      </div>

      {/* Cover type grid — scrollable */}
      <div style={{ flex:1, overflowY:'auto', padding:'0 16px', scrollbarWidth:'none', paddingBottom:90 }}>
        <p style={{ fontSize:13, color:'var(--color-text-secondary)', marginBottom:16, marginTop:4 }}>
          Choose cover type
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          {photobook.coverTypes.map(ct => (
            <div
              key={ct.id}
              onClick={() => setSelected(ct.id)}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              style={{
                background: selected === ct.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                border: `2px solid ${selected === ct.id ? 'var(--color-primary)' : 'transparent'}`,
                borderRadius: 16, overflow:'hidden', cursor:'pointer',
                transition:'transform 140ms ease, border-color 200ms ease',
                boxShadow:'0 1px 4px rgba(0,0,0,0.07)',
                position:'relative',
              }}
            >
              {ct.popular && (
                <div style={{
                  position:'absolute', top:8, right:8,
                  background:'var(--color-primary)', color:'#fff',
                  fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                }}>Popular</div>
              )}
              <img
                src={ct.thumb}
                alt={ct.label}
                style={{ width:'100%', aspectRatio:'200/260', objectFit:'cover', display:'block' }}
              />
              <div style={{ padding:'10px 12px 12px' }}>
                <div style={{ fontWeight:700, fontSize:15, color:'#000' }}>{ct.label}</div>
                <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>From {ct.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA — fixed at bottom */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        padding:'12px 16px',
        paddingBottom:'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        background:'linear-gradient(to top, var(--color-bg) 60%, transparent)',
      }}>
        <button
          onClick={() => window.navigation.push('editor-format.html')}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            width:'100%', height:56, borderRadius:28,
            background:'var(--color-primary)', color:'#fff', border:'none',
            fontSize:17, fontWeight:700, letterSpacing:'-0.2px',
            cursor:'pointer', transition:'transform 140ms ease',
            boxShadow:'0 4px 14px rgba(14,158,142,0.35)',
          }}
        >
          Choose format →
        </button>
      </div>
    </div>
  );
}
