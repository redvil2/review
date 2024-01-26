import type { Meta, StoryObj } from '@storybook/react';

import { Avatar } from './Avatar';
import { AVATAR_VARIANTS } from './avatar.variants';

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: 'Components/Avatar/Avatar',
  argTypes: {
    variant: {
      options: Object.values(AVATAR_VARIANTS),
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {},
  render: args => <Avatar {...args}></Avatar>,
};

export const WithName: Story = {
  args: {},
  render: args => <Avatar {...args}>John Doe</Avatar>,
};

export const WithImage: Story = {
  args: {
    src: 'https://www.goodmorningimagesdownload.com/wp-content/uploads/2021/12/Best-Quality-Profile-Images-Pic-Download-2023.jpg',
  },
  render: args => <Avatar {...args} />,
};

export const WithXsSize: Story = {
  args: {},
  render: args => (
    <Avatar {...args} size={'xs'}>
      John Doe
    </Avatar>
  ),
};

export const WithSmallSize: Story = {
  args: {},
  render: args => (
    <Avatar {...args} size={'sm'}>
      John Doe
    </Avatar>
  ),
};
