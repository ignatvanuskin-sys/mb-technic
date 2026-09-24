(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const barSel = 'div.fixed[class*="z-[90]"][class*="bottom-0"]';
  const inst = (y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' });
  const m = () => {
    const bar = document.querySelector(barSel);
    const cs = getComputedStyle(bar), r = bar.getBoundingClientRect();
    return { y: +window.scrollY.toFixed(0), barTop: +r.top.toFixed(1), barBottom: +r.bottom.toFixed(1), opacity: +(+cs.opacity).toFixed(2), inert: bar.hasAttribute('inert'), hidden: /translate-y-full|opacity-0/.test(bar.className) };
  };
  const H = window.innerHeight, steps = 17, stepPx = H / steps;
  inst(0); await sleep(600);
  const scan = [];
  for (let i = 1; i <= steps; i++) { inst(Math.round(stepPx * i)); await sleep(70); scan.push(m()); }
  const firstIdx = scan.findIndex((s) => !s.hidden);
  const yHit = firstIdx >= 0 ? scan[firstIdx].y : null;
  let below = null, at = null;
  if (yHit !== null) {
    inst(Math.max(0, yHit - 10)); await sleep(650); below = m();
    inst(yHit); await sleep(650); at = m();
  }
  inst(0); await sleep(650);
  return { H, stepPx: +stepPx.toFixed(1), scan, firstVisibleY: yHit, boundaryBelow: below, boundaryAt: at, resetTop: m() };
})()
