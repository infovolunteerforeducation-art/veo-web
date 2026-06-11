"use client";

import { useState } from "react";

export default function TourRegisterForm({ tourTitle }: { tourTitle: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", note: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <span className="material-symbols-outlined text-5xl text-solar-orange mb-3 block">
          check_circle
        </span>
        <h3 className="font-bold text-on-surface mb-2">Đăng ký thành công!</h3>
        <p className="text-sm text-on-surface-variant">
          Chúng tôi sẽ liên hệ xác nhận qua email trong vòng 24 giờ.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Họ và tên <span className="text-error">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Nguyễn Văn A"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-pure-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Email <span className="text-error">*</span>
        </label>
        <input
          type="email"
          required
          placeholder="example@email.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-pure-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Số điện thoại <span className="text-error">*</span>
        </label>
        <input
          type="tel"
          required
          placeholder="0912 345 678"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-pure-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">
          Ghi chú (không bắt buộc)
        </label>
        <textarea
          rows={3}
          placeholder="Yêu cầu đặc biệt, câu hỏi..."
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-pure-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-solar-orange hover:bg-action-hover text-pure-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined">app_registration</span>
        Đăng ký ngay
      </button>
      <p className="text-xs text-on-surface-variant text-center">
        Bằng cách đăng ký, bạn đồng ý với{" "}
        <a href="#" className="text-primary underline">Điều khoản dịch vụ</a> của VEO
      </p>
    </form>
  );
}
