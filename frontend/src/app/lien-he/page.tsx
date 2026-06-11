"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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
    value: "Thứ 2 – Thứ 6: 8:00 – 17:30",
    href: null,
  },
];

const socials = [
  { label: "Facebook", icon: "group", href: "https://www.facebook.com/volunteerforeducation.veo" },
  { label: "TikTok", icon: "video_library", href: "https://www.tiktok.com/@veo.volunteerforeducation" },
  { label: "Instagram", icon: "photo_camera", href: "https://www.instagram.com/veo.volunteerforeducation" },
  { label: "YouTube", icon: "play_circle", href: "https://www.youtube.com/@volunteerforeducation" },
];

const topics = [
  "Đăng ký chương trình",
  "Hợp tác CSR doanh nghiệp",
  "Workcamp quốc tế",
  "Tài trợ & Đối tác",
  "Báo chí & Truyền thông",
  "Khác",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

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

            {/* Left: form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold text-primary mb-2">Gửi tin nhắn cho chúng tôi</h2>
              <p className="text-on-surface-variant mb-8">Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center py-16 bg-white rounded-2xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-6xl text-green-500 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <h3 className="text-xl font-bold text-primary mb-2">Gửi thành công!</h3>
                  <p className="text-on-surface-variant max-w-sm">
                    Cảm ơn bạn đã liên hệ. Đội ngũ VEO sẽ phản hồi sớm nhất có thể.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", topic: "", message: "" }); }}
                    className="mt-6 text-solar-orange font-semibold text-sm hover:underline"
                  >
                    Gửi tin nhắn khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1.5">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Nguyễn Văn A"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-outline-variant/60 bg-white text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-outline-variant/60 bg-white text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1.5">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        placeholder="0912 345 678"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-outline-variant/60 bg-white text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-on-surface mb-1.5">
                        Chủ đề
                      </label>
                      <select
                        value={form.topic}
                        onChange={(e) => setForm({ ...form, topic: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-outline-variant/60 bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition appearance-none"
                      >
                        <option value="">Chọn chủ đề...</option>
                        {topics.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-1.5">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder="Bạn muốn hỏi gì? Chúng tôi lắng nghe..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant/60 bg-white text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-solar-orange hover:bg-action-hover text-pure-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">send</span>
                        Gửi tin nhắn
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Right: contact info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-deep-amethyst rounded-2xl p-8 text-pure-white">
                <h3 className="text-lg font-bold mb-6">Thông tin liên hệ</h3>
                <div className="space-y-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-pure-white/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-solar-orange text-xl">{item.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs text-pure-white/60 mb-0.5">{item.label}</p>
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
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-10 h-10 rounded-full bg-pure-white/10 flex items-center justify-center hover:bg-solar-orange transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">{s.icon}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden border border-outline-variant/30 h-56 bg-surface-container-low flex items-center justify-center">
                <iframe
                  title="Bản đồ VEO"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.0971578954877!2d105.8192!3d21.0278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5b1a7b4c4f%3A0x1!2zR2nhuqNuZyBWw7MsIEJhIMSQw61uaCwgSMOgIE7hu5Np!5e0!3m2!1svi!2svn!4v1686000000000!5m2!1svi!2svn"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="bg-surface-container-low py-16 px-6">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-2">Sẵn sàng bắt đầu hành trình?</h3>
              <p className="text-on-surface-variant">Khám phá ngay các chương trình tình nguyện đang mở đăng ký.</p>
            </div>
            <Link
              href="/tours"
              className="shrink-0 inline-flex items-center gap-2 bg-solar-orange hover:bg-action-hover text-pure-white px-8 py-3.5 rounded-full font-bold transition-colors"
            >
              Xem tất cả tour
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
