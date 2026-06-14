import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContactContent, saveContactContent, type ContactContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getContactContent());
}

export async function POST(req: Request) {
  const data = (await req.json()) as ContactContent;
  saveContactContent(data);
  revalidatePath("/lien-he", "layout");
  return NextResponse.json({ ok: true });
}
