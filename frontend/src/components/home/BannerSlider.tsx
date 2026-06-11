"use client";

import { useRef } from "react";
import Link from "next/link";

const banners = [
  {
    id: 1,
    tag: "Ưu đãi đặc biệt",
    title: "Đăng ký sớm\ngiảm đến 15%",
    sub: "Áp dụng cho tất cả tour hè 2025",
    cta: "Xem tour",
    href: "/tours",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=320&fit=crop",
  },
  {
    id: 2,
    tag: "Mùa hè tình nguyện",
    title: "Khám phá\nSapa & Hà Giang",
    sub: "Tour giáo dục vùng cao — còn 4 suất",
    cta: "Đăng ký ngay",
    href: "/tours",
    image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=320&fit=crop",
  },
  {
    id: 3,
    tag: "Workcamp 2025",
    title: "Tình nguyện\ncùng bạn bè quốc tế",
    sub: "Kết nối — Trải nghiệm — Cống hiến",
    cta: "Tìm hiểu thêm",
    href: "/tours",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=320&fit=crop",
  },
  {
    id: 4,
    tag: "CSR cho doanh nghiệp",
    title: "Gắn kết đội nhóm\nqua thiện nguyện",
    sub: "Chương trình CSR trọn gói cho công ty",
    cta: "Liên hệ tư vấn",
    href: "#",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=320&fit=crop",
  },
];

export default function BannerSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("a") as HTMLElement;
    const gap = 24;
    const amount = card ? card.offsetWidth + gap : 340;
    track.scrollBy({ left: dir === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-8 relative">
      {/* Prev */}
      <button
        onClick={() => scroll("prev")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-surface-container transition-colors"
        aria-label="Prev"
      >
        <span className="material-symbols-outlined text-on-surface">chevron_left</span>
      </button>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {banners.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="shrink-0 w-[calc(33.333%-16px)] min-w-[280px] rounded-2xl overflow-hidden group"
            style={{ minHeight: "180px" }}
          >
            <img
              src={b.image}
              alt={b.tag}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              style={{ minHeight: "180px" }}
            />
          </Link>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => scroll("next")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-surface-container transition-colors"
        aria-label="Next"
      >
        <span className="material-symbols-outlined text-on-surface">chevron_right</span>
      </button>
    </section>
  );
}
