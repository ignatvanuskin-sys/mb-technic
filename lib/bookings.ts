import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Booking, BookingInput, BookingStatus } from "./types";

/**
 * Booking store with pluggable persistence.
 *
 *  - `kv`    — Upstash Redis / Vercel KV over REST. Required on hosts with an
 *              ephemeral filesystem (Vercel, Netlify, any serverless runtime),
 *              where writing to the project folder is not allowed.
 *  - `file`  — JSON file next to the app. Perfect for local dev and any host with
 *              a persistent disk (VPS, Docker, Railway…).
 *  - `readonly` — no writable store is configured: reads return an empty list and
 *              writes fail loudly instead of pretending to succeed.
 *
 * Selection is automatic: set KV_REST_API_URL + KV_REST_API_TOKEN
 * (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN) and the KV driver is used.
 *
 * Optional TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID make every new request push a
 * message to the workshop's Telegram — so a lead is never lost even if the board
 * is unreachable.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");
const KV_KEY = "mb-technic:bookings";

/** Must stay in sync with StorageDriverName in lib/types.ts */
export type StorageDriver = "kv" | "file" | "memory";

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || "";

const usingKv = Boolean(KV_URL && KV_TOKEN);
export const telegramConfigured = Boolean(TG_TOKEN && TG_CHAT);

/** Serverless hosts (Vercel) mount the project directory read-only. */
const isServerless = Boolean(process.env.VERCEL);

/** Remembers a read-only filesystem so we fail fast instead of retrying every request. */
let fileWritable = true;

/**
 * Demo mode: on a host without a writable disk and without KV configured, bookings are
 * kept in the memory of the running instance. The form works end-to-end and the board
 * shows what was created on that instance — but the data lives only as long as the
 * instance does. Swap in KV (or Telegram) when the real thing is needed.
 */
const memoryStore: Booking[] = [];
const memoryMode = isServerless && !usingKv;

export function storageDriver(): StorageDriver {
  if (usingKv) return "kv";
  if (memoryMode || !fileWritable) return "memory";
  return "file";
}

/** True when bookings are intentionally ephemeral (demo stand, not production data). */
export function isEphemeralStorage(): boolean {
  return storageDriver() === "memory";
}

/** Serialises writes so two concurrent requests cannot clobber each other. */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
}

/* ───────────────────────────── KV driver ───────────────────────────── */

async function kvCommand<T>(command: unknown[]): Promise<T | null> {
  const res = await fetch(KV_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV request failed: ${res.status}`);
  const data = (await res.json()) as { result?: T };
  return data.result ?? null;
}

/* ──────────────────────────── file driver ──────────────────────────── */

async function readFileStore(): Promise<Booking[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    fileWritable = true;
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      fileWritable = true;
      return [];
    }
    /* Read-only or missing directory (serverless): not an error for reads. */
    if (err.code === "EROFS" || err.code === "EACCES" || err.code === "EPERM" || err.code === "ENOTDIR") {
      fileWritable = false;
      return [];
    }
    /* A corrupt file must not take the site down: quarantine it and start clean. */
    if (e instanceof SyntaxError) {
      await writeFile(`${DATA_FILE}.corrupt-${Date.now()}`, "", "utf8").catch(() => undefined);
      return [];
    }
    throw err;
  }
}

async function writeFileStore(bookings: Booking[]): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf8");
    fileWritable = true;
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "EROFS" || err.code === "EACCES" || err.code === "EPERM") {
      fileWritable = false;
      throw new Error(
        "Хранилище недоступно: файловая система только для чтения. Настройте KV_REST_API_URL/KV_REST_API_TOKEN.",
      );
    }
    throw err;
  }
}

/* ───────────────────────────── shared ──────────────────────────────── */

async function readAll(): Promise<Booking[]> {
  if (usingKv) {
    const raw = await kvCommand<string>(["GET", KV_KEY]);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Booking[]) : [];
    } catch {
      return [];
    }
  }
  if (memoryMode) return [...memoryStore];
  const fromFile = await readFileStore();
  /* A disk that just turned out to be read-only has no file to read either. */
  return fileWritable ? fromFile : [...memoryStore];
}

async function writeAll(bookings: Booking[]): Promise<void> {
  if (usingKv) {
    await kvCommand(["SET", KV_KEY, JSON.stringify(bookings)]);
    return;
  }
  if (memoryMode || !fileWritable) {
    memoryStore.length = 0;
    memoryStore.push(...bookings);
    return;
  }
  try {
    await writeFileStore(bookings);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "EROFS" || err.code === "EACCES" || err.code === "EPERM") {
      /* Read-only disk: keep the demo working in memory instead of failing the client. */
      memoryStore.length = 0;
      memoryStore.push(...bookings);
      return;
    }
    throw e;
  }
}

/** Reference code: MB-YYMM-NNN, sequence resets each month. */
function makeCode(existing: Booking[], date: string): string {
  const [y, m] = date.split("-");
  const prefix = `MB-${y.slice(2)}${m}-`;
  const max = existing
    .filter((b) => b.code.startsWith(prefix))
    .reduce((acc, b) => Math.max(acc, Number(b.code.slice(prefix.length)) || 0), 0);
  return `${prefix}${String(max + 1).padStart(3, "0")}`;
}

/* ──────────────────────── Telegram notification ────────────────────── */

function formatTelegramMessage(b: Booking): string {
  return [
    "🚗 Новая заявка MB TECHNIC",
    `№ ${b.code}`,
    "",
    `Клиент: ${b.name}`,
    `Телефон: ${b.phone}`,
    `Связь: ${b.channel}${b.telegram ? ` (@${b.telegram})` : ""}`,
    `Авто: ${b.vehicleModel}, ${b.vehicleYear}${b.vin ? ` (VIN ${b.vin})` : ""}`,
    `Услуга: ${b.service}`,
    `Визит: ${b.date} в ${b.time}`,
    b.comment ? `Комментарий: ${b.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Fire-and-forget: a failed notification must never fail the client's booking. */
async function notifyTelegram(b: Booking): Promise<boolean> {
  if (!telegramConfigured) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TG_CHAT, text: formatTelegramMessage(b) }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

/* ──────────────────────────── public API ───────────────────────────── */

export function listBookings(): Promise<Booking[]> {
  return enqueue(async () => {
    const all = await readAll();
    return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });
}

export interface CreateResult {
  booking: Booking;
  /** True when the record could not be stored but the lead still reached the workshop. */
  deliveredViaTelegramOnly: boolean;
}

export async function createBooking(
  input: BookingInput,
  options?: { demo?: boolean },
): Promise<CreateResult> {
  return enqueue(async () => {
    const all = await readAll();
    const now = new Date().toISOString();
    const booking: Booking = {
      id: `bk_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      code: makeCode(all, input.date),
      ...input,
      status: "NEW",
      createdAt: now,
      updatedAt: now,
      ...(options?.demo ? { demo: true } : {}),
    };

    /* Real client requests are pushed to Telegram; demo rows are not noise there. */
    const notify = options?.demo ? Promise.resolve(false) : notifyTelegram(booking);

    try {
      all.push(booking);
      await writeAll(all);
      await notify;
      return { booking, deliveredViaTelegramOnly: false };
    } catch (e) {
      const delivered = await notify;
      if (delivered) {
        /* The workshop received the lead even though the board could not record it. */
        return { booking, deliveredViaTelegramOnly: true };
      }
      throw e;
    }
  });
}

export function updateBookingStatus(id: string, status: BookingStatus): Promise<Booking | null> {
  return enqueue(async () => {
    const all = await readAll();
    const idx = all.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
    await writeAll(all);
    return all[idx];
  });
}

export function deleteBooking(id: string): Promise<boolean> {
  return enqueue(async () => {
    const all = await readAll();
    const next = all.filter((b) => b.id !== id);
    if (next.length === all.length) return false;
    await writeAll(next);
    return true;
  });
}

/** Removes every row flagged as demo data — leaves real client requests untouched. */
export function clearDemoBookings(): Promise<number> {
  return enqueue(async () => {
    const all = await readAll();
    const real = all.filter((b) => !b.demo);
    const removed = all.length - real.length;
    if (removed > 0) await writeAll(real);
    return removed;
  });
}
