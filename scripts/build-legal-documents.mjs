import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
export const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]
  );
const safeLink = (url) => /^(https?:\/\/|mailto:|tel:|#)/i.test(url);
const protectedText = (value) =>
  `<span class="notranslate" translate="no">${escapeHtml(value).replace(/\s/g, '&nbsp;')}</span>`;
const textPart = (value) => {
  const match = value.match(/^(\s*)([\s\S]*?)(\s*)$/);
  return (
    (match[1] ? protectedText(match[1]) : '') +
    escapeHtml(match[2]).replace(/\n/g, '<br>') +
    (match[3] ? protectedText(match[3]) : '')
  );
};

export function renderInline(run) {
  let content;
  if (run.link && safeLink(run.link)) {
    content = `<a href="${escapeHtml(run.link)}">${textPart(run.text)}</a>`;
  } else {
    const tokens =
      /https?:\/\/[^\s<>]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\+7[\d ()\u00a0-]{10,18}\d|\b\d{9,20}\b/g;
    let position = 0;
    content = '';
    for (const match of run.text.matchAll(tokens)) {
      content += textPart(run.text.slice(position, match.index));
      const token = match[0];
      const url = token.replace(/[.,;:)]+$/, '');
      const punctuation = token.slice(url.length);
      const href = /^https?:/.test(url)
        ? url
        : url.includes('@')
          ? 'mailto:' + url
          : url.startsWith('+7')
            ? 'tel:' + url.replace(/[^+\d]/g, '')
            : null;
      const value = href
        ? `<a href="${escapeHtml(href)}">${escapeHtml(url)}</a>`
        : escapeHtml(url);
      content += `<span class="notranslate" dir="ltr" translate="no">${value}${escapeHtml(punctuation)}</span>`;
      position = match.index + token.length;
    }
    content += textPart(run.text.slice(position));
  }
  if (run.bold) content = `<strong>${content}</strong>`;
  if (run.italic) content = `<em>${content}</em>`;
  return content;
}

const paragraphText = (block) =>
  block.runs
    .map((run) => run.text)
    .join('')
    .trim();
function paragraphContent(block) {
  const runs = block.runs.map((run) => ({ ...run }));
  while (runs.length && !runs[0].text.trim()) runs.shift();
  while (runs.length && !runs.at(-1).text.trim()) runs.pop();
  if (!runs.length) return '';
  runs[0].text = runs[0].text.trimStart();
  runs.at(-1).text = runs.at(-1).text.trimEnd();
  return runs.map(renderInline).join('');
}

export function renderDocument(document, key) {
  const counters = new Map();
  let openList = null;
  let output = '';
  const closeList = () => {
    if (openList) output += `</${openList.tag}>\n`;
    openList = null;
  };
  document.blocks.forEach((block, index) => {
    if (block.kind === 'table') {
      closeList();
      const headings = block.rows[0].map((cell) =>
        cell.map(paragraphText).join(' ')
      );
      const cells = (row, header) =>
        row
          .map((cell, column) => {
            const tag = header ? 'th' : 'td';
            const attrs = header
              ? `id="${key}-column-${column}" scope="col" role="columnheader"`
              : `headers="${key}-column-${column}" data-label="${escapeHtml(headings[column])}" role="cell"`;
            const body = renderDocument({ blocks: cell }, key + '-cell');
            const mobileLabel = header
              ? ''
              : `<span class="mobile-table-label" aria-hidden="true">${escapeHtml(headings[column])}</span>`;
            return `<${tag} ${attrs} data-source-cell="${index}-${header ? 0 : block.rows.indexOf(row)}-${column}">${mobileLabel}${body}</${tag}>`;
          })
          .join('');
      output += `<table class="legal-table" role="table"><thead role="rowgroup"><tr role="row">${cells(block.rows[0], true)}</tr></thead><tbody role="rowgroup">${block.rows
        .slice(1)
        .map((row) => `<tr role="row">${cells(row, false)}</tr>`)
        .join('')}</tbody></table>\n`;
      return;
    }
    const text = paragraphText(block);
    const content = paragraphContent(block);
    if (block.list) {
      const { id, ordered, start } = block.list;
      if (openList?.id !== id) {
        closeList();
        const count = counters.get(id) ?? start;
        const tag = ordered ? 'ol' : 'ul';
        output += `<${tag}${ordered ? ` start="${count}"` : ''}>\n`;
        openList = { id, tag };
      }
      output += `<li data-source-block="${index}">${content}</li>\n`;
      counters.set(id, (counters.get(id) ?? start) + 1);
      return;
    }
    closeList();
    let tag = 'p';
    let attrs = '';
    if (
      (key === 'offer' && text === 'ОФЕРТА') ||
      (key === 'privacy' && block.style === 'HEADING_1')
    ) {
      tag = 'h1';
      attrs = ' id="page-title"';
    } else if (block.style.startsWith('HEADING_')) {
      tag = 'h2';
      const number = text.match(/^(\d+)\./)?.[1];
      attrs = ` id="${key === 'offer' && number === '3' ? 'tariffs' : key === 'offer' && number === '4' ? 'refunds' : 'section-' + index}"`;
    } else if (/^Редакция от /.test(text)) {
      attrs = ' class="document-edition"';
    }
    output += `<${tag}${attrs} data-source-block="${index}">${content}</${tag}>\n`;
  });
  closeList();
  return output;
}

function shell(key, title, body, pending = false) {
  return `<!doctype html>
<html lang="ru" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
${pending ? '<meta name="robots" content="noindex">' : ''}
<meta name="description" content="${escapeHtml(title)} сервиса Showme.menu.">
<link rel="canonical" href="https://showme.menu/${key}/">
<link rel="icon" href="/images/favicon/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/fonts/fonts.css?v=@@buildVersion">
<link rel="stylesheet" href="/files/styles/contacts.css?v=@@buildVersion">
<link rel="stylesheet" href="/files/styles/legal-documents.css?v=@@buildVersion">
<title>${escapeHtml(title)} | Showme.menu</title>
</head>
<body class="legal-page">
<a class="skip" href="#page-title">К документу</a>
@@include("../../blocks/legal/header.html")
<main class="legal-main"><article class="legal-document" data-legal-document>${body}</article></main>
@@include("../../blocks/legal/footer.html")
@@include("../../blocks/page-language/page-language.html")
</body></html>`;
}

export async function build() {
  for (const [key, title] of [
    ['offer', 'Оферта'],
    ['privacy', 'Политика обработки персональных данных'],
  ]) {
    const source = JSON.parse(
      await readFile(
        resolve(root, 'src/legal/documents', key + '.json'),
        'utf8'
      )
    );
    const target = resolve(root, 'src/pages', key);
    await mkdir(target, { recursive: true });
    await writeFile(
      resolve(target, 'index.html'),
      shell(key, title, renderDocument(source, key))
    );
  }
  const consent = 'personal-data-consent';
  await mkdir(resolve(root, 'src/pages', consent), { recursive: true });
  await writeFile(
    resolve(root, 'src/pages', consent, 'index.html'),
    shell(
      consent,
      'Согласие на обработку персональных данных',
      '<h1 id="page-title">Согласие на обработку персональных данных</h1><p class="document-notice" role="status">Текст согласия будет опубликован после подготовки и утверждения.</p><p>По вопросам обработки персональных данных: <a class="notranslate" dir="ltr" translate="no" href="mailto:support@showme.menu">support@showme.menu</a>.</p>',
      true
    )
  );
  await mkdir(resolve(root, 'src/pages/prices'), { recursive: true });
  await writeFile(
    resolve(root, 'src/pages/prices/index.html'),
    '<!doctype html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0;url=/offer/#tariffs"><link rel="canonical" href="https://showme.menu/offer/#tariffs"><title>Тарифы и оплата | Showme.menu</title></head><body><a href="/offer/#tariffs">Тарифы и оплата</a></body></html>'
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await build();
