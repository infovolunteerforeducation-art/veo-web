import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getHeaderContent, saveHeaderContent, type HeaderContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getHeaderContent());
}

export async function POST(req: Request) {
  const data = (await req.json()) as HeaderContent;
  saveHeaderContent(data);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
