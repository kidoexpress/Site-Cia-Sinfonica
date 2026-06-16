import { LangProvider } from "@/components/landing/lang-context";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Problem } from "@/components/landing/problem";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CeremonyTimeline } from "@/components/landing/ceremony-timeline";
import { Personalization } from "@/components/landing/personalization";
import { Ensemble } from "@/components/landing/ensemble";
import { Atelier } from "@/components/landing/atelier";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export const metadata = {
  title: "Cia. Sinfônica — Consultoria Musical para Casamentos de Alto Padrão",
  description: "Ajudamos casais a desenhar a experiência musical do seu casamento — composta, curada e executada ao vivo, com precisão absoluta. Orquestras ao vivo, arranjos exclusivos, Brasil e exterior.",
  keywords: ["consultoria musical casamento", "orquestra casamento", "curadoria musical casamento", "música cerimônia"],
  openGraph: {
    title: "Cia. Sinfônica — Consultoria Musical para Casamentos",
    description: "Cada momento inesquecível merece a trilha sonora certa.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <LangProvider>
      <div className="cs-root">
        <Navbar />
        <main id="main-content">
          <Hero />
          <Stats />
          <Problem />
          <HowItWorks />
          <CeremonyTimeline />
          <Personalization />
          <Ensemble />
          <Atelier />
          <Pricing />
          <Testimonials />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
