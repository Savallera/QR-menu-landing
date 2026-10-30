/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/blocks/advantages/advantages.js"
/*!*********************************************!*\
  !*** ./src/blocks/advantages/advantages.js ***!
  \*********************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\nwindow.addEventListener('DOMContentLoaded', () => {\r\n  if (Splide) {\r\n    if (document.querySelector('#advantages-slider')) {\r\n      let advantagesSlider = new Splide('#advantages-slider', {\r\n        type: 'slide',\r\n        perPage: 1,\r\n        start: 1,\r\n        arrows: true,\r\n        pagination: true,\r\n        rewind: true,\r\n        // autoplay: true,\r\n        gap: 'var(--indent-sm)',\r\n        padding: 'var(--indent-main-wide)',\r\n      });\r\n      advantagesSlider.mount();\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/advantages/advantages.js?\n}");

/***/ },

/***/ "./src/blocks/features/features.js"
/*!*****************************************!*\
  !*** ./src/blocks/features/features.js ***!
  \*****************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\nwindow.addEventListener('DOMContentLoaded', () => {\r\n  if (Splide) {\r\n    if (document.querySelector('#features-slider')) {\r\n      let whySlider = new Splide('#features-slider', {\r\n        type: 'slide',\r\n        perPage: 1,\r\n        start: 1,\r\n        arrows: true,\r\n        pagination: true,\r\n        rewind: true,\r\n        // autoplay: true,\r\n        gap: 'var(--indent-sm)',\r\n        padding: 'var(--indent-main-wide)',\r\n        mediaQuery: 'min',\r\n        breakpoints: {\r\n          576: {\r\n            perPage: 2,\r\n          },\r\n          768: {\r\n            destroy: 'completely',\r\n          },\r\n        },\r\n      });\r\n      whySlider.mount();\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/features/features.js?\n}");

/***/ },

/***/ "./src/blocks/footer/footer.js"
/*!*************************************!*\
  !*** ./src/blocks/footer/footer.js ***!
  \*************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\nfunction smoothScroll(id) {\r\n  const element = document.getElementById(id);\r\n  element.scrollIntoView({ behavior: 'smooth' });\r\n}\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n  const links = document.getElementsByClassName('footer__link');\r\n  for (let i = 0; i < links.length; i++) {\r\n    if(links[i].dataset.link && links[i].dataset.link != '') {\r\n      links[i].addEventListener('click', () => {\r\n        smoothScroll(links[i].dataset.link);\r\n      });\r\n    }\r\n  }\r\n});\n\n//# sourceURL=webpack://gulp-template/./src/blocks/footer/footer.js?\n}");

/***/ },

/***/ "./src/blocks/header/header.js"
/*!*************************************!*\
  !*** ./src/blocks/header/header.js ***!
  \*************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n// Меню в шапке\r\nconst header = document.querySelector('.header');\r\nconst headerMenu = document.querySelector('.header__menu');\r\nconst headerBurger = document.querySelector('.header__burger');\r\n\r\nheaderBurger.addEventListener('click', () => {\r\n  header.classList.toggle('header_menu-opened');\r\n});\r\n\r\nfunction closeMenu(event) {\r\n  if (\r\n    !headerMenu.contains(event.target) &&\r\n    !headerMenu.parentNode.contains(event.target)\r\n  ) {\r\n    header.classList.remove('header_menu-opened');\r\n  }\r\n}\r\n\r\ndocument.body.addEventListener('click', closeMenu);\r\n\r\n// Мягкий скролл\r\nfunction smoothScroll(id) {\r\n  const element = document.getElementById(id);\r\n  element.scrollIntoView({ behavior: 'smooth' });\r\n}\r\n\r\ndocument.addEventListener('DOMContentLoaded', (event) => {\r\n  const links = document.getElementsByClassName('header__link');\r\n  for (let i = 0; i < links.length; i++) {\r\n    links[i].addEventListener('click', () => {\r\n      if (\r\n        window.matchMedia('(max-width: 768px)').matches &&\r\n        !headerMenu.contains(event.target) &&\r\n        !headerMenu.parentNode.contains(event.target)\r\n      ) {\r\n        header.classList.remove('header_menu-opened');\r\n      }\r\n      smoothScroll(links[i].dataset.link);\r\n    });\r\n  }\r\n});\n\n//# sourceURL=webpack://gulp-template/./src/blocks/header/header.js?\n}");

/***/ },

/***/ "./src/blocks/hiw/hiw.js"
/*!*******************************!*\
  !*** ./src/blocks/hiw/hiw.js ***!
  \*******************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\nfunction getPosition(element) {\r\n  const elementRect = element.getBoundingClientRect();\r\n  const scrollPosition = window.scrollY;\r\n  const elementTop = elementRect.top + scrollPosition;\r\n\r\n  return elementTop;\r\n}\r\n\r\nfunction setImage(id){\r\n  function clear() {\r\n    const images = document.getElementsByClassName('hiw__image-wrap');\r\n    for (let i = 0; i < images.length; i++) {\r\n      images[i].classList.remove('hiw__image-wrap_active');\r\n    }\r\n  }\r\n\r\n  const image = document.getElementById(id);\r\n\r\n  if(!image.classList.contains('hiw__image-wrap_active'))\r\n  {\r\n    clear();\r\n    image.classList.add('hiw__image-wrap_active');\r\n  }\r\n}\r\n\r\nlet current_image = 'hiw1_image';\r\n\r\ndocument.addEventListener('DOMContentLoaded', (e) => {\r\n  const hiw1 = document.getElementById('hiw1');\r\n  const hiw2 = document.getElementById('hiw2');\r\n  const hiw3 = document.getElementById('hiw3');\r\n  const hiw4 = document.getElementById('hiw4');\r\n  const hiw5 = document.getElementById('hiw5');\r\n  const hiw6 = document.getElementById('hiw6');\r\n\r\n  window.onscroll = function() {\r\n    const scrollPosition = window.scrollY;\r\n\r\n    if (scrollPosition > getPosition(hiw1) && scrollPosition < getPosition(hiw2))\r\n      setImage('hiw1_image');\r\n\r\n    if(scrollPosition > getPosition(hiw2) && scrollPosition < getPosition(hiw3))\r\n      setImage('hiw2_image');\r\n\r\n    if(scrollPosition > getPosition(hiw3) && scrollPosition < getPosition(hiw4))\r\n      setImage('hiw3_image');\r\n\r\n    if(scrollPosition > getPosition(hiw4) && scrollPosition < getPosition(hiw5))\r\n      setImage('hiw4_image');\r\n\r\n    if(scrollPosition > getPosition(hiw5) && scrollPosition < getPosition(hiw6))\r\n      setImage('hiw5_image');\r\n\r\n    if(scrollPosition > getPosition(hiw6) && scrollPosition < getPosition(hiw7))\r\n      setImage('hiw6_image');\r\n  };\r\n})\n\n//# sourceURL=webpack://gulp-template/./src/blocks/hiw/hiw.js?\n}");

/***/ },

/***/ "./src/blocks/lang/lang.js"
/*!*********************************!*\
  !*** ./src/blocks/lang/lang.js ***!
  \*********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n// Переключатель языка в шапке: как на формах входа в админку и в клиентском меню.\r\n// Языков 31, поэтому сверху поиск, затем текущий язык, часто используемые\r\n// и все по алфавиту. Названия языков на них самих, рядом мелко на текущем языке\r\n// страницы (их даёт браузер через Intl.DisplayNames); сортировка по этой подписи.\r\n// Список языков и перевод страницы живут в scripts/libs/google-translate.js.\r\n\r\nconst POPULAR_LANGUAGES = ['ru', 'en', 'sr', 'de'];\r\n\r\n// Подписи переключателя: он помечен notranslate, Google его не переводит\r\nconst LANG_PICKER_TEXT = {\r\n  ru: { search: 'Поиск языка', popular: 'Часто используемые', all: 'Все языки', empty: 'Ничего не нашлось' },\r\n  en: { search: 'Search language', popular: 'Frequently used', all: 'All languages', empty: 'Nothing found' },\r\n  zh: { search: '搜索语言', popular: '常用', all: '所有语言', empty: '未找到' },\r\n  es: { search: 'Buscar idioma', popular: 'Más usados', all: 'Todos los idiomas', empty: 'No se encontró nada' },\r\n  hi: { search: 'भाषा खोजें', popular: 'अक्सर उपयोग की जाने वाली', all: 'सभी भाषाएँ', empty: 'कुछ नहीं मिला' },\r\n  ar: { search: 'ابحث عن لغة', popular: 'الأكثر استخدامًا', all: 'كل اللغات', empty: 'لم يتم العثور على شيء' },\r\n  pt: { search: 'Pesquisar idioma', popular: 'Mais usados', all: 'Todos os idiomas', empty: 'Nada encontrado' },\r\n  id: { search: 'Cari bahasa', popular: 'Sering digunakan', all: 'Semua bahasa', empty: 'Tidak ditemukan' },\r\n  fr: { search: 'Rechercher une langue', popular: 'Les plus utilisées', all: 'Toutes les langues', empty: 'Aucun résultat' },\r\n  ja: { search: '言語を検索', popular: 'よく使う言語', all: 'すべての言語', empty: '見つかりません' },\r\n  de: { search: 'Sprache suchen', popular: 'Häufig verwendet', all: 'Alle Sprachen', empty: 'Nichts gefunden' },\r\n  ko: { search: '언어 검색', popular: '자주 사용하는 언어', all: '모든 언어', empty: '찾을 수 없습니다' },\r\n  tr: { search: 'Dil ara', popular: 'Sık kullanılanlar', all: 'Tüm diller', empty: 'Hiçbir şey bulunamadı' },\r\n  it: { search: 'Cerca lingua', popular: 'Più usate', all: 'Tutte le lingue', empty: 'Nessun risultato' },\r\n  vi: { search: 'Tìm ngôn ngữ', popular: 'Thường dùng', all: 'Tất cả ngôn ngữ', empty: 'Không tìm thấy' },\r\n  pl: { search: 'Szukaj języka', popular: 'Najczęściej używane', all: 'Wszystkie języki', empty: 'Nic nie znaleziono' },\r\n  uk: { search: 'Пошук мови', popular: 'Часто використовувані', all: 'Усі мови', empty: 'Нічого не знайдено' },\r\n  nl: { search: 'Taal zoeken', popular: 'Veelgebruikt', all: 'Alle talen', empty: 'Niets gevonden' },\r\n  th: { search: 'ค้นหาภาษา', popular: 'ใช้บ่อย', all: 'ทุกภาษา', empty: 'ไม่พบรายการ' },\r\n  sr: { search: 'Pretraga jezika', popular: 'Često korišćeni', all: 'Svi jezici', empty: 'Ništa nije pronađeno' },\r\n  ka: { search: 'ენის ძებნა', popular: 'ხშირად გამოყენებული', all: 'ყველა ენა', empty: 'ვერაფერი მოიძებნა' },\r\n  sv: { search: 'Sök språk', popular: 'Vanligast', all: 'Alla språk', empty: 'Inget hittades' },\r\n  he: { search: 'חיפוש שפה', popular: 'בשימוש נפוץ', all: 'כל השפות', empty: 'לא נמצא דבר' },\r\n  fa: { search: 'جستجوی زبان', popular: 'پرکاربرد', all: 'همه زبان‌ها', empty: 'چیزی پیدا نشد' },\r\n  ro: { search: 'Caută limba', popular: 'Cele mai folosite', all: 'Toate limbile', empty: 'Nu s-a găsit nimic' },\r\n  el: { search: 'Αναζήτηση γλώσσας', popular: 'Συχνά χρησιμοποιούμενες', all: 'Όλες οι γλώσσες', empty: 'Δεν βρέθηκε τίποτα' },\r\n  hu: { search: 'Nyelv keresése', popular: 'Gyakran használt', all: 'Összes nyelv', empty: 'Nincs találat' },\r\n  cs: { search: 'Hledat jazyk', popular: 'Často používané', all: 'Všechny jazyky', empty: 'Nic nenalezeno' },\r\n  da: { search: 'Søg sprog', popular: 'Ofte brugte', all: 'Alle sprog', empty: 'Intet fundet' },\r\n  fi: { search: 'Hae kieltä', popular: 'Usein käytetyt', all: 'Kaikki kielet', empty: 'Ei tuloksia' },\r\n  nb: { search: 'Søk etter språk', popular: 'Mest brukt', all: 'Alle språk', empty: 'Ingenting funnet' },\r\n};\r\n\r\nconst pickerText = (code, key) => (LANG_PICKER_TEXT[code] || LANG_PICKER_TEXT.en)[key];\r\n\r\n// сербский на сайте латиницей, а Intl без уточнения пишет его кириллицей\r\nconst intlTag = (code) => (code === 'sr' ? 'sr-Latn' : code);\r\n\r\nfunction localLanguageName(code, inLanguage) {\r\n  try {\r\n    const name = new Intl.DisplayNames([intlTag(inLanguage)], {\r\n      type: 'language',\r\n    }).of(code);\r\n    if (!name || name === code) return '';\r\n    return name.charAt(0).toLocaleUpperCase(intlTag(inLanguage)) + name.slice(1);\r\n  } catch (e) {\r\n    return '';\r\n  }\r\n}\r\n\r\nconst escapeHtml = (text) =>\r\n  String(text).replace(/[&<>\"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' })[c]);\r\n\r\nfunction languageRows(current, query) {\r\n  const items = LANDING_LANGUAGES.map((language) => {\r\n    const local = localLanguageName(language.code, current);\r\n    return { ...language, local: local && local !== language.name ? local : '' };\r\n  });\r\n  const collator = new Intl.Collator(intlTag(current));\r\n  const sorted = [...items].sort((a, b) => collator.compare(a.local || a.name, b.local || b.name));\r\n  const needle = query.trim().toLocaleLowerCase();\r\n\r\n  if (needle) {\r\n    const found = sorted.filter((item) =>\r\n      [item.name, item.local, localLanguageName(item.code, 'en'), item.code].some(\r\n        (text) => text && text.toLocaleLowerCase().includes(needle)\r\n      )\r\n    );\r\n    return found.length ? found.map((item) => ({ kind: 'option', item })) : [{ kind: 'empty' }];\r\n  }\r\n\r\n  const byCode = (code) => items.find((item) => item.code === code);\r\n  const popular = POPULAR_LANGUAGES.filter((code) => code !== current).map(byCode).filter(Boolean);\r\n\r\n  return [\r\n    { kind: 'option', item: byCode(current) },\r\n    ...(popular.length ? [{ kind: 'section', key: 'popular' }] : []),\r\n    ...popular.map((item) => ({ kind: 'option', item })),\r\n    { kind: 'section', key: 'all' },\r\n    ...sorted.filter((item) => item.code !== current).map((item) => ({ kind: 'option', item })),\r\n  ];\r\n}\r\n\r\n// переключателей два: в меню (компьютер) и в строке шапки (телефон)\r\nfunction initLanguageSwitch(root) {\r\n  if (typeof LANDING_LANGUAGES === 'undefined') return;\r\n\r\n  const button = root.querySelector('[data-lang-button]');\r\n  const codeLabel = root.querySelector('[data-lang-code]');\r\n  const panel = root.querySelector('[data-lang-panel]');\r\n  const search = root.querySelector('[data-lang-search]');\r\n  const list = root.querySelector('[data-lang-list]');\r\n  const current = currentLandingLanguage();\r\n  const currentName = LANDING_LANGUAGES.find((item) => item.code === current)?.name;\r\n\r\n  codeLabel.textContent = current.toUpperCase();\r\n  button.title = currentName || '';\r\n  button.setAttribute('aria-label', currentName || current);\r\n  search.placeholder = pickerText(current, 'search');\r\n  search.setAttribute('aria-label', pickerText(current, 'search'));\r\n\r\n  const render = () => {\r\n    list.innerHTML = languageRows(current, search.value)\r\n      .map((row) => {\r\n        if (row.kind === 'section') {\r\n          return `<li class=\"lang__section\" role=\"presentation\">${escapeHtml(pickerText(current, row.key))}</li>`;\r\n        }\r\n        if (row.kind === 'empty') {\r\n          return `<li class=\"lang__empty\" role=\"presentation\">${escapeHtml(pickerText(current, 'empty'))}</li>`;\r\n        }\r\n        const { item } = row;\r\n        const selected = item.code === current;\r\n        return (\r\n          `<li role=\"presentation\"><button type=\"button\" role=\"option\" class=\"lang__option${selected ? ' lang__option_active' : ''}\" aria-selected=\"${selected}\" data-lang-option=\"${item.code}\">` +\r\n          `<span class=\"lang__check\" aria-hidden=\"true\">${selected ? '✓' : ''}</span>` +\r\n          `<span dir=\"auto\">${escapeHtml(item.name)}</span>` +\r\n          (item.local ? `<span class=\"lang__option-local\">${escapeHtml(item.local)}</span>` : '') +\r\n          '</button></li>'\r\n        );\r\n      })\r\n      .join('');\r\n  };\r\n\r\n  const setOpen = (open) => {\r\n    panel.hidden = !open;\r\n    button.setAttribute('aria-expanded', String(open));\r\n    if (!open) {\r\n      search.value = '';\r\n      return;\r\n    }\r\n    render();\r\n    list.scrollTop = 0;\r\n    // на компьютере сразу можно печатать; на телефоне фокус открыл бы\r\n    // клавиатуру поверх списка, поэтому там поле ждёт касания\r\n    if (window.matchMedia('(pointer: fine)').matches) search.focus();\r\n  };\r\n\r\n  button.addEventListener('click', () => setOpen(panel.hidden));\r\n  search.addEventListener('input', render);\r\n  search.addEventListener('keydown', (event) => {\r\n    if (event.key === 'Enter') {\r\n      const first = list.querySelector('[data-lang-option]');\r\n      if (first) first.click();\r\n    }\r\n  });\r\n\r\n  list.addEventListener('click', (event) => {\r\n    const option = event.target.closest('[data-lang-option]');\r\n    if (!option) return;\r\n    setOpen(false);\r\n    const code = option.dataset.langOption;\r\n    // языки со своим адресом (LANGUAGE_PAGES) ведут с корня на него, чтобы ссылку можно было скопировать\r\n    if (code !== current || landingLanguagePage(code) !== window.location.pathname) setLandingLanguage(code);\r\n  });\r\n\r\n  // клик мимо списка и Escape закрывают его: список длинный и перекрывает страницу\r\n  document.addEventListener('mousedown', (event) => {\r\n    if (!panel.hidden && !root.contains(event.target)) setOpen(false);\r\n  });\r\n  document.addEventListener('keydown', (event) => {\r\n    if (event.key === 'Escape' && !panel.hidden) {\r\n      setOpen(false);\r\n      button.focus();\r\n    }\r\n  });\r\n}\r\n\r\n// Ссылки «Попробовать» и «Войти» открывают админку на том же языке\r\nfunction passLanguageToService() {\r\n  if (typeof currentLandingLanguage === 'undefined') return;\r\n\r\n  const code = currentLandingLanguage();\r\n  document.querySelectorAll('[data-service-link]').forEach((link) => {\r\n    const url = new URL(link.href);\r\n    url.searchParams.set('lang', code);\r\n    link.href = url.toString();\r\n  });\r\n}\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n  // язык адреса или первого визита до отрисовки: виджет Google грузится позже\r\n  if (typeof resolveLandingLanguage !== 'undefined') resolveLandingLanguage();\r\n  document.querySelectorAll('[data-lang]').forEach(initLanguageSwitch);\r\n  passLanguageToService();\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/lang/lang.js?\n}");

/***/ },

/***/ "./src/blocks/preloader/preloader.js"
/*!*******************************************!*\
  !*** ./src/blocks/preloader/preloader.js ***!
  \*******************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* Прелодер на страницы */\r\nconst preloaderTmp = document.querySelector('.preloader-template');\r\nconst page = document.querySelector('.page');\r\nfunction showPreloader(tmp, parent) {\r\n  const node = tmp.content.cloneNode(true);\r\n  parent.append(node);\r\n}\r\nfunction removePreloader(parent, preloaderSelector) {\r\n  const preloader = parent.querySelector(preloaderSelector);\r\n  if (preloader) {\r\n    preloader.remove();\r\n  }\r\n}\r\n\r\nshowPreloader(preloaderTmp, page);\r\nsetTimeout(() => {\r\n  removePreloader(page, '.preloader');\r\n}, 1200);\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/preloader/preloader.js?\n}");

/***/ },

/***/ "./src/blocks/step/step.js"
/*!*********************************!*\
  !*** ./src/blocks/step/step.js ***!
  \*********************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\nwindow.addEventListener('DOMContentLoaded', () => {\r\n  if (Splide) {\r\n    if (document.querySelector('#step-slider')) {\r\n      let stepSlider = new Splide('#step-slider', {\r\n        type: 'slide',\r\n        perPage: 1,\r\n        start: 1,\r\n        arrows: true,\r\n        pagination: true,\r\n        rewind: true,\r\n        autoplay: true,\r\n        gap: 'var(--indent-sm)',\r\n        padding: 'var(--indent-main-wide)',\r\n      });\r\n      stepSlider.mount();\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/step/step.js?\n}");

/***/ },

/***/ "./src/blocks/why/why.js"
/*!*******************************!*\
  !*** ./src/blocks/why/why.js ***!
  \*******************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\nwindow.addEventListener('DOMContentLoaded', () => {\r\n  if (Splide) {\r\n    if (document.querySelector('#why-slider')) {\r\n      let whySlider = new Splide('#why-slider', {\r\n        type: 'slide',\r\n        perPage: 1,\r\n        start: 1,\r\n        arrows: true,\r\n        pagination: true,\r\n        rewind: true,\r\n        // autoplay: true,\r\n        gap: 'var(--indent-sm)',\r\n        padding: 'var(--indent-main-wide)',\r\n        mediaQuery: 'min',\r\n        breakpoints: {\r\n          576: {\r\n            perPage: 2,\r\n          },\r\n          768: {\r\n            destroy: 'completely',\r\n          },\r\n        },\r\n      });\r\n      whySlider.mount();\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/why/why.js?\n}");

/***/ },

/***/ "./src/scripts/index.js"
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _blocks_preloader_preloader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blocks/preloader/preloader.js */ \"./src/blocks/preloader/preloader.js\");\n/* harmony import */ var _blocks_header_header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blocks/header/header.js */ \"./src/blocks/header/header.js\");\n/* harmony import */ var _blocks_lang_lang_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blocks/lang/lang.js */ \"./src/blocks/lang/lang.js\");\n/* harmony import */ var _blocks_advantages_advantages_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../blocks/advantages/advantages.js */ \"./src/blocks/advantages/advantages.js\");\n/* harmony import */ var _blocks_features_features_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../blocks/features/features.js */ \"./src/blocks/features/features.js\");\n/* harmony import */ var _blocks_why_why_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../blocks/why/why.js */ \"./src/blocks/why/why.js\");\n/* harmony import */ var _blocks_step_step_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../blocks/step/step.js */ \"./src/blocks/step/step.js\");\n/* harmony import */ var _blocks_hiw_hiw_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../blocks/hiw/hiw.js */ \"./src/blocks/hiw/hiw.js\");\n/* harmony import */ var _blocks_footer_footer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../blocks/footer/footer.js */ \"./src/blocks/footer/footer.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://gulp-template/./src/scripts/index.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	let __webpack_exports__ = __webpack_require__("./src/scripts/index.js");
/******/ 	
/******/ })()
;