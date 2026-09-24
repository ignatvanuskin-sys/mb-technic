/** Date helpers that stay in local time — avoids UTC off-by-one on date-only values. */

export const MONTHS_RU = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export const MONTHS_NOM_RU = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

/** Пн … Вс */
export const WEEKDAYS_SHORT = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

export function toIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

/** «23 сентября 2026» */
export function formatRuLong(iso: string): string {
  const d = fromIso(iso);
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}`;
}

/** «Ср, 23 сентября» — compact, used inside the summary */
export function formatRuMedium(iso: string): string {
  const d = fromIso(iso);
  const wd = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][d.getDay()];
  return `${wd}, ${d.getDate()} ${MONTHS_RU[d.getMonth()]}`;
}

export function isWeekend(iso: string): boolean {
  const day = fromIso(iso).getDay();
  return day === 0 || day === 6;
}

/** Monday-first index (0 = Monday … 6 = Sunday) */
export function mondayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}
