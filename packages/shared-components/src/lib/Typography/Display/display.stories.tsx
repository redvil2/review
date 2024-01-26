import { FONT_WEIGHT } from '@app/shared/ui/theme';
import type { Meta, StoryObj } from '@storybook/react';

import { Display } from './Display';

const meta: Meta<typeof Display> = {
  component: Display,
  title: 'Components/Typography/Display',
  argTypes: {
    size: {
      options: [1, 2],
      control: { type: 'radio' },
    },
    fontWeight: {
      options: Object.values(FONT_WEIGHT),
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Display>;

export const Default: Story = {
  args: {},
  render: args => <Display {...args}>Display</Display>,
};
