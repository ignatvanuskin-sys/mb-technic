"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Check, Loader2, MessageCircle, Phone, X } from "lucide-react";
import { useBooking } from "./BookingProvider";
import { Calendar } from "./Calendar";
import { serviceOptions, mercedesModels, timeSlots, site } from "@/lib/site";
import { formatRuLong, startOfToday } from "@/lib/date";
import { digitsOf, normalisePhone } from "@/lib/validation";
import type { Booking } from "@/lib/types";

const STEPS = [
  { no: "01", label: "Услуга", title: "Что нужно сделать?" },
  { no: "02", label: "Автомобиль", title: "Ваш Mercedes" },
  { no: "03", label: "Дата", title: "Выберите дату" },
  { no: "04", label: "Время", title: "Выберите время" },
  { no: "05", label: "Контакты", title: "Контакты" },
];

type FormState = {
  service: string;
  vehicleModel: string;
  vehicleYear: string;
  vin: string;
  comment: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  channel: "Телефон" | "WhatsApp" | "Telegram";
  telegram: string;
};

const emptyForm: FormState = {
  service: "",
  vehicleModel: "",
  vehicleYear: "",
  vin: "",
  comment: "",
  date: "",
  time: "",
  name: "",
  phone: "",
  channel: "Телефон",
  telegram: "",
};

/** +7 700 706 22 20 while typing */
function formatPhone(raw: string): string {
  const d = digitsOf(raw).slice(0, 11);
  if (!d) return "";
  const rest = d.startsWith("7") ? d.slice(1) : d.slice(1);
  const p = rest.slice(0, 10);
  let out = "+7";
  if (p.length > 0) out += ` ${p.slice(0, 3)}`;
  if (p.length > 3) out += ` ${p.slice(3, 6)}`;
  if (p.length > 6) out += ` ${p.slice(6, 8)}`;
  if (p.length > 8) out += ` ${p.slice(8, 10)}`;
  return out;
}

export function BookingModal() {
  const { isOpen, presetService, closeBooking } = useBooking();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState<Booking | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  /* Height of the *visual* viewport on phones. Shrinks when the on-screen keyboard
     appears, which keeps the step buttons on screen instead of behind the keyboard. */
  const [vpHeight, setVpHeight] = useState<number | null>(null);

  /* Fresh session every time the modal opens. */
  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setForm({ ...emptyForm, service: presetService ?? "", date: "" });
    setErrors({});
    setServerError(null);
    setDone(null);
    setSubmitting(false);
  }, [isOpen, presetService]);

  /* Esc to close + keep focus inside the dialog. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBooking();
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        );
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeBooking]);

  /* A failed submission must be impossible to miss: bring the error (and its
     WhatsApp fallback) into view instead of leaving it below the fold. */
  useEffect(() => {
    if (!serverError) return;
    errorRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [serverError]);

  /* Track the visual viewport so the modal fits above the on-screen keyboard. */
  useEffect(() => {
    if (!isOpen) {
      setVpHeight(null);
      return;
    }
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      /* Desktop widths never show an on-screen keyboard — leave the CSS in charge. */
      if (window.innerWidth >= 768) {
        setVpHeight(null);
        return;
      }
      const h = Math.round(vv.height);
      setVpHeight(h > 0 && h < window.innerHeight - 60 ? h : null);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [isOpen]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => (e[key as string] ? { ...e, [key as string]: "" } : e));
  };

  const today = useMemo(() => startOfToday(), []);

  /* Per-step validation — mirrors the server rules in lib/validation.ts */
  function validateStep(index: number): Record<string, string> {
    const e: Record<string, string> = {};
    if (index === 0 && form.service.length < 3) e.service = "Выберите услугу.";
    if (index === 1) {
      if (form.vehicleModel.trim().length < 2) e.vehicleModel = "Укажите модель автомобиля.";
      const year = Number(form.vehicleYear);
      if (!form.vehicleYear || Number.isNaN(year) || year < 1970 || year > 2026)
        e.vehicleYear = "Укажите год выпуска (1970–2026).";
      const vin = form.vin.trim();
      if (vin && !/^[A-HJ-NPR-Z0-9]{11,17}$/i.test(vin))
        e.vin = "VIN — 11–17 символов без букв I, O, Q.";
    }
    if (index === 2) {
      if (!form.date) e.date = "Выберите дату визита.";
      else if (new Date(`${form.date}T00:00:00`) < today) e.date = "Дата уже прошла.";
    }
    if (index === 3 && !form.time) e.time = "Выберите время.";
    if (index === 4) {
      if (form.name.trim().length < 2) e.name = "Укажите имя.";
      if (!normalisePhone(form.phone)) e.phone = "Укажите номер в формате +7 XXX XXX XX XX.";
      if (form.channel === "Telegram") {
        const t = form.telegram.trim().replace(/^@/, "");
        if (t.length < 3) e.telegram = "Укажите username в Telegram.";
        else if (!/^[A-Za-z0-9_]{3,32}$/.test(t)) e.telegram = "Латиница, цифры и «_».";
      }
    }
    return e;
  }

  function goNext() {
    const e = validateStep(step);
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    requestAnimationFrame(() => contentRef.current?.focus());
  }

  function goBack() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
    requestAnimationFrame(() => contentRef.current?.focus());
  }

  async function submit() {
    const e = validateStep(4);
    /* Never submit a payload that would fail server-side validation. */
    const allErrors = { ...validateStep(1), ...validateStep(2), ...validateStep(3), ...e };
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      if (allErrors.vehicleModel || allErrors.vehicleYear || allErrors.vin) setStep(1);
      else if (allErrors.date) setStep(2);
      else if (allErrors.time) setStep(3);
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          channel: form.channel,
          telegram: form.telegram,
          vehicleModel: form.vehicleModel,
          vehicleYear: form.vehicleYear,
          vin: form.vin,
          service: form.service,
          date: form.date,
          time: form.time,
          comment: [form.comment, form.vehicleModel].filter(Boolean).join(" · "),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setErrors(data.fields ?? {});
        setServerError(data.error ?? "Не удалось сохранить заявку. Попробуйте ещё раз.");
        setSubmitting(false);
        return;
      }
      setDone(data.booking as Booking);
      setSubmitting(false);
    } catch {
      setServerError(
        "Нет связи с сервером. Позвоните нам — или попробуйте отправить заявку ещё раз.",
      );
      setSubmitting(false);
    }
  }

  if (!isOpen) return null;

  const summaryRows: [string, string][] = [
    ["Услуга", form.service],
    ["Автомобиль", [form.vehicleModel, form.vehicleYear].filter(Boolean).join(", ")],
    ["Дата", form.date ? formatRuLong(form.date) : ""],
    ["Время", form.time],
  ];

  return (
    <div
      className="fixed inset-0 z-[120] h-[100dvh] overflow-hidden overscroll-contain bg-ink/88 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeBooking();
      }}
    >
      <div className="flex h-full items-stretch justify-center p-0 md:items-center md:p-6">
        <div
          ref={panelRef}
          /* On phones the panel fills the visible viewport and only the step body
             scrolls, so the step buttons (incl. «Отправить заявку») never fall below
             the fold. `vpHeight` pins it to the visual viewport while a keyboard is up. */
          style={vpHeight ? { height: `${vpHeight}px`, maxHeight: `${vpHeight}px` } : undefined}
          className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden bg-graphite md:h-auto md:max-h-[min(92dvh,940px)] md:rounded-sm md:border md:border-white/10 lg:grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]"
        >
          <button
            type="button"
            onClick={closeBooking}
            aria-label="Закрыть"
            className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center border border-white/10 bg-ink/70 text-silver backdrop-blur transition-colors hover:border-white/30 hover:text-white"
          >
            <X size={17} strokeWidth={1.75} />
          </button>

          {/* ── Side panel: progress + live summary ─────────────────── */}
          <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-ink p-8 lg:flex">
            <Image
              src="/media/opt/exterior-02.jpg"
              alt=""
              width={700}
              height={488}
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full object-cover opacity-[0.16]"
            />
            <div className="relative">
              <p className="label-bright label">MB TECHNIC</p>
              <p className="mt-2 font-mono text-[0.688rem] tracking-[0.2em] text-white/40">
                ОНЛАЙН-ЗАПИСЬ · {site.hoursShort}
              </p>

              <ol className="mt-10 space-y-1">
                {STEPS.map((s, i) => {
                  const state = done ? "done" : i < step ? "past" : i === step ? "current" : "future";
                  return (
                    <li key={s.no}>
                      <button
                        type="button"
                        disabled={i >= step || !!done}
                        onClick={() => {
                          if (i < step) setStep(i);
                        }}
                        className={[
                          "flex w-full items-center gap-4 border-l-2 py-3 pl-4 text-left transition-all duration-300",
                          state === "current"
                            ? "border-accent bg-white/[0.04]"
                            : state === "past"
                              ? "border-white/25 hover:bg-white/[0.03]"
                              : "border-white/8",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "font-mono text-[0.688rem] tracking-[0.2em]",
                            state === "current"
                              ? "text-accent"
                              : state === "past"
                                ? "text-white/55"
                                : "text-white/25",
                          ].join(" ")}
                        >
                          {state === "past" ? "✓" : s.no}
                        </span>
                        <span
                          className={[
                            "text-sm tracking-[0.06em] uppercase transition-colors",
                            state === "current"
                              ? "text-white"
                              : state === "past"
                                ? "text-white/55"
                                : "text-white/30",
                          ].join(" ")}
                        >
                          {s.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="relative mt-12">
              <p className="label mb-3">Ваша заявка</p>
              <dl className="space-y-2">
                {summaryRows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-white/[0.07] pb-2">
                    <dt className="font-mono text-[0.688rem] uppercase tracking-[0.18em] text-white/35">
                      {k}
                    </dt>
                    <dd className="text-right text-sm text-silver">{v || "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          {/* ── Step content ────────────────────────────────────────── */}
          <div className="flex min-h-0 flex-1 flex-col">
            {/* mobile progress */}
            <div className="shrink-0 border-b border-white/10 px-5 pb-4 pt-6 lg:hidden">
              <p className="label">MB TECHNIC · ОНЛАЙН-ЗАПИСЬ</p>
              <div className="mt-3 flex items-center gap-2">
                {STEPS.map((s, i) => (
                  <div key={s.no} className="flex flex-1 flex-col gap-2">
                    <span
                      className={[
                        "h-[3px] w-full transition-colors duration-500",
                        done || i <= step ? "bg-accent" : "bg-white/12",
                      ].join(" ")}
                    />
                  </div>
                ))}
              </div>
              <p className="mt-3 font-mono text-[0.688rem] tracking-[0.22em] text-white/45">
                ШАГ {Math.min(step + 1, 5)} / 5 · {STEPS[Math.min(step, 4)].label.toUpperCase()}
              </p>
            </div>

            <div
              ref={contentRef}
              tabIndex={-1}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-7 outline-none md:px-10 md:py-10"
            >
              {done ? (
                <SuccessPanel booking={done} onClose={closeBooking} />
              ) : (
                <>
                  <p className="label mb-3">Шаг {STEPS[step].no}</p>
                  <h2
                    id="booking-title"
                    className="display text-[clamp(1.6rem,4.4vw,2.6rem)] text-white"
                  >
                    {STEPS[step].title}
                  </h2>

                  <div key={step} className="mt-8 animate-slide-up">
                    {step === 0 ? (
                      <StepService
                        value={form.service}
                        error={errors.service}
                        onChange={(v) => set("service", v)}
                      />
                    ) : null}

                    {step === 1 ? (
                      <StepVehicle
                        form={form}
                        errors={errors}
                        set={set}
                      />
                    ) : null}

                    {step === 2 ? (
                      <div>
                        <Calendar value={form.date} onChange={(iso) => set("date", iso)} />
                        {errors.date ? <ErrorText>{errors.date}</ErrorText> : null}
                        <p className="mt-5 text-xs leading-relaxed text-white/40">
                          Сервис работает ежедневно с 09:00 до 19:00. Время визита подтвердим
                          после проверки загрузки постов.
                        </p>
                      </div>
                    ) : null}

                    {step === 3 ? (
                      <StepTime
                        value={form.time}
                        date={form.date}
                        error={errors.time}
                        onChange={(v) => set("time", v)}
                      />
                    ) : null}

                    {step === 4 ? (
                      <StepContacts form={form} errors={errors} set={set} />
                    ) : null}
                  </div>

                  {serverError ? (
                    <div
                      ref={errorRef}
                      role="alert"
                      aria-live="assertive"
                      className="mt-6 border border-red-500/40 bg-red-500/10 p-4"
                    >
                      <p className="text-sm text-red-200">{serverError}</p>
                      {/* The lead must still reach the workshop: hand it to WhatsApp
                          pre-filled, so one tap completes the request. */}
                      <a
                        href={`https://wa.me/${site.primaryPhone.whatsapp}?text=${encodeURIComponent(
                          [
                            "Заявка с сайта MB TECHNIC",
                            `Услуга: ${form.service}`,
                            `Авто: ${form.vehicleModel}, ${form.vehicleYear}`,
                            form.date ? `Дата: ${formatRuLong(form.date)}` : "",
                            form.time ? `Время: ${form.time}` : "",
                            form.name ? `Имя: ${form.name}` : "",
                            form.phone ? `Телефон: ${form.phone}` : "",
                            form.comment ? `Комментарий: ${form.comment}` : "",
                          ]
                            .filter(Boolean)
                            .join("\n"),
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-accent mt-4 w-full"
                      >
                        <MessageCircle size={16} strokeWidth={1.75} />
                        Отправить заявку в WhatsApp
                      </a>
                    </div>
                  ) : null}
                </>
              )}
            </div>

            {/* ── Footer nav ─────────────────────────────────────────── */}
            {!done ? (
              <div
                className="shrink-0 border-t border-white/10 bg-graphite/95 px-5 py-4 backdrop-blur md:px-10"
                style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={step === 0 ? closeBooking : goBack}
                    className="btn btn-ghost !px-4 !py-3 text-[0.75rem]"
                  >
                    <ArrowLeft size={15} strokeWidth={1.75} />
                    {step === 0 ? "Закрыть" : "Назад"}
                  </button>

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="btn btn-primary !px-5 !py-3 text-[0.75rem]"
                    >
                      Далее
                      <ArrowRight size={15} strokeWidth={1.75} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submit}
                      disabled={submitting}
                      className="btn btn-primary !px-5 !py-3 text-[0.75rem] disabled:cursor-wait disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Отправляем
                        </>
                      ) : (
                        <>
                          Отправить заявку
                          <ArrowRight size={15} strokeWidth={1.75} />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── steps ─────────────────────────── */

function StepService({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {serviceOptions.map((s) => {
          const active = value === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onChange(s)}
              className={[
                "group flex items-center justify-between border px-4 py-4 text-left text-sm transition-all duration-300",
                active
                  ? "border-accent bg-accent/12 text-white"
                  : "border-white/10 text-silver hover:border-white/30 hover:bg-white/[0.04] hover:text-white",
              ].join(" ")}
            >
              <span>{s}</span>
              <span
                className={[
                  "grid h-5 w-5 shrink-0 place-items-center border transition-colors",
                  active ? "border-accent bg-accent text-white" : "border-white/20",
                ].join(" ")}
              >
                {active ? <Check size={12} strokeWidth={3} /> : null}
              </span>
            </button>
          );
        })}
      </div>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </div>
  );
}

function StepVehicle({
  form,
  errors,
  set,
}: {
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  const years = Array.from({ length: 2027 - 1990 }, (_, i) => String(2026 - i));
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Марка" hint="Сервис специализируется на Mercedes-Benz">
          <input className="field" value="Mercedes-Benz" readOnly aria-readonly="true" />
        </Field>
        <Field label="Модель" required error={errors.vehicleModel}>
          <input
            className={`field ${errors.vehicleModel ? "field-error" : ""}`}
            list="mb-models"
            placeholder="E-Класс (W211)"
            value={form.vehicleModel}
            onChange={(e) => set("vehicleModel", e.target.value)}
            autoComplete="off"
          />
          <datalist id="mb-models">
            {mercedesModels.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Год выпуска" required error={errors.vehicleYear}>
          <select
            className={`field ${errors.vehicleYear ? "field-error" : ""}`}
            value={form.vehicleYear}
            onChange={(e) => set("vehicleYear", e.target.value)}
          >
            <option value="">Выберите год</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </Field>
        <Field label="VIN" hint="необязательно" error={errors.vin}>
          <input
            className={`field font-mono uppercase ${errors.vin ? "field-error" : ""}`}
            placeholder="WDB2110611A000000"
            value={form.vin}
            maxLength={17}
            onChange={(e) => set("vin", e.target.value.toUpperCase())}
            autoComplete="off"
            spellCheck={false}
          />
        </Field>
      </div>

      <Field label="Комментарий" hint="что беспокоит, когда появилось">
        <textarea
          className="field min-h-[110px] resize-y"
          placeholder="Например: стук в передней подвеске на неровностях"
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
          maxLength={1200}
        />
      </Field>
    </div>
  );
}

function StepTime({
  value,
  date,
  error,
  onChange,
}: {
  value: string;
  date: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-5 text-sm text-white/50">
        {date ? `Свободные слоты на ${formatRuLong(date)}` : "Сначала выберите дату"}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {timeSlots.map((t) => {
          const active = value === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={[
                "border py-4 font-mono text-base transition-all duration-300",
                active
                  ? "border-accent bg-accent text-white"
                  : "border-white/10 text-silver hover:border-white/35 hover:bg-white/[0.05] hover:text-white",
              ].join(" ")}
            >
              {t}
            </button>
          );
        })}
      </div>
      {error ? <ErrorText>{error}</ErrorText> : null}
      <p className="mt-5 text-xs leading-relaxed text-white/40">
        Точное время подтвердим по телефону после проверки загрузки постов. Часы работы сервиса —
        ежедневно 09:00–19:00.
      </p>
    </div>
  );
}

function StepContacts({
  form,
  errors,
  set,
}: {
  form: FormState;
  errors: Record<string, string>;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Имя" required error={errors.name}>
          <input
            className={`field ${errors.name ? "field-error" : ""}`}
            placeholder="Ваше имя"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            autoComplete="name"
          />
        </Field>
        <Field label="Телефон" required error={errors.phone}>
          <input
            className={`field font-mono ${errors.phone ? "field-error" : ""}`}
            placeholder="+7 700 000 00 00"
            inputMode="tel"
            value={form.phone}
            onChange={(e) => set("phone", formatPhone(e.target.value))}
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field label="Предпочтительный способ связи" required>
        <div className="grid grid-cols-3 gap-2">
          {(["Телефон", "WhatsApp", "Telegram"] as const).map((c) => {
            const active = form.channel === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => set("channel", c)}
                aria-pressed={active}
                className={[
                  "border py-3.5 text-xs uppercase tracking-[0.12em] transition-all duration-300",
                  active
                    ? "border-accent bg-accent/12 text-white"
                    : "border-white/10 text-silver hover:border-white/30 hover:text-white",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </div>
      </Field>

      {form.channel === "Telegram" ? (
        <Field label="Telegram username" required error={errors.telegram}>
          <input
            className={`field ${errors.telegram ? "field-error" : ""}`}
            placeholder="@username"
            value={form.telegram}
            onChange={(e) => set("telegram", e.target.value)}
            autoComplete="off"
          />
        </Field>
      ) : null}

      <Field label="Комментарий" hint="необязательно">
        <textarea
          className="field min-h-[90px] resize-y"
          placeholder="Удобное время звонка, дополнительные детали"
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
          maxLength={1200}
        />
      </Field>

      <p className="text-xs leading-relaxed text-white/40">
        Отправляя заявку, вы соглашаетесь на обработку персональных данных для подтверждения
        записи. Мы не передаём данные третьим лицам.
      </p>
    </div>
  );
}

function SuccessPanel({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const rows: [string, string][] = [
    ["Ваш Mercedes", `${booking.vehicleModel}, ${booking.vehicleYear}`],
    ["Услуга", booking.service],
    ["Дата", formatRuLong(booking.date)],
    ["Время", booking.time],
  ];
  return (
    <div className="animate-slide-up">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/50 bg-accent/12">
        <Check className="text-accent" size={24} strokeWidth={2.25} />
      </span>
      <p className="label mt-6">Заявка № {booking.code}</p>
      <h2 id="booking-title" className="display mt-3 text-[clamp(1.8rem,5vw,3rem)] text-white">
        Заявка принята
      </h2>
      <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-silver">
        Спасибо, {booking.name}. Мы свяжемся с вами по каналу «{booking.channel}» для подтверждения
        записи.
      </p>

      <dl className="mt-9 divide-y divide-white/[0.08] border-y border-white/[0.08]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-6 py-4">
            <dt className="font-mono text-[0.688rem] uppercase tracking-[0.2em] text-white/40">
              {k}
            </dt>
            <dd className="text-right text-base text-white">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 text-sm leading-relaxed text-white/45">
        Часы работы сервиса — ежедневно с 09:00 до 19:00. Если вопрос срочный, позвоните нам
        напрямую.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <a href={`tel:${site.primaryPhone.tel}`} className="btn btn-primary !px-5 !py-3 text-[0.75rem]">
          <Phone size={15} strokeWidth={1.75} />
          Позвонить
        </a>
        <a
          href={`https://wa.me/${site.primaryPhone.whatsapp}?text=${encodeURIComponent(
            `Здравствуйте! Заявка № ${booking.code} на ${booking.service}, ${booking.vehicleModel}.`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost !px-5 !py-3 text-[0.75rem]"
        >
          <MessageCircle size={15} strokeWidth={1.75} />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost !px-5 !py-3 text-[0.75rem]"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── atoms ─────────────────────────── */

function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between gap-3">
        <span className="font-mono text-[0.688rem] uppercase tracking-[0.2em] text-white/55">
          {label}
          {required ? <span className="ml-1 text-accent">*</span> : null}
        </span>
        {hint ? <span className="text-[0.688rem] text-white/30">{hint}</span> : null}
      </span>
      {children}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs text-red-300">{children}</p>;
}
