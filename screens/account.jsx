// screens/account.jsx
//
// Rebuilt end to end against Figma node 451:14038 ("account"). This supersedes the
// hand-written iOS inset-grouped list the screen used to carry (avatar block →
// My Orders → Preferences → Support → Log out), which predated any Figma call.
//
// Structure, and the node's own y for every band on the 390 frame:
//
//   band            node        node y   height
//   ─────────────────────────────────────────────
//   welcome         451:14041       56       87
//   stats strip     451:14045      167       66
//   refer CTA       451:14057      257       70
//   sections        451:14064      351      970
//
// The container (451:14040) is `pt 56 / px 20 / pb 32` with `gap: 24`, which is
// exactly what those offsets add up to (56+87+24 = 167, +66+24 = 257, +70+24 = 351,
// +970+32 = 1353 = the frame's own height). Inside 451:14064 the four sections have
// no gap of their own — each is `py: 16`, so consecutive cards sit 32 apart.
//
// ⚠️ The node's container declares `backdrop-blur: 28.65px` and it is deliberately
// not implemented, for the reason CLAUDE.md records for the onboarding copy panel:
// Figma scales a background blur by the layer's own fill alpha, and this layer has
// no fill at all — so Figma renders no blur. CSS `backdrop-filter` has no such
// coupling and would blur the wash for real. The only thing behind it here is a
// smooth gradient, where a blur is a visual no-op that still costs a stacking
// context.

function AccountScreen() {
  const [activeTab, setActiveTab] = React.useState('account');

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#F1F6F6' }}>
      {/* Scroller — inset 0 so the content passes under the floating tab bar, which
          is both the iOS-26 behaviour and the only way the pill's glass has anything
          to refract. `isolation: isolate` lets the wash sit at z-index -1 *inside*
          the scroller: above its own background, below every in-flow section. */}
      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
        isolation: 'isolate',
      }}>
        {/* Brand wash — node 451:14039: 390×429 pinned to the top of the *content*,
            not the viewport (an absolute child of a scroller scrolls with it, unlike
            position:fixed — the trap CLAUDE.md records for home's gradient).

            ⚠️ This is NOT `--pb-wash-stops`. The node's paint is the 8-stop variant
            and its second stop sits at 15% where the shared list has 12.04%, and its
            ellipse is ~1.5× home's. So it ships as the inline SVG Figma itself
            emits, carrying the gradientTransform verbatim — the same reason home's
            `tealWash` does. Decoding the matrix for reference: centred at (6, 0)
            with semi-axes of 4128 × 634.5, i.e. essentially axis-aligned, deep teal
            in the top-left corner fading out across and down the header. */}
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 429,
          backgroundImage: ACCOUNT_WASH,
          backgroundSize: '100% 100%',
          pointerEvents: 'none', zIndex: -1,
        }} />

        <div style={{
          position: 'relative',
          // The node's 56 is measured on a frame whose status bar is exactly 44.
          padding: '0 20px 32px',
          paddingTop: 'max(56px, calc(env(safe-area-inset-top, 44px) + 12px))',
          display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 24,
        }}>
          <Welcome />
          <StatsStrip />
          <ReferCard />

          {/* 451:14064 — the four titled cards. No gap: each section carries py 16. */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {ACCOUNT_SECTIONS.map(section => (
              <AccountSection key={section.title} {...section} />
            ))}
          </div>

          {/* Room for the floating tab bar, which the content scrolls under. */}
          <div style={{ height: `calc(8px + ${TAB_BAR_HEIGHT})`, marginTop: -24 }} />
        </div>
      </div>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

// The node's own paint for 451:14039, matrix and all eight stops verbatim.
const ACCOUNT_WASH =
  'url("data:image/svg+xml;utf8,' +
  "<svg viewBox='0 0 390 429' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'>" +
  "<rect x='0' y='0' width='100%' height='100%' fill='url(%23g)'/><defs>" +
  "<radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10'" +
  " gradientTransform='matrix(7.3255e-14 63.45 -412.82 0.000013756 6.0004 -1.9994e-7)'>" +
  "<stop stop-color='rgba(0,115,119,1)' offset='0'/>" +
  "<stop stop-color='rgba(0,142,147,0.89)' offset='0.15'/>" +
  "<stop stop-color='rgba(18,150,155,0.833)' offset='0.18274'/>" +
  "<stop stop-color='rgba(36,158,162,0.77599)' offset='0.21549'/>" +
  "<stop stop-color='rgba(72,174,178,0.66198)' offset='0.28098'/>" +
  "<stop stop-color='rgba(144,206,208,0.43397)' offset='0.41195'/>" +
  "<stop stop-color='rgba(207,234,235,0.18805)' offset='0.59069'/>" +
  "<stop stop-color='rgba(255,255,255,0)' offset='1'/>" +
  '</radialGradient></defs></svg>")';

// The node types the welcome block and every row label in SF Pro, and the three
// stat/refer/action labels in Inter. Inter is Figma's own default fallback and is
// not among the faces this project self-hosts — and the rows immediately beside
// them are SF Pro Semibold at the same size — so the whole screen uses the system
// stack. Flagged as a substitution rather than silently unified.
const AC_TEXT = '-apple-system, "SF Pro Text", system-ui, sans-serif';
const AC_DISPLAY_TEXT = '-apple-system, "SF Pro Display", system-ui, sans-serif';

// The card chrome, shared by the stats strip and all four row cards.
//
// ⚠️ The 1px white rim is an INSET SHADOW, not a border — the trap CLAUDE.md already
// records for the home status banners and the collection covers. Figma strokes are
// inside strokes, so the node's heights already include the rim: the My-account card
// is 278 and its rows sum to exactly 278. A real 1px border on an auto-height box
// adds 2px and every card comes out oversized. `inset 0 0 0 1px` paints it over the
// content edge instead, which is what Figma is doing.
const CARD_RIM = 'inset 0 0 0 1px #FFFFFF';
const CARD_SHADOW = '0px 4px 16px -1px rgba(0,77,74,0.1)';

// ─────────────────────────────────────────────────────────────
// Welcome — Figma node 451:14041
// ─────────────────────────────────────────────────────────────
// Three lines, `gap: 1` under a 6px top pad. The heights are what land the block on
// the node's 87: 6 + 18 (15px) + 1 + 44 (38px on a 44 line) + 1 + 17 (14px) = 87.
function Welcome() {
  const { user } = window.MOCK;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 1,
      paddingTop: 6, color: '#FFFFFF', whiteSpace: 'nowrap',
    }}>
      <span style={{ fontFamily: AC_TEXT, fontSize: 15, fontWeight: 510, lineHeight: '18px' }}>
        Welcome back,
      </span>
      <span style={{ fontFamily: AC_DISPLAY_TEXT, fontSize: 38, fontWeight: 700, lineHeight: '44px' }}>
        {user.firstName}
      </span>
      <span style={{
        fontFamily: AC_TEXT, fontSize: 14, fontWeight: 400,
        lineHeight: '17px', opacity: 0.85,
      }}>
        {user.email}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Stats strip — Figma node 451:14045
// ─────────────────────────────────────────────────────────────
// Three centred columns joined by two hairlines, `gap: 17`, `py: 8`. Height 66 comes
// from the hairlines rather than the columns: they are the tallest child at 50, and
// `align-items: center` centres the 36-tall columns against them (8 + 50 + 8 = 66,
// and 8 + 7 = the node's y=15 for each column).
//
// The fill is the node's own white radial gradient at 90% — two stops, white 0.48 →
// white 1, on an ellipse centred just above the strip's top edge. It ships as the
// inline SVG for the same reason the page wash does.
const STATS_FILL =
  'url("data:image/svg+xml;utf8,' +
  "<svg viewBox='0 0 350 66' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'>" +
  "<rect x='0' y='0' width='100%' height='100%' fill='url(%23s)' opacity='0.9'/><defs>" +
  "<radialGradient id='s' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10'" +
  " gradientTransform='matrix(0.26217 4.3191 -32.504 0.27041 167.79 -18.441)'>" +
  "<stop stop-color='rgba(255,255,255,0.48)' offset='0'/>" +
  "<stop stop-color='rgba(255,255,255,1)' offset='1'/>" +
  '</radialGradient></defs></svg>")';

function StatsStrip() {
  const { account } = window.MOCK;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 17,
      padding: '8px 0', borderRadius: 20, overflow: 'hidden',
      backgroundImage: STATS_FILL, backgroundSize: '100% 100%',
      boxShadow: `${CARD_RIM}, ${CARD_SHADOW}`,
    }}>
      {account.stats.map((stat, i) => (
        <React.Fragment key={stat.label}>
          {i > 0 && (
            // The node draws this as a rotated 50×1 rectangle; a 1×50 box is the
            // same thing. 5% black on a near-white fill is as faint as it looks.
            <div aria-hidden style={{
              width: 1, height: 50, flexShrink: 0,
              background: 'rgba(51,51,51,0.05)',
            }} />
          )}
          <div style={{
            width: stat.w, flexShrink: 0, height: 36,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 2,
            overflow: 'hidden', whiteSpace: 'nowrap',
            color: 'var(--colour-foreground-fg-secondary, #007377)',
          }}>
            <span style={{ fontFamily: AC_TEXT, fontSize: 16, fontWeight: 600, lineHeight: '19px' }}>
              {stat.value}
            </span>
            <span style={{ fontFamily: AC_TEXT, fontSize: 12, fontWeight: 300, lineHeight: '15px' }}>
              {stat.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Refer a friend — Figma node 451:14057
// ─────────────────────────────────────────────────────────────
// Solid `#004B53` (Extended brand / Secondary / 800), r20, `pl 14 / pr 16 / py 14`,
// `gap: 12`. Height 70 = 14 + the 42 icon tile + 14. The "→" is part of the node's
// own subtitle string, not an added glyph.
//
// Not in the design: a destination. The node carries no link and the prototype has
// no referral screen, so the card is inert — same footing as the five Create-grid
// cards that have nowhere to go yet. It keeps the card press-scale so it does not
// read as disabled.
function ReferCard() {
  return (
    <div
      {...press(0.97)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px 14px 14px', borderRadius: 20, overflow: 'hidden',
        background: '#004B53', cursor: 'pointer', transition: 'transform 140ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        width: 42, height: 42, flexShrink: 0, borderRadius: 10,
        background: 'rgba(255,255,255,0.25)', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src="../shared/assets/ac-icon-gift.svg" alt=""
             width={24} height={24} style={{ display: 'block' }} />
      </div>
      <div style={{
        flex: '1 0 0', minWidth: 0, display: 'flex', flexDirection: 'column',
        gap: 2, overflow: 'hidden', whiteSpace: 'nowrap',
      }}>
        <span style={{
          fontFamily: AC_TEXT, fontSize: 14.5, fontWeight: 600,
          lineHeight: '18px', color: '#FFFFFF',
        }}>
          Refer a friend, get 20% off
        </span>
        <span style={{
          fontFamily: AC_TEXT, fontSize: 12, fontWeight: 400,
          lineHeight: '15px', color: '#FFFFFF',
        }}>
          They get 20% too. Share your code →
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// The four sections — Figma nodes 451:14065 / 14123 / 14162 / 14187
// ─────────────────────────────────────────────────────────────
// Rows are `PB3/AccountRow`: `h 56`, `px 16`, `gap 14`, a 24px icon, a flex-1 title
// column, an optional right-aligned value, and a chevron. Dividers are 1px `#DDD`.
//
// Destinations are NOT in the design — no row carries a link. Only the three the
// prototype can actually satisfy are wired; the rest are inert, which is how the
// Create grid already handles rows with nowhere to go.
const ACCOUNT_SECTIONS = [
  {
    title: 'My account',
    rows: [
      // No orders screen exists in the prototype — the old account screen's own
      // order list was what the home tracking banner pointed at, and this design
      // replaces it with a row. Inert until one is built.
      { icon: 'ac-icon-orders.svg', title: 'My orders' },
      { icon: 'ac-icon-photos.svg', title: 'My photos', href: 'photo-sources.html' },
      { icon: 'ac-icon-reminders.svg', title: 'Reminders' },
      { icon: 'ac-icon-mail.svg', title: 'Email preferences' },
      { icon: 'ac-icon-settings.svg', title: 'Account settings' },
    ],
  },
  {
    title: 'Preferences',
    rows: [
      { icon: 'ac-icon-notifications.svg', title: 'Notification settings' },
      { icon: 'ac-icon-language.svg', title: 'Language', value: 'English (UK)' },
    ],
  },
  {
    title: 'Support',
    rows: [
      { icon: 'ac-icon-feedback.svg', title: 'App feedback' },
      { icon: 'ac-icon-chat.svg', title: 'Chat with us' },
    ],
  },
  {
    title: 'Account actions',
    // No icon and no chevron on either row — the node's own variant.
    rows: [
      { title: 'Log out', color: '#007377', action: 'logout' },
      // Inert: destructive, and the design has no confirmation flow for it.
      { title: 'Delete account', color: '#D44333' },
    ],
  },
];

function AccountSection({ title, rows }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 0' }}>
      {/* Section title — Google Sans Flex Bold 24/40 at -0.24 in the node, which is
          the same heading metric home's SectionHeader uses, so it takes the same
          PB_DISPLAY stack (DM Sans standing in for Google Sans Flex). */}
      <div style={{
        fontFamily: PB_DISPLAY, fontWeight: 700, fontSize: 24, lineHeight: '40px',
        letterSpacing: '-0.24px', color: 'var(--colour-foreground-fg-black, #333)',
      }}>{title}</div>

      <div style={{
        display: 'flex', flexDirection: 'column',
        background: '#F8F8F8', borderRadius: 20, overflow: 'hidden',
        boxShadow: `${CARD_RIM}, ${CARD_SHADOW}`,
      }}>
        {rows.map((row, i) => (
          <React.Fragment key={row.title}>
            {i > 0 && <div aria-hidden style={{ height: 1, background: 'var(--functional-colours-grey-200, #DDD)' }} />}
            <AccountRow {...row} />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function AccountRow({ icon, title, value, color, href, action }) {
  // Every row carries the press-scale and the pointer cursor even when it has
  // nowhere to go — same as the Create grid's five destination-less cards. The
  // chevron is the design's affordance; the missing screen is a prototype gap, and
  // a row that visually refuses the touch would read as disabled instead.
  const onClick = () => {
    if (action === 'logout') { window.navigation.replace('onboarding-1.html'); return; }
    if (href) window.navigation.push(href);
  };

  return (
    <div
      onClick={onClick}
      {...press(0.97)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        height: 56, padding: '13px 16px', boxSizing: 'border-box',
        cursor: 'pointer', transition: 'transform 140ms ease',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {icon && (
        <img src={`../shared/assets/${icon}`} alt=""
             width={24} height={24} style={{ display: 'block', flexShrink: 0 }} />
      )}
      <div style={{ flex: '1 0 0', minWidth: 0, overflow: 'hidden' }}>
        <span style={{
          fontFamily: AC_TEXT, fontSize: 15, fontWeight: 590, lineHeight: '18px',
          color: color || 'var(--colour-foreground-fg-black, #333)',
        }}>{title}</span>
      </div>
      {value && (
        <span style={{
          flexShrink: 0, fontFamily: AC_TEXT, fontSize: 13, fontWeight: 400,
          lineHeight: '16px', whiteSpace: 'nowrap',
          color: 'var(--functional-colours-grey-700, #666)',
        }}>{value}</span>
      )}
      {/* The node draws the chevron as a text "›" at 18px in #333, not as the iOS
          tertiary-grey vector the rest of the app uses. Kept as the glyph. */}
      {!color && (
        <span aria-hidden style={{
          flexShrink: 0, fontFamily: AC_TEXT, fontSize: 18, fontWeight: 400,
          lineHeight: '22px', color: 'var(--colour-foreground-fg-black, #333)',
        }}>›</span>
      )}
    </div>
  );
}
