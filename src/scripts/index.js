window.addEventListener('DOMContentLoaded', () => {
  if (Splide) {
    if (document.querySelector('#advantages-slider')) {
      let newsSlider = new Splide('#advantages-slider', {
        type: 'slide',
        autoplay: true,
        arrows: true,
        pagination: true,
        gap: 'var(--indent-sm)',
        autoWidth: true,
        padding: 'var(--indent-xxxl)',
      });
      newsSlider.mount();
    }
  }
});
