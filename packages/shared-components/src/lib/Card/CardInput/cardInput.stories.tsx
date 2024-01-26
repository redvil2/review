import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Card } from '../Card/Card';

import { CardInput } from './CardInput';

const meta: Meta<typeof CardInput> = {
  component: CardInput,
  title: 'Components/Card/CardInput',
};

export default meta;

type Story = StoryObj<typeof CardInput>;

const InteractiveCardInput = args => {
  const [inputValue, setInputValue] = useState('');
  return (
    <Card
      input={
        <CardInput
          {...args}
          input={{
            inputValue,
            onChange: e => setInputValue(e.target.value),
            placeholder: 'Input placeholder',
          }}
        />
      }
    />
  );
};

export const Default: Story = {
  args: {},
  render: args => <InteractiveCardInput />,
};

export const WithLabel: Story = {
  args: {
    input: {
      placeholder: 'Input placeholder',
      label: 'Input label',
    },
  },
  render: args => <Card input={<CardInput {...args}>CardInput</CardInput>} />,
};

export const WithMenus: Story = {
  args: {
    leftMenu: {
      menuItems: [
        { id: 1, name: 'First item' },
        { id: 2, name: 'Second longer item' },
        { id: 3, name: 'Third even longer item' },
      ],
      placeholder: 'Select an item',
    },
    rightMenu: {
      menuItems: [
        { id: 1, name: 'USD' },
        { id: 2, name: 'AUD' },
        { id: 3, name: 'EUR' },
      ],
      defaultItem: { id: 1, name: 'USD' },
    },
  },
  render: args => <InteractiveCardInput {...args} />,
};

export const WithIcon: Story = {
  args: {
    leftIconName: 'mail',
  },
  render: args => <InteractiveCardInput {...args} />,
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
  render: args => <InteractiveCardInput {...args} />,
};

export const WithHelperText: Story = {
  args: {
    input: {
      placeholder: 'Input placeholder',
      helperText: 'Input helper text',
    },
  },
  render: args => <Card input={<CardInput {...args}>CardInput</CardInput>} />,
};

export const WithError: Story = {
  args: {
    input: {
      placeholder: 'Input placeholder',
      errorMessage: 'Input error message',
    },
    isInvalid: true,
  },
  render: args => <Card input={<CardInput {...args}>CardInput</CardInput>} />,
};

export const WithReadOnly: Story = {
  args: {
    input: {
      inputValue: 'Input value',
    },
    readOnly: true,
  },
  render: args => (
    <Card readOnly input={<CardInput {...args}>CardInput</CardInput>} />
  ),
};

export const WithAll: Story = {
  args: {
    leftMenu: {
      menuItems: [
        { id: 1, name: 'First item' },
        { id: 2, name: 'Second longer item' },
        { id: 3, name: 'Third even longer item' },
      ],
      placeholder: 'Select an item',
    },
    leftIconName: 'mail',
    input: {
      placeholder: 'Input placeholder',
      label: 'Input label',
      helperText: 'Input helper text',
      errorMessage: 'Input error message',
    },
    rightMenu: {
      menuItems: [
        { id: 1, name: 'USD' },
        { id: 2, name: 'AUD' },
        { id: 3, name: 'EUR' },
      ],
      defaultItem: { id: 1, name: 'USD' },
    },
    isInvalid: true,
  },
  render: args => <Card input={<CardInput {...args}>CardInput</CardInput>} />,
};
