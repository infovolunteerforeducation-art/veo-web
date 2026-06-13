"use client";

import { useState, useRef, useEffect } from "react";
import {
  Booking, BookingStatus, BookingParticipant, fmt, fmtDateTime,
  mockCustomers, mockSaleStaff,
  calcBusinessDays, calcCancellationFeePercent, getCancelTier,
  getScheduleIsoDate, CANCEL_FEE_TIERS,
} from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Sao chép"
      className="ml-1.5 text-on-surface-variant hover:text-primary transition-colors shrink-0"
    >
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
        {copied ? "check" : "content_copy"}
      </span>
    </button>
  );
}

type Props = {
  booking: Booking;
  onBack: () => void;
  onUpdateStatus: (id: string, status: BookingStatus, extra?: Partial<Booking>) => void;
  onViewCustomer?: (customerId: string) => void;
  onViewTour?: (tourId: string) => void;
  canManualAssign?: boolean;
  onViewSchedule?: (scheduleId: string) => void;
};

function SectionCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
      <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" style={{ fontSize: 18 }}>{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoRow({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-2 py-2 border-b border-outline-variant/20 last:border-0">
      <span className="text-on-surface-variant text-sm shrink-0">{label}</span>
      <span className="text-sm font-semibold text-right">{children}</span>
    </div>
  );
}

const MATCH_BADGE = {
  matched:   { label: "Đã liên kết",   cls: "bg-green-100 text-green-700",               icon: "link" },
  pending:   { label: "Chờ liên kết",  cls: "bg-solar-orange/15 text-solar-orange",       icon: "schedule" },
  unmatched: { label: "Chưa liên kết", cls: "bg-surface-container text-on-surface-variant", icon: "link_off" },
} as const;

function ParticipantRow({
  index, p, registrantName, onViewCustomer, linkedCustomerId, onManualLink,
}: {
  index: number;
  p: BookingParticipant;
  registrantName: string;
  onViewCustomer?: (id: string) => void;
  linkedCustomerId?: string;
  onManualLink: (customerId: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const effectiveCustomerId = linkedCustomerId ?? p.customerId;
  const effectiveStatus = linkedCustomerId ? "matched" : p.matchStatus;
  const badge = MATCH_BADGE[effectiveStatus];

  const linkedCustomer = effectiveCustomerId
    ? mockCustomers.find((c) => c.id === effectiveCustomerId)
    : null;

  const filteredCustomers = mockCustomers.filter((c) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  useEffect(() => {
    if (!searchOpen) return;
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  return (
    <div className="p-3 bg-surface-container-low rounded-xl text-sm">
      <div className="flex items-start gap-3">
        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {effectiveStatus === "matched" && effectiveCustomerId && onViewCustomer ? (
              <button
                type="button"
                onClick={() => onViewCustomer(effectiveCustomerId)}
                className="font-semibold text-primary hover:underline text-left flex items-center gap-1"
              >
                {linkedCustomer?.name ?? p.name}
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>open_in_new</span>
              </button>
            ) : (
              <span className="font-semibold text-on-surface">{p.name}</span>
            )}
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge.cls}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>{badge.icon}</span>
              {badge.label}
            </span>
          </div>

          {(p.phone || p.email) && (
            <p className="text-xs text-on-surface-variant mt-0.5">
              {[p.phone, p.email].filter(Boolean).join(" · ")}
            </p>
          )}

          {effectiveStatus === "pending" && (
            <p className="text-[10px] text-solar-orange mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>info</span>
              Sẽ tự động ghi nhận khi khách tạo tài khoản VEO
            </p>
          )}
          {effectiveStatus === "unmatched" && (
            <p className="text-[10px] text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined" style={{ fontSize: 11 }}>info</span>
              Quyền lợi ghi nhận cho người đăng ký: <span className="font-semibold">{registrantName}</span>
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => { setSearchOpen((o) => !o); setQuery(""); }}
          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-on-surface-variant hover:text-primary border border-outline-variant/50 hover:border-primary/50 px-2 py-1 rounded-lg transition-colors mt-0.5"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
            {effectiveStatus === "matched" ? "swap_horiz" : "person_search"}
          </span>
          {effectiveStatus === "matched" ? "Đổi" : "Liên kết"}
        </button>
      </div>

      {searchOpen && (
        <div ref={searchRef} className="mt-2 ml-9 border border-outline-variant/40 rounded-xl bg-white shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>search</span>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tên, SĐT hoặc email..."
              className="flex-1 text-sm outline-none bg-transparent placeholder:text-on-surface-variant/50"
            />
            <button type="button" onClick={() => setSearchOpen(false)}>
              <span className="material-symbols-outlined text-on-surface-variant hover:text-on-surface" style={{ fontSize: 16 }}>close</span>
            </button>
          </div>
          <div className="max-h-48 overflow-y-auto divide-y divide-outline-variant/10">
            {filteredCustomers.length === 0 ? (
              <p className="px-3 py-3 text-sm text-on-surface-variant text-center">Không tìm thấy khách hàng</p>
            ) : filteredCustomers.map((c) => {
              const isCurrent = c.id === effectiveCustomerId;
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={isCurrent}
                  onClick={() => { onManualLink(c.id); setSearchOpen(false); setQuery(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${isCurrent ? "bg-primary/5 cursor-default" : "hover:bg-surface-container-low"}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isCurrent ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                    {c.name.split(" ").pop()?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
                      {c.name}
                      {isCurrent && (
                        <span className="text-[10px] font-normal text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">Hiện tại</span>
                      )}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">{c.phone} · {c.email}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cancellation Wizard ────────────────────────────────────────────────────

type CancelBy = "customer" | "veo" | "force_majeure";

const CANCEL_BY_CONFIG = {
  customer: {
    icon: "person",
    label: "Khách hàng hủy",
    desc: "Tính phí theo bảng chính sách",
    color: "text-solar-orange",
    bg: "bg-solar-orange/10",
    ring: "ring-solar-orange",
  },
  veo: {
    icon: "apartment",
    label: "VEO hủy",
    desc: "Hoàn 100% trong 7 ngày làm việc",
    color: "text-primary",
    bg: "bg-primary/10",
    ring: "ring-primary",
  },
  force_majeure: {
    icon: "thunderstorm",
    label: "Bất khả kháng",
    desc: "Hoàn theo chi phí thực tế",
    color: "text-on-surface-variant",
    bg: "bg-surface-container",
    ring: "ring-outline-variant",
  },
} as const;

function CancellationWizard({
  booking,
  onClose,
  onConfirm,
}: {
  booking: Booking;
  onClose: () => void;
  onConfirm: (extra: Partial<Booking>) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [cancelledBy, setCancelledBy] = useState<CancelBy | null>(null);
  const [cancelRequestDate, setCancelRequestDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [overrideFee, setOverrideFee] = useState(false);
  const [overrideFeePercent, setOverrideFeePercent] = useState(0);
  const [overrideReason, setOverrideReason] = useState("");
  const [forceMajeureRefund, setForceMajeureRefund] = useState(booking.totalAmount);
  const [offerTransfer, setOfferTransfer] = useState(false);
  const [note, setNote] = useState("");

  const departureIso = getScheduleIsoDate(booking.scheduleId);
  const businessDays = (cancelledBy === "customer" && departureIso && cancelRequestDate)
    ? calcBusinessDays(new Date(cancelRequestDate), new Date(departureIso))
    : null;
  const tier = businessDays !== null ? getCancelTier(businessDays) : null;
  const autoFeePercent = tier?.feePercent ?? 0;
  const effectiveFeePercent = overrideFee ? overrideFeePercent : autoFeePercent;
  const feeAmount = Math.round(booking.totalAmount * effectiveFeePercent / 100);
  const customerRefund = booking.totalAmount - feeAmount;

  function handleConfirm() {
    let extra: Partial<Booking> = { cancelledBy: cancelledBy! };
    if (cancelledBy === "customer") {
      extra = {
        ...extra,
        cancelRequestDate,
        cancellationFeePercent: effectiveFeePercent,
        refundAmount: customerRefund,
        refundStatus: "pending_refund",
        cancellationNote: [
          overrideFee ? `Điều chỉnh phí thủ công (${overrideFeePercent}%): ${overrideReason}` : "",
          offerTransfer ? "Đã đề xuất chuyển chuyến thay vì hủy." : "",
          note,
        ].filter(Boolean).join(" | ") || undefined,
      };
    } else if (cancelledBy === "veo") {
      extra = {
        ...extra,
        cancellationFeePercent: 0,
        refundAmount: booking.totalAmount,
        refundStatus: "pending_refund",
        cancellationNote: note || undefined,
      };
    } else {
      extra = {
        ...extra,
        cancellationFeePercent: undefined,
        refundAmount: forceMajeureRefund,
        refundStatus: "pending_refund",
        cancellationNote: note || undefined,
      };
    }
    onConfirm(extra);
  }

  const todayIso = new Date().toISOString().slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} className="text-on-surface-variant hover:text-on-surface mr-1">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
              </button>
            )}
            <span className="material-symbols-outlined text-error" style={{ fontSize: 20 }}>cancel</span>
            <h2 className="text-base font-bold text-on-surface">Hủy đăng ký</h2>
            <span className="font-mono text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">{booking.bookingCode}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-on-surface-variant">Bước {step}/2</span>
            <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Step 1: Ai hủy? */}
          {step === 1 && (
            <div>
              <p className="text-sm text-on-surface-variant mb-4">Ai yêu cầu hủy đăng ký này?</p>
              <div className="space-y-3">
                {(["customer", "veo", "force_majeure"] as CancelBy[]).map((key) => {
                  const cfg = CANCEL_BY_CONFIG[key];
                  const selected = cancelledBy === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCancelledBy(key)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        selected ? `${cfg.bg} ring-2 ${cfg.ring} border-transparent` : "border-outline-variant/30 hover:border-outline-variant/60 bg-white"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                        <span className={`material-symbols-outlined ${cfg.color}`} style={{ fontSize: 20 }}>{cfg.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-on-surface text-sm">{cfg.label}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{cfg.desc}</p>
                      </div>
                      {selected && (
                        <span className="material-symbols-outlined text-primary ml-auto" style={{ fontSize: 18 }}>check_circle</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Chi tiết */}
          {step === 2 && cancelledBy === "customer" && (
            <div className="space-y-5">
              {/* Ngày thông báo */}
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">
                  Ngày khách thông báo hủy
                </label>
                <input
                  type="date"
                  value={cancelRequestDate}
                  max={todayIso}
                  onChange={(e) => setCancelRequestDate(e.target.value)}
                  className="w-full text-sm border border-outline-variant/50 rounded-xl px-3 py-2.5 bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <p className="text-[11px] text-on-surface-variant mt-1">Mặc định hôm nay — điều chỉnh nếu khách đã thông báo trước</p>
              </div>

              {/* Kết quả tính phí */}
              {businessDays !== null && tier && (
                <div className={`rounded-2xl p-4 ${effectiveFeePercent === 0 ? "bg-green-50 border border-green-200" : effectiveFeePercent === 100 ? "bg-error/5 border border-error/20" : "bg-solar-orange/5 border border-solar-orange/20"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs font-semibold text-on-surface-variant">Thời gian thông báo</p>
                      <p className="text-sm font-bold text-on-surface mt-0.5">
                        {businessDays} ngày làm việc trước khởi hành
                      </p>
                      <p className="text-xs text-on-surface-variant">({overrideFee ? "Ghi đè thủ công" : tier.label})</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-on-surface-variant">Phí hủy</p>
                      <p className={`text-2xl font-bold ${effectiveFeePercent === 0 ? "text-green-600" : effectiveFeePercent === 100 ? "text-error" : "text-solar-orange"}`}>
                        {effectiveFeePercent}%
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-black/5">
                    <div className="bg-white/70 rounded-xl px-3 py-2">
                      <p className="text-[11px] text-on-surface-variant">Phí hủy</p>
                      <p className="text-sm font-bold text-on-surface">{fmt(feeAmount)}</p>
                    </div>
                    <div className={`rounded-xl px-3 py-2 ${effectiveFeePercent === 0 ? "bg-green-100/70" : "bg-white/70"}`}>
                      <p className="text-[11px] text-on-surface-variant">Hoàn lại cho khách</p>
                      <p className={`text-sm font-bold ${effectiveFeePercent === 0 ? "text-green-600" : "text-on-surface"}`}>{fmt(customerRefund)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bảng phí tham khảo nhỏ */}
              <details className="group">
                <summary className="text-xs text-primary cursor-pointer flex items-center gap-1 select-none">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
                  Xem bảng phí hủy đầy đủ
                </summary>
                <div className="mt-2 rounded-xl overflow-hidden border border-outline-variant/20 text-xs">
                  {CANCEL_FEE_TIERS.map((t, i) => (
                    <div key={i} className={`flex justify-between px-3 py-2 ${businessDays !== null && getCancelTier(businessDays).minDays === t.minDays && !overrideFee ? "bg-primary/10 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-surface-container-low"}`}>
                      <span className="text-on-surface">{t.label}</span>
                      <span className={t.feePercent === 0 ? "text-green-600" : "text-solar-orange"}>{t.feePercent === 0 ? "Không tính phí" : `${t.feePercent}% tổng chi phí`}</span>
                    </div>
                  ))}
                </div>
              </details>

              {/* Override phí */}
              <div className="border border-outline-variant/30 rounded-xl p-3">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={overrideFee} onChange={(e) => setOverrideFee(e.target.checked)} className="rounded" />
                  <span className="text-xs font-semibold text-on-surface">Điều chỉnh phí đặc biệt (thương lượng)</span>
                </label>
                {overrideFee && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-on-surface-variant whitespace-nowrap">Phí hủy thực tế (%):</label>
                      <input
                        type="number"
                        min={0} max={100} step={5}
                        value={overrideFeePercent}
                        onChange={(e) => setOverrideFeePercent(Number(e.target.value))}
                        className="w-20 text-sm border border-outline-variant/50 rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                      <span className="text-xs text-on-surface-variant">%</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Lý do điều chỉnh..."
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      className="w-full text-xs border border-outline-variant/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </div>
                )}
              </div>

              {/* Đề xuất chuyển chuyến */}
              <label className="flex items-start gap-2 cursor-pointer select-none p-3 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors">
                <input type="checkbox" checked={offerTransfer} onChange={(e) => setOfferTransfer(e.target.checked)} className="mt-0.5 rounded shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-on-surface">Ghi nhận đề xuất chuyển chuyến</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Khách có thể chuyển sang chuyến khác trong vòng 3 tháng kể từ ngày thông báo hủy</p>
                </div>
              </label>

              {/* Ghi chú */}
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">Ghi chú nội bộ (không bắt buộc)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Lý do hủy, thông tin thêm..."
                  className="w-full text-xs border border-outline-variant/50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && cancelledBy === "veo" && (
            <div className="space-y-5">
              <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2 text-sm text-on-surface">
                <p className="font-semibold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>apartment</span>
                  VEO có trách nhiệm:
                </p>
                <ul className="space-y-1.5 text-xs text-on-surface-variant pl-2">
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />Thông báo ngay cho khách hàng</li>
                  <li className="flex items-start gap-2"><span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />Hoàn trả toàn bộ trong vòng 7 ngày làm việc, hoặc sắp xếp chuyến thay thế</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-on-surface-variant">Số tiền hoàn lại</p>
                  <p className="text-xl font-bold text-green-600">{fmt(booking.totalAmount)}</p>
                  <p className="text-xs text-green-600">100% — không tính phí hủy</p>
                </div>
                <span className="material-symbols-outlined text-green-500" style={{ fontSize: 32 }}>check_circle</span>
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">Lý do hủy từ VEO</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="VD: Không đủ số lượng tối thiểu, thời tiết cực đoan..."
                  className="w-full text-sm border border-outline-variant/50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && cancelledBy === "force_majeure" && (
            <div className="space-y-5">
              <div className="bg-surface-container rounded-2xl p-4 text-sm text-on-surface-variant leading-relaxed">
                <p className="font-semibold text-on-surface flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>thunderstorm</span>
                  Bất khả kháng
                </p>
                <p className="text-xs">Không bên nào chịu bồi thường thiệt hại. Hoàn tiền theo chi phí thực tế chưa phát sinh — bao gồm hỏa hoạn, thời tiết cực đoan, tai nạn, thiên tai, chiến tranh hoặc đình chỉ giao thông.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">
                  Số tiền hoàn lại theo thực tế
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={booking.totalAmount}
                    step={100000}
                    value={forceMajeureRefund}
                    onChange={(e) => setForceMajeureRefund(Number(e.target.value))}
                    className="flex-1 text-sm border border-outline-variant/50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <span className="text-sm text-on-surface-variant">/ {fmt(booking.totalAmount)}</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">Ghi chú</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Mô tả hoàn cảnh bất khả kháng..."
                  className="w-full text-sm border border-outline-variant/50 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t border-outline-variant/20 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">
            Hủy bỏ
          </button>
          {step === 1 ? (
            <button
              type="button"
              disabled={!cancelledBy}
              onClick={() => setStep(2)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tiếp theo
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-error hover:bg-error/90 text-white transition-colors"
            >
              Xác nhận hủy đăng ký
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailView({
  booking,
  onBack,
  onUpdateStatus,
  onViewCustomer,
  onViewTour,
  onViewSchedule,
  canManualAssign = false,
}: Props) {
  const [linkedOverrides, setLinkedOverrides] = useState<Record<number, string>>({});
  const [assignedSaleOverride, setAssignedSaleOverride] = useState<string | null>(null);
  const [assignManuallyOverride, setAssignManuallyOverride] = useState<boolean | null>(null);
  const [showAutoLogic, setShowAutoLogic] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<"paid" | "pending" | null>(null);
  const [cancelWizardOpen, setCancelWizardOpen] = useState(false);
  const [refundMarked, setRefundMarked] = useState(false);

  function handleManualLink(participantIndex: number, customerId: string) {
    setLinkedOverrides((prev) => ({ ...prev, [participantIndex]: customerId }));
  }

  return (
    <div>
      {/* Back button + header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
          Quay lại
        </button>
        <span className="text-on-surface-variant">/</span>
        <span className="font-mono text-sm font-bold text-primary">{booking.bookingCode}</span>
        <StatusBadge status={booking.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: info sections */}
        <div className="lg:col-span-2 space-y-4">

          {/* Section 1: Thông tin đăng ký */}
          <SectionCard title="Thông tin đăng ký" icon="event_note">
            <div className="space-y-0">
              <InfoRow label="Mã đặt chỗ">
                <span className="font-mono text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-lg">{booking.bookingCode}</span>
              </InfoRow>
              <InfoRow label="Chuyến đi">
                <span className="flex items-center gap-2 justify-end flex-wrap">
                  {booking.tourType && (
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                      booking.tourType === "dltn"
                        ? "bg-primary/10 text-primary"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {booking.tourType === "dltn" ? "Du lịch tình nguyện" : "Trại hè tình nguyện"}
                    </span>
                  )}
                  {onViewTour ? (
                    <button type="button" onClick={() => onViewTour(booking.tourId)} className="text-primary hover:underline font-semibold text-right">
                      {booking.tourName}
                    </button>
                  ) : (
                    <span>{booking.tourName}</span>
                  )}
                </span>
              </InfoRow>
              <InfoRow label="Lịch khởi hành">
                {onViewSchedule ? (
                  <button type="button" onClick={() => onViewSchedule(booking.scheduleId)} className="text-primary hover:underline font-semibold">
                    {booking.scheduleLabel}
                  </button>
                ) : (
                  <span>{booking.scheduleLabel}</span>
                )}
              </InfoRow>
              <InfoRow label="Số người">{booking.numPeople} người</InfoRow>
            </div>

            {booking.note && (
              <div className="mt-3 p-3 bg-surface-container-low rounded-xl">
                <p className="text-xs font-semibold text-on-surface-variant mb-1">Ghi chú</p>
                <p className="text-sm text-on-surface">{booking.note}</p>
              </div>
            )}

            {booking.participants && booking.participants.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-on-surface-variant mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>group</span>
                  Người tham gia ({booking.participants.length})
                </p>
                <div className="space-y-2">
                  {booking.participants.map((p, i) => (
                    <ParticipantRow
                      key={i}
                      index={i}
                      p={p}
                      registrantName={booking.customerName}
                      onViewCustomer={onViewCustomer}
                      linkedCustomerId={linkedOverrides[i]}
                      onManualLink={(custId) => handleManualLink(i, custId)}
                    />
                  ))}
                </div>
              </div>
            )}
          </SectionCard>

          {/* Section 3: Chi tiết thanh toán */}
          <SectionCard title="Chi tiết thanh toán" icon="payments">
            <div className="space-y-0">
              <InfoRow label="Phương thức">
                {booking.paymentMethod === "transfer" ? "Chuyển khoản" : "Tại văn phòng"}
              </InfoRow>
              {booking.discountCode && booking.originalAmount ? (
                <>
                  <InfoRow label="Giá gốc">
                    <span className="line-through text-on-surface-variant">{fmt(booking.originalAmount)}</span>
                  </InfoRow>
                  <InfoRow label={
                    <span className="flex items-center gap-1.5">
                      Mã giảm giá
                      <span className="font-mono text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">{booking.discountCode}</span>
                    </span>
                  }>
                    <span className="text-green-600">−{fmt(booking.discountAmount ?? 0)}</span>
                  </InfoRow>
                  <InfoRow label="Tổng tiền">
                    <span className="text-primary text-base">{fmt(booking.totalAmount)}</span>
                  </InfoRow>
                </>
              ) : (
                <InfoRow label="Tổng tiền">
                  <span className="text-primary text-base">{fmt(booking.totalAmount)}</span>
                </InfoRow>
              )}
              <InfoRow label="Ngày đặt">{fmtDateTime(booking.createdAt)}</InfoRow>
              {booking.paidAt && (
                <InfoRow label="Thời gian thanh toán">{fmtDateTime(booking.paidAt)}</InfoRow>
              )}
            </div>
          </SectionCard>

          {/* Section 4: Lịch sử thao tác */}
          <SectionCard title="Lịch sử thao tác" icon="history">
            {!booking.activityLog || booking.activityLog.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic">Chưa có thao tác nào được ghi nhận.</p>
            ) : (
              <div className="relative pl-6">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-outline-variant/40" />
                <div className="space-y-4">
                  {[...booking.activityLog].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).map((log) => (
                    <div key={log.id} className="relative flex gap-3">
                      <div className="absolute -left-6 w-4 h-4 rounded-full bg-white border-2 border-outline-variant flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-primary" style={{ fontSize: 10 }}>{log.icon ?? "circle"}</span>
                      </div>
                      <div className="flex-1 min-w-0 pb-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-on-surface">{log.action}</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">
                              {log.actor}{log.actorRole ? ` · ${log.actorRole}` : ""}
                            </p>
                          </div>
                          <p className="text-xs text-on-surface-variant whitespace-nowrap shrink-0">{fmtDateTime(log.timestamp)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right: personal info + status panel */}
        <div className="space-y-4">
          {/* Thông tin cá nhân */}
          <SectionCard title="Thông tin cá nhân" icon="person">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-outline-variant/20">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-base font-bold text-primary shrink-0">
                {booking.customerName.split(" ").pop()?.charAt(0)}
              </div>
              <div>
                {onViewCustomer ? (
                  <button
                    type="button"
                    onClick={() => onViewCustomer(booking.customerId)}
                    className="font-bold text-primary hover:underline text-left leading-snug"
                  >
                    {booking.customerName}
                  </button>
                ) : (
                  <p className="font-bold text-on-surface">{booking.customerName}</p>
                )}
                <p className="text-xs text-on-surface-variant mt-0.5">Người đăng ký</p>
              </div>
            </div>
            <div className="space-y-0">
              <InfoRow label="Điện thoại">
                <span className="flex items-center gap-0.5">
                  {booking.phone}
                  <CopyButton text={booking.phone} />
                </span>
              </InfoRow>
              <InfoRow label="Email">
                <span className="flex items-center gap-0.5">
                  {booking.email}
                  <CopyButton text={booking.email} />
                </span>
              </InfoRow>
            </div>
          </SectionCard>

          {/* Nhân viên phụ trách */}
          {(() => {
            const effectiveSaleId = assignedSaleOverride ?? booking.assignedSaleId;
            const effectiveManual = assignManuallyOverride ?? booking.assignedManually;
            const assignedSale = effectiveSaleId ? mockSaleStaff.find((s) => s.id === effectiveSaleId) : null;
            return (
              <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
                <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>manage_accounts</span>
                  Nhân viên phụ trách
                </h3>

                {assignedSale ? (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {assignedSale.name.split(" ").pop()?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface">{assignedSale.name}</p>
                      <p className="text-xs text-on-surface-variant">{assignedSale.email}</p>
                    </div>
                    {effectiveManual && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                        Thủ công
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-3 text-sm text-on-surface-variant italic">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_off</span>
                    Chưa phân công
                  </div>
                )}

                {effectiveManual && (
                  <p className="text-[11px] text-primary/70 bg-primary/5 rounded-lg px-3 py-2 mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: 13 }}>lock</span>
                    Đã phân công thủ công — không áp dụng tự động chuyển sale
                  </p>
                )}

                {canManualAssign && (
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant mb-1.5 block">
                      {assignedSale ? "Đổi nhân viên phụ trách" : "Phân công"}
                    </label>
                    <select
                      value={effectiveSaleId ?? ""}
                      onChange={(e) => {
                        setAssignedSaleOverride(e.target.value || null);
                        setAssignManuallyOverride(true);
                      }}
                      className="w-full text-sm border border-outline-variant/50 rounded-xl px-3 py-2 bg-surface-container-low focus:outline-none focus:ring-1 focus:ring-primary/50"
                    >
                      <option value="">— Chưa phân công —</option>
                      {mockSaleStaff.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <p className="text-[10px] text-on-surface-variant">
                        Phân công thủ công sẽ khóa tự động chuyển sale.{" "}
                        <button
                          type="button"
                          onClick={() => setShowAutoLogic((v) => !v)}
                          className="text-primary underline underline-offset-2 hover:no-underline"
                        >
                          {showAutoLogic ? "Ẩn bớt" : "Xem logic tự động"}
                        </button>
                      </p>

                      {showAutoLogic && (
                        <div className="mt-2 rounded-xl bg-surface-container-low border border-outline-variant/30 p-3 space-y-2.5 text-[11px] text-on-surface-variant">
                          <div className="flex gap-2">
                            <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 14 }}>auto_awesome</span>
                            <div>
                              <p className="font-semibold text-on-surface mb-0.5">Phân công tự động</p>
                              <p>Khi có đăng ký mới, hệ thống chia đều lead cho tất cả sale đang hoạt động theo vòng tròn (round-robin).</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span className="material-symbols-outlined text-solar-orange shrink-0" style={{ fontSize: 14 }}>schedule</span>
                            <div>
                              <p className="font-semibold text-on-surface mb-0.5">Tự động chuyển sale nếu không xử lý</p>
                              <p>Trong giờ làm việc <span className="font-semibold text-on-surface">10:00 – 18:00</span>, nếu sale được phân công không mở chi tiết đăng ký trong vòng <span className="font-semibold text-on-surface">1 tiếng</span>, lead sẽ tự động chuyển sang sale tiếp theo.</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <span className="material-symbols-outlined text-green-600 shrink-0" style={{ fontSize: 14 }}>lock</span>
                            <div>
                              <p className="font-semibold text-on-surface mb-0.5">Khóa tự động chuyển</p>
                              <p>Khi admin hoặc điều phối viên phân công thủ công, lead sẽ được giữ cố định cho sale đó và không còn áp dụng logic chuyển tự động.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Cập nhật trạng thái */}
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
            <h3 className="text-sm font-bold text-on-surface mb-3">Cập nhật trạng thái</h3>

            {/* Current status display */}
            <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-container-low rounded-xl mb-3">
              <span className="text-xs text-on-surface-variant">Hiện tại:</span>
              <StatusBadge status={booking.status} />
            </div>

            <div className="space-y-2">
              {booking.status !== "paid" && (
                <button
                  type="button"
                  onClick={() => setConfirmStatus("paid")}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                  Xác nhận đã thanh toán
                </button>
              )}
              {booking.status !== "cancelled" && (
                <button
                  type="button"
                  onClick={() => setCancelWizardOpen(true)}
                  className="w-full py-3 rounded-xl text-sm font-bold transition-all border-2 border-error/40 hover:bg-error/5 hover:border-error/70 active:scale-[0.98] text-error flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>cancel</span>
                  Hủy đăng ký
                </button>
              )}
              {booking.status !== "paid" && booking.status !== "pending" && (
                <button
                  type="button"
                  onClick={() => setConfirmStatus("pending")}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold transition-colors text-on-surface-variant hover:bg-surface-container-low flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>undo</span>
                  Chuyển về chờ xác nhận
                </button>
              )}
            </div>
          </div>

          {/* Hoàn tiền tracking (chỉ khi đã hủy) */}
          {booking.status === "cancelled" && booking.refundAmount !== undefined && (
            <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
              <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>account_balance_wallet</span>
                Hoàn tiền
              </h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Tổng đã thanh toán</span>
                  <span className="font-semibold">{fmt(booking.totalAmount)}</span>
                </div>
                {booking.cancellationFeePercent !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Phí hủy ({booking.cancellationFeePercent}%)</span>
                    <span className="font-semibold text-error">−{fmt(Math.round(booking.totalAmount * booking.cancellationFeePercent / 100))}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm border-t border-outline-variant/20 pt-2">
                  <span className="font-semibold text-on-surface">Hoàn lại cho khách</span>
                  <span className="font-bold text-green-600">{fmt(booking.refundAmount)}</span>
                </div>
              </div>

              {booking.cancellationNote && (
                <p className="text-xs text-on-surface-variant bg-surface-container-low rounded-lg px-3 py-2 mb-3">{booking.cancellationNote}</p>
              )}

              {booking.offerTransfer && (
                <p className="text-xs text-primary flex items-center gap-1.5 mb-3">
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>swap_horiz</span>
                  Đã đề xuất chuyển chuyến trong vòng 3 tháng
                </p>
              )}

              {(refundMarked || booking.refundStatus === "refunded") ? (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>
                  Đã hoàn tiền{booking.refundCompletedAt ? ` — ${booking.refundCompletedAt.slice(0, 10)}` : ""}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setRefundMarked(true);
                    onUpdateStatus(booking.id, "cancelled", { refundStatus: "refunded", refundCompletedAt: new Date().toISOString() });
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-bold bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>payments</span>
                  Xác nhận đã hoàn tiền
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Wizard hủy đăng ký */}
      {cancelWizardOpen && (
        <CancellationWizard
          booking={booking}
          onClose={() => setCancelWizardOpen(false)}
          onConfirm={(extra) => {
            onUpdateStatus(booking.id, "cancelled", extra);
            setCancelWizardOpen(false);
          }}
        />
      )}

      {/* Confirmation modal (paid / pending) */}
      {confirmStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmStatus === "paid" ? "bg-green-100" : "bg-solar-orange/10"}`}>
              <span className={`material-symbols-outlined text-xl ${confirmStatus === "paid" ? "text-green-600" : "text-solar-orange"}`}>
                {confirmStatus === "paid" ? "check_circle" : "schedule"}
              </span>
            </div>
            <h3 className="text-base font-bold text-on-surface text-center mb-1">
              {confirmStatus === "paid" ? "Xác nhận thanh toán?" : "Chuyển về chờ xác nhận?"}
            </h3>
            <p className="text-sm text-on-surface-variant text-center mb-1">
              Đơn <span className="font-mono font-bold text-primary">{booking.bookingCode}</span>
            </p>
            <p className="text-xs text-on-surface-variant text-center mb-5">
              {confirmStatus === "paid" ? "Trạng thái sẽ chuyển sang Đã thanh toán." : "Trạng thái sẽ trở về Chờ xác nhận."}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setConfirmStatus(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors">
                Hủy
              </button>
              <button
                type="button"
                onClick={() => { onUpdateStatus(booking.id, confirmStatus); setConfirmStatus(null); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${confirmStatus === "paid" ? "bg-green-500 hover:bg-green-600" : "bg-solar-orange hover:bg-solar-orange/90"}`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
