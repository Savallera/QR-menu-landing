import assert from 'node:assert/strict';
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { build } from '../scripts/build-legal-documents.mjs';

test('генерация юридических документов сохраняет отдельную страницу тарифов', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'showme-legal-build-'));
  try {
    await cp(
      new URL('../src/legal/documents/', import.meta.url),
      join(fixture, 'src/legal/documents'),
      { recursive: true }
    );
    const pricesDir = join(fixture, 'src/pages/prices');
    await mkdir(pricesDir, { recursive: true });
    const prices = await readFile(
      new URL('../src/pages/prices/index.html', import.meta.url)
    );
    await writeFile(join(pricesDir, 'index.html'), prices);

    await build(fixture);

    assert.deepEqual(await readFile(join(pricesDir, 'index.html')), prices);
    const manifest = JSON.parse(
      await readFile(
        join(fixture, 'src/files/legal/registration-documents.json'),
        'utf8'
      )
    );
    assert.equal(manifest.documents.length, 3);
    for (const page of ['offer', 'privacy', 'personal-data-consent']) {
      const generated = await readFile(
        join(fixture, 'src/pages', page, 'index.html'),
        'utf8'
      );
      assert.ok(generated.includes('legal-document'));
    }
  } finally {
    assert.equal(dirname(fixture), tmpdir());
    await rm(fixture, { recursive: true, force: true });
  }
});
