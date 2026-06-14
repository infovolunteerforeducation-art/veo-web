"use client";

import { useState, useEffect } from "react";
import type { FooterContent, FooterLink } from "@/lib/cms-content";

const CMS_GREEN = "#0a5c45";

export default function FooterTab() {
  const [data, setData] = useState<FooterContent | null>(null);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/cms/footer").then((r) => r.json()).then((d: FooterContent) => setData(d));
  }, []);

  function set<K extends keyof FooterContent>(field: K, value: FooterContent[K]) {
    if (!data) return;
    setData({ ...data, [field]: value });
    setDirty(true);
  }

  function updateSocial(idx: number, field: "label" | "href", value: string) {
    if (!data) return;
    const socials = data.socials.map((s, i) => i === idx ? { ...s, [field]: value } : s);
    set("socials", socials);
  }

  function updateLink(column: "programLinks" | "aboutLinks" | "supportLinks", idx: number, field: keyof FooterLink, value: string | boolean) {
    if (!data) return;
    const links = data[column].map((l, i) => i === idx ? { ...l, [field]: value } : l);
    set(column, links);
  }

  function addLink(column: "programLinks" | "aboutLinks" | "supportLinks") {
    if (!data) return;
    set(column, [...data[column], { label: "Link mới", href: "/", external: false }]);
  }

  function removeLink(column: "programLinks" | "aboutLinks" | "supportLinks", idx: number) {
    if (!data) return;
    set(column, data[column].filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!data) return;
    await fetch("/api/cms/footer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data) return <div className="p-8 text-sm text-on-surface-variant">Đang tải...</div>;

  const COLUMNS: { key: "programLinks" | "aboutLinks" | "supportLinks"; label: string }[] = [
    { key: "programLinks", label: "Chương trình" },
    { key: "aboutLinks", label: "Thông tin" },
    { key: "supportLinks", label: "Hỗ trợ" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Footer</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Thông tin liên hệ, mạng xã hội và các cột link trong footer</p>
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
            style={{ background: CMS_GREEN }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Basic info */}
      <div className="bg-white rounded-2xl border border-outline-variant/50 p-6 space-y-4">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>info</span>Thông tin cơ bản
        </h3>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Mô tả tổ chức</label>
          <textarea
            rows={3}
            value={data.description}
            onChange={(e) => set("description", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Số điện thoại</label>
            <input value={data.phone} onChange={(e) => set("phone", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Email</label>
            <input value={data.email} onChange={(e) => set("email", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Địa chỉ</label>
            <input value={data.address} onChange={(e) => set("address", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* Social links */}
      <div className="bg-white rounded-2xl border border-outline-variant/50 p-6 space-y-3">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>share</span>Mạng xã hội
        </h3>
        {data.socials.map((s, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <input
              value={s.label}
              onChange={(e) => updateSocial(idx, "label", e.target.value)}
              placeholder="Tên mạng xã hội"
              className="w-32 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors"
            />
            <input
              value={s.href}
              onChange={(e) => updateSocial(idx, "href", e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Footer link columns */}
      {COLUMNS.map(({ key, label }) => (
        <div key={key} className="bg-white rounded-2xl border border-outline-variant/50 p-6 space-y-3">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>list</span>Cột "{label}"
          </h3>
          {data[key].map((link, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                value={link.label}
                onChange={(e) => updateLink(key, idx, "label", e.target.value)}
                placeholder="Tên"
                className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors"
              />
              <input
                value={link.href}
                onChange={(e) => updateLink(key, idx, "href", e.target.value)}
                placeholder="/duong-dan"
                className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm font-mono outline-none focus:border-primary transition-colors"
              />
              <label className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant cursor-pointer whitespace-nowrap">
                <input type="checkbox" checked={link.external} onChange={(e) => updateLink(key, idx, "external", e.target.checked)} className="rounded" />
                Mở tab mới
              </label>
              <button
                type="button"
                onClick={() => removeLink(key, idx)}
                className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors shrink-0"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addLink(key)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:text-primary transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Thêm link
          </button>
        </div>
      ))}
    </div>
  );
}
