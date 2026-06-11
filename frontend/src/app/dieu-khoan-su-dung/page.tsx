import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng | VEO - Volunteer For Education",
  description: "Điều khoản sử dụng dịch vụ của VEO – Volunteer For Education.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-primary mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-on-surface leading-relaxed">{children}</div>
    </section>
  );
}

export default function DieuKhoanPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface py-10 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">Điều khoản sử dụng</span>
          </nav>

          {/* Header */}
          <div className="bg-deep-amethyst text-white rounded-2xl p-8 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Điều khoản sử dụng</h1>
            <p className="text-white/70 text-sm">Cập nhật lần cuối: 01/06/2026 · Áp dụng cho tất cả dịch vụ của VEO</p>
          </div>

          <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 sm:p-8">

            <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
              Chào mừng bạn đến với <strong className="text-on-surface">VEO – Volunteer For Education</strong> (sau đây gọi là &ldquo;VEO&rdquo;, &ldquo;chúng tôi&rdquo;). Bằng việc truy cập website, đăng ký tài khoản hoặc tham gia bất kỳ chương trình nào của VEO, bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi toàn bộ nội dung dưới đây. Nếu bạn không đồng ý, vui lòng ngừng sử dụng dịch vụ.
            </p>

            <Section title="1. Định nghĩa">
              <p><strong>Dịch vụ</strong> bao gồm website veo.com.vn, các trang con, ứng dụng di động, cổng đăng ký và tất cả chương trình du lịch tình nguyện, trại hè tình nguyện do VEO tổ chức hoặc phân phối.</p>
              <p><strong>Người dùng</strong> là bất kỳ cá nhân nào truy cập, đăng ký tài khoản hoặc tham gia chương trình thông qua dịch vụ của VEO.</p>
              <p><strong>Người đăng ký</strong> là người hoàn tất thủ tục đăng ký và thanh toán cho một hoặc nhiều người tham gia.</p>
            </Section>

            <Section title="2. Điều kiện sử dụng">
              <p>Bạn phải đủ 18 tuổi hoặc có sự đồng ý bằng văn bản của phụ huynh/người giám hộ hợp pháp để đăng ký sử dụng dịch vụ.</p>
              <p>Bạn cam kết cung cấp thông tin chính xác, đầy đủ và cập nhật khi đăng ký. VEO không chịu trách nhiệm đối với bất kỳ tổn thất nào phát sinh từ thông tin sai lệch do người dùng cung cấp.</p>
              <p>Tài khoản là cá nhân và không được chuyển nhượng. Bạn hoàn toàn chịu trách nhiệm về mọi hoạt động xảy ra dưới tài khoản của mình.</p>
            </Section>

            <Section title="3. Đăng ký chương trình và thanh toán">
              <p>Mọi đơn đăng ký chỉ có hiệu lực sau khi VEO xác nhận bằng văn bản (email hoặc thông báo trên hệ thống) và khoản thanh toán được ghi nhận đầy đủ.</p>
              <p>Giá niêm yết có thể thay đổi mà không cần thông báo trước đối với các lịch chưa được đặt. Giá đã xác nhận sẽ không thay đổi sau khi đơn được duyệt.</p>
              <p>VEO có quyền từ chối hoặc hủy bất kỳ đơn đăng ký nào nếu phát hiện thông tin gian lận, thanh toán không hợp lệ hoặc vi phạm điều khoản này.</p>
            </Section>

            <Section title="4. Chính sách hủy và hoàn tiền">
              <p>Người dùng có thể yêu cầu hủy đơn <strong>trước khi VEO xác nhận thanh toán</strong> mà không mất phí.</p>
              <p>Sau khi VEO xác nhận thanh toán, mọi yêu cầu hủy phải gửi bằng văn bản tới địa chỉ email chính thức của VEO. Phí hủy áp dụng theo thời điểm nhận yêu cầu:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hủy trước 30 ngày khởi hành: hoàn 70% giá trị đơn.</li>
                <li>Hủy từ 15 – 29 ngày trước khởi hành: hoàn 50%.</li>
                <li>Hủy từ 7 – 14 ngày trước khởi hành: hoàn 30%.</li>
                <li>Hủy dưới 7 ngày hoặc không tham gia không báo trước: không hoàn tiền.</li>
              </ul>
              <p>VEO có quyền chuyển số tiền chưa được hoàn sang dạng <strong>tiền bảo lưu</strong> để người dùng sử dụng cho các chương trình tiếp theo trong vòng 12 tháng, tùy theo thỏa thuận cụ thể.</p>
            </Section>

            <Section title="5. Trách nhiệm của người tham gia">
              <p>Người tham gia có trách nhiệm đảm bảo sức khỏe đủ điều kiện tham gia chương trình. VEO không chịu trách nhiệm về các vấn đề sức khỏe phát sinh trong và sau chuyến đi nếu người tham gia không khai báo trung thực tình trạng sức khỏe.</p>
              <p>Người tham gia phải tuân thủ nội quy chương trình, hướng dẫn của ban tổ chức và quy định pháp luật tại địa điểm tổ chức. VEO có quyền loại khỏi chương trình bất kỳ người tham gia nào có hành vi vi phạm mà không hoàn tiền.</p>
              <p>Bạn đồng ý cho phép VEO sử dụng hình ảnh, video ghi lại trong quá trình tham gia chương trình cho mục đích truyền thông, marketing phi thương mại, trừ khi có văn bản từ chối trước.</p>
            </Section>

            <Section title="6. Giới hạn trách nhiệm của VEO">
              <p>VEO không chịu trách nhiệm về các thiệt hại gián tiếp, đặc biệt hoặc mang tính hậu quả phát sinh từ việc sử dụng dịch vụ, bao gồm nhưng không giới hạn: mất dữ liệu, thương tích, thiệt hại tài sản do sự kiện bất khả kháng (thiên tai, dịch bệnh, bạo loạn, quyết định của cơ quan nhà nước).</p>
              <p>Trong mọi trường hợp, trách nhiệm tối đa của VEO không vượt quá tổng số tiền bạn đã thực sự thanh toán cho chương trình liên quan.</p>
              <p>VEO có quyền thay đổi lịch trình, điểm đến hoặc hoạt động trong chương trình do điều kiện thực tế mà không bồi thường thêm, miễn là thông báo trước ít nhất 48 giờ.</p>
            </Section>

            <Section title="7. Quyền sở hữu trí tuệ">
              <p>Toàn bộ nội dung trên website bao gồm văn bản, hình ảnh, thiết kế, logo, biểu tượng và phần mềm đều thuộc sở hữu của VEO hoặc được cấp phép hợp lệ. Bạn không được sao chép, phân phối, chỉnh sửa hoặc sử dụng thương mại bất kỳ nội dung nào mà không có sự đồng ý bằng văn bản của VEO.</p>
            </Section>

            <Section title="8. Bảo mật dữ liệu cá nhân">
              <p>VEO thu thập và xử lý dữ liệu cá nhân theo Chính sách Bảo mật riêng biệt, tuân thủ Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam về bảo vệ dữ liệu cá nhân.</p>
              <p>Bằng cách sử dụng dịch vụ, bạn đồng ý cho phép VEO thu thập, lưu trữ và xử lý thông tin cá nhân nhằm mục đích cung cấp dịch vụ, liên lạc và cải thiện trải nghiệm người dùng.</p>
            </Section>

            <Section title="9. Thay đổi điều khoản">
              <p>VEO có quyền sửa đổi điều khoản này bất cứ lúc nào. Phiên bản mới có hiệu lực ngay khi được đăng tải trên website. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa với việc bạn chấp nhận phiên bản mới.</p>
              <p>VEO sẽ thông báo về những thay đổi quan trọng qua email đã đăng ký hoặc thông báo nổi bật trên website.</p>
            </Section>

            <Section title="10. Luật áp dụng và giải quyết tranh chấp">
              <p>Điều khoản này được điều chỉnh bởi pháp luật nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết trước tiên qua thương lượng. Nếu thương lượng không thành công trong vòng 30 ngày, các bên đồng ý đưa ra Tòa án nhân dân có thẩm quyền tại TP. Hồ Chí Minh để giải quyết.</p>
            </Section>

            <Section title="11. Liên hệ">
              <p>Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ:</p>
              <ul className="space-y-1">
                <li><strong>Công ty:</strong> Volunteer For Education (VEO)</li>
                <li><strong>Email:</strong> info@veo.com.vn</li>
                <li><strong>Website:</strong> <a href="https://www.veo.com.vn" className="text-primary underline">www.veo.com.vn</a></li>
              </ul>
            </Section>

          </div>

          <p className="text-center text-xs text-on-surface-variant mt-6">
            © 2026 Volunteer For Education (VEO) · Tất cả quyền được bảo lưu
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
