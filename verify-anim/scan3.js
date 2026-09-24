(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const barSel = 'div.fixed[class*="z-[90]"][class*="bottom-0"]';
  const inst = (y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' });
  const bar = document.querySelector(barSel);
  const hiddenByClass = () => /translate-y-full|opacity-0/.test(bar.className);
  const full = () => {
    const cs = getComputedStyle(bar), r = bar.getBoundingClientRect();
    return { y: +window.scrollY.toFixed(0), barTop: +r.top.toFixed(1), barBottom: +r.bottom.toFixed(1), opacity: +(+cs.opacity).toFixed(2), transform: cs.transform, inert: bar.hasAttribute('inert'), hiddenByClass: hiddenByClass() };
  };
  const H = window.innerHeight, steps = 20, stepPx = H / steps;
  inst(0); await sleep(450);
  const start = full();
  const scan = [];
  for (let i = 1; i <= steps; i++) {
    const y = Math.round(stepPx * i);
    inst(y);
    await sleep(40);
    scan.push({ y, hiddenByClass: hiddenByClass(), opacity: +(+getComputedStyle(bar).opacity).toFixed(2) });
  }
  const idx = scan.findIndex((s) => !s.hiddenByClass);
  const yHit = idx >= 0 ? scan[idx].y : null;
  let below = null, at = null;
  if (yHit !== null) {
    inst(Math.max(0, yHit - Math.ceil(stepPx))); await sleep(600); below = full();
    inst(yHit); await sleep(600); at = full();
  }
  inst(0); await sleep(600);
  return { H, stepPx: +stepPx.toFixed(1), visStart: document.visibilityState, start, scan, firstVisibleY: yHit, boundaryBelow: below, boundaryAt: at, resetTop: full(), visEnd: document.visibilityState };
})()
