// screens/onboarding-3.jsx — Figma node 451:13823
// Illustration: the masked iPhone mockup (group 451:13824) plus the stacked
// notification pair (451:13838 → 451:13839 / 451:13840).
//
// ⚠️ The phone is a vector mockup ("iPhone 17 Pro Silver"), ~30 layers deep with a
// 2px layer blur and a gradient alpha mask. It ships as one 3× WebP rather than being
// rebuilt in code — see CLAUDE.md for how the transparent 3× render was obtained
// (a PNG export of this node comes back with the Figma canvas baked in).
//
// SVG frame is 289×507 and sits 2.28px above the mask rect's own top, so the render's
// origin is frame (51.4385, 105.72), not the mask group's (51.4385, 108).

function PhoneMockup() {
  return (
    <img
      src="../shared/assets/ob-phone.webp"
      alt=""
      style={{
        position: 'absolute', left: 51.4385, top: 105.72, width: 289, height: 507,
        display: 'block',
      }}
    />
  );
}

// 451:13839 (behind, 289 wide) and 451:13840 (front, 341 wide). The front card is
// both wider and 19px higher, so the one behind peeks out along the bottom — the iOS
// notification stack. Both are horizontally centred on the frame at x=195.5.
const OB3_NOTIFS = [
  { node: '451:13839', top: 288, width: 289, pad: 10.17, rim: 0.848, gap: 7.628,
    icon: 32.205, fill: 'rgba(255,255,255,0.7)', ago: '15m ago',
    title: 10.77, body: 10.77, agoSize: 10.17,
    titleLead: 14.365, bodyLead: 12.929, rowGap: 1.695, track: -0.2034 },
  { node: '451:13840', top: 269, width: 341, pad: 12, rim: 1, gap: 9,
    icon: 38, fill: 'rgba(255,255,255,0.8)', ago: '5m ago',
    title: 15, body: 15, agoSize: 12,
    titleLead: 20, bodyLead: 18, rowGap: 2, track: -0.24 },
];

function Notification(n) {
  return (
    <div style={{
      position: 'absolute', top: n.top, left: 195.5, width: n.width,
      transform: 'translateX(-50%)', boxSizing: 'border-box',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: n.gap,
      padding: n.pad, borderRadius: 22,
      border: `${n.rim}px solid #FFFFFF`,
      // Figma layers a white fill on `mix-blend-mode: luminosity`, which cannot blend
      // across a composited layer boundary in WebKit (see CLAUDE.md). A translucent
      // white over a real backdrop blur lands on the same frosted card and is what an
      // iOS notification actually is.
      background: n.fill,
      backdropFilter: 'blur(18px) saturate(120%)',
      WebkitBackdropFilter: 'blur(18px) saturate(120%)',
    }}>
      <img src="../shared/assets/ob-notif-icon.png" alt="" style={{
        width: n.icon, height: n.icon, borderRadius: 8, opacity: 0.8,
        display: 'block', flex: 'none',
      }} />
      <div style={{
        flex: '1 0 0', minWidth: 0,
        display: 'flex', flexDirection: 'column', gap: n.rowGap,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          whiteSpace: 'nowrap',
        }}>
          {/* Figma sets Open Sans here; it is not among the faces this project
              self-hosts, and an iOS notification is SF Pro anyway. */}
          <span style={{
            fontFamily: 'var(--font)', fontWeight: 600, fontSize: n.title,
            lineHeight: `${n.titleLead}px`, letterSpacing: `${n.track}px`, color: '#000000',
          }}>Your order is out for delivery!</span>
          <span style={{
            fontFamily: 'var(--font)', fontWeight: 400, fontSize: n.agoSize,
            lineHeight: `${n.titleLead}px`, letterSpacing: '-0.408px',
            color: '#565656',
          }}>{n.ago}</span>
        </div>
        <span style={{
          fontFamily: 'var(--font)', fontWeight: 400, fontSize: n.body,
          lineHeight: `${n.bodyLead}px`, letterSpacing: `${n.track}px`, color: '#000000',
        }}>Tap to track your delivery.</span>
      </div>
    </div>
  );
}

function OnboardingScreen() {
  return (
    <OnboardingShell
      slide={3}
      title="Follow your order status live and get special offers."
      body="Allow us access to notifications"
      onNext={() => window.navigation.replace('home.html')}
      // Figma paints the notification stack after the copy panel.
      foreground={OB3_NOTIFS.map(n => <Notification key={n.node} {...n} />)}
    >
      <PhoneMockup />
    </OnboardingShell>
  );
}
