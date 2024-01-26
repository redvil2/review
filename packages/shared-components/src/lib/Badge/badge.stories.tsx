import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from './Badge';
import { BADGE_VARIANTS } from './badge.variants';

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'Components/Badge',
  argTypes: {
    variant: {
      options: Object.values(BADGE_VARIANTS),
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {},
  render: args => <Badge {...args}>Badge</Badge>,
};

export const withVariant: Story = {
  args: {
    variant: BADGE_VARIANTS.TERTIARY,
  },
  render: args => <Badge {...args}>Badge</Badge>,
};

export const withIcon: Story = {
  args: {
    iconName: 'check_small',
  },
  render: args => <Badge {...args}>Badge</Badge>,
};
