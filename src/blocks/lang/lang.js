// Переключатель языка в шапке: как на формах входа в админку и в клиентском меню.
// Языков 31, поэтому сверху поиск, затем текущий язык, часто используемые
// и все по алфавиту. Названия языков на них самих, рядом мелко на текущем языке
// страницы (их даёт браузер через Intl.DisplayNames); сортировка по этой подписи.
// Список языков и перевод страницы живут в scripts/libs/google-translate.js.

const POPULAR_LANGUAGES = ['ru', 'en', 'sr', 'de'];

// Подписи переключателя: он помечен notranslate, Google его не переводит
const LANG_PICKER_TEXT = {
  ru: { search: 'Поиск языка', popular: 'Часто используемые', all: 'Все языки', empty: 'Ничего не нашлось' },
  en: { search: 'Search language', popular: 'Frequently used', all: 'All languages', empty: 'Nothing found' },
  zh: { search: '搜索语言', popular: '常用', all: '所有语言', empty: '未找到' },
  es: { search: 'Buscar idioma', popular: 'Más usados', all: 'Todos los idiomas', empty: 'No se encontró nada' },
  hi: { search: 'भाषा खोजें', popular: 'अक्सर उपयोग की जाने वाली', all: 'सभी भाषाएँ', empty: 'कुछ नहीं मिला' },
  ar: { search: 'ابحث عن لغة', popular: 'الأكثر استخدامًا', all: 'كل اللغات', empty: 'لم يتم العثور على شيء' },
  pt: { search: 'Pesquisar idioma', popular: 'Mais usados', all: 'Todos os idiomas', empty: 'Nada encontrado' },
  id: { search: 'Cari bahasa', popular: 'Sering digunakan', all: 'Semua bahasa', empty: 'Tidak ditemukan' },
  fr: { search: 'Rechercher une langue', popular: 'Les plus utilisées', all: 'Toutes les langues', empty: 'Aucun résultat' },
  ja: { search: '言語を検索', popular: 'よく使う言語', all: 'すべての言語', empty: '見つかりません' },
  de: { search: 'Sprache suchen', popular: 'Häufig verwendet', all: 'Alle Sprachen', empty: 'Nichts gefunden' },
  ko: { search: '언어 검색', popular: '자주 사용하는 언어', all: '모든 언어', empty: '찾을 수 없습니다' },
  tr: { search: 'Dil ara', popular: 'Sık kullanılanlar', all: 'Tüm diller', empty: 'Hiçbir şey bulunamadı' },
  it: { search: 'Cerca lingua', popular: 'Più usate', all: 'Tutte le lingue', empty: 'Nessun risultato' },
  vi: { search: 'Tìm ngôn ngữ', popular: 'Thường dùng', all: 'Tất cả ngôn ngữ', empty: 'Không tìm thấy' },
  pl: { search: 'Szukaj języka', popular: 'Najczęściej używane', all: 'Wszystkie języki', empty: 'Nic nie znaleziono' },
  uk: { search: 'Пошук мови', popular: 'Часто використовувані', all: 'Усі мови', empty: 'Нічого не знайдено' },
  nl: { search: 'Taal zoeken', popular: 'Veelgebruikt', all: 'Alle talen', empty: 'Niets gevonden' },
  th: { search: 'ค้นหาภาษา', popular: 'ใช้บ่อย', all: 'ทุกภาษา', empty: 'ไม่พบรายการ' },
  sr: { search: 'Pretraga jezika', popular: 'Često korišćeni', all: 'Svi jezici', empty: 'Ništa nije pronađeno' },
  ka: { search: 'ენის ძებნა', popular: 'ხშირად გამოყენებული', all: 'ყველა ენა', empty: 'ვერაფერი მოიძებნა' },
  sv: { search: 'Sök språk', popular: 'Vanligast', all: 'Alla språk', empty: 'Inget hittades' },
  he: { search: 'חיפוש שפה', popular: 'בשימוש נפוץ', all: 'כל השפות', empty: 'לא נמצא דבר' },
  fa: { search: 'جستجوی زبان', popular: 'پرکاربرد', all: 'همه زبان‌ها', empty: 'چیزی پیدا نشد' },
  ro: { search: 'Caută limba', popular: 'Cele mai folosite', all: 'Toate limbile', empty: 'Nu s-a găsit nimic' },
  el: { search: 'Αναζήτηση γλώσσας', popular: 'Συχνά χρησιμοποιούμενες', all: 'Όλες οι γλώσσες', empty: 'Δεν βρέθηκε τίποτα' },
  hu: { search: 'Nyelv keresése', popular: 'Gyakran használt', all: 'Összes nyelv', empty: 'Nincs találat' },
  cs: { search: 'Hledat jazyk', popular: 'Často používané', all: 'Všechny jazyky', empty: 'Nic nenalezeno' },
  da: { search: 'Søg sprog', popular: 'Ofte brugte', all: 'Alle sprog', empty: 'Intet fundet' },
  fi: { search: 'Hae kieltä', popular: 'Usein käytetyt', all: 'Kaikki kielet', empty: 'Ei tuloksia' },
  nb: { search: 'Søk etter språk', popular: 'Mest brukt', all: 'Alle språk', empty: 'Ingenting funnet' },
};

const pickerText = (code, key) => (LANG_PICKER_TEXT[code] || LANG_PICKER_TEXT.en)[key];

// сербский на сайте латиницей, а Intl без уточнения пишет его кириллицей
const intlTag = (code) => (code === 'sr' ? 'sr-Latn' : code);

function localLanguageName(code, inLanguage) {
  try {
    const name = new Intl.DisplayNames([intlTag(inLanguage)], {
      type: 'language',
    }).of(code);
    if (!name || name === code) return '';
    return name.charAt(0).toLocaleUpperCase(intlTag(inLanguage)) + name.slice(1);
  } catch (e) {
    return '';
  }
}

const escapeHtml = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function languageRows(current, query) {
  const items = LANDING_LANGUAGES.map((language) => {
    const local = localLanguageName(language.code, current);
    return { ...language, local: local && local !== language.name ? local : '' };
  });
  const collator = new Intl.Collator(intlTag(current));
  const sorted = [...items].sort((a, b) => collator.compare(a.local || a.name, b.local || b.name));
  const needle = query.trim().toLocaleLowerCase();

  if (needle) {
    const found = sorted.filter((item) =>
      [item.name, item.local, localLanguageName(item.code, 'en'), item.code].some(
        (text) => text && text.toLocaleLowerCase().includes(needle)
      )
    );
    return found.length ? found.map((item) => ({ kind: 'option', item })) : [{ kind: 'empty' }];
  }

  const byCode = (code) => items.find((item) => item.code === code);
  const popular = POPULAR_LANGUAGES.filter((code) => code !== current).map(byCode).filter(Boolean);

  return [
    { kind: 'option', item: byCode(current) },
    ...(popular.length ? [{ kind: 'section', key: 'popular' }] : []),
    ...popular.map((item) => ({ kind: 'option', item })),
    { kind: 'section', key: 'all' },
    ...sorted.filter((item) => item.code !== current).map((item) => ({ kind: 'option', item })),
  ];
}

// переключателей два: в меню (компьютер) и в строке шапки (телефон)
function initLanguageSwitch(root) {
  if (typeof LANDING_LANGUAGES === 'undefined') return;

  const button = root.querySelector('[data-lang-button]');
  const codeLabel = root.querySelector('[data-lang-code]');
  const panel = root.querySelector('[data-lang-panel]');
  const search = root.querySelector('[data-lang-search]');
  const list = root.querySelector('[data-lang-list]');
  const current = currentLandingLanguage();
  const currentName = LANDING_LANGUAGES.find((item) => item.code === current)?.name;

  codeLabel.textContent = current.toUpperCase();
  button.title = currentName || '';
  button.setAttribute('aria-label', currentName || current);
  search.placeholder = pickerText(current, 'search');
  search.setAttribute('aria-label', pickerText(current, 'search'));

  const render = () => {
    list.innerHTML = languageRows(current, search.value)
      .map((row) => {
        if (row.kind === 'section') {
          return `<li class="lang__section" role="presentation">${escapeHtml(pickerText(current, row.key))}</li>`;
        }
        if (row.kind === 'empty') {
          return `<li class="lang__empty" role="presentation">${escapeHtml(pickerText(current, 'empty'))}</li>`;
        }
        const { item } = row;
        const selected = item.code === current;
        return (
          `<li role="presentation"><button type="button" role="option" class="lang__option${selected ? ' lang__option_active' : ''}" aria-selected="${selected}" data-lang-option="${item.code}">` +
          `<span class="lang__check" aria-hidden="true">${selected ? '✓' : ''}</span>` +
          `<span dir="auto">${escapeHtml(item.name)}</span>` +
          (item.local ? `<span class="lang__option-local">${escapeHtml(item.local)}</span>` : '') +
          '</button></li>'
        );
      })
      .join('');
  };

  const setOpen = (open) => {
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (!open) {
      search.value = '';
      return;
    }
    render();
    list.scrollTop = 0;
    // на компьютере сразу можно печатать; на телефоне фокус открыл бы
    // клавиатуру поверх списка, поэтому там поле ждёт касания
    if (window.matchMedia('(pointer: fine)').matches) search.focus();
  };

  button.addEventListener('click', () => setOpen(panel.hidden));
  search.addEventListener('input', render);
  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const first = list.querySelector('[data-lang-option]');
      if (first) first.click();
    }
  });

  list.addEventListener('click', (event) => {
    const option = event.target.closest('[data-lang-option]');
    if (!option) return;
    setOpen(false);
    const code = option.dataset.langOption;
    // языки со своим адресом (LANGUAGE_PAGES) ведут с корня на него, чтобы ссылку можно было скопировать
    if (code !== current || landingLanguagePage(code) !== window.location.pathname) setLandingLanguage(code);
  });

  // клик мимо списка и Escape закрывают его: список длинный и перекрывает страницу
  document.addEventListener('mousedown', (event) => {
    if (!panel.hidden && !root.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) {
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
  // язык адреса или первого визита до отрисовки: виджет Google грузится позже
  if (typeof resolveLandingLanguage !== 'undefined') resolveLandingLanguage();
  document.querySelectorAll('[data-lang]').forEach(initLanguageSwitch);
  passLanguageToService();
});
