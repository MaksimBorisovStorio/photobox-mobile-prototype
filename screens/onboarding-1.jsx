// screens/onboarding-1.jsx — Figma node 451:13808
function OnboardingScreen() {
  return (
    <OnboardingShell
      slide={1}
      // Figma sets an explicit line break here
      title={<>Never let a memory<br />go unnoticed.</>}
      body="Create various of photo products"
      onNext={() => window.navigation.push('onboarding-2.html')}
    />
  );
}
