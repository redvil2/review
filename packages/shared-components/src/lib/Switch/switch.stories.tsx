import { Container, VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'Components / Switch',
  decorators: [
    Story => (
      <Container mt="40px" display="flex" flexWrap="nowrap" gap="4">
        <Story />
      </Container>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default = () => (
  <VStack spacing="24px">
    <Switch />
    <Switch isChecked onChange={text => console.log(text)} />
    <Switch isDisabled />
    <Switch isReadOnly />
  </VStack>
);

export const WithChecked: Story = {
  args: {
    isChecked: true,
  },
  render: args => <Switch {...args} />,
};

export const WithDisabled: Story = {
  args: {
    isDisabled: true,
  },
  render: args => <Switch {...args} />,
};

export const WithReadOnly: Story = {
  args: {
    isChecked: true,
    isReadOnly: true,
  },
  render: args => <Switch {...args} />,
};
