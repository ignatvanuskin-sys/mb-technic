(() => {
  const norm = s => (s || '').replace(/\s+/g, ' ').trim();
  const out = {};
  out.url = location.href;
  out.innerWidth = window.innerWidth;
  out.innerHeight = window.innerHeight;
  out.outerWidth = window.outerWidth;
  out.outerHeight = window.outerHeight;
  out.dpr = window.devicePixelRatio;
  out.docScrollWidth = document.documentElement.scrollWidth;
  out.docClientWidth = document.documentElement.clientWidth;
  out.bodyScrollWidth = document.body.scrollWidth;

  const hero = document.querySelector('#top');
  if (hero) {
    const r = hero.getBoundingClientRect();
    out.hero = { top: r.top, bottom: r.bottom, height: r.height, left: r.left, width: r.width };
  } else {
    out.hero = null;
  }

  const all = Array.from(document.querySelectorAll('body *'));
  const inHero = el => hero && hero.contains(el);

  // --- CTA candidates: exact label «Записаться на сервис» ---
  const ctaAll = all.filter(el => norm(el.textContent) === 'Записаться на сервис');
  const deepest = arr => arr.length ? arr[arr.length - 1] : null;

  const ctaHeroCandidates = ctaAll.filter(inHero);
  const ctaHero = deepest(ctaHeroCandidates);
  if (ctaHero) {
    const r = ctaHero.getBoundingClientRect();
    out.ctaHero = {
      tag: ctaHero.tagName, cls: String(ctaHero.className).slice(0, 90),
      top: r.top, bottom: r.bottom, height: r.height, left: r.left, right: r.right
    };
  } else {
    out.ctaHero = null;
  }

  const ctaPage = deepest(ctaAll);
  if (ctaPage) {
    const r = ctaPage.getBoundingClientRect();
    out.ctaPageLowest = {
      tag: ctaPage.tagName, cls: String(ctaPage.className).slice(0, 90),
      top: r.top, bottom: r.bottom, height: r.height
    };
  }

  // --- trust line ---
  const trustMatches = all.filter(el => {
    const t = norm(el.textContent);
    return t.includes('2ГИС') || t.includes('оценок') || t.includes('5.0');
  });
  out.trustCandidates = trustMatches.map(el => {
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName, cls: String(el.className).slice(0, 90),
      text: norm(el.textContent).slice(0, 90),
      top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), height: +r.height.toFixed(2),
      inHero: inHero(el)
    };
  });

  const trust = deepest(trustMatches);
  if (trust) {
    const r = trust.getBoundingClientRect();
    out.trustDeepest = {
      tag: trust.tagName, text: norm(trust.textContent).slice(0, 90),
      top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), height: +r.height.toFixed(2),
      inHero: inHero(trust)
    };
  }

  // --- fixed elements near bottom ---
  out.fixedBottom = [];
  all.forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' && cs.visibility !== 'hidden' && cs.display !== 'none') {
      const r = el.getBoundingClientRect();
      if (r.height > 8 && r.width > 50 && r.bottom > window.innerHeight - 150) {
        out.fixedBottom.push({
          tag: el.tagName, cls: String(el.className).slice(0, 90),
          top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), height: +r.height.toFixed(2),
          width: +r.width.toFixed(2), z: cs.zIndex
        });
      }
    }
  });

  return out;
})()
