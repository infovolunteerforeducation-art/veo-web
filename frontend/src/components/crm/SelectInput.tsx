"use client";

import { useState, useRef, useEffect } from "react";

export type SelectOption = { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  /** Applied to the trigger button — pass layout + border + padding classes here */
  className?: string;
};

export default function SelectInput({ value, onChange, options, disabled, className }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={`flex items-center justify-between gap-2 transition-colors ${
          disabled
            ? "opacity-60 cursor-not-allowed"
            : open
            ? "border-primary ring-2 ring-primary/20"
            : "hover:border-primary/50"
        } ${className ?? ""}`}
      >
        <span className="truncate">{selected?.label ?? ""}</span>
        <span
          className={`material-symbols-outlined text-on-surface-variant shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
          style={{ fontSize: 20 }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-[200] min-w-full bg-white rounded-xl border border-outline-variant/40 shadow-xl py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                value === opt.value
                  ? "text-primary bg-primary/5 font-semibold"
                  : "text-on-surface hover:bg-surface-container-low font-medium"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
