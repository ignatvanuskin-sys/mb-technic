"use client";

import { useEffect, useRef, useState } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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

  /* Mobile menu: body scroll lock, focus in/out, Escape to close, Tab trapped inside. */
  useEffect(() => {
    if (!menuOpen) return;

    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    /* Captured now: the ref may point elsewhere by the time cleanup runs. */
    const toggle = toggleRef.current;

    /* Move focus into the drawer so keyboard and screen-reader users land in it. */
    const focusTarget =
      menuRef.current?.querySelector<HTMLElement>("a[href], button:not([disabled])") ?? null;
    focusTarget?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || !menuRef.current) return;
      const nodes = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
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
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      /* Returning to the trigger keeps the tab order predictable after closing. */
      toggle?.focus();
    };
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
        style={{
          height: "calc(var(--header-h) + var(--safe-top))",
          paddingTop: "var(--safe-top)",
        }}
      >
        <div className="shell flex h-full items-center justify-between gap-6">
          <a
            href="#top"
            className="group -my-2 flex min-h-[44px] items-center gap-3 py-2"
            aria-label="MB TECHNIC — на главную"
          >
            <Mark className="text-chrome transition-transform duration-500 group-hover:rotate-[120deg]" />
            <span className="flex flex-col leading-none">
              <span className="display text-[0.95rem] tracking-[0.02em] text-white">
                MB TECHNIC
              </span>
              <span className="mt-1 font-mono text-[0.75rem] tracking-[0.22em] text-white/45">
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
              /* Visible on phones wide enough to fit it next to the logo + hamburger;
                 on narrower screens the bottom bar (which appears on scroll) takes over. */
              className="btn btn-primary hidden !px-4 !py-3 text-[0.75rem] min-[420px]:inline-flex"
            >
              Записаться
            </button>
            <button
              ref={toggleRef}
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

      {/* Backdrop — tapping it (the visible sliver under the drawer) closes the menu */}
      <div
        aria-hidden="true"
        hidden={!menuOpen || isOpen}
        onClick={() => setMenuOpen(false)}
        className="fixed inset-0 z-[94] bg-ink/70 backdrop-blur-sm lg:hidden"
      />

      {/* Mobile menu — a sheet, not a full-bleed wall, so the backdrop stays tappable */}
      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Меню"
        hidden={!menuOpen || isOpen}
        onClick={(e) => {
          /* Taps on the sheet's own background (not on a control) also close it. */
          if (!(e.target as HTMLElement).closest("a, button")) setMenuOpen(false);
        }}
        className="fixed inset-x-0 top-[calc(var(--header-h)+var(--safe-top))] z-[95] max-h-[calc(100dvh-var(--header-h)-var(--safe-top)-68px)] overflow-y-auto overscroll-contain border-y border-white/10 bg-ink/97 backdrop-blur-xl lg:hidden"
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
              <span className="font-mono text-[0.75rem] tracking-[0.2em] text-white/30">
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
