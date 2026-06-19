(function () {
    var hlsScriptUrl = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';
    var hlsLoader = null;

    function loadHls() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }
        if (hlsLoader) {
            return hlsLoader;
        }
        hlsLoader = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = hlsScriptUrl;
            script.async = true;
            script.onload = function () {
                resolve(window.Hls);
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
        return hlsLoader;
    }

    function initMoviePlayer(url) {
        var video = document.getElementById('moviePlayer');
        var cover = document.getElementById('playerCover');
        var attached = false;
        var hlsInstance = null;

        if (!video || !url) {
            return;
        }

        function hideCover() {
            if (cover) {
                cover.classList.add('is-hidden');
            }
        }

        function nativeReady() {
            video.src = url;
            attached = true;
            return Promise.resolve();
        }

        function hlsReady() {
            return loadHls().then(function (Hls) {
                if (Hls && Hls.isSupported()) {
                    hlsInstance = new Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(url);
                    hlsInstance.attachMedia(video);
                    attached = true;
                    return;
                }
                video.src = url;
                attached = true;
            }).catch(function () {
                video.src = url;
                attached = true;
            });
        }

        function attach() {
            if (attached) {
                return Promise.resolve();
            }
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                return nativeReady();
            }
            return hlsReady();
        }

        function play() {
            hideCover();
            video.controls = true;
            attach().then(function () {
                var playRequest = video.play();
                if (playRequest && typeof playRequest.catch === 'function') {
                    playRequest.catch(function () {
                        video.controls = true;
                    });
                }
            });
        }

        if (cover) {
            cover.addEventListener('click', play);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener('play', hideCover);
        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
}());
