"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Du lịch tình nguyện", href: "/tours" },
  { label: "Trại hè tình nguyện", href: "/trai-he-tinh-nguyen" },
  { label: "CSR", href: "#" },
  { label: "SLP", href: "https://www.slp.edu.vn/", external: true },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          <div className="grid grid-cols-2 gap-3 pt-2">
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
        </div>
      )}
    </header>
  );
}
