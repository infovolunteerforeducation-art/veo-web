import ScrollReveal from "@/components/layout/ScrollReveal";

const benefits = [
  {
    icon: "handshake",
    title: "Hỗ trợ cộng đồng",
    description:
      "Mỗi tour du lịch tình nguyện VEO được xây dựng với tầm nhìn dài hạn, để những đóng góp của bạn không chỉ là một chuyến đi, mà còn trở thành động lực giúp cộng đồng địa phương phát triển bền vững hơn từng ngày.",
  },
  {
    icon: "public",
    title: "Kết nối toàn cầu",
    description:
      "Tham gia du lịch tình nguyện VEO, bạn trở thành một phần của mạng lưới hơn 120.000 tình nguyện viên toàn cầu, mở rộng kết nối và trải nghiệm văn hóa với bạn bè quốc tế.",
  },
  {
    icon: "landscape",
    title: "Trải nghiệm độc đáo",
    description:
      "Mỗi chuyến du lịch tình nguyện cùng VEO là hành trình hòa mình vào đời sống bản địa, nơi bạn có thể trở thành thầy cô giáo hoặc người nông dân, cùng lao động, sinh hoạt và gắn bó với đồng bào các dân tộc Việt Nam.",
  },
  {
    icon: "workspace_premium",
    title: "Chứng nhận tình nguyện",
    description:
      "Tham gia du lịch tình nguyện VEO, bạn được cộng 48 giờ hoạt động xã hội và nhận chứng nhận tình nguyện quốc tế, điểm cộng cho hồ sơ du học, học bổng.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-[1200px] mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Tại sao nên tham gia cùng VEO?
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Chúng tôi mang đến những giá trị thực chất và bền vững cho cả tình
            nguyện viên và cộng đồng địa phương.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={benefit.title} delay={index * 80} className="text-center">
              <div className="w-20 h-20 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl">
                  {benefit.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {benefit.description}
              </p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
