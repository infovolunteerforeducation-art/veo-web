import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Chính sách bảo mật – VEO Travel",
  description: "Chính sách bảo mật và bảo vệ thông tin cá nhân của Volunteer For Education (VEO).",
};

const sections = [
  {
    icon: "database",
    title: "Phạm vi thu thập thông tin cá nhân",
    content: [
      "Để truy cập một số dịch vụ của VEO, người dùng có thể cần đăng ký thông tin cá nhân bao gồm: họ tên, địa chỉ email, số điện thoại và thông tin liên quan đến việc đặt chỗ tham gia chương trình.",
      "Tất cả thông tin khai báo phải chính xác và hợp pháp. VEO không chịu trách nhiệm về tính hợp pháp của thông tin do người dùng cung cấp.",
      "VEO cũng thu thập dữ liệu kỹ thuật khi bạn truy cập trang web, bao gồm: địa chỉ IP, loại trình duyệt, ngôn ngữ sử dụng, thời gian truy cập, các trang đã xem và liên kết đã nhấp.",
    ],
  },
  {
    icon: "manage_search",
    title: "Mục đích sử dụng thông tin cá nhân",
    content: [
      "Thông tin thu thập được sử dụng cho các mục đích sau:",
    ],
    list: [
      "Tối ưu hóa hiệu suất trang web và cải thiện trải nghiệm người dùng.",
      "Vận hành, đánh giá và phát triển các dịch vụ của VEO.",
      "Theo dõi và xác nhận đăng ký tham gia chương trình.",
      "Xử lý các yêu cầu, phản hồi và hỗ trợ khách hàng.",
      "Tiến hành nghiên cứu thị trường và phân tích nội bộ.",
      "Gửi thông tin về các chương trình, sự kiện và cập nhật từ VEO (có thể hủy đăng ký bất kỳ lúc nào).",
    ],
  },
  {
    icon: "share",
    title: "Chia sẻ thông tin cá nhân",
    content: [
      "VEO cam kết không tiết lộ, bán hoặc trao đổi thông tin cá nhân của bạn với bên thứ ba vì mục đích thương mại, trừ các trường hợp sau:",
    ],
    list: [
      "Các đơn vị đối tác được thuê thực hiện nghiên cứu thị trường, với cam kết bảo mật và chỉ sử dụng cho phạm vi dự án.",
      "Khi được pháp luật yêu cầu hoặc theo lệnh của cơ quan nhà nước có thẩm quyền.",
      "Khi cần thiết để bảo vệ quyền lợi hợp pháp của VEO hoặc ngăn chặn hành vi gian lận.",
      "Trong trường hợp khẩn cấp nhằm bảo vệ sự an toàn của người dùng hoặc cộng đồng.",
    ],
  },
  {
    icon: "lock",
    title: "Cam kết bảo mật thông tin",
    content: [
      "VEO áp dụng nhiều biện pháp kỹ thuật và quy trình nội bộ để bảo vệ thông tin cá nhân khỏi việc truy cập, sử dụng hoặc tiết lộ trái phép.",
      "Dữ liệu được lưu trữ trên hệ thống máy chủ bảo mật với quyền truy cập được kiểm soát chặt chẽ. Chỉ nhân viên có thẩm quyền mới được phép truy cập thông tin cá nhân trong phạm vi công việc.",
    ],
  },
  {
    icon: "cookie",
    title: "Cookie và công nghệ theo dõi",
    content: [
      "VEO sử dụng cookie và các công nghệ tương tự để ghi nhớ tùy chọn của bạn, phân tích lưu lượng truy cập và cải thiện dịch vụ. Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên điều này có thể ảnh hưởng đến một số tính năng của trang web.",
    ],
  },
  {
    icon: "person_edit",
    title: "Quyền của người dùng",
    content: [
      "Bạn có quyền yêu cầu VEO cung cấp, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất kỳ lúc nào bằng cách liên hệ qua email. VEO sẽ xử lý yêu cầu trong vòng 7 ngày làm việc.",
    ],
    list: [
      "Quyền truy cập và nhận bản sao thông tin cá nhân đang được lưu trữ.",
      "Quyền yêu cầu chỉnh sửa thông tin không chính xác.",
      "Quyền yêu cầu xóa thông tin (trong phạm vi pháp luật cho phép).",
      "Quyền hủy đăng ký nhận thông tin tiếp thị bất kỳ lúc nào.",
    ],
  },
  {
    icon: "update",
    title: "Cập nhật chính sách bảo mật",
    content: [
      "Chính sách bảo mật này có thể được cập nhật khi công nghệ hoặc quy định pháp luật thay đổi. Mọi sửa đổi quan trọng sẽ được thông báo nổi bật trên trang web và qua email đã đăng ký. Ngày cập nhật lần cuối sẽ luôn được ghi rõ tại đầu trang.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="bg-deep-amethyst py-20 px-6">
          <div className="max-w-[800px] mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-5 leading-tight">
              Chính sách bảo mật
            </h1>
            <p className="text-pure-white/70 text-sm">
              Cập nhật lần cuối: 01/01/2026 · Volunteer For Education (VEO)
            </p>
          </div>
        </section>

        <article className="max-w-[800px] mx-auto px-6 py-14">
          <p className="text-on-surface-variant leading-relaxed mb-10 border-l-4 border-primary pl-5">
            Volunteer For Education (VEO) cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.
          </p>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-solar-orange"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {section.icon}
                  </span>
                  {i + 1}. {section.title}
                </h2>
                {section.content.map((p, j) => (
                  <p key={j} className="text-on-surface leading-relaxed mb-3">{p}</p>
                ))}
                {section.list && (
                  <ul className="space-y-2 mt-3">
                    {section.list.map((item, j) => (
                      <li key={j} className="flex items-start gap-3 text-on-surface leading-relaxed">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-solar-orange shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mt-14 pt-8 border-t border-outline-variant/30 text-sm text-on-surface-variant">
            <p>Mọi yêu cầu liên quan đến quyền riêng tư và dữ liệu cá nhân vui lòng liên hệ: <a href="mailto:info@volunteerforeducation.org" className="text-primary hover:underline">info@volunteerforeducation.org</a></p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
