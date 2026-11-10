(() => {
  const audio = document.getElementById('ambient-audio');
  const retry = new AbortController();

  function start() {
    audio.play().catch(error => {
      if (error.name !== 'NotAllowedError') retry.abort();
    });
  }

  audio.addEventListener('playing', () => retry.abort(), {once: true});
  audio.addEventListener('error', () => retry.abort(), {once: true});
  for (const event of ['click', 'touchend', 'keydown']) {
    document.addEventListener(event, start, {capture: true, signal: retry.signal});
  }
  start();
})();
