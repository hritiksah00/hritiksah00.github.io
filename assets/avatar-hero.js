/* Nine illustrated views, blended on direction changes. No camera or tracking data. */
(() => {
  'use strict';
  const hero = document.querySelector('.avatar-hero');
  const stage = document.getElementById('avatar-stage');
  const art = document.getElementById('avatar-art');
  const toggle = document.getElementById('avatar-motion-toggle');
  const hint = document.getElementById('avatar-hint');
  if (!hero || !stage || !art || !toggle || !hint) return;

  const layers = [...art.querySelectorAll('[data-avatar-layer]')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none), (pointer: coarse)');
  const storageKey = 'ritik-avatar-motion';
  const scriptUrl = document.currentScript?.src || new URL('assets/avatar-hero.js', document.baseURI).href;
  const atlasUrl = new URL('ritik-avatar-atlas.webp', scriptUrl).href;
  let paused = false;
  try { paused = localStorage.getItem(storageKey) === 'paused'; } catch { /* Storage can be unavailable. */ }

  let visible = true;
  let ready = false;
  let failed = false;
  let loading = false;
  let activeLayer = 0;
  let currentPose = 4;
  let poseTime = 0;
  let frame = 0;
  let idleTimer = 0;
  let idleIndex = 0;
  let targetX = 0;
  let targetY = 0;
  let x = 0;
  let y = 0;
  let column = 0;
  let row = 0;
  const idlePoses = [[0, 0], [-0.56, 0], [0, 0], [0.56, -0.1], [0, 0], [0, -0.5]];
  const enabled = () => ready && visible && !document.hidden && !paused && !reduced.matches;

  function setPose(pose, instant = false) {
    if (!ready) return;
    if (pose === currentPose && art.classList.contains('has-atlas')) return;
    const next = 1 - activeLayer;
    layers[next].style.backgroundPosition = `${(pose % 3) * 50}% ${Math.floor(pose / 3) * 50}%`;
    if (instant) {
      layers.forEach(layer => { layer.style.transition = 'none'; });
    }
    layers[next].classList.add('is-visible');
    layers[activeLayer].classList.remove('is-visible');
    activeLayer = next;
    currentPose = pose;
    stage.dataset.pose = String(pose);
    art.classList.add('has-atlas');
    if (instant) {
      // Commit the immediate neutral state before restoring future transitions.
      void art.offsetWidth;
      layers.forEach(layer => { layer.style.transition = ''; });
    }
  }

  // Separate entry/exit boundaries prevent flicker near the middle pose.
  function direction(value, previous) {
    if (value < -0.34) return -1;
    if (value > 0.34) return 1;
    if (previous === -1 && value < -0.2) return -1;
    if (previous === 1 && value > 0.2) return 1;
    return 0;
  }

  function animate(now) {
    frame = 0;
    if (!enabled()) return;
    x += (targetX - x) * 0.16;
    y += (targetY - y) * 0.16;
    column = direction(x, column);
    row = direction(y, row);
    const pose = (row + 1) * 3 + column + 1;
    if (pose !== currentPose && now - poseTime > 160) {
      setPose(pose);
      poseTime = now;
    }
    art.style.setProperty('--gaze-x', `${(x * 5).toFixed(2)}px`);
    art.style.setProperty('--gaze-y', `${(y * 3).toFixed(2)}px`);
    art.style.setProperty('--gaze-tilt', `${(x * 0.9).toFixed(2)}deg`);
    if (Math.abs(targetX - x) > 0.003 || Math.abs(targetY - y) > 0.003 || pose !== currentPose) {
      frame = requestAnimationFrame(animate);
    }
  }

  function aim(nx, ny) {
    if (!enabled()) return;
    targetX = Math.max(-1, Math.min(1, nx));
    targetY = Math.max(-1, Math.min(1, ny));
    if (!frame) frame = requestAnimationFrame(animate);
  }

  function neutral() {
    cancelAnimationFrame(frame);
    frame = 0;
    targetX = targetY = x = y = column = row = 0;
    setPose(4, true);
    art.style.removeProperty('--gaze-x');
    art.style.removeProperty('--gaze-y');
    art.style.removeProperty('--gaze-tilt');
  }

  function scheduleIdle() {
    clearTimeout(idleTimer);
    if (!enabled() || !coarse.matches) return;
    idleTimer = window.setTimeout(() => {
      const point = idlePoses[idleIndex++ % idlePoses.length];
      aim(point[0], point[1]);
      scheduleIdle();
    }, 3400);
  }

  function loadAtlas() {
    if (ready || loading || failed || paused || reduced.matches || !visible || document.hidden) return;
    loading = true;
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth !== 1254 || image.naturalHeight !== 1254) {
        unavailable();
        return;
      }
      layers.forEach(layer => { layer.style.backgroundImage = `url("${atlasUrl}")`; });
      ready = true;
      loading = false;
      stage.dataset.avatarReady = 'true';
      setPose(4, true);
      updateMotion();
    };
    image.onerror = unavailable;
    image.src = atlasUrl;
  }

  function unavailable() {
    failed = true;
    loading = false;
    toggle.hidden = true;
    hint.textContent = 'A little personality behind the projects.';
  }

  function updateMotion() {
    clearTimeout(idleTimer);
    const off = paused || reduced.matches;
    hero.dataset.motion = off ? 'paused' : 'playing';
    toggle.hidden = failed;
    toggle.disabled = reduced.matches || (!ready && !off);
    toggle.setAttribute('aria-pressed', String(off));
    toggle.querySelector('span').textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion';
    toggle.querySelector('path').setAttribute('d', off ? 'M5 3l7 5-7 5V3Z' : 'M5 3v10M11 3v10');
    hint.textContent = failed ? 'A little personality behind the projects.' : reduced.matches ? 'Your motion preference is respected.' : paused ? 'Taking a little pause.' : coarse.matches ? 'A little curiosity. Tap to say hello.' : 'Move your cursor. I’m following.';
    if (!enabled()) neutral();
    if (!off && !failed) loadAtlas();
    if (enabled()) scheduleIdle();
  }

  toggle.addEventListener('click', () => {
    if (reduced.matches || failed) return;
    paused = !paused;
    try { localStorage.setItem(storageKey, paused ? 'paused' : 'playing'); } catch { /* Optional persistence. */ }
    updateMotion();
  });

  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || coarse.matches || !enabled()) return;
    const rect = stage.getBoundingClientRect();
    aim((event.clientX - (rect.left + rect.width * 0.5)) / (rect.width * 0.7),
        (event.clientY - (rect.top + rect.height * 0.43)) / (rect.height * 0.58));
  }, { passive: true });

  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch' || !enabled()) return;
    const rect = stage.getBoundingClientRect();
    aim((event.clientX - rect.left) / rect.width * 2 - 1,
        (event.clientY - rect.top) / rect.height * 2 - 1);
    scheduleIdle();
  }, { passive: true });

  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget && !coarse.matches) aim(0, 0);
  });
  document.addEventListener('visibilitychange', updateMotion);
  reduced.addEventListener('change', updateMotion);
  coarse.addEventListener('change', updateMotion);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      updateMotion();
    }, { threshold: 0.05 }).observe(stage);
  }
  updateMotion();
})();
