// screens/home.jsx

function HomeScreen() {
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <div style={{ width:'100%', height:'100%', position:'relative', background:'var(--color-bg)' }}>
      {/* Scrollable content — sits above tab bar */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        bottom: 'calc(49px + env(safe-area-inset-bottom, 0px))',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}>
        {/* Status bar spacer */}
        <div style={{ height: 'calc(env(safe-area-inset-top, 44px) + 12px)' }} />

        {/* Large title */}
        <div style={{
          padding: '4px 16px 0',
          fontFamily: '-apple-system, "SF Pro Display", system-ui',
          fontSize: 34, fontWeight: 700, letterSpacing: '-0.4px',
          color: '#000',
        }}>
          Create
        </div>

        {/* Category pills */}
        <CategorySection />

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

function CategorySection() {
  const { categories } = window.MOCK;
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ padding: '0 16px 12px', fontSize: 22, fontWeight: 700, color: '#000', letterSpacing: '-0.3px' }}>
        Shop
      </div>
      <div style={{
        display: 'flex', gap: 10,
        overflowX: 'auto', scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
        padding: '0 16px 4px',
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => cat.id === 'photobooks' && window.navigation.push('product-photobook.html')}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onPointerUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onPointerLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            style={{
              flexShrink: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 6, padding: '14px 16px',
              background: 'var(--color-surface)', borderRadius: 16,
              border: 'none', cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
              transition: 'transform 140ms ease',
              minWidth: 76,
            }}
          >
            <span style={{ fontSize: 26 }}>{cat.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#000', whiteSpace: 'nowrap' }}>{cat.label}</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>from {cat.from}</span>
          </button>
        ))}
      </div>
    </div>
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
