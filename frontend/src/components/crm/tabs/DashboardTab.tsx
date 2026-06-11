"use client";

import { useState } from "react";
import { mockBookings, mockWeeklyStats, mockDailyStats, mockMonthlyStats, fmt } from "@/lib/crm-data";

type Period = "day" | "week" | "month";

const todayStr = "2025-10-16";
const todayBookings = mockBookings.filter((b) => b.createdAt.startsWith(todayStr));
const pendingBookings = mockBookings.filter((b) => b.status === "pending");
const paidBookings = mockBookings.filter((b) => b.status === "paid");
const todayRevenue = mockBookings
  .filter((b) => b.createdAt.startsWith(todayStr) && b.status !== "cancelled")
  .reduce((s, b) => s + b.totalAmount, 0);

const KPI_CARDS = [
  { label: "Đăng ký mới hôm nay", value: todayBookings.length, unit: "lượt", icon: "add_circle", color: "bg-primary/10 text-primary", trend: "+2 so với hôm qua", trendUp: true },
  { label: "Chờ xác nhận", value: pendingBookings.length, unit: "đơn", icon: "pending_actions", color: "bg-solar-orange/10 text-solar-orange", trend: "Cần xác nhận", trendUp: false },
  { label: "Đã thanh toán", value: paidBookings.length, unit: "đơn", icon: "check_circle", color: "bg-green-100 text-green-700", trend: "Trong tháng này", trendUp: true },
  { label: "Doanh thu hôm nay", value: fmt(todayRevenue), unit: "", icon: "payments", color: "bg-blue-100 text-blue-700", trend: "+18% so với hôm qua", trendUp: true },
];

function periodStats(period: Period) {
  if (period === "day") return mockDailyStats.map((d) => ({ label: d.day, bookings: d.bookings, revenue: d.revenue }));
  if (period === "week") return mockWeeklyStats.map((w) => ({ label: w.week.split(" ")[1], bookings: w.bookings, revenue: w.revenue }));
  return mockMonthlyStats.map((m) => ({ label: m.month, bookings: m.bookings, revenue: m.revenue }));
}

function periodChartTitle(period: Period) {
  if (period === "day") return "Số lượng đăng ký theo ngày";
  if (period === "week") return "Số lượng đăng ký theo tuần";
  return "Số lượng đăng ký theo tháng";
}
function periodChartSub(period: Period) {
  if (period === "day") return "7 ngày gần nhất";
  if (period === "week") return "7 tuần gần nhất";
  return "Năm 2025";
}
function periodStatLabels(period: Period) {
  if (period === "day") return ["Doanh thu 7 ngày", "Đơn 7 ngày"];
  if (period === "week") return ["Doanh thu 7 tuần", "Đơn 7 tuần"];
  return ["Doanh thu năm nay", "Đơn năm nay"];
}

const PERIOD_TABS: { value: Period; label: string }[] = [
  { value: "day", label: "Ngày" },
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
];

export default function DashboardTab() {
  const [period, setPeriod] = useState<Period>("week");

  const stats = periodStats(period);
  const maxBookings = Math.max(...stats.map((s) => s.bookings), 1);
  const totalRevenue = stats.reduce((s, d) => s + d.revenue, 0);
  const totalBookings = stats.reduce((s, d) => s + d.bookings, 0);
  const [revLabel, bkLabel] = periodStatLabels(period);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-outline-variant/30 p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm font-semibold text-on-surface-variant leading-snug max-w-[70%]">{card.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{card.icon}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-on-surface mb-1">
              {card.value}{card.unit && <span className="text-sm font-normal text-on-surface-variant ml-1">{card.unit}</span>}
            </p>
            <p className={`text-sm flex items-center gap-1 ${card.trendUp ? "text-green-600" : "text-solar-orange"}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{card.trendUp ? "trending_up" : "info"}</span>
              {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + recent bookings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-outline-variant/30 p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-on-surface">{periodChartTitle(period)}</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-on-surface-variant">{periodChartSub(period)}</span>
              {/* Period toggle */}
              <div className="flex gap-1">
                {PERIOD_TABS.map((t) => (
                  <button key={t.value} type="button" onClick={() => setPeriod(t.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors select-none ${
                      period === t.value
                        ? "bg-primary text-white"
                        : "bg-white border border-outline-variant text-on-surface-variant hover:border-primary/50"
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bars */}
          <div className="flex items-end gap-2 h-48">
            {stats.map((s, i) => {
              const heightPct = Math.round((s.bookings / maxBookings) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">{s.bookings}</span>
                  <div className="w-full relative flex items-end justify-center" style={{ height: 160 }}>
                    <div className="w-full rounded-t-lg bg-primary/20 group-hover:bg-primary transition-colors" style={{ height: `${heightPct}%` }} />
                  </div>
                  <span className="text-[9px] text-on-surface-variant text-center leading-tight">{s.label}</span>
                </div>
              );
            })}
          </div>

          {/* Revenue row */}
          <div className="mt-4 pt-4 border-t border-outline-variant/30 flex gap-4 flex-wrap">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-[10px] text-on-surface-variant">{s.label}</p>
                <p className="text-sm font-semibold text-primary">
                  {s.revenue >= 1000000
                    ? `${(s.revenue / 1000000).toFixed(1)}M`
                    : s.revenue >= 1000
                    ? `${(s.revenue / 1000).toFixed(0)}k`
                    : s.revenue > 0 ? fmt(s.revenue) : "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
          <h2 className="text-base font-bold text-on-surface mb-4">Đăng ký gần nhất</h2>
          <div className="space-y-3">
            {mockBookings.slice(0, 6).map((b) => (
              <div key={b.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                  {b.customerName.split(" ").pop()?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{b.customerName}</p>
                  <p className="text-[10px] text-on-surface-variant truncate">{b.tourName}</p>
                </div>
                <StatusBadge status={b.status} small />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats row — period-aware */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: revLabel, value: fmt(totalRevenue), icon: "account_balance" },
          { label: bkLabel, value: `${totalBookings} đơn`, icon: "receipt_long" },
          { label: "Người đăng ký", value: "8 người", icon: "group" },
          { label: "Tour đang hoạt động", value: "3 tour", icon: "hiking" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-outline-variant/30 px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>{s.icon}</span>
            <div className="min-w-0">
              <p className="text-sm text-on-surface-variant truncate">{s.label}</p>
              <p className="text-sm font-bold text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:     { label: "Chờ xác nhận",     cls: "bg-solar-orange/15 text-solar-orange" },
    confirmed:   { label: "Chờ xác nhận",     cls: "bg-solar-orange/15 text-solar-orange" },
    paid:        { label: "Đã thanh toán",    cls: "bg-green-100 text-green-700" },
    cancelled:   { label: "Đã hủy",           cls: "bg-error/10 text-error" },
    open:        { label: "Còn chỗ",          cls: "bg-green-100 text-green-700" },
    full:        { label: "Hết chỗ",          cls: "bg-error/10 text-error" },
    completed:   { label: "Hoàn thành",       cls: "bg-surface-container text-on-surface-variant" },
    active:      { label: "Đang hoạt động",   cls: "bg-green-100 text-green-700" },
    draft:       { label: "Nháp",             cls: "bg-surface-container text-on-surface-variant" },
    archived:    { label: "Lưu trữ",          cls: "bg-surface-container text-on-surface-variant" },
    inactive:    { label: "Không hoạt động",  cls: "bg-error/10 text-error" },
    admin:       { label: "Admin",            cls: "bg-primary/10 text-primary" },
    coordinator: { label: "Điều phối",        cls: "bg-blue-100 text-blue-700" },
    sale:        { label: "Sale",             cls: "bg-orange-100 text-orange-700" },
    staff:       { label: "Nhân viên",        cls: "bg-surface-container text-on-surface-variant" },
  };
  const { label, cls } = map[status] ?? { label: status, cls: "bg-surface-container text-on-surface-variant" };
  return (
    <span className={`${small ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"} font-semibold rounded-full whitespace-nowrap ${cls}`}>
      {label}
    </span>
  );
}
