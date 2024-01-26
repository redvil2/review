import { FONT_WEIGHT } from '@app/shared/ui/theme';
import type { Meta, StoryObj } from '@storybook/react';

import { Headline } from './Headline';

const meta: Meta<typeof Headline> = {
  component: Headline,
  title: 'Components/Typography/Headline',
  argTypes: {
    size: {
      options: [1, 2, 3, 4],
      control: { type: 'radio' },
    },
    fontWeight: {
      options: Object.values(FONT_WEIGHT),
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Headline>;

export const Default: Story = {
  args: {},
  render: args => <Headline {...args}>Display</Headline>,
};
