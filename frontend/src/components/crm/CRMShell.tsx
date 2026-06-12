"use client";

import { useState } from "react";
import DashboardTab from "./tabs/DashboardTab";
import BookingsTab from "./tabs/BookingsTab";
import CustomersTab from "./tabs/CustomersTab";
import ToursTab from "./tabs/ToursTab";
import SchedulesTab from "./tabs/SchedulesTab";
import CoordinationTab from "./tabs/CoordinationTab";
import DestinationsTab from "./tabs/DestinationsTab";
import SettingsTab from "./tabs/SettingsTab";
import PromoCodesTab from "./tabs/PromoCodesTab";
import SignInPage from "./SignInPage";
import { StaffRole, ManagedTour, mockTours, mockBookings } from "@/lib/crm-data";

const pendingCount = mockBookings.filter((b) => b.status === "pending").length;

type Tab = "dashboard" | "bookings" | "customers" | "tours" | "schedules" | "coordination" | "destinations" | "promoCodes" | "settings";

// Leaf = single tab link; Group = collapsible parent with child tabs
type NavLeaf  = { kind: "leaf";  id: Tab;    label: string; icon: string };
type NavGroup = { kind: "group"; id: string; label: string; icon: string; children: { id: Tab; label: string }[] };
type NavEntry = NavLeaf | NavGroup;

const NAV: NavEntry[] = [
  { kind: "leaf",  id: "dashboard",    label: "Dashboard",       icon: "dashboard" },
  { kind: "leaf",  id: "bookings",     label: "Đăng ký",          icon: "event_note" },
  { kind: "leaf",  id: "customers",    label: "Khách hàng",       icon: "people" },
  { kind: "group", id: "trips",        label: "Chuyến đi DLTN",  icon: "hiking", children: [
    { id: "tours",        label: "Chương trình" },
    { id: "schedules",    label: "Lịch chuyến" },
    { id: "coordination", label: "Điều phối" },
  ]},
  { kind: "leaf",  id: "destinations", label: "Điểm đến",         icon: "location_on" },
  { kind: "leaf",  id: "promoCodes",   label: "Mã KM",            icon: "local_offer" },
  { kind: "leaf",  id: "settings",     label: "Cài đặt",          icon: "settings" },
];

const ROLE_ALLOWED_TABS: Record<StaffRole, Tab[]> = {
  admin:       ["dashboard", "bookings", "customers", "tours", "schedules", "coordination", "destinations", "promoCodes", "settings"],
  coordinator: ["dashboard", "bookings", "customers", "tours", "schedules", "coordination", "destinations"],
  sale:        ["bookings", "customers"],
  staff:       ["dashboard", "bookings", "customers", "coordination"],
};

const PREVIEW_ROLES: { value: StaffRole; label: string }[] = [
  { value: "coordinator", label: "Điều phối viên" },
  { value: "sale",        label: "Sale" },
  { value: "staff",       label: "Nhân viên" },
];

function getTabLabel(tab: Tab): string {
  for (const entry of NAV) {
    if (entry.kind === "leaf" && entry.id === tab) return entry.label;
    if (entry.kind === "group") {
      const child = entry.children.find((c) => c.id === tab);
      if (child) return child.label;
    }
  }
  return "";
}

export default function CRMShell() {
  const [signedInUser, setSignedInUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [previewRole, setPreviewRole] = useState<StaffRole | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [tours, setTours] = useState<ManagedTour[]>(mockTours);
  const [scheduleDeepLink, setScheduleDeepLink] = useState<string | null>(null);
  const [tourDeepLink, setTourDeepLink] = useState<string | null>(null);
  const [bookingDeepLink, setBookingDeepLink] = useState<string | null>(null);

  if (!signedInUser) {
    return <SignInPage onSignIn={(name) => setSignedInUser(name)} />;
  }

  const effectiveRole: StaffRole = previewRole ?? "admin";
  const allowedTabs = ROLE_ALLOWED_TABS[effectiveRole];

  function switchTab(tab: Tab) {
    if (!allowedTabs.includes(tab)) return;
    setActiveTab(tab);
    setSidebarOpen(false);
  }

  function activatePreview(role: StaffRole) {
    setPreviewRole(role);
    const firstAllowed = ROLE_ALLOWED_TABS[role][0];
    if (!ROLE_ALLOWED_TABS[role].includes(activeTab)) setActiveTab(firstAllowed);
  }

  function isGroupExpanded(entry: NavGroup) {
    return expandedGroup === entry.id || entry.children.some((c) => c.id === activeTab);
  }

  function toggleGroup(entry: NavGroup) {
    const anyPermitted = entry.children.some((c) => allowedTabs.includes(c.id));
    if (!anyPermitted) return;
    setExpandedGroup(isGroupExpanded(entry) ? null : entry.id);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface select-none">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden cursor-pointer" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-deep-amethyst text-pure-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 h-16 border-b border-white/10 shrink-0">
          <img src="/veo-logo-linkedin.png" alt="VEO" className="w-8 h-8 rounded-lg" />
          <div>
            <p className="text-sm font-bold leading-tight">VEO CRM</p>
            <p className="text-[10px] text-white/50 leading-tight">Quản lý nội bộ</p>
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
                      ? "bg-white/15 text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{entry.icon}</span>
                  {entry.label}
                  {permitted && entry.id === "bookings" && pendingCount > 0 && (
                    <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {pendingCount}
                    </span>
                  )}
                  {!permitted && (
                    <span className="material-symbols-outlined ml-auto text-white/20" style={{ fontSize: 14 }}>lock</span>
                  )}
                </button>
              );
            }

            // Group entry
            const anyPermitted = entry.children.some((c) => allowedTabs.includes(c.id));
            const parentActive = entry.children.some((c) => c.id === activeTab);
            const expanded = isGroupExpanded(entry);

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
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{entry.icon}</span>
                  <span className="flex-1 text-left">{entry.label}</span>
                  {anyPermitted ? (
                    <span
                      className={`material-symbols-outlined text-white/50 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                      style={{ fontSize: 18 }}
                    >
                      expand_more
                    </span>
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
                              : "text-white/50 hover:bg-white/10 hover:text-white"
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

        {/* Bottom user */}
        <div className="px-4 py-4 border-t border-white/10 shrink-0 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-solar-orange flex items-center justify-center text-xs font-bold text-white shrink-0">
              {signedInUser.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{signedInUser}</p>
              <p className="text-xs text-white/50 truncate">admin@veo.vn</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setSignedInUser(null); setPreviewRole(null); setActiveTab("dashboard"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium select-none"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {previewRole && (
          <div className="bg-solar-orange/15 border-b border-solar-orange/30 px-4 py-2 flex items-center gap-3 shrink-0">
            <span className="material-symbols-outlined text-solar-orange" style={{ fontSize: 18 }}>visibility</span>
            <span className="text-sm font-semibold text-on-surface">
              Đang xem thử quyền: <span className="text-solar-orange">{PREVIEW_ROLES.find((r) => r.value === previewRole)?.label}</span>
            </span>
            <span className="text-sm text-on-surface-variant">— Các tab bị khóa là ngoài tầm quyền của role này</span>
            <button
              type="button"
              onClick={() => setPreviewRole(null)}
              className="ml-auto flex items-center gap-1.5 text-sm font-semibold text-error hover:text-error/80 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              Thoát xem thử
            </button>
          </div>
        )}

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
            {!previewRole && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-on-surface-variant hidden sm:block">Xem thử quyền:</span>
                <div className="flex gap-1">
                  {PREVIEW_ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => activatePreview(r.value)}
                      className="px-2.5 py-1 rounded-lg border border-outline-variant text-sm font-semibold text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-colors"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <span className="text-sm text-on-surface-variant hidden sm:block">
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {activeTab === "dashboard"    && <DashboardTab />}
          {activeTab === "bookings"     && <BookingsTab deepLinkBookingId={bookingDeepLink} onDeepLinkBookingConsumed={() => setBookingDeepLink(null)} onNavigateToCustomer={(id) => { /* no deep link to customers yet */ switchTab("customers"); }} onNavigateToTour={(id) => { setTourDeepLink(id); switchTab("tours"); }} onNavigateToSchedule={(id) => { setScheduleDeepLink(id); switchTab("schedules"); }} />}
          {activeTab === "customers"    && <CustomersTab onNavigateToTour={(id) => { setTourDeepLink(id); switchTab("tours"); }} onNavigateToSchedule={(id) => { setScheduleDeepLink(id); switchTab("schedules"); }} onNavigateToBooking={(id) => { setBookingDeepLink(id); switchTab("bookings"); }} />}
          {activeTab === "tours"        && <ToursTab tours={tours} setTours={setTours} onNavigateToSchedule={(id) => { setScheduleDeepLink(id); switchTab("schedules"); }} onNavigateToBooking={(id) => { setBookingDeepLink(id); switchTab("bookings"); }} deepLinkTourId={tourDeepLink} onDeepLinkTourConsumed={() => setTourDeepLink(null)} />}
          {activeTab === "schedules"    && <SchedulesTab tours={tours} setTours={setTours} deepLinkScheduleId={scheduleDeepLink} onDeepLinkConsumed={() => setScheduleDeepLink(null)} onNavigateToBooking={(id) => { setBookingDeepLink(id); switchTab("bookings"); }} />}
          {activeTab === "coordination" && <CoordinationTab />}
          {activeTab === "destinations" && <DestinationsTab />}
          {activeTab === "promoCodes"   && <PromoCodesTab />}
          {activeTab === "settings"     && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
