"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "../Reveal";
import { useBooking } from "../booking/BookingProvider";
import { services, site } from "@/lib/site";

/** Maps a service row to the matching option in the booking form. */
const BOOKING_SERVICE: Record<string, string> = {
  "Ремонт двигателя": "Двигатель",
  "Ходовая часть": "Ходовая часть",
  "Тормозная система": "Тормозная система",
  "Кузовной ремонт": "Кузовной ремонт",
  "Компьютерная диагностика": "Диагностика",
  "Ремонт АКПП": "Ремонт АКПП",
  "Климатические системы": "Климатическая система",
  "Замена масла": "Замена масла",
};

export function Services() {
  const { openBooking } = useBooking();
  const [active, setActive] = useState(0);
  const current = services[active];

  return (
    <section id="services" className="section bg-graphite">
      <div className="shell">
        {/* Header */}
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="label">02 / Услуги</p>
            <h2 className="display mt-6 max-w-2xl text-display-l text-white">
              Работы, которые <span className="display-outline">выполняет</span> сервис
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:max-w-sm">
            <p className="text-sm leading-relaxed text-white/50">
              Список направлений соответствует рубрикам и услугам, опубликованным на карточке
              сервиса в 2ГИС.
            </p>
            <a
              href={site.links.twoGis}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 py-2 font-mono text-[0.688rem] tracking-[0.18em] text-accent transition-colors hover:text-white"
            >
              ИСТОЧНИК: КАРТОЧКА 2ГИС
              <ArrowUpRight size={14} strokeWidth={1.75} />
            </a>
          </Reveal>
        </div>

        {/* Editorial rows + sticky preview */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-16">
          <ul className="border-y border-white/10">
            {services.map((s, i) => {
              const isActive = i === active;
              return (
                /* Rows arrive one after another — a light stagger that reads well on
                   phones, where the list is scrolled rather than hovered. */
                <Reveal
                  key={s.no}
                  as="li"
                  delay={i * 55}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() =>
                      openBooking({ service: BOOKING_SERVICE[s.title] ?? s.title })
                    }
                    className="group/row relative flex w-full items-center gap-3 py-6 text-left transition-colors duration-500 hover:bg-white/[0.025] md:gap-8 md:py-8"
                    aria-label={`${s.title} — записаться`}
                  >
                    {/* number */}
                    <span
                      className={[
                        "w-6 shrink-0 font-mono text-xs tracking-[0.1em] transition-colors duration-500 md:w-10 md:text-sm",
                        isActive ? "text-accent" : "text-white/30",
                      ].join(" ")}
                    >
                      {s.no}
                    </span>

                    {/* mobile thumbnail */}
                    <span className="relative h-12 w-10 shrink-0 overflow-hidden bg-steel md:hidden">
                       <Image
                         src={s.image}
                         alt=""
                         aria-hidden
                         fill
                         sizes="40px"
                         className="object-cover"
                       />
                    </span>

                    {/* copy */}
                    <span className="min-w-0 flex-1">
                      <span
                        className={[
                          "block text-[clamp(1rem,4.8vw,2rem)] uppercase leading-[1.08] tracking-[-0.03em] transition-colors duration-500 [overflow-wrap:anywhere]",
                          isActive ? "text-white" : "text-white/70",
                        ].join(" ")}
                      >
                        {s.title}
                      </span>
                      <span className="mt-3 hidden flex-wrap gap-x-4 gap-y-1.5 md:flex">
                        {s.tags.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-[0.75rem] tracking-[0.16em] text-white/40"
                          >
                            {t.toUpperCase()}
                          </span>
                        ))}
                      </span>
                    </span>

                    {/* arrow */}
                    <span
                      className={[
                        "grid h-9 w-9 shrink-0 place-items-center border transition-all duration-500 md:h-11 md:w-11",
                        isActive
                          ? "border-accent bg-accent text-white"
                          : "border-white/12 text-white/40 group-hover/row:border-white/30",
                      ].join(" ")}
                    >
                      <ArrowUpRight size={16} strokeWidth={1.75} />
                    </span>
                   </button>
                 </Reveal>
               );
             })}
          </ul>

          {/* Sticky preview — follows the hovered row */}
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+2.5rem)]">
              <div className="relative aspect-[3/4] overflow-hidden bg-steel">
                {services.map((s, i) => (
                  <Image
                    key={s.no}
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="340px"
                    quality={78}
                    className={[
                      "object-cover transition-all duration-[1.1s] ease-premium",
                      i === active ? "opacity-100 scale-100" : "opacity-0 scale-[1.06]",
                    ].join(" ")}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-mono text-[0.6875rem] tracking-[0.24em] text-white/50">
                    {current.rubric.toUpperCase()}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-white">{current.summary}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="font-mono text-[0.75rem] tracking-[0.2em] text-white/35">
                  СТОИМОСТЬ
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Прайс-лист на карточке сервиса не опубликован. Точная стоимость — после
                  диагностики и согласования работ.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile note */}
        <div className="mt-10 border-t border-white/10 pt-6 lg:hidden">
          <p className="text-sm leading-relaxed text-white/50">
            Нажмите на направление, чтобы записаться. Точная стоимость — после диагностики и
            согласования работ.
          </p>
        </div>
      </div>
    </section>
  );
}
