import type { Preview } from '@storybook/html-vite';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Introduction',
          'Cistercian Numerals',
          ['Number Builder', 'Place Builder', 'Gallery'],
        ],
      },
    },
  },
};

export default preview;
