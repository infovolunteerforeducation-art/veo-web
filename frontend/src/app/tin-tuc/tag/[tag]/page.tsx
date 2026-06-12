import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { articles, allCategories, categoryMap, type Article } from "../../articles";

type Props = { params: Promise<{ tag: string }>; searchParams: Promise<{ page?: string }> };

const PAGE_SIZE = 9;

export async function generateStaticParams() {
  return Object.keys(categoryMap).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const cat = categoryMap[tag];
  if (!cat) return {};
  return {
    title: `${cat.name} – Tin tức VEO`,
    description: `Các bài viết về ${cat.name} từ VEO Travel.`,
  };
}

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

export default async function TagPage({ params, searchParams }: Props) {
  const { tag } = await params;
  const { page } = await searchParams;

  const cat = categoryMap[tag];
  if (!cat) notFound();

  const currentPage = Math.max(1, parseInt(page || "1"));
  const filtered = articles.filter((a) => a.categorySlug === tag);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const baseUrl = `/tin-tuc/tag/${tag}`;

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-deep-amethyst py-20 px-6">
          <div className="max-w-[1200px] mx-auto text-center">
            <Link
              href="/tin-tuc"
              className="inline-flex items-center gap-1 text-pure-white/60 text-sm hover:text-pure-white transition-colors mb-4"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Tất cả tin tức
            </Link>
            <div className="flex justify-center mb-4">
              <span className={`text-xs font-bold px-4 py-1.5 rounded-full ${cat.class}`}>
                {cat.name}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-pure-white mb-4 leading-tight">
              {cat.name}
            </h1>
            <p className="text-pure-white/70 text-sm">
              {filtered.length} bài viết
            </p>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 py-12">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {allCategories.map((c) => (
              <Link
                key={c.name}
                href={c.slug ? `/tin-tuc/tag/${c.slug}` : "/tin-tuc"}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  c.slug === tag
                    ? "bg-deep-amethyst text-pure-white"
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                {c.name}
              </Link>
            ))}
          </div>

          {paginated.length === 0 ? (
            <div className="text-center py-24 text-on-surface-variant">
              <span
                className="material-symbols-outlined text-5xl mb-4 block"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                article
              </span>
              <p className="text-lg font-semibold mb-2">Chưa có bài viết nào</p>
              <p className="text-sm">Quay lại sau nhé!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginated.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                baseUrl={baseUrl}
              />
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
