(() => {
  const out = {};
  out.innerWidth = window.innerWidth;
  out.innerHeight = window.innerHeight;
  out.scrollY = window.scrollY;
  out.docScrollWidth = document.documentElement.scrollWidth;
  out.bodyScrollWidth = document.body.scrollWidth;
  out.hasHorizontalOverflow = (document.documentElement.scrollWidth > window.innerWidth);

  const info = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      cls: (el.className && typeof el.className === 'string') ? el.className : null,
      text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
      top: +r.top.toFixed(2),
      bottom: +r.bottom.toFixed(2),
      height: +r.height.toFixed(2),
      left: +r.left.toFixed(2),
      right: +r.right.toFixed(2),
      width: +r.width.toFixed(2),
      position: cs.position,
      transform: cs.transform,
      opacity: cs.opacity,
      visibility: cs.visibility,
      display: cs.display,
      pointerEvents: cs.pointerEvents,
      zIndex: cs.zIndex,
      inert: el.hasAttribute('inert'),
      ariaHidden: el.getAttribute('aria-hidden'),
      transition: cs.transition,
      transitionDelay: cs.transitionDelay
    };
  };

  // 1. All fixed/sticky elements
  out.fixedSticky = [];
  document.querySelectorAll('*').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' || cs.position === 'sticky') {
      const r = el.getBoundingClientRect();
      out.fixedSticky.push(info(el));
    }
  });

  // 2. Elements whose own text is exactly/almost "Записаться..." (leaf-ish)
  out.bookingPieces = [];
  document.querySelectorAll('a,button,[role="button"],div,span').forEach((el) => {
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (t.length && t.length <= 40 && /Записаться/i.test(t) && el.children.length <= 1) {
      out.bookingPieces.push({ el: info(el), parent: info(el.parentElement), gp: info(el.parentElement && el.parentElement.parentElement), ggp: info(el.parentElement && el.parentElement.parentElement && el.parentElement.parentElement.parentElement) });
    }
  });

  // 3. hero
  const hero = document.querySelector('#top');
  out.hero = hero ? info(hero) : null;
  if (hero) {
    const imgs = hero.querySelectorAll('img');
    out.heroImgs = Array.from(imgs).map((i) => {
      const r = i.getBoundingClientRect();
      const cs = getComputedStyle(i);
      return { cls: typeof i.className === 'string' ? i.className : null, src: (i.currentSrc || i.src || '').slice(-60), transform: cs.transform, opacity: cs.opacity, top: +r.top.toFixed(1), height: +r.height.toFixed(1), width: +r.width.toFixed(1) };
    });
    const medias = hero.querySelectorAll('picture, video, [class*="photo"], [class*="image"], [class*="bg"]');
    out.heroMedia = Array.from(medias).slice(0, 12).map((m) => {
      const cs = getComputedStyle(m);
      const r = m.getBoundingClientRect();
      return { tag: m.tagName.toLowerCase(), cls: typeof m.className === 'string' ? m.className : null, transform: cs.transform, opacity: cs.opacity, top: +r.top.toFixed(1), right: +r.right.toFixed(1), width: +r.width.toFixed(1) };
    });
  }

  // 4. service rows
  const isIn = document.querySelectorAll('.is-in');
  out.isInCount = isIn.length;
  out.isInSample = Array.from(isIn).slice(0, 30).map((e) => ({ tag: e.tagName.toLowerCase(), cls: typeof e.className === 'string' ? e.className : null, delay: getComputedStyle(e).transitionDelay, dur: getComputedStyle(e).transitionDuration, opacity: getComputedStyle(e).opacity }));
  const svcCandidates = document.querySelectorAll('[class*="service" i]');
  out.serviceClassCount = svcCandidates.length;
  out.serviceClasses = Array.from(new Set(Array.from(svcCandidates).slice(0, 60).map((e) => typeof e.className === 'string' ? e.className : ''))).slice(0, 40);

  // 5. sections list
  out.sections = Array.from(document.querySelectorAll('section, [id]')).slice(0, 40).map((s) => ({ id: s.id || null, cls: typeof s.className === 'string' ? s.className : null, top: +s.getBoundingClientRect().top.toFixed(0), opacity: getComputedStyle(s).opacity }));

  return out;
})()
