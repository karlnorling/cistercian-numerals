import type { CistercianInput } from './parse.js';
import { toSvg, type SvgOptions } from './svg.js';

export type RasterFormat = 'png' | 'jpeg' | 'jpg' | 'webp';

export interface RasterOptions extends SvgOptions {
  /** Default `png`. */
  format?: RasterFormat;
  /** JPEG and WebP quality from 1 to 100. Uses sharp's default when left out. */
  quality?: number;
}

/**
 * Renders a number as a PNG, JPEG or WebP image of Cistercian numerals.
 *
 * Needs the optional peer dependency `sharp`. The colour defaults to black, and JPEG,
 * which has no transparency, gets a white background unless you pass one.
 */
export async function toImage(
  value: CistercianInput,
  options: RasterOptions = {},
): Promise<Buffer> {
  const { format = 'png', quality, ...svgOptions } = options;
  const sharp = await loadSharp();
  const isJpeg = format === 'jpeg' || format === 'jpg';
  const svg = toSvg(value, {
    ...svgOptions,
    color: svgOptions.color ?? '#000000',
    background: svgOptions.background ?? (isJpeg ? '#ffffff' : undefined),
  });

  const image = sharp(Buffer.from(svg));
  if (isJpeg) return image.jpeg({ quality }).toBuffer();
  if (format === 'webp') return image.webp({ quality }).toBuffer();
  if (format === 'png') return image.png().toBuffer();
  throw new TypeError(`Unsupported format: ${String(format)}`);
}

async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch (error) {
    throw new Error('PNG, JPEG and WebP output needs sharp. Install it with: npm install sharp', {
      cause: error,
    });
  }
}
