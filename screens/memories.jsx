// screens/memories.jsx — Figma node 509:20419 "New user entrance - first entrance"

const MEM_DISPLAY = "'Teachers', var(--font-display)";
const MEM_SF_DISPLAY = 'var(--font-display)';
const MEM_SF_BODY = 'var(--font)';

// ─── Featured albums (large horizontal tiles) ────────────────
const FEATURED_ALBUMS = [
  { title: 'Trip to Italy',  date: '12–21 July, 2025', count: null, img: '../shared/assets/mem-tile-italy.jpg' },
  { title: 'Italy 2025',     date: null,               count: 645,  img: '../shared/assets/mem-tile-italy2.jpg' },
];

// ─── Short trips ─────────────────────────────────────────────
const SHORT_TRIPS = [
  { title: 'Dusseldorf',          date: '21 July, 2025', count: null, img: '../shared/assets/mem-tile-dusseldorf.jpg' },
  { title: 'Paris',               date: '21 July, 2025', count: null, img: '../shared/assets/photos/mock-02.webp' },
  { title: 'Germany 2024',        date: '21 July, 2025', count: null, img: '../shared/assets/mem-tile-germany.jpg' },
  { title: 'Spain 2023',          date: null,            count: 313,  img: '../shared/assets/photos/mock-03.webp' },
  { title: 'United Kingdom 2022', date: null,            count: 425,  img: '../shared/assets/photos/mock-04.webp' },
  { title: '+ 22', overflow: true },
];

// ─── Monthly recap ───────────────────────────────────────────
const MONTHLY_RECAPS = [
  { label: 'August 2026', photos: ['../shared/assets/photos/mock-05.webp','../shared/assets/photos/mock-06.webp','../shared/assets/photos/mock-07.webp','../shared/assets/photos/mock-08.webp'] },
  { label: 'July 2026',   photos: ['../shared/assets/photos/mock-09.webp','../shared/assets/photos/mock-10.webp','../shared/assets/photos/mock-11.webp','../shared/assets/photos/mock-12.webp'] },
  { label: 'June 2026',   photos: ['../shared/assets/photos/mock-13.webp','../shared/assets/photos/mock-14.webp','../shared/assets/photos/mock-15.webp','../shared/assets/photos/mock-16.webp'] },
  { label: 'May 2026',    photos: ['../shared/assets/photos/mock-17.webp','../shared/assets/photos/mock-18.webp','../shared/assets/photos/mock-19.webp','../shared/assets/photos/mock-20.webp'] },
];

// ─── Collages ────────────────────────────────────────────────
const COLLAGES = [
  { name: null,     price: null,        img: '../shared/assets/mem-collage-a.png' },
  { name: null,     price: null,        img: '../shared/assets/mem-collage-b.png' },
  { name: 'Square', price: 'From €24.99', img: '../shared/assets/mem-collage-c.png' },
];

// ─────────────────────────────────────────────────────────────
// Photo stack — fanned pile of 4 photos for Monthly Recap
// Rotations and offsets from Figma node 510:21462 siblings.
// ─────────────────────────────────────────────────────────────
function PhotoStack({ photos }) {
  const ROTS = [-8, -2, 4, 10];
  const POS  = [
    { left: 5,  top: 13 },
    { left: 15, top: 12 },
    { left: 22, top: 10 },
    { left: 26, top: 6  },
  ];
  return (
    <div style={{ position: 'relative', width: 142, height: 136, flexShrink: 0 }}>
      {photos.map((src, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: POS[i].left,
          top:  POS[i].top,
          width: 99, height: 99,
          borderRadius: 8,
          transform: `rotate(${ROTS[i]}deg)`,
          transformOrigin: 'center',
          border: '0.7px solid rgba(255,255,255,0.5)',
          boxShadow: '0 1.42px 2.84px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          background: '#d9d9d9',
        }}>
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MemoriesScreen
// ─────────────────────────────────────────────────────────────
function MemoriesScreen() {
  const [activeTab, setActiveTab] = React.useState('memories');

  const hScroll = {
    display: 'flex', gap: 12, alignItems: 'flex-start',
    overflowX: 'auto', overflowY: 'hidden',
    scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
    padding: '0 20px',
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#F1F6F6' }}>
      {/* Scrollable content */}
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
        isolation: 'isolate',
      }}>
        {/* Teal wash — same gradient as home */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 429,
          background: 'radial-gradient(702.33% 98.14% at 1.54% 0%, var(--pb-wash-stops))',
          pointerEvents: 'none', zIndex: -1,
        }} />

        {/* ── Header ──────────────────────────────────────────── */}
        {/* node 509:20422: sticky title "Memories" in Teachers Bold 42px */}
        <div style={{
          paddingTop: 'max(56px, calc(env(safe-area-inset-top, 44px) + 12px))',
          padding: '0 20px',
          paddingTop: 'max(56px, calc(env(safe-area-inset-top, 44px) + 12px))',
          paddingBottom: 16,
        }}>
          <p style={{
            margin: 0,
            fontFamily: MEM_DISPLAY, fontWeight: 700, fontSize: 42,
            lineHeight: '41px', letterSpacing: '-0.63px',
            color: 'var(--colour-foreground-fg-black, #333)',
          }}>Memories</p>
        </div>

        {/* ── Featured album tiles ─────────────────────────────── */}
        {/* node 509:20432: horizontal scroll of 283×344 rounded-32 cards */}
        <div style={{ ...hScroll, gap: 16, alignItems: 'stretch', marginBottom: 24 }}>
          {FEATURED_ALBUMS.map((a, i) => (
            <div key={i} style={{
              position: 'relative', flexShrink: 0,
              width: 283, height: 344, borderRadius: 32,
              overflow: 'hidden', border: '1px solid #f4f4f4',
            }}>
              <img src={a.img} alt="" style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', display: 'block', borderRadius: 32,
              }} />
              {/* Gradient overlay footer */}
              <div style={{
                position: 'absolute', left: -1, right: -1, bottom: -1.32,
                height: 170,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: a.date ? 8 : 4, padding: '20px 12px',
              }}>
                <p style={{
                  margin: 0, textAlign: 'center', width: '100%',
                  fontFamily: MEM_SF_DISPLAY, fontWeight: 700,
                  fontSize: a.date ? 28 : 22,
                  lineHeight: a.date ? '34px' : '28px',
                  letterSpacing: a.date ? '0.36px' : '0.35px',
                  color: '#fff',
                }}>{a.title}</p>
                {a.date && (
                  <p style={{
                    margin: 0, fontFamily: MEM_SF_BODY, fontSize: 13,
                    lineHeight: '18px', letterSpacing: '-0.078px',
                    color: '#fff', whiteSpace: 'nowrap',
                  }}>{a.date}</p>
                )}
                {a.count && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <img src="../shared/assets/hb-icon-memories.svg" alt="" width={16} height={16} />
                    <p style={{
                      margin: 0, fontFamily: MEM_SF_BODY, fontSize: 13,
                      lineHeight: '18px', letterSpacing: '-0.078px',
                      color: '#fff', whiteSpace: 'nowrap',
                    }}>{a.count}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Short trips and occasions ────────────────────────── */}
        {/* node 510:21404: section header + horizontal scroll of 184×184 tiles */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ padding: '16px 20px 16px' }}>
            <p style={{
              margin: 0,
              fontFamily: MEM_SF_DISPLAY, fontWeight: 700, fontSize: 24,
              lineHeight: '40px', letterSpacing: '-0.24px',
              color: 'var(--colour-foreground-fg-black, #333)', whiteSpace: 'nowrap',
            }}>Short trips and occasions</p>
          </div>
          <div style={{ ...hScroll }}>
            {SHORT_TRIPS.map((t, i) => (
              t.overflow ? (
                <div key={i} style={{
                  flexShrink: 0, width: 184, height: 184, borderRadius: 24,
                  background: '#eee', border: '1px solid #f4f4f4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <p style={{
                    margin: 0, fontFamily: MEM_SF_DISPLAY, fontWeight: 700,
                    fontSize: 28, lineHeight: '34px', letterSpacing: '0.36px',
                    color: 'var(--colour-foreground-fg-black, #333)',
                  }}>{t.title}</p>
                </div>
              ) : (
                <div key={i} style={{
                  position: 'relative', flexShrink: 0,
                  width: 184, height: 184, borderRadius: 24,
                  overflow: 'hidden', border: '1px solid #f4f4f4',
                }}>
                  <img src={t.img} alt="" style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                  }} />
                  <div style={{
                    position: 'absolute', left: -1, right: -1, bottom: -1,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
                    padding: 12, display: 'flex', flexDirection: 'column', gap: 4,
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <p style={{
                      margin: 0, textAlign: 'center', width: '100%',
                      fontFamily: MEM_SF_BODY, fontWeight: 600, fontSize: 17,
                      lineHeight: '22px', letterSpacing: '-0.41px', color: '#fff',
                    }}>{t.title}</p>
                    {t.date && (
                      <p style={{
                        margin: 0, fontFamily: MEM_SF_BODY, fontSize: 13,
                        lineHeight: '18px', letterSpacing: '-0.078px',
                        color: '#fff', textAlign: 'center', whiteSpace: 'nowrap',
                      }}>{t.date}</p>
                    )}
                    {t.count && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', width: '100%' }}>
                        <img src="../shared/assets/hb-icon-memories.svg" alt="" width={16} height={16} />
                        <p style={{
                          margin: 0, fontFamily: MEM_SF_BODY, fontSize: 13,
                          lineHeight: '18px', letterSpacing: '-0.078px',
                          color: '#fff', whiteSpace: 'nowrap',
                        }}>{t.count}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* ── Monthly recap ────────────────────────────────────── */}
        {/* node 510:21456: fanned photo stacks labelled by month */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ padding: '16px 20px 16px' }}>
            <p style={{
              margin: 0,
              fontFamily: MEM_SF_DISPLAY, fontWeight: 600, fontSize: 20,
              lineHeight: '24px', letterSpacing: '0.38px',
              color: 'var(--colour-foreground-fg-black, #333)', whiteSpace: 'nowrap',
            }}>Monthly recap</p>
          </div>
          <div style={{ ...hScroll, gap: 24, alignItems: 'flex-start' }}>
            {MONTHLY_RECAPS.map((m, i) => (
              <div key={i} style={{
                flexShrink: 0, width: 142,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <PhotoStack photos={m.photos} />
                <p style={{
                  margin: 0, fontFamily: MEM_SF_BODY, fontWeight: 600, fontSize: 15,
                  lineHeight: '16px', letterSpacing: '-0.408px',
                  color: 'var(--colour-foreground-fg-black, #333)', whiteSpace: 'nowrap',
                }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Collages ──────────────────────────────────────────── */}
        {/* node 514:24183: horizontal scroll of 245×303 product cards */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ padding: '16px 20px 16px' }}>
            <p style={{
              margin: 0,
              fontFamily: MEM_SF_DISPLAY, fontWeight: 700, fontSize: 22,
              lineHeight: '28px', letterSpacing: '0.35px',
              color: 'var(--colour-foreground-fg-black, #333)', whiteSpace: 'nowrap',
            }}>Collages</p>
          </div>
          <div style={{ ...hScroll }}>
            {COLLAGES.map((c, i) => (
              <div key={i} style={{
                position: 'relative', flexShrink: 0,
                width: 245, height: 304, borderRadius: 20,
                overflow: 'hidden', border: '1px solid #fff',
                boxShadow: '0 4px 4px -4px rgba(0,0,0,0.25)',
                background: '#f1f5f6',
              }}>
                <img src={c.img} alt="" style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                }} />
                {/* Info icon — node 514:24197 */}
                <img src="../shared/assets/mem-icon-info.svg" alt=""
                     width={32} height={32} style={{
                       position: 'absolute', right: 14, bottom: 51,
                       display: 'block', mixBlendMode: 'soft-light',
                     }} />
                {c.name && (
                  <div style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
                    backdropFilter: 'blur(25px)',
                    WebkitBackdropFilter: 'blur(25px)',
                    padding: '32px 20px 24px',
                  }}>
                    <p style={{
                      margin: '0 0 2px', fontFamily: MEM_SF_DISPLAY, fontWeight: 700,
                      fontSize: 22, lineHeight: '28px', letterSpacing: '0.35px',
                      color: '#fff', filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.25))',
                    }}>{c.name}</p>
                    <p style={{
                      margin: 0, fontFamily: MEM_SF_BODY, fontSize: 13,
                      lineHeight: '18px', letterSpacing: '-0.08px',
                      color: 'rgba(250,250,250,0.9)',
                    }}>{c.price}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Spacer for floating tab bar */}
        <div style={{ height: `calc(8px + ${TAB_BAR_HEIGHT})` }} />
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
