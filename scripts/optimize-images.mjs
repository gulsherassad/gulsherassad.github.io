// Converts every PNG in public/projects/ to WebP (max 1600px wide, quality 80)
// and deletes the PNG once its WebP has been written. Run: npm run images
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = fileURLToPath(new URL('../public/projects/', import.meta.url));
const MAX_WIDTH = 1600;
const QUALITY = 80;

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const pngs = (await readdir(DIR)).filter((f) => /\.png$/i.test(f)).sort();

if (pngs.length === 0) {
  console.log('No PNGs in public/projects/ — nothing to do.');
} else {
  for (const file of pngs) {
    const input = path.join(DIR, file);
    const output = path.join(DIR, file.replace(/\.png$/i, '.webp'));
    const before = (await stat(input)).size;

    const info = await sharp(input)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(output);

    await unlink(input); // only reached if the WebP was written
    console.log(
      `${file} → ${path.basename(output)}  ${info.width}×${info.height}  ${kb(before)} → ${kb(info.size)}`,
    );
  }
}
