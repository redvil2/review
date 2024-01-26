import { FONT_WEIGHT } from '@app/shared/ui/theme';
import type { Meta, StoryObj } from '@storybook/react';

import { Paragraph } from './Paragraph';

const meta: Meta<typeof Paragraph> = {
  component: Paragraph,
  title: 'Components/Typography/Paragraph',
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

type Story = StoryObj<typeof Paragraph>;

export const Default: Story = {
  args: {},
  render: args => <Paragraph {...args}>Display</Paragraph>,
};
