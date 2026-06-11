"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Du lịch tình nguyện", href: "/tours" },
  { label: "Trại hè tình nguyện", href: "/trai-he-tinh-nguyen" },
  { label: "CSR", href: "#" },
  { label: "SLP", href: "https://www.slp.edu.vn/", external: true },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  return (
    <header
      className={`w-full top-0 sticky z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/98 shadow-md"
          : "bg-pure-white shadow-sm"
      }`}
    >
      <div className="flex justify-between items-center h-20 px-4 sm:px-6 max-w-[1200px] mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/veo-logo.png"
            alt="VEO Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = !link.external && link.href !== "#" && (
              pathname === link.href || pathname.startsWith(`${link.href}/`)
            );
            return (
              <Link
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`text-base font-semibold transition-colors duration-200 ${
                  isActive
                    ? "text-primary border-b-2 border-solar-orange pb-1"
                    : "text-on-surface-variant hover:text-solar-orange"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Auth area — desktop */}
          {!loading && (
            <>
              {user ? (
                /* Logged-in: avatar + dropdown */
                <div className="hidden lg:block relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-full hover:bg-surface-container transition-colors"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-on-primary select-none">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-on-surface max-w-[120px] truncate">
                      {user.name.split(" ").pop()}
                    </span>
                    <span className="material-symbols-outlined text-base text-on-surface-variant">
                      {dropdownOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-outline-variant/30 py-2 z-50">
                      <div className="px-4 py-2 border-b border-outline-variant/20 mb-1">
                        <p className="text-xs text-on-surface-variant">Đăng nhập với tư cách</p>
                        <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                      </div>
                      <Link
                        href="/tai-khoan"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
                      >
                        <span className="material-symbols-outlined text-base text-on-surface-variant">person</span>
                        Tài khoản của tôi
                      </Link>
                      <div className="my-1 border-t border-outline-variant/20" />
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest: login + register */
                <>
                  <Link
                    href="/dang-nhap"
                    className="hidden lg:inline-flex items-center justify-center px-4 py-2 rounded-full text-primary text-base font-bold hover:bg-primary/5 transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/dang-ky"
                    className="hidden lg:inline-flex items-center justify-center bg-solar-orange hover:bg-action-hover text-pure-white px-5 py-2 rounded-full text-base font-bold transition-colors"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-on-surface">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-pure-white border-t border-surface-variant px-4 sm:px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => {
            const isActive = !link.external && link.href !== "#" && (
              pathname === link.href || pathname.startsWith(`${link.href}/`)
            );
            return (
              <Link
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`text-base font-semibold transition-colors ${
                  isActive ? "text-primary" : "text-on-surface hover:text-solar-orange"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Mobile auth */}
          {!loading && (
            <div className="pt-2 border-t border-outline-variant/30">
              {user ? (
                <div className="space-y-2">
                  {/* User info */}
                  <div className="flex items-center gap-3 px-1 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-on-primary select-none">
                        {getInitials(user.name)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/tai-khoan"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-1 py-2 text-base font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">person</span>
                    Tài khoản
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-1 py-2 text-base font-semibold text-red-600 hover:text-red-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">logout</span>
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/dang-nhap"
                    className="flex items-center justify-center px-4 py-2.5 rounded-full text-primary text-base font-bold hover:bg-primary/5 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/dang-ky"
                    className="flex items-center justify-center bg-solar-orange hover:bg-action-hover text-pure-white px-4 py-2.5 rounded-full text-base font-bold transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
