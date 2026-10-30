import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  renderDocument,
  renderInline,
} from '../scripts/build-legal-documents.mjs';

const plain = (html) =>
  html
    .replace(
      /<span class="mobile-table-label" aria-hidden="true">[\s\S]*?<\/span>/g,
      ''
    )
    .replace(/<[^>]*>/g, '')
    .replace(
      /&(?:amp|lt|gt|quot|#39|nbsp);/g,
      (entity) =>
        ({
          '&amp;': '&',
          '&lt;': '<',
          '&gt;': '>',
          '&quot;': '"',
          '&#39;': "'",
          '&nbsp;': ' ',
        })[entity]
    );
const normalize = (text) => text.replace(/\s+/g, ' ').trim();
const boldCount = (blocks) =>
  blocks.reduce(
    (total, block) =>
      total +
      (block.kind === 'paragraph'
        ? block.runs.filter((run) => run.bold && run.text.trim()).length
        : block.rows
            .flat()
            .reduce((count, cell) => count + boldCount(cell), 0)),
    0
  );
const sourceText = (blocks) =>
  blocks
    .map((block) =>
      block.kind === 'paragraph'
        ? block.runs.map((run) => run.text).join('')
        : block.rows
            .flatMap((row) => row.map((cell) => sourceText(cell)))
            .join('\n')
    )
    .join('\n');

for (const key of ['offer', 'privacy']) {
  test(
    key + ': весь утверждённый текст сохраняется при переносе в HTML',
    () => {
      const source = JSON.parse(
        readFileSync(
          new URL('../src/legal/documents/' + key + '.json', import.meta.url),
          'utf8'
        )
      );
      const html = renderDocument(source, key);
      assert.equal(
        normalize(plain(html)),
        normalize(sourceText(source.blocks))
      );
      assert.equal((html.match(/<h1\b/g) || []).length, 1);
      assert.equal(
        (html.match(/<strong>/g) || []).length,
        boldCount(source.blocks)
      );
      assert.ok(!/href="javascript:/i.test(html));
      if (key === 'privacy') {
        assert.equal((html.match(/data-source-cell=/g) || []).length, 42);
        assert.equal((html.match(/ role="columnheader"/g) || []).length, 7);
        assert.equal((html.match(/ data-label=/g) || []).length, 35);
        assert.equal((html.match(/<ol\b/g) || []).length, 3);
        assert.ok(!html.includes('Редакция от'));
      } else {
        assert.ok(plain(html).includes('Редакция от 30.10.2026'));
        assert.ok(html.includes('id="tariffs"'));
        assert.ok(html.includes('id="refunds"'));
      }
    }
  );
}

test('текст и атрибуты из документа не исполняются как HTML', () => {
  const html = renderInline({
    text: '<script>alert(1)</script>',
    link: 'javascript:alert(1)',
    bold: true,
  });
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('href='));
  assert.ok(html.includes('<strong>'));
  assert.equal(plain(html), '<script>alert(1)</script>');
  const linked = renderInline({
    text: 'Ссылка',
    link: 'https://showme.menu/" onclick="alert(1)',
  });
  assert.ok(linked.includes('&quot;'));
  assert.ok(!linked.includes(' onclick="'));
});
