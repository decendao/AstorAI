import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { HeroSection } from "@/components/hero/HeroSection";
import { Manifesto } from "@/components/manifesto/Manifesto";
import { BelieveSection } from "@/components/believe/BelieveSection";
import { Contrast } from "@/components/contrast/Contrast";
import { SurveyFlow } from "@/components/survey/SurveyFlow";
import {
  CapabilitySection,
  AuditSection,
} from "@/components/agent/AgentSections";
import {
  PricingSection,
  CtaSection,
} from "@/components/pricing/PricingSection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />
      <HeroSection />
      <Manifesto />
      <BelieveSection />
      <Contrast />
      <SurveyFlow />
      <CapabilitySection />
      <AuditSection />
      <PricingSection />
      <CtaSection />
      <SiteFooter />
    </main>
  );
}
