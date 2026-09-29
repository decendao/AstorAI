import { HeroSection } from "@/components/hero/HeroSection";
import { SurveyFlow } from "@/components/survey/SurveyFlow";
import { AgentCapabilities } from "@/components/agent/AgentCapabilities";
import { AgentDemo } from "@/components/agent/AgentDemo";
import { PricingSection } from "@/components/pricing/PricingSection";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <SiteHeader />
      <HeroSection />
      <div id="capabilities"><AgentCapabilities /></div>
      <div id="demo"><AgentDemo /></div>
      <SurveyFlow />
      <PricingSection />
      <SiteFooter />
    </main>
  );
}