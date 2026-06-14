"use client";

import { useEffect, useState } from "react";
import ImageUploadSlot from "../../crm/ImageUploadSlot";
import {
  HomepageContent, HomeBanner, HomeProgram, HomeBenefit, HomeTestimonial, HomeLogo,
} from "@/lib/cms-content";

type Section = "banners" | "programs" | "benefits" | "testimonials" | "press" | "awards";

const SECTION_TABS: { id: Section; label: string; icon: string }[] = [
  { id: "banners",      label: "Hero Banners",        icon: "image" },
  { id: "benefits",     label: "Tại sao chọn VEO",   icon: "star" },
  { id: "programs",     label: "Chương trình",        icon: "grid_view" },
  { id: "testimonials", label: "Testimonials",        icon: "format_quote" },
  { id: "press",        label: "Báo chí",             icon: "newspaper" },
  { id: "awards",       label: "Giải thưởng",         icon: "emoji_events" },
];

const EMPTY: HomepageContent = { banners: [], programs: [], benefits: [], testimonials: [], pressLogos: [], awardLogos: [] };

// ── Small reusable field ──────────────────────────────────────────────────────
function Field({ label, value, onChange, multiline = false, mono = false, placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; mono?: boolean; placeholder?: string;
}) {
  const cls = `w-full px-3 py-2.5 rounded-xl border border-outline-variant text-sm outline-none focus:border-primary transition-colors ${mono ? "font-mono" : ""}`;
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-on-surface-variant">{label}</label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={cls} />
        : <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

// ── Banner editor ─────────────────────────────────────────────────────────────
function BannerCard({ banner, onChange, onDelete }: {
  banner: HomeBanner;
  onChange: (b: HomeBanner) => void;
  onDelete: () => void;
}) {
  const u = (field: keyof HomeBanner, val: string) => onChange({ ...banner, [field]: val });
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Slide</span>
        <button type="button" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-error-container transition-colors text-on-surface-variant hover:text-error">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
        </button>
      </div>
      <ImageUploadSlot
        value={banner.image}
        onChange={(url) => u("image", url)}
        label="Ảnh banner"
        hint="1440 × 480px · Tỉ lệ 3:1"
        maxWidth={1440} maxHeight={480}
        previewHeight="h-32"
      />
      <Field label="Link đích (tùy chọn — để trống nếu là ảnh quảng cáo)" value={banner.href} onChange={(v) => u("href", v)} placeholder="/du-lich-tinh-nguyen" mono />
    </div>
  );
}

// ── Program card editor ───────────────────────────────────────────────────────
function ProgramCard({ prog, onChange, onDelete }: {
  prog: HomeProgram; onChange: (p: HomeProgram) => void; onDelete: () => void;
}) {
  const u = (field: keyof HomeProgram, val: string | boolean) => onChange({ ...prog, [field]: val });
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-on-surface truncate pr-2">{prog.title || "Chương trình mới"}</span>
        <button type="button" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-error-container transition-colors text-on-surface-variant hover:text-error shrink-0">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
        </button>
      </div>
      <ImageUploadSlot value={prog.image} onChange={(url) => u("image", url)} label="Ảnh card chương trình" hint="800 × 450px · Tỉ lệ 16:9" maxWidth={800} maxHeight={450} previewHeight="h-28" />
      <Field label="Tên chương trình" value={prog.title} onChange={(v) => u("title", v)} />
      <Field label="Mô tả ngắn" value={prog.description} onChange={(v) => u("description", v)} multiline />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Link (href)" value={prog.href} onChange={(v) => u("href", v)} mono />
        <div className="flex items-center gap-3 pt-5">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={prog.external} onChange={(e) => u("external", e.target.checked)} className="w-4 h-4 accent-primary" />
            <span className="text-sm text-on-surface-variant">Mở tab mới</span>
          </label>
        </div>
      </div>
    </div>
  );
}

// ── Benefit card ──────────────────────────────────────────────────────────────
function BenefitCard({ benefit, onChange, onDelete }: {
  benefit: HomeBenefit; onChange: (b: HomeBenefit) => void; onDelete: () => void;
}) {
  const u = (field: keyof HomeBenefit, val: string) => onChange({ ...benefit, [field]: val });
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>{benefit.icon || "star"}</span>
          <span className="text-sm font-bold text-on-surface truncate">{benefit.title || "Benefit mới"}</span>
        </div>
        <button type="button" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-error-container transition-colors text-on-surface-variant hover:text-error shrink-0">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Icon (Material Symbol)" value={benefit.icon} onChange={(v) => u("icon", v)} placeholder="handshake" mono />
        <Field label="Tiêu đề" value={benefit.title} onChange={(v) => u("title", v)} />
      </div>
      <Field label="Mô tả" value={benefit.description} onChange={(v) => u("description", v)} multiline />
    </div>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────────────
function TestimonialCard({ t, onChange, onDelete }: {
  t: HomeTestimonial; onChange: (t: HomeTestimonial) => void; onDelete: () => void;
}) {
  const u = (field: keyof HomeTestimonial, val: string) => onChange({ ...t, [field]: val });
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/50 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {t.avatar && <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />}
          <span className="text-sm font-bold text-on-surface">{t.name || "Tình nguyện viên"}</span>
        </div>
        <button type="button" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-error-container transition-colors text-on-surface-variant hover:text-error shrink-0">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
        </button>
      </div>
      <Field label="Trích dẫn (quote)" value={t.quote} onChange={(v) => u("quote", v)} multiline />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tên" value={t.name} onChange={(v) => u("name", v)} />
        <Field label="Vai trò / chuyến đi" value={t.role} onChange={(v) => u("role", v)} />
      </div>
      <Field label="Avatar URL" value={t.avatar} onChange={(v) => u("avatar", v)} placeholder="https://..." mono />
    </div>
  );
}

// ── Logo card (press / awards) ────────────────────────────────────────────────
function LogoCard({ logo, onChange, onDelete }: {
  logo: HomeLogo; onChange: (l: HomeLogo) => void; onDelete: () => void;
}) {
  const u = (field: keyof HomeLogo, val: string) => onChange({ ...logo, [field]: val });
  return (
    <div className="bg-white rounded-2xl border border-outline-variant/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-on-surface">{logo.alt || "Logo"}</span>
        <button type="button" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-error-container transition-colors text-on-surface-variant hover:text-error">
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
        </button>
      </div>
      {logo.src && (
        <img src={logo.src} alt={logo.alt} className="h-10 object-contain mx-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      )}
      <Field label="Tên (alt)" value={logo.alt} onChange={(v) => u("alt", v)} />
      <Field label="URL ảnh logo (src)" value={logo.src} onChange={(v) => u("src", v)} mono placeholder="https:// hoặc /path/to/logo.png" />
      <Field label="Link bài báo / giải thưởng (href)" value={logo.href} onChange={(v) => u("href", v)} mono placeholder="https://..." />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HomePageTab() {
  const [section, setSection] = useState<Section>("banners");
  const [data, setData] = useState<HomepageContent>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/cms/homepage")
      .then((r) => r.json())
      .then((d: HomepageContent) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function update(patch: Partial<HomepageContent>) {
    setData((d) => ({ ...d, ...patch }));
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/cms/homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  function addItem<T>(key: keyof HomepageContent, item: T) {
    update({ [key]: [...(data[key] as T[]), item] });
  }

  function newId() { return String(Date.now()); }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        <span className="material-symbols-outlined animate-spin mr-2" style={{ fontSize: 24 }}>progress_activity</span>
        Đang tải nội dung...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Trang chủ</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Chỉnh sửa nội dung hiển thị tại <span className="font-mono text-xs">/</span></p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-green-700">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check_circle</span>Đã lưu — trang chủ đã cập nhật
            </span>
          )}
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>open_in_new</span>Xem trang chủ
          </a>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty || saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{ background: "#0a5c45" }}
          >
            {saving
              ? <><span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" style={{ display: "inline-block" }} />Đang lưu...</>
              : <><span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>Lưu & cập nhật</>
            }
          </button>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1 flex-wrap border-b border-outline-variant/40 pb-0">
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSection(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              section === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Banners ── */}
      {section === "banners" && (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant">Slides trong carousel ảnh nền trang chủ. Kéo thả để sắp xếp (sắp ra mắt).</p>
          {data.banners.map((b, i) => (
            <BannerCard key={b.id} banner={b}
              onChange={(nb) => update({ banners: data.banners.map((x, xi) => xi === i ? nb : x) })}
              onDelete={() => update({ banners: data.banners.filter((_, xi) => xi !== i) })}
            />
          ))}
          <button type="button"
            onClick={() => addItem<HomeBanner>("banners", { id: newId(), image: "", href: "" })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm slide
          </button>
        </div>
      )}

      {/* ── Programs ── */}
      {section === "programs" && (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant">Các card chương trình hiển thị trong section "Các chương trình của VEO".</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.programs.map((p, i) => (
              <ProgramCard key={p.id} prog={p}
                onChange={(np) => update({ programs: data.programs.map((x, xi) => xi === i ? np : x) })}
                onDelete={() => update({ programs: data.programs.filter((_, xi) => xi !== i) })}
              />
            ))}
          </div>
          <button type="button"
            onClick={() => addItem<HomeProgram>("programs", { id: newId(), title: "", description: "", image: "", href: "/", external: false })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm chương trình
          </button>
        </div>
      )}

      {/* ── Benefits ── */}
      {section === "benefits" && (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant">4 điểm nổi bật trong section "Tại sao nên tham gia cùng VEO?". Icon dùng từ <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google Material Symbols</a>.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.benefits.map((b, i) => (
              <BenefitCard key={b.id} benefit={b}
                onChange={(nb) => update({ benefits: data.benefits.map((x, xi) => xi === i ? nb : x) })}
                onDelete={() => update({ benefits: data.benefits.filter((_, xi) => xi !== i) })}
              />
            ))}
          </div>
          <button type="button"
            onClick={() => addItem<HomeBenefit>("benefits", { id: newId(), icon: "star", title: "", description: "" })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm benefit
          </button>
        </div>
      )}

      {/* ── Testimonials ── */}
      {section === "testimonials" && (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant">Cảm nhận từ tình nguyện viên, hiển thị 3 cột trên trang chủ.</p>
          {data.testimonials.map((t, i) => (
            <TestimonialCard key={t.id} t={t}
              onChange={(nt) => update({ testimonials: data.testimonials.map((x, xi) => xi === i ? nt : x) })}
              onDelete={() => update({ testimonials: data.testimonials.filter((_, xi) => xi !== i) })}
            />
          ))}
          <button type="button"
            onClick={() => addItem<HomeTestimonial>("testimonials", { id: newId(), quote: "", name: "", role: "", avatar: "" })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm testimonial
          </button>
        </div>
      )}

      {/* ── Press logos ── */}
      {section === "press" && (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant">Logo báo chí trong section "Báo chí viết về VEO".</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.pressLogos.map((l, i) => (
              <LogoCard key={l.id} logo={l}
                onChange={(nl) => update({ pressLogos: data.pressLogos.map((x, xi) => xi === i ? nl : x) })}
                onDelete={() => update({ pressLogos: data.pressLogos.filter((_, xi) => xi !== i) })}
              />
            ))}
          </div>
          <button type="button"
            onClick={() => addItem<HomeLogo>("pressLogos", { id: newId(), alt: "", src: "", href: "" })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm báo
          </button>
        </div>
      )}

      {/* ── Award logos ── */}
      {section === "awards" && (
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant">Logo giải thưởng trong section "Giải thưởng của VEO".</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.awardLogos.map((l, i) => (
              <LogoCard key={l.id} logo={l}
                onChange={(nl) => update({ awardLogos: data.awardLogos.map((x, xi) => xi === i ? nl : x) })}
                onDelete={() => update({ awardLogos: data.awardLogos.filter((_, xi) => xi !== i) })}
              />
            ))}
          </div>
          <button type="button"
            onClick={() => addItem<HomeLogo>("awardLogos", { id: newId(), alt: "", src: "", href: "" })}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>Thêm giải thưởng
          </button>
        </div>
      )}
    </div>
  );
}
