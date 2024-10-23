/*!***************************************************
 * google-translate.js v1.0.3
 * https://Get-Web.Site/
 * author: Vitalii P.
 *****************************************************/

const googleTranslateConfig = {
    /* Original language */
    lang: "ru",
    /* The language we translate into on the first visit*/
    /* Язык, на который переводим при первом посещении */
    //langFirstVisit: 'en',
    /* Если скрипт не работает на поддомене, 
    раскомментируйте и
    укажите основной домен в свойстве domain */
    /* domain: "Get-Web.Site" */
};

function SetImage(elementID, folder, image){
    const element = document.getElementById(elementID);
    element.childNodes[1].src = folder + image + '.png';
    element.childNodes[0].srcset = folder + image + '.webp';
}
function SetStyleImage(elementID, folder, image){
    const element = document.getElementById(elementID);
    element.style = 'background-image: url("' + folder + image + '.png"); background-image: url("' + folder + image + '.webp");';
}

function TranslateInit() {

    if (googleTranslateConfig.langFirstVisit && !Cookies.get('googtrans')) {
        // Если установлен язык перевода для первого посещения и куки не назначены
        TranslateCookieHandler("/auto/" + googleTranslateConfig.langFirstVisit);
    }

    let code = TranslateGetCode();

    // Находим флаг с выбранным языком для перевода и добавляем к нему активный класс
    if (document.querySelector('[data-google-lang="' + code + '"]') !== null) {
        document.querySelector('[data-google-lang="' + code + '"]').classList.add('language__img_active');
    }

    if (code == googleTranslateConfig.lang) {
        // Если язык по умолчанию, совпадает с языком на который переводим
        // То очищаем куки
        TranslateCookieHandler(null, googleTranslateConfig.domain);
    }

    // Инициализируем виджет с языком по умолчанию
    new google.translate.TranslateElement({
        pageLanguage: googleTranslateConfig.lang,
    });

    // Вешаем событие  клик на флаги
    TranslateEventHandler('click', '[data-google-lang]', function (e) {
        TranslateCookieHandler("/" + googleTranslateConfig.lang + "/" + e.getAttribute("data-google-lang"), googleTranslateConfig.domain);
        // Перезагружаем страницу
        window.location.reload();
    });

    let imageFolder = './images/translate/ru/';

    switch (code) {
        case "en":
            imageFolder = './images/translate/en/';
            break;
    }

    SetImage('light_theme', imageFolder, 'base-view-theme-light');
    SetImage('dark_theme', imageFolder, 'base-view-theme-dark');
    SetImage('hiw1_image', imageFolder, 'hiw__image-01');
    SetImage('hiw2_image', imageFolder, 'hiw__image-02');
    SetImage('hiw3_image', imageFolder, 'hiw__image-03');
    SetImage('hiw5_image', imageFolder, 'hiw__image-05');
    SetImage('hiw6_image', imageFolder, 'hiw__image-06');
    SetStyleImage('step1_image', imageFolder, 'step__image-01');
    SetStyleImage('step2_image', imageFolder, 'step__image-02');
    SetStyleImage('step3_image', imageFolder, 'step__image-03');

    if(code === "en"){
        const languageCheckbox = document.querySelector('#language_checkbox');

        languageCheckbox.checked = true;
    }
}

function TranslateGetCode() {
    // Если куки нет, то передаем дефолтный язык
    let lang = (Cookies.get('googtrans') != undefined && Cookies.get('googtrans') != "null") ? Cookies.get('googtrans') : googleTranslateConfig.lang;
    return lang.match(/(?!^\/)[^\/]*$/gm)[0];
}

function TranslateCookieHandler(val, domain) {
    // Записываем куки /язык_который_переводим/язык_на_который_переводим
    Cookies.set('googtrans', val);
    Cookies.set("googtrans", val, {
        domain: "." + document.domain,
    });

    if (domain == "undefined") return;
    // записываем куки для домена, если он назначен в конфиге
    Cookies.set("googtrans", val, {
        domain: domain,
    });

    Cookies.set("googtrans", val, {
        domain: "." + domain,
    });
}

function TranslateEventHandler(event, selector, handler) {
    document.addEventListener(event, function (e) {
        let el = e.target.closest(selector);
        if (el) handler(el);
    });
}