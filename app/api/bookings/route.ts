import { NextResponse } from "next/server";
import { clearDemoBookings, createBooking, listBookings, storageDriver } from "@/lib/bookings";
import { validateBooking } from "@/lib/validation";
import { isAuthenticated } from "@/lib/auth";
import type { ApiError, CreateBookingResponse, ListBookingsResponse } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UNAUTHORISED = { ok: false as const, error: "Требуется вход в панель заявок." };

/** GET /api/bookings — full list, newest first (booking workspace, auth required). */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json<ApiError>(UNAUTHORISED, { status: 401 });
  }
  try {
    const bookings = await listBookings();
    return NextResponse.json<ListBookingsResponse>({
      ok: true,
      bookings,
      storage: storageDriver(),
    });
  } catch (e) {
    console.error("[bookings:GET]", e);
    return NextResponse.json<ApiError>(
      { ok: false, error: "Не удалось прочитать список заявок." },
      { status: 500 },
    );
  }
}

/** POST /api/bookings — validated booking submission from the site. */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<ApiError>(
      { ok: false, error: "Некорректный запрос." },
      { status: 400 },
    );
  }

  /*
   * Honeypot: bots fill every input, humans never see this field.
   * Respond 200 so the bot cannot tell it was rejected.
   */
  if (
    typeof payload === "object" &&
    payload !== null &&
    "company" in payload &&
    typeof (payload as Record<string, unknown>).company === "string" &&
    ((payload as Record<string, unknown>).company as string).length > 0
  ) {
    return NextResponse.json({ ok: true, booking: null }, { status: 200 });
  }

  const { ok, errors, value } = validateBooking(payload);
  if (!ok || !value) {
    return NextResponse.json<ApiError>(
      { ok: false, error: "Проверьте выделенные поля.", fields: errors },
      { status: 400 },
    );
  }

  const wantsDemo =
    typeof payload === "object" &&
    payload !== null &&
    (payload as Record<string, unknown>).demo === true;

  try {
    const { booking, deliveredViaTelegramOnly } = await createBooking(value, { demo: wantsDemo });
    return NextResponse.json<CreateBookingResponse>(
      { ok: true, booking, deliveredViaTelegramOnly },
      { status: 201 },
    );
  } catch (e) {
    const storageMissing = e instanceof Error && e.message.includes("Хранилищ");
    console.error("[bookings:POST]", e);
    return NextResponse.json<ApiError>(
      {
        ok: false,
        error: storageMissing
          ? "Не удалось сохранить заявку. Позвоните нам: +7 700 706 22 20 — мы примем запись по телефону."
          : "Не удалось сохранить заявку. Попробуйте ещё раз или позвоните: +7 700 706 22 20.",
      },
      { status: storageMissing ? 503 : 500 },
    );
  }
}

/** DELETE /api/bookings?demo=1 — removes sample rows only, never real requests. */
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json<ApiError>(UNAUTHORISED, { status: 401 });
  }
  const url = new URL(request.url);
  if (url.searchParams.get("demo") !== "1") {
    return NextResponse.json<ApiError>(
      { ok: false, error: "Массовое удаление доступно только для демо-данных." },
      { status: 400 },
    );
  }
  try {
    const removed = await clearDemoBookings();
    return NextResponse.json({ ok: true, removed });
  } catch (e) {
    const storageMissing = e instanceof Error && e.message.includes("Хранилищ");
    console.error("[bookings:DELETE]", e);
    return NextResponse.json<ApiError>(
      {
        ok: false,
        error: storageMissing ? "Хранилище заявок не настроено." : "Не удалось очистить.",
      },
      { status: storageMissing ? 503 : 500 },
    );
  }
}
