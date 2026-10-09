/*!***************************************************
 * google-translate.js v1.0.3
 * https://Get-Web.Site/
 * author: Vitalii P.
 *****************************************************/

const googleTranslateConfig = {
  /* Original language */
  lang: 'ru',
  /* Если скрипт не работает на поддомене,
    раскомментируйте и
    укажите основной домен в свойстве domain */
  /* domain: "Get-Web.Site" */
};

/*
 * Языки лендинга: тот же список и порядок, что в админке и клиентском меню
 * (showme/front/src/i18n/languages.ts). Название каждого языка написано на нём
 * самом, чтобы человек нашёл свой язык, даже если не читает кириллицу.
 * Сама страница переводится виджетом Google Translate.
 */
const LANDING_LANGUAGES = [
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'es', name: 'Español' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ar', name: 'العربية' },
  { code: 'pt', name: 'Português' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'fr', name: 'Français' },
  { code: 'ja', name: '日本語' },
  { code: 'de', name: 'Deutsch' },
  { code: 'ko', name: '한국어' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'it', name: 'Italiano' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'pl', name: 'Polski' },
  { code: 'uk', name: 'Українська' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'th', name: 'ไทย' },
  { code: 'sr', name: 'Srpski' },
  { code: 'ka', name: 'ქართული' },
  { code: 'sv', name: 'Svenska' },
  { code: 'fa', name: 'فارسی' },
  { code: 'he', name: 'עברית' },
  { code: 'ro', name: 'Română' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'hu', name: 'Magyar' },
  { code: 'cs', name: 'Čeština' },
  { code: 'da', name: 'Dansk' },
  { code: 'fi', name: 'Suomi' },
  { code: 'nb', name: 'Norsk' },
];

/* Google Translate называет часть языков по-своему */
const GOOGLE_LANGUAGE_CODE = { zh: 'zh-CN', he: 'iw', nb: 'no' };

/* Старые и соседние коды, которые присылают браузеры */
const LANGUAGE_ALIASES = { no: 'nb', nn: 'nb', iw: 'he', in: 'id' };

/*
 * Картинки с экранами меню есть не для всех языков (тикет #4717):
 * русский, английский и сербский показывают свои, остальные английские.
 * Новый язык подключается добавлением кода сюда и папки images/translate/<код>.
 */
const IMAGE_LANGUAGES = ['ru', 'en', 'sr'];

const LANGUAGE_STORAGE_KEY = 'landingLanguage';

function toGoogleLanguage(code) {
  return GOOGLE_LANGUAGE_CODE[code] || code;
}

/* Язык из списка по тегам браузера (ru-RU, pt-BR, zh_CN); без совпадения английский */
function matchLandingLanguage(tags) {
  for (const tag of tags || []) {
    const base = String(tag || '')
      .toLowerCase()
      .split(/[-_]/)[0];
    const code = LANGUAGE_ALIASES[base] || base;
    if (LANDING_LANGUAGES.some((language) => language.code === code)) {
      return code;
    }
  }

  return 'en';
}

/* Текущий язык страницы: по куки виджета Google, иначе русский оригинал */
function currentLandingLanguage() {
  const google = TranslateGetCode();
  const own = LANDING_LANGUAGES.find(
    (language) =>
      toGoogleLanguage(language.code).toLowerCase() ===
      String(google).toLowerCase()
  );

  return own ? own.code : matchLandingLanguage([google]);
}

function imageFolderFor(code) {
  return (
    '/images/translate/' + (IMAGE_LANGUAGES.includes(code) ? code : 'en') + '/'
  );
}

function rememberLandingLanguage(code) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  } catch (e) {
    /* приватный режим: выбор просто не запомнится */
  }
}

function savedLandingLanguage() {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

/* Перевод страницы на выбранный язык: виджет Google читает куки при загрузке */
function applyLandingLanguage(code) {
  if (code === googleTranslateConfig.lang) {
    TranslateCookieHandler(null, googleTranslateConfig.domain);
  } else {
    TranslateCookieHandler(
      '/' + googleTranslateConfig.lang + '/' + toGoogleLanguage(code),
      googleTranslateConfig.domain
    );
  }
}

/*
 * Отдельные адреса для языков с картинкой превью в соцсетях (тикет #4717):
 * соцсети не выполняют скрипты и берут превью из мета-тегов адреса. Выбор
 * этих языков ведёт на их адрес, чтобы ссылку можно было просто скопировать;
 * остальные языки живут на корне.
 */
const LANGUAGE_PAGES = { en: '/en/', sr: '/sr/' };

function landingLanguagePage(code) {
  return LANGUAGE_PAGES[code] || '/';
}

function setLandingLanguage(code) {
  rememberLandingLanguage(code);
  applyLandingLanguage(code);

  const target = landingLanguagePage(code);

  if (window.location.pathname === target) {
    window.location.reload();
  } else {
    // метки рекламы (utm), прочие параметры и якорь остаются в адресе
    window.location.href = target + window.location.search + window.location.hash;
  }
}

function SetImage(elementID, folder, image) {
  const element = document.getElementById(elementID);
  element.childNodes[1].src = folder + image + '.png';
  element.childNodes[0].srcset = folder + image + '.webp';
}
function SetStyleImage(elementID, folder, image) {
  const element = document.getElementById(elementID);
  element.style =
    'background-image: url("' +
    folder +
    image +
    '.png"); background-image: url("' +
    folder +
    image +
    '.webp");';
}

/*
 * Язык страницы при загрузке. Вызывается и переключателем (по готовности
 * документа), и виджетом Google: переключатель рисуется раньше, чем грузится
 * виджет, и без этого показывал прежний язык, а ссылки в админку уходили с ним.
 */
function resolveLandingLanguage() {
  // Адрес /en/ или /sr/ задаёт язык сам: по нему пришли из ссылки в соцсетях
  const pageLanguage = window.LANDING_PAGE_LANGUAGE;

  if (pageLanguage) {
    rememberLandingLanguage(pageLanguage);
    applyLandingLanguage(pageLanguage);
  } else if (!savedLandingLanguage() && !Cookies.get('googtrans')) {
    // Первый визит: язык браузера, если человек ещё ничего не выбирал
    const firstVisit = matchLandingLanguage(
      navigator.languages || [navigator.language]
    );
    rememberLandingLanguage(firstVisit);
    applyLandingLanguage(firstVisit);
  }
}

function TranslateInit() {
  resolveLandingLanguage();

  let code = currentLandingLanguage();

  if (code == googleTranslateConfig.lang) {
    // Если язык по умолчанию, совпадает с языком на который переводим
    // То очищаем куки
    TranslateCookieHandler(null, googleTranslateConfig.domain);
  }

  // Инициализируем виджет с языком по умолчанию
  new google.translate.TranslateElement({
    pageLanguage: googleTranslateConfig.lang,
  });

  const imageFolder = imageFolderFor(code);

  SetImage('light_theme', imageFolder, 'base-view-theme-light');
  SetImage('theme_light_theme', imageFolder, 'base-view-theme-light');
  SetImage('dark_theme', imageFolder, 'base-view-theme-dark');
  SetImage('theme_dark_theme', imageFolder, 'base-view-theme-dark');
  SetImage('hiw1_image', imageFolder, 'hiw__image-01');
  SetImage('hiw2_image', imageFolder, 'hiw__image-02');
  SetImage('hiw3_image', imageFolder, 'hiw__image-03');
  SetImage('hiw5_image', imageFolder, 'hiw__image-05');
  SetImage('hiw6_image', imageFolder, 'hiw__image-06');
  SetStyleImage('step1_image', imageFolder, 'step__image-01');
  SetStyleImage('step2_image', imageFolder, 'step__image-02');
  SetStyleImage('step3_image', imageFolder, 'step__image-03');
}

function TranslateGetCode() {
  // Если куки нет, то передаем дефолтный язык
  let lang =
    Cookies.get('googtrans') != undefined && Cookies.get('googtrans') != 'null'
      ? Cookies.get('googtrans')
      : googleTranslateConfig.lang;
  return lang.match(/(?!^\/)[^\/]*$/gm)[0];
}

function TranslateCookieHandler(val, domain) {
  // Записываем куки /язык_который_переводим/язык_на_который_переводим
  Cookies.set('googtrans', val);
  Cookies.set('googtrans', val, {
    domain: '.' + document.domain,
  });

  if (domain == 'undefined') return;
  // записываем куки для домена, если он назначен в конфиге
  Cookies.set('googtrans', val, {
    domain: domain,
  });

  Cookies.set('googtrans', val, {
    domain: '.' + domain,
  });
}
