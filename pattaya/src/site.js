// Progressive enhancement only: menus, reveal-on-scroll, counters, forms. The site works without it.
document.documentElement.classList.replace('no-js', 'js');
(function () {
  var burger = document.querySelector('.burger'), mm = document.getElementById('mm');
  function openMenu() { mm.hidden = false; burger.setAttribute('aria-expanded', 'true'); document.body.classList.add('menu-open'); mm.querySelector('a,button,summary').focus(); }
  function closeMenu() { if (mm.hidden) return; mm.hidden = true; burger.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); burger.focus(); }
  if (burger && mm) {
    burger.addEventListener('click', openMenu);
    mm.querySelector('.close').addEventListener('click', closeMenu);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMenu(); document.querySelectorAll('.nav-links .open').forEach(function (li) { li.classList.remove('open'); li.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false'); }); } });
  }
  // desktop sub-menus: toggle buttons for keyboard/touch
  document.querySelectorAll('.sub-toggle').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var li = b.parentElement, open = !li.classList.contains('open');
      document.querySelectorAll('.nav-links .open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false'); });
      li.classList.toggle('open', open); b.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav-links')) document.querySelectorAll('.nav-links .open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.sub-toggle').setAttribute('aria-expanded', 'false'); }); });

  // reveal on scroll
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }); }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rv.forEach(function (el) { io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  // counters
  var counted = false;
  function runCounters() {
    if (counted) return; counted = true;
    document.querySelectorAll('.count').forEach(function (c) {
      var n = +c.dataset.n, t0 = performance.now(), dur = 1400;
      (function step(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); c.textContent = Math.round(n * e).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(step); })(t0);
    });
  }
  var stats = document.querySelector('.stats');
  if (stats && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { runCounters(); o.disconnect(); } }, { threshold: .3 }).observe(stats);

  // booking form: preselect program from ?program=
  var q = new URLSearchParams(location.search), program = q.get('program'), sel = document.getElementById('program'), what = document.getElementById('what');
  if (program && sel) {
    var opt = Array.prototype.find.call(sel.options, function (o) { return o.text.toLowerCase().indexOf(program.toLowerCase().split(' ')[0]) === 0; });
    if (opt && /try|fun|snorkel/i.test(program)) sel.value = opt.value; else { sel.value = sel.options[sel.options.length - 1].value; if (what) what.value = program; }
  }
  // forms: POST (Netlify) with a mailto fallback when there is no form backend (static demo)
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = f.querySelector('.form-note'), btn = f.querySelector('button[type=submit]'), data = new FormData(f);
      if (data.get('bot-field')) return;
      var lines = []; data.forEach(function (v, k) { if (k !== 'form-name' && k !== 'bot-field' && v) lines.push(k + ': ' + v); });
      var mailto = 'mailto:' + f.dataset.mail + '?subject=' + encodeURIComponent(f.dataset.subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      var orig = btn.textContent; btn.disabled = true; btn.textContent = btn.dataset.sending || orig;
      fetch(f.action, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() })
        .then(function (r) { if (!r.ok) throw new Error(r.status); note.textContent = note.dataset.ok; f.reset(); })
        .catch(function () { note.textContent = note.dataset.fallback; location.href = mailto; })
        .finally(function () { btn.disabled = false; btn.textContent = orig; });
    });
  });
})();
