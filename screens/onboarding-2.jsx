// screens/onboarding-2.jsx — Figma node 451:13841
function OnboardingScreen() {
  return (
    <OnboardingShell
      slide={2}
      title="Discover generated collection and collages."
      body="All your photos stay on your phone"
      onNext={() => window.navigation.push('onboarding-3.html')}
    />
  );
}
