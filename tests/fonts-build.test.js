import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { test } from 'node:test';

test('сборка обновляет fonts.css, даже когда старый файл dist имеет более новую дату', () => {
  const temporaryRoot = resolve(tmpdir());
  const fixture = mkdtempSync(join(temporaryRoot, 'qr-menu-fonts-'));
  const taskUrl = new URL('../gulp/tasks/fonts.js', import.meta.url).href;
  const source = readFileSync(
    new URL('../src/fonts/fonts.css', import.meta.url)
  );

  try {
    mkdirSync(join(fixture, 'src/fonts'), { recursive: true });
    mkdirSync(join(fixture, 'dist/fonts'), { recursive: true });
    writeFileSync(join(fixture, 'src/fonts/fonts.css'), source);
    const output = join(fixture, 'dist/fonts/fonts.css');
    writeFileSync(output, '@font-face { src: local("Raleway"); }');
    const future = new Date(Date.now() + 60_000);
    utimesSync(output, future, future);

    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import fonts from ${JSON.stringify(taskUrl)}; fonts(error => { if (error) { console.error(error); process.exitCode = 1; } });`,
      ],
      { cwd: fixture, timeout: 30_000 }
    );

    assert.deepEqual(readFileSync(output), source);
  } finally {
    if (!fixture.startsWith(temporaryRoot + sep)) {
      throw new Error(
        'Refusing to remove a fixture outside the temporary directory'
      );
    }
    rmSync(fixture, { recursive: true, force: true });
  }
});
