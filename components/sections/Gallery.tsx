"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import { Reveal } from "../Reveal";
import { gallery, site, type Media } from "@/lib/site";

export function Gallery() {
  const tags = useMemo(() => {
    const set = new Set(gallery.map((g) => g.tag));
    return ["Все", ...Array.from(set)];
  }, []);
  const [tag, setTag] = useState("Все");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items: Media[] = useMemo(
    () => (tag === "Все" ? gallery : gallery.filter((g) => g.tag === tag)),
    [tag],
  );

  const close = useCallback(() => setOpenIndex(null), []);

  /** Closes when the click lands on any backdrop area, not on the photo or a control. */
  const backdropClose = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("img, button, a")) return;
      close();
    },
    [close],
  );
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpenIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  /* Keyboard control + scroll lock while the lightbox is open. */
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <section id="gallery" className="section rule-b">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="label">07 / Работы</p>
            <h2 className="display mt-6 max-w-2xl text-display-l text-white">
              Сервис <span className="display-outline">в деталях</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:max-w-sm">
            <p className="text-sm leading-relaxed text-white/50">
              {gallery.length} фотографий из рабочей зоны MB TECHNIC — публикации сервиса и
              снимки посетителей с карточки 2ГИС.
            </p>
          </Reveal>
        </div>

        {/* Filters */}
        <div className="hide-scrollbar mt-10 flex gap-2 overflow-x-auto pb-1">
          {tags.map((t) => {
            const activeTag = t === tag;
            return (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTag(t);
                  setOpenIndex(null);
                }}
                className={[
                  "shrink-0 border px-4 py-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] transition-colors duration-300",
                  activeTag
                    ? "border-accent bg-accent/12 text-accent"
                    : "border-white/10 text-white/45 hover:border-white/30 hover:text-white",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* Editorial masonry */}
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {items.map((item, i) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group relative block w-full break-inside-avoid overflow-hidden bg-steel"
              aria-label={`Открыть фотографию: ${item.alt}`}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={item.w}
                height={item.h}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                quality={72}
                loading={i < 4 ? "eager" : "lazy"}
                className="h-auto w-full object-cover transition-transform duration-[1.5s] ease-premium group-hover:scale-[1.045]"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 opacity-0 transition-all duration-500 group-hover:opacity-100">
                <span className="text-left text-sm leading-snug text-white">{item.alt}</span>
                <span className="grid h-9 w-9 shrink-0 place-items-center border border-white/25 text-white">
                  <Maximize2 size={14} strokeWidth={1.75} />
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
          <a
            href={site.links.twoGisGallery}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[0.688rem] tracking-[0.18em] text-accent transition-colors hover:text-white"
          >
            ВСЕ ФОТОГРАФИИ В 2ГИС
            <ArrowUpRight size={14} strokeWidth={1.75} />
          </a>
          <span className="font-mono text-[0.625rem] tracking-[0.16em] text-white/30">
            ФОТО: MB TECHNIC · 2ГИС
          </span>
        </div>
      </div>

      {/* ── Lightbox ───────────────────────────────────────────────── */}
      {active ? (
        <div
          className="fixed inset-0 z-[130] flex flex-col bg-ink/95 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:px-8">
            <p className="font-mono text-[0.688rem] tracking-[0.2em] text-white/50">
              {String((openIndex ?? 0) + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="grid h-10 w-10 place-items-center border border-white/12 text-silver transition-colors hover:border-white/35 hover:text-white"
            >
              <X size={17} strokeWidth={1.75} />
            </button>
          </div>

          <div
            className="flex flex-1 items-center justify-center overflow-hidden p-4 md:p-10"
            onClick={backdropClose}
          >
            <div
              className="relative flex max-h-full w-full max-w-5xl items-center justify-center"
              onClick={backdropClose}
            >
              <Image
                src={active.src}
                alt={active.alt}
                width={active.w}
                height={active.h}
                sizes="(max-width: 1024px) 100vw, 80vw"
                quality={85}
                className="max-h-[72svh] w-auto object-contain"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-5 md:px-8">
            <p className="max-w-xl text-sm text-white/70">{active.alt}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                className="btn btn-ghost !px-4 !py-2.5 text-[0.688rem]"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                className="btn btn-ghost !px-4 !py-2.5 text-[0.688rem]"
              >
                Далее
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
