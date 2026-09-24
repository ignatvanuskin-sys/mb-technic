# QA MB TECHNIC — rolling findings (working notes)

Target: http://localhost:3000 (Next.js, ru, dark). Browser: **built-in disabled** in Settings → used user Chrome (localhost works).
Tab targetId: tab-vtab-1341863481 (also used: 1341863478 = instagram, untouched).

## Screenshots saved (workspace root C:\ЗА БАБКИ\mb_technic\qa\)
- [x] desktop-1440.png (full page, via CSS-zoom trick — tool disables fullPage)
- [x] desktop-1440-hero.png
- [x] tablet-768.png
- [x] mobile-430.png
- [x] mobile-390.png
- [x] mobile-375.png
- [x] mobile-320.png
- [x] booking-modal.png (1440)
- [ ] booking-step5.png (390) — IN PROGRESS
- [ ] booking-success.png
- [ ] admin.png
- [x] section-services.png (1440, row 03 hovered → preview swapped)
- [x] gallery-lightbox.png
- [x] contacts-map.png (1440)

## Verified facts so far
- Viewport overflowX: 1440 no, 768 no, 430 no, 390 no, 375 no, **320 YES (deSw 368 > 320, +48px)**.
  Culprit at 320: `#services ul.border-y li > button.group/row` — intrinsic width 348px starting at left:20 → right edge 368. Same rows are 368px wide at 375 (fits exactly).
- Hero section height vs viewport: 1440→1337(>900), 768→1024(=), 430→932(=), 390→844(=), 375→842(>812, +30), 320→859(>568, +291). No headline/CTA collision found (390: h1 bottom 322.75, CTA top 498.75).
- Fixed elements: header (76px, top) always; mobile bottom CTA bar 68px @430/390/375/320; none at 768/1440.
- Sticky header: fixed top:0 z-100; at scroll 1500 → bg rgba(6,7,10,0.85), backdrop-blur(24px), border-bottom rgba(255,255,255,0.1). WORKS.
- Services hover: dispatching mouseover on row 3 = `Тормозная система` → preview stack opacity 1→ index2 only (before: index0). Preview image swaps. WORKS.
- Gallery lightbox: opens (role=dialog, z-130, full-screen), counter `01 / 24`, caption, buttons Закрыть/Назад/Далее.
  Next → `02 / 24`, Prev → `01 / 24` OK; **Escape closes OK**; X (aria-label «Закрыть») closes OK; body scroll lock+restore OK.
  **Backdrop click does NOT close**: overlay children cover 100% of height (73+747+80=900); click at (80,450) lands on `DIV.flex flex-1 …` → STILL_OPEN. Only a synthetic click targeted directly at the overlay root closes it.
- Contacts/map: OSM iframe renders real tiles: `https://www.openstreetmap.org/export/embed.html?bbox=71.496582,51.142083,71.506582,51.148083&layer=mapnik&marker=51.145083,71.501582` (622x778, dark-filtered, marker + popup "улица Аркайым, 7, Астана"). WORKS.
- Booking modal: opens from header `button.btn.btn-primary` (hidden below lg) — z-120, 5 steps (Услуга/Автомобиль/Дата/Время/Контакты) + «ВАША ЗАЯВКА» summary. Step1 options OK, step2 has fields Марка, Модель*, Год выпуска*(select 2026…), VIN, Комментарий. Продвижение step1→step2 OK (Услуга=Диагностика selected).
- Console (as of checkpoint): NO messages captured at all (empty array) — re-check at end.
- Scroll: `scroll-behavior:smooth` on <html> → window.scrollTo without `behavior:'instant'` silently no-ops in background tab. Use `{behavior:'instant'}`.
- Scroll-spy observation: at scrollY 2900 (#services 2707–4384) the nav underline was on «О компании»; at #contacts the underline was on «Контакты». To re-verify.

## Remaining
1. booking-step5.png @390 (finish steps 3,4 → step5)
2. submit booking ONCE (QA Проверка / +7 700 123 45 67 / Телефон) → booking-success.png + reference
3. admin.png @1440 + table row / 4 counters / status filter chips
4. mobile bottom-bar over footer check
5. final console error/warning dump
6. report.md
