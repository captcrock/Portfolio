// adam crocker — portfolio js
(function () {
  'use strict';

  // system time in CT — pulses live in the sysline
  function tick() {
    const el = document.getElementById('sys-time');
    if (!el) return;
    const now = new Date();
    const opts = {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false, timeZone: 'America/Chicago'
    };
    el.textContent = now.toLocaleTimeString('en-US', opts) + ' CT';
  }
  tick();
  setInterval(tick, 1000);

  // footer year
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // cursor-follow spotlight (skipped if user prefers reduced motion or on touch)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = matchMedia('(hover: none)').matches;
  if (!reduced && !isTouch) {
    const spot = document.querySelector('.spotlight');
    if (spot) {
      let raf = null;
      let tx = 50, ty = 0;
      window.addEventListener('pointermove', (e) => {
        tx = (e.clientX / window.innerWidth) * 100;
        ty = (e.clientY / window.innerHeight) * 100;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          spot.style.setProperty('--mx', tx + '%');
          spot.style.setProperty('--my', ty + '%');
          raf = null;
        });
      }, { passive: true });
    }
  }
})();
