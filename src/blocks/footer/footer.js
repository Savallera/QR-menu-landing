function smoothScroll(id) {
  const element = document.getElementById(id);
  element.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const links = document.getElementsByClassName('footer__link');
  for (let i = 0; i < links.length; i++) {
    if(links[i].dataset.link && links[i].dataset.link != '') {
      links[i].addEventListener('click', () => {
        smoothScroll(links[i].dataset.link);
      });
    }
  }
});