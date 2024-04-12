window.addEventListener('DOMContentLoaded', () => {
  if (Splide) {
    if (document.querySelector('#step-slider')) {
      let newsSlider = new Splide('#step-slider', {
        type: 'slide',
        perPage: 1,
        start: 2,
        arrows: true,
        pagination: true,
        rewind: true,
        autoplay: true,
        gap: 'var(--indent-sm)',
        // autoWidth: true,
        padding: 'var(--indent-main-wide)',
      });
      newsSlider.mount();
    }
  }
});
