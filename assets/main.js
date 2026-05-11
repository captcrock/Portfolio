// adam crocker — portfolio js
(function () {
  'use strict';

  // system time in CT
  function tick() {
    const el = document.getElementById('sys-time');
    if (!el) return;
    const now = new Date();
    const opts = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Chicago' };
    el.textContent = now.toLocaleTimeString('en-US', opts) + ' CT';
  }
  tick();
  setInterval(tick, 1000);

  // year
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
