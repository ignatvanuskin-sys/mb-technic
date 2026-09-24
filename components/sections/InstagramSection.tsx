import Image from "next/image";
import { ArrowUpRight, Instagram as InstagramIcon } from "lucide-react";
import { Reveal } from "../Reveal";
import { instagramPosts, site } from "@/lib/site";

export function InstagramSection() {
  return (
    <section className="section bg-graphite">
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <p className="label">08 / Instagram</p>
            <h2 className="display mt-6 max-w-2xl text-display-l text-white">
              MB Technic <span className="display-outline">в работе</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="lg:max-w-sm">
            <p className="text-sm leading-relaxed text-white/50">
              Публикации сервиса: автомобили, разборка узлов, диагностика и результаты работ.
              Аккаунт {site.instagram.handle}.
            </p>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-6"
            >
              <InstagramIcon size={16} strokeWidth={1.75} />
              Смотреть Instagram
            </a>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.src} delay={(i % 4) * 60}>
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-square overflow-hidden bg-steel"
                aria-label={`${post.caption} — открыть публикацию в Instagram`}
              >
                <Image
                  src={post.src}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={78}
                  loading="lazy"
                  className="object-cover transition-transform duration-[1.4s] ease-premium group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="text-left text-xs leading-snug text-white">
                    {post.caption}
                  </span>
                  <ArrowUpRight size={14} strokeWidth={1.75} className="shrink-0 text-white" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 font-mono text-[0.75rem] tracking-[0.16em] text-white/30">
          ПУБЛИКАЦИИ @MB_TECHNIC.KZ · ПЕРЕХОД НА INSTAGRAM
        </p>
      </div>
    </section>
  );
}
