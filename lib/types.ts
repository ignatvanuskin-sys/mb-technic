export const BOOKING_STATUSES = [
  "NEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const CONTACT_CHANNELS = ["Телефон", "WhatsApp", "Telegram"] as const;
export type ContactChannel = (typeof CONTACT_CHANNELS)[number];

export interface Booking {
  id: string;
  /** Human-friendly reference shown to the client, e.g. MB-2609-004. */
  code: string;
  name: string;
  phone: string;
  channel: ContactChannel;
  telegram?: string;
  vehicleModel: string;
  vehicleYear: string;
  vin?: string;
  service: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  /** HH:MM within opening hours */
  time: string;
  comment?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  /** Marks admin-generated sample rows so real data is never confused with demo data. */
  demo?: boolean;
}

export interface BookingInput {
  name: string;
  phone: string;
  channel: ContactChannel;
  telegram?: string;
  vehicleModel: string;
  vehicleYear: string;
  vin?: string;
  service: string;
  date: string;
  time: string;
  comment?: string;
}

export interface ApiError {
  ok: false;
  error: string;
  fields?: Record<string, string>;
}

export interface CreateBookingResponse {
  ok: true;
  booking: Booking;
}

export interface ListBookingsResponse {
  ok: true;
  bookings: Booking[];
}

export const STATUS_LABELS: Record<BookingStatus, string> = {
  NEW: "Новая",
  CONFIRMED: "Подтверждена",
  IN_PROGRESS: "В работе",
  COMPLETED: "Завершена",
  CANCELLED: "Отменена",
};

export const STATUS_TONE: Record<BookingStatus, string> = {
  NEW: "border-accent/50 text-accent bg-accent/10",
  CONFIRMED: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  IN_PROGRESS: "border-amber-500/40 text-amber-300 bg-amber-500/10",
  COMPLETED: "border-white/25 text-silver bg-white/5",
  CANCELLED: "border-red-500/40 text-red-300 bg-red-500/10",
};
