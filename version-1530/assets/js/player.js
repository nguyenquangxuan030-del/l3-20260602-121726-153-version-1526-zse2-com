import { H as Hls } from './hls-dru42stk.js';

function setMessage(player, message) {
    const messageElement = player.querySelector('[data-player-message]');

    if (messageElement) {
        messageElement.textContent = message || '';
    }
}

function createHlsPlayer(video, source, player) {
    const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
        setMessage(player, '视频已加载，正在开始播放。');
        video.play().catch(function () {
            setMessage(player, '播放器已就绪，请再次点击播放按钮。');
        });
    });
    hls.on(Hls.Events.ERROR, function (_, data) {
        if (data && data.fatal) {
            setMessage(player, '视频加载异常，请刷新页面后重试。');
            hls.destroy();
        }
    });

    return hls;
}

function startPlayer(player) {
    const video = player.querySelector('video');
    const trigger = player.querySelector('[data-play]');

    if (!video || !trigger) {
        return;
    }

    const source = video.getAttribute('data-source') || trigger.getAttribute('data-source');

    if (!source) {
        setMessage(player, '当前影片没有可用播放源。');
        return;
    }

    player.classList.add('is-playing');
    video.setAttribute('playsinline', 'playsinline');
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.play().catch(function () {
            setMessage(player, '播放器已就绪，请再次点击播放按钮。');
        });
        return;
    }

    if (Hls.isSupported()) {
        createHlsPlayer(video, source, player);
        return;
    }

    setMessage(player, '当前浏览器不支持 HLS 播放，请更换新版浏览器。');
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-player]').forEach(function (player) {
        const trigger = player.querySelector('[data-play]');

        if (!trigger) {
            return;
        }

        trigger.addEventListener('click', function () {
            startPlayer(player);
        });
    });
});
