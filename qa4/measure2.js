(() => {
  const norm = s => (s || '').replace(/\s+/g, ' ').trim();
  const r2 = x => Math.round(x * 100) / 100;
  const hero = document.querySelector('#top');
  const hr = hero.getBoundingClientRect();
  const all = Array.from(document.querySelectorAll('body *'));
  const deepest = arr => (arr.length ? arr[arr.length - 1] : null);

  // primary CTA inside hero
  const cta = deepest(all.filter(el => norm(el.textContent) === 'Записаться на сервис' && hero.contains(el)));
  let ctaRect = null;
  if (cta) { const r = cta.getBoundingClientRect(); ctaRect = { top: r2(r.top), bottom: r2(r.bottom), height: r2(r.height) }; }

  // trust line (innermost element with the rating text)
  const tr = deepest(all.filter(el => norm(el.textContent) === '5.0 · 37 ОЦЕНОК В 2ГИС' && hero.contains(el)));
  let trRect = null;
  if (tr) { const r = tr.getBoundingClientRect(); trRect = { top: r2(r.top), bottom: r2(r.bottom), height: r2(r.height) }; }

  // fixed bottom bar
  let bar = null;
  all.forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' && cs.visibility !== 'hidden' && cs.display !== 'none') {
      const r = el.getBoundingClientRect();
      if (r.height > 8 && r.width > 50 && r.bottom > window.innerHeight - 60) {
        bar = { top: r2(r.top), bottom: r2(r.bottom), height: r2(r.height), width: r2(r.width), z: cs.zIndex };
      }
    }
  });

  return {
    vw: window.innerWidth,
    vh: window.innerHeight,
    realWindow: window.outerWidth + 'x' + window.outerHeight,
    heroH: r2(hr.height),
    heroTop: r2(hr.top),
    heroBottom: r2(hr.bottom),
    heroMinusVh: r2(hr.height - window.innerHeight),
    docScrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
    ctaHero: ctaRect,
    ctaAboveBarBy: (ctaRect && bar) ? r2(bar.top - ctaRect.bottom) : null,
    trust: trRect,
    trustAboveBarBy: (trRect && bar) ? r2(bar.top - trRect.bottom) : null,
    barTop: bar ? bar.top : null,
    barHeight: bar ? bar.height : null
  };
})()
