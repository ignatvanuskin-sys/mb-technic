"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowDown, Star } from "lucide-react";
import { BookButton } from "../booking/BookingProvider";
import { heroImage, site } from "@/lib/site";

export function Hero() {
  const imageWrap = useRef<HTMLDivElement>(null);

  /* Light parallax on the hero photograph — skipped when motion is reduced. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        if (y > window.innerHeight * 1.1) return;
        if (imageWrap.current) {
          imageWrap.current.style.transform = `translate3d(0, ${y * 0.14}px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="top"
      className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink"
    >
      {/* ── Photograph ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 lg:left-auto lg:right-0 lg:w-[60%]">
        <div ref={imageWrap} className="absolute inset-0 will-change-transform">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            fetchPriority="high"
            quality={84}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="hero-photo scale-[1.08] object-cover object-[52%_38%]"
          />
        </div>
        {/* Overlays: mobile = bottom-up, desktop = left-to-right */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/35 lg:bg-gradient-to-r lg:from-ink lg:via-ink/70 lg:to-ink/5" />
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="hero-body shell relative z-10 flex flex-1 flex-col justify-end pb-[calc(68px+1.5rem+var(--safe-bottom))] pt-[calc(var(--header-h)+var(--safe-top)+1.25rem)] md:justify-center md:pb-20 md:pt-28 lg:pb-24">
        <div className="max-w-3xl">
          <p
            className="hero-eyebrow label-bright label flex flex-wrap items-center gap-x-3 gap-y-2"
            style={{ animation: "slideUp 0.8s cubic-bezier(0.16,1,0.3,1) both" }}
          >
            <span>MB TECHNIC</span>
            <span className="text-white/25">/</span>
            <span>Mercedes-Benz</span>
            <span className="text-white/25">/</span>
            <span>Астана</span>
          </p>

          <h1
            className="hero-title display mt-5 text-white md:mt-6"
            style={{ animation: "slideUp 0.9s cubic-bezier(0.16,1,0.3,1) 80ms both" }}
          >
            Сервис
            <br />
            Mercedes
            <br />
            <span className="display-outline">в Астане</span>
          </h1>

          <p
            className="hero-sub mt-6 max-w-md text-pretty text-[0.938rem] leading-relaxed text-silver md:mt-8 md:text-lg"
            style={{ animation: "slideUp 0.9s cubic-bezier(0.16,1,0.3,1) 180ms both" }}
          >
            Профессиональное обслуживание и ремонт автомобилей Mercedes-Benz.
            Специализированный сервис — улица Аркайым, 7.
          </p>

          <div
            className="hero-cta mt-8 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-10"
            style={{ animation: "slideUp 0.9s cubic-bezier(0.16,1,0.3,1) 260ms both" }}
          >
            <BookButton className="btn btn-primary">
              Записаться на сервис
            </BookButton>
            <a href="#services" className="btn btn-ghost">
              Посмотреть услуги
            </a>
          </div>

          {/* Verified trust row — every value is sourced, nothing is claimed */}
          <div
            className="hero-trust mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-12 md:gap-x-8 md:gap-y-4"
            style={{ animation: "slideUp 0.9s cubic-bezier(0.16,1,0.3,1) 340ms both" }}
          >
            <a
              href={site.links.twoGis}
              target="_blank"
              rel="noopener noreferrer"
              className="group -my-2 flex min-h-[44px] items-center gap-3 py-2"
            >
              <span className="flex items-center gap-1 text-accent" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-current" strokeWidth={0} />
                ))}
              </span>
              <span className="hero-rating-label font-mono text-[0.75rem] tracking-[0.14em] text-white/60 transition-colors group-hover:text-white">
                {site.rating.valueLabel} · {site.rating.ratings} ОЦЕНОК В{" "}
                {site.rating.source.toUpperCase()}
              </span>
            </a>

            <span className="hero-trust-divider hidden h-4 w-px bg-white/15 sm:block" />

            <span className="hero-trust-hours font-mono text-[0.75rem] tracking-[0.14em] text-white/60">
              ЕЖЕДНЕВНО {site.hoursShort}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom spec strip ──────────────────────────────────────── */}
      <div className="relative z-10 hidden border-t border-white/10 bg-ink/40 backdrop-blur-sm md:block">
        <div className="shell flex items-stretch justify-between">
          <SpecItem label="Город" value="Астана" />
          <SpecItem label="Профиль" value="Mercedes-Benz" />
          <SpecItem label="Адрес" value="улица Аркайым, 7" />
          <SpecItem label="Запись" value="Онлайн 24/7" accent />
          <a
            href="#services"
            className="flex items-center gap-3 px-2 py-4 font-mono text-[0.75rem] tracking-[0.24em] text-white/45 transition-colors hover:text-white"
          >
            ЛИСТАЙТЕ
            <ArrowDown size={14} strokeWidth={1.5} className="animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}

function SpecItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border-l border-white/10 px-6 py-4 first:border-l-0 first:pl-0">
      <p className="font-mono text-[0.6875rem] tracking-[0.24em] text-white/35">
        {label.toUpperCase()}
      </p>
      <p
        className={[
          "mt-1.5 text-sm tracking-[-0.01em]",
          accent ? "text-accent" : "text-white/85",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}
