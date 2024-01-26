import type { Meta, StoryObj } from '@storybook/react';

import { Icon } from '@app/shared/ui/components';

import { ContextMenu } from './ContextMenu';

const meta: Meta<typeof ContextMenu> = {
  component: ContextMenu,
  title: 'Components/ContextMenu',
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  args: {
    contextMenuItems: [
      { id: 1, name: 'First item' },
      { id: 2, name: 'Second longer item' },
      { id: 3, name: 'Third even longer item' },
    ],
  },
  render: args => <ContextMenu {...args}>Badge</ContextMenu>,
};

export const WithDestructiveAndDisabled: Story = {
  args: {
    contextMenuItems: [
      { id: 1, name: 'Normal action', icon: <Icon>edit</Icon> },
      {
        id: 2,
        name: 'Disabled action',
        isDisabled: true,
        icon: <Icon>add</Icon>,
      },
      {
        id: 3,
        name: 'Destructive action',
        destructive: true,
        icon: <Icon>delete</Icon>,
      },
    ],
    variant: 'alignLeft',
  },
  render: args => <ContextMenu {...args}>Badge</ContextMenu>,
};
