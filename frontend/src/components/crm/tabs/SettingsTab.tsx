"use client";

import { useState } from "react";
import { mockStaff, StaffMember, StaffRole } from "@/lib/crm-data";
import { StatusBadge } from "./DashboardTab";

const ROLES: { value: StaffRole; label: string; desc: string; color: string }[] = [
  { value: "admin", label: "Admin", desc: "Toàn quyền: quản lý nhân viên, cấu hình hệ thống, xem mọi dữ liệu", color: "bg-primary/10 text-primary" },
  { value: "coordinator", label: "Điều phối viên", desc: "Quản lý chuyến đi, xác nhận đặt chỗ, liên hệ khách hàng", color: "bg-blue-100 text-blue-700" },
  { value: "sale", label: "Sale", desc: "Thao tác đăng ký và khách hàng, không truy cập chuyến đi hay cài đặt", color: "bg-orange-100 text-orange-700" },
  { value: "staff", label: "Nhân viên", desc: "Xem danh sách đăng ký, cập nhật trạng thái cơ bản", color: "bg-surface-container text-on-surface-variant" },
];

const emptyStaff = () => ({ name: "", email: "", phone: "", role: "staff" as StaffRole });

export default function SettingsTab() {
  const [staff, setStaff] = useState<StaffMember[]>(mockStaff);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [form, setForm] = useState(emptyStaff());
  const [activeSection, setActiveSection] = useState<"staff" | "roles">("staff");
  const [pwTarget, setPwTarget] = useState<StaffMember | null>(null);
  const [pwForm, setPwForm] = useState({ newPw: "", confirmPw: "" });
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError] = useState("");

  function openCreate() {
    setEditTarget(null);
    setForm(emptyStaff());
    setShowModal(true);
  }

  function openEdit(s: StaffMember) {
    setEditTarget(s);
    setForm({ name: s.name, email: s.email, phone: s.phone, role: s.role });
    setShowModal(true);
  }

  function save() {
    if (!form.name || !form.email) return;
    if (editTarget) {
      setStaff((prev) => prev.map((s) => s.id === editTarget.id ? { ...editTarget, ...form } : s));
    } else {
      const newMember: StaffMember = {
        ...form,
        id: `staff-new-${Date.now()}`,
        status: "active",
        joinedAt: new Date().toISOString().split("T")[0],
        lastLogin: "—",
      };
      setStaff((prev) => [...prev, newMember]);
    }
    setShowModal(false);
  }

  function toggleActive(id: string) {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "active" ? "inactive" : "active" } : s));
  }

  function openPwModal(s: StaffMember) {
    setPwTarget(s);
    setPwForm({ newPw: "", confirmPw: "" });
    setPwError("");
    setPwSuccess(false);
  }

  function savePw() {
    if (pwForm.newPw.length < 6) { setPwError("Mật khẩu phải có ít nhất 6 ký tự."); return; }
    if (pwForm.newPw !== pwForm.confirmPw) { setPwError("Mật khẩu xác nhận không khớp."); return; }
    setPwSuccess(true);
    setPwError("");
  }

  return (
    <div className="space-y-6">
      {/* Section tabs */}
      <div className="flex gap-2 border-b border-outline-variant/30">
        {[
          { id: "staff" as const, label: "Phân quyền nhân viên", icon: "manage_accounts" },
          { id: "roles" as const, label: "Mô tả quyền hạn", icon: "security" },
        ].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors select-none -mb-px ${
              activeSection === s.id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === "staff" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-on-surface-variant">{staff.length} thành viên</p>
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_add</span>
              Thêm thành viên
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                  <tr>
                    {["Thành viên", "Email", "Điện thoại", "Vai trò", "Trạng thái", "Đăng nhập lần cuối", ""].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-on-surface-variant whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {staff.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                            s.role === "admin" ? "bg-primary/10 text-primary" : s.role === "coordinator" ? "bg-blue-100 text-blue-700" : s.role === "sale" ? "bg-orange-100 text-orange-700" : "bg-surface-container text-on-surface-variant"
                          }`}>
                            {s.name.split(" ").pop()?.charAt(0)}
                          </div>
                          <span className="font-semibold text-on-surface whitespace-nowrap">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant">{s.email}</td>
                      <td className="px-4 py-3 text-on-surface-variant">{s.phone}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.role} /></td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 text-sm text-on-surface-variant whitespace-nowrap">
                        {s.lastLogin === "—" ? "—" : new Date(s.lastLogin).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => openEdit(s)} className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-semibold text-on-surface">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                            Sửa
                          </button>
                          <button type="button" onClick={() => openPwModal(s)} className="flex items-center gap-1 text-sm px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors font-semibold text-on-surface">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock_reset</span>
                            Đổi MK
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleActive(s.id)}
                            className={`flex items-center gap-1 text-sm px-2 py-1 rounded-lg font-semibold transition-colors ${
                              s.status === "active"
                                ? "bg-error/10 text-error hover:bg-error/20"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                              {s.status === "active" ? "block" : "check_circle"}
                            </span>
                            {s.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSection === "roles" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ROLES.map((role) => (
            <div key={role.value} className="bg-white rounded-2xl border border-outline-variant/30 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${role.color}`}>{role.label}</div>
              </div>
              <p className="text-sm text-on-surface-variant mb-4">{role.desc}</p>
              <div className="space-y-2">
                {getRolePermissions(role.value).map((perm) => (
                  <div key={perm.label} className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-sm ${perm.allowed ? "text-green-600" : "text-error"}`}>
                      {perm.allowed ? "check_circle" : "cancel"}
                    </span>
                    <span className="text-sm text-on-surface-variant">{perm.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/20">
                <p className="text-sm text-on-surface-variant">
                  Số người: <span className="font-bold text-on-surface">
                    {mockStaff.filter((s) => s.role === role.value).length}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Password modal */}
      {pwTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-on-surface">Đặt mật khẩu mới</h3>
                <p className="text-sm text-on-surface-variant mt-0.5">Tài khoản: <span className="font-semibold text-on-surface">{pwTarget.name}</span></p>
              </div>
              <button type="button" onClick={() => setPwTarget(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>

            {pwSuccess ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-green-600" style={{ fontSize: 24 }}>check_circle</span>
                </div>
                <p className="font-semibold text-on-surface mb-1">Đặt mật khẩu thành công</p>
                <p className="text-sm text-on-surface-variant mb-5">Mật khẩu mới đã được cập nhật cho <span className="font-semibold">{pwTarget.name}</span>.</p>
                <button type="button" onClick={() => setPwTarget(null)} className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Đóng</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">Mật khẩu mới *</label>
                  <input
                    type="password"
                    placeholder="Tối thiểu 6 ký tự"
                    value={pwForm.newPw}
                    onChange={(e) => { setPwForm((f) => ({ ...f, newPw: e.target.value })); setPwError(""); }}
                    className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-1">Xác nhận mật khẩu *</label>
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    value={pwForm.confirmPw}
                    onChange={(e) => { setPwForm((f) => ({ ...f, confirmPw: e.target.value })); setPwError(""); }}
                    className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                {pwError && (
                  <p className="text-sm text-error flex items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span>
                    {pwError}
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setPwTarget(null)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
                  <button type="button" onClick={savePw} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">Xác nhận</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staff modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-on-surface">{editTarget ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Họ và tên *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-1">Số điện thoại</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-on-surface-variant mb-2">Vai trò</label>
                <div className="space-y-2">
                  {ROLES.map((r) => {
                    const selected = form.role === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                        className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-all select-none text-left ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-outline-variant hover:border-outline hover:bg-surface-container-low"
                        }`}
                      >
                        <span className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selected ? "border-primary" : "border-outline"}`}>
                          {selected && <span className="w-2 h-2 rounded-full bg-primary block" />}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold leading-tight ${selected ? "text-primary" : "text-on-surface"}`}>{r.label}</p>
                          <p className="text-sm text-on-surface-variant mt-0.5 leading-snug">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors">Hủy</button>
              <button type="button" onClick={save} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                {editTarget ? "Lưu thay đổi" : "Thêm thành viên"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getRolePermissions(role: StaffRole) {
  return [
    { label: "Xem dashboard & báo cáo", allowed: role !== "sale" },
    { label: "Quản lý đặt chỗ", allowed: role !== "staff" },
    { label: "Quản lý người đăng ký", allowed: role === "admin" || role === "coordinator" || role === "sale" },
    { label: "Tạo & sửa chuyến đi DLTN", allowed: role === "admin" || role === "coordinator" },
    { label: "Quản lý điểm đến", allowed: role === "admin" || role === "coordinator" },
    { label: "Phân quyền nhân viên", allowed: role === "admin" },
    { label: "Cấu hình hệ thống", allowed: role === "admin" },
  ];
}
