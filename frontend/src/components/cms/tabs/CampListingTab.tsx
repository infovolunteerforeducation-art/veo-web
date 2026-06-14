"use client";

import { useState, useEffect } from "react";
import type { CampContent } from "@/lib/cms-content";
import ImageUploadSlot from "../../crm/ImageUploadSlot";

const CMS_GREEN = "#0a5c45";
function uid() { return Math.random().toString(36).slice(2, 9); }

type Section = "hero" | "highlights" | "pillars" | "features" | "programs" | "schedule" | "outcomes" | "testimonials";

const TABS: { key: Section; label: string }[] = [
  { key: "hero", label: "Hero & Video" },
  { key: "highlights", label: "Điểm nổi bật" },
  { key: "pillars", label: "Trụ cột" },
  { key: "features", label: "Feature cards" },
  { key: "programs", label: "Nhóm tuổi" },
  { key: "schedule", label: "Lịch trình" },
  { key: "outcomes", label: "Kết quả" },
  { key: "testimonials", label: "Cảm nhận" },
];

export default function CampListingTab() {
  const [data, setData] = useState<CampContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/cms/trai-he").then((r) => r.json()).then((d: CampContent) => setData(d));
  }, []);

  function patch<K extends keyof CampContent>(field: K, value: CampContent[K]) {
    if (!data) return;
    setData({ ...data, [field]: value });
    setDirty(true);
  }

  async function handleSave() {
    if (!data) return;
    await fetch("/api/cms/trai-he", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data) return <div className="p-8 text-sm text-on-surface-variant">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Trại hè tình nguyện</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Nội dung tại <a href="/trai-he-tinh-nguyen" target="_blank" className="underline text-primary">/trai-he-tinh-nguyen</a>
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>Đã lưu — trang trại hè đã cập nhật</span>}
          <button type="button" onClick={handleSave} disabled={!dirty}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: CMS_GREEN }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>Lưu
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveSection(t.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${activeSection === t.key ? "text-white" : "bg-surface-container text-on-surface hover:bg-surface-container-high"}`}
            style={activeSection === t.key ? { background: CMS_GREEN } : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {activeSection === "hero" && (
        <div className="bg-white rounded-2xl border border-outline-variant/50 p-6 space-y-5">
          <h3 className="text-sm font-bold text-on-surface">Ảnh hero & Video YouTube</h3>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">Ảnh hero (1920×1080px)</label>
            <ImageUploadSlot value={data.heroImage} onChange={(v) => patch("heroImage", v)} hint="1920×1080px" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">YouTube Video ID</label>
            <input value={data.youtubeVideoId} onChange={(e) => patch("youtubeVideoId", e.target.value)}
              placeholder="Ví dụ: LCJqDRXphLk"
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm font-mono outline-none focus:border-primary transition-colors" />
            <p className="text-xs text-on-surface-variant/60 mt-1">Lấy từ URL YouTube: youtube.com/watch?v=<strong>ID_Ở_ĐÂY</strong></p>
          </div>
        </div>
      )}

      {activeSection === "highlights" && (
        <div className="space-y-3">
          {data.highlights.map((h, idx) => (
            <div key={h.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5">
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Icon (Material Symbols)</label>
                  <input value={h.icon} onChange={(e) => patch("highlights", data.highlights.map((x, i) => i === idx ? { ...x, icon: e.target.value } : x))}
                    placeholder="groups" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm font-mono outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Giá trị</label>
                  <input value={h.value} onChange={(e) => patch("highlights", data.highlights.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))}
                    placeholder="120K+" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Nhãn</label>
                  <input value={h.label} onChange={(e) => patch("highlights", data.highlights.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))}
                    placeholder="cộng đồng VEO" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                </div>
                <button type="button" onClick={() => patch("highlights", data.highlights.filter((_, i) => i !== idx))}
                  className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => patch("highlights", [...data.highlights, { id: uid(), icon: "star", value: "", label: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm điểm nổi bật
          </button>
        </div>
      )}

      {activeSection === "pillars" && (
        <div className="space-y-3">
          {data.pillars.map((p, idx) => (
            <div key={p.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">Trụ cột {idx + 1}</span>
                <button type="button" onClick={() => patch("pillars", data.pillars.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Icon</label>
                  <input value={p.icon} onChange={(e) => patch("pillars", data.pillars.map((x, i) => i === idx ? { ...x, icon: e.target.value } : x))}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm font-mono outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tiêu đề</label>
                  <input value={p.title} onChange={(e) => patch("pillars", data.pillars.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">Mô tả</label>
                <textarea rows={2} value={p.desc} onChange={(e) => patch("pillars", data.pillars.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => patch("pillars", [...data.pillars, { id: uid(), icon: "school", title: "", desc: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm trụ cột
          </button>
        </div>
      )}

      {activeSection === "features" && (
        <div className="space-y-4">
          {data.featureCards.map((card, idx) => (
            <div key={card.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">Card {idx + 1}</span>
                <button type="button" onClick={() => patch("featureCards", data.featureCards.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <ImageUploadSlot value={card.image} onChange={(v) => patch("featureCards", data.featureCards.map((x, i) => i === idx ? { ...x, image: v } : x))}
                hint="16:9" />
              <input value={card.title} onChange={(e) => patch("featureCards", data.featureCards.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                placeholder="Tiêu đề" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              <textarea rows={3} value={card.desc} onChange={(e) => patch("featureCards", data.featureCards.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                placeholder="Mô tả" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
            </div>
          ))}
          <button type="button" onClick={() => patch("featureCards", [...data.featureCards, { id: uid(), image: "", title: "", desc: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm feature card
          </button>
        </div>
      )}

      {activeSection === "programs" && (
        <div className="space-y-4">
          {data.programs.map((prog, idx) => (
            <div key={prog.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">Nhóm {idx + 1}</span>
                <button type="button" onClick={() => patch("programs", data.programs.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <ImageUploadSlot value={prog.image} onChange={(v) => patch("programs", data.programs.map((x, i) => i === idx ? { ...x, image: v } : x))}
                hint="4:3" />
              <div className="grid grid-cols-2 gap-3">
                <input value={prog.title} onChange={(e) => patch("programs", data.programs.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                  placeholder="Tên nhóm" className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                <input value={prog.age} onChange={(e) => patch("programs", data.programs.map((x, i) => i === idx ? { ...x, age: e.target.value } : x))}
                  placeholder="10 - 15 tuổi" className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              </div>
              <textarea rows={2} value={prog.desc} onChange={(e) => patch("programs", data.programs.map((x, i) => i === idx ? { ...x, desc: e.target.value } : x))}
                placeholder="Mô tả" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
            </div>
          ))}
          <button type="button" onClick={() => patch("programs", [...data.programs, { id: uid(), title: "", age: "", image: "", desc: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm nhóm tuổi
          </button>
        </div>
      )}

      {activeSection === "schedule" && (
        <div className="space-y-3">
          {data.schedule.map((day, idx) => (
            <div key={day.id} className="flex items-center gap-3">
              <input value={day.day} onChange={(e) => patch("schedule", data.schedule.map((x, i) => i === idx ? { ...x, day: e.target.value } : x))}
                placeholder="Ngày 1" className="w-24 px-3 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold outline-none focus:border-primary" />
              <input value={day.text} onChange={(e) => patch("schedule", data.schedule.map((x, i) => i === idx ? { ...x, text: e.target.value } : x))}
                className="flex-1 px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              <button type="button" onClick={() => patch("schedule", data.schedule.filter((_, i) => i !== idx))}
                className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 shrink-0">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => patch("schedule", [...data.schedule, { id: uid(), day: `Ngày ${data.schedule.length + 1}`, text: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm ngày
          </button>
        </div>
      )}

      {activeSection === "outcomes" && (
        <div className="space-y-3">
          {data.outcomes.map((outcome, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: CMS_GREEN }}>{idx + 1}</span>
              <input value={outcome} onChange={(e) => patch("outcomes", data.outcomes.map((x, i) => i === idx ? e.target.value : x))}
                className="flex-1 px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              <button type="button" onClick={() => patch("outcomes", data.outcomes.filter((_, i) => i !== idx))}
                className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 shrink-0">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => patch("outcomes", [...data.outcomes, ""])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm kết quả
          </button>
        </div>
      )}

      {activeSection === "testimonials" && (
        <div className="space-y-4">
          {data.testimonials.map((t, idx) => (
            <div key={t.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">Cảm nhận {idx + 1}</span>
                <button type="button" onClick={() => patch("testimonials", data.testimonials.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={t.name} onChange={(e) => patch("testimonials", data.testimonials.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))}
                  placeholder="Tên" className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                <input value={t.role} onChange={(e) => patch("testimonials", data.testimonials.map((x, i) => i === idx ? { ...x, role: e.target.value } : x))}
                  placeholder="Vai trò" className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              </div>
              <textarea rows={3} value={t.quote} onChange={(e) => patch("testimonials", data.testimonials.map((x, i) => i === idx ? { ...x, quote: e.target.value } : x))}
                placeholder="Trích dẫn" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
            </div>
          ))}
          <button type="button" onClick={() => patch("testimonials", [...data.testimonials, { id: uid(), name: "", role: "", quote: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm cảm nhận
          </button>
        </div>
      )}
    </div>
  );
}
