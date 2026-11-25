(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]static\b/.test(location.search);
  var root = document.documentElement;
  if (reduce) root.classList.add('still');

  // smooth scroll, when the library loaded and motion is welcome
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) { var t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -70 }); } });
    });
  }

  // rolling hero words
  var rot = document.querySelector('.roll .rot');
  if (rot && !reduce) {
    var words = [].slice.call(rot.querySelectorAll('span')), i = 0;
    setInterval(function () {
      var cur = words[i], next = words[(i + 1) % words.length];
      cur.classList.remove('on'); cur.classList.add('out');
      next.classList.remove('out'); next.classList.add('on');
      setTimeout(function () { cur.classList.remove('out'); }, 750);
      i = (i + 1) % words.length;
    }, 2400);
  }

  // marquee text along the curved band
  var tp = document.getElementById('bandtext');
  if (tp && !reduce) {
    var off = 0;
    (function slide() { off -= 0.06; if (off < -33.3) off = 0; tp.setAttribute('startOffset', off + '%'); requestAnimationFrame(slide); })();
  }

  // pop-ins: stickers, bubbles, trail stops
  var pops = document.querySelectorAll('.sticker, .bubble, .tstop');
  if (reduce || !('IntersectionObserver' in window)) pops.forEach(function (e) { e.classList.add('on'); });
  else {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { var el = e.target, d = el.classList.contains('tstop') ? 0 : 120 * ([].indexOf.call(el.parentNode.children, el)); setTimeout(function () { el.classList.add('on'); }, d); io.unobserve(el); } }); }, { threshold: 0.35 });
    pops.forEach(function (e) { io.observe(e); });
  }

  // the statement fills in word by word as it scrolls through
  var st = document.querySelector('[data-fill]');
  var wordsEls = [];
  if (st) {
    var parts = st.textContent.trim().split(/\s+/);
    st.innerHTML = parts.map(function (w) { return '<span class="w">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>'; }).join(' ');
    wordsEls = [].slice.call(st.querySelectorAll('.w'));
    if (reduce) wordsEls.forEach(function (w) { w.classList.add('done'); });
  }

  var strip = document.querySelector('[data-strip]');
  var trail = document.querySelector('[data-trail]');
  var draw = trail && trail.querySelector('.draw');
  var len = 0;
  if (draw) { len = draw.getTotalLength(); draw.style.strokeDasharray = len; draw.style.strokeDashoffset = reduce ? 0 : len; }

  function progress(el, start, end) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    var a = vh * start, b = -r.height + vh * end;
    return Math.min(1, Math.max(0, (a - r.top) / (a - b)));
  }
  function onScroll() {
    if (reduce) return;
    if (st) {
      var p = progress(st, 0.85, 0.35), n = Math.round(p * wordsEls.length);
      wordsEls.forEach(function (w, k) { w.classList.toggle('done', k < n - 2); w.classList.toggle('hot', k >= n - 2 && k < n); });
    }
    if (strip) {
      var ps = progress(strip.parentNode, 1, 0), max = strip.scrollWidth - window.innerWidth;
      strip.style.transform = 'translateX(' + (-ps * Math.max(0, max)) + 'px)';
    }
    if (draw) {
      var pt = progress(trail, 0.6, 0.6);
      draw.style.strokeDashoffset = len * (1 - pt);
    }
  }
  if (!reduce) {
    window.addEventListener('scroll', onScroll, { passive: true });
    if (lenis) lenis.on('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  // stacked cards on the orange panel
  var deck = document.querySelector('[data-deck]');
  if (deck) {
    var cards = [].slice.call(deck.querySelectorAll('.card'));
    var dots = [].slice.call(document.querySelectorAll('.dots button'));
    var cur = 0, timer = null;
    function show(k) {
      cur = k;
      cards.forEach(function (c, j) { c.setAttribute('data-pos', String((j - k + cards.length) % cards.length)); c.setAttribute('aria-hidden', j === k ? 'false' : 'true'); });
      dots.forEach(function (d, j) { d.setAttribute('aria-current', j === k ? 'true' : 'false'); });
    }
    dots.forEach(function (d, j) { d.addEventListener('click', function () { show(j); if (timer) { clearInterval(timer); timer = null; } }); });
    show(0);
    if (!reduce) timer = setInterval(function () { show((cur + 1) % cards.length); }, 4200);
  }

  // copy buttons
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var done = function () { b.textContent = 'Copied'; b.classList.add('done'); setTimeout(function () { b.textContent = 'Copy'; b.classList.remove('done'); }, 1600); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(b.getAttribute('data-copy')).then(done, done); else done();
    });
  });
})();
