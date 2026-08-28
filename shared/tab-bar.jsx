// shared/tab-bar.jsx
//
// The home screen's floating tab bar, extracted so every tab destination can carry
// it. `home.jsx` used to own this outright; `account.html` (Figma 451:14038) shows
// the same bar, so TABS / TAB_BAR_PAD_BOTTOM / TAB_BAR_HEIGHT / TabBar moved here
// verbatim rather than being copied — the same extraction `shared/collections.jsx`
// got when home and photo-sources turned out to share the collection covers.
//
// ⚠️ These are top-level declarations in a classic script, so they land in the
// global lexical scope. Any screen loading this file must not redeclare TABS,
// TAB_BAR_PAD_BOTTOM, TAB_BAR_HEIGHT or TabBar — the same collision trap as
// PB_DISPLAY. Load it after `ios-frame.jsx`, which defines the `press()` it uses.

// The label face. Deliberately a local name rather than home.jsx's BANNER_FONT:
// two top-level `const BANNER_FONT` declarations in two classic scripts would
// collide in the global lexical scope.
const TAB_LABEL_FONT = '-apple-system, "SF Pro Text", system-ui, sans-serif';

// ─────────────────────────────────────────────────────────────
// Tab bar — Figma node 509:19230 ("Tab Bar - iPhone")
// ─────────────────────────────────────────────────────────────
// The iOS-26 floating glass pill, not the old edge-to-edge bar: 16px above it, 25px
// below, 25px gutters, and a 50-tall pill carrying four tabs. Content scrolls
// *underneath* it, which is both the iOS 26 behaviour and the only way the glass has
// anything to refract — see the spacer at the end of HomeScreen's content.
//
// The node's BG is Apple's `LiquidGlassRegularSmall` (Light). There is no such
// component in this codebase and `backdrop-filter: url(#…)` — which every
// refraction-based glass library relies on — silently no-ops in WebKit, so the pill
// is layered by hand, the same way `GlassIconButton`'s `gloss` variant is. Two
// differences from that recipe, both because this glass sits on a *light* page
// rather than the near-black editor header:
//   • the interior needs a real white tint (0.55) — the header's near-clear 0.03
//     would be invisible here;
//   • the rim composites normally rather than with `plus-lighter`, which on a
//     near-white backdrop clips straight to white.
const TABS = [
  // Home now carries an href too: the bar is no longer home-only, so from any
  // other tab destination the Home tab has to be able to navigate back to it.
  { id: 'home',     label: 'Home',     icon: 'hb-tab-home.svg', href: 'home.html' },
  // No projects screen exists; the editor holds the in-progress book, which is what
  // the "Continue editing" banner points at too.
  { id: 'projects', label: 'Projects', icon: 'hb-tab-projects.svg', href: 'editor.html' },
  { id: 'memories', label: 'Memories', icon: 'hb-tab-memories.svg', href: 'photo-sources.html' },
  { id: 'account',  label: 'Account',  icon: 'hb-tab-account.svg',  href: 'account.html' },
];

// 16 top + 50 pill + the bottom inset. The node's 25 is the home-indicator gap on a
// frame with no safe area, so it becomes the floor.
const TAB_BAR_PAD_BOTTOM = 'max(25px, calc(env(safe-area-inset-bottom, 0px) + 8px))';
const TAB_BAR_HEIGHT = `calc(66px + ${TAB_BAR_PAD_BOTTOM})`;

function TabBar({ activeTab, onTabChange }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: `16px 25px ${TAB_BAR_PAD_BOTTOM}`,
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
      pointerEvents: 'none', zIndex: 50,
    }}>
      <div style={{
        flex: '1 0 0', minWidth: 0, height: 50, borderRadius: 25,
        position: 'relative', overflow: 'hidden', pointerEvents: 'auto',
        // Glass floats: without a drop shadow the pill reads as a hole in the page.
        boxShadow: '0 6px 20px rgba(0,77,74,0.16), 0 1px 3px rgba(0,0,0,0.08)',
      }}>
        {/* Blur + tint. saturate is kept low — the page behind is a pale teal wash
            and white cards, where a big boost tints the glass green. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          backdropFilter: 'blur(20px) saturate(130%)',
          WebkitBackdropFilter: 'blur(20px) saturate(130%)',
          background: 'rgba(255,255,255,0.55)',
        }} />
        {/* Lensed rim — inset shadows so the one layer follows the pill's radius. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.55),' +
                     ' inset 0 0 8px 1px rgba(255,255,255,0.45),' +
                     ' inset 0 0 20px -8px rgba(255,255,255,0.6)',
        }} />
        {/* Specular sweep, strong end on the bottom-left arc — the light direction
            the home header's glass was matched to. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          background: 'linear-gradient(35deg,' +
                      ' rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.16) 18%,' +
                      ' rgba(255,255,255,0) 42%, rgba(255,255,255,0) 60%,' +
                      ' rgba(255,255,255,0.10) 84%, rgba(255,255,255,0.34) 100%)',
        }} />
        {/* Edge: a hairline that reads on white, plus the specular highlight just
            inside it. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit',
          border: '0.5px solid rgba(255,255,255,0.7)',
          boxShadow: 'inset 1.5px -1.5px 1px rgba(255,255,255,0.6),' +
                     ' inset -1.5px 1.5px 1px rgba(255,255,255,0.25),' +
                     ' 0 0 0 0.5px rgba(0,77,74,0.06)',
        }} />

        {/* Tabs — node's own tabs carry `mr:-8` so they overlap by their 8px side
            padding; four equal quarters put the centres within 3px of that and keeps
            the selection pill symmetric. */}
        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
          display: 'flex', alignItems: 'stretch', padding: '0 2px',
        }}>
          {TABS.map(tab => {
            const on = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  // Never navigate to the screen we are already on — that is what
                  // lets one TABS list serve every tab destination.
                  if (tab.href && tab.id !== activeTab) window.navigation.push(tab.href);
                }}
                {...press(0.97)}
                style={{
                  flex: '1 0 0', minWidth: 0, position: 'relative',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 1,
                  padding: '6px 8px 7px', border: 'none', background: 'none',
                  cursor: 'pointer', transition: 'transform 140ms ease',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {/* Selection — node 509:19230 → "Selection": inset 0 / -2px, r100.
                    The node resolves Apple's vibrant tertiary fill to a flat
                    #EDEDED; kept translucent so the glass still reads through it,
                    which lands on the same colour over this page. */}
                {on && (
                  <div aria-hidden style={{
                    position: 'absolute', top: 0, bottom: 0, left: -2, right: -2,
                    borderRadius: 100, background: 'rgba(120,120,128,0.12)',
                  }} />
                )}
                <img src={`../shared/assets/${tab.icon}`} alt=""
                     width={24} height={24}
                     style={{ display: 'block', position: 'relative' }} />
                <span style={{
                  position: 'relative',
                  fontFamily: TAB_LABEL_FONT, fontSize: 10, fontWeight: 590,
                  lineHeight: '12px', textAlign: 'center',
                  letterSpacing: on ? '-0.1px' : 0,
                  color: on
                    ? 'var(--Extended-brand-colours-Secondary-400, #008E93)'
                    : '#1A1A1A',
                }}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
