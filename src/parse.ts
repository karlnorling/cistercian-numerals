/** Anything that can be written as a plain decimal number. */
export type CistercianInput = number | bigint | string;

/**
 * A number split into the groups that each become one Cistercian glyph.
 *
 * One glyph holds 0–9999, so each group is a base-10000 digit, most significant first.
 * Fraction groups are padded on the right, which keeps them positional:
 * `0.5` is the group `5000` and `0.0005` is the group `5`.
 */
export interface CistercianNumber {
  negative: boolean;
  /** Integer part as base-10000 groups. Always holds at least one group. */
  integer: number[];
  /** Fraction part as base-10000 groups. Empty when the number is whole. */
  fraction: number[];
}

const DECIMAL = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i;

/** Larger exponents would mean building strings of millions of digits. */
const MAX_EXPONENT = 100_000;

/** Splits a number into the base-10000 groups that are drawn as glyphs. */
export function parse(value: CistercianInput): CistercianNumber {
  const text = toText(value);
  const match = DECIMAL.exec(text);
  const [, sign = '', rawInteger = '', rawFraction = '', rawExponent] = match ?? [];
  if (!match || (rawInteger === '' && rawFraction === '')) {
    throw new TypeError(`Not a decimal number: ${JSON.stringify(String(value))}`);
  }

  let integer = rawInteger;
  let fraction = rawFraction;
  if (rawExponent !== undefined) {
    const exponent = Number(rawExponent);
    if (Math.abs(exponent) > MAX_EXPONENT) {
      throw new RangeError(`Exponent out of range: ${rawExponent}`);
    }
    [integer, fraction] = shiftPoint(integer, fraction, exponent);
  }

  integer = integer.replace(/^0+/, '');
  fraction = fraction.replace(/0+$/, '');
  const isZero = integer === '' && fraction === '';

  return {
    negative: sign === '-' && !isZero,
    integer: toGroups(integer || '0', 'start'),
    fraction: fraction ? toGroups(fraction, 'end') : [],
  };
}

/** Writes parsed groups back as a canonical decimal string, e.g. `-12.5`. */
export function format({ negative, integer, fraction }: CistercianNumber): string {
  const whole = integer.map((group, i) => (i === 0 ? String(group) : pad(group))).join('');
  const frac = fraction.map(pad).join('').replace(/0+$/, '');
  return `${negative ? '-' : ''}${whole}${frac ? `.${frac}` : ''}`;
}

function toText(value: CistercianInput): string {
  switch (typeof value) {
    case 'number':
      if (!Number.isFinite(value)) throw new RangeError(`Not a finite number: ${value}`);
      // Shortest round-trip form, so 0.1 stays "0.1". Very large or small values come
      // back in exponent form, which parse() expands.
      return String(value);
    case 'bigint':
      return value.toString();
    case 'string':
      return value.trim().replaceAll('_', '');
    default:
      throw new TypeError(`Expected a number, bigint or string, got ${typeof value}`);
  }
}

function shiftPoint(integer: string, fraction: string, exponent: number): [string, string] {
  const digits = integer + fraction;
  const point = integer.length + exponent;
  if (point <= 0) return ['', '0'.repeat(-point) + digits];
  if (point >= digits.length) return [digits + '0'.repeat(point - digits.length), ''];
  return [digits.slice(0, point), digits.slice(point)];
}

function toGroups(digits: string, padAt: 'start' | 'end'): number[] {
  const size = Math.ceil(digits.length / 4) * 4;
  const padded = padAt === 'start' ? digits.padStart(size, '0') : digits.padEnd(size, '0');
  const groups: number[] = [];
  for (let i = 0; i < padded.length; i += 4) groups.push(Number(padded.slice(i, i + 4)));
  return groups;
}

function pad(group: number): string {
  return String(group).padStart(4, '0');
}
