"use client";

import { Booking, FlatSchedule, computeScheduleLabel, fmt } from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";

type Props = {
  schedule: FlatSchedule;
  bookings: Booking[];
  onBack: () => void;
  onToggleAttended: (bookingId: string, attended: boolean | null) => void;
};

function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch { return iso; }
}

function BookingStatusBadge({ status }: { status: Booking["status"] }) {
  const map: Record<Booking["status"], { label: string; className: string }> = {
    paid:      { label: "Đã thanh toán", className: "bg-green-100 text-green-700" },
    pending:   { label: "Chờ xử lý",     className: "bg-yellow-100 text-yellow-700" },
    cancelled: { label: "Đã hủy",        className: "bg-red-100 text-red-700" },
  };
  const { label, className } = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${className}`}>
      {label}
    </span>
  );
}

type AttendedState = { value: boolean | null; label: string; icon: string; activeClass: string };

const ATTENDED_STATES: AttendedState[] = [
  { value: true,  label: "Tham gia",  icon: "check_circle", activeClass: "bg-green-100 text-green-700 border-green-300" },
  { value: false, label: "Vắng mặt", icon: "cancel",        activeClass: "bg-red-100 text-red-700 border-red-300" },
  { value: null,  label: "Chưa rõ",  icon: "help",          activeClass: "bg-surface-container text-on-surface border-outline-variant" },
];

function AttendedToggle({
  attended,
  onChange,
}: {
  attended: boolean | null | undefined;
  onChange: (v: boolean | null) => void;
}) {
  const current = attended === undefined ? null : attended;
  return (
    <div className="flex items-center gap-1">
      {ATTENDED_STATES.map((s) => {
        const isActive = current === s.value;
        return (
          <button
            key={String(s.value)}
            type="button"
            onClick={() => onChange(s.value)}
            title={s.label}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
              isActive
                ? s.activeClass
                : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{s.icon}</span>
            <span>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function ScheduleParticipantsView({ schedule, bookings, onBack, onToggleAttended }: Props) {
  const totalPeople = bookings.reduce((s, b) => s + b.numPeople, 0);
  const paidBookings = bookings.filter((b) => b.status === "paid");
  const attendedCount = bookings.filter((b) => b.attended === true).length;
  const absentCount = bookings.filter((b) => b.attended === false).length;
  const totalRevenue = paidBookings.reduce((s, b) => s + b.totalAmount, 0);

  const stats = [
    { label: "Tổng đăng ký",    value: bookings.length,  sub: `${totalPeople} người`,        color: "text-primary" },
    { label: "Doanh thu",        value: fmt(totalRevenue), sub: `${paidBookings.length} đã TT`, color: "text-green-600", isText: true },
    { label: "Đã tham gia",     value: attendedCount,    sub: "xác nhận có mặt",              color: "text-blue-600" },
    { label: "Vắng mặt",        value: absentCount,      sub: "không tham gia",               color: "text-red-500" },
  ];

  return (
    <div className="space-y-5">
      {/* Back + Header */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors mb-4"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Quay lại danh sách lịch chuyến
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-on-surface">{schedule.tourTitle}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>date_range</span>
                {computeScheduleLabel(schedule.isoDate, schedule.tourDuration)}
              </span>
              <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>group</span>
                {schedule.spotsTotal - schedule.spotsLeft}/{schedule.spotsTotal} chỗ đã đặt
              </span>
              <StatusBadge status={schedule.status} small />
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-outline-variant/30 p-4">
            <p className="text-xs text-on-surface-variant font-medium">{s.label}</p>
            <p className={`font-bold mt-1 ${s.isText ? "text-xl" : "text-2xl"} ${s.color}`}>{s.value}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Participants table */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-on-surface">Danh sách khách đăng ký</h3>
            <p className="text-sm text-on-surface-variant mt-0.5">{bookings.length} đơn đăng ký</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 text-sm text-on-surface-variant">
            Chưa có đơn đăng ký nào cho lịch chuyến này
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Khách hàng</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Số người</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Mã đặt</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tổng tiền</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Đăng ký lúc</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Thanh toán</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {bookings.map((b, i) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-3 text-on-surface-variant text-xs">{i + 1}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-on-surface">{b.customerName}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{b.phone} · {b.email}</p>
                    </td>
                    <td className="px-5 py-3 text-center font-semibold text-on-surface">{b.numPeople}</td>
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded-lg text-on-surface">
                        {b.bookingCode}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-on-surface whitespace-nowrap">
                      {fmt(b.totalAmount)}
                    </td>
                    <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                      {fmtDateTime(b.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <BookingStatusBadge status={b.status} />
                    </td>
                    <td className="px-5 py-3">
                      <AttendedToggle
                        attended={b.attended}
                        onChange={(v) => onToggleAttended(b.id, v)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
