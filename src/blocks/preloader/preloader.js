/* Прелодер на страницы */
const preloaderTmp = document.querySelector('.preloader-template');
const page = document.querySelector('.page');
function showPreloader(tmp, parent) {
  const node = tmp.content.cloneNode(true);
  parent.append(node);
}
function removePreloader(parent, preloaderSelector) {
  const preloader = parent.querySelector(preloaderSelector);
  if (preloader) {
    preloader.remove();
  }
}

showPreloader(preloaderTmp, page);
setTimeout(() => {
  removePreloader(page, '.preloader');
}, 1200);
