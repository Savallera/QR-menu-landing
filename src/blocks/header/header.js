// Меню в шапке
const header = document.querySelector('.header');
const headerMenu = document.querySelector('.header__menu');
const headerBurger = document.querySelector('.header__burger');

const scrollThreshold = 8;
let headerHeight = header.getBoundingClientRect().height;
let lastScrollY = window.scrollY;
let directionStart = lastScrollY;
let scrollDirection = 0;
let scrolledPastHeader = false;
let headerVisible = false;
let framePending = false;

function updateHeader() {
  framePending = false;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  const scrollY = Math.max(0, Math.min(window.scrollY, maxScroll));
  const interacting =
    header.classList.contains('header_menu-opened') ||
    header.querySelector('[data-lang-button][aria-expanded="true"]') ||
    header.querySelector(':focus-visible');

  if (scrollY === 0) {
    scrolledPastHeader = false;
    headerVisible = false;
    scrollDirection = 0;
    directionStart = 0;
  } else if (scrollY >= headerHeight || interacting) {
    scrolledPastHeader = true;
  }

  if (!scrolledPastHeader) {
    // Пока шапка не ушла целиком, она движется вместе со страницей.
    header.style.setProperty('--header-scroll-offset', `${-scrollY}px`);
    header.classList.remove('header_scrolled', 'header_hidden');
  } else {
    header.style.setProperty('--header-scroll-offset', '0px');
    if (interacting) {
      headerVisible = true;
      scrollDirection = 0;
      directionStart = scrollY;
    } else if (scrollY !== lastScrollY) {
      const direction = scrollY > lastScrollY ? 1 : -1;
      if (direction !== scrollDirection) {
        scrollDirection = direction;
        directionStart = lastScrollY;
      }
      if (Math.abs(scrollY - directionStart) >= scrollThreshold) {
        headerVisible = direction < 0;
      }
    }
    header.classList.add('header_scrolled');
    header.classList.toggle('header_hidden', !headerVisible);
  }

  lastScrollY = scrollY;
}

function scheduleHeaderUpdate() {
  if (framePending) return;
  framePending = true;
  window.requestAnimationFrame(updateHeader);
}

const headerResizeObserver = new ResizeObserver(() => {
  headerHeight = header.getBoundingClientRect().height;
  header.style.setProperty('--header-block-size', `${headerHeight}px`);
  scheduleHeaderUpdate();
});
headerResizeObserver.observe(header);

// Панель языка должна оставаться доступной и при прокрутке страницы.
new MutationObserver(scheduleHeaderUpdate).observe(header, {
  attributes: true,
  subtree: true,
  attributeFilter: ['aria-expanded'],
});

window.addEventListener('scroll', scheduleHeaderUpdate, { passive: true });
window.addEventListener('resize', scheduleHeaderUpdate);
window.addEventListener('pageshow', scheduleHeaderUpdate);
header.addEventListener('focusin', scheduleHeaderUpdate);
header.addEventListener('focusout', scheduleHeaderUpdate);
updateHeader();

headerBurger.addEventListener('click', () => {
  header.classList.toggle('header_menu-opened');
  scheduleHeaderUpdate();
});

function closeMenu(event) {
  if (
    !headerMenu.contains(event.target) &&
    !headerMenu.parentNode.contains(event.target)
  ) {
    header.classList.remove('header_menu-opened');
    scheduleHeaderUpdate();
  }
}

document.body.addEventListener('click', closeMenu);

// Мягкий скролл
function smoothScroll(id) {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const home = landingLanguagePage(resolveLandingLanguage());
  header.querySelectorAll('.header__logo').forEach((link) => {
    link.href = home;
    link.addEventListener('click', (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        !header.closest('.page_with_lead-image')
      ) {
        return;
      }

      event.preventDefault();
      header.classList.remove('header_menu-opened');
      scheduleHeaderUpdate();
      if (window.location.hash) {
        const url = new URL(window.location.href);
        url.hash = '';
        window.history.replaceState(window.history.state, '', url);
      }
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'instant'
          : 'smooth',
      });
    });
  });

  const links = document.getElementsByClassName('header__link');
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click', () => {
      header.classList.remove('header_menu-opened');
      scheduleHeaderUpdate();
      if (links[i].dataset.link) smoothScroll(links[i].dataset.link);
    });
  }
});
