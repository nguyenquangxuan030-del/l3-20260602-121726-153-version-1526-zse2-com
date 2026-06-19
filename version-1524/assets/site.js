
(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showSlide(i);
    });
  });

  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  if (prev) prev.addEventListener('click', function () { showSlide(current - 1); });
  if (next) next.addEventListener('click', function () { showSlide(current + 1); });
  if (slides.length) {
    showSlide(0);
    setInterval(function () { showSlide(current + 1); }, 5200);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
  filterForms.forEach(function (form) {
    var input = form.querySelector('[data-filter-input]');
    var year = form.querySelector('[data-filter-year]');
    var type = form.querySelector('[data-filter-type]');
    var scope = document.querySelector(form.getAttribute('data-filter-form')) || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty-state]');

    function apply() {
      var q = normalize(input ? input.value : '');
      var y = year ? year.value : '';
      var t = type ? type.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var hay = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-genre')
        ].join(' '));
        var ok = true;
        if (q && hay.indexOf(q) === -1) ok = false;
        if (y && card.getAttribute('data-year') !== y) ok = false;
        if (t && card.getAttribute('data-type').indexOf(t) === -1) ok = false;
        card.style.display = ok ? '' : 'none';
        if (ok) visible += 1;
      });
      if (empty) empty.classList.toggle('show', visible === 0);
    }

    [input, year, type].forEach(function (node) {
      if (node) node.addEventListener('input', apply);
      if (node) node.addEventListener('change', apply);
    });
  });

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));
  players.forEach(function (box) {
    var video = box.querySelector('video');
    var button = box.querySelector('[data-play-button]');
    var layer = box.querySelector('[data-video-cover]');
    var stream = box.getAttribute('data-stream');
    var started = false;

    function start() {
      if (!video || !stream) return;
      if (!started) {
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true });
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else {
          video.src = stream;
        }
        started = true;
      }
      if (layer) layer.classList.add('hide');
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    }

    if (button) button.addEventListener('click', start);
    if (layer) layer.addEventListener('click', start);
  });
})();
