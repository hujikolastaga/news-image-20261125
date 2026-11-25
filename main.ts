// Entry for news-image-20261125: writes the 1024x1024 editorial broadsheet
// for Wednesday 25 November 2026 to /output/entry.png deterministically.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_BYTES = 1_048_576;
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const srcPath = new URL('./entry.png', import.meta.url);
const imageBytes = readFileSync(srcPath);

if (imageBytes.length === 0 || imageBytes.length > MAX_BYTES) {
  throw new Error(`Invalid entry.png byte length: ${imageBytes.length}`);
}
if (!imageBytes.subarray(0, 8).equals(PNG_MAGIC)) {
  throw new Error('entry.png does not begin with a valid PNG header');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), imageBytes);
