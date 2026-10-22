// screens/onboarding-1.jsx — Figma "1st step", node 683:3422 (section 683:3565).
// A full-bleed photograph, the white logo, and a green-washed bottom panel carrying
// the headline and the two entry buttons.
//
// The node's background (`image 1`, 683:3423) is a placeholder for a full-screen VIDEO,
// and the video is in: `welcome.mp4` is the supplied 2160×4096 / 62s clip re-encoded
// for the PWA (720 wide, H.264, no audio, faststart — 6.4MB against the original's
// 166MB, which GitHub would reject and the service worker could not sensibly cache).
// The poster is that clip's first frame, so there is no jump when playback starts.
// Set OB1_VIDEO to null to fall back to the still.
const OB1_POSTER = '../shared/assets/pb2-welcome-poster.jpg';
const OB1_VIDEO = '../shared/assets/welcome.mp4';

// Node: 504×1090 at x=-37, i.e. 37px wider than the 430 frame on each side and 207px
// taller. Reproduced as-is so the crop matches the node on every phone size.
const OB1_MEDIA = {
  position: 'absolute', left: '50%', top: 0, width: 504, height: 1090,
  transform: 'translateX(-50%)', objectFit: 'cover', display: 'block',
};

function OnboardingScreen() {
  const goOn = () => window.navigation.push('onboarding-2.html');

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
      background: 'var(--pb-green)',
    }}>
      <style>{`
        @keyframes obRise {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes obFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Media — the poster always renders (it is the loading state for the video) */}
      <img src={OB1_POSTER} alt="" draggable={false} style={OB1_MEDIA} />
      {OB1_VIDEO ? (
        <video
          src={OB1_VIDEO} poster={OB1_POSTER}
          autoPlay muted loop playsInline preload="auto"
          style={{ ...OB1_MEDIA, animation: 'obFade 600ms ease both' }}
        />
      ) : null}

      {/* Logo — node 683:3430, 132×24, 36px under the status bar. */}
      <img
        src="../shared/assets/pb2-logo-sm.svg" alt="Photobox"
        style={{
          position: 'absolute', left: '50%', width: 132, height: 24,
          top: 'calc(max(44px, env(safe-area-inset-top, 0px)) + 36px)',
          transform: 'translateX(-50%)', display: 'block',
          animation: 'obFade 700ms ease 150ms both',
        }}
      />

      {/* Bottom panel — node 683:3425: a green-to-clear gradient over a backdrop blur,
          48 / 24 / 32 padding, 51 between the headline and the buttons.
          Figma's blur is flat; a plain `backdrop-filter` on a gradient-filled layer
          would leave a hard edge at the panel's top, so the blur is two masked layers
          that fade out upward — the blur then dissolves into the sharp photograph the
          same way the green does. */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 51,
        padding: '48px 0 0',
      }}>
        <div aria-hidden style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, var(--pb-green) 0%, rgba(0,127,112,0) 100%)',
        }} />
        {[
          { blur: 14, mask: 'linear-gradient(to top, #000 0%, #000 40%, transparent 100%)' },
          { blur: 6,  mask: 'linear-gradient(to top, #000 0%, #000 70%, transparent 100%)' },
        ].map((l, i) => (
          <div key={i} aria-hidden style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            backdropFilter: `blur(${l.blur}px)`, WebkitBackdropFilter: `blur(${l.blur}px)`,
            maskImage: l.mask, WebkitMaskImage: l.mask,
          }} />
        ))}

        {/* Headline: Bricolage Grotesque Medium 28/38.7 −1.1857, white. The node sets
            an explicit line break. */}
        <p style={{
          position: 'relative', margin: 0, width: 373, maxWidth: 'calc(100% - 32px)',
          textAlign: 'center', textWrap: 'balance', color: '#FFFFFF',
          fontFamily: OB_HEAD, fontWeight: 500, fontSize: 28, lineHeight: '38.7px',
          letterSpacing: '-1.1857px', fontVariationSettings: OB_HEAD_VARIATION,
          animation: 'obRise 560ms cubic-bezier(0.22, 1, 0.36, 1) 200ms both',
        }}>
          Turn your moments<br />into lasting memories.
        </p>

        <div style={{
          ...OB_BUTTON_STACK, position: 'relative', gap: 13,
          animation: 'obRise 560ms cubic-bezier(0.22, 1, 0.36, 1) 320ms both',
        }}>
          <ObButton kind="primary" onClick={goOn}>Login / Sign up</ObButton>
          <ObButton kind="light" onClick={goOn}>Continue as guest</ObButton>
        </div>
      </div>
    </div>
  );
}
