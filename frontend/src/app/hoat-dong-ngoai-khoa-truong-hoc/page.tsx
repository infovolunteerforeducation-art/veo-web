import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FAQAccordion from "@/components/trai-he/FAQAccordion";
import ConsultationButton from "@/components/school-activities/ConsultationButton";
import { getSchoolContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Hoạt động ngoại khóa cho học sinh | VEO",
  description:
    "Giải pháp trải nghiệm hoạt động ngoại khóa khác biệt dành cho học sinh, thiết kế theo mục tiêu giáo dục của nhà trường.",
};

const _heroPoints = [
  { icon: "handshake", text: "Đồng hành cùng đối tác trong giáo dục giá trị nhân văn" },
  { icon: "workspace_premium", text: "Hơn 12 năm kinh nghiệm triển khai hoạt động ngoại khóa dành cho học sinh, sinh viên" },
  { icon: "groups", text: "Đội ngũ nhân sự chuyên nghiệp thiết kế chương trình phù hợp từng lứa tuổi" },
];

const _partnerGallery = [
  { id: "pg1", name: "True North School", image: "/school-activities/true-north.jpg" },
  { id: "pg2", name: "British University Vietnam (BUV)", image: "/school-activities/buv.jpg" },
  { id: "pg3", name: "Delta Global School (DGS)", image: "/school-activities/delta.jpg" },
  { id: "pg4", name: "RMIT Vietnam", image: "/school-activities/rmit.jpg" },
  { id: "pg5", name: "Alfred Nobel School", image: "/school-activities/alfred-nobel.jpg" },
  { id: "pg6", name: "Vinschool", image: "/school-activities/vinschool-2.jpg" },
  { id: "pg7", name: "Greenfield School", image: "/school-activities/greenfield.jpg" },
  { id: "pg8", name: "TH School", image: "/school-activities/th-school.jpg" },
];

const _challenges = [
  {
    id: "ch1",
    icon: "travel_explore",
    tone: "bg-amber-100 text-amber-700 ring-amber-200",
    title: "Nội dung thiếu tính đổi mới",
    description:
      "Các hoạt động tham quan truyền thống dễ đi vào lối mòn, thiếu chiều sâu giáo dục và chưa bám sát định hướng riêng của nhà trường.",
  },
  {
    id: "ch2",
    icon: "diversity_3",
    tone: "bg-orange-100 text-orange-700 ring-orange-200",
    title: "Thiếu tính bền vững và sự gắn kết",
    description:
      "Dự án cộng đồng còn rời rạc, mang tính thời điểm, khó tạo giá trị dài hạn cho học sinh và địa phương.",
  },
  {
    id: "ch3",
    icon: "health_and_safety",
    tone: "bg-red-50 text-red-600 ring-red-100",
    title: "Gánh nặng vận hành & an toàn",
    description:
      "Nhà trường cần kiểm soát rủi ro, hậu cần, nhân sự điều phối và tiêu chuẩn an toàn khi đưa học sinh đi thực địa.",
  },
  {
    id: "ch4",
    icon: "fact_check",
    tone: "bg-yellow-100 text-yellow-700 ring-yellow-200",
    title: "Khó khăn trong việc thực chứng kết quả",
    description:
      "Học sinh tham gia thiện nguyện cần được hướng dẫn đúc kết trải nghiệm, ghi nhận kết quả và phát triển hồ sơ cá nhân.",
  },
];

const _schoolValues = [
  {
    id: "sv1",
    icon: "school",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    title: "Hiện thực hoá mục tiêu giáo dục toàn diện",
    description: "Đồng hành cùng đối tác triển khai học tập trải nghiệm ngoài lớp học.",
  },
  {
    id: "sv2",
    icon: "workspace_premium",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    title: "Khẳng định vị thế của cơ sở giáo dục",
    description:
      "Giúp nhà trường bắt kịp xu hướng giáo dục toàn cầu, phát triển bền vững và trách nhiệm xã hội.",
  },
  {
    id: "sv3",
    icon: "experiment",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    title: "Học tập qua trải nghiệm thực tế",
    description: "Chương trình bài bản, dễ triển khai, học qua thực hành và hoạt động cộng đồng.",
  },
  {
    id: "sv4",
    icon: "explore",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    title: "Mở rộng góc nhìn – định hướng tương lai",
    description: "Đồng hành cùng nhà trường hỗ trợ hướng nghiệp và phát triển cá nhân cho học sinh.",
  },
  {
    id: "sv5",
    icon: "support_agent",
    tone: "bg-sky-50 text-sky-700 ring-sky-100",
    title: "Giải phóng nguồn lực nhân sự",
    description:
      "VEO phụ trách khảo sát địa phương, hậu cần, vận hành và quản trị rủi ro để nhà trường tập trung vào mục tiêu giáo dục.",
  },
];

const _studentValues = [
  {
    id: "stv1",
    icon: "assignment_ind",
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    title: "Làm đẹp hồ sơ du học (Portfolio)",
    description:
      "Cung cấp chứng nhận tham gia dự án cộng đồng và tư liệu trải nghiệm giúp học sinh tạo dấu ấn cá nhân.",
  },
  {
    id: "stv2",
    icon: "psychology",
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    title: "Phát triển kỹ năng 4C của thế kỷ 21",
    description:
      "Rèn luyện tư duy phản biện, sáng tạo, giao tiếp và hợp tác thông qua hoạt động thực tế.",
  },
  {
    id: "stv3",
    icon: "favorite",
    tone: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    title: "Định hướng giá trị bản thân",
    description:
      "Giúp học sinh bước ra khỏi vùng an toàn, thấu hiểu thực trạng xã hội và nuôi dưỡng trách nhiệm với cộng đồng.",
  },
];

const _parentValues = [
  {
    id: "pv1",
    icon: "verified_user",
    tone: "bg-green-50 text-green-700 ring-green-100",
    title: "Cam kết an toàn tuyệt đối",
    description:
      "Phụ huynh yên tâm với tiêu chuẩn lưu trú, ăn uống, di chuyển và hệ thống quản lý rủi ro trong chuyến đi.",
  },
  {
    id: "pv2",
    icon: "visibility",
    tone: "bg-green-50 text-green-700 ring-green-100",
    title: "Nhìn thấy sự thay đổi của con",
    description:
      "Hình ảnh, video và nhật ký trải nghiệm được cập nhật để phụ huynh theo dõi hành trình trưởng thành của học sinh.",
  },
];

const _solutions = [
  {
    id: "sol1",
    title: "Workshop phát triển kỹ năng và tư duy",
    description: "Mô hình đào tạo nhanh, gọn, quy mô lớn, tập trung kỹ năng và tư duy ứng dụng thực tế.",
  },
  {
    id: "sol2",
    title: "Trại hè tình nguyện",
    description:
      "Hành trình 6 ngày 5 đêm giúp học sinh nhập vai công dân bản địa, thấu cảm sâu và tạo tác động thực chất tại cộng đồng.",
  },
  {
    id: "sol3",
    title: "Hành trình vì cộng đồng",
    description:
      "Chương trình kết hợp trải nghiệm thực tế và hoạt động tình nguyện, giúp học sinh học qua trải nghiệm và đóng góp cho địa phương.",
  },
  {
    id: "sol4",
    title: "Chương trình trải nghiệm định hướng nghề nghiệp",
    description:
      "Kiến tạo tư duy thông qua trải nghiệm thực tế, quan sát nghề nghiệp và giải quyết các vấn đề xã hội.",
  },
  {
    id: "sol5",
    title: "Social Leader Program",
    description:
      "Chương trình kiến tạo dấu ấn cá nhân dành cho học sinh THPT qua dự án xã hội để chinh phục học bổng quốc tế.",
  },
];

const projectCases = [
  {
    title: "Du lịch tình nguyện cùng TH School",
    image: "/about-veo/timeline-2019-kttv.webp",
    description:
      "Tháng 3/2023, TH School tổ chức hoạt động ngoại khóa thường niên cho học sinh các khối với sự đồng hành của VEO.",
    sections: [
      {
        title: "Giáo dục và cơ hội tiếp cận",
        items: ["Tổ chức hoạt động ngoại khóa tiếng Anh, xây dựng tủ sách cộng đồng"],
      },
      {
        title: "Sức khỏe, dinh dưỡng học đường",
        items: ["Trao tặng sữa cho học sinh tại các điểm trường"],
      },
      {
        title: "Phát triển cộng đồng bền vững",
        items: ["Giao lưu, trải nghiệm văn hóa bản địa và hỗ trợ sinh kế địa phương"],
      },
    ],
  },
  {
    title: "Du lịch và trại hè tình nguyện cùng Kênh Du Học",
    image: "/about-veo/program-summer-camp.webp",
    description:
      "Từ lần hợp tác đầu tiên năm 2019, Kênh Du Học đồng hành cùng VEO trong các hoạt động thường niên hướng về cộng đồng.",
    sections: [
      {
        title: "Giáo dục",
        items: ["Xây dựng tủ sách, tổ chức hoạt động tiếng Anh và giao lưu học tập"],
      },
      {
        title: "Phát triển hạ tầng",
        items: ["Lắp đèn năng lượng, cải tạo nhà vệ sinh và xây dựng sân chơi cộng đồng"],
      },
      {
        title: "Bảo tồn văn hóa",
        items: ["Làm cơm lam, gói bánh chưng gù, giã bánh dày và giao lưu văn nghệ"],
      },
      {
        title: "Hội nhập",
        items: ["Kết nối học sinh với tình nguyện viên thông qua giao lưu, học tập và hoạt động nhóm."],
      },
    ],
  },
];

const _process = [
  {
    id: "pr1",
    step: "01",
    title: "Tư vấn & phân tích nhu cầu đối tác",
    description:
      "Khảo sát mục tiêu giáo dục, độ tuổi và kỳ vọng của cơ sở giáo dục để tư vấn giải pháp trải nghiệm phù hợp nhất.",
  },
  {
    id: "pr2",
    step: "02",
    title: "Thiết kế và đề xuất chương trình học tập",
    description:
      "Xây dựng giáo án trải nghiệm riêng, đảm bảo tính khoa học và lồng ghép giá trị thực tiễn vào chương trình.",
  },
  {
    id: "pr3",
    step: "03",
    title: "Tổ chức hoạt động thực tế & giám sát",
    description:
      "Trực tiếp điều phối chương trình với quy trình giám sát chặt chẽ, ưu tiên an toàn và mục tiêu học tập.",
  },
  {
    id: "pr4",
    step: "04",
    title: "Tổng kết & đánh giá kết quả",
    description:
      "Hệ thống hóa số liệu, cung cấp báo cáo thu hoạch và cấp chứng nhận hoàn thành cho học sinh.",
  },
];

const _safety = [
  {
    id: "sf1",
    title: "Bảo hiểm & an toàn",
    description: "Quy trình quản lý rủi ro đạt chuẩn, đội ngũ hướng dẫn có kỹ năng sơ cấp cứu.",
  },
  {
    id: "sf2",
    title: "Điều phối chuyên nghiệp",
    description: "Đội ngũ am hiểu tâm lý học sinh và có kinh nghiệm làm việc trong môi trường sư phạm.",
  },
  {
    id: "sf3",
    title: "Hỗ trợ giáo viên",
    description: "VEO lo khâu vận hành để giáo viên tập trung quan sát, đồng hành và hướng dẫn học sinh.",
  },
];

const _veoStats = [
  { id: "st1", value: "12+", label: "năm hoạt động" },
  { id: "st2", value: "15+", label: "điểm dự án" },
  { id: "st3", value: "120.000+", label: "tình nguyện viên" },
  { id: "st4", value: "1.000+", label: "chuyến đi" },
];

const _schoolActivityFaqs = [
  {
    id: "faq1",
    q: "Nhà trường có thể đặt chương trình theo nhu cầu riêng không?",
    a: "Có. VEO thiết kế chương trình theo mục tiêu giáo dục, độ tuổi học sinh, thời lượng, ngân sách và yêu cầu vận hành riêng của từng trường.",
  },
  {
    id: "faq2",
    q: "Chương trình phù hợp với học sinh độ tuổi nào?",
    a: "VEO có thể xây dựng chương trình cho nhiều cấp học, từ tiểu học, THCS, THPT đến sinh viên. Nội dung, mức độ hoạt động và phương án an toàn được điều chỉnh theo từng nhóm tuổi.",
  },
  {
    id: "faq3",
    q: "VEO phụ trách những phần nào trong quá trình tổ chức?",
    a: "VEO hỗ trợ từ khảo sát địa phương, thiết kế nội dung, điều phối hậu cần, nhân sự hướng dẫn, quản trị rủi ro đến tổng kết sau chương trình.",
  },
  {
    id: "faq4",
    q: "Nhà trường có nhận được báo cáo hoặc chứng nhận sau chương trình không?",
    a: "Có. Tùy gói triển khai, VEO có thể cung cấp hình ảnh, video, báo cáo tổng kết, chứng nhận tham gia và tư liệu giúp học sinh hoàn thiện portfolio.",
  },
  {
    id: "faq5",
    q: "Làm sao để đảm bảo an toàn cho học sinh?",
    a: "Mỗi chương trình đều có phương án di chuyển, lưu trú, ăn uống, bảo hiểm, nhân sự phụ trách nhóm và quy trình xử lý tình huống rõ ràng.",
  },
  {
    id: "faq6",
    q: "Nhà trường cần chuẩn bị gì trước khi làm việc với VEO?",
    a: "Nhà trường chỉ cần chia sẻ mục tiêu, số lượng học sinh, độ tuổi, thời lượng dự kiến và các yêu cầu đặc biệt. VEO sẽ tư vấn giải pháp phù hợp.",
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

export default function SchoolActivitiesPage() {
  const cms = getSchoolContent();
  const heroImage = cms.heroImage || "/about-veo/timeline-2019-kttv.webp";
  const heroTitle = cms.heroTitle || "Giải pháp trải nghiệm hoạt động ngoại khóa khác biệt dành cho học sinh";
  const heroSubtitle = cms.heroSubtitle || "VEO giúp nhà trường triển khai các chương trình trải nghiệm thực tế, kỹ năng và định hướng phù hợp với mục tiêu giáo dục.";
  const heroPoints = cms.heroPoints.length > 0
    ? cms.heroPoints.map((text) => ({ icon: "check_circle", text }))
    : _heroPoints;
  const partnerGallery = cms.partnerGallery.length > 0 ? cms.partnerGallery : _partnerGallery;
  const challenges = cms.challenges.length > 0 ? cms.challenges : _challenges;
  const schoolValues = cms.schoolValues.length > 0 ? cms.schoolValues : _schoolValues;
  const studentValues = cms.studentValues.length > 0 ? cms.studentValues : _studentValues;
  const parentValues = cms.parentValues.length > 0 ? cms.parentValues : _parentValues;
  const solutions = cms.solutions.length > 0 ? cms.solutions : _solutions;
  const process = cms.process.length > 0 ? cms.process : _process;
  const safety = cms.safety.length > 0 ? cms.safety : _safety;
  const veoStats = cms.veoStats.length > 0 ? cms.veoStats : _veoStats;
  const schoolActivityFaqs = cms.faqs.length > 0 ? cms.faqs : _schoolActivityFaqs;

  return (
    <>
      <Header />
      <main className="bg-white">
        <section className="relative min-h-[560px] overflow-hidden">
          <Image
            src={heroImage}
            alt="Hoạt động ngoại khóa cho học sinh cùng VEO"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/25" />
          <div className="relative mx-auto flex min-h-[560px] max-w-[1200px] flex-col justify-end px-4 pb-12 pt-24 sm:px-6 sm:pb-16">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-solar-orange">
              Giải pháp ngoại khóa chuyên biệt cho nhà trường
            </p>
            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {heroTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-white/90 sm:text-lg">
              {heroSubtitle}
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-[1fr_1.08fr_1fr]">
              {heroPoints.map((point) => (
                <div key={point.text} className="flex min-h-[86px] items-center gap-3 rounded-xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/16 text-white ring-1 ring-white/20">
                    <span className="material-symbols-outlined text-[20px]">{point.icon}</span>
                  </span>
                  <p className="text-[13px] font-semibold leading-5 text-white xl:text-sm">{point.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ConsultationButton
                label="Nhận tư vấn ngay"
                className="inline-flex items-center gap-2 rounded-full bg-solar-orange px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-action-hover"
              />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle
              center
              title="Đồng hành cùng 50+ đơn vị trong hành trình thực hiện hóa mục tiêu giáo dục"
              description="Nhiều đơn vị giáo dục và trường học đã đồng hành cùng VEO trong hành trình tạo ra các hoạt động ngoại khóa ý nghĩa, bổ ích và định hướng dành cho học sinh, sinh viên."
            />
            <div className="relative mx-auto h-[190px] w-full max-w-[1200px] overflow-hidden rounded-xl bg-white sm:h-[250px] lg:h-[310px]">
              <Image
                src="/school-activities/logos-collage-1.png"
                alt="Các đối tác giáo dục đồng hành cùng VEO"
                fill
                sizes="(min-width: 1200px) 1200px, 100vw"
                className="object-cover object-[center_47%]"
              />
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {partnerGallery.map((partner) => (
                <figure key={partner.name} className="overflow-hidden rounded-sm bg-white shadow-[0_10px_30px_rgba(35,18,55,0.08)]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={partner.image}
                      alt={partner.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="px-4 py-4 text-center text-base font-semibold text-primary">
                    {partner.name}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-amber-50 py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle
              eyebrow="Thách thức của nhà trường"
              title="Thách thức trong việc triển khai hoạt động ngoại khóa"
              description="Hoạt động ngoại khóa cần vượt qua mô hình tham quan đơn thuần để trở thành trải nghiệm học tập có mục tiêu, có tác động và có khả năng ghi nhận kết quả."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {challenges.map((item) => (
                <div key={item.title} className="rounded-xl border border-amber-200/70 bg-white p-5 shadow-sm">
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${item.tone}`}>
                    <span className="material-symbols-outlined text-[26px]">{item.icon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-on-surface">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle
              title="Giá trị VEO mang lại cho đơn vị giáo dục & học sinh"
              description="VEO thiết kế chương trình để tạo giá trị đồng thời cho nhà trường, học sinh và phụ huynh."
            />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm lg:col-span-3">
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-sky-800">
                  Đối với Nhà trường
                </span>
                <h3 className="mt-2 text-2xl font-bold text-primary">Nâng tầm vị thế & tối ưu vận hành</h3>
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {schoolValues.map((item) => (
                    <div key={item.title} className={`rounded-xl p-4 ring-1 ${item.tone ?? "bg-sky-50 text-sky-700 ring-sky-100"}`}>
                      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-current/15">
                        <span className="material-symbols-outlined text-[24px]">{item.icon ?? "school"}</span>
                      </div>
                      <h4 className="text-base font-bold text-on-surface">{item.title}</h4>
                      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:col-span-3">
                <div className="rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm">
                  <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-indigo-800">
                    Đối với Học sinh
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-primary">Trưởng thành từ trải nghiệm thực tế</h3>
                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {studentValues.map((item) => (
                      <div key={item.title} className={`rounded-xl p-4 ring-1 ${item.tone ?? "bg-indigo-50 text-indigo-700 ring-indigo-100"}`}>
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-current/15">
                          <span className="material-symbols-outlined text-[24px]">{item.icon ?? "psychology"}</span>
                        </div>
                        <h4 className="text-base font-bold text-on-surface">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm">
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-800">
                    Đối với Phụ huynh
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-primary">Sự an tâm và tự hào</h3>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {parentValues.map((item) => (
                      <div key={item.title} className={`rounded-xl p-4 ring-1 ${item.tone ?? "bg-green-50 text-green-700 ring-green-100"}`}>
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-current/15">
                          <span className="material-symbols-outlined text-[24px]">{item.icon ?? "verified_user"}</span>
                        </div>
                        <h4 className="text-base font-bold text-on-surface">{item.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-on-surface-variant">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="giai-phap" className="bg-surface-container-low py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle
              center
              title="Giải pháp trải nghiệm giáo dục trọn gói cho đơn vị"
              description="Chương trình thiết kế phù hợp với mục tiêu phát triển bền vững (SDGs), đảm bảo tiêu chuẩn an toàn và linh hoạt theo nhu cầu từng đối tác."
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
              {solutions.map((item, index) => (
                <div
                  key={item.title}
                  className={`rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm lg:col-span-2 ${
                    index === 3 ? "lg:col-start-2" : ""
                  }`}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-black text-white">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-lg font-bold text-primary">{item.title}</h3>
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
              {projectCases.map((project) => (
                <div key={project.title} className="overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-sm">
                  <div className="relative aspect-[16/9]">
                    <Image src={project.image} alt={project.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary">{project.title}</h3>
                    <p className="mt-3 text-base leading-7 text-on-surface-variant">{project.description}</p>
                    <div className="mt-6 space-y-5">
                      {project.sections.map((section) => (
                        <div key={section.title} className="grid grid-cols-[6px_1fr] gap-x-2">
                          <h4 className="col-span-2 grid grid-cols-subgrid items-center text-base font-bold text-primary">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-solar-orange" />
                            <span>{section.title}</span>
                          </h4>
                          <p className="col-start-2 mt-2 text-sm leading-6 text-on-surface-variant">{section.items.join(" ")}</p>
                        </div>
                      ))}
                    </div>
                  </div>
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
                    <>
                      <span className="absolute -right-7 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-solar-orange text-white shadow-lg ring-4 ring-surface-container-low lg:flex">
                        <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
                      </span>
                      <span className="absolute -bottom-6 left-1/2 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full bg-solar-orange text-white shadow-md ring-4 ring-surface-container-low md:hidden">
                        <span className="material-symbols-outlined text-[22px]">arrow_downward</span>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionTitle
              center
              title="Cam kết an toàn"
              description="100+ trường học khẳng định chất lượng đào tạo thông qua sự dấn thân trong các dự án cộng đồng."
            />
            <div className="grid gap-5 md:grid-cols-3">
              {safety.map((item) => (
                <div key={item.title} className="rounded-xl border border-outline-variant/30 bg-white p-6 shadow-sm">
                  <span className="material-symbols-outlined text-3xl text-primary">verified</span>
                  <h3 className="mt-4 text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-16 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] gap-8 px-4 text-white sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-solar-orange">Volunteer For Education</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">VEO đồng hành cùng thế hệ trẻ tạo giá trị bền vững</h2>
              <p className="mt-5 text-base leading-8 text-white/85">
                VEO là mạng lưới kết nối thế hệ trẻ với tinh thần đóng góp cho xã hội, hướng tới tạo ra giá trị bền vững
                cho các cộng đồng yếu thế. Mỗi hành trình không chỉ mang tri thức đến địa phương mà còn mở ra trải nghiệm
                thực tế, góp phần nâng cao năng lực cộng đồng và lan tỏa tinh thần phát triển bền vững.
              </p>
              <ConsultationButton
                label="Nhận tư vấn miễn phí ngay hôm nay"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-solar-orange px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-action-hover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {veoStats.map((item) => (
                <div key={item.label} className="rounded-xl bg-white/10 p-5 text-center ring-1 ring-white/15">
                  <p className="text-3xl font-black text-white">{item.value}</p>
                  <p className="mt-1 text-sm font-semibold text-white/75">{item.label}</p>
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
              description="Một vài thông tin nhà trường và phụ huynh thường quan tâm trước khi triển khai hoạt động ngoại khóa cùng VEO."
            />
            <FAQAccordion items={schoolActivityFaqs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
