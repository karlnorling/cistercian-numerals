import { describe, expect, it } from 'vitest';
import { format, parse } from '../src/index.js';

describe('parse', () => {
  it.each([
    [1993, [1993]],
    [0, [0]],
    [9999, [9999]],
    [10000, [1, 0]],
    [12345, [1, 2345]],
    [100020003, [1, 2, 3]],
    [12345678901234567890n, [1234, 5678, 9012, 3456, 7890]],
    ['0001993', [1993]],
    ['1_000_000', [100, 0]],
  ])('splits the integer %s into groups of four digits', (value, integer) => {
    expect(parse(value)).toEqual({ negative: false, integer, fraction: [] });
  });

  it.each([
    [12.5, [12], [5000]],
    [0.5, [0], [5000]],
    [3.14159, [3], [1415, 9000]],
    ['0.0005', [0], [5]],
    ['1.10', [1], [1000]],
    ['.25', [0], [2500]],
  ])('groups the fraction of %s from the decimal point', (value, integer, fraction) => {
    expect(parse(value)).toEqual({ negative: false, integer, fraction });
  });

  it('expands exponent notation', () => {
    expect(parse(1e21).integer).toEqual([10, 0, 0, 0, 0, 0]);
    expect(parse(1e-7)).toEqual({ negative: false, integer: [0], fraction: [0, 10] });
    expect(parse('1.5e3')).toEqual({ negative: false, integer: [1500], fraction: [] });
    expect(parse('25e-1')).toEqual({ negative: false, integer: [2], fraction: [5000] });
  });

  it('marks negative numbers but not negative zero', () => {
    expect(parse(-42)).toEqual({ negative: true, integer: [42], fraction: [] });
    expect(parse('-0.5').negative).toBe(true);
    expect(parse(-0).negative).toBe(false);
    expect(parse('-0.000').negative).toBe(false);
  });

  it.each([NaN, Infinity])('rejects %s', (value) => {
    expect(() => parse(value)).toThrow('Not a finite number');
  });

  it.each(['', '.', 'abc', '1.2.3', '1e', '0x10'])('rejects %j', (value) => {
    expect(() => parse(value)).toThrow('Not a decimal number');
  });

  it('rejects huge exponents', () => {
    expect(() => parse('1e999999')).toThrow('Exponent out of range');
  });
});

describe('format', () => {
  it.each([
    [1993, '1993'],
    [10005, '10005'],
    [-12.5, '-12.5'],
    ['0.0005', '0.0005'],
    [1e21, '1000000000000000000000'],
    ['007.100', '7.1'],
  ])('writes %s back as %s', (value, text) => {
    expect(format(parse(value))).toBe(text);
  });
});
