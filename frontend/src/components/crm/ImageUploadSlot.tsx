"use client";

import { useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type Meta = { width: number; height: number; sizeKb: number };

async function optimizeToWebP(
  file: File,
  maxW: number,
  maxH: number,
  quality: number,
): Promise<{ url: string; meta: Meta }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const rawUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(rawUrl);
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w > maxW || h > maxH) {
        const ratio = Math.min(maxW / w, maxH / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error("toBlob failed")); return; }
          resolve({
            url: URL.createObjectURL(blob),
            meta: { width: w, height: h, sizeKb: Math.round(blob.size / 1024) },
          });
        },
        "image/webp",
        quality,
      );
    };
    img.onerror = () => { URL.revokeObjectURL(rawUrl); reject(new Error("load failed")); };
    img.src = rawUrl;
  });
}

type Props = {
  value: string;
  onChange: (url: string) => void;
  /** Short label shown inside empty drop zone, e.g. "Ảnh nền" */
  label: string;
  /** Dimension / ratio guidance, e.g. "1440 × 810px · Tỉ lệ 16:9" */
  hint: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  /** Tailwind height class for the preview/drop zone, e.g. "h-52" */
  previewHeight?: string;
};

export default function ImageUploadSlot({
  value,
  onChange,
  label,
  hint,
  maxWidth = 1440,
  maxHeight = 810,
  quality = 0.85,
  previewHeight = "h-40",
}: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setProcessing(true);
    try {
      const result = await optimizeToWebP(file, maxWidth, maxHeight, quality);
      setMeta(result.meta);
      onChange(result.url);
    } catch {
      // keep previous value on failure
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      {/* Hint row */}
      <p className="text-[11px] text-on-surface-variant mb-1.5 flex items-center gap-1">
        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>straighten</span>
        <span>{hint}</span>
        <span className="text-on-surface-variant/50">·</span>
        <span className="text-primary/80 font-medium">Tự động chuyển WebP khi lưu</span>
      </p>

      {value ? (
        <div className={`relative rounded-xl overflow-hidden ${previewHeight} bg-surface-container-low group`}>
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />

          {/* Meta bar — only shown after a new file is processed */}
          {meta && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-3 py-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400" style={{ fontSize: 12 }}>check_circle</span>
              <span className="text-white text-[10px]">
                {meta.width}×{meta.height}px · {meta.sizeKb} KB · WebP
              </span>
            </div>
          )}

          {/* Hover actions */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload</span>
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-error text-white text-xs font-semibold hover:bg-error/90 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
              Xóa
            </button>
          </div>

          {/* Processing overlay */}
          {processing && (
            <div className="absolute inset-0 bg-white/75 flex flex-col items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 24 }}>progress_activity</span>
              <p className="text-xs font-semibold text-primary">Đang tối ưu ảnh…</p>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const f = e.dataTransfer.files?.[0];
            if (f) processFile(f);
          }}
          onClick={() => fileRef.current?.click()}
          className={`${previewHeight} rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low/50"
          }`}
        >
          {processing ? (
            <>
              <span className="material-symbols-outlined text-primary animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
              <p className="text-xs font-semibold text-primary">Đang tối ưu ảnh…</p>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 32 }}>cloud_upload</span>
              <p className="text-sm font-semibold text-on-surface-variant">Kéo & thả hoặc bấm để chọn</p>
              <p className="text-xs text-on-surface-variant/60">{label}</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) processFile(f);
          e.target.value = "";
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        message={`Bạn có chắc muốn xóa ${label}?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { onChange(""); setMeta(null); setConfirmOpen(false); }}
      />
    </div>
  );
}
