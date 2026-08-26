// screens/editor-configure.jsx
function EditorConfigureScreen() {
  const [pageCount, setPageCount] = React.useState('24');
  const [paper, setPaper] = React.useState('lustre');
  const [layflat, setLayflat] = React.useState(false);
  const { photobook } = window.MOCK;

  // Live price computation
  const basePrice = 19.99;
  const pageAddon = parseFloat(
    photobook.pageOptions.find(o => o.id === pageCount)?.priceAdd?.replace(/[^0-9.]/g, '') || 0
  );
  const layflatAddon = layflat ? 5.00 : 0;
  const total = (basePrice + pageAddon + layflatAddon).toFixed(2);

  return (
    <div style={{ width:'100%', height:'100%', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar */}
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
          <div style={{ fontSize:17, fontWeight:600, color:'#000' }}>Photo book</div>
          <div style={{ fontSize:12, color:'var(--color-text-secondary)' }}>Step 3 of 3</div>
        </div>
        <div style={{ width:36 }} />
      </div>

      {/* Scrollable options */}
      <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'none', paddingBottom:100 }}>

        {/* Page count */}
        <SectionHeader title="Number of pages" />
        <div style={{
          display:'flex', gap:8, padding:'0 16px 16px',
          overflowX:'auto', scrollbarWidth:'none', WebkitOverflowScrolling:'touch',
        }}>
          {photobook.pageOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => setPageCount(opt.id)}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
              onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              style={{
                flexShrink:0, height:56, padding:'0 20px',
                background: pageCount === opt.id ? 'var(--color-primary)' : 'var(--color-surface)',
                color: pageCount === opt.id ? '#fff' : '#000',
                border: `1.5px solid ${pageCount === opt.id ? 'var(--color-primary)' : 'transparent'}`,
                borderRadius:12, cursor:'pointer', transition:'transform 140ms ease',
                fontSize:15, fontWeight:600, display:'flex', flexDirection:'column',
                alignItems:'center', justifyContent:'center', gap:2,
                boxShadow: pageCount === opt.id ? 'none' : '0 1px 4px rgba(0,0,0,0.07)',
              }}
            >
              <div>{opt.label}</div>
              <div style={{ fontSize:11, opacity:0.75 }}>{opt.priceAdd}</div>
            </button>
          ))}
        </div>

        {/* Paper finish */}
        <SectionHeader title="Paper finish" />
        <div style={{
          margin:'0 16px 16px', background:'var(--color-surface)',
          borderRadius:16, overflow:'hidden',
        }}>
          {photobook.paperOptions.map((opt, i) => (
            <div
              key={opt.id}
              onClick={() => setPaper(opt.id)}
              onPointerDown={e => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
              onPointerUp={e => e.currentTarget.style.background = 'transparent'}
              onPointerLeave={e => e.currentTarget.style.background = 'transparent'}
              style={{
                display:'flex', alignItems:'center', padding:'14px 16px',
                borderTop: i > 0 ? '0.5px solid rgba(60,60,67,0.12)' : 'none',
                cursor:'pointer', transition:'background 100ms ease',
              }}
            >
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:600, fontSize:16, color:'#000', display:'flex', alignItems:'center', gap:8 }}>
                  {opt.label}
                  {opt.recommended && (
                    <span style={{
                      fontSize:11, background:'var(--color-primary-light)',
                      color:'var(--color-primary)', padding:'2px 8px',
                      borderRadius:99, fontWeight:700,
                    }}>Recommended</span>
                  )}
                </div>
                <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>{opt.desc}</div>
              </div>
              {/* Radio button */}
              <div style={{
                width:22, height:22, borderRadius:11, flexShrink:0,
                border:`2px solid ${paper === opt.id ? 'var(--color-primary)' : 'rgba(60,60,67,0.3)'}`,
                background: paper === opt.id ? 'var(--color-primary)' : 'transparent',
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'border-color 150ms ease, background 150ms ease',
              }}>
                {paper === opt.id && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L4 7L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lay-flat add-on */}
        <SectionHeader title="Add-ons" />
        <div style={{ margin:'0 16px 16px', background:'var(--color-surface)', borderRadius:16, overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', padding:'14px 16px' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:600, fontSize:16, color:'#000' }}>Lay-flat binding</div>
              <div style={{ fontSize:13, color:'var(--color-text-secondary)', marginTop:2 }}>
                Pages open completely flat · +€5.00
              </div>
            </div>
            <Toggle on={layflat} onChange={setLayflat} />
          </div>
        </div>

        {/* Price summary */}
        <div style={{
          margin:'0 16px', padding:16,
          background:'var(--color-surface)', borderRadius:16,
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ color:'var(--color-text-secondary)', fontSize:15 }}>Hardcover Photo Book</span>
            <span style={{ fontWeight:600, fontSize:15, color:'#000' }}>€19.99</span>
          </div>
          {pageAddon > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ color:'var(--color-text-secondary)', fontSize:15 }}>Extra pages</span>
              <span style={{ fontWeight:600, fontSize:15, color:'#000' }}>+€{pageAddon.toFixed(2)}</span>
            </div>
          )}
          {layflat && (
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ color:'var(--color-text-secondary)', fontSize:15 }}>Lay-flat</span>
              <span style={{ fontWeight:600, fontSize:15, color:'#000' }}>+€5.00</span>
            </div>
          )}
          <div style={{ height:'0.5px', background:'rgba(60,60,67,0.12)', margin:'8px 0' }} />
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:700, fontSize:17, color:'#000' }}>Total</span>
            <span style={{ fontWeight:700, fontSize:17, color:'var(--color-primary)' }}>€{total}</span>
          </div>
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
          onClick={() => window.navigation.push('../image-picker/index.html')}
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
          Start creating ✦
        </button>
      </div>
    </div>
  );
}

// iOS-style toggle switch
function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      onPointerDown={e => e.currentTarget.style.opacity = '0.85'}
      onPointerUp={e => e.currentTarget.style.opacity = '1'}
      onPointerLeave={e => e.currentTarget.style.opacity = '1'}
      style={{
        width:51, height:31, borderRadius:31,
        background: on ? '#34C759' : 'rgba(120,120,128,0.45)',
        border:'none', padding:0, cursor:'pointer', position:'relative',
        transition:'background 200ms ease', flexShrink:0,
      }}
    >
      <span style={{
        position:'absolute', top:2,
        left: on ? 22 : 2,
        width:27, height:27, borderRadius:'50%',
        background:'#fff', boxShadow:'0 2px 5px rgba(0,0,0,0.25)',
        transition:'left 200ms cubic-bezier(0.4,0,0.2,1)',
      }} />
    </button>
  );
}

function SectionHeader({ title }) {
  return (
    <div style={{
      padding:'20px 16px 8px',
      fontSize:13, fontWeight:600,
      color:'var(--color-text-secondary)',
      textTransform:'uppercase', letterSpacing:'0.5px',
    }}>
      {title}
    </div>
  );
}
