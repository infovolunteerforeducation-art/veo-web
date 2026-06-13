"use client";

import { FormEvent, useEffect, useState } from "react";

type ConsultationButtonProps = {
  label?: string;
  className?: string;
};

export default function ConsultationButton({
  label = "Nhận tư vấn ngay",
  className = "",
}: ConsultationButtonProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  function closeModal() {
    setOpen(false);
    window.setTimeout(() => setSubmitted(false), 180);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
        <span className="material-symbols-outlined text-base">arrow_forward</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Đóng form tư vấn"
            onClick={closeModal}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-primary px-6 py-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-solar-orange">Tư vấn chương trình</p>
                  <h2 className="mt-2 text-2xl font-bold leading-tight">Đăng ký nhận tư vấn</h2>
                  <p className="mt-2 text-sm leading-6 text-white/80">
                    VEO sẽ liên hệ để tư vấn chương trình phù hợp với nhu cầu của đơn vị.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Đóng"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <span className="material-symbols-outlined text-[22px]">close</span>
                </button>
              </div>
            </div>

            {submitted ? (
              <div className="px-6 py-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <span className="material-symbols-outlined text-[30px]">check</span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-primary">Đã nhận thông tin tư vấn</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-on-surface-variant">
                  Cảm ơn bạn. Đội ngũ VEO sẽ liên hệ lại trong thời gian sớm nhất.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
                <label className="block">
                  <span className="text-sm font-bold text-on-surface">Họ và tên</span>
                  <input
                    required
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Nhập họ và tên"
                    className="mt-2 h-12 w-full rounded-xl border border-outline-variant px-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-on-surface">Số điện thoại</span>
                  <input
                    required
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Nhập số điện thoại"
                    className="mt-2 h-12 w-full rounded-xl border border-outline-variant px-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-on-surface">Tên đơn vị</span>
                  <input
                    required
                    name="organization"
                    type="text"
                    autoComplete="organization"
                    placeholder="Nhập tên trường / tổ chức / doanh nghiệp"
                    className="mt-2 h-12 w-full rounded-xl border border-outline-variant px-4 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </label>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex items-center justify-center rounded-full border border-outline-variant px-5 py-3 text-sm font-bold text-on-surface transition-colors hover:bg-surface-container-low"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-solar-orange px-6 py-3 text-sm font-bold text-primary shadow-lg transition-colors hover:bg-action-hover"
                  >
                    Gửi thông tin
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
