"use client";

import { useState, useEffect } from "react";
import { mockBookings, mockSaleStaff, Booking, BookingStatus, fmt } from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";
import Pagination from "../Pagination";
import BookingDetailView from "./BookingDetailView";

const PAGE_SIZE = 20;

const STATUS_FILTERS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "cancelled", label: "Đã hủy" },
];

type Props = {
  deepLinkBookingId?: string | null;
  deepLinkStatusFilter?: BookingStatus | null;
  onDeepLinkBookingConsumed?: () => void;
  onDeepLinkStatusConsumed?: () => void;
  onNavigateToCustomer?: (customerId: string) => void;
  onNavigateToTour?: (tourId: string) => void;
  onNavigateToSchedule?: (scheduleId: string) => void;
  canManualAssign?: boolean;
};

export default function BookingsTab({ deepLinkBookingId, deepLinkStatusFilter, onDeepLinkBookingConsumed, onDeepLinkStatusConsumed, onNavigateToCustomer, onNavigateToTour, onNavigateToSchedule, canManualAssign }: Props = {}) {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!deepLinkBookingId) return;
    const timeoutId = window.setTimeout(() => {
      setSelectedId(deepLinkBookingId);
      onDeepLinkBookingConsumed?.();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [deepLinkBookingId, onDeepLinkBookingConsumed]);

  useEffect(() => {
    if (!deepLinkStatusFilter) return;
    setStatusFilter(deepLinkStatusFilter);
    setPage(1);
    onDeepLinkStatusConsumed?.();
  }, [deepLinkStatusFilter, onDeepLinkStatusConsumed]);

  const selected = bookings.find((b) => b.id === selectedId) ?? null;

  function updateStatus(id: string, status: BookingStatus, extra?: Partial<Booking>) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status, ...extra } : b)));
  }

  if (selected) {
    return (
      <BookingDetailView
        booking={selected}
        onBack={() => setSelectedId(null)}
        onUpdateStatus={updateStatus}
        onViewCustomer={onNavigateToCustomer}
        onViewTour={onNavigateToTour}
        onViewSchedule={onNavigateToSchedule}
        canManualAssign={canManualAssign}
      />
    );
  }

  const filtered = bookings.filter((b) => {
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.customerName.toLowerCase().includes(q) ||
      b.bookingCode.toLowerCase().includes(q) ||
      b.tourName.toLowerCase().includes(q) ||
      b.phone.includes(q);
    return matchStatus && matchSearch;
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 16 }}>search</span>
          <input
            type="text"
            placeholder="Tìm tên, mã đặt chỗ, SĐT..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => {
            const pendingBadge = f.value === "pending" ? bookings.filter((b) => b.status === "pending").length : 0;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => { setStatusFilter(f.value); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors select-none ${
                  statusFilter === f.value
                    ? "bg-primary text-white"
                    : "bg-white border border-outline-variant text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {f.label}
                {pendingBadge > 0 && (
                  <span className={`min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    statusFilter === f.value ? "bg-white text-primary" : "bg-error text-white"
                  }`}>
                    {pendingBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/30">
                <tr>
                  {["Mã đặt chỗ", "Người đăng ký", "Chuyến đi", "Phụ trách", "Người", "Tổng tiền", "Thanh toán", "Trạng thái", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 select-none">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-sm text-on-surface-variant">Không có kết quả</td>
                  </tr>
                ) : (
                  paged.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedId(b.id)}
                      className="hover:bg-surface-container-low cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-primary">{b.bookingCode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-on-surface whitespace-nowrap">{b.customerName}</p>
                        <p className="text-sm text-on-surface-variant">{b.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {b.tourType && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap ${b.tourType === "dltn" ? "bg-solar-orange/15 text-solar-orange" : "bg-deep-amethyst/15 text-deep-amethyst"}`}>
                              {b.tourType === "dltn" ? "DLTN" : "Trại hè"}
                            </span>
                          )}
                          <p className="text-on-surface max-w-[180px] truncate font-medium">{b.tourName}</p>
                        </div>
                        <p className="text-xs text-on-surface-variant whitespace-nowrap">{b.scheduleLabel}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {(() => {
                          const sale = b.assignedSaleId ? mockSaleStaff.find((s) => s.id === b.assignedSaleId) : null;
                          if (!sale) return <span className="text-xs text-on-surface-variant/50 italic">Chưa phân công</span>;
                          return (
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
                                {sale.name.split(" ").pop()?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-on-surface leading-none">{sale.name.split(" ").slice(-2).join(" ")}</p>
                                {b.assignedManually && (
                                  <p className="text-[10px] text-primary/60 leading-none mt-0.5">Thủ công</p>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">{b.numPeople}</td>
                      <td className="px-4 py-3 whitespace-nowrap font-semibold text-primary">{fmt(b.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-on-surface-variant whitespace-nowrap">
                          {b.paymentMethod === "transfer" ? "Chuyển khoản" : "Văn phòng"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={b.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>chevron_right</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          <div className="px-4 py-3 border-t border-outline-variant/20 text-xs text-on-surface-variant">
            {filtered.length} / {bookings.length} đơn
          </div>
      </div>
    </div>
  );
}
