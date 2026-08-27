// screens/home.jsx

function HomeScreen() {
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:'#F1F6F6' }}>
      {/* Scrollable content — sits above tab bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        bottom: 'calc(49px + env(safe-area-inset-bottom, 0px))',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        // Explicit stacking context: lets the wash sit at z-index -1 *inside* the
        // scroller, above its own background but below every in-flow section.
        isolation: 'isolate',
      }}>
        {/* Brand wash — Figma node 451:13863: 390×429 at the top, same stop list
            as splash/onboarding but centred on the top-left corner (6, 0), so the
            deep teal sits in the corner and fades away across and down the header.
            It lives INSIDE the scroller: as a child of the screen root it stayed
            pinned to the viewport and read as sticky. Absolute children of a
            scroll container scroll with its content (unlike position:fixed). */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 429,
          background: 'radial-gradient(702.33% 98.14% at 1.54% 0%, var(--pb-wash-stops))',
          pointerEvents: 'none', zIndex: -1,
        }} />

        {/* Header — Figma node 451:13865. Container 451:13864 pads pt56/px20 and
            carries a backdrop-blur; the blur is skipped here because the only
            thing behind it is the smooth wash, where it is a no-op that would
            cost a stacking context. */}
        <div style={{
          position: 'relative',
          padding: '0 20px',
          paddingTop: 'max(56px, calc(env(safe-area-inset-top, 44px) + 12px))',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <PhotoboxLogo scale={2 / 3} />
          <GlassIconButton label="Notifications">
            <img src="../shared/assets/icon-notification.svg" alt=""
                 width={24} height={24} style={{ display: 'block' }} />
          </GlassIconButton>
        </div>

        {/* Glass cards — Figma nodes 451:13876/13877: 267×136, r24, white hairline,
            white radial fill at 90%. Content for these comes later. */}
        <div style={{
          position: 'relative',
          display: 'flex', gap: 8, alignItems: 'center',
          // overflow-x:auto forces overflow-y to compute to auto/hidden — it cannot
          // be visible — so the cards' shadow needs room *inside* the padding box
          // or it gets clipped at the bottom edge. 20px covers the shadow's reach
          // (offset 4 + blur 16 - spread 1); marginBottom drops to 4 to keep the
          // 24px gap to the Create section.
          padding: '24px 20px 20px', marginBottom: 4,
          overflowX: 'auto', overflowY: 'hidden',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              flex: '0 0 auto', width: 267, height: 136, borderRadius: 24,
              border: '1px solid #FFFFFF',
              boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1)',
              // Figma fills at 90% opacity; folded into the stops so the hairline
              // border stays fully opaque.
              background: 'radial-gradient(92.88% 65.46% at 47.94% -27.94%,' +
                          ' rgba(255,255,255,0.432) 0%, rgba(255,255,255,0.9) 100%)',
            }} />
          ))}
        </div>

        {/* Create — Figma node 367:6068 */}
        <CreateSection />

        {/* Featured projects */}
        <FeaturedSection />

        {/* Memories carousel */}
        <MemoriesSection />

        {/* Ideas grid */}
        <IdeasSection />

        {/* Bottom padding */}
        <div style={{ height: 24 }} />
      </div>

      {/* Tab bar */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// Create section — Figma node 367:6068 (title 378:6773 + grid 367:6472).
// Section: 350 wide inside the page's 20px gutters, py 16, 16px gap to the grid.
// Grid: 2 equal columns, 12px gaps → cards are (350-12)/2 = 169 wide at 390.
const CREATE_CARDS = [
  { id: 'photobooks', title: 'Photo books', from: '\u20AC 14,99', img: 'create-photo-books.png' },
  { id: 'walldecor',  title: 'Wall decor',  from: '\u20AC 14,99', img: 'create-wall-decor.png' },
  { id: 'calendars',  title: 'Calendars',   from: '\u20AC 14,99', img: 'create-calendars.png', inset: true },
  { id: 'prints',     title: 'Prints',      from: '\u20AC 14,99', img: 'create-prints.png' },
  { id: 'mugs',       title: 'Mugs',        from: '\u20AC 14,99', img: 'create-mugs.png' },
  // Figma reuses the calendars artwork for Gifts (both point at the same fill).
  { id: 'gifts',      title: 'Gifts',       from: '\u20AC 14,99', img: 'create-calendars.png', inset: true },
];

function CreateSection() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 16,
      padding: '16px 20px', boxSizing: 'border-box',
    }}>
      <p style={{
        margin: 0, width: '100%',
        fontFamily: PB_DISPLAY, fontWeight: 700, fontSize: 24,
        lineHeight: '40px', letterSpacing: '-0.24px',
        color: 'var(--colour-foreground-fg-black, #333)',
      }}>
        Create
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 12,
      }}>
        {CREATE_CARDS.map(c => <CreateCard key={c.id} {...c} />)}
      </div>
    </div>
  );
}

// Card — Figma component 367:6422: white, r16, clipped; image box is a 171:165
// aspect strip, then a fixed 64px caption block padded 16 at the sides and bottom.
function CreateCard({ id, title, from, img, inset }) {
  // Only photo books has a destination in the prototype so far.
  const onOpen = () => {
    if (id === 'photobooks') window.navigation.push('product-photobook.html');
  };
  return (
    <button
      onClick={onOpen}
      onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.97)'; }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      onPointerLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      style={{
        background: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
        // Not in the Figma card component (367:6422) — its gaps render as flat
        // #F1F6F6 with no falloff at any edge. This is the same card shadow the
        // design uses on the top banners (404:6794) and the Ideas cards (367:6246).
        boxShadow: '0px 4px 16px -1px rgba(0,77,74,0.1)',
        border: 'none', padding: 0, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transition: 'transform 140ms ease', textAlign: 'center',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* image — node 367:6386 */}
      <div style={{
        position: 'relative', width: '100%', aspectRatio: '171 / 165',
        overflow: 'hidden', flexShrink: 0,
      }}>
        <img
          src={`../shared/assets/${img}`}
          alt=""
          style={inset
            // Figma places this fill at a sub-rect rather than filling the box.
            ? { position: 'absolute', left: '14.04%', top: '12.58%',
                width: '71.93%', height: '74.84%', display: 'block' }
            : { position: 'absolute', inset: 0, width: '100%', height: '100%',
                objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* caption — node 367:6408 */}
      <div style={{
        width: '100%', height: 64, boxSizing: 'border-box', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '0 16px 16px',
      }}>
        <p style={{
          margin: 0, width: '100%',
          fontFamily: PB_DISPLAY, fontWeight: 600, fontSize: 16,
          lineHeight: '20px', letterSpacing: '-0.16px',
          color: 'var(--colour-foreground-fg-black, #333)',
        }}>{title}</p>
        <p style={{
          margin: 0, width: '100%',
          fontFamily: '-apple-system, "SF Pro Text", system-ui, sans-serif',
          fontSize: 13, lineHeight: '28px',
          color: 'var(--colour-foreground-fg-secondary, #007377)',
        }}>
          <span style={{ fontWeight: 510 }}>from </span>
          <span style={{ fontWeight: 700 }}>{from}</span>
        </p>
      </div>
    </button>
  );
}

function FeaturedSection() {
  const { featuredProjects } = window.MOCK;
  return (
    <div style={{ margin: '20px 16px 0' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#000', letterSpacing: '-0.3px', marginBottom: 12 }}>
        Your projects
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {featuredProjects.map(proj => (
          <div
            key={proj.id}
            onClick={() => window.navigation.push('product-photobook.html')}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: 14, background: 'var(--color-surface)', borderRadius: 16,
              cursor: 'pointer', transition: 'transform 140ms ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
            }}
          >
            <img src={proj.thumb} alt={proj.title} style={{ width: 64, height: 48, borderRadius: 10, objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 17, color: '#000' }}>{proj.title}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>{proj.subtitle}</div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
              <path d="M1 1l6 6-6 6" stroke="rgba(60,60,67,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoriesSection() {
  const { memories } = window.MOCK;
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ padding: '0 16px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#000', letterSpacing: '-0.3px' }}>Memories</span>
        <span style={{ fontSize: 15, color: 'var(--color-primary)', fontWeight: 600 }}>See all</span>
      </div>
      <div style={{
        display: 'flex', gap: 10,
        overflowX: 'auto', scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        padding: '0 16px 4px',
      }}>
        {memories.map(m => (
          <div
            key={m.id}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            style={{
              flexShrink: 0, width: 140, borderRadius: 16, overflow: 'hidden',
              position: 'relative', aspectRatio: '3/4', background: '#ddd',
              cursor: 'pointer', transition: 'transform 140ms ease',
            }}
          >
            <img src={m.thumb} alt={m.title} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)',
            }} />
            <div style={{ position: 'absolute', bottom: 10, left: 10, color: '#fff' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{m.title}</div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>{m.count} photos</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IdeasSection() {
  const ideas = [
    { seed: 'idea1', label: 'Summer vibes' },
    { seed: 'idea2', label: 'Family moments' },
    { seed: 'idea3', label: 'Travel memories' },
    { seed: 'idea4', label: 'Pet portraits' },
  ];
  return (
    <div style={{ margin: '24px 16px 0' }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#000', letterSpacing: '-0.3px', marginBottom: 12 }}>
        Ideas for you
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ideas.map(i => (
          <div
            key={i.seed}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            style={{
              borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '4/3',
              cursor: 'pointer', transition: 'transform 140ms ease',
            }}
          >
            <img
              src={`https://picsum.photos/seed/${i.seed}/280/210`}
              alt={i.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              padding: '20px 10px 10px',
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.6))',
            }}>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{i.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabBar({ activeTab, onTabChange }) {
  const TABS = [
    { id: 'home',    label: 'Home',      Icon: HomeIcon },
    { id: 'create',  label: 'Create',    Icon: CreateIcon },
    { id: 'photos',  label: 'My Photos', Icon: PhotosIcon },
    { id: 'account', label: 'Account',   Icon: AccountIcon },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      height: 'calc(49px + env(safe-area-inset-bottom, 0px))',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: 'rgba(249,249,249,0.78)',
      borderTop: '0.5px solid rgba(0,0,0,0.12)',
      display: 'flex', alignItems: 'flex-start',
      zIndex: 50,
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => {
            onTabChange(tab.id);
            if (tab.id === 'account') window.navigation.push('account.html');
            if (tab.id === 'photos') window.navigation.push('../image-picker/index.html');
          }}
          onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            flex: 1, height: 49, border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
            transition: 'transform 140ms ease',
          }}
        >
          <tab.Icon active={activeTab === tab.id} />
          <span style={{
            fontSize: 10, fontWeight: activeTab === tab.id ? 600 : 400,
            color: activeTab === tab.id ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)',
          }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Inline tab icons (SVG)
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
      fill={active ? 'var(--color-primary)' : 'none'}
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'}
      strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);
const CreateIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8"/>
    <path d="M12 8V16M8 12H16"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const PhotosIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="5" width="18" height="14" rx="2"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8"/>
    <circle cx="8.5" cy="9.5" r="1.5"
      fill={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'}/>
    <path d="M3 15L7 11L11 15L15 10L21 16"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);
const AccountIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8"/>
    <path d="M4 20C4 17 7.6 14.5 12 14.5C16.4 14.5 20 17 20 20"
      stroke={active ? 'var(--color-primary)' : 'rgba(60,60,67,0.5)'} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
