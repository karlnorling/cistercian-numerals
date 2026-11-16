import { describe, expect, it } from 'vitest';
import { toSvg } from '../src/index.js';

const attr = (svg: string, name: string) => new RegExp(`${name}="([^"]*)"`).exec(svg)?.[1];
const subpaths = (svg: string) => (attr(svg, 'd') ?? '').split('M').length - 1;

describe('toSvg', () => {
  it('renders one glyph with a 100px height by default', () => {
    const svg = toSvg(1993);
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
    expect(attr(svg, 'viewBox')).toBe('-10 -10 60 100');
    expect(attr(svg, 'width')).toBe('60');
    expect(attr(svg, 'height')).toBe('100');
    expect(svg).toContain('<title>1993</title>');
    expect(attr(svg, 'stroke')).toBe('currentColor');
    expect(subpaths(svg)).toBe(5);
    expect(svg).not.toContain('<circle');
    expect(svg).not.toContain('<rect');
  });

  it('draws the stem and digit strokes at 20 units per quadrant', () => {
    expect(attr(toSvg(1), 'd')).toBe('M20 0L20 80M20 0L40 0');
  });

  it('lays out one glyph per four digits', () => {
    const svg = toSvg(12345);
    expect(attr(svg, 'viewBox')).toBe('-10 -10 120 100');
    expect(subpaths(svg)).toBe(2 + 1 + 4);
  });

  it('puts a dot on the baseline before the fraction', () => {
    const svg = toSvg(12.5);
    expect(svg).toMatch(/<circle cx="55" cy="80" r="5" fill="currentColor"\/>/);
    expect(attr(svg, 'viewBox')).toBe('-10 -10 130 100');
    expect(svg).toContain('<title>12.5</title>');
  });

  it('marks only the first glyph of a negative number', () => {
    expect(attr(toSvg(-5), 'd')).toContain('M0 40L40 40');
    expect(attr(toSvg(-10000), 'd')?.match(/L40 40/g)).toHaveLength(1);
  });

  it('applies style options and escapes text', () => {
    const svg = toSvg(7, {
      size: 200,
      color: '#c00',
      background: 'white',
      strokeWidth: 2,
      linecap: 'square',
      padding: 0,
      title: 'seven <7> & "more"',
    });
    expect(attr(svg, 'height')).toBe('200');
    expect(attr(svg, 'width')).toBe('100');
    expect(svg).toContain('<rect x="0" y="0" width="40" height="80" fill="white"/>');
    expect(svg).toContain('stroke="#c00" stroke-width="2" stroke-linecap="square"');
    expect(svg).toContain('<title>seven &#60;7&#62; &#38; &#34;more&#34;</title>');
  });

  it('hides the image from assistive technology when title is false', () => {
    const svg = toSvg(7, { title: false });
    expect(svg).toContain('aria-hidden="true"');
    expect(svg).not.toContain('<title>');
    expect(svg).not.toContain('role=');
  });

  it('rejects invalid sizes', () => {
    expect(() => toSvg(1, { size: 0 })).toThrow(RangeError);
    expect(() => toSvg(1, { strokeWidth: -1 })).toThrow(RangeError);
  });
});
