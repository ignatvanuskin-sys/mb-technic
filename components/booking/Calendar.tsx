"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  MONTHS_NOM_RU,
  WEEKDAYS_SHORT,
  addDays,
  fromIso,
  mondayIndex,
  startOfToday,
  toIso,
} from "@/lib/date";

type CalendarProps = {
  value: string;
  onChange: (iso: string) => void;
  /** How many days ahead booking is open (default 60). */
  horizonDays?: number;
};

/**
 * Single-month calendar, Monday-first. Past days and days beyond the booking horizon
 * are disabled. The service opens 09:00–19:00 every day of the week (2GIS), so every
 * upcoming date is selectable.
 */
export function Calendar({ value, onChange, horizonDays = 60 }: CalendarProps) {
  const today = useMemo(() => startOfToday(), []);
  const maxDate = useMemo(() => addDays(today, horizonDays), [today, horizonDays]);
  const [cursor, setCursor] = useState(() => {
    const base = value ? fromIso(value) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const cells = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const lead = mondayIndex(first);
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const list: (Date | null)[] = Array.from({ length: lead }, () => null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      list.push(new Date(cursor.getFullYear(), cursor.getMonth(), day));
    }
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [cursor]);

  const canGoBack = cursor > new Date(today.getFullYear(), today.getMonth(), 1);
  const canGoForward =
    new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) <=
    new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const shift = (delta: number) =>
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));

  const todayIso = toIso(today);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => shift(-1)}
          disabled={!canGoBack}
          aria-label="Предыдущий месяц"
          className="grid h-9 w-9 place-items-center border border-white/10 text-silver transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ChevronLeft size={16} strokeWidth={1.75} />
        </button>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-chrome">
          {MONTHS_NOM_RU[cursor.getMonth()]} {cursor.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => shift(1)}
          disabled={!canGoForward}
          aria-label="Следующий месяц"
          className="grid h-9 w-9 place-items-center border border-white/10 text-silver transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
        >
          <ChevronRight size={16} strokeWidth={1.75} />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1">
        {WEEKDAYS_SHORT.map((d) => (
          <div
            key={d}
            className="py-1 text-center font-mono text-[0.625rem] tracking-[0.2em] text-white/35"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Выбор даты">
        {cells.map((date, i) => {
          if (!date) return <div key={`empty-${i}`} className="h-11" aria-hidden />;
          const iso = toIso(date);
          const disabled = date < today || date > maxDate;
          const selected = iso === value;
          const isToday = iso === todayIso;
          return (
            <button
              key={iso}
              type="button"
              role="gridcell"
              aria-selected={selected}
              aria-label={iso}
              disabled={disabled}
              onClick={() => onChange(iso)}
              className={[
                "relative h-11 border font-mono text-sm transition-all duration-300",
                selected
                  ? "border-accent bg-accent text-white"
                  : disabled
                    ? "cursor-not-allowed border-transparent text-white/15"
                    : "border-white/[0.07] text-silver hover:border-white/30 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {date.getDate()}
              {isToday && !selected ? (
                <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <QuickPick label="Сегодня" iso={toIso(today)} value={value} onChange={onChange} />
        <QuickPick
          label="Завтра"
          iso={toIso(addDays(today, 1))}
          value={value}
          onChange={onChange}
        />
        <QuickPick
          label="Через 3 дня"
          iso={toIso(addDays(today, 3))}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

function QuickPick({
  label,
  iso,
  value,
  onChange,
}: {
  label: string;
  iso: string;
  value: string;
  onChange: (iso: string) => void;
}) {
  const active = value === iso;
  return (
    <button
      type="button"
      onClick={() => onChange(iso)}
      className={[
        "border px-3 py-1.5 font-mono text-[0.688rem] uppercase tracking-[0.18em] transition-colors",
        active
          ? "border-accent/70 bg-accent/15 text-accent"
          : "border-white/10 text-white/50 hover:border-white/30 hover:text-white",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
