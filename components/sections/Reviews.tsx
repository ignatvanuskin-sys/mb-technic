"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Reveal } from "../Reveal";
import { reviews, site } from "@/lib/site";

export function Reviews() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    sync();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: "smooth" });
  };

  return (
    <section id="reviews" className="section bg-graphite">
      <div className="shell">
        {/* ── Big social proof ─────────────────────────────────────── */}
        <div className="grid items-end gap-10 border-b border-white/10 pb-14 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <p className="label">06 / Доверие</p>
            <div className="mt-6 flex items-end gap-6">
              <span className="display text-[clamp(4.5rem,15vw,11rem)] leading-[0.8] text-white">
                {site.rating.valueLabel}
              </span>
              <div className="pb-3">
                <div className="flex gap-1 text-accent" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={19} className="fill-current" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-2 font-mono text-[0.688rem] tracking-[0.22em] text-white/55">
                  {site.rating.ratings} ОЦЕНОК
                </p>
                <p className="font-mono text-[0.688rem] tracking-[0.22em] text-white/35">
                  {site.rating.reviews} ОТЗЫВОВ
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-silver md:text-lg">
              Рейтинг сервиса в 2ГИС — на {site.rating.capturedAt}. Отзывы реальные, с карточки
              компании; ниже приведены фрагменты с указанием авторов.
            </p>
            <a
              href={site.links.twoGisReviews}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-mono text-[0.688rem] tracking-[0.18em] text-accent transition-colors hover:text-white"
            >
              ОТКРЫТЬ ОТЗЫВЫ В 2ГИС
              <ArrowUpRight size={14} strokeWidth={1.75} />
            </a>
          </Reveal>
        </div>

        {/* ── Carousel ─────────────────────────────────────────────── */}
        <div className="mt-12 flex items-center justify-between gap-6">
          <p className="label">Говорят клиенты</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Предыдущие отзывы"
              className="grid h-11 w-11 place-items-center border border-white/12 text-silver transition-colors hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronLeft size={17} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Следующие отзывы"
              className="grid h-11 w-11 place-items-center border border-white/12 text-silver transition-colors hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ChevronRight size={17} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="hide-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2"
        >
          {reviews.map((r) => (
            <li
              key={`${r.author}-${r.date}`}
              className="w-[86vw] shrink-0 snap-start border border-white/10 bg-ink p-7 transition-colors duration-500 hover:border-white/20 sm:w-[440px] md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <Quote size={20} className="text-accent/70" strokeWidth={1.5} />
                <div className="flex gap-0.5 text-accent" aria-label={`Оценка ${r.rating} из 5`}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={12} className="fill-current" strokeWidth={0} />
                  ))}
                </div>
              </div>

              <blockquote className="mt-6 text-pretty text-[0.938rem] leading-relaxed text-silver">
                {r.text}
              </blockquote>

              <footer className="mt-7 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <span className="text-sm text-white">{r.author}</span>
                <span className="font-mono text-[0.625rem] tracking-[0.16em] text-white/35">
                  {r.date.toUpperCase()} · 2ГИС
                </span>
              </footer>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs leading-relaxed text-white/35">
          Отзывы приведены без изменений и взяты с карточки сервиса в 2ГИС. Если вы не нашли
          нужной информации — позвоните, ответим по телефону в рабочее время.
        </p>
      </div>
    </section>
  );
}
