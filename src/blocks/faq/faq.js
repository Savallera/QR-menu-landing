document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.faq__item').forEach((item) => {
    const question = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!question || !answer || typeof item.animate !== 'function') return;

    let animation = null;
    let targetOpen = item.open;
    let targetHeight = 0;

    function measureHeight(open) {
      const styles = window.getComputedStyle(item);
      const closedHeight =
        question.getBoundingClientRect().height +
        parseFloat(styles.paddingBlockStart) +
        parseFloat(styles.paddingBlockEnd) +
        parseFloat(styles.borderBlockStartWidth) +
        parseFloat(styles.borderBlockEndWidth);

      if (!open) return closedHeight;

      const answerStyles = window.getComputedStyle(answer);
      return (
        closedHeight +
        answer.getBoundingClientRect().height +
        parseFloat(answerStyles.marginBlockStart) +
        parseFloat(answerStyles.marginBlockEnd)
      );
    }

    function finish() {
      item.open = targetOpen;
      answer.inert = false;
      animation?.cancel();
      animation = null;
      item.classList.remove('faq__item_animating', 'faq__item_closing');
    }

    function animate() {
      const startHeight = item.getBoundingClientRect().height;
      animation?.cancel();
      item.open = true;
      item.classList.add('faq__item_animating');
      item.classList.toggle('faq__item_closing', !targetOpen);
      answer.inert = !targetOpen;
      targetHeight = measureHeight(targetOpen);

      const currentAnimation = item.animate(
        { height: [`${startHeight}px`, `${targetHeight}px`] },
        { duration: 320, easing: 'ease-in-out', fill: 'both' }
      );
      animation = currentAnimation;
      currentAnimation.onfinish = () => {
        if (animation === currentAnimation) finish();
      };
    }

    question.addEventListener('click', (event) => {
      if (event.defaultPrevented) return;
      event.preventDefault();
      targetOpen = !targetOpen;

      if (reducedMotion.matches) {
        finish();
      } else {
        animate();
      }
    });

    item.addEventListener('toggle', () => {
      if (!animation) targetOpen = item.open;
    });

    const resizeObserver = new ResizeObserver(() => {
      if (
        animation &&
        Math.abs(measureHeight(targetOpen) - targetHeight) > 0.5
      ) {
        animate();
      }
    });
    resizeObserver.observe(question);
    resizeObserver.observe(answer);

    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches && animation) finish();
    });
  });
});
