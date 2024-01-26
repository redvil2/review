import { FONT_WEIGHT } from '@app/shared/ui/theme';
import type { Meta, StoryObj } from '@storybook/react';

import { Micro } from './Micro';

const meta: Meta<typeof Micro> = {
  component: Micro,
  title: 'Components/Typography/Micro',
  argTypes: {
    fontWeight: {
      options: Object.values(FONT_WEIGHT),
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Micro>;

export const Default: Story = {
  args: {},
  render: args => <Micro {...args}>Display</Micro>,
};
