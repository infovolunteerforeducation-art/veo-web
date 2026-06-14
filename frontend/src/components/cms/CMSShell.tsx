"use client";

import { useState } from "react";
import Image from "next/image";
import { CMSRole, CMSTab, ROLE_ALLOWED_TABS, ROLE_LABELS } from "@/lib/cms-data";
import CMSSignInPage from "./CMSSignInPage";
import HomePageTab    from "./tabs/HomePageTab";
import CampListingTab from "./tabs/CampListingTab";
import TourListingTab from "./tabs/TourListingTab";
import B2BCsrTab      from "./tabs/B2BCsrTab";
import B2BSchoolTab   from "./tabs/B2BSchoolTab";
import BlogTab        from "./tabs/BlogTab";
import ContactTab     from "./tabs/ContactTab";
import FooterTab      from "./tabs/FooterTab";
import RolesTab       from "./tabs/RolesTab";

const CMS_GREEN      = "#0a5c45";
const CMS_GREEN_DARK = "#073d2e";

// ── Navigation definition ──────────────────────────────────────────────────────
type NavLeaf  = { kind: "leaf";  id: CMSTab;    label: string; icon: string };
type NavGroup = { kind: "group"; id: string;    label: string; icon: string; children: { id: CMSTab; label: string }[] };
type NavEntry = NavLeaf | NavGroup;

const NAV: NavEntry[] = [
  { kind: "leaf",  id: "homepage",     label: "Trang chủ",       icon: "home" },
  { kind: "group", id: "programs",     label: "Chương trình",    icon: "explore", children: [
    { id: "tour-listing",  label: "Du lịch tình nguyện" },
    { id: "camp-listing",  label: "Trại hè" },
  ]},
  { kind: "group", id: "b2b",          label: "B2B",             icon: "business", children: [
    { id: "b2b-csr",    label: "CSR doanh nghiệp" },
    { id: "b2b-school", label: "Hoạt động ngoại khóa" },
  ]},
  { kind: "leaf",  id: "blog",         label: "Blog & Tin tức",  icon: "article" },
  { kind: "leaf",  id: "contact",      label: "Liên hệ",         icon: "contact_mail" },
  { kind: "leaf",  id: "footer",        label: "Footer",           icon: "palette" },
  { kind: "leaf",  id: "roles",        label: "Phân quyền",      icon: "manage_accounts" },
];

function getTabLabel(tab: CMSTab): string {
  for (const entry of NAV) {
    if (entry.kind === "leaf" && entry.id === tab) return entry.label;
    if (entry.kind === "group") {
      const child = entry.children.find((c) => c.id === tab);
      if (child) return child.label;
    }
  }
  return "";
}

// ── Shell ──────────────────────────────────────────────────────────────────────
export default function CMSShell() {
  const [user, setUser]         = useState<{ displayName: string; role: CMSRole } | null>(null);
  const [activeTab, setActiveTab]     = useState<CMSTab>("homepage");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroup, setExpanded]  = useState<string | null>(null);

  if (!user) {
    return <CMSSignInPage onSignIn={(u) => setUser(u)} />;
  }

  const allowedTabs = ROLE_ALLOWED_TABS[user.role];

  function switchTab(tab: CMSTab) {
    if (!allowedTabs.includes(tab)) return;
    setActiveTab(tab);
    setSidebarOpen(false);
  }

  function isGroupExpanded(entry: NavGroup) {
    return expandedGroup === entry.id || entry.children.some((c) => c.id === activeTab);
  }

  function toggleGroup(entry: NavGroup) {
    if (!entry.children.some((c) => allowedTabs.includes(c.id))) return;
    setExpanded(isGroupExpanded(entry) ? null : entry.id);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface select-none">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden cursor-pointer" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 text-pure-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: `linear-gradient(180deg, ${CMS_GREEN} 0%, ${CMS_GREEN_DARK} 100%)` }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <Image src="/veo-logo-linkedin.png" alt="VEO" width={32} height={32} className="w-8 h-8 rounded-lg" />
          <div>
            <p className="text-sm font-bold leading-tight">VEO CMS</p>
            <p className="text-[10px] text-white/50 leading-tight">Quản lý nội dung</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map((entry) => {
            if (entry.kind === "leaf") {
              const permitted = allowedTabs.includes(entry.id);
              return (
                <button
                  key={entry.id}
                  type="button"
                  disabled={!permitted}
                  onClick={() => switchTab(entry.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors select-none ${
                    !permitted
                      ? "text-white/20 cursor-not-allowed"
                      : activeTab === entry.id
                      ? "bg-white/20 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{entry.icon}</span>
                  {entry.label}
                  {!permitted && (
                    <span className="material-symbols-outlined ml-auto text-white/20" style={{ fontSize: 14 }}>lock</span>
                  )}
                </button>
              );
            }

            // Group
            const anyPermitted  = entry.children.some((c) => allowedTabs.includes(c.id));
            const parentActive  = entry.children.some((c) => c.id === activeTab);
            const expanded      = isGroupExpanded(entry);

            return (
              <div key={entry.id}>
                <button
                  type="button"
                  disabled={!anyPermitted}
                  onClick={() => toggleGroup(entry)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors select-none ${
                    !anyPermitted
                      ? "text-white/20 cursor-not-allowed"
                      : parentActive
                      ? "bg-white/15 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{entry.icon}</span>
                  <span className="flex-1 text-left">{entry.label}</span>
                  {anyPermitted ? (
                    <span
                      className={`material-symbols-outlined text-white/50 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                      style={{ fontSize: 18 }}
                    >expand_more</span>
                  ) : (
                    <span className="material-symbols-outlined text-white/20" style={{ fontSize: 14 }}>lock</span>
                  )}
                </button>

                {expanded && (
                  <div className="mt-0.5 ml-4 pl-3 border-l border-white/10 space-y-0.5">
                    {entry.children.map((child) => {
                      const permitted = allowedTabs.includes(child.id);
                      return (
                        <button
                          key={child.id}
                          type="button"
                          disabled={!permitted}
                          onClick={() => switchTab(child.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors select-none ${
                            !permitted
                              ? "text-white/20 cursor-not-allowed"
                              : activeTab === child.id
                              ? "bg-white/20 text-white"
                              : "text-white/55 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                            {activeTab === child.id ? "radio_button_checked" : "radio_button_unchecked"}
                          </span>
                          {child.label}
                          {!permitted && (
                            <span className="material-symbols-outlined ml-auto text-white/20" style={{ fontSize: 12 }}>lock</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-white/10 shrink-0 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: "#fbb040" }}>
              {user.displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
              <p className="text-xs text-white/50 truncate">{ROLE_LABELS[user.role]}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setUser(null); setActiveTab("homepage"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-outline-variant/30 flex items-center gap-4 px-4 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">menu</span>
          </button>
          <h1 className="text-base font-bold text-on-surface">{getTabLabel(activeTab)}</h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-on-surface-variant hidden sm:block">
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
            </span>
          </div>
        </header>

        {/* Tab content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === "homepage"     && <HomePageTab />}
          {activeTab === "camp-listing" && <CampListingTab />}
          {activeTab === "tour-listing" && <TourListingTab />}
          {activeTab === "b2b-csr"      && <B2BCsrTab />}
          {activeTab === "b2b-school"   && <B2BSchoolTab />}
          {activeTab === "blog"         && <BlogTab />}
          {activeTab === "contact"      && <ContactTab />}
          {activeTab === "footer"       && <FooterTab />}
          {activeTab === "roles"        && <RolesTab />}
        </main>
      </div>
    </div>
  );
}
