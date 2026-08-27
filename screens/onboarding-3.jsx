// screens/onboarding-3.jsx — Figma node 451:13823
function OnboardingScreen() {
  return (
    <OnboardingShell
      slide={3}
      title="Follow your order status live and get special offers."
      body="Allow us access to notifications"
      onNext={() => window.navigation.replace('home.html')}
    />
  );
}
