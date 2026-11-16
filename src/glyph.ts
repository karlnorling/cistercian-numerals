export type Point = readonly [x: number, y: number];
export type Polyline = readonly Point[];

/**
 * Glyph geometry in glyph units. The stem runs down the y axis from (0, 0) to (0, 4).
 * Each digit sits in a 1×1 quadrant at one end of the stem, so a glyph spans x = -1..1.
 * These proportions follow https://github.com/akosnikhazy/cistercian-numerals.
 */
export const GLYPH_WIDTH = 2;
export const GLYPH_HEIGHT = 4;

/**
 * Strokes for the units digits 1–9 in the top-right quadrant. x points away from the stem
 * and y points away from the end of the stem. The other places are mirror images.
 */
const UNIT_STROKES: readonly Polyline[] = [
  /* 0 */ [],
  /* 1 */ [
    [0, 0],
    [1, 0],
  ],
  /* 2 */ [
    [0, 1],
    [1, 1],
  ],
  /* 3 */ [
    [0, 0],
    [1, 1],
  ],
  /* 4 */ [
    [0, 1],
    [1, 0],
  ],
  /* 5 */ [
    [0, 1],
    [1, 0],
    [0, 0],
  ],
  /* 6 */ [
    [1, 0],
    [1, 1],
  ],
  /* 7 */ [
    [0, 0],
    [1, 0],
    [1, 1],
  ],
  /* 8 */ [
    [0, 1],
    [1, 1],
    [1, 0],
  ],
  /* 9 */ [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ],
];

/** [x mirror, at top end of stem] for units, tens, hundreds and thousands. */
const PLACES: readonly (readonly [mirrorX: 1 | -1, top: boolean])[] = [
  [1, true],
  [-1, true],
  [1, false],
  [-1, false],
];

export interface GlyphOptions {
  /** Adds the negative mark, a horizontal bar across the middle of the stem. */
  negative?: boolean;
}

/**
 * The polylines that draw one glyph for an integer from 0 to 9999, in glyph units.
 * The stem comes first. 0 is a bare stem.
 */
export function glyphStrokes(value: number, { negative = false }: GlyphOptions = {}): Polyline[] {
  if (!Number.isInteger(value) || value < 0 || value > 9999) {
    throw new RangeError(`A single glyph holds an integer from 0 to 9999, got ${value}`);
  }

  const strokes: Polyline[] = [
    [
      [0, 0],
      [0, GLYPH_HEIGHT],
    ],
  ];
  if (negative) {
    strokes.push([
      [-1, GLYPH_HEIGHT / 2],
      [1, GLYPH_HEIGHT / 2],
    ]);
  }

  let rest = value;
  for (const [mirrorX, top] of PLACES) {
    const digit = rest % 10;
    rest = Math.floor(rest / 10);
    const line = UNIT_STROKES[digit] ?? [];
    if (line.length > 0) {
      strokes.push(line.map(([x, y]): Point => [mirrorX * x, top ? y : GLYPH_HEIGHT - y]));
    }
  }
  return strokes;
}
