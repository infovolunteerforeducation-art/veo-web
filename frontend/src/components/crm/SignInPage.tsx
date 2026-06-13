"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  onSignIn: (username: string) => void;
}

const DEMO_USERS = [
  { username: "admin",       password: "admin123",  displayName: "Admin VEO",         role: "Quản trị viên" },
  { username: "coordinator", password: "coord123",  displayName: "Nguyễn Điều Phối",  role: "Điều phối viên" },
  { username: "sale",        password: "sale123",   displayName: "Trần Sale",          role: "Sale" },
  { username: "staff",       password: "staff123",  displayName: "Lê Nhân Viên",       role: "Nhân viên" },
];

export default function SignInPage({ onSignIn }: Props) {
  const [username, setUsername]     = useState("");
  const [password, setPassword]     = useState("");
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const user = DEMO_USERS.find(
        (u) => u.username === username.trim() && u.password === password
      );
      if (user) {
        onSignIn(user.displayName);
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
        setLoading(false);
      }
    }, 700);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #451e6b 0%, #2d0f47 60%, #1a0828 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10" style={{ background: "#fbb040" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: "#fbb040" }} />
        <div className="absolute top-1/2 right-8 w-4 h-4 rounded-full" style={{ background: "rgba(251,176,64,0.3)" }} />
        <div className="absolute top-1/3 right-24 w-2 h-2 rounded-full" style={{ background: "rgba(251,176,64,0.4)" }} />
        <div className="absolute bottom-1/3 right-16 w-3 h-3 rounded-full" style={{ background: "rgba(251,176,64,0.25)" }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <Image src="/veo-logo-linkedin.png" alt="VEO" width={40} height={40} className="w-10 h-10 rounded-xl" />
          <div>
            <p className="text-lg font-bold text-white leading-tight">VEO CRM</p>
            <p className="text-xs text-white/50">Quản lý nội bộ</p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Chào mừng <span style={{ color: "#fbb040" }}>bạn</span> trở lại
          </h2>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/30 relative z-10">© 2025 VEO Travel. Bảo lưu mọi quyền.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-surface">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <Image src="/veo-logo-linkedin.png" alt="VEO" width={36} height={36} className="w-9 h-9 rounded-xl" />
            <p className="text-lg font-bold" style={{ color: "#451e6b" }}>VEO CRM</p>
          </div>

          {/* Header */}
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-on-surface">Đăng nhập</h1>
            <p className="text-sm text-on-surface-variant">Nhập thông tin tài khoản của bạn để tiếp tục</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label htmlFor="crm-username" className="block text-sm font-semibold text-on-surface">
                Tên đăng nhập
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  style={{ fontSize: 18 }}
                >
                  person
                </span>
                <input
                  id="crm-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-colors outline-none focus:ring-2"
                  style={{
                    borderColor: error ? "#ba1a1a" : "#d0c2d1",
                    background: "white",
                    color: "#1a1c1c",
                  }}
                  onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = "#451e6b"; }}
                  onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = "#d0c2d1"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="crm-password" className="block text-sm font-semibold text-on-surface">
                Mật khẩu
              </label>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                  style={{ fontSize: 18 }}
                >
                  lock
                </span>
                <input
                  id="crm-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm font-medium transition-colors outline-none"
                  style={{
                    borderColor: error ? "#ba1a1a" : "#d0c2d1",
                    background: "white",
                    color: "#1a1c1c",
                  }}
                  onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = "#451e6b"; }}
                  onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = "#d0c2d1"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {showPass ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-error-container">
                <span className="material-symbols-outlined text-on-error-container shrink-0" style={{ fontSize: 16 }}>error</span>
                <p className="text-sm font-medium text-on-error-container">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
              style={{
                background: loading ? "#7c3fa3" : "#451e6b",
                color: "white",
                opacity: loading ? 0.85 : 1,
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#5a2885"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#451e6b"; }}
            >
              {loading ? (
                <>
                  <span
                    className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                    style={{ display: "inline-block" }}
                  />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                  Đăng nhập
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
