// screens/memory-detail.jsx — Figma node 511:21981 "Source page main"
//
// Memory detail screen: hero photo + title/stats, then photo grid grouped
// by chapter with sticky section headers. Opened from the Memories screen
// when the user taps on a featured album tile (e.g. "Trip to Italy").

const MD_SF_BODY  = 'var(--font)';
const MD_SF_DISP  = 'var(--font-display)';

// 25 mock photos, cycled across all chapters.
const MOCK = Array.from({ length: 25 }, (_, i) =>
  `../shared/assets/photos/mock-${String(i + 1).padStart(2, '0')}.webp`
);
function mocks(start, count) {
  return Array.from({ length: count }, (_, i) => MOCK[(start + i) % 25]);
}

// Chapter data matching the Figma design.
const CHAPTERS = [
  { title: 'Morning preparing', sub: '1 May · 6 photos',  photos: mocks(0,  6) },
  { title: 'On the way',        sub: '1 May · 7 photos',  photos: mocks(6,  7) },
  { title: "Chapter's name",    sub: '1 May · 3 photos',  photos: mocks(13, 3) },
  { title: '04 Jan 2026',       sub: null,                photos: mocks(16, 12) },
  { title: '05 Jan 2026',       sub: null,                photos: mocks(3,  9) },
];

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
          color: 'var(--colour-foreground-fg-secondary, #007377)',
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
              stats row below. */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 377,
            background: 'linear-gradient(to bottom,' +
              ' rgba(255,255,255,0.01) 0%,' +
              ' rgba(255,255,255,0.8) 40%,' +
              ' #ffffff 75%)',
            backdropFilter: 'blur(45px)',
            WebkitBackdropFilter: 'blur(45px)',
          }} />

          {/* Back button — node 511:22519 */}
          <button
            onClick={() => window.history.back()}
            {...press(0.95)}
            style={{
              position: 'absolute', left: 16, top: 60,
              width: 40, height: 40, borderRadius: 20,
              background: 'rgba(0,0,0,0.11)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 8,
              WebkitTapHighlightColor: 'transparent',
              transition: 'transform 140ms ease',
            }}
          >
            <img src="../shared/assets/mem-icon-back.svg" alt="Back" width={24} height={24} />
          </button>

          {/* More button — node 512:23709 */}
          <button
            {...press(0.95)}
            style={{
              position: 'absolute', right: 16, top: 60,
              width: 40, height: 40, borderRadius: 20,
              background: 'rgba(0,0,0,0.11)', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 8,
              WebkitTapHighlightColor: 'transparent',
              transition: 'transform 140ms ease',
            }}
          >
            <img src="../shared/assets/mem-icon-more.svg" alt="More" width={24} height={24} />
          </button>

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

          {/* Create button — node 511:22523: teal pill, centered, top 390 */}
          <button
            {...press(0.97)}
            style={{
              position: 'absolute', top: 390,
              left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '16px 24px 16px 16px', borderRadius: 55,
              background: '#007377', border: 'none',
              boxShadow: 'inset 0 0 27px rgba(0,0,0,0.25)',
              cursor: 'pointer', whiteSpace: 'nowrap',
              WebkitTapHighlightColor: 'transparent',
              transition: 'transform 140ms ease',
            }}
          >
            <img src="../shared/assets/mem-icon-create-plus.svg" alt="" width={24} height={24} />
            <span style={{
              fontFamily: MD_SF_BODY, fontWeight: 600, fontSize: 16,
              lineHeight: '21px', letterSpacing: '-0.32px', color: '#fff',
            }}>Create</span>
          </button>

          {/* Stats bar — node 511:22005: 3-col grid at top 478 */}
          <div style={{
            position: 'absolute', top: 478, left: 0, width: '100%',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            padding: 16,
          }}>
            {[
              { value: '236', label: 'Photos', info: false },
              { value: '21',  label: 'Hidden', info: true  },
              { value: '12',  label: 'Chapters', info: false },
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
