import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Reveal } from "../Reveal";
import { BookButton } from "../booking/BookingProvider";
import { site } from "@/lib/site";

export function Contacts() {
  return (
    <section id="contacts" className="section bg-graphite">
      <div className="shell">
        <Reveal>
          <p className="label">10 / Контакты</p>
        </Reveal>

        <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ── Details ───────────────────────────────────────────── */}
          <div>
            <Reveal delay={60}>
              <h2 className="display text-display-l text-white">
                MB Technic
                <span className="mt-3 block text-lg uppercase tracking-[0.04em] text-white/45">
                  Премиальный сервис Mercedes в Астане
                </span>
              </h2>
            </Reveal>

            <Reveal delay={120}>
              <dl className="mt-12 divide-y divide-white/[0.08] border-y border-white/[0.08]">
                <Row icon={<MapPin size={17} strokeWidth={1.5} />} label="Адрес">
                  <span className="text-white">{site.addressLine}</span>
                  <span className="mt-1 block text-sm text-white/45">
                    {site.addressFull.replace(`${site.addressLine} · `, "")} · индекс{" "}
                    {site.postalCode}
                  </span>
                  <span className="mt-1 block text-sm text-white/45">
                    Ближайшая остановка: {site.nearestStop}
                  </span>
                </Row>

                <Row icon={<Clock size={17} strokeWidth={1.5} />} label="График">
                  <span className="text-white">{site.hours}</span>
                  <span className="mt-1 block text-sm text-white/45">{site.hoursNote}</span>
                </Row>

                <Row icon={<Phone size={17} strokeWidth={1.5} />} label="Телефоны">
                  <span className="flex flex-col gap-1.5">
                    {site.phones.map((p) => (
                      <a
                        key={p.tel}
                        href={`tel:${p.tel}`}
                        className="text-white transition-colors hover:text-accent"
                      >
                        {p.display}
                      </a>
                    ))}
                  </span>
                </Row>

                <Row icon={<MessageCircle size={17} strokeWidth={1.5} />} label="Мессенджеры">
                  <span className="flex flex-wrap gap-x-5 gap-y-2">
                    {site.phones.map((p) => (
                      <a
                        key={p.whatsapp}
                        href={`https://wa.me/${p.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white transition-colors hover:text-accent"
                      >
                        WhatsApp {p.display}
                      </a>
                    ))}
                    <a
                      href={site.onlineChat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white transition-colors hover:text-accent"
                    >
                      Онлайн-чат
                    </a>
                  </span>
                </Row>
              </dl>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={site.links.twoGisRoute}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Navigation size={16} strokeWidth={1.75} />
                  Построить маршрут
                </a>
                <a href={`tel:${site.primaryPhone.tel}`} className="btn btn-ghost">
                  <Phone size={16} strokeWidth={1.75} />
                  Позвонить
                </a>
                <BookButton className="btn btn-accent">Записаться</BookButton>
              </div>
            </Reveal>
          </div>

          {/* ── Map ──────────────────────────────────────────────── */}
          <Reveal delay={100}>
            <div className="relative h-full min-h-[420px] overflow-hidden border border-white/10 bg-ink">
              <div className="map-dark absolute inset-0">
                <iframe
                  title="MB TECHNIC на карте — улица Аркайым, 7, Астана"
                  src={site.links.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              </div>

              {/* Pin card */}
              <div className="pointer-events-none absolute left-4 top-4 border border-white/12 bg-ink/92 px-4 py-3 backdrop-blur-md">
                <p className="font-mono text-[0.563rem] tracking-[0.22em] text-accent">MB TECHNIC</p>
                <p className="mt-1 text-sm text-white">{site.addressLine}</p>
                <p className="font-mono text-[0.563rem] tracking-[0.16em] text-white/40">
                  {site.geo.lat.toFixed(6)}, {site.geo.lng.toFixed(6)}
                </p>
              </div>

              <a
                href={site.links.twoGis}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 border border-white/12 bg-ink/92 px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.18em] text-white/70 backdrop-blur-md transition-colors hover:text-white"
              >
                ОТКРЫТЬ В 2ГИС
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-5 py-6">
      <span className="mt-0.5 text-accent">{icon}</span>
      <div>
        <dt className="font-mono text-[0.625rem] uppercase tracking-[0.24em] text-white/40">
          {label}
        </dt>
        <dd className="mt-2.5 text-base leading-relaxed">{children}</dd>
      </div>
    </div>
  );
}
