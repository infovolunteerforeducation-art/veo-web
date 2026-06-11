"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "veo_session_expires";
const SESSION_DURATION_MS = 15 * 60 * 1000;

export function initSession() {
  const expires = Date.now() + SESSION_DURATION_MS;
  sessionStorage.setItem(SESSION_KEY, String(expires));
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem("veo_registration");
}

export default function SessionTimer({ tourSlug, returnPath }: { tourSlug: string; returnPath?: string }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);

  const tick = useCallback(() => {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) { setExpired(true); return; }
    const diff = parseInt(raw) - Date.now();
    if (diff <= 0) {
      clearSession();
      setExpired(true);
    } else {
      setRemaining(diff);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      window.clearTimeout(timeoutId);
      clearInterval(id);
    };
  }, [tick]);

  if (expired) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-error text-3xl">timer_off</span>
          </div>
          <h3 className="text-lg font-bold text-on-surface mb-2">Phiên đăng ký đã hết hạn</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            Phiên đăng ký chỉ có hiệu lực trong 15 phút. Vui lòng bắt đầu lại để hoàn tất đăng ký.
          </p>
          <button
            type="button"
            onClick={() => router.push(returnPath ?? `/tours/${tourSlug}`)}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors"
          >
            Quay lại trang tour
          </button>
        </div>
      </div>
    );
  }

  if (remaining === null) return null;

  const totalSecs = Math.ceil(remaining / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  const isWarning = totalSecs <= 60;

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
      isWarning
        ? "bg-error/10 text-error animate-pulse"
        : "bg-error/10 text-error"
    }`}>
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>timer</span>
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
