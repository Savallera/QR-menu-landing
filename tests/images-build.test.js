import assert from 'node:assert/strict';
import { copyFile, mkdtemp, mkdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import gulp from 'gulp';
import settings from '../gulp/config/path.js';
import images, { imagesDev } from '../gulp/tasks/images.js';

test('production и development сохраняют готовый WebP без перекодирования', async () => {
  const fixture = await mkdtemp(join(tmpdir(), 'showme-image-build-'));
  const originalImages = settings.images;
  const originalSvg = settings.svg;
  try {
    const sourceDir = join(fixture, 'source');
    await mkdir(join(sourceDir, 'decor'), { recursive: true });
    const sourceFile = join(sourceDir, 'decor/faq.webp');
    await copyFile(
      new URL('../src/images/faq-pattern.webp', import.meta.url),
      sourceFile
    );
    const source = await readFile(sourceFile);
    const glob = (value) => value.replaceAll('\\', '/');

    for (const [name, task] of [
      ['production', images],
      ['development', imagesDev],
    ]) {
      const destination = join(fixture, name);
      settings.images = {
        ...originalImages,
        src: [glob(join(sourceDir, '*.png'))],
        optimized: [glob(join(sourceDir, '**/*.{webp,avif}'))],
        dest: destination,
      };
      settings.svg = {
        ...originalSvg,
        src: [glob(join(sourceDir, '*.svg'))],
        dest: destination,
      };
      await new Promise((resolve, reject) =>
        gulp.series(task)((error) => (error ? reject(error) : resolve()))
      );
      assert.deepEqual(
        await readFile(join(destination, 'decor/faq.webp')),
        source,
        name
      );
    }
  } finally {
    settings.images = originalImages;
    settings.svg = originalSvg;
    assert.equal(dirname(fixture), tmpdir());
    await rm(fixture, { recursive: true, force: true });
  }
});
