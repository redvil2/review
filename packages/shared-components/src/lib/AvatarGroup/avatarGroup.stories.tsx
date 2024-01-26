import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from '../Avatar/Avatar';
import { AVATAR_VARIANTS } from '../Avatar/avatar.variants';

import { AvatarGroup } from './AvatarGroup';

const meta: Meta<typeof AvatarGroup> = {
  component: AvatarGroup,
  title: 'Components/Avatar/AvatarGroup',
  argTypes: {
    variant: {
      options: Object.values(AVATAR_VARIANTS),
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  args: {},
  render: args => (
    <AvatarGroup {...args} size={'md'}>
      <Avatar variant={AVATAR_VARIANTS.SUN} />
      <Avatar variant={AVATAR_VARIANTS.OCEAN} />
      <Avatar variant={AVATAR_VARIANTS.GRASS} />
      <Avatar variant={AVATAR_VARIANTS.TERTIARY} />
    </AvatarGroup>
  ),
};
