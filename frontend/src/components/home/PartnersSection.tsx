import Image from "next/image";
import ScrollReveal from "@/components/layout/ScrollReveal";

const pressLogos = [
  {
    alt: "VOV2",
    href: "https://vov2.vov.vn/giao-duc-dao-tao/sinh-vien-trai-nghiem-du-lich-ket-hop-tinh-nguyen-48575.vov2",
    className: "max-h-12 w-auto",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/08/Vov2-logo.png",
  },
  {
    alt: "CafeF",
    href: "https://cafef.vn/hanh-trinh-10-nam-thay-da-doi-thit-vung-sau-vung-xa-bang-mo-hinh-du-lich-la-cua-nu-ceo-8x-di-cung-cong-dong-dia-phuong-tu-con-so-0-den-luc-ho-du-nang-luc-tu-lam-giau-188231012220344526.chn",
    className: "h-12 w-[8.5rem]",
    src: "/press/cafef-balanced.png",
  },
  {
    alt: "Tuổi Trẻ",
    href: "https://tuoitre.vn/ban-tre-len-vung-cao-day-tieng-anh-giup-ba-con-lam-du-lich-20190511104703927.htm",
    className: "max-h-12 w-auto",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-2.png",
  },
  {
    alt: "Nhân Dân",
    href: "https://nhandan.vn/du-lich-tinh-nguyen-va-nhung-trai-nghiem-thu-vi-post359150.html",
    className: "max-h-12 w-auto",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-3.png",
  },
  {
    alt: "Phụ nữ Việt Nam",
    href: "https://phunuvietnam.vn/co-gai-tre-khoi-nghiep-tu-du-lich-tinh-nguyen-42353.htm",
    className: "max-h-12 w-auto",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-4.png",
  },
  {
    alt: "Tiền Phong",
    href: "https://tienphong.vn/bung-no-du-lich-tinh-nguyen-post898735.tpo",
    className: "max-h-12 w-auto",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-5.png",
  },
];

const awardLogos = [
  {
    alt: "VCCI",
    className: "h-12 w-[8.5rem]",
    src: "/awards/vcci-balanced.png",
  },
  {
    alt: "Forbes Vietnam",
    className: "h-12 w-[8.5rem]",
    href: "https://www.brandsvietnam.com/8671-Forbes-Viet-Nam-cong-bo-danh-sach-noi-bat-nhat-duoi-30-tuoi-tai-Viet-Nam-2016",
    src: "/awards/forbes-vietnam-balanced.png",
  },
  {
    alt: "LOTTE",
    className: "h-10 w-36",
    href: "https://vtv.vn/le-tan/trao-giai-khoi-nghiep-lotte-2016-20161206111316821.htm",
    src: "/awards/lotte-balanced.png",
  },
  {
    alt: "Shark Tank",
    className: "h-14 w-24",
    href: "https://kenh14.vn/shark-tank-du-an-du-lich-tinh-nguyen-cua-nu-ceo-tung-bi-chan-doan-mac-ung-thu-goi-duoc-27-ty-dong-von-20180106203516619.chn",
    src: "/awards/shark-tank-balanced.png",
  },
  {
    alt: "Én Xanh",
    className: "h-12 w-[8.5rem]",
    href: "http://www.enxanh.org.vn/cau-chuyen-en-xanh/v-e-o-co-hoi-luon-co-cho-nhung-quyet-tam-chay-bong-559ad87a_page=5.htm",
    src: "/awards/en-xanh-balanced.png",
  },
];

const logoCardClass =
  "h-24 rounded-xl border border-outline-variant/30 bg-white px-4 py-5 flex items-center justify-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md";

export default function PartnersSection() {
  return (
    <>
      <section className="bg-pure-white py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Báo chí viết về VEO
          </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {pressLogos.map((logo, index) => (
              <ScrollReveal key={logo.alt} delay={index * 55}>
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Đọc bài viết trên ${logo.alt}`}
                className={logoCardClass}
              >
                <Image
                  alt={logo.alt}
                  src={logo.src}
                  width={160}
                  height={56}
                  className={`${logo.className} max-w-full object-contain`}
                />
              </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
          <h2 className="text-3xl font-bold text-primary text-center mb-12">
            Giải thưởng của VEO
          </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {awardLogos.map((logo, index) => {
              const content = (
                <Image
                  alt={logo.alt}
                  src={logo.src}
                  width={240}
                  height={120}
                  className={`${logo.className} max-w-full object-contain`}
                />
              );

              if (!logo.href) {
                return (
                  <ScrollReveal key={logo.alt} delay={index * 65}>
                  <div className={logoCardClass}>
                    {content}
                  </div>
                  </ScrollReveal>
                );
              }

              return (
                <ScrollReveal key={logo.alt} delay={index * 65}>
                <a
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Xem giải thưởng ${logo.alt}`}
                  className={logoCardClass}
                >
                  {content}
                </a>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
