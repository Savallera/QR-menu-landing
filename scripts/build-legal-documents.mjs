import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

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
    content = `<a class="legal-document__link" href="${escapeHtml(run.link)}">${textPart(run.text)}</a>`;
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
        ? `<a class="legal-document__link" href="${escapeHtml(href)}">${escapeHtml(url)}</a>`
        : escapeHtml(url);
      content += `<span class="notranslate" dir="ltr" translate="no">${value}${escapeHtml(punctuation)}</span>`;
      position = match.index + token.length;
    }
    content += textPart(run.text.slice(position));
  }
  if (run.bold)
    content = `<strong class="legal-document__emphasis">${content}</strong>`;
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
              : `<span class="legal-document__cell-label" aria-hidden="true">${escapeHtml(headings[column])}</span>`;
            return `<${tag} class="legal-document__table-cell${header ? ' legal-document__table-cell_content_heading' : ''}" ${attrs} data-source-cell="${index}-${header ? 0 : block.rows.indexOf(row)}-${column}">${mobileLabel}${body}</${tag}>`;
          })
          .join('');
      output += `<table class="legal-document__table" role="table"><thead class="legal-document__table-head" role="rowgroup"><tr class="legal-document__table-row" role="row">${cells(block.rows[0], true)}</tr></thead><tbody class="legal-document__table-body" role="rowgroup">${block.rows
        .slice(1)
        .map(
          (row) =>
            `<tr class="legal-document__table-row" role="row">${cells(row, false)}</tr>`
        )
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
        output += `<${tag} class="legal-document__list${ordered ? ' legal-document__list_ordered' : ''}"${ordered ? ` start="${count}"` : ''}>\n`;
        openList = { id, tag };
      }
      output += `<li class="legal-document__list-item" data-source-block="${index}">${content}</li>\n`;
      counters.set(id, (counters.get(id) ?? start) + 1);
      return;
    }
    closeList();
    let tag = 'p';
    let attrs = ' class="legal-document__paragraph"';
    if (
      (key === 'offer' && text === 'ОФЕРТА') ||
      (['privacy', 'personal-data-consent'].includes(key) &&
        block.style === 'HEADING_1')
    ) {
      tag = 'h1';
      attrs =
        ' class="section__title legal-document__title" id="page-title" tabindex="-1"';
    } else if (block.style.startsWith('HEADING_')) {
      tag = 'h2';
      const number = text.match(/^(\d+)\./)?.[1];
      attrs = ` class="legal-document__heading" id="${key === 'offer' && number === '3' ? 'tariffs' : key === 'offer' && number === '4' ? 'refunds' : 'section-' + index}"`;
    } else if (/^Редакция от /.test(text)) {
      attrs =
        ' class="legal-document__paragraph legal-document__paragraph_content_edition"';
    }
    output += `<${tag}${attrs} data-source-block="${index}">${content}</${tag}>\n`;
  });
  closeList();
  return output;
}

export function registrationDocument(source, key) {
  if (key === 'personal-data-consent' && source.approved !== true) return null;
  const code = key === 'personal-data-consent' ? 'consent' : key;
  const contentHtml = renderDocument(source, key);
  const contentSha256 = createHash('sha256').update(contentHtml).digest('hex');
  return {
    code,
    revisionId: `${code}:${contentSha256}`,
    contentSha256,
    contentHtml,
    canonicalUrl: `https://showme.menu/${key}/`,
    sourceRevisionId: source.revisionId,
    approved: true,
  };
}

function shell(key, title, body, pending = false, revisionId = '') {
  const context = JSON.stringify({
    title: title + ' | Showme.menu',
    description: title + ' сервиса Showme.menu.',
    canonical: `https://showme.menu/${key}/`,
    robots: pending ? 'noindex' : 'index, follow',
    skipText: 'К документу',
    contentClass: '',
    breadcrumbsTitle: title,
    legalDocumentRevision: revisionId,
  });
  return `<!-- prettier-ignore -->
@@include("../../blocks/legal-document/page-start.html", ${context})
${body}
@@include("../../blocks/legal-document/page-end.html")\n`;
}

export async function build(projectRoot = root) {
  const registrationDocuments = [];
  for (const [key, title] of [
    ['offer', 'Оферта'],
    ['privacy', 'Политика обработки персональных данных'],
  ]) {
    const source = JSON.parse(
      await readFile(
        resolve(projectRoot, 'src/legal/documents', key + '.json'),
        'utf8'
      )
    );
    const target = resolve(projectRoot, 'src/pages', key);
    const revision = registrationDocument(source, key);
    registrationDocuments.push(revision);
    await mkdir(target, { recursive: true });
    await writeFile(
      resolve(target, 'index.html'),
      shell(key, title, revision.contentHtml, false, revision.revisionId)
    );
  }
  const consent = 'personal-data-consent';
  let consentRevision = null;
  try {
    const source = JSON.parse(
      await readFile(
        resolve(projectRoot, 'src/legal/documents', consent + '.json'),
        'utf8'
      )
    );
    consentRevision = registrationDocument(source, consent);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (consentRevision) registrationDocuments.push(consentRevision);
  await mkdir(resolve(projectRoot, 'src/pages', consent), { recursive: true });
  await writeFile(
    resolve(projectRoot, 'src/pages', consent, 'index.html'),
    shell(
      consent,
      'Согласие на обработку персональных данных',
      consentRevision?.contentHtml ??
        '<h1 class="section__title legal-document__title" id="page-title" tabindex="-1">Согласие на обработку персональных данных</h1><p class="legal-document__notice" role="status">Текст согласия будет опубликован после подготовки и утверждения.</p><p class="legal-document__paragraph">По вопросам обработки персональных данных: <a class="legal-document__link notranslate" dir="ltr" translate="no" href="mailto:support@showme.menu">support@showme.menu</a>.</p>',
      !consentRevision,
      consentRevision?.revisionId ?? ''
    )
  );
  await mkdir(resolve(projectRoot, 'src/files/legal'), { recursive: true });
  await writeFile(
    resolve(projectRoot, 'src/files/legal/registration-documents.json'),
    JSON.stringify(
      {
        schemaVersion: 1,
        documents: registrationDocuments,
      },
      null,
      2
    ) + '\n'
  );
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await build();
