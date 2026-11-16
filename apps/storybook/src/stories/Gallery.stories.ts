import { toSvg } from '@cistercian/core';
import type { Meta, StoryObj } from '@storybook/html-vite';

interface Args {
  from: number;
  count: number;
  step: number;
  size: number;
}

const meta = {
  title: 'Cistercian Numerals/Gallery',
  render: ({ from, count, step, size }) => {
    const grid = document.createElement('div');
    grid.style.cssText = `display:grid;grid-template-columns:repeat(auto-fill,minmax(${size * 0.6 + 24}px,1fr));gap:12px;width:min(90vw,960px);color:#24292f;font:12px ui-monospace,monospace`;
    for (let i = 0; i < Math.min(count, 500); i++) {
      const n = from + i * step;
      const cell = document.createElement('figure');
      cell.style.cssText = 'margin:0;display:grid;justify-items:center;gap:4px';
      cell.innerHTML = toSvg(n, { size }) + `<figcaption>${n}</figcaption>`;
      grid.append(cell);
    }
    return grid;
  },
  args: { from: 1, count: 40, step: 1, size: 64 },
  argTypes: {
    from: { control: 'number' },
    count: { control: { type: 'range', min: 1, max: 500, step: 1 } },
    step: { control: 'number' },
    size: { control: { type: 'range', min: 32, max: 160, step: 4 } },
  },
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'A run of numbers. Set **from**, **count** and **step**.' } },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Counting: Story = {};
export const Digits: Story = { args: { from: 1, count: 9, step: 1, size: 96 } };
export const Tens: Story = { args: { from: 10, count: 9, step: 10, size: 96 } };
export const Hundreds: Story = { args: { from: 100, count: 9, step: 100, size: 96 } };
export const Thousands: Story = { args: { from: 1000, count: 9, step: 1000, size: 96 } };
