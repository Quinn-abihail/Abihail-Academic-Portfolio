// Filters the ventures/projects list by category.
(function () {
  var buttons = document.querySelectorAll('.filter-btn[data-filter]');
  var items = document.querySelectorAll('.venture');
  if (!items.length) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      var filter = btn.dataset.filter;
      items.forEach(function (item) {
        var show = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('is-hidden', !show);
      });
    });
  });
})();
