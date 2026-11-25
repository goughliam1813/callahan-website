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

// live boards: play a run row by row, then loop. The markup already shows the finished run.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static\b/.test(location.search);
  document.querySelectorAll('[data-live]').forEach(function (board) {
    if (reduce) return;
    var kind = board.getAttribute('data-live');
    var rows = [].slice.call(board.querySelectorAll('tr.lv'));
    var phase = board.querySelector('.live-phase'), log = board.querySelector('.live-log');
    var timers = [], started = false;
    var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };
    var set = function (cls) { rows.forEach(function (r) { r.className = 'lv ' + cls; }); };
    var say = function (t) { log.textContent = t; };
    function pass(slow, at, label) {
      rows.forEach(function (r, i) {
        var last = i === rows.length - 1;
        later(function () { r.className = 'lv run'; say(label + ': ' + r.getAttribute('data-say')); }, at);
        at += last ? 500 : slow;
        later(function () { r.className = 'lv'; }, at);
      });
      return at;
    }
    function play() {
      timers.forEach(clearTimeout); timers = [];
      set('wait');
      var at = 400;
      if (kind === 'quartet') {
        later(function () { phase.textContent = 'AI recording'; phase.classList.add('ai'); say('The AI reads the story and drives the first run.'); }, 0);
        at = pass(1200, at + 900, 'The AI');
        later(function () { set('wait'); phase.textContent = 'Replay, no AI'; phase.classList.remove('ai'); say('Rerun: replaying the recording.'); }, at + 900);
        at = pass(260, at + 1600, 'Replay');
        later(function () { say('Replayed with no AI. Waiting for a person to approve.'); }, at + 200);
      } else {
        later(function () { phase.textContent = 'running'; say('Build 42 started from a pull request.'); }, 0);
        at = pass(900, at + 600, 'Build 42');
        later(function () { phase.textContent = 'main'; say('Build finished: one finding to fix, posted to the pull request.'); }, at + 200);
      }
      later(play, at + 5200);
    }
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; play(); } }, { threshold: 0.3 }).observe(board);
    document.addEventListener('visibilitychange', function () { if (document.hidden) timers.forEach(clearTimeout); else if (started) play(); });
  });
})();
