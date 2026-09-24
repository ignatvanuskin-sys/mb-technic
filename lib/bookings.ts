import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Booking, BookingInput, BookingStatus } from "./types";

/**
 * File-backed booking store (server-side only).
 * Survives restarts, works with `next dev` and `next start`, requires no external
 * service for the demo. Swap `readAll`/`writeAll` for a real database and the rest
 * of the app keeps working unchanged.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "bookings.json");

/** Serialises writes so two concurrent requests cannot clobber the file. */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = queue.then(task, task);
  queue = next.catch(() => undefined);
  return next;
}

async function readAll(): Promise<Booking[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") return [];
    // A corrupt file must not take the site down: quarantine it and start clean.
    if (err instanceof SyntaxError) {
      await writeFile(`${DATA_FILE}.corrupt-${Date.now()}`, "", "utf8").catch(() => undefined);
      return [];
    }
    throw err;
  }
}

async function writeAll(bookings: Booking[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(bookings, null, 2), "utf8");
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

export function listBookings(): Promise<Booking[]> {
  return enqueue(async () => {
    const all = await readAll();
    return all.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });
}

export function createBooking(input: BookingInput, options?: { demo?: boolean }): Promise<Booking> {
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
    all.push(booking);
    await writeAll(all);
    return booking;
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
