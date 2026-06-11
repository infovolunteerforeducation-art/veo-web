"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { mockBookings, fmt, fmtDate, fmtDateTime } from "@/lib/crm-data";
import type { Booking, CoordinationStatus } from "@/lib/crm-data";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type StatusBadgeProps = { status: string };

function StatusBadge({ status }: StatusBadgeProps) {
  const map: Record<string, { label: string; cls: string }> = {
    paid:      { label: "Đã thanh toán", cls: "bg-green-100 text-green-700" },
    pending:   { label: "Chờ xác nhận",  cls: "bg-yellow-100 text-yellow-700" },
    cancelled: { label: "Đã hủy",         cls: "bg-red-100 text-red-600" },
    huy:       { label: "Đã hủy",         cls: "bg-red-100 text-red-600" },
  };
  const s = map[status] ?? { label: status, cls: "bg-surface-container text-on-surface-variant" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

function AttendedBadge({ coordinationStatus }: { coordinationStatus?: CoordinationStatus | null }) {
  if (!coordinationStatus) return <span className="text-on-surface-variant text-xs">—</span>;
  const map: Record<CoordinationStatus, { label: string; cls: string }> = {
    attended:         { label: "Đã tham gia",   cls: "bg-green-100 text-green-700" },
    absent_reserved:  { label: "Bảo lưu",        cls: "bg-amber-100 text-amber-700" },
    absent_refunded:  { label: "Hoàn tiền",      cls: "bg-blue-100 text-blue-700" },
    pending:          { label: "Chờ xác nhận",   cls: "bg-surface-container text-on-surface-variant" },
  };
  const s = map[coordinationStatus] ?? { label: coordinationStatus, cls: "bg-surface-container text-on-surface-variant" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── Cancel Modal ────────────────────────────────────────────────────────────

function CancelModal({
  booking,
  onConfirm,
  onClose,
}: {
  booking: Booking;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <span
            className="material-symbols-outlined text-red-500 text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            cancel
          </span>
          <h3 className="text-lg font-bold text-on-surface">Hủy đơn đăng ký?</h3>
        </div>
        <p className="text-sm text-on-surface-variant mb-1">
          Bạn chắc chắn muốn hủy đơn{" "}
          <span className="font-semibold text-on-surface">{booking.bookingCode}</span>?
        </p>
        <p className="text-sm text-on-surface-variant mb-6">
          Chương trình: <span className="font-medium">{booking.tourName}</span> — {booking.scheduleLabel}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-outline-variant/60 text-on-surface text-sm font-semibold hover:bg-surface-container transition"
          >
            Không, giữ lại
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-10 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition"
          >
            Xác nhận hủy
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab 1: Đăng ký của tôi ─────────────────────────────────────────────────

function MyBookingsTab({ userEmail }: { userEmail: string }) {
  const [cancelledIds, setCancelledIds] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set();
    try {
      const raw = localStorage.getItem("veo_cancelled_bookings");
      return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });
  const [confirmBooking, setConfirmBooking] = useState<Booking | null>(null);

  const myBookings = mockBookings
    .filter((b) => b.email.toLowerCase() === userEmail.toLowerCase())
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleCancel = (booking: Booking) => {
    setConfirmBooking(booking);
  };

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
          Khám phá chương trình
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      {confirmBooking && (
        <CancelModal
          booking={confirmBooking}
          onConfirm={confirmCancel}
          onClose={() => setConfirmBooking(null)}
        />
      )}
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-outline-variant/40">
              {["#", "Chương trình", "Lịch chuyến", "Mã đặt", "Số người", "Tổng tiền", "Trạng thái", "Hành động"].map((h) => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
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
                  </td>
                  <td className="px-3 py-3.5 text-on-surface-variant whitespace-nowrap">{b.scheduleLabel}</td>
                  <td className="px-3 py-3.5">
                    <span className="font-mono text-xs bg-surface-container px-2 py-0.5 rounded">{b.bookingCode}</span>
                  </td>
                  <td className="px-3 py-3.5 text-center">{b.numPeople}</td>
                  <td className="px-3 py-3.5 font-semibold text-on-surface whitespace-nowrap">{fmt(b.totalAmount)}</td>
                  <td className="px-3 py-3.5">
                    <StatusBadge status={effectiveStatus} />
                  </td>
                  <td className="px-3 py-3.5">
                    {!isCancelled && b.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => handleCancel(b)}
                        className="px-3 py-1 rounded-lg border border-red-300 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                      >
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

// ─── Tab 2: Lịch sử tham gia ─────────────────────────────────────────────────

function ParticipationTab({ userEmail }: { userEmail: string }) {
  const email = userEmail.toLowerCase();

  // Own bookings where user is a registrant
  const ownBookings = mockBookings.filter((b) => b.email.toLowerCase() === email);

  // Others' bookings where user is listed as a participant (not the registrant)
  const participantBookings = mockBookings.filter(
    (b) =>
      b.email.toLowerCase() !== email &&
      b.participants?.some((p) => p.email?.toLowerCase() === email)
  );

  type ParticipationEntry = {
    booking: Booking;
    registrant: string;
    isSelf: boolean;
  };

  const entries: ParticipationEntry[] = [
    ...ownBookings.map((b) => ({ booking: b, registrant: "Tự đăng ký", isSelf: true })),
    ...participantBookings.map((b) => ({
      booking: b,
      registrant: b.customerName,
      isSelf: false,
    })),
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
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <table className="w-full text-sm min-w-[650px]">
        <thead>
          <tr className="border-b border-outline-variant/40">
            {["#", "Chương trình", "Lịch chuyến", "Người đăng ký", "Đăng ký lúc", "Tình trạng"].map((h) => (
              <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-on-surface-variant uppercase tracking-wide whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {entries.map(({ booking: b, registrant, isSelf }, i) => (
            <tr key={b.id + (isSelf ? "-self" : "-part")} className="hover:bg-surface-container/50 transition-colors">
              <td className="px-3 py-3.5 text-on-surface-variant">{i + 1}</td>
              <td className="px-3 py-3.5 font-semibold text-on-surface">{b.tourName}</td>
              <td className="px-3 py-3.5 text-on-surface-variant whitespace-nowrap">{b.scheduleLabel}</td>
              <td className="px-3 py-3.5">
                {isSelf ? (
                  <span className="text-primary font-medium text-xs">{registrant}</span>
                ) : (
                  <span className="text-on-surface-variant text-xs">{registrant}</span>
                )}
              </td>
              <td className="px-3 py-3.5 text-on-surface-variant whitespace-nowrap text-xs">
                {fmtDateTime(b.createdAt)}
              </td>
              <td className="px-3 py-3.5">
                <AttendedBadge coordinationStatus={b.coordinationStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab 3: Tiền bảo lưu ─────────────────────────────────────────────────────

function ReservedTab({ userEmail }: { userEmail: string }) {
  const reservedBookings = mockBookings.filter(
    (b) =>
      b.email.toLowerCase() === userEmail.toLowerCase() &&
      b.coordinationStatus === "absent_reserved"
  );

  const total = reservedBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="space-y-5">
      {total > 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 flex items-center gap-4">
          <span
            className="material-symbols-outlined text-amber-600 text-3xl shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            savings
          </span>
          <div>
            <p className="text-sm text-amber-800 font-medium">Tổng tiền đang bảo lưu</p>
            <p className="text-2xl font-bold text-amber-700">{fmt(total)}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl mb-3 block text-outline">savings</span>
          <p className="text-base font-medium">Bạn không có khoản tiền bảo lưu nào.</p>
        </div>
      )}

      {reservedBookings.length > 0 && (
        <div className="space-y-3">
          {reservedBookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-outline-variant/40 bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-on-surface text-sm">{b.tourName}</p>
                <p className="text-xs text-on-surface-variant mt-0.5">{b.scheduleLabel} · {b.bookingCode}</p>
                {b.reservationNote && (
                  <p className="text-xs text-amber-700 mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">info</span>
                    {b.reservationNote}
                  </p>
                )}
              </div>
              <div className="shrink-0">
                <p className="text-base font-bold text-amber-700">{fmt(b.totalAmount)}</p>
                <p className="text-xs text-on-surface-variant text-right">Bảo lưu</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Đổi mật khẩu ─────────────────────────────────────────────────────

function ChangePasswordTab() {
  const { changePassword } = useAuth();
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (form.newPw.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (form.newPw !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (form.newPw === form.current) {
      setError("Mật khẩu mới phải khác mật khẩu hiện tại.");
      return;
    }
    setLoading(true);
    const result = await changePassword(form.current, form.newPw);
    setLoading(false);
    if (result.ok) {
      setSuccess(true);
      setForm({ current: "", newPw: "", confirm: "" });
    } else {
      setError(result.error ?? "Đổi mật khẩu thất bại.");
    }
  };

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
        {/* Current password */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">
            Mật khẩu hiện tại <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              required
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-outline-variant/60 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-xl">{showCurrent ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              minLength={8}
              value={form.newPw}
              onChange={(e) => setForm({ ...form, newPw: e.target.value })}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-outline-variant/60 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              placeholder="Tối thiểu 8 ký tự"
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-xl">{showNew ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1.5">
            Xác nhận mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full h-12 px-4 pr-12 rounded-xl border border-outline-variant/60 text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-xl">{showConfirm ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 px-8 bg-primary hover:bg-primary-container text-on-primary font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              Đang lưu...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-lg">lock_reset</span>
              Cập nhật mật khẩu
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "bookings",      label: "Đăng ký của tôi",    icon: "confirmation_number" },
  { id: "history",       label: "Lịch sử tham gia",   icon: "history" },
  { id: "reserved",      label: "Tiền bảo lưu",        icon: "savings" },
  { id: "password",      label: "Đổi mật khẩu",        icon: "lock_reset" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("bookings");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/dang-nhap");
    }
  }, [loading, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top nav bar */}
      <header className="bg-white border-b border-outline-variant/30 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/veo-logo.png" alt="VEO" className="h-8 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-base">home</span>
              Trang chủ
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Profile header card */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-md">
              <span className="text-2xl font-bold text-on-primary select-none">
                {getInitials(user.name)}
              </span>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-on-surface truncate">{user.name}</h1>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">mail</span>
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">phone</span>
                    {user.phone}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">calendar_month</span>
                  Tham gia từ {fmtDate(user.joinedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar + content */}
        <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {/* Tab bar */}
          <div className="border-b border-outline-variant/30 overflow-x-auto">
            <div className="flex min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary bg-primary/5"
                      : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50"
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-6">
            {activeTab === "bookings" && <MyBookingsTab userEmail={user.email} />}
            {activeTab === "history"  && <ParticipationTab userEmail={user.email} />}
            {activeTab === "reserved" && <ReservedTab userEmail={user.email} />}
            {activeTab === "password" && <ChangePasswordTab />}
          </div>
        </div>
      </main>
    </div>
  );
}
