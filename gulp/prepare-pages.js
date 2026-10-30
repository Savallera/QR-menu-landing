import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const basePath = '/QR-menu-landing/';

async function preparePages(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      await preparePages(file);
    } else if (entry.name.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      const prepared = html
        .replace(
          /(["'(])\/(images|styles|scripts|fonts)\//g,
          `$1${basePath}$2/`
        )
        .replace(/<script>window\.LANDING_BASE_PATH="[^"]*";<\/script>/g, '')
        .replace(
          '</head>',
          `<script>window.LANDING_BASE_PATH=${JSON.stringify(basePath)};</script></head>`
        );
      await writeFile(file, prepared);
    }
  }
}

await preparePages(fileURLToPath(new URL('../dist/', import.meta.url)));
console.log(`GitHub Pages: prepared asset paths for ${basePath}`);
