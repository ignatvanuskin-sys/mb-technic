(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const barSel = 'div.fixed[class*="z-[90]"][class*="bottom-0"]';
  const inst = (y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' });
  const m = () => {
    const bar = document.querySelector(barSel);
    const cs = getComputedStyle(bar), r = bar.getBoundingClientRect();
    return {
      scrollY: +window.scrollY.toFixed(1), innerHeight: window.innerHeight,
      barTop: +r.top.toFixed(2), barBottom: +r.bottom.toFixed(2), barH: +r.height.toFixed(2),
      transform: cs.transform, opacity: +(+cs.opacity).toFixed(3), pointerEvents: cs.pointerEvents,
      inert: bar.hasAttribute('inert'), ariaHidden: bar.getAttribute('aria-hidden'),
      hidesViaClass: /translate-y-full|opacity-0/.test(bar.className)
    };
  };
  const H = window.innerHeight;
  const vis = () => document.visibilityState;

  inst(0); await sleep(750);
  const A = m();
  const ctaA = (() => { const el = document.querySelector('.hero-cta .btn-primary'); const r = el.getBoundingClientRect(); return { top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1), onScreen: r.bottom > 0 && r.top < H, opacity: getComputedStyle(el.closest('.hero-cta')).opacity }; })();

  inst(H); await sleep(950);
  const B = m();
  const ctaB = (() => { const el = document.querySelector('.hero-cta .btn-primary'); const r = el.getBoundingClientRect(); return { top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1), onScreen: r.bottom > 0 && r.top < H }; })();

  inst(0); await sleep(950);
  const C = m();

  return { H, visA: vis(), A, ctaA, B, ctaB, C, visEnd: vis() };
})()
