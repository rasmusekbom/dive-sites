// Progressive enhancement only: menus, reveal-on-scroll, counters, currency, route finder, charter calculator, forms.
// The site works without it (timetable and price matrix are plain HTML).
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
      var n = +c.dataset.n, t0 = performance.now(), dur = 1400; if (c.dataset.plain) { c.textContent = String(n); return; }
      (function step(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); c.textContent = Math.round(n * e).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(step); })(t0);
    });
  }
  var stats = document.querySelector('.stats');
  if (stats && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { runCounters(); o.disconnect(); } }, { threshold: .3 }).observe(stats);

  // currency: prices are rendered in PHP; convert client-side with the rates baked into the page
  var cur = null; try { cur = localStorage.getItem('cur'); } catch (e) {}
  if (!cur || !window.CURS || CURS.indexOf(cur) < 0) cur = document.body.dataset.cur || 'PHP';
  var fmt = function (n) { return Math.round(n).toLocaleString(window.LOC || 'en-US'); };
  function moneyHtml(n) {
    if (cur === 'PHP' || !window.RATES || !RATES[cur]) return '<b>₱' + n.toLocaleString('en-US') + '</b>';
    return '<b>≈ ' + fmt(n * RATES[cur]) + '</b> <i>' + cur + '</i><small>₱' + n.toLocaleString('en-US') + '</small>';
  }
  function applyCur() {
    document.querySelectorAll('.money').forEach(function (m) { m.innerHTML = moneyHtml(+m.dataset.php); });
    document.querySelectorAll('.cur-code').forEach(function (s) { s.textContent = cur; });
    document.querySelectorAll('.dd-menu [data-cur]').forEach(function (a) { a.classList.toggle('active', a.dataset.cur === cur); });
  }
  document.querySelectorAll('.dd-menu [data-cur]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); cur = a.dataset.cur; try { localStorage.setItem('cur', cur); } catch (x) {} applyCur(); var d = a.closest('details'); if (d) d.removeAttribute('open'); }); });
  if (window.RATES) applyCur();
  var dds = Array.prototype.slice.call(document.querySelectorAll('details.dd'));
  dds.forEach(function (d) { d.querySelector('summary').addEventListener('click', function (e) { e.preventDefault(); var was = d.open; dds.forEach(function (x) { x.removeAttribute('open'); }); if (!was) d.setAttribute('open', ''); }); });
  document.addEventListener('click', function (e) { if (!e.target.closest('details.dd')) dds.forEach(function (x) { x.removeAttribute('open'); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dds.forEach(function (x) { x.removeAttribute('open'); }); });

  // session recommender: RECO = [[exp, want, slug]], PRODUCTS = {slug: {name,url,price,short,group,level,duration}}
  document.querySelectorAll('.tool.reco').forEach(function (tool) {
    var exp = tool.querySelector('[name=exp]'), want = tool.querySelector('[name=want]'), out = tool.querySelector('.tool-result');
    if (!exp || !want || !window.RECO || !window.PRODUCTS) return;
    function show() {
      var hit = RECO.filter(function (r) { return r[0] === exp.value && r[1] === want.value; })[0], p = hit && PRODUCTS[hit[2]];
      out.classList.add('show');
      if (!p) { out.innerHTML = ''; return; }
      out.innerHTML = '<div class="reco-card"><small>' + tool.dataset.suggested + '</small><b>' + p.name + '</b><span class="reco-meta">' + p.group + ' · ' + p.level + ' · ' + p.duration + '</span><p>' + p.short + '</p></div>' +
        '<div class="fare">' + (p.tiered ? '<small>' + tool.dataset.from + '</small> ' : '') + '<span class="money" data-php="' + p.price + '">' + moneyHtml(p.price) + '</span> <i>' + tool.dataset.per + '</i></div>' +
        '<a class="btn btn-primary" href="' + p.url + '">' + tool.dataset.book + '</a>';
    }
    tool.addEventListener('submit', function (e) { e.preventDefault(); show(); });
    show(); exp.addEventListener('change', show); want.addEventListener('change', show);
  });

  // booking form: prefill from the query string (?type=course|fundive|shoot|stay&which=&people=)
  var bf = document.querySelector('form[name=booking]');
  if (bf) {
    var q = new URLSearchParams(location.search), type = q.get('type');
    if (type) { var r = bf.querySelector('input[name=type][value=' + type + ']'); if (r) r.checked = true; }
    var which = bf.querySelector('[name=which]');
    var pre = q.get('which') || '';
    if (which && pre) which.value = pre;
    if (q.get('people')) { var pp = bf.querySelector('[name=people]'); if (pp) pp.value = q.get('people'); }
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
