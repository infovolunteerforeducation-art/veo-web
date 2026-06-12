import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Về VEO | Volunteer For Education",
  description:
    "Volunteer For Education - VEO là mạng lưới kết nối các tình nguyện viên tại Việt Nam và trên toàn thế giới.",
};

const introItems = [
  {
    title: "Tổ chức phi chính phủ quốc tế Volunteers for Education",
    description:
      "Tiếp cận theo quan điểm viện trợ không hoàn lại, Tổ chức phi chính phủ quốc tế Volunteers for Education Organization hỗ trợ xây dựng cơ sở vật chất và cung cấp chương trình giáo dục phi chính quy cho các địa phương khó khăn.",
    image: "/about-veo/intro-ngo.webp",
  },
  {
    title: "Công ty Du lịch & Đào tạo V.E.O Việt Nam",
    description:
      "Công ty Du lịch và Đào tạo V.E.O Việt Nam là doanh nghiệp tạo tác động xã hội, hướng đến tạo ra ảnh hưởng tích cực bền vững cho cộng đồng thông qua các chương trình du lịch, trại hè và CSR cho doanh nghiệp và cá nhân.",
    image: "/about-veo/intro-company.webp",
  },
];

const programs = [
  {
    title: "Tour du lịch tình nguyện",
    description:
      "Du lịch tình nguyện của VEO là chương trình kết hợp giữa du lịch trải nghiệm và hoạt động tình nguyện bền vững. Mục tiêu của chương trình là mang đến cho người dân sinh kế mới, gia tăng nguồn thu nhập thông qua hoạt động du lịch cộng đồng, hỗ trợ cải thiện kỹ năng việc làm và bảo tồn các giá trị văn hoá của người dân tộc thiểu số tại Việt Nam.",
    image: "/about-veo/program-volunteer-tour.webp",
    href: "/tours",
  },
  {
    title: "Trại hè tình nguyện",
    description:
      "Trại hè tình nguyện của VEO là trại hè phát triển kỹ năng sống dành cho các bạn trẻ lứa tuổi học sinh cấp hai, cấp ba và sinh viên đại học. Tại đây, các bạn có cơ hội tham gia các hoạt động tình nguyện kết hợp khám phá văn hoá truyền thống các dân tộc và phát triển các kỹ năng mềm như kỹ năng lãnh đạo, kỹ năng làm việc nhóm, kỹ năng giao tiếp, kỹ năng sinh tồn...",
    image: "/about-veo/program-summer-camp.webp",
    href: "/trai-he-tinh-nguyen",
  },
  {
    title: "Hoạt động trách nhiệm xã hội - CSR dành cho doanh nghiệp và cá nhân",
    description:
      "Hơn 10 năm kinh nghiệm trong lĩnh vực hoạt động xã hội, VEO tự tin là đơn vị chuyên nghiệp và uy tín thực hiện hoạt động CSR - trách nhiệm xã hội cho doanh nghiệp và cá nhân tại Việt Nam với đội ngũ dày dặn kinh nghiệm tư vấn, xây dựng kế hoạch theo nhu cầu riêng và đảm nhiệm công tác chuẩn bị chu đáo.",
    image: "/about-veo/program-csr.webp",
    href: "#",
  },
  {
    title: "Chương trình huấn luyện ngoại khóa định hướng du học Social Leader Program",
    description:
      "Social Leader Program là chương trình huấn luyện hoạt động ngoại khóa định hướng du học dành cho học sinh THPT, giúp học sinh khai phá tiềm năng bản thân và sử dụng những điểm mạnh của mình để chinh phục học bổng các trường đại học top đầu thông qua dự án xã hội cá nhân.",
    image: "/about-veo/program-slp.webp",
    href: "https://www.slp.edu.vn/",
    external: true,
  },
];

const timeline = [
  {
    year: "2013",
    description: "Thành lập Volunteer For Education",
    image: "/about-veo/hero.webp",
  },
  {
    year: "2014",
    description:
      "Chuyến du lịch tình nguyện đầu tiên đến Mai Châu - Hòa Bình, xây dựng mô hình nhà nghỉ cộng đồng đầu tiên tại đây",
    image: "/about-veo/timeline-2014.webp",
  },
  {
    year: "2016",
    description:
      "Thành lập dự án phi lợi nhuận Tủ sách Trong Veo tổ chức đọc sách cho bệnh nhi tại Hà Nội và xây dựng tủ sách cộng đồng tại vùng cao",
    image: "/about-veo/timeline-2016.webp",
  },
  {
    year: "2018",
    description:
      "Xây dựng và cải tạo cơ sở vật chất cho điểm trường đầu tiên tại tỉnh Điện Biên",
    image: "/about-veo/timeline-2018.webp",
  },
  {
    year: "2019",
    description:
      "Triển khai khóa huấn luyện Social Leader Program - chương trình huấn luyện hoạt động ngoại khóa định hướng du học dành cho học sinh THPT",
    image: "/about-veo/timeline-2019-slp.webp",
  },
  {
    year: "2019",
    description:
      "Triển khai các hoạt động CSR đầu tiên cùng đối tác là doanh nghiệp và cá nhân",
    image: "/about-veo/timeline-2019-csr.webp",
  },
  {
    year: "2019",
    description:
      "Thành lập Group Volunteer For Vietnam, trở thành đơn vị bảo trợ pháp lý, bảo trợ chuyên môn, kết nối các nguồn lực cho các dự án xã hội của học sinh, sinh viên tại Việt Nam",
    image: "/about-veo/timeline-2019-vfv.webp",
  },
  {
    year: "2019",
    description:
      "Thành lập dự án phi lợi nhuận Khoảng trời Trong Veo xây dựng sân chơi bảo vệ môi trường và cải thiện cơ sở vật chất trường học vùng cao",
    image: "/about-veo/timeline-2019-kttv.webp",
  },
  {
    year: "2020",
    description:
      "Triển khai hoạt động du lịch và trại hè tình nguyện với 11 điểm dự án tại khu vực miền Bắc và 04 điểm dự án tại khu vực miền Nam",
    image: "/about-veo/timeline-2020.webp",
  },
  {
    year: "2022",
    description:
      "Tổ chức các chuỗi sự kiện hướng tới đối tượng sinh viên với các buổi talkshow tại các trường đại học lớn tại Hà Nội",
    image: "/about-veo/timeline-2022.webp",
  },
  {
    year: "2023",
    description:
      "Triển khai hoạt động xây dựng và cải tạo cơ sở vật chất lại 8 điểm trường ở tỉnh Điện Biên",
    image: "/about-veo/timeline-2023.webp",
  },
  {
    year: "2024",
    description: "Triển khai 04 điểm dự án tại Miền Nam",
    image: "/about-veo/timeline-2024.webp",
  },
];

const leaders = [
  {
    name: "Alexander Paulus",
    role: "Giám đốc Danh dự",
    image: "/about-veo/leader-alexander-paulus.webp",
  },
  {
    name: "Nguyễn Huyền Phương",
    role: "Đồng sáng lập",
    image: "/about-veo/leader-nguyen-huyen-phuong.webp",
  },
  {
    name: "Nhữ Ngọc Thịnh",
    role: "Giám Đốc Điều Hành",
    initials: "NT",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative min-h-[340px] overflow-hidden sm:min-h-[430px]">
          <img
            src="/about-veo/hero.webp"
            alt="Về Volunteer For Education"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/25" />
          <div className="relative mx-auto flex min-h-[340px] max-w-[1200px] flex-col justify-end px-4 pb-12 pt-20 sm:min-h-[430px] sm:px-6 sm:pb-16">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-solar-orange">
              Volunteer For Education
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-pure-white sm:text-5xl">
              Về VEO
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-pure-white/90 sm:text-xl">
              Volunteer For Education - VEO là mạng lưới kết nối các tình nguyện viên tại Việt Nam và trên toàn thế giới.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
          <nav className="text-sm font-medium text-on-surface-variant" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span className="px-2">/</span>
            <span className="text-primary">Về VEO</span>
          </nav>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Giới thiệu về Volunteer For Education
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {introItems.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_8px_28px_rgba(108,42,138,0.08)]"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold leading-snug text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant sm:text-base">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-primary px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[920px] text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-pure-white/10">
              <span
                className="material-symbols-outlined text-4xl text-solar-orange"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                volunteer_activism
              </span>
            </div>
            <h2 className="text-2xl font-bold text-pure-white sm:text-3xl">Sứ mệnh</h2>
            <p className="mt-6 text-lg leading-8 text-pure-white/90">
              Chúng tôi luôn nỗ lực tạo ra tác động tích cực bền vững tới cộng đồng thông qua trực tiếp đồng hành và hỗ trợ người dân địa phương với các hoạt động du lịch cộng đồng và gián tiếp với các chương trình huấn luyện thế hệ trẻ có trách nhiệm với xã hội.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">
              Các chương trình của VEO
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {programs.map((program) => (
              <Link
                key={program.title}
                href={program.href}
                {...(program.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_8px_28px_rgba(108,42,138,0.08)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold leading-snug text-primary">{program.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">
                    {program.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-solar-orange">
                    Tìm hiểu thêm
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="bg-primary/5 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-10 text-center">
              <h2 className="text-2xl font-bold text-primary sm:text-3xl">
                Quá trình phát triển
              </h2>
            </div>
            <div className="relative mx-auto max-w-[980px]">
              <div className="absolute left-5 top-0 h-full w-px bg-primary/20 md:left-1/2 md:-translate-x-1/2" />
              {timeline.map((item, index) => (
                <article
                  key={`${item.year}-${index}`}
                  className={`relative mb-8 grid grid-cols-[44px_minmax(0,1fr)] gap-4 md:grid-cols-[1fr_72px_1fr] md:gap-6 ${
                    index % 2 === 0 ? "" : "md:[&_.timeline-card]:col-start-3 md:[&_.timeline-card]:row-start-1"
                  }`}
                >
                  <div className="relative z-10 flex justify-center md:col-start-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xs font-bold text-pure-white shadow-[0_0_0_6px_rgba(108,42,138,0.10)] md:h-14 md:w-14">
                      {item.year}
                    </div>
                  </div>
                  <div className="timeline-card overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_8px_28px_rgba(108,42,138,0.06)] md:col-start-1">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={item.image} alt={`VEO ${item.year}`} className="h-full w-full object-cover" />
                    </div>
                    <div className="p-5">
                      <p className="text-xl font-bold text-solar-orange md:hidden">{item.year}</p>
                      <p className="mt-2 text-sm leading-6 text-on-surface-variant md:mt-0">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-primary sm:text-3xl">Đội ngũ điều hành</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {leaders.map((leader) => (
              <article
                key={leader.name}
                className="rounded-xl border border-outline-variant/30 bg-white p-5 text-center shadow-[0_8px_28px_rgba(108,42,138,0.08)]"
              >
                {"image" in leader ? (
                  <div className="mx-auto mb-4 aspect-square w-36 overflow-hidden rounded-full">
                    <img src={leader.image} alt={leader.name} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="mx-auto mb-4 flex aspect-square w-36 items-center justify-center rounded-full bg-primary text-4xl font-bold text-pure-white">
                    {leader.initials}
                  </div>
                )}
                <h3 className="font-bold text-primary">{leader.name}</h3>
                <p className="mt-1 text-sm text-on-surface-variant">{leader.role}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
