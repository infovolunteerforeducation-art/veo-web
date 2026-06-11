"use client";

import { useState, useRef } from "react";
import { ManagedTour, ItineraryDay, ItineraryActivity } from "@/lib/crm-data";
import ConfirmDialog from "../ConfirmDialog";

type ContentForm = {
  heroImage: string;
  heroDescription: string;
  goals: string[];
  goalsDescription: string;
  itinerary: ItineraryDay[];
};

type EditorTab = "hero" | "goals" | "itinerary";

type DeleteRequest =
  | { type: "hero-image" }
  | { type: "goal"; index: number }
  | { type: "day"; index: number }
  | { type: "activity"; dayIndex: number; activityIndex: number }
  | { type: "activity-image"; dayIndex: number; activityIndex: number; imageIndex: number };

type Props = {
  tour: ManagedTour;
  onSave: (content: Partial<ManagedTour>) => void;
  onBack: () => void;
};

const EMPTY_ACTIVITY: ItineraryActivity = { timeFrom: "", timeTo: "", name: "", description: "", images: [] };

function formatTimeDigits(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

// ── Small reusable image-upload slot ───────────────────────────────────────────
function ImageSlot({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function pickFile(file: File) {
    if (file.type.startsWith("image/")) onChange(URL.createObjectURL(file));
  }

  return (
    <div>
      {value ? (
        <div className="relative rounded-lg overflow-hidden h-32 bg-surface-container-low group">
          <img src={value} alt={label} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload</span>Đổi
            </button>
            <button type="button" onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-error text-white text-xs font-semibold hover:bg-error/90 transition-colors">
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>Xóa
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) pickFile(f); }}
          onClick={() => fileRef.current?.click()}
          className={`h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
            dragOver ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low/50"
          }`}
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 24 }}>add_photo_alternate</span>
          <p className="text-xs text-on-surface-variant">{label}</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); e.target.value = ""; }} />
      <ConfirmDialog
        open={confirmOpen}
        message="Bạn có chắc muốn xóa ảnh minh họa này?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          onChange("");
          setConfirmOpen(false);
        }}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

export default function TourContentEditor({ tour, onSave, onBack }: Props) {
  const [tab, setTab] = useState<EditorTab>("hero");
  const [form, setForm] = useState<ContentForm>({
    heroImage: tour.heroImage ?? "",
    heroDescription: tour.heroDescription ?? "",
    goals: tour.goals?.length ? [...tour.goals] : [""],
    goalsDescription: tour.goalsDescription ?? "",
    itinerary: tour.itinerary?.length
      ? tour.itinerary.map((d) => ({ ...d, activities: d.activities?.map((a) => ({ ...a, images: [...(a.images ?? [])] })) ?? [] }))
      : [{ day: 1, title: "Ngày 1", activities: [] }],
  });
  const [dragOver, setDragOver] = useState(false);
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function save() {
    const cleanItinerary = form.itinerary
      .map((d) => ({
        ...d,
        activities: d.activities
          .filter((a) => a.name.trim())
          .map((a) => ({ ...a, images: a.images.filter((img) => img.trim()) })),
      }))
      .filter((d) => d.activities.length > 0);

    onSave({
      heroImage: form.heroImage.trim() || undefined,
      heroDescription: form.heroDescription.trim() || undefined,
      goalsDescription: form.goalsDescription.trim() || undefined,
      goals: form.goals.filter((g) => g.trim()).length > 0 ? form.goals.filter((g) => g.trim()) : undefined,
      itinerary: cleanItinerary.length > 0 ? cleanItinerary : undefined,
    });
    onBack();
  }

  // Hero image helpers
  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setForm((f) => ({ ...f, heroImage: URL.createObjectURL(file) }));
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setForm((f) => ({ ...f, heroImage: URL.createObjectURL(file) }));
    e.target.value = "";
  }

  // Goals helpers
  function setGoal(i: number, v: string) {
    setForm((f) => ({ ...f, goals: f.goals.map((g, idx) => (idx === i ? v : g)) }));
  }
  function addGoal() { setForm((f) => ({ ...f, goals: [...f.goals, ""] })); }
  function removeGoal(i: number) { setForm((f) => ({ ...f, goals: f.goals.filter((_, idx) => idx !== i) })); }

  // Itinerary day helpers
  function setDayTitle(di: number, v: string) {
    setForm((f) => ({ ...f, itinerary: f.itinerary.map((d, i) => (i === di ? { ...d, title: v } : d)) }));
  }
  function addItineraryDay() {
    const nextDay = form.itinerary.length + 1;
    setForm((f) => ({ ...f, itinerary: [...f.itinerary, { day: nextDay, title: `Ngày ${nextDay}`, activities: [] }] }));
  }
  function removeItineraryDay(di: number) {
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.filter((_, i) => i !== di).map((d, i) => ({ ...d, day: i + 1 })),
    }));
  }

  // Activity helpers
  function addActivity(di: number) {
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) =>
        i === di ? { ...d, activities: [...d.activities, { ...EMPTY_ACTIVITY, images: [] }] } : d
      ),
    }));
  }
  function removeActivity(di: number, ai: number) {
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) =>
        i === di ? { ...d, activities: d.activities.filter((_, j) => j !== ai) } : d
      ),
    }));
  }
  function setActivityField(di: number, ai: number, field: keyof Omit<ItineraryActivity, "images">, v: string) {
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) =>
        i === di
          ? { ...d, activities: d.activities.map((a, j) => (j === ai ? { ...a, [field]: v } : a)) }
          : d
      ),
    }));
  }
  function setActivityImage(di: number, ai: number, imgIdx: number, v: string) {
    setForm((f) => ({
      ...f,
      itinerary: f.itinerary.map((d, i) => {
        if (i !== di) return d;
        return {
          ...d,
          activities: d.activities.map((a, j) => {
            if (j !== ai) return a;
            const imgs = [...(a.images ?? [])];
            if (v) imgs[imgIdx] = v; else imgs.splice(imgIdx, 1);
            return { ...a, images: imgs.filter(Boolean) };
          }),
        };
      }),
    }));
  }

  function getDeleteMessage(request: DeleteRequest | null): string {
    if (!request) return "";
    if (request.type === "hero-image") return "Bạn có chắc muốn xóa ảnh nền của chương trình này?";
    if (request.type === "goal") return "Bạn có chắc muốn xóa mục tiêu này?";
    if (request.type === "day") return "Bạn có chắc muốn xóa ngày này cùng toàn bộ khung giờ bên trong?";
    if (request.type === "activity") return "Bạn có chắc muốn xóa khung giờ hoạt động này?";
    return "Bạn có chắc muốn xóa ảnh minh họa này?";
  }

  function confirmDeleteRequest() {
    if (!deleteRequest) return;
    if (deleteRequest.type === "hero-image") {
      setForm((f) => ({ ...f, heroImage: "" }));
    } else if (deleteRequest.type === "goal") {
      removeGoal(deleteRequest.index);
    } else if (deleteRequest.type === "day") {
      removeItineraryDay(deleteRequest.index);
    } else if (deleteRequest.type === "activity") {
      removeActivity(deleteRequest.dayIndex, deleteRequest.activityIndex);
    } else {
      setActivityImage(deleteRequest.dayIndex, deleteRequest.activityIndex, deleteRequest.imageIndex, "");
    }
    setDeleteRequest(null);
  }

  const TABS: { id: EditorTab; label: string; icon: string }[] = [
    { id: "hero", label: "Ảnh nền & Mô tả", icon: "image" },
    { id: "goals", label: "Mục tiêu", icon: "flag" },
    { id: "itinerary", label: "Lịch trình", icon: "map" },
  ];

  return (
    <div className="space-y-3">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
        Danh sách chương trình
      </button>

      {/* Page title */}
      <div>
        <h2 className="text-lg font-bold text-on-surface">Nội dung trang</h2>
        <p className="text-sm text-on-surface-variant truncate max-w-lg">{tour.title}</p>
      </div>

      {/* Editor card */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-4 border-b border-outline-variant/20">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                tab === t.id
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-w-2xl">

          {/* ── Hero tab ── */}
          {tab === "hero" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Ảnh nền</label>

                {form.heroImage ? (
                  <div className="relative rounded-xl overflow-hidden h-52 bg-surface-container-low group">
                    <img
                      src={form.heroImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>Đổi ảnh
                      </button>
                      <button type="button" onClick={() => setDeleteRequest({ type: "hero-image" })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>Xóa ảnh
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleFileDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                      dragOver ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 36 }}>cloud_upload</span>
                    <p className="text-sm font-semibold text-on-surface-variant">Kéo & thả ảnh vào đây</p>
                    <p className="text-xs text-on-surface-variant/70">hoặc click để chọn file</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                  Mô tả chương trình
                  <span className="ml-2 text-xs font-normal text-on-surface-variant/60 bg-surface-container px-2 py-0.5 rounded-full">Hiển thị dưới tiêu đề & dùng làm meta description</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Mô tả ngắn về chương trình, hiển thị ngay dưới tiêu đề trên trang chi tiết..."
                  value={form.heroDescription}
                  onChange={(e) => setForm((f) => ({ ...f, heroDescription: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <p className="text-xs text-on-surface-variant mt-1">{form.heroDescription.length} ký tự · Nên từ 120–160 ký tự</p>
              </div>
            </div>
          )}

          {/* ── Goals tab ── */}
          {tab === "goals" && (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">Mục tiêu sẽ hiển thị trong phần &quot;Mục tiêu chương trình&quot; trên trang chi tiết. Nội dung nên nói rõ chương trình muốn tạo ra thay đổi gì và tình nguyện viên sẽ đóng góp ra sao.</p>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Đoạn mô tả mở đầu</label>
                <textarea
                  rows={3}
                  placeholder="VD: Chương trình giúp cải thiện môi trường học tập cho trẻ em địa phương, đồng thời tạo cơ hội để tình nguyện viên tham gia các hoạt động giáo dục, giao lưu và hỗ trợ cộng đồng."
                  value={form.goalsDescription}
                  onChange={(e) => setForm((f) => ({ ...f, goalsDescription: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-on-surface-variant">Các mục tiêu cụ thể</label>
                {form.goals.map((goal, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{i + 1}</div>
                    <input
                      type="text"
                      placeholder={`Mục tiêu ${i + 1}...`}
                      value={goal}
                      onChange={(e) => setGoal(i, e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button type="button" onClick={() => setDeleteRequest({ type: "goal", index: i })} disabled={form.goals.length === 1}
                      className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>
                ))}
              </div>

              <button type="button" onClick={addGoal}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                Thêm mục tiêu
              </button>
            </div>
          )}

          {/* ── Itinerary tab ── */}
          {tab === "itinerary" && (
            <div className="space-y-5">
              <p className="text-sm text-on-surface-variant">Lịch trình theo từng ngày, chia theo khung giờ hoạt động.</p>

              {form.itinerary.map((day, di) => (
                <div key={di} className="border border-outline-variant/40 rounded-xl overflow-hidden">
                  {/* Day header */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-low/60 border-b border-outline-variant/20">
                    <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {day.day}
                    </span>
                    <input
                      type="text"
                      placeholder={`Tiêu đề ngày ${day.day}...`}
                      value={day.title}
                      onChange={(e) => setDayTitle(di, e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                    />
                    <button type="button" onClick={() => setDeleteRequest({ type: "day", index: di })} disabled={form.itinerary.length === 1}
                      className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0">
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>

                  {/* Activities */}
                  <div className="px-4 py-4 space-y-4">
                    {day.activities.length === 0 && (
                      <p className="text-xs text-on-surface-variant text-center py-2 italic">Chưa có khung giờ nào.</p>
                    )}

                    {day.activities.map((act, ai) => (
                      <div key={ai} className="bg-surface-container-low/40 rounded-xl p-4 space-y-3 border border-outline-variant/20">
                        {/* Time row — free text */}
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 16 }}>schedule</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="07:00"
                            value={act.timeFrom}
                            onChange={(e) => setActivityField(di, ai, "timeFrom", formatTimeDigits(e.target.value))}
                            className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary bg-white w-24 text-center"
                          />
                          <span className="text-sm text-on-surface-variant">–</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="09:00"
                            value={act.timeTo}
                            onChange={(e) => setActivityField(di, ai, "timeTo", formatTimeDigits(e.target.value))}
                            className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary bg-white w-24 text-center"
                          />
                          <button type="button" onClick={() => setDeleteRequest({ type: "activity", dayIndex: di, activityIndex: ai })}
                            className="ml-auto text-on-surface-variant hover:text-error transition-colors">
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                          </button>
                        </div>

                        {/* Name */}
                        <div>
                          <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tên hoạt động</label>
                          <input
                            type="text"
                            placeholder="VD: Di chuyển đến địa điểm..."
                            value={act.name}
                            onChange={(e) => setActivityField(di, ai, "name", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-semibold text-on-surface-variant mb-1">Mô tả</label>
                          <textarea
                            rows={2}
                            placeholder="Mô tả chi tiết hoạt động..."
                            value={act.description}
                            onChange={(e) => setActivityField(di, ai, "description", e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none bg-white"
                          />
                        </div>

                        {/* Images — drag & drop upload, max 2 */}
                        <div>
                          <label className="block text-xs font-semibold text-on-surface-variant mb-2">Ảnh minh họa (tối đa 2)</label>
                          <div className="grid grid-cols-2 gap-3">
                            <ImageSlot
                              value={act.images?.[0] ?? ""}
                              onChange={(v) => setActivityImage(di, ai, 0, v)}
                              label="Ảnh 1"
                            />
                            <ImageSlot
                              value={act.images?.[1] ?? ""}
                              onChange={(v) => setActivityImage(di, ai, 1, v)}
                              label="Ảnh 2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button type="button" onClick={() => addActivity(di)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
                      Thêm khung giờ
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addItineraryDay}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity">
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                Thêm ngày
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-2 px-6 py-4 border-t border-outline-variant/20">
          <button type="button" onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
          <button type="button" onClick={save}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Lưu nội dung</button>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteRequest}
        message={getDeleteMessage(deleteRequest)}
        onCancel={() => setDeleteRequest(null)}
        onConfirm={confirmDeleteRequest}
      />
    </div>
  );
}
