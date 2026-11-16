import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { run } from '../src/cli.js';
import { toImage } from '../src/raster.js';

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

describe('cli', () => {
  let dir: string;
  const io = () => {
    const out = { stdout: '', stderr: '' };
    return {
      out,
      io: {
        stdout: (t: string) => void (out.stdout += t),
        stderr: (t: string) => void (out.stderr += t),
      },
    };
  };

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'cistercian-'));
  });
  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('prints SVG to stdout', async () => {
    const { out, io: streams } = io();
    expect(await run(['1993'], streams)).toBe(0);
    expect(out.stdout).toMatch(/^<svg .*<title>1993<\/title>.*<\/svg>\n$/);
  });

  it('accepts negative numbers next to options', async () => {
    const { out, io: streams } = io();
    expect(await run(['-s', '50', '-12.5'], streams)).toBe(0);
    expect(out.stdout).toContain('<title>-12.5</title>');
    expect(out.stdout).toContain('height="50"');
  });

  it.each(['svg', 'png', 'jpg', 'webp'])('writes a .%s file', async (ext) => {
    const file = join(dir, `out.${ext}`);
    const { io: streams } = io();
    expect(await run(['42', '-o', file, '--size', '64'], streams)).toBe(0);
    const meta = await sharp(await readFile(file)).metadata();
    expect(meta.height).toBe(64);
  });

  it.each([
    [[], 2],
    [['1', '2'], 2],
    [['1', '--nope'], 2],
    [['1', '-o', 'out.gif'], 2],
    [['abc'], 1],
    [['1', '--size', 'big'], 1],
  ])('exits with an error for %j', async (args, code) => {
    const { out, io: streams } = io();
    expect(await run(args, streams)).toBe(code);
    expect(out.stderr).not.toBe('');
  });
});
