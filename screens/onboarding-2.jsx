// screens/onboarding-2.jsx — Figma node 451:13841 ("Onboarding - inspire")
// Illustration: three rotated album tiles (451:13842 / 451:13843 / 451:13855) plus
// two rotated metadata labels (451:13856 / 451:13859).
//
// ⚠️ All three tiles are the SAME photo in Figma — one 1024×1536 shot of the couple
// in Florence, cover-cropped into three different boxes. It reads as three different
// pictures on the canvas only because the front tile hides the middle of the other
// two. Don't go hunting for two more source images.
//
// Geometry note: every offset below is the ROTATION BOUNDING BOX origin, which is
// what Figma's dev-mode CSS reports. `get_metadata` reports the rotated node's own
// top-left corner instead, so the two disagree by up to 14px on these tiles and both
// are right — the flex-centred wrapper + `transform: rotate()` pattern here is the
// one that matches the dev-mode numbers.

const OB2_PHOTO = '../shared/assets/ob-album-photo.jpg';

// bbox = the rotation bounding box (positioned), box = the tile's own size (rotated
// inside it). The two back tiles carry Figma's 2px layer blur.
const OB2_TILES = [
  { node: '451:13842', bbox: [35.13, 151.71, 139.318, 168.186], box: [136.383, 165.781], rot: -1.02, blur: true },
  { node: '451:13843', bbox: [238,    299,    124.819, 145.974], box: [110.841, 134.733], rot:  6.24, blur: true },
  { node: '451:13855', bbox: [87.68,  160.47, 214.3,   257.051], box: [205.669, 250],     rot: -2.01, blur: false },
];

const OB2_LABELS = [
  { node: '451:13856', bbox: [57.68, 335.84, 137.804, 48.271], rot: -2.66,
    shadow: '13px 13px 10.9px rgba(0,0,0,0.25)',
    icon: '../shared/assets/ob-icon-trips.svg', label: 'Florence, Italy' },
  { node: '451:13859', bbox: [232, 148, 120.409, 46.178], rot: 2.02,
    shadow: '-27px 12px 10.9px rgba(0,0,0,0.25)',
    icon: '../shared/assets/ob-icon-photos.svg', label: '234 photos' },
];

// Rotation bounding box: the child is centred in it and then rotated, so a tile whose
// intrinsic size drifts (a label re-measuring its text, say) stays put instead of
// walking off the design's position.
function RotBox({ bbox, children }) {
  const [left, top, width, height] = bbox;
  return (
    <div style={{
      position: 'absolute', left, top, width, height,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{children}</div>
  );
}

function AlbumTile({ bbox, box, rot, blur }) {
  return (
    <RotBox bbox={bbox}>
      <div style={{
        flex: 'none', width: box[0], height: box[1], boxSizing: 'border-box',
        transform: `rotate(${rot}deg)`,
        // 2px ring lives INSIDE the tile's bounds (Figma's inside stroke), so
        // border-box + overflow:hidden clips the photo to the inner r22 for free.
        border: '2px solid var(--functional-colours-grey-50, #F4F4F4)',
        borderRadius: 24, overflow: 'hidden',
        filter: blur ? 'blur(2px)' : undefined,
      }}>
        <img src={OB2_PHOTO} alt="" style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
        }} />
      </div>
    </RotBox>
  );
}

function AlbumLabel({ bbox, rot, shadow, icon, label }) {
  return (
    <RotBox bbox={bbox}>
      <div style={{
        flex: 'none', transform: `rotate(${rot}deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        padding: 8, borderRadius: 34, boxSizing: 'border-box',
        background: 'rgba(255,255,255,0.9)', border: '1px solid #FFFFFF',
        // Figma's drop shadow follows the pill's alpha, which a box-shadow would not
        // — it shades the border box instead. Keep it a filter.
        filter: `drop-shadow(${shadow})`,
        whiteSpace: 'nowrap',
      }}>
        <img src={icon} alt="" style={{ width: 24, height: 24, display: 'block', flex: 'none' }} />
        <span style={{
          fontFamily: 'var(--font)', fontWeight: 600, fontSize: 13, lineHeight: '18px',
          letterSpacing: '-0.08px', color: 'var(--colour-foreground-fg-black, #333333)',
        }}>{label}</span>
      </div>
    </RotBox>
  );
}

function OnboardingScreen() {
  const [back1, back2, front] = OB2_TILES;
  return (
    <OnboardingShell
      slide={2}
      title="Discover generated collection and collages."
      body="All your photos stay on your phone"
      onNext={() => window.navigation.push('onboarding-3.html')}
      // Figma paints the front tile and both labels AFTER the copy panel, so they
      // stay sharp where they cross into it — the two back tiles, which go through
      // `children`, get softened by the panel's backdrop blur instead.
      foreground={<>
        <AlbumTile {...front} />
        {OB2_LABELS.map(l => <AlbumLabel key={l.node} {...l} />)}
      </>}
    >
      <AlbumTile {...back1} />
      <AlbumTile {...back2} />
    </OnboardingShell>
  );
}
