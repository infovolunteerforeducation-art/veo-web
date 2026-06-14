import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string | null) ?? "uploads";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<{ public_id: string; format: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            format: "webp",
            overwrite: false,
          },
          (err, res) => {
            if (err || !res) reject(err ?? new Error("Upload failed"));
            else resolve(res as { public_id: string; format: string });
          },
        )
        .end(buffer);
    },
  );

  // Return relative path — stored in DB, resolved to full URL by getImageUrl()
  const path = `/${result.public_id}.${result.format}`;
  return NextResponse.json({ path });
}
