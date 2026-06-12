import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Chính sách hoàn hủy – VEO Travel",
  description: "Chính sách hoàn tiền và hủy chuyến đi của Volunteer For Education (VEO).",
};

const feeTable = [
  { time: "Trước 30 ngày trở lên", fee: "Không tính phí" },
  { time: "Trước 15 – 29 ngày", fee: "10% tổng chi phí" },
  { time: "Trước 7 – 14 ngày", fee: "20% tổng chi phí" },
  { time: "Trước 3 – 6 ngày", fee: "30% tổng chi phí" },
  { time: "Trước 48 giờ", fee: "50% tổng chi phí" },
  { time: "Trước 24 giờ hoặc không báo", fee: "100% tổng chi phí" },
];

export default function CancellationPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-deep-amethyst py-20 px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-5 leading-tight">
              Chính sách hoàn hủy
            </h1>
            <p className="text-pure-white/70 text-sm">
              Cập nhật lần cuối: 01/01/2026 · Volunteer For Education (VEO)
            </p>
          </div>
        </section>

        <article className="max-w-[800px] mx-auto px-6 py-14">
          <p className="text-on-surface-variant leading-relaxed mb-10 border-l-4 border-primary pl-5">
            VEO luôn cố gắng tạo điều kiện linh hoạt nhất cho tình nguyện viên. Chính sách hoàn hủy dưới đây áp dụng cho tất cả các chương trình do VEO tổ chức.
          </p>

          <div className="space-y-10">
            {/* Hủy bởi VEO */}
            <div>
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-solar-orange" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                Hủy bởi VEO
              </h2>
              <div className="bg-surface-container-low rounded-2xl p-6 space-y-3 text-on-surface leading-relaxed">
                <p>Trong trường hợp VEO không thể thực hiện chuyến đi vì bất kỳ lý do nào, VEO có trách nhiệm thông báo ngay cho khách hàng và thực hiện một trong hai phương án:</p>
                <ul className="space-y-2 pl-2">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    Sắp xếp chuyến đi thay thế có giá trị tương đương hoặc tốt hơn.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    Hoàn trả toàn bộ số tiền đã thanh toán trong vòng 7 ngày làm việc qua tiền mặt hoặc chuyển khoản ngân hàng.
                  </li>
                </ul>
              </div>
            </div>

            {/* Hủy bởi khách hàng */}
            <div>
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-solar-orange" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                Hủy bởi khách hàng
              </h2>
              <p className="text-on-surface leading-relaxed mb-5">
                Mọi yêu cầu hủy phải được gửi và xác nhận qua email chính thức. Phí hủy được tính theo thời gian thông báo trước ngày khởi hành:
              </p>

              <div className="overflow-hidden rounded-2xl border border-outline-variant/30">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-deep-amethyst text-pure-white">
                      <th className="text-left px-5 py-3 font-semibold">Thời gian thông báo</th>
                      <th className="text-right px-5 py-3 font-semibold">Phí hủy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeTable.map((row, i) => (
                      <tr
                        key={i}
                        className={`border-t border-outline-variant/20 ${i % 2 === 0 ? "bg-white" : "bg-surface-container-low"}`}
                      >
                        <td className="px-5 py-3.5 text-on-surface">{row.time}</td>
                        <td className={`px-5 py-3.5 text-right font-semibold ${row.fee === "Không tính phí" ? "text-green-600" : "text-solar-orange"}`}>
                          {row.fee}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-5 bg-primary/5 border border-primary/20 rounded-xl p-5">
                <p className="text-sm text-on-surface leading-relaxed">
                  <strong>Chuyển chuyến đi:</strong> Khách hàng có thể chuyển sang bất kỳ chuyến đi nào khác trong vòng 3 tháng kể từ ngày thông báo hủy, sau khi hoàn tất các khoản phí chuyển đổi và chênh lệch (nếu có).
                </p>
              </div>
            </div>

            {/* Lưu ý */}
            <div>
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-solar-orange" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                Lưu ý quan trọng
              </h2>
              <ul className="space-y-3">
                {[
                  "Thời hạn thông báo hủy không tính ngày Thứ Bảy, Chủ Nhật và ngày lễ.",
                  "Trường hợp hủy do thiên tai, dịch bệnh, gián đoạn phương tiện công cộng: chỉ được hoàn tiền theo thực tế, không có bồi thường thêm.",
                  "Mức phí hủy tối đa có thể được xem xét giảm thông qua thương lượng trực tiếp với VEO trong các trường hợp đặc biệt.",
                  "VEO không chịu trách nhiệm đối với các yêu cầu hủy chưa được xác nhận bằng văn bản.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-on-surface leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-solar-orange shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Bất khả kháng */}
            <div>
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-solar-orange" style={{ fontVariationSettings: "'FILL' 1" }}>thunderstorm</span>
                Trường hợp bất khả kháng
              </h2>
              <div className="bg-surface-container-low rounded-2xl p-6 text-on-surface leading-relaxed">
                <p>Khi một trong hai bên phải hủy chuyến do hoàn cảnh ngoài tầm kiểm soát — bao gồm hỏa hoạn, thời tiết cực đoan, tai nạn, thiên tai, chiến tranh hoặc đình chỉ giao thông công cộng — không bên nào chịu trách nhiệm bồi thường thiệt hại cho bên kia. Tuy nhiên, cả hai bên nên cố gắng phối hợp để giảm thiểu tổn thất.</p>
              </div>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-outline-variant/30 text-sm text-on-surface-variant">
            <p>Mọi yêu cầu hoàn hủy vui lòng gửi email tới: <a href="mailto:info@volunteerforeducation.org" className="text-primary hover:underline">info@volunteerforeducation.org</a></p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
