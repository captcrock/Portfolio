// adam crocker — portfolio (editorial)
document.addEventListener('DOMContentLoaded', function () {
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());
});
