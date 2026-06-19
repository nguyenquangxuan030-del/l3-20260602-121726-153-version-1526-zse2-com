import { H as Hls } from './hls-dru42stk.js';

function setupPlayer(player) {
  var video = player.querySelector('video');
  var button = player.querySelector('[data-play-button]');
  var status = player.querySelector('[data-player-status]');
  var source = player.dataset.src;
  var hlsInstance = null;
  var initialized = false;

  function setStatus(message) {
    if (status) {
      status.textContent = message;
    }
  }

  function initialize() {
    if (initialized) {
      return Promise.resolve();
    }

    initialized = true;
    setStatus('正在初始化播放源...');

    if (!source) {
      setStatus('未找到播放源。');
      return Promise.reject(new Error('Missing video source'));
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      setStatus('浏览器原生 HLS 已就绪。');
      return Promise.resolve();
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
        setStatus('HLS 播放源已加载。');
      });
      hlsInstance.on(Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          setStatus('播放源加载失败，可刷新页面后重试。');
        }
      });
      return Promise.resolve();
    }

    setStatus('当前浏览器不支持 HLS 播放。');
    return Promise.reject(new Error('HLS not supported'));
  }

  function play() {
    initialize()
      .then(function () {
        return video.play();
      })
      .then(function () {
        player.classList.add('is-playing');
      })
      .catch(function () {
        player.classList.remove('is-playing');
      });
  }

  if (button) {
    button.addEventListener('click', play);
  }

  video.addEventListener('play', function () {
    player.classList.add('is-playing');
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

document.querySelectorAll('[data-player]').forEach(setupPlayer);
