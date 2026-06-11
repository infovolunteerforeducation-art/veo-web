"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="py-20 px-6 max-w-[1200px] mx-auto">
      <div className="bg-deep-amethyst rounded-3xl p-12 text-center text-pure-white relative overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-solar-orange/10 rounded-full blur-3xl" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-solar-orange/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">
            Nhận thông tin tour mới nhất
          </h2>
          <p className="text-base mb-10 text-pure-white/80 max-w-xl mx-auto leading-relaxed">
            Đừng bỏ lỡ cơ hội tham gia các chuyến đi ý nghĩa. Chúng tôi sẽ
            gửi thông tin tour trực tiếp vào hộp thư của bạn.
          </p>

          {submitted ? (
            <p className="text-solar-orange font-semibold text-lg">
              Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm nhất.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow px-6 py-4 rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-solar-orange border-none bg-white"
              />
              <button
                type="submit"
                className="bg-solar-orange hover:bg-action-hover text-pure-white px-8 py-4 rounded-xl font-bold transition-colors whitespace-nowrap"
              >
                Đăng ký ngay
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
