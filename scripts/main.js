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

/***/ "./src/blocks/advantages/advantages.js":
/*!*********************************************!*\
  !*** ./src/blocks/advantages/advantages.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nwindow.addEventListener('DOMContentLoaded', () => {\r\n  if (Splide) {\r\n    if (document.querySelector('#advantages-slider')) {\r\n      let advantagesSlider = new Splide('#advantages-slider', {\r\n        type: 'slide',\r\n        perPage: 1,\r\n        start: 1,\r\n        arrows: true,\r\n        pagination: true,\r\n        rewind: true,\r\n        // autoplay: true,\r\n        gap: 'var(--indent-sm)',\r\n        padding: 'var(--indent-main-wide)',\r\n      });\r\n      advantagesSlider.mount();\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/advantages/advantages.js?");

/***/ }),

/***/ "./src/blocks/footer/footer.js":
/*!*************************************!*\
  !*** ./src/blocks/footer/footer.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nfunction smoothScroll(id) {\r\n  const element = document.getElementById(id);\r\n  element.scrollIntoView({ behavior: 'smooth' });\r\n}\r\n\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n  const links = document.getElementsByClassName('footer__link');\r\n  for (let i = 0; i < links.length; i++) {\r\n    if(links[i].dataset.link && links[i].dataset.link != '') {\r\n      links[i].addEventListener('click', () => {\r\n        smoothScroll(links[i].dataset.link);\r\n      });\r\n    }\r\n  }\r\n});\n\n//# sourceURL=webpack://gulp-template/./src/blocks/footer/footer.js?");

/***/ }),

/***/ "./src/blocks/header/header.js":
/*!*************************************!*\
  !*** ./src/blocks/header/header.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Меню в шапке\r\nconst header = document.querySelector('.header');\r\nconst headerMenu = document.querySelector('.header__menu');\r\nconst headerBurger = document.querySelector('.header__burger');\r\n\r\nheaderBurger.addEventListener('click', () => {\r\n  header.classList.toggle('header_menu-opened');\r\n});\r\n\r\nfunction closeMenu(event) {\r\n  if (\r\n    !headerMenu.contains(event.target) &&\r\n    !headerMenu.parentNode.contains(event.target)\r\n  ) {\r\n    header.classList.remove('header_menu-opened');\r\n  }\r\n}\r\n\r\ndocument.body.addEventListener('click', closeMenu);\r\n\r\n// Мягкий скролл\r\nfunction smoothScroll(id) {\r\n  const element = document.getElementById(id);\r\n  element.scrollIntoView({ behavior: 'smooth' });\r\n}\r\n\r\ndocument.addEventListener('DOMContentLoaded', (event) => {\r\n  const links = document.getElementsByClassName('header__link');\r\n  for (let i = 0; i < links.length; i++) {\r\n    links[i].addEventListener('click', () => {\r\n      if (\r\n        window.matchMedia('(max-width: 768px)').matches &&\r\n        !headerMenu.contains(event.target) &&\r\n        !headerMenu.parentNode.contains(event.target)\r\n      ) {\r\n        header.classList.remove('header_menu-opened');\r\n      }\r\n      smoothScroll(links[i].dataset.link);\r\n    });\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/header/header.js?");

/***/ }),

/***/ "./src/blocks/hiw/hiw.js":
/*!*******************************!*\
  !*** ./src/blocks/hiw/hiw.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nfunction getPosition(element) {\r\n  const elementRect = element.getBoundingClientRect();\r\n  const scrollPosition = window.scrollY;\r\n  const elementTop = elementRect.top + scrollPosition;\r\n\r\n  return elementTop;\r\n}\r\n\r\nfunction setImage(id){\r\n  function clear() {\r\n    const images = document.getElementsByClassName('hiw__image-wrap');\r\n    for (let i = 0; i < images.length; i++) {\r\n      images[i].classList.remove('hiw__image-wrap_active');\r\n    }\r\n  }\r\n\r\n  const image = document.getElementById(id);\r\n\r\n  if(!image.classList.contains('hiw__image-wrap_active'))\r\n  {\r\n    clear();\r\n    image.classList.add('hiw__image-wrap_active');\r\n  }\r\n}\r\n\r\nlet current_image = 'hiw1_image';\r\n\r\ndocument.addEventListener('DOMContentLoaded', (e) => {\r\n  const hiw1 = document.getElementById('hiw1');\r\n  const hiw2 = document.getElementById('hiw2');\r\n  const hiw3 = document.getElementById('hiw3');\r\n  const hiw4 = document.getElementById('hiw4');\r\n  const hiw5 = document.getElementById('hiw5');\r\n  const hiw6 = document.getElementById('hiw6');\r\n\r\n  window.onscroll = function() {\r\n    const scrollPosition = window.scrollY;\r\n\r\n    if (scrollPosition > getPosition(hiw1) && scrollPosition < getPosition(hiw2))\r\n      setImage('hiw1_image');\r\n\r\n    if(scrollPosition > getPosition(hiw2) && scrollPosition < getPosition(hiw3))\r\n      setImage('hiw2_image');\r\n\r\n    if(scrollPosition > getPosition(hiw3) && scrollPosition < getPosition(hiw4))\r\n      setImage('hiw3_image');\r\n\r\n    if(scrollPosition > getPosition(hiw4) && scrollPosition < getPosition(hiw5))\r\n      setImage('hiw4_image');\r\n\r\n    if(scrollPosition > getPosition(hiw5) && scrollPosition < getPosition(hiw6))\r\n      setImage('hiw5_image');\r\n\r\n    if(scrollPosition > getPosition(hiw6) && scrollPosition < getPosition(hiw7))\r\n      setImage('hiw6_image');\r\n  };\r\n})\n\n//# sourceURL=webpack://gulp-template/./src/blocks/hiw/hiw.js?");

/***/ }),

/***/ "./src/blocks/preloader/preloader.js":
/*!*******************************************!*\
  !*** ./src/blocks/preloader/preloader.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* Прелодер на страницы */\r\nconst preloaderTmp = document.querySelector('.preloader-template');\r\nconst page = document.querySelector('.page');\r\nfunction showPreloader(tmp, parent) {\r\n  const node = tmp.content.cloneNode(true);\r\n  parent.append(node);\r\n}\r\nfunction removePreloader(parent, preloaderSelector) {\r\n  const preloader = parent.querySelector(preloaderSelector);\r\n  if (preloader) {\r\n    preloader.remove();\r\n  }\r\n}\r\n\r\nshowPreloader(preloaderTmp, page);\r\nsetTimeout(() => {\r\n  removePreloader(page, '.preloader');\r\n}, 1200);\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/preloader/preloader.js?");

/***/ }),

/***/ "./src/blocks/pricing/pricing.js":
/*!***************************************!*\
  !*** ./src/blocks/pricing/pricing.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.addEventListener('DOMContentLoaded', () => {\r\n  const monthPayButton = document.getElementById('month_pay_button');\r\n  const yearPayButton = document.getElementById('year_pay_button');\r\n\r\n  const monthPayContent = document.getElementById('month_pay_content');\r\n  const yearPayContent = document.getElementById('year_pay_content');\r\n\r\n  monthPayButton.addEventListener('click', () => {\r\n    monthPayButton.classList.add('pricing__card-tab_actived');\r\n    yearPayButton.classList.remove('pricing__card-tab_actived');\r\n\r\n    monthPayContent.classList.add('pricing__card-price_actived');\r\n    yearPayContent.classList.remove('pricing__card-price_actived');\r\n  });\r\n  yearPayButton.addEventListener('click', () => {\r\n    monthPayButton.classList.remove('pricing__card-tab_actived');\r\n    yearPayButton.classList.add('pricing__card-tab_actived');\r\n\r\n    monthPayContent.classList.remove('pricing__card-price_actived');\r\n    yearPayContent.classList.add('pricing__card-price_actived');\r\n  });\r\n});\n\n//# sourceURL=webpack://gulp-template/./src/blocks/pricing/pricing.js?");

/***/ }),

/***/ "./src/blocks/step/step.js":
/*!*********************************!*\
  !*** ./src/blocks/step/step.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nwindow.addEventListener('DOMContentLoaded', () => {\r\n  if (Splide) {\r\n    if (document.querySelector('#step-slider')) {\r\n      let stepSlider = new Splide('#step-slider', {\r\n        type: 'slide',\r\n        perPage: 1,\r\n        start: 1,\r\n        arrows: true,\r\n        pagination: true,\r\n        rewind: true,\r\n        autoplay: true,\r\n        gap: 'var(--indent-sm)',\r\n        padding: 'var(--indent-main-wide)',\r\n      });\r\n      stepSlider.mount();\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/step/step.js?");

/***/ }),

/***/ "./src/blocks/why/why.js":
/*!*******************************!*\
  !*** ./src/blocks/why/why.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nwindow.addEventListener('DOMContentLoaded', () => {\r\n  if (Splide) {\r\n    if (document.querySelector('#why-slider')) {\r\n      let whySlider = new Splide('#why-slider', {\r\n        type: 'slide',\r\n        perPage: 1,\r\n        start: 1,\r\n        arrows: true,\r\n        pagination: true,\r\n        rewind: true,\r\n        // autoplay: true,\r\n        gap: 'var(--indent-sm)',\r\n        padding: 'var(--indent-main-wide)',\r\n        mediaQuery: 'min',\r\n        breakpoints: {\r\n          576: {\r\n            perPage: 2,\r\n          },\r\n          768: {\r\n            destroy: 'completely',\r\n          },\r\n        },\r\n      });\r\n      whySlider.mount();\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/why/why.js?");

/***/ }),

/***/ "./src/scripts/index.js":
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _blocks_preloader_preloader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blocks/preloader/preloader.js */ \"./src/blocks/preloader/preloader.js\");\n/* harmony import */ var _blocks_header_header_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blocks/header/header.js */ \"./src/blocks/header/header.js\");\n/* harmony import */ var _blocks_advantages_advantages_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blocks/advantages/advantages.js */ \"./src/blocks/advantages/advantages.js\");\n/* harmony import */ var _blocks_why_why_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../blocks/why/why.js */ \"./src/blocks/why/why.js\");\n/* harmony import */ var _blocks_step_step_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../blocks/step/step.js */ \"./src/blocks/step/step.js\");\n/* harmony import */ var _blocks_pricing_pricing_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../blocks/pricing/pricing.js */ \"./src/blocks/pricing/pricing.js\");\n/* harmony import */ var _blocks_hiw_hiw_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../blocks/hiw/hiw.js */ \"./src/blocks/hiw/hiw.js\");\n/* harmony import */ var _blocks_footer_footer_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../blocks/footer/footer.js */ \"./src/blocks/footer/footer.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://gulp-template/./src/scripts/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/scripts/index.js");
/******/ 	
/******/ })()
;