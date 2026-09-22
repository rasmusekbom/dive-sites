// Seastar Diving – progressive enhancement only. The site works without JS.
(function () {
  'use strict';

  // ---- mobile menu
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('mm');
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.hidden = !open;
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(menu.hidden); });
    var close = menu.querySelector('.close');
    if (close) close.addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
  }

  // ---- highlight today in the opening-hours table, and say whether we are open
  var KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  var today = KEYS[new Date().getDay()];
  var row = document.querySelector('.hours tr[data-day="' + today + '"]');
  if (row) row.classList.add('today');

  var dot = document.querySelector('.open-dot');
  if (dot && window.HOURS) {
    var now = new Date();
    var span = window.HOURS[today];
    var open = false;
    if (span && span[0]) {
      var mins = now.getHours() * 60 + now.getMinutes();
      var from = +span[0].split(':')[0] * 60 + +span[0].split(':')[1];
      var to = +span[1].split(':')[0] * 60 + +span[1].split(':')[1];
      open = mins >= from && mins < to;
    }
    dot.classList.toggle('shut', !open);
    var label = dot.parentNode.querySelector('.open-label');
    if (label) label.textContent = open ? label.dataset.open : label.dataset.shut;
  }

  // ---- booking form: prefill "what" and the message from ?type=&which=
  var form = document.querySelector('form[data-book]');
  if (form) {
    var q = new URLSearchParams(location.search);
    var which = q.get('which');
    var type = q.get('type');
    if (type) {
      var sel = form.querySelector('select[name="what"]');
      if (sel) for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === type) sel.selectedIndex = i;
    }
    if (which) {
      var msg = form.querySelector('textarea[name="message"]');
      if (msg && !msg.value) msg.value = (form.dataset.prefill || '{x}').replace('{x}', which);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var done = form.querySelector('.form-done');
      if (done) { done.hidden = false; done.setAttribute('tabindex', '-1'); done.focus(); }
    });
  }
})();
