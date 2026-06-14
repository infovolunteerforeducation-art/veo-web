import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getContactContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

const contactInfo = [
  {
    icon: "phone",
    label: "Hotline",
    value: "070.508.1088",
    href: "tel:0705081088",
  },
  {
    icon: "mail",
    label: "Email",
    value: "info@volunteerforeducation.org",
    href: "mailto:info@volunteerforeducation.org",
  },
  {
    icon: "location_on",
    label: "Địa chỉ",
    value: "Tầng 3, Tòa nhà D12 Giảng Võ, Ba Đình, Hà Nội",
    href: "https://maps.google.com/?q=Giảng+Võ+Ba+Đình+Hà+Nội",
  },
  {
    icon: "schedule",
    label: "Giờ làm việc",
    value: "Thứ 2 – Thứ 6: 9:00 – 17:30",
    href: null,
  },
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/volunteerforeducation.veo",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@veo.volunteerforeducation",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.16 8.16 0 0 0 4.77 1.52V7.02a4.85 4.85 0 0 1-1-.33z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/veo.volunteerforeducation",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@volunteerforeducation",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function ContactPage() {
  const cms = getContactContent();

  const activeContactInfo = [
    { icon: "phone", label: "Hotline", value: cms.phone, href: `tel:${cms.phone.replace(/\./g, "")}` },
    { icon: "mail", label: "Email", value: cms.email, href: `mailto:${cms.email}` },
    { icon: "location_on", label: "Địa chỉ", value: cms.address, href: `https://maps.google.com/?q=${encodeURIComponent(cms.address)}` },
    { icon: "schedule", label: "Giờ làm việc", value: cms.hours, href: null as string | null },
  ];

  const activeSocials = socials.map((s) => ({
    ...s,
    href:
      s.label === "Facebook" ? cms.facebook
      : s.label === "TikTok" ? cms.tiktok
      : s.label === "Instagram" ? cms.instagram
      : cms.youtube,
  }));

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-deep-amethyst py-20 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <p className="text-solar-orange font-semibold text-sm uppercase tracking-widest mb-3">
              Chúng tôi luôn sẵn sàng lắng nghe
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-5 leading-tight">
              Liên hệ với VEO
            </h1>
            <p className="text-pure-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Dù bạn muốn đăng ký chương trình, hợp tác doanh nghiệp hay chỉ đơn giản là muốn hỏi thêm — đội ngũ VEO luôn ở đây.
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-[1200px] mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left: map */}
            <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-outline-variant/30 min-h-[480px]">
              <iframe
                title="Bản đồ VEO"
                src={cms.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: 480 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Right: contact info */}
            <div className="lg:col-span-2">
              <div className="bg-deep-amethyst rounded-2xl p-8 text-pure-white h-full">
                <h3 className="text-xl font-bold mb-8">Thông tin liên hệ</h3>
                <div className="space-y-6">
                  {activeContactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-full bg-pure-white/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-solar-orange text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs text-pure-white/60 mb-1">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel="noopener noreferrer"
                            className="text-sm font-semibold hover:text-solar-orange transition-colors"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm font-semibold">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-pure-white/10 mt-8 pt-6">
                  <p className="text-xs text-pure-white/60 mb-4">Theo dõi chúng tôi</p>
                  <div className="flex gap-3">
                    {activeSocials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-10 h-10 rounded-full bg-pure-white/10 flex items-center justify-center hover:bg-solar-orange transition-colors text-pure-white"
                      >
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
