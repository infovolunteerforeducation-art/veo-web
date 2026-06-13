import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Hướng dẫn tham gia – VEO Travel",
  description: "Hướng dẫn từng bước để tham gia các chuyến du lịch tình nguyện cùng VEO.",
};

const steps = [
  {
    icon: "search",
    title: "Khám phá & chọn chuyến đi",
    desc: "Truy cập trang danh sách tour để xem các chuyến du lịch tình nguyện đang mở đăng ký. Mỗi tour có đầy đủ thông tin về địa điểm, lịch trình, hoạt động tình nguyện, số lượng tình nguyện viên và mức phí.",
    note: "Bạn có thể lọc theo loại hình (Du lịch tình nguyện / Trại hè), địa điểm hoặc thời gian phù hợp.",
  },
  {
    icon: "how_to_reg",
    title: "Đăng ký trực tuyến",
    desc: "Bấm \"Đăng ký ngay\" trên trang chi tiết tour và điền đầy đủ thông tin cá nhân. Đảm bảo thông tin chính xác để VEO hỗ trợ tốt nhất trong suốt chuyến đi.",
    note: "Bạn cần có tài khoản VEO để hoàn tất đăng ký. Đăng ký miễn phí chỉ mất 1 phút.",
  },
  {
    icon: "payments",
    title: "Thanh toán đặt cọc",
    desc: "Sau khi gửi đơn đăng ký, bạn cần thanh toán tiền đặt cọc trong vòng 48 giờ để giữ chỗ. Đặt cọc có thể thực hiện qua chuyển khoản ngân hàng hoặc các phương thức thanh toán trực tuyến được hỗ trợ.",
    note: "Số tiền đặt cọc và lịch thanh toán phần còn lại sẽ được ghi rõ trong trang chi tiết từng tour.",
  },
  {
    icon: "mark_email_read",
    title: "Nhận xác nhận & tài liệu chuẩn bị",
    desc: "VEO sẽ gửi email xác nhận kèm theo tài liệu chuẩn bị trước chuyến đi, bao gồm danh sách đồ cần mang, thông tin điểm tập trung, lịch trình chi tiết và hướng dẫn an toàn.",
    note: "Hãy đọc kỹ tài liệu và liên hệ VEO nếu có bất kỳ thắc mắc nào trước ngày khởi hành.",
  },
  {
    icon: "hiking",
    title: "Lên đường & trải nghiệm",
    desc: "Đến điểm tập trung đúng giờ theo lịch trình đã được gửi. Đội ngũ dẫn đoàn VEO sẽ đồng hành cùng bạn trong suốt chuyến đi để đảm bảo an toàn và trải nghiệm tốt nhất.",
    note: "Sau chuyến đi, bạn sẽ nhận chứng nhận tình nguyện và được cộng 48 giờ hoạt động xã hội.",
  },
];

const requirements = [
  "Độ tuổi từ 15 trở lên (dưới 18 tuổi cần có sự đồng ý của phụ huynh)",
  "Sức khỏe đủ để tham gia các hoạt động ngoài trời",
  "Tinh thần sẵn sàng hợp tác, tôn trọng văn hóa địa phương",
  "Hoàn thành đăng ký và thanh toán đúng hạn",
  "Tuân thủ nội quy của đoàn và hướng dẫn của đội trưởng",
];

const faqs = [
  {
    q: "Tôi có cần kinh nghiệm tình nguyện trước không?",
    a: "Không cần. VEO chào đón tất cả mọi người, từ người tham gia lần đầu đến tình nguyện viên nhiều năm kinh nghiệm. Đội ngũ VEO sẽ hướng dẫn đầy đủ trước và trong chuyến đi.",
  },
  {
    q: "Chi phí bao gồm những gì?",
    a: "Chi phí tour thường bao gồm: phương tiện di chuyển, chỗ ở, các bữa ăn theo lịch trình, dụng cụ tình nguyện, bảo hiểm chuyến đi và chứng nhận tình nguyện. Chi tiết được ghi rõ trên trang từng tour.",
  },
  {
    q: "Nếu tôi cần hủy chuyến thì sao?",
    a: "VEO có chính sách hoàn hủy linh hoạt dựa trên thời gian thông báo. Thông báo càng sớm, phí hủy càng thấp. Xem chi tiết tại trang Chính sách hoàn hủy.",
  },
  {
    q: "Chuyến đi có an toàn không?",
    a: "VEO đặt an toàn là ưu tiên hàng đầu. Mỗi đoàn đều có trưởng đoàn được đào tạo, bảo hiểm du lịch và quy trình ứng phó khẩn cấp. VEO cũng khảo sát địa điểm trước mỗi chuyến đi.",
  },
  {
    q: "Tôi có thể đi một mình không?",
    a: "Hoàn toàn có thể. Phần lớn tình nguyện viên VEO đi một mình và nhanh chóng kết bạn trong đoàn. Đây cũng là một trong những điều đặc biệt của chương trình.",
  },
];

export default function JoinGuidePage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Hero */}
        <section className="bg-deep-amethyst py-20 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <p className="text-solar-orange font-semibold text-sm uppercase tracking-widest mb-3">
              Bắt đầu hành trình của bạn
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-5 leading-tight">
              Hướng dẫn tham gia
            </h1>
            <p className="text-pure-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Chỉ 5 bước đơn giản để bắt đầu hành trình tình nguyện đầu tiên của bạn cùng VEO.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="max-w-[800px] mx-auto px-6 py-16">
          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-pure-white font-bold text-lg">
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-outline-variant/40 my-2 min-h-[40px]" />
                  )}
                </div>
                <div className="pb-2">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="material-symbols-outlined text-solar-orange"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {step.icon}
                    </span>
                    <h2 className="text-lg font-bold text-primary">{step.title}</h2>
                  </div>
                  <p className="text-on-surface leading-relaxed mb-3">{step.desc}</p>
                  <div className="flex items-start gap-2 bg-surface-container-low rounded-xl px-4 py-3">
                    <span className="material-symbols-outlined text-base text-solar-orange shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
                      lightbulb
                    </span>
                    <p className="text-sm text-on-surface-variant">{step.note}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="bg-surface-container-low py-14 px-6">
          <div className="max-w-[800px] mx-auto">
            <h2 className="text-2xl font-bold text-primary mb-8 text-center">Yêu cầu tham gia</h2>
            <ul className="space-y-3">
              {requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-3 bg-white rounded-xl px-5 py-4 border border-outline-variant/30">
                  <span
                    className="material-symbols-outlined text-primary shrink-0 mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="text-on-surface">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-[800px] mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-primary mb-10 text-center">Câu hỏi thường gặp</h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-outline-variant/30 rounded-2xl p-6">
                <h3 className="font-bold text-on-surface mb-2 flex items-start gap-3">
                  <span className="text-solar-orange font-bold shrink-0">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed pl-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-deep-amethyst py-16 px-6">
          <div className="max-w-[600px] mx-auto text-center">
            <h2 className="text-2xl font-bold text-pure-white mb-4">Sẵn sàng bắt đầu?</h2>
            <p className="text-pure-white/80 mb-8">Khám phá ngay các chuyến du lịch tình nguyện đang mở đăng ký.</p>
            <Link
              href="/du-lich-tinh-nguyen"
              className="inline-flex items-center gap-2 rounded-full bg-solar-orange px-8 py-3.5 font-bold text-primary transition-colors hover:bg-action-hover"
            >
              Xem tất cả tour
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
