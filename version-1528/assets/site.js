(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function setupHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) {
      return;
    }

    function updateHeader() {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  function setupNavigation() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var menu = document.querySelector('[data-nav-menu]');
    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener('click', function () {
      menu.classList.toggle('is-open');
    });
  }

  function setupHeroSlider() {
    var slider = document.querySelector('[data-hero-slider]');
    if (!slider) {
      return;
    }

    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var prev = slider.querySelector('[data-hero-prev]');
    var next = slider.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupFilters() {
    var bar = document.querySelector('[data-filter-bar]');
    var list = document.querySelector('[data-filter-list]');
    if (!bar || !list) {
      return;
    }

    var queryInput = bar.querySelector('[data-filter-query]');
    var categorySelect = bar.querySelector('[data-filter-category]');
    var typeSelect = bar.querySelector('[data-filter-type]');
    var yearSelect = bar.querySelector('[data-filter-year]');
    var emptyState = document.querySelector('[data-empty-state]');
    var cards = Array.prototype.slice.call(list.querySelectorAll('[data-card]'));

    function valueOf(element) {
      return element ? element.value.trim() : '';
    }

    function applyQueryFromUrl() {
      if (!queryInput) {
        return;
      }
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q) {
        queryInput.value = q;
      }
    }

    function filterCards() {
      var query = valueOf(queryInput).toLowerCase();
      var category = valueOf(categorySelect);
      var type = valueOf(typeSelect);
      var year = valueOf(yearSelect);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var title = (card.dataset.title || '').toLowerCase();
        var tags = (card.dataset.tags || '').toLowerCase();
        var cardCategory = card.dataset.category || '';
        var cardType = card.dataset.type || '';
        var cardYear = parseInt(card.dataset.year || '0', 10);
        var text = [title, tags, cardCategory, cardType, cardYear].join(' ').toLowerCase();

        var matchQuery = !query || text.indexOf(query) >= 0;
        var matchCategory = !category || cardCategory === category;
        var matchType = !type || cardType.indexOf(type) >= 0;
        var matchYear = !year || (year === '2020' ? cardYear >= 2020 : String(cardYear) === year);
        var visible = matchQuery && matchCategory && matchType && matchYear;

        card.hidden = !visible;
        if (visible) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    applyQueryFromUrl();
    [queryInput, categorySelect, typeSelect, yearSelect].forEach(function (element) {
      if (element) {
        element.addEventListener('input', filterCards);
        element.addEventListener('change', filterCards);
      }
    });
    filterCards();
  }

  ready(function () {
    setupHeader();
    setupNavigation();
    setupHeroSlider();
    setupFilters();
  });
})();
