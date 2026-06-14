import ScrollReveal from "@/components/layout/ScrollReveal";
import { HomeBenefit } from "@/lib/cms-content";

export default function BenefitsSection({ benefits }: { benefits: HomeBenefit[] }) {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">Tại sao nên tham gia cùng VEO?</h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Chúng tôi mang đến những giá trị thực chất và bền vững cho cả tình nguyện viên và cộng đồng địa phương.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={benefit.id} delay={index * 80} className="text-center">
              <div className="w-20 h-20 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl">{benefit.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-3">{benefit.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{benefit.description}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
