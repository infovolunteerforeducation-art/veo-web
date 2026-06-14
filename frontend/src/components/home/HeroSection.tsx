"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeBanner } from "@/lib/cms-content";

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 40;

export default function HeroSection({ banners }: { banners: HomeBanner[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const didSwipeRef = useRef(false);

  const next = useCallback(() => setCurrent((i) => (i + 1) % banners.length), [banners.length]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    if (paused || banners.length === 0) return;
    const id = setInterval(next, AUTO_PLAY_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next, banners.length]);

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
    if (!start) { setPaused(false); return; }
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    pointerStartRef.current = null;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      didSwipeRef.current = true;
      if (deltaX < 0) next(); else prev();
    }
    setPaused(false);
  }, [next, prev]);

  const handleClickCapture = useCallback((event: React.MouseEvent<HTMLElement>) => {
    if (!didSwipeRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    didSwipeRef.current = false;
  }, []);

  if (banners.length === 0) return null;

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
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => {
          const img = (
            <Image
              src={banner.image}
              alt="VEO Banner"
              fill
              priority={banner.id === banners[0]?.id}
              sizes="100vw"
              className="object-cover object-left sm:object-center"
            />
          );
          return banner.href ? (
            <Link key={banner.id} href={banner.href} className="relative w-full h-full shrink-0 block" tabIndex={-1}>
              {img}
            </Link>
          ) : (
            <div key={banner.id} className="relative w-full h-full shrink-0">
              {img}
            </div>
          );
        })}
      </div>

      <button type="button" onClick={prev}
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/50 text-white hidden sm:flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Banner trước">
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>chevron_left</span>
      </button>

      <button type="button" onClick={next}
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/30 hover:bg-black/50 text-white hidden sm:flex items-center justify-center transition-colors backdrop-blur-sm"
        aria-label="Banner tiếp theo">
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>chevron_right</span>
      </button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {banners.map((_, i) => (
          <button key={i} type="button" onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/75"}`}
            aria-label={`Banner ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
