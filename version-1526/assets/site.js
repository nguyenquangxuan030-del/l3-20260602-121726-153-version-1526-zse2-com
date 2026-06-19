(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector(".menu-toggle");
        var mobileNav = document.querySelector(".mobile-nav");

        if (menuButton && mobileNav) {
            menuButton.addEventListener("click", function () {
                var expanded = menuButton.getAttribute("aria-expanded") === "true";
                menuButton.setAttribute("aria-expanded", String(!expanded));
                mobileNav.classList.toggle("is-open", !expanded);
                document.body.classList.toggle("menu-open", !expanded);
            });
        }

        document.querySelectorAll(".hero").forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var previous = hero.querySelector("[data-hero-prev]");
            var next = hero.querySelector("[data-hero-next]");
            var current = 0;
            var timer = null;

            function show(index) {
                if (!slides.length) {
                    return;
                }

                current = (index + slides.length) % slides.length;

                slides.forEach(function (slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });

                dots.forEach(function (dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
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
                    timer = null;
                }
            }

            if (previous) {
                previous.addEventListener("click", function () {
                    show(current - 1);
                    start();
                });
            }

            if (next) {
                next.addEventListener("click", function () {
                    show(current + 1);
                    start();
                });
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener("click", function () {
                    show(index);
                    start();
                });
            });

            hero.addEventListener("mouseenter", stop);
            hero.addEventListener("mouseleave", start);
            show(0);
            start();
        });

        document.querySelectorAll("[data-filter-page]").forEach(function (panel) {
            var root = panel.parentElement || document;
            var input = panel.querySelector("[data-filter-input]");
            var typeButtons = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-type]"));
            var yearButtons = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-year]"));
            var clearButton = panel.querySelector("[data-filter-clear]");
            var selectedType = "";
            var selectedYear = "";

            function normalize(value) {
                return String(value || "").trim().toLowerCase();
            }

            function updateButtons() {
                typeButtons.forEach(function (button) {
                    button.classList.toggle("is-selected", button.dataset.filterType === selectedType);
                });

                yearButtons.forEach(function (button) {
                    button.classList.toggle("is-selected", button.dataset.filterYear === selectedYear);
                });

                if (clearButton) {
                    clearButton.classList.toggle("is-selected", !selectedType && !selectedYear && !normalize(input && input.value));
                }
            }

            function applyFilter() {
                var keyword = normalize(input && input.value);
                var cards = Array.prototype.slice.call(root.querySelectorAll(".filter-item"));

                cards.forEach(function (card) {
                    var haystack = normalize([
                        card.dataset.title,
                        card.dataset.region,
                        card.dataset.type,
                        card.dataset.tags,
                        card.dataset.year
                    ].join(" "));
                    var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                    var matchesType = !selectedType || card.dataset.type === selectedType;
                    var matchesYear = !selectedYear || card.dataset.year === selectedYear;
                    card.classList.toggle("is-hidden", !(matchesKeyword && matchesType && matchesYear));
                });

                updateButtons();
            }

            if (input) {
                input.addEventListener("input", applyFilter);
            }

            typeButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    selectedType = selectedType === button.dataset.filterType ? "" : button.dataset.filterType;
                    applyFilter();
                });
            });

            yearButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    selectedYear = selectedYear === button.dataset.filterYear ? "" : button.dataset.filterYear;
                    applyFilter();
                });
            });

            if (clearButton) {
                clearButton.addEventListener("click", function () {
                    selectedType = "";
                    selectedYear = "";
                    if (input) {
                        input.value = "";
                    }
                    applyFilter();
                });
            }

            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query && input) {
                input.value = query;
            }

            applyFilter();
        });

        document.querySelectorAll("[data-search-form]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector("input[name='q']");
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                }
            });
        });
    });

    function setupWithHls(video, videoUrl, callback) {
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            if (video.src !== videoUrl) {
                video.src = videoUrl;
            }
            callback();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (!video._hlsInstance) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(videoUrl);
                hls.attachMedia(video);
                video._hlsInstance = hls;
            }
            callback();
            return;
        }

        if (video.src !== videoUrl) {
            video.src = videoUrl;
        }
        callback();
    }

    window.initMoviePlayer = function (videoId, coverId, videoUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        var message = document.querySelector("[data-player-message='" + videoId + "']");
        var prepared = false;

        if (!video) {
            return;
        }

        function showMessage(text) {
            if (!message) {
                return;
            }
            message.textContent = text;
            message.classList.add("is-visible");
        }

        function hideMessage() {
            if (message) {
                message.classList.remove("is-visible");
            }
        }

        function playVideo() {
            hideMessage();
            setupWithHls(video, videoUrl, function () {
                prepared = true;
                if (cover) {
                    cover.classList.add("is-hidden");
                }
                var playAction = video.play();
                if (playAction && typeof playAction.catch === "function") {
                    playAction.catch(function () {
                        if (cover) {
                            cover.classList.remove("is-hidden");
                        }
                    });
                }
            });
        }

        if (cover) {
            cover.addEventListener("click", playVideo);
        }

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        video.addEventListener("play", function () {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });

        video.addEventListener("error", function () {
            showMessage("播放暂时不可用，请稍后再试");
        });

        video.addEventListener("loadedmetadata", hideMessage);

        video.addEventListener("pause", function () {
            if (!prepared && cover) {
                cover.classList.remove("is-hidden");
            }
        });
    };
})();
