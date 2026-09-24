(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const barSel = 'div.fixed[class*="z-[90]"][class*="bottom-0"]';
  const m = () => {
    const bar = document.querySelector(barSel);
    if (!bar) return null;
    const cs = getComputedStyle(bar);
    const r = bar.getBoundingClientRect();
    return {
      scrollY: +window.scrollY.toFixed(1),
      top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), h: +r.height.toFixed(2),
      transform: cs.transform, opacity: +(+cs.opacity).toFixed(3), px: cs.pointerEvents,
      inert: bar.hasAttribute('inert'), ariaHidden: bar.getAttribute('aria-hidden'),
      cls: bar.className.replace(/\s+/g, ' ').trim()
    };
  };

  // ---- CLS (layout shift) ----
  let clsValue = null, clsErr = null;
  try {
    clsValue = 0;
    const po = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) clsValue += e.value; });
    po.observe({ type: 'layout-shift', buffered: true });
    await sleep(400);
    po.disconnect();
  } catch (e) { clsErr = String(e); }

  const out = {
    innerWidth: window.innerWidth, innerHeight: window.innerHeight,
    docScrollWidth: document.documentElement.scrollWidth,
    docHeight: document.documentElement.scrollHeight,
    clsValue: clsValue === null ? null : +clsValue.toFixed(5), clsErr,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const hero = document.querySelector('#top');
  const photo = document.querySelector('.hero-photo');
  const cta = document.querySelector('.hero-cta');
  const ctaBtn = document.querySelector('.hero-cta .btn-primary');
  const hr = hero.getBoundingClientRect(), pr = photo.getBoundingClientRect(), br = ctaBtn.getBoundingClientRect();
  out.hero = { top: +hr.top.toFixed(2), h: +hr.height.toFixed(2), overflowY: getComputedStyle(hero).overflowY };
  out.photo = { transform: getComputedStyle(photo).transform, opacity: getComputedStyle(photo).opacity, left: +pr.left.toFixed(2), right: +pr.right.toFixed(2), w: +pr.width.toFixed(2) };
  out.heroCta = { opacity: getComputedStyle(cta).opacity, transform: getComputedStyle(cta).transform };
  out.heroCtaBtn = { top: +br.top.toFixed(2), bottom: +br.bottom.toFixed(2), w: +br.width.toFixed(2), display: getComputedStyle(ctaBtn).display, text: ctaBtn.textContent.trim().toUpperCase().slice(0, 40) };

  // ---- State A ----
  window.scrollTo(0, 0); await sleep(700);
  out.A = m();

  // ---- threshold scan (20 steps up to one viewport) ----
  const H = window.innerHeight, steps = 20;
  const flip = /translate-y-full|opacity-0/;
  const scan = [];
  for (let i = 1; i <= steps; i++) {
    const y = Math.round((H * i) / steps);
    window.scrollTo(0, y);
    await sleep(70);
    const b = m();
    scan.push({ y, opacity: b.opacity, hiddenByClass: flip.test(b.cls), inert: b.inert });
  }
  out.scan = scan;
  const first = scan.find((s) => !s.hiddenByClass);
  out.thresholdFirstClassFlip = first ? first.y : null;

  // ---- boundary confirmation around the flip ----
  if (first) {
    const yb = first.y;
    window.scrollTo(0, Math.max(0, yb - 20)); await sleep(800);
    out.boundaryBelow = m();
    window.scrollTo(0, yb); await sleep(800);
    out.boundaryAt = m();
  }

  // ---- State B (exactly one viewport) ----
  window.scrollTo(0, H); await sleep(900);
  out.B = m();

  // ---- State C (back to top) ----
  window.scrollTo(0, 0); await sleep(900);
  out.C = m();
  return out;
})()
