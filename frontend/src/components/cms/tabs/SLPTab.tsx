"use client";

import { useState } from "react";
import { SLPLink } from "@/lib/cms-data";

const INITIAL_LINKS: SLPLink[] = [
  { id: "1", label: "Đăng ký SLP", url: "https://slp.veo.vn/dang-ky", description: "Trang đăng ký chương trình SLP cho học sinh", active: true },
  { id: "2", label: "Giới thiệu SLP", url: "https://slp.veo.vn/gioi-thieu", description: "Trang giới thiệu chi tiết chương trình", active: true },
  { id: "3", label: "Lịch khai giảng SLP", url: "https://slp.veo.vn/lich-khai-giang", description: "Lịch học các khóa SLP trong năm", active: false },
];

export default function SLPTab() {
  const [links, setLinks] = useState<SLPLink[]>(INITIAL_LINKS);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<SLPLink>>({});
  const [saved, setSaved] = useState(false);

  function startEdit(link: SLPLink) {
    setEditing(link.id);
    setForm({ ...link });
  }

  function startNew() {
    const newId = String(Date.now());
    setEditing(newId);
    setForm({ id: newId, label: "", url: "", description: "", active: true });
  }

  function saveEdit() {
    if (!form.id) return;
    if (links.find((l) => l.id === form.id)) {
      setLinks((prev) => prev.map((l) => (l.id === form.id ? { ...l, ...form } as SLPLink : l)));
    } else {
      setLinks((prev) => [...prev, form as SLPLink]);
    }
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function deleteLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  function toggleActive(id: string) {
    setLinks((prev) => prev.map((l) => l.id === id ? { ...l, active: !l.active } : l));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">SLP — Quản lý liên kết</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Các đường link dẫn đến chương trình SLP được gắn trên website</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>Đã lưu
            </span>
          )}
          <button
            type="button"
            onClick={startNew}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: "#0a5c45" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>Thêm link
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="bg-white rounded-2xl border border-outline-variant/50 p-4">
            {editing === link.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tên hiển thị</label>
                    <input value={form.label ?? ""} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" placeholder="VD: Đăng ký SLP" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">URL đích</label>
                    <input value={form.url ?? ""} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" placeholder="https://..." />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Mô tả (nội bộ)</label>
                  <input value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" placeholder="Dùng để gì, gắn ở đâu..." />
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={saveEdit} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#0a5c45" }}>Lưu</button>
                  <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container transition-colors">Hủy</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-on-surface">{link.label}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${link.active ? "bg-green-100 text-green-700" : "bg-surface-container text-on-surface-variant"}`}>
                      {link.active ? "Đang dùng" : "Tắt"}
                    </span>
                  </div>
                  <a href={link.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-primary/70 hover:text-primary transition-colors font-mono mt-0.5 block truncate">{link.url}</a>
                  {link.description && <p className="text-xs text-on-surface-variant mt-1">{link.description}</p>}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => toggleActive(link.id)} title={link.active ? "Tắt link" : "Bật link"}
                    className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{link.active ? "toggle_on" : "toggle_off"}</span>
                  </button>
                  <button type="button" onClick={() => startEdit(link)} className="p-2 rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>edit</span>
                  </button>
                  <button type="button" onClick={() => deleteLink(link.id)} className="p-2 rounded-lg hover:bg-error-container transition-colors text-on-surface-variant hover:text-error">
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {editing && !links.find((l) => l.id === editing) && (
          <div className="bg-white rounded-2xl border border-primary/30 p-4 space-y-3">
            <p className="text-sm font-semibold text-on-surface">Thêm link mới</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tên hiển thị</label>
                <input value={form.label ?? ""} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" placeholder="VD: Đăng ký SLP" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">URL đích</label>
                <input value={form.url ?? ""} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" placeholder="https://..." />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant mb-1">Mô tả (nội bộ)</label>
              <input value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" placeholder="Dùng để gì, gắn ở đâu..." />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={saveEdit} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: "#0a5c45" }}>Lưu</button>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant border border-outline-variant hover:bg-surface-container transition-colors">Hủy</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
