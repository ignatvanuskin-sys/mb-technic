"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { useBooking } from "./booking/BookingProvider";
import { site } from "@/lib/site";

/**
 * Mobile bottom action bar.
 *
 * It stays hidden while the visitor is still on the first screen — the hero already
 * carries its own prominent «Записаться на сервис» button, so a second one at the
 * bottom would only add noise. As soon as the first screen is scrolled past, the bar
 * slides up smoothly and stays available for one-thumb booking.
 */
export function MobileCtaBar() {
  const { openBooking, isOpen } = useBooking();
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      /* Threshold: just past the first viewport, where the hero CTA scrolls away. */
      setScrolledPast(window.scrollY > window.innerHeight * 0.55);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const visible = scrolledPast && !isOpen;

  return (
    <div
      /* While hidden the bar is off-screen: it must not be focusable or click-
         through-able, and screen readers should skip it. */
      aria-hidden={!visible}
      inert={!visible}
      className={[
        "fixed inset-x-0 bottom-0 z-[90] border-t border-white/10 bg-ink/92 backdrop-blur-xl md:hidden",
        "transition-[transform,opacity] duration-500 ease-premium motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0",
      ].join(" ")}
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-2 px-2.5 pt-2.5">
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
