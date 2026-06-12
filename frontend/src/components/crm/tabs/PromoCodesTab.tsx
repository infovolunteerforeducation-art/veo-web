"use client";

import { useState, useMemo } from "react";
import {
  PromoCode,
  DiscountType,
  PromoCodeStatus,
  PromoCodeVisibility,
  PromoApplicableScope,
  mockPromoCodes,
  mockTours,
} from "@/lib/crm-data";
import SelectInput from "../SelectInput";

function fmtVND(n: number): string {
  return n.toLocaleString("vi-VN") + " ₫";
}

// Format a raw number string with dots (e.g. "2500000" → "2.500.000")
function dotFmt(s: string): string {
  const digits = s.replace(/\D/g, "");
  return digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
}

// Strip dots and parse back to number
function parseDot(s: string): number {
  return Number(s.replace(/\./g, "")) || 0;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const statusConfig: Record<PromoCodeStatus, { label: string; cls: string }> = {
  active:   { label: "Đang hoạt động", cls: "bg-green-100 text-green-700" },
  inactive: { label: "Tạm ngưng",      cls: "bg-gray-100 text-gray-600" },
  expired:  { label: "Hết hạn",        cls: "bg-red-100 text-red-600" },
};

const visibilityConfig: Record<PromoCodeVisibility, { label: string; cls: string; icon: string }> = {
  public:  { label: "Công khai", cls: "bg-blue-100 text-blue-700",   icon: "public" },
  private: { label: "Riêng tư",  cls: "bg-amber-100 text-amber-700", icon: "lock" },
};

const typeConfig: Record<DiscountType, { label: string; cls: string }> = {
  percent: { label: "%",   cls: "bg-purple-100 text-purple-700" },
  amount:  { label: "VNĐ", cls: "bg-emerald-100 text-emerald-700" },
};

const scopeConfig: Record<PromoApplicableScope, { label: string; cls: string }> = {
  all:      { label: "Tất cả",        cls: "bg-gray-100 text-gray-600" },
  dltn:     { label: "Du lịch TN",    cls: "bg-blue-100 text-blue-700" },
  "traihè": { label: "Trại hè",       cls: "bg-green-100 text-green-700" },
  specific: { label: "Chương trình cụ thể", cls: "bg-orange-100 text-orange-700" },
};

type FormState = {
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string;
  maxDiscount: string;
  minOrderValue: string;
  visibility: PromoCodeVisibility;
  status: PromoCodeStatus;
  applicableScope: PromoApplicableScope;
  applicableTourIds: string[];
  usageLimit: string;
  validFrom: string;
  validTo: string;
};

const today = new Date().toISOString().split("T")[0];

const defaultForm: FormState = {
  code: "",
  description: "",
  discountType: "percent",
  discountValue: "",
  maxDiscount: "",
  minOrderValue: "",
  visibility: "public",
  status: "active",
  applicableScope: "all",
  applicableTourIds: [],
  usageLimit: "",
  validFrom: today,
  validTo: "",
};

const SELECT_CLS = "px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white";

export default function PromoCodesTab() {
  const [codes, setCodes] = useState<PromoCode[]>(mockPromoCodes);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PromoCodeStatus | "all">("all");
  const [filterVisibility, setFilterVisibility] = useState<PromoCodeVisibility | "all">("all");
  const [filterType, setFilterType] = useState<DiscountType | "all">("all");
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return codes.filter((c) => {
      if (
        search &&
        !c.code.toLowerCase().includes(search.toLowerCase()) &&
        !(c.description ?? "").toLowerCase().includes(search.toLowerCase())
      ) return false;
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterVisibility !== "all" && c.visibility !== filterVisibility) return false;
      if (filterType !== "all" && c.discountType !== filterType) return false;
      return true;
    });
  }, [codes, search, filterStatus, filterVisibility, filterType]);

  function openCreate() {
    setForm({ ...defaultForm, validFrom: today });
    setFormErrors({});
    setEditingId("new");
  }

  function openEdit(code: PromoCode, e?: React.MouseEvent) {
    e?.stopPropagation();
    setForm({
      code: code.code,
      description: code.description ?? "",
      discountType: code.discountType,
      discountValue: code.discountType === "amount" ? dotFmt(String(code.discountValue)) : String(code.discountValue),
      maxDiscount: code.maxDiscount != null ? dotFmt(String(code.maxDiscount)) : "",
      minOrderValue: code.minOrderValue != null ? dotFmt(String(code.minOrderValue)) : "",
      visibility: code.visibility,
      status: code.status,
      applicableScope: code.applicableScope,
      applicableTourIds: code.applicableTourIds ?? [],
      usageLimit: code.usageLimit != null ? String(code.usageLimit) : "",
      validFrom: code.validFrom,
      validTo: code.validTo,
    });
    setFormErrors({});
    setEditingId(code.id);
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  }

  function validate(): boolean {
    const e: Partial<Record<keyof FormState, string>> = {};
    const codeVal = form.code.trim();
    if (!codeVal) {
      e.code = "Vui lòng nhập mã";
    } else if (!/^[A-Z0-9]+$/.test(codeVal)) {
      e.code = "Chỉ dùng chữ in hoa và số";
    } else if (editingId === "new" && codes.some((c) => c.code === codeVal)) {
      e.code = "Mã này đã tồn tại";
    }
    const val = form.discountType === "amount" ? parseDot(form.discountValue) : Number(form.discountValue);
    if (!form.discountValue || val <= 0) {
      e.discountValue = "Nhập giá trị hợp lệ (> 0)";
    } else if (form.discountType === "percent" && val > 100) {
      e.discountValue = "Tỷ lệ không được vượt quá 100%";
    }
    if (!form.validFrom) e.validFrom = "Chọn ngày bắt đầu";
    if (!form.validTo) e.validTo = "Chọn ngày kết thúc";
    if (form.validFrom && form.validTo && form.validTo < form.validFrom) e.validTo = "Phải sau ngày bắt đầu";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const now = new Date().toISOString();
    const existing = editingId !== "new" ? codes.find((c) => c.id === editingId) : undefined;
    const entry: PromoCode = {
      id: editingId === "new" ? `pc-${Date.now()}` : editingId!,
      code: form.code.trim().toUpperCase(),
      description: form.description.trim() || undefined,
      discountType: form.discountType,
      discountValue: form.discountType === "amount" ? parseDot(form.discountValue) : Number(form.discountValue),
      maxDiscount: form.maxDiscount ? parseDot(form.maxDiscount) : undefined,
      minOrderValue: form.minOrderValue ? parseDot(form.minOrderValue) : undefined,
      visibility: form.visibility,
      status: form.status,
      applicableScope: form.applicableScope,
      applicableTourIds: form.applicableScope === "specific" ? form.applicableTourIds : undefined,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      usedCount: existing?.usedCount ?? 0,
      validFrom: form.validFrom,
      validTo: form.validTo,
      createdAt: existing?.createdAt ?? now,
      createdBy: "Admin",
    };
    if (editingId === "new") {
      setCodes((prev) => [entry, ...prev]);
    } else {
      setCodes((prev) => prev.map((c) => (c.id === editingId ? entry : c)));
    }
    setEditingId(null);
  }

  function handleDelete(id: string) {
    setCodes((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  }

  function copyCode(code: string, e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  const activeCount = codes.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
              style={{ fontSize: 16 }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Tìm mã hoặc mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-lg border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-52"
            />
          </div>
          <SelectInput
            value={filterStatus}
            onChange={(v) => setFilterStatus(v as PromoCodeStatus | "all")}
            options={[
              { value: "all",      label: "Tất cả trạng thái" },
              { value: "active",   label: "Đang hoạt động" },
              { value: "inactive", label: "Tạm ngưng" },
              { value: "expired",  label: "Hết hạn" },
            ]}
            className={SELECT_CLS}
          />
          <SelectInput
            value={filterVisibility}
            onChange={(v) => setFilterVisibility(v as PromoCodeVisibility | "all")}
            options={[
              { value: "all",     label: "Tất cả phạm vi" },
              { value: "public",  label: "Công khai" },
              { value: "private", label: "Riêng tư" },
            ]}
            className={SELECT_CLS}
          />
          <SelectInput
            value={filterType}
            onChange={(v) => setFilterType(v as DiscountType | "all")}
            options={[
              { value: "all",     label: "Tất cả loại giảm" },
              { value: "percent", label: "Theo %" },
              { value: "amount",  label: "Số tiền cố định" },
            ]}
            className={SELECT_CLS}
          />
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Tạo mã mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant/30">
              <tr>
                {["Mã khuyến mại", "Giảm giá", "Áp dụng", "Phạm vi", "Đã dùng", "Hiệu lực", "Trạng thái", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 select-none">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-on-surface-variant">
                    Không có mã nào phù hợp
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const sCfg = statusConfig[c.status];
                  const vCfg = visibilityConfig[c.visibility];
                  const tCfg = typeConfig[c.discountType];
                  const usagePct = c.usageLimit != null ? c.usedCount / c.usageLimit : 0;

                  return (
                    <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                      {/* Code */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-on-surface tracking-wide">{c.code}</span>
                          <button
                            type="button"
                            onClick={(e) => copyCode(c.code, e)}
                            title="Sao chép mã"
                            className="text-on-surface-variant hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                              {copied === c.code ? "check" : "content_copy"}
                            </span>
                          </button>
                        </div>
                        {c.description && (
                          <p className="text-xs text-on-surface-variant mt-0.5 max-w-[180px] truncate">
                            {c.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tCfg.cls}`}>{tCfg.label}</span>
                          <span className="font-semibold text-on-surface">
                            {c.discountType === "percent" ? `${c.discountValue}%` : fmtVND(c.discountValue)}
                          </span>
                        </div>
                        {c.discountType === "percent" && c.maxDiscount != null && (
                          <p className="text-xs text-on-surface-variant">tối đa {fmtVND(c.maxDiscount)}</p>
                        )}
                        {c.minOrderValue != null && (
                          <p className="text-xs text-on-surface-variant">đơn từ {fmtVND(c.minOrderValue)}</p>
                        )}
                      </td>

                      {/* Applicable scope */}
                      <td className="px-4 py-3">
                        {c.applicableScope === "specific" ? (
                          <div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${scopeConfig.specific.cls}`}>
                              {(c.applicableTourIds ?? []).length} chương trình
                            </span>
                            <div className="mt-1 space-y-0.5">
                              {(c.applicableTourIds ?? []).slice(0, 2).map((id) => {
                                const t = mockTours.find((t) => t.id === id);
                                return t ? (
                                  <p key={id} className="text-xs text-on-surface-variant truncate max-w-[140px]">{t.title}</p>
                                ) : null;
                              })}
                              {(c.applicableTourIds ?? []).length > 2 && (
                                <p className="text-xs text-on-surface-variant">+{(c.applicableTourIds ?? []).length - 2} khác</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${scopeConfig[c.applicableScope].cls}`}>
                            {scopeConfig[c.applicableScope].label}
                          </span>
                        )}
                      </td>

                      {/* Visibility */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold ${vCfg.cls}`}>
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: 11, fontVariationSettings: "'FILL' 1" }}
                          >
                            {vCfg.icon}
                          </span>
                          {vCfg.label}
                        </span>
                      </td>

                      {/* Usage */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-on-surface">
                          {c.usedCount}{c.usageLimit != null ? ` / ${c.usageLimit}` : " / ∞"}
                        </p>
                        {c.usageLimit != null && (
                          <div className="mt-1 w-16 h-1.5 rounded-full bg-outline-variant/30 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                usagePct >= 1 ? "bg-error" : usagePct >= 0.8 ? "bg-solar-orange" : "bg-primary"
                              }`}
                              style={{ width: `${Math.min(usagePct * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Valid dates */}
                      <td className="px-4 py-3 text-on-surface-variant text-xs whitespace-nowrap">
                        {formatDate(c.validFrom)}
                        <br />→ {formatDate(c.validTo)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sCfg.cls}`}>
                          {sCfg.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => openEdit(c, e)}
                            className="flex items-center gap-1 text-sm px-2.5 py-1 rounded-lg bg-surface-container font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(c.id)}
                            className="flex items-center gap-1 text-sm px-2.5 py-1 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors font-semibold"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-outline-variant/20 text-sm text-on-surface-variant">
          {filtered.length} / {codes.length} mã · {activeCount} đang hoạt động
        </div>
      </div>

      {/* Create / Edit Modal */}
      {editingId !== null && (
        <PromoModal
          editingId={editingId}
          form={form}
          formErrors={formErrors}
          setField={setField}
          onClose={() => setEditingId(null)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error" style={{ fontSize: 24 }}>delete</span>
            </div>
            <h3 className="font-bold text-on-surface mb-2">Xác nhận xóa mã</h3>
            <p className="text-sm text-on-surface-variant mb-5">
              Bạn có chắc muốn xóa mã{" "}
              <span className="font-mono font-bold text-on-surface">
                {codes.find((c) => c.id === deleteConfirm)?.code}
              </span>
              ? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const MODAL_SELECT_CLS = "w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white";

function PromoModal({
  editingId,
  form,
  formErrors,
  setField,
  onClose,
  onSubmit,
}: {
  editingId: string | "new";
  form: FormState;
  formErrors: Partial<Record<keyof FormState, string>>;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const inputCls = (err?: string) =>
    `w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
      err ? "border-error" : "border-outline-variant"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
          <h3 className="font-bold text-on-surface text-base">
            {editingId === "new" ? "Tạo mã khuyến mại mới" : "Chỉnh sửa mã khuyến mại"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* ── Thông tin mã ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Thông tin mã</p>

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                Mã khuyến mại <span className="text-error">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setField("code", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                  placeholder="VD: SUMMER2026"
                  className={`flex-1 px-3 py-2.5 rounded-lg border text-sm font-mono font-bold tracking-wider focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                    formErrors.code ? "border-error" : "border-outline-variant"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setField("code", generateCode())}
                  title="Sinh mã ngẫu nhiên"
                  className="px-3 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shuffle</span>
                </button>
              </div>
              {formErrors.code && <p className="text-xs text-error mt-1">{formErrors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">Mô tả</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Mô tả ngắn về mã..."
                className={inputCls()}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Phạm vi sử dụng</label>
              <div className="flex gap-2">
                {(["public", "private"] as const).map((v) => (
                  <label
                    key={v}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer transition-colors ${
                      form.visibility === v
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={v}
                      checked={form.visibility === v}
                      onChange={() => setField("visibility", v)}
                      className="sr-only"
                    />
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
                    >
                      {v === "public" ? "public" : "lock"}
                    </span>
                    {v === "public" ? "Công khai" : "Riêng tư"}
                  </label>
                ))}
              </div>
              <p className="text-xs text-on-surface-variant mt-1">
                {form.visibility === "public"
                  ? "Ai biết mã đều có thể sử dụng"
                  : "Chỉ dùng nội bộ hoặc gửi trực tiếp cho khách hàng"}
              </p>
            </div>
          </div>

          <div className="border-t border-outline-variant/20" />

          {/* ── Chiết khấu ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Chiết khấu</p>

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">Loại giảm giá</label>
              <div className="flex gap-2">
                {(["percent", "amount"] as const).map((t) => (
                  <label
                    key={t}
                    className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer transition-colors ${
                      form.discountType === t
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                    }`}
                  >
                    <input
                      type="radio"
                      name="discountType"
                      value={t}
                      checked={form.discountType === t}
                      onChange={() => { setField("discountType", t); setField("discountValue", ""); if (t === "amount") setField("maxDiscount", ""); }}
                      className="sr-only"
                    />
                    {t === "percent" ? "Theo % giá trị đơn" : "Số tiền cố định (VNĐ)"}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                {form.discountType === "percent" ? "Tỷ lệ giảm (%)" : "Số tiền giảm (VNĐ)"}
                {" "}<span className="text-error">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={form.discountValue}
                onChange={(e) => {
                  if (form.discountType === "percent") {
                    const d = e.target.value.replace(/\D/g, "");
                    if (d === "" || Number(d) <= 100) setField("discountValue", d);
                  } else {
                    setField("discountValue", dotFmt(e.target.value));
                  }
                }}
                placeholder={form.discountType === "percent" ? "VD: 20" : "VD: 200.000"}
                className={`w-full px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                  formErrors.discountValue ? "border-error" : "border-outline-variant"
                }`}
              />
              {formErrors.discountValue && <p className="text-xs text-error mt-1">{formErrors.discountValue}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {form.discountType === "percent" && (
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">Giảm tối đa (VNĐ)</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.maxDiscount}
                    onChange={(e) => setField("maxDiscount", dotFmt(e.target.value))}
                    placeholder="VD: 500.000"
                    className={inputCls()}
                  />
                </div>
              )}
              <div className={form.discountType === "percent" ? "" : "col-span-2"}>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Đơn hàng tối thiểu (VNĐ)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.minOrderValue}
                  onChange={(e) => setField("minOrderValue", dotFmt(e.target.value))}
                  placeholder="VD: 1.000.000"
                  className={inputCls()}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/20" />

          {/* ── Áp dụng cho ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Áp dụng cho</p>

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "all",      label: "Tất cả chương trình", icon: "all_inclusive" },
                  { value: "dltn",     label: "Du lịch tình nguyện",  icon: "hiking" },
                  { value: "traihè",   label: "Trại hè tình nguyện",  icon: "camping" },
                  { value: "specific", label: "Chọn cụ thể",          icon: "checklist" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-semibold cursor-pointer transition-colors ${
                    form.applicableScope === opt.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container"
                  }`}
                >
                  <input
                    type="radio"
                    name="applicableScope"
                    value={opt.value}
                    checked={form.applicableScope === opt.value}
                    onChange={() => setField("applicableScope", opt.value)}
                    className="sr-only"
                  />
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}
                  >
                    {opt.icon}
                  </span>
                  {opt.label}
                </label>
              ))}
            </div>

            {form.applicableScope === "specific" && (
              <div>
                <p className="text-xs text-on-surface-variant mb-2">
                  Chọn chương trình áp dụng ({form.applicableTourIds.length} đã chọn)
                </p>
                <div className="border border-outline-variant rounded-lg overflow-hidden max-h-52 overflow-y-auto">
                  {mockTours
                    .filter((t) => t.status !== "archived")
                    .map((tour) => {
                      const checked = form.applicableTourIds.includes(tour.id);
                      return (
                        <label
                          key={tour.id}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-surface-container-low cursor-pointer border-b border-outline-variant/20 last:border-0 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              const next = checked
                                ? form.applicableTourIds.filter((id) => id !== tour.id)
                                : [...form.applicableTourIds, tour.id];
                              setField("applicableTourIds", next);
                            }}
                            className="accent-primary w-4 h-4 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-on-surface truncate">{tour.title}</p>
                            <p className="text-xs text-on-surface-variant">
                              {tour.tourType === "dltn" ? "Du lịch tình nguyện" : "Trại hè"} · {tour.destinationName}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-outline-variant/20" />

          {/* ── Thời hạn & giới hạn ── */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Thời hạn &amp; giới hạn</p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                  Ngày bắt đầu <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  value={form.validFrom}
                  onChange={(e) => setField("validFrom", e.target.value)}
                  className={inputCls(formErrors.validFrom)}
                />
                {formErrors.validFrom && <p className="text-xs text-error mt-1">{formErrors.validFrom}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">
                  Ngày kết thúc <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  value={form.validTo}
                  onChange={(e) => setField("validTo", e.target.value)}
                  min={form.validFrom || undefined}
                  className={inputCls(formErrors.validTo)}
                />
                {formErrors.validTo && <p className="text-xs text-error mt-1">{formErrors.validTo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Giới hạn lượt dùng</label>
                <input
                  type="number"
                  value={form.usageLimit}
                  onChange={(e) => setField("usageLimit", e.target.value)}
                  placeholder="Không giới hạn"
                  min={1}
                  className={inputCls()}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Trạng thái</label>
                <SelectInput
                  value={form.status}
                  onChange={(v) => setField("status", v as PromoCodeStatus)}
                  options={[
                    { value: "active",   label: "Đang hoạt động" },
                    { value: "inactive", label: "Tạm ngưng" },
                  ]}
                  className={MODAL_SELECT_CLS}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {editingId === "new" ? "Tạo mã" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
