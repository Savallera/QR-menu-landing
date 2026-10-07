// Переключатель языка в шапке: как на формах входа в админку
// Список языков и перевод страницы живут в scripts/libs/google-translate.js

function initLanguageSwitch() {
  const root = document.querySelector('[data-lang]');
  if (!root || typeof LANDING_LANGUAGES === 'undefined') return;

  const button = root.querySelector('[data-lang-button]');
  const codeLabel = root.querySelector('[data-lang-code]');
  const list = root.querySelector('[data-lang-list]');
  const current = currentLandingLanguage();
  const currentName = LANDING_LANGUAGES.find(
    (item) => item.code === current
  )?.name;

  codeLabel.textContent = current.toUpperCase();
  button.title = currentName || '';
  button.setAttribute('aria-label', currentName || current);

  list.innerHTML = LANDING_LANGUAGES.map(
    (item) =>
      `<li><button type="button" role="option" class="lang__option${
        item.code === current ? ' lang__option_active' : ''
      }" aria-selected="${item.code === current}" data-lang-option="${item.code}">` +
      `<span>${item.name}</span><span class="lang__option-code">${item.code.toUpperCase()}</span>` +
      '</button></li>'
  ).join('');

  const setOpen = (open) => {
    list.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    // длинный список открывается на выбранном языке
    if (open)
      list
        .querySelector('[aria-selected="true"]')
        ?.scrollIntoView({ block: 'nearest' });
  };

  button.addEventListener('click', () => setOpen(list.hidden));

  list.addEventListener('click', (event) => {
    const option = event.target.closest('[data-lang-option]');
    if (!option) return;
    setOpen(false);
    if (option.dataset.langOption !== current)
      setLandingLanguage(option.dataset.langOption);
  });

  // клик мимо списка и Escape закрывают его: список длинный и перекрывает страницу
  document.addEventListener('mousedown', (event) => {
    if (!list.hidden && !root.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !list.hidden) {
      setOpen(false);
      button.focus();
    }
  });
}

// Ссылки «Попробовать» и «Войти» открывают админку на том же языке
function passLanguageToService() {
  if (typeof currentLandingLanguage === 'undefined') return;

  const code = currentLandingLanguage();
  document.querySelectorAll('[data-service-link]').forEach((link) => {
    const url = new URL(link.href);
    url.searchParams.set('lang', code);
    link.href = url.toString();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitch();
  passLanguageToService();
});
