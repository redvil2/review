import { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'Components/Tooltip',
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof Tooltip>;
export const Default: Story = {
  args: {},
  render: args => <Tooltip label={'Hello'}>Hover me</Tooltip>,
};
