import { copyFileSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(fileURLToPath(import.meta.url));
const srcImage = join(rootDir, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const destImage = join(outDir, 'entry.png');

const header = readFileSync(srcImage);
if (header.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') {
  throw new Error('entry.png is not a valid PNG');
}
if (header.byteLength > 1_048_576) {
  throw new Error(`entry.png exceeds 1 MiB (${header.byteLength} bytes)`);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(srcImage, destImage);

const info = statSync(destImage);
if (info.size !== header.byteLength) {
  throw new Error('Copied entry.png size mismatch');
}

