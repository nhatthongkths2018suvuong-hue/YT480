(function () {
  if (window.__yt480) return;
  window.__yt480 = true;

  // ===== CẤU HÌNH (sửa tại đây rồi build lại) =====
  var Q = 'large';              // chất lượng: 'small'=240p, 'medium'=360p, 'large'=480p, 'hd720'=720p
  var BLOCK_AUTONEXT = true;    // true: không tự phát video kế tiếp khi video kết thúc
  var HIDE_CAPTIONS = true;     // true: tắt phụ đề
  var HIDE_EXTRAS = true;       // true: ẩn bình luận và dải Shorts cho nhẹ trang
  // =================================================

  // 1) Báo cho trang biết máy KHÔNG hỗ trợ VP9/AV1/WebM -> YouTube sẽ chọn H.264 (mp4) + AAC
  var BAD = ['webm', 'vp8', 'vp9', 'vp09', 'av01', 'opus'];
  function bad(t) {
    if (typeof t !== 'string') return false;
    t = t.toLowerCase();
    for (var i = 0; i < BAD.length; i++) if (t.indexOf(BAD[i]) !== -1) return true;
    return false;
  }
  try {
    var vp = window.HTMLVideoElement && HTMLVideoElement.prototype;
    if (vp && vp.canPlayType) {
      var origCan = vp.canPlayType;
      vp.canPlayType = function (t) { return bad(t) ? '' : origCan.apply(this, arguments); };
    }
    var ms = window.MediaSource;
    if (ms && ms.isTypeSupported) {
      var origIs = ms.isTypeSupported.bind(ms);
      ms.isTypeSupported = function (t) { return bad(t) ? false : origIs(t); };
    }
  } catch (e) {}

  // 2) Đặt sẵn chất lượng (mặc định 480p, "large" là tên nội bộ của 480p)
  try {
    var tc = Date.now(), te = tc + 2592000000;
    localStorage.setItem('yt-player-quality', JSON.stringify({ data: Q, expiration: te, creation: tc }));
  } catch (e) {}

  // 3) Tắt hiệu ứng làm nặng máy (hoạt ảnh, chuyển động, đổ bóng, làm mờ nền).
  // Dùng thời lượng gần bằng 0 và chạy 1 lần để các sự kiện *end của trang vẫn kích hoạt bình thường.
  var CSS = '*,*::before,*::after{' +
    'animation-duration:.001s!important;animation-delay:0s!important;animation-iteration-count:1!important;' +
    'transition-duration:.001s!important;transition-delay:0s!important;scroll-behavior:auto!important;' +
    'box-shadow:none!important;text-shadow:none!important;' +
    'backdrop-filter:none!important;-webkit-backdrop-filter:none!important;will-change:auto!important}' +
    (HIDE_CAPTIONS ? '.ytp-caption-window-container,.caption-window,.ytp-caption-segment{display:none!important}' : '') +
    (HIDE_EXTRAS ? 'ytm-comment-section-renderer,ytm-reel-shelf-renderer{display:none!important}' : '');
  function addCss() {
    try {
      if (document.getElementById('__yt480css')) return true;
      var host = document.head || document.documentElement;
      if (!host) return false;
      var st = document.createElement('style');
      st.id = '__yt480css';
      st.textContent = CSS;
      host.appendChild(st);
      return true;
    } catch (e) { return false; }
  }
  addCss();
  document.addEventListener('DOMContentLoaded', addCss, false);

  if (BLOCK_AUTONEXT) {
    try {
      document.addEventListener('ended', function (e) {
        if (e.target && e.target.tagName === 'VIDEO') e.stopImmediatePropagation();
      }, true);
    } catch (e) {}
  }

  var lastVid = null, tries = 0, capVid = null;
  function apply() {
    try {
      if (document.hidden) return;
      addCss(); // chèn lại nếu trang đã xóa
      if (!/^\/(watch|shorts)/.test(location.pathname)) return; // chỉ cần ở trang xem video
      var p = document.getElementById('movie_player') || document.getElementsByClassName('html5-video-player')[0];
      if (!p) return;
      var vid = null;
      try { vid = p.getVideoData && p.getVideoData().video_id; } catch (e) {}
      if (vid !== lastVid) { lastVid = vid; tries = 0; }
      if (HIDE_CAPTIONS && vid !== capVid) {
        capVid = vid;
        try { if (p.unloadModule) p.unloadModule('captions'); } catch (e) {}
      }
      if (tries >= 4) return;
      var cur = null;
      try { cur = p.getPlaybackQuality && p.getPlaybackQuality(); } catch (e) {}
      if (cur === Q) { tries = 4; return; }
      if (p.setPlaybackQualityRange) p.setPlaybackQualityRange(Q);
      if (p.setPlaybackQuality) p.setPlaybackQuality(Q);
      tries++;
    } catch (e) {}
  }
  setInterval(apply, 2500);
})();
