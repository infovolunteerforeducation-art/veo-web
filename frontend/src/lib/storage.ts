/**
 * Storage abstraction layer.
 *
 * Images are stored in the DB as relative paths: /tours/hero-abc123.webp
 * getImageUrl() converts them to full URLs via NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.
 *
 * To migrate to a different provider (S3, R2, etc.) later:
 *   → change getImageUrl() and the /api/upload route only.
 *   → all stored paths in DB stay the same.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

/**
 * Convert a stored relative path to a displayable URL.
 * Blob URLs and http(s) URLs are returned as-is (preview or legacy).
 */
export function getImageUrl(path: string, transforms = "q_auto,f_auto,w_1440"): string {
  if (!path) return "";
  if (/^(blob:|https?:|data:)/.test(path)) return path;
  return `${CLOUDINARY_BASE}/${transforms}${path}`;
}

/** True when the URL is a local blob not yet uploaded to storage */
export function isPendingUpload(url: string): boolean {
  return url.startsWith("blob:");
}

/**
 * Upload a single blob to /api/upload.
 * Returns the stored relative path: /folder/public_id.webp
 */
export async function uploadImage(blob: Blob, folder = "uploads"): Promise<string> {
  const body = new FormData();
  body.append("file", blob, "image.webp");
  body.append("folder", folder);

  const res = await fetch("/api/upload", { method: "POST", body });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`Upload failed: ${msg}`);
  }
  const data = (await res.json()) as { path: string };
  return data.path;
}

/**
 * Recursively walk an object/array and upload any blob: URLs.
 * Returns a new object with all blob: URLs replaced by stored paths.
 *
 * Usage before saving to DB:
 *   const clean = await uploadPendingImages(formData, "tours");
 *   await db.save(clean);
 */
export async function uploadPendingImages<T>(data: T, folder = "uploads"): Promise<T> {
  return replaceBlobUrls(data, folder) as Promise<T>;
}

async function replaceBlobUrls(value: unknown, folder: string): Promise<unknown> {
  if (typeof value === "string") {
    if (isPendingUpload(value)) {
      const res = await fetch(value);
      const blob = await res.blob();
      return uploadImage(blob, folder);
    }
    return value;
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => replaceBlobUrls(item, folder)));
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = await replaceBlobUrls(v, folder);
    }
    return out;
  }
  return value;
}
