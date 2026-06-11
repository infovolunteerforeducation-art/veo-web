import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện – VEO Travel",
  description:
    "Cập nhật tin tức mới nhất về các chuyến đi tình nguyện, câu chuyện cảm hứng từ tình nguyện viên và các sự kiện sắp diễn ra của VEO.",
};

type Article = {
  slug: string;
  category: string;
  categoryClass: string;
  date: string;
  image: string;
  title: string;
  excerpt: string;
  featured?: boolean;
};

const articles: Article[] = [
  {
    slug: "hanh-trinh-10-nam-veo",
    category: "Về VEO",
    categoryClass: "bg-deep-amethyst text-pure-white",
    date: "05/06/2026",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=500&fit=crop",
    title: "10 năm VEO – Hành trình từ ước mơ nhỏ đến cộng đồng 50.000 tình nguyện viên",
    excerpt:
      "Nhìn lại chặng đường 10 năm kết nối những trái tim thiện nguyện, từ chuyến đi đầu tiên chỉ với 8 người đến hôm nay với hơn 50.000 tình nguyện viên khắp cả nước.",
    featured: true,
  },
  {
    slug: "workcamp-2026-mo-dang-ky",
    category: "Sự kiện",
    categoryClass: "bg-solar-orange text-pure-white",
    date: "01/06/2026",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=500&fit=crop",
    title: "Workcamp Quốc tế 2026 chính thức mở đăng ký – Kết nối tình nguyện viên từ 15 quốc gia",
    excerpt:
      "Chương trình Workcamp Quốc tế lần thứ 5 sẽ diễn ra tại Hà Giang, quy tụ tình nguyện viên từ 15 quốc gia cùng xây dựng điểm trường và hỗ trợ cộng đồng vùng cao.",
  },
  {
    slug: "cau-chuyen-lan-phuong",
    category: "Câu chuyện",
    categoryClass: "bg-tertiary-container text-pure-white",
    date: "28/05/2026",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=500&fit=crop",
    title: 'Bác sĩ Lan Phương và 3 mùa hè tình nguyện tại vùng cao: "Đây là nơi tôi cảm thấy sống thật nhất"',
    excerpt:
      'Từ một chuyến đi "thử cho biết", bác sĩ Lan Phương đã gắn bó với VEO suốt 3 năm liên tiếp. Câu chuyện của chị về y tế cộng đồng và tình người vùng cao.',
  },
  {
    slug: "doi-tac-techcombank-2026",
    category: "Đối tác",
    categoryClass: "bg-secondary-container text-on-secondary-container",
    date: "20/05/2026",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=500&fit=crop",
    title: "VEO hợp tác cùng Techcombank triển khai chương trình CSR cho 500 nhân viên năm 2026",
    excerpt:
      "Chương trình CSR quy mô lớn nhất từ trước đến nay của VEO – đưa 500 nhân viên Techcombank đến với các bản làng vùng núi phía Bắc trong 6 tháng cuối năm.",
  },
  {
    slug: "ly-son-ket-qua-chien-dich",
    category: "Hoạt động",
    categoryClass: "bg-solar-orange text-pure-white",
    date: "15/05/2026",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop",
    title: "Chiến dịch Lý Sơn: Thu gom được 1,2 tấn rác thải nhựa sau 3 ngày tình nguyện",
    excerpt:
      "Kết quả vượt kỳ vọng: 80 tình nguyện viên cùng ngư dân địa phương đã thu gom 1,2 tấn rác nhựa khỏi bãi biển và rạn san hô tại đảo Lý Sơn.",
  },
  {
    slug: "bai-giang-tinh-nguyen-truong-dai-hoc",
    category: "Câu chuyện",
    categoryClass: "bg-tertiary-container text-pure-white",
    date: "08/05/2026",
    image:
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800&h=500&fit=crop",
    title: "Khi sinh viên Đại học Ngoại Thương mang tiếng Anh lên bản Mèo Vạc",
    excerpt:
      "Nhóm 12 sinh viên tình nguyện từ Đại học Ngoại Thương đã tổ chức 15 buổi dạy tiếng Anh miễn phí cho học sinh THCS tại Mèo Vạc, Hà Giang.",
  },
];

const categories = ["Tất cả", "Hoạt động", "Câu chuyện", "Sự kiện", "Đối tác", "Về VEO"];

export default function NewsPage() {
  const featured = articles.find((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-deep-amethyst py-20 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <p className="text-solar-orange font-semibold text-sm uppercase tracking-widest mb-3">
              Cập nhật mới nhất
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-5 leading-tight">
              Tin tức & Sự kiện
            </h1>
            <p className="text-pure-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
              Câu chuyện từ những hành trình, thông tin về các sự kiện sắp diễn ra và cập nhật hoạt động mới nhất từ cộng đồng VEO.
            </p>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 py-12">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat, i) => (
              <button
                key={cat}
                type="button"
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  i === 0
                    ? "bg-deep-amethyst text-pure-white"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured article */}
          {featured && (
            <Link
              href={`/tin-tuc/${featured.slug}`}
              className="group block mb-10 rounded-2xl overflow-hidden border border-outline-variant/30 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-auto overflow-hidden">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${featured.categoryClass}`}>
                      {featured.category}
                    </span>
                    <span className="text-xs text-on-surface-variant">{featured.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-primary leading-snug mb-4 group-hover:text-solar-orange transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed mb-6">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-solar-orange font-semibold text-sm">
                    Đọc tiếp
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/tin-tuc/${article.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden border border-outline-variant/30 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${article.categoryClass}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-on-surface-variant">{article.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-primary leading-snug mb-3 flex-1 group-hover:text-solar-orange transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-solar-orange font-semibold text-sm mt-auto">
                    Đọc tiếp
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
