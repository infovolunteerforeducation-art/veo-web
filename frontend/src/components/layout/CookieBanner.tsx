"use client";

import { useEffect, useState } from "react";

const COOKIE_KEY = "veo_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(!localStorage.getItem(COOKIE_KEY));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const accept = (choice: "all" | "essential") => {
    localStorage.setItem(COOKIE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white shadow-[0_-4px_24px_rgba(83,11,113,0.10)] border-t border-outline-variant/30">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Icon + Text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span
            className="material-symbols-outlined text-primary shrink-0 mt-0.5 text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cookie
          </span>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            <span className="font-semibold text-on-surface">VEO</span> sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm, phân tích lưu lượng truy cập và cá nhân hóa nội dung.
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <a href="#" className="text-primary underline hover:text-primary/80 transition-colors">
              Chính sách Cookie
            </a>{" "}
            của chúng tôi. Dữ liệu phân tích được xử lý theo tiêu chuẩn{" "}
            <span className="font-medium text-on-surface">Google Consent Mode v2</span>.
          </p>
        </div>

        {/* Button */}
        <div className="flex items-center shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => accept("all")}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors"
          >
            Chấp nhận tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
