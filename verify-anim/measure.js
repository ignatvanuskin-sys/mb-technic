(() => {
  const grab = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName.toLowerCase(),
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 220),
      top: +r.top.toFixed(2), bottom: +r.bottom.toFixed(2), h: +r.height.toFixed(2),
      left: +r.left.toFixed(2), right: +r.right.toFixed(2),
      transform: cs.transform, opacity: cs.opacity, display: cs.display,
      visibility: cs.visibility, pointerEvents: cs.pointerEvents,
      inert: el.hasAttribute('inert'), ariaHidden: el.getAttribute('aria-hidden'),
      transition: cs.transition, delay: cs.transitionDelay,
      animName: cs.animationName, animDur: cs.animationDuration, animDelay: cs.animationDelay,
      animFill: cs.animationFillMode, animPlay: cs.animationPlayState
    };
  };
  const byText = (nodes, re) => Array.from(nodes).find((e) => re.test((e.textContent || '').replace(/\s+/g, ' ').trim()));
  const out = {
    t: Date.now(), scrollY: +window.scrollY.toFixed(1), innerWidth: window.innerWidth, innerHeight: window.innerHeight,
    docScrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth,
    overflowX: document.documentElement.scrollWidth > window.innerWidth,
    htmlClass: document.documentElement.className, bodyClass: document.body.className,
    readyState: document.readyState
  };

  out.bar = grab(document.querySelector('div.fixed[class*="z-[90]"][class*="bottom-0"]'));

  const header = document.querySelector('header');
  out.headerVisible = header ? getComputedStyle(header).display !== 'none' : false;
  const hbtn = header ? byText(header.querySelectorAll('button,a'), /Записаться/) : null;
  out.headerBtn = grab(hbtn);

  out.heroPhoto = grab(document.querySelector('.hero-photo'));
  out.heroCta = grab(document.querySelector('.hero-cta'));
  out.heroCtaBtn = grab(document.querySelector('.hero-cta .btn-primary'));
  out.heroSec = grab(document.querySelector('#top'));
  out.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const svc = document.querySelector('#services');
  if (svc) {
    const rows = svc.querySelectorAll('[class*="reveal"]');
    out.svc = { count: rows.length, isIn: Array.from(rows).filter((r) => r.classList.contains('is-in')).length, top: +svc.getBoundingClientRect().top.toFixed(0), h: +svc.getBoundingClientRect().height.toFixed(0) };
    out.svcRows = Array.from(rows).slice(0, 12).map((r) => ({ n: (r.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 22), isIn: r.classList.contains('is-in'), opacity: getComputedStyle(r).opacity, delay: getComputedStyle(r).transitionDelay, transform: getComputedStyle(r).transform }));
  }
  out.isInTotal = document.querySelectorAll('.is-in').length;
  out.isInClasses = Array.from(document.querySelectorAll('.is-in')).slice(0, 10).map((e) => (typeof e.className === 'string' ? e.className : '').slice(0, 80));

  const ft = document.querySelector('footer');
  out.footer = grab(ft);
  if (ft) {
    let last = null, lastBottom = -1;
    ft.querySelectorAll('p, div, span, a').forEach((p) => { const b = p.getBoundingClientRect().bottom; if (b > lastBottom && (p.textContent || '').trim().length > 3) { lastBottom = b; last = p; } });
    out.footerLastText = last ? { text: (last.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90), tag: last.tagName.toLowerCase(), bottom: +last.getBoundingClientRect().bottom.toFixed(2), top: +last.getBoundingClientRect().top.toFixed(2) } : null;
    out.footerBottomAbs = +(ft.getBoundingClientRect().bottom + window.scrollY).toFixed(2);
  }
  out.docHeight = document.documentElement.scrollHeight;
  return out;
})()
