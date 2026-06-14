"use client";

import { useState, useEffect } from "react";
import type { ContactContent } from "@/lib/cms-content";

type Form = ContactContent & { hours: string };

const EMPTY: Form = {
  address: "",
  phone: "",
  email: "",
  hours: "Thứ 2 – Thứ 6: 9:00 – 17:30",
  mapEmbed: "",
  facebook: "",
  instagram: "",
  youtube: "",
  tiktok: "",
};

export default function ContactTab() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cms/contact").then((r) => r.json()).then((data: Form) => {
      setForm(data);
      setLoading(false);
    });
  }, []);

  function update(field: keyof Form, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setDirty(true);
  }

  async function handleSave() {
    await fetch("/api/cms/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return <div className="p-8 text-sm text-on-surface-variant">Đang tải...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Thông tin liên hệ</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Hiển thị tại trang liên hệ và footer website</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>Đã lưu
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "#0a5c45" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/50 p-6 space-y-5">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>location_on</span>Thông tin cơ bản
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Địa chỉ</label>
            <input value={form.address} onChange={(e) => update("address", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Số điện thoại</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Email</label>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Giờ làm việc</label>
            <input value={form.hours} onChange={(e) => update("hours", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Google Maps Embed URL</label>
            <input value={form.mapEmbed} onChange={(e) => update("mapEmbed", e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors font-mono" />
            <p className="text-[11px] text-on-surface-variant/60 mt-1">Lấy từ Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép URL trong src=""</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/50 p-6 space-y-5">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>Mạng xã hội
        </h3>
        <div className="space-y-4">
          {([
            { field: "facebook",  icon: "facebook",  label: "Facebook" },
            { field: "instagram", icon: "photo_camera", label: "Instagram" },
            { field: "youtube",   icon: "play_circle", label: "YouTube" },
            { field: "tiktok",    icon: "music_video", label: "TikTok" },
          ] as const).map(({ field, icon, label }) => (
            <div key={field} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>{icon}</span>
              </div>
              <input
                value={form[field]}
                onChange={(e) => update(field, e.target.value)}
                placeholder={`URL trang ${label}`}
                className="flex-1 px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
