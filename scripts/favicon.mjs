// Builds public/favicon.svg ("GA" in Instrument Serif, glyphs as paths) and
// PNG fallbacks from it. Run: npm run favicon
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import sharp from 'sharp';
import { h, loadFonts } from './fonts.mjs';

const out = (name) =>
  fileURLToPath(new URL(`../public/${name}`, import.meta.url));

const SIZE = 64;
const fonts = await loadFonts({ mono: false });

// satori outputs text as <path> elements, so the SVG needs no fonts.
const monogram = (radius) =>
  satori(
    h(
      'div',
      {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: SIZE,
        height: SIZE,
        backgroundColor: '#F4F2EE',
        borderRadius: radius,
        fontFamily: 'Instrument Serif',
        fontSize: 40,
        letterSpacing: '-0.04em',
        color: '#141414',
      },
      // Nudged down for optical centring: the serif caps sit high.
      h('span', { marginTop: 4 }, 'GA'),
    ),
    { width: SIZE, height: SIZE, fonts },
  );

const favicon = await monogram(14);
await writeFile(out('favicon.svg'), favicon);

await sharp(Buffer.from(favicon), { density: 72 * (32 / SIZE) * 4 })
  .resize(32, 32)
  .png()
  .toFile(out('favicon-32.png'));

// iOS rounds the corners itself and fills transparent ones with black, so the
// touch icon is rendered as a full square.
await sharp(Buffer.from(await monogram(0)), { density: 72 * (180 / SIZE) })
  .resize(180, 180)
  .png()
  .toFile(out('apple-touch-icon.png'));

console.log(
  'public/favicon.svg, public/favicon-32.png (32×32), public/apple-touch-icon.png (180×180)',
);
