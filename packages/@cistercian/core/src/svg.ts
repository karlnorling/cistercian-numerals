import { GLYPH_HEIGHT, GLYPH_WIDTH, glyphStrokes, type Polyline } from './glyph.js';
import { escapeAttr as escape, num, resolvePaint, type Paint } from './paint.js';
import { format, parse, type CistercianInput } from './parse.js';

/** viewBox units per glyph unit: a quadrant is 20×20 and the stem is 80 long. */
const UNIT = 20;

export interface SvgOptions {
  /** Height of the image in pixels. The width follows from the number of glyphs. Default 100. */
  size?: number;
  /**
   * Stroke and dot colour. Default `currentColor`, so the SVG takes the surrounding text colour.
   * Also takes a gradient, as a CSS string (`linear-gradient(90deg, #f00, #00f)`,
   * `radial-gradient(gold, crimson)`) or a {@link Gradient} object. A gradient spans the
   * whole image, so a long number shades from one end to the other.
   */
  color?: Paint;
  /** Fills the image behind the glyphs: a colour or a gradient, as for `color`. Default: transparent. */
  background?: Paint;
  /** Stroke width in viewBox units, where the stem is 80 long. Default 4. */
  strokeWidth?: number;
  /** Default `round`. */
  linecap?: 'round' | 'square' | 'butt';
  /** Space between glyphs in viewBox units. Default 20. */
  gap?: number;
  /** Space around the glyphs in viewBox units. Default 10. */
  padding?: number;
  /**
   * Accessible name, rendered as `<title>`. Defaults to the number written in decimal.
   * Pass `false` to leave it out and hide the image from assistive technology.
   */
  title?: string | false;
}

/**
 * Renders a number as an SVG string of Cistercian numerals.
 *
 * Each glyph holds 0–9999. Larger numbers use one glyph per four digits, and a dot
 * separates the fraction, whose glyphs are grouped from the point: `12.5` draws 12, a dot,
 * then 5000. A negative number has a bar across the middle of its first stem.
 */
export function toSvg(value: CistercianInput, options: SvgOptions = {}): string {
  const {
    size = 100,
    color = 'currentColor',
    background,
    strokeWidth = 4,
    linecap = 'round',
    gap = 20,
    padding = 10,
  } = options;
  if (!(size > 0)) throw new RangeError(`size must be positive, got ${size}`);
  if (!(strokeWidth > 0)) throw new RangeError(`strokeWidth must be positive, got ${strokeWidth}`);

  const number = parse(value);
  const title = options.title ?? format(number);
  const dotRadius = strokeWidth * 1.25;
  const halfWidth = (GLYPH_WIDTH / 2) * UNIT;

  const subpaths: string[] = [];
  let dot: { x: number; y: number } | undefined;
  let x = 0;
  const draw = (group: number, negative: boolean) => {
    const centre = x + halfWidth;
    for (const line of glyphStrokes(group, { negative })) subpaths.push(toPath(line, centre));
    x += 2 * halfWidth;
  };

  number.integer.forEach((group, i) => {
    if (i > 0) x += gap;
    draw(group, i === 0 && number.negative);
  });
  if (number.fraction.length > 0) {
    // The dot sits on the baseline in a widened gap.
    x += gap / 2 + dotRadius;
    dot = { x, y: GLYPH_HEIGHT * UNIT };
    x += dotRadius + gap / 2;
    number.fraction.forEach((group, i) => {
      if (i > 0) x += gap;
      draw(group, false);
    });
  }

  const box = {
    x: -padding,
    y: -padding,
    width: x + 2 * padding,
    height: GLYPH_HEIGHT * UNIT + 2 * padding,
  };
  const width = (size * box.width) / box.height;

  const stroke = resolvePaint(color, box, 'cistercian-color');
  const fill =
    background === undefined ? undefined : resolvePaint(background, box, 'cistercian-background');
  // Equal gradients get equal ids, so one definition serves both.
  const defs = [...new Set([fill?.def, stroke.def].filter(Boolean))].join('');

  const label = title === false ? 'aria-hidden="true"' : `role="img" aria-label="${escape(title)}"`;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${[box.x, box.y, box.width, box.height].map(num).join(' ')}" width="${num(width)}" height="${num(size)}" ${label}>`,
    title === false ? '' : `<title>${escape(title)}</title>`,
    defs ? `<defs>${defs}</defs>` : '',
    fill === undefined
      ? ''
      : `<rect x="${num(box.x)}" y="${num(box.y)}" width="${num(box.width)}" height="${num(box.height)}" fill="${escape(fill.value)}"/>`,
    `<path d="${subpaths.join('')}" fill="none" stroke="${escape(stroke.value)}" stroke-width="${num(strokeWidth)}" stroke-linecap="${linecap}" stroke-linejoin="round"/>`,
    dot
      ? `<circle cx="${num(dot.x)}" cy="${num(dot.y)}" r="${num(dotRadius)}" fill="${escape(stroke.value)}"/>`
      : '',
    '</svg>',
  ].join('');
}

function toPath(line: Polyline, centre: number): string {
  return line
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${num(centre + x * UNIT)} ${num(y * UNIT)}`)
    .join('');
}
