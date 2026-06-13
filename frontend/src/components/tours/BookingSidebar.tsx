"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tour } from "@/lib/tours";
import { calcDeadline, getUpcomingSchedules, isRegistrationOpen } from "@/lib/tour-schedules";

function spotsColor(n: number) {
  return n <= 3 ? "text-error" : "text-green-600";
}

function regionMeta(region: Tour["region"]) {
  return region === "north"
    ? { label: "Miền Bắc", className: "bg-blue-100 text-blue-700" }
    : { label: "Miền Nam", className: "bg-green-100 text-green-700" };
}

export default function BookingSidebar({ tour }: { tour: Tour }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Show at most 3 nearest open schedules that still have spots
  const schedules = getUpcomingSchedules(
    tour.slug,
    { isoDate: tour.date, label: tour.dateRange, spotsLeft: tour.spotsLeft },
    3
  );

  const selectedSchedule = schedules.find((s) => s.isoDate === selectedDate);
  const canRegister = !!selectedDate && !!selectedSchedule && isRegistrationOpen(selectedDate);
  const deadline = selectedDate ? calcDeadline(selectedDate) : null;
  const region = regionMeta(tour.region);

  const meta = [
    { icon: "calendar_today", label: "Độ tuổi:", value: tour.ageRange },
    { icon: "schedule", label: "Thời gian:", value: tour.duration },
    {
      icon: "map",
      label: "Miền:",
      value: (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${region.className}`}>
          {region.label}
        </span>
      ),
    },
  ];

  function handleRegister() {
    if (!canRegister) return;
    router.push(`/du-lich-tinh-nguyen/${tour.slug}/dang-ky?date=${selectedDate}`);
  }

  return (
    <div className="bg-white rounded-xl shadow-[0px_10px_30px_rgba(108,42,138,0.08)] overflow-hidden border border-outline-variant/20">
      {/* Price header */}
      <div className="p-5 sm:p-6 border-b border-outline-variant/10">
        <div className="text-on-surface-variant text-xs font-semibold mb-1">Chi phí chuyến đi</div>
        <div className="flex items-baseline gap-2">
          <div className="text-primary text-2xl font-bold">{tour.price}</div>
          <span className="text-sm text-on-surface-variant">/ người</span>
        </div>
      </div>

      {/* Trip meta */}
      <div className="px-5 sm:px-6 pt-5 pb-4 space-y-3">
        {meta.map((row) => (
          <div key={row.label} className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 text-on-surface-variant text-sm">
              <span className="material-symbols-outlined text-primary text-base">{row.icon}</span>
              <span>{row.label}</span>
            </div>
            <span className="font-bold text-primary text-sm text-right">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Schedule picker */}
      <div className="px-5 sm:px-6 pb-5">
        <p className="text-xs font-semibold text-on-surface-variant mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary" style={{ fontSize: 14 }}>event_available</span>
          Chọn lịch khởi hành
        </p>
        {schedules.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic py-2">Hiện chưa có lịch khởi hành.</p>
        ) : (
          <div className="space-y-2">
            {schedules.map((s) => {
              const isSelected = selectedDate === s.isoDate;
              return (
                <button
                  key={s.isoDate}
                  type="button"
                  onClick={() => setSelectedDate(s.isoDate)}
                  className={`w-full flex items-start justify-between gap-3 px-3 sm:px-4 py-3 rounded-xl border-2 text-left transition-all select-none ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-outline-variant hover:border-primary/50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "border-primary bg-primary" : "border-outline"
                      }`}
                    >
                      {isSelected && <span className="block w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm font-semibold text-on-surface leading-snug">{s.label}</span>
                  </div>
                  <span className={`shrink-0 text-xs font-bold ${spotsColor(s.spotsLeft)}`}>
                    Còn {s.spotsLeft} chỗ
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6">
        <button
          type="button"
          disabled={!canRegister}
          onClick={handleRegister}
          className="w-full rounded-xl bg-solar-orange py-4 font-bold text-primary shadow-lg transition-all hover:bg-action-hover active:scale-95 disabled:cursor-not-allowed disabled:bg-outline-variant disabled:text-on-surface-variant flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">app_registration</span>
          {canRegister ? "Đăng ký ngay" : selectedDate ? "Đã hết hạn đăng ký" : "Chọn lịch để đăng ký"}
        </button>

        {deadline && (
          <p className="text-xs text-center text-on-surface-variant italic mt-3">
            Hạn chót đăng ký: {deadline}
          </p>
        )}
      </div>
    </div>
  );
}
