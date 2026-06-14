"use client";

import { useState, useEffect } from "react";
import type { TourListingContent, TourFAQ } from "@/lib/cms-content";

const CMS_GREEN = "#0a5c45";
function uid() { return Math.random().toString(36).slice(2, 9); }

export default function TourListingTab() {
  const [data, setData] = useState<TourListingContent | null>(null);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/cms/du-lich").then((r) => r.json()).then((d: TourListingContent) => setData(d));
  }, []);

  function patch<K extends keyof TourListingContent>(field: K, value: TourListingContent[K]) {
    if (!data) return;
    setData({ ...data, [field]: value });
    setDirty(true);
  }

  function updateFaq(idx: number, field: keyof TourFAQ, value: string) {
    if (!data) return;
    patch("faqs", data.faqs.map((f, i) => i === idx ? { ...f, [field]: value } : f));
  }

  async function handleSave() {
    if (!data) return;
    await fetch("/api/cms/du-lich", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data) return <div className="p-8 text-sm text-on-surface-variant">Đang tải...</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Du lịch tình nguyện</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Nội dung tại <a href="/du-lich-tinh-nguyen" target="_blank" className="underline text-primary">/du-lich-tinh-nguyen</a>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>Đã lưu</span>}
          <button type="button" onClick={handleSave} disabled={!dirty}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: CMS_GREEN }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>Lưu
          </button>
        </div>
      </div>

      {/* Page header text */}
      <div className="bg-white rounded-2xl border border-outline-variant/50 p-6 space-y-4">
        <h3 className="text-sm font-bold text-on-surface">Tiêu đề trang</h3>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Tiêu đề</label>
          <input value={data.pageTitle} onChange={(e) => patch("pageTitle", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Mô tả phụ</label>
          <input value={data.pageSubtitle} onChange={(e) => patch("pageSubtitle", e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors" />
        </div>
      </div>

      {/* FAQs */}
      <div>
        <h3 className="text-sm font-bold text-on-surface mb-3">Câu hỏi thường gặp (FAQ)</h3>
        <div className="space-y-3">
          {data.faqs.map((faq, idx) => (
            <div key={faq.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">Câu hỏi {idx + 1}</span>
                <button type="button" onClick={() => patch("faqs", data.faqs.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Câu hỏi</label>
                <input value={faq.q} onChange={(e) => updateFaq(idx, "q", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Trả lời</label>
                <textarea rows={3} value={faq.a} onChange={(e) => updateFaq(idx, "a", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => patch("faqs", [...data.faqs, { id: uid(), q: "", a: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm câu hỏi
          </button>
        </div>
      </div>
    </div>
  );
}
