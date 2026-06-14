import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getFooterContent, saveFooterContent, type FooterContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getFooterContent());
}

export async function POST(req: Request) {
  const data = (await req.json()) as FooterContent;
  saveFooterContent(data);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
