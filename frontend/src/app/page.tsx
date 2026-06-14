import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ToursSection from "@/components/home/ToursSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PartnersSection from "@/components/home/PartnersSection";
import { getHomepageContent } from "@/lib/cms-content";

// Always read fresh from cms-content/homepage.json on each request
export const dynamic = "force-dynamic";

export default function Home() {
  const cms = getHomepageContent();
  return (
    <>
      <Header />
      <main>
        <HeroSection banners={cms.banners} />
        <ToursSection />
        <BenefitsSection benefits={cms.benefits} />
        <ProgramsSection programs={cms.programs} />
        <TestimonialsSection testimonials={cms.testimonials} />
        <PartnersSection pressLogos={cms.pressLogos} awardLogos={cms.awardLogos} />
      </main>
      <Footer />
    </>
  );
}
