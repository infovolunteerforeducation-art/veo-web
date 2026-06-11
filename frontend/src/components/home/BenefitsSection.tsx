const benefits = [
  {
    icon: "travel_explore",
    title: "Du lịch trải nghiệm",
    description:
      "Khám phá những vùng đất mới, văn hóa bản địa độc đáo qua góc nhìn của một người đồng hành thực thụ.",
  },
  {
    icon: "volunteer_activism",
    title: "Tác động xã hội",
    description:
      "Mỗi đóng góp của bạn đều được thiết kế để mang lại sự thay đổi tích cực, dài hạn cho giáo dục và môi trường.",
  },
  {
    icon: "psychology",
    title: "Phát triển bản thân",
    description:
      "Rèn luyện kỹ năng mềm, mở rộng mối quan hệ và tìm thấy ý nghĩa mới trong cuộc sống sau mỗi chuyến đi.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Tại sao nên tham gia cùng VEO?
          </h2>
          <p className="text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Chúng tôi mang đến những giá trị thực chất và bền vững cho cả tình
            nguyện viên và cộng đồng địa phương.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="text-center">
              <div className="w-20 h-20 bg-primary-container/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">
                  {benefit.icon}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-on-surface mb-3">
                {benefit.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
