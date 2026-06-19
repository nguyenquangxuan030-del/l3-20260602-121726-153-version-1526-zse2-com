import { H as Hls } from './hls-vendor-dru42stk.js';

const header = document.querySelector('[data-site-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const mainNav = document.querySelector('[data-main-nav]');
const headerSearch = document.querySelector('.header-search');

if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
        mainNav.classList.toggle('is-open');
        if (headerSearch) {
            headerSearch.classList.toggle('is-open');
        }
    });
}

if (header) {
    const setHeaderState = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
}

function setupHeroCarousel() {
    const carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) {
        return;
    }

    const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
    const prev = carousel.querySelector('[data-hero-prev]');
    const next = carousel.querySelector('[data-hero-next]');
    let index = 0;
    let timer = null;

    const show = (nextIndex) => {
        if (!slides.length) {
            return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === index);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle('is-active', dotIndex === index);
        });
    };

    const start = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => show(index + 1), 5200);
    };

    if (prev) {
        prev.addEventListener('click', () => {
            show(index - 1);
            start();
        });
    }

    if (next) {
        next.addEventListener('click', () => {
            show(index + 1);
            start();
        });
    }

    dots.forEach((dot, dotIndex) => {
        dot.addEventListener('click', () => {
            show(dotIndex);
            start();
        });
    });

    show(0);
    start();
}

function setupFilters() {
    const list = document.querySelector('[data-card-list]');
    const input = document.querySelector('#cardSearch');
    const yearSelect = document.querySelector('#filterYear');
    const typeSelect = document.querySelector('#filterType');
    const resultCount = document.querySelector('#resultCount');

    if (!list || !input) {
        return;
    }

    const cards = Array.from(list.querySelectorAll('[data-title]'));
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');

    if (initialQuery) {
        input.value = initialQuery;
    }

    const filter = () => {
        const query = input.value.trim().toLowerCase();
        const year = yearSelect ? yearSelect.value : '';
        const type = typeSelect ? typeSelect.value : '';
        let visible = 0;

        cards.forEach((card) => {
            const haystack = [
                card.dataset.title,
                card.dataset.year,
                card.dataset.region,
                card.dataset.type,
                card.dataset.genre,
                card.dataset.tags,
            ].join(' ').toLowerCase();

            const matchesQuery = !query || haystack.includes(query);
            const matchesYear = !year || card.dataset.year === year;
            const matchesType = !type || (card.dataset.type || '').includes(type);
            const isVisible = matchesQuery && matchesYear && matchesType;

            card.classList.toggle('is-filtered-out', !isVisible);
            if (isVisible) {
                visible += 1;
            }
        });

        if (resultCount) {
            resultCount.textContent = `显示 ${visible} / ${cards.length}`;
        }
    };

    input.addEventListener('input', filter);
    if (yearSelect) {
        yearSelect.addEventListener('change', filter);
    }
    if (typeSelect) {
        typeSelect.addEventListener('change', filter);
    }
    filter();
}

function setupPlayers() {
    const players = Array.from(document.querySelectorAll('[data-player]'));

    players.forEach((player) => {
        const video = player.querySelector('video');
        const button = player.querySelector('[data-play-button]');
        const source = player.dataset.src;
        let loaded = false;

        if (!video || !button || !source) {
            return;
        }

        const loadVideo = () => {
            if (loaded) {
                video.play().catch(() => {});
                return;
            }

            loaded = true;
            const isHls = source.includes('.m3u8');

            if (isHls && Hls.isSupported()) {
                const hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    video.play().catch(() => {});
                });
            } else {
                video.src = source;
                video.play().catch(() => {});
            }

            button.classList.add('is-hidden');
        };

        button.addEventListener('click', loadVideo);
        video.addEventListener('play', () => button.classList.add('is-hidden'));
        video.addEventListener('pause', () => {
            if (video.currentTime === 0 || video.ended) {
                button.classList.remove('is-hidden');
            }
        });
    });
}

setupHeroCarousel();
setupFilters();
setupPlayers();
