(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const inst = (y) => window.scrollTo({ top: y, left: 0, behavior: 'instant' });
  const barSel = 'div.fixed[class*="z-[90]"][class*="bottom-0"]';
  const docH = document.documentElement.scrollHeight;
  inst(docH); await sleep(1000);

  const bar = document.querySelector(barSel);
  const bcs = getComputedStyle(bar), br = bar.getBoundingClientRect();

  const absBottom = (el) => +(el.getBoundingClientRect().bottom + window.scrollY).toFixed(2);
  let lastEl = null, maxB = -1;
  document.querySelectorAll('body *').forEach((el) => { const t = (el.textContent || '').trim(); if (t.length < 3) return; if (el.children.length > 0 && el.tagName !== 'P' && el.tagName !== 'SPAN' && el.tagName !== 'A') return; const b = absBottom(el); if (b > maxB) { maxB = b; lastEl = el; } });

  const footers = Array.from(document.querySelectorAll('footer,[role="contentinfo"]'));
  const lastFooter = footers.length ? footers[footers.length - 1] : null;
  const lastFooterP = lastFooter ? Array.from(lastFooter.querySelectorAll('p')).pop() : null;

  return {
    scrollY: +window.scrollY.toFixed(1), docHeight: docH, innerHeight: window.innerHeight,
    bar: { top: +br.top.toFixed(2), bottom: +br.bottom.toFixed(2), opacity: +(+bcs.opacity).toFixed(2), inert: bar.hasAttribute('inert'), text: (bar.innerText || '').replace(/\s+/g, ' ').trim() },
    footerCount: footers.length,
    lastFooter: lastFooter ? { tag: lastFooter.tagName.toLowerCase(), absBottom: absBottom(lastFooter), absTop: +(lastFooter.getBoundingClientRect().top + window.scrollY).toFixed(2), text: (lastFooter.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160) } : null,
    lastFooterParagraph: lastFooterP ? { text: (lastFooterP.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120), absBottom: absBottom(lastFooterP), viewportBottom: +lastFooterP.getBoundingClientRect().bottom.toFixed(2) } : null,
    lastTextNodeOverall: lastEl ? { tag: lastEl.tagName.toLowerCase(), text: (lastEl.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 120), absBottom: maxB, viewportBottom: +lastEl.getBoundingClientRect().bottom.toFixed(2) } : null,
    // overlap test in viewport coords at the very bottom of the page
    gapFooterToBar: lastEl ? +(br.top - lastEl.getBoundingClientRect().bottom).toFixed(2) : null,
    gapFooterParagraphToBar: lastFooterP ? +(br.top - lastFooterP.getBoundingClientRect().bottom).toFixed(2) : null
  };
})()
