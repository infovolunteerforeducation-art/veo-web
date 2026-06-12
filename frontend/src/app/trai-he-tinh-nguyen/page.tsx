import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FAQAccordion from "@/components/trai-he/FAQAccordion";
import { camps } from "@/lib/trai-he-data";

const heroImage = "/trai-he/volunteer-summer-camp-hero.png";
const youtubeVideoId = "LCJqDRXphLk";
const youtubeEmbedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1`;
const youtubeThumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`;
const youtubeSrcDoc = `
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; background: #451e6b; }
    a { position: absolute; inset: 0; display: block; color: white; text-decoration: none; }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
    .shade { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(69,30,107,0.10), rgba(69,30,107,0.45)); }
    .play {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 76px;
      height: 76px;
      transform: translate(-50%, -50%);
      border-radius: 999px;
      background: #fbb040;
      box-shadow: 0 18px 40px rgba(0,0,0,0.24);
      display: grid;
      place-items: center;
      font: 700 34px/1 Arial, sans-serif;
      padding-left: 5px;
    }
  </style>
  <a href="${youtubeEmbedUrl}" aria-label="Phát video trại hè tình nguyện VEO">
    <img src="${youtubeThumbnailUrl}" alt="Thumbnail video trại hè tình nguyện VEO" />
    <span class="shade"></span>
    <span class="play">▶</span>
  </a>
`;

export const metadata: Metadata = {
  title: "Trại hè tình nguyện VEO 2026 | Trải nghiệm mùa hè vì cộng đồng",
  description:
    "Trại hè tình nguyện VEO dành cho học sinh, sinh viên từ 10 đến 22 tuổi với hoạt động cộng đồng, trải nghiệm văn hóa và rèn luyện kỹ năng sống.",
};

const highlights = [
  { icon: "groups", value: "10-22", label: "độ tuổi phù hợp" },
  { icon: "calendar_month", value: "6N5Đ", label: "lịch trình trải nghiệm" },
  { icon: "location_on", value: "3", label: "điểm đến tình nguyện" },
  { icon: "volunteer_activism", value: "120K+", label: "cộng đồng VEO" },
];


const pillars = [
  {
    icon: "school",
    title: "Học qua trải nghiệm",
    desc: "Học viên không chỉ nghe kể về cộng đồng mà trực tiếp tham gia dạy học, chuẩn bị học liệu, trồng cây và vận hành một dự án nhỏ theo nhóm.",
  },
  {
    icon: "diversity_3",
    title: "Sống cùng tập thể",
    desc: "Các bạn rèn tính tự lập, kỷ luật cá nhân, giao tiếp và hợp tác qua sinh hoạt nhóm, phân vai nhiệm vụ và phiên phản tư cuối ngày.",
  },
  {
    icon: "landscape",
    title: "Kết nối văn hóa bản địa",
    desc: "Chương trình đưa học viên đến gần đời sống địa phương qua bữa ăn, nghề truyền thống, giao lưu với trẻ em và người dân bản địa.",
  },
];

const featureCards = [
  {
    image: "/trai-he/feature-volunteer-work.png",
    title: "Tham gia hoạt động tình nguyện bền vững",
    desc: "Trực tiếp vận hành dự án dạy học, xây tủ sách và cải tạo trường học. Hành trình giúp các tình nguyện viên thấu hiểu tình nguyện là gì thông qua các hoạt động tình nguyện thực tế.",
  },
  {
    image: "/trai-he/feature-soft-skills.png",
    title: "Rèn luyện kỹ năng mềm thực tế",
    desc: "Rèn luyện kỹ năng giao tiếp, làm việc nhóm và tư duy phản biện. Đây là nền tảng kỹ năng sống vững chắc giúp học sinh tự tin bứt phá.",
  },
  {
    image: "/trai-he/feature-local-culture.png",
    title: "Hòa nhập văn hóa bản địa độc đáo",
    desc: "Sống cùng đồng bào, làm nghề truyền thống và thấu hiểu bản sắc địa phương. Một hành trình hoạt động ngoại khóa sinh động giúp học sinh mở rộng thế giới quan.",
  },
  {
    image: "/trai-he/feature-experiential-learning.png",
    title: "Trải nghiệm mô hình sáng tạo đa chiều",
    desc: "Ứng dụng mô hình Học tập qua trải nghiệm qua chuỗi hoạt động ngoại khóa đa dạng. Từ dạy học cộng đồng đến sinh tồn thiên nhiên, giúp các em làm chủ kỹ năng sống.",
  },
];

const universities = [
  { type: "melbourne", rank: "Top 1 Australia" },
  { type: "nyu", rank: "Top 30 United States" },
  { type: "monash", rank: "Top 5 Australia" },
  { type: "sydney", rank: "Top 3 Australia" },
  { type: "california", rank: "Top 20 United States" },
  { type: "tum", rank: "Top 3 Germany" },
  { type: "imperial", rank: "Top 3 United Kingdom" },
  { type: "edinburgh", rank: "Top 5 United Kingdom" },
] as const;

const programs = [
  {
    title: "Khối cấp 2",
    age: "10 - 15 tuổi",
    image: "/trai-he/age-10-15-khoi-cap-2.png",
    desc: "Tập trung vào tự lập, thích nghi, giao tiếp cơ bản và tinh thần sẻ chia qua các thử thách vừa sức.",
  },
  {
    title: "Khối cấp 3",
    age: "16 - 18 tuổi",
    image: "/trai-he/age-16-18-khoi-cap-3.png",
    desc: "Tăng cường tư duy lãnh đạo, làm việc nhóm và khả năng trình bày một dự án cộng đồng có mục tiêu rõ ràng.",
  },
  {
    title: "Sinh viên",
    age: "19 - 22 tuổi",
    image: "/trai-he/age-19-22-sinh-vien.png",
    desc: "Trực tiếp tham gia điều phối hoạt động, hỗ trợ học viên nhỏ tuổi và hiểu sâu hơn về phát triển cộng đồng bền vững.",
  },
];

const schedule = [
  ["Ngày 1", "Làm quen đội nhóm, di chuyển đến điểm dự án, phổ biến quy tắc an toàn."],
  ["Ngày 2", "Khảo sát nhu cầu địa phương, chuẩn bị học liệu và hoạt động cộng đồng."],
  ["Ngày 3", "Dạy học, trồng cây hoặc cải tạo không gian học tập cùng trẻ em địa phương."],
  ["Ngày 4", "Trải nghiệm văn hóa bản địa, học nghề truyền thống và sinh hoạt cùng người dân."],
  ["Ngày 5", "Hoàn thiện dự án nhóm, chia sẻ kết quả và phản tư kỹ năng đã học."],
  ["Ngày 6", "Tổng kết, trao chứng nhận, trở về điểm tập trung."],
];

const outcomes = [
  "Tự lập và quản lý bản thân trong môi trường mới",
  "Giao tiếp, hợp tác và giải quyết vấn đề theo nhóm",
  "Hiểu hơn về trách nhiệm xã hội và phát triển bền vững",
  "Có câu chuyện trải nghiệm thực tế cho hồ sơ cá nhân",
  "Nhận chứng nhận tham gia chương trình tình nguyện VEO",
];

const testimonials = [
  {
    name: "Thanh An",
    role: "Học viên trại hè Mai Châu",
    quote:
      "Em học được cách chủ động hơn, biết lắng nghe bạn trong nhóm và thấy những việc nhỏ của mình thật sự có ích cho các em nhỏ ở bản.",
  },
  {
    name: "Chị Hoàng Thương",
    role: "Phụ huynh học viên",
    quote:
      "Con trở về tự tin và biết quan tâm đến mọi người hơn. Điều tôi thích nhất là chương trình có kỷ luật nhưng vẫn rất ấm áp.",
  },
  {
    name: "Minh Ngọc",
    role: "Tình nguyện viên sinh viên",
    quote:
      "Đây là mùa hè mình thấy mình trưởng thành rõ nhất: vừa làm việc thật, vừa có mentor góp ý để hiểu mình đang tốt lên ở đâu.",
  },
];

const expertOrganizations = [
  {
    type: "veo",
    desc: "Doanh nghiệp tạo tác động xã hội\nCông ty TNHH Du lịch và Đào tạo V.E.O Việt Nam",
  },
  {
    type: "vfe",
    desc: "Tổ chức phi chính phủ quốc tế Volunteers For Education Organization - VFE (Thụy Sỹ)",
  },
  {
    type: "undp",
    desc: "Chương trình Phát triển Liên Hợp Quốc - United Nations Development Programme (UNDP)",
  },
  {
    type: "business",
    desc: "Các doanh nghiệp đầu ngành khác",
  },
] as const;

const partnerSchools = ["buv", "greenfield", "vinschool", "thschool"] as const;

function LogoImage({
  src,
  alt,
  className,
  wrapperClassName = "",
}: {
  src: string;
  alt: string;
  className: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={`flex items-center justify-center ${wrapperClassName}`}>
      <img src={src} alt={alt} className={`w-auto object-contain ${className}`} />
    </div>
  );
}

function ExpertLogo({ type }: { type: (typeof expertOrganizations)[number]["type"] }) {
  if (type === "veo") {
    return <LogoImage src="/veo-logo.png" alt="Volunteer For Education" className="h-14 max-w-44" />;
  }

  if (type === "vfe") {
    return <LogoImage src="/trai-he/logos/vfe.png" alt="Volunteers For Education Organization" className="h-16 max-w-40" />;
  }

  if (type === "undp") {
    return <LogoImage src="/trai-he/logos/undp.svg" alt="United Nations Development Programme" className="h-16 max-w-24" />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 md:flex-row md:flex-wrap md:gap-x-5">
      <LogoImage src="/trai-he/logos/ey.png" alt="EY" className="h-10 max-w-16 md:h-14 md:max-w-20" />
      <LogoImage src="/trai-he/logos/one-mount.svg" alt="One Mount" className="h-8 max-w-32 md:h-10 md:max-w-36" />
      <LogoImage src="/trai-he/logos/techcombank.svg" alt="Techcombank" className="h-5 max-w-36 md:h-8 md:max-w-40" />
    </div>
  );
}

function PartnerLogo({ type }: { type: (typeof partnerSchools)[number] }) {
  if (type === "buv") {
    return <LogoImage src="/trai-he/logos/buv.png" alt="British University Vietnam" className="h-14 max-w-44" />;
  }

  if (type === "greenfield") {
    return <LogoImage src="/trai-he/logos/greenfield.png" alt="Greenfield School" className="h-24 max-w-44" />;
  }

  if (type === "vinschool") {
    return (
      <LogoImage
        src="/trai-he/logos/vinschool.png"
        alt="Vinschool"
        className="h-12 max-w-32"
        wrapperClassName="rounded bg-[#23366f] px-4"
      />
    );
  }

  return <LogoImage src="/trai-he/logos/th-school.svg" alt="TH School" className="h-16 max-w-44" />;
}

const universityLogoSrc: Record<(typeof universities)[number]["type"], string> = {
  melbourne: "https://upload.wikimedia.org/wikipedia/en/thumb/5/50/The_University_of_Melbourne_Logo.svg/250px-The_University_of_Melbourne_Logo.svg.png",
  nyu:       "https://upload.wikimedia.org/wikipedia/commons/6/6a/Nyu_short_color.svg",
  monash:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Monash_University_logo.svg/250px-Monash_University_logo.svg.png",
  sydney:    "https://upload.wikimedia.org/wikipedia/en/thumb/3/37/The_University_of_Sydney_Logo.svg/250px-The_University_of_Sydney_Logo.svg.png",
  california:"https://upload.wikimedia.org/wikipedia/en/thumb/8/85/University_of_California%2C_Berkeley_Logo_2024.svg/250px-University_of_California%2C_Berkeley_Logo_2024.svg.png",
  tum:       "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Logo_of_the_Technical_University_of_Munich.svg/250px-Logo_of_the_Technical_University_of_Munich.svg.png",
  imperial:  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Imperial_College_London_new_logo.png/250px-Imperial_College_London_new_logo.png",
  edinburgh: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/University_of_Edinburgh_Corporate_Logo_Colour.svg/330px-University_of_Edinburgh_Corporate_Logo_Colour.svg.png",
};

const universityLogoAlt: Record<(typeof universities)[number]["type"], string> = {
  melbourne: "The University of Melbourne",
  nyu:       "New York University",
  monash:    "Monash University",
  sydney:    "The University of Sydney",
  california:"University of California, Berkeley",
  tum:       "Technical University of Munich",
  imperial:  "Imperial College London",
  edinburgh: "The University of Edinburgh",
};

function UniversityLogo({ type }: { type: (typeof universities)[number]["type"] }) {
  return (
    <img
      src={universityLogoSrc[type]}
      alt={universityLogoAlt[type]}
      className="max-h-12 w-auto max-w-[140px] object-contain"
    />
  );
}

function SectionHeading({
  eyebrow,
  title,
  desc,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  desc?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && (
        <p className={`mb-2 text-xs font-bold uppercase tracking-wide ${light ? "text-solar-orange" : "text-solar-orange"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-2xl font-bold leading-tight sm:text-3xl ${light ? "text-white" : "text-primary"}`}>
        {title}
      </h2>
      {desc && (
        <p className={`mt-3 text-base leading-relaxed ${light ? "text-white/80" : "text-on-surface-variant"}`}>
          {desc}
        </p>
      )}
    </div>
  );
}

function CampListingsSection() {
  return (
    <section id="chuong-trinh" className="relative scroll-mt-24 overflow-hidden bg-deep-amethyst py-16 sm:py-20">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-[300px] w-[300px] rounded-full bg-solar-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-[80px]" />
      {/* dot grid top-left */}
      <svg className="pointer-events-none absolute top-8 left-6 opacity-10" width="120" height="120" viewBox="0 0 120 120" fill="none">
        {Array.from({length: 6}).map((_, r) => Array.from({length: 6}).map((_, c) => (
          <circle key={`${r}-${c}`} cx={c * 20 + 10} cy={r * 20 + 10} r="2" fill="white" />
        )))}
      </svg>
      {/* dot grid bottom-right */}
      <svg className="pointer-events-none absolute bottom-8 right-6 opacity-10" width="120" height="120" viewBox="0 0 120 120" fill="none">
        {Array.from({length: 6}).map((_, r) => Array.from({length: 6}).map((_, c) => (
          <circle key={`${r}-${c}`} cx={c * 20 + 10} cy={r * 20 + 10} r="2" fill="white" />
        )))}
      </svg>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHeading
          eyebrow="3 điểm đến"
          title="Chọn hành trình phù hợp với bạn"
          desc="Mỗi điểm đến mang một màu sắc văn hoá và trải nghiệm khác nhau — cùng một tinh thần tình nguyện VEO."
          light
        />
        <div className="space-y-6">
          {camps.map((camp) => (
            <div key={camp.title} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
                <div className="relative overflow-hidden lg:rounded-l-2xl">
                  <div className="aspect-video sm:aspect-[4/3] lg:aspect-auto lg:h-full">
                    <img src={camp.image} alt={camp.title} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-col justify-between p-4 sm:p-6">
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{camp.location}</p>
                    <h3 className="mt-1 text-lg font-black uppercase leading-snug text-primary sm:text-xl">{camp.title}</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {camp.dates.map((d) => (
                        <span key={d.isoDate} className="inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-semibold text-primary">
                          <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                          {d.label}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Hoạt động tình nguyện</p>
                        <ul className="space-y-1.5">
                          {camp.volunteer.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-[14px] leading-snug text-on-surface-variant">
                              <span className="material-symbols-outlined shrink-0 text-solar-orange" style={{fontSize: 14, lineHeight: "1.4"}}>favorite</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Hoạt động trải nghiệm</p>
                        <ul className="space-y-1.5">
                          {camp.experience.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-[14px] leading-snug text-on-surface-variant">
                              <span className="material-symbols-outlined shrink-0 text-primary" style={{fontSize: 14, lineHeight: "1.4"}}>auto_awesome</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-outline-variant/30 pt-4">
                    <div>
                      <p className="text-xs text-outline">Chi phí từ</p>
                      <p className="text-base font-black text-secondary sm:text-lg">{camp.price} / người</p>
                    </div>
                    <Link
                      href={`/trai-he-tinh-nguyen/${camp.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-solar-orange px-4 py-2 text-sm font-bold text-pure-white transition-colors hover:bg-action-hover sm:gap-2 sm:px-5 sm:py-2.5"
                    >
                      Xem chi tiết
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TraiHeTinhNguyenPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex h-[calc(100svh-80px)] min-h-[480px] max-h-[680px] items-end overflow-hidden sm:h-[calc(100svh-160px)]">
          <img src={heroImage} alt="Trại hè tình nguyện VEO" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(69,30,107,0.92)_0%,rgba(69,30,107,0.55)_50%,rgba(69,30,107,0.18)_100%)] sm:bg-[linear-gradient(90deg,rgba(69,30,107,0.86),rgba(69,30,107,0.54)_45%,rgba(69,30,107,0.16))]" />
          <div className="relative mx-auto w-full max-w-[1200px] px-4 pb-8 sm:px-6 sm:pb-14">
            <div className="max-w-2xl">
              <span className="mb-3 inline-flex w-fit rounded-full bg-white px-3 py-1 text-[14px] font-bold text-primary sm:mb-4">
                Trại hè tình nguyện VEO 2026
              </span>
              <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                Một mùa hè để lớn lên cùng cộng đồng
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base lg:text-lg">
                Chương trình 6 ngày 5 đêm dành cho học sinh, sinh viên muốn rèn kỹ năng sống, trải nghiệm văn hóa bản địa và tạo tác động tích cực qua hoạt động tình nguyện thực tế.
              </p>
              <div className="mt-6 sm:mt-8">
                <Link
                  href="#chuong-trinh"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-solar-orange px-6 py-3 text-sm font-bold text-white shadow-lg transition-colors hover:bg-action-hover sm:py-3.5 sm:text-base"
                >
                  Tham gia ngay
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights strip */}
        <section className="border-b border-outline-variant/30 bg-white">
          <div className="mx-auto grid max-w-[1200px] grid-cols-2 px-4 sm:grid-cols-4 sm:px-6">
            {highlights.map((item, i) => (
              <div
                key={item.label}
                className={[
                  "py-5 text-center sm:py-6 border-outline-variant/30",
                  i % 2 === 0 ? "border-r" : i === 1 ? "sm:border-r" : "",
                  i < 2 ? "border-b sm:border-b-0" : "",
                ].filter(Boolean).join(" ")}
              >
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 26 }}>
                  {item.icon}
                </span>
                <p className="mt-2 text-xl font-black text-primary sm:text-2xl">{item.value}</p>
                <p className="text-xs font-semibold text-on-surface-variant">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tinh thần chương trình */}
        <section className="bg-surface py-12 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionHeading
              eyebrow="Tinh thần chương trình"
              title="Không phải tour nghỉ dưỡng, đây là một hành trình trưởng thành"
              desc="VEO thiết kế trại hè như một môi trường an toàn để học viên thử sức, va chạm vừa đủ và hiểu rằng trách nhiệm cộng đồng bắt đầu từ những hành động rất cụ thể."
            />
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
              {pillars.map((pillar) => (
                <div key={pillar.title} className="rounded-xl border border-outline-variant/30 bg-white p-5 sm:p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">{pillar.icon}</span>
                  </div>
                  <h3 className="text-base font-bold text-primary sm:text-lg">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Điểm khác biệt */}
        <section className="relative overflow-hidden bg-primary py-12 sm:py-20">
          <div className="absolute left-0 top-12 hidden grid-cols-4 gap-2 opacity-50 lg:grid">
            {Array.from({ length: 28 }).map((_, index) => (
              <span key={index} className="h-1 w-1 rounded-full bg-solar-orange" />
            ))}
          </div>
          <div className="absolute -left-16 bottom-20 hidden h-36 w-36 rounded-full border-[18px] border-solar-orange/60 lg:block" />
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <SectionHeading title="Điểm khác biệt chỉ có tại Trại hè tình nguyện của V.E.O" light />
            <div className="grid grid-cols-1 gap-8 sm:gap-x-12 sm:gap-y-12 md:grid-cols-2">
              {featureCards.map((item) => (
                <article key={item.title} className="text-center">
                  <img src={item.image} alt={item.title} className="h-44 w-full rounded-lg object-cover shadow-lg sm:h-56" />
                  <h3 className="mt-4 text-base font-bold text-white sm:mt-5">{item.title}</h3>
                  <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-relaxed text-white/85 sm:mt-3">
                    {item.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Lộ trình theo độ tuổi */}
        <section id="chuong-trinh-age" className="bg-white py-12 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionHeading
              eyebrow="Nhóm tham gia"
              title="Lộ trình phù hợp theo độ tuổi"
              desc="Mỗi nhóm tuổi có mức độ thử thách và vai trò khác nhau, để học viên vừa an toàn, vừa có cảm giác mình thật sự đang đóng góp."
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {programs.map((program) => (
                <article key={program.title} className="overflow-hidden rounded-xl border border-white bg-white shadow-[0_10px_30px_rgba(108,42,138,0.10)]">
                  <img src={program.image} alt={program.title} className="h-44 w-full object-cover sm:h-52" />
                  <div className="p-4 sm:p-5">
                    <span className="inline-flex rounded-full bg-solar-orange/15 px-3 py-1 text-xs font-bold text-secondary">
                      {program.age}
                    </span>
                    <h3 className="mt-3 text-base font-bold text-primary sm:text-lg">{program.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{program.desc}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Lịch trình 6 ngày */}
        <section id="lich-trinh" className="bg-deep-amethyst py-12 sm:py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <SectionHeading
              eyebrow="Lịch trình mẫu"
              title="6 ngày 5 đêm có nhịp đi rõ ràng"
              desc="Lịch trình thực tế có thể thay đổi theo điểm đến và thời tiết, nhưng luôn giữ trục chính: đóng góp, trải nghiệm, phản tư và trưởng thành."
              light
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {schedule.map(([day, text]) => (
                <div key={day} className="flex gap-4 rounded-xl border border-white/15 bg-white/8 p-4 sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-solar-orange text-sm font-black text-white sm:h-12 sm:w-12">
                    {day.replace("Ngày ", "N")}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{day}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/75">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kết quả sau hành trình */}
        <section className="bg-surface py-12 sm:py-20">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-solar-orange">Kết quả sau hành trình</p>
              <h2 className="text-2xl font-bold leading-tight text-primary sm:text-3xl">
                Học viên trở về với kỹ năng, câu chuyện và sự tự tin rõ hơn
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant sm:text-base">
                Chương trình không hứa hẹn biến đổi sau một đêm. Điều VEO tạo ra là một môi trường đủ thật để học viên nhận ra năng lực của mình và tiếp tục hành động sau khi trở về.
              </p>
              <ul className="mt-5 space-y-3">
                {outcomes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm font-medium text-on-surface-variant">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-solar-orange" style={{ fontSize: 20 }}>check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-xl">
              <img src={heroImage} alt="Học viên trại hè tham gia hoạt động cộng đồng" className="h-[240px] w-full object-cover object-right sm:h-[340px] lg:h-[420px]" />
            </div>
          </div>
        </section>

        {/* Chứng nhận */}
        <section className="bg-white py-12 sm:py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-xl font-bold leading-tight text-primary sm:text-2xl lg:text-3xl">
                Chứng nhận trại hè V.E.O<br />
                Tấm vé vàng đến các trường đại học hàng đầu
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-on-surface-variant">
                Hàng ngàn tình nguyện viên đã sử dụng chứng nhận tình nguyện để kiến tạo hồ sơ năng lực ấn tượng, chinh phục học bổng tại các trường đại học danh tiếng.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-10 sm:gap-x-8 sm:gap-y-10 md:grid-cols-4">
              {universities.map((item) => (
                <div key={item.type} className="flex flex-col items-center text-center">
                  <div className="flex h-12 items-center justify-center sm:h-14">
                    <UniversityLogo type={item.type} />
                  </div>
                  <p className="mt-2 text-xs font-medium text-on-surface-variant sm:mt-3">{item.rank}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="bg-surface py-12 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <SectionHeading
              eyebrow="Phụ huynh và học viên"
              title="Những điều còn lại sau chuyến đi"
              desc="Điều đáng nhớ nhất thường không nằm ở lịch trình dày đặc, mà ở khoảnh khắc các bạn nhận ra mình có thể sống tự lập và giúp ích cho người khác."
            />
            <div className="mx-auto mb-8 max-w-3xl overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-sm">
              <div className="relative aspect-video bg-deep-amethyst">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  srcDoc={youtubeSrcDoc}
                  title="Video cảm nhận trại hè tình nguyện VEO"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <figure key={item.name} className="rounded-xl border border-outline-variant/30 bg-white p-5 sm:p-6">
                  <span className="material-symbols-outlined text-solar-orange" style={{ fontSize: 32 }}>format_quote</span>
                  <blockquote className="mt-3 text-sm leading-relaxed text-on-surface-variant">{item.quote}</blockquote>
                  <figcaption className="mt-4 sm:mt-5">
                    <p className="font-bold text-primary">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">{item.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Tổ chức */}
        <section className="bg-white py-12 sm:py-20">
          <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-xl font-bold leading-tight text-primary sm:text-2xl lg:text-3xl">
                Chương trình trại hè được thiết kế và dẫn dắt bởi chuyên gia{" "}
                <span className="text-solar-orange">10+ năm kinh nghiệm</span> từ
              </h2>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:mt-10 sm:gap-y-10 md:grid-cols-4">
              {expertOrganizations.map((item) => (
                <div key={item.type} className="flex flex-col items-center text-center">
                  <div className="flex h-24 items-center justify-center sm:h-28 md:h-24">
                    <ExpertLogo type={item.type} />
                  </div>
                  <p className="mt-3 max-w-[190px] whitespace-pre-line text-xs leading-snug text-on-surface-variant sm:mt-4">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
            <h3 className="mt-12 text-center text-xl font-bold text-primary sm:mt-14 sm:text-2xl">
              Đối tác của chúng tôi
            </h3>
            <div className="mt-6 grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:mt-8 sm:gap-x-8 sm:gap-y-8 md:grid-cols-4">
              {partnerSchools.map((item) => (
                <div key={item} className="flex h-20 items-center justify-center sm:h-24 md:h-16">
                  <PartnerLogo type={item} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chọn chuyến đi */}
        <CampListingsSection />

        {/* CTA tư vấn */}
        <section className="relative overflow-hidden py-16 sm:py-20">
          <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/72" />
          <div className="relative mx-auto max-w-[900px] px-4 text-center sm:px-6">
            <p className="text-xs font-bold uppercase tracking-wide text-solar-orange sm:text-sm">Còn thắc mắc?</p>
            <h2 className="mt-3 text-2xl font-black leading-tight text-white sm:text-3xl lg:text-4xl">
              Liên hệ VEO để được tư vấn miễn phí
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
              Nếu bạn có bất kỳ câu hỏi nào về chương trình, lịch trình, độ tuổi phù hợp hay chi phí — đội ngũ VEO sẵn sàng tư vấn và hỗ trợ bạn trước khi đăng ký.
            </p>
            <Link
              href="/lien-he"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-solar-orange px-6 py-3 text-sm font-bold text-white shadow-xl transition-colors hover:bg-action-hover sm:mt-8 sm:px-8 sm:py-4 sm:text-base"
            >
              Liên hệ tư vấn
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">arrow_forward</span>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-12 sm:py-20">
          <div className="mx-auto max-w-[820px] px-4 sm:px-6">
            <SectionHeading
              eyebrow="FAQ"
              title="Câu hỏi thường gặp"
              desc="Một vài thông tin phụ huynh và học viên thường hỏi trước khi chọn trại hè tình nguyện."
            />
            <FAQAccordion />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
