"use client";

import { useState } from "react";

type Activity = {
  timeFrom: string;
  timeTo: string;
  name: string;
  description: string;
  images?: string[];
};

type ItineraryDay = {
  day: number;
  title: string;
  activities: Activity[];
};

export default function TourItinerary({ itinerary }: { itinerary: ItineraryDay[] }) {
  const days = itinerary.filter((d) => d.activities?.length > 0);

  const [expandedDays, setExpandedDays] = useState<Set<number>>(
    new Set(days.map((d) => d.day))
  );

  if (days.length === 0) return null;

  function toggle(day: number) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const expanded = expandedDays.has(day.day);
        return (
          <div key={day.day} className="bg-white border border-outline-variant/30 rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Day header — clickable toggle */}
            <button
              type="button"
              onClick={() => toggle(day.day)}
              className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 bg-white hover:bg-surface-container-low/50 transition-colors text-left select-none ${
                expanded ? "border-b border-outline-variant/20" : ""
              }`}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                {String(day.day).padStart(2, "0")}
              </div>
              <h3 className="flex-1 text-base font-bold text-primary leading-snug">{day.title}</h3>
              <span
                className="material-symbols-outlined text-primary transition-transform duration-200"
                style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                expand_more
              </span>
            </button>

            {/* Timeline — shown only when expanded */}
            {expanded && (
              <div className="px-4 sm:px-6 py-5">
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-3 bottom-3 w-px bg-outline-variant/50" />

                  <div className="space-y-7">
                    {day.activities.map((act, idx) => (
                      <div key={idx} className="flex gap-3 sm:gap-5">
                        {/* Dot */}
                        <div className="w-[15px] shrink-0 flex flex-col items-center pt-1">
                          <div className="w-3.5 h-3.5 rounded-full bg-primary border-2 border-white ring-1 ring-primary/30 shrink-0" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-1">
                          {/* Time badge + name */}
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            {(act.timeFrom || act.timeTo) && (
                              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                                <span className="material-symbols-outlined" style={{ fontSize: 12 }}>schedule</span>
                                {act.timeFrom}{act.timeTo ? ` – ${act.timeTo}` : ""}
                              </span>
                            )}
                            <span className="font-semibold text-on-surface text-base">{act.name}</span>
                          </div>

                          {/* Description */}
                          {act.description && (
                            <p className="text-base text-on-surface-variant leading-relaxed mb-3">{act.description}</p>
                          )}

                          {/* Images */}
                          {act.images && act.images.length > 0 && (
                            <div className={`grid gap-3 ${act.images.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-1 sm:grid-cols-2"}`}>
                              {act.images.map((src, i) => (
                                <img
                                  key={i}
                                  src={src}
                                  alt={act.name}
                                  className="rounded-xl h-40 sm:h-44 w-full object-cover shadow-sm"
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
