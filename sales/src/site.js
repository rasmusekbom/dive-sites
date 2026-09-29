// Before/after sliders, view toggle, header shadow, and the mailto contact form. No dependencies.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------------------------------------------------------------- sliders
  // Pointer drag anywhere on the frame (touch-action: pan-y keeps vertical scrolling), keyboard via the hidden range.
  for (const frame of document.querySelectorAll('.frame')) {
    const range = frame.querySelector('.range');
    if (!range) continue;
    const tags = frame.querySelectorAll('.tag');
    const set = p => {
      p = Math.max(0, Math.min(100, p));
      frame.style.setProperty('--pos', p + '%');
      range.value = Math.round(p);
      if (tags[0]) tags[0].style.opacity = p < 16 ? 0 : 1;
      if (tags[1]) tags[1].style.opacity = p > 84 ? 0 : 1;
    };
    const fromEvent = e => { const r = frame.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
    frame.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      frame.dataset.touched = '1';
      frame.classList.add('dragging');
      frame.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    frame.addEventListener('pointermove', e => { if (frame.classList.contains('dragging')) fromEvent(e); });
    const stop = () => frame.classList.remove('dragging');
    frame.addEventListener('pointerup', stop);
    frame.addEventListener('pointercancel', stop);
    range.addEventListener('input', () => { frame.dataset.touched = '1'; set(+range.value); });
    frame.set = set;
    set(50);
  }

  // A short sweep the first time a slider comes into view, so people see that it moves. Stops as soon as they touch it.
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        io.unobserve(en.target);
        const f = en.target;
        const keys = [[0, 50], [500, 28], [1100, 72], [1600, 50]];
        const t0 = performance.now();
        const tick = now => {
          if (f.dataset.touched) return;
          const t = now - t0;
          let i = keys.findIndex(k => k[0] > t);
          if (i < 0) return f.set(50);
          const [ta, a] = keys[i - 1], [tb, b] = keys[i];
          const k = (t - ta) / (tb - ta), e = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
          f.set(a + (b - a) * e);
          requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 300);
      }
    }, { threshold: .6 });
    document.querySelectorAll('.ba .pane:not([hidden]) .frame').forEach(f => io.observe(f));
  }

  // ---------------------------------------------------------------- desktop / mobile toggle
  for (const ba of document.querySelectorAll('.ba')) {
    const btns = ba.querySelectorAll('.views button');
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', x === b));
      ba.querySelectorAll('.pane').forEach(p => { p.hidden = p.dataset.view !== b.dataset.view; });
    }));
  }

  // ---------------------------------------------------------------- header
  const top = document.querySelector('.top');
  const onScroll = () => top && top.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------------------------------------------------------------- contact form → mail app
  const form = document.getElementById('utkast-form');
  let plan = '';
  document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => { plan = a.dataset.plan; }));
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const to = form.dataset.email;
    if (!to) { alert('Kontaktadressen är inte inlagd ännu.'); return; }
    const head = [`Namn: ${d.namn}`, `Företag: ${d.foretag}`, d.sajt && `Nuvarande sajt: ${d.sajt}`, d.telefon && `Telefon: ${d.telefon}`, plan && `Intresserad av: ${plan}`];
    const body = head.filter(Boolean).join('\n') + (d.meddelande ? '\n\n' + d.meddelande : '');
    location.href = `mailto:${to}?subject=${encodeURIComponent('Gratis utkast: ' + d.foretag)}&body=${encodeURIComponent(body)}`;
  });
})();
