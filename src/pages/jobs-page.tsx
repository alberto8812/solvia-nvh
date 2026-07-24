import {
  CareersHeroSection,
  // CareersWhySolviaSection,
  CareersExpectationsSection,
  CareersJobsSection,
} from "@/components/sections";
import { Container } from "@/components/ui";

export function JobsPage() {
  return (
    <main>
      <section
        id="careers"
        className="bg-neutral-100 border-t border-neutral-200 pt-[calc(70px+56px)] md:pt-[calc(70px+76px)] pb-14 md:pb-[76px]"
      >
        <Container>
          <CareersHeroSection />
          {/* <CareersWhySolviaSection /> */}
          <CareersExpectationsSection />
          <CareersJobsSection />
        </Container>
      </section>
    </main>
  );
}
