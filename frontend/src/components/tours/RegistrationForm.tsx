"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tour } from "@/lib/tours";
import { initSession } from "@/components/tours/SessionTimer";

type Participant = {
  name: string;
  useSamePhone: boolean;
  phone: string;
  email: string;
  isSelf?: boolean;
};

const inputClass =
  "w-full px-4 py-3 rounded-lg border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors";
const labelClass = "block text-xs font-semibold text-on-surface-variant mb-1.5";
const errorClass = "text-xs text-error mt-1";

export default function RegistrationForm({ tour, selectedDate, paymentPath }: { tour: Tour; selectedDate: string; paymentPath?: string }) {
  const router = useRouter();

  const [registrant, setRegistrant] = useState({
    name: "",
    phone: "",
    email: "",
    numPeople: 1,
  });
  const [participants, setParticipants] = useState<Participant[]>([
    { name: "", useSamePhone: false, phone: "", email: "", isSelf: false },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGroupDialog, setShowGroupDialog] = useState(false);

  useEffect(() => { initSession(); }, []);

  function handleNumPeopleChange(raw: number) {
    if ((raw || 0) > 9) { setShowGroupDialog(true); return; }
    const num = Math.max(1, Math.min(9, raw || 1));
    setRegistrant((r) => ({ ...r, numPeople: num }));
    setParticipants(
      Array.from(
        { length: num },
        (_, i) => participants[i] ?? (i === 0
          ? { name: "", useSamePhone: false, phone: "", email: "", isSelf: false }
          : { name: "", useSamePhone: false, phone: "", email: "" })
      )
    );
  }

  function handleParticipant(index: number, field: keyof Participant, value: string | boolean) {
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!registrant.name.trim()) e.name = "Vui lòng nhập họ và tên";
    if (!registrant.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    if (!registrant.email.trim()) e.email = "Vui lòng nhập email";
    participants.forEach((p, i) => {
      if (p.isSelf) return;
      if (!p.name.trim()) e[`p${i}_name`] = "Vui lòng nhập họ và tên";
      if (!p.useSamePhone && !p.phone.trim()) e[`p${i}_phone`] = "Vui lòng nhập số điện thoại";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    sessionStorage.setItem("veo_registration", JSON.stringify({ registrant: { ...registrant, departureDate: selectedDate }, participants }));
    router.push(paymentPath ?? `/tours/${tour.slug}/thanh-toan`);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Section 1 */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 mb-5">
        <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
          <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
            1
          </span>
          Thông tin người đăng ký
        </h2>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Họ và tên <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={registrant.name}
              onChange={(e) => setRegistrant((r) => ({ ...r, name: e.target.value }))}
              className={inputClass}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Số điện thoại <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                placeholder="0912 345 678"
                value={registrant.phone}
                onChange={(e) => setRegistrant((r) => ({ ...r, phone: e.target.value }))}
                className={inputClass}
              />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>
            <div>
              <label className={labelClass}>
                Email <span className="text-error">*</span>
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={registrant.email}
                onChange={(e) => setRegistrant((r) => ({ ...r, email: e.target.value }))}
                className={inputClass}
              />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Ngày khởi hành</label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-low text-sm text-on-surface">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>calendar_month</span>
              <span className="font-semibold">
                {selectedDate
                  ? new Date(selectedDate + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
                  : selectedDate}
              </span>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              Số lượng người tham gia <span className="text-error">*</span>
            </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNumPeopleChange(registrant.numPeople - 1)}
                  className="w-11 h-11 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span>
                </button>
                <input
                  type="number"
                  min={1}
                  max={9}
                  value={registrant.numPeople}
                  onChange={(e) => handleNumPeopleChange(parseInt(e.target.value))}
                  className="flex-1 px-3 py-3 rounded-lg border border-outline-variant bg-white text-sm text-center focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleNumPeopleChange(registrant.numPeople + 1)}
                  className="w-11 h-11 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                </button>
              </div>
          </div>
        </div>
      </div>

      {/* Section 2 – participants */}
      {participants.length > 0 && (
        <div className="bg-white rounded-2xl border border-outline-variant/30 p-6 mb-5">
          <h2 className="text-base font-bold text-primary mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
              2
            </span>
            Thông tin người tham gia
          </h2>

          <div className="space-y-4">
            {participants.map((p, i) => (
              <div
                key={i}
                className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold text-on-surface">
                    Người tham gia {i + 1}
                  </p>
                  {i === 0 && (
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={p.isSelf ?? false}
                        onChange={(e) => handleParticipant(0, "isSelf", e.target.checked)}
                        className="w-4 h-4 rounded accent-primary shrink-0"
                      />
                      <span className="text-sm font-semibold text-primary">Tôi là người tham gia</span>
                    </label>
                  )}
                </div>

                {i === 0 && p.isSelf ? (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>Họ và tên</label>
                      <div className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-sm text-on-surface">
                        {registrant.name || <span className="text-on-surface-variant italic">Chưa nhập tên người đăng ký</span>}
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Số điện thoại</label>
                      <div className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-sm text-on-surface">
                        {registrant.phone || <span className="text-on-surface-variant italic">Chưa nhập số điện thoại người đăng ký</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className={labelClass}>
                        Họ và tên <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Nguyễn Văn B"
                        value={p.name}
                        onChange={(e) => handleParticipant(i, "name", e.target.value)}
                        className={inputClass}
                      />
                      {errors[`p${i}_name`] && (
                        <p className={errorClass}>{errors[`p${i}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Số điện thoại</label>
                      {!p.useSamePhone ? (
                        <>
                          <input
                            type="tel"
                            placeholder="0912 345 678"
                            value={p.phone}
                            onChange={(e) => handleParticipant(i, "phone", e.target.value)}
                            className={inputClass}
                          />
                          {errors[`p${i}_phone`] && (
                            <p className={errorClass}>{errors[`p${i}_phone`]}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-sm text-on-surface-variant italic">
                          Dùng số của người đăng ký
                        </div>
                      )}
                      {i > 0 && (
                        <label className="flex items-start gap-2 mt-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={p.useSamePhone}
                            onChange={(e) => handleParticipant(i, "useSamePhone", e.target.checked)}
                            className="w-4 h-4 rounded accent-primary mt-0.5 shrink-0"
                          />
                          <span className="text-xs text-on-surface-variant">
                            Sử dụng số điện thoại của người đăng ký
                          </span>
                        </label>
                      )}
                      {i > 0 && p.useSamePhone && (
                        <div className="flex items-start gap-1.5 mt-2 px-3 py-2 bg-solar-orange/10 rounded-lg">
                          <span className="material-symbols-outlined text-solar-orange shrink-0" style={{ fontSize: 14, marginTop: 1 }}>info</span>
                          <p className="text-xs text-on-surface-variant">
                            Nếu sử dụng số điện thoại của người đăng ký, lịch sử tham gia chuyến đi sẽ <span className="font-semibold text-on-surface">không được ghi nhận riêng</span> cho người này.
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        placeholder="example@email.com"
                        value={p.email}
                        onChange={(e) => handleParticipant(i, "email", e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-solar-orange hover:bg-action-hover text-pure-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-base"
      >
        <span className="material-symbols-outlined">arrow_forward</span>
        Xác nhận và tiếp tục
      </button>
      <p className="text-center text-xs text-on-surface-variant mt-3 leading-relaxed">
        Bằng việc bấm &ldquo;Xác nhận và tiếp tục&rdquo;, bạn đã đồng ý với{" "}
        <a href="/dieu-khoan-su-dung" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors font-medium">
          Điều khoản sử dụng
        </a>{" "}
        của chúng tôi.
      </p>

      {/* Group size dialog */}
      {showGroupDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">groups</span>
            </div>
            <h3 className="text-lg font-bold text-on-surface text-center mb-2">
              Đăng ký nhóm lớn
            </h3>
            <p className="text-sm text-on-surface-variant text-center mb-6">
              Vì số lượng đăng ký trên 9 người, vui lòng liên hệ với đội ngũ của VEO để được hỗ trợ tư vấn tốt nhất.
            </p>
            <a
              href="https://facebook.com/veo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1877F2] hover:bg-[#1565d8] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Liên hệ Facebook VEO
            </a>
            <button
              type="button"
              onClick={() => setShowGroupDialog(false)}
              className="w-full py-3 rounded-xl font-semibold text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
