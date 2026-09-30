import type { Metadata } from "next";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ContactSection } from "@/components/contact/ContactSection";

export const metadata: Metadata = {
  title: "联系我们 · AstorAI",
  description: "运营主体、服务边界与联系渠道。我们不做推荐、不做交易、不承诺收益、不代客决策。",
};

export default function ContactPage() {
  return (
    <main className="relative min-h-screen">
      <FloatingParticles />
      <SiteHeader />
      <ContactSection />
      <SiteFooter />
    </main>
  );
}
