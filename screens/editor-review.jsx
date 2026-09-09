// screens/editor-review.jsx — Figma node 451:13721 "summary page / Your photo book"

const ER_A = '../shared/assets';
const ER_TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const ER_DISPLAY = '-apple-system, "SF Pro Display", system-ui, sans-serif';
const ER_TEACHERS = '"Teachers", -apple-system, system-ui, sans-serif';

const ADD_ON_CARDS = [
  { title: 'Matt pages',   photo: `${ER_A}/pb-review-pages-a.png` },
  { title: 'Glossy pages', photo: `${ER_A}/pb-review-pages-b.png` },
  { title: 'Square',       photo: `${ER_A}/pb-review-pages-b.png` },
];

function EditorReviewScreen() {
  return (
    <div style={{
      width: '100%', height: '100%', background: '#F1F6F6',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      <IOSStatusBar dark={false} />

      {/* Nav bar — in flow */}
      <div style={{
        position: 'relative', height: 56, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontFamily: ER_TEXT, fontSize: 17, fontWeight: 700, color: '#333' }}>
          Your photo book
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', paddingBottom: 120 }}>

        {/* Product summary card */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{
            background: '#fff', borderRadius: 24, overflow: 'hidden',
            display: 'flex', alignItems: 'stretch',
            boxShadow: '0 4px 16px -1px rgba(0,77,74,0.1)',
          }}>
            <img
              src={`${ER_A}/pb-review-thumb.png`}
              alt=""
              style={{ width: 114, height: 162, objectFit: 'cover', flexShrink: 0, display: 'block' }}
            />
            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
              <p style={{
                fontFamily: ER_TEXT, fontSize: 17, fontWeight: 600, color: '#333',
                lineHeight: '22px', letterSpacing: '-0.41px', margin: 0,
              }}>
                Large Landscape<br/>Hardcover with Layflat
              </p>
              <p style={{
                fontFamily: ER_TEXT, fontSize: 13, fontWeight: 400, color: '#333',
                lineHeight: '18px', letterSpacing: '-0.08px', margin: 0,
              }}>
                29 x 21 cm
              </p>
              <p style={{
                fontFamily: ER_DISPLAY, fontSize: 20, fontWeight: 600, color: '#007377',
                lineHeight: '24px', letterSpacing: '0.38px', margin: 0,
              }}>
                €44.99
              </p>
            </div>
          </div>
        </div>

        {/* Add-on section */}
        <div style={{ padding: '32px 24px 0' }}>
          <p style={{
            fontFamily: ER_DISPLAY, fontSize: 22, fontWeight: 700, color: '#333',
            letterSpacing: '0.35px', lineHeight: '28px', margin: '0 0 24px',
          }}>Add-on</p>

          {/* Horizontal card row — bleeds to edges */}
          <div style={{
            display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none',
            marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24,
            paddingBottom: 20,
          }}>
            {ADD_ON_CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  flexShrink: 0, width: 245, height: 304, borderRadius: 20,
                  overflow: 'hidden', border: '1px solid white', position: 'relative',
                  boxShadow: '0 4px 4px -4px rgba(0,0,0,0.25)',
                  cursor: 'pointer', transition: 'transform 140ms ease',
                }}
                onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
                onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img
                  src={card.photo}
                  alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <img
                  src={`${ER_A}/pb-review-radio.svg`}
                  alt=""
                  style={{ position: 'absolute', top: 16, left: 16, width: 32, height: 32 }}
                />
                <img
                  src={`${ER_A}/pb-review-info.svg`}
                  alt=""
                  style={{ position: 'absolute', bottom: 88, right: 14, width: 32, height: 32, mixBlendMode: 'soft-light' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '32px 20px 24px',
                  backdropFilter: 'blur(25px)',
                  WebkitBackdropFilter: 'blur(25px)',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 100%)',
                }}>
                  <p style={{
                    fontFamily: ER_DISPLAY, fontSize: 22, fontWeight: 700,
                    color: '#fff', letterSpacing: '0.35px', lineHeight: '28px',
                    margin: '0 0 2px', textShadow: '0 0 2px rgba(0,0,0,0.25)',
                  }}>{card.title}</p>
                  <p style={{
                    fontFamily: ER_TEXT, fontSize: 13, fontWeight: 400,
                    color: '#fafafa', letterSpacing: '-0.08px', lineHeight: '18px', margin: 0,
                  }}>From €24.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Back button — top:62 = IOSStatusBar height */}
      <button
        onClick={() => window.navigation.pop()}
        onPointerDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
        onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
        onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        style={{
          position: 'absolute', left: 15, top: 62,
          padding: 8, borderRadius: 20,
          background: 'rgba(255,255,255,0.01)', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'transform 140ms ease',
          WebkitTapHighlightColor: 'transparent', zIndex: 3,
        }}
      >
        <img src={`${ER_A}/pb-icon-back-teal.svg`} alt="" width={24} height={24} style={{ display: 'block' }} />
      </button>

      {/* Fixed CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: `24px 24px calc(24px + env(safe-area-inset-bottom, 0px))`,
        background: 'rgba(255,255,255,0.01)',
      }}>
        <button
          onClick={() => window.navigation.push('basket.html')}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            width: '100%', height: 72, borderRadius: 32,
            background: '#007377', border: '1px solid rgba(255,255,255,0.11)',
            color: '#fff', fontFamily: ER_TEACHERS, fontSize: 18, fontWeight: 600,
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.55)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, transition: 'transform 140ms ease',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <img src={`${ER_A}/pb-review-basket.svg`} alt="" width={24} height={24} style={{ filter: 'brightness(0) invert(1)', display: 'block' }} />
          Add to Basket
        </button>
      </div>
    </div>
  );
}
