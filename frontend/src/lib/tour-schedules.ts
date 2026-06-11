export type TourScheduleOption = {
  isoDate: string;
  label: string;
  spotsLeft: number;
};

export const TOUR_SCHEDULES: Record<string, TourScheduleOption[]> = {
  "sapa-xay-truong-hau-thao": [
    { isoDate: "2026-07-15", label: "15/07 - 17/07/2026", spotsLeft: 8 },
    { isoDate: "2026-08-05", label: "05/08 - 07/08/2026", spotsLeft: 3 },
    { isoDate: "2026-09-10", label: "10/09 - 12/09/2026", spotsLeft: 12 },
  ],
  "ly-son-lam-sach-dai-duong": [
    { isoDate: "2026-07-22", label: "22/07 - 24/07/2026", spotsLeft: 5 },
    { isoDate: "2026-08-19", label: "19/08 - 21/08/2026", spotsLeft: 10 },
    { isoDate: "2026-09-16", label: "16/09 - 18/09/2026", spotsLeft: 14 },
  ],
  "da-lat-ky-nang-song-vung-cao": [
    { isoDate: "2026-07-08", label: "08/07 - 10/07/2026", spotsLeft: 6 },
    { isoDate: "2026-08-12", label: "12/08 - 14/08/2026", spotsLeft: 2 },
    { isoDate: "2026-09-09", label: "09/09 - 11/09/2026", spotsLeft: 15 },
  ],
  "can-gio-trong-rung-ngap-man": [
    { isoDate: "2026-07-29", label: "29/07 - 31/07/2026", spotsLeft: 9 },
    { isoDate: "2026-08-26", label: "26/08 - 28/08/2026", spotsLeft: 11 },
    { isoDate: "2026-09-23", label: "23/09 - 25/09/2026", spotsLeft: 13 },
  ],
};

export function isRegistrationOpen(isoDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const departure = new Date(isoDate + "T00:00:00");
  return today < departure;
}

export function getUpcomingSchedules(
  slug: string,
  fallback: TourScheduleOption,
  limit?: number
) {
  const schedules = TOUR_SCHEDULES[slug] ?? [fallback];
  const upcoming = schedules
    .filter((s) => isRegistrationOpen(s.isoDate) && s.spotsLeft > 0)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate));

  return typeof limit === "number" ? upcoming.slice(0, limit) : upcoming;
}

export function calcDeadline(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() - 1);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
