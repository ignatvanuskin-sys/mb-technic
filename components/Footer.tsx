import Link from "next/link";
import { Mark } from "./Mark";
import { site } from "@/lib/site";

const COLUMNS = [
  {
    title: "Услуги",
    links: [
      { label: "Все услуги", href: "#services" },
      { label: "Диагностика", href: "#services" },
      { label: "Ходовая часть", href: "#services" },
      { label: "Кузовной ремонт", href: "#services" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О компании", href: "#about" },
      { label: "Почему мы", href: "#why" },
      { label: "Отзывы", href: "#reviews" },
      { label: "Работы", href: "#gallery" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

export function Footer() {
  return (
    /* pb-[92px] keeps the last lines clear of the fixed mobile CTA bar */
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink pb-[calc(92px+var(--safe-bottom))] pt-16 md:pb-0">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <Mark size={26} className="text-chrome" />
              <span className="display text-base tracking-[0.02em] text-white">MB TECHNIC</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/50">
              {site.positioning} Астана, {site.address}.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={site.links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center border border-white/12 px-3.5 py-2 font-mono text-[0.75rem] tracking-[0.16em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
              >
                INSTAGRAM
              </a>
              <a
                href={site.links.twoGis}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center border border-white/12 px-3.5 py-2 font-mono text-[0.75rem] tracking-[0.16em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
              >
                2ГИС
              </a>
              <a
                href={site.links.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center border border-white/12 px-3.5 py-2 font-mono text-[0.75rem] tracking-[0.16em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
              >
                TIKTOK
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="label">{col.title}</p>
              <ul className="mt-3 space-y-0.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      /* min-h-11 keeps every footer link a comfortable thumb target */
                      className="flex min-h-[44px] items-center text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="label">Контакты</p>
              <ul className="mt-3 space-y-0.5">
                {site.phones.map((p) => (
                  <li key={p.tel}>
                    <a
                      href={`tel:${p.tel}`}
                      className="flex min-h-[44px] items-center font-mono text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {p.display}
                    </a>
                  </li>
                ))}
              <li className="text-sm leading-relaxed text-white/60">{site.addressLine}</li>
              <li className="text-sm leading-relaxed text-white/60">{site.hours}</li>
            </ul>
          </div>
        </div>

        {/* Oversized wordmark — editorial close */}
        <div className="mt-16 select-none border-t border-white/10 pt-10">
          <p className="display whitespace-nowrap text-[clamp(2.5rem,13vw,11rem)] leading-[0.8] text-white/[0.055]">
            MB TECHNIC · ASTANA
          </p>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-white/10 py-8 md:flex-row md:items-center">
          <p className="font-mono text-[0.75rem] tracking-[0.16em] text-white/35">
            © {new Date().getFullYear()} MB TECHNIC · MERCEDES-BENZ SPECIALIST · АСТАНА
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy"
              className="inline-flex min-h-[44px] items-center font-mono text-[0.75rem] tracking-[0.16em] text-white/45 transition-colors hover:text-white"
            >
              ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
            </Link>
            <Link
              href="/admin"
              className="inline-flex min-h-[44px] items-center font-mono text-[0.75rem] tracking-[0.16em] text-white/45 transition-colors hover:text-white"
            >
              ПАНЕЛЬ ЗАЯВОК
            </Link>
          </div>
        </div>

        <p className="pb-2 text-xs leading-relaxed text-white/25 md:pb-10">
          Информация на сайте носит справочный характер и не является публичной офертой. Стоимость
          работ определяется после диагностики. Данные о сервисе, рейтинге и фотографии — с
          карточки компании в 2ГИС.
        </p>
      </div>
    </footer>
  );
}
