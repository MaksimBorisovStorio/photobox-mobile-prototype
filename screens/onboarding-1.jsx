// screens/onboarding-1.jsx — Figma node 451:13808
// Illustration: node 451:13809 — one Gemini-generated product collage (451:13811),
// alpha-masked by its sibling rectangle 451:13810 so the products dissolve into the
// wash before the copy panel starts.

// The mask rect spans the whole 390×615 group and ramps from opaque at group y=375
// to clear at y=502.738. The image starts at y=78, so in image-local pixels that is
// 297 → 424.738 — expressed here as a CSS mask so the artwork itself stays a plain
// cut-out and the fade always lands on the live gradient behind it.
const OB1_ART_MASK =
  'linear-gradient(to bottom, #000 0px, #000 297px, transparent 424.74px)';

function ProductCollage() {
  return (
    <img
      src="../shared/assets/ob-products.webp"
      alt=""
      style={{
        position: 'absolute', left: 27, top: 78, width: 336, height: 450,
        objectFit: 'cover', display: 'block',
        maskImage: OB1_ART_MASK, WebkitMaskImage: OB1_ART_MASK,
      }}
    />
  );
}

function OnboardingScreen() {
  return (
    <OnboardingShell
      slide={1}
      // Figma sets an explicit line break here
      title={<>Never let a memory<br />go unnoticed.</>}
      body="Create various of photo products"
      onNext={() => window.navigation.push('onboarding-2.html')}
    >
      <ProductCollage />
    </OnboardingShell>
  );
}
