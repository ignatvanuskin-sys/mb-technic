(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const barSel = 'div.fixed[class*="z-[90]"][class*="bottom-0"]';
  const m = () => {
    const bar = document.querySelector(barSel);
    if (!bar) return null;
    const cs = getComputedStyle(bar), r = bar.getBoundingClientRect();
    return {
      scrollY: +window.scrollY.toFixed(1), innerHeight: window.innerHeight,
      top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), h: +r.height.toFixed(2),
      transform: cs.transform, opacity: +(+cs.opacity).toFixed(3), px: cs.pointerEvents,
      inert: bar.hasAttribute('inert'), ariaHidden: bar.getAttribute('aria-hidden'),
      cls: bar.className.replace(/\s+/g, ' ').trim()
    };
  };
  const H = window.innerHeight;
  window.scrollTo(0, H); await sleep(850);
  const B = m();
  const ctaVisibleAtB = (() => { const el = document.querySelector('.hero-cta .btn-primary'); const r = el.getBoundingClientRect(); return { top: +r.top.toFixed(1), bottom: +r.bottom.toFixed(1), onScreen: r.bottom > 0 && r.top < H }; })();
  window.scrollTo(0, 0); await sleep(850);
  const C = m();
  return { H, B, ctaVisibleAtB, C };
})()
