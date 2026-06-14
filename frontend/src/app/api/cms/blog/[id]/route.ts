import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBlogContent, saveBlogContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const content = getBlogContent();
  content.articles = content.articles.filter((a) => a.id !== id);
  saveBlogContent(content);
  revalidatePath("/tin-tuc", "page");
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const patch = (await req.json()) as Partial<{ status: "draft" | "published" }>;
  const content = getBlogContent();
  const now = new Date().toISOString();
  const idx = content.articles.findIndex((a) => a.id === id);
  if (idx >= 0) {
    content.articles[idx] = {
      ...content.articles[idx],
      ...patch,
      updatedAt: now,
      publishedAt:
        patch.status === "published"
          ? content.articles[idx].publishedAt ?? now
          : patch.status === "draft"
            ? null
            : content.articles[idx].publishedAt,
    };
  }
  saveBlogContent(content);
  revalidatePath("/tin-tuc", "page");
  return NextResponse.json({ ok: true });
}
