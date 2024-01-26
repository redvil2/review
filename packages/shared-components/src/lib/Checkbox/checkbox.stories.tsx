import { Container, VStack } from '@chakra-ui/react';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'Components / Checkbox',
  decorators: [
    Story => (
      <Container mt="40px" display="flex" flexWrap="nowrap" gap="4">
        <Story />
      </Container>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default = () => (
  <VStack spacing="24px">
    <Checkbox>default</Checkbox>
    <Checkbox isChecked onChange={text => console.log(text)}>
      isChecked
    </Checkbox>
    <Checkbox isDisabled>isDisabled</Checkbox>
    <Checkbox isReadOnly>isReadOnly</Checkbox>
    <Checkbox isInvalid isReadOnly>
      isInvalid
    </Checkbox>
  </VStack>
);

export const WithChecked: Story = {
  args: {
    isChecked: true,
  },
  render: args => <Checkbox {...args} />,
};

export const WithDisabled: Story = {
  args: {
    isDisabled: true,
  },
  render: args => <Checkbox {...args} />,
};

export const WithReadOnly: Story = {
  args: {
    isChecked: true,
    isReadOnly: true,
  },
  render: args => <Checkbox {...args} />,
};
