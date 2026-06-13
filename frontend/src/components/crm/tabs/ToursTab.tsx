"use client";

import { useState, useMemo, useEffect } from "react";
import { Booking, mockBookings, mockDestinations, ManagedTour, fmt, formatDuration } from "@/lib/crm-data";
import SelectInput from "../SelectInput";
import { StatusBadge } from "./DashboardTab";
import TourContentEditor from "./TourContentEditor";
import CampContentEditor from "./CampContentEditor";
import TourDetailView from "./TourDetailView";
import Pagination from "../Pagination";

const PAGE_SIZE = 20;

type EnrichedTour = ManagedTour & { region: "north" | "south"; province: string };

type Props = {
  tours: ManagedTour[];
  setTours: React.Dispatch<React.SetStateAction<ManagedTour[]>>;
  onNavigateToSchedule?: (scheduleId: string) => void;
  onNavigateToBooking?: (bookingId: string) => void;
  deepLinkTourId?: string | null;
  onDeepLinkTourConsumed?: () => void;
  tourTypeFilter?: "dltn" | "traihè";
};

export default function ToursTab({ tours, setTours, onNavigateToSchedule, onNavigateToBooking, deepLinkTourId, onDeepLinkTourConsumed, tourTypeFilter }: Props) {
  const [bookings] = useState<Booking[]>(mockBookings);
  const [detailTour, setDetailTour] = useState<ManagedTour | null>(null);
  const [contentTour, setContentTour] = useState<ManagedTour | null>(null);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showEditTourModal, setShowEditTourModal] = useState(false);
  const [editingTour, setEditingTour] = useState<{
    id: string; title: string; destinationId: string;
    price: string; duration: string; ageRange: string;
  } | null>(null);
  const [newTour, setNewTour] = useState({ title: "", destinationId: "", price: "", duration: "3", ageRange: "" });
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState<"all" | "north" | "south">("all");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!deepLinkTourId) return;
    const timeoutId = window.setTimeout(() => {
      const tour = tours.find((t) => t.id === deepLinkTourId);
      if (tour) setDetailTour(tour);
      onDeepLinkTourConsumed?.();
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [deepLinkTourId, onDeepLinkTourConsumed, tours]);

  const enriched = useMemo<EnrichedTour[]>(() =>
    tours.map((t) => {
      const dest = mockDestinations.find((d) => d.id === t.destinationId);
      return { ...t, region: dest?.region ?? "north", province: dest?.province ?? "" };
    }), [tours]);

  const provinceOptions = useMemo(() => {
    const dests = regionFilter === "all"
      ? mockDestinations
      : mockDestinations.filter((d) => d.region === regionFilter);
    return [...new Set(dests.map((d) => d.province))].sort();
  }, [regionFilter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter((t) => {
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.destinationName.toLowerCase().includes(q) || t.province.toLowerCase().includes(q);
      const matchRegion = regionFilter === "all" || t.region === regionFilter;
      const matchProvince = !provinceFilter || t.province === provinceFilter;
      return matchSearch && matchRegion && matchProvince;
    });
  }, [enriched, search, regionFilter, provinceFilter]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openEditTour(tour: ManagedTour, e: React.MouseEvent) {
    e.stopPropagation();
    const priceStr = tour.price ? tour.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
    setEditingTour({ id: tour.id, title: tour.title, destinationId: tour.destinationId, price: priceStr, duration: String(tour.duration), ageRange: tour.ageRange ?? "" });
    setShowEditTourModal(true);
  }

  function addTour() {
    if (!newTour.title || !newTour.destinationId || !newTour.price) return;
    const dest = mockDestinations.find((d) => d.id === newTour.destinationId);
    const tour: ManagedTour = {
      id: `tour-new-${Date.now()}`,
      slug: newTour.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      title: newTour.title,
      destinationId: newTour.destinationId,
      destinationName: dest?.name ?? "",
      price: parseInt(newTour.price.replace(/\D/g, "")) || 0,
      duration: parseInt(newTour.duration) || 3,
      ageRange: newTour.ageRange || undefined,
      schedules: [],
      status: "draft",
      tourType: tourTypeFilter,
    };
    setTours((prev) => [...prev, tour]);
    setNewTour({ title: "", destinationId: "", price: "", duration: "3", ageRange: "" });
    setShowTourModal(false);
  }

  function saveEditTour() {
    if (!editingTour || !editingTour.title || !editingTour.destinationId) return;
    const dest = mockDestinations.find((d) => d.id === editingTour.destinationId);
    const patch = {
      title: editingTour.title,
      destinationId: editingTour.destinationId,
      destinationName: dest?.name,
      price: parseInt(editingTour.price.replace(/\D/g, "")),
      duration: parseInt(editingTour.duration) || 3,
      ageRange: editingTour.ageRange || undefined,
    };
    setTours((prev) => prev.map((t) =>
      t.id === editingTour.id
        ? { ...t, ...patch, destinationName: patch.destinationName ?? t.destinationName }
        : t
    ));
    if (detailTour?.id === editingTour.id) {
      setDetailTour((t) => t ? { ...t, ...patch, destinationName: patch.destinationName ?? t.destinationName } : t);
    }
    setShowEditTourModal(false);
    setEditingTour(null);
  }

  function saveContent(content: Partial<ManagedTour>) {
    if (!contentTour) return;
    setTours((prev) => prev.map((t) => t.id === contentTour.id ? { ...t, ...content } : t));
    if (detailTour?.id === contentTour.id) setDetailTour((t) => t ? { ...t, ...content } : t);
  }

  if (contentTour) {
    if (tourTypeFilter === "traihè" || contentTour.tourType === "traihè") {
      return (
        <CampContentEditor
          tour={contentTour}
          onSave={saveContent}
          onBack={() => setContentTour(null)}
        />
      );
    }
    return (
      <TourContentEditor
        tour={contentTour}
        onSave={saveContent}
        onBack={() => setContentTour(null)}
      />
    );
  }

  if (detailTour) {
    return (
      <TourDetailView
        tour={detailTour}
        bookings={bookings.filter((b) => b.tourId === detailTour.id)}
        onBack={() => setDetailTour(null)}
        onViewSchedule={onNavigateToSchedule}
        onViewBooking={onNavigateToBooking}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" style={{ fontSize: 16 }}>search</span>
            <input
              type="text"
              placeholder="Tìm chương trình..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-9 pr-3 py-2 rounded-lg border border-outline-variant bg-white text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 w-52"
            />
          </div>
          <SelectInput
            value={regionFilter}
            onChange={(v) => { setRegionFilter(v as "all" | "north" | "south"); setProvinceFilter(""); setPage(1); }}
            options={[
              { value: "all", label: "Tất cả khu vực" },
              { value: "north", label: "Miền Bắc" },
              { value: "south", label: "Miền Nam" },
            ]}
            className="px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white"
          />
          <SelectInput
            value={provinceFilter}
            onChange={(v) => { setProvinceFilter(v); setPage(1); }}
            options={[
              { value: "", label: "Tất cả tỉnh/TP" },
              ...provinceOptions.map((p) => ({ value: p, label: p })),
            ]}
            className="px-3 py-2 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowTourModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Tạo chương trình
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tên chương trình</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Điểm đến</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Tỉnh/TP</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Khu vực</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Giá/người</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Thời gian</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Trạng thái</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Số lịch</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 select-none">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-sm text-on-surface-variant py-12">
                    Không tìm thấy chương trình nào
                  </td>
                </tr>
              ) : (
                paged.map((tour) => (
                  <tr
                    key={tour.id}
                    onClick={() => setDetailTour(tour)}
                    className="cursor-pointer transition-colors hover:bg-primary/[0.03] active:bg-primary/[0.06]"
                  >
                    <td className="px-4 py-3 font-semibold text-on-surface max-w-[200px]">
                      <span className="block truncate text-primary hover:underline cursor-pointer">{tour.title}</span>
                    </td>
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{tour.destinationName}</td>
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{tour.province}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        tour.region === "north" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      }`}>
                        {tour.region === "north" ? "Miền Bắc" : "Miền Nam"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-primary whitespace-nowrap">{fmt(tour.price)}</td>
                    <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{formatDuration(tour.duration)}</td>
                    <td className="px-4 py-3"><StatusBadge status={tour.status} small /></td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center gap-1 text-on-surface-variant text-sm">
                        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>event</span>
                        {tour.schedules.length}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          type="button"
                          onClick={(e) => openEditTour(tour, e)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors whitespace-nowrap"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setContentTour(tour); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors whitespace-nowrap"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit_document</span>
                          Nội dung
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
        <div className="px-4 py-2.5 border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant">
            {filtered.length} chương trình{filtered.length !== tours.length ? ` / ${tours.length} tổng` : ""}
          </p>
        </div>
      </div>

      {/* Create tour modal */}
      {showTourModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-on-surface">Tạo chương trình mới</h3>
              <button type="button" onClick={() => setShowTourModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Tên chương trình *</label>
                <input type="text" placeholder="VD: Xây trường tại Mèo Vạc" value={newTour.title} onChange={(e) => setNewTour((t) => ({ ...t, title: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Điểm đến *</label>
                <SelectInput
                  value={newTour.destinationId}
                  onChange={(v) => setNewTour((t) => ({ ...t, destinationId: v }))}
                  options={[
                    { value: "", label: "Chọn điểm đến..." },
                    ...mockDestinations.map((d) => ({ value: d.id, label: d.name })),
                  ]}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Giá / người (VNĐ) *</label>
                <input
                  type="text" placeholder="2.500.000" value={newTour.price}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setNewTour((t) => ({ ...t, price: digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "" }));
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Số ngày *</label>
                <input
                  type="number" min="1" placeholder="3" value={newTour.duration}
                  onChange={(e) => setNewTour((t) => ({ ...t, duration: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Độ tuổi tham gia</label>
                <input
                  type="text" placeholder="VD: 18 - 35" value={newTour.ageRange}
                  onChange={(e) => setNewTour((t) => ({ ...t, ageRange: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button type="button" onClick={() => setShowTourModal(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
              <button type="button" onClick={addTour} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Tạo chương trình</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit tour modal */}
      {showEditTourModal && editingTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-on-surface">Sửa thông tin chương trình</h3>
              <button type="button" onClick={() => { setShowEditTourModal(false); setEditingTour(null); }} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Tên chương trình *</label>
                <input type="text" value={editingTour.title} onChange={(e) => setEditingTour((t) => t ? { ...t, title: e.target.value } : t)} className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Điểm đến *</label>
                <SelectInput
                  value={editingTour.destinationId}
                  onChange={(v) => setEditingTour((t) => t ? { ...t, destinationId: v } : t)}
                  options={[
                    { value: "", label: "Chọn điểm đến..." },
                    ...mockDestinations.map((d) => ({ value: d.id, label: d.name })),
                  ]}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Giá / người (VNĐ)</label>
                <input
                  type="text" value={editingTour.price}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setEditingTour((t) => t ? { ...t, price: digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "" } : t);
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Số ngày</label>
                <input
                  type="number" min="1" value={editingTour.duration}
                  onChange={(e) => setEditingTour((t) => t ? { ...t, duration: e.target.value } : t)}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Độ tuổi tham gia</label>
                <input
                  type="text" placeholder="VD: 18 - 35" value={editingTour.ageRange}
                  onChange={(e) => setEditingTour((t) => t ? { ...t, ageRange: e.target.value } : t)}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button type="button" onClick={() => { setShowEditTourModal(false); setEditingTour(null); }} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
              <button type="button" onClick={saveEditTour} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
