"use client";

import { useState } from "react";

type Props = {
  volunteer: string[];
  experience: string[];
};

export default function CampActivitiesTabs({ volunteer, experience }: Props) {
  const [tab, setTab] = useState<"volunteer" | "experience">("volunteer");

  return (
    <div>
      <div className="flex gap-1 border-b border-outline-variant/30 mb-6">
        <button
          type="button"
          onClick={() => setTab("volunteer")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors -mb-px ${
            tab === "volunteer"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">favorite</span>
          Hoạt động tình nguyện
        </button>
        <button
          type="button"
          onClick={() => setTab("experience")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors -mb-px ${
            tab === "experience"
              ? "border-primary text-primary"
              : "border-transparent text-on-surface-variant hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          Hoạt động trải nghiệm
        </button>
      </div>

      <div className="bg-white border border-outline-variant/30 rounded-xl p-5 sm:p-8">
        {tab === "volunteer" && (
          <ul className="space-y-4">
            {volunteer.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-on-surface-variant">
                <span className="material-symbols-outlined text-solar-orange shrink-0 mt-0.5" style={{ fontSize: 20 }}>
                  favorite
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
        {tab === "experience" && (
          <ul className="space-y-4">
            {experience.map((item) => (
              <li key={item} className="flex items-start gap-3 text-base text-on-surface-variant">
                <span className="material-symbols-outlined text-primary shrink-0 mt-0.5" style={{ fontSize: 20 }}>
                  auto_awesome
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
