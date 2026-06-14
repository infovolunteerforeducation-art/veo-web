import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ConsultationButton from "@/components/school-activities/ConsultationButton";
import FAQAccordion from "@/components/trai-he/FAQAccordion";

export const metadata: Metadata = {
  title: "Chiến lược CSR cho doanh nghiệp | VEO",
  description:
    "VEO đồng hành cùng doanh nghiệp triển khai hoạt động cộng đồng, đáp ứng tiêu chuẩn ESG và tạo tác động thực chất cho xã hội.",
};

const heroImage = "/csr/hero-csr.jpg";

const partnerLogos = [
  {
    name: "Jellyfish Vietnam",
    image: "/csr/logo-jellyfish-vietnam.png",
  },
  {
    name: "TH School",
    image: "/csr/logo-th-school.png",
  },
  {
    name: "JW Marriott",
    image: "/csr/logo-jw-marriott.svg",
  },
  {
    name: "IVY IELTS",
    image: "/csr/logo-ivy-ielts.png",
  },
  {
    name: "Amazon Web Services",
    image: "/csr/logo-aws.svg",
  },
  {
    name: "One Mount",
    image: "/csr/logo-one-mount.png",
  },
  {
    name: "SACE",
    image: "/csr/logo-sace.png",
  },
  {
    name: "Greenfield School",
    image: "/csr/logo-greenfield-school.png",
  },
  {
    name: "MT-P Entertainment",
    image: "/csr/logo-mtp-entertainment.jpg",
  },
  {
    name: "Business & Finance Club",
    image: "/csr/logo-business-finance-club.jpg",
  },
];

const partnerGallery = [
  {
    name: "M-TP Entertainment",
    image: "/csr/partner-mtp-entertainment.jpg",
  },
  {
    name: "Dệt May Sông Hồng",
    image: "/csr/partner-det-may-song-hong.jpg",
  },
  {
    name: "Amazon Web Services Vietnam",
    image: "/csr/partner-aws-vietnam.jpg",
  },
  {
    name: "All Nippon Airways",
    image: "/csr/partner-all-nippon-airways.png",
  },
  {
    name: "Kansai Paint",
    image: "/csr/partner-kansai-paint.jpg",
  },
  {
    name: "Astellas Pharma Vietnam",
    image: "/csr/partner-astellas-pharma.jpg",
  },
  {
    name: "Hino Motor",
    image: "/csr/partner-hino-motor.jpg",
  },
  {
    name: "JW Marriott",
    image: "/csr/partner-jw-marriott.jpg",
  },
];

const challenges = [
  {
    title: "Khó chọn dự án thật sự phù hợp",
    description:
      "Doanh nghiệp muốn tạo tác động nhưng thiếu dữ liệu địa phương, đối tác tin cậy và tiêu chí rõ ràng để chọn đúng cộng đồng cần hỗ trợ.",
  },
  {
    title: "Dễ bị xem là làm CSR hình thức",
    description:
      "Hoạt động ngắn hạn, thiếu chiều sâu hoặc không gắn với nhu cầu thực tế dễ khiến chương trình bị nhìn nhận như một chiến dịch truyền thông đơn thuần.",
  },
  {
    title: "Khó kéo nhân sự tham gia thật",
    description:
      "Nếu trải nghiệm không đủ ý nghĩa, nhân viên dễ tham gia cho có, thiếu kết nối cảm xúc và khó chuyển hóa thành văn hóa doanh nghiệp.",
  },
  {
    title: "Thiếu số liệu để báo cáo tác động",
    description:
      "Doanh nghiệp cần hình ảnh, câu chuyện và chỉ số rõ ràng để báo cáo ESG/CSR, truyền thông nội bộ và chứng minh hiệu quả sau chương trình.",
  },
];

const solutions = [
  {
    title: "Tư vấn chiến lược CSR",
    description:
      "Làm rõ mục tiêu, ngân sách, nhóm nhân sự tham gia và thông điệp thương hiệu để xây dựng lộ trình CSR phù hợp, tránh triển khai rời rạc hoặc hình thức.",
  },
  {
    title: "Thiết kế chương trình thực địa",
    description:
      "Kết nối doanh nghiệp với đúng cộng đồng, trường học và điểm dự án có nhu cầu thật; thiết kế hoạt động đủ ý nghĩa để nhân sự tham gia bằng trải nghiệm thực tế.",
  },
  {
    title: "Vận hành trọn gói và an toàn",
    description:
      "VEO điều phối hậu cần, lịch trình, vật dụng, địa phương và đội ngũ dẫn đoàn để chương trình diễn ra chuyên nghiệp, đúng tiến độ và phù hợp văn hóa bản địa.",
  },
  {
    title: "Đo lường và lan tỏa tác động",
    description:
      "Tổng hợp hình ảnh, câu chuyện, số liệu và báo cáo sau chương trình để doanh nghiệp có tư liệu minh bạch cho ESG/CSR, truyền thông nội bộ và thương hiệu.",
  },
];

const values = [
  {
    title: "Nâng tầm vị thế thương hiệu",
    description:
      "Xây dựng hình ảnh doanh nghiệp nhân văn, tạo sự khác biệt và củng cố niềm tin bền vững với khách hàng, đối tác",
  },
  {
    title: "Tối ưu chiến lược truyền thông",
    description:
      "Kiến tạo chất liệu truyền thông giàu cảm xúc, giúp lan tỏa thương hiệu và tạo lợi thế cạnh tranh đột phá.",
  },
  {
    title: "Minh bạch báo cáo tác động",
    description:
      "Cung cấp số liệu và báo cáo tác động chi tiết dựa trên tiêu chuẩn ESG",
  },
  {
    title: "Kiến tạo giá trị bền vững",
    description:
      "Đồng hành cùng các Mục tiêu Phát triển Bền vững (SDGs), tạo ra thay đổi tích cực và dài hạn cho xã hội.",
  },
  {
    title: "Gắn kết nhân sự & Xây dựng văn hoá doanh nghiệp",
    description:
      "Các chuyên gia huấn luyện kỹ năng, lãnh đạo, nhà điều hành doanh nghiệp trong nhiều lĩnh vực",
  },
];

const projects = [
  {
    title: "Hành trình Chinh phục bầu trời",
    partner: "All Nippon Airways",
    image: "/csr/project-ref-ana.png",
    description:
      "Tháng 8/2025, All Nippon Airways Hanoi tổ chức chuyến đi tình nguyện Chinh phục bầu trời - Thắp sáng ước mơ dành cho người dân có hoàn cảnh khó khăn tại Bắc Sơn, Lạng Sơn với sự đồng hành của V.E.O.",
    items: [
      "Thí nghiệm STEM: thực hành mô hình máy bay mini, khơi gợi đam mê khoa học và hàng không",
      "Trải nghiệm hàng không: Mô phỏng check-in sân bay, trải nghiệm trang phục và tìm hiểu nghề nghiệp trong ngành hàng không",
      "Vì cộng đồng: Hỗ trợ lắp đặt đèn năng lượng mặt trời, góp phần thắp sáng và cải thiện đời sống cho bản làng",
    ],
  },
  {
    title: "Dự án Dreams in the SKY",
    partner: "M-TP Entertainment",
    image: "/csr/project-ref-mtp.jpg",
    description:
      "Đánh dấu sự kiện 10 năm hoạt động nghệ thuật của ca sĩ Sơn Tùng M-TP, V.E.O đồng hành cùng MT-P Entertainment thực hiện dự án Dreams in the SKY với chuỗi hoạt động xã hội ý nghĩa tại Điện Biên, Thái Bình, Tuyên Quang và huyện Ba Vì - Hà Nội.",
    items: [
      "Giao lưu & tặng quà: Thăm hỏi và trao quà cho học sinh tại Trung tâm Khuyết tật Thụy An, Ba Vì, Hà Nội",
      "Cải tạo không gian học tập: Xây dựng sân chơi, vẽ trang trí cảnh quan trường học tại Hồng Thái, Na Hang, Tuyên Quang",
      "Trao học bổng: Hỗ trợ học sinh có hoàn cảnh khó khăn tại THPT Lê Quý Đôn, Thái Bình",
      "Xây dựng lớp học: Hỗ trợ xây dựng phòng học cho điểm trường tại Mường Ảng, Điện Biên",
    ],
  },
  {
    title: "Hành trình Chắp cánh ước mơ",
    partner: "Amazon Web Services",
    image: "/csr/project-ref-aws.jpg",
    description:
      "Tháng 03/2025, V.E.O cùng Amazon Web Services Vietnam tổ chức chương trình tình nguyện Chắp cánh ước mơ cho các em nhỏ ở Điểm trường mầm non Giàng Tả Chải Dao tại điểm dự án Tả Van, Sa Pa sau cơn bão Yagi.",
    items: [
      "Khắc phục sau bão: Xây kè sau lớp học, xây hàng rào bảo vệ trường, đảm bảo an toàn cho học sinh",
      "Cải tạo trường học: Vẽ trang trí, trồng cây xanh cải thiện cảnh quan",
      "Dinh dưỡng học đường: Chuẩn bị và nấu bữa ăn cho học sinh tại điểm trường",
      "Hỗ trợ địa phương: Tặng tivi và các cơ sở vật chất thiết thực cho điểm trường",
    ],
  },
  {
    title: "Dự án Cho em con chữ cùng One Mount",
    partner: "One Mount",
    image: "/csr/project-ref-one-mount.jpeg",
    description:
      "Mừng kỷ niệm ba năm thành lập, One Mount hợp tác cùng V.E.O trong dự án Cùng One Mount Cho em con chữ tại điểm dự án Na Hang - Tuyên Quang.",
    items: [
      "Trao tặng công trình cải tạo Trường học Hạnh phúc tại Điểm trường Mầm non Khuổi Phầy",
      "Tổ chức hoạt động Phiên chợ 0 đồng và giao lưu, tặng quà cho học sinh tại trường",
      "Tổ chức Đêm trăng cho em - hoat động phá cỗ Trung thu cho trẻ em địa phương",
      "Giao lưu văn nghệ với người dân địa phương",
    ],
  },
];

const reasons = [
  {
    title: "12+ năm kinh nghiệm CSR",
    description:
      "V.E.O đã triển khai nhiều chương trình cộng đồng cho doanh nghiệp, trường học và tổ chức, đảm bảo tính chuyên nghiệp, an toàn và tác động thực tế.",
  },
  {
    title: "Thiết kế theo mục tiêu doanh nghiệp",
    description:
      "Mỗi chương trình được xây dựng theo ngân sách, thời gian, nhóm nhân sự tham gia và thông điệp thương hiệu riêng.",
  },
  {
    title: "Am hiểu địa phương",
    description:
      "V.E.O kết nối trực tiếp với cộng đồng, trường học và đối tác bản địa để hoạt động phù hợp với nhu cầu thực tế.",
  },
  {
    title: "Tạo tác động và chất liệu truyền thông",
    description:
      "Chương trình vừa mang lại giá trị cho cộng đồng, vừa giúp doanh nghiệp có câu chuyện CSR chân thực để lan tỏa thương hiệu.",
  },
  {
    title: "Mạng lưới dự án toàn quốc",
    description:
      "V.E.O có mạng lưới điểm dự án tại nhiều địa phương, linh hoạt triển khai chương trình ngắn hạn hoặc dài hạn.",
  },
];

const process = [
  {
    step: "01",
    title: "Khảo sát & tư vấn giải pháp tối ưu",
    description:
      "Phân tích chuyên sâu mục tiêu chiến lược và giá trị cốt lõi của doanh nghiệp để xây dựng lộ trình CSR phù hợp nhất.",
  },
  {
    step: "02",
    title: "Thiết kế chương trình mang dấu ấn riêng",
    description:
      "Sáng tạo nội dung chương trình độc bản, lồng ghép khéo léo bản sắc thương hiệu vào các hoạt động vì cộng đồng",
  },
  {
    step: "03",
    title: "Vận hành & triển khai thực tế",
    description:
      "Trực tiếp điều phối, quản lý mọi khâu vận hành tại cộng đồng, đảm bảo tính an toàn, hiệu quả và đúng tiến độ.",
  },
  {
    step: "04",
    title: "Đo lường tác động & Đồng hành truyền thông",
    description:
      "Tổng hợp số liệu báo cáo tác động minh bạch, đồng thời hỗ trợ tối ưu hóa nội dung để lan tỏa chiến dịch trên các kênh truyền thông.",
  },
];

const csrFaqs = [
  {
    q: "VEO có thiết kế chương trình CSR theo mục tiêu riêng của doanh nghiệp không?",
    a: "Có. VEO bắt đầu bằng việc tìm hiểu mục tiêu thương hiệu, ngân sách, thời gian, nhóm nhân sự tham gia và thông điệp doanh nghiệp muốn lan tỏa. Từ đó, đội ngũ sẽ đề xuất chương trình CSR phù hợp với cộng đồng thụ hưởng và mục tiêu phát triển bền vững của doanh nghiệp.",
  },
  {
    q: "Một chương trình CSR thường kéo dài bao lâu?",
    a: "Tùy quy mô, chương trình có thể là chuyến đi trong ngày, hành trình 2-3 ngày hoặc dự án dài hạn theo quý/năm. VEO sẽ tư vấn lộ trình phù hợp để doanh nghiệp vừa đảm bảo vận hành nội bộ, vừa tạo được tác động thật tại địa phương.",
  },
  {
    q: "Doanh nghiệp có nhận được báo cáo tác động sau chương trình không?",
    a: "Có. Sau mỗi chương trình, VEO tổng hợp hình ảnh, số liệu hoạt động, câu chuyện tại cộng đồng và các kết quả nổi bật để doanh nghiệp có tư liệu báo cáo nội bộ, truyền thông thương hiệu và theo dõi tác động xã hội.",
  },
  {
    q: "VEO hỗ trợ những hạng mục nào trong quá trình triển khai?",
    a: "VEO đồng hành từ tư vấn ý tưởng, khảo sát điểm dự án, thiết kế hoạt động, điều phối hậu cần, kết nối địa phương, quản lý an toàn, vận hành thực địa đến tổng hợp báo cáo và tư liệu truyền thông sau chương trình.",
  },
  {
    q: "Chương trình CSR có thể kết hợp team building hoặc truyền thông nội bộ không?",
    a: "Có. Các hoạt động có thể được thiết kế để tăng gắn kết đội ngũ, giúp nhân sự cùng trải nghiệm, cùng đóng góp và hiểu rõ hơn giá trị phát triển bền vững mà doanh nghiệp đang theo đuổi.",
  },
  {
    q: "Làm thế nào để bắt đầu nhận tư vấn CSR?",
    a: "Doanh nghiệp chỉ cần để lại thông tin qua nút đăng ký tư vấn. Đội ngũ VEO sẽ liên hệ để trao đổi nhu cầu, mục tiêu, thời gian dự kiến và đề xuất hướng triển khai phù hợp nhất.",
  },
];

function SectionTitle({
  eyebrow,
  title,
  description,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-10 ${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}`}>
      {eyebrow && <p className="text-sm font-bold uppercase tracking-[0.16em] text-solar-orange">{eyebrow}</p>}
      <h2 className="mt-3 text-2xl font-bold leading-tight text-primary sm:text-3xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-8 text-on-surface-variant">{description}</p>}
    </div>
  );
}

export default function CsrPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative min-h-[620px] overflow-hidden">
          <img src={heroImage} alt="Chiến lược CSR bền vững cùng V.E.O" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/25" />
          <div className="relative mx-auto flex min-h-[620px] max-w-[1200px] flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-solar-orange">CSR & ESG cho doanh nghiệp</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              NÂNG TẦM THƯƠNG HIỆU VỚI CHIẾN LƯỢC CSR BỀN VỮNG
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/90 sm:text-lg">
              Chúng tôi đồng hành cùng doanh nghiệp triển khai các hoạt động cộng đồng tạo lợi thế cạnh tranh, đáp ứng tiêu chuẩn ESG và đem lại tác động thực chất cho xã hội.
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {[
                "Quy mô toàn quốc, có mạng lưới vùng khó khăn cần hỗ trợ",
                "Báo cáo hoạt động và truyền thông minh bạch",
                "Gắn với mục tiêu phát triển bền vững (SDGs)",
              ].map((point) => (
                <div key={point} className="flex min-h-[82px] items-center gap-3 rounded-xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[24px] text-solar-orange">verified</span>
                  <p className="text-sm font-semibold leading-6 text-white">{point}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ConsultationButton
                label="Nhận tư vấn lộ trình CSR"
                className="inline-flex items-center gap-2 rounded-full bg-solar-orange px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-action-hover"
              />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle
              center
              title="Đồng hành cùng 50+ doanh nghiệp trong hành trình phát triển bền vững"
              description="Nhiều đơn vị doanh nghiệp đã đồng hành cùng V.E.O trong hành trình CSR bền vững, thể hiện sự gắn kết cộng đồng và trách nhiệm xã hội."
            />
            <div className="mt-10">
              <div className="mx-auto grid max-w-[940px] grid-cols-2 items-center justify-items-center gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                {partnerLogos.map((partner) => (
                  <div key={partner.name} className="flex h-20 w-[132px] items-center justify-center">
                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {partnerGallery.map((partner) => (
                  <figure key={partner.name} className="overflow-hidden rounded-sm bg-white shadow-[0_10px_28px_rgba(35,18,55,0.08)]">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="px-4 py-4 text-center text-base font-semibold text-primary">
                      {partner.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-amber-50 py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="Những rào cản khi triển khai CSR"
              title="Doanh nghiệp muốn làm CSR bài bản nhưng thường vướng ở đâu?"
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {challenges.map((item) => (
                <div key={item.title} className="rounded-xl border border-amber-200/70 bg-white p-5 shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-solar-orange">warning</span>
                  <h3 className="mt-4 text-lg font-bold leading-7 text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle
              center
              eyebrow="Giải pháp CSR toàn diện cho doanh nghiệp"
              title="Từ ý tưởng CSR đến chương trình có tác động đo lường được"
              description="VEO đồng hành cùng doanh nghiệp từ tư vấn chiến lược, thiết kế hoạt động, vận hành thực địa đến báo cáo tác động và tư liệu truyền thông sau chương trình."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {solutions.map((item, index) => (
                <article key={item.title} className="rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <div className="mb-10 max-w-none">
              <h2 className="text-2xl font-bold leading-tight text-primary sm:text-3xl lg:whitespace-nowrap">
                Vì sao doanh nghiệp cần triển khai hoạt động CSR?
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {values.map((item) => (
                <div key={item.title} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-outline-variant/30">
                  <span className="material-symbols-outlined text-3xl text-primary">workspace_premium</span>
                  <h3 className="mt-4 text-base font-bold text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle center title="Những dự án tiêu biểu" />
            <div className="grid gap-6 lg:grid-cols-2">
              {projects.map((project) => (
                <article key={project.title} className="overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-sm">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-solar-orange">{project.partner}</p>
                    <h3 className="mt-2 text-xl font-bold text-primary">{project.title}</h3>
                    <p className="mt-3 text-base leading-7 text-on-surface-variant">{project.description}</p>
                    <div className="mt-6 space-y-3">
                      {project.items.map((item) => (
                        <p key={item} className="grid grid-cols-[18px_1fr] gap-2 text-sm leading-6 text-on-surface-variant">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-solar-orange" />
                          <span>{item}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 text-white sm:px-6">
            <div className="mx-auto mb-10 max-w-[1100px] text-center">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-solar-orange">
                50+ doanh nghiệp, đối tác đã đồng hành cùng V.E.O trong các dự án CSR
              </p>
              <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl lg:whitespace-nowrap">
                Vì sao doanh nghiệp chọn V.E.O để triển khai CSR?
              </h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {reasons.map((item) => (
                <div key={item.title} className="rounded-xl bg-white/10 p-5 ring-1 ring-white/15">
                  <span className="material-symbols-outlined text-3xl text-solar-orange">volunteer_activism</span>
                  <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/75">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle title="Quy trình làm việc" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {process.map((item, index) => (
                <div key={item.step} className="relative">
                  <div className="h-full rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm">
                    <p className="text-3xl font-black text-solar-orange">{item.step}</p>
                    <h3 className="mt-4 text-lg font-bold text-primary">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p>
                  </div>
                  {index < process.length - 1 && (
                    <span className="absolute -right-7 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-solar-orange text-white shadow-lg ring-4 ring-surface-container-low lg:flex">
                      <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-4 text-white sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-solar-orange">Tư vấn CSR cho doanh nghiệp</p>
              <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
                Biến mục tiêu CSR thành một chương trình có tác động thật
              </h2>
              <p className="mt-5 text-base leading-8 text-white/85">
                VEO đồng hành cùng doanh nghiệp từ chiến lược, thiết kế hoạt động, vận hành thực địa đến báo cáo tác động sau chương trình. Mỗi hành trình được xây dựng để vừa tạo giá trị cho cộng đồng, vừa giúp thương hiệu kể một câu chuyện trách nhiệm xã hội rõ ràng và đáng tin cậy.
              </p>
              <ConsultationButton
                label="Nhận tư vấn CSR miễn phí"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-solar-orange px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-action-hover"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Xác định mục tiêu CSR và nhóm cộng đồng phù hợp",
                "Thiết kế hoạt động gắn với giá trị thương hiệu",
                "Điều phối vận hành, hậu cần và an toàn thực địa",
                "Tổng hợp tư liệu, số liệu và báo cáo tác động",
              ].map((item) => (
                <div key={item} className="flex min-h-[112px] gap-3 rounded-xl bg-white/10 p-5 ring-1 ring-white/15">
                  <span className="material-symbols-outlined mt-0.5 text-[24px] text-solar-orange">check_circle</span>
                  <p className="text-sm font-semibold leading-7 text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-12 sm:py-20">
          <div className="mx-auto max-w-[820px] px-4 sm:px-6">
            <SectionTitle
              center
              eyebrow="FAQ"
              title="Câu hỏi thường gặp"
              description="Một vài thông tin doanh nghiệp thường quan tâm trước khi xây dựng và triển khai chương trình CSR cùng VEO."
            />
            <FAQAccordion items={csrFaqs} />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
