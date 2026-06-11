import Link from "next/link";

const programs = [
  { label: "Du lịch tình nguyện", href: "/tours" },
  { label: "Trại hè tình nguyện", href: "/trai-he-tinh-nguyen" },
  { label: "CSR", href: "#" },
  { label: "Social Leader Program", href: "https://www.slp.edu.vn/", external: true },
];

const about = [
  { label: "Về VEO", href: "#" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

const support = [
  "Hướng dẫn tham gia",
  "Chính sách bảo mật",
  "Chính sách hoàn hủy",
  "Điều khoản sử dụng",
];

const socials = [
  { label: "Facebook", short: "f", href: "https://www.facebook.com/volunteerforeducation.veo" },
  { label: "TikTok", short: "t", href: "https://www.tiktok.com/@veo.volunteerforeducation" },
  { label: "Instagram", short: "ig", href: "https://www.instagram.com/veo.volunteerforeducation" },
  { label: "YouTube", short: "yt", href: "https://www.youtube.com/@volunteerforeducation" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-deep-amethyst">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-10 px-6 max-w-[1200px] mx-auto">
        <div className="space-y-4">
          <img
            src="/veo-logo-footer.png"
            alt="VEO Logo"
            className="h-12 w-auto object-contain"
          />
          <p className="text-sm text-pure-white/80 leading-relaxed">
            Volunteer For Education (VEO) kết nối tình nguyện viên với những hành trình giáo dục, trải nghiệm và phát triển cộng đồng tại Việt Nam.
          </p>
          <div className="flex gap-3">
            {socials.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-pure-white/10 text-xs font-black uppercase text-pure-white transition-colors hover:bg-solar-orange"
              >
                {item.short}
              </a>
            ))}
          </div>
          <div className="space-y-2 pt-2">
            <a href="tel:0705081088" className="flex items-center gap-2 text-pure-white/80 hover:text-solar-orange transition-colors text-sm">
              <span className="material-symbols-outlined text-base">phone</span>
              070.508.1088
            </a>
            <div className="flex items-start gap-2 text-pure-white/80 text-sm">
              <span className="material-symbols-outlined text-base mt-0.5">location_on</span>
              Tầng 3, Tòa nhà D12 Giảng Võ, Ba Đình, Hà Nội
            </div>
            <a href="mailto:info@volunteerforeducation.org" className="flex items-center gap-2 text-pure-white/80 hover:text-solar-orange transition-colors text-sm">
              <span className="material-symbols-outlined text-base">mail</span>
              info@volunteerforeducation.org
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-pure-white">Chương trình</h4>
          <ul className="space-y-2">
            {programs.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="text-sm text-pure-white/80 hover:text-solar-orange transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-pure-white">Thông tin</h4>
          <ul className="space-y-2">
            {about.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="text-sm text-pure-white/80 hover:text-solar-orange transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-base font-semibold text-pure-white">Hỗ trợ</h4>
          <ul className="space-y-2">
            {support.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-sm text-pure-white/80 hover:text-solar-orange transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-pure-white/10 py-6 px-6">
        <div className="max-w-[1200px] mx-auto text-center">
          <p className="text-sm text-pure-white/60">
            © 2026 Volunteer For Education (VEO). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
