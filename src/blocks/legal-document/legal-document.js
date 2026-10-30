document.addEventListener('DOMContentLoaded', () => {
  const home = landingLanguagePage(currentLandingLanguage());

  document.querySelectorAll('.header__logo, .footer__logo').forEach((link) => {
    link.href = home;
  });

  document.querySelectorAll('[data-link]').forEach((link) => {
    link.href = home + '#' + link.dataset.link;
  });

  document
    .querySelectorAll('.footer__column_content_menu .footer__link[href="#"]')
    .forEach((link) => {
      link.href = home;
    });
});
