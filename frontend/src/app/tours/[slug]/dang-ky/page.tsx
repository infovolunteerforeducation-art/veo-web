import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getTourBySlug, tours } from "@/lib/tours";
import RegistrationForm from "@/components/tours/RegistrationForm";
import SessionTimer from "@/components/tours/SessionTimer";

export async function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export default async function DangKyPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const { slug } = await params;
  const { date } = await searchParams;
  const tour = getTourBySlug(slug);
  if (!tour) notFound();
  const selectedDate = date ?? "";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-surface py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-6 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <span>/</span>
            <Link href="/tours" className="hover:text-primary transition-colors">Du lịch tình nguyện</Link>
            <span>/</span>
            <Link href={`/tours/${tour.slug}`} className="hover:text-primary transition-colors line-clamp-1 max-w-[140px]">{tour.title}</Link>
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
            <SessionTimer tourSlug={tour.slug} />
          </div>

          {/* Tour header card */}
          <div className="bg-deep-amethyst text-pure-white rounded-2xl p-5 mb-6">
            <p className="text-xs font-semibold text-on-primary-container mb-1">Đăng ký tham gia</p>
            <h1 className="text-xl font-bold mb-3">{tour.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/80">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_month</span>
                {tour.dateRange}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
                {tour.location}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>payments</span>
                {tour.price} / người
              </span>
            </div>
          </div>

          <RegistrationForm tour={tour} selectedDate={selectedDate} />
        </div>
      </main>
      <Footer />
    </>
  );
}
