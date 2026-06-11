import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getCampBySlug, camps } from "@/lib/trai-he-data";
import RegistrationForm from "@/components/tours/RegistrationForm";
import SessionTimer from "@/components/tours/SessionTimer";

export async function generateStaticParams() {
  return camps.map((c) => ({ slug: c.slug }));
}

export default async function CampDangKyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { slug } = await params;
  const { date } = await searchParams;
  const camp = getCampBySlug(slug);
  if (!camp) notFound();

  const selectedDate = date ?? "";
  const selectedSchedule = camp.dates.find((d) => d.isoDate === selectedDate);

  // Build a minimal Tour-shaped object so RegistrationForm can reuse it unchanged
  const tourProxy = {
    slug: camp.slug,
    title: camp.title,
    dateRange: selectedSchedule?.label ?? selectedDate,
    location: camp.location,
    price: `${camp.price} / người`,
  } as Parameters<typeof RegistrationForm>[0]["tour"];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/trai-he-tinh-nguyen" className="hover:text-primary transition-colors">Trại hè tình nguyện</Link>
            <span>/</span>
            <Link href={`/trai-he-tinh-nguyen/${camp.slug}`} className="hover:text-primary transition-colors line-clamp-1 max-w-[140px]">{camp.title}</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">Đăng ký</span>
          </nav>

          {/* Steps + timer */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
              <span className="text-xs font-semibold text-primary">Thông tin</span>
            </div>
            <div className="flex-1 h-px bg-outline-variant" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-xs text-on-surface-variant">Thanh toán</span>
            </div>
            <SessionTimer
              tourSlug={camp.slug}
              returnPath={`/trai-he-tinh-nguyen/${camp.slug}`}
            />
          </div>

          {/* Camp header card */}
          <div className="bg-deep-amethyst text-pure-white rounded-2xl p-5 mb-6">
            <p className="text-xs font-semibold text-on-primary-container mb-1">Đăng ký tham gia trại hè</p>
            <h1 className="text-xl font-bold mb-3">{camp.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/80">
              {selectedSchedule && (
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_month</span>
                  {selectedSchedule.label}
                </span>
              )}
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                {camp.location}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>payments</span>
                {camp.price} / người
              </span>
            </div>
          </div>

          <RegistrationForm
            tour={tourProxy}
            selectedDate={selectedDate}
            paymentPath={`/trai-he-tinh-nguyen/${camp.slug}/thanh-toan`}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
