import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getTourBySlug, tours } from "@/lib/tours";
import BookingSidebar from "@/components/tours/BookingSidebar";
import TourItinerary from "@/components/tours/TourItinerary";


export async function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) return {};
  return {
    title: `${tour.title} – VEO Travel`,
    description: tour.heroDescription,
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();
  return (
    <>
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative h-[520px] sm:h-[560px] lg:h-[600px] w-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={tour.image}
            alt={tour.title}
          />
          <div className="absolute inset-0 hero-gradient flex items-end">
            <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 pb-10 sm:pb-14 lg:pb-16">
              <div className="flex gap-2 mb-4">
                <span className="bg-solar-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                  Du lịch tình nguyện
                </span>
              </div>
              <h1 className="text-white text-4xl sm:text-5xl font-bold mb-4 leading-tight">
                {tour.title}
              </h1>
              <p className="text-white/90 text-base sm:text-lg max-w-2xl leading-relaxed">
                {tour.heroDescription}
              </p>
            </div>
          </div>
        </section>

        {/* ── Main content ── */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-8 order-last lg:order-none">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 sm:mb-10">
              <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              <span className="material-symbols-outlined text-base">chevron_right</span>
              <Link href="/tours" className="hover:text-primary transition-colors">Du lịch tình nguyện</Link>
              <span className="material-symbols-outlined text-base">chevron_right</span>
              <span className="text-primary font-semibold line-clamp-1">{tour.title}</span>
            </nav>

            <div className="space-y-10 sm:space-y-12">

            {/* Mục tiêu chương trình */}
            <div id="muc-tieu">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
                <span className="material-symbols-outlined text-3xl sm:text-4xl shrink-0">target</span>
                Mục tiêu chương trình
              </h2>
              <div className="bg-white p-5 sm:p-8 rounded-xl border border-outline-variant/30 leading-relaxed text-on-surface-variant">
                <p className="mb-4 text-base">
                  {tour.goalsDescription ?? `Chương trình "${tour.title}" tập trung vào những hoạt động cụ thể giúp tình nguyện viên đóng góp thiết thực cho cộng đồng địa phương và có trải nghiệm học hỏi ý nghĩa trong suốt chuyến đi.`}
                </p>
                <ul className="space-y-3">
                  {tour.goals.map((goal) => (
                    <li key={goal} className="flex gap-3 text-base">
                      <span className="material-symbols-outlined text-solar-orange shrink-0">
                        check_circle
                      </span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Yêu cầu tình nguyện viên */}
            <div id="yeu-cau">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
                <span className="material-symbols-outlined text-3xl sm:text-4xl shrink-0">person_search</span>
                Yêu cầu tình nguyện viên
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {tour.requirements.map((req) => (
                  <div key={req.label} className="bg-white border border-outline-variant/30 p-5 sm:p-6 rounded-xl">
                    <h4 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined">{req.icon}</span>
                      {req.label}
                    </h4>
                    <p className="text-base text-on-surface-variant">{req.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lịch trình chi tiết */}
            {tour.itinerary?.some((d) => d.activities?.length > 0) && (
              <div id="lich-trinh">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl shrink-0">event_note</span>
                  Lịch trình chi tiết
                </h2>
                <TourItinerary itinerary={tour.itinerary} />
              </div>
            )}

            {/* Lưu ý chuyến đi */}
            <div id="chi-phi">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
                <span className="material-symbols-outlined text-3xl sm:text-4xl shrink-0">receipt_long</span>
                Lưu ý chuyến đi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Bao gồm */}
                <div className="bg-white border border-outline-variant/30 rounded-xl p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    Chi phí đã bao gồm
                  </h3>
                  <ul className="space-y-3">
                    {tour.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-on-surface-variant">
                        <span className="material-symbols-outlined text-green-500 text-lg shrink-0 mt-0.5">check</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Không bao gồm */}
                <div className="bg-white border border-outline-variant/30 rounded-xl p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400">cancel</span>
                    Chi phí chưa bao gồm
                  </h3>
                  <ul className="space-y-3">
                    {tour.notIncluded.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-on-surface-variant">
                        <span className="material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5">close</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Chính sách chuyến đi */}
              {tour.policies && tour.policies.length > 0 && (
                <div className="mt-4 sm:mt-6 bg-white border border-outline-variant/30 rounded-xl p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-primary mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">policy</span>
                    Chính sách chuyến đi
                  </h3>
                  <div className="space-y-5">
                    {tour.policies.map((policy) => (
                      <div key={policy.title}>
                        <h4 className="text-base font-bold text-on-surface mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-solar-orange shrink-0" style={{ fontSize: 18 }}>{policy.icon}</span>
                          {policy.title}
                        </h4>
                        <ul className="space-y-2">
                          {policy.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-base text-on-surface-variant">
                              <span className="w-1.5 h-1.5 rounded-full bg-solar-orange shrink-0 mt-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            </div>{/* end space-y-10 */}
          </div>{/* end left col */}

          {/* ── Right column: sticky sidebar ── */}
          <div className="lg:col-span-4 order-first lg:order-none">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* Trip summary card + schedule picker */}
              <BookingSidebar tour={tour} />

              {/* Tác động tới địa phương */}
              <div className="bg-deep-amethyst text-pure-white p-6 rounded-xl">
                <h4 className="text-base font-semibold mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined">analytics</span>
                  Tác động tới địa phương
                </h4>
                <div className="space-y-4">
                  {tour.impactMetrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{metric.label}</span>
                        <span>{metric.percent}%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-solar-orange h-full rounded-full"
                          style={{ width: `${metric.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini testimonial */}
              <div className="bg-white p-6 rounded-xl border border-outline-variant/30 relative">
                <span className="material-symbols-outlined absolute -top-3 -left-1 text-4xl text-solar-orange opacity-50">
                  format_quote
                </span>
                <p className="italic text-on-surface-variant text-sm leading-relaxed">
                  &ldquo;{tour.miniTestimonial.quote}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest shrink-0" />
                  <div>
                    <div className="font-bold text-primary text-sm">{tour.miniTestimonial.name}</div>
                    <div className="text-xs text-on-surface-variant">{tour.miniTestimonial.role}</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
          </div>{/* end grid */}
        </section>
      </main>
      <Footer />
    </>
  );
}
