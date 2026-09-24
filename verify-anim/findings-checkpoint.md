# Rolling findings — mb-technic.vercel.app ?v=anim1 (390x844 CDP emulation)

Scope: verify bottom CTA bar reveal-on-scroll, header CTA breakpoints, mobile animations, regressions.
Tooling note: built-in browser DISABLED -> user Chrome used. CDP device-metrics override via browser_act resize (innerWidth 390 confirmed).
NOTE: Chrome window gets occluded -> document.visibilityState = 'hidden' -> Chrome freezes the animation clock
(getAnimations().currentTime stuck at 0, smooth-scroll animations never progress). All animation numbers below were
taken with the tab focused (browser_focus) and using scrollTo({behavior:'instant'}).

## 1. Bottom CTA bar  (element: div.fixed.inset-x-0.bottom-0.z-[90] ... md:hidden, text "ПОЗВОНИТЬ ЗАПИСАТЬСЯ", h=67.52)
- A scrollY=0: top=844, bottom=911.52, transform=matrix(1,0,0,1,0,67.5156) (=own height), opacity=0,
  inert=TRUE, aria-hidden=true, pointer-events=none. Hero CTA "ЗАПИСАТЬСЯ НА СЕРВИС" visible (top 541.8, bottom 594.9, opacity 1).
- B scrollY=844: top=776.48, bottom=844 (=innerHeight), transform=matrix(1,0,0,1,0,0) identity, opacity=1,
  inert=false, aria-hidden=false, pointer-events=auto. Hero CTA off-screen (bottom -249.1).
- C scrollY=0 again: identical to A (top 844, opacity 0, inert true).
- THRESHOLD (20 steps, 42.2px): hidden at y<=464; first visible y=506 (class flip + opacity ramp 0.27->1 over ~0.5s).
  Boundary: y=463 hidden, y=506 visible -> threshold in (465..506) px, ~500px.
- Click bar "ЗАПИСАТЬСЯ" at state B -> booking modal DID open: div.fixed.inset-0.z-[120] role=dialog aria-modal=true,
  "MB TECHNIC · ОНЛАЙН-ЗАПИСЬ / ШАГ 1 / 5 · УСЛУГА / ЧТО НУЖНО СДЕЛАТЬ?" + service option list.
  Closed with Escape -> modal removed (count 0), inputs 0.

## 2. Header booking button (button.btn.btn-primary.hidden.min-[420px]:inline-flex)
- 390 (layout width 380): display:none, rect all 0 -> HIDDEN (as expected)
- 430 (layout width 420): display:flex, 120.81x42, left 223.19 top 16.5 right 344 bottom 58.5 -> VISIBLE (as expected)
- 320 (layout 310): display:none -> hidden

## 3. Animations (390x844)
- hero-photo: transform matrix(1.08,0,0,1.08,0,0) = scale 1.08 at rest, opacity 1, anim heroSettle 1.7s both.
  During the frozen-intro state it was 1.16 / hero-cta opacity 0 — that was the frozen-clock artifact.
- overflow: documentElement.scrollWidth 380 <= innerWidth 390 -> no horizontal overflow (hero img itself is
  left -15.2 / right 395.2 but clipped by #top{overflow:hidden}).
- layout shift: no CLS measurement completed (see remaining). hero #top h=844 = innerHeight before and after settle.
- services #services (10 .reveal: 2 header + 8 rows) after on-screen 1.6s: isIn = 5 (header1, header2, rows 01,02,03);
  rows 04-08 still opacity 0 / translateY(26px). Rows 04-05 were inside the viewport but not marked -> observer
  margin/threshold effect.
  STAGGER: transition-delay rows = 0s, .055s, .11s, .165s, .22s, .275s, .33s, .385s (first 0s vs last 0.385s, +55ms/row).
- prefers-reduced-motion: could NOT emulate (no tool exposes Emulation.setEmulatedMedia). CSS evidence found:
  @media (prefers-reduced-motion: reduce) { html{scroll-behavior:auto} *,::after,::before{animation-duration:.001ms!important;
  animation-iteration-count:1!important; transition-duration:.001ms!important} .js .reveal{opacity:1;transform:none} }
  -> a not-yet-scrolled .reveal would already be visible/opacity 1.

## 4. Regression
- 390x844: docScrollWidth 380 vs innerWidth 390 -> no overflow; #top h=844 = innerHeight. docHeight 27902.
- 320x568: docScrollWidth 310 vs innerWidth 320 -> no overflow; bodyScrollWidth 329 (clipped by body{overflow-x:hidden});
  #top h=568 = innerHeight.
- Footer vs bar at bottom (scrollY 27058 = docHeight-innerHeight): last footer <p> (disclaimer) viewport bottom 752.28,
  bar top 776.48 -> gap 24.2px, NOT covered. Deepest footer content = that <p> (absBottom 27810.3); footer box ends 27902.3.
- Console on fresh load: PENDING (last step).

## Saved files
m390-top-nobar.png, m390-scrolled-bar.png, m390-modal-open.png + res-*.json (all in this folder). report.md PENDING.
