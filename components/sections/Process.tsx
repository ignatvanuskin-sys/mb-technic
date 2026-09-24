import { Reveal } from "../Reveal";
import { BookButton } from "../booking/BookingProvider";
import { processSteps, site } from "@/lib/site";

export function Process() {
  return (
    <section className="section rule-b">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="label">05 / Процесс</p>
            <h2 className="display mt-6 max-w-2xl text-display-l text-white">
              Как проходит <span className="display-outline">обслуживание</span>
            </h2>
          </Reveal>
          <Reveal delay={120} className="lg:max-w-xs">
            <p className="text-sm leading-relaxed text-white/50">
              Пять шагов от заявки до готового автомобиля. Часы работы — {site.hoursShort}{" "}
              ежедневно.
            </p>
          </Reveal>
        </div>

        <ol className="mt-16 grid gap-px bg-white/10 md:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((step, i) => (
            <Reveal key={step.no} delay={i * 70} as="li" className="bg-ink">
              <div className="group relative flex h-full flex-col p-7 transition-colors duration-500 hover:bg-white/[0.03]">
                <div className="flex items-baseline justify-between">
                  <span className="display text-5xl text-white/12 transition-colors duration-500 group-hover:text-accent/70 md:text-6xl">
                    {step.no}
                  </span>
                  <span className="h-px w-8 bg-white/15 transition-colors duration-500 group-hover:bg-accent" />
                </div>
                <h3 className="mt-10 text-base uppercase tracking-[0.02em] text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={80}>
          <div className="mt-12 flex flex-col items-start gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-relaxed text-white/50">
              Заявка занимает несколько минут. Мы связываемся для подтверждения времени визита.
            </p>
            <BookButton className="btn btn-primary">Записаться на сервис</BookButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
