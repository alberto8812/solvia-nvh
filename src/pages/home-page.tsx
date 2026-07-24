import {
  HeroSection,
  TrustBarSection,
  BenefitsSection,
  SimulatorSection, //— sin tasas reales todavía; ver AmountSelectorSection más abajo. Reactivar cuando el producto tenga condiciones definidas.
  //AmountSelectorSection,
  StepsSection,
  // ServicesSection, — section commented out in the JSX below
  AboutSection,
  CoverageSection,
  TestimonialsSection,
  VideosSection,
  FaqSection,
  ContactSection,
} from "@/components/sections";

export function HomePage() {
  return (
    <main>
      <HeroSection />
      <TrustBarSection />
      <BenefitsSection />
      <SimulatorSection />
      {/* <AmountSelectorSection /> */}
      <StepsSection />
      {/* <ServicesSection /> */}
      <CoverageSection />
      <AboutSection />
      <TestimonialsSection />
      <VideosSection />
      <FaqSection />
      <ContactSection />
    </main>
  );
}
