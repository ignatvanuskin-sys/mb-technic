import Image from "next/image";
import { MapPin, ShieldCheck, Wrench } from "lucide-react";
import { Reveal } from "../Reveal";
import { services, site } from "@/lib/site";

const PAYMENTS = ["Оплата картой", "Наличный расчёт", "Оплата по QR-коду"];

export function Specialization() {
  return (
    <section id="about" className="section rule-b overflow-hidden">
      <div className="shell">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
          {/* Photograph */}
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-steel sm:aspect-[3/4]">
              <Image
                src="/media/opt/owner-video-01.jpg"
                alt="Mercedes-Benz G-Класс в сервисе MB TECHNIC"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover transition-transform duration-[1.4s] ease-premium hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                <p className="font-mono text-[0.625rem] tracking-[0.24em] text-white/70">
                  G-КЛАСС · СЕРВИСНАЯ ЗОНА
                </p>
                <p className="font-mono text-[0.625rem] tracking-[0.24em] text-white/40">
                  01 / 04
                </p>
              </div>
            </div>

            {/* floating spec card */}
            <div className="absolute -bottom-6 -right-3 hidden w-56 border border-white/12 bg-ink/95 p-5 backdrop-blur-md sm:block lg:-right-8">
              <p className="label">Профиль сервиса</p>
              <p className="mt-2 text-sm leading-snug text-white">
                Легковой автосервис.
                <br />
                Основное направление — ремонт двигателей.
              </p>
              <p className="mt-3 font-mono text-[0.563rem] tracking-[0.2em] text-white/35">
                ПО ДАННЫМ 2ГИС
              </p>
            </div>
          </Reveal>

          {/* Copy */}
          <div className="lg:pl-4">
            <Reveal>
              <p className="label">01 / Специализация</p>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="display mt-6 text-display-l text-white">
                Mercedes — <br />
                <span className="display-outline">это не просто</span> <br />
                автомобиль.
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-silver md:text-lg">
                Современный Mercedes требует правильного подхода к диагностике, обслуживанию и
                ремонту. MB TECHNIC специализируется именно на автомобилях Mercedes-Benz.
              </p>
              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/55">
                В сервисной зоне — E-Класс, S-Класс, G-Класс, SUV и AMG-версии. Работы выполняются
                по опубликованным направлениям сервиса, без навязанных процедур.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <dl className="mt-12 space-y-6">
                <Fact
                  icon={<Wrench size={17} strokeWidth={1.5} />}
                  title="Направления работ"
                  text={services
                    .slice(0, 5)
                    .map((s) => s.title)
                    .join(" · ")}
                />
                <Fact
                  icon={<ShieldCheck size={17} strokeWidth={1.5} />}
                  title="Диагностика перед ремонтом"
                  text="Сначала определяется причина неисправности, затем согласуется объём работ."
                />
                <Fact
                  icon={<MapPin size={17} strokeWidth={1.5} />}
                  title={site.addressLine}
                  text={`${site.hours}. ${site.nearestStop}.`}
                />
              </dl>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-2">
                {PAYMENTS.map((p) => (
                  <span
                    key={p}
                    className="border border-white/10 px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-white/45"
                  >
                    {p.toUpperCase()}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Fact({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-5 border-t border-white/10 pt-5">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div>
        <dt className="text-sm uppercase tracking-[0.08em] text-white">{title}</dt>
        <dd className="mt-1.5 text-sm leading-relaxed text-white/50">{text}</dd>
      </div>
    </div>
  );
}
