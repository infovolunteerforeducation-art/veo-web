"use client";

import { useState, useEffect } from "react";
import type { SchoolContent, SchoolValue, SchoolSolution, SchoolProcessStep, SchoolSafety, SchoolStat, SchoolFAQ, SchoolGallery, SchoolChallenge } from "@/lib/cms-content";
import ImageUploadSlot from "../../crm/ImageUploadSlot";

const CMS_GREEN = "#0a5c45";
function uid() { return Math.random().toString(36).slice(2, 9); }

type Section = "hero" | "gallery" | "challenges" | "values" | "solutions" | "process" | "safety" | "stats" | "faqs";

const TABS: { key: Section; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "gallery", label: "Đối tác trường học" },
  { key: "challenges", label: "Thách thức" },
  { key: "values", label: "Giá trị" },
  { key: "solutions", label: "Giải pháp" },
  { key: "process", label: "Quy trình" },
  { key: "safety", label: "An toàn" },
  { key: "stats", label: "Thống kê" },
  { key: "faqs", label: "FAQ" },
];

function SimpleList<T extends { id: string; title: string; description: string }>({
  items,
  onUpdate,
  addLabel,
}: {
  items: T[];
  onUpdate: (items: T[]) => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-on-surface-variant">#{idx + 1}</span>
            <button type="button" onClick={() => onUpdate(items.filter((_, i) => i !== idx))}
              className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
            </button>
          </div>
          <input value={item.title}
            onChange={(e) => onUpdate(items.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
            placeholder="Tiêu đề" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
          <textarea rows={2} value={item.description}
            onChange={(e) => onUpdate(items.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))}
            placeholder="Mô tả" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
        </div>
      ))}
      <button type="button"
        onClick={() => onUpdate([...items, { id: uid(), title: "", description: "" } as T])}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>{addLabel}
      </button>
    </div>
  );
}

export default function B2BSchoolTab() {
  const [data, setData] = useState<SchoolContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/cms/school").then((r) => r.json()).then((d: SchoolContent) => setData(d));
  }, []);

  function patch<K extends keyof SchoolContent>(field: K, value: SchoolContent[K]) {
    if (!data) return;
    setData({ ...data, [field]: value });
    setDirty(true);
  }

  async function handleSave() {
    if (!data) return;
    await fetch("/api/cms/school", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data) return <div className="p-8 text-sm text-on-surface-variant">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">B2B — Hoạt động ngoại khóa trường học</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Nội dung tại <a href="/hoat-dong-ngoai-khoa-truong-hoc" target="_blank" className="underline text-primary">/hoat-dong-ngoai-khoa-truong-hoc</a>
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
          <h3 className="text-sm font-bold text-on-surface">Ảnh hero & Văn bản</h3>
          <ImageUploadSlot value={data.heroImage} onChange={(v) => patch("heroImage", v)} hint="1920×1080px" />
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Tiêu đề hero</label>
            <textarea rows={2} value={data.heroTitle} onChange={(e) => patch("heroTitle", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Mô tả phụ</label>
            <textarea rows={2} value={data.heroSubtitle} onChange={(e) => patch("heroSubtitle", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">Điểm nổi bật (3 bullet dưới hero)</label>
            <div className="space-y-2">
              {data.heroPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input value={point} onChange={(e) => patch("heroPoints", data.heroPoints.map((x, i) => i === idx ? e.target.value : x))}
                    className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                  <button type="button" onClick={() => patch("heroPoints", data.heroPoints.filter((_, i) => i !== idx))}
                    className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 shrink-0">
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => patch("heroPoints", [...data.heroPoints, ""])}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>Thêm bullet
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === "gallery" && (
        <div className="grid grid-cols-2 gap-4">
          {data.partnerGallery.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-2xl border border-outline-variant/50 p-4 space-y-3">
              <ImageUploadSlot value={item.image} onChange={(v) => patch("partnerGallery", data.partnerGallery.map((x, i) => i === idx ? { ...x, image: v } : x))}
                hint="4:3" />
              <div className="flex gap-2">
                <input value={item.name} onChange={(e) => patch("partnerGallery", data.partnerGallery.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))}
                  placeholder="Tên trường" className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                <button type="button" onClick={() => patch("partnerGallery", data.partnerGallery.filter((_, i) => i !== idx))}
                  className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 shrink-0">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => patch("partnerGallery", [...data.partnerGallery, { id: uid(), name: "", image: "" }])}
            className="col-span-2 flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm trường đối tác
          </button>
        </div>
      )}

      {activeSection === "challenges" && (
        <div className="space-y-3">
          {data.challenges.map((c, idx) => (
            <div key={c.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">#{idx + 1}</span>
                <button type="button" onClick={() => patch("challenges", data.challenges.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input value={c.icon} onChange={(e) => patch("challenges", data.challenges.map((x, i) => i === idx ? { ...x, icon: e.target.value } : x))}
                  placeholder="Icon (material symbols)" className="px-3 py-2 rounded-xl border border-outline-variant text-sm font-mono outline-none focus:border-primary" />
                <input value={c.title} onChange={(e) => patch("challenges", data.challenges.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                  placeholder="Tiêu đề" className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              </div>
              <textarea rows={2} value={c.description} onChange={(e) => patch("challenges", data.challenges.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))}
                placeholder="Mô tả" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
            </div>
          ))}
          <button type="button" onClick={() => patch("challenges", [...data.challenges, { id: uid(), icon: "warning", tone: "", title: "", description: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm thách thức
          </button>
        </div>
      )}

      {activeSection === "values" && (
        <div className="space-y-4">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Giá trị dành cho nhà trường</p>
          <SimpleList<SchoolValue> items={data.schoolValues} onUpdate={(v) => patch("schoolValues", v)} addLabel="Thêm giá trị" />
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mt-4">Giá trị dành cho học sinh</p>
          <SimpleList<SchoolValue> items={data.studentValues} onUpdate={(v) => patch("studentValues", v)} addLabel="Thêm giá trị" />
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mt-4">Giá trị dành cho phụ huynh</p>
          <SimpleList<SchoolValue> items={data.parentValues} onUpdate={(v) => patch("parentValues", v)} addLabel="Thêm giá trị" />
        </div>
      )}

      {activeSection === "solutions" && (
        <SimpleList<SchoolSolution> items={data.solutions} onUpdate={(v) => patch("solutions", v)} addLabel="Thêm giải pháp" />
      )}

      {activeSection === "process" && (
        <div className="space-y-3">
          {data.process.map((step, idx) => (
            <div key={step.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">Bước {idx + 1}</span>
                <button type="button" onClick={() => patch("process", data.process.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <div className="grid grid-cols-[80px_1fr] gap-3">
                <input value={step.step} onChange={(e) => patch("process", data.process.map((x, i) => i === idx ? { ...x, step: e.target.value } : x))}
                  placeholder="01" className="px-3 py-2 rounded-xl border border-outline-variant text-sm font-mono outline-none focus:border-primary" />
                <input value={step.title} onChange={(e) => patch("process", data.process.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                  placeholder="Tiêu đề" className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              </div>
              <textarea rows={2} value={step.description} onChange={(e) => patch("process", data.process.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))}
                placeholder="Mô tả" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
            </div>
          ))}
          <button type="button" onClick={() => patch("process", [...data.process, { id: uid(), step: `0${data.process.length + 1}`, title: "", description: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm bước
          </button>
        </div>
      )}

      {activeSection === "safety" && (
        <SimpleList<SchoolSafety> items={data.safety} onUpdate={(v) => patch("safety", v)} addLabel="Thêm mục an toàn" />
      )}

      {activeSection === "stats" && (
        <div className="space-y-3">
          {data.veoStats.map((stat, idx) => (
            <div key={stat.id} className="bg-white rounded-2xl border border-outline-variant/50 p-4 flex gap-3 items-center">
              <input value={stat.value} onChange={(e) => patch("veoStats", data.veoStats.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))}
                placeholder="12+" className="w-28 px-3 py-2 rounded-xl border border-outline-variant text-sm font-bold outline-none focus:border-primary" />
              <input value={stat.label} onChange={(e) => patch("veoStats", data.veoStats.map((x, i) => i === idx ? { ...x, label: e.target.value } : x))}
                placeholder="năm hoạt động" className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              <button type="button" onClick={() => patch("veoStats", data.veoStats.filter((_, i) => i !== idx))}
                className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 shrink-0">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => patch("veoStats", [...data.veoStats, { id: uid(), value: "", label: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm chỉ số
          </button>
        </div>
      )}

      {activeSection === "faqs" && (
        <div className="space-y-3">
          {data.faqs.map((faq, idx) => (
            <div key={faq.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">FAQ {idx + 1}</span>
                <button type="button" onClick={() => patch("faqs", data.faqs.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <input value={faq.q} onChange={(e) => patch("faqs", data.faqs.map((x, i) => i === idx ? { ...x, q: e.target.value } : x))}
                placeholder="Câu hỏi" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              <textarea rows={3} value={faq.a} onChange={(e) => patch("faqs", data.faqs.map((x, i) => i === idx ? { ...x, a: e.target.value } : x))}
                placeholder="Trả lời" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
            </div>
          ))}
          <button type="button" onClick={() => patch("faqs", [...data.faqs, { id: uid(), q: "", a: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm câu hỏi
          </button>
        </div>
      )}
    </div>
  );
}
