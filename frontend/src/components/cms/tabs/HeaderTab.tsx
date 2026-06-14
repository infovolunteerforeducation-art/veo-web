"use client";

import { useState, useEffect } from "react";
import type { HeaderContent, HeaderNavLink } from "@/lib/cms-content";

const CMS_GREEN = "#0a5c45";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function HeaderTab() {
  const [data, setData] = useState<HeaderContent | null>(null);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cms/header").then((r) => r.json()).then((d: HeaderContent) => setData(d));
  }, []);

  function updateLink(idx: number, field: keyof HeaderNavLink, value: string | boolean) {
    if (!data) return;
    const links = data.navLinks.map((l, i) => i === idx ? { ...l, [field]: value } : l);
    setData({ ...data, navLinks: links });
    setDirty(true);
  }

  function updateChild(parentIdx: number, childIdx: number, field: string, value: string | boolean) {
    if (!data) return;
    const links = data.navLinks.map((l, i) => {
      if (i !== parentIdx) return l;
      const children = l.children.map((c, j) => j === childIdx ? { ...c, [field]: value } : c);
      return { ...l, children };
    });
    setData({ ...data, navLinks: links });
    setDirty(true);
  }

  function addLink() {
    if (!data) return;
    setData({ ...data, navLinks: [...data.navLinks, { label: "Link mới", href: "/", external: false, children: [] }] });
    setDirty(true);
  }

  function removeLink(idx: number) {
    if (!data) return;
    setData({ ...data, navLinks: data.navLinks.filter((_, i) => i !== idx) });
    setDirty(true);
  }

  function addChild(parentIdx: number) {
    if (!data) return;
    const links = data.navLinks.map((l, i) => {
      if (i !== parentIdx) return l;
      return { ...l, children: [...l.children, { label: "Link con", href: "/", external: false }] };
    });
    setData({ ...data, navLinks: links });
    setDirty(true);
  }

  function removeChild(parentIdx: number, childIdx: number) {
    if (!data) return;
    const links = data.navLinks.map((l, i) => {
      if (i !== parentIdx) return l;
      return { ...l, children: l.children.filter((_, j) => j !== childIdx) };
    });
    setData({ ...data, navLinks: links });
    setDirty(true);
  }

  async function handleSave() {
    if (!data) return;
    await fetch("/api/cms/header", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data) return <div className="p-8 text-sm text-on-surface-variant">Đang tải...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Menu điều hướng (Header)</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Chỉnh sửa thứ tự và nội dung các link trên thanh điều hướng</p>
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

      <div className="space-y-3">
        {data.navLinks.map((link, idx) => {
          const isExpanded = expandedIdx === idx;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-outline-variant/50 overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>drag_indicator</span>
                <div className="flex-1 grid grid-cols-[1fr_1fr_auto_auto] gap-3 items-center">
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(idx, "label", e.target.value)}
                    placeholder="Tên link"
                    className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors"
                  />
                  <input
                    value={link.href}
                    onChange={(e) => updateLink(idx, "href", e.target.value)}
                    placeholder="/duong-dan hoặc https://..."
                    className="px-3 py-2 rounded-xl border border-outline-variant text-sm font-mono outline-none focus:border-primary transition-colors"
                  />
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-on-surface-variant cursor-pointer whitespace-nowrap">
                    <input type="checkbox" checked={link.external} onChange={(e) => updateLink(idx, "external", e.target.checked)} className="rounded" />
                    Ngoài
                  </label>
                  <div className="flex gap-1">
                    {link.children !== undefined && (
                      <button
                        type="button"
                        onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                        className="w-8 h-8 rounded-lg border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
                        title="Menu con"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                          {isExpanded ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                        </span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeLink(idx)}
                      className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-outline-variant/30 px-4 pb-4 pt-3 bg-surface-container/30">
                  <p className="text-xs font-bold text-on-surface-variant mb-3">Submenu (dropdown)</p>
                  <div className="space-y-2">
                    {link.children.map((child, childIdx) => (
                      <div key={childIdx} className="flex items-center gap-2">
                        <input
                          value={child.label}
                          onChange={(e) => updateChild(idx, childIdx, "label", e.target.value)}
                          placeholder="Tên"
                          className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors"
                        />
                        <input
                          value={child.href}
                          onChange={(e) => updateChild(idx, childIdx, "href", e.target.value)}
                          placeholder="/duong-dan"
                          className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm font-mono outline-none focus:border-primary transition-colors"
                        />
                        <label className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant cursor-pointer whitespace-nowrap">
                          <input type="checkbox" checked={child.external} onChange={(e) => updateChild(idx, childIdx, "external", e.target.checked)} className="rounded" />
                          Ngoài
                        </label>
                        <button
                          type="button"
                          onClick={() => removeChild(idx, childIdx)}
                          className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors shrink-0"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addChild(idx)}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:text-primary transition-colors text-on-surface-variant"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Thêm link con
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={addLink}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm link
      </button>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
        <strong>Lưu ý:</strong> Thay đổi menu sẽ ảnh hưởng đến header trên toàn bộ website. Kiểm tra kỹ trước khi lưu.
      </div>
    </div>
  );
}
