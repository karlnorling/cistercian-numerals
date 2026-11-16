import { toSvg, type SvgOptions } from '@cistercian/core';
import type { Meta, StoryObj } from '@storybook/html-vite';

type Args = Omit<SvgOptions, 'title'> & { value: string; title: string };

/** Renders the args, or the parse error in place of the image. */
function render({ value, title, ...options }: Args): HTMLElement {
  const root = document.createElement('div');
  root.style.color = '#24292f';
  try {
    // Empty text controls fall back to the defaults: currentColor and no background.
    const { color, background, ...rest } = options;
    root.innerHTML = toSvg(value, {
      ...rest,
      ...(color ? { color } : {}),
      ...(background ? { background } : {}),
      ...(title ? { title } : {}),
    });
  } catch (error) {
    root.setAttribute('role', 'alert');
    root.style.color = '#c92a2a';
    root.style.fontFamily = 'system-ui, sans-serif';
    root.textContent = (error as Error).message;
  }
  return root;
}

const meta = {
  title: 'Cistercian Numerals/Number Builder',
  render,
  args: {
    value: '1993',
    size: 200,
    strokeWidth: 4,
    gap: 20,
    padding: 10,
    linecap: 'round',
    color: 'currentColor',
    background: undefined,
    title: '',
  },
  argTypes: {
    value: {
      control: 'text',
      description:
        'Any decimal number: whole, fractional, negative or very large. Passed as a string so every digit is kept.',
    },
    size: { control: { type: 'range', min: 24, max: 480, step: 4 } },
    strokeWidth: { control: { type: 'range', min: 0.5, max: 16, step: 0.5 } },
    gap: { control: { type: 'range', min: 0, max: 80, step: 2 } },
    padding: { control: { type: 'range', min: 0, max: 40, step: 1 } },
    linecap: { control: 'inline-radio', options: ['round', 'square', 'butt'] },
    color: {
      control: 'text',
      description:
        'A CSS colour, or a gradient: `linear-gradient(to right, red, blue)`, `radial-gradient(…)` or their `repeating-` forms.',
    },
    background: {
      control: 'text',
      description: 'A colour or a gradient, as for **color**. Empty for transparent.',
    },
    title: {
      control: 'text',
      description: 'Accessible name. Leave empty to use the number.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Type any number in the **value** control and adjust the style. Every control maps to a `toSvg` option.',
      },
    },
  },
} satisfies Meta<Args>;

export default meta;
type Story = StoryObj<Args>;

export const Playground: Story = {};

export const LargeNumber: Story = {
  args: { value: '1234567890' },
  parameters: { docs: { description: { story: 'One glyph per four digits.' } } },
};

export const Decimal: Story = {
  args: { value: '3.14159' },
  parameters: {
    docs: { description: { story: 'A dot, then the fraction in groups of four from the point.' } },
  },
};

export const Negative: Story = {
  args: { value: '-42' },
  parameters: { docs: { description: { story: 'A bar across the middle of the first stem.' } } },
};

export const Zero: Story = { args: { value: '0' } };

export const Styled: Story = {
  args: {
    value: '2026',
    color: '#7a2e0e',
    background: '#f6efe3',
    strokeWidth: 6,
    linecap: 'square',
    padding: 20,
  },
};

export const Rainbow: Story = {
  args: {
    value: '123456789',
    strokeWidth: 6,
    color:
      'linear-gradient(to right, #e03131, #f76707, #fab005, #40c057, #228be6, #7048e8, #be4bdb)',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A linear gradient spans the whole image, so a long number runs through every colour.',
      },
    },
  },
};

export const Christmas: Story = {
  args: {
    value: '2026.1225',
    strokeWidth: 7,
    padding: 16,
    color: 'repeating-linear-gradient(135deg, #e03131 0 3%, #ffffff 3% 6%)',
    background: 'radial-gradient(#2b8a3e, #0b3d20)',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Candy-cane strokes from a repeating gradient with hard stops, on a pine-green radial background. The number is Christmas Day 2026.',
      },
    },
  },
};

export const InvalidInput: Story = {
  args: { value: 'twelve' },
  parameters: {
    docs: { description: { story: "Input that isn't a decimal number shows the error." } },
  },
};
