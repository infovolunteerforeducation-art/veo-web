"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TourFilters, { EMPTY_TOUR_FILTERS, TourFilterState } from "@/components/tours/TourFilters";
import { tours, type Tour } from "@/lib/tours";
import { getUpcomingSchedules } from "@/lib/tour-schedules";

type SortOption = "departure-asc" | "departure-desc" | "price-desc" | "price-asc";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "departure-asc", label: "Khởi hành gần nhất" },
  { value: "departure-desc", label: "Khởi hành xa nhất" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "price-asc", label: "Giá thấp đến cao" },
];

function formatPricePerPerson(price: number) {
  return `${new Intl.NumberFormat("vi-VN").format(price)}đ/ người`;
}

function regionMeta(region: "north" | "south") {
  return region === "north"
    ? { label: "Miền Bắc", className: "bg-blue-100 text-blue-700" }
    : { label: "Miền Nam", className: "bg-green-100 text-green-700" };
}

function nearestDepartureValue(tour: Tour) {
  const schedules = getUpcomingSchedules(
    tour.slug,
    { isoDate: tour.date, label: tour.dateRange, spotsLeft: tour.spotsLeft }
  );

  return schedules[0]?.isoDate ?? "9999-12-31";
}

export default function ToursPage() {
  const [filters, setFilters] = useState<TourFilterState>(EMPTY_TOUR_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("departure-asc");
  const [sortOpen, setSortOpen] = useState(false);

  const filteredTours = useMemo(() => {
    const matched = tours.filter((tour) => {
      const region = regionMeta(tour.region).label;
      const matchRegion = filters.regions.length === 0 || filters.regions.includes(region);
      const matchDuration = filters.durations.length === 0 || filters.durations.includes(tour.duration);

      return matchRegion && matchDuration;
    });

    return matched.sort((a, b) => {
      if (sortBy === "price-desc") return b.priceNumber - a.priceNumber;
      if (sortBy === "price-asc") return a.priceNumber - b.priceNumber;

      const aDate = nearestDepartureValue(a);
      const bDate = nearestDepartureValue(b);
      return sortBy === "departure-desc"
        ? bDate.localeCompare(aDate)
        : aDate.localeCompare(bDate);
    });
  }, [filters, sortBy]);

  const showPagination = filteredTours.length > 9;

  return (
    <>
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-6">

          {/* ── Sidebar Filters ── */}
          <aside className="w-full">
            <TourFilters filters={filters} onChange={setFilters} />
          </aside>

          {/* ── Main Content ── */}
          <section className="w-full min-w-0">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-primary mb-2">
                  Tour du lịch tình nguyện
              </h1>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-base sm:text-lg text-on-surface-variant">
                  Chọn hành trình phù hợp và bắt đầu tạo ra sự thay đổi.
                </p>
              <div
                className="relative w-full sm:w-52 shrink-0"
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setSortOpen(false);
                }}
              >
                <button
                  type="button"
                  onClick={() => setSortOpen((open) => !open)}
                  className="w-full h-[42px] rounded-xl border border-outline-variant bg-white pl-9 pr-8 text-left text-sm font-bold text-primary shadow-sm transition-colors hover:border-primary/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  aria-haspopup="listbox"
                  aria-expanded={sortOpen}
                >
                  <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-primary" style={{ fontSize: 16 }}>sort</span>
                  {SORT_OPTIONS.find((option) => option.value === sortBy)?.label}
                  <span className={`material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary transition-transform ${sortOpen ? "rotate-180" : ""}`} style={{ fontSize: 16 }}>expand_more</span>
                </button>

                {sortOpen && (
                  <div
                    role="listbox"
                    className="absolute right-0 top-[calc(100%+6px)] z-20 w-full overflow-hidden rounded-xl border border-outline-variant bg-white py-1 shadow-lg"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        aria-selected={sortBy === option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setSortOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm font-semibold transition-colors ${
                          sortBy === option.value
                            ? "bg-primary/10 text-primary"
                            : "text-on-surface-variant hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              </div>
            </div>

            <div className="min-h-[420px] sm:min-h-[620px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredTours.length === 0 ? (
                <div className="sm:col-span-2 xl:col-span-3 min-h-[320px] rounded-xl border border-outline-variant/40 bg-white px-6 py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary" style={{ fontSize: 30 }}>travel_explore</span>
                  </div>
                  <p className="mt-4 text-base font-bold text-on-surface">Không có chương trình phù hợp</p>
                  <p className="mt-1 max-w-sm text-sm text-on-surface-variant">Bạn thử bỏ bớt bộ lọc để xem thêm chương trình khác.</p>
                  <button
                    type="button"
                    onClick={() => setFilters(EMPTY_TOUR_FILTERS)}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-primary px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                filteredTours.map((tour) => {
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
                      className="bg-pure-white rounded-xl overflow-hidden card-hover-shadow transition-all duration-300 border border-surface-variant group flex flex-col"
                    >
                      {/* Image */}
                      <div className="relative h-52 sm:h-56 shrink-0">
                        <img
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={tour.image}
                          alt={tour.title}
                        />
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="mb-4 flex-1">
                          <span className={`mb-2 inline-flex w-fit rounded-full px-2 py-0.5 text-xs font-bold ${region.className}`}>
                            {region.label}
                          </span>
                          <h3 className="text-base font-semibold text-primary mb-3 line-clamp-2">
                            {tour.title}
                          </h3>
                          <div className="space-y-2 text-xs">
                            <div className="flex h-5 items-center gap-2">
                              <span className="material-symbols-outlined w-[18px] text-[18px] leading-none text-primary">location_on</span>
                              <span className="font-semibold leading-5 text-on-surface">{tour.destinationName}</span>
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
                        </div>

                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-surface-variant">
                          <div>
                            <p className="text-xs text-outline mb-0.5">Chi phí từ</p>
                            <p className="text-base font-bold text-secondary">{formatPricePerPerson(tour.priceNumber)}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
              </div>
            </div>

            {showPagination && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-pure-white font-bold">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
                  3
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
