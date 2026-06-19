(function () {
    function initMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function initHero(carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        if (!slides.length) {
            return;
        }

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                start();
            });
        });

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function initFilter(root) {
        var input = root.querySelector('[data-filter-input]');
        var region = root.querySelector('[data-filter-region]');
        var section = root.closest('.content-section') || document;
        var cards = Array.prototype.slice.call(section.querySelectorAll('[data-search-card]'));
        var empty = root.querySelector('[data-empty-state]');

        if (!cards.length) {
            return;
        }

        function run() {
            var keyword = normalize(input && input.value);
            var regionValue = normalize(region && region.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-year')
                ].join(' '));
                var cardRegion = normalize(card.getAttribute('data-region'));
                var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
                var regionMatch = !regionValue || cardRegion.indexOf(regionValue) !== -1 || (regionValue === '其他' && ['中国大陆', '中国香港', '欧美', '韩国', '日本'].indexOf(card.getAttribute('data-region')) === -1);
                var matched = keywordMatch && regionMatch;
                card.hidden = !matched;
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (input) {
            input.addEventListener('input', run);
        }
        if (region) {
            region.addEventListener('change', run);
        }
        run();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        document.querySelectorAll('[data-hero-carousel]').forEach(initHero);
        document.querySelectorAll('[data-filter-root]').forEach(initFilter);
    });
}());
