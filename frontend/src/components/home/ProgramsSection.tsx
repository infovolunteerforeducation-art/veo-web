import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/layout/ScrollReveal";
import { HomeProgram } from "@/lib/cms-content";

export default function ProgramsSection({ programs }: { programs: HomeProgram[] }) {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <ScrollReveal className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">Các chương trình của VEO</h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {programs.map((program, index) => (
            <ScrollReveal
              key={program.id}
              delay={index * 80}
              className={`lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""}`}
            >
              <Link
                href={program.href}
                {...(program.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group block h-full overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_8px_28px_rgba(108,42,138,0.08)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold leading-snug text-primary">{program.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">{program.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-solar-orange">
                    Tìm hiểu thêm
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
