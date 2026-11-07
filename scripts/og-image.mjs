// Renders the 1200×630 social preview to public/og.png. Run: npm run og
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { h, hasSerifItalic, loadFonts } from './fonts.mjs';

const OUT = fileURLToPath(new URL('../public/og.png', import.meta.url));
const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 72;

const BG = '#F4F2EE';
const TEXT = '#141414';
const MUTED = '#6B6862';
const RULE = '#D9D5CD';

const mono = { fontFamily: 'Geist Mono', fontSize: 22, color: MUTED };

// One span per word so the italic word can sit inline and lines still wrap.
// "systems —" stays together so the dash never starts a line.
const WORDS = [
  'I',
  'build',
  'software',
  'and',
  'ML',
  'systems —',
  'and',
  ['measure'],
  'whether',
  'they',
  'actually',
  'work.',
];

const headline = h(
  'div',
  {
    display: 'flex',
    flexWrap: 'wrap',
    columnGap: '0.24em',
    fontFamily: 'Instrument Serif',
    fontSize: 76,
    lineHeight: 1.02,
    letterSpacing: '-0.02em',
    color: TEXT,
  },
  ...WORDS.map((word) =>
    Array.isArray(word)
      ? h('span', { fontStyle: hasSerifItalic ? 'italic' : 'normal' }, word[0])
      : h('span', {}, word),
  ),
);

const tree = h(
  'div',
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // satori sizes boxes as content-box, so subtract the padding.
    width: WIDTH - 2 * PAD,
    height: HEIGHT - 2 * PAD,
    padding: PAD,
    backgroundColor: BG,
  },
  h('div', { display: 'flex', ...mono }, 'Gulsher Assad'),
  headline,
  h(
    'div',
    {
      display: 'flex',
      justifyContent: 'space-between',
      paddingTop: 24,
      borderTop: `1px solid ${RULE}`,
      ...mono,
    },
    h('span', {}, 'gulsherassad.github.io'),
    h('span', {}, 'EPL Predictor · Querybird · Scout'),
  ),
);

const svg = await satori(tree, {
  width: WIDTH,
  height: HEIGHT,
  fonts: await loadFonts(),
});
const png = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } })
  .render()
  .asPng();
await writeFile(OUT, png);
console.log(
  `public/og.png  ${WIDTH}×${HEIGHT}  ${(png.length / 1024).toFixed(1)} KB` +
    (hasSerifItalic ? '' : '  (no italic font file: "measure" set upright)'),
);
