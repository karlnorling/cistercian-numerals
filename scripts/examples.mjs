// Renders the README images into examples/. Run with: yarn examples
import { mkdir, writeFile } from 'node:fs/promises';
import { toSvg } from '../packages/@cistercian/core/dist/index.js';

const out = new URL('../examples/', import.meta.url);
await mkdir(out, { recursive: true });

const style = { size: 120, color: '#24292f', background: '#ffffff' };
const examples = {
  1993: 1993,
  9999: 9999,
  12345: 12345,
  pi: '3.14159',
  negative: -42,
  zero: 0,
};
for (const [name, value] of Object.entries(examples)) {
  await writeFile(new URL(`${name}.svg`, out), toSvg(value, style));
}

// Gradients: a rainbow across a long number, and candy-cane stripes for Christmas Day.
await writeFile(
  new URL('rainbow.svg', out),
  toSvg(123456789, {
    size: 120,
    strokeWidth: 6,
    color:
      'linear-gradient(to right, #e03131, #f76707, #fab005, #40c057, #228be6, #7048e8, #be4bdb)',
  }),
);
await writeFile(
  new URL('christmas.svg', out),
  toSvg('2026.1225', {
    size: 120,
    strokeWidth: 7,
    padding: 16,
    color: 'repeating-linear-gradient(135deg, #e03131 0 3%, #ffffff 3% 6%)',
    background: 'radial-gradient(#2b8a3e, #0b3d20)',
  }),
);

// Every digit in every place, laid out like the chart on Wikipedia.
const cell = 60;
const rows = [1, 10, 100, 1000].map((place, row) =>
  Array.from({ length: 9 }, (_, i) => {
    const svg = toSvg((i + 1) * place, { size: cell, color: '#24292f', title: false });
    const inner = svg.replace(/^<svg[^>]*>|<\/svg>$/g, '');
    return `<svg x="${i * cell * 0.6}" y="${row * cell}" width="${cell * 0.6}" height="${cell}" viewBox="-10 -10 60 100">${inner}</svg>`;
  }).join(''),
);
const width = 9 * cell * 0.6;
const height = 4 * cell;
await writeFile(
  new URL('digits.svg', out),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width * 2}" height="${height * 2}" role="img" aria-label="Digits 1 to 9 as units, tens, hundreds and thousands"><rect width="${width}" height="${height}" fill="#ffffff"/>${rows.join('')}</svg>`,
);
console.log('Wrote examples/');
