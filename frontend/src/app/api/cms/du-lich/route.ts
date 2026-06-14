import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getTourListingContent, saveTourListingContent, type TourListingContent } from "@/lib/cms-content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTourListingContent());
}

export async function POST(req: Request) {
  const data = (await req.json()) as TourListingContent;
  saveTourListingContent(data);
  revalidatePath("/du-lich-tinh-nguyen", "layout");
  return NextResponse.json({ ok: true });
}
