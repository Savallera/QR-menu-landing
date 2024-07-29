// Меню в шапке
const header = document.querySelector('.header');
const headerMenu = document.querySelector('.header__menu');
const headerBurger = document.querySelector('.header__burger');

headerBurger.addEventListener('click', () => {
  header.classList.toggle('header_menu-opened');
});

function closeMenu(event) {
  if (
    !headerMenu.contains(event.target) &&
    !headerMenu.parentNode.contains(event.target)
  ) {
    header.classList.remove('header_menu-opened');
  }
}

document.body.addEventListener('click', closeMenu);

// Мягкий скролл
function smoothScroll(id) {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', (event) => {
  const links = document.getElementsByClassName('header__link');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', () => {
      if (
        window.matchMedia('(max-width: 768px)').matches &&
        !headerMenu.contains(event.target) &&
        !headerMenu.parentNode.contains(event.target)
      ) {
        header.classList.remove('header_menu-opened');
      }
      smoothScroll(links[i].dataset.link);
    });
  }
});
