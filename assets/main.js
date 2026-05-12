/* ========================================================================
   Adam Crocker — Headliner theme
   GSAP-driven choreography
   ======================================================================== */

(function () {
  'use strict';

  // ------- helpers -------
  var prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none)').matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  // Footer year
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  // Wait for GSAP
  function whenReady(cb) {
    if (window.gsap) return cb();
    var t = 0;
    var iv = setInterval(function () {
      t += 50;
      if (window.gsap) { clearInterval(iv); cb(); }
      else if (t > 4000) { clearInterval(iv); document.body.classList.remove('is-loading'); }
    }, 50);
  }

  whenReady(function () {
    var gsap = window.gsap;
    var ScrollTrigger = window.ScrollTrigger;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    // ============= INTRO REVEAL =============
    var introRows = $$('.intro-row');
    var introFill = $('.intro-fill');
    var introOverlay = $('.intro');

    var tl = gsap.timeline();
    tl.to(introRows, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out'
    });
    tl.to(introFill, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '<+0.05');
    tl.to(introRows, { opacity: 0, y: -16, duration: 0.35, stagger: 0.04, ease: 'power2.in' }, '+=0.25');
    tl.to(introOverlay, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power3.inOut',
      onStart: function () { document.body.classList.remove('is-loading'); }
    }, '-=0.15');
    tl.set(introOverlay, { display: 'none' });

    // Hero content reveal — runs alongside the overlay sweep
    var heroLines = $$('.hero .display .line .word');
    var heroOverline = $('.hero .overline');
    var heroMeta = $('.hero .hero-meta');
    var heroCta = $('.hero .hero-cta');
    var heroPortrait = $('.hero-portrait');
    var scrollHint = $('.scroll-hint');

    tl.from(heroLines, {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      stagger: 0.04,
      ease: 'power3.out'
    }, '-=0.55');
    tl.from(heroOverline, { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.7');
    tl.from(heroMeta, { y: 24, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.55');
    tl.from(heroCta, { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');
    tl.from(heroPortrait, { scale: 0.94, opacity: 0, duration: 1.0, ease: 'power3.out' }, '-=0.85');
    if (scrollHint) tl.from(scrollHint, { opacity: 0, duration: 0.5 }, '-=0.3');

    // ============= CUSTOM CURSOR =============
    var cursor = $('.cursor');
    var cursorDot = $('.cursor-dot');
    var cursorRing = $('.cursor-ring');
    var cursorLabel = $('.cursor-label');

    if (cursor && !isTouch) {
      var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      var tx = cx, ty = cy;
      var rafCursor;

      window.addEventListener('mousemove', function (e) {
        tx = e.clientX;
        ty = e.clientY;
        if (!rafCursor) tickCursor();
      }, { passive: true });

      function tickCursor() {
        rafCursor = requestAnimationFrame(function () {
          cx += (tx - cx) * 0.22;
          cy += (ty - cy) * 0.22;
          cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
          if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) tickCursor();
          else rafCursor = null;
        });
      }

      // Hover states on data-cursor elements
      $$('[data-cursor], a, button, .magnet').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          cursor.classList.add('is-hover');
          var lbl = el.getAttribute('data-cursor');
          if (lbl) cursorLabel.textContent = lbl;
          else cursorLabel.textContent = '';
        });
        el.addEventListener('mouseleave', function () {
          cursor.classList.remove('is-hover');
        });
      });

      // Magnetic effect on .magnet
      $$('.magnet').forEach(function (el) {
        var rect;
        var raf;
        el.addEventListener('mouseenter', function () { rect = el.getBoundingClientRect(); });
        el.addEventListener('mousemove', function (e) {
          if (!rect) rect = el.getBoundingClientRect();
          var mx = e.clientX - rect.left - rect.width / 2;
          var my = e.clientY - rect.top - rect.height / 2;
          gsap.to(el, { x: mx * 0.18, y: my * 0.28, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
          rect = null;
        });
      });
    }

    // ============= AMBIENT BLOB PARALLAX (mouse) =============
    var blobs = $$('.blob');
    if (blobs.length && !isTouch && !prefersReduce) {
      var mx = 0, my = 0;
      window.addEventListener('mousemove', function (e) {
        mx = (e.clientX / window.innerWidth - 0.5) * 2;
        my = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
      function tickBlobs() {
        blobs.forEach(function (b, i) {
          var depth = (i + 1) * 12;
          b.style.translate = (mx * depth) + 'px ' + (my * depth) + 'px';
        });
        requestAnimationFrame(tickBlobs);
      }
      requestAnimationFrame(tickBlobs);
    }

    // ============= SCROLL-DRIVEN REVEALS =============
    $$('[data-reveal]').forEach(function (el) {
      if (el.closest('.hero')) return; // hero handled by intro timeline
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true
        }
      });
    });

    // h2 word-by-word reveal
    $$('.h2').forEach(function (h2) {
      var words = $$('.word', h2);
      if (!words.length) return;
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: { trigger: h2, start: 'top 82%', once: true }
      });
    });

    // ============= COUNT-UP =============
    $$('[data-count-to]').forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-count-suffix') || '';
      var obj = { v: 0 };
      gsap.to(obj, {
        v: to,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: function () {
          var v = obj.v;
          var s;
          if (Number.isInteger(to)) {
            s = Math.round(v).toLocaleString();
          } else {
            s = v.toFixed(1);
          }
          el.textContent = s + suffix;
        }
      });
    });

    // ============= PORTRAIT 3D TILT =============
    var tiltEl = $('[data-tilt]');
    var tiltFrame = tiltEl ? $('.portrait-frame', tiltEl) : null;
    if (tiltFrame && !isTouch) {
      tiltEl.addEventListener('mousemove', function (e) {
        var r = tiltEl.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(tiltFrame, {
          rotationY: nx * 12,
          rotationX: -ny * 10,
          duration: 0.6,
          ease: 'power3.out',
          transformPerspective: 1200
        });
      });
      tiltEl.addEventListener('mouseleave', function () {
        gsap.to(tiltFrame, {
          rotationY: 0, rotationX: 0,
          duration: 0.9, ease: 'elastic.out(1, 0.5)'
        });
      });
    }

    // ============= PINNED HORIZONTAL SCROLL FOR WORK =============
    var workPin = $('.work-pin');
    var workTrack = $('.work-track');
    if (workPin && workTrack && ScrollTrigger && window.matchMedia('(min-width: 901px)').matches) {
      // Calculate the distance to translate (total track width - viewport width + safety)
      var setHorizontalScroll = function () {
        var distance = workTrack.scrollWidth - window.innerWidth + 80;
        gsap.to(workTrack, {
          x: -distance,
          ease: 'none',
          scrollTrigger: {
            trigger: workPin,
            start: 'top top',
            end: function () { return '+=' + distance; },
            scrub: 0.6,
            pin: workTrack,
            anticipatePin: 1,
            invalidateOnRefresh: true
          }
        });
      };
      // Run after fonts settle so widths are correct
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(setHorizontalScroll);
      } else {
        setTimeout(setHorizontalScroll, 200);
      }

      // Recalculate on resize
      var resizeTimer;
      window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          ScrollTrigger.refresh();
        }, 250);
      });
    }

    // ============= SCROLL HINT — fade out on scroll =============
    if (scrollHint) {
      ScrollTrigger.create({
        trigger: '.hero',
        start: 'top top',
        end: 'bottom 80%',
        onUpdate: function (st) {
          scrollHint.style.opacity = String(Math.max(0, 1 - st.progress * 3));
        }
      });
    }

    // ============= BAR — subtle activation on scroll =============
    var bar = $('.bar');
    if (bar) {
      ScrollTrigger.create({
        start: 'top -20',
        onUpdate: function (st) {
          bar.style.boxShadow = st.progress > 0
            ? '0 8px 30px -12px rgba(0,0,0,0.6)'
            : 'none';
        }
      });
    }

    // ============= MARQUEE PAUSE-ON-HOVER =============
    var marqueeTrack = $('.marquee-track');
    if (marqueeTrack) {
      marqueeTrack.addEventListener('mouseenter', function () {
        marqueeTrack.style.animationPlayState = 'paused';
      });
      marqueeTrack.addEventListener('mouseleave', function () {
        marqueeTrack.style.animationPlayState = 'running';
      });
    }
  });
})();
