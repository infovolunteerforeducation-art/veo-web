"use client";

import { useState } from "react";
import { Customer, Booking, fmt, fmtDate, fmtDateTime } from "@/lib/crm-data";

function CopyField({ icon, value }: { icon: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <span className="flex items-center gap-1 text-sm text-on-surface-variant group">
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{icon}</span>
      {value}
      <button
        type="button"
        onClick={copy}
        title="Copy"
        className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
      >
        <span className={`material-symbols-outlined transition-colors ${copied ? "text-green-600" : "text-on-surface-variant hover:text-primary"}`} style={{ fontSize: 13 }}>
          {copied ? "check" : "content_copy"}
        </span>
      </button>
    </span>
  );
}

type Props = {
  customer: Customer;
  allBookings: Booking[];
  onBack: () => void;
  onViewTour?: (tourId: string) => void;
  onViewSchedule?: (scheduleId: string) => void;
};

function AttendedBadge({ attended }: { attended?: boolean | null }) {
  if (attended === true)  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[11px] font-semibold"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>check_circle</span>Tham gia</span>;
  if (attended === false) return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[11px] font-semibold"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>cancel</span>Vắng mặt</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-semibold"><span className="material-symbols-outlined" style={{ fontSize: 12 }}>help</span>Chưa rõ</span>;
}

function PaymentBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    paid:      { label: "Đã thanh toán", cls: "bg-green-100 text-green-700" },
    pending:   { label: "Chờ xử lý",     cls: "bg-yellow-100 text-yellow-700" },
    cancelled: { label: "Đã hủy",        cls: "bg-red-100 text-red-600" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-surface-container text-on-surface-variant" };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${cls}`}>{label}</span>;
}

export default function CustomerDetailView({ customer, allBookings, onBack, onViewTour, onViewSchedule }: Props) {
  // All bookings this person created/paid for
  const registrantBookings = allBookings
    .filter((b) => b.customerId === customer.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // Bookings where this person personally participated (in their own booking)
  const selfParticipatingBookings = registrantBookings.filter((b) => {
    if (!b.participants || b.participants.length === 0) return true;
    return b.participants.some((p) => p.email === customer.email);
  });

  // Bookings registered by someone else but customer appears as participant
  const externalParticipantBookings = allBookings
    .filter(
      (b) =>
        b.customerId !== customer.id &&
        b.participants?.some((p) => p.email === customer.email || p.name === customer.name)
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const participationHistory = [...selfParticipatingBookings, ...externalParticipantBookings].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt)
  );

  const reservedBookings = registrantBookings.filter((b) => b.coordinationStatus === "absent_reserved");
  const reservedAmount = reservedBookings.reduce((s, b) => s + b.totalAmount, 0);
  const attendedCount = participationHistory.filter((b) => b.attended === true).length;

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
          Quay lại danh sách khách hàng
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
            {customer.name.split(" ").pop()?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-on-surface">{customer.name}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
              <CopyField icon="phone" value={customer.phone} />
              <CopyField icon="mail" value={customer.email} />
              <span className="flex items-center gap-1 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_today</span>
                Tham gia từ {fmtDate(customer.joinedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-outline-variant/30 p-4">
          <p className="text-xs text-on-surface-variant font-medium">Lượt đăng ký</p>
          <p className="text-2xl font-bold text-primary mt-1">{registrantBookings.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-outline-variant/30 p-4">
          <p className="text-xs text-on-surface-variant font-medium">Chuyến tham gia</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{attendedCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-outline-variant/30 p-4">
          <p className="text-xs text-on-surface-variant font-medium">Tổng chi tiêu</p>
          <p className="text-xl font-bold text-solar-orange mt-1">{fmt(customer.totalSpent)}</p>
        </div>
        {reservedAmount > 0 ? (
          <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-4">
            <p className="text-xs text-yellow-700 font-medium">Tiền bảo lưu</p>
            <p className="text-xl font-bold text-yellow-700 mt-1">{fmt(reservedAmount)}</p>
            {reservedBookings[0]?.reservationNote && (
              <p className="text-[10px] text-yellow-600 mt-1 leading-tight">{reservedBookings[0].reservationNote}</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-4">
            <p className="text-xs text-on-surface-variant font-medium">Tiền bảo lưu</p>
            <p className="text-2xl font-bold text-on-surface-variant mt-1">—</p>
          </div>
        )}
      </div>

      {/* Registration history */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <h3 className="text-base font-bold text-on-surface">Lịch sử đăng ký</h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{registrantBookings.length} lượt đặt chỗ</p>
        </div>

        {registrantBookings.length === 0 ? (
          <div className="text-center py-10 text-sm text-on-surface-variant">Chưa có lượt đăng ký nào</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Chương trình</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Lịch chuyến</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Mã đặt</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Số người</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tổng tiền</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Đăng ký lúc</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Thanh toán</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {registrantBookings.map((b, i) => {
                  const isReserved = b.coordinationStatus === "absent_reserved";
                  return (
                    <tr key={b.id} className={`hover:bg-surface-container-low/50 transition-colors ${isReserved ? "bg-yellow-50/50" : ""}`}>
                      <td className="px-5 py-3 text-xs text-on-surface-variant">{i + 1}</td>
                      <td className="px-5 py-3 font-semibold text-on-surface max-w-[180px]">
                        {onViewTour ? (
                          <button type="button" onClick={() => onViewTour(b.tourId)} className="block truncate text-primary hover:underline text-left font-semibold">{b.tourName}</button>
                        ) : (
                          <span className="block truncate">{b.tourName}</span>
                        )}
                        {isReserved && b.reservationNote && (
                          <span className="text-[10px] text-yellow-600 font-normal">{b.reservationNote}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {onViewSchedule ? (
                          <button type="button" onClick={() => onViewSchedule(b.scheduleId)} className="text-xs text-primary hover:underline">{b.scheduleLabel}</button>
                        ) : (
                          <span className="text-xs text-on-surface-variant">{b.scheduleLabel}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs font-mono text-on-surface-variant whitespace-nowrap">{b.bookingCode}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-on-surface">{b.numPeople} người</span>
                          {b.numPeople > 1 && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0">
                              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>group</span>
                              {b.numPeople}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-semibold text-primary whitespace-nowrap">{fmt(b.totalAmount)}</td>
                      <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">{fmtDateTime(b.createdAt)}</td>
                      <td className="px-5 py-3"><PaymentBadge status={b.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Participation history */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline-variant/20">
          <h3 className="text-base font-bold text-on-surface">Lịch sử tham gia</h3>
          <p className="text-sm text-on-surface-variant mt-0.5">{participationHistory.length} chuyến đi</p>
        </div>

        {participationHistory.length === 0 ? (
          <div className="text-center py-10 text-sm text-on-surface-variant">Chưa có lịch sử tham gia</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">#</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Chương trình</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Lịch chuyến</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Người đăng ký</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Mã đặt</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Đăng ký lúc</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {participationHistory.map((b, i) => {
                  const isSelf = b.customerId === customer.id;
                  const isReserved = b.coordinationStatus === "absent_reserved";
                  return (
                    <tr key={b.id} className={`hover:bg-surface-container-low/50 transition-colors ${isReserved ? "bg-yellow-50/50" : ""}`}>
                      <td className="px-5 py-3 text-xs text-on-surface-variant">{i + 1}</td>
                      <td className="px-5 py-3 font-semibold text-on-surface max-w-[180px]">
                        {onViewTour ? (
                          <button type="button" onClick={() => onViewTour(b.tourId)} className="block truncate text-primary hover:underline text-left font-semibold">{b.tourName}</button>
                        ) : (
                          <span className="block truncate">{b.tourName}</span>
                        )}
                        {isReserved && b.reservationNote && (
                          <span className="text-[10px] text-yellow-600 font-normal">{b.reservationNote}</span>
                        )}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        {onViewSchedule ? (
                          <button type="button" onClick={() => onViewSchedule(b.scheduleId)} className="text-xs text-primary hover:underline">{b.scheduleLabel}</button>
                        ) : (
                          <span className="text-xs text-on-surface-variant">{b.scheduleLabel}</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        {isSelf ? (
                          <span className="text-xs text-on-surface-variant italic">Tự đăng ký</span>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-on-surface">{b.customerName}</p>
                            <p className="text-xs text-on-surface-variant">{b.phone}</p>
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs font-mono text-on-surface-variant whitespace-nowrap">{b.bookingCode}</td>
                      <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">{fmtDateTime(b.createdAt)}</td>
                      <td className="px-5 py-3"><AttendedBadge attended={b.attended} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
