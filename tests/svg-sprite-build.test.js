import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  unlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import gulp from 'gulp';
import settings from '../gulp/config/path.js';
import svgSprite from '../gulp/tasks/svgSprite.js';

test('спрайт всегда включает все SVG, очищает стили и удалённые иконки', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'showme-svg-sprite-'));
  const original = settings.svgSprite;
  try {
    const source = join(fixture, 'source');
    const destination = join(fixture, 'dist');
    await mkdir(source);
    await mkdir(destination);
    const icon =
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="display:block;visibility:visible;fill:currentColor"><style>svg{display:block}.paint{fill:currentColor}</style><g class="paint"><g><path d="M2 2h20v20H2z"/></g></g></svg>';
    for (const name of ['check', 'clock', 'icons']) {
      await writeFile(join(source, name + '.svg'), icon);
    }
    settings.svgSprite = {
      src: [join(source, '*.svg').replaceAll('\\', '/')],
      dest: destination,
    };
    const build = () =>
      new Promise((resolve, reject) =>
        gulp.series(svgSprite)((error) => (error ? reject(error) : resolve()))
      );
    await build();
    const target = join(destination, 'icons.svg');
    const first = await readFile(target, 'utf8');
    const shapeIds = (svg) =>
      [...svg.matchAll(/<svg\b[^>]*\bid="([^"]+)"/g)]
        .map((match) => match[1])
        .sort();
    assert.deepEqual(shapeIds(first), ['check', 'clock', 'icons']);
    assert.ok(!/\sstyle=|<g\b|<script\b|\sdisplay=|\svisibility=/.test(first));
    assert.ok(first.includes(':root>svg:target{display:block}'));
    assert.equal((first.match(/<style\b/g) || []).length, 1);
    assert.equal((first.match(/viewBox="0 0 24 24"/g) || []).length, 4);
    assert.ok(first.includes('currentColor'));

    const future = new Date(Date.now() + 86_400_000);
    await utimes(target, future, future);
    await build();
    assert.equal(await readFile(target, 'utf8'), first);

    await unlink(join(source, 'clock.svg'));
    await writeFile(join(source, 'chevron-down.svg'), icon);
    await build();
    assert.deepEqual(shapeIds(await readFile(target, 'utf8')), [
      'check',
      'chevron-down',
      'icons',
    ]);
  } finally {
    settings.svgSprite = original;
    assert.equal(dirname(fixture), tmpdir());
    await rm(fixture, { recursive: true, force: true });
  }
});
