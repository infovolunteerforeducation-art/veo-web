import ScrollReveal from "@/components/layout/ScrollReveal";
import { HomeTestimonial } from "@/lib/cms-content";

const StarIcon = () => (
  <span className="material-symbols-outlined text-solar-orange" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
);

export default function TestimonialsSection({ testimonials }: { testimonials: HomeTestimonial[] }) {
  return (
    <section className="py-20 max-w-[1200px] mx-auto px-4 sm:px-6">
      <ScrollReveal className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">Cảm nhận tình nguyện viên</h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, index) => (
          <ScrollReveal key={t.id} className="glass-card p-6 lg:p-8 rounded-2xl shadow-sm border-l-4 border-solar-orange flex flex-col" delay={index * 90}>
            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
            </div>
            <p className="text-sm italic text-on-surface mb-6 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-surface-variant overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" src={t.avatar} alt={t.name} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">{t.name}</h4>
                <p className="text-xs text-on-surface-variant">{t.role}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
