import { describe, expect, it } from 'vitest';
import { parseGradient, toSvg } from '../src/index.js';

const attr = (svg: string, name: string) => new RegExp(` ${name}="([^"]*)"`).exec(svg)?.[1];

describe('parseGradient', () => {
  it('ignores plain colours', () => {
    expect(parseGradient('#c00')).toBeUndefined();
    expect(parseGradient('rgb(1, 2, 3)')).toBeUndefined();
  });

  it('reads a linear gradient with an angle and stop positions', () => {
    expect(parseGradient('linear-gradient(90deg, red, rgb(0, 0, 255) 75%)')).toEqual({
      type: 'linear',
      angle: 90,
      stops: [{ color: 'red' }, { color: 'rgb(0, 0, 255)', offset: 0.75 }],
    });
  });

  it.each([
    ['to top', 0],
    ['to right', 90],
    ['to bottom', 180],
    ['to left', -90],
    ['to bottom right', 135],
    ['0.25turn', 90],
  ])('reads the direction %s', (direction, angle) => {
    expect(parseGradient(`linear-gradient(${direction}, red, blue)`)?.angle).toBeCloseTo(angle);
  });

  it('reads a radial gradient and skips its shape', () => {
    expect(parseGradient('Radial-Gradient(circle at center, gold, crimson)')).toEqual({
      type: 'radial',
      stops: [{ color: 'gold' }, { color: 'crimson' }],
    });
  });

  it('rejects a gradient without colours', () => {
    expect(() => parseGradient('linear-gradient(90deg)')).toThrow('at least one colour');
  });
});

describe('toSvg with gradients', () => {
  it('strokes and fills the dot with a linear gradient across the image', () => {
    const svg = toSvg(12.5, { color: 'linear-gradient(to right, #f00, #00f)' });
    const id = /<linearGradient id="([^"]+)"/.exec(svg)?.[1];
    expect(id).toMatch(/^cistercian-color-/);
    // viewBox -10 -10 130 100: the line runs edge to edge through the middle.
    expect(svg).toContain(
      `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="-10" y1="40" x2="120" y2="40"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#00f"/></linearGradient>`,
    );
    expect(attr(svg, 'stroke')).toBe(`url(#${id})`);
    expect(svg).toContain(`fill="url(#${id})"/></svg>`);
  });

  it('defaults to top-to-bottom and spaces stops evenly', () => {
    const svg = toSvg(1, { color: { stops: ['red', 'lime', { color: 'blue', offset: 0.9 }] } });
    expect(svg).toContain('x1="20" y1="-10" x2="20" y2="90"');
    expect(svg).toContain(
      '<stop offset="0" stop-color="red"/><stop offset="0.45" stop-color="lime"/><stop offset="0.9" stop-color="blue"/>',
    );
  });

  it('draws a radial gradient from the centre out to the corners', () => {
    const svg = toSvg(1, { background: 'radial-gradient(white, black)' });
    expect(svg).toMatch(
      /<radialGradient id="cistercian-background-\w+" gradientUnits="userSpaceOnUse" cx="20" cy="40" r="58.31">/,
    );
    expect(attr(svg, 'stroke')).toBe('currentColor');
    expect(svg).toMatch(/<rect [^>]*fill="url\(#cistercian-background-\w+\)"\/>/);
  });

  it('gives different gradients different ids, and keeps them stable', () => {
    const a = toSvg(1, { color: 'linear-gradient(red, blue)' });
    expect(toSvg(1, { color: 'linear-gradient(red, blue)' })).toBe(a);
    expect(attr(toSvg(1, { color: 'linear-gradient(red, green)' }), 'stroke')).not.toBe(
      attr(a, 'stroke'),
    );
  });

  it('escapes colours inside the stops', () => {
    expect(toSvg(1, { color: 'linear-gradient("><x, red)' })).toContain(
      'stop-color="&#34;&#62;&#60;x"',
    );
  });
});

describe('repeating gradients', () => {
  it('reads two positions on one stop as a hard-edged band', () => {
    expect(parseGradient('repeating-linear-gradient(45deg, red 0 10%, white 10% 20%)')).toEqual({
      type: 'linear',
      angle: 45,
      repeat: true,
      stops: [
        { color: 'red', offset: 0 },
        { color: 'red', offset: 0.1 },
        { color: 'white', offset: 0.1 },
        { color: 'white', offset: 0.2 },
      ],
    });
  });

  it('draws one period and repeats it', () => {
    const svg = toSvg(1, { color: 'repeating-linear-gradient(red 0 10%, white 10% 20%)' });
    // Top to bottom over a 100-unit-high box: the period is the first 20 units.
    expect(svg).toContain('spreadMethod="repeat" x1="20" y1="-10" x2="20" y2="10"');
    expect(svg).toContain(
      '<stop offset="0" stop-color="red"/><stop offset="0.5" stop-color="red"/><stop offset="0.5" stop-color="white"/><stop offset="1" stop-color="white"/>',
    );
  });

  it('shrinks a repeating radial gradient to its last stop', () => {
    const svg = toSvg(1, { color: 'repeating-radial-gradient(red 0 5%, white 5% 10%)' });
    expect(svg).toContain('spreadMethod="repeat" cx="20" cy="40" r="5.831"');
  });

  it('rejects a repeating gradient with no length', () => {
    expect(() => toSvg(1, { color: 'repeating-linear-gradient(red 10%, blue 10%)' })).toThrow(
      'span some distance',
    );
  });
});
