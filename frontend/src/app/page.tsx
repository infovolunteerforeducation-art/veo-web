import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ToursSection from "@/components/home/ToursSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PartnersSection from "@/components/home/PartnersSection";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <ToursSection />
        <BenefitsSection />
        <ProgramsSection />
        <TestimonialsSection />
        <PartnersSection />
      </main>
      <Footer />
    </>
  );
}
