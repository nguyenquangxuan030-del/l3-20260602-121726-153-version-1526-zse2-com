(function () {
  function toggleNavigation() {
    var button = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.main-nav');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dots button'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function initSearch() {
    var input = document.querySelector('[data-search-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title]'));
    var empty = document.querySelector('[data-empty-result]');
    if (!input || !cards.length) {
      return;
    }
    function filterCards() {
      var keyword = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-year') || '',
          card.getAttribute('data-category') || '',
          card.getAttribute('data-tags') || ''
        ].join(' ').toLowerCase();
        var matched = !keyword || text.indexOf(keyword) !== -1;
        card.style.display = matched ? '' : 'none';
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }
    input.addEventListener('input', filterCards);
  }

  function playVideo(video, button) {
    var source = video.getAttribute('data-src');
    if (!source) {
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls();
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.addEventListener('loadedmetadata', function () {
        video.play();
      }, { once: true });
    } else {
      video.src = source;
      video.play();
    }
    if (button) {
      button.style.display = 'none';
    }
  }

  function initPlayers() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-play-button]'));
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var shell = button.closest('.video-shell');
        var video = shell ? shell.querySelector('video') : null;
        if (video) {
          playVideo(video, button);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    toggleNavigation();
    initHero();
    initSearch();
    initPlayers();
  });
})();
