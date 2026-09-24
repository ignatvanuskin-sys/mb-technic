"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock,
  Database,
  Loader2,
  Lock,
  LogOut,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  UserRound,
  Wrench,
  X,
  XCircle,
} from "lucide-react";
import { Mark } from "../Mark";
import { BOOKING_STATUSES, STATUS_LABELS, STATUS_TONE, type Booking, type BookingStatus } from "@/lib/types";
import { formatRuLong, startOfToday, toIso } from "@/lib/date";
import { site, timeSlots } from "@/lib/site";

const DEMO_ROWS = [
  { name: "Асхат Турсынов", phone: "+7 701 234 56 78", vehicleModel: "E-Класс (W211)", vehicleYear: "2008", service: "Двигатель", dayOffset: 0, time: "10:00", comment: "Расход масла, нужна диагностика." },
  { name: "Данияр Смагулов", phone: "+7 702 345 67 89", vehicleModel: "S-Класс (W221)", vehicleYear: "2011", service: "Пневмоподвеска", dayOffset: 1, time: "12:00", comment: "Просела передняя стойка справа." },
  { name: "Елена Ким", phone: "+7 705 456 78 90", vehicleModel: "G-Класс", vehicleYear: "2016", service: "Плановое обслуживание", dayOffset: 2, time: "09:00", comment: "" },
  { name: "Марат Ахметов", phone: "+7 707 567 89 01", vehicleModel: "C-Класс (W205)", vehicleYear: "2019", service: "Тормозная система", dayOffset: 5, time: "15:00", comment: "Вибрация при торможении." },
];

export function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  /* Session gate — the board holds customer names, phones and VINs. */
  const [auth, setAuth] = useState<"checking" | "in" | "out">("checking");
  const [defaultPw, setDefaultPw] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const load = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    try {
      const res = await fetch("/api/bookings", { cache: "no-store" });
      if (res.status === 401) {
        setAuth("out");
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Ошибка загрузки");
      setBookings(data.bookings as Booking[]);
      setError(null);
      setUpdatedAt(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить заявки.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        const data = await res.json();
        if (cancelled) return;
        setDefaultPw(!!data.defaultPasswordInUse);
        if (data.authenticated) {
          setAuth("in");
          void load();
        } else {
          setAuth("out");
        }
      } catch {
        if (!cancelled) setAuth("out");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  /* Keeps the board fresh while it is open. */
  useEffect(() => {
    if (auth !== "in") return;
    const id = window.setInterval(() => void load(false), 45_000);
    return () => window.clearInterval(id);
  }, [auth, load]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setLoginError(data.error ?? "Неверный пароль.");
        setLoggingIn(false);
        return;
      }
      setPassword("");
      setAuth("in");
      await load();
    } catch {
      setLoginError("Не удалось выполнить вход. Попробуйте ещё раз.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setBookings([]);
    setSelectedId(null);
    setAuth("out");
  }

  const todayIso = useMemo(() => toIso(startOfToday()), []);
  const weekEnd = useMemo(() => {
    const d = startOfToday();
    d.setDate(d.getDate() + 7);
    return toIso(d);
  }, []);

  const stats = useMemo(
    () => ({
      newCount: bookings.filter((b) => b.status === "NEW").length,
      today: bookings.filter((b) => b.date === todayIso && b.status !== "CANCELLED").length,
      week: bookings.filter(
        (b) => b.date >= todayIso && b.date <= weekEnd && b.status !== "CANCELLED",
      ).length,
      total: bookings.length,
    }),
    [bookings, todayIso, weekEnd],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => (statusFilter === "ALL" ? true : b.status === statusFilter))
      .filter((b) =>
        !q
          ? true
          : [b.name, b.phone, b.vehicleModel, b.service, b.code]
              .join(" ")
              .toLowerCase()
              .includes(q),
      )
      .sort((a, b) => (a.date + a.time < b.date + b.time ? -1 : 1));
  }, [bookings, statusFilter, query]);

  const selected = useMemo(
    () => bookings.find((b) => b.id === selectedId) ?? null,
    [bookings, selectedId],
  );

  async function setStatus(id: string, status: BookingStatus) {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Не удалось обновить заявку.");
      setBookings((list) => list.map((b) => (b.id === id ? (data.booking as Booking) : b)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка обновления.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Удалить заявку без возможности восстановления?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Не удалось удалить заявку.");
      setBookings((list) => list.filter((b) => b.id !== id));
      setSelectedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка удаления.");
    } finally {
      setBusy(false);
    }
  }

  async function seedDemo() {
    setBusy(true);
    try {
      for (const row of DEMO_ROWS) {
        const d = startOfToday();
        d.setDate(d.getDate() + row.dayOffset);
        await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: row.name,
            phone: row.phone,
            channel: "WhatsApp",
            vehicleModel: row.vehicleModel,
            vehicleYear: row.vehicleYear,
            service: row.service,
            date: toIso(d),
            time: timeSlots.includes(row.time) ? row.time : "10:00",
            comment: row.comment,
            demo: true,
          }),
        });
      }
      await load(false);
    } catch {
      setError("Не удалось создать демо-заявки.");
    } finally {
      setBusy(false);
    }
  }

  async function clearDemo() {
    setBusy(true);
    try {
      await fetch("/api/bookings?demo=1", { method: "DELETE" });
      await load(false);
      setSelectedId(null);
    } catch {
      setError("Не удалось удалить демо-данные.");
    } finally {
      setBusy(false);
    }
  }

  const hasDemo = bookings.some((b) => b.demo);

  /* ── Session gate ────────────────────────────────────────────── */
  if (auth !== "in") {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-ink px-5 py-16">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3">
            <Mark size={24} className="text-chrome" />
            <div className="leading-none">
              <p className="display text-[0.95rem] text-white">MB TECHNIC</p>
              <p className="mt-1 font-mono text-[0.563rem] tracking-[0.24em] text-white/40">
                ПАНЕЛЬ ЗАЯВОК
              </p>
            </div>
          </div>

          {auth === "checking" ? (
            <p className="mt-10 flex items-center gap-3 text-sm text-white/50">
              <Loader2 size={16} className="animate-spin" />
              Проверяем доступ…
            </p>
          ) : (
            <form onSubmit={login} className="mt-10">
              <h1 className="display text-3xl text-white">Вход</h1>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                Раздел содержит персональные данные клиентов, поэтому закрыт паролем.
              </p>

              <label className="mt-8 block">
                <span className="mb-2 block font-mono text-[0.688rem] uppercase tracking-[0.2em] text-white/55">
                  Пароль
                </span>
                <input
                  type="password"
                  className={`field ${loginError ? "field-error" : ""}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError(null);
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  autoFocus
                />
              </label>

              {loginError ? (
                <p className="mt-3 text-xs text-red-300">{loginError}</p>
              ) : null}

              <button
                type="submit"
                disabled={loggingIn || password.length === 0}
                className="btn btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-45"
              >
                {loggingIn ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Проверяем
                  </>
                ) : (
                  <>
                    <Lock size={15} strokeWidth={1.75} />
                    Войти
                  </>
                )}
              </button>

              {defaultPw ? (
                <div className="mt-6 border border-amber-500/30 bg-amber-500/[0.07] p-4 text-xs leading-relaxed text-amber-200/90">
                  <p className="font-mono uppercase tracking-[0.16em]">Демо-режим</p>
                  <p className="mt-2">
                    Пароль по умолчанию:{" "}
                    <span className="font-mono text-amber-100">mb-technic</span>. Перед публикацией
                    задайте переменную окружения{" "}
                    <span className="font-mono text-amber-100">ADMIN_PASSWORD</span>.
                  </p>
                </div>
              ) : null}

              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 font-mono text-[0.688rem] tracking-[0.16em] text-white/45 transition-colors hover:text-white"
              >
                <ArrowLeft size={14} strokeWidth={1.75} />
                НА САЙТ
              </Link>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100svh] bg-ink">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <Mark size={22} className="text-chrome" />
            <div className="leading-none">
              <p className="display text-[0.9rem] text-white">MB TECHNIC</p>
              <p className="mt-1 font-mono text-[0.563rem] tracking-[0.24em] text-white/40">
                ПАНЕЛЬ ЗАЯВОК
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="hidden font-mono text-[0.625rem] tracking-[0.16em] text-white/35 md:inline">
              {updatedAt ? `ОБНОВЛЕНО ${updatedAt}` : "ЗАГРУЗКА…"}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              className="btn btn-ghost !px-3.5 !py-2.5 text-[0.688rem]"
            >
              <RefreshCw size={14} strokeWidth={1.75} className={loading ? "animate-spin" : ""} />
              Обновить
            </button>
            <Link href="/" className="btn btn-ghost !px-3.5 !py-2.5 text-[0.688rem]">
              <ArrowLeft size={14} strokeWidth={1.75} />
              На сайт
            </Link>
            <button
              type="button"
              onClick={() => void logout()}
              className="btn btn-ghost !px-3.5 !py-2.5 text-[0.688rem]"
            >
              <LogOut size={14} strokeWidth={1.75} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 md:py-10">
        {/* ── Stats ─────────────────────────────────────────────── */}
        <div className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Новые заявки" value={stats.newCount} accent />
          <Stat label="Сегодня" value={stats.today} />
          <Stat label="На неделю" value={stats.week} />
          <Stat label="Всего" value={stats.total} />
        </div>

        {error ? (
          <div className="mt-6 flex items-start justify-between gap-4 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} aria-label="Скрыть">
              <X size={15} />
            </button>
          </div>
        ) : null}

        {defaultPw ? (
          <div className="mt-6 border border-amber-500/30 bg-amber-500/[0.07] p-4 text-sm leading-relaxed text-amber-200/90">
            <span className="font-mono text-[0.625rem] tracking-[0.16em]">ДЕМО-РЕЖИМ · </span>
            используется пароль по умолчанию. Перед публикацией задайте{" "}
            <span className="font-mono">ADMIN_PASSWORD</span> в переменных окружения — доступ к
            данным клиентов больше ничем не ограничен.
          </div>
        ) : null}

        {hasDemo ? (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-amber-500/30 bg-amber-500/[0.07] p-4">
            <p className="text-sm text-amber-200/90">
              В списке есть демонстрационные записи — они помечены значком{" "}
              <span className="font-mono text-[0.625rem] tracking-[0.16em]">ДЕМО</span>.
            </p>
            <button
              type="button"
              onClick={() => void clearDemo()}
              disabled={busy}
              className="btn btn-ghost !px-3.5 !py-2.5 text-[0.688rem]"
            >
              <Trash2 size={14} strokeWidth={1.75} />
              Удалить демо-данные
            </button>
          </div>
        ) : null}

        {/* ── Filters ───────────────────────────────────────────── */}
        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
            <FilterChip
              label="Все"
              count={bookings.length}
              active={statusFilter === "ALL"}
              onClick={() => setStatusFilter("ALL")}
            />
            {BOOKING_STATUSES.map((s) => (
              <FilterChip
                key={s}
                label={STATUS_LABELS[s]}
                count={bookings.filter((b) => b.status === s).length}
                active={statusFilter === s}
                onClick={() => setStatusFilter(s)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="relative flex-1 lg:w-72">
              <Search
                size={15}
                strokeWidth={1.75}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
              />
              <input
                className="field !py-3 pl-10 text-sm"
                placeholder="Поиск: имя, телефон, модель"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={() => void seedDemo()}
              disabled={busy}
              className="btn btn-ghost shrink-0 !px-3.5 !py-3 text-[0.688rem]"
              title="Добавить демонстрационные заявки"
            >
              <Database size={14} strokeWidth={1.75} />
              <span className="hidden sm:inline">Демо-данные</span>
            </button>
          </div>
        </div>

        {/* ── Table (desktop) ───────────────────────────────────── */}
        <div className="mt-6 hidden overflow-hidden border border-white/10 lg:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02]">
                {["Клиент", "Mercedes", "Услуга", "Дата", "Время", "Статус", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-4 font-mono text-[0.625rem] font-normal uppercase tracking-[0.2em] text-white/40"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((b) => (
                <tr
                  key={b.id}
                  className="cursor-pointer border-b border-white/[0.06] transition-colors hover:bg-white/[0.03]"
                  onClick={() => setSelectedId(b.id)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">{b.name}</span>
                      {b.demo ? <DemoChip /> : null}
                    </div>
                    <span className="font-mono text-[0.688rem] text-white/45">{b.phone}</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-silver">
                    {b.vehicleModel}, {b.vehicleYear}
                  </td>
                  <td className="px-5 py-4 text-sm text-silver">{b.service}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-[0.75rem] text-silver">
                    {formatRuLong(b.date)}
                  </td>
                  <td className="px-5 py-4 font-mono text-[0.75rem] text-white">{b.time}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={b.status} />
                  </td>
                  <td className="px-5 py-4 text-right font-mono text-[0.625rem] tracking-[0.16em] text-white/35">
                    {b.code}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Cards (mobile) ────────────────────────────────────── */}
        <ul className="mt-6 space-y-3 lg:hidden">
          {visible.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => setSelectedId(b.id)}
                className="w-full border border-white/10 bg-white/[0.02] p-5 text-left transition-colors hover:border-white/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base text-white">{b.name}</span>
                      {b.demo ? <DemoChip /> : null}
                    </div>
                    <a
                      href={`tel:${b.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 block font-mono text-[0.688rem] text-accent"
                    >
                      {b.phone}
                    </a>
                  </div>
                  <StatusPill status={b.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.08] pt-4 text-xs">
                  <Cell label="Mercedes" value={`${b.vehicleModel}, ${b.vehicleYear}`} />
                  <Cell label="Услуга" value={b.service} />
                  <Cell label="Дата" value={formatRuLong(b.date)} />
                  <Cell label="Время" value={b.time} />
                </div>
              </button>
            </li>
          ))}
        </ul>

        {loading && bookings.length === 0 ? (
          <div className="mt-10 flex items-center gap-3 text-sm text-white/50">
            <Loader2 size={16} className="animate-spin" />
            Загружаем заявки…
          </div>
        ) : null}

        {!loading && visible.length === 0 ? (
          <div className="mt-10 border border-white/10 bg-white/[0.02] p-10 text-center">
            <p className="text-lg text-white">Заявок пока нет</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/50">
              Заявки с сайта появятся здесь сразу после отправки формы. Чтобы посмотреть, как
              выглядит заполненная панель, добавьте демонстрационные записи.
            </p>
            <button
              type="button"
              onClick={() => void seedDemo()}
              disabled={busy}
              className="btn btn-primary mt-6 !px-5 !py-3 text-[0.75rem]"
            >
              <Database size={15} strokeWidth={1.75} />
              Добавить демо-заявки
            </button>
          </div>
        ) : null}
      </div>

      {/* ── Detail panel ────────────────────────────────────────── */}
      {selected ? (
        <div
          className="fixed inset-0 z-[110] flex justify-end bg-ink/70 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          <aside className="flex h-full w-full max-w-lg flex-col border-l border-white/10 bg-graphite">
            <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <p className="font-mono text-[0.625rem] tracking-[0.2em] text-accent">
                  {selected.code}
                </p>
                <h2 className="mt-2 text-xl text-white">{selected.name}</h2>
                <p className="mt-1 font-mono text-[0.75rem] text-white/50">{selected.phone}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Закрыть"
                className="grid h-10 w-10 shrink-0 place-items-center border border-white/12 text-silver transition-colors hover:border-white/35 hover:text-white"
              >
                <X size={17} strokeWidth={1.75} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={selected.status} />
                {selected.demo ? <DemoChip /> : null}
              </div>

              <dl className="mt-7 space-y-5">
                <DetailRow icon={<UserRound size={15} strokeWidth={1.6} />} label="Клиент">
                  {selected.name} · {selected.phone}
                  <span className="mt-1 block text-xs text-white/45">
                    Предпочтительный канал: {selected.channel}
                    {selected.telegram ? ` · @${selected.telegram}` : ""}
                  </span>
                </DetailRow>

                <DetailRow icon={<Wrench size={15} strokeWidth={1.6} />} label="Mercedes-Benz">
                  {selected.vehicleModel}, {selected.vehicleYear}
                  {selected.vin ? (
                    <span className="mt-1 block font-mono text-xs text-white/45">
                      VIN {selected.vin}
                    </span>
                  ) : null}
                </DetailRow>

                <DetailRow icon={<Wrench size={15} strokeWidth={1.6} />} label="Услуга">
                  {selected.service}
                </DetailRow>

                <DetailRow icon={<Clock size={15} strokeWidth={1.6} />} label="Визит">
                  {formatRuLong(selected.date)} · {selected.time}
                </DetailRow>

                <DetailRow icon={<Phone size={15} strokeWidth={1.6} />} label="Комментарий">
                  {selected.comment || "—"}
                  <span className="mt-2 block font-mono text-[0.625rem] tracking-[0.16em] text-white/30">
                    СОЗДАНА {new Date(selected.createdAt).toLocaleString("ru-RU")}
                  </span>
                </DetailRow>
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${selected.phone}`} className="btn btn-ghost !px-4 !py-3 text-[0.688rem]">
                  <Phone size={14} strokeWidth={1.75} />
                  Позвонить
                </a>
                <a
                  href={`https://wa.me/${selected.phone.replace(/[^\d]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost !px-4 !py-3 text-[0.688rem]"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <footer className="border-t border-white/10 p-5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={busy || selected.status === "CONFIRMED"}
                  onClick={() => void setStatus(selected.id, "CONFIRMED")}
                  className="btn btn-primary !px-3 !py-3 text-[0.688rem] disabled:opacity-40"
                >
                  <Check size={14} strokeWidth={2} />
                  Подтвердить
                </button>
                <button
                  type="button"
                  disabled={busy || selected.status === "IN_PROGRESS"}
                  onClick={() => void setStatus(selected.id, "IN_PROGRESS")}
                  className="btn btn-ghost !px-3 !py-3 text-[0.688rem] disabled:opacity-40"
                >
                  <Wrench size={14} strokeWidth={1.75} />
                  В работу
                </button>
                <button
                  type="button"
                  disabled={busy || selected.status === "COMPLETED"}
                  onClick={() => void setStatus(selected.id, "COMPLETED")}
                  className="btn btn-ghost !px-3 !py-3 text-[0.688rem] disabled:opacity-40"
                >
                  <Check size={14} strokeWidth={2} />
                  Завершить
                </button>
                <button
                  type="button"
                  disabled={busy || selected.status === "CANCELLED"}
                  onClick={() => void setStatus(selected.id, "CANCELLED")}
                  className="btn btn-ghost !px-3 !py-3 text-[0.688rem] disabled:opacity-40"
                >
                  <XCircle size={14} strokeWidth={1.75} />
                  Отменить
                </button>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => void remove(selected.id)}
                className="mt-3 flex w-full items-center justify-center gap-2 border border-red-500/30 py-3 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-red-300/80 transition-colors hover:border-red-500/60 hover:text-red-200"
              >
                <Trash2 size={13} strokeWidth={1.75} />
                Удалить заявку
              </button>
            </footer>
          </aside>
        </div>
      ) : null}

      <p className="mx-auto max-w-[1500px] px-5 pb-10 text-xs leading-relaxed text-white/25 md:px-8">
        Панель заявок {site.brand}. Доступ защищён паролем из переменной окружения{" "}
        <span className="font-mono">ADMIN_PASSWORD</span>; сессия хранится в httpOnly-cookie 12
        часов. Заявки записываются в <span className="font-mono">data/bookings.json</span> на
        сервере приложения — для нескольких операторов замените хранилище на базу данных.
      </p>
    </div>
  );
}

/* ─────────────────────────── atoms ─────────────────────────── */

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="bg-ink p-6">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p
        className={[
          "display mt-3 text-5xl leading-none",
          accent && value > 0 ? "text-accent" : "text-white",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "shrink-0 border px-4 py-2.5 font-mono text-[0.625rem] uppercase tracking-[0.16em] transition-colors",
        active
          ? "border-accent bg-accent/12 text-accent"
          : "border-white/10 text-white/45 hover:border-white/30 hover:text-white",
      ].join(" ")}
    >
      {label} · {count}
    </button>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-block border px-2.5 py-1 font-mono text-[0.563rem] uppercase tracking-[0.16em] ${STATUS_TONE[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function DemoChip() {
  return (
    <span className="border border-amber-500/40 px-1.5 py-0.5 font-mono text-[0.5rem] tracking-[0.16em] text-amber-300/90">
      ДЕМО
    </span>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[0.563rem] uppercase tracking-[0.16em] text-white/35">{label}</p>
      <p className="mt-1 text-silver">{value}</p>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border-b border-white/[0.08] pb-5">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div className="min-w-0 flex-1">
        <dt className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-white/40">
          {label}
        </dt>
        <dd className="mt-2 text-sm leading-relaxed text-silver">{children}</dd>
      </div>
    </div>
  );
}
