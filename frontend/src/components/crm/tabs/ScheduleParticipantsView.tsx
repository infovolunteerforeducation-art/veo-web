"use client";

import { Booking, BookingParticipant, FlatSchedule, computeScheduleLabel, fmtDateTime } from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";

type Props = {
  schedule: FlatSchedule;
  bookings: Booking[];
  onBack: () => void;
  onToggleAttended: (bookingId: string, attended: boolean | null) => void;
  onViewBooking?: (bookingId: string) => void;
};

function AttendedToggle({
  attended,
  onChange,
}: {
  attended: boolean | null | undefined;
  onChange: (v: boolean | null) => void;
}) {
  const current = attended === undefined ? null : attended;
  const states = [
    { value: true,  label: "Tham gia",  icon: "check_circle", activeClass: "bg-green-100 text-green-700 border-green-300" },
    { value: false, label: "Vắng mặt", icon: "cancel",        activeClass: "bg-red-100 text-red-700 border-red-300" },
  ] as const;

  return (
    <div className="flex items-center gap-1">
      {states.map((s) => {
        const isActive = current === s.value;
        return (
          <button
            key={String(s.value)}
            type="button"
            onClick={() => onChange(isActive ? null : s.value)}
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

export default function ScheduleParticipantsView({ schedule, bookings, onBack, onToggleAttended, onViewBooking }: Props) {
  const totalPeople    = bookings.reduce((s, b) => s + b.numPeople, 0);
  const paidBookings   = bookings.filter((b) => b.status === "paid");
  const paidPeople     = paidBookings.reduce((s, b) => s + b.numPeople, 0);
  const attendedCount  = paidBookings.filter((b) => b.attended === true).reduce((s, b) => s + b.numPeople, 0);
  const absentCount    = paidBookings.filter((b) => b.attended === false).reduce((s, b) => s + b.numPeople, 0);

  // Flatten paid bookings to 1 row per participant
  type ParticipantRow = BookingParticipant & { booking: Booking };
  const participantRows: ParticipantRow[] = paidBookings.flatMap((b) => {
    const parts = b.participants && b.participants.length > 0
      ? b.participants
      : [{ name: b.customerName, phone: b.phone, email: b.email }];
    return parts.map((p) => ({ ...p, booking: b }));
  });

  const stats = [
    { label: "Tổng đăng ký",          value: totalPeople,  color: "text-primary" },
    { label: "Tổng người thanh toán",  value: paidPeople,   color: "text-green-600" },
    { label: "Tổng người tham gia",    value: attendedCount, color: "text-blue-600" },
    { label: "Tổng người vắng mặt",    value: absentCount,  color: "text-red-500" },
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
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Participants table */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <h3 className="text-base font-bold text-on-surface">Danh sách khách tham gia chuyến đi</h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{paidPeople} người · {paidBookings.length} lượt đặt đã thanh toán</p>
        </div>

        {participantRows.length === 0 ? (
          <div className="text-center py-16 text-sm text-on-surface-variant">
            Chưa có khách nào đã thanh toán cho lịch chuyến này
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Khách hàng</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Người đăng ký</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Mã đặt</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Đăng ký lúc</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {participantRows.map((row, i) => (
                  <tr key={`${row.booking.id}-${i}`} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-3 text-on-surface-variant text-xs">{i + 1}</td>

                    {/* Khách hàng (participant) */}
                    <td className="px-5 py-3">
                      <p className="font-semibold text-on-surface">{row.name}</p>
                      {(row.phone || row.email) && (
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {[row.phone, row.email].filter(Boolean).join(" · ")}
                        </p>
                      )}
                    </td>

                    {/* Người đăng ký */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-on-surface">{row.booking.customerName}</p>
                        {row.booking.numPeople > 1 && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0">
                            <span className="material-symbols-outlined" style={{ fontSize: 11 }}>group</span>
                            {row.booking.numPeople}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">{row.booking.phone} · {row.booking.email}</p>
                    </td>

                    <td className="px-5 py-3">
                      {onViewBooking ? (
                        <button type="button" onClick={() => onViewBooking(row.booking.id)} className="font-mono text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg hover:bg-primary/20 transition-colors font-bold">
                          {row.booking.bookingCode}
                        </button>
                      ) : (
                        <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded-lg text-on-surface">
                          {row.booking.bookingCode}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">
                      {fmtDateTime(row.booking.createdAt)}
                    </td>

                    <td className="px-5 py-3">
                      <AttendedToggle
                        attended={row.booking.attended}
                        onChange={(v) => onToggleAttended(row.booking.id, v)}
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
