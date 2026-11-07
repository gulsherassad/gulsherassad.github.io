// Font files from the local @fontsource packages, for satori (needs .woff, not .woff2).
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const file = (pkg, name) =>
  fileURLToPath(
    new URL(
      `../node_modules/@fontsource/${pkg}/files/${name}`,
      import.meta.url,
    ),
  );

const load = async (name, path, style) => ({
  name,
  data: await readFile(path),
  weight: 400,
  style,
});

const SERIF = file(
  'instrument-serif',
  'instrument-serif-latin-400-normal.woff',
);
const SERIF_ITALIC = file(
  'instrument-serif',
  'instrument-serif-latin-400-italic.woff',
);
const MONO = file('geist-mono', 'geist-mono-latin-400-normal.woff');

export const hasSerifItalic = existsSync(SERIF_ITALIC);

export async function loadFonts({ mono = true } = {}) {
  const fonts = [await load('Instrument Serif', SERIF, 'normal')];
  if (hasSerifItalic) {
    fonts.push(await load('Instrument Serif', SERIF_ITALIC, 'italic'));
  }
  if (mono) fonts.push(await load('Geist Mono', MONO, 'normal'));
  return fonts;
}

/** Tiny element helper so the scripts don't need JSX. */
export const h = (type, style, ...children) => ({
  type,
  props: {
    style,
    children: children.length === 1 ? children[0] : children,
  },
});
