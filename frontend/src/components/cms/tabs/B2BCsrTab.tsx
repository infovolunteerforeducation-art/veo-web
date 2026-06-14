"use client";

import { useState, useEffect } from "react";
import type { CsrContent, CsrLogo, CsrTextItem, CsrProject, CsrProcess, CsrFAQ } from "@/lib/cms-content";
import ImageUploadSlot from "../../crm/ImageUploadSlot";

const CMS_GREEN = "#0a5c45";
function uid() { return Math.random().toString(36).slice(2, 9); }

type Section = "hero" | "logos" | "gallery" | "challenges" | "solutions" | "values" | "projects" | "reasons" | "process" | "faqs";

const TABS: { key: Section; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "logos", label: "Logo đối tác" },
  { key: "gallery", label: "Dự án tiêu biểu" },
  { key: "challenges", label: "Thách thức" },
  { key: "solutions", label: "Giải pháp" },
  { key: "values", label: "Giá trị" },
  { key: "projects", label: "Case studies" },
  { key: "reasons", label: "Lý do chọn VEO" },
  { key: "process", label: "Quy trình" },
  { key: "faqs", label: "FAQ" },
];

function TextItemList({
  items,
  onUpdate,
  addLabel,
}: {
  items: CsrTextItem[];
  onUpdate: (items: CsrTextItem[]) => void;
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
          <input value={item.title} onChange={(e) => onUpdate(items.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
            placeholder="Tiêu đề" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
          <textarea rows={3} value={item.description} onChange={(e) => onUpdate(items.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))}
            placeholder="Mô tả" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
        </div>
      ))}
      <button type="button" onClick={() => onUpdate([...items, { id: uid(), title: "", description: "" }])}
        className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>{addLabel}
      </button>
    </div>
  );
}

export default function B2BCsrTab() {
  const [data, setData] = useState<CsrContent | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/cms/csr").then((r) => r.json()).then((d: CsrContent) => setData(d));
  }, []);

  function patch<K extends keyof CsrContent>(field: K, value: CsrContent[K]) {
    if (!data) return;
    setData({ ...data, [field]: value });
    setDirty(true);
  }

  async function handleSave() {
    if (!data) return;
    await fetch("/api/cms/csr", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!data) return <div className="p-8 text-sm text-on-surface-variant">Đang tải...</div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">B2B — Chiến lược CSR</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Nội dung tại <a href="/chien-luoc-csr-cho-doanh-nghiep" target="_blank" className="underline text-primary">/chien-luoc-csr-cho-doanh-nghiep</a>
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
        <div className="bg-white rounded-2xl border border-outline-variant/50 p-6">
          <h3 className="text-sm font-bold text-on-surface mb-4">Ảnh hero (1920×1080px)</h3>
          <ImageUploadSlot value={data.heroImage} onChange={(v) => patch("heroImage", v)} label="Ảnh hero" hint="1920×1080px" />
        </div>
      )}

      {activeSection === "logos" && (
        <div className="space-y-3">
          {data.partnerLogos.map((logo, idx) => (
            <div key={logo.id} className="bg-white rounded-2xl border border-outline-variant/50 p-4 flex gap-4 items-center">
              <div className="w-32 shrink-0">
                <ImageUploadSlot value={logo.image} onChange={(v) => patch("partnerLogos", data.partnerLogos.map((x, i) => i === idx ? { ...x, image: v } : x))}
                  label="Logo" hint="Logo" />
              </div>
              <input value={logo.name} onChange={(e) => patch("partnerLogos", data.partnerLogos.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))}
                placeholder="Tên đối tác" className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              <button type="button" onClick={() => patch("partnerLogos", data.partnerLogos.filter((_, i) => i !== idx))}
                className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 shrink-0">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
              </button>
            </div>
          ))}
          <button type="button" onClick={() => patch("partnerLogos", [...data.partnerLogos, { id: uid(), name: "", image: "" }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm logo
          </button>
        </div>
      )}

      {activeSection === "gallery" && (
        <div className="grid grid-cols-2 gap-4">
          {data.partnerGallery.map((item, idx) => (
            <div key={item.id} className="bg-white rounded-2xl border border-outline-variant/50 p-4 space-y-3">
              <ImageUploadSlot value={item.image} onChange={(v) => patch("partnerGallery", data.partnerGallery.map((x, i) => i === idx ? { ...x, image: v } : x))}
                label="Ảnh dự án" hint="4:3" />
              <div className="flex gap-2">
                <input value={item.name} onChange={(e) => patch("partnerGallery", data.partnerGallery.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))}
                  placeholder="Tên đối tác" className="flex-1 px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                <button type="button" onClick={() => patch("partnerGallery", data.partnerGallery.filter((_, i) => i !== idx))}
                  className="w-8 h-8 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 shrink-0">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                </button>
              </div>
            </div>
          ))}
          <button type="button" onClick={() => patch("partnerGallery", [...data.partnerGallery, { id: uid(), name: "", image: "" }])}
            className="col-span-2 flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm ảnh dự án
          </button>
        </div>
      )}

      {activeSection === "challenges" && (
        <TextItemList items={data.challenges} onUpdate={(v) => patch("challenges", v)} addLabel="Thêm thách thức" />
      )}

      {activeSection === "solutions" && (
        <TextItemList items={data.solutions} onUpdate={(v) => patch("solutions", v)} addLabel="Thêm giải pháp" />
      )}

      {activeSection === "values" && (
        <TextItemList items={data.values} onUpdate={(v) => patch("values", v)} addLabel="Thêm giá trị" />
      )}

      {activeSection === "reasons" && (
        <TextItemList items={data.reasons} onUpdate={(v) => patch("reasons", v)} addLabel="Thêm lý do" />
      )}

      {activeSection === "projects" && (
        <div className="space-y-4">
          {data.projects.map((proj, idx) => (
            <div key={proj.id} className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-on-surface-variant">Dự án {idx + 1}</span>
                <button type="button" onClick={() => patch("projects", data.projects.filter((_, i) => i !== idx))}
                  className="w-7 h-7 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                </button>
              </div>
              <ImageUploadSlot value={proj.image} onChange={(v) => patch("projects", data.projects.map((x, i) => i === idx ? { ...x, image: v } : x))}
                label="Ảnh case study" hint="4:3" />
              <div className="grid grid-cols-2 gap-3">
                <input value={proj.title} onChange={(e) => patch("projects", data.projects.map((x, i) => i === idx ? { ...x, title: e.target.value } : x))}
                  placeholder="Tên dự án" className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
                <input value={proj.partner} onChange={(e) => patch("projects", data.projects.map((x, i) => i === idx ? { ...x, partner: e.target.value } : x))}
                  placeholder="Đối tác" className="px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary" />
              </div>
              <textarea rows={3} value={proj.description} onChange={(e) => patch("projects", data.projects.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))}
                placeholder="Mô tả dự án" className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none" />
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-2">Các hoạt động (mỗi dòng một mục)</label>
                <textarea rows={4} value={proj.items.join("\n")}
                  onChange={(e) => patch("projects", data.projects.map((x, i) => i === idx ? { ...x, items: e.target.value.split("\n").filter(Boolean) } : x))}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary resize-none font-mono text-xs" />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => patch("projects", [...data.projects, { id: uid(), title: "", partner: "", image: "", description: "", items: [] }])}
            className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:text-primary text-on-surface-variant text-sm font-semibold transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm dự án
          </button>
        </div>
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
