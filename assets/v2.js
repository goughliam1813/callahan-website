(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static\b/.test(location.search);

  if (/[?&]static\b/.test(location.search)) document.documentElement.classList.add('static');
  // scroll reveals
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) { els.forEach(function (e) { e.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
    var lanes = document.querySelectorAll('.lane');
    var lio = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('go', e.isIntersecting); }); }, { threshold: 0.4 });
    lanes.forEach(function (l) { lio.observe(l); });
  }

  // copy buttons
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () { var t = b.textContent; b.textContent = 'Copied'; b.classList.add('done'); setTimeout(function () { b.textContent = t; b.classList.remove('done'); }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done); else done();
    });
  });

  // the live run in the hero
  var frame = document.getElementById('run'); if (!frame) return;
  var story = frame.querySelector('.story'), steps = [].slice.call(frame.querySelectorAll('.steps li'));
  var pill = frame.querySelector('.pill'), pillText = pill.querySelector('span'), foot = frame.querySelector('.foot-text'), approve = frame.querySelector('.approve');
  var TEXT = 'As a shopper, I can add a book to my basket and see the right total at checkout.';
  var timers = [];
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function state(s, label, f) { pill.setAttribute('data-state', s); pillText.textContent = label; foot.textContent = f; }
  function final() {
    story.textContent = TEXT;
    steps.forEach(function (li) { li.className = 'on ok'; });
    state('done', 'Ready for review', 'Replayed with no AI. The evidence is ready.');
    approve.classList.add('ready');
  }
  if (reduce) { final(); return; }
  function play() {
    timers.forEach(clearTimeout); timers = [];
    story.innerHTML = '<span class="t"></span><span class="caret"></span>';
    steps.forEach(function (li) { li.className = ''; });
    approve.classList.remove('ready');
    state('work', 'The AI is working', 'Writing and validating the tests.');
    var t = story.querySelector('.t'), i = 0, at = 500;
    for (; i < TEXT.length; i++) (function (n) { later(function () { t.textContent = TEXT.slice(0, n + 1); }, at + n * 26); })(i);
    at += TEXT.length * 26 + 500;
    steps.forEach(function (li, k) {
      later(function () { li.className = 'on run'; }, at + k * 640);
      later(function () { li.className = 'on ok'; }, at + k * 640 + 520);
    });
    at += steps.length * 640 + 700;
    later(function () { state('replay', 'Replaying, no AI', 'Replaying the recording. No AI involved.'); steps.forEach(function (li) { li.className = 'on'; }); }, at);
    steps.forEach(function (li, k) { later(function () { li.className = 'on ok'; }, at + 350 + k * 170); });
    at += 350 + steps.length * 170 + 400;
    later(function () { state('done', 'Ready for review', 'Replayed with no AI. The evidence is ready.'); approve.classList.add('ready'); }, at);
    later(play, at + 5200);
  }
  var started = false;
  function go() { if (!started) { started = true; play(); } }
  if ('IntersectionObserver' in window) { new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { go(); } else if (started) { /* keep looping quietly */ } }, { threshold: 0.2 }).observe(frame); } else go();
  document.addEventListener('visibilitychange', function () { if (document.hidden) { timers.forEach(clearTimeout); } else if (started) { play(); } });
})();
