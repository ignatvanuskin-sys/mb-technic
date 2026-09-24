import Link from "next/link";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="grain relative flex min-h-[100svh] flex-col justify-center">
      <div className="shell">
        <p className="label">Ошибка 404</p>
        <h1 className="display mt-6 text-[clamp(3rem,14vw,10rem)] text-white">
          Страница
          <br />
          <span className="display-outline">не найдена</span>
        </h1>
        <p className="mt-8 max-w-md text-base leading-relaxed text-silver">
          Возможно, ссылка устарела. Вернитесь на главную или позвоните нам — подскажем по услугам и
          записи.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            На главную
          </Link>
          <a href={`tel:${site.primaryPhone.tel}`} className="btn btn-ghost">
            {site.primaryPhone.display}
          </a>
        </div>
      </div>
    </main>
  );
}
