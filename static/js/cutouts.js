/* CUTOUTS — accordion + YouTube IFrame API */

let player;
let playerReady = false;
let apiReady = false;
let pendingVideoId = null;

/* YouTube IFrame API callback — called when API script loads */
window.onYouTubeIframeAPIReady = function () {
  apiReady = true;
  if (pendingVideoId) {
    createPlayer(pendingVideoId);
  }
};

function createPlayer(videoId) {
  document.getElementById('player-placeholder').hidden = true;
  document.getElementById('yt-player').hidden = false;

  player = new YT.Player('yt-player', {
    height: '100%',
    width: '100%',
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
      iv_load_policy: 3,
    },
    events: {
      onReady: function (e) {
        playerReady = true;
        e.target.playVideo();
      },
    },
  });
}

function loadVideo(videoId) {
  if (!apiReady) {
    pendingVideoId = videoId;
    return;
  }
  if (!player) {
    createPlayer(videoId);
    return;
  }
  if (!playerReady) return;
  player.loadVideoById(videoId);
}

/* Accordion logic */
document.addEventListener('DOMContentLoaded', function () {
  var bars = document.querySelectorAll('.artist-bar');

  function openBar(bar) {
    bars.forEach(function (b) {
      b.classList.remove('is-active');
      b.querySelector('.artist-bar__header').setAttribute('aria-expanded', 'false');
      b.querySelector('.artist-bar__panel').hidden = true;
    });

    bar.classList.add('is-active');
    bar.querySelector('.artist-bar__header').setAttribute('aria-expanded', 'true');
    var panel = bar.querySelector('.artist-bar__panel');
    panel.hidden = false;

    var trackBtns = panel.querySelectorAll('.track-btn');
    trackBtns.forEach(function (b) { b.classList.remove('is-active'); });
    if (trackBtns[0]) {
      trackBtns[0].classList.add('is-active');
      loadVideo(trackBtns[0].dataset.videoId);
    }
  }

  bars.forEach(function (bar) {
    bar.querySelector('.artist-bar__header').addEventListener('click', function () {
      if (!bar.classList.contains('is-active')) {
        openBar(bar);
      }
    });
  });

  document.querySelectorAll('.track-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var panel = btn.closest('.artist-bar__panel');
      panel.querySelectorAll('.track-btn').forEach(function (b) {
        b.classList.remove('is-active');
      });
      btn.classList.add('is-active');
      loadVideo(btn.dataset.videoId);
    });
  });
});
