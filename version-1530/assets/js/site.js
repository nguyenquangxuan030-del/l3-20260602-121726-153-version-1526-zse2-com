(function () {
    const header = document.querySelector('[data-header]');
    const navToggle = document.querySelector('[data-nav-toggle]');
    const navLinks = document.querySelector('[data-nav-links]');

    function updateHeader() {
        if (!header) {
            return;
        }

        if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-fallback-image]').forEach(function (image) {
        image.addEventListener('error', function () {
            image.classList.add('is-missing');
        });

        if (image.complete && image.naturalWidth === 0) {
            image.classList.add('is-missing');
        }
    });

    const heroSlides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const heroDots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    let activeHeroIndex = 0;
    let heroTimer = null;

    function showHeroSlide(index) {
        if (!heroSlides.length) {
            return;
        }

        activeHeroIndex = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeHeroIndex);
        });
        heroDots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeHeroIndex);
        });
    }

    function startHeroAutoplay() {
        if (heroSlides.length < 2) {
            return;
        }

        heroTimer = window.setInterval(function () {
            showHeroSlide(activeHeroIndex + 1);
        }, 5200);
    }

    heroDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            const index = Number(dot.getAttribute('data-hero-dot')) || 0;
            showHeroSlide(index);
            if (heroTimer) {
                window.clearInterval(heroTimer);
                startHeroAutoplay();
            }
        });
    });

    startHeroAutoplay();

    document.querySelectorAll('[data-filter-panel]').forEach(function (panel) {
        const section = panel.closest('.content-section') || document;
        const keywordInput = panel.querySelector('[data-filter-keyword]');
        const yearSelect = panel.querySelector('[data-filter-year]');
        const typeInput = panel.querySelector('[data-filter-type]');
        const cards = Array.from(section.querySelectorAll('[data-movie-card]'));
        const empty = section.querySelector('[data-filter-empty]');

        function matchYear(cardYear, filterYear) {
            if (!filterYear) {
                return true;
            }

            const year = Number(cardYear) || 0;

            if (filterYear === '2026') {
                return year >= 2026;
            }

            if (filterYear === '2020') {
                return year >= 2020 && year <= 2023;
            }

            if (filterYear === '2010') {
                return year >= 2010 && year <= 2019;
            }

            if (filterYear === '2000') {
                return year >= 2000 && year <= 2009;
            }

            if (filterYear === 'old') {
                return year > 0 && year < 2000;
            }

            return String(year) === filterYear;
        }

        function applyFilters() {
            const keyword = (keywordInput ? keywordInput.value : '').trim().toLowerCase();
            const yearValue = yearSelect ? yearSelect.value : '';
            const typeValue = (typeInput ? typeInput.value : '').trim().toLowerCase();
            let visibleCount = 0;

            cards.forEach(function (card) {
                const searchText = (card.getAttribute('data-search') || '').toLowerCase();
                const cardType = (card.getAttribute('data-type') || '').toLowerCase();
                const cardYear = card.getAttribute('data-year') || '';
                const isVisible =
                    (!keyword || searchText.indexOf(keyword) !== -1) &&
                    (!typeValue || cardType.indexOf(typeValue) !== -1 || searchText.indexOf(typeValue) !== -1) &&
                    matchYear(cardYear, yearValue);

                card.hidden = !isVisible;

                if (isVisible) {
                    visibleCount += 1;
                }
            });

            if (empty) {
                empty.hidden = visibleCount !== 0;
            }
        }

        [keywordInput, yearSelect, typeInput].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });
    });
}());
