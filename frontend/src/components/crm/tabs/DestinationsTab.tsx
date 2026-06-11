"use client";

import { useState } from "react";
import { mockDestinations, mockTours, mockBookings, Destination, fmt } from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";
import Pagination from "../Pagination";
import SelectInput from "../SelectInput";

const PAGE_SIZE = 20;

type RegionFilter = "all" | "north" | "south";
type EmptyForm = Omit<Destination, "id" | "createdAt" | "updatedAt">;

const REGION_FILTERS: { value: RegionFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "north", label: "Miền Bắc" },
  { value: "south", label: "Miền Nam" },
];

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function emptyForm(): EmptyForm {
  return { name: "", province: "", region: "north" };
}

export default function DestinationsTab() {
  const [destinations, setDestinations] = useState<Destination[]>(mockDestinations);
  const [detailDest, setDetailDest] = useState<Destination | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Destination | null>(null);
  const [form, setForm] = useState<EmptyForm>(emptyForm());
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<RegionFilter>("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // ── List view helpers ────────────────────────────────────────────────────────
  const filtered = destinations.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.province.toLowerCase().includes(q);
    const matchRegion = regionFilter === "all" || d.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function hasTours(destId: string) {
    return mockTours.some((t) => t.destinationId === destId);
  }

  function openCreate() {
    setEditTarget(null);
    setForm(emptyForm());
    setShowModal(true);
  }

  function openEdit(dest: Destination, e?: React.MouseEvent) {
    e?.stopPropagation();
    setEditTarget(dest);
    setForm({ name: dest.name, province: dest.province, region: dest.region });
    setShowModal(true);
  }

  function save() {
    if (!form.name.trim() || !form.province.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    if (editTarget) {
      const updated = { ...editTarget, ...form, updatedAt: now };
      setDestinations((prev) => prev.map((d) => d.id === editTarget.id ? updated : d));
      if (detailDest?.id === editTarget.id) setDetailDest(updated);
    } else {
      setDestinations((prev) => [...prev, { ...form, id: `dest-new-${Date.now()}`, createdAt: now, updatedAt: now }]);
    }
    setShowModal(false);
  }

  function confirmDelete(id: string) {
    setDestinations((prev) => prev.filter((d) => d.id !== id));
    setDeleteConfirm(null);
    setPage(1);
  }

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (detailDest) {
    const tours = mockTours.filter((t) => t.destinationId === detailDest.id);
    const tourIds = new Set(tours.map((t) => t.id));
    const bookings = mockBookings.filter((b) => tourIds.has(b.tourId));
    const totalRevenue = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.totalAmount, 0);
    const uniqueCustomers = new Set(bookings.map((b) => b.customerId)).size;
    const tourStats = tours.map((tour) => {
      const tb = bookings.filter((b) => b.tourId === tour.id);
      const revenue = tb.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.totalAmount, 0);
      const participants = tb.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.numPeople, 0);
      return { tour, bookingCount: tb.length, revenue, participants };
    });

    return (
      <div className="space-y-5">
        {/* Back + header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <button
            type="button"
            onClick={() => setDetailDest(null)}
            className="flex items-center gap-1.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
            Quay lại danh sách
          </button>
            <button
              type="button"
              onClick={() => openEdit(detailDest)}
              className="text-sm px-3 py-1.5 rounded-lg bg-surface-container font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
            >
              Sửa thông tin
            </button>
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${detailDest.region === "north" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
              {detailDest.region === "north" ? "Miền Bắc" : "Miền Nam"}
            </span>
            <h2 className="font-bold text-on-surface text-xl leading-tight">{detailDest.name}</h2>
            <span className="text-sm text-on-surface-variant">{detailDest.province}</span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>schedule</span>
            Khởi tạo: <span className="font-semibold text-on-surface ml-1">{fmtDate(detailDest.createdAt)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>update</span>
            Cập nhật lần cuối: <span className="font-semibold text-on-surface ml-1">{fmtDate(detailDest.updatedAt)}</span>
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Tổng doanh thu", value: fmt(totalRevenue), icon: "payments", color: "text-primary", bg: "bg-primary/10" },
            { label: "Số chương trình", value: `${tours.length} chương trình`, icon: "hiking", color: "text-blue-700", bg: "bg-blue-100" },
            { label: "Khách tham gia", value: `${uniqueCustomers} người`, icon: "people", color: "text-green-700", bg: "bg-green-100" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-outline-variant/30 p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
                <span className={`material-symbols-outlined ${s.color}`} style={{ fontSize: 22 }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-sm text-on-surface-variant">{s.label}</p>
                <p className="text-xl font-bold text-on-surface">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tours table */}
        <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/20">
            <h3 className="text-base font-bold text-on-surface">Danh sách chương trình DLTN</h3>
          </div>
          {tourStats.length === 0 ? (
            <div className="py-16 text-center">
              <span className="material-symbols-outlined text-on-surface-variant/30" style={{ fontSize: 48 }}>hiking</span>
              <p className="mt-3 text-sm text-on-surface-variant">Chưa có chương trình nào tại điểm đến này</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                  <tr>
                    {["Tên chương trình", "Thời gian", "Trạng thái", "Số lịch", "Người tham gia", "Số đặt chỗ", "Doanh thu"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20 select-none">
                  {tourStats.map(({ tour, bookingCount, revenue, participants }) => (
                    <tr key={tour.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3 font-semibold text-on-surface">{tour.title}</td>
                      <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{tour.duration}</td>
                      <td className="px-4 py-3"><StatusBadge status={tour.status} /></td>
                      <td className="px-4 py-3 text-on-surface-variant">{tour.schedules.length} lịch</td>
                      <td className="px-4 py-3 font-semibold text-primary">{participants} người</td>
                      <td className="px-4 py-3 text-on-surface-variant">{bookingCount} đơn</td>
                      <td className="px-4 py-3 font-semibold text-primary whitespace-nowrap">{fmt(revenue)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-surface-container-low border-t border-outline-variant/30">
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-sm font-bold text-on-surface">Tổng cộng</td>
                    <td className="px-4 py-3 font-bold text-primary">{tourStats.reduce((s, t) => s + t.participants, 0)} người</td>
                    <td className="px-4 py-3 font-bold text-on-surface">{tourStats.reduce((s, t) => s + t.bookingCount, 0)} đơn</td>
                    <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">{fmt(totalRevenue)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {showModal && <DestModal editTarget={editTarget} form={form} setForm={setForm} onClose={() => setShowModal(false)} onSave={save} />}
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 16 }}>search</span>
          <input
            type="text"
            placeholder="Tìm tên, tỉnh/thành phố..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <SelectInput
          value={regionFilter}
          onChange={(v) => { setRegionFilter(v as RegionFilter); setPage(1); }}
          options={REGION_FILTERS}
          className="px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white"
        />
        <button
          type="button"
          onClick={openCreate}
          className="ml-auto flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Thêm điểm đến
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant/30">
              <tr>
                {["Tên điểm đến", "Tỉnh / Thành phố", "Khu vực", "Số chương trình", "Tổng số lịch", "Ngày khởi tạo", "Cập nhật lần cuối", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 select-none">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-on-surface-variant">Không có điểm đến nào</td>
                </tr>
              ) : (
                paged.map((dest) => {
                  const destinationTours = mockTours.filter((t) => t.destinationId === dest.id);
                  const tourCount = destinationTours.length;
                  const scheduleCount = destinationTours.reduce((sum, tour) => sum + tour.schedules.length, 0);
                  const canDelete = !hasTours(dest.id);
                  return (
                    <tr key={dest.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => setDetailDest(dest)}
                          className="font-semibold text-primary hover:underline text-left cursor-pointer"
                        >
                          {dest.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{dest.province}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${dest.region === "north" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                          {dest.region === "north" ? "Miền Bắc" : "Miền Nam"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{tourCount} chương trình</td>
                      <td className="px-4 py-3 text-on-surface-variant">{scheduleCount} lịch</td>
                      <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{fmtDate(dest.createdAt)}</td>
                      <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{fmtDate(dest.updatedAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={(e) => openEdit(dest, e)}
                            className="flex items-center gap-1 text-sm px-2.5 py-1 rounded-lg bg-surface-container font-semibold text-on-surface hover:bg-surface-container-high transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                            Sửa
                          </button>
                          {canDelete ? (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirm(dest.id)}
                              className="flex items-center gap-1 text-sm px-2.5 py-1 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors font-semibold"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                              Xóa
                            </button>
                          ) : (
                            <span title="Không thể xóa vì đã có chương trình" className="flex items-center gap-1 text-sm px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant/40 font-semibold cursor-not-allowed select-none">
                              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                              Xóa
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        <div className="px-4 py-3 border-t border-outline-variant/20 text-sm text-on-surface-variant">
          {filtered.length} điểm đến
        </div>
      </div>

      {showModal && <DestModal editTarget={editTarget} form={form} setForm={setForm} onClose={() => setShowModal(false)} onSave={save} />}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-error" style={{ fontSize: 24 }}>delete</span>
            </div>
            <h3 className="font-bold text-on-surface mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-on-surface-variant mb-5">Bạn có chắc muốn xóa điểm đến này? Hành động này không thể hoàn tác.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
              <button type="button" onClick={() => confirmDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-error text-white text-sm font-semibold hover:bg-error/90 transition-colors">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DestModal({
  editTarget,
  form,
  setForm,
  onClose,
  onSave,
}: {
  editTarget: Destination | null;
  form: EmptyForm;
  setForm: React.Dispatch<React.SetStateAction<EmptyForm>>;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-on-surface text-base">{editTarget ? "Chỉnh sửa điểm đến" : "Thêm điểm đến mới"}</h3>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Tên điểm đến *</label>
            <input type="text" placeholder="VD: Mèo Vạc – Hà Giang" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-1">Tỉnh / Thành phố *</label>
            <input type="text" placeholder="VD: Hà Giang" value={form.province} onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface-variant mb-2">Khu vực</label>
            <div className="flex gap-4">
              {(["north", "south"] as const).map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="radio" name="region" value={r} checked={form.region === r} onChange={() => setForm((f) => ({ ...f, region: r }))} className="accent-primary" />
                  <span className="text-sm">{r === "north" ? "Miền Bắc" : "Miền Nam"}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
          <button type="button" onClick={onSave} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
            {editTarget ? "Lưu thay đổi" : "Thêm điểm đến"}
          </button>
        </div>
      </div>
    </div>
  );
}
