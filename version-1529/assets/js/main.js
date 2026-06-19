(function () {
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobile = document.querySelector('[data-mobile-nav]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 18) {
      header.classList.add('is-solid');
    } else {
      header.classList.remove('is-solid');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(next) {
    if (!slides.length) {
      return;
    }
    current = (next + slides.length) % slides.length;
    slides.forEach(function (slide, index) {
      slide.classList.toggle('active', index === current);
    });
    dots.forEach(function (dot, index) {
      dot.classList.toggle('active', index === current);
    });
  }

  if (slides.length) {
    showSlide(0);
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var searchInput = document.querySelector('[data-search-input]');
  var searchSelect = document.querySelector('[data-search-select]');
  var searchItems = Array.prototype.slice.call(document.querySelectorAll('[data-search-item]'));
  var empty = document.querySelector('[data-empty-state]');

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filterItems() {
    if (!searchItems.length) {
      return;
    }
    var keyword = normalize(searchInput ? searchInput.value : '');
    var year = searchSelect ? searchSelect.value : '';
    var visible = 0;

    searchItems.forEach(function (item) {
      var haystack = normalize([
        item.getAttribute('data-title'),
        item.getAttribute('data-region'),
        item.getAttribute('data-genre'),
        item.getAttribute('data-year'),
        item.textContent
      ].join(' '));
      var yearMatched = !year || item.getAttribute('data-year') === year;
      var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
      var matched = yearMatched && keywordMatched;
      item.style.display = matched ? '' : 'none';
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.style.display = visible ? 'none' : 'block';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterItems);
  }
  if (searchSelect) {
    searchSelect.addEventListener('change', filterItems);
  }
  filterItems();
})();
