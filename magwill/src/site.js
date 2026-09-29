// Magwill – progressive enhancement only. The site works without JS.
(function () {
  'use strict';

  // ---- mobile menu
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mm');
  function setMenu(open) {
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) { var c = menu.querySelector('.close'); if (c) c.focus(); }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.querySelector('.close').addEventListener('click', function () { setMenu(false); burger.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080 && !menu.hidden) setMenu(false); });
  }

  // ---- intresseanmälan: preselect the course from ?kurs=<slug>, validate, show the demo notice
  var form = document.querySelector('form[data-apply]');
  if (!form) return;
  var kurs = new URLSearchParams(location.search).get('kurs');
  var sel = form.querySelector('select[name="course"]');
  if (kurs && sel) for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === kurs) sel.selectedIndex = i;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('[name="name"]'), email = form.querySelector('[name="email"]');
    var bad = [];
    if (!name.value.trim()) bad.push(name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) bad.push(email);
    [name, email].forEach(function (f) { f.setAttribute('aria-invalid', String(bad.indexOf(f) > -1)); });
    var err = form.querySelector('.form-err'), done = form.querySelector('.form-done');
    err.hidden = !bad.length;
    if (bad.length) { bad[0].focus(); return; }
    done.hidden = false;
    done.focus();
  });
})();
