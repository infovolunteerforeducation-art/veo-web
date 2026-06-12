"use client";

import { useState, useMemo } from "react";
import { mockCustomers, mockBookings, Customer, fmt, fmtDate } from "@/lib/crm-data";
import Pagination from "../Pagination";
import CustomerDetailView from "./CustomerDetailView";

const PAGE_SIZE = 20;

type SortField = "totalTrips" | "totalSpent" | "joinedAt" | "lastTourDate";
type SortDir = "asc" | "desc";

function SortBtn({
  field, label, current, dir, onClick,
}: {
  field: SortField; label: string; current: SortField; dir: SortDir; onClick: () => void;
}) {
  const active = field === current;
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-0.5 group text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
    >
      <span className="group-hover:text-on-surface">{label}</span>
      <span
        className={`material-symbols-outlined transition-colors ${active ? "text-primary" : "text-outline opacity-50"}`}
        style={{ fontSize: 14 }}
      >
        {active ? (dir === "asc" ? "arrow_upward" : "arrow_downward") : "unfold_more"}
      </span>
    </button>
  );
}

type Props = {
  onNavigateToTour?: (tourId: string) => void;
  onNavigateToSchedule?: (scheduleId: string) => void;
  onNavigateToBooking?: (bookingId: string) => void;
};

export default function CustomersTab({ onNavigateToTour, onNavigateToSchedule, onNavigateToBooking }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("lastTourDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
    setPage(1);
  }

  const filtered = mockCustomers.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortField === "totalTrips")   cmp = a.totalTrips - b.totalTrips;
      if (sortField === "totalSpent")   cmp = a.totalSpent - b.totalSpent;
      if (sortField === "joinedAt")     cmp = a.joinedAt.localeCompare(b.joinedAt);
      if (sortField === "lastTourDate") cmp = a.lastTourDate.localeCompare(b.lastTourDate);
      return sortDir === "asc" ? cmp : -cmp;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, sortField, sortDir]);

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (selected) {
    return (
      <CustomerDetailView
        customer={selected}
        allBookings={mockBookings}
        onBack={() => setSelected(null)}
        onViewTour={onNavigateToTour}
        onViewSchedule={onNavigateToSchedule}
        onViewBooking={onNavigateToBooking}
      />
    );
  }

  return (
    <div className="space-y-4">
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
                <th className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">Điện thoại</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">Email</th>
                <th className="px-4 py-3 whitespace-nowrap">
                  <SortBtn field="totalTrips" label="Số chuyến" current={sortField} dir={sortDir} onClick={() => handleSort("totalTrips")} />
                </th>
                <th className="px-4 py-3 whitespace-nowrap">
                  <SortBtn field="totalSpent" label="Tổng chi tiêu" current={sortField} dir={sortDir} onClick={() => handleSort("totalSpent")} />
                </th>
                <th className="px-4 py-3 whitespace-nowrap">
                  <SortBtn field="joinedAt" label="Ngày bắt đầu tham gia" current={sortField} dir={sortDir} onClick={() => handleSort("joinedAt")} />
                </th>
                <th className="px-4 py-3 whitespace-nowrap">
                  <SortBtn field="lastTourDate" label="Tham gia gần nhất" current={sortField} dir={sortDir} onClick={() => handleSort("lastTourDate")} />
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 select-none">
              {paged.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="hover:bg-surface-container-low cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                        {c.name.split(" ").pop()?.charAt(0)}
                      </div>
                      <span className="font-semibold text-primary hover:underline whitespace-nowrap">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-on-surface-variant">{c.phone}</td>
                  <td className="px-4 py-3 text-on-surface-variant">{c.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-primary">{c.totalTrips}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-primary whitespace-nowrap">{fmt(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap text-sm">{fmtDate(c.joinedAt)}</td>
                  <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap text-sm">{fmtDate(c.lastTourDate)}</td>
                  <td className="px-4 py-3">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>chevron_right</span>
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
  );
}
