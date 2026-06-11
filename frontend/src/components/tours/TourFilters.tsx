"use client";

const regions = ["Miền Bắc", "Miền Nam"];
const durations = ["2 Ngày 1 Đêm", "3 Ngày 2 Đêm", "4 Ngày 3 Đêm"];

function FilterOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 cursor-pointer select-none transition-colors ${
        checked
          ? "border-primary bg-primary/5 text-primary"
          : "border-transparent text-on-surface-variant hover:border-primary/20 hover:bg-primary/5 hover:text-on-surface"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
          checked ? "border-primary bg-primary text-white" : "border-outline bg-white"
        }`}
      >
        {checked && (
          <span className="material-symbols-outlined" style={{ fontSize: 14, fontVariationSettings: "'FILL' 1" }}>
            check
          </span>
        )}
      </span>
      <span className={`text-sm leading-snug ${checked ? "font-bold" : "font-medium"}`}>{label}</span>
    </label>
  );
}

export type TourFilterState = {
  regions: string[];
  durations: string[];
};

export const EMPTY_TOUR_FILTERS: TourFilterState = {
  regions: [],
  durations: [],
};

type Props = {
  filters: TourFilterState;
  onChange: (filters: TourFilterState) => void;
};

export default function TourFilters({ filters, onChange }: Props) {
  const toggle = (field: keyof TourFilterState, item: string) => {
    const list = filters[field];
    onChange({
      ...filters,
      [field]: list.includes(item) ? list.filter((i) => i !== item) : [...list, item],
    });
  };

  const clearAll = () => onChange(EMPTY_TOUR_FILTERS);

  return (
    <div className="w-full bg-pure-white p-4 sm:p-6 rounded-xl shadow-sm space-y-5 lg:sticky lg:top-24">
      <div>
        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined">filter_list</span>
          Bộ lọc
        </h3>

        {/* Regions */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-outline mb-3">
            Miền
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {regions.map((region) => (
              <FilterOption
                key={region}
                label={region}
                checked={filters.regions.includes(region)}
                onChange={() => toggle("regions", region)}
              />
            ))}
          </div>
        </div>

        {/* Durations */}
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-outline mb-3">
            Số ngày đêm
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
            {durations.map((duration) => (
              <FilterOption
                key={duration}
                label={duration}
                checked={filters.durations.includes(duration)}
                onChange={() => toggle("durations", duration)}
              />
            ))}
          </div>
        </div>

        <button
          onClick={clearAll}
          className="w-full py-3 border-2 border-primary text-primary rounded-lg font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
          Xóa bộ lọc
        </button>
      </div>
    </div>
  );
}
