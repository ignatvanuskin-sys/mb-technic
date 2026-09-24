"use client";

import { Phone } from "lucide-react";
import { useBooking } from "./booking/BookingProvider";
import { site } from "@/lib/site";

/** Fixed bottom action bar — the booking CTA is always one tap away on phones. */
export function MobileCtaBar() {
  const { openBooking, isOpen } = useBooking();
  if (isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-white/10 bg-ink/92 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2 p-2.5">
        <a
          href={`tel:${site.primaryPhone.tel}`}
          className="btn btn-ghost !px-3 !py-3.5 text-[0.688rem]"
        >
          <Phone size={14} strokeWidth={1.75} />
          Позвонить
        </a>
        <button
          type="button"
          onClick={() => openBooking()}
          className="btn btn-primary !px-3 !py-3.5 text-[0.688rem]"
        >
          Записаться
        </button>
      </div>
    </div>
  );
}
