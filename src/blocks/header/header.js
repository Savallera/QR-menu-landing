// Меню в шапке
const header = document.querySelector('.header');
const headerBurger = document.querySelector('.header__burger');

headerBurger.addEventListener('click', () => {
  header.classList.toggle('header_menu-opened');
});
