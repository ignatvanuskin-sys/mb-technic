import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Minimal session gate for the booking workspace.
 *
 * The admin panel renders customer names, phone numbers and VINs, so it must never be
 * publicly readable. Auth is a signed-ish token in an httpOnly cookie, derived from
 * ADMIN_PASSWORD. For a single-operator back office this is proportionate; a multi-user
 * deployment should move to a real identity provider.
 */
export const ADMIN_COOKIE = "mb_admin";
export const DEFAULT_PASSWORD = "mb-technic";
export const SESSION_MAX_AGE = 60 * 60 * 12; // 12 hours

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || DEFAULT_PASSWORD;
}

/** True while the built-in demo password is still in use. */
export function usingDefaultPassword(): boolean {
  return !process.env.ADMIN_PASSWORD;
}

function tokenFor(password: string): string {
  return createHash("sha256").update(`mb-technic::admin::${password}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Token to store in the cookie for a valid login. */
export function sessionToken(): string {
  return tokenFor(adminPassword());
}

export function verifyPassword(input: string): boolean {
  if (typeof input !== "string" || input.length === 0) return false;
  return safeEqual(tokenFor(input), tokenFor(adminPassword()));
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  return safeEqual(value, sessionToken());
}
