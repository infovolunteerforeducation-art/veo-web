"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Camp } from "@/lib/trai-he-data";
import { isRegistrationOpen, calcDeadline } from "@/lib/tour-schedules";

function spotsColor(n: number) {
  return n <= 3 ? "text-error" : "text-green-600";
}

export default function CampBookingSidebar({ camp }: { camp: Camp }) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const availableDates = camp.dates.filter(
    (d) => isRegistrationOpen(d.isoDate) && d.spotsLeft > 0
  );

  const selectedSchedule = availableDates.find((d) => d.isoDate === selectedDate);
  const canRegister = !!selectedDate && !!selectedSchedule;
  const deadline = selectedDate ? calcDeadline(selectedDate) : null;

  function handleRegister() {
    if (!canRegister) return;
    router.push(`/trai-he-tinh-nguyen/${camp.slug}/dang-ky?date=${selectedDate}`);
  }

  return (
    <div className="bg-white rounded-xl shadow-[0px_10px_30px_rgba(108,42,138,0.08)] overflow-hidden border border-outline-variant/20">
      {/* Price header */}
      <div className="p-5 sm:p-6 border-b border-outline-variant/10">
        <div className="text-on-surface-variant text-xs font-semibold mb-1">Chi phí chương trình</div>
        <div className="flex items-baseline gap-2">
          <div className="text-primary text-2xl font-bold">{camp.price}</div>
          <span className="text-sm text-on-surface-variant">/ người</span>
        </div>
      </div>

      {/* Meta */}
      <div className="px-5 sm:px-6 pt-5 pb-4 space-y-3">
        {[
          { icon: "location_on", label: "Địa điểm:", value: camp.location },
          { icon: "schedule", label: "Thời gian:", value: "6 Ngày 5 Đêm" },
          { icon: "groups", label: "Độ tuổi:", value: "10 – 22 tuổi" },
        ].map((row) => (
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
        {availableDates.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic py-2">Hiện chưa có lịch khởi hành.</p>
        ) : (
          <div className="space-y-2">
            {availableDates.map((s) => {
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
          className="w-full bg-solar-orange hover:bg-action-hover disabled:bg-outline-variant disabled:cursor-not-allowed text-pure-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">app_registration</span>
          {canRegister ? "Đăng ký ngay" : "Chọn lịch để đăng ký"}
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
