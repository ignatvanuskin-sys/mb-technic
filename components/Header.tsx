"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { Mark } from "./Mark";
import { useBooking } from "./booking/BookingProvider";
import { site } from "@/lib/site";

const NAV = [
  { href: "#services", label: "Услуги", id: "services" },
  { href: "#about", label: "О компании", id: "about" },
  { href: "#why", label: "Почему мы", id: "why" },
  { href: "#reviews", label: "Отзывы", id: "reviews" },
  { href: "#faq", label: "FAQ", id: "faq" },
  { href: "#contacts", label: "Контакты", id: "contacts" },
];

export function Header() {
  const { openBooking, isOpen } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlights the section currently in view.
     Sections are compared in DOM order (their vertical position), never in nav order —
     otherwise a section that sits above the current one can win the comparison. */
  useEffect(() => {
    const onScroll = () => {
      const line = window.scrollY + window.innerHeight * 0.32;
      const positioned = NAV.map((n) => ({ id: n.id, el: document.getElementById(n.id) }))
        .filter((entry): entry is { id: string; el: HTMLElement } => entry.el !== null)
        .sort((a, b) => a.el.offsetTop - b.el.offsetTop);
      let current = "";
      for (const { id, el } of positioned) {
        if (el.offsetTop <= line) current = id;
        else break;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* The menu must never survive a resize into desktop layout. */
  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-[100] transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled || menuOpen
            ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
        style={{ height: "var(--header-h)" }}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <a
            href="#top"
            className="group flex items-center gap-3"
            aria-label="MB TECHNIC — на главную"
          >
            <Mark className="text-chrome transition-transform duration-500 group-hover:rotate-[120deg]" />
            <span className="flex flex-col leading-none">
              <span className="display text-[0.95rem] tracking-[0.02em] text-white">
                MB TECHNIC
              </span>
              <span className="mt-1 font-mono text-[0.563rem] tracking-[0.28em] text-white/40">
                MERCEDES · ASTANA
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Основная навигация">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={[
                  "relative py-2 text-[0.813rem] tracking-[0.06em] transition-colors duration-300",
                  active === item.id ? "text-white" : "text-white/55 hover:text-white",
                ].join(" ")}
              >
                {item.label}
                <span
                  className={[
                    "absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-500",
                    active === item.id ? "w-full" : "w-0",
                  ].join(" ")}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.primaryPhone.tel}`}
              className="hidden items-center gap-2 font-mono text-[0.75rem] tracking-[0.06em] text-silver transition-colors hover:text-white xl:flex"
            >
              <Phone size={14} strokeWidth={1.75} />
              {site.primaryPhone.display}
            </a>
            <button
              type="button"
              onClick={() => openBooking()}
              className="btn btn-primary hidden !px-5 !py-3 text-[0.75rem] sm:inline-flex"
            >
              Записаться
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center border border-white/15 text-white lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            >
              {menuOpen ? <X size={19} strokeWidth={1.75} /> : <Menu size={19} strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen || isOpen}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[95] overflow-y-auto border-t border-white/10 bg-ink/97 backdrop-blur-xl lg:hidden"
      >
        <nav className="shell flex flex-col py-6" aria-label="Мобильная навигация">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="rule-b flex items-baseline justify-between py-5 text-2xl tracking-[-0.02em] text-white/85 transition-colors hover:text-white"
              style={{ animation: `slideUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 40}ms both` }}
            >
              {item.label}
              <span className="font-mono text-[0.625rem] tracking-[0.2em] text-white/30">
                0{i + 1}
              </span>
            </a>
          ))}

          <div className="mt-8 flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openBooking();
              }}
              className="btn btn-primary w-full"
            >
              Записаться на сервис
            </button>
            <a href={`tel:${site.primaryPhone.tel}`} className="btn btn-ghost w-full">
              <Phone size={15} strokeWidth={1.75} />
              {site.primaryPhone.display}
            </a>
          </div>

          <p className="label mt-8 pb-10">{site.hours}</p>
        </nav>
      </div>
    </>
  );
}
