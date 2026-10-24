/* Baro — portfolio interactions. Lightweight, no dependencies. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var body = document.body;

  /* ---------- Taipei clock ---------- */
  var clock = $('#clock');
  function tick() {
    if (!clock) return;
    try {
      clock.textContent = '· ' + new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Taipei'
      }).format(new Date());
    } catch (e) { clock.textContent = ''; }
  }
  tick(); setInterval(tick, 30000);

  /* ---------- reveal on scroll ---------- */
  var revealEls = $$('.rv, .mega, .hero-title');
  var clipEls = $$('.clip');
  function showAll() { revealEls.concat(clipEls).forEach(function (el) { el.classList.add('in'); }); countEls.forEach(finishCount); }

  /* ---------- count-up ---------- */
  var countEls = $$('[data-count]');
  var parsed = new WeakMap();
  function parse(el) {
    if (parsed.has(el)) return parsed.get(el);
    var t = el.textContent.trim();
    var m = t.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    var o = null;
    if (m) {
      var raw = m[2];
      var dec = (raw.split('.')[1] || '').length;
      o = { pre: m[1], suf: m[3], dec: dec, comma: raw.indexOf(',') > -1, val: parseFloat(raw.replace(/,/g, '')), final: t };
    }
    parsed.set(el, o);
    return o;
  }
  function fmt(o, n) {
    var s = n.toFixed(o.dec);
    if (o.comma) { var p = s.split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); s = p.join('.'); }
    return o.pre + s + o.suf;
  }
  function finishCount(el) { var o = parse(el); if (o) el.textContent = o.final; }
  function runCount(el) {
    var o = parse(el);
    if (!o || reduce) return;
    var start = null, dur = 1100;
    el.setAttribute('aria-label', o.final);
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(o, o.val * e);
      if (p < 1) requestAnimationFrame(step); else el.textContent = o.final;
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window) || reduce) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in');
        $$('[data-count]', el).forEach(runCount);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    // A fully clipped element has no visible area, so observe its parent and reveal the children in sequence.
    var groups = new Map();
    clipEls.forEach(function (c) {
      var k = c.parentElement;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(c);
    });
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        (groups.get(en.target) || []).forEach(function (c, i) {
          setTimeout(function () { c.classList.add('in'); }, i * 110);
        });
        cio.unobserve(en.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    groups.forEach(function (_, parent) { cio.observe(parent); });
    // hero title animates immediately
    setTimeout(function () { $$('.hero .ln').forEach(function (l) { l.classList.add('in'); }); }, 80);
  }

  /* ---------- nav: sliding pill + active section ---------- */
  var navLinks = $$('.pill--links a');
  var ind = $('.nav-ind');
  var currentKey = null;
  function placeInd(key) {
    var a = navLinks.filter(function (l) { return l.dataset.nav === key; })[0];
    navLinks.forEach(function (l) { l.removeAttribute('aria-current'); });
    if (!a || !ind) { if (ind) ind.style.opacity = 0; return; }
    a.setAttribute('aria-current', 'true');
    ind.style.opacity = 1;
    ind.style.left = a.offsetLeft + 'px';
    ind.style.width = a.offsetWidth + 'px';
  }
  var secs = $$('main [data-nav]');
  if ('IntersectionObserver' in window) {
    var visible = {};
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var hit = secs.filter(function (s) { return visible[s.id]; })[0];
      var key = hit ? hit.dataset.nav : null;
      if (key !== currentKey) { currentKey = key; placeInd(key); }
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(function (s) { so.observe(s); });
  }
  window.addEventListener('resize', function () { placeInd(currentKey); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { placeInd(currentKey); });

  /* ---------- mobile menu ---------- */
  var menu = $('#menu'), btn = $('#menuBtn');
  function setMenu(open) {
    if (!menu || !btn) return;
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('show'); });
    } else {
      menu.classList.remove('show');
      setTimeout(function () { if (!menu.classList.contains('show')) menu.hidden = true; }, 360);
    }
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.classList.toggle('menu-open', open);
    $('.menu-label', btn).textContent = open ? 'Close' : 'Menu';
  }
  if (btn) btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
  if (menu) $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && btn && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
  });
  var desktopMedia = window.matchMedia('(min-width: 901px)');
  if (desktopMedia.addEventListener) desktopMedia.addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  else if (desktopMedia.addListener) desktopMedia.addListener(function (m) { if (m.matches) setMenu(false); });

  /* ---------- parallax ---------- */
  var par = $$('[data-par]');
  var inView = new Set();
  if (par.length && !reduce && 'IntersectionObserver' in window) {
    var po = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) inView.add(e.target); else inView.delete(e.target); });
      schedule();
    }, { rootMargin: '10% 0px' });
    par.forEach(function (p) { po.observe(p); });
    var ticking = false;
    var schedule = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      inView.forEach(function (img) {
        var wrap = img.parentElement;
        var r = wrap.getBoundingClientRect();
        var spare = (img.offsetHeight - wrap.offsetHeight);
        if (spare <= 0) return;
        var prog = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2); // -1..1
        prog = Math.max(-1, Math.min(1, prog));
        img.style.setProperty('--py', (-spare / 2 + prog * spare / 2 * -1) + 'px');
      });
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
  }


  /* ---------- mobile scroll-to-color for hero and experience photos ---------- */
  (function () {
    var mobile = window.matchMedia('(max-width: 767px)');
    var items = $('.hero-card, .experience .par-wrap');
    if (!items.length) return;

    var pending = false;
    function update() {
      pending = false;
      var height = window.innerHeight || document.documentElement.clientHeight;
      items.forEach(function (item) {
        if (!mobile.matches) {
          item.classList.remove('is-color');
          return;
        }
        var rect = item.getBoundingClientRect();
        var visibleHeight = Math.max(0,
          Math.min(rect.bottom, height * .88) - Math.max(rect.top, height * .12));
        var threshold = Math.min(120, Math.max(35, rect.height * .15));
        item.classList.toggle('is-color', visibleHeight > threshold);
      });
    }
    function schedule() {
      if (pending) return;
      pending = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);
    window.addEventListener('pageshow', schedule);
    items.forEach(function (item) {
      var img = item.querySelector('img');
      if (img && !img.complete) img.addEventListener('load', schedule, { once: true });
    });

    /* Delay a frame so the initial grayscale can visibly fade to natural color. */
    window.requestAnimationFrame(function () {
      window.setTimeout(schedule, 80);
    });
    window.setTimeout(schedule, 350);
  })();

  /* ---------- swipe-to-color photography (Playground) ---------- */
  (function () {
    var gallery = document.getElementById('collage');
    if (!gallery) return;
    var photos = $$('.cp', gallery);
    if (!photos.length) return;

    var carouselMode = window.matchMedia('(max-width: 900px)');
    var scheduled = false;

    function updateColor() {
      scheduled = false;
      var viewportH = window.innerHeight || document.documentElement.clientHeight;
      var viewportW = window.innerWidth || document.documentElement.clientWidth;
      var galleryRect = gallery.getBoundingClientRect();

      if (carouselMode.matches) {
        /* Phones and tablets: the image closest to the horizontal
           center of the gallery receives full color during a swipe. */
        var visibleHeight = Math.max(0,
          Math.min(galleryRect.bottom, viewportH) - Math.max(galleryRect.top, 0));
        var centerX = galleryRect.left + galleryRect.width / 2;
        var nearest = null;
        var distanceMin = Infinity;

        if (visibleHeight > Math.min(60, galleryRect.height * .13)) {
          photos.forEach(function (photo) {
            var rect = photo.getBoundingClientRect();
            var exposed = Math.max(0,
              Math.min(rect.right, galleryRect.right) - Math.max(rect.left, galleryRect.left));
            if (exposed < 16) return;
            var distance = Math.abs((rect.left + rect.right) / 2 - centerX);
            if (distance < distanceMin) {
              distanceMin = distance;
              nearest = photo;
            }
          });
        }
        photos.forEach(function (photo) {
          photo.classList.toggle('is-color', photo === nearest);
        });
      } else {
        /* Desktop: multiple collage photographs gain color when visible. */
        photos.forEach(function (photo) {
          var rect = photo.getBoundingClientRect();
          var visibleHeight = Math.max(0,
            Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0));
          var visibleWidth = Math.max(0,
            Math.min(rect.right, viewportW) - Math.max(rect.left, 0));
          photo.classList.toggle('is-color',
            visibleWidth > 16 && visibleHeight > Math.min(120, rect.height * .3));
        });
      }
    }

    function scheduleColorUpdate() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(updateColor);
    }

    gallery.addEventListener('scroll', scheduleColorUpdate, { passive: true });
    window.addEventListener('scroll', scheduleColorUpdate, { passive: true });
    window.addEventListener('resize', scheduleColorUpdate);
    window.addEventListener('orientationchange', scheduleColorUpdate);
    window.addEventListener('pageshow', scheduleColorUpdate);
    gallery.addEventListener('touchend', function () {
      window.setTimeout(scheduleColorUpdate, 120);
      window.setTimeout(scheduleColorUpdate, 350);
    }, { passive: true });

    photos.forEach(function (photo) {
      var img = photo.querySelector('img');
      if (img && !img.complete) {
        img.addEventListener('load', scheduleColorUpdate, { once: true });
      }
    });

    scheduleColorUpdate();
    window.setTimeout(scheduleColorUpdate, 250);
  })();

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduce) {
    $$('.mag').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / r.width;
        var y = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + (x * 10).toFixed(1) + 'px,' + (y * 8).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transition = 'transform .45s cubic-bezier(.22,.8,.2,1)';
        el.style.transform = '';
        setTimeout(function () { el.style.transition = ''; }, 460);
      });
    });
  }

  /* ---------- heart toggle ---------- */
  var heart = $('.heart');
  if (heart) heart.addEventListener('click', function () {
    var on = heart.getAttribute('aria-pressed') === 'true';
    heart.setAttribute('aria-pressed', on ? 'false' : 'true');
  });

  /* ---------- "search" storytelling ---------- */
  var ask = $('#ask'), askText = $('#askText'), askGo = $('#askGo');
  if (ask && askText) {
    var query = askText.textContent;
    var items = $$('#askRes li');
    var timers = [];
    var clear = function () { timers.forEach(clearTimeout); timers = []; };
    var play = function () {
      clear();
      ask.classList.add('run');
      items.forEach(function (li) { li.classList.remove('on'); });
      askText.textContent = '';
      var i = 0;
      (function type() {
        askText.textContent = query.slice(0, ++i);
        if (i < query.length) timers.push(setTimeout(type, 28));
        else items.forEach(function (li, k) { timers.push(setTimeout(function () { li.classList.add('on'); }, 260 + k * 190)); });
      })();
    };
    if (!reduce && 'IntersectionObserver' in window) {
      var seen = false;
      new IntersectionObserver(function (es, o) {
        if (es[0].isIntersecting && !seen) { seen = true; play(); o.disconnect(); }
      }, { threshold: 0.45 }).observe(ask);
      if (askGo) askGo.addEventListener('click', play);
    } else if (askGo) {
      items.forEach(function (li) { li.classList.add('on'); });
      askGo.addEventListener('click', function () { items[0] && items[0].scrollIntoView({ block: 'nearest' }); });
    }
  }

  /* Photo stack selection uses native radio labels and CSS, no JavaScript required. */

  /* ---------- certificate modal ---------- */
  var modal = $('#certModal'), mImg = $('#certImg'), mCap = $('#certCap');
  var lastBtn = null;
  $$('.cred-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      lastBtn = b;
      mImg.src = b.dataset.img;
      mImg.alt = b.dataset.cap + ' certificate';
      mCap.textContent = b.dataset.cap;
      if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
    });
  });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });
    modal.addEventListener('close', function () { if (lastBtn) lastBtn.focus(); });
  }
})();