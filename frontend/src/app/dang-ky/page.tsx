"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const benefits = [
    { icon: "confirmation_number", text: "Đăng ký tour nhanh chóng, theo dõi đơn ngay trên app" },
    { icon: "notifications_active", text: "Nhận thông báo ưu tiên về tour mới & ưu đãi độc quyền" },
    { icon: "workspace_premium", text: "Tích lũy điểm thành viên mỗi chuyến đi" },
    { icon: "groups", text: "Kết nối với 50.000+ tình nguyện viên VEO" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4f2c8c 0%, #7c3aed 60%, #a855f7 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #fbb040 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)" }}
        />
        <Link href="/" className="relative z-10">
          <img src="/veo-logo-footer.png" alt="VEO" className="h-10 w-auto object-contain" />
        </Link>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-snug mb-3">
              Gia nhập cộng đồng{" "}
              <span style={{ color: "#fbb040" }}>tình nguyện viên</span>
            </h2>
            <p className="text-white/70 text-base leading-relaxed">
              Hàng nghìn bạn trẻ đã bắt đầu hành trình ý nghĩa cùng VEO. Hôm nay là lượt của bạn.
            </p>
          </div>
          <ul className="space-y-4">
            {benefits.map((b) => (
              <li key={b.icon} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-solar-orange text-lg">{b.icon}</span>
                </div>
                <p className="text-white/85 text-sm leading-relaxed">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/40 text-xs">
          © 2026 Volunteer For Education (VEO)
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-8">
          <img src="/veo-logo.png" alt="VEO" className="h-10 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-md">
          {submitted ? (
            <div className="text-center py-8">
              <span
                className="material-symbols-outlined text-7xl text-green-500 mb-4 block"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <h2 className="text-2xl font-bold text-primary mb-3">Đăng ký thành công!</h2>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Chào mừng bạn gia nhập cộng đồng VEO. Vui lòng kiểm tra email để xác nhận tài khoản.
              </p>
              <Link
                href="/dang-nhap"
                className="inline-flex items-center gap-2 bg-solar-orange hover:bg-action-hover text-pure-white px-8 py-3.5 rounded-xl font-bold transition-colors"
              >
                Đăng nhập ngay
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-primary mb-2">Tạo tài khoản</h1>
              <p className="text-on-surface-variant mb-8">
                Đã có tài khoản?{" "}
                <Link href="/dang-nhap" className="text-solar-orange font-semibold hover:underline">
                  Đăng nhập
                </Link>
              </p>

              {error && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Nguyễn Văn A"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border border-outline-variant/60 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-outline-variant/60 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-on-surface mb-1.5">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="0912 345 678"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border border-outline-variant/60 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="Tối thiểu 8 ký tự"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full h-12 px-4 pr-12 rounded-xl border border-outline-variant/60 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPass ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-on-surface mb-1.5">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      autoComplete="new-password"
                      placeholder="Nhập lại mật khẩu"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full h-12 px-4 pr-12 rounded-xl border border-outline-variant/60 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showConfirm ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.agree}
                    onChange={(e) => setForm({ ...form, agree: e.target.checked })}
                    className="mt-0.5 w-4 h-4 accent-solar-orange rounded"
                  />
                  <span className="text-sm text-on-surface-variant leading-relaxed">
                    Tôi đồng ý với{" "}
                    <Link href="#" className="text-solar-orange underline">Điều khoản sử dụng</Link>{" "}
                    và{" "}
                    <Link href="#" className="text-solar-orange underline">Chính sách bảo mật</Link>{" "}
                    của VEO
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-solar-orange hover:bg-action-hover text-pure-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                      Đang tạo tài khoản...
                    </>
                  ) : "Tạo tài khoản"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="flex-1 h-px bg-outline-variant/40" />
                <span className="text-xs text-on-surface-variant">hoặc tiếp tục với</span>
                <div className="flex-1 h-px bg-outline-variant/40" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="h-11 flex items-center justify-center gap-2 rounded-xl border border-outline-variant/60 text-on-surface text-sm font-semibold hover:bg-surface-container transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="h-11 flex items-center justify-center gap-2 rounded-xl border border-outline-variant/60 text-on-surface text-sm font-semibold hover:bg-surface-container transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
