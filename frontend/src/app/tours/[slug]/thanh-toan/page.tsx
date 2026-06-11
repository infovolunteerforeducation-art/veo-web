import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getTourBySlug, tours } from "@/lib/tours";
import PaymentClient from "@/components/tours/PaymentClient";
import SessionTimer from "@/components/tours/SessionTimer";

export async function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export default async function ThanhToanPage({
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
            <Link href={`/tours/${tour.slug}/dang-ky`} className="hover:text-primary transition-colors">Đăng ký</Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">Thanh toán</span>
          </nav>

          {/* Steps + timer */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">✓</span>
              <span className="text-xs text-on-surface-variant">Thông tin</span>
            </div>
            <div className="flex-1 h-px bg-primary/30" />
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
              <span className="text-xs font-semibold text-primary">Thanh toán</span>
            </div>
            <SessionTimer tourSlug={tour.slug} />
          </div>

          <PaymentClient tour={tour} />
        </div>
      </main>
      <Footer />
    </>
  );
}
