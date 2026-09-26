/* Animate the existing, unmodified portrait as one layer. No generated poses. */
(() => {
  'use strict';
  const stage = document.getElementById('stage');
  const toggle = document.getElementById('motion-toggle');
  const hint = document.getElementById('motion-hint');
  if (!stage || !toggle || !hint) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = matchMedia('(pointer: coarse)');
  const storageKey = 'ritik-portrait-layer-motion';
  let paused = false;
  try { paused = localStorage.getItem(storageKey) === 'paused'; } catch {}
  let visible = true;
  let frame = 0;
  let last = 0;
  let elapsed = 0;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let touchedUntil = 0;
  const clamp = value => Math.max(-1, Math.min(1, value));
  const enabled = () => !paused && !reduced.matches && visible && !document.hidden;

  function set(name, value) { stage.style.setProperty(name, value); }
  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    x = y = targetX = targetY = 0;
    for (const name of ['--mx', '--my', '--float', '--tilt', '--shift-x', '--shift-y', '--rx', '--ry']) stage.style.removeProperty(name);
  }
  function draw(now) {
    frame = 0;
    if (!enabled()) return;
    const dt = Math.min((now - last) / 1000 || .016, .05);
    last = now;
    elapsed += dt;
    if (touchedUntil && now > touchedUntil) { targetX = targetY = 0; touchedUntil = 0; }
    const ease = 1 - Math.exp(-dt * 4.8);
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    const idle = Math.sin(elapsed * .9);
    set('--mx', x.toFixed(4));
    set('--my', y.toFixed(4));
    set('--float', `${(idle * 2.4).toFixed(3)}px`);
    set('--tilt', `${(x * 1.15 + Math.sin(elapsed * .55) * .25).toFixed(3)}deg`);
    set('--shift-x', `${(x * 7).toFixed(3)}px`);
    set('--shift-y', `${(y * 3).toFixed(3)}px`);
    set('--rx', `${(-y * 1.6).toFixed(3)}deg`);
    set('--ry', `${(x * 2.6).toFixed(3)}deg`);
    frame = requestAnimationFrame(draw);
  }
  function run() {
    if (enabled() && !frame) { last = performance.now(); frame = requestAnimationFrame(draw); }
  }
  function update() {
    const off = paused || reduced.matches;
    stage.dataset.motion = off ? 'paused' : 'playing';
    toggle.hidden = false;
    toggle.disabled = reduced.matches;
    toggle.setAttribute('aria-pressed', String(off));
    toggle.textContent = reduced.matches ? 'Reduced motion' : paused ? 'Play motion' : 'Pause motion';
    hint.textContent = reduced.matches ? 'Your motion preference is respected.' : paused ? 'Motion paused.' : coarse.matches ? 'Tap the portrait to move it.' : 'Move your cursor to explore.';
    if (off) reset(); else run();
  }
  function aim(event) {
    if (!enabled()) return;
    const rect = stage.getBoundingClientRect();
    targetX = clamp((event.clientX - rect.left - rect.width / 2) / (rect.width * .7));
    targetY = clamp((event.clientY - rect.top - rect.height / 2) / (rect.height * .7));
  }
  document.addEventListener('pointermove', event => {
    if (event.pointerType !== 'touch' && !coarse.matches) aim(event);
  }, { passive: true });
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch') { aim(event); touchedUntil = performance.now() + 1800; }
  }, { passive: true });
  document.addEventListener('pointerout', event => {
    if (!event.relatedTarget) targetX = targetY = 0;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else run();
  });
  toggle.addEventListener('click', () => {
    if (reduced.matches) return;
    paused = !paused;
    try { localStorage.setItem(storageKey, paused ? 'paused' : 'playing'); } catch {}
    update();
  });
  reduced.addEventListener('change', update);
  coarse.addEventListener('change', update);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) run(); else { cancelAnimationFrame(frame); frame = 0; }
    }, { threshold: .05 }).observe(stage);
  }
  update();
})();
