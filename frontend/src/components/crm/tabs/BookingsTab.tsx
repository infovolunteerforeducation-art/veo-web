"use client";

import { useState } from "react";
import { mockBookings, Booking, BookingStatus, fmt } from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";
import Pagination from "../Pagination";

const PAGE_SIZE = 20;

const STATUS_FILTERS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ xác nhận" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "cancelled", label: "Đã hủy" },
];

export default function BookingsTab() {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [page, setPage] = useState(1);

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

  function updateStatus(id: string, status: BookingStatus) {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : s);
  }

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

      <div className="flex gap-4">
        {/* Table */}
        <div className="flex-1 bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/30">
                <tr>
                  {["Mã đặt chỗ", "Người đăng ký", "Tour", "Lịch khởi hành", "Người", "Tổng tiền", "Thanh toán", "Trạng thái", ""].map((h) => (
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
                      onClick={() => setSelected(b)}
                      className={`hover:bg-surface-container-low cursor-pointer transition-colors ${selected?.id === b.id ? "bg-primary/5" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-primary">{b.bookingCode}</span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-on-surface whitespace-nowrap">{b.customerName}</p>
                        <p className="text-sm text-on-surface-variant">{b.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-on-surface max-w-[160px] truncate">{b.tourName}</p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-on-surface-variant text-sm">{b.scheduleLabel}</td>
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
                        <button type="button" className="text-on-surface-variant hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); setSelected(b); }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                        </button>
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

        {/* Detail panel */}
        {selected && (
          <div className="w-72 shrink-0 bg-white rounded-2xl border border-outline-variant/30 p-5 self-start sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-on-surface">Chi tiết đơn</h3>
              <button type="button" onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-surface-container-low rounded-xl">
                <p className="font-mono font-bold text-primary text-sm">{selected.bookingCode}</p>
                <p className="text-on-surface-variant mt-0.5">
                  {new Date(selected.createdAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              {[
                { label: "Người đăng ký", value: selected.customerName },
                { label: "Điện thoại", value: selected.phone },
                { label: "Email", value: selected.email },
                { label: "Tour", value: selected.tourName },
                { label: "Lịch", value: selected.scheduleLabel },
                { label: "Số người", value: `${selected.numPeople} người` },
                { label: "Thanh toán", value: selected.paymentMethod === "transfer" ? "Chuyển khoản" : "Tại văn phòng" },
                { label: "Tổng tiền", value: fmt(selected.totalAmount) },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <span className="text-on-surface-variant">{row.label}</span>
                  <span className="font-semibold text-right">{row.value}</span>
                </div>
              ))}

              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant">Trạng thái</span>
                <StatusBadge status={selected.status} />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-outline-variant/20 space-y-2">
              <p className="text-sm font-semibold text-on-surface-variant mb-2">Cập nhật trạng thái</p>
              <div className="grid grid-cols-2 gap-2">
                {(["pending", "paid", "cancelled"] as BookingStatus[]).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(selected.id, s)}
                    disabled={selected.status === s}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      selected.status === s ? "bg-primary/10 text-primary" : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                    }`}
                  >
                    <StatusBadge status={s} small />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
