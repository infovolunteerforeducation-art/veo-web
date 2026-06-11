const pressLogos = [
  {
    alt: "VOV2",
    href: "https://vov2.vov.vn/giao-duc-dao-tao/sinh-vien-trai-nghiem-du-lich-ket-hop-tinh-nguyen-48575.vov2",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/08/Vov2-logo.png",
  },
  {
    alt: "CafeF",
    href: "https://cafef.vn/hanh-trinh-10-nam-thay-da-doi-thit-vung-sau-vung-xa-bang-mo-hinh-du-lich-la-cua-nu-ceo-8x-di-cung-cong-dong-dia-phuong-tu-con-so-0-den-luc-ho-du-nang-luc-tu-lam-giau-188231012220344526.chn",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-1.png",
  },
  {
    alt: "Tuổi Trẻ",
    href: "https://tuoitre.vn/ban-tre-len-vung-cao-day-tieng-anh-giup-ba-con-lam-du-lich-20190511104703927.htm",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-2.png",
  },
  {
    alt: "Nhân Dân",
    href: "https://nhandan.vn/du-lich-tinh-nguyen-va-nhung-trai-nghiem-thu-vi-post359150.html",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-3.png",
  },
  {
    alt: "Phụ nữ Việt Nam",
    href: "https://phunuvietnam.vn/co-gai-tre-khoi-nghiep-tu-du-lich-tinh-nguyen-42353.htm",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-4.png",
  },
  {
    alt: "Tiền Phong",
    href: "https://tienphong.vn/bung-no-du-lich-tinh-nguyen-post898735.tpo",
    src: "https://archive.veo.com.vn/wp-content/uploads/2024/03/bao-chi-viet-ve-veo-5.png",
  },
];

export default function PartnersSection() {
  return (
    <section className="py-20 bg-pure-white border-t border-surface-variant">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Báo chí viết về VEO
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {pressLogos.map((logo) => (
            <a
              key={logo.alt}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Đọc bài viết trên ${logo.alt}`}
              className="h-24 rounded-xl border border-outline-variant/30 bg-white px-4 py-5 flex items-center justify-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <img
              alt={logo.alt}
              src={logo.src}
                className="max-h-12 max-w-full object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
