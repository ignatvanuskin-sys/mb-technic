import Image from "next/image";
import { Reveal } from "../Reveal";

const TILES = [
  {
    src: "/media/opt/owner-video-04.jpg",
    alt: "Двигатель Mercedes-Benz V8 после разборки",
    caption: "Двигатель",
    meta: "Разборка · дефектовка",
    span: "lg:col-span-7 lg:row-span-2",
    ratio: "aspect-[4/5] lg:aspect-auto lg:h-full",
  },
  {
    src: "/media/opt/owner-video-03.jpg",
    alt: "Решётка радиатора и оптика Mercedes-Benz",
    caption: "Оптика и кузов",
    meta: "Кузовной ремонт · сварка",
    span: "lg:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/media/opt/owner-video-06.jpg",
    alt: "Работы на подъёмнике: тормозная система",
    caption: "Ходовая и тормоза",
    meta: "Подвеска · проточка дисков",
    span: "lg:col-span-5",
    ratio: "aspect-[4/3]",
  },
  {
    src: "/media/opt/interior-03.jpg",
    alt: "Сервисная зона MB TECHNIC: автомобили на подъёмниках",
    caption: "Сервисная зона",
    meta: "Астана · улица Аркайым, 7",
    span: "lg:col-span-12",
    ratio: "aspect-[16/10] lg:aspect-[21/9]",
  },
];

export function Precision() {
  return (
    <section className="section rule-b relative">
      <div className="shell">
        <Reveal>
          <p className="label">03 / Точность</p>
        </Reveal>

        <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal delay={60}>
            <h2 className="display max-w-3xl text-display-l text-white">
              Ваш Mercedes <br />
              <span className="display-outline">требует точности.</span>
            </h2>
          </Reveal>
          <Reveal delay={140} className="lg:max-w-sm">
            <p className="text-sm leading-relaxed text-white/50">
              Диагностика, разборка, дефектовка узлов и сборка — с контролем на каждом этапе.
              Ниже — фотографии из рабочей зоны сервиса.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-3 lg:grid-cols-12 lg:gap-4">
          {TILES.map((tile, i) => (
            <Reveal key={tile.src} delay={i * 90} className={tile.span}>
              <figure
                className={`group relative overflow-hidden bg-steel ${tile.ratio}`}
              >
                <Image
                  src={tile.src}
                  alt={tile.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  quality={78}
                  className="object-cover transition-transform duration-[1.6s] ease-premium group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                  <span>
                    <span className="block font-mono text-[0.625rem] tracking-[0.24em] text-white/55">
                      {tile.meta.toUpperCase()}
                    </span>
                    <span className="mt-1.5 block text-base uppercase tracking-[-0.01em] text-white md:text-lg">
                      {tile.caption}
                    </span>
                  </span>
                  <span className="font-mono text-[0.625rem] tracking-[0.2em] text-white/35">
                    0{i + 1}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
