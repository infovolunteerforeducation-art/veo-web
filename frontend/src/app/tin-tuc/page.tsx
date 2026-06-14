import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { articles, allCategories, categoryMap, type Article } from "./articles";
import { getBlogContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

function formatDateVN(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function isHtmlContent(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function getAllArticles(): Article[] {
  const cms = getBlogContent();
  const published = cms.articles
    .filter((a) => a.status === "published")
    .map((a): Article => {
      const cat = categoryMap[a.categorySlug] ?? { name: a.categorySlug, class: "bg-primary text-white" };
      const hasHtml = isHtmlContent(a.content);
      return {
        slug: a.slug,
        category: cat.name,
        categorySlug: a.categorySlug,
        categoryClass: cat.class,
        date: formatDateVN(a.publishedAt ?? a.updatedAt),
        image: a.coverImage || "/og-default.jpg",
        title: a.title,
        excerpt: a.excerpt,
        readTime: a.readTime || 3,
        featured: a.featured,
        bodyHtml: hasHtml ? a.content : undefined,
        body: hasHtml ? [] : a.content.split(/\n\n+/).filter(Boolean).map((text) => ({ type: "p" as const, text })),
      };
    });
  const hardcodedSlugs = new Set(published.map((a) => a.slug));
  return [...published, ...articles.filter((a) => !hardcodedSlugs.has(a.slug))];
}

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện – VEO Travel",
  description:
    "Cập nhật tin tức mới nhất về các chuyến đi tình nguyện, câu chuyện cảm hứng từ tình nguyện viên và các sự kiện sắp diễn ra của VEO.",
};

const PAGE_SIZE = 9;

function ArticleCard({ article: a }: { article: Article }) {
  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden border border-outline-variant/30 bg-white shadow-sm hover:shadow-md transition-shadow">
      <Link
        href={`/tin-tuc/${a.slug}`}
        className="block overflow-hidden"
        style={{ aspectRatio: "1.91/1" }}
      >
        <img
          src={a.image}
          alt={a.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <Link
          href={`/tin-tuc/tag/${a.categorySlug}`}
          className={`text-xs font-bold px-3 py-1 rounded-full self-start mb-3 hover:opacity-80 transition-opacity ${a.categoryClass}`}
        >
          {a.category}
        </Link>
        <Link href={`/tin-tuc/${a.slug}`} className="flex flex-col flex-1">
          <h3 className="text-base font-bold text-primary leading-snug mb-2 flex-1 group-hover:text-solar-orange transition-colors">
            {a.title}
          </h3>
          <p className="text-xs text-on-surface-variant mb-3">{a.date}</p>
        </Link>
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2 mb-4">
          {a.excerpt}
        </p>
        <Link
          href={`/tin-tuc/${a.slug}`}
          className="inline-flex items-center gap-1 text-solar-orange font-semibold text-sm mt-auto"
        >
          Đọc tiếp
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 ? (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="w-9 h-9 rounded-full border border-outline-variant/50 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-base">chevron_left</span>
        </Link>
      ) : (
        <span className="w-9 h-9 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant/30">
          <span className="material-symbols-outlined text-base">chevron_left</span>
        </span>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={`${baseUrl}?page=${p}`}
          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
            p === currentPage
              ? "bg-primary text-pure-white"
              : "border border-outline-variant/50 hover:border-primary hover:text-primary"
          }`}
        >
          {p}
        </Link>
      ))}
      {currentPage < totalPages ? (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="w-9 h-9 rounded-full border border-outline-variant/50 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </Link>
      ) : (
        <span className="w-9 h-9 rounded-full border border-outline-variant/20 flex items-center justify-center text-on-surface-variant/30">
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </span>
      )}
    </div>
  );
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));

  const allArticles = getAllArticles();
  const featured = allArticles.find((a) => a.featured);
  const rest = allArticles.filter((a) => !a.featured);

  const totalPages = Math.ceil(rest.length / PAGE_SIZE);
  const paginated = rest.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
            {allCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.slug ? `/tin-tuc/tag/${cat.slug}` : "/tin-tuc"}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  !cat.slug
                    ? "bg-deep-amethyst text-pure-white"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Featured article */}
          {featured && currentPage === 1 && (
            <div className="group mb-10 rounded-2xl overflow-hidden border border-outline-variant/30 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <Link
                  href={`/tin-tuc/${featured.slug}`}
                  className="block h-64 md:h-auto overflow-hidden"
                >
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="p-8 flex flex-col justify-center">
                  <Link
                    href={`/tin-tuc/tag/${featured.categorySlug}`}
                    className={`text-xs font-bold px-3 py-1 rounded-full self-start mb-4 hover:opacity-80 transition-opacity ${featured.categoryClass}`}
                  >
                    {featured.category}
                  </Link>
                  <Link href={`/tin-tuc/${featured.slug}`}>
                    <h2 className="text-2xl font-bold text-primary leading-snug mb-2 group-hover:text-solar-orange transition-colors">
                      {featured.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-on-surface-variant mb-4">{featured.date}</p>
                  <p className="text-on-surface-variant leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <Link
                    href={`/tin-tuc/${featured.slug}`}
                    className="inline-flex items-center gap-1 text-solar-orange font-semibold text-sm"
                  >
                    Đọc tiếp
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/tin-tuc" />
        </section>
      </main>
      <Footer />
    </>
  );
}
