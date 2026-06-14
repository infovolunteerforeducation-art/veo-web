import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSchoolContent, saveSchoolContent, type SchoolContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getSchoolContent());
}

export async function POST(req: Request) {
  const data = (await req.json()) as SchoolContent;
  saveSchoolContent(data);
  revalidatePath("/hoat-dong-ngoai-khoa-truong-hoc", "layout");
  return NextResponse.json({ ok: true });
}
