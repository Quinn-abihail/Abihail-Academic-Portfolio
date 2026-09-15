// Filters the certification grid by category button and free-text search.
// Pure DOM filtering — no build step, no framework.
(function () {
  var buttons = document.querySelectorAll('.filter-btn[data-filter]');
  var search = document.getElementById('certSearch');
  var cards = document.querySelectorAll('.cert-card');
  var groups = document.querySelectorAll('.cert-group');
  if (!cards.length) return;

  var activeFilter = 'all';

  function apply() {
    var query = (search.value || '').trim().toLowerCase();

    cards.forEach(function (card) {
      var matchesFilter = activeFilter === 'all' || card.dataset.cat === activeFilter;
      var text = card.textContent.toLowerCase();
      var matchesSearch = query === '' || text.indexOf(query) !== -1;
      card.classList.toggle('is-hidden', !(matchesFilter && matchesSearch));
    });

    // Hide a whole group heading if every card inside it is filtered out.
    groups.forEach(function (group) {
      var visible = group.querySelectorAll('.cert-card:not(.is-hidden)');
      group.style.display = visible.length ? '' : 'none';
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      btn.setAttribute('aria-pressed', 'true');
      activeFilter = btn.dataset.filter;
      apply();
    });
  });

  if (search) search.addEventListener('input', apply);

  apply();
})();
