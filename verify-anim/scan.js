(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const barSel = 'div.fixed[class*="z-[90]"][class*="bottom-0"]';
  const m = () => {
    const bar = document.querySelector(barSel);
    const cs = getComputedStyle(bar), r = bar.getBoundingClientRect();
    return {
      scrollY: +window.scrollY.toFixed(1), top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2),
      opacity: +(+cs.opacity).toFixed(3), px: cs.pointerEvents, inert: bar.hasAttribute('inert'),
      hiddenByClass: /translate-y-full|opacity-0/.test(bar.className)
    };
  };
  const H = window.innerHeight, steps = 17;
  window.scrollTo(0, 0); await sleep(600);
  const scan = [];
  for (let i = 1; i <= steps; i++) {
    const y = Math.round((H * i) / steps);
    window.scrollTo(0, y);
    await sleep(55);
    scan.push(m());
  }
  const firstIdx = scan.findIndex((s) => !s.hiddenByClass);
  const yb = firstIdx >= 0 ? scan[firstIdx].scrollY : null;
  let below = null, at = null;
  if (yb !== null) {
    window.scrollTo(0, Math.max(0, yb - 15)); await sleep(650); below = m();
    window.scrollTo(0, yb); await sleep(650); at = m();
  }
  window.scrollTo(0, 0); await sleep(650);
  return { H, step: +(H / steps).toFixed(2), scan, firstVisibleY: yb, boundaryBelow: below, boundaryAt: at, resetTop: m() };
})()
