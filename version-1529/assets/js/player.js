(function () {
  function initPlayer() {
    var shell = document.querySelector('[data-player]');
    if (!shell) {
      return;
    }

    var video = shell.querySelector('video');
    var cover = shell.querySelector('[data-play-cover]');
    var button = shell.querySelector('[data-play-button]');
    var message = shell.querySelector('[data-player-message]');
    var source = shell.getAttribute('data-player-src');
    var started = false;
    var hlsInstance = null;

    function showMessage(text) {
      if (message) {
        message.textContent = text;
      }
    }

    function attachSource() {
      if (!video || !source) {
        showMessage('视频暂时不可用');
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
          if (data && data.fatal) {
            showMessage('视频加载失败，请稍后重试');
          }
        });
        return;
      }

      showMessage('视频暂时不可用');
    }

    function beginPlay() {
      if (!video) {
        return;
      }
      if (!started) {
        attachSource();
        started = true;
      }
      if (cover) {
        cover.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          showMessage('点击播放按钮开始观看');
        });
      }
    }

    function togglePlay() {
      if (!video) {
        return;
      }
      if (video.paused) {
        beginPlay();
      } else {
        video.pause();
      }
    }

    if (cover) {
      cover.addEventListener('click', beginPlay);
    }
    if (button) {
      button.addEventListener('click', beginPlay);
    }
    if (video) {
      video.addEventListener('click', togglePlay);
      video.addEventListener('play', function () {
        if (cover) {
          cover.classList.add('is-hidden');
        }
      });
    }

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayer);
  } else {
    initPlayer();
  }
})();
