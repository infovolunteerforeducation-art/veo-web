"use client";

import { useState } from "react";
import { CMSUser, CMSRole, ROLE_LABELS, DEMO_CMS_USERS } from "@/lib/cms-data";

const ROLE_TABS_SUMMARY: Record<CMSRole, string> = {
  admin:  "Toàn quyền — tất cả module + phân quyền",
  editor: "Chỉnh sửa tất cả nội dung, không quản lý user",
  writer: "Chỉ viết và lưu nháp bài blog",
};

const ROLE_BADGE: Record<CMSRole, string> = {
  admin:  "bg-primary/10 text-primary",
  editor: "bg-blue-50 text-blue-700",
  writer: "bg-surface-container text-on-surface-variant",
};

export default function RolesTab() {
  const [users, setUsers] = useState<CMSUser[]>(
    DEMO_CMS_USERS.map(({ password: _, ...u }) => u),
  );

  function changeRole(id: string, role: CMSRole) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  function removeUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-on-surface">Phân quyền</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">{users.length} tài khoản CMS đang hoạt động</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "#0a5c45" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_add</span>Mời thành viên
        </button>
      </div>

      {/* Role reference */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(Object.keys(ROLE_LABELS) as CMSRole[]).map((role) => (
          <div key={role} className="bg-white rounded-2xl border border-outline-variant/50 p-4 space-y-1.5">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${ROLE_BADGE[role]}`}>{ROLE_LABELS[role]}</span>
            <p className="text-xs text-on-surface-variant">{ROLE_TABS_SUMMARY[role]}</p>
          </div>
        ))}
      </div>

      {/* User list */}
      <div className="bg-white rounded-2xl border border-outline-variant/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant/40 bg-surface-container-low">
              <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Thành viên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-on-surface-variant">Vai trò</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user.id} className={`border-b border-outline-variant/30 last:border-0 ${i % 2 === 0 ? "" : "bg-surface-container-lowest/50"}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "#0a5c45" }}>
                      {user.displayName.charAt(0)}
                    </div>
                    <span className="font-semibold text-on-surface">{user.displayName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-on-surface-variant">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value as CMSRole)}
                    className="px-2.5 py-1.5 rounded-lg border border-outline-variant text-xs font-semibold text-on-surface outline-none focus:border-primary bg-white"
                  >
                    {(Object.keys(ROLE_LABELS) as CMSRole[]).map((r) => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => removeUser(user.id)}
                    className="p-1.5 rounded-lg hover:bg-error-container transition-colors text-on-surface-variant hover:text-error"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>person_remove</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
