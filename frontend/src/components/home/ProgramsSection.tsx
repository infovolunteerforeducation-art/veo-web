import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/layout/ScrollReveal";

const programs = [
  {
    title: "Tour du lịch tình nguyện",
    description:
      "Trải nghiệm ngắn ngày vào cuối tuần để khám phá vùng đất mới và góp sức cho cộng đồng nơi bạn đặt chân đến.",
    image: "/about-veo/program-volunteer-tour.webp",
    href: "/du-lich-tinh-nguyen",
  },
  {
    title: "Trại hè tình nguyện",
    description:
      "Dành cho học sinh, sinh viên: kiến tạo và đóng góp cho cộng đồng qua các hoạt động ý nghĩa vào kỳ nghỉ hè",
    image: "/about-veo/program-summer-camp.webp",
    href: "/trai-he-tinh-nguyen",
  },
  {
    title: "CSR doanh nghiệp",
    description:
      "Chương trình tình nguyện thiết kế riêng, gắn kết nội bộ và đo lường tác động xã hội",
    image: "/about-veo/program-csr.webp",
    href: "/chien-luoc-csr-cho-doanh-nghiep",
  },
  {
    title: "Hoạt động ngoại khóa trường học",
    description:
      "Chương trình trải nghiệm thực tế thiết kế riêng theo nhu cầu của nhà trường, giúp học sinh phát triển toàn diện cả kỹ năng lẫn tư duy công dân toàn cầu.",
    image: "/about-veo/timeline-2019-kttv.webp",
    href: "/hoat-dong-ngoai-khoa-truong-hoc",
  },
  {
    title: "Social Leader Program",
    description:
      "Huấn luyện kỹ năng lãnh đạo cho thế hệ trẻ qua các dự án xã hội thực tế.",
    image: "/about-veo/program-slp.webp",
    href: "https://www.slp.edu.vn/",
    external: true,
  },
];

export default function ProgramsSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <ScrollReveal className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-primary sm:text-3xl">
            Các chương trình của VEO
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {programs.map((program, index) => (
            <ScrollReveal
              key={program.title}
              delay={index * 80}
              className={`lg:col-span-2 ${index === 3 ? "lg:col-start-2" : ""}`}
            >
            <Link
              href={program.href}
              {...(program.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group block h-full overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-[0_8px_28px_rgba(108,42,138,0.08)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
