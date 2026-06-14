import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCampContent, saveCampContent, type CampContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCampContent());
}

export async function POST(req: Request) {
  const data = (await req.json()) as CampContent;
  saveCampContent(data);
  revalidatePath("/trai-he-tinh-nguyen", "layout");
  return NextResponse.json({ ok: true });
}
