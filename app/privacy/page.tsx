import type { Metadata } from "next";
import Link from "next/link";
import { SiteChrome } from "@/components/SiteChrome";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Как MB Technic обрабатывает персональные данные, указанные в форме онлайн-записи на сервис.",
};

export default function PrivacyPage() {
  return (
    <SiteChrome>
      <article className="section">
        <div className="shell max-w-3xl">
          <p className="label">Документы</p>
          <h1 className="display mt-6 text-display-m text-white">
            Политика <span className="display-outline">конфиденциальности</span>
          </h1>

          <div className="mt-12 space-y-8 text-sm leading-relaxed text-white/60">
            <section>
              <h2 className="text-base uppercase tracking-[0.06em] text-white">
                Какие данные мы собираем
              </h2>
              <p className="mt-3">
                При отправке формы онлайн-записи мы получаем только те данные, которые вы указали
                сами: имя, номер телефона, предпочтительный канал связи (телефон, WhatsApp,
                Telegram), при необходимости — username в Telegram, модель и год выпуска
                автомобиля, VIN (если указан), выбранную услугу, дату и время визита, а также
                комментарий.
              </p>
            </section>

            <section>
              <h2 className="text-base uppercase tracking-[0.06em] text-white">
                Зачем мы их используем
              </h2>
              <p className="mt-3">
                Единственная цель — связаться с вами, подтвердить запись, уточнить детали
                автомобиля и согласовать объём работ. Мы не используем эти данные для рассылок,
                если вы отдельно об этом не попросили.
              </p>
            </section>

            <section>
              <h2 className="text-base uppercase tracking-[0.06em] text-white">
                Кому передаются данные
              </h2>
              <p className="mt-3">
                Мы не передаём персональные данные третьим лицам. Данные заявок сохраняются на
                сервере, обслуживающем этот сайт, и доступны только сотрудникам сервиса.
              </p>
            </section>

            <section>
              <h2 className="text-base uppercase tracking-[0.06em] text-white">
                Сколько мы их храним
              </h2>
              <p className="mt-3">
                Заявки хранятся столько, сколько необходимо для обслуживания визита и связанной с
                ним коммуникации. Если вы хотите удалить свою заявку — позвоните нам, и мы удалим
                данные.
              </p>
            </section>

            <section>
              <h2 className="text-base uppercase tracking-[0.06em] text-white">Контакты</h2>
              <p className="mt-3">
                {site.brand}, {site.addressLine}. Телефоны:{" "}
                {site.phones.map((p, i) => (
                  <span key={p.tel}>
                    {i > 0 ? ", " : ""}
                    <a
                      href={`tel:${p.tel}`}
                      className="text-white underline decoration-white/20 underline-offset-4 transition-colors hover:text-accent"
                    >
                      {p.display}
                    </a>
                  </span>
                ))}
                . График работы: {site.hours}.
              </p>
            </section>

            <section>
              <h2 className="text-base uppercase tracking-[0.06em] text-white">
                Внешние сервисы
              </h2>
              <p className="mt-3">
                На сайте используются карта OpenStreetMap (для отображения адреса) и ссылки на
                внешние ресурсы: 2ГИС, Instagram, TikTok, WhatsApp. При переходе по этим ссылкам
                действуют политики соответствующих сервисов.
              </p>
            </section>
          </div>

          <Link
            href="/"
            className="btn btn-ghost mt-14 !px-5 !py-3 text-[0.75rem]"
          >
            Вернуться на главную
          </Link>
        </div>
      </article>
    </SiteChrome>
  );
}
