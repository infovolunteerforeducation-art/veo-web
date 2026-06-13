"use client";

import { useState, useMemo } from "react";
import { mockBookings, mockWeeklyStats, mockDailyStats, mockMonthlyStats, fmt } from "@/lib/crm-data";

type Period = "month" | "year";

const todayStr = "2025-10-16";

// ── Hoạt động hôm nay ──────────────────────────────────────────────────
const todayAll       = mockBookings.filter((b) => b.createdAt.startsWith(todayStr));
const todayNew       = todayAll.length;
const todayPending   = mockBookings.filter((b) => b.status === "pending").length;
const todayPaid      = mockBookings.filter((b) => b.status === "paid").length;
const todayCancelled = mockBookings.filter((b) => b.status === "cancelled").length;
const todayRevenue   = todayAll
  .filter((b) => b.status !== "cancelled")
  .reduce((s, b) => s + b.totalAmount, 0);

const prevDay = mockDailyStats.at(-2) ?? { bookings: 0, revenue: 0 };

type Delta = { text: string; up: boolean; neutral: boolean };

function numDelta(cur: number, prev: number): Delta {
  const d = cur - prev;
  if (d === 0) return { text: "Bằng hôm qua", up: false, neutral: true };
  return { text: `${d > 0 ? "+" : ""}${d} so với hôm qua`, up: d > 0, neutral: false };
}
function pctDelta(cur: number, prev: number): Delta {
  if (!prev) return { text: "—", up: false, neutral: true };
  const pct = Math.round(((cur - prev) / prev) * 100);
  if (pct === 0) return { text: "Bằng hôm qua", up: false, neutral: true };
  return { text: `${pct > 0 ? "+" : ""}${pct}% so với hôm qua`, up: pct > 0, neutral: false };
}

const ACTIVITY_CARDS: {
  label: string; value: string; unit: string; icon: string; iconCls: string;
  delta: Delta | null;
}[] = [
  { label: "Đăng ký mới hôm nay", value: `${todayNew}`,       unit: "lượt", icon: "how_to_reg",      iconCls: "bg-primary/10 text-primary",              delta: numDelta(todayNew, prevDay.bookings) },
  { label: "Chờ xác nhận",        value: `${todayPending}`,   unit: "đơn",  icon: "pending_actions", iconCls: "bg-solar-orange/10 text-solar-orange",     delta: null },
  { label: "Đã hủy hôm nay",      value: `${todayCancelled}`, unit: "đơn",  icon: "cancel",          iconCls: "bg-error/10 text-error",                  delta: numDelta(todayCancelled, 0) },
  { label: "Doanh thu hôm nay",   value: fmt(todayRevenue),   unit: "",     icon: "payments",        iconCls: "bg-blue-100 text-blue-700",               delta: pctDelta(todayRevenue, prevDay.revenue) },
];

// ── Báo cáo nhanh — types ───────────────────────────────────────────────
type ChartBar = {
  label: string;
  fullLabel: string;
  bookings: number;
  revenue: number;
  customers: number;
  participants: number;
};

const PERIOD_TABS: { value: Period; label: string }[] = [
  { value: "month", label: "Tháng này" },
  { value: "year",  label: "Năm nay" },
];

// ── Sub-components ─────────────────────────────────────────────────────
function DeltaBadge({ delta }: { delta: Delta }) {
  const cls  = delta.neutral ? "text-on-surface-variant" : delta.up ? "text-green-600" : "text-error";
  const icon = delta.neutral ? "remove" : delta.up ? "trending_up" : "trending_down";
  return (
    <p className={`text-xs flex items-center gap-1 mt-1 ${cls}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 12 }}>{icon}</span>
      {delta.text}
    </p>
  );
}

function ReportCard({
  label, icon, cur, prev, compLabel, format,
}: {
  label: string; icon: string; cur: number; prev: number; compLabel: string;
  format: (v: number) => string;
}) {
  const d   = cur - prev;
  const pct = prev > 0 ? Math.round((d / prev) * 100) : 0;
  const up  = d > 0;
  const neutral = d === 0;
  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 px-4 py-4 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>{icon}</span>
        <p className="text-sm text-on-surface-variant">{label}</p>
      </div>
      <p className="text-xl font-bold text-on-surface">{format(cur)}</p>
      <p className={`text-xs flex items-center gap-1 ${neutral ? "text-on-surface-variant" : up ? "text-green-600" : "text-error"}`}>
        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>
          {neutral ? "remove" : up ? "trending_up" : "trending_down"}
        </span>
        {neutral
          ? `Bằng ${compLabel.replace("so với ", "")}`
          : `${up ? "+" : ""}${pct}% ${compLabel}`}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────
export default function DashboardTab({ onNavigateToPending }: { onNavigateToPending?: () => void } = {}) {
  const [period, setPeriod]         = useState<Period>("month");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  function handlePeriodChange(p: Period) {
    setPeriod(p);
    setSelectedIdx(null);
  }

  function handleBarClick(i: number) {
    setSelectedIdx((prev) => (prev === i ? null : i));
  }

  // Chart data
  const chartData: ChartBar[] = useMemo(() => {
    if (period === "month") {
      return mockDailyStats.map((d, i) => ({
        label:        d.day,
        fullLabel:    `Ngày ${i + 1}/10`,
        bookings:     d.bookings,
        revenue:      d.revenue,
        customers:    Math.ceil(d.bookings * 0.85),
        participants: d.bookings * 3,
      }));
    }
    return mockMonthlyStats.map((m, i) => ({
      label:        m.month,
      fullLabel:    `Tháng ${i + 1}/2025`,
      bookings:     m.bookings,
      revenue:      m.revenue,
      customers:    Math.ceil(m.bookings * 0.8),
      participants: m.bookings * 3,
    }));
  }, [period]);

  const maxBookings = Math.max(...chartData.map((d) => d.bookings), 1);

  // Report stats — specific bar or period totals
  const { reportCur, reportPrev, compLabel, viewLabel } = useMemo(() => {
    if (selectedIdx !== null) {
      const cur  = chartData[selectedIdx];
      const prev = selectedIdx > 0
        ? chartData[selectedIdx - 1]
        : { bookings: 0, revenue: 0, customers: 0, participants: 0 };
      return {
        reportCur:  cur,
        reportPrev: prev,
        compLabel:  period === "month" ? "so với ngày trước" : "so với tháng trước",
        viewLabel:  cur.fullLabel,
      };
    }
    const totBookings     = chartData.reduce((s, d) => s + d.bookings, 0);
    const totRevenue      = chartData.reduce((s, d) => s + d.revenue, 0);
    const totCustomers    = chartData.reduce((s, d) => s + d.customers, 0);
    const totParticipants = chartData.reduce((s, d) => s + d.participants, 0);
    // Mock previous period factor
    const f = period === "month" ? 1.09 : 0.85;
    return {
      reportCur:  { bookings: totBookings, revenue: totRevenue, customers: totCustomers, participants: totParticipants },
      reportPrev: { bookings: Math.round(totBookings * f), revenue: Math.round(totRevenue * f), customers: Math.round(totCustomers * f), participants: Math.round(totParticipants * f) },
      compLabel:  period === "month" ? "so với tháng trước" : "so với năm ngoái",
      viewLabel:  null as string | null,
    };
  }, [period, selectedIdx, chartData]);

  const chartTitle = period === "month" ? "Đăng ký theo ngày — Tháng 10/2025" : "Đăng ký theo tháng — Năm 2025";

  return (
    <div className="space-y-6">

      {/* ── Hoạt động hôm nay ── */}
      <div>
        <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-3">
          Tóm tắt hoạt động
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {ACTIVITY_CARDS.map((card) => {
            const isPending = card.icon === "pending_actions";
            const Wrapper = isPending ? "button" : "div";
            return (
              <Wrapper
                key={card.label}
                {...(isPending ? { type: "button" as const, onClick: onNavigateToPending } : {})}
                className={`bg-white rounded-2xl border border-outline-variant/30 p-5 text-left w-full ${isPending && onNavigateToPending ? "cursor-pointer hover:border-solar-orange/50 hover:shadow-sm transition-all group" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-on-surface-variant leading-snug max-w-[70%]">
                    {card.label}
                  </p>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.iconCls}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{card.icon}</span>
                  </div>
                </div>
                <p className="text-2xl font-bold text-on-surface mb-0.5">
                  {card.value}
                  {card.unit && <span className="text-sm font-normal text-on-surface-variant ml-1">{card.unit}</span>}
                </p>
                {card.delta
                  ? <DeltaBadge delta={card.delta} />
                  : (
                    <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                      Tổng đang chờ xử lý
                      {onNavigateToPending && (
                        <span className="material-symbols-outlined text-solar-orange opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontSize: 12 }}>arrow_forward</span>
                      )}
                    </p>
                  )
                }
              </Wrapper>
            );
          })}
        </div>
      </div>

      {/* ── Báo cáo nhanh ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
            Báo cáo nhanh
          </h2>
          <div className="flex gap-1">
            {PERIOD_TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => handlePeriodChange(t.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors select-none ${
                  period === t.value
                    ? "bg-primary text-white"
                    : "bg-white border border-outline-variant text-on-surface-variant hover:border-primary/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 p-5 mb-4">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-on-surface">{chartTitle}</h3>
            {selectedIdx !== null && (
              <button
                type="button"
                onClick={() => setSelectedIdx(null)}
                className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-lg hover:bg-primary/15 transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                Xem tổng {period === "month" ? "tháng" : "năm"}
              </button>
            )}
          </div>

          <div className="flex items-end gap-1.5 h-48">
            {chartData.map((bar, i) => {
              const h       = Math.round((bar.bookings / maxBookings) * 100);
              const active  = selectedIdx === i;
              const faded   = selectedIdx !== null && !active;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleBarClick(i)}
                  title={`${bar.fullLabel}: ${bar.bookings} đơn`}
                  className="flex-1 flex flex-col items-center gap-1 group focus:outline-none"
                >
                  <span className={`text-xs font-bold text-primary transition-opacity ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    {bar.bookings > 0 ? bar.bookings : ""}
                  </span>
                  <div className="w-full relative flex items-end justify-center" style={{ height: 160 }}>
                    <div
                      className={`w-full rounded-t-lg transition-colors ${
                        active
                          ? "bg-primary"
                          : faded
                          ? "bg-primary/10"
                          : "bg-primary/20 group-hover:bg-primary/50"
                      }`}
                      style={{ height: bar.bookings > 0 ? `${Math.max(h, 2)}%` : "2%" }}
                    />
                  </div>
                  <span className={`text-[9px] text-center leading-tight transition-colors ${active ? "text-primary font-bold" : "text-on-surface-variant"}`}>
                    {bar.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Revenue row */}
          <div className="mt-4 pt-4 border-t border-outline-variant/30 flex gap-4 flex-wrap">
            {chartData.map((bar, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleBarClick(i)}
                className={`text-center rounded transition-colors px-1 ${selectedIdx === i ? "bg-primary/8" : "hover:bg-surface-container-low"}`}
              >
                <p className={`text-[10px] ${selectedIdx === i ? "text-primary font-semibold" : "text-on-surface-variant"}`}>{bar.label}</p>
                <p className="text-sm font-semibold text-primary">
                  {bar.revenue >= 1_000_000
                    ? `${(bar.revenue / 1_000_000).toFixed(1)}M`
                    : bar.revenue >= 1_000
                    ? `${(bar.revenue / 1_000).toFixed(0)}k`
                    : bar.revenue > 0 ? fmt(bar.revenue) : "—"}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Report stat cards */}
        <div className="mb-2 h-5">
          {viewLabel && (
            <p className="text-xs text-on-surface-variant font-semibold">
              <span className="material-symbols-outlined align-middle mr-1" style={{ fontSize: 14 }}>filter_alt</span>
              Đang xem: <span className="text-primary">{viewLabel}</span>
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReportCard
            label="Tổng số đăng ký"
            icon="receipt_long"
            cur={reportCur.bookings}
            prev={reportPrev.bookings}
            compLabel={compLabel}
            format={(v) => `${v} đơn`}
          />
          <ReportCard
            label="Tổng khách hàng"
            icon="group"
            cur={reportCur.customers}
            prev={reportPrev.customers}
            compLabel={compLabel}
            format={(v) => `${v} người`}
          />
          <ReportCard
            label="Tổng doanh thu"
            icon="account_balance"
            cur={reportCur.revenue}
            prev={reportPrev.revenue}
            compLabel={compLabel}
            format={fmt}
          />
        </div>
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
