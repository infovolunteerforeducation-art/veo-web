"use client";

import { useState, useMemo, useEffect } from "react";
import { ManagedTour, TourSchedule, FlatSchedule, Booking, mockBookings, computeScheduleLabel, formatDuration, fmtDate, fmtDateTime } from "@/lib/crm-data";
import DateInput from "../DateInput";
import SelectInput from "../SelectInput";
import { StatusBadge } from "./DashboardTab";
import Pagination from "../Pagination";
import ConfirmDialog from "../ConfirmDialog";
import ScheduleParticipantsView from "./ScheduleParticipantsView";

type Props = {
  tours: ManagedTour[];
  setTours: React.Dispatch<React.SetStateAction<ManagedTour[]>>;
  deepLinkScheduleId?: string | null;
  onDeepLinkConsumed?: () => void;
};

type SortField = "createdAt" | "isoDate" | "status";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 20;
const STATUS_ORDER: Record<string, number> = { open: 0, full: 1, completed: 2, cancelled: 3 };

const MONTH_NAMES = [
  "Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
  "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12",
];
const MONTH_SHORT = ["Th.1","Th.2","Th.3","Th.4","Th.5","Th.6","Th.7","Th.8","Th.9","Th.10","Th.11","Th.12"];
const DOW_LABELS = ["T2","T3","T4","T5","T6","T7","CN"];


function SortBtn({ field, current, dir, onClick }: { field: SortField; current: SortField; dir: SortDir; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-0.5 group text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap">
      <span className="group-hover:text-on-surface">{field === "isoDate" ? "Ngày khởi hành" : field === "status" ? "Trạng thái" : "Ngày tạo"}</span>
      <span className={`material-symbols-outlined transition-colors ${field === current ? "text-primary" : "text-outline opacity-50"}`} style={{ fontSize: 14 }}>
        {field === current ? (dir === "asc" ? "arrow_upward" : "arrow_downward") : "unfold_more"}
      </span>
    </button>
  );
}

export default function SchedulesTab({ tours, setTours, deepLinkScheduleId, onDeepLinkConsumed }: Props) {
  const [calYear, setCalYear] = useState(2025);
  const [calMonth, setCalMonth] = useState(9);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(2025);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<FlatSchedule | null>(null);
  const [form, setForm] = useState({ tourId: "", isoDate: "", spotsTotal: "20" });
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<FlatSchedule | null>(null);
  const [detailSchedule, setDetailSchedule] = useState<FlatSchedule | null>(null);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const allSchedules = useMemo<FlatSchedule[]>(() =>
    tours.flatMap((t) => t.schedules.map((s) => ({
      ...s, tourId: t.id, tourTitle: t.title, tourDuration: t.duration,
    }))),
    [tours]
  );

  useEffect(() => {
    if (!deepLinkScheduleId) return;
    const found = allSchedules.find((s) => s.id === deepLinkScheduleId);
    if (found) setDetailSchedule(found);
    onDeepLinkConsumed?.();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkScheduleId]);

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir(field === "createdAt" ? "desc" : "asc"); }
    setPage(1);
  }

  // Calendar geometry
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  let startDow = new Date(calYear, calMonth, 1).getDay() - 1;
  if (startDow < 0) startDow = 6;

  const weeks = useMemo(() => {
    const result: (number | null)[][] = [];
    let week: (number | null)[] = new Array(startDow).fill(null);
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d);
      if (week.length === 7) { result.push(week); week = []; }
    }
    if (week.length > 0) { while (week.length < 7) week.push(null); result.push(week); }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calYear, calMonth, startDow, daysInMonth]);

  function isoForDay(day: number) {
    return `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
  function schedulesOnDay(day: number) {
    return allSchedules.filter((s) => s.isoDate === isoForDay(day));
  }
  function navMonth(delta: number) {
    let m = calMonth + delta, y = calYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCalMonth(m); setCalYear(y); setSelectedDate(null);
  }

  const monthPrefix = `${calYear}-${String(calMonth + 1).padStart(2, "0")}`;
  const monthSchedules = allSchedules.filter((s) => s.isoDate.startsWith(monthPrefix));

  // Filter → sort → paginate
  const baseSchedules = selectedDate ? allSchedules.filter((s) => s.isoDate === selectedDate) : allSchedules;
  const sorted = useMemo(() => [...baseSchedules].sort((a, b) => {
    let cmp = 0;
    if (sortField === "createdAt") cmp = (a.createdAt ?? "").localeCompare(b.createdAt ?? "");
    else if (sortField === "isoDate") cmp = a.isoDate.localeCompare(b.isoDate);
    else cmp = (STATUS_ORDER[a.status] ?? 0) - (STATUS_ORDER[b.status] ?? 0);
    return sortDir === "asc" ? cmp : -cmp;
  }), [baseSchedules, sortField, sortDir]);

  const pageCount = Math.ceil(sorted.length / PAGE_SIZE);
  const displayedSchedules = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAdd(defaultDate = "") {
    setForm({ tourId: tours[0]?.id ?? "", isoDate: defaultDate, spotsTotal: "20" });
    setEditTarget(null);
    setShowModal(true);
  }
  function openEdit(s: FlatSchedule) {
    setForm({ tourId: s.tourId, isoDate: s.isoDate, spotsTotal: String(s.spotsTotal) });
    setEditTarget(s);
    setShowModal(true);
  }

  function save() {
    if (!form.tourId || !form.isoDate) return;
    const now = new Date().toISOString();
    const spots = parseInt(form.spotsTotal) || 20;
    const tourForForm = tours.find((t) => t.id === form.tourId);
    const label = computeScheduleLabel(form.isoDate, tourForForm?.duration ?? 3);
    if (editTarget) {
      setTours((prev) =>
        prev.map((t) =>
          t.id === editTarget.tourId
            ? { ...t, schedules: t.schedules.map((s) =>
                s.id === editTarget.id ? { ...s, label, isoDate: form.isoDate, spotsTotal: spots, updatedAt: now } : s
              )}
            : t
        )
      );
    } else {
      const newSch: TourSchedule = {
        id: `sch-new-${Date.now()}`,
        label, isoDate: form.isoDate, spotsTotal: spots, spotsLeft: spots,
        status: "open", isVisible: true, createdAt: now, updatedAt: now,
      };
      setTours((prev) => prev.map((t) => t.id === form.tourId ? { ...t, schedules: [...t.schedules, newSch] } : t));
    }
    setShowModal(false);
    setEditTarget(null);
  }

  function remove(s: FlatSchedule) {
    setTours((prev) => prev.map((t) => t.id === s.tourId ? { ...t, schedules: t.schedules.filter((sc) => sc.id !== s.id) } : t));
  }

  function toggleVisible(s: FlatSchedule) {
    const now = new Date().toISOString();
    setTours((prev) =>
      prev.map((t) =>
        t.id === s.tourId
          ? { ...t, schedules: t.schedules.map((sc) => sc.id === s.id ? { ...sc, isVisible: !sc.isVisible, updatedAt: now } : sc) }
          : t
      )
    );
  }

  if (detailSchedule) {
    return (
      <ScheduleParticipantsView
        schedule={detailSchedule}
        bookings={bookings.filter((b) => b.scheduleId === detailSchedule.id)}
        onBack={() => setDetailSchedule(null)}
        onToggleAttended={(bookingId, attended) =>
          setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, attended } : b))
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Calendar card */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button type="button" onClick={() => navMonth(-1)} className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_left</span>
          </button>
          <button type="button" onClick={() => { setPickerYear(calYear); setShowPicker((v) => !v); }} className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-surface-container-low transition-colors">
            <span className="text-base font-bold text-on-surface">{MONTH_NAMES[calMonth]} {calYear}</span>
            <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${showPicker ? "rotate-180" : ""}`} style={{ fontSize: 18 }}>expand_more</span>
          </button>
          <button type="button" onClick={() => navMonth(1)} className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>chevron_right</span>
          </button>
        </div>

        {showPicker ? (
          <div className="py-2">
            <div className="flex items-center justify-between mb-4 px-2">
              <button type="button" onClick={() => setPickerYear((y) => y - 1)} className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_left</span>
              </button>
              <span className="text-base font-bold text-on-surface">{pickerYear}</span>
              <button type="button" onClick={() => setPickerYear((y) => y + 1)} className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chevron_right</span>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {MONTH_SHORT.map((name, i) => (
                <button key={i} type="button" onClick={() => { setCalMonth(i); setCalYear(pickerYear); setShowPicker(false); setSelectedDate(null); }}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${pickerYear === calYear && i === calMonth ? "bg-primary text-white font-semibold" : "hover:bg-surface-container-low text-on-surface"}`}>
                  {name}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => setShowPicker(false)} className="mt-3 w-full py-2 rounded-xl border border-outline-variant text-sm text-on-surface-variant hover:bg-surface-container transition-colors">Đóng</button>
          </div>
        ) : (
          <>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {DOW_LABELS.map((d) => (
                    <th key={d} className="border border-outline-variant/30 bg-surface-container-low/80 text-center text-xs font-semibold text-on-surface-variant py-2 px-1">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, wi) => (
                  <tr key={wi}>
                    {week.map((day, di) => {
                      const iso = day ? isoForDay(day) : "";
                      const daySchs = day ? schedulesOnDay(day) : [];
                      const isSelected = !!day && selectedDate === iso;
                      return (
                        <td key={di} className="border border-outline-variant/30 p-0 align-top">
                          {day ? (
                            <button type="button" onClick={() => setSelectedDate(isSelected ? null : iso)}
                              className={`w-full min-h-[54px] flex flex-col items-center pt-1.5 pb-1 px-0.5 transition-colors ${isSelected ? "bg-primary text-white" : "hover:bg-surface-container-low/80 text-on-surface"}`}>
                              <span className={`text-sm font-medium leading-none mb-1.5 ${isSelected ? "text-white" : ""}`}>{day}</span>
                              <div className="flex flex-wrap justify-center gap-0.5 min-h-[10px]">
                                {daySchs.slice(0, 3).map((s) => (
                                  <span key={s.id} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white/80" : "bg-primary"}`} />
                                ))}
                                {daySchs.length > 3 && (
                                  <span className={`text-[9px] font-bold leading-none ${isSelected ? "text-white/80" : "text-primary"}`}>+{daySchs.length - 3}</span>
                                )}
                              </div>
                            </button>
                          ) : (
                            <div className="min-h-[54px] bg-surface-container-low/20" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 pt-3 border-t border-outline-variant/20 flex items-center justify-between">
              <p className="text-sm text-on-surface-variant">
                <span className="font-semibold text-on-surface">{monthSchedules.length}</span> lịch trong tháng này
                {selectedDate && <span className="ml-2 text-primary font-medium">· Đang xem {fmtDate(selectedDate)}</span>}
              </p>
              {selectedDate && (
                <button type="button" onClick={() => setSelectedDate(null)} className="text-xs text-on-surface-variant hover:text-on-surface underline">Bỏ lọc</button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Schedule table */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20">
          <div>
            <h2 className="text-base font-bold text-on-surface">
              {selectedDate ? `Lịch ngày ${fmtDate(selectedDate)}` : "Tất cả lịch chuyến"}
            </h2>
            <p className="text-sm text-on-surface-variant mt-0.5">
              {sorted.length} lịch{!selectedDate && allSchedules.length > 0 ? ` trên ${tours.length} chương trình` : ""}
            </p>
          </div>
          <button type="button" onClick={() => openAdd(selectedDate ?? "")}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
            Thêm lịch
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low">
                <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Thời gian đi</th>
                <th className="px-5 py-3 whitespace-nowrap">
                  <SortBtn field="isoDate" current={sortField} dir={sortDir} onClick={() => handleSort("isoDate")} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Chương trình</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Đã đặt / Tổng</th>
                <th className="px-5 py-3 whitespace-nowrap">
                  <SortBtn field="status" current={sortField} dir={sortDir} onClick={() => handleSort("status")} />
                </th>
                <th className="px-5 py-3 whitespace-nowrap">
                  <SortBtn field="createdAt" current={sortField} dir={sortDir} onClick={() => handleSort("createdAt")} />
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Cập nhật</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-on-surface-variant whitespace-nowrap">Mở đăng ký</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 select-none">
              {displayedSchedules.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-sm text-on-surface-variant py-12">
                    {selectedDate ? "Không có lịch chuyến trong ngày này" : "Chưa có lịch chuyến nào"}
                  </td>
                </tr>
              ) : (
                displayedSchedules.map((s) => (
                  <tr key={`${s.tourId}-${s.id}`} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-5 py-3 font-semibold whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setDetailSchedule(s)}
                        className="text-left text-primary hover:underline cursor-pointer"
                        title={`Xem danh sách đăng ký: ${s.tourTitle}`}
                      >
                        {computeScheduleLabel(s.isoDate, s.tourDuration)}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-on-surface-variant whitespace-nowrap">{fmtDate(s.isoDate)}</td>
                    <td className="px-5 py-3 font-medium text-on-surface max-w-[200px]">
                      <span className="block truncate">{s.tourTitle}</span>
                    </td>
                    <td className="px-5 py-3 text-center font-semibold whitespace-nowrap">
                      {(() => {
                        const paid = bookings.filter((b) => b.scheduleId === s.id && b.status === "paid").reduce((sum, b) => sum + b.numPeople, 0);
                        const remaining = s.spotsTotal - paid;
                        return (
                          <>
                            <span className={remaining <= 3 ? "text-error" : "text-green-600"}>{paid}</span>
                            <span className="text-on-surface-variant font-normal">/{s.spotsTotal}</span>
                          </>
                        );
                      })()}
                    </td>
                    <td className="px-5 py-3"><StatusBadge status={s.status} small /></td>
                    <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">{s.createdAt ? fmtDateTime(s.createdAt) : "—"}</td>
                    <td className="px-5 py-3 text-xs text-on-surface-variant whitespace-nowrap">{s.updatedAt ? fmtDateTime(s.updatedAt) : "—"}</td>
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleVisible(s)}
                        title={s.isVisible ? "Đang mở đăng ký — bấm để đóng" : "Đang đóng đăng ký — bấm để mở"}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          s.isVisible ? "bg-primary" : "bg-outline-variant"
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                          s.isVisible ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => openEdit(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors">
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                          Sửa
                        </button>
                        <button type="button" onClick={() => setDeleteTarget(s)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-error/70 hover:bg-error/10 hover:text-error transition-colors">
                          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                          Xóa
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

        {/* Row count footer */}
        <div className="px-5 py-2.5 border-t border-outline-variant/20">
          <p className="text-xs text-on-surface-variant">
            {sorted.length > PAGE_SIZE
              ? `Trang ${page + 1}/${pageCount} · ${sorted.length} lịch`
              : `${sorted.length} lịch`}
          </p>
        </div>
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-on-surface text-base">{editTarget ? "Sửa lịch khởi hành" : "Thêm lịch khởi hành"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Chương trình *</label>
                <SelectInput
                  value={form.tourId}
                  onChange={(v) => setForm((f) => ({ ...f, tourId: v }))}
                  disabled={!!editTarget}
                  options={tours.map((t) => ({ value: t.id, label: t.title }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant bg-white"
                />
                {form.tourId && (
                  <p className="mt-1.5 text-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>schedule</span>
                    {formatDuration(tours.find((t) => t.id === form.tourId)?.duration ?? 3)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Ngày khởi hành *</label>
                <DateInput value={form.isoDate} onChange={(iso) => setForm((f) => ({ ...f, isoDate: iso }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
                {form.isoDate && form.tourId && (
                  <p className="mt-1.5 text-sm text-primary font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>date_range</span>
                    {computeScheduleLabel(form.isoDate, tours.find((t) => t.id === form.tourId)?.duration ?? 3)}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Số chỗ tối đa</label>
                <input type="number" min="1" value={form.spotsTotal} onChange={(e) => setForm((f) => ({ ...f, spotsTotal: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
              <button type="button" onClick={save} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                {editTarget ? "Lưu thay đổi" : "Thêm lịch"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        message={`Bạn có chắc muốn xóa lịch chuyến "${deleteTarget?.label ?? ""}"? Hành động này không thể hoàn tác.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          remove(deleteTarget);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
