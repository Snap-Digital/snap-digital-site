function init() {
  /* Mobile nav ---------------------------------------------------------- */
  var menuBtn = document.getElementById('menuBtn');
  var nav = document.getElementById('siteNav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') nav.classList.remove('open');
    });
  }

  /* Hero carousel ------------------------------------------------------- */
  var track = document.getElementById('heroTrack');
  if (track) {
    var dots = [].slice.call(document.querySelectorAll('#heroDots button'));
    var caption = document.getElementById('heroCaption');
    var captions = ['COVER · VOCABULARY STORIES', 'TODAY · THE DAILY HABIT'];
    var slide = 0, timer;
    var render = function () {
      track.style.transform = 'translateX(' + (slide * -100) + '%)';
      dots.forEach(function (d, i) { d.setAttribute('aria-current', String(i === slide)); });
      if (caption) caption.textContent = captions[slide];
    };
    var go = function (n, manual) {
      slide = (n + captions.length) % captions.length;
      if (manual) clearInterval(timer);
      render();
    };
    dots.forEach(function (d, i) { d.addEventListener('click', function () { go(i, true); }); });
    var prevBtn = document.querySelector('[data-carousel-prev]');
    var nextBtn = document.querySelector('[data-carousel-next]');
    if (prevBtn) prevBtn.addEventListener('click', function () { go(slide - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(slide + 1, true); });
    timer = setInterval(function () { go(slide + 1); }, 5200);
    render();
  }

  /* Scroll reveals ------------------------------------------------------ */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('in'); }, i * 70);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* FAQ ----------------------------------------------------------------- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq__item').forEach(function (i) { i.classList.remove('open'); });
      if (!open) item.classList.add('open');
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  /* Back to top --------------------------------------------------------- */
  var toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', function () {
      toTop.classList.toggle('show', window.pageYOffset > 400);
    });
    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* Cookie notice (unchanged behaviour from the previous site) ----------- */
  var cookie = document.getElementById('cookieNotice');
  if (!cookie) return;
  if (localStorage.getItem('cookiesAccepted') || localStorage.getItem('cookiesDeclined')) {
    cookie.style.display = 'none';
    return;
  }
  setTimeout(function () { cookie.classList.add('show'); }, 1200);
  var close = function (key) {
    return function () { cookie.classList.remove('show'); localStorage.setItem(key, 'true'); };
  };
  document.getElementById('acceptCookies').addEventListener('click', close('cookiesAccepted'));
  document.getElementById('declineCookies').addEventListener('click', close('cookiesDeclined'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* Safety net: never leave content invisible if the observer misfires. */
window.addEventListener('load', function () {
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('in');
    });
  }, 1200);
});
