import { toSvg } from '@cistercian/core';
import type { Meta, StoryObj } from '@storybook/html-vite';

interface Args {
  thousands: number;
  hundreds: number;
  tens: number;
  units: number;
  negative: boolean;
  size: number;
}

const digit = { control: { type: 'range', min: 0, max: 9, step: 1 } } as const;

const meta = {
  title: 'Cistercian Numerals/Place Builder',
  render: ({ thousands, hundreds, tens, units, negative, size }) => {
    const value = thousands * 1000 + hundreds * 100 + tens * 10 + units;
    const root = document.createElement('figure');
    root.style.cssText =
      'margin:0;display:grid;justify-items:center;gap:8px;color:#24292f;font:16px system-ui';
    // -0 has no sign in decimal, so a negative zero is drawn from the string "-0" as plain 0.
    root.innerHTML =
      toSvg(negative ? `-${value}` : value, { size }) +
      `<figcaption><code>${negative && value ? '-' : ''}${value}</code></figcaption>`;
    return root;
  },
  args: { thousands: 1, hundreds: 9, tens: 9, units: 3, negative: false, size: 240 },
  argTypes: {
    thousands: { ...digit, description: 'Bottom-left corner' },
    hundreds: { ...digit, description: 'Bottom-right corner' },
    tens: { ...digit, description: 'Top-left corner' },
    units: { ...digit, description: 'Top-right corner' },
    size: { control: { type: 'range', min: 40, max: 480, step: 4 } },
  },
  parameters: {
    docs: {
      description: {
        component: 'Build a single glyph one corner at a time with a slider per digit.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
export const PlaceBuilder: StoryObj<Args> = {};
