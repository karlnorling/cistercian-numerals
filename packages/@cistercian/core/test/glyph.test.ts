import { describe, expect, it } from 'vitest';
import { glyphStrokes } from '../src/index.js';

const STEM = [
  [0, 0],
  [0, 4],
];

describe('glyphStrokes', () => {
  it('draws 0 as a bare stem', () => {
    expect(glyphStrokes(0)).toEqual([STEM]);
  });

  it('draws the units digits in the top-right quadrant', () => {
    expect(glyphStrokes(1)).toEqual([
      STEM,
      [
        [0, 0],
        [1, 0],
      ],
    ]);
    expect(glyphStrokes(9)).toEqual([
      STEM,
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
    ]);
  });

  it('mirrors the digit into each place', () => {
    const unit = [
      [0, 1],
      [1, 0],
    ];
    expect(glyphStrokes(4)[1]).toEqual(unit);
    expect(glyphStrokes(40)[1]).toEqual([
      [-0, 1],
      [-1, 0],
    ]);
    expect(glyphStrokes(400)[1]).toEqual([
      [0, 3],
      [1, 4],
    ]);
    expect(glyphStrokes(4000)[1]).toEqual([
      [-0, 3],
      [-1, 4],
    ]);
  });

  it('draws one polyline per non-zero digit', () => {
    expect(glyphStrokes(1993)).toHaveLength(5);
    expect(glyphStrokes(1003)).toHaveLength(3);
  });

  it('adds a bar across the middle for negative numbers', () => {
    expect(glyphStrokes(0, { negative: true })).toEqual([
      STEM,
      [
        [-1, 2],
        [1, 2],
      ],
    ]);
  });

  it.each([-1, 10000, 1.5, NaN])('rejects %s', (value) => {
    expect(() => glyphStrokes(value)).toThrow(RangeError);
  });
});
