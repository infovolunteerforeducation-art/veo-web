import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCsrContent, saveCsrContent, type CsrContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCsrContent());
}

export async function POST(req: Request) {
  const data = (await req.json()) as CsrContent;
  saveCsrContent(data);
  revalidatePath("/chien-luoc-csr-cho-doanh-nghiep", "layout");
  return NextResponse.json({ ok: true });
}
