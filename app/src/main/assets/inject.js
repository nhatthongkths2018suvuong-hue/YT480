(function () {
  if (window.__yt480) return;
  window.__yt480 = true;

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

  // 2) Đặt sẵn chất lượng 480p ("large" là tên nội bộ của 480p)
  var Q = 'large';
  try {
    var tc = Date.now(), te = tc + 2592000000;
    localStorage.setItem('yt-player-quality', JSON.stringify({ data: Q, expiration: te, creation: tc }));
  } catch (e) {}

  var lastVid = null, tries = 0;
  function apply() {
    try {
      var p = document.getElementById('movie_player') || document.getElementsByClassName('html5-video-player')[0];
      if (!p) return;
      var vid = null;
      try { vid = p.getVideoData && p.getVideoData().video_id; } catch (e) {}
      if (vid !== lastVid) { lastVid = vid; tries = 0; }
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
