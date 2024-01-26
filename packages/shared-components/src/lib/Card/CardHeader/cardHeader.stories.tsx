import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { AVATAR_VARIANTS } from '../../Avatar/avatar.variants';
import { Card } from '../Card/Card';

import { CardHeader } from './CardHeader';

const meta: Meta<typeof CardHeader> = {
  component: CardHeader,
  title: 'Components/Card/CardHeader',
};

export default meta;

type Story = StoryObj<typeof CardHeader>;

export const Default: Story = {
  args: {},
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

export const WithAppIcon: Story = {
  args: {
    appIcon: 'search',
  },
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

export const WithLeftIcon: Story = {
  args: {
    leftIcon: 'search',
  },
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

export const WithXlDragIndicator: Story = {
  args: {
    showDragIndicator: true,
    xlIcon: true,
  },
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

export const WithAvatar: Story = {
  args: {
    avatar: {
      variant: AVATAR_VARIANTS.OCEAN,
      name: 'Jane Doe',
    },
  },
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

const GenericComponent = () => (
  <div
    style={{
      borderRadius: '3rem',
      height: '3rem',
      width: '3rem',
      backgroundColor: 'purple',
    }}
  />
);

export const WithGenericSlot: Story = {
  args: {
    genericSlot: <GenericComponent />,
  },
  render: args => (
    <Card header={<CardHeader {...args}>Rounded</CardHeader>}>body</Card>
  ),
};

export const WithSubtitleAndTitleIcon: Story = {
  args: {
    titleIcon: 'info',
    subtitle: 'Card subtitle',
  },
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

export const WithButton: Story = {
  args: {
    button: {
      label: 'Button',
      iconName: 'add',
      variant: 'secondary',
      onClick: () => 'click',
    },
  },
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: {
      name: 'edit',
    },
  },
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

export const WithContextMenu: Story = {
  args: {
    contextMenuItems: [
      { id: 1, name: 'First item' },
      { id: 2, name: 'Second longer item' },
      { id: 3, name: 'Third even longer item' },
    ],
  },
  render: args => (
    <Card header={<CardHeader {...args}>CardHeader</CardHeader>}>body</Card>
  ),
};

const InteractiveCardHeaderToggle = args => {
  const [checked, setChecked] = useState(false);
  const handleChange = () => setChecked(!checked);
  return (
    <CardHeader
      toggle={{
        onChange: handleChange,
        isChecked: checked,
      }}
    >
      CardHeader
    </CardHeader>
  );
};

export const WithToggle: Story = {
  args: {
    toggle: {
      onChange: () => 'change',
      isChecked: true,
    },
  },
  render: args => (
    <Card header={<InteractiveCardHeaderToggle {...args} />}>body</Card>
  ),
};

export const WithAll: Story = {
  args: {
    appIcon: 'search',
    showDragIndicator: true,
    xlIcon: true,
    avatar: {
      variant: AVATAR_VARIANTS.OCEAN,
      name: 'Jane Doe',
    },
    titleIcon: 'info',
    subtitle: 'Card subtitle',
    button: {
      label: 'Button',
      iconName: 'add',
      onClick: () => 'click',
    },
    rightIcon: {
      name: 'edit',
    },
    contextMenuItems: [
      { id: 1, name: 'First item' },
      { id: 2, name: 'Second longer item' },
      { id: 3, name: 'Third even longer item' },
    ],
    toggle: {
      onChange: () => 'change',
      isChecked: true,
    },
  },
  render: args => (
    <Card header={<CardHeader {...args}>Card title</CardHeader>} />
  ),
};
