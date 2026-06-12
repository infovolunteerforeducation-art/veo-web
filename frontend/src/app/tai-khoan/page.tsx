"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { mockBookings, fmt, fmtDate, fmtDateTime } from "@/lib/crm-data";
import type { Booking, CoordinationStatus } from "@/lib/crm-data";

// ─── Level milestones ────────────────────────────────────────────────────────

const MILESTONES = [
  {
    at: 1,
    title: "Người đồng hành",
    icon: "hiking",
    gradient: "from-blue-400 to-indigo-500",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    benefits: [
      "Nhận chứng nhận tình nguyện viên VEO",
      "Ưu tiên nhận thông báo mở đăng ký sớm",
      "Tham gia cộng đồng tình nguyện viên VEO",
    ],
  },
  {
    at: 3,
    title: "Chiến binh xanh",
    icon: "military_tech",
    gradient: "from-primary to-deep-amethyst",
    textColor: "text-primary",
    bgColor: "bg-primary/5",
    borderColor: "border-primary/30",
    benefits: [
      "Giảm 5% phí tham gia tất cả chương trình",
      "Badge \"Chiến binh xanh\" nổi bật trên profile",
      "Được mời tham gia các buổi chia sẻ nội bộ VEO",
    ],
  },
  {
    at: 6,
    title: "Đại sứ VEO",
    icon: "workspace_premium",
    gradient: "from-solar-orange to-amber-500",
    textColor: "text-solar-orange",
    bgColor: "bg-solar-orange/5",
    borderColor: "border-solar-orange/30",
    benefits: [
      "Giảm 10% phí tham gia tất cả chương trình",
      "Ưu tiên slot khi chuyến gần hết chỗ",
      "Được giới thiệu trong newsletter & mạng xã hội VEO",
      "Quyền giới thiệu bạn bè với ưu đãi đặc biệt",
    ],
  },
  {
    at: 10,
    title: "Huyền thoại VEO",
    icon: "crown",
    gradient: "from-yellow-400 to-orange-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    benefits: [
      "1 chuyến miễn phí mỗi năm (theo chương trình áp dụng)",
      "Được mời tham gia đội ngũ lãnh đạo cộng đồng VEO",
      "Tên khắc trên \"Bảng vinh danh\" tình nguyện viên",
      "Hỗ trợ ưu tiên 24/7 từ đội ngũ VEO",
    ],
  },
] as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type VolunteerLevel = {
  title: string;
  icon: string;
  gradient: string;
  textColor: string;
  bgColor: string;
  nextTitle: string | null;
  nextAt: number | null;
  description: string;
};

function getVolunteerLevel(attended: number): VolunteerLevel {
  if (attended === 0) return {
    title: "Tân binh",       icon: "eco",               gradient: "from-green-400 to-teal-500",
    textColor: "text-teal-700", bgColor: "bg-teal-50",
    nextTitle: "Người đồng hành", nextAt: 1,
    description: "Hành trình tình nguyện của bạn bắt đầu từ đây.",
  };
  if (attended <= 2) return {
    title: "Người đồng hành", icon: "hiking",            gradient: "from-blue-400 to-indigo-500",
    textColor: "text-indigo-700", bgColor: "bg-indigo-50",
    nextTitle: "Chiến binh xanh", nextAt: 3,
    description: "Bạn đã bước vào hành trình, tiếp tục tỏa sáng!",
  };
  if (attended <= 5) return {
    title: "Chiến binh xanh", icon: "military_tech",     gradient: "from-primary to-deep-amethyst",
    textColor: "text-primary",   bgColor: "bg-primary/10",
    nextTitle: "Đại sứ VEO", nextAt: 6,
    description: "Bạn là tấm gương truyền cảm hứng cho cộng đồng.",
  };
  if (attended <= 9) return {
    title: "Đại sứ VEO",     icon: "workspace_premium",  gradient: "from-solar-orange to-amber-500",
    textColor: "text-solar-orange", bgColor: "bg-solar-orange/10",
    nextTitle: "Huyền thoại VEO", nextAt: 10,
    description: "Cống hiến của bạn tạo nên sự thay đổi thật sự.",
  };
  return {
    title: "Huyền thoại VEO", icon: "crown",             gradient: "from-yellow-400 to-orange-500",
    textColor: "text-yellow-700", bgColor: "bg-yellow-50",
    nextTitle: null, nextAt: null,
    description: "Bạn là biểu tượng của tinh thần tình nguyện VEO.",
  };
}

// ─── Badges ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid:      { label: "Đã thanh toán", cls: "bg-green-100 text-green-700" },
    pending:   { label: "Chờ xác nhận",  cls: "bg-yellow-100 text-yellow-700" },
    cancelled: { label: "Đã hủy",        cls: "bg-red-100 text-red-600" },
  };
  const s = map[status] ?? { label: status, cls: "bg-surface-container text-on-surface-variant" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

function AttendedBadge({ coordinationStatus }: { coordinationStatus?: CoordinationStatus | null }) {
  if (!coordinationStatus) return <span className="text-on-surface-variant text-xs">—</span>;
  const map: Record<CoordinationStatus, { label: string; cls: string }> = {
    attended:        { label: "Đã tham gia", cls: "bg-green-100 text-green-700" },
    absent_reserved: { label: "Bảo lưu",     cls: "bg-amber-100 text-amber-700" },
    absent_refunded: { label: "Hoàn tiền",   cls: "bg-blue-100 text-blue-700" },
    pending:         { label: "Chờ xác nhận",cls: "bg-surface-container text-on-surface-variant" },
  };
  const s = map[coordinationStatus] ?? { label: coordinationStatus, cls: "bg-surface-container text-on-surface-variant" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>{s.label}</span>;
}

// ─── Cancel Modal ────────────────────────────────────────────────────────────

function CancelModal({ booking, onConfirm, onClose }: { booking: Booking; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-red-500 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
          <h3 className="text-lg font-bold text-on-surface">Hủy đơn đăng ký?</h3>
        </div>
        <p className="text-sm text-on-surface-variant mb-1">
          Bạn chắc chắn muốn hủy đơn <span className="font-semibold text-on-surface">{booking.bookingCode}</span>?
        </p>
        <p className="text-sm text-on-surface-variant mb-6">
          Chương trình: <span className="font-medium">{booking.tourName}</span> — {booking.scheduleLabel}
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 h-10 rounded-xl border border-outline-variant/60 text-on-surface text-sm font-semibold hover:bg-surface-container transition">
            Không, giữ lại
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition">
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Đăng ký của tôi ────────────────────────────────────────────────────

function MyBookingsTab({ userEmail }: { userEmail: string }) {
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("veo_cancelled_bookings");
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch { return new Set(); }
  });
  const [confirmBooking, setConfirmBooking] = useState<Booking | null>(null);

  const myBookings = mockBookings
    .filter((b) => b.email.toLowerCase() === userEmail.toLowerCase())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const confirmCancel = () => {
    if (!confirmBooking) return;
    const next = new Set(cancelledIds);
    next.add(confirmBooking.id);
    setCancelledIds(next);
    localStorage.setItem("veo_cancelled_bookings", JSON.stringify([...next]));
    setConfirmBooking(null);
  };

  if (myBookings.length === 0) {
    return (
      <div className="text-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl mb-3 block text-outline">confirmation_number</span>
        <p className="text-base font-medium">Bạn chưa có đơn đăng ký nào.</p>
        <Link href="/tours" className="mt-4 inline-flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
          Khám phá chương trình <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {confirmBooking && <CancelModal booking={confirmBooking} onConfirm={confirmCancel} onClose={() => setConfirmBooking(null)} />}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-outline-variant/40">
              {["#", "Chương trình", "Lịch chuyến", "Mã đặt", "Số người", "Tổng tiền", "Trạng thái", ""].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {myBookings.map((b, i) => {
              const isCancelled = cancelledIds.has(b.id) || b.status === "cancelled";
              const effectiveStatus = isCancelled ? "cancelled" : b.status;
              return (
                <tr key={b.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="px-3 py-3.5 text-on-surface-variant">{i + 1}</td>
                  <td className="px-3 py-3.5">
                    <p className="font-semibold text-on-surface leading-tight">{b.tourName}</p>
                    {b.tourType && (
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${b.tourType === "dltn" ? "bg-primary/10 text-primary" : "bg-green-100 text-green-700"}`}>
                        {b.tourType === "dltn" ? "Du lịch tình nguyện" : "Trại hè tình nguyện"}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-on-surface-variant whitespace-nowrap">{b.scheduleLabel}</td>
                  <td className="px-3 py-3.5">
                    <span className="font-mono text-xs bg-surface-container px-2 py-0.5 rounded">{b.bookingCode}</span>
                  </td>
                  <td className="px-3 py-3.5 text-center">{b.numPeople}</td>
                  <td className="px-3 py-3.5 font-semibold text-on-surface whitespace-nowrap">{fmt(b.totalAmount)}</td>
                  <td className="px-3 py-3.5"><StatusBadge status={effectiveStatus} /></td>
                  <td className="px-3 py-3.5">
                    {!isCancelled && b.status === "pending" ? (
                      <button type="button" onClick={() => setConfirmBooking(b)}
                        className="px-3 py-1 rounded-lg border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
                        Hủy đơn
                      </button>
                    ) : (
                      <span className="text-on-surface-variant text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ─── Tab: Lịch sử tham gia ───────────────────────────────────────────────────

function ParticipationTab({ userEmail }: { userEmail: string }) {
  const email = userEmail.toLowerCase();
  const ownBookings = mockBookings.filter((b) => b.email.toLowerCase() === email);
  const participantBookings = mockBookings.filter(
    (b) => b.email.toLowerCase() !== email && b.participants?.some((p) => p.email?.toLowerCase() === email)
  );
  const entries = [
    ...ownBookings.map((b) => ({ booking: b, registrant: "Tự đăng ký", isSelf: true })),
    ...participantBookings.map((b) => ({ booking: b, registrant: b.customerName, isSelf: false })),
  ].sort((a, b) => b.booking.createdAt.localeCompare(a.booking.createdAt));

  if (entries.length === 0) {
    return (
      <div className="text-center py-16 text-on-surface-variant">
        <span className="material-symbols-outlined text-5xl mb-3 block text-outline">history</span>
        <p className="text-base font-medium">Chưa có lịch sử tham gia nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map(({ booking: b, registrant, isSelf }) => {
        const isAttended = b.coordinationStatus === "attended";
        const isReserved = b.coordinationStatus === "absent_reserved";
        return (
          <div key={b.id + (isSelf ? "-s" : "-p")} className={`flex gap-4 p-4 rounded-xl border transition-colors ${isAttended ? "bg-green-50/60 border-green-200/60" : isReserved ? "bg-amber-50/60 border-amber-200/60" : "bg-white border-outline-variant/30"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isAttended ? "bg-green-100" : isReserved ? "bg-amber-100" : "bg-surface-container"}`}>
              <span className={`material-symbols-outlined text-xl ${isAttended ? "text-green-600" : isReserved ? "text-amber-600" : "text-on-surface-variant"}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {isAttended ? "check_circle" : isReserved ? "savings" : "event"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <p className="font-semibold text-on-surface text-sm">{b.tourName}</p>
                <AttendedBadge coordinationStatus={b.coordinationStatus} />
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">{b.scheduleLabel}</p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="font-mono text-[11px] bg-white border border-outline-variant/30 px-1.5 py-0.5 rounded text-on-surface-variant">{b.bookingCode}</span>
                {!isSelf && <span className="text-xs text-on-surface-variant">Đăng ký bởi {registrant}</span>}
                <span className="text-xs text-on-surface-variant">{fmtDate(b.createdAt)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Tab: Tiền bảo lưu ───────────────────────────────────────────────────────

function ReservedTab({ userEmail }: { userEmail: string }) {
  const reservedBookings = mockBookings.filter(
    (b) => b.email.toLowerCase() === userEmail.toLowerCase() && b.coordinationStatus === "absent_reserved"
  );
  const total = reservedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-4">
      {total > 0 ? (
        <>
          <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-6 py-5 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-600 text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
            </div>
            <div>
              <p className="text-sm text-amber-800 font-medium">Tổng tiền đang bảo lưu</p>
              <p className="text-3xl font-bold text-amber-700 mt-0.5">{fmt(total)}</p>
              <p className="text-xs text-amber-600 mt-1">Có thể dùng cho chuyến đi tiếp theo</p>
            </div>
          </div>
          <div className="space-y-3">
            {reservedBookings.map((b) => (
              <div key={b.id} className="rounded-xl border border-outline-variant/40 bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-sm">{b.tourName}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{b.scheduleLabel} · {b.bookingCode}</p>
                  {b.reservationNote && (
                    <p className="text-xs text-amber-700 mt-1.5 flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">info</span>
                      {b.reservationNote}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-bold text-amber-700">{fmt(b.totalAmount)}</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700 mt-1">Bảo lưu</span>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 block text-outline">savings</span>
          <p className="text-base font-medium">Bạn không có khoản tiền bảo lưu nào.</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Đổi mật khẩu ───────────────────────────────────────────────────────

function ChangePasswordTab() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [show, setShow] = useState({ current: false, newPw: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (form.newPw.length < 8) { setError("Mật khẩu mới phải có ít nhất 8 ký tự."); return; }
    if (form.newPw !== form.confirm) { setError("Mật khẩu xác nhận không khớp."); return; }
    if (form.newPw === form.current) { setError("Mật khẩu mới phải khác mật khẩu hiện tại."); return; }
    setLoading(true);
    const result = await changePassword(form.current, form.newPw);
    setLoading(false);
    if (result.ok) { setSuccess(true); setForm({ current: "", newPw: "", confirm: "" }); }
    else setError(result.error ?? "Đổi mật khẩu thất bại.");
  };

  const Field = ({ id, label, value, onChange, placeholder, showKey }: { id: string; label: string; value: string; onChange: (v: string) => void; placeholder: string; showKey: keyof typeof show }) => (
    <div>
      <label className="block text-sm font-semibold text-on-surface mb-1.5">{label} <span className="text-red-500">*</span></label>
      <div className="relative">
        <input type={show[showKey] ? "text" : "password"} required value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full h-12 px-4 pr-12 rounded-xl border border-outline-variant/60 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
        <button type="button" onClick={() => setShow((s) => ({ ...s, [showKey]: !s[showKey] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
          <span className="material-symbols-outlined text-xl">{show[showKey] ? "visibility_off" : "visibility"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-md">
      {success && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          Đổi mật khẩu thành công!
        </div>
      )}
      {error && (
        <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="current" label="Mật khẩu hiện tại" value={form.current} onChange={(v) => setForm({ ...form, current: v })} placeholder="••••••••" showKey="current" />
        <Field id="newPw" label="Mật khẩu mới" value={form.newPw} onChange={(v) => setForm({ ...form, newPw: v })} placeholder="Tối thiểu 8 ký tự" showKey="newPw" />
        <Field id="confirm" label="Xác nhận mật khẩu mới" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} placeholder="Nhập lại mật khẩu mới" showKey="confirm" />
        <button type="submit" disabled={loading}
          className="h-12 px-8 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70">
          {loading ? <><span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>Đang lưu...</> : <><span className="material-symbols-outlined text-lg">lock_reset</span>Cập nhật mật khẩu</>}
        </button>
      </form>
    </div>
  );
}

// ─── Milestones section ───────────────────────────────────────────────────────

function MilestonesSection({ attended }: { attended: number }) {
  const defaultIdx = (() => {
    // Default to the highest unlocked level, or 0 if none unlocked
    let last = 0;
    MILESTONES.forEach((m, i) => { if (attended >= m.at) last = i; });
    return last;
  })();
  const [selected, setSelected] = useState(defaultIdx);
  const m = MILESTONES[selected];
  const unlocked = attended >= m.at;

  return (
    <div className="mt-4 pt-4 border-t border-outline-variant/20">
      <p className="text-xs font-semibold text-on-surface-variant mb-2">Các cấp độ & quyền lợi</p>

      {/* Chips */}
      <div className="flex gap-2 flex-wrap mb-3">
        {MILESTONES.map((ms, i) => {
          const isUnlocked = attended >= ms.at;
          const isSelected = selected === i;
          return (
            <button
              key={ms.at}
              type="button"
              onClick={() => setSelected(i)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isSelected
                  ? `${ms.bgColor} ${ms.borderColor} ${ms.textColor}`
                  : isUnlocked
                  ? "bg-surface-container-low border-outline-variant/40 text-on-surface hover:border-outline"
                  : "bg-white border-outline-variant/30 text-on-surface-variant/60"
              }`}
            >
              <span
                className={`material-symbols-outlined text-sm ${isSelected ? ms.textColor : isUnlocked ? "text-on-surface" : "text-outline"}`}
                style={{ fontVariationSettings: isUnlocked ? "'FILL' 1" : "" }}
              >
                {ms.icon}
              </span>
              {ms.title}
              {isUnlocked && (
                <span className={`ml-0.5 material-symbols-outlined text-xs ${isSelected ? ms.textColor : "text-green-500"}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              )}
              {!isUnlocked && (
                <span className="ml-0.5 text-[10px] text-on-surface-variant/50">{ms.at}+</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className={`rounded-xl border p-3 ${m.bgColor} ${m.borderColor}`}>
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${m.gradient} flex items-center justify-center shrink-0`}>
            <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-bold ${m.textColor}`}>{m.title}</span>
            <span className="text-xs text-on-surface-variant">· Từ {m.at} chuyến trở lên</span>
            {unlocked ? (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Đã đạt được
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-on-surface-variant bg-white/60 px-1.5 py-0.5 rounded-full border border-outline-variant/30">
                <span className="material-symbols-outlined text-xs">lock</span>
                Chưa mở khóa
              </span>
            )}
          </div>
        </div>
        <ul className="space-y-1.5">
          {m.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-on-surface">
              <span className={`material-symbols-outlined text-sm shrink-0 mt-0.5 ${unlocked ? m.textColor : "text-outline"}`} style={{ fontVariationSettings: unlocked ? "'FILL' 1" : "" }}>
                {unlocked ? "check_circle" : "radio_button_unchecked"}
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "bookings",  label: "Đăng ký của tôi",  icon: "confirmation_number" },
  { id: "history",   label: "Lịch sử tham gia",  icon: "history" },
  { id: "reserved",  label: "Tiền bảo lưu",       icon: "savings" },
  { id: "password",  label: "Đổi mật khẩu",       icon: "lock_reset" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("bookings");

  useEffect(() => {
    if (!loading && !user) router.push("/dang-nhap");
  }, [loading, user, router]);

  const stats = useMemo(() => {
    if (!user) return { attended: 0, totalTrips: 0, totalSpent: 0, reserved: 0, pending: 0, upcoming: null as Booking | null };
    const email = user.email.toLowerCase();
    const mine = mockBookings.filter((b) => b.email.toLowerCase() === email);
    const attended = mine.filter((b) => b.coordinationStatus === "attended" || b.attended === true).length;
    const totalSpent = mine.filter((b) => b.status === "paid").reduce((s, b) => s + b.totalAmount, 0);
    const reserved = mine.filter((b) => b.coordinationStatus === "absent_reserved").reduce((s, b) => s + b.totalAmount, 0);
    const pending = mine.filter((b) => b.status === "pending").length;
    const upcoming = mine.filter((b) => b.status === "pending").sort((a, b) => a.scheduleLabel.localeCompare(b.scheduleLabel))[0] ?? null;
    return { attended, totalTrips: mine.length, totalSpent, reserved, pending, upcoming };
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
      </div>
    );
  }

  const level = getVolunteerLevel(stats.attended);
  const progressPct = level.nextAt ? Math.min(100, Math.round((stats.attended / level.nextAt) * 100)) : 100;

  return (
    <div className="min-h-screen bg-[#f4f2f8]">
      {/* Top nav */}
      <header className="bg-white border-b border-outline-variant/30 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/veo-logo.png" alt="VEO" className="h-8 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-base">home</span>Trang chủ
            </Link>
            <button type="button" onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-semibold transition-colors">
              <span className="material-symbols-outlined text-base">logout</span>Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Hero banner */}
      <div className="bg-gradient-to-br from-deep-amethyst via-primary to-[#8341a1] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-xl">
                <span className="text-3xl font-bold text-white select-none">{getInitials(user.name)}</span>
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow-lg border-2 border-white`}>
                <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>{level.icon}</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold border border-white/30">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>{level.icon}</span>
                  {level.title}
                </span>
              </div>
              <p className="text-white/70 text-sm mb-3">{level.description}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">mail</span>{user.email}</span>
                {user.phone && <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">phone</span>{user.phone}</span>}
                <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">calendar_month</span>Tham gia từ {fmtDate(user.joinedAt)}</span>
              </div>
            </div>

            {/* CTA */}
            <div className="shrink-0">
              <Link href="/tours" className="inline-flex items-center gap-2 px-5 py-2.5 bg-solar-orange hover:bg-action-hover text-white rounded-xl text-sm font-bold transition-colors shadow-lg">
                <span className="material-symbols-outlined text-base">explore</span>
                Khám phá chuyến mới
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Chuyến đã tham gia", value: stats.attended, icon: "check_circle", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
            { label: "Tổng đơn đăng ký",  value: stats.totalTrips, icon: "confirmation_number", color: "text-primary", bg: "bg-primary/5", border: "border-primary/20" },
            { label: "Tổng đầu tư",        value: fmt(stats.totalSpent), icon: "payments", color: "text-solar-orange", bg: "bg-solar-orange/5", border: "border-solar-orange/20" },
            { label: "Đơn chờ xác nhận",  value: stats.pending, icon: "pending", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`material-symbols-outlined text-lg ${s.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                <p className="text-xs text-on-surface-variant font-medium leading-tight">{s.label}</p>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Level progress + upcoming trip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Volunteer level card */}
          <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${level.gradient} flex items-center justify-center shadow`}>
                <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{level.icon}</span>
              </div>
              <div>
                <p className="text-xs text-on-surface-variant font-medium">Cấp độ tình nguyện viên</p>
                <p className="font-bold text-on-surface text-base">{level.title}</p>
              </div>
            </div>

            {level.nextAt ? (
              <>
                <div className="flex justify-between text-xs text-on-surface-variant mb-1.5">
                  <span>{stats.attended} chuyến</span>
                  <span>Mục tiêu: {level.nextAt} chuyến → <span className="font-semibold text-on-surface">{level.nextTitle}</span></span>
                </div>
                <div className="h-2.5 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${level.gradient} transition-all`} style={{ width: `${progressPct}%` }} />
                </div>
                <p className="text-xs text-on-surface-variant mt-2">Còn <span className="font-semibold text-on-surface">{level.nextAt - stats.attended} chuyến</span> nữa để đạt <span className="font-semibold">{level.nextTitle}</span></p>
              </>
            ) : (
              <p className="text-sm text-on-surface-variant">Bạn đã đạt cấp độ cao nhất 🎉</p>
            )}

            {/* Milestone chips */}
            <MilestonesSection attended={stats.attended} />
          </div>

          {/* Upcoming trip or encourage card */}
          {stats.upcoming ? (
            <div className="bg-gradient-to-br from-primary/5 to-deep-amethyst/10 rounded-2xl border border-primary/20 p-5">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>upcoming</span>
                Chuyến sắp tới
              </p>
              <p className="font-bold text-on-surface text-base leading-snug mb-1">{stats.upcoming.tourName}</p>
              <p className="text-sm text-on-surface-variant mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">date_range</span>
                {stats.upcoming.scheduleLabel}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-on-surface-variant">Tổng tiền</p>
                  <p className="font-bold text-primary">{fmt(stats.upcoming.totalAmount)}</p>
                </div>
                <StatusBadge status={stats.upcoming.status} />
              </div>
              <div className="mt-3 pt-3 border-t border-primary/10">
                <span className="font-mono text-xs text-on-surface-variant bg-white px-2 py-0.5 rounded border border-outline-variant/30">
                  {stats.upcoming.bookingCode}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-5 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-solar-orange/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-solar-orange text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
              </div>
              <div>
                <p className="font-bold text-on-surface mb-1">Sẵn sàng cho chuyến tiếp theo?</p>
                <p className="text-sm text-on-surface-variant">Hàng chục chương trình tình nguyện đang chờ bạn.</p>
              </div>
              <Link href="/tours" className="inline-flex items-center gap-1.5 px-4 py-2 bg-solar-orange hover:bg-action-hover text-white rounded-xl text-sm font-bold transition-colors">
                <span className="material-symbols-outlined text-base">add</span>
                Đăng ký ngay
              </Link>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          <div className="border-b border-outline-variant/30 overflow-x-auto">
            <div className="flex min-w-max">
              {TABS.map((tab) => (
                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50"
                  }`}>
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  {tab.label}
                  {tab.id === "reserved" && stats.reserved > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">{fmt(stats.reserved)}</span>
                  )}
                  {tab.id === "bookings" && stats.pending > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-bold flex items-center justify-center">{stats.pending}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {activeTab === "bookings"  && <MyBookingsTab userEmail={user.email} />}
            {activeTab === "history"   && <ParticipationTab userEmail={user.email} />}
            {activeTab === "reserved"  && <ReservedTab userEmail={user.email} />}
            {activeTab === "password"  && <ChangePasswordTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
