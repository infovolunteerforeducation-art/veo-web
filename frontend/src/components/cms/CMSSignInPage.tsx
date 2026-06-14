"use client";

import { useState } from "react";
import Image from "next/image";
import { DEMO_CMS_USERS, CMSRole, ROLE_LABELS } from "@/lib/cms-data";

interface Props {
  onSignIn: (user: { displayName: string; role: CMSRole }) => void;
}

export default function CMSSignInPage({ onSignIn }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user = DEMO_CMS_USERS.find(
        (u) => u.username === username.trim() && u.password === password,
      );
      if (user) {
        onSignIn({ displayName: user.displayName, role: user.role });
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
        setLoading(false);
      }
    }, 600);
  }

  const CMS_GREEN = "#0a5c45";
  const CMS_GREEN_DARK = "#073d2e";
  const CMS_GREEN_HOVER = "#0d7559";

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${CMS_GREEN} 0%, ${CMS_GREEN_DARK} 60%, #021f18 100%)` }}
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-10" style={{ background: "#fbb040" }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-10" style={{ background: "#fbb040" }} />

        <div className="flex items-center gap-3 relative z-10">
          <Image src="/veo-logo-linkedin.png" alt="VEO" width={40} height={40} className="w-10 h-10 rounded-xl" />
          <div>
            <p className="text-lg font-bold text-white leading-tight">VEO CMS</p>
            <p className="text-xs text-white/50">Quản lý nội dung website</p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Chỉnh sửa nội dung <span style={{ color: "#fbb040" }}>dễ dàng</span>
          </h2>
          <div className="space-y-3 mt-6">
            {[
              { icon: "home", label: "Trang chủ & Chương trình" },
              { icon: "article", label: "Blog & Tin tức" },
              { icon: "business", label: "Trang B2B & SLP" },
              { icon: "palette", label: "Header, Footer, Liên hệ" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white/50" style={{ fontSize: 18 }}>{item.icon}</span>
                <span className="text-sm text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/30 relative z-10">© 2025 VEO Travel. Hệ thống quản lý nội dung.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-surface">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-3 lg:hidden">
            <Image src="/veo-logo-linkedin.png" alt="VEO" width={36} height={36} className="w-9 h-9 rounded-xl" />
            <p className="text-lg font-bold" style={{ color: CMS_GREEN }}>VEO CMS</p>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-on-surface">Đăng nhập CMS</h1>
            <p className="text-sm text-on-surface-variant">Nhập thông tin tài khoản biên tập của bạn</p>
          </div>

          {/* Demo hint */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-low p-3 space-y-1">
            <p className="text-xs font-semibold text-on-surface-variant">Demo accounts:</p>
            {DEMO_CMS_USERS.map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => { setUsername(u.username); setPassword(u.password); setError(""); }}
                className="w-full text-left text-xs text-on-surface-variant hover:text-on-surface transition-colors px-1 py-0.5"
              >
                <span className="font-mono font-semibold">{u.username}</span>
                <span className="text-on-surface-variant/50"> / {u.password}</span>
                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-surface-container font-medium">
                  {ROLE_LABELS[u.role]}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="cms-username" className="block text-sm font-semibold text-on-surface">Tên đăng nhập</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>person</span>
                <input
                  id="cms-username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Nhập tên đăng nhập"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-colors outline-none"
                  style={{ borderColor: error ? "#ba1a1a" : "#d0c2d1", background: "white", color: "#1a1c1c" }}
                  onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = CMS_GREEN; }}
                  onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = "#d0c2d1"; }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="cms-password" className="block text-sm font-semibold text-on-surface">Mật khẩu</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: 18 }}>lock</span>
                <input
                  id="cms-password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm font-medium transition-colors outline-none"
                  style={{ borderColor: error ? "#ba1a1a" : "#d0c2d1", background: "white", color: "#1a1c1c" }}
                  onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = CMS_GREEN; }}
                  onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = "#d0c2d1"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  tabIndex={-1}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{showPass ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-error-container">
                <span className="material-symbols-outlined text-on-error-container shrink-0" style={{ fontSize: 16 }}>error</span>
                <p className="text-sm font-medium text-on-error-container">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
              style={{ background: loading ? CMS_GREEN_HOVER : CMS_GREEN, color: "white", opacity: loading ? 0.85 : 1 }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = CMS_GREEN_HOVER; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = CMS_GREEN; }}
            >
              {loading ? (
                <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ display: "inline-block" }} /> Đang đăng nhập...</>
              ) : (
                <><span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span> Đăng nhập</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
