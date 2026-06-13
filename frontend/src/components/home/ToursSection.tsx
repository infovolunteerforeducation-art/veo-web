"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  }, []);

  const scheduleScrollStateUpdate = useCallback(() => {
    window.requestAnimationFrame(updateScrollState);
  }, [updateScrollState]);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | null;
    const amount = card ? card.offsetWidth + 24 : 280; // 24 = gap-6
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
    scheduleScrollStateUpdate();
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", scheduleScrollStateUpdate, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", scheduleScrollStateUpdate);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [scheduleScrollStateUpdate, updateScrollState]);

  return (
    <section id="tours" className="py-12 sm:py-16 lg:py-20 px-3 sm:px-6">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[24px] bg-primary px-4 py-8 shadow-[0_20px_60px_rgba(83,11,113,0.18)] sm:rounded-[28px] sm:px-7 sm:py-10 lg:px-10">
        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.22),transparent_34%),repeating-conic-gradient(from_8deg_at_50%_0%,rgba(255,255,255,0.13)_0deg,rgba(255,255,255,0.13)_2deg,transparent_2deg,transparent_12deg),linear-gradient(135deg,#6c2a8a_0%,#530b71_48%,#451e6b_100%)]" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-36 w-36 rounded-full bg-solar-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-8 right-14 hidden h-3 w-3 rounded-full bg-solar-orange lg:block" />

        <div className="relative">
          {/* Header */}
          <div className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-pure-white sm:text-3xl">
                Tour du lịch tình nguyện sắp diễn ra
              </h2>
              <p className="max-w-2xl text-sm text-pure-white/82 sm:text-base">
                Chọn một điểm đến và bắt đầu hành trình thay đổi cuộc đời.
              </p>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => scroll(-1)}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-pure-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Trước"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-pure-white backdrop-blur-sm transition-colors hover:bg-white/20"
                aria-label="Tiếp theo"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
              </button>
              <Link
                href="/du-lich-tinh-nguyen"
                className="hidden items-center gap-2 rounded-full border border-white/35 px-4 py-2 text-sm font-bold text-pure-white transition-colors hover:border-solar-orange hover:text-solar-orange sm:inline-flex"
              >
                Xem tất cả
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Scroll track */}
          <div className="relative">
            {/* Gradient fade on right edge */}
            <div
              className={`pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-transparent to-primary transition-opacity duration-300 ease-out xl:hidden ${
                canScrollNext ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              ref={scrollRef}
              onScroll={scheduleScrollStateUpdate}
              onTouchEnd={scheduleScrollStateUpdate}
              onPointerUp={scheduleScrollStateUpdate}
              onWheel={scheduleScrollStateUpdate}
              className="-mb-3 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-3"
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
                    href={`/du-lich-tinh-nguyen/${tour.slug}`}
                    className="group block w-[82%] shrink-0 snap-start overflow-hidden rounded-xl border border-white/30 bg-pure-white shadow-[0_10px_26px_rgba(28,4,43,0.16)] sm:w-[44%] xl:w-[calc(25%-18px)]"
                  >
                    <div className="relative h-44 overflow-hidden sm:h-52">
                      <Image
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        src={tour.image}
                        alt={tour.title}
                        fill
                        sizes="(min-width: 1280px) 270px, (min-width: 640px) 44vw, 82vw"
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <span className={`mb-2 inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${region.className}`}>
                        {region.label}
                      </span>
                      <h3 className="mb-3 text-base font-semibold text-primary line-clamp-2">
                        {tour.title}
                      </h3>
                      <div className="mb-4 space-y-2 text-xs">
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
                      <div className="mt-auto border-t border-surface-variant pt-4">
                        <p className="mb-0.5 text-xs text-outline">Chi phí từ</p>
                        <p className="text-base font-bold text-secondary">{formatPricePerPerson(tour.priceNumber)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile-only CTA button below cards */}
          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              href="/du-lich-tinh-nguyen"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-6 py-2.5 font-bold text-pure-white transition-colors hover:border-solar-orange hover:text-solar-orange"
            >
              Xem tất cả tour
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
