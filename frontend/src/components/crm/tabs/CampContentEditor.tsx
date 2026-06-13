"use client";

import { useRef, useState } from "react";
import type { ItineraryActivity, ItineraryDay, ManagedTour } from "@/lib/crm-data";
import ConfirmDialog from "../ConfirmDialog";

type PolicyBlock = { title: string; items: string[] };

type CampContentForm = {
  heroImage: string;
  heroDescription: string;
  volunteer: string[];
  experience: string[];
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  policies: PolicyBlock[];
};

type EditorTab = "hero" | "activities" | "itinerary" | "fees" | "policies";

type DeleteRequest =
  | { type: "hero-image" }
  | { type: "list"; key: "volunteer" | "experience" | "included" | "notIncluded"; index: number }
  | { type: "day"; index: number }
  | { type: "activity"; dayIndex: number; activityIndex: number }
  | { type: "activity-image"; dayIndex: number; activityIndex: number; imageIndex: number }
  | { type: "policy"; index: number }
  | { type: "policy-item"; policyIndex: number; itemIndex: number };

type Props = {
  tour: ManagedTour;
  onSave: (content: Partial<ManagedTour>) => void;
  onBack: () => void;
};

const DEFAULT_HERO_DESCRIPTION =
  "Hành trình 6 ngày 5 đêm kết hợp hoạt động tình nguyện thực tế và trải nghiệm văn hóa bản địa dành cho học sinh, sinh viên.";

const DEFAULT_POLICY: PolicyBlock = { title: "", items: [""] };
const EMPTY_ACTIVITY: ItineraryActivity = { timeFrom: "", timeTo: "", name: "", description: "", images: [] };

function cleanList(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function emptyActivity() {
  return { ...EMPTY_ACTIVITY, images: [] };
}

function emptyDay(day: number): ItineraryDay {
  return { day, title: `Ngày ${day}`, activities: [] };
}

function formatTimeDigits(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

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
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover"
            onError={(event) => {
              (event.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-xs font-semibold text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>upload</span>
              Đổi
            </button>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-error text-white text-xs font-semibold hover:bg-error/90 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
              Xóa
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            const file = event.dataTransfer.files?.[0];
            if (file) pickFile(file);
          }}
          onClick={() => fileRef.current?.click()}
          className={`h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
            dragOver ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low/50"
          }`}
        >
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 24 }}>
            add_photo_alternate
          </span>
          <p className="text-xs text-on-surface-variant">{label}</p>
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) pickFile(file);
          event.target.value = "";
        }}
      />
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

export default function CampContentEditor({ tour, onSave, onBack }: Props) {
  const [tab, setTab] = useState<EditorTab>("hero");
  const [dragOver, setDragOver] = useState(false);
  const [deleteRequest, setDeleteRequest] = useState<DeleteRequest | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CampContentForm>({
    heroImage: tour.heroImage ?? "",
    heroDescription: tour.heroDescription ?? DEFAULT_HERO_DESCRIPTION,
    volunteer: tour.volunteer?.length ? [...tour.volunteer] : [""],
    experience: tour.experience?.length ? [...tour.experience] : [""],
    itinerary: tour.itinerary?.length
      ? tour.itinerary.map((day) => ({
          ...day,
          activities: day.activities.map((activity) => ({
            ...activity,
            images: activity.images ?? [],
          })),
        }))
      : [emptyDay(1)],
    included: tour.included?.length ? [...tour.included] : [""],
    notIncluded: tour.notIncluded?.length ? [...tour.notIncluded] : [""],
      policies: tour.policies?.length
      ? tour.policies.map((policy) => ({ title: policy.title, items: [...policy.items] }))
      : [{ ...DEFAULT_POLICY }],
  });

  const tabs: { id: EditorTab; label: string; icon: string }[] = [
    { id: "hero", label: "Ảnh nền & Mô tả", icon: "image" },
    { id: "activities", label: "Hoạt động", icon: "volunteer_activism" },
    { id: "itinerary", label: "Lịch trình", icon: "event_note" },
    { id: "fees", label: "Chi phí", icon: "receipt_long" },
    { id: "policies", label: "Chính sách", icon: "policy" },
  ];

  function save() {
    onSave({
      heroImage: form.heroImage.trim() || undefined,
      heroDescription: form.heroDescription.trim() || undefined,
      volunteer: cleanList(form.volunteer),
      experience: cleanList(form.experience),
      itinerary: form.itinerary
        .filter((day) => day.title.trim() || day.activities.some((activity) => activity.name.trim()))
        .map((day, index) => ({
          ...day,
          day: index + 1,
          title: day.title.trim(),
          activities: day.activities
            .filter((activity) => activity.name.trim() || activity.description.trim())
            .map((activity) => ({
              ...activity,
              timeFrom: activity.timeFrom.trim(),
              timeTo: activity.timeTo.trim(),
              name: activity.name.trim(),
              description: activity.description.trim(),
              images: activity.images ?? [],
            })),
        })),
      included: cleanList(form.included),
      notIncluded: cleanList(form.notIncluded),
      policies: form.policies
        .filter((policy) => policy.title.trim() || policy.items.some((item) => item.trim()))
        .map((policy) => ({
          title: policy.title.trim(),
          items: cleanList(policy.items),
        })),
    });
    onBack();
  }

  function updateList(
    key: "volunteer" | "experience" | "included" | "notIncluded",
    index: number,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [key]: current[key].map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  }

  function addListItem(key: "volunteer" | "experience" | "included" | "notIncluded") {
    setForm((current) => ({ ...current, [key]: [...current[key], ""] }));
  }

  function setDayTitle(dayIndex: number, value: string) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.map((day, index) =>
        index === dayIndex ? { ...day, title: value } : day,
      ),
    }));
  }

  function addItineraryDay() {
    const nextDay = form.itinerary.length + 1;
    setForm((current) => ({ ...current, itinerary: [...current.itinerary, emptyDay(nextDay)] }));
  }

  function removeItineraryDay(dayIndex: number) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.filter((_, index) => index !== dayIndex).map((day, index) => ({ ...day, day: index + 1 })),
    }));
  }

  function addActivity(dayIndex: number) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.map((day, index) =>
        index === dayIndex ? { ...day, activities: [...day.activities, emptyActivity()] } : day,
      ),
    }));
  }

  function removeActivity(dayIndex: number, activityIndex: number) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.map((day, index) =>
        index === dayIndex
          ? { ...day, activities: day.activities.filter((_, innerIndex) => innerIndex !== activityIndex) }
          : day,
      ),
    }));
  }

  function setActivityField(
    dayIndex: number,
    activityIndex: number,
    field: "timeFrom" | "timeTo" | "name" | "description",
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              activities: day.activities.map((activity, innerIndex) =>
                innerIndex === activityIndex ? { ...activity, [field]: value } : activity,
              ),
            }
          : day,
      ),
    }));
  }

  function setActivityImage(dayIndex: number, activityIndex: number, imageIndex: number, value: string) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.map((day, index) => {
        if (index !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.map((activity, innerIndex) => {
            if (innerIndex !== activityIndex) return activity;
            const images = [...(activity.images ?? [])];
            if (value) {
              images[imageIndex] = value;
            } else {
              images.splice(imageIndex, 1);
            }
            return { ...activity, images: images.filter(Boolean) };
          }),
        };
      }),
    }));
  }

  function updatePolicy(policyIndex: number, value: string) {
    setForm((current) => ({
      ...current,
      policies: current.policies.map((policy, index) => (index === policyIndex ? { ...policy, title: value } : policy)),
    }));
  }

  function updatePolicyItem(policyIndex: number, itemIndex: number, value: string) {
    setForm((current) => ({
      ...current,
      policies: current.policies.map((policy, index) =>
        index === policyIndex
          ? { ...policy, items: policy.items.map((item, innerIndex) => (innerIndex === itemIndex ? value : item)) }
          : policy,
      ),
    }));
  }

  function getDeleteMessage(req: DeleteRequest | null) {
    if (!req) return "";
    if (req.type === "hero-image") return "Xóa ảnh hero của chương trình này?";
    if (req.type === "day") return "Bạn có chắc muốn xóa ngày này cùng toàn bộ khung giờ bên trong?";
    if (req.type === "activity") return "Bạn có chắc muốn xóa khung giờ hoạt động này?";
    if (req.type === "activity-image") return "Bạn có chắc muốn xóa ảnh minh họa này?";
    if (req.type === "policy") return "Xóa nhóm chính sách này?";
    if (req.type === "policy-item") return "Xóa dòng chính sách này?";
    return "Xóa nội dung này?";
  }

  function confirmDelete() {
    if (!deleteRequest) return;

    if (deleteRequest.type === "hero-image") {
      setForm((current) => ({ ...current, heroImage: "" }));
    } else if (deleteRequest.type === "list") {
      setForm((current) => ({
        ...current,
        [deleteRequest.key]: current[deleteRequest.key].filter((_, index) => index !== deleteRequest.index),
      }));
    } else if (deleteRequest.type === "day") {
      removeItineraryDay(deleteRequest.index);
    } else if (deleteRequest.type === "activity") {
      removeActivity(deleteRequest.dayIndex, deleteRequest.activityIndex);
    } else if (deleteRequest.type === "activity-image") {
      setActivityImage(deleteRequest.dayIndex, deleteRequest.activityIndex, deleteRequest.imageIndex, "");
    } else if (deleteRequest.type === "policy") {
      setForm((current) => ({
        ...current,
        policies: current.policies.filter((_, index) => index !== deleteRequest.index),
      }));
    } else if (deleteRequest.type === "policy-item") {
      setForm((current) => ({
        ...current,
        policies: current.policies.map((policy, index) =>
          index === deleteRequest.policyIndex
            ? { ...policy, items: policy.items.filter((_, innerIndex) => innerIndex !== deleteRequest.itemIndex) }
            : policy,
        ),
      }));
    }

    setDeleteRequest(null);
  }

  function renderListEditor(
    key: "volunteer" | "experience" | "included" | "notIncluded",
    label: string,
    description: string,
    placeholder: string,
    icon: string,
  ) {
    return (
      <div>
        <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">{label}</p>
        <p className="text-xs text-on-surface-variant mb-3">{description}</p>
        <div className="space-y-2">
          {form[key].map((item, index) => (
            <div key={`${key}-${index}`} className="flex gap-2 items-center">
              <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 18 }}>
                {icon}
              </span>
              <input
                type="text"
                value={item}
                placeholder={`${placeholder} ${index + 1}...`}
                onChange={(event) => updateList(key, index, event.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
              />
              <button
                type="button"
                onClick={() => setDeleteRequest({ type: "list", key, index })}
                disabled={form[key].length <= 1}
                className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-30"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addListItem(key)}
          className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          Thêm dòng
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
        Danh sách chương trình
      </button>

      <div>
        <h2 className="text-lg font-bold text-on-surface">Nội dung trang chi tiết trại hè</h2>
        <p className="text-sm text-on-surface-variant truncate max-w-lg">{tour.title}</p>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="flex gap-1 px-6 pt-4 border-b border-outline-variant/20 overflow-x-auto">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${
                tab === item.id
                  ? "text-deep-amethyst border-deep-amethyst"
                  : "text-on-surface-variant border-transparent hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        <div className="px-6 py-6 max-w-3xl">
          {tab === "hero" && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Ảnh nền</label>
                {form.heroImage ? (
                  <div className="relative rounded-xl overflow-hidden h-52 bg-surface-container-low group">
                    <img src={form.heroImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>upload</span>
                        Đổi ảnh
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteRequest({ type: "hero-image" })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                        Xóa ảnh
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(event) => {
                      event.preventDefault();
                      setDragOver(false);
                      const file = event.dataTransfer.files?.[0];
                      if (file?.type.startsWith("image/")) {
                        setForm((current) => ({ ...current, heroImage: URL.createObjectURL(file) }));
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                      dragOver ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 36 }}>
                      cloud_upload
                    </span>
                    <p className="text-sm font-semibold text-on-surface-variant">Kéo thả ảnh vào đây</p>
                    <p className="text-xs text-on-surface-variant/70">hoặc click để chọn file</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setForm((current) => ({ ...current, heroImage: URL.createObjectURL(file) }));
                    event.target.value = "";
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                  Mô tả chương trình
                  <span className="ml-2 text-xs font-normal text-on-surface-variant/60 bg-surface-container px-2 py-0.5 rounded-full">
                    Hiển thị dưới tiêu đề & dùng làm meta description
                  </span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Mô tả ngắn về chương trình, hiển thị ngay dưới tiêu đề trên trang chi tiết..."
                  value={form.heroDescription}
                  onChange={(event) => setForm((current) => ({ ...current, heroDescription: event.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
                <p className="text-xs text-on-surface-variant mt-1">
                  {form.heroDescription.length} ký tự · Nên từ 120–160 ký tự
                </p>
              </div>
            </div>
          )}

          {tab === "activities" && (
            <div className="space-y-7">
              {renderListEditor(
                "volunteer",
                "Hoạt động tình nguyện",
                "Hiển thị trong tab Hoạt động tình nguyện của section Hoạt động trong chương trình.",
                "Hoạt động",
                "volunteer_activism",
              )}
              {renderListEditor(
                "experience",
                "Trải nghiệm văn hóa và kỹ năng",
                "Hiển thị trong tab Trải nghiệm của section Hoạt động trong chương trình.",
                "Trải nghiệm",
                "explore",
              )}
            </div>
          )}

          {tab === "itinerary" && (
            <div className="space-y-5">
              <p className="text-sm text-on-surface-variant">Lịch trình theo từng ngày, chia theo khung giờ hoạt động.</p>

              {form.itinerary.map((day, dayIndex) => (
                <div key={dayIndex} className="border border-outline-variant/40 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-low/60 border-b border-outline-variant/20">
                    <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {day.day}
                    </span>
                    <input
                      type="text"
                      placeholder={`Tiêu đề ngày ${day.day}...`}
                      value={day.title}
                      onChange={(event) => setDayTitle(dayIndex, event.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteRequest({ type: "day", index: dayIndex })}
                      disabled={form.itinerary.length === 1}
                      className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>

                  <div className="px-4 py-4 space-y-4">
                    {day.activities.length === 0 && (
                      <p className="text-xs text-on-surface-variant text-center py-2 italic">Chưa có khung giờ nào.</p>
                    )}

                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="bg-surface-container-low/40 rounded-xl p-4 space-y-3 border border-outline-variant/20">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary shrink-0" style={{ fontSize: 16 }}>schedule</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="07:00"
                            value={activity.timeFrom}
                            onChange={(event) => setActivityField(dayIndex, activityIndex, "timeFrom", formatTimeDigits(event.target.value))}
                            className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary bg-white w-24 text-center"
                          />
                          <span className="text-sm text-on-surface-variant">-</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="09:00"
                            value={activity.timeTo}
                            onChange={(event) => setActivityField(dayIndex, activityIndex, "timeTo", formatTimeDigits(event.target.value))}
                            className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary bg-white w-24 text-center"
                          />
                          <button
                            type="button"
                            onClick={() => setDeleteRequest({ type: "activity", dayIndex, activityIndex })}
                            className="ml-auto text-on-surface-variant hover:text-error transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                          </button>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-on-surface-variant mb-1">Tên hoạt động</label>
                          <input
                            type="text"
                            placeholder="VD: Di chuyển đến địa điểm..."
                            value={activity.name}
                            onChange={(event) => setActivityField(dayIndex, activityIndex, "name", event.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-on-surface-variant mb-1">Mô tả</label>
                          <textarea
                            rows={2}
                            placeholder="Mô tả chi tiết hoạt động..."
                            value={activity.description}
                            onChange={(event) => setActivityField(dayIndex, activityIndex, "description", event.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-on-surface-variant mb-2">Ảnh minh họa (tối đa 2)</label>
                          <div className="grid grid-cols-2 gap-3">
                            <ImageSlot
                              value={activity.images?.[0] ?? ""}
                              onChange={(value) => setActivityImage(dayIndex, activityIndex, 0, value)}
                              label="Ảnh 1"
                            />
                            <ImageSlot
                              value={activity.images?.[1] ?? ""}
                              onChange={(value) => setActivityImage(dayIndex, activityIndex, 1, value)}
                              label="Ảnh 2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addActivity(dayIndex)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add_circle</span>
                      Thêm khung giờ
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addItineraryDay}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                Thêm ngày
              </button>
            </div>
          )}

          {tab === "fees" && (
            <div className="space-y-7">
              {renderListEditor(
                "included",
                "Chi phí đã bao gồm",
                "Hiển thị ở cột Chi phí đã bao gồm trong section Lưu ý chương trình.",
                "Khoản đã bao gồm",
                "check_circle",
              )}
              {renderListEditor(
                "notIncluded",
                "Chi phí chưa bao gồm",
                "Hiển thị ở cột Chi phí chưa bao gồm trong section Lưu ý chương trình.",
                "Khoản chưa bao gồm",
                "cancel",
              )}
            </div>
          )}

          {tab === "policies" && (
            <div className="space-y-4">
              <p className="text-sm text-on-surface-variant">
                Các nhóm này tương ứng phần “Chính sách chương trình” trên trang chi tiết.
              </p>
              {form.policies.map((policy, policyIndex) => (
                <div key={policyIndex} className="border border-outline-variant/40 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-low/60 border-b border-outline-variant/20">
                    <input
                      type="text"
                      value={policy.title}
                      placeholder="Tiêu đề chính sách"
                      onChange={(event) => updatePolicy(policyIndex, event.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary bg-white font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setDeleteRequest({ type: "policy", index: policyIndex })}
                      disabled={form.policies.length <= 1}
                      className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-30"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    {policy.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex gap-2 items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-solar-orange shrink-0" />
                        <input
                          type="text"
                          value={item}
                          placeholder={`Dòng chính sách ${itemIndex + 1}...`}
                          onChange={(event) => updatePolicyItem(policyIndex, itemIndex, event.target.value)}
                          className="flex-1 px-3 py-2 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setDeleteRequest({ type: "policy-item", policyIndex, itemIndex })}
                          disabled={policy.items.length <= 1}
                          className="text-on-surface-variant hover:text-error transition-colors disabled:opacity-30"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>delete</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          policies: current.policies.map((item, index) =>
                            index === policyIndex ? { ...item, items: [...item.items, ""] } : item,
                          ),
                        }))
                      }
                      className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                      Thêm dòng chính sách
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, policies: [...current.policies, { ...DEFAULT_POLICY }] }))}
                className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
                Thêm nhóm chính sách
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-2 px-6 py-4 border-t border-outline-variant/20">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={save}
            className="px-5 py-2.5 rounded-xl bg-deep-amethyst text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Lưu nội dung
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteRequest}
        message={getDeleteMessage(deleteRequest)}
        onCancel={() => setDeleteRequest(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
