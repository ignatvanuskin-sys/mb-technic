import { CONTACT_CHANNELS, type BookingInput, type ContactChannel } from "./types";
import { timeSlots } from "./site";

export interface ValidationResult {
  ok: boolean;
  errors: Record<string, string>;
  value?: BookingInput;
}

const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Kazakhstani numbers: +7XXXXXXXXXX (10 digits after the country code, mobile starts with 7). */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length === 11 && digits.startsWith("8")) return "+7" + digits.slice(1);
  if (digits.length === 11 && digits.startsWith("7")) return "+" + digits;
  if (digits.length === 10) return "+7" + digits;
  return "";
}

export function digitsOf(raw: string): string {
  return raw.replace(/[^\d]/g, "");
}

/**
 * Validates a YYYY-MM-DD calendar date WITHOUT timezone conversion.
 * (Comparing against `toISOString()` would reject every valid date in timezones
 * east of UTC — e.g. Asia/Almaty and Asia/Yekaterinburg.)
 */
export function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
  );
}

/** Validates a booking payload coming from the client (used by the API and by the form). */
export function validateBooking(raw: unknown): ValidationResult {
  const errors: Record<string, string> = {};
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, errors: { form: "Некорректные данные заявки." } };
  }
  const body = raw as Record<string, unknown>;

  const name = trim(body.name);
  if (name.length < 2) errors.name = "Укажите имя — минимум 2 символа.";
  if (name.length > 80) errors.name = "Имя слишком длинное.";

  const phoneRaw = trim(body.phone);
  const phone = normalisePhone(phoneRaw);
  if (!phone) errors.phone = "Укажите номер в формате +7 XXX XXX XX XX.";

  const channelRaw = trim(body.channel);
  const channel = (CONTACT_CHANNELS as readonly string[]).includes(channelRaw)
    ? (channelRaw as ContactChannel)
    : "Телефон";

  const telegram = trim(body.telegram);
  if (channel === "Telegram") {
    if (telegram.length < 3) errors.telegram = "Укажите username в Telegram.";
    else if (!/^@?[A-Za-z0-9_]{3,32}$/.test(telegram))
      errors.telegram = "Username: латиница, цифры и «_», от 3 символов.";
  }

  const vehicleModel = trim(body.vehicleModel);
  if (vehicleModel.length < 2) errors.vehicleModel = "Укажите модель автомобиля.";

  const vehicleYear = trim(body.vehicleYear);
  const yearNum = Number(vehicleYear);
  if (!vehicleYear || Number.isNaN(yearNum) || yearNum < 1970 || yearNum > 2026)
    errors.vehicleYear = "Укажите год выпуска (1970–2026).";

  const vin = trim(body.vin);
  if (vin) {
    if (!/^[A-HJ-NPR-Z0-9]{11,17}$/i.test(vin))
      errors.vin = "VIN — 11–17 символов без букв I, O, Q (или оставьте пустым).";
  }

  const service = trim(body.service);
  if (service.length < 3) errors.service = "Выберите услугу.";

  const date = trim(body.date);
  if (!isIsoDate(date)) errors.date = "Выберите дату визита.";
  else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(`${date}T00:00:00`);
    if (picked < today) errors.date = "Дата уже прошла — выберите другую.";
  }

  const time = trim(body.time);
  if (!time) errors.time = "Выберите время.";
  else if (!timeSlots.includes(time)) errors.time = "Это время недоступно.";

  const comment = trim(body.comment);
  if (comment.length > 1200) errors.comment = "Комментарий слишком длинный (максимум 1200 символов).";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    errors: {},
    value: {
      name,
      phone,
      channel,
      telegram: channel === "Telegram" ? telegram.replace(/^@/, "") : undefined,
      vehicleModel,
      vehicleYear,
      vin: vin ? vin.toUpperCase() : undefined,
      service,
      date,
      time,
      comment: comment || undefined,
    },
  };
}
