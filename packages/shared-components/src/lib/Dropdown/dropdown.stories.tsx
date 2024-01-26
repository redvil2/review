import type { Meta, StoryObj } from '@storybook/react';

import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: 'Components/Dropdown',
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    placeholder: 'Select an item',
    menuItems: [
      { id: 1, name: 'First item' },
      { id: 2, name: 'Second longer item' },
      { id: 3, name: 'Third even longer item' },
    ],
  },
  render: args => <Dropdown {...args} />,
};

export const WithDefaultItem: Story = {
  args: {
    defaultItem: { id: 1, name: 'First item' },
    menuItems: [
      { id: 1, name: 'First item' },
      { id: 2, name: 'Second longer item' },
      { id: 3, name: 'Third even longer item' },
    ],
  },
  render: args => <Dropdown {...args} />,
};
