// screens/memory-create.jsx — Figma node 512:23583 "New user entrance - first entrance"
//
// "Create" screen: shown when the user taps the Create CTA in Memory Detail.
// Offers product types (Photo books, Wall decor, etc.) in a horizontal scroll
// row, followed by AI-generated collage suggestions.

const MC_TEACHERS = "'Teachers', var(--font-display)";
const MC_SF_DISP  = 'var(--font-display)';
const MC_SF_BODY  = 'var(--font)';

const MC_PRODUCTS = [
  { name: 'Photo books', price: '€ 14,99', img: '../shared/assets/create-photo-books.png' },
  { name: 'Wall decor',  price: '€ 14,99', img: '../shared/assets/create-wall-decor.png' },
  { name: 'Calendars',   price: '€ 14,99', img: '../shared/assets/create-calendars.png' },
  { name: 'Prints',      price: '€ 14,99', img: '../shared/assets/create-prints.png' },
  { name: 'Mugs',        price: '€ 14,99', img: '../shared/assets/create-mugs.png' },
  { name: 'Gifts',       price: '€ 14,99', img: '../shared/assets/create-calendars.png' },
];

const MC_COLLAGES = [
  { name: null,     price: null,          img: '../shared/assets/mem-collage-a.png' },
  { name: null,     price: null,          img: '../shared/assets/mem-collage-b.png' },
  { name: 'Square', price: 'From €24.99', img: '../shared/assets/mem-collage-c.png' },
];

const mcHRow = {
  display: 'flex', alignItems: 'flex-start',
  overflowX: 'auto', overflowY: 'hidden',
  scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
  padding: '0 20px',
};

function MemoryCreateScreen() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#F1F6F6' }}>
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
      }}>

        {/* ── Header: back button + "Create" heading ── */}
        <div style={{ position: 'relative' }}>

          {/* Back button — sits on light bg so no dark tint needed */}
          <button
            onClick={() => window.history.back()}
            {...press(0.95)}
            style={{
              position: 'absolute',
              top: 'max(72px, calc(env(safe-area-inset-top, 44px) + 28px))',
              left: 21,
              width: 40, height: 40, borderRadius: 20,
              background: 'none', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 8,
              WebkitTapHighlightColor: 'transparent',
              transition: 'transform 140ms ease',
            }}
          >
            <img src="../shared/assets/mem-icon-back.svg" alt="Back" width={24} height={24}
                 style={{ filter: 'brightness(0)' }} />
          </button>

          {/* "Create" heading — top 144px in Figma (56px status + 88px gap) */}
          <div style={{
            paddingTop: 'max(144px, calc(env(safe-area-inset-top, 44px) + 100px))',
            paddingLeft: 24, paddingRight: 24, paddingBottom: 16,
            display: 'flex', flexDirection: 'column', gap: 8,
          }}>
            <p style={{
              margin: 0,
              fontFamily: MC_TEACHERS, fontWeight: 700,
              fontSize: 42, lineHeight: '41px', letterSpacing: '-0.63px',
              color: '#003E47',
            }}>Create</p>
            <p style={{
              margin: 0,
              fontFamily: MC_SF_BODY, fontWeight: 400,
              fontSize: 17, lineHeight: '22px', letterSpacing: '-0.41px',
              color: '#007377',
            }}>with photos from Trip to Italy</p>
          </div>
        </div>

        {/* ── Product cards — horizontal scroll row ── */}
        <div style={{ ...mcHRow, gap: 8 }}>
          {MC_PRODUCTS.map((p, i) => (
            <div key={i} {...press(0.97)} style={{
              cursor: 'pointer', transition: 'transform 140ms ease',
              flexShrink: 0, width: 161,
              borderRadius: 16, overflow: 'hidden',
              background: '#fff',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* Product image: aspect 171/165 ≈ square-ish top portion */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '171 / 165', flexShrink: 0 }}>
                <img src={p.img} alt="" style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover', display: 'block',
                }} />
              </div>
              {/* Label + price */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '8px 16px 16px', textAlign: 'center', gap: 0,
              }}>
                <p style={{
                  margin: 0,
                  fontFamily: MC_SF_DISP, fontWeight: 600,
                  fontSize: 16, lineHeight: '20px', letterSpacing: '-0.16px',
                  color: '#333',
                }}>{p.name}</p>
                <p style={{
                  margin: 0,
                  fontFamily: MC_SF_BODY, fontWeight: 400,
                  fontSize: 13, lineHeight: '28px', letterSpacing: '-0.08px',
                  color: '#007377',
                }}>
                  from <strong style={{ fontWeight: 700 }}>{p.price}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Collages section ─────────────────────── */}
        <div style={{ padding: '0 24px', marginTop: 24 }}>
          <p style={{
            margin: 0,
            fontFamily: MC_SF_DISP, fontWeight: 700,
            fontSize: 22, lineHeight: '28px', letterSpacing: '0.35px',
            color: '#333',
          }}>Collages</p>
        </div>

        <div style={{ ...mcHRow, gap: 12, marginTop: 24 }}>
          {MC_COLLAGES.map((c, i) => (
            <div key={i} {...press(0.97)} style={{
              cursor: 'pointer', transition: 'transform 140ms ease',
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
                     position: 'absolute', right: 14, bottom: 14,
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
                    margin: '0 0 2px',
                    fontFamily: MC_SF_DISP, fontWeight: 700,
                    fontSize: 22, lineHeight: '28px', letterSpacing: '0.35px',
                    color: '#fff',
                  }}>{c.name}</p>
                  <p style={{
                    margin: 0,
                    fontFamily: MC_SF_BODY, fontSize: 13,
                    lineHeight: '18px', letterSpacing: '-0.08px',
                    color: 'rgba(250,250,250,0.9)',
                  }}>{c.price}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ height: 48 }} />
      </div>
    </div>
  );
}
