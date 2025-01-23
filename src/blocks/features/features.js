window.addEventListener('DOMContentLoaded', () => {
  if (Splide) {
    if (document.querySelector('#features-slider')) {
      let whySlider = new Splide('#features-slider', {
        type: 'slide',
        perPage: 1,
        start: 1,
        arrows: true,
        pagination: true,
        rewind: true,
        // autoplay: true,
        gap: 'var(--indent-sm)',
        padding: 'var(--indent-main-wide)',
        mediaQuery: 'min',
        breakpoints: {
          576: {
            perPage: 2,
          },
          768: {
            destroy: 'completely',
          },
        },
      });
      whySlider.mount();
    }
  }
});
