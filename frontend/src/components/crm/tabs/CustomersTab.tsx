"use client";

import { useState } from "react";
import { mockCustomers, mockBookings, Customer, fmt } from "@/lib/crm-data";
import Pagination from "../Pagination";

const PAGE_SIZE = 20;

export default function CustomersTab() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);

  const filtered = mockCustomers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const customerBookings = selected
    ? mockBookings.filter((b) => b.customerId === selected.id)
    : [];

  return (
    <div className="flex gap-4">
      {/* Table */}
      <div className="flex-1 space-y-4">
        <div className="relative max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 16 }}>search</span>
          <input
            type="text"
            placeholder="Tìm tên, SĐT, email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-container-low border-b border-outline-variant/30">
                <tr>
                  {["Khách hàng", "Điện thoại", "Email", "Số chuyến", "Tổng chi tiêu", "Tour gần nhất", "Ngày tham gia", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 select-none">
                {paged.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`hover:bg-surface-container-low cursor-pointer transition-colors ${selected?.id === c.id ? "bg-primary/5" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                          {c.name.split(" ").pop()?.charAt(0)}
                        </div>
                        <span className="font-semibold text-on-surface whitespace-nowrap">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.phone}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{c.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-bold text-primary">{c.totalTrips}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-primary whitespace-nowrap">{fmt(c.totalSpent)}</td>
                    <td className="px-4 py-3 text-on-surface-variant max-w-[160px] truncate">{c.lastTour}</td>
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap text-sm">{c.joinedAt}</td>
                    <td className="px-4 py-3">
                      <button type="button" onClick={(e) => { e.stopPropagation(); setSelected(c); }} className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
          <div className="px-4 py-3 border-t border-outline-variant/20 text-sm text-on-surface-variant">
            {filtered.length} khách hàng
          </div>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-72 shrink-0 space-y-4 self-start sticky top-0">
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-on-surface">Hồ sơ khách hàng</h3>
              <button type="button" onClick={() => setSelected(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>close</span>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                {selected.name.split(" ").pop()?.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-on-surface">{selected.name}</p>
                <p className="text-sm text-on-surface-variant">Tham gia: {selected.joinedAt}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Số chuyến", value: selected.totalTrips, icon: "hiking" },
                { label: "Tổng chi", value: fmt(selected.totalSpent), icon: "payments" },
              ].map((s) => (
                <div key={s.label} className="bg-surface-container-low rounded-xl p-3 text-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>{s.icon}</span>
                  <p className="text-sm font-bold text-on-surface mt-1">{s.value}</p>
                  <p className="text-[10px] text-on-surface-variant">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm">
              {[
                { label: "Điện thoại", value: selected.phone },
                { label: "Email", value: selected.email },
                { label: "Tour gần nhất", value: selected.lastTour },
                { label: "Ngày đi gần nhất", value: selected.lastTourDate },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <span className="text-on-surface-variant shrink-0">{row.label}</span>
                  <span className="font-semibold text-right">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking history */}
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
            <h3 className="text-base font-bold text-on-surface mb-3">Lịch sử đặt chỗ</h3>
            {customerBookings.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">Chưa có đặt chỗ</p>
            ) : (
              <div className="space-y-2">
                {customerBookings.map((b) => (
                  <div key={b.id} className="p-3 bg-surface-container-low rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold text-primary">{b.bookingCode}</span>
                      <StatusBadge status={b.status} />
                    </div>
                    <p className="text-sm font-semibold text-on-surface truncate">{b.tourName}</p>
                    <p className="text-[10px] text-on-surface-variant">{b.scheduleLabel} · {b.numPeople} người · {fmt(b.totalAmount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:   { label: "Chờ xác nhận", cls: "bg-solar-orange/15 text-solar-orange" },
    confirmed: { label: "Chờ xác nhận", cls: "bg-solar-orange/15 text-solar-orange" },
    paid:      { label: "Đã thanh toán", cls: "bg-green-100 text-green-700" },
    cancelled: { label: "Đã hủy",       cls: "bg-error/10 text-error" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-surface-container text-on-surface-variant" };
  return <span className={`text-[10px] px-1.5 py-0.5 font-semibold rounded-full ${cls}`}>{label}</span>;
}
