(function () {
  var top = document.querySelector('.top'), btn = document.querySelector('.menu-btn'), nav = document.getElementById('site-nav');
  if (!top) return;
  function onScroll() { top.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (!btn || !nav) return;
  function set(open) { btn.setAttribute('aria-expanded', open ? 'true' : 'false'); top.classList.toggle('open', open); }
  btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
})();
