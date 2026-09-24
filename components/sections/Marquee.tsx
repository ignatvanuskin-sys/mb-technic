const ITEMS = [
  "Mercedes-Benz",
  "Диагностика",
  "Ремонт двигателя",
  "Пневмоподвеска",
  "Кузовной ремонт",
  "АКПП",
  "Тормозная система",
  "Замена масла",
  "Астана",
];

/** Infinite keyword strip — a quiet, technical transition between hero and content. */
export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="marquee relative overflow-hidden border-y border-white/10 bg-graphite py-5">
      <div className="marquee-track" aria-hidden="true">
        {row.map((item, i) => (
          <span key={`${item}-${i}`} className="flex shrink-0 items-center">
            <span className="px-7 font-mono text-[0.688rem] uppercase tracking-[0.3em] text-white/45">
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-accent/70" />
          </span>
        ))}
      </div>
      <p className="sr-only">
        MB TECHNIC: диагностика, ремонт двигателя, пневмоподвеска, кузовной ремонт, АКПП,
        тормозная система, замена масла — Астана.
      </p>
    </div>
  );
}
