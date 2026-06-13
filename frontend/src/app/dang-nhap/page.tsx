"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.ok) {
      router.push("/tai-khoan");
    } else {
      setError(result.error ?? "Đăng nhập thất bại.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4f2c8c 0%, #7c3aed 60%, #a855f7 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #fbb040 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)" }}
        />
        <Link href="/" className="relative z-10">
          <Image src="/veo-logo-footer.png" alt="VEO" width={130} height={40} className="h-10 w-auto object-contain" />
        </Link>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Chào mừng <span style={{ color: "#fbb040" }}>bạn</span> trở lại
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Đăng nhập để quản lý chuyến đi, theo dõi đơn đăng ký và kết nối cùng cộng đồng tình nguyện viên VEO.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/20 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1541585383275-5dc2beab62f1?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80"
              alt="testimonial"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-white text-sm font-semibold">Minh Anh</p>
            <p className="text-white/60 text-xs">&ldquo;VEO đã thay đổi hoàn toàn cách tôi nhìn về cuộc sống.&rdquo;</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-8">
          <Image src="/veo-logo.png" alt="VEO" width={130} height={40} className="h-10 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-primary mb-2">Đăng nhập</h1>
          <p className="text-on-surface-variant mb-8">
            Chưa có tài khoản?{" "}
            <Link href="/dang-ky" className="text-solar-orange font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1.5">Email</label>
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
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-on-surface">Mật khẩu</label>
                <Link href="/quen-mat-khau" className="text-sm text-solar-orange hover:underline font-medium">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-solar-orange hover:bg-action-hover text-pure-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Đang đăng nhập...
                </>
              ) : "Đăng nhập"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="flex-1 h-px bg-outline-variant/40" />
            <span className="text-xs text-on-surface-variant">hoặc tiếp tục với</span>
            <div className="flex-1 h-px bg-outline-variant/40" />
          </div>

          {/* SSO buttons — disabled until backend SSO is implemented */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              title="Tính năng SSO sẽ được hỗ trợ sớm"
              className="h-11 flex items-center justify-center gap-2 rounded-xl border border-outline-variant/60 text-on-surface text-sm font-semibold opacity-50 cursor-not-allowed transition"
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
              disabled
              title="Tính năng SSO sẽ được hỗ trợ sớm"
              className="h-11 flex items-center justify-center gap-2 rounded-xl border border-outline-variant/60 text-on-surface text-sm font-semibold opacity-50 cursor-not-allowed transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <p className="mt-8 text-xs text-on-surface-variant text-center leading-relaxed">
            Bằng cách đăng nhập, bạn đồng ý với{" "}
            <Link href="#" className="underline">Điều khoản sử dụng</Link> và{" "}
            <Link href="#" className="underline">Chính sách bảo mật</Link> của VEO.
          </p>
        </div>
      </div>
    </div>
  );
}
