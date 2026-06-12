"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authVerifyIdentity, authSetNewPassword } from "@/lib/auth-store";

type Step = 1 | 2 | 3 | "done";

export default function QuenMatKhauPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [identity, setIdentity] = useState({ email: "", phone: "" });
  const [passwords, setPasswords] = useState({ newPw: "", confirmPw: "" });
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = authVerifyIdentity(identity.email.trim(), identity.phone.trim());
    if (!ok) {
      setError("Email và số điện thoại không khớp với bất kỳ tài khoản nào.");
      return;
    }
    setStep(2);
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (passwords.newPw.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (passwords.newPw !== passwords.confirmPw) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    const result = authSetNewPassword(identity.email.trim(), passwords.newPw);
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Có lỗi xảy ra. Vui lòng thử lại.");
      return;
    }
    setStep("done");
  };

  const stepLabel = (n: number, active: Step) => {
    const isActive = active === n;
    const isDone = typeof active === "number" && active > n || active === "done";
    return (
      <div className="flex items-center gap-1.5">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
            isDone
              ? "bg-green-500 text-white"
              : isActive
              ? "bg-primary text-white"
              : "bg-surface-container-highest text-on-surface-variant"
          }`}
        >
          {isDone ? (
            <span className="material-symbols-outlined text-sm">check</span>
          ) : (
            n
          )}
        </span>
        <span
          className={`text-xs font-semibold transition-colors ${
            isActive ? "text-primary" : isDone ? "text-green-600" : "text-on-surface-variant"
          }`}
        >
          {n === 1 ? "Xác minh" : n === 2 ? "Mã xác nhận" : "Mật khẩu mới"}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #4f2c8c 0%, #7c3aed 60%, #a855f7 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #fbb040 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fff 0%, transparent 50%)",
          }}
        />
        <Link href="/" className="relative z-10">
          <img src="/veo-logo-footer.png" alt="VEO" className="h-10 w-auto object-contain" />
        </Link>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Khôi phục <span style={{ color: "#fbb040" }}>tài khoản</span>
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Đặt lại mật khẩu chỉ trong vài bước. Chúng tôi cần xác minh danh tính của bạn trước khi cho phép thay đổi.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-3">
          <span
            className="material-symbols-outlined text-white/60 text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            lock_reset
          </span>
          <p className="text-white/50 text-sm">Bảo mật tài khoản của bạn luôn là ưu tiên hàng đầu.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-8">
          <img src="/veo-logo.png" alt="VEO" className="h-10 w-auto object-contain" />
        </Link>

        <div className="w-full max-w-md">
          {step !== "done" && (
            <>
              <h1 className="text-3xl font-bold text-primary mb-2">Quên mật khẩu</h1>
              <p className="text-on-surface-variant mb-8">
                Nhớ mật khẩu rồi?{" "}
                <Link href="/dang-nhap" className="text-solar-orange font-semibold hover:underline">
                  Đăng nhập
                </Link>
              </p>

              {/* Step indicators */}
              <div className="flex items-center gap-2 mb-8">
                {stepLabel(1, step)}
                <div className="flex-1 h-px bg-outline-variant/40" />
                {stepLabel(2, step)}
                <div className="flex-1 h-px bg-outline-variant/40" />
                {stepLabel(3, step)}
              </div>
            </>
          )}

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          {/* Step 1: Verify identity */}
          {step === 1 && (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Email đăng ký
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="email@example.com"
                  value={identity.email}
                  onChange={(e) => setIdentity({ ...identity, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant/60 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="0912 345 678"
                  value={identity.phone}
                  onChange={(e) => setIdentity({ ...identity, phone: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant/60 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                />
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed -mt-1">
                Nhập email và số điện thoại đã đăng ký. Mã xác nhận sẽ được gửi đến email của bạn.
              </p>
              <button
                type="submit"
                className="w-full h-12 bg-solar-orange hover:bg-action-hover text-pure-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Gửi mã xác nhận
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </form>
          )}

          {/* Step 2: Code bypass notice */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="px-4 py-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <span
                  className="material-symbols-outlined text-amber-500 shrink-0 mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  construction
                </span>
                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-1">
                    Tính năng gửi email đang được tích hợp
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Dịch vụ gửi mã xác nhận qua email sẽ được kết nối trong phiên bản tiếp theo.
                    Hiện tại bạn có thể tiếp tục đặt lại mật khẩu ngay.
                  </p>
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-green-600 shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <div>
                  <p className="text-xs text-green-800 font-semibold">Danh tính đã được xác minh</p>
                  <p className="text-xs text-green-700">{identity.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { setError(""); setStep(3); }}
                className="w-full h-12 bg-solar-orange hover:bg-action-hover text-pure-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Tiếp tục đặt mật khẩu mới
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Step 3: New password */}
          {step === 3 && (
            <form onSubmit={handleSetPassword} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={passwords.newPw}
                    onChange={(e) => setPasswords({ ...passwords, newPw: e.target.value })}
                    className="w-full h-12 px-4 pr-12 rounded-xl border border-outline-variant/60 text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showNew ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={passwords.confirmPw}
                    onChange={(e) => setPasswords({ ...passwords, confirmPw: e.target.value })}
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
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-solar-orange hover:bg-action-hover text-pure-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    Đặt mật khẩu mới
                    <span className="material-symbols-outlined text-lg">lock_reset</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <span
                  className="material-symbols-outlined text-green-500 text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h1 className="text-3xl font-bold text-on-surface mb-3">Đặt lại thành công!</h1>
              <p className="text-on-surface-variant mb-8 leading-relaxed">
                Mật khẩu của bạn đã được cập nhật. Hãy đăng nhập bằng mật khẩu mới.
              </p>
              <button
                type="button"
                onClick={() => router.push("/dang-nhap")}
                className="w-full h-12 bg-solar-orange hover:bg-action-hover text-pure-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Đăng nhập ngay
                <span className="material-symbols-outlined text-lg">login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
