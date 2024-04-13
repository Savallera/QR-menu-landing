window.addEventListener('DOMContentLoaded', () => {
  if (Splide) {
    if (document.querySelector('#advantages-slider')) {
      let newsSlider = new Splide('#advantages-slider', {
        type: 'slide',
        perPage: 1,
        start: 1,
        arrows: true,
        pagination: true,
        rewind: true,
        autoplay: true,
        gap: 'var(--indent-sm)',
        padding: 'var(--indent-main)',
      });
      newsSlider.mount();
    }
  }
});
