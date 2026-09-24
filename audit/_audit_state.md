# AUDIT STATE (rolling)

## Scope
Mobile-first visual+functional audit of http://localhost:3000 (MB TECHNIC).
Deliverable: report.md at C:\ЗА БАБКИ\mb_technic\audit

## Environment
- Built-in browser DISABLED → using user Chrome (tab-vtab-1341863938).
- browser_act kind=resize emulates widths (window resize, NOT true mobile emulation):
  innerWidth == target, clientWidth == target-10 (10px scrollbar gutter). Touch NOT emulated (maxTouchPoints 0).
- Smooth scrolling does NOT animate in this off-screen window (outerWidth=0) → cannot time smooth-scroll; verified anchor targets with smooth disabled instead.

## DONE
### Part 1 (390x844)
1. Hero: title "MB Technic — Сервис Mercedes в Астане"; H1 СЕРВИС MERCEDES В АСТАНЕ; brand MB TECHNIC + MERCEDES · ASTANA; CTA "ЗАПИСАТЬСЯ НА СЕРВИС" visible at scroll 0 (top 555, h53); sticky bottom bar ПОЗВОНИТЬ/ЗАПИСАТЬСЯ visible. PASS
2. Hamburger: opens drawer div#mobile-menu fixed inset-x-0 bottom-0 top:76 h:768 z:95; aria-expanded true→false, aria-controls=mobile-menu, aria-label Открыть/Закрыть меню; body overflow hidden + padding-right 10px; scrollY unchanged on scroll attempt (17→17) → scroll locked PASS.
   - close via X (header button) PASS; via menu item PASS (menu closes, anchor scrolls to #services; with smooth disabled lands scrollY 2449, section top 76 == header h) PASS; Escape does NOT close menu FAIL; no backdrop area (drawer full-bleed 76–844) so tap-outside N/A; focus after open = BODY (no focus move/trap).
   - drawer has NO role=dialog / aria-modal.
3. #services exists (abs top 2525 @390). 8 service buttons "01 РЕМОНТ ДВИГАТЕЛЯ"… each button, filter chips 33px.
4. Headings present: "ЧЕТЫРЕ ПРИЧИНЫ ДОВЕРИТЬ СЕРВИС" etc.
5. Gallery: 12+ photos, filter buttons (ВСЕ/СЕРВИС/ДВИГАТЕЛЬ/ДЕТАЛИ/ТОРМОЗА/ТО/КУЗОВ/БРЕНД) h33.
6. Reviews: prev/next buttons present.
7. Contacts links: tel:+77007062220, tel:+77711492499, wa.me/77007062220, wa.me/77711492499, jivo.chat/t3antKVsqg, 2gis directions http://… (2gis.kz/astana/directions/points/%7C71.501582%2C51.145083%3B70000001103562456)
8. Instagram: https://www.instagram.com/mb_technic.kz/ (+ 12 post links)
9. Bad links (href='#'/empty): NONE found (badLinks []). Footer links all real: #services,#about,#why,#reviews,#gallery,#faq,#contacts, tel:, /privacy, /admin, instagram, tiktok, 2gis.
10. Sticky bottom bar: fixed inset-x-0 bottom-0 h68 z90 (<768px only). At max scroll: 0 footer elements behind bar. body padding-bottom 0px.

### Part 3 (measured, doc no-overflow all widths)
| width | innerW | clientW | docScrollW | delta | smallTargets(<44) | smallFonts(<12px) | safeAreaRules |
320x568 | 320 | 310 | 310 | 0 | 36 | 118 | 0
360x800 | 360 | 350 | 350 | 0 | 36 | 118 | 0
375x812 | 375 | 365 | 365 | 0 | 36 | 118 | 0
390x844 | 390 | 380 | 380 | 0 | 36 | 92(text nodes) | 0
393x852 | 393 | 383 | 383 | 0 | 36 | 118 | 0
412x915 | 412 | 402 | 402 | 0 | 36 | 118 | 0
430x932 | 430 | 420 | 420 | 0 | 36 | 118 | 0
768x1024| 768 | 758 | 758 | 0 | 37 | 118 | 0 (bottom bar hidden ≥768)
1280x800| 1280| 1270| 1270| 0 | 44 | 118 | 0
1440x900| 1440| 1430| 1430| 0 | 44 | 118 | 0
- Oversized-positioned-but-clipped: img.scale-[1.08].object-cover (hero) right = clientW+2..24 at every width (inside section#top overflow-clip) + .marquee-track (intentional).
- Distorted images (object-fit:fill, ratio diff >5%): 0.
- Small-font examples: 9.0px "MERCEDES · ASTANA", 11.0px "Ежедневно 09:00 — 19:00", 9.6px brand trio, 11.0px "5.0".
- Small-target examples: a.group.flex 169x26 (logo), a 277x17 "5.0 · 37 ОЦЕНОК В 2ГИС", a 219x17 "ИСТОЧНИК: КАРТОЧКА 2ГИС", a 30x15 "2ГИС", a 202x17 "ОТКРЫТЬ ОТЗЫВЫ В 2ГИС", button.shrink-0.border 57x33 "ВСЕ"(filter chips), footer tel/wa links 26px h.

### Screenshots saved (workspace root = C:\ЗА БАБКИ\mb_technic\audit)
m390-hero.png, m390-menu.png, m390-booking-step1.png, m320-hero.png, d1280-hero.png, d1440-full.png

## REMAINING
- Part1: services/gallery/reviews/contacts screenshots (m390-services, m390-gallery, m390-reviews, m390-contacts); lightbox X/Esc/backdrop/arrows; reviews carousel swipe; map render.
- Part2: full 5-step booking at 390 + submit ONCE (name "Аудит Мобайл"); tap heights; field focus vs viewport; calendar overflow; time slot heights; inputmode; error messages; double-submit; success screen; retry at 320 no-submit; keyboard reachability.
- Part2 API check: /api/bookings (needs login).
- Part3 done.
- Part4: console errors on / and /admin; network failed/dup/bytes; offline booking error message; a11y checks; reduced-motion; safe areas (0 rules found).
- Part5: remaining screenshots m390-services/gallery/reviews/contacts/booking-calendar/booking-success, m320-booking.
- report.md

## OPEN QUESTIONS / CAVEATS
- resize ≠ device emulation (no touch). Swipe gestures cannot be tested without touch emulation.
