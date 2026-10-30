import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';

const translator = readFileSync(
  new URL('../src/scripts/libs/google-translate.js', import.meta.url),
  'utf8'
);

function setup({
  saved,
  cookie,
  page,
  languages = ['ru-RU'],
  blockedStorage = false,
  url = 'https://showme.menu/contacts/',
} = {}) {
  const storage = new Map(saved ? [['landingLanguage', saved]] : []);
  const cookies = new Map(cookie ? [['googtrans', cookie]] : []);
  const writes = [];
  const homes = [{ href: '/' }, { href: '/' }];
  const listeners = new Map();
  let reloads = 0;
  let widgetInitializations = 0;
  const context = vm.createContext({
    URL,
    window: {
      LANDING_PAGE_LANGUAGE: page,
      location: {
        href: url,
        pathname: new URL(url).pathname,
        reload() {
          reloads += 1;
        },
      },
      history: {
        state: null,
        replaceState(_state, _title, target) {
          context.window.location.href = target;
        },
      },
      addEventListener(name, listener) {
        listeners.set(name, listener);
      },
    },
    document: {
      domain: 'showme.menu',
      documentElement: { lang: 'ru', dir: 'ltr' },
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: (selector) =>
        selector === '[data-landing-home]' ? homes : [],
    },
    navigator: { languages },
    localStorage: {
      getItem(key) {
        if (blockedStorage) throw new Error('Storage denied');
        return storage.get(key) || null;
      },
      setItem(key, value) {
        if (blockedStorage) throw new Error('Storage denied');
        storage.set(key, value);
      },
    },
    Cookies: {
      get: (key) => cookies.get(key),
      set(key, value, options) {
        writes.push({ key, value, options });
        cookies.set(key, value);
      },
    },
    google: {
      translate: {
        TranslateElement: function () {
          widgetInitializations += 1;
        },
      },
    },
  });
  vm.runInContext(translator, context);
  return {
    context,
    cookies,
    storage,
    writes,
    homes,
    pageshow: (persisted) => listeners.get('pageshow')({ persisted }),
    reloadCount: () => reloads,
    widgetCount: () => widgetInitializations,
  };
}

test('внутренняя страница восстанавливает сохранённый язык после удаления сессионных cookies', () => {
  const state = setup({ saved: 'en' });
  assert.equal(state.context.resolveLandingLanguage(), 'en');
  assert.equal(state.cookies.get('googtrans'), '/ru/en');
});

test('явный язык адреса главной сохраняет приоритет над старым выбором', () => {
  const state = setup({ saved: 'en', cookie: '/ru/en', page: 'sr' });
  assert.equal(state.context.resolveLandingLanguage(), 'sr');
  assert.equal(state.storage.get('landingLanguage'), 'sr');
  assert.equal(state.cookies.get('googtrans'), '/ru/sr');
});

test('выбранный русский сбрасывает прежний перевод', () => {
  const state = setup({ saved: 'ru', cookie: '/ru/en' });
  assert.equal(state.context.resolveLandingLanguage(), 'ru');
  assert.equal(state.context.currentLandingLanguage(), 'ru');
});

test('возврат к кэшированной странице применяет новый выбор, включая русский', () => {
  for (const [before, after] of [
    ['de', 'ru'],
    ['ar', 'ru'],
    ['ru', 'fr'],
  ]) {
    const state = setup({ saved: before });
    state.context.resolveLandingLanguage();
    state.storage.set('landingLanguage', after);
    state.context.applyLandingLanguage(after);
    state.pageshow(true);
    assert.equal(state.reloadCount(), 1, before + ' -> ' + after);
  }
});

test('обычная загрузка и возврат к неизменённому русскому не вызывают перезагрузку', () => {
  const translated = setup({ saved: 'en' });
  translated.context.resolveLandingLanguage();
  translated.pageshow(false);
  assert.equal(translated.reloadCount(), 0);

  const original = setup({ saved: 'ru' });
  original.context.resolveLandingLanguage();
  original.pageshow(true);
  assert.equal(original.reloadCount(), 0);
});

test('неподдерживаемое сохранённое значение не попадает в cookies или ссылки', () => {
  const state = setup({ saved: 'javascript:alert(1)', languages: ['de-DE'] });
  assert.equal(state.context.resolveLandingLanguage(), 'de');
  assert.equal(state.cookies.get('googtrans'), '/ru/de');
});

test('при заблокированном storage используется уже выбранный язык cookies', () => {
  const state = setup({ cookie: '/ru/fr', blockedStorage: true });
  assert.equal(state.context.resolveLandingLanguage(), 'fr');
  assert.equal(state.cookies.get('googtrans'), '/ru/fr');
});

test('первый прямой визит использует тот же выбор по языку браузера, что главная', () => {
  const state = setup({ languages: ['xx', 'pt-BR'] });
  assert.equal(state.context.resolveLandingLanguage(), 'pt');
  assert.equal(state.storage.get('landingLanguage'), 'pt');
});

test('перевод инициализируется на странице без картинок лендинга', () => {
  const state = setup({ saved: 'en' });
  assert.doesNotThrow(() => state.context.TranslateInit());
  assert.equal(state.widgetCount(), 1);
});

test('не создаются cookies с несуществующим доменом undefined', () => {
  const state = setup({ saved: 'en' });
  state.context.applyLandingLanguage('en');
  assert.ok(
    state.writes.every(
      ({ options }) => !String(options?.domain).includes('.undefined')
    )
  );
});

test('переключение языка документа сохраняет его адрес и якорь', () => {
  const state = setup({
    saved: 'ru',
    url: 'https://showme.menu/offer/?utm_source=menu#tariffs',
  });
  state.context.document.querySelector = (selector) =>
    selector === '[data-legal-document]' ? {} : null;
  state.context.setLandingLanguage('en');
  assert.equal(state.storage.get('landingLanguage'), 'en');
  assert.equal(state.cookies.get('googtrans'), '/ru/en');
  assert.equal(state.reloadCount(), 1);
  assert.equal(
    state.context.window.location.href,
    'https://showme.menu/offer/?utm_source=menu#tariffs'
  );
});

test('общий шаблон внутренней страницы наследует язык, направление и адрес главной', () => {
  const partial = readFileSync(
    new URL('../src/blocks/page-language/page-language.html', import.meta.url),
    'utf8'
  );
  const inline = [...partial.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (match) => match[1]
  );
  assert.equal(inline.length, 1);
  for (const [code, cookieCode, direction, home] of [
    ['en', 'en', 'ltr', '/en/'],
    ['sr', 'sr', 'ltr', '/sr/'],
    ['zh', 'zh-CN', 'ltr', '/zh/'],
    ['ar', 'ar', 'rtl', '/ar/'],
    ['fa', 'fa', 'rtl', '/'],
    ['he', 'iw', 'rtl', '/'],
    ['nb', 'no', 'ltr', '/'],
    ['ru', null, 'ltr', '/'],
  ]) {
    const state = setup({ saved: code });
    vm.runInContext(inline[0], state.context);
    assert.equal(state.context.document.documentElement.lang, code);
    assert.equal(state.context.document.documentElement.dir, direction);
    assert.ok(state.homes.every((link) => link.href === home));
    assert.equal(
      state.cookies.get('googtrans'),
      cookieCode ? '/ru/' + cookieCode : null
    );
  }
});

test('язык ссылки из другого поддомена имеет приоритет и удаляется без потери остальных параметров', () => {
  const partial = readFileSync(
    new URL('../src/blocks/page-language/page-language.html', import.meta.url),
    'utf8'
  );
  const script = [...partial.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1];
  for (const blockedStorage of [false, true]) {
    const state = setup({
      saved: 'ru',
      blockedStorage,
      url: 'https://showme.menu/offer/?lang=en&utm_source=menu#tariffs',
    });
    vm.runInContext(script, state.context);
    assert.equal(state.context.document.documentElement.lang, 'en');
    assert.equal(state.cookies.get('googtrans'), '/ru/en');
    assert.equal(
      state.context.window.location.href,
      'https://showme.menu/offer/?utm_source=menu#tariffs'
    );
  }
  const invalid = setup({
    saved: 'ru',
    url: 'https://showme.menu/privacy/?lang=javascript%3Aalert(1)',
  });
  vm.runInContext(script, invalid.context);
  assert.equal(invalid.context.document.documentElement.lang, 'ru');
  assert.equal(
    invalid.context.window.location.href,
    'https://showme.menu/privacy/'
  );
});
