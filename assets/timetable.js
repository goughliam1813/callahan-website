(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static\b/.test(location.search);

  // the board: times relative to now, a live clock, rows that arrive line by line, rows that open
  var board = document.getElementById('board');
  if (board) {
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var hm = function (d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
    var clock = document.getElementById('clock');
    var rows = [].slice.call(board.querySelectorAll('tbody tr.row'));
    var offsets = [-16, -12, -6, -4, -1];
    var setTimes = function () {
      var now = new Date();
      clock.textContent = hm(now);
      rows.forEach(function (r, i) { var d = new Date(now.getTime() + offsets[i] * 60000); r.querySelector('.time').textContent = hm(d); });
    };
    setTimes();
    setInterval(setTimes, 15000);

    if (!reduce) {
      rows.forEach(function (r) { r.classList.add('wait'); });
      rows.forEach(function (r, i) { setTimeout(function () { r.classList.remove('wait'); r.classList.add('in'); }, 260 + i * 170); });
    }

    var toggle = function (r) {
      var d = document.getElementById(r.getAttribute('aria-controls'));
      var open = r.getAttribute('aria-expanded') === 'true';
      rows.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); document.getElementById(o.getAttribute('aria-controls')).hidden = true; });
      if (!open) { r.setAttribute('aria-expanded', 'true'); d.hidden = false; }
    };
    rows.forEach(function (r) {
      r.addEventListener('click', function () { toggle(r); });
      r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(r); } });
    });
  }

  // copy buttons
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () { b.textContent = 'Copied'; b.classList.add('done'); setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('done'); }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
    });
  });
})();

// worked examples: tabs with arrow-key support
(function () {
  document.querySelectorAll('[role="tablist"]').forEach(function (list) {
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    var select = function (t, focus) {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', on ? 'true' : 'false');
        o.tabIndex = on ? 0 : -1;
        document.getElementById(o.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(t, false); });
      t.addEventListener('keydown', function (e) {
        var n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : null;
        if (n === null) return;
        e.preventDefault(); select(tabs[(n + tabs.length) % tabs.length], true);
      });
    });
  });
})();
