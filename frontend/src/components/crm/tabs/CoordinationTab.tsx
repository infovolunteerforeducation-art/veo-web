"use client";

import { useState, useMemo } from "react";
import { Booking, CoordinationStatus, mockBookings, mockTours, fmt } from "@/lib/crm-data";
import SelectInput from "../SelectInput";

type EnrichedBooking = Booking & {
  _tourTitle: string;
  _isoDate: string;
  _coordStatus: CoordinationStatus;
};

const COORD_META: Record<CoordinationStatus, { label: string; icon: string; activeClass: string; badgeClass: string }> = {
  pending:         { label: "Chờ xác nhận", icon: "pending",      activeClass: "bg-surface-container text-on-surface border-outline-variant",          badgeClass: "bg-surface-container text-on-surface-variant" },
  attended:        { label: "Đã tham gia",  icon: "check_circle", activeClass: "bg-green-100 text-green-700 border-green-300",                          badgeClass: "bg-green-100 text-green-700" },
  absent_reserved: { label: "Bảo lưu",      icon: "bookmark",     activeClass: "bg-blue-100 text-blue-700 border-blue-300",                             badgeClass: "bg-blue-100 text-blue-700" },
  absent_refunded: { label: "Hoàn tiền",    icon: "currency_exchange", activeClass: "bg-orange-100 text-orange-700 border-orange-300",                  badgeClass: "bg-orange-100 text-orange-700" },
};

const ACTION_STATUSES: CoordinationStatus[] = ["attended", "absent_reserved", "absent_refunded"];

export default function CoordinationTab() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [tourFilter, setTourFilter] = useState("");
  const [scheduleFilter, setScheduleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<CoordinationStatus | "all">("all");
  const [reserveTarget, setReserveTarget] = useState<EnrichedBooking | null>(null);
  const [reserveNote, setReserveNote] = useState("");

  // Enrich paid bookings
  const paidBookings = useMemo<EnrichedBooking[]>(() =>
    bookings
      .filter((b) => b.status === "paid")
      .map((b) => {
        const tour = mockTours.find((t) => t.id === b.tourId);
        const sched = tour?.schedules.find((s) => s.id === b.scheduleId);
        return {
          ...b,
          _tourTitle: tour?.title ?? b.tourName,
          _isoDate: sched?.isoDate ?? "",
          _coordStatus: (b.coordinationStatus ?? "pending") as CoordinationStatus,
        };
      })
      .sort((a, b) => b._isoDate.localeCompare(a._isoDate)),
    [bookings]
  );

  const tourOptions = useMemo(() => {
    const seen = new Map<string, string>();
    paidBookings.forEach((b) => seen.set(b.tourId, b._tourTitle));
    return [
      { value: "", label: "Tất cả chương trình" },
      ...[...seen.entries()].map(([v, l]) => ({ value: v, label: l })),
    ];
  }, [paidBookings]);

  const scheduleOptions = useMemo(() => {
    const source = tourFilter ? paidBookings.filter((b) => b.tourId === tourFilter) : paidBookings;
    const seen = new Map<string, string>();
    source.forEach((b) => seen.set(b.scheduleId, b.scheduleLabel));
    return [
      { value: "", label: "Tất cả lịch chuyến" },
      ...[...seen.entries()].map(([v, l]) => ({ value: v, label: l })),
    ];
  }, [paidBookings, tourFilter]);

  const filtered = useMemo(() =>
    paidBookings.filter((b) => {
      const matchTour  = !tourFilter     || b.tourId     === tourFilter;
      const matchSched = !scheduleFilter || b.scheduleId === scheduleFilter;
      const matchStat  = statusFilter === "all" || b._coordStatus === statusFilter;
      return matchTour && matchSched && matchStat;
    }),
    [paidBookings, tourFilter, scheduleFilter, statusFilter]
  );

  const stats = useMemo(() => ({
    pending:  paidBookings.filter((b) => b._coordStatus === "pending").length,
    attended: paidBookings.filter((b) => b._coordStatus === "attended").length,
    reserved: paidBookings.filter((b) => b._coordStatus === "absent_reserved").length,
    refunded: paidBookings.filter((b) => b._coordStatus === "absent_refunded").length,
    reservedAmount: paidBookings
      .filter((b) => b._coordStatus === "absent_reserved")
      .reduce((s, b) => s + b.totalAmount, 0),
  }), [paidBookings]);

  function updateCoord(bookingId: string, status: CoordinationStatus | undefined, note?: string) {
    setBookings((prev) => prev.map((b) =>
      b.id === bookingId
        ? {
            ...b,
            coordinationStatus: status,
            reservationNote: status === "absent_reserved" ? (note ?? b.reservationNote) : undefined,
          }
        : b
    ));
  }

  function handleAction(booking: EnrichedBooking, action: CoordinationStatus) {
    if (booking._coordStatus === action) {
      updateCoord(booking.id, undefined);
      return;
    }
    if (action === "absent_reserved") {
      setReserveTarget(booking);
      setReserveNote(booking.reservationNote ?? "");
      return;
    }
    updateCoord(booking.id, action);
  }

  function confirmReserve() {
    if (!reserveTarget) return;
    updateCoord(reserveTarget.id, "absent_reserved", reserveNote);
    setReserveTarget(null);
    setReserveNote("");
  }

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          { key: "pending",  label: "Chờ xác nhận", value: stats.pending,  sub: "chưa điều phối",         valClass: "text-on-surface-variant", bg: "" },
          { key: "attended", label: "Đã tham gia",  value: stats.attended, sub: "xác nhận có mặt",        valClass: "text-green-600",          bg: "bg-green-50/50" },
          { key: "reserved", label: "Bảo lưu",      value: stats.reserved, sub: fmt(stats.reservedAmount),valClass: "text-blue-600",           bg: "bg-blue-50/50" },
          { key: "refunded", label: "Hoàn tiền",    value: stats.refunded, sub: "đã xử lý hoàn",         valClass: "text-orange-600",         bg: "bg-orange-50/50" },
        ] as const).map((s) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setStatusFilter(statusFilter === s.key ? "all" : s.key as CoordinationStatus)}
            className={`${s.bg} bg-white rounded-2xl border transition-colors p-4 text-left ${
              statusFilter === s.key ? "border-primary ring-1 ring-primary/20" : "border-outline-variant/30 hover:border-outline-variant"
            }`}
          >
            <p className="text-xs text-on-surface-variant font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.valClass}`}>{s.value}</p>
            <p className="text-xs text-on-surface-variant mt-0.5">{s.sub}</p>
          </button>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        {/* Filter bar */}
        <div className="px-5 py-4 border-b border-outline-variant/20 flex flex-wrap gap-3 items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-on-surface">Danh sách điều phối</h2>
            <p className="text-sm text-on-surface-variant mt-0.5">{filtered.length} đơn đã thanh toán</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SelectInput
              value={tourFilter}
              onChange={(v) => { setTourFilter(v); setScheduleFilter(""); }}
              options={tourOptions}
              className="px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white"
            />
            <SelectInput
              value={scheduleFilter}
              onChange={setScheduleFilter}
              options={scheduleOptions}
              className="px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white"
            />
            {(tourFilter || scheduleFilter || statusFilter !== "all") && (
              <button
                type="button"
                onClick={() => { setTourFilter(""); setScheduleFilter(""); setStatusFilter("all"); }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-outline-variant text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                Bỏ lọc
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-on-surface-variant">Không có đơn nào phù hợp</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Người đăng ký</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Chuyến đi</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Người</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Số tiền</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Điều phối</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filtered.map((b, i) => (
                  <tr key={b.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="px-5 py-4 text-xs text-on-surface-variant">{i + 1}</td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-on-surface">{b.customerName}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{b.phone}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-on-surface text-xs leading-snug max-w-[180px] line-clamp-1">{b._tourTitle}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{b.scheduleLabel}</p>
                    </td>

                    <td className="px-5 py-4 text-center font-semibold text-on-surface">{b.numPeople}</td>

                    <td className="px-5 py-4 text-right">
                      <p className="font-semibold text-on-surface whitespace-nowrap">{fmt(b.totalAmount)}</p>
                      {b._coordStatus === "absent_reserved" && (
                        <p className="text-[10px] text-blue-600 mt-0.5">Đang bảo lưu</p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        {/* Status badge + reset */}
                        {b._coordStatus !== "pending" && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${COORD_META[b._coordStatus].badgeClass}`}>
                              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>{COORD_META[b._coordStatus].icon}</span>
                              {COORD_META[b._coordStatus].label}
                            </span>
                            {b._coordStatus === "absent_reserved" && b.reservationNote && (
                              <span className="text-[10px] text-blue-600 italic">{b.reservationNote}</span>
                            )}
                            <button
                              type="button"
                              onClick={() => updateCoord(b.id, undefined)}
                              title="Bỏ xác nhận"
                              className="text-on-surface-variant hover:text-on-surface transition-colors"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>restart_alt</span>
                            </button>
                          </div>
                        )}
                        {/* Action buttons */}
                        <div className="flex items-center gap-1 flex-wrap">
                          {ACTION_STATUSES.map((action) => {
                            const meta = COORD_META[action];
                            const isActive = b._coordStatus === action;
                            return (
                              <button
                                key={action}
                                type="button"
                                onClick={() => handleAction(b, action)}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                                  isActive
                                    ? meta.activeClass
                                    : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                                }`}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{meta.icon}</span>
                                {meta.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reserve modal */}
      {reserveTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-on-surface">Bảo lưu số tiền</h3>
              <button type="button" onClick={() => setReserveTarget(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            <div className="bg-blue-50 rounded-xl p-3 mb-4 space-y-1">
              <p className="text-sm font-semibold text-on-surface">{reserveTarget.customerName}</p>
              <p className="text-xs text-on-surface-variant">{reserveTarget.scheduleLabel} · {reserveTarget._tourTitle}</p>
              <p className="text-sm font-bold text-blue-700">{fmt(reserveTarget.totalAmount)} sẽ được bảo lưu</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">
                Ghi chú bảo lưu <span className="font-normal">(tuỳ chọn)</span>
              </label>
              <textarea
                rows={3}
                placeholder="VD: Bảo lưu cho chuyến Sapa tháng 12/2025..."
                value={reserveNote}
                onChange={(e) => setReserveNote(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => setReserveTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmReserve}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Xác nhận bảo lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
