import Image from "next/image";
import ScrollReveal from "@/components/layout/ScrollReveal";
import { HomeLogo } from "@/lib/cms-content";

const logoCardClass =
  "h-24 rounded-xl border border-outline-variant/30 bg-white px-4 py-5 flex items-center justify-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md";

function LogoCard({ logo }: { logo: HomeLogo }) {
  const img = (
    <Image
      alt={logo.alt}
      src={logo.src}
      width={240}
      height={120}
      className="max-h-12 w-auto max-w-full object-contain"
    />
  );
  if (logo.href) {
    return (
      <a href={logo.href} target="_blank" rel="noopener noreferrer" aria-label={logo.alt} className={logoCardClass}>
        {img}
      </a>
    );
  }
  return <div className={logoCardClass}>{img}</div>;
}

export default function PartnersSection({ pressLogos, awardLogos }: { pressLogos: HomeLogo[]; awardLogos: HomeLogo[] }) {
  return (
    <>
      <section className="bg-pure-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-primary text-center mb-12">Báo chí viết về VEO</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pressLogos.map((logo, index) => (
              <ScrollReveal key={logo.id} delay={index * 55}>
                <LogoCard logo={logo} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-primary text-center mb-12">Giải thưởng của VEO</h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {awardLogos.map((logo, index) => (
              <ScrollReveal key={logo.id} delay={index * 65}>
                <LogoCard logo={logo} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
