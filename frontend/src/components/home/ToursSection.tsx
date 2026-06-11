"use client";

import { useRef } from "react";
import Link from "next/link";
import { tours } from "@/lib/tours";
import { getUpcomingSchedules } from "@/lib/tour-schedules";

function formatPricePerPerson(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ/ người`;
}

function regionMeta(region: "north" | "south") {
  return region === "north"
    ? { label: "Miền Bắc", className: "bg-blue-100 text-blue-700" }
    : { label: "Miền Nam", className: "bg-green-100 text-green-700" };
}

export default function ToursSection() {
  const featuredTours = tours.slice(0, 4);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : 280; // 24 = gap-6
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section id="tours" className="py-12 sm:py-16 lg:py-20 max-w-[1200px] mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-8 sm:mb-10">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            Tour du lịch tình nguyện sắp diễn ra
          </h2>
          <p className="text-base text-on-surface-variant">
            Chọn một điểm đến và bắt đầu hành trình thay đổi cuộc đời.
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="hidden w-10 h-10 rounded-full border border-outline-variant items-center justify-center transition-colors hover:border-primary/50 hover:bg-primary/5"
            aria-label="Trước"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="hidden w-10 h-10 rounded-full border border-outline-variant items-center justify-center transition-colors hover:border-primary/50 hover:bg-primary/5"
            aria-label="Tiếp theo"
          >
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>chevron_right</span>
          </button>
          <Link
            href="/tours"
            className="hidden sm:inline-flex text-primary font-bold items-center gap-1 hover:text-solar-orange transition-colors whitespace-nowrap"
          >
            Xem tất cả
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* Scroll track */}
      <div className="relative">
        {/* Gradient fade on right edge */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-transparent to-[#f9f9f9] xl:hidden" />
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 -mb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {featuredTours.map((tour) => {
          const schedules = getUpcomingSchedules(
            tour.slug,
            { isoDate: tour.date, label: tour.dateRange, spotsLeft: tour.spotsLeft }
          );
          const nearestSchedule = schedules[0];
          const extraScheduleCount = Math.max(schedules.length - 1, 0);
          const region = regionMeta(tour.region);

          return (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}`}
              className="shrink-0 snap-start w-[82%] sm:w-[44%] xl:w-[calc(25%-18px)] bg-pure-white rounded-xl overflow-hidden card-hover-shadow border border-surface-variant group block"
            >
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={tour.image}
                  alt={tour.title}
                />
              </div>
              <div className="p-4 sm:p-5">
                <span className={`mb-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${region.className}`}>
                  {region.label}
                </span>
                <h3 className="text-base font-semibold text-primary mb-3 line-clamp-2">
                  {tour.title}
                </h3>
                <div className="space-y-2 text-xs mb-4">
                  <div className="flex h-5 items-center gap-2">
                    <span className="material-symbols-outlined w-[18px] text-[18px] leading-none text-primary">location_on</span>
                    <span className="font-semibold leading-5 text-on-surface line-clamp-1">{tour.destinationName}</span>
                  </div>
                  <div className="flex h-5 items-center gap-2">
                    <span className="material-symbols-outlined w-[18px] text-[18px] leading-none text-primary">calendar_today</span>
                    <span className="font-semibold leading-5 text-on-surface">
                      {nearestSchedule ? nearestSchedule.label : "Chưa có lịch"}
                    </span>
                    {extraScheduleCount > 0 && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        +{extraScheduleCount}
                      </span>
                    )}
                  </div>
                  <div className="flex h-5 items-center gap-2">
                    <span className="material-symbols-outlined w-[18px] text-[18px] leading-none text-primary">schedule</span>
                    <span className="font-semibold leading-5 text-on-surface">{tour.duration}</span>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-surface-variant">
                  <p className="text-xs text-outline mb-0.5">Chi phí từ</p>
                  <p className="text-base font-bold text-secondary">{formatPricePerPerson(tour.priceNumber)}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      </div>{/* end relative wrapper */}

      {/* Mobile-only CTA button below cards */}
      <div className="flex justify-center mt-6 sm:hidden">
        <Link
          href="/tours"
          className="inline-flex items-center gap-2 border border-primary text-primary font-bold px-6 py-2.5 rounded-full hover:bg-primary/5 transition-colors"
        >
          Xem tất cả tour
          <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
    </section>
  );
}
