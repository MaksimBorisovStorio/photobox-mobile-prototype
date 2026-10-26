// screens/memory-detail.jsx — Figma node 511:21981 "Source page main"
//
// Memory detail screen: hero photo + title/stats, then photo grid grouped
// by chapter with sticky section headers. Opened from the Memories screen
// when the user taps on a featured album tile (e.g. "Trip to Italy").

const MD_SF_BODY  = PB_DISPLAY;   // the app's face (home, create, book-choose)
const MD_SF_DISP  = PB_DISPLAY;

// The Italy trip, grouped by topic — shared/trip-italy.js (also what the editor auto-fills from).
const CHAPTERS = window.PB_TRIP_ITALY.groups.map(g => ({
  title: g.title, sub: `${g.date} · ${g.photos.length} photos`, photos: g.photos,
}));

// ─── Chapter section header ─────────────────────────────────
function ChapterHeader({ title, sub }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: '#fff',
      display: 'flex', alignItems: 'center', gap: 4,
      padding: sub ? '24px 8px 16px 12px' : '12px 8px 8px 12px',
    }}>
      <div style={{ flex: '1 0 0', minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontFamily: MD_SF_DISP, fontWeight: 600, fontSize: sub ? 20 : 13,
          lineHeight: sub ? '24px' : '18px',
          letterSpacing: sub ? '0.38px' : '-0.08px',
          color: 'var(--colour-foreground-fg-black, #333)',
          whiteSpace: 'nowrap',
        }}>{title}</p>
        {sub && (
          <p style={{
            margin: '4px 0 0', fontFamily: MD_SF_BODY, fontSize: 12,
            lineHeight: '16px', color: '#666', whiteSpace: 'nowrap',
          }}>{sub}</p>
        )}
      </div>
      <button style={{
        flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 12px 4px 4px', borderRadius: 40,
        background: '#fafafa', border: 'none', cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}>
        <img src="../shared/assets/mem-icon-select.svg" alt="" width={20} height={20} />
        <span style={{
          fontFamily: MD_SF_BODY, fontWeight: 600, fontSize: 13,
          lineHeight: '18px', letterSpacing: '-0.08px',
          color: 'var(--colour-foreground-fg-secondary, #007F70)',
          whiteSpace: 'nowrap',
        }}>Select all</span>
      </button>
    </div>
  );
}

// ─── Screen ──────────────────────────────────────────────────
function MemoryDetailScreen() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#fff' }}>
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>

        {/* ── Hero — 556px ──────────────────────────────── */}
        <div style={{ position: 'relative', height: 556, overflow: 'hidden', flexShrink: 0 }}>

          {/* Background photo */}
          <img src="../shared/assets/mem-tile-italy.jpg" alt=""
               style={{
                 position: 'absolute', inset: 0,
                 width: '100%', height: '100%',
                 objectFit: 'cover', display: 'block',
               }} />

          {/* Frosted white gradient — node 511:21987: h-377, from 47.7% transparent
              to 89.3% white, with backdrop-blur. Fades the photo into white for the
              stats row below.
              The mask restricts the blur to the lower half so the photo stays sharp
              where the gradient is still transparent (the couple). Without it, the
              45px backdropFilter blurs the full 377px zone including the clear area. */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 377,
            background: 'linear-gradient(to bottom,' +
              ' rgba(255,255,255,0) 0%,' +
              ' rgba(255,255,255,0.75) 50%,' +
              ' #ffffff 80%)',
            backdropFilter: 'blur(45px)',
            WebkitBackdropFilter: 'blur(45px)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%)',
          }} />

          <PbBackButton onClick={() => window.history.back()} />

          <PbGlassButton label="More" style={{ position: 'absolute', right: 16, top: PB_BACK_TOP, zIndex: 5 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5.5" r="1.9" /><circle cx="12" cy="12" r="1.9" /><circle cx="12" cy="18.5" r="1.9" /></svg>
          </PbGlassButton>

          {/* Title + date — node 511:22001: centered, offset 48px below midpoint */}
          <div style={{
            position: 'absolute',
            left: '50%', top: 326,
            transform: 'translate(-50%, -50%)',
            textAlign: 'center', width: '100%', padding: '0 20px',
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <p style={{
              margin: 0, fontFamily: MD_SF_BODY, fontWeight: 900,
              fontSize: 40, lineHeight: '32px', letterSpacing: '-1px',
              color: '#fff',
              textShadow: '0 0 20px rgba(255,255,255,0.4)',
            }}>Trip to Italy</p>
            <p style={{
              margin: 0, fontFamily: MD_SF_BODY, fontWeight: 600,
              fontSize: 13, lineHeight: '18px', letterSpacing: '-0.08px',
              color: '#fff', textAlign: 'center',
            }}>12–21 July, 2025</p>
          </div>

          {/* Create button — node 511:22523, now the app Button, centered, top 390.
              Centred with left/right:0 + margin:auto rather than translateX(-50%)
              because press() assigns style.transform = scale(0.97), wiping a
              translateX and snapping the button to the left edge on tap. */}
          <button
            onClick={() => window.navigation.push('memory-create.html')}
            {...press(0.97)}
            style={pbButton('primary', {
              position: 'absolute', top: 390, left: 0, right: 0, width: 'fit-content', margin: '0 auto', padding: '0 24px 0 16px',
            })}
          >
            <img src="../shared/assets/mem-icon-create-plus.svg" alt="" width={24} height={24} />
            <span>Create</span>
          </button>

          {/* Stats bar — node 511:22005: 3-col grid at top 478 */}
          <div style={{
            position: 'absolute', top: 478, left: 0, width: '100%',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: 16,
          }}>
            {[
              { value: '40', label: 'Photos', info: false },
              { value: '0',  label: 'Hidden', info: true  },
              { value: '9',  label: 'Chapters', info: false },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
              }}>
                <p style={{
                  margin: 0, fontFamily: MD_SF_BODY, fontWeight: 600, fontSize: 17,
                  lineHeight: '22px', letterSpacing: '-0.41px',
                  color: 'var(--colour-foreground-fg-black, #333)', textAlign: 'center',
                }}>{s.value}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 4 }}>
                  <p style={{
                    margin: 0, fontFamily: MD_SF_BODY, fontSize: 12,
                    lineHeight: '16px', color: 'var(--colour-foreground-fg-black, #333)',
                    textAlign: 'center', whiteSpace: 'nowrap',
                  }}>{s.label}</p>
                  {s.info && (
                    <img src="../shared/assets/mem-icon-info.svg" alt="" width={16} height={16} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Photo grid ────────────────────────────────── */}
        <div style={{ background: '#fff' }}>
          {CHAPTERS.map((ch, i) => (
            <div key={i}>
              <ChapterHeader title={ch.title} sub={ch.sub} />
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: 1,
              }}>
                {ch.photos.map((src, j) => (
                  <div key={j} style={{
                    width: 'calc((100% - 2px) / 3)',
                    aspectRatio: '1', overflow: 'hidden',
                    flexShrink: 0, position: 'relative',
                    background: '#eee',
                  }}>
                    <img src={src} alt="" style={{
                      position: 'absolute', inset: 0,
                      width: '100%', height: '100%',
                      objectFit: 'cover', display: 'block',
                    }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ height: 40 }} />
        </div>

      </div>
    </div>
  );
}
