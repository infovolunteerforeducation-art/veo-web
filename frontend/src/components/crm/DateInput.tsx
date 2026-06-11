"use client";

import { useState, useEffect, useRef } from "react";

type Props = {
  value: string; // ISO yyyy-mm-dd (or empty string)
  onChange: (iso: string) => void;
  className?: string;
};

function isoToDisplay(iso: string): string {
  if (!iso || iso.length < 10) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}

function displayToIso(dmy: string): string {
  const parts = dmy.split("/");
  if (parts.length !== 3) return "";
  const [d, m, y] = parts;
  if (!d || !m || !y || y.length !== 4) return "";
  const day = parseInt(d, 10), month = parseInt(m, 10), year = parseInt(y, 10);
  if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900) return "";
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export default function DateInput({ value, onChange, className }: Props) {
  const [display, setDisplay] = useState(() => isoToDisplay(value));
  const nativeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => setDisplay(isoToDisplay(value)), 0);
    return () => window.clearTimeout(id);
  }, [value]);

  function handleTextChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    let formatted = digits;
    if (digits.length > 4) formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    else if (digits.length > 2) formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    setDisplay(formatted);
    if (formatted.length === 10) onChange(displayToIso(formatted));
    else onChange("");
  }

  function handleNativeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const iso = e.target.value;
    onChange(iso);
    setDisplay(isoToDisplay(iso));
  }

  function openCalendar() {
    try {
      // showPicker() works on opacity-0 elements; must be called from a user gesture
      nativeRef.current?.showPicker();
    } catch {
      nativeRef.current?.click();
    }
  }

  return (
    <div className="relative w-full">
      {/* Visible text input — dd/mm/yyyy */}
      <input
        type="text"
        inputMode="numeric"
        maxLength={10}
        placeholder="dd/mm/yyyy"
        value={display}
        onChange={(e) => handleTextChange(e.target.value)}
        className={`${className ?? ""} pr-9`}
      />

      {/* Calendar icon button — dedicated click target, no z-index fighting */}
      <button
        type="button"
        onClick={openCalendar}
        tabIndex={-1}
        aria-label="Chọn ngày"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 17 }}>calendar_today</span>
      </button>

      {/* Native date input — opacity-0 + 1×1px so showPicker() works (requires non-display:none) */}
      <input
        ref={nativeRef}
        type="date"
        value={value || ""}
        onChange={handleNativeChange}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute opacity-0 w-px h-px top-0 right-0 pointer-events-none"
      />
    </div>
  );
}
