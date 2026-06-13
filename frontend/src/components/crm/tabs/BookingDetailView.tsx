"use client";

import { Booking, BookingStatus, fmt, fmtDateTime } from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";

type Props = {
  booking: Booking;
  onBack: () => void;
  onUpdateStatus: (id: string, status: BookingStatus) => void;
  onViewCustomer?: (customerId: string) => void;
  onViewTour?: (tourId: string) => void;
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

export default function BookingDetailView({
  booking,
  onBack,
  onUpdateStatus,
  onViewCustomer,
  onViewTour,
  onViewSchedule,
}: Props) {
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
        {/* Left: 3 info sections */}
        <div className="lg:col-span-2 space-y-4">

          {/* Section 1: Thông tin cá nhân */}
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
              <InfoRow label="Điện thoại">{booking.phone}</InfoRow>
              <InfoRow label="Email">{booking.email}</InfoRow>
            </div>
          </SectionCard>

          {/* Section 2: Thông tin đăng ký */}
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
                    <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl text-sm">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface">{p.name}</p>
                        {(p.phone || p.email) && (
                          <p className="text-xs text-on-surface-variant truncate">
                            {[p.phone, p.email].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>
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

        {/* Right: status panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
            <h3 className="text-sm font-bold text-on-surface mb-3">Cập nhật trạng thái</h3>
            <div className="space-y-2">
              {(["pending", "paid", "cancelled"] as BookingStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onUpdateStatus(booking.id, s)}
                  disabled={booking.status === s}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                    booking.status === s
                      ? "bg-primary/10 text-primary ring-1 ring-primary/30"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  <StatusBadge status={s} small />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
