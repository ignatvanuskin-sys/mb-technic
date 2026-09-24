import { Reveal } from "../Reveal";
import { BookButton } from "../booking/BookingProvider";
import { advantages, site } from "@/lib/site";

export function WhyUs() {
  return (
    <section id="why" className="section bg-graphite">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="label">04 / Почему MB Technic</p>
            <h2 className="display mt-6 max-w-2xl text-display-l text-white">
              Четыре причины <span className="display-outline">доверить</span> сервис
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <BookButton className="btn btn-primary">Записаться на сервис</BookButton>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a, i) => (
            <Reveal key={a.no} delay={i * 80} className="bg-graphite">
              <div className="group flex h-full flex-col justify-between p-7 transition-colors duration-500 hover:bg-white/[0.03] md:p-8">
                <p className="font-mono text-[0.688rem] tracking-[0.24em] text-accent">{a.no}</p>
                <div className="mt-12">
                  <h3 className="text-lg uppercase leading-tight tracking-[-0.01em] text-white">
                    {a.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-white/50">{a.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="mt-8 max-w-3xl text-xs leading-relaxed text-white/35">
            Данные о специализации и рейтинге — с карточки сервиса в{" "}
            <a
              href={site.links.twoGis}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/55 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
            >
              2ГИС
            </a>
            . Сведения об опыте работы и гарантийных обязательствах не публикуются: подтверждённых
            данных нет.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
