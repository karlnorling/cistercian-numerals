import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { toImage } from '../src/index.js';

describe('toImage', () => {
  it.each([
    ['png', 'png'],
    ['jpeg', 'jpeg'],
    ['jpg', 'jpeg'],
    ['webp', 'webp'],
  ] as const)('renders %s', async (format, expected) => {
    const image = await toImage(1993, { format, size: 200 });
    const meta = await sharp(image).metadata();
    expect(meta.format).toBe(expected);
    expect(meta.height).toBe(200);
    expect(meta.width).toBe(120);
  });

  it('gives JPEG a white background and keeps PNG transparent', async () => {
    const corner = async (format: 'png' | 'jpeg') => {
      const { data, info } = await sharp(await toImage(1, { format }))
        .raw()
        .toBuffer({ resolveWithObject: true });
      return [...data.subarray(0, info.channels)];
    };
    expect(await corner('jpeg')).toEqual([255, 255, 255]);
    expect((await corner('png'))[3]).toBe(0);
  });

  it('draws black strokes', async () => {
    // At 20 units per quadrant and size 100, the stem is at x=30 and runs from y=10 to y=90.
    const { data, info } = await sharp(await toImage(0, { format: 'png' }))
      .raw()
      .toBuffer({ resolveWithObject: true });
    const at = (x: number, y: number) => [
      ...data.subarray((y * info.width + x) * 4, (y * info.width + x) * 4 + 4),
    ];
    expect(at(30, 50)).toEqual([0, 0, 0, 255]);
  });
});
