import { FeaturesSection } from "./_components/features-section";
import { HeroSection } from "./_components/hero-section";
import { LandingFooter } from "./_components/landing-footer";
import { LandingHeader } from "./_components/landing-header";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
      </main>
      <LandingFooter />
    </div>
  );
}
