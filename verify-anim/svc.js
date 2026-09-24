(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const inst = (y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' });
  const out = {};

  // modal closed?
  const modal = Array.from(document.querySelectorAll('div')).find((el) => { const cs = getComputedStyle(el); return el.getAttribute('role') === 'dialog' && +cs.zIndex === 120; });
  out.modalAfterEscape = modal ? { display: getComputedStyle(modal).display, visible: getComputedStyle(modal).display !== 'none' } : null;
  out.inputsNow = document.querySelectorAll('input,select,textarea').length;

  // --- prefers-reduced-motion: CSSOM evidence ---
  const rmRules = [];
  try {
    for (const ss of Array.from(document.styleSheets)) {
      let rules; try { rules = ss.cssRules; } catch (e) { continue; }
      const walk = (list) => { for (const r of Array.from(list || [])) { if (r.type === 4 && /prefers-reduced-motion/.test(r.conditionText || '')) { rmRules.push({ media: r.conditionText, css: (r.cssText || '').replace(/\s+/g, ' ').slice(0, 700) }); } else if (r.cssRules) { walk(r.cssRules); } } };
      walk(rules);
    }
  } catch (e) { out.rmErr = String(e); }
  out.reducedMotionRules = rmRules;
  out.rmMatchesNow = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- services reveal ---
  const svc = document.querySelector('#services');
  const svcTop = svc.getBoundingClientRect().top + window.scrollY;
  const rowsOf = () => Array.from(svc.querySelectorAll('[class*="reveal"]'));
  inst(svcTop + 40); await sleep(1600);
  const rows = rowsOf();
  out.svcViewportTop = m => 0;
  out.svc = {
    scrollY: +window.scrollY.toFixed(0),
    svcRectTop: +svc.getBoundingClientRect().top.toFixed(0),
    svcHeight: +svc.getBoundingClientRect().height.toFixed(0),
    rows: rows.length,
    isInAfter1600ms: rows.filter((r) => r.classList.contains('is-in')).length,
    details: rows.map((r) => ({ label: (r.querySelector('h3,span,div') ? (r.textContent || '') : '').replace(/\s+/g, ' ').trim().slice(0, 26), isIn: r.classList.contains('is-in'), delay: getComputedStyle(r).transitionDelay, dur: getComputedStyle(r).transitionDuration, opacity: getComputedStyle(r).opacity, transform: getComputedStyle(r).transform, visible: (() => { const b = r.getBoundingClientRect(); return b.bottom > 0 && b.top < window.innerHeight; })() }))
  };
  out.isInTotalPage = document.querySelectorAll('.is-in').length;
  return out;
})()
