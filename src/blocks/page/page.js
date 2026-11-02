import { preloaderReady } from '../preloader/preloader.js';

const background = document.querySelector('.page__lead-background');
const lead = document.querySelector('.lead');

if (background && lead && background.animate) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 64em)');
  let animation = null;
  let frame = null;
  let visible = false;

  function updatePosition() {
    frame = null;
    if (animation) {
      // 10px of movement per 100px scrolled, capped at 50px.
      animation.currentTime = Math.min(Math.max(window.scrollY, 0), 500);
    }
  }

  function requestUpdate() {
    if (frame === null) {
      frame = window.requestAnimationFrame(updatePosition);
    }
  }

  function updateMotion() {
    window.removeEventListener('scroll', requestUpdate);
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }

    if (reducedMotion.matches || !desktop.matches) {
      animation?.cancel();
      animation = null;
      return;
    }

    if (!animation) {
      animation = background.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(50px)' }],
        { duration: 500, fill: 'both' }
      );
      animation.pause();
    }

    updatePosition();
    if (visible) {
      window.addEventListener('scroll', requestUpdate, { passive: true });
    }
  }

  preloaderReady.then(() => {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateMotion();
    });
    observer.observe(lead);
    reducedMotion.addEventListener('change', updateMotion);
    desktop.addEventListener('change', updateMotion);
  });
}
