import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBlogContent, saveBlogContent, type BlogArticle } from "@/lib/cms-content";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getBlogContent());
}

export async function POST(req: Request) {
  const article = (await req.json()) as BlogArticle;
  const content = getBlogContent();
  const now = new Date().toISOString();

  if (article.id) {
    const idx = content.articles.findIndex((a) => a.id === article.id);
    if (idx >= 0) {
      content.articles[idx] = { ...article, updatedAt: now };
    } else {
      content.articles.unshift({ ...article, updatedAt: now });
    }
  } else {
    const newArticle: BlogArticle = {
      ...article,
      id: randomUUID(),
      updatedAt: now,
      publishedAt: article.status === "published" ? now : null,
    };
    content.articles.unshift(newArticle);
  }

  saveBlogContent(content);
  revalidatePath("/tin-tuc", "page");
  return NextResponse.json({ ok: true });
}
