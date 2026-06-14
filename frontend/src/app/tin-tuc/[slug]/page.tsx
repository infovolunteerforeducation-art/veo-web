import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { articles, categoryMap, type Article, type ContentBlock } from "../articles";
import { getBlogContent } from "@/lib/cms-content";

function formatDateVN(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function isHtmlContent(content: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function findArticle(slug: string): Article | undefined {
  const hardcoded = articles.find((a) => a.slug === slug);
  if (hardcoded) return hardcoded;
  const cms = getBlogContent();
  const found = cms.articles.find((a) => a.slug === slug && a.status === "published");
  if (!found) return undefined;
  const cat = categoryMap[found.categorySlug] ?? { name: found.categorySlug, class: "bg-primary text-white" };
  const hasHtml = isHtmlContent(found.content);
  return {
    slug: found.slug,
    category: cat.name,
    categorySlug: found.categorySlug,
    categoryClass: cat.class,
    date: formatDateVN(found.publishedAt ?? found.updatedAt),
    image: found.coverImage || "/og-default.jpg",
    title: found.title,
    excerpt: found.excerpt,
    readTime: found.readTime || 3,
    featured: found.featured,
    bodyHtml: hasHtml ? found.content : undefined,
    body: hasHtml ? [] : found.content.split(/\n\n+/).filter(Boolean).map((text) => ({ type: "p" as const, text })),
  };
}

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+=(["']).*?\1/gi, "")
    .replace(/\shref=(["'])javascript:[^"']*\1/gi, "")
    .replace(/\ssrc=(["'])javascript:[^"']*\1/gi, "");
}

function extractHtmlHeadings(html: string): Array<{ type: "h2" | "h3"; text: string }> {
  const headings: Array<{ type: "h2" | "h3"; text: string }> = [];
  for (const match of html.matchAll(/<(h2|h3)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/gi)) {
    headings.push({ type: match[1].toLowerCase() as "h2" | "h3", text: stripHtml(match[2]) });
  }
  return headings;
}

function addHeadingIds(html: string): string {
  return sanitizeArticleHtml(html).replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs: string, inner: string) => {
      if (/\sid=/.test(attrs)) return full;
      const id = slugifyHeading(stripHtml(inner));
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );
}

function parseDateVN(date: string): number {
  const [d, m, y] = date.split("/").map(Number);
  return new Date(y, m - 1, d).getTime();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} – VEO`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.image, width: 1200, height: 628, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  };
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          id={slugifyHeading(block.text)}
          className="text-xl font-bold text-primary mt-10 mb-4 scroll-mt-24"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3
          key={i}
          id={slugifyHeading(block.text)}
          className="text-lg font-semibold text-on-surface mt-7 mb-3 scroll-mt-24"
        >
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p key={i} className="text-on-surface leading-relaxed mb-5">
          {block.text}
        </p>
      );
    case "quote":
      return (
        <blockquote
          key={i}
          className="my-8 pl-6 border-l-4 border-solar-orange bg-surface-container-low rounded-r-xl py-5 pr-6"
        >
          <p className="text-on-surface italic leading-relaxed mb-3">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.author && (
            <p className="text-sm font-semibold text-solar-orange">— {block.author}</p>
          )}
        </blockquote>
      );
    case "ul":
      return (
        <ul key={i} className="mb-5 space-y-2 pl-2">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3 text-on-surface leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-solar-orange shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
  }
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
      <div className="p-5 flex flex-col flex-1">
        <Link
          href={`/tin-tuc/tag/${a.categorySlug}`}
          className={`text-xs font-bold px-2.5 py-0.5 rounded-full self-start mb-3 hover:opacity-80 transition-opacity ${a.categoryClass}`}
        >
          {a.category}
        </Link>
        <Link href={`/tin-tuc/${a.slug}`} className="flex flex-col flex-1">
          <h3 className="text-sm font-bold text-primary leading-snug flex-1 group-hover:text-solar-orange transition-colors line-clamp-3 mb-2">
            {a.title}
          </h3>
          <p className="text-xs text-on-surface-variant">{a.date}</p>
        </Link>
      </div>
    </div>
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const tocBlocks = article.bodyHtml
    ? extractHtmlHeadings(article.bodyHtml)
    : article.body.filter((b) => b.type === "h2" || b.type === "h3") as Array<{ type: "h2" | "h3"; text: string }>;

  const sameCategory = articles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  const shownSlugs = new Set([slug, ...sameCategory.map((a) => a.slug)]);
  const latest = [...articles]
    .filter((a) => !shownSlugs.has(a.slug))
    .sort((a, b) => parseDateVN(b.date) - parseDateVN(a.date))
    .slice(0, 3);

  let h2Counter = 0;

  return (
    <>
      <Header />
      <main className="bg-white">
        <div className="max-w-[800px] mx-auto px-6 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm text-on-surface-variant mb-6 min-w-0 overflow-hidden">
            <Link
              href="/tin-tuc"
              className="shrink-0 font-medium hover:text-primary transition-colors"
            >
              Tin tức
            </Link>
            <span className="material-symbols-outlined text-base shrink-0">chevron_right</span>
            <span className="truncate text-on-surface">{article.title}</span>
          </nav>

          {/* Image 1.91:1 */}
          <div
            className="w-full rounded-2xl overflow-hidden mb-8"
            style={{ aspectRatio: "1.91 / 1" }}
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Category badge */}
          <div className="mb-4">
            <Link
              href={`/tin-tuc/tag/${article.categorySlug}`}
              className={`text-xs font-bold px-3 py-1 rounded-full hover:opacity-80 transition-opacity ${article.categoryClass}`}
            >
              {article.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-primary leading-snug mb-3">
            {article.title}
          </h1>

          {/* Date + read time */}
          <div className="flex items-center gap-3 text-sm text-on-surface-variant mb-8">
            <span className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                calendar_today
              </span>
              {article.date}
            </span>
            <span className="w-1 h-1 rounded-full bg-outline" />
            <span className="flex items-center gap-1.5">
              <span
                className="material-symbols-outlined text-base"
                style={{ fontVariationSettings: "'FILL' 0" }}
              >
                schedule
              </span>
              {article.readTime} phút đọc
            </span>
          </div>

          {/* Table of contents */}
          {tocBlocks.length > 0 && (
            <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 mb-10">
              <p className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-base text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  format_list_bulleted
                </span>
                Nội dung bài viết
              </p>
              <ul className="space-y-2">
                {tocBlocks.map((item, i) => {
                  if (item.type === "h2") h2Counter++;
                  return (
                    <li key={i} className={item.type === "h3" ? "pl-5" : ""}>
                      <a
                        href={`#${slugifyHeading(item.text)}`}
                        className={`text-sm hover:text-primary transition-colors ${
                          item.type === "h2"
                            ? "text-on-surface font-medium"
                            : "text-on-surface-variant"
                        }`}
                      >
                        {item.type === "h2" ? `${h2Counter}. ` : "· "}
                        {item.text}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Excerpt lead */}
          <p className="text-lg text-on-surface-variant leading-relaxed mb-8 border-l-4 border-primary pl-5 font-medium">
            {article.excerpt}
          </p>

          {/* Body */}
          {article.bodyHtml ? (
            <div
              className="cms-article-body text-on-surface [&_a]:font-semibold [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_blockquote]:my-8 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4 [&_blockquote]:border-solar-orange [&_blockquote]:bg-surface-container-low [&_blockquote]:py-5 [&_blockquote]:pl-6 [&_blockquote]:pr-6 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:scroll-mt-24 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-primary [&_h3]:mb-3 [&_h3]:mt-7 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-on-surface [&_img]:my-8 [&_img]:w-full [&_img]:rounded-2xl [&_img]:object-cover [&_li]:mb-2 [&_ol]:mb-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_p]:leading-relaxed [&_ul]:mb-5 [&_ul]:list-disc [&_ul]:pl-6"
              dangerouslySetInnerHTML={{ __html: addHeadingIds(article.bodyHtml) }}
            />
          ) : (
            <div>{article.body.map((block, i) => renderBlock(block, i))}</div>
          )}
        </div>

        {/* Related articles – same category */}
        {sameCategory.length > 0 && (
          <section className="bg-surface-container-low py-14 px-6">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="text-xl font-bold text-primary mb-8">
                Bài viết liên quan – {article.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sameCategory.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Latest articles */}
        {latest.length > 0 && (
          <section className="py-14 px-6">
            <div className="max-w-[1200px] mx-auto">
              <h2 className="text-xl font-bold text-primary mb-8">Bài viết mới nhất</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latest.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
