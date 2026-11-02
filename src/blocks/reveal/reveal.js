import { preloaderReady } from '../preloader/preloader.js';

const elements = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

preloaderReady.then(() => {
  if (reducedMotion.matches) {
    return;
  }

  elements.forEach((element) => {
    function stopAppearance() {
      element.classList.remove('reveal_appearing');
      element.removeEventListener('animationend', finishAppearance);
      element.removeEventListener('animationcancel', finishAppearance);
      reducedMotion.removeEventListener('change', handleMotionChange);
    }

    function finishAppearance(event) {
      if (event.target !== element || event.animationName !== 'reveal-appear') {
        return;
      }

      stopAppearance();
    }

    function handleMotionChange() {
      if (reducedMotion.matches) stopAppearance();
    }

    element.addEventListener('animationend', finishAppearance);
    element.addEventListener('animationcancel', finishAppearance);
    reducedMotion.addEventListener('change', handleMotionChange);
    element.classList.add('reveal_appearing');
  });
});
