import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCampBySlug, camps } from "@/lib/trai-he-data";
import CampActivitiesTabs from "@/components/trai-he/CampActivitiesTabs";
import CampBookingSidebar from "@/components/trai-he/CampBookingSidebar";
import TourItinerary from "@/components/tours/TourItinerary";

export async function generateStaticParams() {
  return camps.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const camp = getCampBySlug(slug);
  if (!camp) return {};
  return {
    title: `${camp.title} – Trại hè tình nguyện VEO 2026`,
    description: `Trại hè tình nguyện tại ${camp.location}. ${camp.volunteer[0]}`,
  };
}

const requirements = [
  {
    icon: "groups",
    label: "Độ tuổi",
    description: "Học sinh, sinh viên từ 10 đến 22 tuổi.",
  },
  {
    icon: "health_and_safety",
    label: "Sức khỏe",
    description:
      "Có sức khỏe tốt, sẵn sàng tham gia hoạt động ngoài trời và lao động nhẹ cùng cộng đồng.",
  },
  {
    icon: "family_restroom",
    label: "Phụ huynh",
    description:
      "Học viên dưới 15 tuổi cần đi cùng phụ huynh hoặc người giám hộ được uỷ quyền.",
  },
  {
    icon: "volunteer_activism",
    label: "Tinh thần tình nguyện",
    description:
      "Nhiệt tình, có trách nhiệm và tôn trọng văn hóa, phong tục địa phương.",
  },
];

export default async function CampDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const camp = getCampBySlug(slug);
  if (!camp) notFound();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative h-[480px] sm:h-[540px] lg:h-[580px] w-full overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={camp.image}
            alt={camp.title}
          />
          <div className="absolute inset-0 hero-gradient flex items-end">
            <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 pb-10 sm:pb-14 lg:pb-16">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-solar-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                  Trại hè tình nguyện VEO 2026
                </span>
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  {camp.location}
                </span>
              </div>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight max-w-3xl">
                {camp.title}
              </h1>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                Hành trình 6 ngày 5 đêm tại {camp.location} — kết hợp hoạt động tình nguyện thực tế và
                trải nghiệm văn hóa bản địa dành cho học sinh, sinh viên.
              </p>
            </div>
          </div>
        </section>

        {/* Main content */}
        <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-5 sm:pt-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-6">

          {/* Left column: breadcrumb + content */}
          <div className="lg:col-span-8 order-last lg:order-none">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-8 sm:mb-10">
              <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
              <span className="material-symbols-outlined text-base">chevron_right</span>
              <Link href="/trai-he-tinh-nguyen" className="hover:text-primary transition-colors">Trại hè tình nguyện</Link>
              <span className="material-symbols-outlined text-base">chevron_right</span>
              <span className="text-primary font-semibold line-clamp-1">{camp.title}</span>
            </nav>
            <div className="space-y-10 sm:space-y-12">

            {/* Activities Tabs */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
                <span className="material-symbols-outlined text-3xl sm:text-4xl shrink-0">volunteer_activism</span>
                Hoạt động trong chương trình
              </h2>
              <CampActivitiesTabs volunteer={camp.volunteer} experience={camp.experience} />
            </div>

            {/* Lịch trình chi tiết */}
            {camp.itinerary.length > 0 && (
              <div id="lich-trinh">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl shrink-0">event_note</span>
                  Lịch trình chi tiết
                </h2>
                <TourItinerary itinerary={camp.itinerary} />
              </div>
            )}

            {/* Yêu cầu tham gia */}
            <div id="yeu-cau">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
                <span className="material-symbols-outlined text-3xl sm:text-4xl shrink-0">person_search</span>
                Yêu cầu tham gia
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {requirements.map((req) => (
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

            {/* Chi phí */}
            <div id="chi-phi">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-5 sm:mb-6 flex items-start sm:items-center gap-3">
                <span className="material-symbols-outlined text-3xl sm:text-4xl shrink-0">receipt_long</span>
                Lưu ý chương trình
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white border border-outline-variant/30 rounded-xl p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                    Chi phí đã bao gồm
                  </h3>
                  <ul className="space-y-3">
                    {camp.included.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-on-surface-variant">
                        <span className="material-symbols-outlined text-green-500 text-lg shrink-0 mt-0.5">check</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-outline-variant/30 rounded-xl p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-red-400">cancel</span>
                    Chi phí chưa bao gồm
                  </h3>
                  <ul className="space-y-3">
                    {camp.notIncluded.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-base text-on-surface-variant">
                        <span className="material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5">close</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {camp.policies.length > 0 && (
                <div className="mt-4 sm:mt-6 bg-white border border-outline-variant/30 rounded-xl p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-primary mb-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">policy</span>
                    Chính sách chương trình
                  </h3>
                  <div className="space-y-5">
                    {camp.policies.map((policy) => (
                      <div key={policy.title}>
                        <h4 className="text-base font-bold text-on-surface mb-3 flex items-center gap-2">
                          <span
                            className="material-symbols-outlined text-solar-orange shrink-0"
                            style={{ fontSize: 18 }}
                          >
                            {policy.icon}
                          </span>
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

          {/* Right column: sticky sidebar */}
          <div className="lg:col-span-4 order-first lg:order-none">
            <div className="lg:sticky lg:top-24">
              <CampBookingSidebar camp={camp} />
            </div>
          </div>
          </div>{/* end grid */}
        </section>
      </main>
      <Footer />
    </>
  );
}
