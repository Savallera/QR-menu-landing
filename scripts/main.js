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

/***/ "./src/blocks/header/header.js":
/*!*************************************!*\
  !*** ./src/blocks/header/header.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// Меню в шапке\r\nconst header = document.querySelector('.header');\r\nconst headerBurger = document.querySelector('.header__burger');\r\n\r\nheaderBurger.addEventListener('click', () => {\r\n  header.classList.toggle('header_menu-opened');\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/header/header.js?");

/***/ }),

/***/ "./src/blocks/step/step.js":
/*!*********************************!*\
  !*** ./src/blocks/step/step.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nwindow.addEventListener('DOMContentLoaded', () => {\r\n  if (Splide) {\r\n    if (document.querySelector('#step-slider')) {\r\n      let stepSlider = new Splide('#step-slider', {\r\n        type: 'slide',\r\n        perPage: 1,\r\n        start: 1,\r\n        arrows: true,\r\n        pagination: true,\r\n        rewind: true,\r\n        autoplay: true,\r\n        gap: 'var(--indent-sm)',\r\n        padding: 'var(--indent-main-wide)',\r\n      });\r\n      stepSlider.mount();\r\n    }\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://gulp-template/./src/blocks/step/step.js?");

/***/ }),

/***/ "./src/scripts/index.js":
/*!******************************!*\
  !*** ./src/scripts/index.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _blocks_header_header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../blocks/header/header.js */ \"./src/blocks/header/header.js\");\n/* harmony import */ var _blocks_advantages_advantages_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../blocks/advantages/advantages.js */ \"./src/blocks/advantages/advantages.js\");\n/* harmony import */ var _blocks_step_step_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../blocks/step/step.js */ \"./src/blocks/step/step.js\");\n\r\n\r\n\n\n//# sourceURL=webpack://gulp-template/./src/scripts/index.js?");

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