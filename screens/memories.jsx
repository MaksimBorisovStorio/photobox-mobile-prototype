// screens/memories.jsx — Figma node 509:20419

const MEM_TEACHERS = "'Teachers', var(--font-display)";
const MEM_SF_DISP  = 'var(--font-display)';
const MEM_SF_BODY  = 'var(--font)';

// Horizontal scroll row — breaks out of the 20px gutter so cards
// start at 20px but the row itself can scroll edge-to-edge.
const hRow = {
  display: 'flex', alignItems: 'flex-start',
  overflowX: 'auto', overflowY: 'hidden',
  scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
  padding: '0 20px',
};

// ─── Data ──────────────────────────────────────────────────────
const FEATURED = [
  { title: 'Trip to Italy',  sub: '12–21 July, 2025', count: null, img: '../shared/assets/mem-tile-italy.jpg' },
  { title: 'Italy 2025',     sub: null,               count: 645,  img: '../shared/assets/mem-tile-italy2.jpg' },
];

const SHORT_TRIPS = [
  { title: 'Dusseldorf',          sub: '21 July, 2025', img: '../shared/assets/mem-tile-dusseldorf.jpg' },
  { title: 'Paris',               sub: '21 July, 2025', img: '../shared/assets/photos/mock-02.webp' },
  { title: 'Germany 2024',        sub: '21 July, 2025', img: '../shared/assets/mem-tile-germany.jpg' },
  { title: 'Spain 2023',          count: 313,           img: '../shared/assets/photos/mock-03.webp' },
  { title: 'United Kingdom 2022', count: 425,           img: '../shared/assets/photos/mock-04.webp' },
  { overflow: true },
];

const MONTHLY = [
  { label: 'August 2026', photos: ['../shared/assets/photos/mock-05.webp','../shared/assets/photos/mock-06.webp','../shared/assets/photos/mock-07.webp','../shared/assets/photos/mock-08.webp'] },
  { label: 'July 2026',   photos: ['../shared/assets/photos/mock-09.webp','../shared/assets/photos/mock-10.webp','../shared/assets/photos/mock-11.webp','../shared/assets/photos/mock-12.webp'] },
  { label: 'June 2026',   photos: ['../shared/assets/photos/mock-13.webp','../shared/assets/photos/mock-14.webp','../shared/assets/photos/mock-15.webp','../shared/assets/photos/mock-16.webp'] },
  { label: 'May 2026',    photos: ['../shared/assets/photos/mock-17.webp','../shared/assets/photos/mock-18.webp','../shared/assets/photos/mock-19.webp','../shared/assets/photos/mock-20.webp'] },
];

const COLLAGES = [
  { name: null,     price: null,          img: '../shared/assets/mem-collage-a.png' },
  { name: null,     price: null,          img: '../shared/assets/mem-collage-b.png' },
  { name: 'Square', price: 'From €24.99', img: '../shared/assets/mem-collage-c.png' },
];

// ─── Photo stack — fanned pile of 4 photos (Monthly Recap) ────
// Rotation/offset values from Figma node 510:21462 and siblings.
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
          left: POS[i].left, top: POS[i].top,
          width: 99, height: 99,
          borderRadius: 8,
          transform: `rotate(${ROTS[i]}deg)`,
          border: '0.7px solid rgba(255,255,255,0.5)',
          boxShadow: '0 1.42px 2.84px rgba(0,0,0,0.25)',
          overflow: 'hidden', background: '#d9d9d9',
        }}>
          <img src={src} alt=""
               style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      ))}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────
function MemSectionHeader({ title, size = 24, weight = 700, tracking = '-0.24px' }) {
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <p style={{
        margin: 0,
        fontFamily: MEM_SF_DISP, fontWeight: weight,
        fontSize: size, lineHeight: size === 20 ? '24px' : '40px',
        letterSpacing: tracking,
        color: 'var(--colour-foreground-fg-black, #333)',
        whiteSpace: 'nowrap',
      }}>{title}</p>
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────
function MemoriesScreen() {
  const [activeTab, setActiveTab] = React.useState('memories');

  // Gradient overlay on the bottom portion of photo tiles.
  const tileOverlay = (height) => ({
    position: 'absolute', left: -1, right: -1, bottom: -1,
    height,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'flex-end',
    padding: '0 12px 12px',
    gap: 4,
  });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#F1F6F6' }}>
      {/* Scrollable content — no teal wash on this screen */}
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>

        {/* ── "Memories" heading ────────────────────────── */}
        {/* pt-[88px] in Figma: 44px status bar + 44px gap */}
        <div style={{ padding: `max(88px, calc(env(safe-area-inset-top, 44px) + 44px)) 20px 0` }}>
          <p style={{
            margin: 0,
            fontFamily: MEM_TEACHERS, fontWeight: 700, fontSize: 42,
            lineHeight: '41px', letterSpacing: '-0.63px',
            color: 'var(--colour-foreground-fg-black, #333)',
          }}>Memories</p>
        </div>

        {/* ── Featured albums — 283×344 horizontal scroll ── */}
        {/* gap-[24px] from Figma's flex column, then gap-[16px] between cards */}
        <div style={{ ...hRow, gap: 16, marginTop: 24 }}>
          {FEATURED.map((a, i) => (
            <div key={i} style={{
              position: 'relative', flexShrink: 0,
              width: 283, height: 344, borderRadius: 32,
              overflow: 'hidden', border: '1px solid #f4f4f4',
            }}>
              <img src={a.img} alt="" style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
              }} />
              <div style={tileOverlay(170)}>
                <p style={{
                  margin: 0, textAlign: 'center', width: '100%',
                  fontFamily: MEM_SF_DISP, fontWeight: 700,
                  fontSize: a.sub ? 28 : 22,
                  lineHeight: a.sub ? '34px' : '28px',
                  letterSpacing: a.sub ? '0.36px' : '0.35px',
                  color: '#fff',
                }}>{a.title}</p>
                {a.sub && (
                  <p style={{
                    margin: 0, fontFamily: MEM_SF_BODY, fontSize: 13,
                    lineHeight: '18px', letterSpacing: '-0.078px',
                    color: '#fff', whiteSpace: 'nowrap',
                  }}>{a.sub}</p>
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

        {/* ── Short trips and occasions — 184×184 tiles ─── */}
        <MemSectionHeader title="Short trips and occasions" />
        <div style={{ ...hRow, gap: 12, marginTop: 16 }}>
          {SHORT_TRIPS.map((t, i) => (
            t.overflow
              ? (
                <div key={i} style={{
                  flexShrink: 0, width: 184, height: 184, borderRadius: 24,
                  background: '#eee', border: '1px solid #f4f4f4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <p style={{
                    margin: 0, fontFamily: MEM_SF_DISP, fontWeight: 700,
                    fontSize: 28, lineHeight: '34px', letterSpacing: '0.36px',
                    color: 'var(--colour-foreground-fg-black, #333)',
                  }}>+ 22</p>
                </div>
              ) : (
                <div key={i} style={{
                  position: 'relative', flexShrink: 0,
                  width: 184, height: 184, borderRadius: 24,
                  overflow: 'hidden', border: '1px solid #f4f4f4',
                }}>
                  <img src={t.img} alt="" style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'cover', display: 'block',
                  }} />
                  <div style={tileOverlay(100)}>
                    <p style={{
                      margin: 0, textAlign: 'center', width: '100%',
                      fontFamily: MEM_SF_BODY, fontWeight: 600, fontSize: 17,
                      lineHeight: '22px', letterSpacing: '-0.41px', color: '#fff',
                    }}>{t.title}</p>
                    {t.sub && (
                      <p style={{
                        margin: 0, fontFamily: MEM_SF_BODY, fontSize: 13,
                        lineHeight: '18px', letterSpacing: '-0.078px',
                        color: '#fff', whiteSpace: 'nowrap',
                      }}>{t.sub}</p>
                    )}
                    {t.count && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
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

        {/* ── Monthly recap — fanned photo stacks ───────── */}
        <MemSectionHeader title="Monthly recap" size={20} weight={600} tracking="0.38px" />
        <div style={{ ...hRow, gap: 24, alignItems: 'flex-start', marginTop: 16 }}>
          {MONTHLY.map((m, i) => (
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

        {/* ── Collages — 245×304 product cards ─────────── */}
        <MemSectionHeader title="Collages" size={22} weight={700} tracking="0.35px" />
        <div style={{ ...hRow, gap: 12, marginTop: 16, marginBottom: 0 }}>
          {COLLAGES.map((c, i) => (
            <div key={i} style={{
              position: 'relative', flexShrink: 0,
              width: 245, height: 304, borderRadius: 20,
              overflow: 'hidden', border: '1px solid #fff',
              boxShadow: '0 4px 4px -4px rgba(0,0,0,0.25)',
              background: '#f1f5f6',
            }}>
              <img src={c.img} alt="" style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
              }} />
              <img src="../shared/assets/mem-icon-info.svg" alt=""
                   width={32} height={32} style={{
                     position: 'absolute', right: 14, top: 14,
                     display: 'block', mixBlendMode: 'soft-light',
                   }} />
              {c.name && (
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  padding: '32px 20px 24px',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                }}>
                  <p style={{
                    margin: '0 0 2px', fontFamily: MEM_SF_DISP, fontWeight: 700,
                    fontSize: 22, lineHeight: '28px', letterSpacing: '0.35px', color: '#fff',
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

        {/* Spacer for floating tab bar */}
        <div style={{ height: `calc(24px + ${TAB_BAR_HEIGHT})` }} />
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
