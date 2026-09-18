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
      var n = +c.dataset.n, t0 = performance.now(), dur = 1400;
      (function step(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); c.textContent = Math.round(n * e).toLocaleString('en-US'); if (k < 1) requestAnimationFrame(step); })(t0);
    });
  }
  var stats = document.querySelector('.stats');
  if (stats && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { runCounters(); o.disconnect(); } }, { threshold: .3 }).observe(stats);

  // currency: prices are rendered in THB; convert client-side with the rates baked into the page
  var cur = null; try { cur = localStorage.getItem('cur'); } catch (e) {}
  if (!cur || !window.CURS || CURS.indexOf(cur) < 0) cur = document.body.dataset.cur || 'THB';
  var fmt = function (n) { return Math.round(n).toLocaleString(window.LOC || 'en-US'); };
  function moneyHtml(n) {
    if (cur === 'THB' || !window.RATES || !RATES[cur]) return '<b>' + n.toLocaleString('en-US') + '</b> <i>THB</i>';
    return '<b>≈ ' + fmt(n * RATES[cur]) + '</b> <i>' + cur + '</i><small>' + n.toLocaleString('en-US') + ' THB</small>';
  }
  function applyCur() {
    document.querySelectorAll('.money').forEach(function (m) { m.innerHTML = moneyHtml(+m.dataset.thb); });
    document.querySelectorAll('.cur-code').forEach(function (s) { s.textContent = cur; });
    document.querySelectorAll('.dd-menu [data-cur]').forEach(function (a) { a.classList.toggle('active', a.dataset.cur === cur); });
  }
  document.querySelectorAll('.dd-menu [data-cur]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); cur = a.dataset.cur; try { localStorage.setItem('cur', cur); } catch (x) {} applyCur(); var d = a.closest('details'); if (d) d.removeAttribute('open'); }); });
  if (window.RATES) applyCur();
  var dds = Array.prototype.slice.call(document.querySelectorAll('details.dd'));
  dds.forEach(function (d) { d.querySelector('summary').addEventListener('click', function (e) { e.preventDefault(); var was = d.open; dds.forEach(function (x) { x.removeAttribute('open'); }); if (!was) d.setAttribute('open', ''); }); });
  document.addEventListener('click', function (e) { if (!e.target.closest('details.dd')) dds.forEach(function (x) { x.removeAttribute('open'); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') dds.forEach(function (x) { x.removeAttribute('open'); }); });

  // route finder: LEGS = [{from,to,dep,arr,fare}], STOPNAMES = {key: label}
  document.querySelectorAll('.tool').forEach(function (tool) {
    var from = tool.querySelector('[name=from]'), to = tool.querySelector('[name=to]'), out = tool.querySelector('.tool-result');
    if (!from || !to || !window.LEGS) return;
    function show() {
      var leg = LEGS.filter(function (l) { return l.from === from.value && l.to === to.value; })[0];
      out.classList.add('show');
      if (!leg) { out.innerHTML = '<span class="none">' + tool.dataset.none + '</span><a class="btn btn-primary" href="' + tool.dataset.book + '">' + tool.dataset.bookLabel + '</a>'; return; }
      out.innerHTML = '<div class="times"><div><small>' + tool.dataset.dep + '</small>' + leg.dep + '</div><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg><div><small>' + tool.dataset.arr + '</small>' + leg.arr + '</div></div>' +
        '<div class="fare"><span class="money" data-thb="' + leg.fare + '">' + moneyHtml(leg.fare) + '</span> <i>' + tool.dataset.oneway + '</i></div>' +
        '<a class="btn btn-primary" href="' + tool.dataset.book + '?type=transfer&from=' + leg.from + '&to=' + leg.to + '">' + tool.dataset.bookLabel + '</a>';
    }
    tool.addEventListener('submit', function (e) { e.preventDefault(); show(); });
    show();
    from.addEventListener('change', function () { if (to.value === from.value) { var o = Array.prototype.find.call(to.options, function (x) { return x.value !== from.value; }); if (o) to.value = o.value; } show(); });
    to.addEventListener('change', show);
  });

  // charter calculator: CHARTER = {boats:[{pax,label}], itineraries:[{key,name,prices[]}]}
  var calc = document.querySelector('.calc');
  if (calc && window.CHARTER) {
    var it = calc.querySelector('[name=itinerary]'), pax = calc.querySelector('[name=pax]'), out = calc.querySelector('.calc-out');
    function update() {
      var n = Math.max(1, +pax.value || 1), item = CHARTER.itineraries.filter(function (x) { return x.key === it.value; })[0];
      var idx = -1; for (var i = 0; i < CHARTER.boats.length; i++) if (CHARTER.boats[i].pax >= n) { idx = i; break; }
      if (idx < 0) { out.innerHTML = '<div><small>' + calc.dataset.suggested + '</small><b class="too-many">' + calc.dataset.tooMany + '</b></div>'; return; }
      var b = CHARTER.boats[idx], price = item.prices[idx];
      out.innerHTML = '<div><small>' + calc.dataset.suggested + '</small><b>' + b.label + '</b></div><div><small>' + calc.dataset.perBoat + '</small><span class="money" data-thb="' + price + '">' + moneyHtml(price) + '</span></div><div><small>' + calc.dataset.perPerson + '</small><span class="money" data-thb="' + Math.round(price / n) + '">' + moneyHtml(Math.round(price / n)) + '</span></div>' +
        '<a class="btn btn-primary" href="' + calc.dataset.book + '?type=charter&itinerary=' + encodeURIComponent(item.name) + '&adults=' + n + '">' + calc.dataset.bookLabel + '</a>';
    }
    it.addEventListener('change', update); pax.addEventListener('input', update); update();
    // matrix rows link to the calculator
    document.querySelectorAll('.matrix tbody tr[data-key]').forEach(function (tr) { tr.addEventListener('click', function () { it.value = tr.dataset.key; update(); calc.scrollIntoView({ behavior: 'smooth', block: 'center' }); }); });
  }

  // booking form: prefill from the query string (?type=transfer&from=&to= | ?type=trip&trip= | ?type=charter&itinerary=&adults=)
  var bf = document.querySelector('form[name=booking]');
  if (bf) {
    var q = new URLSearchParams(location.search), type = q.get('type');
    if (type) { var r = bf.querySelector('input[name=type][value=' + type + ']'); if (r) r.checked = true; }
    var which = bf.querySelector('[name=which]');
    var pre = q.get('trip') || q.get('itinerary') || (q.get('from') && q.get('to') ? (window.STOPNAMES ? STOPNAMES[q.get('from')] + ' → ' + STOPNAMES[q.get('to')] : q.get('from') + ' → ' + q.get('to')) : '');
    if (which && pre) which.value = pre;
    if (q.get('adults')) { var a = bf.querySelector('[name=adults]'); if (a) a.value = q.get('adults'); }
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
