import type { Meta, StoryObj } from '@storybook/react';

import { useModularDropdown } from './ModularDropdown';

const DropdownTest = ({
  menuItems,
  placeholder,
  defaultItem,
}: Parameters<typeof useModularDropdown>[0]) => {
  const { dropdown, menu } = useModularDropdown({
    menuItems,
    defaultItem,
    placeholder,
  });
  return (
    <>
      {dropdown} Extra content
      {menu}
    </>
  );
};

const meta: Meta<typeof DropdownTest> = {
  component: DropdownTest,
  title: 'Components/Modular Dropdown',
};

export default meta;

type Story = StoryObj<typeof DropdownTest>;

export const Default: Story = {
  args: {
    placeholder: 'Select an item',
    menuItems: [
      { id: 1, name: 'First item' },
      { id: 2, name: 'Second longer item' },
      { id: 3, name: 'Third even longer item' },
    ],
  },
  render: args => <DropdownTest {...args} />,
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
  render: args => <DropdownTest {...args} />,
};
