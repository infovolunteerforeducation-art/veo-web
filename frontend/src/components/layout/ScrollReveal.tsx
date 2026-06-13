"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

type ScrollRevealDirection = "up" | "left" | "right" | "none";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: ScrollRevealDirection;
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.dataset.revealed = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.revealed = "true";
          observer.unobserve(element);
        }
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.14,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-scroll-reveal={direction}
      className={className}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
