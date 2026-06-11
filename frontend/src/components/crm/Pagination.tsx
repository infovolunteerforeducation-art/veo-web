"use client";

type Props = {
  page: number;        // 1-indexed
  pageCount: number;
  onPageChange: (p: number) => void;
};

function getPageNumbers(page: number, pageCount: number): (number | "...")[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, "...", pageCount];
  if (page >= pageCount - 3) return [1, "...", pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, "...", page - 1, page, page + 1, "...", pageCount];
}

export default function Pagination({ page, pageCount, onPageChange }: Props) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-outline-variant/20">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_left</span>
        Trước
      </button>
      {getPageNumbers(page, pageCount).map((p, i) =>
        p === "..." ? (
          <span key={`el-${i}`} className="px-1.5 text-sm text-on-surface-variant select-none">…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-semibold transition-colors ${
              p === page ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className="flex items-center gap-0.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-container disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        Sau
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
      </button>
    </div>
  );
}
