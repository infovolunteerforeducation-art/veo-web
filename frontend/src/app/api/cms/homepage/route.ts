import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getHomepageContent, saveHomepageContent, HomepageContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getHomepageContent();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as HomepageContent;
  saveHomepageContent(body);
  // Invalidate the homepage cache so the next visit shows fresh data
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
