"use client";

import { ManagedTour, Booking, fmt, formatDuration } from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";

type Props = {
  tour: ManagedTour;
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

function AttendedToggle({ attended, onChange }: { attended: boolean | null | undefined; onChange: (v: boolean | null) => void }) {
  const current = attended === undefined ? null : attended;
  return (
    <div className="flex items-center gap-1">
      {ATTENDED_STATES.map((s) => (
        <button
          key={String(s.value)}
          type="button"
          onClick={() => onChange(s.value)}
          title={s.label}
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
            current === s.value ? s.activeClass : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{s.icon}</span>
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function TourDetailView({ tour, bookings, onBack, onToggleAttended }: Props) {
  // Sort by schedule isoDate descending (newest first)
  const sortedBookings = [...bookings]
    .map((b) => {
      const sched = tour.schedules.find((s) => s.id === b.scheduleId);
      return { ...b, _isoDate: sched?.isoDate ?? "" };
    })
    .sort((a, b) => b._isoDate.localeCompare(a._isoDate));

  const totalSchedules = tour.schedules.length;
  const totalBookings = bookings.length;
  const attendedPeople = bookings.filter((b) => b.attended === true).reduce((s, b) => s + b.numPeople, 0);
  const totalRevenue = bookings.filter((b) => b.status === "paid").reduce((s, b) => s + b.totalAmount, 0);
  const paidCount = bookings.filter((b) => b.status === "paid").length;

  const stats = [
    { label: "Số lịch chuyến",  value: totalSchedules, sub: `${formatDuration(tour.duration)} / chuyến`,  color: "text-primary",      isText: false },
    { label: "Tổng đăng ký",    value: totalBookings,  sub: `${bookings.reduce((s, b) => s + b.numPeople, 0)} người đăng ký`, color: "text-blue-600", isText: false },
    { label: "Tổng người TG",   value: attendedPeople, sub: "xác nhận tham gia",          color: "text-green-600",    isText: false },
    { label: "Doanh thu",       value: fmt(totalRevenue), sub: `${paidCount} đơn đã TT`,  color: "text-solar-orange", isText: true  },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors mb-4"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Quay lại danh sách chương trình
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-on-surface">{tour.title}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>location_on</span>
                {tour.destinationName}
              </span>
              <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>schedule</span>
                {formatDuration(tour.duration)}
              </span>
              {tour.ageRange && (
                <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>people</span>
                  {tour.ageRange}
                </span>
              )}
              <StatusBadge status={tour.status} small />
            </div>
          </div>
          <p className="text-xl font-bold text-primary shrink-0">
            {fmt(tour.price)}<span className="text-sm font-normal text-on-surface-variant">/người</span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-outline-variant/30 p-4">
            <p className="text-xs text-on-surface-variant font-medium">{s.label}</p>
            <p className={`font-bold mt-1 ${s.isText ? "text-xl" : "text-2xl"} ${s.color}`}>{s.value}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Bookings table */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <h3 className="text-base font-bold text-on-surface">Danh sách khách đăng ký</h3>
          <p className="text-sm text-on-surface-variant mt-0.5">
            {sortedBookings.length} đơn đăng ký · sắp xếp theo lịch khởi hành mới nhất
          </p>
        </div>

        {sortedBookings.length === 0 ? (
          <div className="text-center py-16 text-sm text-on-surface-variant">Chưa có đơn đăng ký nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Khách hàng</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Lịch chuyến</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Số người</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tổng tiền</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Đăng ký lúc</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Thanh toán</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {sortedBookings.map((b, i) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-3 text-on-surface-variant text-xs">{i + 1}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-on-surface">{b.customerName}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{b.phone} · {b.email}</p>
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant text-xs whitespace-nowrap">{b.scheduleLabel}</td>
                    <td className="px-5 py-3 text-center font-semibold text-on-surface">{b.numPeople}</td>
                    <td className="px-5 py-3 text-right font-semibold text-on-surface whitespace-nowrap">{fmt(b.totalAmount)}</td>
                    <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">{fmtDateTime(b.createdAt)}</td>
                    <td className="px-5 py-3 text-center"><BookingStatusBadge status={b.status} /></td>
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
