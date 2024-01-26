import { FONT_WEIGHT } from '@app/shared/ui/theme';
import type { Meta, StoryObj } from '@storybook/react';

import { Subline } from './Subline';

const meta: Meta<typeof Subline> = {
  component: Subline,
  title: 'Components/Typography/Subline',
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

type Story = StoryObj<typeof Subline>;

export const Default: Story = {
  args: {},
  render: args => <Subline {...args}>Display</Subline>,
};
