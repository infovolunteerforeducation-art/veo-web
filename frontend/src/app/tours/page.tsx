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

const FAQS = [
  {
    q: "Du lịch tình nguyện phù hợp với những ai?",
    a: "Du lịch tình nguyện VEO phù hợp với tất cả mọi người từ 15 tuổi trở lên — sinh viên, người đi làm, hay gia đình muốn trải nghiệm ý nghĩa. Bạn không cần kỹ năng chuyên môn đặc biệt, chỉ cần tinh thần sẵn sàng đóng góp và khám phá.",
  },
  {
    q: "Chi phí chương trình bao gồm những gì?",
    a: "Chi phí thường bao gồm: di chuyển từ điểm tập kết, ăn ở trong suốt hành trình, hoạt động tình nguyện có tổ chức, và hỗ trợ từ đội ngũ VEO. Chi phí cá nhân như vé máy bay đến điểm tập kết, đồ dùng cá nhân và chi tiêu tự do không nằm trong gói.",
  },
  {
    q: "Tôi có cần kinh nghiệm tình nguyện trước đó không?",
    a: "Không cần. Các chương trình của VEO được thiết kế cho cả người mới bắt đầu lẫn tình nguyện viên có kinh nghiệm. Đội ngũ điều phối viên sẽ hướng dẫn bạn từng bước trong suốt hành trình.",
  },
  {
    q: "Chương trình kéo dài bao lâu?",
    a: "Thời gian dao động từ 2–3 ngày cuối tuần đến 5–7 ngày cho các chuyến dài hơn. Mỗi chương trình đều hiển thị rõ thời gian trên trang chi tiết để bạn chủ động sắp xếp lịch.",
  },
  {
    q: "Làm thế nào để đăng ký tham gia?",
    a: "Chọn chương trình yêu thích, bấm \"Đăng ký ngay\", điền thông tin và chọn lịch khởi hành. Sau khi xác nhận thanh toán, bạn sẽ nhận thư xác nhận kèm thông tin chuẩn bị hành trình.",
  },
  {
    q: "Chính sách hoàn tiền và bảo lưu như thế nào?",
    a: "Nếu hủy trước 14 ngày khởi hành, bạn được bảo lưu 100% chi phí cho chuyến đi kế tiếp. Hủy trong vòng 7–14 ngày được bảo lưu 50%. Trong trường hợp VEO hủy chuyến vì lý do bất khả kháng, bạn được hoàn tiền toàn bộ hoặc đổi sang chuyến khác.",
  },
  {
    q: "Tôi có thể đăng ký theo nhóm không?",
    a: "Hoàn toàn có thể. Nhóm từ 2–9 người đăng ký cùng qua form thông thường. Nhóm từ 10 người trở lên vui lòng liên hệ trực tiếp với VEO để được tư vấn gói đoàn với ưu đãi riêng.",
  },
  {
    q: "VEO có cấp chứng nhận tình nguyện không?",
    a: "Có. Sau khi hoàn thành chuyến đi, tình nguyện viên nhận Chứng nhận Tình nguyện VEO ghi rõ chương trình, thời gian và số giờ đóng góp — có giá trị bổ sung vào hồ sơ học tập và nghề nghiệp.",
  },
] as const;

export default function ToursPage() {
  const [filters, setFilters] = useState<TourFilterState>(EMPTY_TOUR_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>("departure-asc");
  const [sortOpen, setSortOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

        {/* ── Divider ── */}
        <div className="mt-20 flex items-center gap-4">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-outline-variant/30 bg-white text-xs font-semibold text-on-surface-variant shrink-0">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
            Tìm hiểu thêm về du lịch tình nguyện
          </span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        {/* ── SEO Section ── */}
        <div className="mt-10 space-y-16">

          {/* What is volunteer travel */}
          <section>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                Về du lịch tình nguyện
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface mb-4">Du lịch tình nguyện là gì?</h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
                Du lịch tình nguyện — hay <strong className="text-on-surface">Volunteer Travel</strong> — là hình thức kết hợp giữa hành trình khám phá và hoạt động đóng góp có ý nghĩa cho cộng đồng địa phương. Thay vì chỉ đến, nhìn và rời đi, bạn ở lại, làm việc cùng người dân và để lại dấu ấn thật sự.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  icon: "school",
                  title: "Giáo dục & Cộng đồng",
                  desc: "Tham gia xây trường, dạy học, tặng học bổng cho trẻ em vùng cao — mỗi viên gạch bạn đặt là một tương lai được thắp sáng.",
                },
                {
                  icon: "nature",
                  title: "Môi trường & Thiên nhiên",
                  desc: "Trồng cây, làm sạch bãi biển, bảo tồn hệ sinh thái — hành động nhỏ của bạn hôm nay bảo vệ hành tinh cho thế hệ mai sau.",
                },
                {
                  icon: "psychology",
                  title: "Phát triển bản thân",
                  desc: "Ra khỏi vùng an toàn, rèn luyện kỹ năng lãnh đạo, làm việc nhóm và xây dựng mạng lưới bạn bè tình nguyện trên khắp Việt Nam.",
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-outline-variant/20 p-6 shadow-[0px_4px_20px_rgba(108,42,138,0.06)]">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-on-surface mb-2">{item.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-primary/5 to-deep-amethyst/5 rounded-2xl border border-primary/10 p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div>
                  <h3 className="text-lg font-bold text-on-surface mb-3">Tại sao chọn VEO?</h3>
                  <ul className="space-y-2.5">
                    {[
                      "Hành trình được thiết kế bài bản, an toàn và có tổ chức",
                      "Đội ngũ điều phối viên giàu kinh nghiệm đồng hành xuyên suốt",
                      "Hoạt động tình nguyện gắn với nhu cầu thực tế của cộng đồng",
                      "Cấp chứng nhận tình nguyện có giá trị học thuật và nghề nghiệp",
                    ].map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm text-on-surface">
                        <span className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "500+", label: "Tình nguyện viên đã tham gia" },
                    { value: "20+", label: "Chương trình trên cả nước" },
                    { value: "5+", label: "Năm hoạt động" },
                    { value: "15+", label: "Cộng đồng được hỗ trợ" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-4 text-center border border-outline-variant/20">
                      <p className="text-2xl font-bold text-primary">{stat.value}</p>
                      <p className="text-xs text-on-surface-variant mt-1 leading-snug">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section>
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-solar-orange/10 text-solar-orange text-sm font-semibold mb-3">
                <span className="material-symbols-outlined text-base">help</span>
                Câu hỏi thường gặp
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-on-surface">Giải đáp thắc mắc</h2>
            </div>

            <div className="max-w-3xl mx-auto divide-y divide-outline-variant/30 rounded-2xl border border-outline-variant/20 bg-white overflow-hidden shadow-[0px_4px_20px_rgba(108,42,138,0.06)]">
              {FAQS.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left hover:bg-surface-container/40 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-on-surface text-sm sm:text-base leading-snug">{faq.q}</span>
                      <span className={`material-symbols-outlined text-primary shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} style={{ fontSize: 20 }}>expand_more</span>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5">
                        <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <p className="text-on-surface-variant text-sm mb-3">Vẫn còn thắc mắc? Đội ngũ VEO luôn sẵn sàng hỗ trợ bạn.</p>
              <Link href="/lien-he" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-colors">
                <span className="material-symbols-outlined text-base">chat</span>
                Liên hệ VEO
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
