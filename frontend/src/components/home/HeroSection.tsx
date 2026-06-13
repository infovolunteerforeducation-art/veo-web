"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

type Banner = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  href: string;
};

const banners: Banner[] = [
  {
    id: 1,
    image: "/banners/veo-mai-chau-banner.webp",
    title: "Mai Châu\nThung lũng xanh",
    subtitle: "Sống cùng đồng bào Thái Trắng, dạy học và trải nghiệm cuộc sống bình yên giữa núi rừng Tây Bắc.",
    ctaLabel: "Xem tour Mai Châu",
    href: "/du-lich-tinh-nguyen",
  },
  {
    id: 2,
    image: "/banners/veo-ha-giang-banner.webp",
    title: "Hà Giang\nCực Bắc hùng vĩ",
    subtitle: "Tình nguyện tại cao nguyên đá Đồng Văn — hành trình kết nối với cộng đồng vùng cao đặc biệt nhất Việt Nam.",
    ctaLabel: "Xem tour Hà Giang",
    href: "/du-lich-tinh-nguyen",
  },
  {
    id: 3,
    image: "/banners/veo-hoa-binh-banner.webp",
    title: "Hòa Bình\nMiền sông nước",
    subtitle: "Đồng hành cùng trẻ em vùng hồ Hòa Bình — chương trình giáo dục kỹ năng sống và bảo vệ môi trường.",
    ctaLabel: "Xem tour Hòa Bình",
    href: "/du-lich-tinh-nguyen",
  },
  {
    id: 4,
    image: "/banners/veo-bac-kan-banner.webp",
    title: "Bắc Kạn\nHồ Ba Bể nguyên sơ",
    subtitle: "Tình nguyện bảo tồn sinh thái tại hồ Ba Bể — khu Ramsar quốc tế giữa đại ngàn Đông Bắc Việt Nam.",
    ctaLabel: "Xem tour Bắc Kạn",
    href: "/du-lich-tinh-nguyen",
  },
];

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 40;

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const didSwipeRef = useRef(false);

  const next = useCallback(() => setCurrent((i) => (i + 1) % banners.length), []);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + banners.length) % banners.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    didSwipeRef.current = false;
    setPaused(true);
  }, []);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const start = pointerStartRef.current;
    if (!start) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;

    if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY)) {
      didSwipeRef.current = true;
    }
  }, []);

  const handlePointerEnd = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const start = pointerStartRef.current;
    if (!start) {
      setPaused(false);
      return;
    }

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    pointerStartRef.current = null;

    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      didSwipeRef.current = true;
      if (deltaX < 0) {
        next();
      } else {
        prev();
      }
    }

    setPaused(false);
  }, [next, prev]);

  const handleClickCapture = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!didSwipeRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    didSwipeRef.current = false;
  }, []);

  return (
    <section
      className="relative w-full aspect-[4/3] min-h-[280px] touch-pan-y overflow-hidden sm:aspect-[3/1] sm:min-h-[220px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onClickCapture={handleClickCapture}
    >
      {/* Slides track */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="relative w-full h-full shrink-0 block"
            tabIndex={-1}
          >
            <Image
              src={banner.image}
              alt={banner.title.replace("\n", " ")}
              fill
              priority={banner.id === 1}
              sizes="100vw"
              className="object-cover object-left sm:object-center"
            />
          </Link>
        ))}
      </div>

      {/* Prev button */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/50 text-white hidden sm:flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Banner trước"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>chevron_left</span>
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={next}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/50 text-white hidden sm:flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Banner tiếp theo"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>chevron_right</span>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
