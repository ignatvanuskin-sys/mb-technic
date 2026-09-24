"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "../Reveal";
import { useBooking } from "../booking/BookingProvider";
import { faq, site } from "@/lib/site";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const { openBooking } = useBooking();

  return (
    <section id="faq" className="section rule-b">
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <Reveal>
            <p className="label">09 / FAQ</p>
            <h2 className="display mt-6 text-display-m text-white">
              Частые вопросы <br />
              <span className="display-outline">без мелкого шрифта</span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/50">
              Если не нашли ответ — позвоните или опишите вопрос в форме записи.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openBooking()}
                className="btn btn-primary !px-5 !py-3 text-[0.75rem]"
              >
                Записаться
              </button>
              <a
                href={`https://wa.me/${site.primaryPhone.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost !px-5 !py-3 text-[0.75rem]"
              >
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        <ul className="border-t border-white/10">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-white/10">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span
                      className={[
                        "text-base leading-snug transition-colors duration-300 md:text-lg",
                        isOpen ? "text-white" : "text-white/70 group-hover:text-white",
                      ].join(" ")}
                    >
                      {item.q}
                    </span>
                    <span
                      className={[
                        "mt-0.5 grid h-8 w-8 shrink-0 place-items-center border transition-all duration-500",
                        isOpen
                          ? "rotate-45 border-accent text-accent"
                          : "border-white/15 text-white/45 group-hover:border-white/35",
                      ].join(" ")}
                    >
                      <Plus size={15} strokeWidth={1.75} />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-panel-${i}`}
                  className="grid transition-[grid-template-rows] duration-500 ease-premium"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-7 pr-10 text-sm leading-relaxed text-white/55">
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
