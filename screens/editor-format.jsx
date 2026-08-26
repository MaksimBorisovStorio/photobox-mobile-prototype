// screens/editor-format.jsx
function EditorFormatScreen() {
  const [selected, setSelected] = React.useState('square-lg');
  const { photobook } = window.MOCK;

  return (
    <div style={{ position:'relative', width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar with progress */}
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'8px 16px 4px',
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
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:17, fontWeight:600, color:'#000' }}>Choose format</div>
          <div style={{ fontSize:12, color:'var(--color-text-secondary)' }}>Step 2 of 3</div>
        </div>
        <div style={{ width:36 }} />
      </div>

      {/* Format grid */}
      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', padding:'12px 16px 100px' }}>
        <p style={{ fontSize:13, color:'var(--color-text-secondary)', marginBottom:16, marginTop:0 }}>
          Select a size for your photo book
        </p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
          {photobook.formats.map(fmt => (
            <div
              key={fmt.id}
              onClick={() => setSelected(fmt.id)}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              style={{
                background: selected === fmt.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
                border: `2px solid ${selected === fmt.id ? 'var(--color-primary)' : 'transparent'}`,
                borderRadius:12, overflow:'hidden', cursor:'pointer',
                transition:'transform 140ms ease, border-color 200ms ease',
                boxShadow:'0 1px 4px rgba(0,0,0,0.07)',
                position:'relative',
              }}
            >
              {selected === fmt.id && (
                <div style={{
                  position:'absolute', top:6, right:6, width:18, height:18, borderRadius:9,
                  background:'var(--color-primary)', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <img
                src={fmt.thumb}
                alt={fmt.label}
                style={{ width:'100%', aspectRatio:'1', objectFit:'cover', display:'block' }}
              />
              <div style={{ padding:'8px 8px 10px' }}>
                <div style={{ fontWeight:700, fontSize:13, color:'#000' }}>{fmt.label}</div>
                <div style={{ fontSize:11, color:'var(--color-text-secondary)', marginTop:2 }}>{fmt.size}</div>
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
          onClick={() => window.navigation.push('editor-configure.html')}
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
          Next step →
        </button>
      </div>
    </div>
  );
}
